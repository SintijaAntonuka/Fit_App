# Entscheidungen · FitZone Berlin

Fortlaufendes Protokoll der getroffenen Entscheidungen. Neueste Einträge oben.

## 2026-11-27 · BR1 als reine Regeln vorab (Vorbereitung F-005)

**Was:** Die Monatslimit-Regel aus BR1 steht als eigenständiges, UI-freies Modul
`lib/buchungsregeln.ts` (`istLimitrelevant`, `darfLimitrelevantBuchen`,
`stornoGibtLimitZurueck`, `STORNO_FRIST_STUNDEN`) samt Tests
`tests/buchungsregeln.br1.test.ts`.

**Warum:** Die Buchung selbst kommt erst mit F-003/F-005. Die BR1-Regel ist aber rein
rechenbar und lässt sich schon jetzt ohne Datenmodell-Änderung testen, damit F-005 später
nur noch verdrahten muss. Wichtig: Das Modul ist noch **nicht** an Buchungs-Datensätze
gekoppelt – diese Anbindung (Zähler erhöhen/erstatten) gehört zu F-003/F-005.

## 2026-11-27 · Design-Richtung festgelegt (F-001)

**Was:** Richtung „ruhig und editorial“. Warme Stein-Grundfläche (`#f4f1ea`), weiße Karten,
Fraunces für Überschriften, Plus Jakarta Sans für Text. Kräftige **Terracotta-Akzentfarbe**
(`#b5431e`) für Hauptaktionen und den aktiven Menüpunkt, sonst sparsam. Status als farbige
Badges (aktiv grün, pausiert bernstein, gekündigt rostrot), Zahlen und Datumswerte mit
`tabular-nums`.

**Warum:** Die Schriften und Grundtöne waren im Setup bereits vorbereitet. „Ruhig und
editorial“ passt zu Studio-Verwaltung, hebt sich klar von Standard-Tailwind ab, verzichtet
bewusst auf Indigo und Lila-Blau-Verläufe und trägt eine Hierarchie über Größe, Gewicht und
Abstand statt über Farbe.

## 2026-11-27 · Datenmodell Mitglied & Tarif (F-001)

**Was:** Prisma-Modelle `Tarif` und `Mitglied` plus Enum `MitgliedStatus`
(aktiv/pausiert/gekuendigt). Tarif trägt `max_kursbuchungen_pro_monat` (nullable =
unbegrenzt), `online_zugang`, `pt_slots_pro_monat`. Mitglied trägt die Startwerte
`buchungen_dieser_monat`, `no_show_zaehler`, `sperre_bis`, `status` (Default aktiv) und
`angelegt_am`. Migration `20261127111918_f001_mitglied_tarif`, Seed mit Basic/Plus/Premium.

**Warum:** F-001 braucht genau diese zwei Entitäten aus `SPEC.md`. Die Felder werden schon
jetzt angelegt, weil die späteren Features (Limit BR1, No-Show BR4, PT BR5) sie erwarten;
angelegt wird pro Feature nur, was es selbst braucht. Tarifregeln als Spalten statt als
Code, damit Lisa Tarife pflegen kann, ohne dass Regeln verstreut sind.

## 2026-11-27 · Test-Framework Vitest (F-001)

**Was:** Vitest 3 als Test-Runner, Tests unter `tests/`. Reine Logik (Validierung, Tarif-
und Datumsformate) als Unit-Tests; die Anlage-Regel zusätzlich als Integrationstest gegen
eine temporäre SQLite-Datei, in die die Migration eingespielt wird.

**Warum:** `AGENTS.md` verlangt für jede Business Rule mindestens einen Test. F-001 deckt
noch keine nummerierte BR ab, daher werden die Akzeptanzkriterien des Features getestet.
Vitest teilt sich Konfiguration und Auflösung mit Vite und läuft ohne zusätzlichen Server.

## 2026-11-27 · SQLite-Datei liegt im Repo-Root

**Was:** `DATABASE_URL="file:./dev.db"` löst für CLI und Laufzeit auf `./dev.db` im
Repo-Root auf. Die Datei ist über `.gitignore` ausgeschlossen.

**Warum:** Beide Zugriffe (Prisma-CLI und better-sqlite3-Adapter) sollen dieselbe Datei
treffen; ein versehentliches zweites `dev.db` im `prisma/`-Ordner hätte sonst zu leeren
Tabellen geführt.
