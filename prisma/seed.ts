import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

/**
 * Starttarife laut SPEC.md:
 * - Basic: 5 Präsenzkursbuchungen pro Monat, kein Online-Zugang, kein PT-Slot.
 * - Plus: unbegrenzt, Online-Zugang.
 * - Premium: unbegrenzt, Online-Zugang, 1 PT-Termin pro Monat inklusive.
 */
const tarife = [
  {
    name: "Basic",
    max_kursbuchungen_pro_monat: 5,
    online_zugang: false,
    pt_slots_pro_monat: 0,
  },
  {
    name: "Plus",
    max_kursbuchungen_pro_monat: null,
    online_zugang: true,
    pt_slots_pro_monat: 0,
  },
  {
    name: "Premium",
    max_kursbuchungen_pro_monat: null,
    online_zugang: true,
    pt_slots_pro_monat: 1,
  },
];

async function main() {
  for (const tarif of tarife) {
    await prisma.tarif.upsert({
      where: { name: tarif.name },
      update: tarif,
      create: tarif,
    });
  }
  console.log(`Seed fertig: ${tarife.length} Tarife angelegt/aktualisiert.`);
}

main()
  .catch((fehler) => {
    console.error(fehler);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
