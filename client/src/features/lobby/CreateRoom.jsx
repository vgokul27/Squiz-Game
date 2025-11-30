import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Users,
  Sparkles,
  BookOpen,
  Zap,
  Brain,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import useUserStore from "../../store/userSlice";

const CreateRoom = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUserStore();

  // Admin email from environment variable
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  const options = [
    {
      id: "create-quiz",
      icon: BookOpen,
      title: "Create Quiz",
      description:
        "Create a custom quiz that any logged-in user can participate in",
      color: "from-blue-500 to-cyan-500",
      features: [
        "Add custom questions",
        "Public or private visibility",
        "Anyone can play",
        "Track statistics",
      ],
      action: () => navigate("/quiz/create"),
      adminOnly: true,
    },
    {
      id: "create-room",
      icon: Users,
      title: "Create Multiplayer Room",
      description: "Start a real-time multiplayer quiz battle with friends",
      color: "from-purple-500 to-pink-500",
      features: [
        "Real-time competition",
        "Private room code",
        "Live leaderboard",
        "Instant results",
      ],
      action: () => navigate("/room/create"),
      adminOnly: true,
    },
    {
      id: "ai-quiz",
      icon: Sparkles,
      title: "AI Quiz Generator",
      description: "Let AI create a custom quiz based on your preferences",
      color: "from-orange-500 to-red-500",
      features: [
        "Choose any topic",
        "Select difficulty",
        "Set question count",
        "Instant generation",
      ],
      action: () => navigate("/quiz/ai-create"),
      badge: "AI Powered",
      adminOnly: true,
    },
  ];

  // Check if user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleOptionClick = (option) => {
    // Check authentication
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    // Check if admin access is required
    if (option.adminOnly && !isAdmin) {
      toast.error(
        "⚠️ Admin access required. Only admins can create quizzes and rooms."
      );
      return;
    }

    // Navigate to the action
    option.action();
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-14 h-14 bg-gradient-purple rounded-2xl mb-6 shadow-neon"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Create Your <span className="glow-text">Quiz Experience</span>
          </h1>
          <p className="text-dark-500 text-sm lg:text-lg max-w-3xl mx-auto">
            Choose how you want to engage your audience - create a custom quiz,
            start a multiplayer battle, or let AI generate one for you
          </p>

          {/* Admin Badge */}
          {isAuthenticated && isAdmin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-full px-4 py-2 mt-4"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-semibold">
                Admin Access Granted
              </span>
            </motion.div>
          )}

          {/* Non-Admin Warning */}
          {isAuthenticated && !isAdmin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/50 rounded-full px-4 py-2 mt-4"
            >
              <Lock className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-semibold">
                Admin-only features. Contact administrator for access.
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {options.map((option, index) => {
            const isLocked = option.adminOnly && !isAdmin;

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!isLocked ? { y: -10 } : {}}
                onClick={() => handleOptionClick(option)}
                className={`relative group ${
                  isLocked ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {/* Card */}
                <div
                  className={`card-neon h-full overflow-hidden transition-all duration-300 ${
                    isLocked
                      ? "opacity-50 hover:opacity-60"
                      : "group-hover:shadow-neon-lg"
                  }`}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  {/* Lock Icon for Non-Admins */}
                  {isLocked && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="w-10 h-10 bg-red-500/20 border border-red-500/50 rounded-full flex items-center justify-center">
                        <Lock className="w-5 h-5 text-red-400" />
                      </div>
                    </div>
                  )}

                  {/* Badge */}
                  {option.badge && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-neon">
                        {option.badge}
                      </span>
                    </div>
                  )}

                  <div className="relative z-10 p-6">
                    {/* Icon */}
                    <motion.div
                      whileHover={!isLocked ? { rotate: 360, scale: 1.1 } : {}}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 bg-gradient-to-br ${
                        option.color
                      } rounded-xl flex items-center justify-center mb-4 shadow-neon transition-shadow ${
                        !isLocked && "group-hover:shadow-neon-lg"
                      }`}
                    >
                      <option.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3
                      className={`text-2xl font-bold text-white mb-3 transition-all ${
                        !isLocked && "group-hover:glow-text"
                      }`}
                    >
                      {option.title}
                    </h3>

                    {/* Description */}
                    <p className="text-dark-500 mb-6 leading-relaxed">
                      {option.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {option.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + idx * 0.05 }}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${option.color}`}
                          />
                          <span className="text-dark-500 text-sm">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Button */}
                    <motion.button
                      whileHover={!isLocked ? { scale: 1.05 } : {}}
                      whileTap={!isLocked ? { scale: 0.95 } : {}}
                      disabled={isLocked}
                      className={`w-full bg-gradient-to-r ${
                        option.color
                      } text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-lg transition-all ${
                        isLocked
                          ? "cursor-not-allowed opacity-50"
                          : "hover:shadow-neon"
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Admin Only</span>
                        </>
                      ) : (
                        <>
                          <span>Get Started</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.div>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="card-neon bg-gradient-to-br from-primary-500/10 to-purple-500/10 border-primary-500/30">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center flex-shrink-0 shadow-neon">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Need Help Choosing?
                </h3>
                <div className="space-y-2 text-dark-500">
                  <p>
                    <strong className="text-white">Create Quiz:</strong> Best
                    for educators, trainers, or anyone wanting to share
                    knowledge publicly
                  </p>
                  <p>
                    <strong className="text-white">Multiplayer Room:</strong>{" "}
                    Perfect for game nights, team building, or competitive fun
                    with friends
                  </p>
                  <p>
                    <strong className="text-white">AI Generator:</strong> Ideal
                    when you need quick, topic-specific quizzes without manual
                    creation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateRoom;
