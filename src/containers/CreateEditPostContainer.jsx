import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostEditor from "../pages/PostEditor";
import { getPostById } from "../api/getApi";
import { createPost } from "../api/postApi";
import { updatePost } from "../api/putApi";
import { useAuth } from "../context/AuthContext";

export default function CreateEditPostContainer() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user, isAuthenticated, triggerGoogleSignIn } = useAuth();

  const mode = postId ? "edit" : "create";
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    if (mode !== "edit") return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getPostById(postId);
      setInitialData(response.data);
    } catch (err) {
      console.error("Error loading post for edit:", err);
      setError("Could not load this post for editing.");
    } finally {
      setIsLoading(false);
    }
  }, [mode, postId]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!isAuthenticated || !accessToken) {
      triggerGoogleSignIn();
      navigate("/");
      return;
    }

    queueMicrotask(fetchPost);
  }, [fetchPost, isAuthenticated, navigate, triggerGoogleSignIn]);

  const handleSubmit = async (postData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response =
        mode === "edit"
          ? await updatePost(postId, postData)
          : await createPost(postData);

      const savedPostId = response.data?.id || postId;
      navigate(savedPostId ? `/post/${savedPostId}` : "/dashboard");
    } catch (err) {
      console.error("Error saving post:", err);
      setError("Could not save your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-gray-600">Loading editor...</p>
      </div>
    );
  }

  return (
    <PostEditor
      mode={mode}
      initialData={initialData}
      authorName={user?.name || user?.username || "Author"}
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
      onDashboardClick={() => navigate("/dashboard")}
    />
  );
}
