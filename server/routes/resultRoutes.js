import express from "express";
import {
  saveResult,
  getMyResults,
  getResultById,
  getLeaderboard,
  getQuizLeaderboard,
} from "../controllers/resultController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/leaderboard", getLeaderboard);
router.get("/leaderboard/:quizId", getQuizLeaderboard);

// Private routes
router.post("/", protect, saveResult);
router.get("/my-results", protect, getMyResults);
router.get("/:id", protect, getResultById);

export default router;
