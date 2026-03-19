"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function DashboardToast() {
  useEffect(() => {
    toast.success("Login berhasil 🎉");
  }, []);

  return null;
}
