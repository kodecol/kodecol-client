import Link from "next/link";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { KodecolLogo } from "@/shared/ui/kodecol_mark";
import { MAIN_CONTENT_ID } from "@/shared/ui/skip_link";
import { LibraryEffects } from "./library_effects";
import { GUIDES_PATH, LIBRARY_PATH } from "./library_paths";
import { TrackedLink } from "./tracked_link";

export interface Crumb {
  label: string;
  href?: string;
}

interface LibraryShellProps {
  crumbs: readonly Crumb[];
  children: React.ReactNode;
  /** Nota legal de la página (marcas de terceros). */
  legal?: string;
  progress?: boolean;
  /** Para la medición del botón de WhatsApp de la barra. */
  context: string;
}

const LEGAL_DEFAULT =
  "Claude y Claude Opus son marcas de Anthropic. Kodecol no está afiliada a Anthropic ni a las demás herramientas que mencionamos: las nombramos porque son las que usamos de verdad.";

/**
 * Marco de la Biblioteca: barra propia con la miga de pan, efectos y pie.
 * Aquí manda la estética «tecnología + naturaleza»; fuera de /biblioteca el
 * sitio sigue con su sistema de siempre.
 */
export function LibraryShell({ crumbs, children, legal = LEGAL_DEFAULT, progress = false, context }: LibraryShellProps) {
  return (
    <div className="lib">
      <LibraryEffects progress={progress} />
      <header className="lib-top">
        <div className="lib-wrap lib-top-in">
          <Link href="/" aria-label="Kodecol, inicio" className="flex shrink-0">
            <KodecolLogo />
          </Link>
          <nav aria-label="Ruta" className="lib-crumbs">
            <span className="sep" aria-hidden="true">
              /
            </span>
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1;
              /* En el celular solo se ven la Biblioteca y la página actual. */
              const hide = !last && index > 0 ? "hide-sm" : undefined;
              return (
                <span key={crumb.label} className={`contents ${hide ?? ""}`}>
                  {last || !crumb.href ? (
                    <span aria-current={last ? "page" : undefined} className={hide}>
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className={hide}>
                      {crumb.label}
                    </Link>
                  )}
                  {!last ? (
                    <span className={`sep ${hide ?? ""}`} aria-hidden="true">
                      /
                    </span>
                  ) : null}
                </span>
              );
            })}
          </nav>
          <TrackedLink
            className="lib-top-cta"
            href={SITE_CONFIG.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            event_name="biblioteca_whatsapp"
            event_params={{ origen: `barra-${context}` }}
            aria-label="Escríbenos por WhatsApp"
          >
            <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" />
            </svg>
            <span>Escríbenos</span>
          </TrackedLink>
        </div>
      </header>

      <main id={MAIN_CONTENT_ID}>{children}</main>

      <footer className="lib-wrap lib-foot">
        <div className="lib-foot-row">
          <KodecolLogo />
          <nav aria-label="Biblioteca">
            <Link href={LIBRARY_PATH}>Biblioteca</Link>
            <Link href={GUIDES_PATH}>Guías</Link>
            <Link href="/servicios">Servicios</Link>
            <Link href="/">Kodecol</Link>
          </nav>
        </div>
        <p className="lib-legal">{legal}</p>
        <p>© 2026 {SITE_CONFIG.legal.business_name}</p>
      </footer>
    </div>
  );
}
