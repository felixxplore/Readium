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

/**
 * Search posts by query string, paginated.
 * Backend: GET /api/post/search?q=...&page=0&size=10
 * Returns Spring Data Page<BlogPostResponse> shape (same as getAllPosts).
 */
export const searchPosts = (query, page = 0, size = 10) => {
  return axiosInstance.get("/post/search", {
    params: { q: query, page, size },
  });
};