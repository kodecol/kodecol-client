import { expect, test } from "@playwright/test";

/* Portafolio dinámico: ambos slugs renderizan la misma plantilla con datos propios. */

test.describe("portafolio dinámico", () => {
  test("cristian: hero, métricas y CV", async ({ page }) => {
    await page.goto("/equipo/cristian-velasquez");
    await expect(
      page.getByRole("heading", { level: 1, name: "Cristian David Velásquez García" }),
    ).toBeVisible();
    await expect(page.getByText("Fundador y CTO")).toBeVisible();
    await expect(page.getByText("años de experiencia")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Descargar CV/ }).first(),
    ).toHaveAttribute("href", "/cv/cristian_velasquez_cv.pdf");
    /* Cristian no tiene redes en el mockup: no se renderizan */
    await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveCount(0);
  });

  test.skip("juan: misma plantilla con sus datos, idiomas y redes", async ({ page }) => {
    /* Perfil oculto: ver local_developer_profile_repository.ts. Al descomentarlo,
       quitar este skip. */
    await page.goto("/equipo/juan");
    await expect(
      page.getByRole("heading", { level: 1, name: "Juan David Herrera Ramírez" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      /linkedin\.com\/in\/jd13hr/,
    );
    await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      /github\.com\/JD13HR/,
    );
    await expect(page.getByText("Habilidades blandas")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /SIIS — Administración de clínicas/ }),
    ).toBeVisible();
  });

  test("toggle de experiencia: ver más / ver menos", async ({ page }) => {
    await page.goto("/equipo/cristian-velasquez");
    const toggle = page.getByRole("button", { name: /Ver 4 experiencias más/ });
    await toggle.scrollIntoViewIfNeeded();

    /* Colapsado: las antiguas no se ven */
    await expect(page.getByText("Element Holding S.A.S")).toHaveCount(0);

    await toggle.click();
    await expect(page.getByText("Element Holding S.A.S")).toBeVisible();
    await expect(page.getByRole("button", { name: "Ver menos" })).toBeVisible();

    await page.getByRole("button", { name: "Ver menos" }).click();
    await expect(page.getByText("Element Holding S.A.S")).toHaveCount(0);
  });

  test("slug desconocido responde 404", async ({ page }) => {
    const response = await page.goto("/equipo/desconocido");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Página no encontrada" }),
    ).toBeVisible();
  });

  test("la top bar vuelve al equipo de la landing", async ({ page }) => {
    await page.goto("/equipo/cristian-velasquez");
    await page.getByRole("link", { name: "← Equipo" }).click();
    await expect(page).toHaveURL(/\/#equipo/);
  });
});
