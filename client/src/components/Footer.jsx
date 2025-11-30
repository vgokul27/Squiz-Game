import { motion } from "framer-motion";
import { Zap, Github, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark-100 border-t border-primary-500/20 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center"
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold glow-text">Squiz Game</span>
            </div>
            <p className="text-dark-500 mb-4">
              Challenge your friends. Test your knowledge. Compete in real-time
              multiplayer quiz battles.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-500 hover:text-primary-500 transition-colors"
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-500 hover:text-primary-500 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="mailto:contact@squizgame.com"
                className="text-dark-500 hover:text-primary-500 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-dark-500 hover:text-primary-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/join"
                  className="text-dark-500 hover:text-primary-500 transition-colors"
                >
                  Join Quiz
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="text-dark-500 hover:text-primary-500 transition-colors"
                >
                  Create Quiz
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="text-dark-500 hover:text-primary-500 transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-dark-500 hover:text-primary-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-dark-500 hover:text-primary-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-dark-500 hover:text-primary-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-dark-500 hover:text-primary-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-500/20 mt-8 pt-8 text-center">
          <p className="text-dark-500">
            © 2025 Squiz Game. All rights reserved. Built with ❤️ by vgokul27
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
