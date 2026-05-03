import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyUser, resendVerification } from "../features/auth/authThunks";
import { useAppDispatch } from "../app/hooks";

export default function Verify() {
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = params.get("token");
  const emailParam = params.get("email") ?? "";

  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState<string>(() => emailParam);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!token) return;

    dispatch(verifyUser(token))
      .unwrap()
      .then((res) => {
        if (res.hasUsername) {
          navigate("/home");
        } else {
          navigate("/username");
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err?.message || "Verification failed or expired");
      });
  }, [dispatch, navigate, token]);

  // ⏱️ cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      setResendLoading(true);
      await dispatch(resendVerification(email)).unwrap();
      setMessage("Verification email sent again ✅");
      setCooldown(30); // 30 sec cooldown
    } catch {
      setMessage("Failed to resend email");
    } finally {
      setResendLoading(false);
    }
  };

  const tokenMissing = !token;

  // 🔴 ERROR UI
  if (tokenMissing || status === "error") {
    const messageToShow = tokenMissing ? "Invalid verification link" : message;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-gray-50 p-4">
        <h2 className="text-xl font-semibold text-red-600">
          Verification Failed
        </h2>

        <p className="text-gray-600 text-center">{messageToShow}</p>

        {/* Email input only if not present */}
        {!email && (
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded-lg w-full max-w-sm"
          />
        )}

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={handleResend}
            disabled={resendLoading || cooldown > 0}
            className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : resendLoading
                ? "Sending..."
                : "Resend Email"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border px-4 py-2 rounded-lg"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="border px-4 py-2 rounded-lg"
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  // 🟡 LOADING UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-gray-50">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-gray-600">
        Verifying your account...
      </p>
    </div>
  );
}
