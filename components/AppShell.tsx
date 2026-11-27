import Link from "next/link";
import { Dumbbell, Users, CalendarDays, UserRound, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type NavEintrag = {
  href: string;
  label: string;
  icon: typeof Users;
  aktiv: boolean;
  bald?: boolean;
};

export function AppShell({
  children,
  aktiv,
}: {
  children: ReactNode;
  aktiv: "mitglieder";
}) {
  const eintraege: NavEintrag[] = [
    { href: "/mitglieder", label: "Mitglieder", icon: Users, aktiv: aktiv === "mitglieder" },
    { href: "#", label: "Kurse", icon: CalendarDays, aktiv: false, bald: true },
    { href: "#", label: "Trainer:innen", icon: UserRound, aktiv: false, bald: true },
  ];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col gap-8 border-b border-line bg-surface-sunken/60 px-6 py-6 lg:w-72 lg:border-b-0 lg:border-r lg:px-7 lg:py-9">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-surface">
            <Dumbbell className="size-5" strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-tight text-ink">
              FitZone
            </span>
            <span className="block text-xs font-medium uppercase tracking-[0.18em] text-faint">
              Berlin
            </span>
          </span>
        </Link>

        <nav className="flex flex-row gap-1.5 lg:flex-col">
          {eintraege.map((eintrag) => {
            const Icon = eintrag.icon;
            const basis =
              "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors";
            if (eintrag.aktiv) {
              return (
                <Link
                  key={eintrag.label}
                  href={eintrag.href}
                  className={`${basis} bg-accent text-surface shadow-sm`}
                  aria-current="page"
                >
                  <Icon className="size-4.5" strokeWidth={2.1} />
                  {eintrag.label}
                </Link>
              );
            }
            return (
              <span
                key={eintrag.label}
                className={`${basis} cursor-default text-muted/80`}
                aria-disabled="true"
              >
                <Icon className="size-4.5" strokeWidth={2.1} />
                {eintrag.label}
                {eintrag.bald ? (
                  <span className="ml-auto rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-faint">
                    bald
                  </span>
                ) : null}
              </span>
            );
          })}
        </nav>

        <div className="mt-auto hidden rounded-2xl border border-line bg-surface p-4 lg:block">
          <p className="font-display text-sm font-semibold text-ink">Kursverwaltung</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Mitglieder anlegen, Tarife pflegen – die Kursbuchung folgt in den nächsten Features.
          </p>
          <Link
            href="/mitglieder/neu"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover"
          >
            Mitglied aufnehmen
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8 sm:px-10 sm:py-12">{children}</main>
    </div>
  );
}
