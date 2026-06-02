import { prisma } from "./db";
import { DEFAULT_SETTINGS } from "./site-defaults";
import type { Locale } from "@/i18n/config";

// Возвращает все настройки в виде объекта key->value (с подстановкой дефолтов).
export async function getSettingsMap(): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany();
  const map: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) map[row.key] = row.value;
  return map;
}

// Достаёт локализованное значение: ищет key_<locale>, затем key, затем дефолт.
export function pick(
  map: Record<string, string>,
  key: string,
  locale: Locale,
): string {
  return map[`${key}_${locale}`] ?? map[key] ?? DEFAULT_SETTINGS[`${key}_${locale}`] ?? DEFAULT_SETTINGS[key] ?? "";
}

// Разбивает многострочную настройку в массив строк (для списков удобств и т.п.)
export function toList(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Разбирает список услуг: каждая строка "Название|Описание" (описание необязательно).
export function toServices(value: string): { title: string; desc: string }[] {
  return toList(value).map((line) => {
    const [title, ...rest] = line.split("|");
    return { title: title.trim(), desc: rest.join("|").trim() };
  });
}

export async function getGallery() {
  return prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getMenu() {
  return prisma.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getReviews() {
  return prisma.review.findMany({ orderBy: { sortOrder: "asc" } });
}
