// import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import BlogFeedPage from "../pages/BlogFeedPage";
// import { getAllPosts, searchPosts } from "../api/getApi";

// const PAGE_SIZE = 10;

// /**
//  * BlogFeedContainer
//  *
//  * Handles data fetching for the public blog feed using "Load More" pagination.
//  * Supports both the default feed and search (same pagination pattern for both).
//  *
//  * featuredPost is stored in its own state, set ONCE from the very first feed
//  * fetch (page 0, no search query) and never overwritten afterwards - this is
//  * what keeps it visible even after "Load More" bumps the page forward.
//  */
// export default function BlogFeedContainer() {
//   const navigate = useNavigate();

//   const [posts, setPosts] = useState([]);
//   const [featuredPost, setFeaturedPost] = useState(null);
//   const [page, setPage] = useState(0); // backend is 0-indexed
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   // NOTE: replace with real auth state once login flow is wired up
//   const isAuthenticated = false;

//   const hasMore = page < totalPages - 1;

//   const fetchPosts = useCallback(async (pageNumber, { append, query }) => {
//     if (append) {
//       setIsLoadingMore(true);
//     } else {
//       setIsLoading(true);
//     }
//     setError(null);

//     try {
//       const response = query
//         ? await searchPosts(query, pageNumber, PAGE_SIZE)
//         : await getAllPosts(pageNumber, PAGE_SIZE);

//       const data = response.data; // Page<BlogPostResponse>

//       setPosts((prev) =>
//         append ? [...prev, ...(data.content || [])] : data.content || [],
//       );
//       setTotalPages(data.totalPages || 1);
//       setPage(data.number ?? 0);

//       // Set featured post only once: first-ever feed load (no query, no append)
//       if (!query && !append && pageNumber === 0) {
//         setFeaturedPost(data.content?.[0] ?? null);
//       }
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//       setError("Something went wrong while loading posts. Please try again.");
//       if (!append) setPosts([]);
//     } finally {
//       setIsLoading(false);
//       setIsLoadingMore(false);
//     }
//   }, []);

//   // Initial load
//   useEffect(() => {
//     fetchPosts(0, { append: false, query: "" });
//   }, [fetchPosts]);

//   const handleLoadMore = () => {
//     if (isLoadingMore || !hasMore) return;
//     fetchPosts(page + 1, { append: true, query: searchQuery });
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     fetchPosts(0, { append: false, query });
//   };

//   const handlePostClick = (postId) => navigate(`/post/${postId}`);
//   const handleFeaturedPostClick = (postId) => navigate(`/post/${postId}`);
//   const handleWriteClick = () => navigate("/create-post");
//   const handleLoginClick = () => navigate("/login");
//   const handleSignupClick = () => navigate("/signup");
//   const handleChatClick = () => {
//     // TODO: hook up to a real contact/chat flow later
//     console.log("Chat to us clicked");
//   };
//   const handleGetStartedClick = () => navigate("/signup");

//   if (error && posts.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <p className="text-lg font-semibold text-gray-900 mb-2">
//             Couldn't load posts
//           </p>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => fetchPosts(0, { append: false, query: searchQuery })}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Try again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <BlogFeedPage
//       posts={posts}
//       isLoading={isLoading}
//       isAuthenticated={isAuthenticated}
//       searchQuery={searchQuery}
//       hasMore={hasMore}
//       isLoadingMore={isLoadingMore}
//       featuredPost={featuredPost}
//       onSearch={handleSearch}
//       onLoadMore={handleLoadMore}
//       onPostClick={handlePostClick}
//       onFeaturedPostClick={handleFeaturedPostClick}
//       onWriteClick={handleWriteClick}
//       onLoginClick={handleLoginClick}
//       onSignupClick={handleSignupClick}
//       onChatClick={handleChatClick}
//       onGetStartedClick={handleGetStartedClick}
//     />
//   );
// }

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BlogFeedPage from "../pages/BlogFeedPage";
import { getAllPosts, searchPosts } from "../api/getApi";

const PAGE_SIZE = 10;
const POPULAR_COUNT = 5;

/**
 * BlogFeedContainer
 *
 * Handles data fetching for the public blog feed using "Load More" pagination.
 * Supports both the default feed and search (same pagination pattern for both).
 *
 * popularPosts (used to drive the hero carousel) is derived from the first
 * feed load only - the top POPULAR_COUNT posts by likeCount from that page.
 * It's stored in its own state so it stays stable across Load More clicks
 * and only clears while a search is active (the UI hides it during search too).
 */
export default function BlogFeedContainer() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [page, setPage] = useState(0); // backend is 0-indexed
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // NOTE: replace with real auth state once login flow is wired up
  const isAuthenticated = false;

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

      const data = response.data; // Page<BlogPostResponse>
      const content = data.content || [];

      setPosts((prev) => (append ? [...prev, ...content] : content));
      setTotalPages(data.totalPages || 1);
      setPage(data.number ?? 0);

      // Derive popularPosts once, from the very first feed load only
      // (no query, no append, first page) - sorted by likeCount descending.
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

  // Initial load
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
  const handleLoginClick = () => navigate("/login");
  const handleSignupClick = () => navigate("/signup");

  // Maps the navbar's onNavigate('home' | 'authors' | 'about') to real routes.
  // Update these paths once those pages/containers exist.
  const handleNavigate = (destination) => {
    switch (destination) {
      case "home":
        navigate("/");
        break;
      case "authors":
        navigate("/authors"); // TODO: build this route later
        break;
      case "about":
        navigate("/about"); // TODO: build this route later
        break;
      default:
        break;
    }
  };

  if (error && posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
        <div className="text-center">
          <p className="text-lg font-semibold text-[#1a1c1c] mb-2">Couldn't load posts</p>
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
      onLoginClick={handleLoginClick}
      onSignupClick={handleSignupClick}
      onNavigate={handleNavigate}
    />
  );
}
