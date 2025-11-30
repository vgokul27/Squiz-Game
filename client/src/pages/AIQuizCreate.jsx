import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { quizService } from "../services/quizService";
import {
  Sparkles,
  ArrowLeft,
  Wand2,
  BookOpen,
  Brain,
  Zap,
  CheckCircle,
  Loader,
  Smile,
  ThumbsUp,
  Flame,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

const AIQuizCreate = () => {
  const navigate = useNavigate();

  const [generating, setGenerating] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    topic: "",
    category: "",
    difficulty: "medium",
    questionCount: 10,
  });

  const [generatedQuiz, setGeneratedQuiz] = useState(null);

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
    "Business",
    "Politics",
  ];

  const difficulties = [
    {
      value: "easy",
      label: "Easy",
      color: "bg-green-500",
      borderColor: "border-green-500",
      bgLight: "bg-green-500/20",
      icon: Smile,
    },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-500",
      borderColor: "border-yellow-500",
      bgLight: "bg-yellow-500/20",
      icon: ThumbsUp,
    },
    {
      value: "hard",
      label: "Hard",
      color: "bg-red-500",
      borderColor: "border-red-500",
      bgLight: "bg-red-500/20",
      icon: Flame,
    },
  ];

  const questionCounts = [5, 10, 15, 20];

  // Generate quiz with AI
  const handleGenerate = async () => {
    if (!aiSettings.topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    if (!aiSettings.category) {
      toast.error("Please select a category");
      return;
    }

    setGenerating(true);
    const loadingToast = toast.loading("AI is creating your quiz...");

    try {
      // TODO: API call to Gemini AI
      const prompt = `Generate a ${aiSettings.difficulty} difficulty quiz about "${aiSettings.topic}" in the ${aiSettings.category} category with ${aiSettings.questionCount} multiple choice questions. Each question should have 4 options and indicate the correct answer.`;

      console.log("AI Prompt:", prompt);

      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock generated quiz
      const mockQuiz = {
        title: `${aiSettings.topic} Quiz`,
        description: `An AI-generated quiz about ${aiSettings.topic}`,
        category: aiSettings.category,
        difficulty: aiSettings.difficulty,
        questions: Array.from({ length: aiSettings.questionCount }, (_, i) => ({
          id: i + 1,
          question: `Sample question ${i + 1} about ${aiSettings.topic}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: Math.floor(Math.random() * 4),
          timeLimit: 30,
        })),
      };

      setGeneratedQuiz(mockQuiz);
      toast.success("Quiz generated successfully!", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to generate quiz", { id: loadingToast });
      console.error("AI Generation error:", error);
    } finally {
      setGenerating(false);
    }
  };

  // Save generated quiz
  const handleSave = async () => {
    const loadingToast = toast.loading("Saving quiz...");

    try {
      // TODO: API call to save quiz
      console.log("Saving quiz:", generatedQuiz);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Quiz saved successfully!", { id: loadingToast });
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to save quiz", { id: loadingToast });
    }
  };

  // Regenerate quiz
  const handleRegenerate = () => {
    setGeneratedQuiz(null);
    handleGenerate();
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
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-neon">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                AI Quiz Generator
              </h1>
              <p className="text-dark-500">
                Let AI create a custom quiz based on your preferences
              </p>
            </div>
          </div>
        </motion.div>

        {!generatedQuiz ? (
          // Configuration Form
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-neon"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-white">
                Configure Your Quiz
              </h2>
            </div>

            <div className="space-y-6">
              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-dark-500 mb-2">
                  Topic / Subject *
                </label>
                <input
                  type="text"
                  value={aiSettings.topic}
                  onChange={(e) =>
                    setAiSettings({ ...aiSettings, topic: e.target.value })
                  }
                  placeholder="e.g., World War II, Quantum Physics, JavaScript..."
                  className="w-full px-4 py-3 bg-dark-100 border border-dark-50 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  disabled={generating}
                />
                <p className="text-xs text-dark-500 mt-1">
                  Be specific for better results
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-dark-500 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <select
                    value={aiSettings.category}
                    onChange={(e) =>
                      setAiSettings({ ...aiSettings, category: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-10 bg-dark-100 border border-dark-50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer"
                    disabled={generating}
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
                <label className="block text-sm font-medium text-dark-500 mb-3">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {difficulties.map((diff) => {
                    const DiffIcon = diff.icon;
                    return (
                      <motion.button
                        key={diff.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setAiSettings({
                            ...aiSettings,
                            difficulty: diff.value,
                          })
                        }
                        disabled={generating}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          aiSettings.difficulty === diff.value
                            ? `${diff.borderColor} ${diff.bgLight}`
                            : "border-dark-100 bg-dark-100 hover:border-dark-50"
                        }`}
                      >
                        <DiffIcon
                          className={`w-8 h-8 mx-auto mb-2 ${
                            aiSettings.difficulty === diff.value
                              ? "text-white"
                              : "text-dark-500"
                          }`}
                        />
                        <div
                          className={`font-semibold ${
                            aiSettings.difficulty === diff.value
                              ? "text-white"
                              : "text-dark-500"
                          }`}
                        >
                          {diff.label}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Question Count */}
              <div>
                <label className="block text-sm font-medium text-dark-500 mb-3">
                  Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {questionCounts.map((count) => (
                    <motion.button
                      key={count}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setAiSettings({ ...aiSettings, questionCount: count })
                      }
                      disabled={generating}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        aiSettings.questionCount === count
                          ? "border-primary-500 bg-primary-500/20"
                          : "border-dark-100 bg-dark-100 hover:border-dark-50"
                      }`}
                    >
                      <div
                        className={`text-2xl font-bold ${
                          aiSettings.questionCount === count
                            ? "text-white"
                            : "text-dark-500"
                        }`}
                      >
                        {count}
                      </div>
                      <div className="text-xs text-dark-500">questions</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                whileHover={!generating ? { scale: 1.02 } : {}}
                whileTap={!generating ? { scale: 0.98 } : {}}
                onClick={handleGenerate}
                disabled={generating}
                className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center space-x-3 transition-all ${
                  generating
                    ? "bg-dark-100 text-dark-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-neon hover:shadow-neon-lg"
                }`}
              >
                {generating ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    <span>Generating Quiz...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6" />
                    <span>Generate Quiz with AI</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-lg p-4 border border-primary-500/30"
            >
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary-500 mt-0.5" />
                <div className="text-sm text-dark-500">
                  <p className="font-semibold text-white mb-1">
                    Powered by Gemini AI
                  </p>
                  <p>
                    Our AI will generate relevant questions with multiple choice
                    answers based on your specifications. You can review and
                    edit before saving.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Generated Quiz Preview
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Success Message */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="card-neon bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Quiz Generated Successfully!
                  </h3>
                  <p className="text-dark-500">
                    Review your AI-generated quiz below
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quiz Info */}
            <div className="card-neon">
              <h2 className="text-2xl font-bold text-white mb-2">
                {generatedQuiz.title}
              </h2>
              <p className="text-dark-500 mb-4">{generatedQuiz.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-dark-100 rounded-full text-sm text-dark-500">
                  {generatedQuiz.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    generatedQuiz.difficulty === "easy"
                      ? "bg-green-500/20 text-green-400"
                      : generatedQuiz.difficulty === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {generatedQuiz.difficulty}
                </span>
                <span className="px-3 py-1 bg-dark-100 rounded-full text-sm text-dark-500">
                  {generatedQuiz.questions.length} questions
                </span>
              </div>
            </div>

            {/* Questions Preview */}
            <div className="card-neon">
              <h3 className="text-xl font-bold text-white mb-4">
                Questions Preview
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {generatedQuiz.questions.slice(0, 3).map((q, index) => (
                  <div
                    key={q.id}
                    className="bg-dark-100 rounded-lg p-4 border border-dark-50"
                  >
                    <p className="text-white font-semibold mb-3">
                      {index + 1}. {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded-lg text-sm ${
                            optIndex === q.correctAnswer
                              ? "bg-green-500/20 text-green-400 border border-green-500/50"
                              : "bg-dark-50 text-dark-500"
                          }`}
                        >
                          {option}
                          {optIndex === q.correctAnswer && " ✓"}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {generatedQuiz.questions.length > 3 && (
                  <p className="text-center text-dark-500 text-sm">
                    +{generatedQuiz.questions.length - 3} more questions...
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRegenerate}
                className="btn-secondary flex-1 flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Regenerate</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Save Quiz</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIQuizCreate;
