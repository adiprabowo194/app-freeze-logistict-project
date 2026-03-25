"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import useQuotes from "@/hooks/useQuotes";
import useSummary from "@/hooks/useSummary";
import useDebounce from "@/hooks/useDebounce";

import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import TableToolbar from "@/components/TableToolbar";
import Pagination from "@/components/Pagination";
import SummaryCard from "@/components/SummaryCard";
import TopNavbar from "@/components/TopNavbar";
import MenuBars from "@/components/MenuBars";
import DateFilter from "@/components/DateRange";

import { getLast7DaysRange } from "@/utils/daterange";

// 📦 TYPES
interface Booking {
  id: number;
  connote_no: string;
  cargo_type: string;

  unit?: string; // 🔥 jadi optional

  suburb_origin: string;
  suburb_destination: string;
  weight: number;
  qty: number;
  status: string;
  createdAt: string;

  originArea?: {
    suburb: string;
  };
  destinationArea?: {
    suburb: string;
  };
}

// 🔥 TYPE COLUMN (BIAR GENERIC AMAN)
type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
};

export default function DashboardClient() {
  const defaultRange = getLast7DaysRange();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);

  const debouncedSearch = useDebounce(search);

  const { data, totalPages, loading } = useQuotes({
    page,
    limit: 5,
    search: debouncedSearch,
    status,
    startDate,
    endDate,
  });

  const {
    active,
    delivered,
    onprocess,
    loading: summaryLoading,
  } = useSummary({
    startDate,
    endDate,
    status,
    search: debouncedSearch,
  });

  // ✅ FIX TYPE COLUMNS
  const columns: Column<Booking>[] = [
    { header: "Connote No.", accessor: "connote_no" },
    {
      header: "Origin - Dest",
      render: (row) =>
        `${row.originArea?.suburb || "-"} - ${
          row.destinationArea?.suburb || "-"
        }`,
    },
    { header: "Cargo Type", accessor: "cargo_type" },
    { header: "Unit", accessor: "unit" },
    { header: "Weight", accessor: "weight" },
    { header: "Qty", accessor: "qty" },
    {
      header: "Created At",
      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
    },
    {
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const isLogin = sessionStorage.getItem("just_login");

    if (isLogin) {
      setShowAlert(true);
      toast.success("Welcome to dashboard");
      sessionStorage.removeItem("just_login");

      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

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

        {/* 📊 SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-8">
          {summaryLoading ? (
            <>
              <div className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
              <div className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
              <div className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
            </>
          ) : (
            <>
              <SummaryCard
                title="Active Orders"
                value={active}
                icon="ri-stack-line"
                color="blue"
              />

              <SummaryCard
                title="Delivered Orders"
                value={delivered}
                icon="ri-checkbox-circle-line"
                color="green"
              />

              <SummaryCard
                title="On Process"
                value={onprocess}
                icon="ri-time-line"
                color="yellow"
              />
            </>
          )}
        </div>

        {/* 📦 TABLE */}
        <div className="px-8">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            {/* HEADER */}
            <div className="mb-4 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">Recent Bookings</h2>
                <p className="text-sm text-gray-500">
                  Your latest shipments and their status
                </p>
              </div>

              <DateFilter
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setPage={setPage}
              />
            </div>

            {/* FILTER */}
            <TableToolbar
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
              setPage={setPage}
            />

            {/* ✅ TABLE FIXED */}
            <DataTable<Booking>
              columns={columns}
              data={data || []}
              rowKey="id"
            />

            {loading && (
              <p className="text-sm text-gray-400 mt-2">Loading...</p>
            )}

            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
