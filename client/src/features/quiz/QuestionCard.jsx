import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, Users } from "lucide-react";
import useUserStore from "../../store/userSlice";
import useQuizStore from "../../store/quizSlice";
import quizSocket from "./quizSocket";
import toast from "react-hot-toast";

const QuestionCard = ({ roomCode }) => {
  const { user } = useUserStore();
  const {
    currentQuestion,
    questionIndex,
    players,
    myScore,
    isAnswered,
    setIsAnswered,
    setMyScore,
    updatePlayerScore,
  } = useQuizStore();

  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [questionResults, setQuestionResults] = useState(null);

  useEffect(() => {
    setupQuizListeners();

    return () => {
      quizSocket.removeAllListeners();
    };
  }, []);

  const setupQuizListeners = () => {
    // New question
    quizSocket.onNewQuestion((data) => {
      setQuestion(data.question);
      setTimeLeft(data.question.timeLimit);
      setStartTime(Date.now());
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowResults(false);
      setAnswerResult(null);
      setQuestionResults(null);
    });

    // Answer result
    quizSocket.onAnswerResult((data) => {
      setAnswerResult(data);
      setMyScore(data.totalScore);
      setIsAnswered(true);

      if (data.isCorrect) {
        toast.success(`Correct! +${data.points} points`);
      } else {
        toast.error("Wrong answer!");
      }
    });

    // Question results
    quizSocket.onQuestionResults((data) => {
      setQuestionResults(data);
      setShowResults(true);

      // Update all player scores
      data.results.forEach((result) => {
        updatePlayerScore(result.userId, result.score);
      });
    });
  };

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1 && !isAnswered) {
            handleSubmit(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isAnswered]);

  const handleSelectAnswer = (index) => {
    if (isAnswered || showResults) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = (answer) => {
    if (isAnswered) return;

    const timeSpent = startTime
      ? (Date.now() - startTime) / 1000
      : question?.timeLimit || 30;

    quizSocket.submitAnswer(
      roomCode,
      user._id,
      questionIndex,
      answer,
      timeSpent
    );
  };

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading question...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (timeLeft / question.timeLimit) * 100;
  const sortedPlayers = [...players].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-white">
              Question {questionIndex + 1}
            </div>
            <div className="px-4 py-2 bg-primary-500/20 border border-primary-500 rounded-lg">
              <span className="text-primary-500 font-bold">
                {question.points} points
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary-500" />
            <span className="text-white font-bold text-xl">{myScore}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question & Answers */}
          <div className="lg:col-span-3 space-y-6">
            {/* Timer */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-neon"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Clock
                    className={`w-6 h-6 ${
                      timeLeft <= 5 ? "text-red-500" : "text-primary-500"
                    }`}
                  />
                  <span
                    className={`text-2xl font-bold ${
                      timeLeft <= 5 ? "text-red-500" : "text-white"
                    }`}
                  >
                    {timeLeft}s
                  </span>
                </div>
                <span className="text-dark-500">Time Remaining</span>
              </div>
              <div className="h-3 bg-dark-50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: `${progressPercentage}%` }}
                  className={`h-full ${
                    timeLeft <= 5 ? "bg-red-500" : "bg-gradient-purple"
                  }`}
                />
              </div>
            </motion.div>

            {/* Question */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-neon"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {question.question}
              </h2>

              {/* Show Results */}
              <AnimatePresence mode="wait">
                {showResults && questionResults ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-dark-50 border-2 border-primary-500 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        Correct Answer:
                      </h3>
                      <p className="text-2xl text-primary-500 font-bold">
                        {question.options[questionResults.correctAnswer]}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((option, index) => {
                        const isCorrect =
                          index === questionResults.correctAnswer;
                        const playerAnswers = questionResults.results.filter(
                          (r) => r.answer === index
                        ).length;

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border-2 ${
                              isCorrect
                                ? "bg-green-500/20 border-green-500"
                                : "bg-dark-50 border-dark-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-white font-semibold">
                                {option}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-dark-500" />
                                <span className="text-dark-500 text-sm">
                                  {playerAnswers}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const showResult = isAnswered && answerResult;
                      const isCorrectAnswer =
                        showResult && index === answerResult.correctAnswer;
                      const isWrongAnswer =
                        showResult && isSelected && !answerResult.isCorrect;

                      return (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={!isAnswered ? { scale: 1.02 } : {}}
                          whileTap={!isAnswered ? { scale: 0.98 } : {}}
                          onClick={() => handleSelectAnswer(index)}
                          disabled={isAnswered || showResults}
                          className={`p-6 rounded-lg border-2 text-left font-semibold text-lg transition-all ${
                            isCorrectAnswer
                              ? "bg-green-500/20 border-green-500 text-green-500"
                              : isWrongAnswer
                              ? "bg-red-500/20 border-red-500 text-red-500"
                              : isSelected
                              ? "bg-primary-500/20 border-primary-500 text-primary-500"
                              : "bg-dark-50 border-dark-200 text-white hover:border-primary-500"
                          } ${
                            isAnswered || showResults
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {isSelected && !showResult && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 bg-primary-500 rounded-full"
                              />
                            )}
                            {isCorrectAnswer && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-2xl"
                              >
                                ✓
                              </motion.div>
                            )}
                            {isWrongAnswer && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-2xl"
                              >
                                ✗
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              {!isAnswered && !showResults && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubmit(selectedAnswer)}
                  disabled={selectedAnswer === null}
                  className={`w-full mt-6 btn-primary ${
                    selectedAnswer === null
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Submit Answer
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-neon sticky top-24"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary-500" />
                <span>Live Scores</span>
              </h3>

              <div className="space-y-3">
                {sortedPlayers.map((player, index) => {
                  const playerId = player.userId?._id || player.userId;
                  const isCurrentUser = playerId === user._id;

                  return (
                    <motion.div
                      key={playerId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isCurrentUser
                          ? "bg-primary-500/20 border border-primary-500"
                          : "bg-dark-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-dark-50"
                              : index === 1
                              ? "bg-gray-400 text-dark-50"
                              : index === 2
                              ? "bg-orange-500 text-dark-50"
                              : "bg-dark-100 text-dark-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span
                          className={`font-semibold ${
                            isCurrentUser ? "text-primary-500" : "text-white"
                          }`}
                        >
                          {player.username}
                        </span>
                      </div>
                      <span
                        className={`font-bold ${
                          isCurrentUser ? "text-primary-500" : "text-white"
                        }`}
                      >
                        {player.score || 0}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
