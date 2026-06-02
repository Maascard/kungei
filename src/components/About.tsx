import type { Dictionary } from "@/i18n/dictionaries";

export default function About({
  dict,
  about,
  capacity,
  price,
  address,
  suitableFor,
  amenities,
  rules,
}: {
  dict: Dictionary;
  about: string;
  capacity: string;
  price: string;
  address: string;
  suitableFor: string[];
  amenities: string[];
  rules: string[];
}) {
  return (
    <section id="about" className="bg-sand/40 py-20 sm:py-28">
      <div className="container-x">
        <div className="mb-12 max-w-3xl">
          <h2 className="section-title">{dict.sections.aboutTitle}</h2>
          <p className="mt-4 text-lg leading-relaxed text-charcoal/75">{about}</p>
        </div>

        {/* Краткие факты */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <FactCard label={dict.sections.capacity} value={capacity} icon="users" />
          <FactCard label={dict.sections.price} value={price} icon="tag" />
          <FactCard label={dict.sections.address} value={address} icon="pin" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <InfoBlock title={dict.sections.suitableFor} items={suitableFor} />
          <InfoBlock title={dict.sections.amenities} items={amenities} />
          <InfoBlock title={dict.sections.rules} items={rules} />
        </div>
      </div>
    </section>
  );
}

function FactCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: "users" | "tag" | "pin";
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-soft">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
        <Icon name={icon} />
      </span>
      <div>
        <div className="text-xs uppercase tracking-wide text-charcoal/50">{label}</div>
        <div className="mt-0.5 font-medium text-charcoal">{value}</div>
      </div>
    </div>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft">
      <h3 className="mb-4 font-display text-xl text-forest">{title}</h3>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-charcoal/75">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Icon({ name }: { name: "users" | "tag" | "pin" }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "users")
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  if (name === "tag")
    return (
      <svg {...common}>
        <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
        <circle cx="7" cy="7" r="1.2" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
