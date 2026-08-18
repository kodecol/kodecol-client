import type { MetadataRoute } from "next";
import {
  get_developer_profile_repository,
  get_product_brand_repository,
  get_service_offering_repository,
} from "@/adapters/content";
import {
  get_content_last_modified,
  get_latest_content_date,
} from "@/adapters/content/content_last_modified";
import { build_absolute_url } from "@/shared/seo/urls";

/* Se generan en build: obligatorio para la exportación estática (output: "export"). */
export const dynamic = "force-static";

/*
  Nota sobre priority y changeFrequency: Google los ignora desde 2015 y hoy solo
  mira lastmod. Bing y Yandex sí los leen, así que se mantienen porque no cuestan
  nada — pero el valor real está en que el lastmod sea verdad.

  Las URL salen de build_absolute_url, la misma función que genera el
  <link rel="canonical">, para que sitemap y canonical no puedan divergir.
*/

type SitemapEntry = MetadataRoute.Sitemap[number];

function to_entry(
  path: string,
  content_key: string | null,
  changeFrequency: SitemapEntry["changeFrequency"],
  priority: number,
): SitemapEntry {
  const last_modified = content_key
    ? get_content_last_modified(content_key)
    : get_latest_content_date();

  return {
    url: build_absolute_url(path),
    lastModified: last_modified ?? undefined,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const profiles = get_developer_profile_repository();
  const brands = get_product_brand_repository();
  const services = get_service_offering_repository();

  return [
    to_entry("/", null, "weekly", 1),
    /* Las páginas de servicio son las que compiten por búsquedas comerciales. */
    to_entry("/servicios", null, "monthly", 0.9),
    ...services
      .get_all_slugs()
      .map((slug) => to_entry(`/servicios/${slug}`, `services/${slug}`, "monthly", 0.9)),
    to_entry("/marcas", null, "monthly", 0.8),
    ...brands
      .get_all_slugs()
      .map((slug) => to_entry(`/marcas/${slug}`, `products/${slug}`, "monthly", 0.8)),
    to_entry("/equipo", null, "monthly", 0.6),
    ...profiles
      .get_all_slugs()
      .map((slug) => to_entry(`/equipo/${slug}`, `developers/${slug}`, "yearly", 0.6)),
  ];
}
