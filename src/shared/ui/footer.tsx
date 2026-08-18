import Link from "next/link";
import { type NavLink, SITE_CONFIG } from "@/shared/config/site_config";
import { cn } from "@/shared/lib/cn";
import { KodecolLogo } from "@/shared/ui/kodecol_mark";
import { LegalBadge } from "@/shared/ui/legal_badge";

const FOOTER_NAV = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Servicios", href: "/servicios" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Cotizaciones", href: "/#cotizaciones" },
];

/* Rótulo de columna: es una etiqueta visual de 12px, no un encabezado de la
   página. Antes era un <h2> y competía en el esquema con los h2 de sección. */
const column_label_class =
  "text-xs font-semibold uppercase tracking-[0.14em] text-text-muted";

const link_class =
  "text-sm text-text-secondary transition-colors duration-fast hover:text-mint-500";

interface FooterProps {
  /**
   * Enlaces a las páginas de servicio. Los resuelve el composition root desde el
   * repositorio, para que shared/ui no conozca los slugs del negocio (§2).
   */
  service_links?: readonly NavLink[];
}

/** Footer global: marca + navegación + servicios + contacto + copyright. */
export function Footer({ service_links }: FooterProps) {
  const has_services = service_links !== undefined && service_links.length > 0;

  return (
    <footer className="bg-surface-1 px-6 pb-10 pt-16">
      <div className="mx-auto max-w-[1200px] border-t border-border-subtle pt-12">
        <div
          className={cn(
            "grid gap-10",
            has_services
              ? "md:grid-cols-[1.4fr_1fr_1fr_1fr]"
              : "md:grid-cols-[1.4fr_1fr_1fr]",
          )}
        >
          <div className="flex flex-col gap-4">
            <KodecolLogo />
            <p className="text-sm leading-relaxed text-text-muted">
              {SITE_CONFIG.tagline}
              <br />
              {SITE_CONFIG.sub_tagline}
            </p>
          </div>

          <nav aria-label="Navegación del footer" className="flex flex-col gap-3">
            <p className={column_label_class}>Navegación</p>
            <ul className="flex flex-col gap-3">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={link_class}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {has_services ? (
            <nav aria-label="Servicios" className="flex flex-col gap-3">
              <p className={column_label_class}>Servicios</p>
              <ul className="flex flex-col gap-3">
                {service_links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={link_class}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className="flex flex-col gap-3">
            <p className={column_label_class}>Contacto</p>
            {/* <address> es la etiqueta para los datos de contacto de la página. */}
            <address className="flex flex-col gap-3 not-italic">
              <a
                href={SITE_CONFIG.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className={link_class}
              >
                WhatsApp · {SITE_CONFIG.whatsapp_display}
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`} className={link_class}>
                {SITE_CONFIG.email}
              </a>
              <span className="text-sm text-text-secondary">
                {SITE_CONFIG.location}
              </span>
            </address>
          </div>
        </div>

        <div className="mt-12">
          <LegalBadge />
        </div>

        <p className="mt-8 border-t border-border-subtle pt-6 text-center text-[13px] text-text-disabled">
          © {new Date().getFullYear()} Kodecol. Todos los derechos reservados. ·{" "}
          <em>Construimos futuro.</em>
        </p>
      </div>
    </footer>
  );
}
