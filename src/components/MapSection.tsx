import type { Dictionary } from "@/i18n/dictionaries";

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
  const d = 0.01;
  const bbox = `${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  const fullMap = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  return (
    <section className="bg-cream py-16">
      <div className="container-x">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">{dict.sections.mapTitle}</h2>
            <p className="mt-2 text-charcoal/65">{address}</p>
          </div>
          <a
            href={fullMap}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            {dict.sections.address}
          </a>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-soft">
          <iframe
            title="map"
            src={src}
            className="h-[380px] w-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
