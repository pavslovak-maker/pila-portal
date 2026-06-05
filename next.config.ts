import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // DECISION: Sentry a další integrace přidáme až při nasazení (krok 10 / provoz).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
