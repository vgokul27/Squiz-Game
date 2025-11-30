import { Server } from "socket.io";

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`👥 Client ${socket.id} joined room: ${roomId}`);

      // Notify room about new player
      io.to(roomId).emit("playerJoined", {
        playerId: socket.id,
        timestamp: new Date(),
      });
    });

    socket.on("submitAnswer", (data) => {
      console.log(`📝 Answer submitted in room ${data.roomId}`);
      socket.to(data.roomId).emit("receiveAnswer", data);
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`👋 Client ${socket.id} left room: ${roomId}`);

      // Notify room about player leaving
      io.to(roomId).emit("playerLeft", {
        playerId: socket.id,
        timestamp: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
};

export default initSocket;
