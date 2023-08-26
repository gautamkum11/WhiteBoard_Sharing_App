const express = require("express");
const app = express();

const server = require("http").createServer(app);
const {Server} = require("socket.io");
const {adduser, removeuser, getuser, getusersinroom} = require("./utils/users");

const io = new Server(server);

app.get("/",(req,res) => {
    res.send("whiteboard_sharing_app");
})

let roomIdglobal,imgURLglobal;

io.on("connection",(socket) => {
    socket.on("UserJoined",(data) => {
        const {name,roomID,userID,host,presenter} = data;
        roomIdglobal = roomID;
        socket.join(roomID);
        const users = adduser({name,roomID,userID,host,presenter,socketID : socket.id});
        socket.emit("UserIsJoined",{success : true, users});
        socket.broadcast.to(roomID).emit("userjoinedmessage",name);
        const alluser = getusersinroom(roomID);
        socket.broadcast.to(roomID).emit("allusers",alluser);
        socket.broadcast.to(roomID).emit("whiteboardDataResponse",{imgURL : imgURLglobal});
    })

    socket.on("whiteboardData",(data) => {
        // console.log(data);
        imgURLglobal == data;
        socket.broadcast.to(roomIdglobal).emit("whiteboardDataResponse",{imgURL : data});
    })

    socket.on("message", (data) => {
        const { message } = data;
        const user = getuser(socket.id);
        if (user) {
          socket.broadcast
            .to(roomIdglobal)
            .emit("messageResponse", { message, name: user.name });
        }
    });

    socket.on("disconnect",() => {
        const user = getuser(socket.id);
        if(user)
        {
            removeuser(socket.id);
            socket.broadcast.to(roomIdglobal).emit("userleftmessage",user.name);
        }
    })
})

const port = 5000;
server.listen(port, () => {
    console.log("Server is started...");
})