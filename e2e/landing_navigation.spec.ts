import { expect, test } from "@playwright/test";

/* Navegación de la landing: navbar, anclas y CTAs de WhatsApp. */

test.describe("navegación de la landing", () => {
  test("el navbar muestra los enlaces en el orden del mockup", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav).toBeVisible();

    /* En mobile los enlaces viven en el panel hamburguesa, que se monta con un
       portal en <body> (fuera del <nav>) para escapar del backdrop-filter. */
    let links = nav;
    if (isMobile) {
      await nav.getByRole("button", { name: "Abrir menú" }).click();
      links = page.getByRole("navigation", { name: "Navegación mobile" });
      await expect(links).toBeVisible();
    }

    const labels = [
      "Inicio",
      "Cotizaciones",
      "Servicios",
      "Marcas propias",
      "Nosotros",
      "Equipo",
    ];
    for (const label of labels) {
      await expect(links.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("las anclas llevan a las secciones", async ({ page, isMobile }) => {
    test.skip(isMobile, "las anclas se validan en desktop; mobile usa el panel");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await nav.getByRole("link", { name: "Servicios", exact: true }).click();
    await expect(page).toHaveURL(/#servicios/);
    await expect(page.locator("#servicios")).toBeInViewport();

    await nav.getByRole("link", { name: "Equipo", exact: true }).click();
    await expect(page.locator("#equipo")).toBeInViewport();
  });

  test("los CTAs de WhatsApp apuntan a wa.me", async ({ page }) => {
    await page.goto("/");
    const hero_cta = page.getByRole("link", { name: /Hablemos por WhatsApp/ }).first();
    await expect(hero_cta).toHaveAttribute("href", /wa\.me\/573224970950/);

    const float = page.getByRole("link", { name: "Hablemos por WhatsApp" }).last();
    await expect(float).toHaveAttribute("href", /wa\.me/);
  });

  test("'Ver portafolio' navega al portafolio del desarrollador", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: "Ver portafolio" })
      .first()
      .click();
    await expect(page).toHaveURL(/\/equipo\/cristian/);
    await expect(
      page.getByRole("heading", { name: /Cristian David Velásquez García/ }),
    ).toBeVisible();
  });
});
