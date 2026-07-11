import { useState, useCallback } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

const validateUsername = (username) => {
  if (!username) return "Username is required";
  if (username.length < 3 || username.length > 20) {
    return "Username must be 3-20 characters";
  }
  if (!/^[a-z0-9_]+$/.test(username)) {
    return "Username can only contain lowercase letters, numbers, and underscores";
  }
  return "";
};

export default function SetUsernamePage({
  onUsernameChange,
  isChecking = false,
  isAvailable = null,
}) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value.toLowerCase();
      setUsername(value);

      // Clear inline error when user starts typing
      setError("");

      // Validate format
      const validationError = validateUsername(value);
      if (validationError) {
        setError(validationError);
      }

      // Trigger availability check via parent component
      if (value.length >= 3 && !validationError) {
        if (onUsernameChange) {
          onUsernameChange(value);
        }
      }
    },
    [onUsernameChange],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Don't submit if username is not available
    if (isAvailable === false) {
      setError("This username is already taken");
      return;
    }

    // Don't submit if still checking availability
    if (isChecking) {
      return;
    }

    setLoading(true);

    try {
      // Stub: Replace with actual API call
      // Send: { username }
      console.log(
        "[SetUsernamePage] Calling handleSetUsername with:",
        username,
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success state
      setSubmitted(true);

      console.log("[SetUsernamePage] Username set successfully");
    } catch (err) {
      setError(err.message || "Failed to set username. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Username set!
            </h2>
            <p className="text-gray-600">
              You&apos;re all set. Your profile is now ready.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isInvalid = error && error !== "";
  const isValid = username.length >= 3 && isAvailable === true && !error;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Create your profile
            </h1>
            <p className="text-gray-600 mt-2">
              Choose a unique username for your profile
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={handleChange}
                  autoComplete="off"
                  className={`w-full px-4 py-3 rounded-lg border transition-all pr-10 ${
                    isInvalid
                      ? "border-red-300 focus:ring-red-500 focus:ring-2 focus:border-transparent"
                      : isValid
                        ? "border-green-300 focus:ring-green-500 focus:ring-2 focus:border-transparent"
                        : "border-gray-300 focus:ring-indigo-500 focus:ring-2 focus:border-transparent"
                  } outline-none`}
                  placeholder="username"
                />

                {/* Status Icons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isChecking ? (
                    <Loader className="w-5 h-5 text-gray-400 animate-spin" />
                  ) : isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : isInvalid ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : null}
                </div>
              </div>

              {/* Helper text or error message */}
              {error ? (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              ) : username.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">
                  This will be your unique profile URL: yoursite.com/@
                  {username || "username"}
                </p>
              ) : isChecking ? (
                <p className="mt-2 text-sm text-gray-500">
                  Checking availability...
                </p>
              ) : isAvailable === true ? (
                <p className="mt-2 text-sm text-green-600">
                  ✓ yoursite.com/@{username}
                </p>
              ) : isAvailable === false ? (
                <p className="mt-2 text-sm text-gray-500">
                  This username is taken. Try another one.
                </p>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  yoursite.com/@{username || "username"}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isChecking || !isValid}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          {/* Info Text */}
          <p className="mt-6 text-center text-sm text-gray-500">
            You can change your username later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}
