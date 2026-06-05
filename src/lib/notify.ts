import { Resend } from "resend";
import { logger } from "./logger";

type NotifyPayload =
  | { kind: "inquiry"; inquiryId: string; type: string }
  | { kind: "order"; orderId: string };

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  milling: "Pořez dřeva",
  drying: "Sušení dřeva",
  sharpening: "Ostření kotoučů",
};

/**
 * Odešle e-mail majiteli při nové poptávce nebo objednávce.
 * Selhání NESMÍ shodit uložení dat — vždy voláme v .catch().
 */
export async function notifyOwner(payload: NotifyPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL;

  // Pokud Resend není nakonfigurovaný, jen zaloguj (nevyhazuj chybu)
  if (!apiKey || apiKey.startsWith("re_...") || !ownerEmail) {
    logger.warn({ ...payload }, "notify_owner_skipped_no_config");
    return;
  }

  const resend = new Resend(apiKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  let subject: string;
  let html: string;

  if (payload.kind === "inquiry") {
    const typeLabel = INQUIRY_TYPE_LABELS[payload.type] ?? payload.type;
    subject = "Nova poptavka: " + typeLabel;
    html = [
      "<h2>Nova poptavka — " + typeLabel + "</h2>",
      "<p>Poptavka byla ulozena v systemu.</p>",
      "<p><a href='" + siteUrl + "/admin'>Zobrazit v adminu</a></p>",
      "<hr>",
      "<p style='color:#888;font-size:12px'>Portal pily — automaticka notifikace</p>",
    ].join("");
  } else {
    subject = "Nova objednavka paliva";
    html = [
      "<h2>Nova objednavka paliva</h2>",
      "<p>Zakaznik dokoncil objednavku.</p>",
      "<p><a href='" + siteUrl + "/admin/orders'>Zobrazit v adminu</a></p>",
      "<hr>",
      "<p style='color:#888;font-size:12px'>Portal pily — automaticka notifikace</p>",
    ].join("");
  }

  const { error } = await resend.emails.send({
    from: "Portal pily <notifikace@resend.dev>",
    to: [ownerEmail],
    subject,
    html,
  });

  if (error) {
    throw new Error("Resend error: " + JSON.stringify(error));
  }

  logger.info({ ...payload, to: ownerEmail }, "notify_owner_sent");
}
