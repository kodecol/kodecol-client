/* Copy de «Cómo empezamos»: el primer paso real de cualquier proyecto
   (KNOWLEDGE_BASE §4.2). Es una secuencia de verdad, por eso va numerada. */
export interface ProcessContent {
  eyebrow: string;
  title_lead: string;
  title_accent: string;
  steps: readonly { title: string; description: string }[];
}

export const PROCESS_CONTENT = {
  eyebrow: "Cómo empezamos",
  title_lead: "Tres pasos y",
  title_accent: "ya sabes qué hacer.",
  steps: [
    { title: "Nos escribes", description: "Por WhatsApp y con tus palabras. No necesitas un brief ni saber de tecnología." },
    { title: "Diagnóstico", description: "Entendemos el proceso real, no el del manual, y priorizamos por lo que más te devuelve." },
    { title: "Propuesta clara", description: "Qué construimos, en cuánto tiempo y cuánto cuesta. El código y la documentación quedan a tu nombre." },
  ],
} as const satisfies ProcessContent;
