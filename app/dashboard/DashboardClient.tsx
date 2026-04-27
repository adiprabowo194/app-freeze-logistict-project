"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import useQuotes from "@/hooks/useQuotes";
import Link from "next/link";
import useDebounce from "@/hooks/useDebounce";
import Button from "@/components/Button";
import TextareaField from "@/components/TextareaField";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import TopNavbar from "@/components/TopNavbar";
import MenuBars from "@/components/MenuBars";
import InputField from "@/components/InputField";

// 📦 TYPES
interface Booking {
  id: number;
  connote_no: string;
  cbm: string;

  unit?: string; // 🔥 jadi optional

  suburb_origin: string;
  suburb_destination: string;
  total_weight: number;
  total_qty: number;
  status: string;
  createdAt: string;

  originArea?: {
    suburb?: string;
    state?: string;
  } | null;

  destinationArea?: {
    suburb?: string;
    state?: string;
  } | null;
}

export default function DashboardClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [limit, setLimit] = useState(10);
  const [statusList, setStatusList] = useState<string[]>([
    "Booking",
    "Delivered",
    "Pickup",
    "Delivery",
    "Confirm",
  ]);
  const debouncedSearch = useDebounce(search);

  const { data, totalPages, loading } = useQuotes({
    page,
    limit,
    search: debouncedSearch,
    status,
    statusList, // 🔥 NEW
  });

  const [showAlert, setShowAlert] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingMessage(true);

    const form = e.currentTarget;

    const payload = {
      enquiry: (form.enquiry as HTMLInputElement).value,
      connote_no: (form.connote_no as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/send-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed send data");
      } else {
        toast.success("Your Enquiry successfully send");

        // ✅ reset form
        form.reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }

    setLoadingMessage(false);
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
          <div className="bg-white rounded-2xl border shadow-sm p-6 w-2/4">
            {/* item list recent jobs */}
            <h2 className="text-2xl mb-4 font-semibold">Recent Jobs</h2>
            {/* toolbar */}
            <div className="flex gap-3">
              {/* STATUS */}
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1); // 🔥 RESET PAGE
                }}
                className="border px-4 py-2 rounded-xl text-sm"
              >
                <option value="">All Status</option>

                <option value="Delivered">Delivered</option>
                <option value="booking">Booking</option>
              </select>

              {/* SEARCH */}
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
            {/* datatable */} {/* ✅ TABLE FIXED */}
            {(data || []).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition my-4"
              >
                {/* LEFT */}
                <div>
                  <p className="font-semibold text-sm text-blue-400">
                    {item.connote_no}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.originArea?.suburb} - {item.destinationArea?.suburb}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                {/* MIDDLE */}
                <div className="text-sm text-gray-600">
                  <p>
                    <i className="ri-archive-2-fill"></i> {item.total_qty} qty
                  </p>
                  <p>
                    <i className="ri-weight-fill"></i> {item.total_weight} kg
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} />
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
          <div className=" w-2/4">
            <div className="mb-4">
              <div className="flex gap-4 w-full">
                <Link href="/track-shipment" className="w-1/3 text-white">
                  <Button type="submit" variant="blue" disabled={loading}>
                    Tracking
                  </Button>
                </Link>

                <Link href="/quote/quick-quote" className="w-2/3 ">
                  <Button type="submit" disabled={loading} variant="yellow">
                    <i className="ri-stack-line"></i> Quick Quote
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-6 w-full">
              {" "}
              {/* inquery message*/}
              <h2 className="text-2xl mb-4 font-semibold">Enquiry</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  type="text"
                  label="Connote Number"
                  name="connote_no"
                  required={true}
                />
                <TextareaField
                  rows={5}
                  label="Your Question"
                  name="enquiry"
                  required={true}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full py-3 text-sm bg-gradient-to-r from-blue-500 to-indigo-500"
                >
                  {loadingMessage ? "Submitting..." : "Send"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
