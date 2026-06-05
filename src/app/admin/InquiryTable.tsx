"use client";

import { useState, useTransition } from "react";
import { updateInquiryStatus } from "@/app/actions/admin";

type InquiryRow = {
  id: string;
  type: "milling" | "drying" | "sharpening";
  status: "new" | "contacted" | "quoted" | "won" | "lost";
  contactName: string;
  contactPhone: string;
  contactEmail: string | null;
  note: string | null;
  createdAt: Date;
};

const TYPE_LABELS: Record<InquiryRow["type"], string> = {
  milling: "Pořez",
  drying: "Sušení",
  sharpening: "Ostření",
};

const STATUS_LABELS: Record<InquiryRow["status"], string> = {
  new: "Nová",
  contacted: "Kontaktován",
  quoted: "Nacenění",
  won: "Zakázka",
  lost: "Zrušeno",
};

const STATUS_COLORS: Record<InquiryRow["status"], string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  quoted: "bg-purple-100 text-purple-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-stone-100 text-stone-500",
};

const TYPE_FILTERS = ["všechny", "milling", "drying", "sharpening"] as const;
const STATUS_FILTERS = ["všechny", "new", "contacted", "quoted", "won", "lost"] as const;

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function InquiryTable({ rows }: { rows: InquiryRow[] }) {
  const [typeFilter, setTypeFilter] = useState<string>("všechny");
  const [statusFilter, setStatusFilter] = useState<string>("všechny");
  const [isPending, startTransition] = useTransition();

  const filtered = rows.filter((r) => {
    if (typeFilter !== "všechny" && r.type !== typeFilter) return false;
    if (statusFilter !== "všechny" && r.status !== statusFilter) return false;
    return true;
  });

  function changeStatus(inquiryId: string, status: InquiryRow["status"]) {
    startTransition(async () => {
      await updateInquiryStatus({ inquiryId, status });
    });
  }

  return (
    <div>
      {/* Filtry */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-stone-600">Typ:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded border border-stone-300 px-2 py-1 text-sm"
          >
            {TYPE_FILTERS.map((f) => (
              <option key={f} value={f}>
                {f === "všechny" ? "Všechny" : TYPE_LABELS[f as InquiryRow["type"]]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-stone-600">Stav:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-stone-300 px-2 py-1 text-sm"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f} value={f}>
                {f === "všechny" ? "Všechny" : STATUS_LABELS[f as InquiryRow["status"]]}
              </option>
            ))}
          </select>
        </div>
        <span className="ml-auto text-sm text-stone-400">
          {filtered.length} poptávek
        </span>
      </div>

      {/* Tabulka */}
      {filtered.length === 0 ? (
        <p className="rounded-xl border border-stone-200 bg-white p-8 text-center text-stone-400">
          Žádné poptávky.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-100 bg-stone-50 text-left text-xs text-stone-500">
              <tr>
                <th className="px-4 py-3">Datum</th>
                <th className="px-4 py-3">Typ</th>
                <th className="px-4 py-3">Jméno</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Poznámka</th>
                <th className="px-4 py-3">Stav</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-stone-50">
                  <td className="whitespace-nowrap px-4 py-3 text-stone-500">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-700">
                    {TYPE_LABELS[row.type]}
                  </td>
                  <td className="px-4 py-3">{row.contactName}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${row.contactPhone}`}
                      className="text-amber-700 underline"
                    >
                      {row.contactPhone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-stone-500">
                    {row.contactEmail ?? "—"}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-stone-500">
                    {row.note ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.status}
                      disabled={isPending}
                      onChange={(e) =>
                        changeStatus(row.id, e.target.value as InquiryRow["status"])
                      }
                      className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[row.status]} border-0 cursor-pointer disabled:opacity-50`}
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
