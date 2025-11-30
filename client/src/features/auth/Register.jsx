import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Zap,
  Eye,
  EyeOff,
  MailCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import AuthLayout from "../../components/AuthLayout";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        setRegisteredEmail(formData.email);
        setRegistrationSuccess(true);
        toast.success("Registration successful! Please verify your email.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await api.post("/auth/resend-verification", {
        email: registeredEmail,
      });

      if (response.data.success) {
        toast.success("Verification email resent!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend email");
    }
  };

  // Show success message after registration
  if (registrationSuccess) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto text-center"
        >
          <div className="card-neon">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <div className="inline-flex w-20 h-20 bg-gradient-purple rounded-full items-center justify-center shadow-neon-xl mb-6">
                <MailCheck className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold mb-4">
              Check Your <span className="glow-text">Email!</span>
            </h1>

            <p className="text-dark-500 mb-6 text-lg">
              We've sent a verification link to
            </p>

            <p className="text-white font-semibold text-xl mb-6 break-all">
              {registeredEmail}
            </p>

            <div className="bg-dark-50 border border-primary-500/30 rounded-lg p-4 mb-6">
              <p className="text-dark-400 text-sm mb-2">
                📧 Click the link in the email to verify your account
              </p>
              <p className="text-dark-400 text-sm">
                ⏰ The link expires in 24 hours
              </p>
            </div>

            <div className="space-y-3">
              <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary"
              >
                Go to Login
              </motion.button>

              <div className="text-center">
                <p className="text-dark-500 text-sm mb-2">
                  Didn't receive the email?
                </p>
                <button
                  onClick={handleResendVerification}
                  className="text-primary-500 hover:text-primary-400 font-semibold text-sm transition-colors"
                >
                  Resend Verification Email
                </button>
              </div>
            </div>

            <p className="text-dark-500 text-xs mt-6">
              Check your spam folder if you don't see the email
            </p>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  // Registration form
  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-20 h-20 bg-gradient-purple rounded-2xl items-center justify-center shadow-neon-xl mb-6"
          >
            <Zap className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-3">
            Join{" "}
            <span
              className="glow-text"
              style={{ textShadow: "0 0 10px #9333ea" }}
            >
              Squiz Game
            </span>
          </h1>
          <p className="text-dark-500 text-lg">
            Create your account and start playing
          </p>
        </div>

        {/* Register Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="card-neon"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-white font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-primary pl-11"
                  placeholder="Choose a username"
                  required
                  minLength={3}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-primary pl-11"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-primary pl-11 pr-11"
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-primary-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-dark-500 text-xs mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-primary pl-11 pr-11"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-primary-500 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 rounded border-dark-200 text-primary-500 focus:ring-primary-500 focus:ring-2"
              />
              <span className="text-sm text-dark-500 group-hover:text-dark-400 transition-colors">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-primary-500 hover:text-primary-400 transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-primary-500 hover:text-primary-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-dark-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-500 hover:text-primary-400 font-semibold transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.form>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <Link
            to="/"
            className="text-dark-500 hover:text-primary-500 transition-colors inline-flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
};

export default Register;
