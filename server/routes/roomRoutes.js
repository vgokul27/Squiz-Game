import express from "express";
import {
  createRoom,
  joinRoom,
  getRoomByCode,
  leaveRoom,
  startGame,
} from "../controllers/roomController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All room routes are protected
router.post("/create", protect, createRoom);
router.post("/join", protect, joinRoom);
router.get("/:roomCode", protect, getRoomByCode);
router.post("/:roomCode/leave", protect, leaveRoom);
router.post("/:roomCode/start", protect, startGame);

export default router;
