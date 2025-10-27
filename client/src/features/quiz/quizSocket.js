import { getSocket } from "../../services/socket";

export const quizSocket = {
  // Submit answer
  submitAnswer: (
    roomCode,
    userId,
    questionIndex,
    selectedAnswer,
    timeSpent
  ) => {
    const socket = getSocket();
    socket.emit("submit-answer", {
      roomCode,
      userId,
      questionIndex,
      selectedAnswer,
      timeSpent,
    });
  },

  // Listen to new question
  onNewQuestion: (callback) => {
    const socket = getSocket();
    socket.on("new-question", callback);
  },

  // Listen to answer result
  onAnswerResult: (callback) => {
    const socket = getSocket();
    socket.on("answer-result", callback);
  },

  // Listen to question results
  onQuestionResults: (callback) => {
    const socket = getSocket();
    socket.on("question-results", callback);
  },

  // Listen to game ended
  onGameEnded: (callback) => {
    const socket = getSocket();
    socket.on("game-ended", callback);
  },

  // Listen to error
  onError: (callback) => {
    const socket = getSocket();
    socket.on("error", callback);
  },

  // Remove all listeners
  removeAllListeners: () => {
    const socket = getSocket();
    socket.off("new-question");
    socket.off("answer-result");
    socket.off("question-results");
    socket.off("game-ended");
    socket.off("error");
  },
};

export default quizSocket;
