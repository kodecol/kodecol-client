/*
  Rutas y medios de la Biblioteca. Las rutas de los medios se derivan del slug,
  igual que las imágenes OG: un campo más en el JSON sería otra fuente de
  divergencia. Los archivos viven en public/biblioteca/guias/<slug>/.

  OJO: /biblioteca/guias/<slug> es el enlace que se manda por mensaje directo.
  Cambiar estas rutas rompe enlaces ya enviados.
*/

export const LIBRARY_PATH = "/biblioteca";
export const GUIDES_PATH = "/biblioteca/guias";

export const build_guide_path = (slug: string) => `${GUIDES_PATH}/${slug}`;

export interface GuideMedia {
  result_video: string;
  result_poster: string;
  result_preview: string;
  published_video: string;
  published_poster: string;
  published_preview: string;
  cover_3x4: { jpg: string; webp: string };
  cover_9x16: { jpg: string; webp: string };
  claude_file: string;
  claude_file_name: string;
}

export function get_guide_media(slug: string): GuideMedia {
  const base = `${GUIDES_PATH}/${slug}`;
  return {
    result_video: `${base}/resultado.mp4`,
    result_poster: `${base}/resultado.jpg`,
    result_preview: `${base}/avance.mp4`,
    published_video: `${base}/publicado.mp4`,
    published_poster: `${base}/publicado.jpg`,
    published_preview: `${base}/avance-publicado.mp4`,
    cover_3x4: { jpg: `${base}/portada-3x4.jpg`, webp: `${base}/portada-3x4.webp` },
    cover_9x16: { jpg: `${base}/portada-9x16.jpg`, webp: `${base}/portada-9x16.webp` },
    claude_file: `${base}/${slug}.claude.md`,
    claude_file_name: `${slug}.claude.md`,
  };
}

const loop = (name: string) => ({
  wide: { video: `/biblioteca/fondos/${name}-escritorio.mp4`, poster: `/biblioteca/fondos/${name}-escritorio.jpg` },
  tall: { video: `/biblioteca/fondos/${name}-celular.mp4`, poster: `/biblioteca/fondos/${name}-celular.jpg` },
});

/** Bucles cinematográficos de la pradera al crepúsculo (motion-kodecol, 7 nov. 2026). */
export const LIBRARY_BACKDROPS = {
  hero: loop("hero"),
  guides: loop("guias"),
  closing: loop("cierre"),
  guides_folder: "/biblioteca/fondos/carpeta-guias.jpg",
  /** El CRT beige de frente, recortado al monitor; la pantalla va en library.css. */
  crt_monitor: { webp: "/biblioteca/fondos/crt-monitor.webp", png: "/biblioteca/fondos/crt-monitor.png" },
} as const;

/** 64 → «1:04», el formato de duración de cualquier reproductor. */
export function format_duration(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

const MONTHS = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic."];

/** «2026-11-06» → «6 nov. 2026», sin depender de la zona horaria del build. */
export function format_guide_date(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
