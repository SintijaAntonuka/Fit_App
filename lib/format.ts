/** Datum als "TT.MM.JJJJ" in deutscher Schreibweise, zeitzonensicher (UTC). */
export function formatiereDatum(datum: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(datum);
}

/** Alter in vollen Jahren, gemessen am Stichtag (Standard: heute). */
export function alterAm(datum: Date, stichtag: Date = new Date()): number {
  let alter = stichtag.getUTCFullYear() - datum.getUTCFullYear();
  const monat = stichtag.getUTCMonth() - datum.getUTCMonth();
  if (monat < 0 || (monat === 0 && stichtag.getUTCDate() < datum.getUTCDate())) {
    alter -= 1;
  }
  return alter;
}
