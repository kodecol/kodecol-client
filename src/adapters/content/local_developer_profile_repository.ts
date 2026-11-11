import type { DeveloperProfile } from "@/core/domain/developer_profile";
import type { DeveloperProfileRepository } from "@/core/ports/developer_profile_repository";
import cristian_raw from "@content/developers/cristian.json";
/* Juan oculto temporalmente: descomentar este import y su entrada en
   `raw_profiles` lo devuelve a la crew y a /equipo/juan. */
// import juan_raw from "@content/developers/juan.json";
import { developer_profile_schema } from "./developer_profile_schema";

/*
  Adaptador local: importa los JSON estáticamente (compatible con SSG) y los valida
  al cargar el módulo. Un JSON inválido rompe `pnpm build` con el error de zod
  señalando el campo — gate de calidad de contenido, no un bug.
*/

const raw_profiles: readonly unknown[] = [cristian_raw /*, juan_raw */];

const profiles: ReadonlyMap<string, DeveloperProfile> = new Map(
  raw_profiles.map((raw) => {
    const profile = developer_profile_schema.parse(raw);
    return [profile.slug, profile];
  }),
);

export class LocalDeveloperProfileRepository
  implements DeveloperProfileRepository
{
  get_all(): readonly DeveloperProfile[] {
    return [...profiles.values()];
  }

  get_all_slugs(): readonly string[] {
    return [...profiles.keys()];
  }

  get_by_slug(slug: string): DeveloperProfile | null {
    return profiles.get(slug) ?? null;
  }
}
