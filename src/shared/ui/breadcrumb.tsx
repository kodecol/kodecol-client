import Link from "next/link";
import { LineIcon } from "@/shared/ui/line_icon";

export interface BreadcrumbCrumb {
  label: string;
  /** `null` en el último: la página actual no se enlaza a sí misma. */
  href: string | null;
}

interface BreadcrumbProps {
  crumbs: readonly BreadcrumbCrumb[];
}

/**
 * Miga de pan visible.
 *
 * Acompaña al BreadcrumbList del JSON-LD: Google exige que los datos
 * estructurados reflejen algo que el usuario también pueda ver en la página.
 * Vive en shared/ui porque la usan varios slices (servicios, equipo, marcas).
 */
export function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Miga de pan"
      className="mx-auto max-w-[1200px] px-6 pt-[110px] md:pt-[130px]"
    >
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-text-muted">
        {crumbs.map((crumb, index) => (
          <li key={crumb.label} className="flex items-center gap-2">
            {/* Separador decorativo: LineIcon ya emite aria-hidden. */}
            {index > 0 ? (
              <LineIcon name="arrow_right" size={12} className="text-text-disabled" />
            ) : null}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="transition-colors duration-fast hover:text-mint-500"
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-text-secondary">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
