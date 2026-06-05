/**
 * Jednotný typ pro návratové hodnoty Server Actions.
 * UI se rozhoduje podle `result.ok` — nikdy nenechávej chybu bubblovat na klienta.
 */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };
