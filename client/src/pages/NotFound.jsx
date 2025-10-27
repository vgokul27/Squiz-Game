import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold glow-text mb-4">404</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-dark-500 text-lg mb-8">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
            <Link
              to="/join"
              className="btn-secondary flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Find a Quiz</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="inline-block p-8 bg-dark-100 border border-primary-500/30 rounded-2xl">
            <p className="text-dark-500 text-sm">
              Lost? Try searching for a quiz room or head back to safety.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
