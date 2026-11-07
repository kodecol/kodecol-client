import { expect, test } from "@playwright/test";

/*
  Contrato de SEO técnico.

  Cada aserción corresponde a un hueco real detectado en la auditoría del sitio.
  Importa que exista este spec porque un fallo de SEO es silencioso: la página se
  ve perfecta y aun así pierde posicionamiento. Aquí sí falla ruidosamente.

  Requiere el sitio EXPORTADO y servido (pnpm build && pnpm serve:out), que es lo
  que hace el webServer de playwright.config.ts: `next dev` no sirve el HTML
  final ni devuelve el 404 con su código de estado.
*/

const BASE = "https://kodecol.co";

interface SeoRoute {
  path: string;
  og_type: string;
  /** @type que DEBEN aparecer en el @graph de la página. */
  expected_types: readonly string[];
}

const SERVICE_SLUGS = [
  "automatizacion-de-procesos",
  "inteligencia-artificial-a-la-medida",
  "desarrollo-web",
  "aplicaciones-moviles",
  "aplicaciones-de-escritorio",
  "software-a-la-medida",
];

const ROUTES: readonly SeoRoute[] = [
  { path: "/", og_type: "website", expected_types: ["Organization", "WebSite", "WebPage"] },
  {
    path: "/servicios",
    og_type: "website",
    expected_types: ["Organization", "WebSite", "CollectionPage", "BreadcrumbList", "ItemList"],
  },
  {
    path: "/marcas",
    og_type: "website",
    expected_types: ["Organization", "WebSite", "CollectionPage", "BreadcrumbList", "ItemList"],
  },
  {
    path: "/equipo",
    og_type: "website",
    expected_types: ["Organization", "WebSite", "CollectionPage", "BreadcrumbList", "ItemList"],
  },
  {
    path: "/marcas/axi-connect",
    og_type: "website",
    expected_types: ["Organization", "WebSite", "WebPage", "BreadcrumbList", "SoftwareApplication"],
  },
  {
    path: "/equipo/cristian-velasquez",
    /* Una persona no es un sitio web. */
    og_type: "profile",
    expected_types: ["Organization", "WebSite", "ProfilePage", "BreadcrumbList", "Person"],
  },
  { path: "/equipo/juan", og_type: "profile", expected_types: ["ProfilePage", "Person"] },
  ...SERVICE_SLUGS.map((slug) => ({
    path: `/servicios/${slug}`,
    og_type: "website",
    expected_types: [
      "Organization",
      "WebSite",
      "WebPage",
      "BreadcrumbList",
      "Service",
      "FAQPage",
    ],
  })),
];

const canonical_of = (path: string) => (path === "/" ? BASE : `${BASE}${path}`);

const meta_content = (page: import("@playwright/test").Page, property: string) =>
  page.locator(`meta[property="${property}"]`).getAttribute("content");

/**
 * Recorre el grafo entero: un objeto con `@id` y algo más es una DEFINICIÓN de
 * nodo; con `@id` a secas es una REFERENCIA. Las definiciones pueden estar
 * anidadas (el logo vive dentro de Organization), así que no basta con mirar el
 * primer nivel de `@graph`.
 */
function collect_ids(value: unknown, defs: Set<string>, refs: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) collect_ids(item, defs, refs);
    return;
  }
  if (value && typeof value === "object") {
    const node = value as Record<string, unknown>;
    const id = node["@id"];
    if (typeof id === "string") {
      (Object.keys(node).length > 1 ? defs : refs).add(id);
    }
    for (const entry of Object.values(node)) collect_ids(entry, defs, refs);
  }
}

test.describe("SEO técnico", () => {
  for (const route of ROUTES) {
    test(`${route.path}: canonical único y exacto`, async ({ page }) => {
      await page.goto(route.path);
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      await expect(canonical).toHaveAttribute("href", canonical_of(route.path));
    });

    test(`${route.path}: title y description con longitud sana`, async ({ page }) => {
      await page.goto(route.path);
      const title = await page.title();
      expect(title.length, "un title vacío o mínimo desaprovecha la SERP").toBeGreaterThan(15);
      expect(title.length, "la SERP trunca el title pasados ~65 caracteres").toBeLessThanOrEqual(
        70,
      );

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(70);
      expect(description?.length ?? 0).toBeLessThanOrEqual(165);
    });

    test(`${route.path}: un solo h1`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.locator("h1")).toHaveCount(1);
    });

    test(`${route.path}: Open Graph completo y absoluto`, async ({ page }) => {
      await page.goto(route.path);
      expect(await meta_content(page, "og:type")).toBe(route.og_type);
      expect(await meta_content(page, "og:url")).toBe(canonical_of(route.path));
      expect(await meta_content(page, "og:site_name")).toBe("Kodecol");

      /* Absoluta: las redes sociales no resuelven rutas relativas. */
      const image = await meta_content(page, "og:image");
      expect(image).toMatch(/^https:\/\/kodecol\.com\//);
      expect(await meta_content(page, "og:image:width")).toBe("1200");
      expect(await meta_content(page, "og:image:height")).toBe("630");
    });

    test(`${route.path}: la imagen de Open Graph existe`, async ({ page, request }) => {
      await page.goto(route.path);
      const image = (await meta_content(page, "og:image")) ?? "";
      const response = await request.get(image.replace(BASE, ""));
      expect(response.status(), `og:image rota en ${route.path}`).toBe(200);
    });

    test(`${route.path}: JSON-LD válido y sin referencias colgando`, async ({ page }) => {
      await page.goto(route.path);
      const scripts = page.locator('script[type="application/ld+json"]');
      await expect(scripts, "un solo grafo por página").toHaveCount(1);

      const graph = JSON.parse((await scripts.first().textContent()) ?? "");
      expect(graph["@context"]).toBe("https://schema.org");

      const nodes = graph["@graph"] as Record<string, unknown>[];
      const types = nodes.flatMap((node) => [node["@type"]].flat());
      for (const expected of route.expected_types) {
        expect(types, `falta ${expected} en ${route.path}`).toContain(expected);
      }

      const defs = new Set<string>();
      const refs = new Set<string>();
      collect_ids(nodes, defs, refs);

      /* Los @id de nivel superior no se repiten. */
      const top_ids = nodes.map((node) => node["@id"]).filter(Boolean);
      expect(new Set(top_ids).size).toBe(top_ids.length);

      /* Google solo resuelve referencias dentro del mismo grafo. */
      for (const id of refs) {
        expect(defs, `referencia colgando a ${id} en ${route.path}`).toContain(id);
      }
    });
  }

  test("el sitemap lista todas las rutas indexables con lastmod", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();

    for (const route of ROUTES) {
      expect(xml, `falta ${route.path} en el sitemap`).toContain(
        `<loc>${canonical_of(route.path)}</loc>`,
      );
    }
    expect(xml).toContain("<lastmod>");
  });

  test("robots.txt apunta al sitemap y no bloquea el sitio", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain(`Sitemap: ${BASE}/sitemap.xml`);
    expect(body).not.toMatch(/^Disallow: \/$/m);
    /* Los payloads RSC (.txt) son contenido duplicado del HTML. */
    expect(body).toContain("Disallow: /*.txt$");
  });

  test("el 404 responde 404, va noindex y no declara canonical", async ({ page }) => {
    const response = await page.goto("/una-ruta-que-no-existe");
    expect(response?.status()).toBe(404);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    /* Un canonical fijo en un 404 le pediría a Google que indexe el error. */
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });

  test("el manifest se sirve y declara los iconos", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.status()).toBe(200);
    const manifest = JSON.parse(await response.text());
    expect(manifest.lang).toBe("es-CO");
    for (const icon of manifest.icons) {
      expect((await request.get(icon.src)).status(), `icono roto: ${icon.src}`).toBe(200);
    }
  });
});
