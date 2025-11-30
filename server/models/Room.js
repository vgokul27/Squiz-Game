import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: String,
  socketId: String,
  score: {
    type: Number,
    default: 0,
  },
  answers: [
    {
      questionIndex: Number,
      selectedAnswer: Number,
      isCorrect: Boolean,
      timeSpent: Number,
    },
  ],
  isReady: {
    type: Boolean,
    default: false,
  },
});

const roomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    players: [playerSchema],
    maxPlayers: {
      type: Number,
      default: 10,
      min: 2,
      max: 50,
    },
    status: {
      type: String,
      enum: ["waiting", "starting", "in-progress", "finished"],
      default: "waiting",
    },
    currentQuestion: {
      type: Number,
      default: 0,
    },
    startTime: Date,
    endTime: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
