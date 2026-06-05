"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { sharpeningPayload } from "@/lib/schemas";
import { submitInquiry } from "@/app/actions/inquiry";

const formSchema = sharpeningPayload.extend({
  contactName: z.string().min(2, "Zadejte jméno"),
  contactPhone: z.string().min(6, "Zadejte telefon"),
  contactEmail: z.string().email("Neplatný e-mail").optional().or(z.literal("")),
  note: z.string().max(2000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SharpeningForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { toolType: "circular_blade" },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const result = await submitInquiry({
      type: "sharpening",
      payload: {
        toolType: values.toolType,
        count: values.count,
        diameterMm: values.diameterMm,
      },
      contactName: values.contactName,
      contactPhone: values.contactPhone,
      contactEmail: values.contactEmail || undefined,
      note: values.note,
      idempotencyKey,
    });

    if (result.ok) {
      setSubmitted(true);
    } else {
      setServerError(result.error);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-800">Děkujeme za poptávku!</p>
        <p className="mt-2 text-green-700">
          Ozveme se vám do 24 hodin na zadané telefonní číslo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Typ nástroje */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Typ nástroje <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="circular_blade" {...register("toolType")} />
            Pilový kotouč
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="band_saw" {...register("toolType")} />
            Pilový pás
          </label>
        </div>
      </div>

      {/* Počet */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Počet kusů <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="1"
          max="500"
          {...register("count", { valueAsNumber: true })}
          placeholder="např. 3"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        {errors.count && (
          <p className="mt-1 text-xs text-red-600">{errors.count.message}</p>
        )}
      </div>

      {/* Průměr */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Průměr kotouče (mm, volitelné)
        </label>
        <input
          type="number"
          min="1"
          {...register("diameterMm", { valueAsNumber: true })}
          placeholder="např. 300"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <hr className="border-stone-200" />
      <p className="text-sm font-semibold text-stone-700">Vaše kontaktní údaje</p>

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
          placeholder="Počet zubů, materiál, zvláštní požadavky..."
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
        {isSubmitting ? "Odesílám…" : "Odeslat poptávku — ozveme se s cenou"}
      </button>
    </form>
  );
}
