import type { TeamContent } from "./types";

/* Copy fiel al mockup (sección #equipo, "LA CREW"). */
export const TEAM_CONTENT = {
  eyebrow: "La crew",
  title: "Las personas que construyen futuro.",
  subtitle:
    "Detrás de cada solución hay un equipo humano: quienes construyen el producto y quienes lo llevan al mercado.",
  members: [
    {
      slug: "cristian-velasquez",
      name: "Cristian David Velásquez",
      role: "Fundador y CTO",
      bio: "Automatización, IA y arquitectura cloud. 4+ años construyendo sistemas que importan.",
      chips: ["Python", "Node / TS", "React", "IA", "Cloud"],
      photo_src: "/images/team/cristian_hero.png",
    },
    {
      slug: null,
      name: "Juan Carlos López",
      role: "CMO · Director de mercadeo",
      bio: "Dirige la marca, el posicionamiento y la generación de demanda. Traduce lo que construimos en algo que el mercado entiende, busca y compra.",
      chips: [
        "Estrategia de marca",
        "Posicionamiento",
        "Growth",
        "Analítica",
      ],
      photo_src: "/images/team/juan_carlos_lopez_v2.png",
    },
    /* Juan David Herrera — oculto temporalmente. Su JSON sigue en
       content/developers/juan.json y su entrada en el adaptador está comentada
       igual: descomentar ambos lo devuelve a la crew y a /equipo/juan. */
    // {
    //   slug: "juan",
    //   name: "Juan David Herrera",
    //   role: "Desarrollador Web · Front-End",
    //   bio: "Front-end con Angular y back-end robusto. Scrum Master certificado, enfocado en la mejora continua.",
    //   chips: ["Angular", "Laravel", "PHP", "Node", "SQL"],
    //   photo_src: null,
    // },
  ],
  join_lead: "¿Eres desarrollador/a y compartes el crecimiento consciente? ",
  join_emphasis: "Únete a la crew →",
} as const satisfies TeamContent;
