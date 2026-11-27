import { describe, it, expect } from "vitest";
import { tarifLimitText, tarifOnlineText, tarifPtText } from "@/lib/tarife";

describe("Tarif-Beschreibungen (F-001)", () => {
  it("beschreibt das Buchungslimit korrekt", () => {
    expect(tarifLimitText({ max_kursbuchungen_pro_monat: 5 })).toBe("5 Kursbuchungen pro Monat");
    expect(tarifLimitText({ max_kursbuchungen_pro_monat: 1 })).toBe("1 Kursbuchung pro Monat");
    expect(tarifLimitText({ max_kursbuchungen_pro_monat: null })).toBe("Unbegrenzte Kursbuchungen");
  });

  it("beschreibt den Online-Zugang korrekt", () => {
    expect(tarifOnlineText({ online_zugang: true })).toContain("Online-Kursen");
    expect(tarifOnlineText({ online_zugang: false })).toBe("Nur Präsenzkurse");
  });

  it("beschreibt die inklusiven PT-Slots korrekt", () => {
    expect(tarifPtText({ pt_slots_pro_monat: 0 })).toBe("Kein inklusives Personal Training");
    expect(tarifPtText({ pt_slots_pro_monat: 1 })).toContain("1 Personal-Training-Termin");
    expect(tarifPtText({ pt_slots_pro_monat: 2 })).toContain("2 Personal-Training-Termine");
  });
});
