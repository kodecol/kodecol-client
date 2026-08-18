import type { Metadata, Viewport } from "next";
import { Poppins, Sora } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/shared/analytics/google_analytics";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { SkipLink } from "@/shared/ui/skip_link";
import { WhatsappFloat } from "@/shared/ui/whatsapp_float";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.base_url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s · ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  openGraph: {
    siteName: SITE_CONFIG.name,
    locale: "es_CO",
    type: "website",
  },
  /* La imagen la aporta src/app/opengraph-image.png (convención de archivo de Next).
     Las páginas que tienen OG propia la sustituyen vía build_page_metadata(). */
  twitter: {
    card: "summary_large_image",
  },
  /* Plan B de Search Console: lo normal es verificar el dominio por DNS TXT. */
  verification: SITE_CONFIG.analytics.google_site_verification
    ? { google: SITE_CONFIG.analytics.google_site_verification }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* Tiñe la barra del navegador con el fondo de marca.
     El hex va literal porque es metadata del documento, no estilo de un
     componente: aquí no hay clase de Tailwind que valga. Es el valor de
     --color-bg y debe moverse con él (docs/DESIGN-SYSTEM.md). */
  themeColor: "#04110f",
  /* El sitio es dark-only: evita el flash claro de los controles nativos. */
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${sora.variable} ${poppins.variable} antialiased`}>
        <SkipLink />
        {children}
        <WhatsappFloat />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
