import { expect, test } from "@playwright/test";

/*
  Páginas de servicio: contenido y, sobre todo, ENLAZADO INTERNO.

  Las seis páginas solo existen para un buscador si algo las enlaza. Antes de
  esta feature las tarjetas de la landing eran divs muertos, así que estos tests
  vigilan justo lo que era el agujero: que la landing enlace, que el índice
  enlace, y que cada página enlace a sus hermanas sin apuntarse a sí misma.
*/

const SERVICES = [
  { slug: "automatizacion-de-procesos", name: "Automatización de procesos" },
  { slug: "inteligencia-artificial-a-la-medida", name: "IA a la medida" },
  { slug: "desarrollo-web", name: "Desarrollo web" },
  { slug: "aplicaciones-moviles", name: "Aplicaciones móviles" },
  { slug: "aplicaciones-de-escritorio", name: "Apps de escritorio" },
  { slug: "software-a-la-medida", name: "Software a la medida" },
];

test.describe("páginas de servicio", () => {
  test("la landing enlaza las 6 tarjetas a su página", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#servicios");
    for (const service of SERVICES) {
      await expect(
        section.getByRole("link", { name: new RegExp(service.name) }).first(),
        `la tarjeta "${service.name}" no enlaza`,
      ).toHaveAttribute("href", `/servicios/${service.slug}`);
    }
  });

  test("el índice /servicios lista y enlaza las 6", async ({ page }) => {
    await page.goto("/servicios");
    for (const service of SERVICES) {
      await expect(
        page.getByRole("link", { name: new RegExp(service.name) }).first(),
      ).toHaveAttribute("href", `/servicios/${service.slug}`);
    }
  });

  for (const service of SERVICES) {
    test(`${service.slug}: estructura y bloques clave`, async ({ page }) => {
      await page.goto(`/servicios/${service.slug}`);

      await expect(page.locator("h1")).toBeVisible();
      await expect(page.getByRole("heading", { level: 2, name: /Qué|qué|Cómo|Lo que|Herramientas|Resultados/ }).first()).toBeVisible();

      /* La FAQ alimenta el JSON-LD FAQPage: si desaparece, el nodo miente. */
      const faq = page.locator("#preguntas-frecuentes");
      await expect(faq).toBeVisible();
      expect(await faq.getByRole("heading", { level: 3 }).count()).toBeGreaterThanOrEqual(3);
    });

    test(`${service.slug}: miga de pan y CTA de contacto`, async ({ page }) => {
      await page.goto(`/servicios/${service.slug}`);

      const crumbs = page.getByRole("navigation", { name: "Miga de pan" });
      await expect(crumbs.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
      await expect(crumbs.getByRole("link", { name: "Servicios" })).toHaveAttribute(
        "href",
        "/servicios",
      );

      /* El número sale de site_config, nunca del JSON del servicio. */
      const cta = page.locator('a[href*="wa.me"]').first();
      await expect(cta).toHaveAttribute("href", /wa\.me\/573224970950/);
    });

    test(`${service.slug}: enlaza a las otras 5 y no a sí misma`, async ({ page }) => {
      await page.goto(`/servicios/${service.slug}`);
      const related = page.locator("#otros-servicios");
      const hrefs = await related.getByRole("link").evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("href")),
      );
      expect(hrefs).toHaveLength(SERVICES.length - 1);
      expect(hrefs).not.toContain(`/servicios/${service.slug}`);
    });
  }

  test("un slug de servicio desconocido responde 404", async ({ page }) => {
    const response = await page.goto("/servicios/no-existe");
    expect(response?.status()).toBe(404);
  });
});
