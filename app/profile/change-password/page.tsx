"use client";

import { useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import MenuBars from "@/components/MenuBars";

export default function ChangePasswordPage() {
  const CUSTOMER_CODE = "CUST001";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  // ================= HANDLE SAVE =================
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return alert("New password and confirm password do not match");
    }

    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/customers/${CUSTOMER_CODE}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed");
      }

      alert("Password changed successfully!");

      // reset
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNavbar />
      <MenuBars />

      <div className="p-6 px-16">
        <div className="px-6 space-y-6">
          <h1 className="text-2xl font-bold mb-6">Change Password</h1>

          <div className="bg-white p-6 rounded-xl border max-w-xl space-y-4">
            {/* CURRENT PASSWORD */}
            <div>
              <label className="text-sm text-gray-600">Current Password</label>
              <div className="flex">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="p-3 border rounded-l-xl w-full"
                />
                <button
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="px-3 border border-l-0 rounded-r-xl bg-gray-100"
                >
                  👁
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label className="text-sm text-gray-600">New Password</label>
              <div className="flex">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="p-3 border rounded-l-xl w-full"
                />
                <button
                  onClick={() => setShowNew(!showNew)}
                  className="px-3 border border-l-0 rounded-r-xl bg-gray-100"
                >
                  👁
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm text-gray-600">Confirm Password</label>
              <div className="flex">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="p-3 border rounded-l-xl w-full"
                />
                <button
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="px-3 border border-l-0 rounded-r-xl bg-gray-100"
                >
                  👁
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl w-full disabled:opacity-50"
            >
              {loading ? "Saving..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
