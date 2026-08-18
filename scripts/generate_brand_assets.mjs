/**
 * Genera los assets derivados de marca a partir de los originales de public/images/logo/.
 *
 * Uso: pnpm brand:assets
 *
 * Por qué existe: los originales vienen con ~20 % de área de protección baked y a 3840×3840.
 * Servirlos así deja el isotipo diminuto dentro de su caja y descuadra la alineación óptica
 * con el wordmark. Aquí se recortan al contenido real y se generan las variantes que el sitio
 * consume; el aire alrededor del logo se controla desde CSS (docs/DESIGN-SYSTEM.md §6.9).
 *
 * Es determinista: mismo input → mismo output. Los archivos generados se commitean.
 * Los helpers viven en scripts/lib/image_helpers.mjs, compartidos con el generador
 * de OG images (scripts/generate_og_images.mjs).
 */
import { resolve } from "node:path";
import sharp from "sharp";
import {
  BRAND,
  make_background,
  recolor_to_white,
  root,
  trim_to_content,
  write_png,
} from "./lib/image_helpers.mjs";

const logo_dir = resolve(root, "public/images/logo");
const app_dir = resolve(root, "src/app");
const icons_dir = resolve(root, "public/images/icons");

async function main() {
  console.log("Generando assets de marca…");

  /* ── Isotipo claro recortado: navbar, footer, top bar, 404, placeholders ── */
  const isotipo_white = await trim_to_content(`${logo_dir}/isotipo-white.png`)
    .resize({ height: 534 })
    .png()
    .toBuffer();
  await write_png(`${logo_dir}/isotipo-white-trim.png`, isotipo_white);

  /* ── Render 3D recortado: tarjeta focal del hero (resolución nativa) ── */
  const isotipo_3d = await trim_to_content(`${logo_dir}/isotipo-3d.png`)
    .png()
    .toBuffer();
  await write_png(`${logo_dir}/isotipo-3d-trim.png`, isotipo_3d);

  /* ── Imagotipo en blanco: piezas sobre fondo oscuro (OG images, footer) ── */
  const imagotipo_trimmed = await trim_to_content(
    `${logo_dir}/imagotipo_color.png`,
  )
    .resize({ width: 960 })
    .png()
    .toBuffer();
  const imagotipo_white = await recolor_to_white(imagotipo_trimmed);
  await write_png(`${logo_dir}/imagotipo-white.png`, imagotipo_white);

  /* ── OG image por defecto del home (convención de archivo de Next) ── */
  const og_logo = await sharp(imagotipo_white).resize({ width: 640 }).toBuffer();
  const og = await make_background(1200, 630, BRAND.bg, BRAND.green_900)
    .composite([{ input: og_logo, gravity: "center" }])
    .png()
    .toBuffer();
  await write_png(`${app_dir}/opengraph-image.png`, og);

  /* ── Apple touch icon: isotipo claro sobre el verde de marca ── */
  const apple_logo = await sharp(isotipo_white)
    .resize({ height: 108 })
    .toBuffer();
  const apple = await make_background(180, 180, BRAND.green_600, BRAND.green_600)
    .composite([{ input: apple_logo, gravity: "center" }])
    .png()
    .toBuffer();
  await write_png(`${app_dir}/apple-icon.png`, apple);

  /* ── Iconos del manifest (src/app/manifest.ts) ──
     El maskable lleva el isotipo al 60 % del lienzo: Android recorta hasta un
     20 % por lado y con menos aire el logo saldría mordido. */
  for (const [size, ratio, name] of [
    [192, 0.6, "icon-192.png"],
    [512, 0.6, "icon-512.png"],
    [512, 0.48, "icon-512-maskable.png"],
  ]) {
    const mark = await sharp(isotipo_white)
      .resize({ height: Math.round(size * ratio) })
      .toBuffer();
    const icon = await make_background(size, size, BRAND.green_600, BRAND.green_600)
      .composite([{ input: mark, gravity: "center" }])
      .png()
      .toBuffer();
    await write_png(`${icons_dir}/${name}`, icon);
  }

  console.log("Listo.");
}

main().catch((error) => {
  console.error("Falló la generación de assets:", error);
  process.exit(1);
});
