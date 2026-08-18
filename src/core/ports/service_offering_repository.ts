import type { ServiceOffering } from "../domain/service_offering";

/**
 * Puerto (hexágono): contrato de acceso a los servicios de Kodecol.
 * Hoy lo implementa un adaptador local (JSON); mañana podría implementarlo un CMS
 * sin tocar features ni app (solo cambia la factoría del adaptador).
 */
export interface ServiceOfferingRepository {
  /** Ordenados por `order` ascendente. */
  get_all(): readonly ServiceOffering[];
  get_all_slugs(): readonly string[];
  get_by_slug(slug: string): ServiceOffering | null;
}
