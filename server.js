const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { ActiveUsers } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatBot";
const activeUsers = new ActiveUsers();
console.log(activeUsers);

io.on("connection", (socket) => {
  socket.on("joinChat", ({ username }) => {
    io.emit("updateActiveUsers", activeUsers.userJoined(socket.id, username));

    socket.emit(
      "message",
      formatMessage(botName, `Welcome ${username} to Chat App!`)
    );

    socket.broadcast.emit(
      "message",
      formatMessage(botName, `${username} has joined the chat`)
    );

    socket.on("chatMessage", (msg) => {
      io.emit("message", formatMessage(username, msg));
    });

    socket.on("disconnect", () => {
      io.emit("updateActiveUsers", activeUsers.userLeft(socket.id));

      io.emit(
        "message",
        formatMessage(botName, `${username} has left the chat`)
      );
    });
  });
});

const PORT = 3000 || process.env.port;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
