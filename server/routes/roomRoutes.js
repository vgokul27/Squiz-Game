const express = require("express");
const router = express.Router();
const {
  createRoom,
  joinRoom,
  getRoomDetails,
  leaveRoom,
  getActiveRooms,
} = require("../controllers/roomController");
const { protect } = require("../middlewares/authMiddleware");

// Public routes
router.get("/active", getActiveRooms);

// Private routes
router.post("/create", protect, createRoom);
router.post("/join", protect, joinRoom);
router.get("/:roomCode", protect, getRoomDetails);
router.post("/:roomCode/leave", protect, leaveRoom);

module.exports = router;
