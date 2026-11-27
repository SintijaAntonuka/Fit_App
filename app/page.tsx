import Link from "next/link";
import { ArrowRight, Users, CalendarDays, CreditCard } from "lucide-react";

export default function Home() {
  const bereiche = [
    { icon: Users, titel: "Mitglieder", text: "Aufnehmen, Tarif zuweisen, Status pflegen." },
    { icon: CalendarDays, titel: "Kurse", text: "Termine planen und online buchen (bald)." },
    { icon: CreditCard, titel: "Tarife", text: "Limits, Online-Zugang und PT-Slots." },
  ];

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-faint">
        FitZone Berlin
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
        Kursbuchung und Trainingsverwaltung
      </h1>
      <p className="mt-5 max-w-xl text-base text-muted">
        Mitglieder, Tarife und Kurse an einem Ort – statt Excel, WhatsApp und Telefon.
      </p>

      <Link
        href="/mitglieder"
        className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-surface shadow-sm transition-colors hover:bg-accent-hover"
      >
        Mitgliederverwaltung öffnen
        <ArrowRight className="size-4" />
      </Link>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {bereiche.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.titel} className="rounded-card border border-line bg-surface p-5 shadow-card">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <h2 className="mt-3 font-display text-lg font-semibold text-ink">{b.titel}</h2>
              <p className="mt-1 text-sm text-muted">{b.text}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
