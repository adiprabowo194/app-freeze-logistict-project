"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import TopNavbar from "@/components/TopNavbar";
import MenuBars from "@/components/MenuBars";

// ================= TYPES =================
interface TrackingHistoryItem {
  connote_no: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user_inp: string;
}

interface Tracking {
  connote_no: string;
  status: string;
  origin: string;
  destination: string;
  weight: number;
  qty: number;
  unit: string;
  history: TrackingHistoryItem[];
}

export default function TrackShipmentPage() {
  const params = useParams();
  const router = useRouter();
  const connoteNo = params.connoteNo as string;

  const [inputConnote, setInputConnote] = useState("");
  const [data, setData] = useState<Tracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= STATUS COLOR =================
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600 bg-green-50";
      case "delivery":
      case "in transit":
        return "text-blue-600 bg-blue-50";
      case "confirm":
      case "picked up":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // ================= FORMAT DATE ONLY =================
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(); // 🔥 tanpa jam
  };

  // ================= SEARCH =================
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputConnote.trim()) return;
    router.push(`/track-shipment/${inputConnote}`);
  };

  // ================= SYNC INPUT =================
  useEffect(() => {
    if (connoteNo) setInputConnote(connoteNo);
  }, [connoteNo]);

  // ================= FETCH =================
  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/track/${connoteNo}`);
        if (!res.ok) throw new Error("Failed fetch");

        const result = await res.json();

        if (!result) {
          setData(null);
          setError("Tracking number not found");
        } else {
          setData(result);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (connoteNo) fetchTracking();
  }, [connoteNo]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNavbar />
      <MenuBars />

      <div className="p-6 px-16 space-y-6">
        {/* 🔍 SEARCH */}
        <div className="bg-white p-4 rounded-2xl border">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Connote Number..."
              value={inputConnote}
              onChange={(e) => setInputConnote(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={!inputConnote}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm shadow hover:bg-blue-700 disabled:bg-gray-300"
            >
              Track
            </button>
          </form>
        </div>

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Track Shipment</h1>
          <p className="text-gray-500 text-sm">
            Tracking Connote No:{" "}
            <span className="font-semibold">{connoteNo}</span>
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="bg-white p-6 rounded-xl border animate-pulse">
            <div className="h-4 bg-gray-200 w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 w-1/2" />
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* DATA */}
        {!loading && data && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT */}
              <div className="space-y-6">
                {/* SUMMARY */}
                <div className="bg-white p-6 rounded-2xl border space-y-4">
                  <h2 className="font-semibold text-lg">Shipment Details</h2>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Connote</p>
                      <p className="font-semibold">{data.connote_no}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">Status</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          data.status,
                        )}`}
                      >
                        {data.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-gray-500">Origin</p>
                      <p>{data.origin}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">Destination</p>
                      <p>{data.destination}</p>
                    </div>
                  </div>
                </div>

                {/* 🔥 SHIPMENT INFO (UPDATED UI) */}
                <div className="bg-white p-6 rounded-2xl border space-y-4">
                  <h2 className="font-semibold text-lg">Shipment Info</h2>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-50 p-4 rounded-xl text-center shadow-sm">
                      <p className="text-gray-500 text-xs">Weight</p>
                      <p className="font-semibold text-blue-600 text-lg">
                        {data.weight} kg
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl text-center shadow-sm">
                      <p className="text-gray-500 text-xs">Quantity</p>
                      <p className="font-semibold text-lg">{data.qty}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl text-center shadow-sm">
                      <p className="text-gray-500 text-xs">Unit</p>
                      <p className="font-semibold text-lg">{data.unit}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT TIMELINE */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-2xl border">
                  <h2 className="font-semibold mb-6">Tracking History</h2>

                  <div className="space-y-6">
                    {[...data.history].reverse().map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          {index !== data.history.length - 1 && (
                            <div className="w-[2px] flex-1 bg-gray-200" />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            {item.description}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white p-6 rounded-2xl border">
              <h2 className="font-semibold mb-4">Tracking Logs (System)</h2>

              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-2 border">Connote</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Description</th>
                      <th className="p-2 border">Created</th>
                      <th className="p-2 border">Updated</th>
                      <th className="p-2 border">User</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.history.map((item, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-50 ${
                          index === data.history.length - 1 ? "bg-green-50" : ""
                        }`}
                      >
                        <td className="p-2 border">{item.connote_no}</td>

                        <td className="p-2 border">
                          <span
                            className={`px-2 py-1 rounded text-xs ${getStatusColor(
                              item.status,
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="p-2 border">{item.description}</td>

                        <td className="p-2 border">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="p-2 border">
                          {formatDate(item.updatedAt)}
                        </td>

                        <td className="p-2 border">{item.user_inp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
