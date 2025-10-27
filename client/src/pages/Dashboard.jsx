import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Trophy,
  Zap,
  Clock,
  TrendingUp,
  PlayCircle,
  PlusCircle,
  Users,
} from "lucide-react";
import useUserStore from "../store/userSlice";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const { user } = useUserStore();
  const [stats, setStats] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, gamesRes] = await Promise.all([
        api.get("/auth/profile"),
        api.get("/result/my-results?limit=5"),
      ]);

      setStats(statsRes.data.data);
      setRecentGames(gamesRes.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const statCards = [
    {
      icon: Trophy,
      label: "Total Wins",
      value: user?.wins || 0,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
    },
    {
      icon: Zap,
      label: "Games Played",
      value: user?.totalGamesPlayed || 0,
      color: "text-primary-500",
      bgColor: "bg-primary-500/20",
    },
    {
      icon: TrendingUp,
      label: "Total Score",
      value: user?.totalScore || 0,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      icon: Users,
      label: "Win Rate",
      value:
        user?.totalGamesPlayed > 0
          ? `${Math.round((user?.wins / user?.totalGamesPlayed) * 100)}%`
          : "0%",
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="glow-text">{user?.username}</span>!
            👋
          </h1>
          <p className="text-dark-500">
            Track your progress and start new challenges
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <Link
            to="/join"
            className="card-neon group hover:scale-105 transition-transform"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-purple rounded-xl flex items-center justify-center shadow-neon">
                <PlayCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Join a Quiz
                </h3>
                <p className="text-dark-500">
                  Enter a room code and start playing
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/create"
            className="card-neon group hover:scale-105 transition-transform"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-purple rounded-xl flex items-center justify-center shadow-neon">
                <PlusCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Create Room
                </h3>
                <p className="text-dark-500">Host your own quiz challenge</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="card-neon"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-dark-500 text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Games</h2>
            <Link
              to="/history"
              className="text-primary-500 hover:text-primary-400 font-medium"
            >
              View All
            </Link>
          </div>

          {recentGames.length === 0 ? (
            <div className="card-neon text-center py-12">
              <Clock className="w-16 h-16 text-dark-500 mx-auto mb-4" />
              <p className="text-dark-500 mb-4">No games played yet</p>
              <Link
                to="/join"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Play Your First Game</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentGames.map((game) => (
                <motion.div
                  key={game._id}
                  whileHover={{ scale: 1.02 }}
                  className="card-neon"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          game.rank === 1
                            ? "bg-yellow-500/20"
                            : "bg-primary-500/20"
                        }`}
                      >
                        <Trophy
                          className={`w-6 h-6 ${
                            game.rank === 1
                              ? "text-yellow-500"
                              : "text-primary-500"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {game.quiz?.title || "Quiz"}
                        </h3>
                        <p className="text-dark-500 text-sm">
                          Rank #{game.rank} • Score: {game.score} •{" "}
                          {game.correctAnswers}/{game.totalQuestions} correct
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-xl">
                        {game.score}
                      </p>
                      <p className="text-dark-500 text-sm">
                        {new Date(game.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
