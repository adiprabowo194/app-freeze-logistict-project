"use client";

import { useEffect, useState } from "react";

interface Summary {
  active: number;
  delivered: number;
  onprocess: number;
}

interface Params {
  startDate?: string;
  endDate?: string;
  status?: string;
  search?: string;
}

export default function useSummary(params: Params) {
  const [data, setData] = useState<Summary>({
    active: 0,
    delivered: 0,
    onprocess: 0,
  });

  const [loading, setLoading] = useState(false);

  // 🔥 destructure biar dependency clean
  const { startDate, endDate, status, search } = params;

  useEffect(() => {
    const controller = new AbortController();

    const fetchSummary = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams();

        const queryParams = {
          startDate,
          endDate,
          status,
          search,
        };

        // 🔥 build query clean
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
          }
        });

        const res = await fetch(
          `/api/dashboard/summary?${query.toString()}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("API error");

        const result: Summary = await res.json();

        setData(result);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Summary error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();

    // 🔥 cleanup
    return () => controller.abort();
  }, [startDate, endDate, status, search]);

  return { ...data, loading };
}