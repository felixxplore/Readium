import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BlogFeedPage from "../pages/BlogFeedPage";
import { getAllPosts } from "../api/getApi";

const PAGE_SIZE = 10;

/**
 * BlogFeedContainer
 *
 * Handles data fetching for the public blog feed using "Load More" pagination:
 * - Fetches page 0 on mount
 * - "Load More" click fetches the next page and appends results
 * - Search resets the list and starts from page 0 again
 */
export default function BlogFeedContainer() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0); // backend is 0-indexed
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // initial full-page load
  const [isLoadingMore, setIsLoadingMore] = useState(false); // load-more button load
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // NOTE: replace with real auth state once login flow is wired up
  const isAuthenticated = false;

  const hasMore = page < totalPages - 1;

  const fetchPosts = useCallback(async (pageNumber, { append }) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await getAllPosts(pageNumber, PAGE_SIZE);
      const data = response.data; // Page<BlogPostResponse>

      setPosts((prev) =>
        append ? [...prev, ...(data.content || [])] : data.content || [],
      );
      setTotalPages(data.totalPages || 1);
      setPage(data.number ?? 0);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Something went wrong while loading posts. Please try again.");
      if (!append) setPosts([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(0, { append: false });
  }, [fetchPosts]);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    fetchPosts(page + 1, { append: true });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // TODO: wire up real search endpoint once backend is ready
    if (!query) {
      fetchPosts(0, { append: false });
    }
  };

  // Only show the featured hero on the very first load (page 0) while not searching
  const featuredPost =
    !searchQuery && page === 0 && posts.length > 0 ? posts[0] : null;

  const handlePostClick = (postId) => navigate(`/post/${postId}`);
  const handleFeaturedPostClick = (postId) => navigate(`/post/${postId}`);
  const handleWriteClick = () => navigate("/create-post");
  const handleLoginClick = () => navigate("/login");
  const handleSignupClick = () => navigate("/signup");
  const handleChatClick = () => {
    // TODO: hook up to a real contact/chat flow later
    console.log("Chat to us clicked");
  };
  const handleGetStartedClick = () => navigate("/signup");

  if (error && posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Couldn't load posts
          </p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchPosts(0, { append: false })}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <BlogFeedPage
      posts={posts}
      isLoading={isLoading}
      isAuthenticated={isAuthenticated}
      searchQuery={searchQuery}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      featuredPost={featuredPost}
      onSearch={handleSearch}
      onLoadMore={handleLoadMore}
      onPostClick={handlePostClick}
      onFeaturedPostClick={handleFeaturedPostClick}
      onWriteClick={handleWriteClick}
      onLoginClick={handleLoginClick}
      onSignupClick={handleSignupClick}
      onChatClick={handleChatClick}
      onGetStartedClick={handleGetStartedClick}
    />
  );
}
