import { describe, it, expect } from "vitest";
import { validiereNeuesMitglied } from "@/lib/mitglieder";

const heute = new Date(Date.UTC(2026, 10, 27)); // 27.11.2026

describe("validiereNeuesMitglied (F-001)", () => {
  it("akzeptiert gültige Eingaben und liefert bereinigte Daten", () => {
    const ergebnis = validiereNeuesMitglied(
      { name: "  Mara Beispiel ", geburtsdatum: "1994-03-12", tarif_id: "2" },
      heute,
    );
    expect(ergebnis.ok).toBe(true);
    if (ergebnis.ok) {
      expect(ergebnis.daten.name).toBe("Mara Beispiel");
      expect(ergebnis.daten.geburtsdatum.toISOString()).toBe("1994-03-12T00:00:00.000Z");
      expect(ergebnis.daten.tarif_id).toBe(2);
    }
  });

  it("verlangt einen Namen", () => {
    const ergebnis = validiereNeuesMitglied(
      { name: "   ", geburtsdatum: "1994-03-12", tarif_id: "1" },
      heute,
    );
    expect(ergebnis.ok).toBe(false);
    if (!ergebnis.ok) expect(ergebnis.fehler.name).toBeTruthy();
  });

  it("verlangt einen Tarif", () => {
    const ergebnis = validiereNeuesMitglied(
      { name: "Mara Beispiel", geburtsdatum: "1994-03-12", tarif_id: "" },
      heute,
    );
    expect(ergebnis.ok).toBe(false);
    if (!ergebnis.ok) expect(ergebnis.fehler.tarif_id).toBeTruthy();
  });

  it("lehnt ein Geburtsdatum in der Zukunft ab", () => {
    const ergebnis = validiereNeuesMitglied(
      { name: "Mara Beispiel", geburtsdatum: "2027-01-01", tarif_id: "1" },
      heute,
    );
    expect(ergebnis.ok).toBe(false);
    if (!ergebnis.ok) expect(ergebnis.fehler.geburtsdatum).toBeTruthy();
  });

  it("lehnt ein ungültiges Datum ab", () => {
    const ergebnis = validiereNeuesMitglied(
      { name: "Mara Beispiel", geburtsdatum: "31.02.1990", tarif_id: "1" },
      heute,
    );
    expect(ergebnis.ok).toBe(false);
    if (!ergebnis.ok) expect(ergebnis.fehler.geburtsdatum).toBeTruthy();
  });
});
