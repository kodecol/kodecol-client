/**
 * Genera una imagen de Open Graph (1200×630) por cada ruta indexable.
 *
 * Uso: pnpm og:images
 *
 * Por qué existe: hasta ahora todas las páginas compartían la misma
 * src/app/opengraph-image.png, así que compartir el portafolio de alguien o una
 * página de servicio en WhatsApp o LinkedIn mostraba el logo genérico. Una
 * tarjeta con el nombre y el rol reales multiplica el CTR del enlace compartido.
 *
 * La regla de nombres es la MISMA que build_og_image_path() en
 * src/shared/seo/urls.ts —  /images/og/<segmento>-<slug>.png — y las entidades
 * se leen de los mismos JSON que consume la app, así que los nombres no pueden
 * divergir de lo que declara el <meta property="og:image">.
 *
 * Determinismo: las fuentes se leen de assets/og_fonts/ (vendorizadas, OFL), no
 * del sistema. Mismo input → mismo output en cualquier máquina. Los PNG
 * generados se commitean, igual que el resto de assets derivados.
 */
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import {
  BRAND,
  escape_xml,
  make_background,
  recolor_to_white,
  root,
  trim_to_content,
  wrap_text,
  write_png,
} from "./lib/image_helpers.mjs";

const OG = { width: 1200, height: 630 };
const font_dir = resolve(root, "assets/og_fonts");
const og_dir = resolve(root, "public/images/og");

/* Las fuentes se incrustan como data URI dentro del SVG: así el rasterizador no
   depende de fontconfig ni de qué haya instalado en la máquina. */
async function load_font_face(family, file, weight) {
  const data = await readFile(resolve(font_dir, file));
  return (
    `@font-face{font-family:'${family}';font-weight:${weight};` +
    `src:url(data:font/ttf;base64,${data.toString("base64")}) format('truetype');}`
  );
}

async function read_json_dir(relative) {
  const dir = resolve(root, relative);
  const files = (await readdir(dir)).filter((name) => name.endsWith(".json")).sort();
  return Promise.all(
    files.map(async (name) => JSON.parse(await readFile(resolve(dir, name), "utf8"))),
  );
}

/* Margen izquierdo y ancho útil de la tarjeta. */
const MARGIN_X = 80;
const CONTENT_WIDTH = OG.width - MARGIN_X * 2;
/* Ancho medio de glifo respecto al tamaño de fuente, medido sobre estas dos
   familias. Basta para decidir el corte: no necesitamos métricas exactas, solo
   no desbordar. */
const SORA_RATIO = 0.62;
const POPPINS_RATIO = 0.52;

/**
 * Elige el mayor tamaño de fuente con el que el título cabe en 3 líneas.
 * Antes se partía por número fijo de caracteres y un título de 26 caracteres a
 * 72 px se salía del lienzo por la derecha.
 */
function fit_title(title) {
  for (const size of [72, 64, 56, 48, 42]) {
    const max_chars = Math.floor(CONTENT_WIDTH / (size * SORA_RATIO));
    const lines = wrap_text(title, max_chars, 3);
    if (lines.every((line) => line.length <= max_chars)) return { size, lines };
  }
  const size = 42;
  const max_chars = Math.floor(CONTENT_WIDTH / (size * SORA_RATIO));
  return { size, lines: wrap_text(title, max_chars, 3) };
}

/**
 * Tarjeta OG: eyebrow + título + bajada, sobre el gradiente de marca, con el
 * imagotipo abajo a la derecha. `accent` permite que una marca propia use su
 * color dentro de su propia tarjeta (§6 de architecture.md).
 */
function build_card_svg({ font_faces, eyebrow, title, subtitle, accent }) {
  const { size: title_size, lines: title_lines } = fit_title(title);
  const subtitle_lines = subtitle
    ? wrap_text(subtitle, Math.floor(CONTENT_WIDTH / (28 * POPPINS_RATIO)), 2)
    : [];
  const title_top = 232;

  const title_tspans = title_lines
    .map(
      (line, index) =>
        `<tspan x="${MARGIN_X}" dy="${index === 0 ? 0 : title_size * 1.14}">${escape_xml(line)}</tspan>`,
    )
    .join("");

  const subtitle_y = title_top + title_size * 1.14 * (title_lines.length - 1) + 68;
  const subtitle_tspans = subtitle_lines
    .map(
      (line, index) =>
        `<tspan x="${MARGIN_X}" dy="${index === 0 ? 0 : 38}">${escape_xml(line)}</tspan>`,
    )
    .join("");

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}">
      <style>${font_faces}</style>
      <rect x="0" y="0" width="10" height="${OG.height}" fill="${accent}"/>
      <text x="${MARGIN_X}" y="140" font-family="Poppins" font-weight="600" font-size="26"
            letter-spacing="3.6" fill="${accent}">${escape_xml(eyebrow.toUpperCase())}</text>
      <text x="${MARGIN_X}" y="${title_top}" font-family="Sora" font-weight="700"
            font-size="${title_size}" fill="${BRAND.text_primary}">${title_tspans}</text>
      <text x="${MARGIN_X}" y="${subtitle_y}" font-family="Poppins" font-weight="400"
            font-size="28" fill="${BRAND.text_secondary}">${subtitle_tspans}</text>
    </svg>`,
  );
}

async function render_card(options, logo) {
  const background = make_background(
    OG.width,
    OG.height,
    BRAND.bg,
    options.background_to ?? BRAND.green_900,
  );
  return background
    .composite([
      { input: build_card_svg(options), top: 0, left: 0 },
      { input: logo, top: OG.height - 108, left: OG.width - 300 },
    ])
    .png()
    .toBuffer();
}

async function main() {
  console.log("Generando OG images…");

  const font_faces =
    (await load_font_face("Sora", "Sora-Variable.ttf", 700)) +
    (await load_font_face("Poppins", "Poppins-Regular.ttf", 400)) +
    (await load_font_face("Poppins", "Poppins-SemiBold.ttf", 600));

  /* Imagotipo blanco reducido: firma de la tarjeta, misma pieza en todas. */
  const imagotipo = await recolor_to_white(
    await trim_to_content(resolve(root, "public/images/logo/imagotipo_color.png"))
      .resize({ width: 220 })
      .png()
      .toBuffer(),
  );
  const logo = await sharp(imagotipo).resize({ width: 220 }).png().toBuffer();

  const [services, brands, profiles] = await Promise.all([
    read_json_dir("content/services"),
    read_json_dir("content/products"),
    read_json_dir("content/developers"),
  ]);

  /* ── Índices ── */
  await write_png(
    `${og_dir}/servicios.png`,
    await render_card(
      {
        font_faces,
        eyebrow: "Lo que construimos",
        title: "Servicios de desarrollo de software",
        subtitle: "Fábrica de software en Colombia · Tecnología con propósito.",
        accent: BRAND.mint_500,
      },
      logo,
    ),
  );
  await write_png(
    `${og_dir}/equipo.png`,
    await render_card(
      {
        font_faces,
        eyebrow: "La crew",
        title: "Las personas que construyen futuro",
        subtitle: "Portafolios del equipo de Kodecol.",
        accent: BRAND.mint_500,
      },
      logo,
    ),
  );
  await write_png(
    `${og_dir}/marcas.png`,
    await render_card(
      {
        font_faces,
        eyebrow: "Marcas propias",
        title: "También construimos lo nuestro",
        subtitle: "Productos que Kodecol diseña, construye y opera.",
        accent: BRAND.mint_500,
      },
      logo,
    ),
  );

  /* ── Servicios ── */
  for (const service of services) {
    await write_png(
      `${og_dir}/servicios-${service.slug}.png`,
      await render_card(
        {
          font_faces,
          eyebrow: service.hero.eyebrow,
          title: service.name,
          subtitle: service.teaser.description,
          accent: BRAND.mint_500,
        },
        logo,
      ),
    );
  }

  /* ── Perfiles ── */
  for (const profile of profiles) {
    await write_png(
      `${og_dir}/equipo-${profile.slug}.png`,
      await render_card(
        {
          font_faces,
          eyebrow: "Equipo Kodecol",
          title: profile.full_name,
          subtitle: profile.role_badge,
          accent: BRAND.mint_500,
        },
        logo,
      ),
    );
  }

  /* ── Marcas propias: dentro de su tarjeta manda el color del producto ── */
  for (const brand of brands) {
    await write_png(
      `${og_dir}/marcas-${brand.slug}.png`,
      await render_card(
        {
          font_faces,
          eyebrow: brand.teaser.kind,
          title: brand.name,
          subtitle: brand.teaser.claim_lead
            ? `${brand.teaser.claim_lead}${brand.teaser.claim_accent ?? ""}`
            : brand.teaser.summary,
          accent: brand.theme.accent,
          background_to: brand.theme.surface_raised,
        },
        logo,
      ),
    );
  }

  console.log("Listo.");
}

main().catch((error) => {
  console.error("Falló la generación de OG images:", error);
  process.exit(1);
});
