const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

// Initialize and run express server
const app = express();
const server = http.createServer(app);
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Set up static folder
app.use(express.static(path.join(__dirname, "public")));

// Initialize socket, pass in server and run when client connects
const io = socketio(server);
io.on("connection", (socket) => {
  //Logs new connection on server
  console.log("New WS Connection...");

  socket.on("joinRoom", ({ username, room }) => {
    // creates userObj calling userJoin function the joins specified room
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome Message from server to client that's connecting
    socket.emit("message", formatMessage("ChatBot", "Welcome to TuneChat"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("ChatBot", `${user.username} has joined the chat`)
      );

    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for new chatMessage and emit on receipt
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(msg);
    io.to(user.room).emit("message", formatMessage(`${user.username}`, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("ChatBot ", `${user.username} has left the chat`)
      );
      //Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
