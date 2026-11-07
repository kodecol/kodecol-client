/**
 * Imágenes de vista previa (1200×630) de la Biblioteca.
 *
 * Uso: pnpm og:biblioteca   (necesita el Chromium de Playwright: pnpm exec playwright install chromium)
 *
 * Es lo primero que ve la persona en el chat cuando le llega el enlace por
 * mensaje directo o por WhatsApp, así que lleva la portada real del reel (la
 * misma del muro de Instagram) y no la tarjeta genérica del sitio.
 *
 * Se dibuja con Chromium y no con sharp/librsvg porque librsvg ignora los
 * @font-face incrustados y cae a DejaVu (le pasa también a generate_og_images.mjs).
 *
 * Misma regla de nombres que build_og_image_path(): /images/og/biblioteca-guias-<slug>.png.
 */
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { escape_xml, root, write_png } from "./lib/image_helpers.mjs";

const OG = { width: 1200, height: 630 };
const og_dir = resolve(root, "public/images/og");
const LEVELS = { principiante: "Principiante", intermedio: "Intermedio", avanzado: "Avanzado" };
const file_url = (relative) => pathToFileURL(resolve(root, relative)).href;

function with_keyword(text, keyword) {
  const at = keyword ? text.lastIndexOf(keyword) : -1;
  if (at < 0) return escape_xml(text);
  return `${escape_xml(text.slice(0, at))}<em>${escape_xml(keyword)}</em>${escape_xml(text.slice(at + keyword.length))}`;
}

function card_html({ image, eyebrow, name, rest, keyword, meta }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face{font-family:Sora;font-weight:100 800;src:url(${file_url("assets/og_fonts/Sora-Variable.ttf")})}
    @font-face{font-family:Poppins;font-weight:400;src:url(${file_url("assets/og_fonts/Poppins-Regular.ttf")})}
    @font-face{font-family:Poppins;font-weight:600;src:url(${file_url("assets/og_fonts/Poppins-SemiBold.ttf")})}
    *{margin:0;box-sizing:border-box}
    body{width:${OG.width}px;height:${OG.height}px;background:#04110f;color:#f6f2e8;font-family:Poppins;position:relative;overflow:hidden}
    .img{position:absolute;right:0;top:0;width:470px;height:100%;background:url(${image}) center/cover}
    .img::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#04110f 0%,rgba(4,17,15,.35) 32%,transparent 60%),radial-gradient(120% 90% at 60% 50%,transparent 55%,rgba(2,10,8,.6))}
    .glow{position:absolute;left:-200px;top:-200px;width:900px;height:900px;background:radial-gradient(closest-side,rgba(0,115,92,.22),transparent)}
    .txt{position:absolute;left:80px;top:96px;width:620px;display:flex;flex-direction:column;gap:22px}
    .eb{font-weight:600;font-size:19px;letter-spacing:.2em;text-transform:uppercase;color:#e6dcc4;display:flex;align-items:center;gap:14px}
    .eb::before{content:"";width:34px;height:2px;background:#e6dcc4}
    h1{font-family:Sora;font-weight:600;font-size:${name.length > 14 ? 84 : 100}px;line-height:.98;letter-spacing:-.04em}
    h2{font-family:Sora;font-weight:600;font-size:44px;line-height:1.08;letter-spacing:-.03em;max-width:600px}
    em{font-style:normal;color:#34e0a1}
    .meta{position:absolute;left:80px;bottom:112px;font-size:23px;color:rgba(246,242,232,.72)}
    .logo{position:absolute;left:80px;bottom:52px;height:34px}
  </style></head><body>
    <div class="glow"></div><div class="img"></div>
    <div class="txt"><p class="eb">${escape_xml(eyebrow)}</p><h1>${escape_xml(name)}</h1>${rest ? `<h2>${with_keyword(rest, keyword)}</h2>` : ""}</div>
    <p class="meta">${escape_xml(meta)}</p>
    <img class="logo" src="${file_url("public/images/logo/imagotipo-white.png")}">
  </body></html>`;
}

async function main() {
  const dir = resolve(root, "content/biblioteca/guias");
  const guides = await Promise.all(
    (await readdir(dir)).filter((f) => f.endsWith(".json")).map(async (f) => JSON.parse(await readFile(resolve(dir, f), "utf8"))),
  );

  const cards = [
    {
      out: "biblioteca.png",
      image: file_url("public/biblioteca/fondos/hero-escritorio.jpg"),
      eyebrow: "Kodecol",
      name: "Biblioteca",
      rest: "Construye con IA.",
      keyword: "IA",
      meta: "Guías, prompts y recursos · Gratis y sin registro",
    },
    {
      out: "biblioteca-guias.png",
      image: file_url("public/biblioteca/fondos/guias-escritorio.jpg"),
      eyebrow: "Biblioteca Kodecol",
      name: "Guías",
      rest: "para crear con IA",
      keyword: "IA",
      meta: "Los prompts reales detrás de nuestros videos",
    },
    ...guides.map((guide) => {
      const [name, ...rest] = guide.title.split(":");
      return {
        out: `biblioteca-guias-${guide.slug}.png`,
        image: file_url(`public/biblioteca/guias/${guide.slug}/portada-9x16.jpg`),
        eyebrow: "Biblioteca Kodecol · Guía",
        name,
        rest: rest.join(":").trim(),
        keyword: guide.title_keyword,
        meta: `Hecho con ${guide.made_with[0]} · ${LEVELS[guide.level]} · ${guide.duration}`,
      };
    }),
  ];

  /* Se abre como archivo (no con setContent): una página about:blank no puede
     cargar fuentes ni imágenes file://. */
  const work = await mkdtemp(resolve(tmpdir(), "og-biblioteca-"));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: OG, deviceScaleFactor: 1 });
  for (const card of cards) {
    const html = resolve(work, "card.html");
    await writeFile(html, card_html(card));
    await page.goto(pathToFileURL(html).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await write_png(`${og_dir}/${card.out}`, await page.screenshot({ type: "png" }));
  }
  await browser.close();
  await rm(work, { recursive: true, force: true });
  console.log(`OG de la Biblioteca: ${cards.length} imágenes`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
