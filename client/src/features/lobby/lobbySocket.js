import { getSocket } from "../../services/socket";

export const lobbySocket = {
  // Join room
  joinRoom: (roomCode, userId) => {
    const socket = getSocket();
    socket.emit("join-room", { roomCode, userId });
  },

  // Player ready
  setPlayerReady: (roomCode, userId) => {
    const socket = getSocket();
    socket.emit("player-ready", { roomCode, userId });
  },

  // Leave room
  leaveRoom: (roomCode, userId) => {
    const socket = getSocket();
    socket.emit("leave-room", { roomCode, userId });
  },

  // Listen to room joined
  onRoomJoined: (callback) => {
    const socket = getSocket();
    socket.on("room-joined", callback);
  },

  // Listen to player joined
  onPlayerJoined: (callback) => {
    const socket = getSocket();
    socket.on("player-joined", callback);
  },

  // Listen to player left
  onPlayerLeft: (callback) => {
    const socket = getSocket();
    socket.on("player-left", callback);
  },

  // Listen to player ready update
  onPlayerReadyUpdate: (callback) => {
    const socket = getSocket();
    socket.on("player-ready-update", callback);
  },

  // Listen to game starting
  onGameStarting: (callback) => {
    const socket = getSocket();
    socket.on("game-starting", callback);
  },

  // Listen to room closed
  onRoomClosed: (callback) => {
    const socket = getSocket();
    socket.on("room-closed", callback);
  },

  // Remove all listeners
  removeAllListeners: () => {
    const socket = getSocket();
    socket.off("room-joined");
    socket.off("player-joined");
    socket.off("player-left");
    socket.off("player-ready-update");
    socket.off("game-starting");
    socket.off("room-closed");
  },
};

export default lobbySocket;
