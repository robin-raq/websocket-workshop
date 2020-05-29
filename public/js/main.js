const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const chatChord = document.querySelector(".chord-btns");
const keyboard = document.querySelector("tone-keyboard");

//creates 4 instances of the Tone.Synth
let polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
let key = new Tone.AMSynth().toMaster();

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

  // Auto scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Catch note from server
socket.on("note", (note) => {
  key.triggerAttack(note.note);
  setTimeout(function () {
    key.triggerRelease();
  }, 1000);
});

// Catch chord from server
socket.on("chordMessage", (chordMsg) => {
  playChord(chordMsg);
});

// On message submit
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

// On key press
keyboard.addEventListener("noteon", (e) => {
  let notePlayed = e.detail.name;
  let msg = `played ${notePlayed}`;
  socket.emit("note", { note: notePlayed });
  socket.emit("chatMessage", msg);
});

// On chord submit
chatChord.addEventListener("click", (e) => {
  let selectedChord = e.target.id;
  let msg = `played a ${selectedChord}`;

  // Emit chord to server
  socket.emit("chordMessage", { chord: selectedChord });
  socket.emit("chatMessage", msg);
});

// Helper functions

// Display message on DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
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

function playChord(chordMsg) {
  if (chordMsg.chord === "sad🎶") {
    polySynth.triggerAttack(["E4", "G4", "B4"]);

    setTimeout(function () {
      polySynth.triggerRelease(["E4", "G4", "B4"]);
    }, 1000);
  } else if (chordMsg.chord === "happy🎶") {
    polySynth.triggerAttack(["C4", "E4", "G4", "B4"]);

    setTimeout(function () {
      polySynth.triggerRelease(["C4", "E4", "G4", "B4"]);
    }, 1000);
  } else {
    polySynth.triggerAttack(["C3", "D3", "F3"]);

    setTimeout(function () {
      polySynth.triggerRelease(["C3", "D3", "F3"]);
    }, 1000);
  }
}
