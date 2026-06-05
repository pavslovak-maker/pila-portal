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

const inp = { style: { width: "100%", padding: "12px 16px", fontSize: 15, borderRadius: 12, border: "1px solid #d2d2d7", background: "#fff", color: "#1d1d1f", outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" }};
const lbl = { style: { display: "block", fontSize: 14, fontWeight: 500, color: "#1d1d1f", marginBottom: 8 }};

export function SharpeningForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { toolType: "circular_blade" },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const result = await submitInquiry({
      type: "sharpening",
      payload: { toolType: values.toolType, count: values.count, diameterMm: values.diameterMm },
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
        <label {...lbl}>Typ nástroje <span style={{ color: "#ff3b30" }}>*</span></label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: "#1d1d1f", cursor: "pointer" }}><input type="radio" value="circular_blade" {...register("toolType")} /> Pilový kotouč</label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: "#1d1d1f", cursor: "pointer" }}><input type="radio" value="band_saw" {...register("toolType")} /> Pilový pás</label>
        </div>
      </div>

      <div>
        <label {...lbl}>Počet kusů <span style={{ color: "#ff3b30" }}>*</span></label>
        <input type="number" min="1" max="500" {...register("count", { valueAsNumber: true })} placeholder="např. 3" {...inp} />
        {errors.count && <p style={{ color: "#ff3b30", fontSize: 13, marginTop: 6 }}>{errors.count.message}</p>}
      </div>

      <div>
        <label {...lbl}>Průměr kotouče (mm, volitelné)</label>
        <input type="number" min="1" {...register("diameterMm", { valueAsNumber: true })} placeholder="např. 300" {...inp} />
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
        <textarea {...register("note")} rows={3} placeholder="Počet zubů, materiál..." style={{ ...inp.style, resize: "vertical" }} />
      </div>

      {serverError && <div style={{ background: "#fff2f2", border: "1px solid #ffc5c5", borderRadius: 12, padding: "12px 16px", fontSize: 14, color: "#cc0000" }}>{serverError}</div>}

      <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: "16px", background: isSubmitting ? "#999" : "#0071e3", color: "white", border: "none", borderRadius: 980, fontSize: 16, fontWeight: 500, cursor: isSubmitting ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
        {isSubmitting ? "Odesílám…" : "Odeslat poptávku"}
      </button>
    </form>
  );
}
