import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthorDashboard from "../pages/AuthorDashboard";
import { getPostsByAuthor } from "../api/getApi";
import { deletePost } from "../api/deleteApi";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 10;

export default function AuthorDashboardContainer() {
  const navigate = useNavigate();
  const { user, isAuthenticated, triggerGoogleSignIn } = useAuth();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const username = user?.name || user?.username || user?.email;
  const hasMore = page < totalPages - 1;

  const fetchAuthorPosts = useCallback(
    async (pageNumber, { append } = { append: false }) => {
      if (!username) return;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await getPostsByAuthor(username, pageNumber, PAGE_SIZE);
        const data = response.data;
        const content = data.content || [];

        setPosts((prev) => (append ? [...prev, ...content] : content));
        setTotalPages(data.totalPages || 1);
        setPage(data.number ?? 0);
      } catch (err) {
        console.error("Error fetching author posts:", err);
        if (!append) setPosts([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [username],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      triggerGoogleSignIn();
      navigate("/");
      return;
    }

    queueMicrotask(() => fetchAuthorPosts(0));
  }, [fetchAuthorPosts, isAuthenticated, navigate, triggerGoogleSignIn]);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    fetchAuthorPosts(page + 1, { append: true });
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const visiblePosts = searchQuery
    ? posts.filter((post) => {
        const query = searchQuery.toLowerCase();
        return (
          post.title?.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query)
        );
      })
    : posts;

  return (
    <AuthorDashboard
      posts={visiblePosts}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore && !searchQuery}
      authorName={user?.name || user?.username || "Author"}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      onLoadMore={handleLoadMore}
      onEditPost={(postId) => navigate(`/edit-post/${postId}`)}
      onDeletePost={handleDeletePost}
      onPostClick={(postId) => navigate(`/post/${postId}`)}
    />
  );
}
