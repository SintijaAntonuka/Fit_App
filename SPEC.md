# SPEC.md · FitZone Berlin

Quelle: Meeting 1 mit Lisa Sommer (Demo, 12 Nachrichten). Zu jeder Regel steht die Nachricht, aus der sie stammt.

## Entitäten

| Entität | Attribute |
|---|---|
| Mitglied | mitglied_id, name, status (aktiv, pausiert, gekündigt), tarif → Tarif, buchungen_dieser_monat |
| Tarif | tarif_id, name (Basic, Plus, Premium), max_buchungen_pro_monat, online_zugang (ja, nein) |
| Kursart | kursart_id, name (Yoga, HIIT, Spinning, Pilates, Bodyworkout, Functional Training), level (Anfänger, Mittel, Fortgeschritten), format (Präsenz, Online) |
| Kurstermin | termin_id, kursart → Kursart, datum, uhrzeit, raum (großer Raum, kleiner Nebenraum), max_teilnehmer, trainer → Trainer, status (geplant, abgesagt) |
| Trainer | trainer_id, name, qualifizierte_kursarten |
| Buchung | buchung_id, mitglied → Mitglied, termin → Kurstermin, buchungsdatum, status (gebucht, storniert, nicht_erschienen), limitrelevant (ja, nein) |
| Wartelistenplatz | wartelistenplatz_id, mitglied → Mitglied, termin → Kurstermin, position, status (wartend, benachrichtigt, nachgerückt, verworfen) |
| Freigabe | freigabe_id, mitglied → Mitglied, kursart → Kursart, freigegeben_am, ausgestellt_von |

## Beziehungen

- Mitglied n:1 Tarif
- Mitglied n:m Kurstermin über Buchung
- Mitglied n:m Kurstermin über Wartelistenplatz
- Kursart 1:n Kurstermin
- Trainer n:m Kursart
- Trainer 1:n Kurstermin
- Mitglied n:m Kursart über Freigabe

## Business Rules

- **BR1** Basic-Mitglieder dürfen maximal 5 Präsenzkursbuchungen pro Kalendermonat tätigen; Plus und Premium sind unbegrenzt (Nachricht 12)
- **BR2** Stornierung bis 2 Stunden vor Kursbeginn ist kostenlos; bei Basic wird die Buchung für das Monatslimit zurückgegeben (Nachricht 4, 6)
- **BR3** Späte Stornierung: Basic und Plus zahlen 50 % des Kursbeitrags, Premium zahlt nichts (Nachricht 4)
- **BR4** Nur aktive Mitglieder dürfen buchen oder auf einer Warteliste stehen; pausierte und gekündigte Mitglieder nicht (Nachricht 9)
- **BR5** Wird ein Mitglied pausiert, werden bestehende Buchungen storniert und die Warteliste informiert (Nachricht 10)
- **BR6** Pro Kurs gibt es maximal 5 Wartelistenplätze; bei einem freien Platz erhält die erste Person 1 Stunde Zeit zu antworten, danach rückt die nächste nach (Nachricht 4)
- **BR7** Fortgeschrittenenkurse erfordern eine dauerhafte Freigabe durch Lisa auf Basis der Einschätzung der Trainerin oder des Trainers (Nachricht 7, 8)
- **BR8** Bei Trainerausfall entscheidet Lisa über Vertretung oder Absage; eine Vertretung muss für die jeweilige Kursart qualifiziert sein (Nachricht 10, 11)
- **BR9** Wird ein Kurs abgesagt, werden alle Gebuchten informiert, die Warteliste aufgelöst und entfallene Basic-Buchungen nicht auf das Monatslimit angerechnet (Nachricht 11)
- **BR10** Präsenzkurse sind für alle Tarife buchbar; Live-Streams und On-Demand-Videos sind nur für Plus und Premium verfügbar (Nachricht 5, 12)

## Widersprüche

- **W1** „Online-Kurse sind für alle Mitglieder“ (Nachr. 5) vs. „Basic hat keinen Zugang zu Online-Inhalten“ (Nachr. 12) → aufgelöst über `format` und `online_zugang`: Präsenzkurse für alle, Online-Inhalte nur Plus und Premium
- **W2** „Yoga und Spinning sind für alle Mitglieder buchbar“ (Nachr. 5) vs. „Fortgeschrittenenkurse haben einen informellen Sicherheitsfilter“ (Nachr. 7) → aufgelöst über `level` und `Freigabe`: Einschränkung betrifft nicht den Tarif, sondern das Kurslevel

## Prioritäten

1. Online-Kursbuchung mit Kapazitätsprüfung (v1)
2. Stornierung, Warteliste und Nachrücken (v1)
3. Mitgliedsstatus, Tariflimit und Freigaben (v1)
4. Trainerausfall, Vertretungssuche und Sammelbenachrichtigung (später)

## Offene Fragen

- No-Show-Regel: Ab wann gilt jemand als No-Show, welche Folgen gibt es und welche Ausnahmen gelten? (Meeting 2)
- Wie lange darf eine Mitgliedschaft maximal pausiert werden? (Meeting 2)
- Wie weit im Voraus dürfen Mitglieder Kurse buchen? (Meeting 2)
- Dürfen Trainer:innen Freigaben für Fortgeschrittenenkurse selbst erteilen oder bleibt Lisas finale Bestätigung erforderlich? (Meeting 2)
- Neue Anforderung aus der Zukunftsfrage (Meeting 2)
