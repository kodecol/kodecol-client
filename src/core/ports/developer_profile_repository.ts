import type { DeveloperProfile } from "../domain/developer_profile";

/**
 * Puerto (hexágono): contrato de acceso a los perfiles de desarrolladores.
 * Hoy lo implementa un adaptador local (JSON); mañana podría implementarlo un CMS
 * sin tocar features ni app (solo cambia la factoría del adaptador).
 */
export interface DeveloperProfileRepository {
  /** Todos los perfiles: lo consume la página índice /equipo. */
  get_all(): readonly DeveloperProfile[];
  get_all_slugs(): readonly string[];
  get_by_slug(slug: string): DeveloperProfile | null;
}
