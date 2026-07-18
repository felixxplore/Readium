import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BlogFeedPage from "../pages/BlogFeedPage";
import { getAllPosts, searchPosts } from "../api/getApi";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 10;
const POPULAR_COUNT = 5;

export default function BlogFeedContainer() {
  const navigate = useNavigate();
  const { isAuthenticated, triggerGoogleSignIn } = useAuth();

  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const hasMore = page < totalPages - 1;

  const fetchPosts = useCallback(async (pageNumber, { append, query }) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = query
        ? await searchPosts(query, pageNumber, PAGE_SIZE)
        : await getAllPosts(pageNumber, PAGE_SIZE);

      const data = response.data;
      const content = data.content || [];

      setPosts((prev) => (append ? [...prev, ...content] : content));
      setTotalPages(data.totalPages || 1);
      setPage(data.number ?? 0);

      if (!query && !append && pageNumber === 0) {
        const sorted = [...content]
          .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
          .slice(0, POPULAR_COUNT);
        setPopularPosts(sorted);
      }
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
    fetchPosts(0, { append: false, query: "" });
  }, [fetchPosts]);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    fetchPosts(page + 1, { append: true, query: searchQuery });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchPosts(0, { append: false, query });
  };

  const handlePostClick = (postId) => navigate(`/post/${postId}`);
  const handleFeaturedPostClick = (postId) => navigate(`/post/${postId}`);
  const handleWriteClick = () => navigate("/create-post");

  const handleNavigate = (destination) => {
    switch (destination) {
      case "home":
        navigate("/");
        break;
      case "authors":
        navigate("/authors");
        break;
      case "about":
        navigate("/about");
        break;
      default:
        break;
    }
  };

  if (error && posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
        <div className="text-center">
          <p className="text-lg font-semibold text-[#1a1c1c] mb-2">
            Couldn't load posts
          </p>
          <p className="text-[#444748] mb-4">{error}</p>
          <button
            onClick={() => fetchPosts(0, { append: false, query: searchQuery })}
            className="px-6 py-2 bg-black text-white text-sm font-medium rounded-sm hover:bg-gray-900 transition-colors"
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
      popularPosts={popularPosts}
      onSearch={handleSearch}
      onLoadMore={handleLoadMore}
      onPostClick={handlePostClick}
      onFeaturedPostClick={handleFeaturedPostClick}
      onWriteClick={handleWriteClick}
      onLoginClick={triggerGoogleSignIn}
      onSignupClick={triggerGoogleSignIn}
      onNavigate={handleNavigate}
    />
  );
}
