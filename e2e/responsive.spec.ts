import { expect, test } from "@playwright/test";

/* Responsive mobile-first: hamburguesa en mobile, sin scroll horizontal en ninguna vista. */

test.describe("responsive", () => {
  test("mobile: el menú hamburguesa abre y navega", async ({ page, isMobile }) => {
    test.skip(!isMobile, "solo aplica al project mobile");
    await page.goto("/");

    const open_button = page.getByRole("button", { name: "Abrir menú" });
    await expect(open_button).toBeVisible();
    await open_button.click();

    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Equipo" }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator("#equipo")).toBeInViewport();
  });

  test("desktop: el menú hamburguesa no aparece", async ({ page, isMobile }) => {
    test.skip(isMobile, "solo aplica al project desktop");
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Abrir menú" })).toBeHidden();
  });

  test("sin scroll horizontal en las plantillas del sitio", async ({ page }) => {
    for (const path of [
      "/",
      "/equipo/cristian-velasquez",
      "/servicios",
      "/servicios/automatizacion-de-procesos",
      "/marcas",
      "/marcas/axi-connect",
      "/equipo",
    ]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `overflow horizontal en ${path}`).toBeLessThanOrEqual(0);
    }
  });

  test("el botón flotante de WhatsApp es visible y táctil (≥44px)", async ({ page }) => {
    await page.goto("/");
    const float = page.getByRole("link", { name: "Hablemos por WhatsApp" }).last();
    await expect(float).toBeVisible();
    const box = await float.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});
