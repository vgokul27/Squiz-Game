import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Crown, Copy, Check, LogOut, Loader } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import useUserStore from "../../store/userSlice";
import useQuizStore from "../../store/quizSlice";
import { connectSocket } from "../../services/socket";
import lobbySocket from "../lobby/lobbySocket";
import quizSocket from "./quizSocket";
import QuestionCard from "./QuestionCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const QuizRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const {
    currentRoom,
    setCurrentRoom,
    gameStatus,
    setGameStatus,
    players,
    setPlayers,
    resetQuiz,
  } = useQuizStore();

  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    initializeRoom();

    return () => {
      cleanup();
    };
  }, [roomCode]);

  const initializeRoom = async () => {
    try {
      // Connect socket
      const sock = connectSocket();
      setSocket(sock);

      // Fetch room details
      const response = await api.get(`/room/${roomCode}`);
      const roomData = response.data.data;

      setCurrentRoom(roomData);
      setPlayers(roomData.players);
      setGameStatus(roomData.status);

      // Join room via socket
      lobbySocket.joinRoom(roomCode, user._id);

      // Setup socket listeners
      setupSocketListeners();

      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join room");
      navigate("/join");
    }
  };

  const setupSocketListeners = () => {
    // Lobby events
    lobbySocket.onPlayerJoined((data) => {
      setPlayers((prev) => [...prev, data.player]);
      toast.success(`${data.player.username} joined the room`);
    });

    lobbySocket.onPlayerLeft((data) => {
      setPlayers((prev) => prev.filter((p) => p.userId !== data.userId));
      toast.info("A player left the room");
    });

    lobbySocket.onPlayerReadyUpdate((data) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.userId === data.userId ? { ...p, isReady: true } : p
        )
      );
    });

    lobbySocket.onGameStarting((data) => {
      setCountdown(data.countdown);
      let timer = data.countdown;
      const interval = setInterval(() => {
        timer--;
        setCountdown(timer);
        if (timer <= 0) {
          clearInterval(interval);
          setGameStatus("in-progress");
        }
      }, 1000);
    });

    lobbySocket.onRoomClosed(() => {
      toast.error("Room has been closed");
      navigate("/join");
    });

    // Quiz events
    quizSocket.onNewQuestion(() => {
      // Handled in QuestionCard
    });

    quizSocket.onGameEnded((data) => {
      setGameStatus("finished");
      navigate(`/results/${roomCode}`, { state: { results: data } });
    });
  };

  const cleanup = () => {
    if (socket?.connected) {
      lobbySocket.leaveRoom(roomCode, user._id);
      lobbySocket.removeAllListeners();
      quizSocket.removeAllListeners();
    }
    resetQuiz();
  };

  const handleReady = () => {
    lobbySocket.setPlayerReady(roomCode, user._id);
  };

  const handleLeaveRoom = async () => {
    try {
      await api.post(`/room/${roomCode}/leave`);
      toast.success("Left room");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to leave room");
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    toast.success("Room code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isHost =
    currentRoom?.host?._id === user._id || currentRoom?.host === user._id;
  const currentPlayer = players.find(
    (p) => p.userId === user._id || p.userId._id === user._id
  );
  const isReady = currentPlayer?.isReady || false;

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Show countdown overlay
  if (countdown !== null && countdown > 0) {
    return (
      <div className="fixed inset-0 bg-dark-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-9xl font-bold glow-text mb-4"
          >
            {countdown}
          </motion.div>
          <p className="text-2xl text-white">Game starting...</p>
        </motion.div>
      </div>
    );
  }

  // Show game in progress
  if (gameStatus === "in-progress") {
    return <QuestionCard roomCode={roomCode} />;
  }

  // Show waiting lobby
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="glow-text">{currentRoom?.quiz?.title}</span>
          </h1>
          <p className="text-dark-500 text-lg mb-4">
            {currentRoom?.quiz?.description}
          </p>

          {/* Room Code */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center space-x-2 bg-dark-100 border border-primary-500 rounded-lg px-6 py-3 cursor-pointer"
            onClick={copyRoomCode}
          >
            <span className="text-dark-500 font-medium">Room Code:</span>
            <span className="text-2xl font-bold glow-text tracking-wider">
              {roomCode}
            </span>
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-primary-500" />
            )}
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Players List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-neon"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <Users className="w-6 h-6 text-primary-500" />
                  <span>
                    Players ({players.length}/{currentRoom?.maxPlayers})
                  </span>
                </h2>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {players.map((player, index) => {
                    const isPlayerHost =
                      currentRoom?.host?._id === player.userId ||
                      currentRoom?.host === player.userId;
                    const playerId = player.userId?._id || player.userId;

                    return (
                      <motion.div
                        key={playerId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                          player.isReady
                            ? "bg-green-500/10 border-green-500"
                            : "bg-dark-50 border-dark-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-purple rounded-full flex items-center justify-center shadow-neon">
                            <span className="text-white font-bold text-lg">
                              {player.username?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-semibold">
                                {player.username}
                              </span>
                              {isPlayerHost && (
                                <Crown className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <span className="text-dark-500 text-sm">
                              {player.isReady ? "✓ Ready" : "Waiting..."}
                            </span>
                          </div>
                        </div>

                        {player.isReady && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Game Info & Actions */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-neon sticky top-24 space-y-6"
            >
              {/* Quiz Info */}
              <div>
                <h3 className="text-xl font-bold mb-4">Quiz Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-500">Questions:</span>
                    <span className="text-white font-semibold">
                      {currentRoom?.quiz?.questions?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-500">Category:</span>
                    <span className="text-primary-500 font-semibold">
                      {currentRoom?.quiz?.category}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-500">Difficulty:</span>
                    <span
                      className={`font-semibold ${
                        currentRoom?.quiz?.difficulty === "Easy"
                          ? "text-green-500"
                          : currentRoom?.quiz?.difficulty === "Hard"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {currentRoom?.quiz?.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ready Status */}
              <div className="bg-dark-50 border border-primary-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-dark-500">Ready Players:</span>
                  <span className="text-white font-bold">
                    {players.filter((p) => p.isReady).length}/{players.length}
                  </span>
                </div>
                <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        (players.filter((p) => p.isReady).length /
                          players.length) *
                        100
                      }%`,
                    }}
                    className="h-full bg-gradient-purple"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {!isReady ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReady}
                    className="w-full btn-primary"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    I'm Ready!
                  </motion.button>
                ) : (
                  <div className="w-full bg-green-500/20 border border-green-500 text-green-500 px-6 py-3 rounded-lg font-semibold text-center">
                    <Check className="w-5 h-5 inline mr-2" />
                    You're Ready!
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLeaveRoom}
                  className="w-full bg-red-500/20 border border-red-500 text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all"
                >
                  <LogOut className="w-5 h-5 inline mr-2" />
                  Leave Room
                </motion.button>
              </div>

              {/* Waiting Message */}
              {players.length < 2 && (
                <div className="text-center text-dark-500 text-sm">
                  <Loader className="w-5 h-5 animate-spin mx-auto mb-2" />
                  Waiting for more players to join...
                </div>
              )}

              {players.length >= 2 && !players.every((p) => p.isReady) && (
                <div className="text-center text-dark-500 text-sm">
                  Waiting for all players to be ready...
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizRoom;
