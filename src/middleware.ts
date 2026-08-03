import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/config";

// Перенаправляет запросы без префикса локали на язык по умолчанию (/ru),
// а также подхватывает язык из заголовка браузера при первом заходе.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Пропускаем служебные пути
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/base") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();

  // Определяем предпочитаемый язык
  const accept = request.headers.get("accept-language") || "";
  const preferred = accept.toLowerCase().includes("kk") ? "kk" : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
