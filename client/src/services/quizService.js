import api from "./api";

export const quizService = {
  // Create manual quiz
  createQuiz: async (quizData) => {
    const response = await api.post("/quizzes/create", quizData);
    return response.data;
  },

  // Get all quizzes
  getAllQuizzes: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/quizzes?${params}`);
    return response.data;
  },

  // Get quiz by ID
  getQuizById: async (id) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  // Get user's quizzes
  getMyQuizzes: async () => {
    const response = await api.get("/quizzes/user/my-quizzes");
    return response.data;
  },

  // Delete quiz
  deleteQuiz: async (id) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },

  // Generate AI quiz
  generateAIQuiz: async (settings) => {
    const response = await api.post("/quizzes/ai-generate", settings);
    return response.data;
  },

  // Save AI-generated quiz
  saveAIQuiz: async (quizData) => {
    const response = await api.post("/quizzes/ai-save", quizData);
    return response.data;
  },
};
