-- CreateTable
CREATE TABLE "Tarif" (
    "tarif_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "max_kursbuchungen_pro_monat" INTEGER,
    "online_zugang" BOOLEAN NOT NULL DEFAULT false,
    "pt_slots_pro_monat" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Mitglied" (
    "mitglied_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "geburtsdatum" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aktiv',
    "tarif_id" INTEGER NOT NULL,
    "buchungen_dieser_monat" INTEGER NOT NULL DEFAULT 0,
    "no_show_zaehler" INTEGER NOT NULL DEFAULT 0,
    "sperre_bis" DATETIME,
    "angelegt_am" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Mitglied_tarif_id_fkey" FOREIGN KEY ("tarif_id") REFERENCES "Tarif" ("tarif_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tarif_name_key" ON "Tarif"("name");

-- CreateIndex
CREATE INDEX "Mitglied_tarif_id_idx" ON "Mitglied"("tarif_id");
