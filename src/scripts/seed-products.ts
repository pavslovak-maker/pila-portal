/**
 * Seed testovacích produktů paliva.
 * Spusť jednou: npx tsx src/scripts/seed-products.ts
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

const client = postgres(process.env.DATABASE_URL!, { ssl: "require" });
const db = drizzle(client, { schema });

const PRODUCTS = [
  {
    sku: "DREVO-TVRDE-1PRM",
    name: "Tvrdé palivové dřevo (dub, buk)",
    description: "Štípané tvrdé dřevo, délka 33 cm. Ideální pro krby a kachlová kamna.",
    unit: "prm" as const,
    priceB2c: 210000, // 2 100 Kč v haléřích
    stock: 50,
  },
  {
    sku: "DREVO-MEKKE-1PRM",
    name: "Měkké palivové dřevo (smrk, borovice)",
    description: "Štípané měkké dřevo, délka 33 cm. Rychle hoří, vhodné pro zatápění.",
    unit: "prm" as const,
    priceB2c: 160000, // 1 600 Kč
    stock: 80,
  },
  {
    sku: "BRIKETY-RUF-10KG",
    name: "Dřevěné brikety RUF (10 kg)",
    description: "Lisované dřevěné brikety bez příměsí. Dlouhá doba hoření, nízká popelnatost.",
    unit: "kg" as const,
    priceB2c: 25000, // 250 Kč za 10 kg balení
    stock: 200,
  },
  {
    sku: "PELETY-VRECKO-15KG",
    name: "Dřevěné pelety (pytel 15 kg)",
    description: "Certifikované pelety ENplus A1. Pro automatické kotle a krbové vložky.",
    unit: "kg" as const,
    priceB2c: 22000, // 220 Kč za pytel 15 kg
    stock: 300,
  },
  {
    sku: "STEPKA-1PRM",
    name: "Dřevní štěpka (1 prm)",
    description: "Čerstvá dřevní štěpka ze smrkového dřeva. Vhodná pro štěpkové kotle.",
    unit: "prm" as const,
    priceB2c: 80000, // 800 Kč
    stock: 100,
  },
];

async function main() {
  console.log("Seeduji produkty...");
  for (const p of PRODUCTS) {
    await db
      .insert(schema.products)
      .values(p)
      .onConflictDoNothing({ target: schema.products.sku });
    console.log(`  ✓ ${p.name}`);
  }
  console.log("Hotovo!");
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
