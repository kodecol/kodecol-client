import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/shared/config/site_config";

/* Se generan en build: obligatorio para la exportación estática (output: "export"). */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /*
          Next emite los payloads RSC como .txt junto a cada .html (out/index.txt
          pesa 58 KB y trae el mismo copy). Son contenido duplicado indexable.
          Aquí se evita el rastreo; la protección real es el X-Robots-Tag del
          .htaccess, porque robots.txt no impide que se indexen por enlaces.
        */
        disallow: ["/*.txt$"],
      },
      /*
        Crawlers de IA permitidos a propósito: para una fábrica de software,
        que un asistente cite a Kodecol es distribución, no fuga. Se listan
        explícitos para que la decisión quede escrita y sea trivial revertirla.
      */
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: "/",
      },
    ],
    sitemap: `${SITE_CONFIG.base_url}/sitemap.xml`,
    host: SITE_CONFIG.base_url,
  };
}
