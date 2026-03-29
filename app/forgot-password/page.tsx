"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ VALIDASI EMAIL
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!email) {
      return toast.error("Email is required");
    }

    if (!isValidEmail(email)) {
      return toast.error("Invalid email format");
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.error);
      }

      toast.success("Reset link sent 📩");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100">
      <Toaster position="top-right" />

      <div className="bg-white p-6 rounded-xl shadow w-[400px] space-y-4">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="text-xl font-bold text-center">Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ✅ BUTTON WITH SPINNER */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* ✅ BACK LINK */}
        <Link
          href="/"
          className="block text-center text-xs text-gray-400 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
