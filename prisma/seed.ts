import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_SETTINGS,
  DEFAULT_GALLERY,
  DEFAULT_MENU,
  DEFAULT_REVIEWS,
} from "../src/lib/site-defaults";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Settings — upsert (не перезатираем существующие изменённые значения)
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  // Галерея — заполняем только если пусто
  if ((await prisma.galleryImage.count()) === 0) {
    await prisma.galleryImage.createMany({
      data: DEFAULT_GALLERY.map((g, i) => ({ ...g, sortOrder: i })),
    });
    console.log(`  + ${DEFAULT_GALLERY.length} фото галереи`);
  }

  // Меню — заполняем только если пусто
  if ((await prisma.menuCategory.count()) === 0) {
    for (let c = 0; c < DEFAULT_MENU.length; c++) {
      const cat = DEFAULT_MENU[c];
      await prisma.menuCategory.create({
        data: {
          titleRu: cat.titleRu,
          titleKk: cat.titleKk,
          sortOrder: c,
          items: {
            create: cat.items.map((item, i) => ({
              titleRu: item.titleRu,
              titleKk: item.titleKk,
              descRu: item.descRu,
              descKk: item.descKk,
              price: item.price,
              imageUrl: item.imageUrl,
              sortOrder: i,
            })),
          },
        },
      });
    }
    console.log(`  + ${DEFAULT_MENU.length} категорий меню`);
  }

  // Отзывы — заполняем только если пусто
  if ((await prisma.review.count()) === 0) {
    await prisma.review.createMany({
      data: DEFAULT_REVIEWS.map((r, i) => ({ ...r, sortOrder: i })),
    });
    console.log(`  + ${DEFAULT_REVIEWS.length} отзыва`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
