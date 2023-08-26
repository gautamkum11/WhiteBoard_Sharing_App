import { useEffect, useRef, useState } from "react";
import Whiteboard from "../../components/Whiteboard";
import Chat from "../../components/ChatBar";
import "./index.css";

const Roompage = ({user,socket, users}) => {

    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const [tool,settool] = useState("pencil");
    const [color,setcolor] = useState("#000000");
    const [elements,setelements] = useState([]);
    const [history, setHistory] = useState([]);
    const [usertab,setusertab] = useState(false);
    const [openedChatTab, setOpenedChatTab] = useState(false);

    const handleclearcanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setelements([]);
    }

    const undo = () => {
        setHistory((prevHistory) => [
          ...prevHistory,
          elements[elements.length - 1],
        ]);
        setelements((prevElements) =>
          prevElements.filter((ele, index) => index !== elements.length - 1)
        );
      };

    const redo = () => {
        setelements((prevElements) => [
            ...prevElements,
            history[history.length - 1],
        ]);
        setHistory((prevHistory) =>
            prevHistory.filter((ele, index) => index !== history.length - 1)
        );
    };

    return (
        <div className = "row">
            <button type = "button" className = "btn btn-dark"
            onClick = {() => setusertab(true)}
            style = {{
                display : "block",
                position : "absolute",
                top : "5%",
                left : "2%",
                height : "40px",
                width : "100px"
            }}>Users</button>
            <button
                type="button"
                className="btn btn-primary"
                style={{
                display: "block",
                position: "absolute",
                top: "5%",
                left: "10%",
                height: "40px",
                width: "100px",
                }}
                onClick={() => setOpenedChatTab(true)}
            >
                Chats
            </button>
            {usertab && (
                <div className = "position-fixed top-0 h-100 text-white bg-dark" style = {{width: "250px",left : "0%"}}>
                    <button type = "button" className = "btn btn-light btn-block w-100 mt-5" onClick = {() => setusertab(false)}>Close</button>
                    <div className = "w-100 mt-5 pt-5">
                        {
                            users.map((usr,index) => (
                                <p key = {index} className = "w-100 text-center my-2">
                                {usr.name} {user && user.userID === usr.userID && "(You)"}
                                </p>
                            ))
                        }
                    </div>
                </div>
            )}
            {openedChatTab && (
                <Chat setOpenedChatTab={setOpenedChatTab} socket={socket} />
            )}
            <h1 className= "text-center py-4">White Board Sharing App{" "}<span className ="text-primary">[Users Online : {users.length}]</span></h1>
            {user && user.presenter && (
                <div className = "col-md-10 mx-auto px-5 mb-3 d-flex align-items-center justify-conter-between">
                    <div className = "d-flex col-md-2 justify-content-between gap-1">
                        <div className = "d-flex gap-1 align-items-center">
                            <label htmlfor = "pencil">Pencil</label>
                            <input type = "radio" className = "mt-1" id = "pencil" name = "tool" checked={tool== "pencil"} value = "pencil" onChange = {(e) => settool(e.target.value)} />
                        </div>
                        <div className = "d-flex gap-1 align-items-center">
                            <label htmlfor = "line">Line</label>
                            <input type = "radio" className = "mt-1" id = "line" name = "tool" checked={tool== "line"} value = "line" onChange = {(e) => settool(e.target.value)} />
                        </div>
                        <div className = "d-flex gap-1 align-items-center">
                            <label htmlfor = "rect">Rectangle</label>
                            <input type = "radio" className = "mt-1" id = "rect" name = "tool" checked={tool== "rect"} value = "rect" onChange = {(e) => settool(e.target.value)} />
                        </div>
                    </div>
                    <div className = "col-md-3 mx-auto">
                        <div className = "d-flex align-items-center">
                            <label htmlFor = "color">Select Color:</label>
                            <input type = "color" id = "color" className = "mt-1 ms-3" value = {color} onChange = {(e) => setcolor(e.target.value)} />
                        </div>
                    </div>
                    <div className = "col-md-3 d-flex gap-2">
                        <button className = "btn btn-primary mt-1"
                        disabled={elements.length === 0}
                        onClick={() => undo()}
                        >Undo</button>
                        <button className = "btn btn-outline-primary mt-1"
                        disabled={history.length < 1}
                        onClick={() => redo()}
                        >Redo</button>
                    </div>
                    <div className = "col-md-2">
                        <button className = "btn btn-danger" onClick ={handleclearcanvas}>Clear Canvas</button>
                    </div>
                </div>
            )}
            <div className = "col-md-10 mx-auto mt-4 canvas-box">
                    <Whiteboard 
                    canvasRef = {canvasRef} 
                    ctxRef = {ctxRef} 
                    elements = {elements} 
                    setelements = {setelements} 
                    tool = {tool}
                    color = {color}
                    user = {user}
                    socket = {socket}
                    />
            </div>
        </div>
    );
}

export default Roompage