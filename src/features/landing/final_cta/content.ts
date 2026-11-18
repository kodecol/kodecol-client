import { SITE_CONFIG } from "@/shared/config/site_config";

interface FinalCtaContent {
  title: string;
  entry: string;
  word: string;
  subtitle: string;
  primary_label: string;
  contact_line: string;
}

/* Copy del cierre (#cotizaciones). Una sola acción: WhatsApp. */
export const FINAL_CTA_CONTENT = {
  title: "¿Qué quieres construir?",
  entry: "¿qué quieres",
  word: "construir?",
  subtitle:
    "Cuéntanos el problema. Desde la primera conversación sales con claridad sobre qué hacer, aunque no sea con nosotros.",
  primary_label: "Hablemos por WhatsApp",
  contact_line: `WhatsApp +57 ${SITE_CONFIG.whatsapp_display} · Bogotá, Colombia`,
} as const satisfies FinalCtaContent;
