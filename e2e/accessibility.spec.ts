import { expect, test } from "@playwright/test";

/* Accesibilidad básica: un solo h1, jerarquía de headings, alt e imagen, nombres accesibles. */

const PAGES = [
  "/",
  "/servicios",
  "/servicios/automatizacion-de-procesos",
  "/servicios/desarrollo-web",
  "/marcas",
  "/marcas/axi-connect",
  "/equipo",
  "/equipo/cristian-velasquez",
  "/equipo/juan",
];

test.describe("accesibilidad", () => {
  for (const path of PAGES) {
    test(`${path}: un solo h1 y jerarquía de headings`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);

      /* Sin saltos de nivel: después de h1 no aparece h3 sin un h2 antes */
      const levels = await page
        .locator("h1, h2, h3, h4")
        .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName[1])));
      let max_seen = 0;
      for (const level of levels) {
        expect(level, `salto de jerarquía en ${path}`).toBeLessThanOrEqual(max_seen + 1);
        max_seen = Math.max(max_seen, level);
      }
    });

    test(`${path}: todas las imágenes tienen alt`, async ({ page }) => {
      await page.goto(path);
      const images = page.locator("img");
      const count = await images.count();
      for (let index = 0; index < count; index++) {
        await expect(images.nth(index)).toHaveAttribute("alt", /.*/);
      }
    });

    test(`${path}: un solo <main> y toda <section> con nombre`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("main")).toHaveCount(1);

      /* Una región sin nombre no sirve de nada al navegar por landmarks. */
      const unnamed = await page
        .locator("section")
        .evaluateAll((nodes) =>
          nodes
            .filter(
              (node) =>
                !node.hasAttribute("aria-labelledby") && !node.hasAttribute("aria-label"),
            )
            .map((node) => node.className.toString().slice(0, 60)),
        );
      expect(unnamed, `secciones sin nombre accesible en ${path}`).toEqual([]);
    });
  }

  test("el skip-link es el primer elemento focalizable y lleva al contenido", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const focused = page.locator(":focus");
    await expect(focused).toHaveText("Saltar al contenido");
    await expect(focused).toHaveAttribute("href", "#contenido");
    await expect(page.locator("main#contenido")).toHaveCount(1);
  });

  test("los enlaces de ícono tienen nombre accesible", async ({ page }) => {
    await page.goto("/");
    const float = page.getByRole("link", { name: "Hablemos por WhatsApp" }).last();
    await expect(float).toBeVisible();
  });

  test("html declara lang=es", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });
});
