const socket = io();

// Catch message from server
socket.on("message", (message) => console.log(message));
