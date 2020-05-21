// Manages what happens to users when they join and when they leave etc
const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat - find user and remove from users array
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get users in specified room
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}
module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
