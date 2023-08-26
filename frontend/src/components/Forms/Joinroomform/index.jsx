import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoomForm = ({uuid,socket,setuser}) => {

    const [roomID,setroomID] = useState("");
    const [name,setname] = useState("");

    const navigate = useNavigate();

    const handlejoinroom = (e) => {
        e.preventDefault();
        const roomData = {
            name,
            roomID,
            userID : uuid(),
            host : false,
            presenter : false
        }
        setuser(roomData);
        navigate(`/${roomID}`);
        console.log(roomData);
        socket.emit("UserJoined",roomData);
    }

    return (
        <form className = "form col-md-12 mt-5">
            <div className = "form-group">
                <input type = "text" className = "form-control my-2" value = {name} onChange = {(e) => {setname(e.target.value)}} placeholder = "Enter your name" />
            </div>
            <div className = "form-group ">
                    <input type = "text" className = "form-control my-2" value = {roomID} onChange = {(e) => {setroomID(e.target.value)}} placeholder = "Enter Room code" />
            </div>
            <button type = "submit" className = "mt-4 btn btn-block form-control btn-primary" onClick = {handlejoinroom}>Join Room</button>
        </form>
    );
}

export default JoinRoomForm;