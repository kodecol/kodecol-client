import type { LibraryGuide } from "../domain/library_guide";

/**
 * Puerto (hexágono): contrato de acceso a las guías de la Biblioteca.
 * Hoy lo implementa un adaptador local (JSON); mañana podría ser un CMS.
 */
export interface LibraryGuideRepository {
  /** De la más reciente a la más antigua. */
  get_all(): readonly LibraryGuide[];
  get_all_slugs(): readonly string[];
  get_by_slug(slug: string): LibraryGuide | null;
}
