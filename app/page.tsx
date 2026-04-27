"use client";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Logo from "@/components/Logo";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

const Home: React.FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Login Success 🚀");
        sessionStorage.setItem("just_login", "true");

        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100 font-sans">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Title */}
        {/* <h6 className="text-sm text-gray-600 text-center">
          Portal Booking Cold Freight untuk UKM Australia
        </h6> */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </Button>

          <h6 className="text-xl font-semibold text-center text-gray-800">
            or
          </h6>

          {/* Register Button */}
          <Link href="/register" className="block">
            <Button
              type="button"
              className="rounded-full bg-gray-800 hover:bg-gray-900 w-full"
            >
              Register Account
            </Button>
          </Link>

          {/* Forgot Password */}
          <Link
            href="/forgot-password"
            className="block text-center text-xs text-gray-400 hover:underline"
          >
            Forgot Password?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Home;
