import type { ProjectsContent } from "./types";

/* Copy de la sección #proyectos de la landing. Los proyectos vienen de content/projects/. */
export const PROJECTS_CONTENT = {
  eyebrow: "Proyectos",
  title_lead: "Lo que ya construimos,",
  title_accent: "funcionando hoy.",
  description:
    "Una tienda de lujo, un estudio de música y un taller de rotulación en California. Tres negocios distintos, el mismo criterio: que la página venda.",
  card_link_label: "Ver el proyecto",
  all_label: "Ver todos los proyectos",
} as const satisfies ProjectsContent;
