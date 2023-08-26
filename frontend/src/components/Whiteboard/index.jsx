import { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs";

const roughGenerator = rough.generator();

const Whiteboard = ({
    canvasRef,ctxRef,elements,setelements,tool,color,user,socket
}) => {

    const [img,setimg] = useState(null);

    useEffect(() => {
        socket.on("whiteboardDataResponse",(data) => {
            console.log(data);
            setimg(data.imgURL);
        })
    },[]);

    if(!user?.presenter) {
        return (
            <div
            className = "border border-dark border-3 h-100 w-100 overflow-hidden">
            <img src = {img} alt = "white board image showing by presenter"style = {{height : window.innerHeight*2, width : "285%"}}></img>
            </div> 
        );
    }

    const [isDrawing,setisDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = window.innerHeight * 2;
        canvas.width = window.innerWidth *2;
        const ctx = canvas.getContext("2d");

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctxRef.current = ctx;
    },[]);

    useEffect(() => {
        ctxRef.current.strokeStyle = color;
    },[color]);

    useLayoutEffect(() => {
        const roughcanvas = rough.canvas(canvasRef.current);
        
        if (elements.length > 0) {
            ctxRef.current.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );
        }
        
        elements.forEach(element => {
            if(element.type === "rect")
            {
                roughcanvas.draw(
                    roughGenerator.rectangle(
                        element.offsetX,
                        element.offsetY,
                        element.width,
                        element.height,
                        {
                            stroke : element.stroke,
                            strokeWidth : 5,
                            roughness : 0
                        }
                    )
                );
            }
            if(element.type === "line")
            {
                roughcanvas.draw(
                    roughGenerator.line(
                        element.offsetX,
                        element.offsetY,
                        element.width,
                        element.height,
                        {
                            stroke : element.stroke,
                            strokeWidth : 5,
                            roughness : 0
                        }
                    )
                );
            }
            else if(element.type === "pencil")
            {
                roughcanvas.linearPath(element.path,{
                    stroke : element.stroke,
                    strokeWidth : 5,
                    roughness : 0
                });
            }
        });

        const canvasimage = canvasRef.current.toDataURL();
        socket.emit("whiteboardData",canvasimage);

    },[elements]);

    const handlemousedown = (e) => {
        const {offsetX,offsetY} = e.nativeEvent;
        
        if(tool === "pencil")
        {
            setelements((prevelements) => [
                ...prevelements,{
                    type : "pencil",
                    offsetX,
                    offsetY,
                    path : [[offsetX,offsetY]],
                    stroke : color,
                },
            ]);
        }
        else if(tool === "line")
        {
            setelements((prevelements) => [
                ...prevelements,{
                    type : "line",
                    offsetX,
                    offsetY,
                    width : offsetX,
                    height : offsetY,
                    stroke : color,
                },
            ]);
        }
        else if(tool === "rect")
        {
            setelements((prevelements) => [
                ...prevelements,{
                    type : "rect",
                    offsetX,
                    offsetY,
                    width : 0,
                    height : 0,
                    stroke : color,
                },
            ]);
        }
        setisDrawing(true);
    };

    const handlemousemove = (e) => {
        const {offsetX,offsetY} = e.nativeEvent;
        if(isDrawing)
        {

            if(tool === "pencil")
            {
                const {path} = elements[elements.length-1];
                const newPath = [...path,[offsetX,offsetY]];

                setelements((prevelements) => 
                    prevelements.map((ele,index) => {
                        if(index == elements.length-1)
                        {
                            return {...ele,path : newPath};
                        }else 
                        {
                            return ele;
                        }
                    })
                );
            }
            else if(tool === "line")
            {
                setelements((prevelements) => 
                    prevelements.map((ele,index) => {
                        if(index === elements.length-1)
                        {
                            return {...ele,width : offsetX,height: offsetY};
                        }else 
                        {
                            return ele;
                        }
                    })
                );
            }
            else if(tool === "rect")
            {
                setelements((prevelements) => 
                    prevelements.map((ele,index) => {
                        if(index === elements.length-1)
                        {
                            return {...ele,
                                width : offsetX-ele.offsetX,
                                height: offsetY-ele.offsetY,
                            };
                        }else 
                        {
                            return ele;
                        }
                    })
                );
            }
        }
    };

    const handlemouseup = (e) => {
        setisDrawing(false);
    };

    return (
        <div
        onMouseDown = {handlemousedown}
        onMouseMove = {handlemousemove}
        onMouseUp = {handlemouseup}
        style={{ height: "500px" }}
        className = "border border-dark border-3 h-100 w-100 overflow-hidden">
        <canvas ref = {canvasRef}></canvas>
        </div>
    );
}

export default Whiteboard;