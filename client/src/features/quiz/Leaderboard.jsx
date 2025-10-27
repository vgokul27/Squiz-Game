import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp, Filter } from "lucide-react";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState("all-time");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/result/leaderboard?timeframe=${timeframe}`
      );
      setLeaderboard(response.data.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="container mx-auto max-w-5xl">
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
            className="inline-flex w-20 h-20 bg-gradient-purple rounded-full items-center justify-center shadow-neon-xl mb-6"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Global <span className="glow-text">Leaderboard</span>
          </h1>
          <p className="text-dark-500 text-lg">
            See how you rank against the best players
          </p>
        </motion.div>

        {/* Timeframe Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-neon mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary-500" />
              <span className="text-white font-semibold">Timeframe:</span>
            </div>
            <div className="flex space-x-2">
              {["all-time", "monthly", "weekly"].map((tf) => (
                <motion.button
                  key={tf}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeframe(tf)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeframe === tf
                      ? "bg-gradient-purple text-white shadow-neon"
                      : "bg-dark-50 text-dark-500 hover:text-white"
                  }`}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1).replace("-", " ")}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        {loading ? (
          <LoadingSpinner />
        ) : leaderboard.length === 0 ? (
          <div className="card-neon text-center py-12">
            <TrendingUp className="w-16 h-16 text-dark-500 mx-auto mb-4" />
            <p className="text-dark-500">No leaderboard data available</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card-neon text-center pt-8"
                >
                  <div className="w-20 h-20 bg-gray-400/20 border-2 border-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Medal className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {leaderboard[1].username}
                  </h3>
                  <p className="text-3xl font-bold text-gray-400 mb-2">
                    {leaderboard[1].totalScore}
                  </p>
                  <p className="text-dark-500 text-sm">
                    {leaderboard[1].wins} wins
                  </p>
                </motion.div>

                {/* 1st Place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card-neon text-center bg-gradient-to-b from-yellow-500/10 to-transparent border-yellow-500"
                >
                  <div className="w-24 h-24 bg-yellow-500/20 border-4 border-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-neon-lg">
                    <Trophy className="w-12 h-12 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {leaderboard[0].username}
                  </h3>
                  <p className="text-4xl font-bold text-yellow-500 mb-2">
                    {leaderboard[0].totalScore}
                  </p>
                  <p className="text-dark-500 text-sm">
                    {leaderboard[0].wins} wins
                  </p>
                </motion.div>

                {/* 3rd Place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card-neon text-center pt-8"
                >
                  <div className="w-20 h-20 bg-orange-500/20 border-2 border-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Medal className="w-10 h-10 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {leaderboard[2].username}
                  </h3>
                  <p className="text-3xl font-bold text-orange-500 mb-2">
                    {leaderboard[2].totalScore}
                  </p>
                  <p className="text-dark-500 text-sm">
                    {leaderboard[2].wins} wins
                  </p>
                </motion.div>
              </div>
            )}

            {/* Rest of the leaderboard */}
            {leaderboard.slice(3).map((player, index) => (
              <motion.div
                key={player._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="card-neon"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-14 h-14 bg-dark-50 border border-dark-200 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-dark-500">
                        #{index + 4}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">
                        {player.username}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-dark-500 mt-1">
                        <span>🏆 {player.wins} wins</span>
                        <span>🎮 {player.totalGamesPlayed} games</span>
                        <span>
                          📊{" "}
                          {player.totalGamesPlayed > 0
                            ? Math.round(
                                (player.wins / player.totalGamesPlayed) * 100
                              )
                            : 0}
                          % win rate
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold glow-text">
                      {player.totalScore}
                    </div>
                    <div className="text-dark-500 text-sm">Total Score</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
