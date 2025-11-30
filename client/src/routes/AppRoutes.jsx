import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import VerifyEmail from "../features/auth/VerifyEmail";
import ForgotPassword from "../features/auth/ForgotPassword";
import ResetPassword from "../features/auth/ResetPassword";
import Dashboard from "../pages/Dashboard";
import JoinRoom from "../features/lobby/JoinRoom";
import CreateRoom from "../features/lobby/CreateRoom";
import QuizCreate from "../pages/QuizCreate";
import RoomCreate from "../pages/RoomCreate";
import AIQuizCreate from "../pages/AIQuizCreate";
import QuizRoom from "../features/quiz/QuizRoom";
import ResultPage from "../features/results/ResultPage";
import Leaderboard from "../features/quiz/Leaderboard";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/leaderboard" element={<Leaderboard />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/join"
        element={
          <ProtectedRoute>
            <JoinRoom />
          </ProtectedRoute>
        }
      />

      {/* Create Options - Selection Page */}
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateRoom />
          </ProtectedRoute>
        }
      />

      {/* Quiz Creation Routes */}
      <Route
        path="/quiz/create"
        element={
          <ProtectedRoute>
            <QuizCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/room/create"
        element={
          <ProtectedRoute>
            <RoomCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/ai-create"
        element={
          <ProtectedRoute>
            <AIQuizCreate />
          </ProtectedRoute>
        }
      />

      {/* Quiz Room Routes */}
      <Route
        path="/room/:roomCode"
        element={
          <ProtectedRoute>
            <QuizRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:roomCode"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
