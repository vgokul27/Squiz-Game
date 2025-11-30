import express from "express";
import {
  createQuiz,
  generateAIQuiz,
  saveAIQuiz,
  getAllQuizzes,
  getQuizById,
  getMyQuizzes,
  deleteQuiz,
} from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);

// Protected routes
router.post("/create", protect, createQuiz);
router.post("/ai-generate", protect, generateAIQuiz);
router.post("/ai-save", protect, saveAIQuiz);
router.get("/user/my-quizzes", protect, getMyQuizzes);
router.delete("/:id", protect, deleteQuiz);

export default router;
