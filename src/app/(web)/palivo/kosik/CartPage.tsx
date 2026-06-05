"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useCart, formatPrice } from "@/components/CartContext";
import { createOrder } from "@/app/actions/order";

const checkoutSchema = z
  .object({
    contactName: z.string().min(2, "Zadejte jméno"),
    contactPhone: z.string().min(6, "Zadejte telefon"),
    contactEmail: z.string().email("Neplatný e-mail").optional().or(z.literal("")),
    deliveryMethod: z.enum(["pickup", "delivery"]),
    deliveryAddress: z.string().max(300).optional(),
    paymentMethod: z.enum(["on_pickup"]), // card přidáme se Stripe
    note: z.string().max(2000).optional(),
  })
  .refine((d) => d.deliveryMethod !== "delivery" || !!d.deliveryAddress, {
    message: "Zadejte adresu doručení",
    path: ["deliveryAddress"],
  });

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { deliveryMethod: "pickup", paymentMethod: "on_pickup" },
  });

  const deliveryMethod = watch("deliveryMethod");

  const onSubmit = async (values: CheckoutValues) => {
    setServerError(null);
    const result = await createOrder({
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      paymentMethod: values.paymentMethod,
      deliveryMethod: values.deliveryMethod,
      deliveryAddress: values.deliveryAddress,
      contact: {
        contactName: values.contactName,
        contactPhone: values.contactPhone,
        contactEmail: values.contactEmail || undefined,
        note: values.note,
      },
      idempotencyKey,
    });

    if (result.ok) {
      clearCart();
      setOrderId(result.data.orderId);
    } else {
      setServerError(result.error);
    }
  };

  // Potvrzení objednávky
  if (orderId) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-xl border border-green-200 bg-green-50 p-8">
          <p className="text-2xl">✅</p>
          <p className="mt-3 text-lg font-semibold text-green-800">
            Objednávka přijata!
          </p>
          <p className="mt-2 text-green-700">
            Ozveme se vám na zadané telefonní číslo pro potvrzení termínu a platby.
          </p>
          <p className="mt-4 text-xs text-green-600">Číslo objednávky: {orderId}</p>
          <Link
            href="/palivo"
            className="mt-6 inline-block rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Zpět na palivo
          </Link>
        </div>
      </main>
    );
  }

  // Prázdný košík
  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-4xl">🛒</p>
        <p className="mt-4 text-lg text-stone-600">Košík je prázdný.</p>
        <Link
          href="/palivo"
          className="mt-6 inline-block rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700"
        >
          Zpět na palivo
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Košík</h1>

      {/* Položky */}
      <div className="rounded-xl border border-stone-200 bg-white">
        {items.map((item, idx) => (
          <div
            key={item.productId}
            className={`flex items-center gap-4 px-5 py-4 ${idx > 0 ? "border-t border-stone-100" : ""}`}
          >
            <div className="flex-1">
              <p className="font-medium text-stone-800">{item.name}</p>
              <p className="text-sm text-stone-500">
                {formatPrice(item.priceB2c)} / {item.unit}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-semibold text-stone-800">
              {formatPrice(item.priceB2c * item.quantity)}
            </p>
            <button
              onClick={() => removeItem(item.productId)}
              className="ml-2 text-stone-300 hover:text-red-400"
              title="Odebrat"
            >
              ✕
            </button>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-stone-200 px-5 py-4">
          <span className="font-semibold text-stone-700">Celkem</span>
          <span className="text-lg font-bold text-amber-700">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Formulář */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <h2 className="text-lg font-semibold text-stone-800">Doprava a platba</h2>

        {/* Doprava */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">Způsob odběru</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="pickup" {...register("deliveryMethod")} />
              Osobní odběr u nás
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="delivery" {...register("deliveryMethod")} />
              Dovoz na adresu (cenu dovozu dohodnem telefonicky)
            </label>
          </div>
        </div>

        {deliveryMethod === "delivery" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Adresa doručení <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("deliveryAddress")}
              placeholder="Ulice, číslo, město"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.deliveryAddress && (
              <p className="mt-1 text-xs text-red-600">{errors.deliveryAddress.message}</p>
            )}
          </div>
        )}

        {/* Platba */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">Způsob platby</label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="on_pickup" {...register("paymentMethod")} />
            Platba při převzetí (hotově nebo kartou na místě)
          </label>
          <p className="mt-1 text-xs text-stone-400">
            Platba kartou online bude brzy dostupná.
          </p>
        </div>

        <hr className="border-stone-200" />
        <h2 className="text-lg font-semibold text-stone-800">Kontaktní údaje</h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Jméno a příjmení <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("contactName")}
            placeholder="Jan Novák"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.contactName && (
            <p className="mt-1 text-xs text-red-600">{errors.contactName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Telefon <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register("contactPhone")}
            placeholder="+420 777 123 456"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.contactPhone && (
            <p className="mt-1 text-xs text-red-600">{errors.contactPhone.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            E-mail (volitelné)
          </label>
          <input
            type="email"
            {...register("contactEmail")}
            placeholder="jan@example.cz"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.contactEmail && (
            <p className="mt-1 text-xs text-red-600">{errors.contactEmail.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Poznámka (volitelné)
          </label>
          <textarea
            {...register("note")}
            rows={3}
            placeholder="Termín, přístup k nemovitosti, jiné požadavky..."
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
        >
          {isSubmitting ? "Odesílám objednávku…" : `Objednat — ${formatPrice(totalPrice)}`}
        </button>
      </form>
    </main>
  );
}
