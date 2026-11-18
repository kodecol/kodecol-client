import type { ClientProject } from "@/core/domain/client_project";
import type { ClientProjectRepository } from "@/core/ports/client_project_repository";
import ducks_machine_raw from "@content/projects/ducks_machine.json";
import neon_night_raw from "@content/projects/neon_night.json";
import the_brothers_inc_raw from "@content/projects/the_brothers_inc.json";
import { client_project_schema } from "./client_project_schema";

/*
  Adaptador local: importa los JSON estáticamente (compatible con SSG) y los
  valida al cargar el módulo. Un JSON inválido rompe `pnpm build`.

  Añadir un proyecto = un JSON + sus capturas y escena + una línea aquí +
  `pnpm assets`.
*/

const raw_projects: readonly unknown[] = [neon_night_raw, the_brothers_inc_raw, ducks_machine_raw];

const projects: readonly ClientProject[] = raw_projects
  .map((raw) => client_project_schema.parse(raw))
  .sort((a, b) => a.order - b.order);

const by_slug: ReadonlyMap<string, ClientProject> = new Map(projects.map((project) => [project.slug, project]));

export class LocalClientProjectRepository implements ClientProjectRepository {
  get_all(): readonly ClientProject[] {
    return projects;
  }

  get_all_slugs(): readonly string[] {
    return [...by_slug.keys()];
  }

  get_by_slug(slug: string): ClientProject | null {
    return by_slug.get(slug) ?? null;
  }
}
