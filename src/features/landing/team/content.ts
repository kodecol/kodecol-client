import type { TeamContent } from "./types";

/* Copy de la sección #equipo («La crew»). Ver KNOWLEDGE_BASE §9. */
export const TEAM_CONTENT = {
  eyebrow: "La crew",
  title: "La crew: las personas que construyen.",
  entry: "las personas que",
  word: "construyen.",
  members: [
    {
      slug: "cristian-velasquez",
      name: "Cristian David Velásquez",
      role: "Fundador y CTO",
      bio: "Automatización, inteligencia artificial y arquitectura cloud. Lideró la automatización de áreas completas, llevó una plataforma crítica de 25 s a menos de 1 s de carga y construye Axi Connect.",
      chips: ["Python", "Node / TS", "React", "IA", "Cloud"],
      photo_src: "/images/team/cristian_hero.png",
      photo_width: 1024,
      photo_height: 1536,
      photo_focus: { x: 0.497, head: 0.353 },
      cv_src: "/cv/cristian_velasquez_cv.pdf",
    },
    {
      slug: null,
      name: "Juan Carlos López",
      role: "CMO · Director de mercadeo",
      bio: "Dirige la marca, el posicionamiento y la generación de demanda. Traduce lo que construimos en algo que el mercado entiende, busca y compra.",
      chips: ["Estrategia de marca", "Posicionamiento", "Growth", "Analítica"],
      photo_src: "/images/team/juan_carlos_lopez_v2.png",
      photo_width: 1089,
      photo_height: 1444,
      photo_focus: { x: 0.325, head: 0.294 },
      cv_src: null,
    },
    /* Juan David Herrera — oculto temporalmente. Su JSON sigue en
       content/developers/juan.json y su entrada en el adaptador está comentada:
       descomentar ambos (y añadir su foto recortada aquí) lo devuelve a la crew. */
  ],
  profile_label: "Ver perfil completo",
  cv_label: "Hoja de vida (PDF)",
  join_lead: "¿Eres desarrollador o desarrolladora y compartes el crecimiento consciente?",
  join_emphasis: "Únete a la crew",
} as const satisfies TeamContent;
