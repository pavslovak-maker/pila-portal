"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export function CartNav() {
  const { totalItems } = useCart();
  if (totalItems === 0) return null;
  return (
    <Link
      href="/palivo/kosik"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-amber-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-amber-700"
    >
      🛒 Košík
      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-amber-700">
        {totalItems}
      </span>
    </Link>
  );
}
