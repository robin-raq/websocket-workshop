const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const socket = io();

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users from server
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Catch message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// On message Submit
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Grab text input
  const msg = event.target.elements.msg.value;
  // console.log(msg);

  // Emit message to the server
  socket.emit("chatMessage", msg);

  // Clear input
  event.target.elements.msg.value = "";
  event.target.elements.msg.focus();
});

// Helper functions

// Display message on DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
					<p class="text"> ${message.text} </p>`;
  chatMessages.appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}
