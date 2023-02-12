const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const { formatMessage } = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const server = http.createServer(app);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

server.listen(8080, () => {
  console.log("Server is Running on port 8080...");
});

const io = socketio(server);

const botName = "ChatApp!";

//Run when client connects
io.on("connection", (socket) => {
  console.log("New client connected...");

  socket.on("joinroom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome the user
    socket.emit("message", formatMessage(botName, `Welcome to ChatApp! ${user.username}`));

    // Broadcast when user connects
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(botName, `${user.username} has Joined the Chat`));
  });

  // Listen for chatMessage
  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);

    // console.log(message);
    io.to(user.room).emit("message", formatMessage(user.username, message));
  });

  // Broadcast when client disconnect
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, `A user has left the Chat`));
  });
});

