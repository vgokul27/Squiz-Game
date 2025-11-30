import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    wrongAnswers: {
      type: Number,
      required: true,
    },
    rank: Number,
    timeTaken: Number, // in seconds
    answers: [
      {
        questionIndex: Number,
        selectedAnswer: Number,
        correctAnswer: Number,
        isCorrect: Boolean,
        timeSpent: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
