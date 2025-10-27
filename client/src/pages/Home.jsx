import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Users, Trophy, Clock, Brain, Sparkles } from "lucide-react";

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

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary-600/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
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
              className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6"
            >
              Challenge Your Friends.{" "}
              <span className="glow-text">Test Your Knowledge.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-dark-500 mb-8 max-w-2xl mx-auto"
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
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/join"
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Start Quiz Now</span>
              </Link>
              <Link to="/create" className="btn-secondary text-lg px-8 py-4">
                Create Your Own Quiz
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto"
            >
              {[
                { label: "Active Players", value: "10K+" },
                { label: "Quizzes Created", value: "5K+" },
                { label: "Questions Answered", value: "100K+" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-dark-100 border border-primary-500/30 rounded-xl p-4"
                >
                  <div className="text-2xl sm:text-3xl font-bold glow-text">
                    {stat.value}
                  </div>
                  <div className="text-dark-500 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
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
