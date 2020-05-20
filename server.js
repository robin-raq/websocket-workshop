const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

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

  // Welcome Message from server to client that's connecting
  socket.emit("message", "Welcome to TuneChat");

  // Broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  // Listen for new chatMessage and emit on receipt
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    io.emit("message", msg);
  });
});
