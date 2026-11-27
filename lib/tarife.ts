import type { Tarif } from "@/generated/prisma/client";

/** Kurztext, wie viele Präsenzkursbuchungen ein Tarif pro Monat erlaubt. */
export function tarifLimitText(tarif: Pick<Tarif, "max_kursbuchungen_pro_monat">): string {
  const max = tarif.max_kursbuchungen_pro_monat;
  if (max === null) return "Unbegrenzte Kursbuchungen";
  return max === 1 ? "1 Kursbuchung pro Monat" : `${max} Kursbuchungen pro Monat`;
}

/** Beschreibt den Online-Zugang eines Tarifs als kurzen Satz. */
export function tarifOnlineText(tarif: Pick<Tarif, "online_zugang">): string {
  return tarif.online_zugang
    ? "Zugang zu Online-Kursen und On-Demand-Videos"
    : "Nur Präsenzkurse";
}

/** Beschreibt die inklusiven Personal-Training-Slots pro Monat. */
export function tarifPtText(tarif: Pick<Tarif, "pt_slots_pro_monat">): string {
  const slots = tarif.pt_slots_pro_monat;
  if (slots === 0) return "Kein inklusives Personal Training";
  return slots === 1
    ? "1 Personal-Training-Termin pro Monat inklusive"
    : `${slots} Personal-Training-Termine pro Monat inklusive`;
}
