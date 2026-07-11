import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const validateEmail = (email) => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Password is required";
  return "";
};

export default function LoginPage({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Stub: Replace with actual API call
      // formData: { email, password }
      console.log("[LoginPage] Calling handleLogin with:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // IMPORTANT: Backend returns { hasUsername: boolean }
      // If hasUsername is false, navigate to "/set-username"
      // If hasUsername is true, navigate to "/feed"
      //
      // Example implementation in parent component:
      // const handleLoginSuccess = (hasUsername) => {
      //   if (hasUsername) {
      //     navigate('/feed');
      //   } else {
      //     navigate('/set-username');
      //   }
      // };

      // For now, simulate response
      const mockResponse = { hasUsername: Math.random() > 0.5 };
      if (onLoginSuccess) {
        onLoginSuccess(mockResponse.hasUsername);
      }

      console.log(
        "[LoginPage] Login successful. hasUsername:",
        mockResponse.hasUsername,
      );
    } catch (error) {
      // Handle specific error types from backend
      const message = error.message || "Login failed. Please try again.";

      // Check for specific error conditions
      if (message.toLowerCase().includes("not verified")) {
        setApiError(
          "Your email is not verified yet. Please check your email for a verification link.",
        );
      } else if (
        message.toLowerCase().includes("invalid") ||
        message.toLowerCase().includes("incorrect")
      ) {
        setApiError("Invalid email or password. Please try again.");
      } else {
        setApiError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{apiError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all ${
                  errors.email
                    ? "border-red-300 focus:ring-red-500 focus:ring-2 focus:border-transparent"
                    : "border-gray-300 focus:ring-indigo-500 focus:ring-2 focus:border-transparent"
                } outline-none`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all pr-10 ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500 focus:ring-2 focus:border-transparent"
                      : "border-gray-300 focus:ring-indigo-500 focus:ring-2 focus:border-transparent"
                  } outline-none`}
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
