/**
 * Genera variantes AVIF y WebP (1x y 2x) de las imágenes de contenido pesadas.
 *
 * Uso: pnpm images:variants
 *
 * Por qué existe: next.config.ts tiene `images: { unoptimized: true }`, obligado
 * por `output: "export"`. En ese modo next/image NO genera srcset ni convierte
 * formatos: sirve el archivo original tal cual, a resolución nativa. La foto del
 * portafolio son 1024×1536 y 1,9 MB pintados a 340×400 — es el LCP de la página.
 *
 * Aquí se precalculan las variantes en build de assets y shared/ui/static_picture
 * las cablea en un <picture>. Es el equivalente estático del optimizador de Next.
 *
 * Determinista: mismo input → mismo output. Los archivos generados se commitean.
 */
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import { root, write_png } from "./lib/image_helpers.mjs";

/*
  Cada entrada declara el ancho al que se PINTA la imagen (1x). El 2x se calcula
  solo. Si cambias el tamaño de presentación en el componente, actualízalo aquí:
  generar más píxeles de los que se ven es exactamente el problema que esto
  resuelve.
*/
const FIXED_SOURCES = [
  { path: "public/images/logo/isotipo-3d-trim.png", width: 382 },
  { path: "public/images/products/axi-connect/isotype.png", width: 400 },
  { path: "public/images/products/axi-connect/wordmark.png", width: 660 },
];

/*
  Las fotos del equipo NO se listan a mano: se leen de los JSON de contenido.
  StaticPicture asume que existen las variantes, y si faltasen el navegador no
  cae al PNG — se quedaría con la imagen rota. Derivarlas del contenido mantiene
  la promesa de "añadir un desarrollador = un JSON + su foto" (README), siempre
  que se corra `pnpm assets` después.
*/
async function read_profile_photos() {
  const dir = resolve(root, "content/developers");
  const files = (await readdir(dir)).filter((name) => name.endsWith(".json")).sort();
  const photos = [];
  for (const file of files) {
    const profile = JSON.parse(await readFile(resolve(dir, file), "utf8"));
    if (!profile.photo_src) continue;
    /* 460 px es el ancho mayor al que se pinta (tarjeta del equipo en la landing). */
    photos.push({ path: `public${profile.photo_src}`, width: 460 });
  }
  return photos;
}

const QUALITY = { avif: 55, webp: 78 };

async function main() {
  console.log("Generando variantes de imagen…");

  const sources = [...FIXED_SOURCES, ...(await read_profile_photos())];

  for (const source of sources) {
    const absolute = resolve(root, source.path);
    const base = absolute.replace(/\.(png|jpe?g)$/i, "");
    const { width: natural } = await sharp(absolute).metadata();

    for (const [suffix, factor] of [
      ["", 1],
      ["@2x", 2],
    ]) {
      const target = Math.min(source.width * factor, natural);
      const resized = sharp(absolute).resize({ width: target, withoutEnlargement: true });

      await write_png(
        `${base}${suffix}.avif`,
        await resized.clone().avif({ quality: QUALITY.avif }).toBuffer(),
      );
      await write_png(
        `${base}${suffix}.webp`,
        await resized.clone().webp({ quality: QUALITY.webp }).toBuffer(),
      );
    }
  }

  console.log("Listo.");
}

main().catch((error) => {
  console.error("Falló la generación de variantes:", error);
  process.exit(1);
});
