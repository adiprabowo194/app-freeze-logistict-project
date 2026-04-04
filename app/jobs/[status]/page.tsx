"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import TopNavbar from "@/components/TopNavbar";
import MenuBars from "@/components/MenuBars";

import useQuotes from "@/hooks/useQuotes";
import useSummary from "@/hooks/useSummary";
import useDebounce from "@/hooks/useDebounce";
import Link from "next/link";
import Pagination from "@/components/Pagination";
// 📦 TYPE
interface Booking {
  id: number;
  connote_no: string;
  status: string;
  createdAt: string;

  temperature?: string;
  unit?: string;
  qty?: number;
  weight?: number;

  originArea?: {
    suburb?: string;
  };

  destinationArea?: {
    suburb?: string;
  };
}

export default function QuotesByStatusPage() {
  const params = useParams();
  const statusParam = params.status as string;

  // 🔹 STATE
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusList, setStatusList] = useState<string[]>([
    "Booking",
    "Delivered",
    "Pickup",
    "Delivery",
    "Confirm",
  ]);
  const debouncedSearch = useDebounce(search);

  // 🔥 NORMALIZE STATUS (penting)
  const status =
    statusParam === "all"
      ? ""
      : statusParam === "onprocess"
        ? "onprocess"
        : statusParam;

  // 🔥 TABLE DATA
  const { data, totalPages, loading } = useQuotes({
    page,
    limit,
    search: debouncedSearch,
    status,
    statusList,
  });

  // 🔥 SUMMARY
  const { active, delivered, onprocess } = useSummary({
    search: debouncedSearch,
    status,
    statusList,
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNavbar />
      <MenuBars />

      <div className="p-6 px-16">
        <div className="space-y-6 px-8">
          {/* 🔹 TITLE */}
          <div>
            <h1 className="text-2xl font-bold capitalize">
              {statusParam} Quotes
            </h1>
            <p className="text-gray-500 text-sm">
              Filtered by status: {statusParam}
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
              placeholder="Search by connote / route..."
              className="w-full px-4 py-3 rounded-xl border bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* 📊 SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border p-5 text-center">
              <p className="text-gray-500 text-sm">Total</p>
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
                  <div className="space-y-2">
                    <p className="font-semibold">{item.connote_no || "-"}</p>
                    <p className="text-sm text-gray-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "-"}
                    </p>

                    <p className="text-sm">
                      📍 {item.originArea?.suburb || "-"} →{" "}
                      {item.destinationArea?.suburb || "-"}
                    </p>
                  </div>

                  {/* MIDDLE */}
                  <div className="space-y-2 text-sm">
                    <p>Temperature: {item.temperature || "-"}</p>
                    <p>
                      Unit:{" "}
                      <span className="text-blue-400 bg-blue-100 px-2 py-1 rounded-xl">
                        {item.unit || "-"}
                      </span>
                    </p>
                  </div>

                  {/* MIDDLE */}
                  <div className="text-sm space-y-1">
                    <p>📦 {item.weight || 0} kg</p>
                    <p>Qty: {item.qty || 0}</p>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        item.status === "delivered"
                          ? "bg-green-100 text-green-600"
                          : item.status === "transit"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {item.status || "-"}
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
