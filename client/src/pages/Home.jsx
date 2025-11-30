import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Zap,
  Users,
  Trophy,
  Clock,
  Brain,
  Sparkles,
  BookOpen,
  GraduationCap,
  Lightbulb,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Multiplayer Mode",
      description:
        "Challenge friends or join random players in real-time quiz battles.",
    },
    {
      icon: Clock,
      title: "Timed Questions",
      description:
        "Race against the clock and earn bonus points for quick answers.",
    },
    {
      icon: Trophy,
      title: "Leaderboards",
      description:
        "Climb the ranks and prove you're the ultimate quiz champion.",
    },
    {
      icon: Brain,
      title: "Multiple Categories",
      description:
        "Test your knowledge across various topics and difficulty levels.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Floating quiz elements
  const floatingElements = [
    { icon: BookOpen, delay: 0, x: "10%", y: "20%" },
    { icon: GraduationCap, delay: 2, x: "80%", y: "15%" },
    { icon: Brain, delay: 1, x: "70%", y: "60%" },
    { icon: Lightbulb, delay: 3, x: "15%", y: "70%" },
    { icon: Trophy, delay: 1.5, x: "85%", y: "40%" },
    { icon: Sparkles, delay: 2.5, x: "25%", y: "45%" },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-14 lg:py-14 min-h-[90vh]">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
              x: [0, -50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 right-0 w-80 h-80 bg-primary-600/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl"
          />

          {/* Floating Quiz Icons */}
          {floatingElements.map((element, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: element.delay,
                ease: "easeInOut",
              }}
              className="absolute"
              style={{ left: element.x, top: element.y }}
            >
              <element.icon className="w-8 h-8 text-primary-400/30" />
            </motion.div>
          ))}

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          {/* Animated Lines */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.line
              x1="0%"
              y1="30%"
              x2="100%"
              y2="30%"
              stroke="rgba(139, 92, 246, 0.1)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.line
              x1="0%"
              y1="60%"
              x2="100%"
              y2="60%"
              stroke="rgba(139, 92, 246, 0.1)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: 1,
              }}
            />
          </svg>

          {/* Knowledge Symbols */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-primary-400/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/3 left-1/4 w-24 h-24 border-2 border-purple-400/10 rounded-full"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center min-h-[70vh]">
            {/* Hero Content - Left Aligned */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left max-w-3xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-primary-500/20 border border-primary-500/50 rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-primary-400 text-sm font-semibold">
                  Real-time Multiplayer Quiz Game
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl lg:text-5xl font-bold mb-6"
              >
                Challenge Your Friends{" "}
                <span className="glow-text block mt-4">
                  Test Your Knowledge
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-dark-500 mb-8 max-w-3xl tracking-wide"
              >
                Join the ultimate multiplayer quiz experience. Compete in
                real-time, climb leaderboards, and prove you're the smartest
                player in the room.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/join"
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2"
                >
                  <Zap className="w-5 h-5" />
                  <span>Start Quiz Now</span>
                </Link>
                <Link to="/create" className="btn-secondary text-lg px-8 py-4">
                  Create Your Own Quiz
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose <span className="glow-text">Squiz Game</span>?
            </h2>
            <p className="text-dark-500 text-lg max-w-2xl mx-auto">
              Experience the most exciting way to test your knowledge and
              compete with players worldwide.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="card-neon group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-gradient-purple rounded-xl flex items-center justify-center mb-4 shadow-neon group-hover:shadow-neon-lg transition-shadow"
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-500">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              How It <span className="glow-text">Works</span>
            </h2>
            <p className="text-dark-500 text-lg max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Create or Join",
                description:
                  "Start a new quiz room or join an existing one with a room code.",
              },
              {
                step: "02",
                title: "Answer Questions",
                description:
                  "Race against time and other players to answer questions correctly.",
              },
              {
                step: "03",
                title: "Win & Climb",
                description:
                  "Earn points, win games, and climb the global leaderboard.",
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-purple rounded-full mb-6 shadow-neon text-3xl font-bold text-white"
                  >
                    {step.step}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-dark-500">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary-500 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-purple rounded-3xl p-12 shadow-neon-xl"
          >
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Test Your Knowledge?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join thousands of players worldwide and start your quiz journey
                today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-dark-50 transition-all hover:scale-105"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/join"
                  className="bg-dark-50 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-dark-100 transition-all hover:scale-105"
                >
                  Join a Quiz
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
