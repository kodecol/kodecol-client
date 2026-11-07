/**
 * Secciones de la Biblioteca. Hoy solo Guías; las que vengan (prompts,
 * plantillas…) se agregan aquí y aparecen en la portada cuando tengan contenido.
 */
export interface LibrarySection {
  slug: string;
  title: string;
  description: string;
  href: string;
  folder_image: string;
}

export const LIBRARY_SECTIONS: readonly LibrarySection[] = [
  {
    slug: "guias",
    title: "Guías",
    description:
      "El prompt, el paso a paso, de dónde salió cada voz y cada sonido, y un archivo para que Claude lo haga contigo.",
    href: "/biblioteca/guias",
    folder_image: "/biblioteca/fondos/carpeta-guias.jpg",
  },
];
