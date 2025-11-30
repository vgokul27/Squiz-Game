import api from "./api";

export const roomService = {
  // Create room
  createRoom: async (roomData) => {
    const response = await api.post("/rooms/create", roomData);
    return response.data;
  },

  // Join room
  joinRoom: async (roomCode) => {
    const response = await api.post("/rooms/join", { roomCode });
    return response.data;
  },

  // Get room by code
  getRoomByCode: async (roomCode) => {
    const response = await api.get(`/rooms/${roomCode}`);
    return response.data;
  },

  // Leave room
  leaveRoom: async (roomCode) => {
    const response = await api.post(`/rooms/${roomCode}/leave`);
    return response.data;
  },

  // Start game
  startGame: async (roomCode) => {
    const response = await api.post(`/rooms/${roomCode}/start`);
    return response.data;
  },
};
