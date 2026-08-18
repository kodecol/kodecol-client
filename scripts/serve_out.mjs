/**
 * Sirve out/ emulando el .htaccess de producción.
 *
 * Uso: pnpm serve:out   (puerto 4321, o PORT=xxxx)
 *
 * Por qué existe: con `output: "export"` el comando `next start` no funciona, así
 * que los e2e no tenían servidor propio y solo podían correr contra uno externo
 * vía E2E_BASE_URL. Este servidor reproduce las tres reglas del .htaccess que
 * afectan a las pruebas: resolver /ruta como ruta.html, devolver 404.html con
 * status 404 real, y quitar la barra final.
 *
 * No pretende sustituir a Apache: no aplica redirecciones de host ni cabeceras.
 * Eso se verifica con curl contra el servidor real (ver README).
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "out");
const PORT = Number(process.env.PORT ?? 4321);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

const is_file = async (path) => {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
};

createServer(async (request, response) => {
  const url = decodeURIComponent(request.url.split("?")[0]);

  /* Barra final → 301 sin barra, igual que el .htaccess (evita duplicados). */
  if (url.length > 1 && url.endsWith("/")) {
    response.writeHead(301, { location: url.replace(/\/+$/, "") });
    return response.end();
  }

  const candidates = [join(OUT, url), join(OUT, `${url}.html`), join(OUT, url, "index.html")];
  for (const candidate of candidates) {
    if (await is_file(candidate)) {
      const headers = {
        "content-type": MIME[extname(candidate)] ?? "application/octet-stream",
      };
      /* Los payloads RSC (.txt) van noindex, como en el .htaccess. */
      if (extname(candidate) === ".txt" && !candidate.endsWith("robots.txt")) {
        headers["x-robots-tag"] = "noindex, nofollow";
      }
      response.writeHead(200, headers);
      return response.end(await readFile(candidate));
    }
  }

  /* Status 404 real: los e2e comprueban el código, no solo el contenido. */
  response.writeHead(404, { "content-type": MIME[".html"] });
  response.end(await readFile(join(OUT, "404.html")));
}).listen(PORT, () => console.log(`sirviendo out/ en http://localhost:${PORT}`));
