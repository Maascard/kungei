// Полностью заменяет меню в базе на содержимое DEFAULT_MENU.
// Запуск: npx tsx scripts/reset-menu.ts  (использует DATABASE_URL из .env)
import { PrismaClient } from "@prisma/client";
import { DEFAULT_MENU } from "../src/lib/site-defaults";

const prisma = new PrismaClient();

async function main() {
  console.log("Удаляю старое меню...");
  await prisma.menuCategory.deleteMany({}); // каскадно удаляет блюда

  for (let c = 0; c < DEFAULT_MENU.length; c++) {
    const cat = DEFAULT_MENU[c];
    await prisma.menuCategory.create({
      data: {
        titleRu: cat.titleRu,
        titleKk: cat.titleKk,
        sortOrder: c,
        items: {
          create: cat.items.map((it, i) => ({
            titleRu: it.titleRu,
            titleKk: it.titleKk,
            descRu: it.descRu,
            descKk: it.descKk,
            price: it.price,
            imageUrl: it.imageUrl,
            sortOrder: i,
          })),
        },
      },
    });
    console.log(`  + ${cat.titleRu} (${cat.items.length})`);
  }
  console.log("Меню обновлено.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
