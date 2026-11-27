import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { UserPlus, Users, Snowflake, CalendarOff, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/AppShell";
import { StatusBadge, Badge } from "@/components/Badge";
import { formatiereDatum } from "@/lib/format";

export const metadata = { title: "Mitglieder · FitZone Berlin" };

async function ladeMitglieder() {
  // An den Request binden: der Stichtag darf erst zur Laufzeit entstehen.
  await connection();
  const mitglieder = await prisma.mitglied.findMany({
    orderBy: { angelegt_am: "desc" },
    include: { tarif: true },
  });
  // Stichtag einmal serverseitig bestimmen, damit das Rendern rein bleibt.
  return { mitglieder, jetzt: new Date() };
}

type MitgliedMitTarif = Awaited<ReturnType<typeof ladeMitglieder>>["mitglieder"][number];

function SperrHinweis({ sperreBis, jetzt }: { sperreBis: Date | null; jetzt: Date }) {
  if (!sperreBis || sperreBis.getTime() <= jetzt.getTime()) return null;
  return (
    <Badge ton="akzent">
      <Snowflake className="size-3.5" />
      Gesperrt bis {formatiereDatum(sperreBis)}
    </Badge>
  );
}

function ErfolgsHinweis({ mitglied }: { mitglied: MitgliedMitTarif }) {
  return (
    <div className="mt-6 flex items-center gap-3 rounded-card border border-aktiv/25 bg-aktiv-soft/70 px-4 py-3.5 text-sm text-aktiv">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-aktiv text-surface">
        <Check className="size-4" strokeWidth={3} />
      </span>
      <p>
        <span className="font-semibold">{mitglied.name}</span> wurde mit dem Tarif{" "}
        <span className="font-semibold">{mitglied.tarif.name}</span> aufgenommen.
      </p>
    </div>
  );
}

function LeererZustand() {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-surface/60 px-6 py-16 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <Users className="size-6" strokeWidth={2} />
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold text-ink">Noch keine Mitglieder</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        Lege das erste Mitglied an und weise ihm einen Tarif zu. Danach kann es Kurse buchen.
      </p>
      <Link
        href="/mitglieder/neu"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-surface shadow-sm transition-colors hover:bg-accent-hover"
      >
        <UserPlus className="size-4" strokeWidth={2.2} />
        Erstes Mitglied aufnehmen
      </Link>
    </div>
  );
}

function MitgliederTabelle({
  mitglieder,
  jetzt,
}: {
  mitglieder: MitgliedMitTarif[];
  jetzt: Date;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wider text-faint">
            <th className="px-5 py-3.5">Mitglied</th>
            <th className="px-5 py-3.5">Tarif</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Buchungen / Monat</th>
            <th className="px-5 py-3.5 text-right">No-Shows</th>
          </tr>
        </thead>
        <tbody>
          {mitglieder.map((m) => (
            <tr
              key={m.mitglied_id}
              className="border-b border-line/70 transition-colors last:border-0 hover:bg-surface-sunken/50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-sunken font-display text-sm font-semibold text-muted">
                    {m.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="leading-tight">
                    <p className="font-medium text-ink">{m.name}</p>
                    <p className="tnum text-xs text-faint">geb. {formatiereDatum(m.geburtsdatum)}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <span className="font-medium text-ink">{m.tarif.name}</span>
                <span className="tnum ml-2 text-xs text-faint">
                  {m.tarif.max_kursbuchungen_pro_monat === null
                    ? "unbegrenzt"
                    : `max. ${m.tarif.max_kursbuchungen_pro_monat}`}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={m.status} />
                  <SperrHinweis sperreBis={m.sperre_bis} jetzt={jetzt} />
                </div>
              </td>
              <td className="tnum px-5 py-4 text-right text-ink">
                {m.buchungen_dieser_monat}
                {m.tarif.max_kursbuchungen_pro_monat !== null ? (
                  <span className="text-faint"> / {m.tarif.max_kursbuchungen_pro_monat}</span>
                ) : (
                  <span className="text-faint"> / ∞</span>
                )}
              </td>
              <td className="tnum px-5 py-4 text-right">
                <span className={m.no_show_zaehler >= 2 ? "font-semibold text-danger" : "text-ink"}>
                  {m.no_show_zaehler}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-card border border-line bg-surface/70" />
      ))}
    </div>
  );
}

async function MitgliederInhalt({
  searchParams,
}: {
  searchParams: Promise<{ angelegt?: string }>;
}) {
  const [{ mitglieder, jetzt }, params] = await Promise.all([ladeMitglieder(), searchParams]);
  const angelegtId = params.angelegt ? Number(params.angelegt) : null;
  const angelegt = angelegtId
    ? mitglieder.find((m) => m.mitglied_id === angelegtId) ?? null
    : null;

  return (
    <>
      {angelegt ? <ErfolgsHinweis mitglied={angelegt} /> : null}

      <p className="mt-8 text-sm text-muted">
        {mitglieder.length === 0
          ? "Noch keine Mitglieder erfasst."
          : `${mitglieder.length} ${mitglieder.length === 1 ? "Mitglied" : "Mitglieder"} im Bestand.`}
      </p>

      <section className="mt-4">
        {mitglieder.length === 0 ? <LeererZustand /> : <MitgliederTabelle mitglieder={mitglieder} jetzt={jetzt} />}

        {mitglieder.length > 0 ? (
          <p className="mt-4 flex items-center gap-2 text-xs text-faint">
            <CalendarOff className="size-3.5" />
            No-Shows und Buchungslimits werden ab F-004/F-007 automatisch gepflegt.
          </p>
        ) : null}
      </section>
    </>
  );
}

export default function MitgliederPage({
  searchParams,
}: {
  searchParams: Promise<{ angelegt?: string }>;
}) {
  return (
    <AppShell aktiv="mitglieder">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-faint">
            Mitgliederverwaltung
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Mitglieder
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Tarif zuweisen, Status im Blick behalten und die Basis für Kursbuchungen schaffen.
          </p>
        </div>
        <Link
          href="/mitglieder/neu"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-surface shadow-sm transition-colors hover:bg-accent-hover"
        >
          <UserPlus className="size-4" strokeWidth={2.2} />
          Mitglied aufnehmen
        </Link>
      </header>

      <Suspense fallback={<div className="mt-8"><Skeleton /></div>}>
        <MitgliederInhalt searchParams={searchParams} />
      </Suspense>
    </AppShell>
  );
}
