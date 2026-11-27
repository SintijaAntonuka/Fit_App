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

### Datenmodell bewusst noch leer
`prisma/schema.prisma` enthält nur Generator und Datasource, keine Modelle. Laut `AGENTS.md` entstehen Entitäten und Datenmodell im ersten Feature, das sie braucht (F-001), und zwar als Prisma-Migration. Deshalb gibt es hier noch keine Migration und keine Tabellen.

### Design-Richtung noch offen
Schriften und Grundtöne sind in `app/globals.css` und `app/layout.tsx` nur vorbereitet. Die eigentliche Design-Richtung legt das erste Feature (F-001) fest und dokumentiert sie in `docs/decisions.md`.

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
