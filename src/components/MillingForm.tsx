"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { millingPayload } from "@/lib/schemas";
import { submitInquiry } from "@/app/actions/inquiry";

const formSchema = millingPayload.extend({
  contactName: z.string().min(2, "Zadejte jméno"),
  contactPhone: z.string().min(6, "Zadejte telefon"),
  contactEmail: z.string().email("Neplatný e-mail").optional().or(z.literal("")),
  note: z.string().max(2000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SPECIES_OPTIONS = [
  { value: "dub", label: "Dub" }, { value: "smrk", label: "Smrk" },
  { value: "buk", label: "Buk" }, { value: "borovice", label: "Borovice" },
  { value: "jine", label: "Jiná dřevina" },
];

const inputClass = "w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-white placeholder-stone-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";
const labelClass = "mb-1 block text-sm font-medium text-stone-300";

export function MillingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { mode: "cut_own_logs", sawnType: "prkna" },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const result = await submitInquiry({
      type: "milling",
      payload: { mode: values.mode, species: values.species, volumeM3: values.volumeM3, sawnType: values.sawnType, thicknessMm: values.thicknessMm, preferredDate: values.preferredDate },
      contactName: values.contactName, contactPhone: values.contactPhone,
      contactEmail: values.contactEmail || undefined, note: values.note, idempotencyKey,
    });
    if (result.ok) setSubmitted(true);
    else setServerError(result.error);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-700 bg-green-900/40 p-6 text-center">
        <p className="text-lg font-semibold text-green-300">Děkujeme za poptávku!</p>
        <p className="mt-2 text-green-400">Ozveme se do 24 hodin na zadané telefonní číslo.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className={labelClass}>Co potřebujete? <span className="text-red-500">*</span></label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex items-center gap-2 text-sm text-stone-300"><input type="radio" value="cut_own_logs" {...register("mode")} className="accent-red-500" /> Nařezat vlastní klády</label>
          <label className="flex items-center gap-2 text-sm text-stone-300"><input type="radio" value="buy_sawn" {...register("mode")} className="accent-red-500" /> Koupit hotové řezivo</label>
        </div>
      </div>

      <div>
        <label className={labelClass}>Dřevina <span className="text-red-500">*</span></label>
        <select {...register("species")} className={inputClass}>
          <option value="" className="bg-stone-800">— vyberte —</option>
          {SPECIES_OPTIONS.map((o) => <option key={o.value} value={o.value} className="bg-stone-800">{o.label}</option>)}
        </select>
        {errors.species && <p className="mt-1 text-xs text-red-400">{errors.species.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Objem (m³) <span className="text-red-500">*</span></label>
        <input type="number" step="0.1" min="0.1" {...register("volumeM3", { valueAsNumber: true })} placeholder="např. 5" className={inputClass} />
        {errors.volumeM3 && <p className="mt-1 text-xs text-red-400">{errors.volumeM3.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Typ řeziva <span className="text-red-500">*</span></label>
        <select {...register("sawnType")} className={inputClass}>
          <option value="prkna" className="bg-stone-800">Prkna</option>
          <option value="fosny" className="bg-stone-800">Fošny</option>
          <option value="hranoly" className="bg-stone-800">Hranoly</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Tloušťka (mm, volitelné)</label>
        <input type="number" min="1" max="500" {...register("thicknessMm", { valueAsNumber: true })} placeholder="např. 50" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Orientační termín (volitelné)</label>
        <input type="date" {...register("preferredDate")} className={inputClass} />
      </div>

      <hr className="border-stone-700" />
      <p className="text-sm font-semibold text-stone-200">Vaše kontaktní údaje</p>

      <div>
        <label className={labelClass}>Jméno a příjmení <span className="text-red-500">*</span></label>
        <input type="text" {...register("contactName")} placeholder="Jan Novák" className={inputClass} />
        {errors.contactName && <p className="mt-1 text-xs text-red-400">{errors.contactName.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Telefon <span className="text-red-500">*</span></label>
        <input type="tel" {...register("contactPhone")} placeholder="+420 777 123 456" className={inputClass} />
        {errors.contactPhone && <p className="mt-1 text-xs text-red-400">{errors.contactPhone.message}</p>}
      </div>

      <div>
        <label className={labelClass}>E-mail (volitelné)</label>
        <input type="email" {...register("contactEmail")} placeholder="jan@example.cz" className={inputClass} />
        {errors.contactEmail && <p className="mt-1 text-xs text-red-400">{errors.contactEmail.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Poznámka (volitelné)</label>
        <textarea {...register("note")} rows={3} placeholder="Rozměry, zvláštní požadavky..." className={inputClass} />
      </div>

      {serverError && <p className="rounded-lg bg-red-900/40 px-4 py-3 text-sm text-red-300">{serverError}</p>}

      <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50">
        {isSubmitting ? "Odesílám…" : "Odeslat poptávku — ozveme se s cenou"}
      </button>
    </form>
  );
}
