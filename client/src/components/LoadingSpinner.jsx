import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const LoadingSpinner = ({ size = "md", fullScreen = false }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const Container = fullScreen ? "div" : motion.div;

  const content = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClasses[size]} bg-gradient-purple rounded-lg flex items-center justify-center shadow-neon-lg`}
    >
      <Zap className="w-1/2 h-1/2 text-white" />
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-50/95 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center">{content}</div>;
};

export default LoadingSpinner;
