import { createContext, useContext, useEffect, useRef, useState } from "react";
import { googleLogin } from "../api/authApi";

const AuthContext = createContext(null);

// TODO: move this to an environment variable (VITE_GOOGLE_CLIENT_ID) instead
// of hardcoding it, especially before deploying anywhere public.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Hidden container where Google's real button gets rendered.
  // We trigger a click on it programmatically from our own styled
  // "Sign in" buttons anywhere in the app - this is the standard trick
  // for using Google Identity Services with a custom-styled trigger.
  const hiddenGoogleButtonRef = useRef(null);

  const isAuthenticated = !!user;

  // Restore session on app load (if we previously stored a user)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setIsInitializing(false);
  }, []);

  // Initialize Google Identity Services once the script (loaded via
  // index.html's <script src="https://accounts.google.com/gsi/client">)
  // is available.
  useEffect(() => {
    const initGoogle = () => {
      if (!window.google || !hiddenGoogleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(hiddenGoogleButtonRef.current, {
        theme: "outline",
        size: "large",
      });
    };

    // The script loads async/defer, so poll briefly until it's ready.
    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    const idToken = response.credential;
    setAuthError(null);

    try {
      const res = await googleLogin(idToken);
      const authData = res.data?.data || res.data;
      const { accessToken, refreshToken, user: userProfile } = authData;

      if (!accessToken || !refreshToken || !userProfile) {
        throw new Error("Invalid authentication response");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userProfile));

      setUser(userProfile);
    } catch (err) {
      console.error("Google login failed:", err);
      setAuthError("Google sign-in failed. Please try again.");
    }
  };

  // Called by any "Sign in" / "SIGN IN" button anywhere in the app.
  const triggerGoogleSignIn = () => {
    const realGoogleButton =
      hiddenGoogleButtonRef.current?.querySelector('div[role="button"]');
    if (realGoogleButton) {
      realGoogleButton.click();
    } else {
      console.warn(
        "Google Sign-In button not ready yet. Try again in a moment.",
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isInitializing,
        authError,
        triggerGoogleSignIn,
        logout,
      }}
    >
      {/* Hidden real Google button - never shown to the user directly,
          only triggered programmatically. Kept off-screen but still
          rendered (display:none breaks Google's click handling, so we
          use visibility/position tricks instead). */}
      <div
        ref={hiddenGoogleButtonRef}
        style={{ position: "fixed", top: "-9999px", left: "-9999px" }}
        aria-hidden="true"
      />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
