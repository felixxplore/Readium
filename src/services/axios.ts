// services/axios.ts
import axios from "axios";
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🔥 required for cookies
});

// services/axios.ts
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);                                                                                                                                                                                                                           
      } catch (err) {
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;