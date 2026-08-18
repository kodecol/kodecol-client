# architecture.md — Kodecol Web

> Reglas del proyecto. **Leer siempre antes de desarrollar cualquier feature.**
> Documentación en español · código técnico (funciones, variables, archivos, clases) en inglés.

---

## 1. Mapa del proyecto

```
src/app/          Composition root de Next.js (App Router). Solo orquesta: cada page.tsx importa
                  secciones de features/ y las apila. Aquí viven layout, globals.css, rutas y SEO.
src/core/         Hexágono — dominio y puertos. TypeScript puro: CERO imports de React/Next/zod.
  domain/         Modelos de dominio (ej. DeveloperProfile, ProductBrand).
  ports/          Interfaces de repositorio (ej. DeveloperProfileRepository).
src/adapters/     Implementaciones de puertos (lado driven). Conocen zod y la fuente de datos
                  (hoy JSON local; mañana un CMS). Exportan una factoría por puerto.
src/features/     Vertical slices. Cada slice = componentes + content.ts + types.ts propios.
  landing/        Un slice por sección de la landing (hero — incluye la trust bar —, services,
                  why_kodecol, own_brands, team, final_cta).
  portfolio/      UNA plantilla polimórfica que recibe DeveloperProfile por props,
                  más la plantilla del índice /equipo.
  product/        UNA plantilla polimórfica que recibe ProductBrand por props (marcas propias),
                  más la plantilla del índice /marcas.
  service/        UNA plantilla polimórfica que recibe ServiceOffering por props,
                  más la plantilla del índice /servicios.
src/shared/       Design system y utilidades transversales. No conoce el negocio.
  ui/             Componentes reutilizables (glass_card, button, reveal, navbar, breadcrumb,
                  skip_link, static_picture...). También el destino de las primitivas
                  de shadcn (ver §9).
  seo/            Capa de SEO: JsonLd, build_page_metadata, urls, nodos de schema.org.
                  Ver §10.
  analytics/      Carga de GA4 (google_analytics.tsx).
  config/         site_config.ts (WhatsApp, nav, metadata base, IDs de analítica).
  lib/            Helpers puros (cn, build_whatsapp_url).
content/          Datos, no código.
  developers/     JSON de perfiles de desarrolladores.
  products/       JSON de marcas propias (Axi Connect, ...).
  services/       JSON de los servicios que presta Kodecol.
public/           Assets estáticos (images/, cv/, .htaccess).
assets/           Fuentes fuente de los scripts (og_fonts/). NO se despliega.
scripts/          Utilidades de repo que no forman parte del bundle (generación de assets
                  de marca, OG images y variantes AVIF/WebP con sharp; servidor estático
                  para los e2e). Se ejecutan a mano vía pnpm.
e2e/              Tests end-to-end con Playwright.
docker/           Dockerfile multi-stage + compose.yaml.
docs/             DESIGN-SYSTEM.md (valores exactos de tokens).
```

## 2. Regla de dependencia

```
app ──────────► features ──► core ◄── adapters
 │                  │          ▲
 └──► adapters      └──► shared┘  (shared puede usar tipos de core; nunca al revés)
```

1. `core` no importa **nada** (ni React, ni Next, ni zod).
2. `adapters` solo importa de `core` + libs de infraestructura (zod).
3. `features` importa de `core` y `shared`. **Nunca** de `adapters` ni de otros slices.
   Si dos slices necesitan lo mismo → se promueve a `shared` o `core`.
4. `app` es el único que conoce `adapters`, siempre vía la factoría
   (`get_developer_profile_repository()`); pasa datos de dominio ya validados como props.
5. `shared` no importa de `features` ni `adapters`.

## 3. Naming

| Qué | Convención | Ejemplo |
|---|---|---|
| Archivos y carpetas | `snake_case` | `hero_section.tsx`, `why_kodecol/` |
| Funciones y variables | `snake_case` | `get_by_slug()`, `nav_links` |
| Componentes React | `PascalCase` (requisito JSX) | `HeroSection` |
| Tipos e interfaces | `PascalCase` | `DeveloperProfile` |
| Constantes de contenido | `SCREAMING_SNAKE_CASE` | `HERO_CONTENT` |
| Documentación/comentarios | Español | — |
| Código técnico | Inglés | — |

**Excepciones (nombres reservados de Next.js):** `page.tsx`, `layout.tsx`, `not-found.tsx`,
`sitemap.ts`, `robots.ts`, carpetas de ruta como `[slug]`. Se aceptan tal cual.

## 4. Cómo añadir un slice (receta)

1. Crear carpeta en `src/features/<area>/<slice>/`.
2. Definir `types.ts` con las interfaces del contenido.
3. Crear `content.ts` con el copy tipado (`satisfies`), nunca copy hardcodeado en JSX.
4. Implementar `<slice>_section.tsx` como **server component**, usando `shared/ui`.
5. Componer la sección en el `page.tsx` correspondiente de `src/app/`.

## 5. Server vs Client

**Server component por defecto.** `"use client"` solo se permite por estas razones:
estado local, event handlers, IntersectionObserver, APIs del navegador (mouse, matchMedia).

Regla: **el client component es la hoja, nunca la sección.** Una sección server envuelve
la hoja client mínima (ej. `hero_section.tsx` server → `hero_visual.tsx` client).

Hojas client existentes: `reveal`, `hero_visual`, `living_gradient`, `experience_timeline`,
`navbar_client`.

## 6. Contenido

- **Landing:** copy estático tipado co-locado en cada slice (`content.ts`). El compilador es la validación.
- **Portafolios:** JSON en `content/developers/*.json`, validado con zod en el adaptador
  (`developer_profile_schema.ts`, anclado al tipo de dominio con `z.ZodType<DeveloperProfile>`).
  La validación es fail-fast: un JSON inválido **rompe el build** — es un gate de calidad, no un bug.
- **Marcas propias:** JSON en `content/products/*.json`, mismo patrón que los portafolios
  (`product_brand_schema.ts`, anclado con `z.ZodType<ProductBrand>`).
- **Servicios:** JSON en `content/services/*.json`, mismo patrón
  (`service_offering_schema.ts`, anclado con `z.ZodType<ServiceOffering>`). Aquí zod además
  hace de **gate anti-thin-content**: mínimos de longitud de párrafo, de entregables, de
  métricas y de respuestas de FAQ. Seis páginas casi vacías Google las trata como
  duplicadas y no posiciona ninguna, así que un JSON pobre rompe el build a propósito.
- Prohibido hardcodear copy en JSX o duplicar datos de contacto: usar `site_config.ts`.
- Añadir un desarrollador nuevo = crear un JSON + foto, y correr `pnpm assets`
  (genera su OG image y las variantes AVIF/WebP de la foto). Cero cambios de código.
- Añadir una marca propia = crear un JSON + assets + una línea en el adaptador.
- Añadir un servicio = crear un JSON + una línea en el adaptador + `pnpm assets`.
- **Los slugs son URLs: una vez publicados no se cambian.** Si hubiera que cambiar uno,
  el 301 se añade a mano en `public/.htaccess` (con `output: "export"` no hay `redirects()`).

### Marca invitada: dónde manda cada color

Una marca propia tiene identidad propia (Axi Connect es coral, no verde). La frontera es dura:

- **Fuera de su página de detalle manda Kodecol.** La sección `#marcas` usa el acento menta;
  la imaginería del producto se pinta en duotono corporativo (`mix-blend-mode: color`, que
  conserva la luminancia y deja leer la captura). Lo único que conserva su color es el isotipo,
  porque es identidad, no una decisión cromática de la sección.
- **Dentro de `/marcas/[slug]` manda el producto.** Su paleta es **contenido**: vive en el JSON,
  la valida zod y se aplica como variables CSS (`--brand-*`) acotadas al árbol de la plantilla
  (`features/product/brand_theme.ts`). Los componentes las consumen como `var(--brand-*)`, así
  que **siguen sin llevar un hex dentro** y la plantilla sirve para cualquier marca futura.
  Es la única excepción a §7, y es acotada: color de marca ≠ design system.

## 7. Design system

- Solo tokens del `@theme` de `globals.css` (vía clases Tailwind). **Nunca hex sueltos en componentes.**
- Reutilizar `shared/ui` antes de crear componentes nuevos.
- **Mobile-first**: estilos base para móvil, `md:`/`lg:` para escalar.
- `prefers-reduced-motion` obligatorio: toda animación debe desactivarse.
- Valores exactos y filosofía: `docs/DESIGN-SYSTEM.md` y `DESIGN.md`.

## 8. Definición de terminado (DoD)

Antes de cerrar cualquier feature:

1. `pnpm build` sin errores (rutas de portfolio, marcas y servicios como SSG).
2. `pnpm lint` limpio.
3. `pnpm e2e` verde (desktop + mobile). El webServer construye y sirve `out/` con
   `scripts/serve_out.mjs`: **`next start` no funciona con `output: "export"`**.
4. Revisión responsive en 360 px, 768 px y 1280 px.
5. Un solo `<h1>` por página, jerarquía de headings correcta, `alt` en imágenes.
6. Si tocaste contenido o assets: `pnpm assets` y commitear lo generado.
7. Si añadiste una ruta: aparece en `sitemap.ts` y en `e2e/seo.spec.ts`.

## 9. shadcn/ui

Se puede usar shadcn, **como fuente de primitivas, no como arquitectura**. El repo no adopta su
estructura (`components/ui`, `@/lib/utils`): esa carpeta viviría fuera del hexágono y competiría
con `shared/ui`. En su lugar, `components.json` redirige el CLI a las rutas de este proyecto:

```jsonc
"aliases": {
  "ui":    "@/shared/ui",       // los componentes caen en shared/ui
  "utils": "@/shared/lib/cn",   // `cn` es el nuestro, no se duplica
  "lib":   "@/shared/lib"
}
```

Así, `pnpm dlx shadcn@latest add <componente>` escribe directamente en `src/shared/ui/`.

**Reglas al vendorizar un componente:**

1. **Renombrar el archivo a `snake_case`** (`alert-dialog.tsx` → `alert_dialog.tsx`). El componente
   React se queda en `PascalCase`, como el resto (§3).
2. **Pasarlo por el design system.** Los colores de shadcn ya resuelven a la marca gracias al
   *puente* de `globals.css` (`--color-primary`, `--color-muted`…, alias de los tokens de Kodecol).
   Cualquier valor suelto que traiga —radios, sombras, tamaños— se sustituye por tokens del
   `@theme`. Sigue vigente §7: **nunca hex sueltos en componentes.**
3. **Revisar `"use client"`.** Muchas primitivas de Radix lo traen. Aplica §5: el componente client
   es la hoja; la sección que lo usa sigue siendo server.
4. **Sin lógica de negocio dentro.** Un componente vendorizado es design system: no conoce
   `core`, ni `features`, ni datos. Si necesita comportamiento del negocio, se envuelve desde
   `features/`.
5. **Antes de añadir, mirar si ya existe.** `shared/ui` ya tiene `button`, `glass_card`,
   `bento_cell`, `chip`, `eyebrow`, `navbar`, `reveal`… Vale más extender lo propio que traer un
   equivalente de shadcn y quedarse con dos botones (§7).
6. **Cada componente nuevo trae dependencias** (`@radix-ui/*`, a veces `lucide-react`). Que el CLI
   las instale está bien; revisarlas en el PR también.

## 10. SEO técnico

El sitio es un **static export** sobre Apache/cPanel. Eso condiciona todo: no hay middleware,
ni `headers()`, ni `redirects()`, ni ISR. Toda decisión de servidor vive en `public/.htaccess`.

### Dónde vive cada cosa

| Pieza | Ubicación | Regla |
|---|---|---|
| `<JsonLd>`, tipos, `prune_node` | `shared/seo/` | Genérico, sin negocio |
| `build_page_metadata()` | `shared/seo/` | **Único** constructor de `Metadata` por página |
| `build_absolute_url()` | `shared/seo/urls.ts` | **Única** fuente de URLs canónicas |
| `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `ItemList` | `shared/seo/site_nodes.ts` | Solo conocen `site_config` |
| `Person` | `features/portfolio/portfolio_structured_data.ts` | Conoce el dominio → vive con su slice |
| `SoftwareApplication` | `features/product/product_structured_data.ts` | ídem |
| `Service`, `FAQPage` | `features/service/service_structured_data.ts` | ídem |
| Ensamblaje del `@graph` | `app/**/page.tsx` | Es orquestación: rol de `app` |

### Reglas duras

1. **Toda página nueva usa `build_page_metadata()`.** No escribas un objeto `Metadata` a mano.
   Motivo: en Next, definir `openGraph` o `twitter` en una página **reemplaza el objeto entero**
   del layout, no hace merge. Sin el helper es trivial perder la `og:image` sin enterarse
   (pasó con el home: definir `openGraph` lo dejó literalmente sin imagen).
2. **Las URLs canónicas salen siempre de `build_absolute_url()`**, igual que el `<loc>` del
   sitemap y los `@id` del JSON-LD. Ninguna ruta lleva barra final, tampoco la raíz.
3. **Un solo `<script type="application/ld+json">` por página**, con un único `@graph`.
   Google solo resuelve las referencias `@id` dentro del mismo bloque: si citas una entidad de
   otra página, incluye también su nodo resumen (`build_entity_stub_node`).
4. **No inventes datos estructurados.** Nada de `aggregateRating` ni `offers` sin precios ni
   reseñas reales: es una acción manual de Google esperando a ocurrir.
5. **Toda `<section>` lleva `aria-labelledby`** apuntando al `id` de su heading.
   `SectionHeading` y `BrandSectionHeading` aceptan `id` justamente para eso.
6. **Un `<dl>` solo admite `dt`/`dd`, opcionalmente envueltos en UN `div`.** Como `Reveal`
   ya renderiza un `div`, la tarjeta debe ser el propio `Reveal`; meter otro `div` dentro
   invalida la lista.
7. **Imágenes pesadas de contenido → `StaticPicture`**, no `next/image`. Con
   `images: { unoptimized: true }` (obligado por el export) `next/image` no genera `srcset` ni
   convierte formatos: sirve el original tal cual. Las variantes las precalcula
   `scripts/generate_image_variants.mjs`, que lee los JSON de contenido.
8. `priority` **solo** en la imagen que es el LCP real. Ponerlo en una imagen decorativa
   genera un `preload` que compite con la CSS y las fuentes.

### Scripts de assets

```bash
pnpm assets           # brand:assets + og:images + images:variants
pnpm serve:out        # sirve out/ emulando el .htaccess (puerto 4321)
```
Todo lo generado es determinista y **se commitea**.

### Variables de entorno

`NEXT_PUBLIC_GA_MEASUREMENT_ID` y `NEXT_PUBLIC_GSC_VERIFICATION`. Ojo: en un static export se
**inlinean en build**, así que cambiarlas exige rebuild y redespliegue — no basta con tocar el
`.env` del servidor. Vacías = desactivadas (dev y previews quedan sin scripts de terceros).

### Al desplegar el `.htaccess`

Un `.htaccess` mal formado tumba el sitio entero con un 500. Súbelo **solo** y verifica antes
de subir el HTML:

```bash
curl -I http://kodecol.com/marcas/axi-connect      # 301 → https
curl -I https://www.kodecol.com/                    # 301 → apex
curl -I https://kodecol.com/marcas/axi-connect.html # 301 → sin .html
curl -I https://kodecol.com/marcas/axi-connect/     # 301 → sin barra
curl -I https://kodecol.com/no-existe               # 404, nunca 200
curl -I https://kodecol.com/                        # 200, sin redirect
```

HSTS empieza en `max-age=300` a propósito: súbelo a un año tras una semana sin incidencias, y
**nunca** añadas `preload` sin decidirlo explícitamente (es irreversible durante un año).
La CSP va como `Report-Only`: revisa la consola una semana antes de activarla.
