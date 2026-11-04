import axios from 'axios';

// In dev with Vite proxy or fullstack server, base URL is empty or from env
const baseURL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessable_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired token if needed
      // localStorage.removeItem('accessable_token');
    }
    return Promise.reject(error);
  }
);

export default api;
