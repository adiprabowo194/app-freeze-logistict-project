"use client";

import { useEffect, useState } from "react";

interface Quote {
  id: number;
  connote_no: string;
  temperature: string;
  originArea?: {
    suburb?: string;
  };

  destinationArea?: {
    suburb?: string;
  };
  suburb_origin: string;
  suburb_destination: string;
  qty: number;
  weight: number;
  status: string;
  customer_code: string;
  user_inp: string;
  createdAt: string;
  updatedAt: string;
}

interface QuoteResponse {
  data: Quote[];
  total: number;
  page: number;
  totalPages: number;
}

interface Params {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
  startDate?: string;
  endDate?: string;
}

export default function useQuotes(params: Params) {
  const [data, setData] = useState<QuoteResponse>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);

  // 🔹 destructure biar dependency lebih clean
  const { page, limit, search, status, sortBy, order, startDate, endDate } =
    params;

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams();

        const queryParams = {
          page,
          limit,
          search,
          status,
          sortBy,
          order,
          startDate,
          endDate,
        };

        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
          }
        });

        const res = await fetch(`/api/quotes?${query.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("API error");

        const result: QuoteResponse = await res.json();

        setData(result);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 🔥 cleanup (hindari memory leak)
    return () => controller.abort();
  }, [page, limit, search, status, sortBy, order, startDate, endDate]);

  return { ...data, loading };
}
