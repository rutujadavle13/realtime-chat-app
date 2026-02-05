const Message = require("./models/Message");

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("joinRoom", (room, username) => {
      socket.join(room);
      io.to(room).emit("message", {
        sender: "System",
        text: `${username} joined`,
      });
    });

    socket.on("chatMessage", async (data) => {
      const msg = await Message.create(data);
      io.to(data.room).emit("message", msg);
    });
  });
};
