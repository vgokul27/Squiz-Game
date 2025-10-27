import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, Users, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import useUserStore from "../../store/userSlice";
import LoadingSpinner from "../../components/LoadingSpinner";

const CreateRoom = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [loading, setLoading] = useState(false);
  const [fetchingQuizzes, setFetchingQuizzes] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to create a room");
      navigate("/login");
      return;
    }
    fetchQuizzes();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    filterQuizzes();
  }, [searchTerm, categoryFilter, difficultyFilter, quizzes]);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get("/quiz");
      setQuizzes(response.data.data);
      setFilteredQuizzes(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch quizzes");
      console.error(error);
    } finally {
      setFetchingQuizzes(false);
    }
  };

  const filterQuizzes = () => {
    let filtered = quizzes;

    if (searchTerm) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter((quiz) => quiz.category === categoryFilter);
    }

    if (difficultyFilter !== "All") {
      filtered = filtered.filter(
        (quiz) => quiz.difficulty === difficultyFilter
      );
    }

    setFilteredQuizzes(filtered);
  };

  const handleCreateRoom = async () => {
    if (!selectedQuiz) {
      toast.error("Please select a quiz");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/room/create", {
        quizId: selectedQuiz._id,
        maxPlayers,
      });

      if (response.data.success) {
        const roomCode = response.data.data.roomCode;
        toast.success(`Room created! Code: ${roomCode}`);
        navigate(`/room/${roomCode}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    "General",
    "Science",
    "History",
    "Sports",
    "Entertainment",
    "Technology",
    "Other",
  ];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Create a <span className="glow-text">Quiz Room</span>
          </h1>
          <p className="text-dark-500 text-lg">
            Select a quiz and invite your friends to play
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quiz Selection */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-neon mb-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Filter className="w-5 h-5 text-primary-500" />
                <span>Filter Quizzes</span>
              </h2>

              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-primary pl-11"
                    placeholder="Search quizzes..."
                  />
                </div>

                {/* Category & Difficulty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="input-primary"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Difficulty
                    </label>
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="input-primary"
                    >
                      {difficulties.map((diff) => (
                        <option key={diff} value={diff}>
                          {diff}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quiz List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4">
                Available Quizzes ({filteredQuizzes.length})
              </h2>

              {fetchingQuizzes ? (
                <LoadingSpinner />
              ) : filteredQuizzes.length === 0 ? (
                <div className="card-neon text-center py-12">
                  <Search className="w-16 h-16 text-dark-500 mx-auto mb-4" />
                  <p className="text-dark-500">No quizzes found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuizzes.map((quiz, index) => (
                    <motion.div
                      key={quiz._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedQuiz(quiz)}
                      className={`card-neon cursor-pointer transition-all ${
                        selectedQuiz?._id === quiz._id
                          ? "border-primary-500 shadow-neon-lg bg-primary-500/10"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white">
                              {quiz.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                quiz.difficulty === "Easy"
                                  ? "bg-green-500/20 text-green-500"
                                  : quiz.difficulty === "Hard"
                                  ? "bg-red-500/20 text-red-500"
                                  : "bg-yellow-500/20 text-yellow-500"
                              }`}
                            >
                              {quiz.difficulty}
                            </span>
                            <span className="px-2 py-1 bg-primary-500/20 text-primary-500 rounded text-xs font-semibold">
                              {quiz.category}
                            </span>
                          </div>
                          <p className="text-dark-500 text-sm mb-3">
                            {quiz.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-dark-500">
                            <span>📝 {quiz.questions.length} Questions</span>
                            <span>👤 {quiz.createdBy?.username}</span>
                            <span>🎮 {quiz.timesPlayed || 0} Plays</span>
                          </div>
                        </div>
                        {selectedQuiz?._id === quiz._id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
                          >
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Room Settings */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card-neon sticky top-24"
            >
              <h2 className="text-2xl font-bold mb-6">Room Settings</h2>

              {selectedQuiz && (
                <div className="bg-dark-50 border border-primary-500/30 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-semibold mb-2">
                    Selected Quiz
                  </h3>
                  <p className="text-primary-500 font-bold">
                    {selectedQuiz.title}
                  </p>
                  <p className="text-dark-500 text-sm mt-1">
                    {selectedQuiz.questions.length} questions •{" "}
                    {selectedQuiz.difficulty}
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {/* Max Players */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Max Players: {maxPlayers}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="2"
                      max="50"
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <div className="w-12 h-12 bg-primary-500/20 border border-primary-500 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-500" />
                    </div>
                  </div>
                  <p className="text-dark-500 text-sm mt-2">
                    Set the maximum number of players for your room
                  </p>
                </div>

                {/* Create Button */}
                <motion.button
                  onClick={handleCreateRoom}
                  disabled={!selectedQuiz || loading}
                  whileHover={{ scale: selectedQuiz && !loading ? 1.02 : 1 }}
                  whileTap={{ scale: selectedQuiz && !loading ? 0.98 : 1 }}
                  className={`w-full btn-primary flex items-center justify-center space-x-2 ${
                    !selectedQuiz || loading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      <span>Create Room</span>
                    </>
                  )}
                </motion.button>

                {!selectedQuiz && (
                  <p className="text-center text-dark-500 text-sm">
                    Select a quiz to create a room
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
