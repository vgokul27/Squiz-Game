import express from "express";
import {
  createRoom,
  joinRoom,
  getRoomDetails,
  leaveRoom,
  getActiveRooms,
} from "../controllers/roomController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/active", getActiveRooms);

// Private routes
router.post("/create", protect, createRoom);
router.post("/join", protect, joinRoom);
router.get("/:roomCode", protect, getRoomDetails);
router.post("/:roomCode/leave", protect, leaveRoom);

export default router;
