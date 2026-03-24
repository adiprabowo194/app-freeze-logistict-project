"use client";

import { useState } from "react";

import TopNavbar from "@/components/TopNavbar";
import MenuBars from "@/components/MenuBars";

interface Invoice {
  id: number;
  invoice_no: string;
  sender: string;
  receiver: string;
  total_qty: number;
  total_weight: number;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
}

export default function InvoiceListPage() {
  // Dummy data, nanti bisa diganti fetch API
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      invoice_no: "INV-0001",
      sender: "Company ABC",
      receiver: "Company XYZ",
      total_qty: 3,
      total_weight: 120,
      status: "pending",
      createdAt: "2026-03-23T10:00:00Z",
    },
    {
      id: 2,
      invoice_no: "INV-0002",
      sender: "Company ABC",
      receiver: "Company DEF",
      total_qty: 1,
      total_weight: 50,
      status: "paid",
      createdAt: "2026-03-22T09:30:00Z",
    },
  ]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNavbar />
      <MenuBars />

      <div className="p-6 px-16">
        <div className="space-y-6 px-8">
          {/* TITLE */}
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-gray-500 text-sm">
              List of all generated invoices
            </p>
          </div>

          {/* LIST TABLE */}
          <div className="bg-white rounded-2xl border overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Invoice No</th>
                  <th className="p-3">Sender</th>
                  <th className="p-3">Receiver</th>
                  <th className="p-3">Total Qty</th>
                  <th className="p-3">Total Weight (kg)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{inv.invoice_no}</td>
                    <td className="p-3">{inv.sender}</td>
                    <td className="p-3">{inv.receiver}</td>
                    <td className="p-3 text-center">{inv.total_qty}</td>
                    <td className="p-3 text-center">{inv.total_weight}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          inv.status === "paid"
                            ? "bg-green-100 text-green-600"
                            : inv.status === "pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 space-x-2">
                      <button className="border px-3 py-1 rounded-lg text-sm hover:bg-gray-100">
                        View
                      </button>
                      <button className="border px-3 py-1 rounded-lg text-sm hover:bg-gray-100">
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {invoices.length === 0 && (
            <p className="text-gray-400 text-sm text-center mt-4">
              No invoices found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}