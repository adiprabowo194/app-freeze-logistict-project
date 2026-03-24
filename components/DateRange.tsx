"use client";

import {
  getTodayRange,
  getLast7DaysRange,
  getLast14DaysRange,
  getThisMonthRange,
} from "@/utils/daterange";

interface Props {
  startDate: string;
  endDate: string;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  setPage: (val: number) => void;
}

export default function DateFilter({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setPage,
}: Props) {
  const applyRange = (range: { startDate: string; endDate: string }) => {
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    setPage(1);
  };

  // 🔥 detect active preset
  const isActive = (range: { startDate: string; endDate: string }) =>
    startDate === range.startDate && endDate === range.endDate;

  const today = getTodayRange();
  const last7 = getLast7DaysRange();
  const last14 = getLast14DaysRange();
  const month = getThisMonthRange();

  const btnClass = (active: boolean) =>
    `text-xs px-3 py-1 rounded-lg border transition ${
      active
        ? "bg-blue-500 text-white border-blue-500"
        : "bg-white hover:bg-gray-100"
    }`;

  return (
    <div className="flex flex-col items-end gap-2">
      {/* 🔹 PRESET */}
      <div className="flex gap-2">
        <span className="text-xs text-gray-500 relative top-1 -left-4">
          Filter Date :
        </span>
        <button
          onClick={() => applyRange(today)}
          className={btnClass(isActive(today))}
        >
          Today
        </button>

        <button
          onClick={() => applyRange(last7)}
          className={btnClass(isActive(last7))}
        >
          7 Days
        </button>

        <button
          onClick={() => applyRange(last14)}
          className={btnClass(isActive(last14))}
        >
          14 Days
        </button>

        <button
          onClick={() => applyRange(month)}
          className={btnClass(isActive(month))}
        >
          Month
        </button>
      </div>

      {/* 🔹 MANUAL INPUT */}
      <div className="flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setPage(1);
          }}
          className="bg-transparent outline-none text-sm"
        />

        <span className="text-gray-400 text-sm">→</span>

        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setPage(1);
          }}
          className="bg-transparent outline-none text-sm"
        />

        {(startDate || endDate) && (
          <button
            onClick={() => applyRange(last7)}
            className="ml-2 text-xs text-red-500 hover:text-red-600"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
