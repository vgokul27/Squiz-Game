import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  getFullQuiz,
  updateQuiz,
  deleteQuiz,
  getMyQuizzes,
} from "../controllers/quizController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);

// Private routes
router.get("/:id/full", protect, getFullQuiz);
router.get("/user/my-quizzes", protect, getMyQuizzes);

// Admin routes
router.post("/", protect, admin, createQuiz);
router.route("/:id").put(protect, updateQuiz).delete(protect, deleteQuiz);

export default router;
