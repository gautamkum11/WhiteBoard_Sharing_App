import './App.css';
import Forms from './components/Forms';
import {Route, Routes} from "react-router-dom";
import Roompage from './pages/Roompage';
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import {toast, ToastContainer} from "react-toastify";

const server = "https://main--incredible-sundae-50b18a.netlify.app/";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

function App() {

  const [user,setuser] = useState(null);
  const [users,setusers] = useState([]);

  useEffect(() => {
    socket.on("UserIsJoined",(data) => {
      if(data.success)
      {
        console.log("user joined successfully");
        setusers(data.users);
      }
      else 
      {
        console.log("error");
      }
    })

    socket.on("allusers",data => {
      setusers(data);
    })

    socket.on("userjoinedmessage",data => {
      toast.info(`${data} joined the room`);
    })

    socket.on("userleftmessage",data => {
      toast.info(`${data} left the room`);
    })
  },[])

  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };


  return (
    <>
      <div className = "container">
        <ToastContainer />
        <Routes>
          <Route  path = "/" element = {<Forms uuid = {uuid} socket = {socket} setuser = {setuser} />} />
          <Route  path = "/:roomId" element = {<Roompage user = {user} socket = {socket} users = {users} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
