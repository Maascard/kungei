import type { Dictionary } from "@/i18n/dictionaries";

type ReviewView = { id: string; author: string; text: string; rating: number };

export default function Reviews({
  dict,
  reviews,
}: {
  dict: Dictionary;
  reviews: ReviewView[];
}) {
  if (reviews.length === 0) return null;
  return (
    <section id="reviews" className="bg-sand/40 py-20 sm:py-28">
      <div className="container-x">
        <div className="mb-10 text-center">
          <h2 className="section-title">{dict.sections.reviewsTitle}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.id}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-soft"
            >
              <Stars n={r.rating} />
              <blockquote className="mt-3 flex-1 text-charcoal/75">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-4 font-medium text-forest">
                {r.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-bronze">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={i < n ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
        </svg>
      ))}
    </div>
  );
}
