import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getSettingsMap,
  getGallery,
  getMenu,
  getReviews,
  pick,
  toList,
  toServices,
} from "@/lib/content";
import { whatsappLink, instagramLink } from "@/lib/messaging";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Services from "@/components/Services";
import MenuSection from "@/components/MenuSection";
import BookingSection from "@/components/BookingSection";
import Reviews from "@/components/Reviews";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ChatWidget from "@/components/ChatWidget";
import { CartProvider } from "@/components/CartProvider";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const [settings, gallery, menu, reviews] = await Promise.all([
    getSettingsMap(),
    getGallery(),
    getMenu(),
    getReviews(),
  ]);

  const greeting =
    locale === "kk"
      ? "Сәлеметсіз бе! Küngey коттеджі туралы білгім келеді."
      : "Здравствуйте! Хочу узнать о коттедже Kungei.";
  const waLink = whatsappLink(settings.whatsapp_phone, greeting);
  const igLink = instagramLink(settings.instagram_handle);

  const address = pick(settings, "address", locale);
  const lat = parseFloat(settings.map_lat) || 53.2144;
  const lng = parseFloat(settings.map_lng) || 63.6246;

  const galleryView = gallery.map((g) => ({
    id: g.id,
    url: g.url,
    caption: (locale === "kk" ? g.captionKk : g.captionRu) ?? "",
  }));

  const menuView = menu
    .map((c) => ({
      id: c.id,
      title: locale === "kk" ? c.titleKk : c.titleRu,
      items: c.items
        .filter((i) => i.available)
        .map((i) => ({
          id: i.id,
          title: locale === "kk" ? i.titleKk : i.titleRu,
          desc: (locale === "kk" ? i.descKk : i.descRu) ?? "",
          price: i.price,
          imageUrl: i.imageUrl,
        })),
    }))
    .filter((c) => c.items.length > 0);

  const reviewsView = reviews.map((r) => ({
    id: r.id,
    author: r.author,
    text: (locale === "kk" ? r.textKk : r.textRu) || r.textRu,
    rating: r.rating,
    imageUrl: r.imageUrl,
  }));

  return (
    <CartProvider>
      <Header locale={locale} dict={dict} />
      <main>
        <Hero
          dict={dict}
          title={pick(settings, "hero_title", locale)}
          subtitle={pick(settings, "hero_subtitle", locale)}
          image={settings.hero_image}
          waLink={waLink}
          igLink={igLink}
        />
        <Gallery dict={dict} images={galleryView} />
        <About
          dict={dict}
          about={pick(settings, "about", locale)}
          capacity={pick(settings, "capacity", locale)}
          address={address}
          suitableFor={toList(pick(settings, "events", locale))}
          amenities={toList(pick(settings, "amenities", locale))}
          rules={toList(pick(settings, "rules", locale))}
        />
        <Services
          dict={dict}
          services={toServices(pick(settings, "services", locale))}
        />
        <MenuSection dict={dict} categories={menuView} />
        <BookingSection locale={locale} dict={dict} />
        <Reviews dict={dict} reviews={reviewsView} />
        <MapSection dict={dict} lat={lat} lng={lng} address={address} />
        <Footer
          dict={dict}
          address={address}
          phoneDisplay={settings.contact_phone_display}
          waLink={waLink}
          igLink={igLink}
          igHandle={settings.instagram_handle}
        />
      </main>
      <FloatingButtons dict={dict} waLink={waLink} igLink={igLink} />
      <ChatWidget dict={dict} waLink={waLink} />
    </CartProvider>
  );
}
