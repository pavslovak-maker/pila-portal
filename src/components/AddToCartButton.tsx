"use client";

import { useCart, formatPrice } from "./CartContext";

type Props = {
  productId: string;
  name: string;
  unit: string;
  priceB2c: number;
};

export function AddToCartButton({ productId, name, unit, priceB2c }: Props) {
  const { addItem, items } = useCart();
  const inCart = items.find((i) => i.productId === productId);

  return (
    <button
      onClick={() => addItem({ productId, name, unit, priceB2c })}
      className="mt-4 w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 active:scale-95"
    >
      {inCart ? `V košíku (${inCart.quantity} ks) — přidat další` : "Do košíku"}
    </button>
  );
}
