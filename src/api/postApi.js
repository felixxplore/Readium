import axiosInstance from "./Axiosinstance";

/**
 * Create a new post. Auth required (Bearer token attached automatically).
 * Backend: POST /api/post
 * Body: CreatePostRequest { title, subtitle, excerpt, coverImage, tags, content }
 */
export const createPost = (postData) => {
  return axiosInstance.post("/post", postData);
};






