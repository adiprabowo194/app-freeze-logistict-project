"use client";
import Link from "next/link";

import React from "react";
import Logo from "@/components/Logo";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

const Home: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    console.log({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Title */}
        <h6 className="text-sm text-gray-600 text-center">
          Portal Booking Cold Freight untuk UKM Australia
        </h6>
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

          <Button type="submit">Login</Button>
          <h6 className="text-xl font-semibold text-center text-gray-800">
            or
          </h6>
          {/* Register Button */}
          <Link href="/register" className="block">
            <Button
              type="button"
              className="rounded-full bg-gray-800 hover:bg-gray-900"
            >
              Register Account
            </Button>
          </Link>

          {/* Forgot Password */}
          <p className="text-center text-xs text-gray-400 cursor-pointer hover:underline">
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
};

export default Home;
