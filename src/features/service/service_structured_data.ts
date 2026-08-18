import type { ServiceOffering } from "@/core/domain/service_offering";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { type JsonLdNode, prune_node, ref } from "@/shared/seo/schema_org_types";
import { ORGANIZATION_ID } from "@/shared/seo/site_nodes";

/*
  Mapea un ServiceOffering a los nodos Service y FAQPage de schema.org.

  Sobre el FAQPage: desde agosto de 2023 Google restringe sus rich results a
  sitios de gobierno y salud, así que no esperes estrellitas en la SERP. Se
  emite porque sigue siendo señal semántica válida, coherente con el contenido
  visible, y porque alimenta a los asistentes de IA. Coste: cero.
*/

export function build_service_node(
  service: ServiceOffering,
  canonical: string,
): JsonLdNode {
  return prune_node({
    "@type": "Service",
    "@id": `${canonical}#service`,
    name: service.name,
    serviceType: service.seo.title,
    description: service.seo.description,
    url: canonical,
    provider: ref(ORGANIZATION_ID),
    areaServed: { "@type": "Country", name: SITE_CONFIG.location },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: canonical,
      servicePhone: `+${SITE_CONFIG.whatsapp_number}`,
    },
    /* Los entregables son el catálogo real de lo que incluye el servicio. */
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.deliverables.title,
      itemListElement: service.deliverables.items.map((deliverable) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: deliverable.title,
          description: deliverable.description,
        },
      })),
    },
  });
}

/** Nodo aparte con `@id` propio: no se fusiona con el WebPage para no chocar en `mainEntity`. */
export function build_faq_node(
  service: ServiceOffering,
  canonical: string,
): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    mainEntity: service.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
