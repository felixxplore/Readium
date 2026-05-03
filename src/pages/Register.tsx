// pages/Register.tsx
import { registerUser } from "../features/auth/authThunks";
import { useAppDispatch } from "../app/hooks";
import {   Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const dispatch = useAppDispatch();
   const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    try {
      await dispatch(registerUser({
        name: form.get("name") as string,
        email: form.get("email") as string,
        password: form.get("password") as string,
      })).unwrap();
      
      // Redirect to a check-email page or show success
      alert("Registration successful! Please check your email.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 text-center">
      <div className="max-w-sm w-full space-y-8">
        <h2 className="text-3xl font-serif font-bold">Join Readium.</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <input 
            name="name" 
            placeholder="Full Name" 
            required
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2"
          />
          <input 
            name="email" 
            type="email"
            placeholder="Email Address" 
            required
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2"
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password"
            required
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2"
          />
          
          <button 
            disabled={loading}
            className="w-full bg-black text-white rounded-full py-3 mt-4 hover:bg-gray-800 transition-all"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm">
          Already have an account? <Link to="/login" className="text-green-700 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}