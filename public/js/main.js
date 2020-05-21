const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io();

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join chatroom
socket.emit("joinRoom", { username, room });

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

// Helper function to display message on DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
					<p class="text"> ${message.text} </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
