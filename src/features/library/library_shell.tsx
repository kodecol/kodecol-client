import Link from "next/link";
import type { NavLink } from "@/shared/config/site_config";
import { Footer } from "@/shared/ui/footer";
import { Navbar } from "@/shared/ui/navbar";
import { MAIN_CONTENT_ID } from "@/shared/ui/skip_link";
import { LibraryEffects } from "./library_effects";
import { LIBRARY_PATH } from "./library_paths";

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
  /** Para la medición (se conserva por compatibilidad con las plantillas). */
  context: string;
  /** Columna de servicios del footer del sitio. */
  service_links?: readonly NavLink[];
  /** El héroe es de día (cielo claro): la miga de pan va en tinta oscura. */
  day_hero?: boolean;
}

const LEGAL_DEFAULT =
  "Claude, Claude Opus y Claude Fable son marcas de Anthropic. Kodecol no está afiliada a Anthropic ni a las demás herramientas que mencionamos: las nombramos porque son las que usamos de verdad.";

/**
 * Marco de la Biblioteca: el mismo navbar y footer del resto del sitio (la
 * Biblioteca está en el menú), la miga de pan bajo el navbar y los efectos
 * propios de la sección (grano, barra de progreso de lectura).
 */
export function LibraryShell({ crumbs, children, legal = LEGAL_DEFAULT, progress = false, service_links, day_hero = false }: LibraryShellProps) {
  return (
    <div className="lib">
      <LibraryEffects progress={progress} />
      <Navbar current_href={LIBRARY_PATH} />
      <nav aria-label="Ruta" className={day_hero ? "lib-crumbs lib-crumbs-bar lib-crumbs-bar--day" : "lib-crumbs lib-crumbs-bar"}>
        <div className="lib-wrap">
          <Link href="/">Inicio</Link>
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <span key={crumb.label} className="contents">
                <span className="sep" aria-hidden="true">
                  /
                </span>
                {last || !crumb.href ? (
                  <span aria-current={last ? "page" : undefined}>{crumb.label}</span>
                ) : (
                  <Link href={crumb.href}>{crumb.label}</Link>
                )}
              </span>
            );
          })}
        </div>
      </nav>

      <main id={MAIN_CONTENT_ID}>{children}</main>

      <p className="lib-wrap lib-legal">{legal}</p>
      <Footer service_links={service_links} />
    </div>
  );
}
