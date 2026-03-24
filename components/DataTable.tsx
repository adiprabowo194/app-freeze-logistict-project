// components/DataTable.tsx
"use client";

import React from "react";

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  rowKey?: keyof T; // ✅ biar key tidak pakai index
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
}: Props<T>) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        {/* HEADER */}
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="text-left px-4 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-400"
              >
                No data
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={
                  rowKey && row[rowKey] ? String(row[rowKey]) : i // fallback
                }
                className="border-t hover:bg-gray-50 transition"
              >
                {columns.map((col, j) => (
                  <td key={j} className="px-4 py-3">
                    {col.render
                      ? col.render(row)
                      : col.accessor
                        ? String(row[col.accessor] ?? "-")
                        : "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
