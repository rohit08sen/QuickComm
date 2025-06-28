import { Server } from "socket.io";
import http from "http";
import express from "express";
import { clearScreenDown } from "readline";

const app = express();
const server = http.createServer(app);

const io = new Server(server,
  {
    cors: {
      origin: ["http://localhost:5173"]
    }
  }
);

export function getRecieverSocketId(userId){
  return userSocketMap[userId]
}
//used to store online users
const userSocketMap = {};


io.on("connection", (socket) => {
  console.log("A User Conencted", socket.id)
  const userId = socket.handshake.query.userId
  if (userId) userSocketMap[userId] = socket.id;
  //it is used to send events to all the connected clients
  io.emit("getOnlineUsers",Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("A User DisConencted", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })
})
export {io,app,server}