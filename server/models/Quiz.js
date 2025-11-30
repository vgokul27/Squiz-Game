import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, "{PATH} must have exactly 4 options"],
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  points: {
    type: Number,
    default: 10,
  },
  timeLimit: {
    type: Number,
    default: 30,
  },
});

function arrayLimit(val) {
  return val.length === 4;
}

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "General Knowledge",
        "Science",
        "Mathematics",
        "History",
        "Geography",
        "Sports",
        "Technology",
        "Entertainment",
        "Literature",
        "Arts",
        "Business",
        "Politics",
      ],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    timesPlayed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
