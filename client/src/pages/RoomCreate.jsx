import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { roomService } from "../services/roomService";
import {
  Users,
  ArrowLeft,
  Copy,
  CheckCircle,
  Play,
  Settings,
  Clock,
  Trophy,
  Hash,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

const RoomCreate = () => {
  const navigate = useNavigate();

  const [roomSettings, setRoomSettings] = useState({
    maxPlayers: 10,
    isPrivate: false,
    waitingTime: 30,
  });

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [roomCode, setRoomCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Mock quiz data - Replace with API call
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "General Knowledge Quiz",
      category: "General Knowledge",
      difficulty: "medium",
      questionCount: 10,
      creator: "Admin",
    },
    {
      id: 2,
      title: "Science Trivia",
      category: "Science",
      difficulty: "hard",
      questionCount: 15,
      creator: "Admin",
    },
    {
      id: 3,
      title: "Math Challenge",
      category: "Mathematics",
      difficulty: "easy",
      questionCount: 20,
      creator: "Admin",
    },
  ]);

  const categories = [
    "all",
    "General Knowledge",
    "Science",
    "Mathematics",
    "History",
    "Sports",
    "Technology",
  ];

  const difficulties = [
    { value: "easy", label: "Easy", color: "green" },
    { value: "medium", label: "Medium", color: "yellow" },
    { value: "hard", label: "Hard", color: "red" },
  ];

  // Generate room code
  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    return code;
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || quiz.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Copy room code
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    toast.success("Room code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Create room
  const handleCreateRoom = async () => {
    if (!selectedQuiz) {
      toast.error("Please select a quiz");
      return;
    }

    const loadingToast = toast.loading("Creating multiplayer room...");

    try {
      const code = generateRoomCode();

      const roomData = {
        quizId: selectedQuiz.id,
        roomCode: code,
        settings: roomSettings,
      };

      console.log("Room data:", roomData);

      // TODO: API call to create room
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Room created successfully!", { id: loadingToast });

      // Navigate to waiting room
      navigate(`/room/${code}/lobby`);
    } catch (error) {
      toast.error("Failed to create room", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
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
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-neon">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Create Multiplayer Room
              </h1>
              <p className="text-dark-500">
                Select a quiz and configure room settings
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Quiz Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search & Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-neon"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search quizzes..."
                    className="w-full pl-10 pr-4 py-3 bg-dark-100 border border-dark-50 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none z-10" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full sm:w-48 pl-10 pr-10 py-3 bg-dark-100 border border-dark-50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-dark-100">
                        {cat === "all" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 pointer-events-none" />
                </div>
              </div>
            </motion.div>

            {/* Quiz List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                Select a Quiz ({filteredQuizzes.length})
              </h2>

              <AnimatePresence>
                {filteredQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedQuiz(quiz)}
                    className={`card-neon cursor-pointer transition-all ${
                      selectedQuiz?.id === quiz.id
                        ? "border-primary-500 bg-primary-500/10"
                        : "hover:border-primary-500/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-white">
                            {quiz.title}
                          </h3>
                          {selectedQuiz?.id === quiz.id && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-dark-100 rounded-full text-xs text-dark-500">
                            {quiz.category}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              quiz.difficulty === "easy"
                                ? "bg-green-500/20 text-green-400"
                                : quiz.difficulty === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {quiz.difficulty}
                          </span>
                          <span className="px-3 py-1 bg-dark-100 rounded-full text-xs text-dark-500 flex items-center space-x-1">
                            <Hash className="w-3 h-3" />
                            <span>{quiz.questionCount} questions</span>
                          </span>
                        </div>

                        <p className="text-sm text-dark-500">
                          Created by {quiz.creator}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredQuizzes.length === 0 && (
                <div className="card-neon text-center py-12">
                  <p className="text-dark-500">No quizzes found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Room Settings */}
          <div className="space-y-6">
            {/* Settings Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card-neon sticky top-24"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary-500" />
                <span>Room Settings</span>
              </h2>

              <div className="space-y-4">
                {/* Max Players */}
                <div>
                  <label className="block text-sm font-medium text-dark-500 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Max Players
                  </label>
                  <input
                    type="number"
                    value={roomSettings.maxPlayers}
                    onChange={(e) =>
                      setRoomSettings({
                        ...roomSettings,
                        maxPlayers: Number(e.target.value),
                      })
                    }
                    min={2}
                    max={50}
                    className="w-full px-4 py-3 bg-dark-100 border border-dark-50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                </div>

                {/* Waiting Time */}
                <div>
                  <label className="block text-sm font-medium text-dark-500 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Waiting Time (seconds)
                  </label>
                  <input
                    type="number"
                    value={roomSettings.waitingTime}
                    onChange={(e) =>
                      setRoomSettings({
                        ...roomSettings,
                        waitingTime: Number(e.target.value),
                      })
                    }
                    min={10}
                    max={120}
                    className="w-full px-4 py-3 bg-dark-100 border border-dark-50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                  <p className="text-xs text-dark-500 mt-1">
                    Time to wait before starting the quiz
                  </p>
                </div>

                {/* Private Room */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={roomSettings.isPrivate}
                      onChange={(e) =>
                        setRoomSettings({
                          ...roomSettings,
                          isPrivate: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-2 border-dark-500 bg-dark-100 text-primary-500 focus:ring-2 focus:ring-primary-500 cursor-pointer transition-all"
                    />
                    <span className="text-white group-hover:text-primary-400 transition-colors">
                      Private Room
                    </span>
                  </label>
                  <p className="text-xs text-dark-500 mt-1 ml-8">
                    Only users with room code can join
                  </p>
                </div>

                {/* Room Code Preview */}
                {roomCode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-dark-100 rounded-lg p-4 border border-primary-500/30"
                  >
                    <p className="text-xs text-dark-500 mb-2">Room Code:</p>
                    <div className="flex items-center justify-between">
                      <code className="text-2xl font-bold text-primary-500 tracking-wider">
                        {roomCode}
                      </code>
                      <button
                        onClick={copyRoomCode}
                        className="text-primary-500 hover:text-primary-400 transition-colors p-2 hover:bg-primary-500/10 rounded-lg"
                      >
                        {copied ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Selected Quiz Info */}
                {selectedQuiz && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-lg p-4 border border-primary-500/30"
                  >
                    <p className="text-xs text-dark-500 mb-2">Selected Quiz:</p>
                    <h3 className="text-white font-bold mb-2">
                      {selectedQuiz.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-dark-500">
                      <Hash className="w-4 h-4" />
                      <span>{selectedQuiz.questionCount} questions</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Create Button */}
              <motion.button
                whileHover={selectedQuiz ? { scale: 1.02 } : {}}
                whileTap={selectedQuiz ? { scale: 0.98 } : {}}
                onClick={handleCreateRoom}
                disabled={!selectedQuiz}
                className={`w-full mt-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
                  selectedQuiz
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-neon hover:shadow-neon-lg"
                    : "bg-dark-100 text-dark-500 cursor-not-allowed"
                }`}
              >
                <Play className="w-5 h-5" />
                <span>Create Room</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCreate;
