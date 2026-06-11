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

        <Reveal delay={120}>
          <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-forest to-moss text-cream shadow-soft">
            {/* Декоративная «карта» */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
              viewBox="0 0 400 240"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
              stroke="#F8F3E9"
              strokeWidth="2"
            >
              <path d="M-20 60 L180 60 L260 140 L420 140" />
              <path d="M40 -20 L40 120 L120 200 L120 260" />
              <path d="M-20 180 L140 180 L220 100 L420 100" />
              <path d="M300 -20 L300 90 L360 150 L360 260" />
              <circle cx="180" cy="60" r="3" fill="#F8F3E9" stroke="none" />
              <circle cx="120" cy="200" r="3" fill="#F8F3E9" stroke="none" />
              <circle cx="300" cy="90" r="3" fill="#F8F3E9" stroke="none" />
            </svg>

            <div className="relative z-10 flex flex-col items-center px-6 py-10 text-center">
              {/* Пульсирующий маркер */}
              <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay/40" />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-cream/15">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z" fill="#DAB86E" stroke="#fff" strokeWidth="1.2" />
                    <circle cx="12" cy="10" r="2.6" fill="#6E1F2B" />
                  </svg>
                </span>
              </div>

              <p className="max-w-md font-display text-xl text-cream">{address}</p>
              <p className="mt-2 text-sm text-cream/70">
                Нажмите, чтобы открыть 2ГИС и построить маршрут до нас
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={routeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-cream text-forest hover:bg-white shadow-soft"
                >
                  <Pin /> {dict.sections.route2gis}
                </a>
                <a
                  href={geoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn border border-cream/50 text-cream hover:bg-cream/10"
                >
                  {dict.sections.open2gis} ↗
                </a>
              </div>
            </div>
          </div>
        </Reveal>
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
