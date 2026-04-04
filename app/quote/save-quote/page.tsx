"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import useQuotes from "@/hooks/useQuotes";
import Link from "next/link";
import useDebounce from "@/hooks/useDebounce";
import Button from "@/components/Button";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import TopNavbar from "@/components/TopNavbar";
import MenuBars from "@/components/MenuBars";

export default function DashboardClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Entry");
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search);

  const { data, totalPages, loading } = useQuotes({
    page,
    limit,
    search: debouncedSearch,
    status,
  });

  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    const isLogin = sessionStorage.getItem("just_login");
    setPage(1);
    if (isLogin) {
      setShowAlert(true);
      toast.success("Welcome to dashboard");
      sessionStorage.removeItem("just_login");

      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [limit]);
  const handleDelete = async (connote_no: string) => {
    try {
      const confirmDelete = confirm("Are you sure delete this quote?");
      if (!confirmDelete) return;

      const res = await fetch("/api/cargo-quote/delete", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ connote_no }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error);

      toast.success("Quote deleted 🗑️");

      // 🔥 refresh data
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNavbar />
      <MenuBars />
      <Toaster position="top-right" />

      <div className="p-6 px-16">
        {showAlert && (
          <div className="mx-8 mb-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-sm">
            <span>✅ Welcome back! You have successfully logged in.</span>
            <button
              onClick={() => setShowAlert(false)}
              className="ml-4 text-green-600 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* 📊 RECENT JOBs */}
        <div className="flex gap-4 mb-6 px-8">
          <div className="bg-white rounded-2xl border shadow-sm p-6 w-3/4 space-y-6">
            {/* item list recent jobs */}
            <div className="grid grid-cols-2 justify-between">
              <h2 className="text-2xl mb-4 font-semibold">List Save Quotes</h2>
              <Link href="/quote/quick-quote">
                <Button type="submit" disabled={loading} variant="yellow">
                  <i className="ri-stack-line"></i> Quick Quote
                </Button>
              </Link>
            </div>
            <div>
              {" "}
              <input
                placeholder="Search connote / origin / destination..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // 🔥 RESET PAGE
                }}
                className="border px-3 py-2 rounded-xl text-sm w-full"
              />
            </div>
            {/* toolbar */}
            {/* datatable */} {/* ✅ TABLE FIXED */}
            {(data || []).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition my-4"
              >
                {/* LEFT */}
                <div className="space-y-3 ">
                  <p className="font-semibold text-lg text-blue-400">
                    {item.connote_no}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.originArea?.suburb} - {item.destinationArea?.suburb}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </p>{" "}
                </div>

                {/* MIDDLE */}
                <div className="text-sm text-gray-600 flex flex-col space-y-3 ">
                  <p>
                    <i className="ri-archive-2-fill"></i> {item.total_qty} qty
                  </p>
                  <p>
                    <i className="ri-weight-fill"></i> {item.total_weight} kg
                  </p>{" "}
                  <p className="gap-2">
                    Status : <StatusBadge status={item.status} />
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-center gap-3 space-y-3">
                  <Link href={`/quote/quick-quote/${item.connote_no}`}>
                    <Button
                      type="button"
                      disabled={loading}
                      variant="primary"
                      className="px-2 text-sm"
                    >
                      Process
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDelete(item.connote_no)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {loading && (
              <p className="text-sm text-gray-400 mt-2">Loading...</p>
            )}
            {!loading && data?.length === 0 && (
              <p className="text-sm text-gray-400">No data found</p>
            )}
            <div className="flex items-center justify-between relative">
              {/* select option mengatur limit  */}
              {/* 🔹 LIMIT SELECT */}
              <div className="flex items-center gap-2 top-2 relative">
                <span className="text-sm text-gray-500">Show</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1); // 🔥 reset page
                  }}
                  className="border rounded-lg px-2 py-1 text-sm"
                >
                  <option value={limit}>{limit}</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                </select>
                <span className="text-sm text-gray-500">entries</span>
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
