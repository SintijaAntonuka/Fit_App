import type { PrismaClient } from "@/generated/prisma/client";

/** Eingaben des Formulars "Mitglied aufnehmen" als rohe Strings. */
export type MitgliedEingabe = {
  name: string;
  geburtsdatum: string;
  tarif_id: string;
};

/** Feldbezogene Fehlermeldungen, passend zu den Formularfeldern. */
export type MitgliedFehler = Partial<Record<keyof MitgliedEingabe, string>>;

export type MitgliedDaten = {
  name: string;
  geburtsdatum: Date;
  tarif_id: number;
};

export type ValidierungsErgebnis =
  | { ok: true; daten: MitgliedDaten }
  | { ok: false; fehler: MitgliedFehler };

const MIN_ALTER = 0;
const MAX_ALTER = 120;

/**
 * Prüft die Formulareingaben für ein neues Mitglied (F-001).
 * Liefert entweder die bereinigten Daten oder Fehler je Feld.
 */
export function validiereNeuesMitglied(
  eingabe: MitgliedEingabe,
  heute: Date = new Date(),
): ValidierungsErgebnis {
  const fehler: MitgliedFehler = {};

  const name = eingabe.name?.trim() ?? "";
  if (name.length === 0) {
    fehler.name = "Bitte einen Namen eingeben.";
  } else if (name.length < 2) {
    fehler.name = "Der Name muss mindestens 2 Zeichen lang sein.";
  }

  const roh = eingabe.geburtsdatum?.trim() ?? "";
  let geburtsdatum: Date | null = null;
  if (roh.length === 0) {
    fehler.geburtsdatum = "Bitte ein Geburtsdatum angeben.";
  } else {
    // Datum aus <input type="date"> ("JJJJ-MM-TT") als UTC-Mitternacht lesen.
    const treffer = /^(\d{4})-(\d{2})-(\d{2})$/.exec(roh);
    const datum = treffer
      ? new Date(Date.UTC(Number(treffer[1]), Number(treffer[2]) - 1, Number(treffer[3])))
      : new Date(roh);
    const gueltig =
      !Number.isNaN(datum.getTime()) &&
      datum.getUTCFullYear() === (treffer ? Number(treffer[1]) : datum.getUTCFullYear());

    if (!gueltig) {
      fehler.geburtsdatum = "Bitte ein gültiges Datum angeben.";
    } else if (datum.getTime() > heute.getTime()) {
      fehler.geburtsdatum = "Das Geburtsdatum darf nicht in der Zukunft liegen.";
    } else {
      const jahre = heute.getUTCFullYear() - datum.getUTCFullYear();
      if (jahre < MIN_ALTER || jahre > MAX_ALTER) {
        fehler.geburtsdatum = "Bitte ein realistisches Geburtsdatum angeben.";
      } else {
        geburtsdatum = datum;
      }
    }
  }

  const tarifRoh = eingabe.tarif_id?.trim() ?? "";
  const tarifId = Number(tarifRoh);
  if (tarifRoh.length === 0) {
    fehler.tarif_id = "Bitte einen Tarif wählen.";
  } else if (!Number.isInteger(tarifId) || tarifId <= 0) {
    fehler.tarif_id = "Bitte einen gültigen Tarif wählen.";
  }

  if (Object.keys(fehler).length > 0) {
    return { ok: false, fehler };
  }

  return {
    ok: true,
    daten: { name, geburtsdatum: geburtsdatum as Date, tarif_id: tarifId },
  };
}

export type AnlegeErgebnis =
  | { ok: true; mitglied_id: number }
  | { ok: false; fehler: MitgliedFehler };

/**
 * Legt ein neues Mitglied an. Startwerte laut SPEC.md: Status "aktiv",
 * keine Buchungen im Monat, kein No-Show, keine Sperre.
 * Der Tarif muss existieren (Fremdschlüssel).
 */
export async function legeMitgliedAn(
  client: PrismaClient,
  eingabe: MitgliedEingabe,
  heute: Date = new Date(),
): Promise<AnlegeErgebnis> {
  const validierung = validiereNeuesMitglied(eingabe, heute);
  if (!validierung.ok) {
    return { ok: false, fehler: validierung.fehler };
  }

  const tarif = await client.tarif.findUnique({
    where: { tarif_id: validierung.daten.tarif_id },
  });
  if (!tarif) {
    return { ok: false, fehler: { tarif_id: "Dieser Tarif existiert nicht." } };
  }

  const mitglied = await client.mitglied.create({
    data: {
      name: validierung.daten.name,
      geburtsdatum: validierung.daten.geburtsdatum,
      tarif_id: validierung.daten.tarif_id,
    },
  });

  return { ok: true, mitglied_id: mitglied.mitglied_id };
}
