const express = require("express");
const router = express.Router();
const {
  saveResult,
  getMyResults,
  getResultById,
  getLeaderboard,
  getQuizLeaderboard,
} = require("../controllers/resultController");
const { protect } = require("../middlewares/authMiddleware");

// Public routes
router.get("/leaderboard", getLeaderboard);
router.get("/leaderboard/:quizId", getQuizLeaderboard);

// Private routes
router.post("/", protect, saveResult);
router.get("/my-results", protect, getMyResults);
router.get("/:id", protect, getResultById);

module.exports = router;
