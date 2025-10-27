import { create } from "zustand";

const useQuizStore = create((set, get) => ({
  currentRoom: null,
  currentQuiz: null,
  currentQuestion: null,
  questionIndex: 0,
  players: [],
  myScore: 0,
  gameStatus: "waiting", // waiting, starting, in-progress, finished
  timeLeft: 0,
  isAnswered: false,

  setCurrentRoom: (room) => set({ currentRoom: room }),

  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),

  setCurrentQuestion: (question, index) =>
    set({ currentQuestion: question, questionIndex: index, isAnswered: false }),

  setPlayers: (players) => set({ players }),

  addPlayer: (player) =>
    set((state) => ({ players: [...state.players, player] })),

  removePlayer: (userId) =>
    set((state) => ({
      players: state.players.filter((p) => p.userId !== userId),
    })),

  updatePlayerScore: (userId, score) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.userId === userId ? { ...p, score } : p
      ),
    })),

  setMyScore: (score) => set({ myScore: score }),

  incrementMyScore: (points) =>
    set((state) => ({ myScore: state.myScore + points })),

  setGameStatus: (status) => set({ gameStatus: status }),

  setTimeLeft: (time) => set({ timeLeft: time }),

  setIsAnswered: (answered) => set({ isAnswered: answered }),

  nextQuestion: () =>
    set((state) => ({
      questionIndex: state.questionIndex + 1,
      isAnswered: false,
    })),

  resetQuiz: () =>
    set({
      currentRoom: null,
      currentQuiz: null,
      currentQuestion: null,
      questionIndex: 0,
      players: [],
      myScore: 0,
      gameStatus: "waiting",
      timeLeft: 0,
      isAnswered: false,
    }),
}));

export default useQuizStore;
