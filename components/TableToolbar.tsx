"use client";
import Link from "next/link";
interface Props {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  setPage: (v: number) => void; // 🔥 TAMBAH
}

export default function TableToolbar({
  search,
  setSearch,
  status,
  setStatus,
  setPage,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      {/* LEFT */}
      <div className="flex gap-3">
        <Link
          href="/jobs"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm shadow inline-block"
        >
          + Quick Quote
        </Link>

        <Link
          href="/track-shipment"
          className="border px-4 py-2 rounded-xl text-sm inline-block"
        >
          Track Shipments
        </Link>
      </div>

      {/* RIGHT */}
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
          <option value="onprocess">On Process</option>
          <option value="Delivered">Delivered</option>
          <option value="booking">Booking</option>
          <option value="transit">Transit</option>
          <option value="confirm">Confrim</option>
        </select>

        {/* SEARCH */}
        <input
          placeholder="Search connote / origin / destination..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // 🔥 RESET PAGE
          }}
          className="border px-3 py-2 rounded-xl text-sm w-56"
        />
      </div>
    </div>
  );
}
