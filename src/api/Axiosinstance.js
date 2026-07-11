import axios from "axios";

// Central axios instance - all API calls go through this.
// If backend URL changes (e.g. moving to production), change it only here.
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // needed since your backend sets auth cookies (access/refresh tokens)
});

export default axiosInstance;
