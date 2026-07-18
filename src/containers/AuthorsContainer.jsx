import { useNavigate } from "react-router-dom";
import AuthorsPage from "../pages/AuthorsPage";
import { useAuth } from "../context/AuthContext";

export default function AuthorsContainer() {
  const navigate = useNavigate();
  const { isAuthenticated, triggerGoogleSignIn } = useAuth();

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

  return (
    <AuthorsPage
      onNavigate={handleNavigate}
      onSignInClick={triggerGoogleSignIn}
      isAuthenticated={isAuthenticated}
    />
  );
}
