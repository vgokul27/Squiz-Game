import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Zap,
  Target,
  Clock,
  TrendingUp,
  Home,
  PlayCircle,
} from "lucide-react";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import api from "../../services/api";
import useUserStore from "../../store/userSlice";
import LoadingSpinner from "../../components/LoadingSpinner";

const ResultPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();
  const { width, height } = useWindowSize();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [roomCode]);

  const fetchResults = async () => {
    try {
      // Try to get results from location state first
      if (location.state?.results) {
        setResults(location.state.results);
        checkForConfetti(location.state.results);
        setLoading(false);
        return;
      }

      // Otherwise fetch from API
      const response = await api.get(`/result/room/${roomCode}`);
      setResults(response.data.data);
      checkForConfetti(response.data.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkForConfetti = (data) => {
    // Show confetti if current user is in top 3
    const currentUserResult = data.results.find(
      (r) => r.userId._id === user._id || r.userId === user._id
    );
    if (currentUserResult && currentUserResult.rank <= 3) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">No results found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary mt-4"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const sortedResults = [...results.results].sort((a, b) => a.rank - b.rank);
  const currentUserResult = results.results.find(
    (r) => r.userId._id === user._id || r.userId === user._id
  );

  const getMedalColor = (rank) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-orange-500";
    return "text-dark-500";
  };

  const getMedalBg = (rank) => {
    if (rank === 1) return "bg-yellow-500/20 border-yellow-500";
    if (rank === 2) return "bg-gray-400/20 border-gray-400";
    if (rank === 3) return "bg-orange-500/20 border-orange-500";
    return "bg-dark-50 border-dark-200";
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex w-24 h-24 bg-gradient-purple rounded-full items-center justify-center shadow-neon-xl mb-6"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Game <span className="glow-text">Complete!</span>
          </h1>
          <p className="text-dark-500 text-lg">{results.quiz?.title}</p>
        </motion.div>

        {/* Your Result Card */}
        {currentUserResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card-neon mb-12 bg-gradient-to-r from-primary-500/10 to-transparent"
          >
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center space-x-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${getMedalBg(
                    currentUserResult.rank
                  )}`}
                >
                  <span
                    className={`text-3xl font-bold ${getMedalColor(
                      currentUserResult.rank
                    )}`}
                  >
                    #{currentUserResult.rank}
                  </span>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Your Result
                  </h2>
                  <p className="text-dark-500">
                    {currentUserResult.rank === 1
                      ? "🎉 Congratulations! You won!"
                      : `Great job! You ranked #${currentUserResult.rank}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <Zap className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {currentUserResult.score}
                  </div>
                  <div className="text-dark-500 text-sm">Score</div>
                </div>
                <div className="text-center">
                  <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {currentUserResult.correctAnswers}/
                    {currentUserResult.totalQuestions}
                  </div>
                  <div className="text-dark-500 text-sm">Correct</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {Math.round(
                      (currentUserResult.correctAnswers /
                        currentUserResult.totalQuestions) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-dark-500 text-sm">Accuracy</div>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {Math.round(currentUserResult.avgTimePerQuestion)}s
                  </div>
                  <div className="text-dark-500 text-sm">Avg Time</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-6">Final Leaderboard</h2>

          <div className="space-y-4">
            {sortedResults.map((result, index) => {
              const isCurrentUser =
                result.userId._id === user._id || result.userId === user._id;

              return (
                <motion.div
                  key={result._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className={`card-neon ${
                    isCurrentUser ? "border-primary-500 bg-primary-500/10" : ""
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Rank & Player */}
                    <div className="flex items-center space-x-4 flex-1 min-w-[200px]">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${getMedalBg(
                          result.rank
                        )}`}
                      >
                        {result.rank <= 3 ? (
                          <Medal
                            className={`w-8 h-8 ${getMedalColor(result.rank)}`}
                          />
                        ) : (
                          <span className="text-xl font-bold text-dark-500">
                            #{result.rank}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-bold ${
                            isCurrentUser ? "text-primary-500" : "text-white"
                          }`}
                        >
                          {result.userId.username}
                          {isCurrentUser && " (You)"}
                        </h3>
                        <p className="text-dark-500 text-sm">
                          {result.correctAnswers}/{result.totalQuestions}{" "}
                          correct •{" "}
                          {Math.round(
                            (result.correctAnswers / result.totalQuestions) *
                              100
                          )}
                          % accuracy
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold glow-text">
                          {result.score}
                        </div>
                        <div className="text-dark-500 text-sm">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">
                          {Math.round(result.avgTimePerQuestion)}s
                        </div>
                        <div className="text-dark-500 text-sm">Avg Time</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="btn-secondary flex items-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go to Dashboard</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/join")}
            className="btn-primary flex items-center space-x-2"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Play Again</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultPage;
