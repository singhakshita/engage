const express = require("express");
const socket = require("socket.io");
const app = express();

let server = app.listen(3000, function () {});

app.use(express.static("public"));

let io = socket(server);

io.on("connection", function (socket) {
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
  });
  socket.on("ready", function (roomName) {
    socket.broadcast.to(roomName).emit("ready");
  });
  socket.on("message", (msg, roomName) => {
    socket.broadcast.to(roomName).emit("message", msg);
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
    socket.leave(roomName);
    socket.broadcast.to(roomName).emit("leave");
  });
});
