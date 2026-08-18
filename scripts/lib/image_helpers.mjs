/**
 * Helpers de imagen compartidos por los scripts de assets.
 *
 * Se extrajeron de generate_brand_assets.mjs cuando apareció el generador de OG
 * images: los dos necesitan el mismo recorte, el mismo recoloreado y los mismos
 * tokens de marca, y duplicarlos garantizaba que se separaran con el tiempo.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/* Tokens de marca (espejo de @theme en src/app/globals.css). */
export const BRAND = {
  bg: "#04110f",
  green_900: "#013a3b",
  green_600: "#00735c",
  mint_500: "#34e0a1",
  text_primary: "#f2f7f5",
  text_secondary: "#9fb8b0",
};

export const write_png = async (path, buffer) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, buffer);
  const { width, height } = await sharp(buffer).metadata();
  console.log(`  ✓ ${path.replace(`${root}/`, "")} — ${width}×${height}`);
};

/** Recorta el PNG a su contenido real (descarta el padding transparente). */
export const trim_to_content = (path) => sharp(path).trim({ threshold: 1 });

/**
 * Recolorea un PNG a blanco puro usando su canal alfa como máscara.
 * Sirve para llevar el imagotipo (verde oscuro) a fondos oscuros sin rehacer el arte.
 */
export const recolor_to_white = async (buffer) => {
  const { width, height } = await sharp(buffer).metadata();
  const alpha = await sharp(buffer).ensureAlpha().extractChannel(3).toBuffer();
  const white = await sharp({
    create: { width, height, channels: 3, background: "#ffffff" },
  })
    .png()
    .toBuffer();
  return sharp(white).joinChannel(alpha).png().toBuffer();
};

/** Lienzo sólido o con gradiente diagonal, renderizado vía SVG. */
export const make_background = (width, height, from, to) => {
  const svg =
    from === to
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
        `<rect width="${width}" height="${height}" fill="${from}"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
        `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
        `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
        `</linearGradient></defs>` +
        `<rect width="${width}" height="${height}" fill="url(#g)"/></svg>`;
  return sharp(Buffer.from(svg));
};

/** Escapa texto para incrustarlo en un SVG sin romper el marcado. */
export const escape_xml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Parte un texto en líneas que quepan en `max_chars`, sin cortar palabras.
 * Aproximación por número de caracteres: suficiente porque las tarjetas OG
 * tienen holgura y el tamaño de fuente se ajusta al número de líneas.
 */
export const wrap_text = (text, max_chars, max_lines) => {
  const lines = [];
  let current = "";
  for (const word of text.split(/\s+/)) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > max_chars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  if (lines.length <= max_lines) return lines;
  /* Recorta y marca con puntos suspensivos: mejor eso que desbordar la tarjeta. */
  const kept = lines.slice(0, max_lines);
  kept[max_lines - 1] = `${kept[max_lines - 1].replace(/[.,;:]$/, "")}…`;
  return kept;
};
