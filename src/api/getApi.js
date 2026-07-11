import axiosInstance from "./Axiosinstance";


/**
 * Fetch a paginated list of all published posts.
 * Backend: GET /api/post?page=0&size=10
 * Returns Spring Data Page<BlogPostResponse> shape:
 * { content, totalPages, totalElements, number, size, first, last, ... }
 */
export const getAllPosts = (page = 0, size = 10) => {
  return axiosInstance.get("/post", {
    params: { page, size },
  });
};

