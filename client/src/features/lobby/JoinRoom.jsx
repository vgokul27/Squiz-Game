import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Search, Users, Clock, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import useUserStore from "../../store/userSlice";
import LoadingSpinner from "../../components/LoadingSpinner";

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [activeRooms, setActiveRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRooms, setFetchingRooms] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to join a room");
      navigate("/login");
      return;
    }
    fetchActiveRooms();
  }, [isAuthenticated, navigate]);

  const fetchActiveRooms = async () => {
    try {
      const response = await api.get("/room/active");
      setActiveRooms(response.data.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setFetchingRooms(false);
    }
  };

  const handleJoinWithCode = async (e) => {
    e.preventDefault();

    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/room/join", {
        roomCode: roomCode.toUpperCase(),
      });

      if (response.data.success) {
        toast.success("Joined room successfully!");
        navigate(`/room/${roomCode.toUpperCase()}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (code) => {
    setLoading(true);

    try {
      const response = await api.post("/room/join", { roomCode: code });

      if (response.data.success) {
        toast.success("Joined room successfully!");
        navigate(`/room/${code}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join a <span className="glow-text">Quiz Room</span>
          </h1>
          <p className="text-dark-500 text-lg">
            Enter a room code or browse active rooms to start playing
          </p>
        </motion.div>

        {/* Join with Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-neon max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <LogIn className="w-6 h-6 text-primary-500" />
            <span>Join with Room Code</span>
          </h2>

          <form onSubmit={handleJoinWithCode} className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="input-primary text-center text-2xl tracking-widest uppercase"
                placeholder="ABC123"
                maxLength={6}
                disabled={loading}
              />
              <p className="text-dark-500 text-sm mt-2">
                Enter the 6-character room code shared by the host
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Join Room</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Active Rooms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Search className="w-6 h-6 text-primary-500" />
              <span>Active Rooms</span>
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchActiveRooms}
              className="text-primary-500 hover:text-primary-400 font-medium flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Refresh</span>
            </motion.button>
          </div>

          {fetchingRooms ? (
            <LoadingSpinner />
          ) : activeRooms.length === 0 ? (
            <div className="card-neon text-center py-12">
              <Users className="w-16 h-16 text-dark-500 mx-auto mb-4" />
              <p className="text-dark-500 text-lg mb-2">
                No active rooms available
              </p>
              <p className="text-dark-500 mb-6">Be the first to create one!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/create")}
                className="btn-primary"
              >
                Create a Room
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRooms.map((room, index) => (
                <motion.div
                  key={room._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="card-neon group cursor-pointer"
                  onClick={() => handleJoinRoom(room.roomCode)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {room.quiz?.title || "Quiz Room"}
                      </h3>
                      <p className="text-primary-500 font-mono text-lg font-bold">
                        {room.roomCode}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-primary-500/20 border border-primary-500 rounded-full">
                      <span className="text-primary-500 text-sm font-semibold">
                        {room.quiz?.difficulty || "Medium"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-dark-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {room.players.length}/{room.maxPlayers} Players
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-dark-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        Host: {room.host?.username || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="h-2 bg-dark-50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            (room.players.length / room.maxPlayers) * 100
                          }%`,
                        }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="h-full bg-gradient-purple"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary"
                    disabled={loading || room.players.length >= room.maxPlayers}
                  >
                    {room.players.length >= room.maxPlayers
                      ? "Room Full"
                      : "Join Room"}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default JoinRoom;
