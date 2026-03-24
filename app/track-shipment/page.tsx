"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import TopNavbar from "@/components/TopNavbar";
import MenuBars from "@/components/MenuBars";

interface Tracking {
  connote_no: string;
  status: string;
  origin: string;
  destination: string;
  createdAt: string;
  history: {
    date: string;
    description: string;
  }[];
}

export default function TrackShipmentPage() {
  const params = useParams();
  const router = useRouter();
  const connoteNo = params.connoteNo as string;

  const [inputConnote, setInputConnote] = useState("");
  const [data, setData] = useState<Tracking | null>(null);
  const [loading, setLoading] = useState(true);

  // ================= SEARCH =================
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputConnote) return;

    router.push(`/track-shipment/${inputConnote}`);
  };

  // ================= SYNC INPUT =================
  useEffect(() => {
    if (connoteNo) {
      setInputConnote(connoteNo);
    }
  }, [connoteNo]);

  // ================= FETCH =================
  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/track/${connoteNo}`);
        const result = await res.json();

        setData(result);
      } catch (err) {
        console.error("Tracking error:", err);
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

      <div className="p-6 px-16 ">
        {/* 🔹 HEADER */}
        <div className="px-6 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Track Shipment</h1>
            <p className="text-gray-500 text-sm">
              Tracking Connote No:{" "}
              <span className="font-semibold">{connoteNo}</span>
            </p>
          </div>
          {/* 🔍 SEARCH FORM */}
          <div className="bg-white p-4 rounded-2xl border px-4">
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
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm shadow hover:bg-blue-700"
              >
                Track
              </button>
            </form>
          </div>

          {/* 📦 DATA */}
          {!loading && data && (
            <>
              {/* SUMMARY */}
              <div className="bg-white p-6 rounded-2xl border space-y-3">
                <h2 className="font-semibold text-lg">Shipment Details</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Connote</p>
                    <p className="font-semibold">{data.connote_no}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-semibold text-blue-600">{data.status}</p>
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

              {/* 📍 TIMELINE */}
              <div className="bg-white p-6 rounded-2xl border">
                <h2 className="font-semibold mb-4">Tracking History</h2>

                <div className="space-y-4">
                  {data.history?.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      {/* DOT */}
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        {index !== data.history.length - 1 && (
                          <div className="w-[2px] flex-1 bg-gray-200" />
                        )}
                      </div>

                      {/* CONTENT */}
                      <div>
                        <p className="text-sm font-medium">
                          {item.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ❌ EMPTY */}
          {!loading && !data && (
            <div className="bg-white p-6 rounded-xl border text-center text-gray-400">
              Data not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
