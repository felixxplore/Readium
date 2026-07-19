import axiosInstance from "./Axiosinstance";

/**
 * Update an existing post. Auth required.
 * Backend: PUT /api/post/{id}
 * Body: UpdatePostRequest { title, subtitle, excerpt, coverImage, tags, content }
 */
export const updatePost = (postId, postData) => {
  return axiosInstance.put(`/post/${postId}`, postData);
};
