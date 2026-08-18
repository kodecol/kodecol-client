import { SITE_CONFIG } from "@/shared/config/site_config";
import { type JsonLdNode, prune_node, ref } from "./schema_org_types";
import { build_absolute_url } from "./urls";

/*
  Nodos de schema.org que describen al sitio y a la empresa. Solo conocen
  SITE_CONFIG, así que viven en shared/ (no son negocio de ningún slice).
  Los constructores de entidades — Person, SoftwareApplication, Service — viven
  con su slice dueño en features/.

  Los @id son absolutos y estables: una vez publicados no se cambian, porque son
  la identidad de la entidad para los buscadores.
*/

export const ORGANIZATION_ID = `${SITE_CONFIG.base_url}/#organization`;
export const WEBSITE_ID = `${SITE_CONFIG.base_url}/#website`;
const LOGO_ID = `${SITE_CONFIG.base_url}/#logo`;

/**
 * La empresa. Se repite en TODAS las páginas a propósito: Google no resuelve
 * referencias `@id` entre páginas distintas, así que cada grafo debe bastarse
 * solo. Son ~600 bytes antes de comprimir; el coste es despreciable frente a
 * perder el nodo.
 *
 * Aprovecha datos que hoy solo existen como texto en el footer (NIT, matrícula
 * mercantil, RUES): aquí quedan legibles por máquina.
 */
export function build_organization_node(): JsonLdNode {
  const { legal } = SITE_CONFIG;
  return prune_node({
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_CONFIG.name,
    legalName: legal.business_name,
    url: build_absolute_url("/"),
    description: SITE_CONFIG.description,
    slogan: SITE_CONFIG.tagline,
    email: SITE_CONFIG.email,
    telephone: `+${SITE_CONFIG.whatsapp_number}`,
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: build_absolute_url("/images/logo/imagotipo-white.png"),
      contentUrl: build_absolute_url("/images/logo/imagotipo-white.png"),
      caption: SITE_CONFIG.name,
    },
    image: ref(LOGO_ID),
    /* Sin dirección postal pública: se declara solo el país, que sí es verificable. */
    address: { "@type": "PostalAddress", addressCountry: "CO" },
    areaServed: { "@type": "Country", name: SITE_CONFIG.location },
    taxID: legal.tax_id,
    identifier: [
      { "@type": "PropertyValue", propertyID: "NIT", value: legal.tax_id },
      {
        "@type": "PropertyValue",
        propertyID: "Matrícula mercantil",
        value: legal.registration_number,
      },
    ],
    /* No hay redes corporativas: sameAs enlaza lo que sí se puede comprobar. */
    sameAs: [legal.rues_url, "https://axi-connect.co"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: `+${SITE_CONFIG.whatsapp_number}`,
      email: SITE_CONFIG.email,
      areaServed: "CO",
      availableLanguage: ["es"],
    },
  });
}

/** El sitio como obra: da contexto de idioma y editor a todas las páginas. */
export function build_website_node(): JsonLdNode {
  return prune_node({
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: build_absolute_url("/"),
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    inLanguage: "es-CO",
    publisher: ref(ORGANIZATION_ID),
  });
}

export interface WebPageInput {
  canonical: string;
  title: string;
  description: string;
  og_image_url: string;
  /**
   * `ProfilePage` en /equipo/[slug] y `CollectionPage` en los índices, según
   * la recomendación vigente de Google. `WebPage` en el resto.
   */
  page_type?: "WebPage" | "ProfilePage" | "CollectionPage" | "AboutPage";
  /** `@id` de la entidad principal de la página (Person, Service, …). */
  main_entity_id?: string;
  breadcrumb_id?: string;
}

/** La página actual. Su `@id` es siempre `<canonical>#webpage`. */
export function build_web_page_node(input: WebPageInput): JsonLdNode {
  return prune_node({
    "@type": input.page_type ?? "WebPage",
    "@id": `${input.canonical}#webpage`,
    url: input.canonical,
    name: input.title,
    description: input.description,
    inLanguage: "es-CO",
    isPartOf: ref(WEBSITE_ID),
    about: ref(ORGANIZATION_ID),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: input.og_image_url,
    },
    mainEntity: input.main_entity_id ? ref(input.main_entity_id) : undefined,
    breadcrumb: input.breadcrumb_id ? ref(input.breadcrumb_id) : undefined,
  });
}

export interface BreadcrumbStep {
  name: string;
  /** `null` en el último paso: la página actual no se enlaza a sí misma. */
  path: string | null;
}

/** Miga de pan. Es lo que Google pinta bajo el título en la SERP. */
export function build_breadcrumb_node(
  canonical: string,
  steps: readonly BreadcrumbStep[],
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: steps.map((step, index) =>
      prune_node({
        "@type": "ListItem",
        position: index + 1,
        name: step.name,
        item: step.path ? build_absolute_url(step.path) : undefined,
      }),
    ),
  };
}

export interface EntityStub {
  id: string;
  type: string;
  name: string;
  path: string;
  description?: string;
}

/**
 * Nodo mínimo de una entidad que vive en otra página.
 *
 * Existe porque Google solo resuelve las referencias `@id` DENTRO del mismo
 * grafo: si el home dice `employee: [{"@id": ".../juan#person"}]` sin declarar
 * ese nodo, la referencia queda colgando y se descarta. Con este resumen
 * (tipo, nombre y URL) el grafo del home se basta solo, y la página de detalle
 * aporta luego la versión completa de la misma entidad bajo el mismo `@id`.
 */
export function build_entity_stub_node(stub: EntityStub): JsonLdNode {
  return prune_node({
    "@type": stub.type,
    "@id": stub.id,
    name: stub.name,
    url: build_absolute_url(stub.path),
    description: stub.description,
  });
}

/** Lista ordenada de entidades para las páginas índice (`CollectionPage`). */
export function build_item_list_node(
  canonical: string,
  items: readonly { name: string; path: string }[],
): JsonLdNode {
  return {
    "@type": "ItemList",
    "@id": `${canonical}#itemlist`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: build_absolute_url(item.path),
    })),
  };
}
