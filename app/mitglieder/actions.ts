"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { legeMitgliedAn, type MitgliedFehler } from "@/lib/mitglieder";

export type FormState = {
  fehler?: MitgliedFehler;
  werte?: { name: string; geburtsdatum: string; tarif_id: string };
};

export async function mitgliedAnlegenAction(
  _vorher: FormState,
  formData: FormData,
): Promise<FormState> {
  const eingabe = {
    name: String(formData.get("name") ?? ""),
    geburtsdatum: String(formData.get("geburtsdatum") ?? ""),
    tarif_id: String(formData.get("tarif_id") ?? ""),
  };

  const ergebnis = await legeMitgliedAn(prisma, eingabe);
  if (!ergebnis.ok) {
    return { fehler: ergebnis.fehler, werte: eingabe };
  }

  redirect(`/mitglieder?angelegt=${ergebnis.mitglied_id}`);
}
