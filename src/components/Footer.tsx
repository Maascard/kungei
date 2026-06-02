import type { Dictionary } from "@/i18n/dictionaries";

export default function Footer({
  dict,
  address,
  phoneDisplay,
  waLink,
  igLink,
  igHandle,
}: {
  dict: Dictionary;
  address: string;
  phoneDisplay: string;
  waLink: string;
  igLink: string;
  igHandle: string;
}) {
  return (
    <footer id="contacts" className="bg-charcoal py-16 text-cream/80">
      <div className="container-x grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl text-cream">Kungei</div>
          <p className="mt-3 text-sm text-cream/60">{dict.meta.description}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm uppercase tracking-wide text-cream/50">
            {dict.sections.contactsTitle}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>{address}</li>
            {phoneDisplay && (
              <li>
                <a
                  href={`tel:${phoneDisplay.replace(/[^\d+]/g, "")}`}
                  className="hover:text-cream"
                >
                  {phoneDisplay}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm uppercase tracking-wide text-cream/50">
            {dict.footer.madeBy}
          </h3>
          <div className="flex flex-col gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-wa w-full sm:w-auto">
              {dict.buttons.whatsapp}
            </a>
            <a href={igLink} target="_blank" rel="noopener noreferrer" className="btn-ig w-full sm:w-auto">
              @{igHandle.replace(/^@/, "")}
            </a>
          </div>
        </div>
      </div>
      <div className="container-x mt-12 border-t border-cream/10 pt-6 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Kungei. {dict.footer.rights}.
      </div>
    </footer>
  );
}
