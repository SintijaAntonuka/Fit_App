{\rtf1\ansi\ansicpg1252\cocoartf2908
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11320\viewh9120\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # SPEC.md \'b7 FitZone Berlin\
\
Quelle: Meeting 1 mit Lisa Sommer (Demo, 12 Nachrichten). Zu jeder Regel steht die Nachricht, aus der sie stammt.\
\
## Entit\'e4ten\
\
| Entit\'e4t | Attribute |\
|---|---|\
| Mitglied | mitglied_id, name, status (aktiv, pausiert, gek\'fcndigt), tarif \uc0\u8594  Tarif, buchungen_dieser_monat |\
| Tarif | tarif_id, name (Basic, Plus, Premium), max_buchungen_pro_monat, online_zugang (ja, nein) |\
| Kursart | kursart_id, name (Yoga, HIIT, Spinning, Pilates, Bodyworkout, Functional Training), level (Anf\'e4nger, Mittel, Fortgeschritten), format (Pr\'e4senz, Online) |\
| Kurstermin | termin_id, kursart \uc0\u8594  Kursart, datum, uhrzeit, raum (gro\'dfer Raum, kleiner Nebenraum), max_teilnehmer, trainer \u8594  Trainer, status (geplant, abgesagt) |\
| Trainer | trainer_id, name, qualifizierte_kursarten |\
| Buchung | buchung_id, mitglied \uc0\u8594  Mitglied, termin \u8594  Kurstermin, buchungsdatum, status (gebucht, storniert, nicht_erschienen), limitrelevant (ja, nein) |\
| Wartelistenplatz | wartelistenplatz_id, mitglied \uc0\u8594  Mitglied, termin \u8594  Kurstermin, position, status (wartend, benachrichtigt, nachger\'fcckt, verworfen) |\
| Freigabe | freigabe_id, mitglied \uc0\u8594  Mitglied, kursart \u8594  Kursart, freigegeben_am, ausgestellt_von |\
\
## Beziehungen\
\
- Mitglied n:1 Tarif\
- Mitglied n:m Kurstermin \'fcber Buchung\
- Mitglied n:m Kurstermin \'fcber Wartelistenplatz\
- Kursart 1:n Kurstermin\
- Trainer n:m Kursart\
- Trainer 1:n Kurstermin\
- Mitglied n:m Kursart \'fcber Freigabe\
\
## Business Rules\
\
- **BR1** Basic-Mitglieder d\'fcrfen maximal 5 Pr\'e4senzkursbuchungen pro Kalendermonat t\'e4tigen; Plus und Premium sind unbegrenzt (Nachricht 12)\
- **BR2** Stornierung bis 2 Stunden vor Kursbeginn ist kostenlos; bei Basic wird die Buchung f\'fcr das Monatslimit zur\'fcckgegeben (Nachricht 4, 6)\
- **BR3** Sp\'e4te Stornierung: Basic und Plus zahlen 50 % des Kursbeitrags, Premium zahlt nichts (Nachricht 4)\
- **BR4** Nur aktive Mitglieder d\'fcrfen buchen oder auf einer Warteliste stehen; pausierte und gek\'fcndigte Mitglieder nicht (Nachricht 9)\
- **BR5** Wird ein Mitglied pausiert, werden bestehende Buchungen storniert und die Warteliste informiert (Nachricht 10)\
- **BR6** Pro Kurs gibt es maximal 5 Wartelistenpl\'e4tze; bei einem freien Platz erh\'e4lt die erste Person 1 Stunde Zeit zu antworten, danach r\'fcckt die n\'e4chste nach (Nachricht 4)\
- **BR7** Fortgeschrittenenkurse erfordern eine dauerhafte Freigabe durch Lisa auf Basis der Einsch\'e4tzung der Trainerin oder des Trainers (Nachricht 7, 8)\
- **BR8** Bei Trainerausfall entscheidet Lisa \'fcber Vertretung oder Absage; eine Vertretung muss f\'fcr die jeweilige Kursart qualifiziert sein (Nachricht 10, 11)\
- **BR9** Wird ein Kurs abgesagt, werden alle Gebuchten informiert, die Warteliste aufgel\'f6st und entfallene Basic-Buchungen nicht auf das Monatslimit angerechnet (Nachricht 11)\
- **BR10** Pr\'e4senzkurse sind f\'fcr alle Tarife buchbar; Live-Streams und On-Demand-Videos sind nur f\'fcr Plus und Premium verf\'fcgbar (Nachricht 5, 12)\
\
## Widerspr\'fcche\
\
- **W1** \'84Online-Kurse sind f\'fcr alle Mitglieder\'93 (Nachr. 5) vs. \'84Basic hat keinen Zugang zu Online-Inhalten\'93 (Nachr. 12) \uc0\u8594  aufgel\'f6st \'fcber `format` und `online_zugang`: Pr\'e4senzkurse f\'fcr alle, Online-Inhalte nur Plus und Premium\
- **W2** \'84Yoga und Spinning sind f\'fcr alle Mitglieder buchbar\'93 (Nachr. 5) vs. \'84Fortgeschrittenenkurse haben einen informellen Sicherheitsfilter\'93 (Nachr. 7) \uc0\u8594  aufgel\'f6st \'fcber `level` und `Freigabe`: Einschr\'e4nkung betrifft nicht den Tarif, sondern das Kurslevel\
\
## Priorit\'e4ten\
\
1. Online-Kursbuchung mit Kapazit\'e4tspr\'fcfung (v1)\
2. Stornierung, Warteliste und Nachr\'fccken (v1)\
3. Mitgliedsstatus, Tariflimit und Freigaben (v1)\
4. Trainerausfall, Vertretungssuche und Sammelbenachrichtigung (sp\'e4ter)\
\
## Offene Fragen\
\
- No-Show-Regel: Ab wann gilt jemand als No-Show, welche Folgen gibt es und welche Ausnahmen gelten? (Meeting 2)\
- Wie lange darf eine Mitgliedschaft maximal pausiert werden? (Meeting 2)\
- Wie weit im Voraus d\'fcrfen Mitglieder Kurse buchen? (Meeting 2)\
- D\'fcrfen Trainer:innen Freigaben f\'fcr Fortgeschrittenenkurse selbst erteilen oder bleibt Lisas finale Best\'e4tigung erforderlich? (Meeting 2)\
- Neue Anforderung aus der Zukunftsfrage (Meeting 2)\
}