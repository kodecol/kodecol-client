import { SITE_CONFIG } from "@/shared/config/site_config";

/**
 * URL canónica absoluta.
 *
 * Regla única: NINGUNA ruta lleva barra final, ni siquiera la raíz. No es un
 * capricho — Next normaliza así el `<link rel="canonical">` (con
 * `trailingSlash: false`), y si el sitemap escribiera `https://kodecol.com/`
 * mientras el canonical dice `https://kodecol.com`, los dos documentos estarían
 * declarando cosas distintas sobre la misma página.
 *
 * El canonical, el `og:url`, el `<loc>` del sitemap y los `@id` del JSON-LD
 * salen todos de aquí, así que no pueden divergir.
 */
export function build_absolute_url(path: string): string {
  if (path.startsWith("http")) return path;
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  return clean === "" ? SITE_CONFIG.base_url : `${SITE_CONFIG.base_url}/${clean}`;
}

/**
 * Ruta de la imagen de Open Graph de una página: `/images/og/equipo-juan.png`.
 *
 * La ruta NO se guarda en los JSON de contenido: se deriva del slug con esta
 * función, y `scripts/generate_og_images.mjs` aplica la misma regla al escribir
 * los archivos. Un campo más en el JSON sería una fuente de divergencia.
 */
export function build_og_image_path(segments: readonly string[]): string {
  return `/images/og/${segments.join("-")}.png`;
}
