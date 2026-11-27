import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/AppShell";
import { tarifLimitText, tarifOnlineText, tarifPtText } from "@/lib/tarife";
import { MitgliedFormular } from "./MitgliedFormular";

export const metadata = { title: "Mitglied aufnehmen · FitZone Berlin" };

async function FormularInhalt() {
  const tarife = await prisma.tarif.findMany({ orderBy: { tarif_id: "asc" } });

  const optionen = tarife.map((t) => ({
    tarif_id: t.tarif_id,
    name: t.name,
    limitText: tarifLimitText(t),
    onlineText: tarifOnlineText(t),
    ptText: tarifPtText(t),
  }));

  if (optionen.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line-strong bg-surface/60 px-6 py-12 text-center">
        <h2 className="font-display text-lg font-semibold text-ink">Keine Tarife gefunden</h2>
        <p className="mt-2 text-sm text-muted">
          Bitte zuerst die Tarife anlegen: <span className="font-medium text-ink">npm run db:seed</span>.
        </p>
      </div>
    );
  }

  return <MitgliedFormular tarife={optionen} />;
}

function Skeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-40 animate-pulse rounded-card border border-line bg-surface/70" />
      <div className="h-48 animate-pulse rounded-card border border-line bg-surface/70" />
    </div>
  );
}

export default function NeuesMitgliedPage() {
  return (
    <AppShell aktiv="mitglieder">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/mitglieder"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" />
          Zurück zu den Mitgliedern
        </Link>

        <header className="mt-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-faint">Neues Mitglied</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
            Mitglied aufnehmen
          </h1>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Name, Geburtsdatum und Tarif erfassen. Der Status startet als „aktiv“, Buchungen und
            No-Shows beginnen bei null.
          </p>
        </header>

        <div className="mt-8">
          <Suspense fallback={<Skeleton />}>
            <FormularInhalt />
          </Suspense>
        </div>
      </div>
    </AppShell>
  );
}
