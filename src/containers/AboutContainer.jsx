import { useNavigate } from "react-router-dom";
import AboutPage from "../pages/AboutPage";
import { useAuth } from "../context/AuthContext";

export default function AboutContainer() {
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
    <AboutPage
      onNavigate={handleNavigate}
      onSignInClick={triggerGoogleSignIn}
      isAuthenticated={isAuthenticated}
    />
  );
}
