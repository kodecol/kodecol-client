/**
 * Escribe out/.htaccess a partir de public/.htaccess y le agrega los enlaces cortos de la Biblioteca.
 *
 * Uso: lo corre `pnpm deploy:build` después de `next build`.
 *
 * Por qué existe: cada guía tiene un enlace corto de marca para mandarlo por Instagram,
 * kodecol.co/g/<slug>, que salta de una vez (un solo 301) a la guía con las utm de su pieza:
 *   /g/misma-cuadra → /biblioteca/guias/misma-cuadra?utm_source=instagram&utm_medium=dm&utm_campaign=k19
 * La campaña sale del campo `piece` del JSON (K-19 → k19), así que una guía nueva trae su enlace corto
 * sin tocar el .htaccess. /g sola lleva a la sección de guías.
 *
 * Las reglas van en el hueco «enlaces-cortos» del .htaccess, antes de las reglas de la barra final,
 * para que /g/<slug>/ también salte directo, sin cadenas de redirecciones.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { root } from "./lib/image_helpers.mjs";

const SITE = "https://kodecol.co";
const MARK = "# @enlaces-cortos";
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

async function main() {
  const source = await readFile(resolve(root, "public/.htaccess"), "utf8");
  if (!source.includes(MARK)) throw new Error(`public/.htaccess no tiene la marca «${MARK}».`);

  const dir = resolve(root, "content/biblioteca/guias");
  const guides = await Promise.all(
    (await readdir(dir))
      .filter((f) => f.endsWith(".json"))
      .sort()
      .map(async (f) => JSON.parse(await readFile(resolve(dir, f), "utf8"))),
  );

  const lines = [
    "# Generado por scripts/build_htaccess.mjs desde content/biblioteca/guias (no editar en out/).",
    `RewriteRule ^g/?$ ${SITE}/biblioteca/guias [R=301,L]`,
  ];
  for (const guide of guides) {
    if (!SLUG_RE.test(guide.slug)) throw new Error(`Slug inválido para un enlace corto: ${guide.slug}`);
    const campaign = String(guide.piece).toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!campaign) throw new Error(`La guía ${guide.slug} no tiene pieza (campo piece) para la campaña.`);
    const target = `${SITE}/biblioteca/guias/${guide.slug}?utm_source=instagram&utm_medium=dm&utm_campaign=${campaign}`;
    lines.push(`RewriteRule ^g/${guide.slug}/?$ ${target} [R=301,L,NE]`);
  }

  const out = source.replace(MARK, lines.join("\n"));
  await writeFile(resolve(root, "out/.htaccess"), out);
  console.log(`out/.htaccess: ${guides.length} enlaces cortos (/g/<slug>)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
