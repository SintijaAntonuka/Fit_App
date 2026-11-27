import { describe, it, expect } from "vitest";
import {
  darfLimitrelevantBuchen,
  istLimitrelevant,
  stornoGibtLimitZurueck,
  STORNO_FRIST_STUNDEN,
} from "@/lib/buchungsregeln";

// Tarife wie im Seed: Basic = 5, Plus/Premium = unbegrenzt.
const basic = { max_kursbuchungen_pro_monat: 5 };
const plus = { max_kursbuchungen_pro_monat: null };
const premium = { max_kursbuchungen_pro_monat: null };

describe("BR1 · Monatslimit (Basic 5, Plus/Premium unbegrenzt)", () => {
  it("zählt nur Präsenzkurse auf das Limit", () => {
    expect(istLimitrelevant("Präsenz")).toBe(true);
    expect(istLimitrelevant("Online")).toBe(false);
  });

  it("erlaubt Basic bis einschließlich 5 Buchungen, dann nicht mehr", () => {
    expect(darfLimitrelevantBuchen(basic, 0)).toBe(true);
    expect(darfLimitrelevantBuchen(basic, 4)).toBe(true);
    expect(darfLimitrelevantBuchen(basic, 5)).toBe(false);
    expect(darfLimitrelevantBuchen(basic, 6)).toBe(false);
  });

  it("erlaubt Plus und Premium unbegrenzt viele Buchungen", () => {
    expect(darfLimitrelevantBuchen(plus, 100)).toBe(true);
    expect(darfLimitrelevantBuchen(premium, 100)).toBe(true);
  });

  it("erlaubt Basic auch bei erreichtem Limit noch eine Online-Buchung", () => {
    // Online-Buchungen sind nicht limitrelevant, das Limit gilt nur für Präsenz.
    const amLimit = darfLimitrelevantBuchen(basic, 5);
    expect(amLimit).toBe(false);
    // Eine Online-Buchung läuft nicht über darfLimitrelevantBuchen.
    expect(istLimitrelevant("Online")).toBe(false);
  });
});

describe("BR1 · Storno gibt die Buchung fürs Monatslimit zurück", () => {
  const kursbeginn = new Date(Date.UTC(2026, 10, 27, 18, 0)); // 27.11.2026, 18:00 UTC

  it("gibt bei Basic innerhalb der 2-Stunden-Frist zurück", () => {
    const rechtzeitig = new Date(kursbeginn.getTime() - STORNO_FRIST_STUNDEN * 60 * 60 * 1000);
    expect(stornoGibtLimitZurueck(basic, kursbeginn, rechtzeitig)).toBe(true);

    const frueher = new Date(kursbeginn.getTime() - 5 * 60 * 60 * 1000);
    expect(stornoGibtLimitZurueck(basic, kursbeginn, frueher)).toBe(true);
  });

  it("gibt bei Basic nach der Frist nicht zurück", () => {
    const knappZuSpaet = new Date(kursbeginn.getTime() - STORNO_FRIST_STUNDEN * 60 * 60 * 1000 + 1000);
    expect(stornoGibtLimitZurueck(basic, kursbeginn, knappZuSpaet)).toBe(false);

    const nachBeginn = new Date(kursbeginn.getTime() + 60 * 1000);
    expect(stornoGibtLimitZurueck(basic, kursbeginn, nachBeginn)).toBe(false);
  });

  it("hat bei Plus und Premium nichts zurückzugeben (kein Limit)", () => {
    const frueh = new Date(kursbeginn.getTime() - 5 * 60 * 60 * 1000);
    expect(stornoGibtLimitZurueck(plus, kursbeginn, frueh)).toBe(false);
    expect(stornoGibtLimitZurueck(premium, kursbeginn, frueh)).toBe(false);
  });

  it("behandelt genau 2 Stunden vor Beginn als rechtzeitig", () => {
    const genauFrist = new Date(kursbeginn.getTime() - 2 * 60 * 60 * 1000);
    expect(stornoGibtLimitZurueck(basic, kursbeginn, genauFrist)).toBe(true);
  });
});
