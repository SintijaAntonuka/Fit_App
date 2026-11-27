import type { Tarif } from "@/generated/prisma/client";

/**
 * Reine Regeln aus SPEC.md, die noch keine Oberfläche brauchen.
 * BR1 regelt das Monatslimit und die Rückgabe bei Stornierung.
 */

type TarifLimit = Pick<Tarif, "max_kursbuchungen_pro_monat">;

/** Frist aus BR1/BR2: bis 2 Stunden vor Kursbeginn ist ein Storno rechtzeitig. */
export const STORNO_FRIST_STUNDEN = 2;

/**
 * BR1: Nur Präsenzkurse zählen auf das Monatslimit.
 * Online-Kursbuchungen sind nicht limitrelevant.
 */
export function istLimitrelevant(kursformat: "Präsenz" | "Online"): boolean {
  return kursformat === "Präsenz";
}

/**
 * BR1: Prüft, ob mit diesem Tarif noch eine limitrelevante (Präsenz-)Buchung
 * möglich ist. `max_kursbuchungen_pro_monat === null` bedeutet unbegrenzt
 * (Plus und Premium).
 */
export function darfLimitrelevantBuchen(
  tarif: TarifLimit,
  buchungenDieserMonat: number,
): boolean {
  const max = tarif.max_kursbuchungen_pro_monat;
  if (max === null) return true;
  return buchungenDieserMonat < max;
}

/**
 * BR1: Ein rechtzeitiges Storno (mindestens 2 Stunden vor Kursbeginn) gibt die
 * Buchung bei limitgebundenen Tarifen fürs Monatslimit zurück; bei später
 * Stornierung nicht. Tarife ohne Limit (Plus, Premium) haben nichts zurückzugeben.
 */
export function stornoGibtLimitZurueck(
  tarif: TarifLimit,
  kursbeginn: Date,
  stornoZeitpunkt: Date,
): boolean {
  if (tarif.max_kursbuchungen_pro_monat === null) return false;
  const frist = kursbeginn.getTime() - STORNO_FRIST_STUNDEN * 60 * 60 * 1000;
  return stornoZeitpunkt.getTime() <= frist;
}
