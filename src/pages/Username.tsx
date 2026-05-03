import { useEffect, useState, useMemo, useRef } from "react"; // Added useMemo
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import { useAppDispatch } from "../app/hooks";
import { setUsername } from "../features/auth/authThunks";

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}
 
export default function Username() {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  // 1. Removed: const [normalized, setNormalized] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const dispatch=useAppDispatch();

  const checkIdRef = useRef(0);

  // 2. FIXED: Calculate normalized value directly in the component body
  // useMemo ensures this only recalculates when 'input' actually changes.
  const normalized = useMemo(() => normalizeUsername(input), [input]);

  // 3. REMOVED: The useEffect that was calling setNormalized(n)

  // ⚡ Debounced availability check
  useEffect(() => {
    if (!normalized || normalized.length < 3) return;

    const currentCheckId = ++checkIdRef.current;

    const timer = window.setTimeout(() => {
      // Set available to null while "Checking..."
      setAvailable(null);

      void (async () => {
        try {
          const res = await api.get(
            `/user/check-username?username=${normalized}`,
          );

          if (checkIdRef.current !== currentCheckId) return;
          setAvailable(res.data.available);
        } catch {
          if (checkIdRef.current !== currentCheckId) return;
          setAvailable(false);
        }
      })();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [normalized]);

  // 💡 Fetch suggestions once
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get(`/user/username-suggestions?name=${input}`);
        setSuggestions(res.data[1]);
      } catch {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!normalized || normalized.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (!available) {
      setError("Username is not available");
      return;
    }

    try {
      setLoading(true);
      // Ensure you have setUsername imported from your authSlice
      await dispatch(setUsername(normalized)).unwrap();
      navigate("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          Choose your username
        </h2>

        <input
          name="username"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter username"
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-black outline-none"
        />

        <p className="text-sm text-gray-500">
          Preview:{" "}
          <span className="font-medium text-black">{normalized || "-"}</span>
        </p>

        <div className="text-sm min-h-[20px]">
          {normalized.length > 0 && normalized.length < 3 && (
            <p className="text-yellow-600">⚠️ Minimum 3 characters</p>
          )}
          {normalized.length >= 3 && available === null && (
            <p className="text-gray-500 animate-pulse">Checking...</p>
          )}
          {normalized.length >= 3 && available === true && (
            <p className="text-green-600 font-medium">✅ Available</p>
          )}
          {normalized.length >= 3 && available === false && (
            <p className="text-red-600 font-medium">❌ Taken</p>
          )}
        </div>

        {suggestions.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setInput(s)}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-black hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || normalized.length < 3 || available !== true}
          className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-50 font-medium transition-opacity"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
