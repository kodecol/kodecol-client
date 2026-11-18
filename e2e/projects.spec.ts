import { expect, test } from "@playwright/test";

/* Proyectos de clientes: el índice /proyectos y la ficha de cada proyecto. */

const PROJECTS = [
  { slug: "neon-night", name: "Neon Night" },
  { slug: "the-brothers-inc", name: "The Brothers Inc" },
  { slug: "ducks-machine", name: "Ducks Machine" },
];

test.describe("proyectos", () => {
  test("el índice lista los proyectos y enlaza cada ficha", async ({ page }) => {
    await page.goto("/proyectos");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Hecho aquí");
    for (const project of PROJECTS) {
      await expect(
        page.getByRole("link", { name: new RegExp(project.name) }).first(),
      ).toHaveAttribute("href", `/proyectos/${project.slug}`);
    }
  });

  for (const project of PROJECTS) {
    test(`la ficha de ${project.name} explica el trabajo`, async ({ page }) => {
      await page.goto(`/proyectos/${project.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(project.name);
      /* Los cuatro capítulos editoriales */
      for (const chapter of [/Anatomía de la/, /En el/, /El\s+recorrido/, /Ficha/]) {
        await expect(page.getByRole("heading", { level: 2, name: chapter })).toBeAttached();
      }
      /* Capturas reales con texto alternativo */
      const shots = page.locator("main img[alt]:not([alt=''])");
      expect(await shots.count()).toBeGreaterThanOrEqual(4);
      await expect(page.getByText("Siguiente proyecto")).toBeVisible();
    });
  }

  test("Ducks Machine figura en construcción y sin enlace público", async ({ page }) => {
    await page.goto("/proyectos/ducks-machine");
    await expect(page.getByText("En construcción").first()).toBeVisible();
    await expect(
      page.getByRole("definition").filter({ hasText: "Vista previa privada" }),
    ).toBeVisible();
  });

  test("un slug desconocido responde 404", async ({ page }) => {
    const response = await page.goto("/proyectos/no-existe");
    expect(response?.status()).toBe(404);
  });
});
