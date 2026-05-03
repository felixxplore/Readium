// pages/Login.tsx
import { loginUser } from "../features/auth/authThunks";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { useAppDispatch } from "../app/hooks";
import { useState } from "react";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const res = await dispatch(loginUser({ email, password })).unwrap();
      if (res.hasUsername) {
        navigate("/home");
      } else {
        navigate("/username");
      }
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-sm w-full text-center space-y-8">
        <h2 className="text-3xl font-serif font-bold text-gray-900">Welcome back.</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-sm font-medium text-gray-700">Your email</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full mt-1 border-b border-gray-300 focus:border-black outline-none py-2 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input 
              name="password" 
              type="password" 
              required
              className="w-full mt-1 border-b border-gray-300 focus:border-black outline-none py-2 transition-colors"
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-black text-white rounded-full py-3 mt-6 hover:bg-gray-800 transition-all disabled:bg-gray-400"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-600">
          No account? <Link to="/register" className="text-green-700 font-bold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}