import axios from "axios";

// Get the backend URL from environment variables, trim whitespace, or default to localhost:7000
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("TEJ_ADMIN_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("TEJ_ADMIN_TOKEN");
      window.dispatchEvent(new Event("adminUnauthorized"));
    }
    return Promise.reject(error);
  },
);

export default api;
