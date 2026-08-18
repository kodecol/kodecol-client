import Script from "next/script";
import { SITE_CONFIG } from "@/shared/config/site_config";

/**
 * Google Analytics 4 vía gtag.js.
 *
 * Server component: `next/script` no necesita "use client", así que no arrastra
 * ningún boundary de cliente nuevo al layout (§5 de architecture.md).
 *
 * `afterInteractive`: el script se pide DESPUÉS de la hidratación, así que no
 * compite con el LCP. `lazyOnload` sería aún más suave para el INP pero pierde
 * los eventos de los primeros segundos; es cambiar una línea si el CWV lo pide.
 *
 * Las navegaciones de cliente del App Router las cubre la medición mejorada de
 * GA4, que escucha los cambios de History API: no hace falta un listener propio.
 */
export function GoogleAnalytics() {
  const id = SITE_CONFIG.analytics.ga_measurement_id;
  /* Sin ID no se emite nada: dev y previews quedan limpios de terceros. */
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
