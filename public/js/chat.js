const socket = io();

const username = sessionStorage.getItem("username");
if (!username) window.location.href = `${window.location.origin}/index.html`;

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

socket.emit("joinChat", { username });

socket.on("message", (message) => {
  storeMessage(message);
  outputMessage(message);
});

socket.on("updateActiveUsers", (activeUsers) => {
  updateActiveUsersList(activeUsers);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

const storeMessage = ({ text, username, time }) => {
  const obj = {
    username: username,
    text: text,
    time: time,
  };
  if (username == "ChatBot") return;
  const chatHistory = JSON.parse(sessionStorage.getItem("chat"));
  chatHistory.push(obj);
  sessionStorage.setItem("chat", JSON.stringify(chatHistory));
};

const outputMessage = ({ text, username, time }) => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message");
  messageContainer.innerHTML = `<p class='meta'> 
  ${username}
  <span>${time}</span>
  </p>
  <p class='text'>${text}</p>
  `;
  document.querySelector(".chat-messages").appendChild(messageContainer);
};

document.addEventListener("DOMContentLoaded", () => {
  if (!sessionStorage.getItem("chat")) {
    sessionStorage.setItem("chat", JSON.stringify([]));
  }
  const chatHistory = JSON.parse(sessionStorage.getItem("chat"));
  for (let msg of chatHistory) {
    outputMessage(msg);
  }
});

const updateActiveUsersList = (activeUsers) => {
  const activeUsersList =
    document.getElementsByClassName("active-users-list")[0];
  activeUsersList.innerHTML = "";
  activeUsersList;
  for (let [id, username] of Object.entries(activeUsers)) {
    activeUsersList.innerHTML += `<li>${username}</li>`;
  }
};
