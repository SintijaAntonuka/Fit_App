# SPEC.md · FitZone Berlin

Quelle: Meeting 1 (12 Nachrichten) & Meeting 2 (8 Nachrichten) mit Lisa Sommer.

## Überblick

FitZone ist ein Fitnessstudio in Berlin mit Präsenz- und Online-Kursen. Aktuell werden Kursbuchungen über WhatsApp, Telefon und persönliche Absprachen organisiert; Mitglieder-, Tarif-, Kurs- und Trainerdaten liegen in Excel-Tabellen.

Die Anwendung soll die Kursbuchung digitalisieren, Kapazitäten und Tarifregeln automatisch prüfen, Wartelisten verwalten, Mitgliedsstatus und Freigaben berücksichtigen sowie Trainer:innen und Kursplanung zentral verwalten. Personal Training und On-Demand-Videos sind wichtige, aber spätere Erweiterungen.

## Entitäten

| Entität | Attribute |
|---|---|
| Mitglied | mitglied_id, name, geburtsdatum, status (aktiv, pausiert, gekündigt), tarif → Tarif, buchungen_dieser_monat, no_show_zaehler, sperre_bis |
| Tarif | tarif_id, name (Basic, Plus, Premium), max_kursbuchungen_pro_monat, online_zugang (ja, nein), pt_slots_pro_monat |
| Kursart | kursart_id, name (Yoga, HIIT, Spinning, Pilates, Bodyworkout, Functional Training), level (Anfänger, Mittel, Fortgeschritten), format (Präsenz, Online) |
| Kurstermin | termin_id, kursart → Kursart, datum, uhrzeit, raum (großer Raum, kleiner Nebenraum), max_teilnehmer, trainer → Trainer, status (geplant, abgesagt) |
| Trainer | trainer_id, name, qualifizierte_kursarten, pt_stundensatz |
| Buchung | buchung_id, mitglied → Mitglied, termin → Kurstermin, buchungsdatum, status (gebucht, storniert, nicht_erschienen), limitrelevant (ja, nein) |
| Wartelistenplatz | wartelistenplatz_id, mitglied → Mitglied, termin → Kurstermin, position, status (wartend, benachrichtigt, nachgerückt, verworfen) |
| Freigabe | freigabe_id, mitglied → Mitglied, kursart → Kursart, freigegeben_am, ausgestellt_von |
| PersonalTrainingTermin | pt_termin_id, mitglied → Mitglied, trainer → Trainer, datum, uhrzeit, dauer_minuten, trainingsziel, preis, zahlungsstatus (offen, bezahlt, erstattet), status (geplant, abgesagt, nicht_erschienen, durchgeführt) |
| PTSlot | pt_slot_id, trainer → Trainer, datum, uhrzeit, dauer_minuten, ort, status (verfügbar, gebucht, gesperrt) |
| OnlineVideo | video_id, titel, kategorie, trainer → Trainer, hochgeladen_am, veröffentlichungsstatus, zugelassene_tarife |


## Beziehungen

- Mitglied n:1 Tarif
- Mitglied n:m Kurstermin über Buchung
- Mitglied n:m Kurstermin über Wartelistenplatz
- Kursart 1:n Kurstermin
- Trainer n:m Kursart
- Trainer 1:n Kurstermin
- Mitglied n:m Kursart über Freigabe
- Mitglied n:m Trainer:in über Personal-Training-Termin
- Trainer:in l:n Personal-Training-Slot
- Mitglied 1:1 Personal-Training-Slot über Personal-Training-Termin
- Trainer:in 1:n Online-Video
- Online-Video n:m Tarif


## Business Rules

- **BR1** Basic-Mitglieder dürfen maximal 5 Präsenzkursbuchungen pro Kalendermonat tätigen; Plus- und Premium-Mitglieder können unbegrenzt buchen. Storniert ein Basic-Mitglied bis 2 Stunden vor Kursbeginn, wird die Buchung für das Monatslimit zurückgegeben; bei später Stornierung nicht. (Meeting 1, Nachrichten 4, 6, 12)

- **BR2** Stornierung bis 2 Stunden vor Kursbeginn ist kostenlos. Bei später Stornierung zahlen Basic- und Plus-Mitglieder 50 % des Kursbeitrags; Premium-Mitglieder zahlen nichts. Der freigewordene Platz geht an die Warteliste. (Meeting 1, Nachricht 4)

- **BR3** Nur aktive Mitglieder dürfen Gruppenkurse buchen oder auf einer Warteliste stehen. Wird ein Mitglied pausiert, werden bestehende Buchungen storniert und die Warteliste informiert. Fortgeschrittenenkurse erfordern eine dauerhafte Freigabe durch Lisa auf Basis der Trainer-Einschätzung. (Meeting 1, Nachrichten 7, 8, 9, 10)

- **BR4** Ein No-Show liegt vor, wenn ein Mitglied einen Kurs gebucht hat, nicht erscheint und nicht absagt; später als 10 Minuten nach Kursbeginn zählt ebenfalls als No-Show. Beim dritten No-Show in Folge wird das Mitglied für 2 Wochen von Live-Buchungen gesperrt; bei Notfällen mit rechtzeitiger Meldung wird kein No-Show gezählt. (Meeting 2, Nachricht 4)

- **BR5** Personal-Training-Termine sind 1:1-Termine mit einer qualifizierten Trainer:in, Standarddauer 60 Minuten, buchbar bis 4 Wochen im Voraus. Premium-Mitglieder erhalten einen PT-Termin pro Monat inklusive; dieser wird bei Teilnahme verbraucht, bei rechtzeitiger Stornierung zurückgegeben und bei No-Show verbraucht. Basic und Plus zahlen vorab; bei Stornierung unter 24 Stunden fällt die volle Gebühr an. (Meeting 2, Nachrichten 3, 5, 6)


## Widersprüche

- **W1** „Online-Kurse sind für alle Mitglieder“ (Nachr. 5) vs. „Basic hat keinen Zugang zu Online-Inhalten“ (Nachr. 12) → aufgelöst über `format` und `online_zugang`: Präsenzkurse für alle, Online-Inhalte nur Plus und Premium
- **W2** „Yoga und Spinning sind für alle Mitglieder buchbar“ (Nachr. 5) vs. „Fortgeschrittenenkurse haben einen informellen Sicherheitsfilter“ (Nachr. 7) → aufgelöst über `level` und `Freigabe`: Einschränkung betrifft nicht den Tarif, sondern das Kurslevel


## Prioritäten
1. **Online-Kursbuchung:** Mitglieder können verfügbare Kurstermine sehen und selbst buchen. Quelle: Meeting 1

2. **Kapazität und Warteliste:** Das System prüft die maximale Teilnehmerzahl, verwaltet maximal 5 Wartelistenplätze und lässt die erste Person nach Ablauf der Reaktionszeit weiterrücken. Quelle: Meeting 1

3. **Stornierung und Limit:** Das System wendet Stornofristen, Gebühren, Basic-Limit und Platzfreigabe automatisch an. Quelle: Meeting 1

4. **Mitgliedsstatus und Freigaben:** Das System prüft aktiv/pausiert/gekündigt sowie Freigaben für Fortgeschrittenenkurse. Quelle: Meeting 1

5. **Trainerplanung und Ausfälle:** Das System zeigt qualifizierte Vertretungen und ermöglicht Sammelbenachrichtigungen bei Ausfall oder Absage. Quelle: Meeting 1

6. **Personal Training:** Mitglieder können verfügbare Trainer-Slots sehen, Personal-Training-Termine buchen, stornieren und vorab bezahlen. Quelle: Meeting 2, Nachricht 8

7. **On-Demand-Videos, Geburtstage:** Plus- und Premium-Mitglieder erhalten Zugang zu On-Demand-Videos; Lisa wird an Mitgliedergeburtstage erinnert Quelle: Meeting 2, Nachricht 8
   

## Neue Anforderung aus Meeting 2

**Personal Training:** FitZone möchte Personal-Training-Termine als 1:1-Termine zwischen Mitgliedern und Trainer:innen über die App anbieten. Aktuell werden diese Termine über WhatsApp organisiert; Lisa verliert dabei den Überblick über Verfügbarkeiten, Buchungen und Zahlungen.

Mitglieder sollen sehen, wann welche Trainer:in verfügbar ist, einen passenden Termin buchen und vorab in der App bezahlen können. Premium-Mitglieder erhalten einen Personal-Training-Termin pro Monat inklusive.
Meeting 2, Nachricht 1 („Was planst du als Nächstes?“)


## Offene Fragen

- **Pausierdauer:** Wie lange darf eine Mitgliedschaft maximal pausiert werden? Quelle: Meeting 1, Nachricht 9

- **Freigabeprozess:** Dürfen Trainer:innen künftig selbst Freigaben erteilen, oder bleibt Lisas finale Bestätigung erforderlich? Quelle: Meeting 1, Nachricht 8

- **Buchungszeitraum:** Wie weit im Voraus dürfen Mitglieder Gruppenkurse buchen. Quelle: Meeting 1, noch nicht geklärt

- **Sperren-Umfang:** Gilt die 2-Wochen-Sperre nur für Gruppenkurse oder auch für Personal Training? Quelle: Meeting 2, Nachricht 4

- **Videoverwaltung:** Welche Videoformate, Kategorien und Verwaltungsrechte benötigt Lisa für On-Demand-Videos? Quelle: Meeting 2, Nachricht 8

- **Geburtstagserinnerung:** Soll die App Lisa nur an Geburtstage erinnern oder auch automatisch Glückwunschnachrichten versenden? Ab welchem Zeitpunkt vor dem Geburtstag. Quelle: Meeting 2, Nachricht 8
