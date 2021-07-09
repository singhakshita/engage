const express = require("express");
const socket = require("socket.io");
const app = express();

const mongoConnect = require("./mongo").mongoConnect;
const asyncHelper = require("./asynchelper");
const modal = require("./modal");
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
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

    socket.on("name", (roomName, userName) => {
      socket.broadcast.to(roomName).emit("name", userName);
      modal.addUser(userName, roomName);
    });
    socket.on("ready", function (roomName) {
      socket.broadcast.to(roomName).emit("ready");
    });
    socket.on("message", (msg, roomName, name) => {
      socket.broadcast.to(roomName).emit("message", msg, roomName);
      modal.pushMsg(roomName, name, msg);
    });
    socket.on("candidate", function (candidate, roomName) {
      socket.broadcast.to(roomName).emit("candidate", candidate);
    });

    socket.on("offer", function (offer, roomName) {
      socket.broadcast.to(roomName).emit("offer", offer);
    });

    socket.on("answer", function (answer, roomName) {
      socket.broadcast.to(roomName).emit("answer", answer);
    });
    socket.on("leave", (roomName) => {
      socket.broadcast.to(roomName).emit("leave");
    });
  });
});
