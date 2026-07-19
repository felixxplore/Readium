import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostDetail from "../pages/PostDetail";
import { getPostById } from "../api/getApi";
import { deletePost } from "../api/deleteApi";
import { useAuth } from "../context/AuthContext";

export default function PostDetailContainer() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user, isAuthenticated, triggerGoogleSignIn } = useAuth();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getPostById(postId);
      setPost(response.data);
    } catch (err) {
      console.error("Error fetching post:", err);
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    queueMicrotask(fetchPost);
  }, [fetchPost]);

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

  const handleDeleteConfirm = async () => {
    try {
      await deletePost(postId);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const postAuthor = post?.author;
  const isOwner =
    isAuthenticated &&
    !!postAuthor &&
    (postAuthor.username === user?.username || postAuthor.id === user?.id);

  return (
    <PostDetail
      post={post}
      isLoading={isLoading}
      isOwner={isOwner}
      isAuthenticated={isAuthenticated}
      onEditClick={() => navigate(`/edit-post/${postId}`)}
      onDeleteConfirm={handleDeleteConfirm}
      onAuthorClick={() => navigate("/authors")}
      onBackClick={() => navigate(-1)}
      onNavigate={handleNavigate}
      onSignInClick={triggerGoogleSignIn}
      onWriteClick={() => navigate("/create-post")}
    />
  );
}
