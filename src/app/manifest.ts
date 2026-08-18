import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/shared/config/site_config";

/* Se genera en build: obligatorio para la exportación estática (output: "export"). */
export const dynamic = "force-static";

/*
  El manifest no aporta posicionamiento. Aporta que "añadir a pantalla de inicio"
  en Android use el icono y el color correctos, y calla los avisos de Lighthouse.

  `display: "browser"` es deliberado: esto no es una PWA (no hay service worker
  ni funcionamiento sin conexión) y prometer instalabilidad sería mentir.

  Los hex van literales porque el manifest es un JSON estático, no un componente:
  son los valores de --color-bg y deben moverse con él (docs/DESIGN-SYSTEM.md).
*/
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.title,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "browser",
    background_color: "#04110f",
    theme_color: "#04110f",
    lang: "es-CO",
    icons: [
      { src: "/images/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      {
        src: "/images/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
