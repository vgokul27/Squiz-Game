import Room from "../models/Room.js";
import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";
import User from "../models/User.js";
import { calculateScore, sortPlayersByScore } from "../utils/helpers.js";

const quizSocket = (io) => {
  // Store active room timers
  const roomTimers = new Map();

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Join room
    socket.on("join-room", async ({ roomCode, userId }) => {
      try {
        const room = await Room.findOne({ roomCode })
          .populate("quiz")
          .populate("players.userId", "username avatar");

        if (!room) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        // Update player's socket ID
        const playerIndex = room.players.findIndex(
          (p) => p.userId._id.toString() === userId
        );

        if (playerIndex !== -1) {
          room.players[playerIndex].socketId = socket.id;
          await room.save();
        }

        socket.join(roomCode);

        // Send room data to user
        socket.emit("room-joined", room);

        // Notify others
        socket.to(roomCode).emit("player-joined", {
          player: room.players[playerIndex],
          totalPlayers: room.players.length,
        });

        console.log(`User ${userId} joined room ${roomCode}`);
      } catch (error) {
        console.error("Join room error:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Player ready
    socket.on("player-ready", async ({ roomCode, userId }) => {
      try {
        const room = await Room.findOne({ roomCode });

        if (!room) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        // Update player ready status
        const player = room.players.find((p) => p.userId.toString() === userId);

        if (player) {
          player.isReady = true;
          await room.save();

          // Notify all players
          io.to(roomCode).emit("player-ready-update", {
            userId,
            readyPlayers: room.players.filter((p) => p.isReady).length,
            totalPlayers: room.players.length,
          });

          // Check if all players are ready
          const allReady = room.players.every((p) => p.isReady);
          if (allReady && room.players.length >= 2) {
            // Start countdown
            io.to(roomCode).emit("game-starting", { countdown: 5 });

            setTimeout(() => {
              startGame(roomCode, io);
            }, 5000);
          }
        }
      } catch (error) {
        console.error("Player ready error:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Submit answer
    socket.on(
      "submit-answer",
      async ({
        roomCode,
        userId,
        questionIndex,
        selectedAnswer,
        timeSpent,
      }) => {
        try {
          const room = await Room.findOne({ roomCode }).populate("quiz");

          if (!room) {
            socket.emit("error", { message: "Room not found" });
            return;
          }

          const player = room.players.find(
            (p) => p.userId.toString() === userId
          );

          if (!player) {
            socket.emit("error", { message: "Player not found" });
            return;
          }

          // Get correct answer
          const question = room.quiz.questions[questionIndex];
          const isCorrect = question.correctAnswer === selectedAnswer;

          // Calculate score
          const points = calculateScore(
            isCorrect,
            question.points,
            timeSpent,
            question.timeLimit
          );

          // Update player's answer and score
          player.answers.push({
            questionIndex,
            selectedAnswer,
            isCorrect,
            timeSpent,
          });

          if (isCorrect) {
            player.score += points;
          }

          await room.save();

          // Send answer result to player
          socket.emit("answer-result", {
            isCorrect,
            correctAnswer: question.correctAnswer,
            points,
            totalScore: player.score,
          });

          // Check if all players answered
          const allAnswered = room.players.every(
            (p) => p.answers.length === questionIndex + 1
          );

          if (allAnswered) {
            // Show results for this question
            const questionResults = room.players.map((p) => ({
              userId: p.userId,
              username: p.username,
              answer: p.answers[questionIndex].selectedAnswer,
              isCorrect: p.answers[questionIndex].isCorrect,
              score: p.score,
            }));

            io.to(roomCode).emit("question-results", {
              results: questionResults,
              correctAnswer: question.correctAnswer,
            });

            // Move to next question or end game
            setTimeout(() => {
              if (questionIndex + 1 < room.quiz.questions.length) {
                nextQuestion(roomCode, questionIndex + 1, io);
              } else {
                endGame(roomCode, io);
              }
            }, 5000); // 5 seconds to show results
          }
        } catch (error) {
          console.error("Submit answer error:", error);
          socket.emit("error", { message: error.message });
        }
      }
    );

    // Leave room
    socket.on("leave-room", async ({ roomCode, userId }) => {
      try {
        const room = await Room.findOne({ roomCode });

        if (room) {
          // Remove player from room
          room.players = room.players.filter(
            (p) => p.userId.toString() !== userId
          );

          if (room.players.length === 0 || room.host.toString() === userId) {
            // Delete room if empty or host left
            await room.deleteOne();
            io.to(roomCode).emit("room-closed");

            // Clear timer if exists
            if (roomTimers.has(roomCode)) {
              clearTimeout(roomTimers.get(roomCode));
              roomTimers.delete(roomCode);
            }
          } else {
            await room.save();
            io.to(roomCode).emit("player-left", { userId });
          }

          socket.leave(roomCode);
        }
      } catch (error) {
        console.error("Leave room error:", error);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  // Start game
  async function startGame(roomCode, io) {
    try {
      const room = await Room.findOne({ roomCode }).populate("quiz");

      if (!room) return;

      room.status = "in-progress";
      room.startTime = new Date();
      room.currentQuestion = 0;
      await room.save();

      // Send first question
      sendQuestion(roomCode, 0, io);

      console.log(`Game started in room ${roomCode}`);
    } catch (error) {
      console.error("Start game error:", error);
    }
  }

  // Send question
  async function sendQuestion(roomCode, questionIndex, io) {
    try {
      const room = await Room.findOne({ roomCode }).populate("quiz");

      if (!room) return;

      const question = room.quiz.questions[questionIndex];

      // Send question without correct answer
      io.to(roomCode).emit("new-question", {
        questionIndex,
        question: {
          question: question.question,
          options: question.options,
          timeLimit: question.timeLimit,
          points: question.points,
        },
        totalQuestions: room.quiz.questions.length,
      });

      // Set timer for question
      const timer = setTimeout(() => {
        // Auto-move to next question if time runs out
        nextQuestion(roomCode, questionIndex + 1, io);
      }, question.timeLimit * 1000);

      roomTimers.set(roomCode, timer);
    } catch (error) {
      console.error("Send question error:", error);
    }
  }

  // Next question
  async function nextQuestion(roomCode, questionIndex, io) {
    try {
      const room = await Room.findOne({ roomCode }).populate("quiz");

      if (!room) return;

      // Clear previous timer
      if (roomTimers.has(roomCode)) {
        clearTimeout(roomTimers.get(roomCode));
      }

      if (questionIndex < room.quiz.questions.length) {
        room.currentQuestion = questionIndex;
        await room.save();
        sendQuestion(roomCode, questionIndex, io);
      } else {
        endGame(roomCode, io);
      }
    } catch (error) {
      console.error("Next question error:", error);
    }
  }

  // End game
  async function endGame(roomCode, io) {
    try {
      const room = await Room.findOne({ roomCode })
        .populate("quiz")
        .populate("players.userId");

      if (!room) return;

      room.status = "finished";
      room.endTime = new Date();

      // Sort players by score
      const sortedPlayers = sortPlayersByScore([...room.players]);

      // Calculate ranks
      sortedPlayers.forEach((player, index) => {
        player.rank = index + 1;
      });

      await room.save();

      // Save results to database
      const resultPromises = sortedPlayers.map(async (player, index) => {
        const correctAnswers = player.answers.filter((a) => a.isCorrect).length;
        const wrongAnswers = player.answers.length - correctAnswers;
        const timeTaken = player.answers.reduce(
          (sum, a) => sum + a.timeSpent,
          0
        );

        const result = await Result.create({
          room: room._id,
          quiz: room.quiz._id,
          user: player.userId._id,
          score: player.score,
          totalQuestions: room.quiz.questions.length,
          correctAnswers,
          wrongAnswers,
          rank: index + 1,
          timeTaken,
          answers: player.answers,
        });

        // Update user stats
        await User.findByIdAndUpdate(player.userId._id, {
          $inc: {
            totalGamesPlayed: 1,
            totalScore: player.score,
            wins: index === 0 ? 1 : 0,
          },
        });

        return result;
      });

      await Promise.all(resultPromises);

      // Send final results to all players
      const finalResults = sortedPlayers.map((player) => ({
        userId: player.userId._id,
        username: player.userId.username,
        avatar: player.userId.avatar,
        score: player.score,
        correctAnswers: player.answers.filter((a) => a.isCorrect).length,
        rank: player.rank,
      }));

      io.to(roomCode).emit("game-ended", {
        results: finalResults,
        winner: finalResults[0],
      });

      // Clear timer
      if (roomTimers.has(roomCode)) {
        clearTimeout(roomTimers.get(roomCode));
        roomTimers.delete(roomCode);
      }

      console.log(`Game ended in room ${roomCode}`);
    } catch (error) {
      console.error("End game error:", error);
    }
  }
};

export default quizSocket;
