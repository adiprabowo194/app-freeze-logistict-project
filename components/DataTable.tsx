"use client";

import React from "react";

// 🔥 Export type biar bisa dipakai di page
export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  rowKey?: keyof T;
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
              <th key={i} className="text-left px-4 py-3 font-normal">
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
            data.map((row, i) => {
              // 🔥 FIX rowKey lebih aman
              const key =
                rowKey && row[rowKey] !== undefined ? String(row[rowKey]) : i;

              return (
                <tr key={key} className="border-t hover:bg-gray-50 transition">
                  {columns.map((col, j) => {
                    let content: React.ReactNode = "-";

                    // 🔥 PRIORITY render > accessor
                    if (col.render) {
                      content = col.render(row);
                    } else if (col.accessor) {
                      const value = row[col.accessor];
                      content =
                        value !== undefined && value !== null
                          ? String(value)
                          : "-";
                    }

                    return (
                      <td key={j} className="px-4 py-3">
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
