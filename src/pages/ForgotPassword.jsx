import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Check your email for a password reset link!",
      });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <h1 className="font-playfair text-3xl font-bold text-charcoal mb-2">
          Reset Password
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Enter your email and we'll send you a reset link.
        </p>

        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !email}
            className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remembered it?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
