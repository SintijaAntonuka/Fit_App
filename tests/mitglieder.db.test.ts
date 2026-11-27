import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";
import { legeMitgliedAn } from "@/lib/mitglieder";

let verzeichnis: string;
let client: PrismaClient;

function migrationsSql(): string {
  const migrationsRoot = join(process.cwd(), "prisma", "migrations");
  return readdirSync(migrationsRoot)
    .filter((name) => name.endsWith("_f001_mitglied_tarif"))
    .map((name) => readFileSync(join(migrationsRoot, name, "migration.sql"), "utf8"))
    .join("\n");
}

beforeEach(async () => {
  verzeichnis = mkdtempSync(join(tmpdir(), "fitzone-test-"));
  const adapter = new PrismaBetterSqlite3({ url: `file:${join(verzeichnis, "test.db")}` });
  client = new PrismaClient({ adapter });

  const sql = migrationsSql();
  for (const statement of sql.split(";")) {
    const trimmed = statement.trim();
    if (trimmed.length > 0) {
      await client.$executeRawUnsafe(trimmed);
    }
  }

  await client.tarif.createMany({
    data: [
      { name: "Basic", max_kursbuchungen_pro_monat: 5, online_zugang: false, pt_slots_pro_monat: 0 },
      { name: "Plus", max_kursbuchungen_pro_monat: null, online_zugang: true, pt_slots_pro_monat: 0 },
      { name: "Premium", max_kursbuchungen_pro_monat: null, online_zugang: true, pt_slots_pro_monat: 1 },
    ],
  });
});

afterEach(async () => {
  await client.$disconnect();
  rmSync(verzeichnis, { recursive: true, force: true });
});

describe("legeMitgliedAn (F-001)", () => {
  it("legt ein Mitglied mit Tarif an und setzt die Startwerte", async () => {
    const tarif = await client.tarif.findFirstOrThrow({ where: { name: "Basic" } });

    const ergebnis = await legeMitgliedAn(client, {
      name: "Mara Beispiel",
      geburtsdatum: "1994-03-12",
      tarif_id: String(tarif.tarif_id),
    });
    expect(ergebnis.ok).toBe(true);

    const gespeichert = await client.mitglied.findFirstOrThrow({
      where: { name: "Mara Beispiel" },
      include: { tarif: true },
    });
    expect(gespeichert.status).toBe("aktiv");
    expect(gespeichert.buchungen_dieser_monat).toBe(0);
    expect(gespeichert.no_show_zaehler).toBe(0);
    expect(gespeichert.sperre_bis).toBeNull();
    expect(gespeichert.tarif.name).toBe("Basic");
    expect(gespeichert.geburtsdatum.toISOString()).toBe("1994-03-12T00:00:00.000Z");
  });

  it("weist Basic das Limit 5 zu und Plus unbegrenzt", async () => {
    const basic = await client.tarif.findFirstOrThrow({ where: { name: "Basic" } });
    const plus = await client.tarif.findFirstOrThrow({ where: { name: "Plus" } });

    await legeMitgliedAn(client, { name: "Basic Kind", geburtsdatum: "2000-01-01", tarif_id: String(basic.tarif_id) });
    await legeMitgliedAn(client, { name: "Plus Kind", geburtsdatum: "2000-01-01", tarif_id: String(plus.tarif_id) });

    const b = await client.mitglied.findFirstOrThrow({ where: { name: "Basic Kind" }, include: { tarif: true } });
    const p = await client.mitglied.findFirstOrThrow({ where: { name: "Plus Kind" }, include: { tarif: true } });
    expect(b.tarif.max_kursbuchungen_pro_monat).toBe(5);
    expect(p.tarif.max_kursbuchungen_pro_monat).toBeNull();
    expect(p.tarif.online_zugang).toBe(true);
  });

  it("lehnt einen unbekannten Tarif ab", async () => {
    const ergebnis = await legeMitgliedAn(client, {
      name: "Ohne Tarif",
      geburtsdatum: "1990-05-05",
      tarif_id: "9999",
    });
    expect(ergebnis.ok).toBe(false);
    if (!ergebnis.ok) expect(ergebnis.fehler.tarif_id).toBeTruthy();
    expect(await client.mitglied.count()).toBe(0);
  });

  it("legt bei ungültiger Eingabe kein Mitglied an", async () => {
    const ergebnis = await legeMitgliedAn(client, {
      name: "",
      geburtsdatum: "2030-01-01",
      tarif_id: "1",
    });
    expect(ergebnis.ok).toBe(false);
    expect(await client.mitglied.count()).toBe(0);
  });
});
