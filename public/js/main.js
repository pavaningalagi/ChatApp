const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");

// Get username and room from URL
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});


const socket = io("http://localhost:8080/", { transports: ["websocket"] });

// Join ChatRoom
socket.emit("joinroom",{username, room});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll Down
  chatMessage.scrollTop= chatMessage.scrollHeight;
});

// Message submit
chatForm.onsubmit = (e) => {
  e.preventDefault();

  // Get message text
  const msg = chatForm.msg.value;

  // console.log(msg);
  // Emit message to server
  socket.emit("chatMessage", msg);

  //clear inputs
  chatForm.msg.value = "";
  chatForm.msg.focus();
};

// Output message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
                   <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
};
