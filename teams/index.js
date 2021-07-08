const database = require("./serverDatabase");
const bodyParser = require("body-parser");
const express = require("express");
const socket = require("socket.io");
const app = express();
const querystring = require("querystring");

let server = app.listen(3000, function () {});

app.use(express.static("public"));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
app.use("/chats", (req, res, next) => {
  const name = req.query.name;
  const data = database.getdata(name);
  res.json(data);
});
app.use("/id", (req, res, next) => {
  const id = req.query.id;
  const data = database.getdataById(id);
  res.json(data);
});
app.use("/accounts", (req, res, next) => {
  const id = req.query.id;
  const password = req.query.password;
  const response = database.addAccounts(id, password);
  res.json(response);
});

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
    database.editUser(userName, roomName);
  });
  socket.on("ready", function (roomName) {
    socket.broadcast.to(roomName).emit("ready");
  });
  socket.on("message", (msg, roomName, name) => {
    socket.broadcast.to(roomName).emit("message", msg, roomName);
    database.pushMessages(msg, roomName, name);
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
