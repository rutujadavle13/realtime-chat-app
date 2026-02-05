const username = localStorage.getItem("username");
const socket = io("http://localhost:3000");
let room = "general";

socket.emit("joinRoom", room, username);

socket.on("message", (msg) => {
  const div = document.createElement("div");
  div.classList.add("message");

  if (msg.sender === "System") {
    div.classList.add("system");
    div.innerText = msg.text;
  } else if (msg.sender === username) {
    div.classList.add("me");
    div.innerHTML = `<b>You:</b> ${msg.text || ""}`;
  } else {
    div.classList.add("user");
    div.innerHTML = `<b>${msg.sender}:</b> ${msg.text || ""}`;
  }

  if (msg.fileUrl) {
    div.innerHTML += `<br/><a href="${msg.fileUrl}" target="_blank">Download File</a>`;
  }

  document.getElementById("chat").appendChild(div);
});

async function sendMessage() {
  const text = document.getElementById("msg").value;
  const file = document.getElementById("fileInput").files[0];

  let fileUrl = "";

  // If file selected → upload first
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    fileUrl = data.fileUrl;
  }

  socket.emit("chatMessage", {
    sender: username,
    room: room,
    text: text,
    fileUrl: fileUrl,
  });

  document.getElementById("msg").value = "";
  document.getElementById("fileInput").value = "";
}
