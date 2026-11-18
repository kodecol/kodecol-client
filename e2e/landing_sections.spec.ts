import { expect, test } from "@playwright/test";

/* Las secciones de la landing existen con su contenido clave (dirección pradera). */

test.describe("secciones de la landing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hero: titular, CTAs y micro-copy", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /El software que tu empresa necesita para crecer de verdad/,
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Ver proyectos" }).first()).toBeVisible();
    await expect(
      page.getByText("Hablas directo con quien construye. Sin formularios."),
    ).toBeVisible();
  });

  test("trust bar: las 5 marcas", async ({ page }) => {
    for (const brand of ["PERPLEX GROUP", "QUÁNTICA", "FEDEGOLF", "TERPEL", "ACERTEMOS"]) {
      await expect(page.getByText(brand, { exact: true })).toBeVisible();
    }
  });

  test("servicios: celda estrella y 6 servicios", async ({ page }) => {
    const section = page.locator("#servicios");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText("Servicio estrella")).toBeVisible();
    for (const service of [
      "Automatización de procesos",
      "Aplicaciones móviles",
      "Apps de escritorio",
      "Desarrollo web",
      "IA a la medida",
      "Software a la medida",
    ]) {
      await expect(
        section.getByRole("heading", { name: service }),
      ).toBeVisible();
    }
    await expect(section.getByText("¿No sabes cuál necesitas?")).toBeVisible();
  });

  test("proyectos: una tarjeta por proyecto y enlace al índice", async ({ page }) => {
    const section = page.locator("#proyectos");
    await section.scrollIntoViewIfNeeded();
    for (const name of ["Neon Night", "The Brothers Inc", "Ducks Machine"]) {
      await expect(section.getByRole("heading", { name: new RegExp(name) })).toBeVisible();
    }
    await expect(section.getByText("En construcción")).toBeVisible();
    await expect(
      section.getByRole("link", { name: "Ver todos los proyectos" }),
    ).toHaveAttribute("href", "/proyectos");
  });

  test("por qué kodecol: 4 diferenciadores", async ({ page }) => {
    const section = page.locator("#nosotros");
    await section.scrollIntoViewIfNeeded();
    for (const item of [
      "Tecnología con propósito",
      "Automatización consciente",
      "Calidad que se siente",
      "Aliado, no proveedor",
    ]) {
      await expect(section.getByRole("heading", { name: item })).toBeVisible();
    }
  });

  test("equipo: perfil y hoja de vida de Cristian", async ({ page }) => {
    const section = page.locator("#equipo");
    await section.scrollIntoViewIfNeeded();
    await expect(
      section.getByRole("link", { name: "Ver perfil completo" }),
    ).toHaveAttribute("href", "/equipo/cristian-velasquez");
    await expect(
      section.getByRole("link", { name: "Hoja de vida (PDF)" }),
    ).toHaveAttribute("href", "/cv/cristian_velasquez_cv.pdf");
  });

  test("equipo: tarjetas de la crew con chips", async ({ page }) => {
    const section = page.locator("#equipo");
    await section.scrollIntoViewIfNeeded();
    await expect(
      section.getByRole("heading", { name: "Cristian David Velásquez" }),
    ).toBeVisible();
    /* Juan David Herrera está oculto: ver local_developer_profile_repository.ts */
    await expect(
      section.getByRole("heading", { name: "Juan David Herrera" }),
    ).toHaveCount(0);
    await expect(section.getByText("Python", { exact: true })).toBeVisible();
  });

  test("cta final: titular y un solo llamado por WhatsApp", async ({ page }) => {
    const section = page.locator("#cotizaciones");
    await section.scrollIntoViewIfNeeded();
    await expect(
      section.getByRole("heading", { name: "¿Qué quieres construir?" }),
    ).toBeAttached();
    await expect(
      section.getByRole("link", { name: /Hablemos por WhatsApp/ }),
    ).toHaveAttribute("href", /wa\.me\/573224970950/);
  });

  test("footer: tagline y contacto", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.getByText("Tecnología con propósito.")).toBeVisible();
    await expect(footer.getByText(/Todos los derechos reservados/)).toBeVisible();
  });

  test("footer: sello de empresa constituida verificable en el RUES", async ({
    page,
  }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();

    const badge = footer.getByRole("link", { name: /empresa constituida/i });
    await expect(badge).toBeVisible();

    /* El enlace debe llevar al registro público: es lo que hace verificable el sello */
    await expect(badge).toHaveAttribute(
      "href",
      "https://www.rues.org.co/buscar/RM/kodecol",
    );
    await expect(badge).toHaveAttribute("target", "_blank");
    await expect(badge).toHaveAttribute("rel", /noopener/);

    /* Los datos que acreditan el registro */
    await expect(badge.getByText("KODECOL S.A.S")).toBeVisible();
    await expect(badge.getByText("902095005-6")).toBeVisible();
    await expect(badge.getByText("4140238")).toBeVisible();
  });
});
