"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { dryingPayload } from "@/lib/schemas";
import { submitInquiry } from "@/app/actions/inquiry";

// Formulářová data = payload + kontakt dohromady (pro jednoduchost v UI)
const formSchema = dryingPayload.extend({
  contactName: z.string().min(2, "Zadejte jméno"),
  contactPhone: z.string().min(6, "Zadejte telefon"),
  contactEmail: z.string().email("Neplatný e-mail").optional().or(z.literal("")),
  note: z.string().max(2000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SPECIES_OPTIONS = [
  { value: "dub", label: "Dub" },
  { value: "smrk", label: "Smrk" },
  { value: "buk", label: "Buk" },
  { value: "borovice", label: "Borovice" },
  { value: "jine", label: "Jiná dřevina" },
];

export function DryingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // idempotencyKey se generuje jednou při načtení komponenty
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { startState: "fresh", targetMoisture: 12 },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const result = await submitInquiry({
      type: "drying",
      payload: {
        species: values.species,
        volumeM3: values.volumeM3,
        startState: values.startState,
        targetMoisture: values.targetMoisture,
        preferredDate: values.preferredDate,
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
      {/* Dřevina */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Dřevina <span className="text-red-500">*</span>
        </label>
        <select
          {...register("species")}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">— vyberte —</option>
          {SPECIES_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors.species && (
          <p className="mt-1 text-xs text-red-600">{errors.species.message}</p>
        )}
      </div>

      {/* Objem */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Objem (m³) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.1"
          min="0.1"
          {...register("volumeM3", { valueAsNumber: true })}
          placeholder="např. 2.5"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        {errors.volumeM3 && (
          <p className="mt-1 text-xs text-red-600">{errors.volumeM3.message}</p>
        )}
      </div>

      {/* Výchozí stav */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Výchozí stav dřeva <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="fresh" {...register("startState")} />
            Čerstvé
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="partially_dry" {...register("startState")} />
            Částečně vyschlé
          </label>
        </div>
      </div>

      {/* Cílová vlhkost */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Požadovaná vlhkost (%) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="0"
          max="100"
          {...register("targetMoisture", { valueAsNumber: true })}
          placeholder="např. 12"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        {errors.targetMoisture && (
          <p className="mt-1 text-xs text-red-600">{errors.targetMoisture.message}</p>
        )}
      </div>

      {/* Orientační termín */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Orientační termín (volitelné)
        </label>
        <input
          type="date"
          {...register("preferredDate")}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <hr className="border-stone-200" />

      {/* Kontaktní údaje */}
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
          placeholder="Cokoliv, co nám usnadní přípravu..."
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
