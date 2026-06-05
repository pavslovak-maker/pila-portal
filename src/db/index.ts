import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// DECISION: singleton pattern — v Next.js dev módu se modul načítá opakovaně
// díky hot-reloadu. Uložíme klienta do globalThis, aby se connection pool
// nevytvářel znovu při každém reloadu.

const globalForDb = globalThis as unknown as { _pgClient?: postgres.Sql };

const client =
  globalForDb._pgClient ??
  postgres(process.env.DATABASE_URL!, {
    max: 10,       // max připojení v poolu
    ssl: "require", // Neon / Supabase vyžadují SSL
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb._pgClient = client;
}

export const db = drizzle(client, { schema });
