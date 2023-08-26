import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoomForm = ({uuid, socket, setuser}) => {

    const [roomID,setroomID] = useState(uuid());
    const [name,setname] = useState("");

    const navigate = useNavigate();

    const handlecreateroom = (e) => {
        e.preventDefault();
        const roomData = {
            name,
            roomID,
            userID : uuid(),
            host : true,
            presenter : true
        }
        setuser(roomData);
        navigate(`/${roomID}`);
        console.log(roomData);
        socket.emit("UserJoined",roomData);
    }

    return (
        <form className = "form col-md-12 mt-5">
            <div className = "form-group">
                <input type = "text" className = "form-control my-2" value = {name} onChange = {(e) => setname(e.target.value)} placeholder = "Enter your name" />
            </div>
            <div className = "form-group border">
                <div className = "input-group d-flex align-items-center justify-content-center">
                    <input type = "text" className = "form-control my-2 border-0" value = {roomID} disabled placeholder = "Generate Room code" />
                    <div className = "input-group-append">
                        <button className = "btn btn-primary btn-sm me-1" type = "button" onClick = {() => {setroomID(uuid())}} >Generate</button>
                        <button className = "btn btn-outline-danger btn-sm me-2" type = "button">copy</button>
                    </div>
                </div>
            </div>
            <button type = "submit" className = "mt-4 btn btn-primary btn-block form-control" onClick = {handlecreateroom}>Generate Room</button>
        </form>
    );
}

export default CreateRoomForm;