import Room from "../models/Room.js";
import Quiz from "../models/Quiz.js";
import crypto from "crypto";

// Generate unique room code
const generateRoomCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const { quizId, maxPlayers, isPrivate, waitingTime } = req.body;

    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID is required",
      });
    }

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Generate unique room code
    let roomCode;
    let isUnique = false;
    while (!isUnique) {
      roomCode = generateRoomCode();
      const existingRoom = await Room.findOne({ roomCode });
      if (!existingRoom) {
        isUnique = true;
      }
    }

    // Create room
    const room = await Room.create({
      roomCode,
      host: req.user._id,
      quiz: quizId,
      maxPlayers: maxPlayers || 10,
      status: "waiting",
      players: [
        {
          userId: req.user._id,
          username: req.user.username,
          score: 0,
          isReady: true,
        },
      ],
    });

    await room.populate("quiz", "title category difficulty questions");
    await room.populate("host", "username");

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
      roomCode,
    });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create room",
      error: error.message,
    });
  }
};

// Join a room
export const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;

    if (!roomCode) {
      return res.status(400).json({
        success: false,
        message: "Room code is required",
      });
    }

    const room = await Room.findOne({
      roomCode: roomCode.toUpperCase(),
    })
      .populate("quiz", "title category difficulty questions")
      .populate("host", "username");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if room is full
    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({
        success: false,
        message: "Room is full",
      });
    }

    // Check if already in room
    const alreadyInRoom = room.players.some(
      (p) => p.userId.toString() === req.user._id.toString()
    );

    if (alreadyInRoom) {
      return res.status(200).json({
        success: true,
        message: "Already in room",
        room,
      });
    }

    // Add player to room
    room.players.push({
      userId: req.user._id,
      username: req.user.username,
      score: 0,
      isReady: false,
    });

    await room.save();

    res.status(200).json({
      success: true,
      message: "Joined room successfully",
      room,
    });
  } catch (error) {
    console.error("Join room error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to join room",
      error: error.message,
    });
  }
};

// Get room by code
export const getRoomByCode = async (req, res) => {
  try {
    const { roomCode } = req.params;

    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() })
      .populate("quiz")
      .populate("host", "username")
      .populate("players.userId", "username");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Get room error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch room",
      error: error.message,
    });
  }
};

// Leave room
export const leaveRoom = async (req, res) => {
  try {
    const { roomCode } = req.params;

    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Remove player from room
    room.players = room.players.filter(
      (p) => p.userId.toString() !== req.user._id.toString()
    );

    // If room is empty, delete it
    if (room.players.length === 0) {
      await room.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Room deleted (no players left)",
      });
    }

    // If host left, assign new host
    if (room.host.toString() === req.user._id.toString()) {
      room.host = room.players[0].userId;
    }

    await room.save();

    res.status(200).json({
      success: true,
      message: "Left room successfully",
    });
  } catch (error) {
    console.error("Leave room error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to leave room",
      error: error.message,
    });
  }
};

// Start game
export const startGame = async (req, res) => {
  try {
    const { roomCode } = req.params;

    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if user is host
    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only host can start the game",
      });
    }

    room.status = "in-progress";
    room.startTime = new Date();
    await room.save();

    res.status(200).json({
      success: true,
      message: "Game started",
      room,
    });
  } catch (error) {
    console.error("Start game error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start game",
      error: error.message,
    });
  }
};
