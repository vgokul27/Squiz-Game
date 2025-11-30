import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

// Create a new quiz (Manual)
export const createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      timeLimit,
      pointsPerQuestion,
      isPublic,
      questions,
    } = req.body;

    // Validate required fields
    if (!title || !category || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title, category, and at least one question are required",
      });
    }

    // Format questions with default values
    const formattedQuestions = questions.map((q) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      points: pointsPerQuestion || 10,
      timeLimit: q.timeLimit || timeLimit || 30,
    }));

    const quiz = await Quiz.create({
      title,
      description: description || "",
      category,
      difficulty: difficulty || "Medium",
      questions: formattedQuestions,
      createdBy: req.user._id,
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    console.error("Create quiz error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create quiz",
      error: error.message,
    });
  }
};

// Generate quiz with AI (Gemini)
export const generateAIQuiz = async (req, res) => {
  try {
    const { topic, category, difficulty, questionCount } = req.body;

    if (!topic || !category) {
      return res.status(400).json({
        success: false,
        message: "Topic and category are required",
      });
    }

    // TODO: Integrate with Google Gemini AI
    // For now, using mock data structure
    const prompt = `Generate a ${difficulty} difficulty quiz about "${topic}" in the ${category} category with ${questionCount} multiple choice questions. Each question should have 4 options and indicate the correct answer.`;

    console.log("AI Prompt:", prompt);

    // Mock AI response - Replace with actual Gemini API call
    const aiGeneratedQuestions = Array.from(
      { length: questionCount },
      (_, i) => ({
        question: `AI Generated Question ${i + 1} about ${topic}?`,
        options: [
          `Option A for ${topic}`,
          `Option B for ${topic}`,
          `Option C for ${topic}`,
          `Option D for ${topic}`,
        ],
        correctAnswer: Math.floor(Math.random() * 4),
        points: 10,
        timeLimit: 30,
      })
    );

    // Return generated quiz data (not saved yet)
    res.status(200).json({
      success: true,
      message: "Quiz generated successfully",
      quiz: {
        title: `${topic} Quiz`,
        description: `An AI-generated quiz about ${topic}`,
        category,
        difficulty,
        questions: aiGeneratedQuestions,
      },
    });
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate quiz",
      error: error.message,
    });
  }
};

// Save AI-generated quiz
export const saveAIQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, questions } = req.body;

    if (!title || !category || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz data",
      });
    }

    const quiz = await Quiz.create({
      title,
      description: description || "",
      category,
      difficulty: difficulty || "Medium",
      questions,
      createdBy: req.user._id,
      isPublic: true,
    });

    res.status(201).json({
      success: true,
      message: "AI-generated quiz saved successfully",
      quiz,
    });
  } catch (error) {
    console.error("Save AI quiz error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save quiz",
      error: error.message,
    });
  }
};

// Get all public quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;

    let filter = { isPublic: true };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const quizzes = await Quiz.find(filter)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    console.error("Get quizzes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
      error: error.message,
    });
  }
};

// Get quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "createdBy",
      "username"
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("Get quiz error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
      error: error.message,
    });
  }
};

// Get user's created quizzes
export const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    console.error("Get my quizzes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
      error: error.message,
    });
  }
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check if user is the creator
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this quiz",
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Delete quiz error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
      error: error.message,
    });
  }
};
