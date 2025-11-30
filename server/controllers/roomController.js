import Room from "../models/Room.js";
import Quiz from "../models/Quiz.js";
import { generateRoomCode } from "../utils/helpers.js";

// @desc    Create new room
// @route   POST /api/room/create
// @access  Private
export const createRoom = async (req, res) => {
  try {
    const { quizId, maxPlayers } = req.body;

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
    let roomExists = true;

    while (roomExists) {
      roomCode = generateRoomCode();
      const existingRoom = await Room.findOne({
        roomCode,
        status: { $ne: "finished" },
      });
      if (!existingRoom) {
        roomExists = false;
      }
    }

    // Create room
    const room = await Room.create({
      roomCode,
      host: req.user._id,
      quiz: quizId,
      maxPlayers: maxPlayers || 10,
      players: [
        {
          userId: req.user._id,
          username: req.user.username,
          isReady: true,
        },
      ],
    });

    const populatedRoom = await Room.findById(room._id)
      .populate("host", "username avatar")
      .populate("quiz", "title description category difficulty questions");

    res.status(201).json({
      success: true,
      data: populatedRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Join room
// @route   POST /api/room/join
// @access  Private
export const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;

    const room = await Room.findOne({ roomCode, status: "waiting" })
      .populate("host", "username avatar")
      .populate("quiz", "title description category difficulty");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found or already started",
      });
    }

    // Check if room is full
    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({
        success: false,
        message: "Room is full",
      });
    }

    // Check if user already in room
    const alreadyJoined = room.players.some(
      (player) => player.userId.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.json({
        success: true,
        data: room,
        message: "Already in room",
      });
    }

    // Add player to room
    room.players.push({
      userId: req.user._id,
      username: req.user.username,
      isReady: false,
    });

    await room.save();

    res.json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get room details
// @route   GET /api/room/:roomCode
// @access  Private
export const getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findOne({ roomCode: req.params.roomCode })
      .populate("host", "username avatar")
      .populate("quiz", "title description category difficulty questions")
      .populate("players.userId", "username avatar");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Leave room
// @route   POST /api/room/:roomCode/leave
// @access  Private
export const leaveRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomCode: req.params.roomCode });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Remove player from room
    room.players = room.players.filter(
      (player) => player.userId.toString() !== req.user._id.toString()
    );

    // If host leaves and room is waiting, delete room
    if (
      room.host.toString() === req.user._id.toString() &&
      room.status === "waiting"
    ) {
      await room.deleteOne();
      return res.json({
        success: true,
        message: "Room deleted as host left",
      });
    }

    // If no players left, delete room
    if (room.players.length === 0) {
      await room.deleteOne();
      return res.json({
        success: true,
        message: "Room deleted - no players left",
      });
    }

    await room.save();

    res.json({
      success: true,
      message: "Left room successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get active rooms
// @route   GET /api/room/active
// @access  Public
export const getActiveRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "waiting" })
      .populate("host", "username avatar")
      .populate("quiz", "title category difficulty")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
