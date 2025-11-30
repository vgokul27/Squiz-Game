import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Zap,
  Home,
  PlusCircle,
  LogIn,
  User,
  LogOut,
} from "lucide-react";
import useUserStore from "../store/userSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUserStore();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Join Quiz", path: "/join", icon: Zap },
    { name: "Create Quiz", path: "/create", icon: PlusCircle },
  ];

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-dark-50/95 backdrop-blur-md border-b border-primary-500/20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center shadow-neon"
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold glow-text">Squiz Game</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="navbar-link flex items-center space-x-2"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="navbar-link flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="navbar-link">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-primary-500 hover:text-primary-400 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-64 bg-dark-100 border-r border-primary-500/30 z-50 md:hidden shadow-neon-lg"
            >
              <div className="flex flex-col h-full">
                {/* Header with Logo and Close Button */}
                <div className="flex items-center justify-between p-4 border-b border-primary-500/30">
                  <Link
                    to="/"
                    onClick={toggleMenu}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold glow-text">
                      Squiz Game
                    </span>
                  </Link>
                  <button
                    onClick={toggleMenu}
                    className="text-primary-500 hover:text-primary-400 transition-colors p-2 hover:bg-dark-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {/* User Info */}
                  {isAuthenticated && (
                    <div className="mb-6 p-3 bg-dark-50 rounded-lg border border-primary-500/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-purple rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            {user?.username}
                          </p>
                          <p className="text-dark-500 text-xs truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={toggleMenu}
                        className="flex items-center space-x-3 text-dark-600 hover:text-primary-500 hover:bg-dark-50 p-3 rounded-lg transition-all"
                      >
                        <link.icon className="w-5 h-5" />
                        <span className="font-medium">{link.name}</span>
                      </Link>
                    ))}

                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={toggleMenu}
                          className="flex items-center space-x-3 text-dark-600 hover:text-primary-500 hover:bg-dark-50 p-3 rounded-lg transition-all"
                        >
                          <User className="w-5 h-5" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 text-red-500 hover:bg-red-500/10 p-3 rounded-lg transition-all"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={toggleMenu}
                          className="flex items-center space-x-3 text-dark-600 hover:text-primary-500 hover:bg-dark-50 p-3 rounded-lg transition-all"
                        >
                          <LogIn className="w-5 h-5" />
                          <span className="font-medium">Login</span>
                        </Link>
                        <Link
                          to="/register"
                          onClick={toggleMenu}
                          className="btn-primary w-full text-center mt-4"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
