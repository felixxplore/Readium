import axiosInstance from "./Axiosinstance";

/**
 * Delete a post. Auth required.
 * Backend: DELETE /api/post/{id}
 */
export const deletePost = (postId) => {
  return axiosInstance.delete(`/post/${postId}`);
};
