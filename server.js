const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("setUserId", (userId) => {
    onlineUsers.set(socket.id, userId);

    io.emit("onlineUsers", Array.from(onlineUsers.values()));
  });

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", ({ roomId, messageData }) => {
    io.to(roomId).emit("receiveMessage", messageData);
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);

    io.emit("onlineUsers", Array.from(onlineUsers.values()));
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
