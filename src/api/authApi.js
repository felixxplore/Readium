import axiosInstance from "./Axiosinstance";

/**
 * Exchange a Google idToken for app tokens + user profile.
 * Backend: POST /api/auth/google
 * Body: { idToken }
 * Response: { accessToken, refreshToken, user }
 */
export const googleLogin = (idToken) => {
  return axiosInstance.post("/auth/google", { idToken });
};

/**
 * Refresh auth tokens.
 * Header: Authorization: Bearer {refreshToken}
 * Response: { accessToken, refreshToken }
 */
export const refreshAuth = (refreshToken) => {
  return axiosInstance.post("/auth/refresh", null, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
};
