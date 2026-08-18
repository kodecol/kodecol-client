import { defineConfig, devices } from "@playwright/test";

/*
  Configuración E2E: el webServer construye el sitio y lo sirve desde out/ con
  scripts/serve_out.mjs, que emula el .htaccess de producción.

  Ojo: NO se puede usar `next start` — con `output: "export"` no está soportado —
  ni `next dev`, porque los e2e de SEO comprueban el HTML estático final
  (canonical, JSON-LD, 404 con status real, sitemap y robots).

  Con E2E_BASE_URL definido se usa un servidor ya levantado (útil para correr
  la suite dentro del contenedor de Playwright contra el host).
*/
const external_base_url = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: external_base_url ?? "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: external_base_url
    ? undefined
    : {
        command: "pnpm build && pnpm serve:out",
        url: "http://localhost:4321",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
