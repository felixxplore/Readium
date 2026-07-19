import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Central axios instance - all API calls go through this.
// If backend URL changes (e.g. moving to production), change it only here.
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshRequest = null;

const clearStoredAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

const storeAuthTokens = (data) => {
  if (data?.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }

  if (data?.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
};

const refreshAuthTokens = () => {
  if (!refreshRequest) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      clearStoredAuth();
      return Promise.reject(new Error("Missing refresh token"));
    }

    refreshRequest = axios
      .post(`${API_BASE_URL}/auth/refresh`, null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })
      .then((response) => {
        storeAuthTokens(response.data);
        return response;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || "";
    const isAuthRequest =
      requestUrl.includes("/auth/google") || requestUrl.includes("/auth/refresh");

    if (
      ![401, 403].includes(status) ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshAuthTokens();
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearStoredAuth();
      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
