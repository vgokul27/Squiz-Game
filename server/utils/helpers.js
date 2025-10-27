module.exports = {
  formatDate: (date) => {
    return new Date(date).toLocaleString();
  },
  generateRandomString: (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },
  calculateScore: (correctAnswers, totalQuestions) => {
    return ((correctAnswers / totalQuestions) * 100).toFixed(2);
  },
  // Generate unique room code
  generateRoomCode: () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  },
  // Calculate score based on time taken
  calculateScore: (isCorrect, basePoints, timeSpent, timeLimit) => {
    if (!isCorrect) return 0;

    // Bonus points for quick answers (up to 50% bonus)
    const timeBonus = Math.max(0, ((timeLimit - timeSpent) / timeLimit) * 0.5);
    return Math.round(basePoints * (1 + timeBonus));
  },
  // Sort players by score
  sortPlayersByScore: (players) => {
    return players.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, sort by time (faster is better)
      const aTime = a.answers.reduce((sum, ans) => sum + ans.timeSpent, 0);
      const bTime = b.answers.reduce((sum, ans) => sum + ans.timeSpent, 0);
      return aTime - bTime;
    });
  },
};
