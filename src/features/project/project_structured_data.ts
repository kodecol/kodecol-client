import type { ClientProject } from "@/core/domain/client_project";
import { type JsonLdNode, prune_node, ref } from "@/shared/seo/schema_org_types";
import { ORGANIZATION_ID } from "@/shared/seo/site_nodes";
import { build_absolute_url } from "@/shared/seo/urls";

/*
  Mapea un ClientProject a un CreativeWork de schema.org: la obra que Kodecol
  hizo (creator) para un cliente. Sin `review` ni `aggregateRating`: no hay
  reseñas públicas que respalden un dato así (architecture.md §10, regla 4).
*/
export function build_creative_work_node(project: ClientProject, canonical: string): JsonLdNode {
  return prune_node({
    "@type": "CreativeWork",
    "@id": `${canonical}#project`,
    name: project.name,
    headline: `${project.detail.headline_lead} ${project.detail.headline_accent}`,
    description: project.seo.description,
    genre: project.sector,
    dateCreated: project.year,
    creativeWorkStatus: project.status === "live" ? "Published" : "Draft",
    url: project.site_url ?? undefined,
    mainEntityOfPage: ref(`${canonical}#webpage`),
    creator: ref(ORGANIZATION_ID),
    image: project.detail.desktop_shots.map((shot) => ({
      "@type": "ImageObject",
      contentUrl: build_absolute_url(`${shot.src_base}.${shot.fallback_extension}`),
      caption: shot.alt,
    })),
    keywords: project.teaser.chips.join(", "),
  });
}
