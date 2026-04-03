"use client";

import { useState } from "react";

import TopNavbar from "@/components/TopNavbar";
import MenuBars from "@/components/MenuBars";

import useQuotes from "@/hooks/useQuotes";
import useSummary from "@/hooks/useSummary";
import useDebounce from "@/hooks/useDebounce";
import Link from "next/link";
import Pagination from "@/components/Pagination";
// 📦 TYPE (pakai JOIN)
interface Booking {
  id: number;
  unit?: string; // bisa undefined
  connote_no: string;
  cargo_type: string;
  weight: number;
  qty: number;
  status: string;
  createdAt: string;

  originArea?: {
    suburb?: string; // bisa undefined
  };

  destinationArea?: {
    suburb?: string; // bisa undefined
  };
}

export default function QuotesPage() {
  // 🔹 STATE
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search);

  // 🔥 FETCH TABLE

  // 🔥 TABLE DATA
  const { data, totalPages, loading } = useQuotes({
    page,
    limit,
    search: debouncedSearch,
    status,
  });

  // 🔥 FETCH SUMMARY
  const { active, delivered, onprocess } = useSummary({
    search: debouncedSearch,
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNavbar />
      <MenuBars />

      {/* 🔥 CONTENT */}
      <div className="p-6 px-16">
        <div className="mb-6 px-8 space-y-6">
          {/* 🔹 TITLE */}
          <div>
            <h1 className="text-2xl font-bold">List Jobs</h1>
            <p className="text-gray-500 text-sm">
              View and manage all your shipments
            </p>
          </div>
          {/* 🔍 SEARCH */}
          <div>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search connote / origin / destination..."
              className="w-full px-4 py-3 rounded-xl border bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* 📊 SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border p-5 text-center">
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <p className="text-xl font-bold">{active}</p>
            </div>

            <div className="bg-white rounded-2xl border p-5 text-center">
              <p className="text-gray-500 text-sm">On Process</p>
              <p className="text-xl font-bold text-yellow-500">{onprocess}</p>
            </div>

            <div className="bg-white rounded-2xl border p-5 text-center">
              <p className="text-gray-500 text-sm">Delivered</p>
              <p className="text-xl font-bold text-green-500">{delivered}</p>
            </div>

            <div className="bg-white rounded-2xl border p-5 text-center">
              <p className="text-gray-500 text-sm">Total Data</p>
              <p className="text-xl font-bold">{data.length}</p>
            </div>
          </div>
          {/* 📦 LIST */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : data.length === 0 ? (
              <p className="text-gray-400 text-sm">No data found</p>
            ) : (
              data.map((item: Booking) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border p-5 flex justify-between items-start"
                >
                  {/* LEFT */}
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold">{item.connote_no}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-sm">
                      <p>
                        📍 {item.originArea?.suburb || "-"} →{" "}
                        {item.destinationArea?.suburb || "-"}
                      </p>
                    </div>
                  </div>

                  {/* MIDDLE */}
                  <div className="space-y-2 text-sm">
                    <p>Temperature: {item.temperature}</p>
                    <p>
                      Unit:{" "}
                      <span className="text-blue-400 bg-blue-100 px-2 py-1 rounded-xl ">
                        {" "}
                        {item.unit || "-"}
                      </span>
                    </p>
                  </div>
                  {/* MIDDLE */}
                  <div className="space-y-2 text-sm">
                    <p>📦 {item.weight} kg</p>
                    <p>Qty: {item.qty}</p>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        item.status === "Delivered"
                          ? "bg-green-100 text-green-600"
                          : item.status === "Booking"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {item.status}
                    </span>

                    <div className="flex flex-col gap-2 text-center">
                      <Link
                        href={`/track-shipment/${item.connote_no}`}
                        className="border px-4 py-1 rounded-lg text-sm hover:bg-gray-100 transition"
                      >
                        Track
                      </Link>
                      <Link
                        href={`/invoice/${item.connote_no}`}
                        className="border px-4 py-1 rounded-lg text-sm hover:bg-gray-100 transition"
                      >
                        Invoice
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
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
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
