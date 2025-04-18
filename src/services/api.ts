import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_LOCAL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
