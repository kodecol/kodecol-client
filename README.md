# Kodecol Web

Sitio corporativo de **Kodecol** — *Tecnología con proposito.* Landing page + portafolios
dinámicos de la crew, construido con **Next.js 15 (App Router) + TypeScript + Tailwind CSS 4**.

## Documentos clave

| Documento | Qué contiene |
|---|---|
| [`architecture.md`](./architecture.md) | Reglas del proyecto (leer **siempre** antes de cualquier feature) |
| [`DESIGN.md`](./DESIGN.md) | Filosofía y reglas de diseño (dark premium, glass, bento) |
| [`docs/DESIGN-SYSTEM.md`](./docs/DESIGN-SYSTEM.md) | Valores exactos de los tokens |
| [`architecture.md` §10](./architecture.md) | Reglas de SEO técnico, datos estructurados y assets |

## Arquitectura (resumen)

Clean architecture + hexagonal + vertical slice:

- `src/core` — dominio y puertos (TS puro, sin dependencias).
- `src/adapters` — implementaciones de puertos (JSON local + zod, fail-fast en build).
- `src/features` — vertical slices (landing por sección, portfolio polimórfico).
- `src/shared` — design system y utilidades transversales.
- `src/app` — composition root de Next (solo orquesta).
- `content/` — datos (perfiles JSON de desarrolladores).

**Añadir un desarrollador nuevo** = crear `content/developers/<slug>.json` + su foto en
`public/images/team/`. La plantilla `/equipo/[slug]` hace el resto.

## Desarrollo

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # build de producción (valida los JSON con zod)
pnpm lint
pnpm e2e          # tests E2E con Playwright (desktop + mobile)

pnpm assets       # regenera assets derivados: marca, OG images y variantes AVIF/WebP
pnpm serve:out    # sirve out/ emulando el .htaccess de producción (:4321)
pnpm deploy:build # build + copia del .htaccess a out/
```

> `pnpm e2e` construye el sitio y lo sirve desde `out/`. **`next start` no funciona** con
> `output: "export"`, así que la suite usa `scripts/serve_out.mjs`.

> Si tocas `content/` o añades una foto, corre `pnpm assets` y commitea lo generado:
> las OG images y las variantes de imagen se derivan de esos JSON.

## Variables de entorno

Opcionales; vacías desactivan la analítica (dev y previews quedan sin scripts de terceros).
En un static export se **inlinean en build**: cambiarlas exige rebuild y redespliegue.

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX   # Google Analytics 4
NEXT_PUBLIC_GSC_VERIFICATION=...             # solo si no verificas Search Console por DNS
```

## Docker

```bash
docker compose -f docker/compose.yaml up web       # producción → :3000
docker compose -f docker/compose.yaml up web-dev   # desarrollo con hot reload → :3001
```

> Si el host no tiene las dependencias de sistema de Playwright, los E2E pueden
> ejecutarse con la imagen oficial:
> `docker run --rm --network=host -v $PWD:/work -w /work mcr.microsoft.com/playwright:v1.61.1-noble pnpm e2e`
