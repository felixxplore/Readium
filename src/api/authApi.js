import axiosInstance from "./axiosInstance";

/**
 * Exchange a Google idToken for our app's access/refresh tokens + user profile.
 * Backend: POST /api/auth/google
 * Body: { idToken }
 * Response: { accessToken, refreshToken, user: UserProfileResponse }
 */
export const googleLogin = (idToken) => {
  return axiosInstance.post("/auth/google", { idToken });
};
