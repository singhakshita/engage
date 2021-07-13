const express = require("express");
const socket = require("socket.io");
const app = express();

const mongoConnect = require("./modalServer/mongo").mongoConnect;
const asyncHelper = require("./modalServer/asynchelper");
const modal = require("./modalServer/modal");

app.use(express.static("public"));

app.use((req, res, next) => {
  //
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
// rest API router
app.use("/chats", asyncHelper.fetchByName);
app.use("/id", asyncHelper.fetchUserById);
app.use("/accounts", asyncHelper.accountsHandler);

mongoConnect(() => {
  const server = app.listen(3000);
  const io = socket(server);
  io.on("connection", (socket) => {
    socket.on("join", function (roomName) {
      let rooms = io.sockets.adapter.rooms;
      let room = rooms.get(roomName);
      if (room == undefined) {
        socket.join(roomName);
        socket.emit("created");
      } else if (room.size == 1) {
        socket.join(roomName);
        socket.emit("joined");
      } else {
        socket.join(roomName);
        socket.emit("joined");
      }
    });
    socket.on("reconnect", function (roomName) {
      let rooms = io.sockets.adapter.rooms;
      let room = rooms.get(roomName);
      if (room == undefined) {
        socket.join(roomName);
      } else if (room.size == 1) {
        socket.join(roomName);
      } else {
        socket.join(roomName);
        socket.emit("joined");
      }
    });
    socket.on("invite", (roomName, userName) => {
      socket.broadcast.to(roomName).emit("invite", userName, roomName);
    });
    socket.on("decline", (roomName, userName) => {
      socket.broadcast.to(roomName).emit("decline", userName);
    });
    socket.on("name", (roomName, userName) => {
      socket.broadcast.to(roomName).emit("name", userName);
      modal.addUser(userName, roomName);
    });
    socket.on("ready", function (roomName) {
      socket.broadcast.to(roomName).emit("ready");
      console.log("ready");
    });
    socket.on("message", (msg, roomName, name) => {
      socket.broadcast.to(roomName).emit("message", msg, roomName);
      modal.pushMsg(roomName, name, msg);
    });
    socket.on("candidate", function (candidate, roomName) {
      socket.broadcast.to(roomName).emit("candidate", candidate);
      console.log("candidate");
    });

    socket.on("offer", function (offer, roomName) {
      socket.broadcast.to(roomName).emit("offer", offer);
      console.log("offer");
    });

    socket.on("answer", function (answer, roomName) {
      socket.broadcast.to(roomName).emit("answer", answer);
      console.log("answer");
    });
    socket.on("leave", (roomName) => {
      socket.broadcast.to(roomName).emit("leave");
    });
  });
});
