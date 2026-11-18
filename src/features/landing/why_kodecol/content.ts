import type { WhyKodecolContent } from "./types";

/*
  Sección #nosotros, en atmósfera Espacio: el SOUL de Kodecol (KNOWLEDGE_BASE §6)
  conectado con el concepto Raíz y circuito (§7): naturaleza, cosmos y máquina
  funcionan igual.
*/
export const WHY_KODECOL_CONTENT = {
  eyebrow: "Raíz y circuito",
  title_lead: "Pensamos a escala de universo.",
  title_accent: "Construimos a escala de tu empresa.",
  subtitle:
    "El bosque, el cielo y una buena máquina funcionan igual: cada pieza cumple una función y nada sobra. Así hacemos software, para que dure y para que crezca sin destruir lo que lo rodea.",
  differentiators: [
    { title: "Tecnología con propósito", description: "Si no resuelve un problema real, no se construye." },
    { title: "Automatización consciente", description: "Liberar a las personas, no reemplazarlas." },
    { title: "Calidad que se siente", description: "Rápido en gama baja, accesible, medible." },
    { title: "Aliado, no proveedor", description: "Tu resultado es nuestro objetivo." },
  ],
} as const satisfies WhyKodecolContent;
