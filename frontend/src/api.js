import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired token (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("🚨 Token expired. Refreshing...");

      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      if (!refreshToken) {
        console.error("No refresh token found. Logging out...");
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        if (res.status === 200) {
          const newAccessToken = res.data.access;
          localStorage.setItem(ACCESS_TOKEN, newAccessToken);
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config); // Retry original request that failed with 401 Unauthorized 
        }
      } catch (refreshError) {
        console.error("🚨 Token refresh failed. Logging out...");
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/login"; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;