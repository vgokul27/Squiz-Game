import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { quizService } from "../services/quizService";
import {
  BookOpen,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Globe,
  Lock,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

const QuizCreate = () => {
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "medium",
    timeLimit: 30,
    pointsPerQuestion: 10,
    isPublic: true,
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      timeLimit: 30,
    },
  ]);

  const categories = [
    "General Knowledge",
    "Science",
    "Mathematics",
    "History",
    "Geography",
    "Sports",
    "Technology",
    "Entertainment",
    "Literature",
    "Arts",
  ];

  const difficulties = [
    { value: "easy", label: "Easy", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "hard", label: "Hard", color: "bg-red-500" },
  ];

  // Add new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        timeLimit: 30,
      },
    ]);
  };

  // Remove question
  const removeQuestion = (id) => {
    if (questions.length === 1) {
      toast.error("Quiz must have at least one question");
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Update question
  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  // Update option
  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  // Validate quiz
  const validateQuiz = () => {
    if (!quizData.title.trim()) {
      toast.error("Please enter a quiz title");
      return false;
    }
    if (!quizData.category) {
      toast.error("Please select a category");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return false;
      }
      if (q.options.some((opt) => !opt.trim())) {
        toast.error(`Question ${i + 1} has empty options`);
        return false;
      }
    }
    return true;
  };

  // Save quiz
  const handleSave = async () => {
    if (!validateQuiz()) return;

    const loadingToast = toast.loading("Creating quiz...");

    try {
      // TODO: API call to save quiz
      const quizPayload = {
        ...quizData,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          timeLimit: q.timeLimit,
        })),
      };

      console.log("Quiz payload:", quizPayload);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Quiz created successfully!", { id: loadingToast });
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to create quiz", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-dark-500 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-neon">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Create Quiz</h1>
              <p className="text-dark-500">
                Build your custom quiz with multiple choice questions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quiz Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-neon mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Globe className="w-5 h-5 text-primary-500" />
            <span>Quiz Details</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-500 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                value={quizData.title}
                onChange={(e) =>
                  setQuizData({ ...quizData, title: e.target.value })
                }
                placeholder="Enter quiz title"
                className="w-full px-4 py-3 bg-dark-100 border border-dark-50 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-500 mb-2">
                Description
              </label>
              <textarea
                value={quizData.description}
                onChange={(e) =>
                  setQuizData({ ...quizData, description: e.target.value })
                }
                placeholder="Brief description of your quiz"
                rows={3}
                className="w-full px-4 py-3 bg-dark-100 border border-dark-50 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-dark-500 mb-2">
                Category *
              </label>
              <div className="relative">
                <select
                  value={quizData.category}
                  onChange={(e) =>
                    setQuizData({ ...quizData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-dark-100 border border-dark-50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer pr-10"
                >
                  <option value="" className="bg-dark-100">
                    Select category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-dark-100">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-dark-500 mb-2">
                Difficulty
              </label>
              <div className="flex space-x-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() =>
                      setQuizData({ ...quizData, difficulty: diff.value })
                    }
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      quizData.difficulty === diff.value
                        ? `${diff.color} text-white shadow-lg`
                        : "bg-dark-100 text-dark-500 hover:bg-dark-50 border border-dark-50"
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-medium text-dark-500 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Time per Question (seconds)
              </label>
              <input
                type="number"
                value={quizData.timeLimit}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    timeLimit: Number(e.target.value),
                  })
                }
                min={10}
                max={120}
                className="w-full px-4 py-3 bg-dark-100 border border-dark-50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            {/* Points */}
            <div>
              <label className="block text-sm font-medium text-dark-500 mb-2">
                <Trophy className="w-4 h-4 inline mr-1" />
                Points per Question
              </label>
              <input
                type="number"
                value={quizData.pointsPerQuestion}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    pointsPerQuestion: Number(e.target.value),
                  })
                }
                min={5}
                max={100}
                className="w-full px-4 py-3 bg-dark-100 border border-dark-50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            {/* Visibility */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={quizData.isPublic}
                  onChange={(e) =>
                    setQuizData({ ...quizData, isPublic: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-2 border-dark-500 bg-dark-100 text-primary-500 focus:ring-2 focus:ring-primary-500 cursor-pointer transition-all"
                />
                <span className="text-white group-hover:text-primary-400 transition-colors">
                  {quizData.isPublic ? (
                    <Globe className="w-4 h-4 inline mr-2 text-green-500" />
                  ) : (
                    <Lock className="w-4 h-4 inline mr-2 text-red-500" />
                  )}
                  Make this quiz public (anyone can participate)
                </span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Questions */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Questions ({questions.length})
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addQuestion}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Question</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="card-neon"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">
                    Question {index + 1}
                  </h3>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Question Text */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark-500 mb-2">
                    Question *
                  </label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) =>
                      updateQuestion(q.id, "question", e.target.value)
                    }
                    placeholder="Enter your question"
                    className="w-full px-4 py-3 bg-dark-100 border border-dark-50 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {q.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctAnswer === optIndex}
                        onChange={() =>
                          updateQuestion(q.id, "correctAnswer", optIndex)
                        }
                        className="w-4 h-4 text-primary-500 border-dark-500 focus:ring-primary-500 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          updateOption(q.id, optIndex, e.target.value)
                        }
                        placeholder={`Option ${optIndex + 1}`}
                        className="flex-1 px-4 py-2 bg-dark-100 border border-dark-50 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      />
                      {q.correctAnswer === optIndex && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Time Limit */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-dark-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time Limit:
                  </label>
                  <input
                    type="number"
                    value={q.timeLimit}
                    onChange={(e) =>
                      updateQuestion(q.id, "timeLimit", Number(e.target.value))
                    }
                    min={10}
                    max={120}
                    className="w-24 px-3 py-2 bg-dark-100 border border-dark-50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                  <span className="text-dark-500 text-sm">seconds</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex-1 flex items-center justify-center space-x-2"
          >
            <XCircle className="w-5 h-5" />
            <span>Cancel</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="btn-primary flex-1 flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Create Quiz</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizCreate;
