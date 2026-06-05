import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { desc } from "drizzle-orm";
import { InquiryTable } from "./InquiryTable";

export const dynamic = "force-dynamic"; // vždy čerstvá data, bez cache

export default async function AdminPage() {
  const rows = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Poptávky</h1>
      <InquiryTable rows={rows} />
    </div>
  );
}
