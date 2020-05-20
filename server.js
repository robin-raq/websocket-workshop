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
  console.log("New WS Connection...");

  // Broadcast Welcome Message from client to server
  socket.emit("message", "Welcome to TuneChat");
});
