import type { ServiceOffering } from "@/core/domain/service_offering";
import type { NavLink } from "./site_config";

/**
 * Enlaces a las páginas de servicio para la columna del footer.
 *
 * Los slugs no se duplican en site_config: se derivan del repositorio, que es la
 * única fuente. Vive en shared/config porque solo usa tipos de core, y así tanto
 * la landing como la plantilla de servicio lo arman igual.
 */
export function build_service_links(
  services: readonly ServiceOffering[],
): readonly NavLink[] {
  return services.map((service) => ({
    label: service.name,
    href: `/servicios/${service.slug}`,
  }));
}
