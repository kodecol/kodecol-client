import { statSync } from "node:fs";
import { resolve } from "node:path";

/*
  Fecha de última modificación real de cada JSON de contenido, para el <lastmod>
  del sitemap.

  IMPORTANTE: este módulo usa node:fs y solo debe importarse desde
  src/app/sitemap.ts, que se ejecuta en build. Si lo importa un componente,
  node:fs acaba en el bundle de cliente y rompe la compilación.

  Vive en el adaptador porque es quien conoce la fuente de datos: el día que el
  contenido venga de un CMS, la fecha saldrá de su API y nada más cambia.

  Si el archivo no está (checkout parcial, despliegue raro) devuelve null y el
  sitemap omite lastmod. Mejor sin dato que con una fecha inventada: un <lastmod>
  que miente hace que Google deje de fiarse del sitemap entero.

  Nota conocida: el mtime no sobrevive a un `git clone` limpio, así que en CI
  todas las entradas quedarían con la fecha del checkout. Con el flujo actual
  (build local + subida por cPanel) el dato es correcto. Si algún día se
  construye en CI, la alternativa es un prebuild que lea `git log -1 --format=%cI`
  por archivo y escriba un content/.lastmod.json commiteado.
*/

const CONTENT_PATHS: Readonly<Record<string, string>> = {
  "developers/cristian-velasquez": "content/developers/cristian.json",
  "developers/juan": "content/developers/juan.json",
  "products/axi-connect": "content/products/axi_connect.json",
  "services/automatizacion-de-procesos":
    "content/services/automatizacion_de_procesos.json",
  "services/inteligencia-artificial-a-la-medida":
    "content/services/inteligencia_artificial_a_la_medida.json",
  "services/desarrollo-web": "content/services/desarrollo_web.json",
  "services/aplicaciones-moviles": "content/services/aplicaciones_moviles.json",
  "services/aplicaciones-de-escritorio":
    "content/services/aplicaciones_de_escritorio.json",
  "services/software-a-la-medida": "content/services/software_a_la_medida.json",
  "biblioteca/guias/presione-uno": "content/biblioteca/guias/presione_uno.json",
  "biblioteca/guias/misma-cuadra": "content/biblioteca/guias/misma_cuadra.json",
  "biblioteca/guias/el-mismo-dia": "content/biblioteca/guias/el_mismo_dia.json",
};

export function get_content_last_modified(key: string): Date | null {
  const relative = CONTENT_PATHS[key];
  if (!relative) return null;
  try {
    return statSync(resolve(process.cwd(), relative)).mtime;
  } catch {
    return null;
  }
}

/** Fecha del contenido más reciente: sirve de lastmod para el home y los índices. */
export function get_latest_content_date(): Date | null {
  const dates = Object.keys(CONTENT_PATHS)
    .map((key) => get_content_last_modified(key))
    .filter((date): date is Date => date !== null);
  if (dates.length === 0) return null;
  return dates.reduce((latest, date) => (date > latest ? date : latest));
}
