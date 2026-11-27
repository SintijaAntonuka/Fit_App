"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, Check, Loader2 } from "lucide-react";
import { mitgliedAnlegenAction, type FormState } from "../actions";

export type TarifOption = {
  tarif_id: number;
  name: string;
  limitText: string;
  onlineText: string;
  ptText: string;
};

const initialState: FormState = {};

function Feld({
  label,
  pflicht,
  fehler,
  hinweis,
  children,
}: {
  label: string;
  pflicht?: boolean;
  fehler?: string;
  hinweis?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-ink">
        {label}
        {pflicht ? (
          <span className="text-accent" aria-hidden>
            *
          </span>
        ) : (
          <span className="text-xs font-normal text-faint">(optional)</span>
        )}
      </label>
      <div className="mt-1.5">{children}</div>
      {fehler ? (
        <p className="mt-1.5 text-xs font-medium text-danger">{fehler}</p>
      ) : hinweis ? (
        <p className="mt-1.5 text-xs text-faint">{hinweis}</p>
      ) : null}
    </div>
  );
}

const eingabeKlasse =
  "w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-faint transition-colors focus:outline-none";

export function MitgliedFormular({ tarife }: { tarife: TarifOption[] }) {
  const [state, formAction, pending] = useActionState(mitgliedAnlegenAction, initialState);
  const f = state.fehler ?? {};
  const w = state.werte;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Feld label="Name" pflicht fehler={f.name}>
              <input
                type="text"
                name="name"
                defaultValue={w?.name}
                placeholder="Vor- und Nachname"
                autoComplete="name"
                className={`${eingabeKlasse} ${f.name ? "border-danger" : "border-line-strong"}`}
                aria-invalid={f.name ? true : undefined}
              />
            </Feld>
          </div>

          <Feld
            label="Geburtsdatum"
            pflicht
            fehler={f.geburtsdatum}
            hinweis="Wird für Geburtstags-Erinnerungen genutzt (F-011)."
          >
            <input
              type="date"
              name="geburtsdatum"
              defaultValue={w?.geburtsdatum}
              max={new Date().toISOString().slice(0, 10)}
              className={`${eingabeKlasse} tnum ${f.geburtsdatum ? "border-danger" : "border-line-strong"}`}
              aria-invalid={f.geburtsdatum ? true : undefined}
            />
          </Feld>

          <Feld label="Mitgliedsstatus" hinweis="Neue Mitglieder starten immer als „aktiv“.">
            <div className="flex items-center gap-2 rounded-xl border border-line-strong bg-surface-sunken/60 px-3.5 py-2.5 text-sm text-muted">
              <span className="size-1.5 rounded-full bg-aktiv" aria-hidden />
              Aktiv
            </div>
          </Feld>
        </div>
      </div>

      <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-7">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Tarif wählen</h2>
          <span className="text-xs text-faint">Pflichtfeld</span>
        </div>
        {f.tarif_id ? (
          <p className="mt-1.5 text-xs font-medium text-danger">{f.tarif_id}</p>
        ) : null}

        <fieldset className="mt-4 grid gap-3 sm:grid-cols-3">
          <legend className="sr-only">Tarif</legend>
          {tarife.map((t, index) => (
            <label
              key={t.tarif_id}
              className="group relative flex cursor-pointer flex-col rounded-2xl border border-line-strong bg-surface p-4 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent-soft/50"
            >
              <input
                type="radio"
                name="tarif_id"
                value={t.tarif_id}
                defaultChecked={w ? w.tarif_id === String(t.tarif_id) : index === 0}
                className="peer sr-only"
                required
              />
              <span className="flex items-center justify-between">
                <span className="font-display text-base font-semibold text-ink">{t.name}</span>
                <span className="flex size-5 items-center justify-center rounded-full border border-line-strong text-surface transition-colors peer-checked:border-accent peer-checked:bg-accent">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              </span>
              <span className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted">
                <span className="block">{t.limitText}</span>
                <span className="block">{t.onlineText}</span>
                <span className="block">{t.ptText}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/mitglieder"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Abbrechen
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-surface shadow-sm transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <UserPlus className="size-4" strokeWidth={2.2} />
          )}
          {pending ? "Wird angelegt…" : "Mitglied anlegen"}
        </button>
      </div>
    </form>
  );
}
