import axios from 'axios';

// Backend API Base URL
// Can be overridden by environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to inject JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to intercept 401 Unauthorized errors and force logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if user session is expired
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Health Profile endpoints
export const healthAPI = {
  getProfile: async () => {
    const response = await api.get('/health/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.post('/health/profile', profileData);
    return response.data;
  },
};

// Nutrition Calculator endpoints
export const nutritionAPI = {
  getFoods: async (query = '') => {
    const response = await api.get(`/nutrition/foods?query=${query}`);
    return response.data;
  },
  calculate: async (items) => {
    const response = await api.post('/nutrition/calculate', { items });
    return response.data;
  },
};

// Recommendation & Diet Plan endpoints
export const recommendationAPI = {
  getSummary: async () => {
    const response = await api.get('/recommendations/summary');
    return response.data;
  },
  getDietPlan: async () => {
    const response = await api.get('/recommendations/diet-plan');
    return response.data;
  },
};

// AI Assistant endpoints
export const aiAPI = {
  chat: async (message, chatHistory = []) => {
    const response = await api.post('/ai/chat', { message, chatHistory });
    return response.data;
  },
};

export default api;
