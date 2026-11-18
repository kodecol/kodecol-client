import type { ClientProject } from "../domain/client_project";

/**
 * Puerto (hexágono): contrato de acceso a los proyectos hechos para clientes.
 * Hoy lo implementa un adaptador local (JSON); mañana podría ser un CMS.
 */
export interface ClientProjectRepository {
  /** Ordenados por `order`. */
  get_all(): readonly ClientProject[];
  get_all_slugs(): readonly string[];
  get_by_slug(slug: string): ClientProject | null;
}
