const Result = require("../models/Result");
const User = require("../models/User");

// @desc    Save result
// @route   POST /api/result
// @access  Private
const saveResult = async (req, res) => {
  try {
    const {
      room,
      quiz,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      rank,
      timeTaken,
      answers,
    } = req.body;

    const result = await Result.create({
      room,
      quiz,
      user: req.user._id,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      rank,
      timeTaken,
      answers,
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        totalGamesPlayed: 1,
        totalScore: score,
        wins: rank === 1 ? 1 : 0,
      },
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user results
// @route   GET /api/result/my-results
// @access  Private
const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate("quiz", "title category")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get result by ID
// @route   GET /api/result/:id
// @access  Private
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("user", "username avatar")
      .populate("quiz", "title questions");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get leaderboard (global)
// @route   GET /api/result/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const leaderboard = await User.find()
      .select("username avatar totalScore totalGamesPlayed wins")
      .sort({ totalScore: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get quiz leaderboard
// @route   GET /api/result/leaderboard/:quizId
// @access  Public
const getQuizLeaderboard = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const results = await Result.find({ quiz: req.params.quizId })
      .populate("user", "username avatar")
      .sort({ score: -1, timeTaken: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveResult,
  getMyResults,
  getResultById,
  getLeaderboard,
  getQuizLeaderboard,
};
