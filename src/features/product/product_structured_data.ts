import type { ProductBrand } from "@/core/domain/product_brand";
import { type JsonLdNode, prune_node, ref } from "@/shared/seo/schema_org_types";
import { ORGANIZATION_ID } from "@/shared/seo/site_nodes";
import { build_absolute_url } from "@/shared/seo/urls";

/*
  Mapea una ProductBrand a un nodo SoftwareApplication de schema.org.

  No se emiten `offers` ni `aggregateRating`: sin precio público ni reseñas
  reales, inventarlos es una acción manual de Google esperando a ocurrir. El
  nodo no dará rich result, pero sí alimenta el Knowledge Graph y a los LLM.
*/
export function build_software_application_node(
  brand: ProductBrand,
  canonical: string,
): JsonLdNode {
  return prune_node({
    "@type": "SoftwareApplication",
    "@id": `${canonical}#software`,
    name: brand.name,
    description: brand.seo.description,
    applicationCategory: brand.seo.application_category ?? "BusinessApplication",
    applicationSubCategory: brand.teaser.kind,
    operatingSystem: "Web",
    /* La URL del producto es su propio dominio; esta página es la ficha. */
    url: brand.detail.primary_cta.href,
    mainEntityOfPage: ref(`${canonical}#webpage`),
    publisher: ref(ORGANIZATION_ID),
    creator: ref(ORGANIZATION_ID),
    image: build_absolute_url(brand.isotype_src),
    screenshot: brand.gallery.map((src) => ({
      "@type": "ImageObject",
      contentUrl: build_absolute_url(src),
    })),
    featureList: brand.detail.stack.groups.flatMap((group) => [...group.items]),
  });
}
