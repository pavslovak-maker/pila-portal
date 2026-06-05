import pino from "pino";

/**
 * DECISION: V Next.js App Router nefunguje pino transport (worker threads).
 * Pouzivame jednoduchy logger bez transportu — logy jdou primo na stdout.
 */
export const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });
