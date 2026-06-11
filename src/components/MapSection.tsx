import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "./Reveal";

export default function MapSection({
  dict,
  lat,
  lng,
  address,
}: {
  dict: Dictionary;
  lat: number;
  lng: number;
  address: string;
}) {
  // Встраиваемая карта-виджет 2ГИС, центрированная на координатах
  const widgetOptions = encodeURIComponent(
    JSON.stringify({ pos: { lat, lon: lng, zoom: 16 } }),
  );
  const widgetSrc = `https://widgets.2gis.com/widget?type=firmsonmap&options=${widgetOptions}`;

  // Ссылки в 2ГИС (формат «долгота,широта»). Открываются в приложении 2ГИС или на сайте.
  const routeUrl = `https://2gis.kz/directions/points/${lng},${lat}`;
  const geoUrl = `https://2gis.kz/geo/${lng},${lat}`;

  return (
    <section className="bg-cream py-16">
      <div className="container-x">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">{dict.sections.mapTitle}</h2>
            <div className="title-accent" />
            <p className="mt-3 text-charcoal/65">{address}</p>
          </div>
          <a href={routeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <Pin /> {dict.sections.route2gis}
          </a>
        </Reveal>

        <Reveal delay={120} className="overflow-hidden rounded-2xl shadow-soft">
          <div className="relative">
            <iframe
              title="2GIS"
              src={widgetSrc}
              className="h-[400px] w-full border-0"
              loading="lazy"
            />
            {/* Маркер в центре карты (виджет центрируется на координатах) */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" className="drop-shadow">
                <path
                  d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z"
                  fill="#6E1F2B"
                  stroke="#fff"
                  strokeWidth="1.3"
                />
                <circle cx="12" cy="10" r="2.6" fill="#fff" />
              </svg>
            </div>
            {/* Кнопка открытия в 2ГИС поверх карты */}
            <a
              href={geoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-forest shadow-soft hover:bg-white"
            >
              {dict.sections.open2gis} ↗
            </a>
          </div>
        </Reveal>

        <p className="mt-3 text-center text-sm text-charcoal/50 sm:hidden">
          {dict.sections.route2gis} — откроется приложение 2ГИС
        </p>
      </div>
    </section>
  );
}

function Pin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
