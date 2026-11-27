import { describe, it, expect } from "vitest";
import { formatiereDatum, alterAm } from "@/lib/format";

describe("Datum-Formatierung (F-001)", () => {
  it("formatiert als TT.MM.JJJJ", () => {
    expect(formatiereDatum(new Date(Date.UTC(1994, 2, 12)))).toBe("12.03.1994");
  });

  it("berechnet das Alter am Stichtag", () => {
    const geburtstag = new Date(Date.UTC(1994, 2, 12));
    expect(alterAm(geburtstag, new Date(Date.UTC(2026, 2, 11)))).toBe(31);
    expect(alterAm(geburtstag, new Date(Date.UTC(2026, 2, 12)))).toBe(32);
  });
});
