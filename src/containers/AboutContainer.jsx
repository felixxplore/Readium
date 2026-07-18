import { useNavigate } from "react-router-dom";
import AboutPage from "../pages/AboutPage";

export default function AboutContainer() {
  const navigate = useNavigate();

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

  return <AboutPage onNavigate={handleNavigate} />;
}
