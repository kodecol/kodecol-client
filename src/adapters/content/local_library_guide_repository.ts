import type { LibraryGuide } from "@/core/domain/library_guide";
import type { LibraryGuideRepository } from "@/core/ports/library_guide_repository";
import misma_cuadra_raw from "@content/biblioteca/guias/misma_cuadra.json";
import presione_uno_raw from "@content/biblioteca/guias/presione_uno.json";
import { library_guide_schema } from "./library_guide_schema";

/*
  Adaptador local de la Biblioteca: importa los JSON estáticamente (SSG) y los
  valida al cargar el módulo. Añadir una guía = un JSON + una línea en `raw_guides`
  + sus medios en public/biblioteca/guias/<slug>.
*/

const raw_guides: readonly unknown[] = [presione_uno_raw, misma_cuadra_raw];

const guides: readonly LibraryGuide[] = raw_guides
  .map((raw) => library_guide_schema.parse(raw))
  .toSorted((a, b) => b.published_at.localeCompare(a.published_at));

const by_slug: ReadonlyMap<string, LibraryGuide> = new Map(guides.map((guide) => [guide.slug, guide]));

if (by_slug.size !== guides.length) {
  throw new Error("content/biblioteca/guias: hay un slug repetido. Los slugs son URLs: deben ser únicos.");
}

for (const guide of guides) {
  const missing = guide.related.find((slug) => slug === guide.slug || !by_slug.has(slug));
  if (missing) {
    throw new Error(`content/biblioteca/guias/${guide.slug}: la relacionada "${missing}" no existe o es ella misma.`);
  }
}

export class LocalLibraryGuideRepository implements LibraryGuideRepository {
  get_all(): readonly LibraryGuide[] {
    return guides;
  }

  get_all_slugs(): readonly string[] {
    return [...by_slug.keys()];
  }

  get_by_slug(slug: string): LibraryGuide | null {
    return by_slug.get(slug) ?? null;
  }
}
