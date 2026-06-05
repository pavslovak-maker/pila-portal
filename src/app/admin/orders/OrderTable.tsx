"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/admin";

type OrderItem = { productName: string; unitPrice: number; quantity: number };

type OrderRow = {
  id: string;
  status: "pending" | "paid" | "fulfilled" | "cancelled" | "failed";
  paymentMethod: "card" | "on_pickup";
  deliveryMethod: string;
  deliveryAddress: string | null;
  totalAmount: number;
  createdAt: Date;
  items: OrderItem[];
};

const STATUS_LABELS: Record<OrderRow["status"], string> = {
  pending: "Ceka",
  paid: "Zaplaceno",
  fulfilled: "Vyrizeno",
  cancelled: "Zruseno",
  failed: "Chyba platby",
};

const STATUS_COLORS: Record<OrderRow["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  fulfilled: "bg-green-100 text-green-800",
  cancelled: "bg-stone-100 text-stone-500",
  failed: "bg-red-100 text-red-700",
};

const PAYMENT_LABELS: Record<string, string> = {
  card: "Karta",
  on_pickup: "Pri prevzeti",
};

function formatPrice(halere: number) {
  return (halere / 100).toLocaleString("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
  });
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("cs-CZ", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function OrderTable({ rows }: { rows: OrderRow[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function changeStatus(orderId: string, status: OrderRow["status"]) {
    startTransition(async () => {
      await updateOrderStatus({ orderId, status });
    });
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-stone-200 bg-white p-8 text-center text-stone-400">
        Zadne objednavky.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-stone-100 bg-stone-50 text-left text-xs text-stone-500">
          <tr>
            <th className="px-4 py-3">Datum</th>
            <th className="px-4 py-3">Celkem</th>
            <th className="px-4 py-3">Platba</th>
            <th className="px-4 py-3">Doprava</th>
            <th className="px-4 py-3">Stav</th>
            <th className="px-4 py-3">Polozky</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {rows.map((row) => (
            <>
              <tr key={row.id} className="hover:bg-stone-50">
                <td className="whitespace-nowrap px-4 py-3 text-stone-500">
                  {formatDate(row.createdAt)}
                </td>
                <td className="px-4 py-3 font-semibold text-amber-700">
                  {formatPrice(row.totalAmount)}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {PAYMENT_LABELS[row.paymentMethod] ?? row.paymentMethod}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {row.deliveryMethod === "pickup" ? "Osobni odber" : "Dovoz"}
                  {row.deliveryAddress && (
                    <span className="block text-xs text-stone-400">{row.deliveryAddress}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={row.status}
                    disabled={isPending}
                    onChange={(e) => changeStatus(row.id, e.target.value as OrderRow["status"])}
                    className={"rounded-full px-2 py-1 text-xs font-medium border-0 cursor-pointer disabled:opacity-50 " + STATUS_COLORS[row.status]}
                  >
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                    className="text-xs text-amber-700 underline"
                  >
                    {expanded === row.id ? "skryt" : row.items.length + " pol."}
                  </button>
                </td>
              </tr>
              {expanded === row.id && (
                <tr key={row.id + "-items"}>
                  <td colSpan={6} className="bg-stone-50 px-8 py-3">
                    <ul className="space-y-1 text-xs text-stone-600">
                      {row.items.map((it, i) => (
                        <li key={i}>
                          {it.quantity}x {it.productName} — {formatPrice(it.unitPrice * it.quantity)}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
