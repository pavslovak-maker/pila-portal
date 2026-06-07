"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { dryingPayload } from "@/lib/schemas";
import { submitInquiry } from "@/app/actions/inquiry";

const formSchema = dryingPayload.extend({
  contactName: z.string().min(2, "Zadejte jméno"),
  contactPhone: z.string().min(6, "Zadejte telefon"),
  contactEmail: z.string().email("Neplatný e-mail").optional().or(z.literal("")),
  note: z.string().max(2000).optional(),
});
type FormValues = z.infer<typeof formSchema>;

const SPECIES = [
  { value: "dub", label: "Dub" }, { value: "smrk", label: "Smrk" },
  { value: "buk", label: "Buk" }, { value: "borovice", label: "Borovice" },
  { value: "jine", label: "Jiná dřevina" },
];

const inp = { style: { width: "100%", padding: "12px 16px", fontSize: 15, border: "1px solid var(--c-border)", background: "white", color: "var(--c-dark)", outline: "none", boxSizing: "border-box" as const, fontFamily: "var(--font-body)" }};
const lbl = { style: { display: "block", fontSize: 12, fontWeight: 600, color: "var(--c-dark)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontFamily: "var(--font-body)" }};

export function DryingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { startState: "fresh", targetMoisture: 12 },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const result = await submitInquiry({
      type: "drying",
      payload: { species: values.species, volumeM3: values.volumeM3, startState: values.startState, targetMoisture: values.targetMoisture, preferredDate: values.preferredDate },
      contactName: values.contactName, contactPhone: values.contactPhone,
      contactEmail: values.contactEmail || undefined, note: values.note, idempotencyKey,
    });
    if (result.ok) setSubmitted(true);
    else setServerError(result.error);
  };

  if (submitted) {
    return (
      <div style={{ background: "#f2fdf4", border: "1px solid #a3e6b3", borderRadius: 16, padding: "28px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 17, fontWeight: 600, color: "#1a7f37", marginBottom: 8 }}>Děkujeme za poptávku!</p>
        <p style={{ fontSize: 15, color: "#2da44e" }}>Ozveme se do 24 hodin na zadané telefonní číslo.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label {...lbl}>Dřevina <span style={{ color: "#ff3b30" }}>*</span></label>
        <select {...register("species")} {...inp}><option value="">— vyberte —</option>{SPECIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        {errors.species && <p style={{ color: "#ff3b30", fontSize: 13, marginTop: 6 }}>{errors.species.message}</p>}
      </div>

      <div>
        <label {...lbl}>Objem (m³) <span style={{ color: "#ff3b30" }}>*</span></label>
        <input type="number" step="0.1" min="0.1" {...register("volumeM3", { valueAsNumber: true })} placeholder="např. 2.5" {...inp} />
        {errors.volumeM3 && <p style={{ color: "#ff3b30", fontSize: 13, marginTop: 6 }}>{errors.volumeM3.message}</p>}
      </div>

      <div>
        <label {...lbl}>Výchozí stav dřeva <span style={{ color: "#ff3b30" }}>*</span></label>
        <div style={{ display: "flex", gap: 24 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: "#1d1d1f", cursor: "pointer" }}><input type="radio" value="fresh" {...register("startState")} /> Čerstvé</label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: "#1d1d1f", cursor: "pointer" }}><input type="radio" value="partially_dry" {...register("startState")} /> Částečně vyschlé</label>
        </div>
      </div>

      <div>
        <label {...lbl}>Požadovaná vlhkost (%) <span style={{ color: "#ff3b30" }}>*</span></label>
        <input type="number" min="0" max="100" {...register("targetMoisture", { valueAsNumber: true })} placeholder="např. 12" {...inp} />
        {errors.targetMoisture && <p style={{ color: "#ff3b30", fontSize: 13, marginTop: 6 }}>{errors.targetMoisture.message}</p>}
      </div>

      <div>
        <label {...lbl}>Orientační termín (volitelné)</label>
        <input type="date" {...register("preferredDate")} {...inp} />
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #d2d2d7", margin: "4px 0" }} />
      <p style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f" }}>Vaše kontaktní údaje</p>

      <div>
        <label {...lbl}>Jméno a příjmení <span style={{ color: "#ff3b30" }}>*</span></label>
        <input type="text" {...register("contactName")} placeholder="Jan Novák" {...inp} />
        {errors.contactName && <p style={{ color: "#ff3b30", fontSize: 13, marginTop: 6 }}>{errors.contactName.message}</p>}
      </div>

      <div>
        <label {...lbl}>Telefon <span style={{ color: "#ff3b30" }}>*</span></label>
        <input type="tel" {...register("contactPhone")} placeholder="+420 777 123 456" {...inp} />
        {errors.contactPhone && <p style={{ color: "#ff3b30", fontSize: 13, marginTop: 6 }}>{errors.contactPhone.message}</p>}
      </div>

      <div>
        <label {...lbl}>E-mail (volitelné)</label>
        <input type="email" {...register("contactEmail")} placeholder="jan@example.cz" {...inp} />
        {errors.contactEmail && <p style={{ color: "#ff3b30", fontSize: 13, marginTop: 6 }}>{errors.contactEmail.message}</p>}
      </div>

      <div>
        <label {...lbl}>Poznámka (volitelné)</label>
        <textarea {...register("note")} rows={3} placeholder="Cokoliv, co nám usnadní přípravu..." style={{ ...inp.style, resize: "vertical" }} />
      </div>

      {serverError && <div style={{ background: "#fff2f2", border: "1px solid #ffc5c5", borderRadius: 12, padding: "12px 16px", fontSize: 14, color: "#cc0000" }}>{serverError}</div>}

      <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: "16px", background: isSubmitting ? "#999" : "#c8441b", color: "white", border: "none", borderRadius: 0, fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase" as const, fontWeight: 700, fontWeight: 500, cursor: isSubmitting ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
        {isSubmitting ? "Odesílám…" : "Odeslat poptávku"}
      </button>
    </form>
  );
}
