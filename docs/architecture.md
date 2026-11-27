# Architektur · FitZone Berlin

Diese Datei hält die technischen Grundentscheidungen des Projekt-Setups fest. Sie wird nur ergänzt, wenn sich die Wahl wirklich ändert.

## Überblick

- **Framework:** Next.js 16 (App Router, React 19, TypeScript, strikt).
- **Routing/Struktur:** App Router im Root-Ordner `app/`, kein `src/`-Verzeichnis. Import-Alias `@/*` zeigt auf das Repo-Root.
- **Styling:** Tailwind CSS v4 über `@tailwindcss/postcss` (CSS-first mit `@theme` in `app/globals.css`), Icons später über `lucide-react`.
- **Datenbank:** SQLite als lokale Datei (`prisma/dev.db`), kein Datenbankserver.
- **ORM:** Prisma 7 mit dem SQLite-Treiber-Adapter `@prisma/adapter-better-sqlite3`.
- **Paketmanager:** npm (Lockfile `package-lock.json`).
- **Sprache der Oberfläche:** Deutsch (`<html lang="de">`).

## Entscheidungen und Begründungen

### Next.js App Router, TypeScript, kein `src/`
Ein Ordner, klare Konventionen, Server- und Client-Komponenten direkt mischbar. Kein `src/` hält den Pfad kurz; `@/*` löst ab Repo-Root auf.

### Prisma 7 mit SQLite-Treiber-Adapter
Prisma 7 verbindet sich nicht mehr über die eingebaute Engine, sondern über einen Treiber-Adapter. Für eine lokale Datei ist `better-sqlite3` die einfachste Wahl: synchron, ohne Server, gut für Entwicklung und kleine Anwendungen.

- Konfiguration liegt in `prisma7.config.ts` (Prisma 7.10+ benennt sie so, um mit dem Prisma-8-Format `prisma.config.ts` nicht zu kollidieren).
- Der generierte Client landet unter `generated/prisma` (ESM-Generator `prisma-client`) und ist über `.gitignore` ausgeschlossen.
- Verbindung und Singleton stehen in `lib/prisma.ts`; der `DATABASE_URL` kommt aus `.env` (`file:./dev.db`).

### Datenmodell wächst pro Feature
`prisma/schema.prisma` enthält Generator und Datasource sowie die Modelle, die das jeweils
fertige Feature braucht. F-001 legt `Tarif` und `Mitglied` an; jede Schema-Änderung läuft als
Prisma-Migration (`npx prisma migrate dev`). Der Seed (`prisma/seed.ts`, Skript `db:seed`)
legt die drei Tarife Basic/Plus/Premium an und ist in `prisma7.config.ts` als Seed hinterlegt.

### Design-Richtung: ruhig und editorial
In F-001 festgelegt und in `docs/decisions.md` dokumentiert: warme Stein-Grundfläche, weiße
Karten, Fraunces (Display) + Plus Jakarta Sans (Text), Terracotta-Akzent (`#b5431e`),
Status-Badges und `tabular-nums` für Zahlen und Datumswerte. Die Tokens stehen als `@theme`
in `app/globals.css`.

### Tests mit Vitest
`npm test` führt Vitest 3 über `tests/` aus. Unit-Tests prüfen reine Logik, ein
Integrationstest prüft die Anlage gegen eine temporäre SQLite-Datei mit eingespielter
Migration. Für jede Business Rule aus `SPEC.md` gehört mindestens ein Test zum jeweiligen
Feature.

### Tailwind über PostCSS statt Turbopack-Loader
Der Standard-Weg ist `@tailwindcss/postcss` mit `postcss.config.mjs`. Der alternative Turbopack-CSS-Loader (`@tailwindcss/turbopack`) startet beim Build einen Hilfsprozess, der an einen Port bindet; das ist in eingeschränkten Umgebungen (Sandbox) nicht erlaubt. Die PostCSS-Variante kommt ohne zusätzlichen Prozess aus und baut zuverlässig.

### `agentRules: false`
`next.config.ts` setzt `agentRules: false`, damit `next dev` nicht automatisch einen Block an `AGENTS.md` anhängt. Diese Datei wird von Hand gepflegt.

## Skripte

- `npm run dev` – Entwicklungsserver auf http://localhost:3000
- `npm run build` / `npm run start` – Produktions-Build und -Start
- `npm run lint` – ESLint
- `npm run db:migrate` – `prisma migrate dev` (Schema-Änderungen)
- `npm run db:studio` – Prisma Studio
- `npm run db:reset` – Datenbank zurücksetzen
- `postinstall` – erzeugt den Prisma-Client automatisch nach `npm install`

## Nicht tun

- Datenbankdatei nie von Hand ändern, Schema-Änderungen immer über `prisma migrate dev`.
- Keine API-Keys oder echten Personendaten ins Repo.
