const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  getFullQuiz,
  updateQuiz,
  deleteQuiz,
  getMyQuizzes,
} = require("../controllers/quizController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);

// Private routes
router.get("/:id/full", protect, getFullQuiz);
router.get("/user/my-quizzes", protect, getMyQuizzes);

// Admin routes
router.post("/", protect, admin, createQuiz);
router.route("/:id").put(protect, updateQuiz).delete(protect, deleteQuiz);

module.exports = router;
