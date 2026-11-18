# DESIGN-SYSTEM.md — Kodecol

> Sistema de diseño concreto: paleta con valores exactos, escala tipográfica, espaciado, profundidad y especificaciones de componentes.
> Las **reglas y la filosofía** de cómo aplicar todo esto están en `DESIGN.md`.
> Documento **descriptivo**: los valores están listos para que un agente técnico los convierta en tokens (CSS variables / Tailwind config).

**Bases del sistema**
- Tema: **Oscuro premium** (dark-first).
- Estética: minimalismo iOS/Apple + glassmorphism + bento.
- Acento (3er color): **Menta luminoso `#34E0A1`**.
- Tipografías: **Sora** (titulares) + **Poppins** (cuerpo/UI).
- Dirección en evolución: **híbrido orgánico** (ver `DESIGN.md`). Los tokens propuestos para esa dirección están en §11 y aún no están implementados.

---

## 1. Color

### 1.1 Verde Kodecol (escala de marca)
Escala única que va del esmeralda luminoso al petróleo profundo. El **600** es el color de marca (brillo del isotipo); el **800** es el petróleo de la base del degradado.

| Token | Hex | Uso principal |
|---|---|---|
| `green-50` | `#EAFBF6` | textos/íconos verdes sobre fondo muy oscuro (raro) |
| `green-100` | `#C9F4E9` | detalles claros, hover sutil |
| `green-200` | `#93E8D4` | texto de apoyo en verde claro |
| `green-300` | `#54D8BB` | íconos, bordes activos |
| `green-400` | `#18BD9A` | acentos secundarios, gráficos |
| `green-500` | `#009A7B` | verde vivo de soporte |
| **`green-600`** | **`#00735C`** | **color de marca** (logo, énfasis) |
| `green-700` | `#015E4F` | superficies teñidas, gradientes |
| `green-800` | `#014B4D` | petróleo profundo, fondos de celda |
| `green-900` | `#013A3B` | superficies muy oscuras |
| `green-950` | `#002C2C` | casi-negro verde |

### 1.2 Menta (acento luminoso · 3er color)
Recurso escaso. Para CTA primario, enlaces activos, glows, indicadores. ~10 % del uso de color.

| Token | Hex | Uso |
|---|---|---|
| `mint-300` | `#7FF0C6` | hover claro del acento |
| `mint-400` | `#54E8B0` | hover del CTA |
| **`mint-500`** | **`#34E0A1`** | **acento principal / CTA** |
| `mint-600` | `#1FC98C` | press / estado activo |
| `mint-700` | `#18A876` | acento sobre superficies claras (contraste) |

### 1.3 Superficies (dark, con matiz verde)
Nada de negro puro: todos los fondos tienen un sutil tinte verde.

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#04110F` | fondo base de la página |
| `surface-1` | `#081A16` | secciones, contenedores |
| `surface-2` | `#0C2320` | tarjetas, celdas de bento |
| `surface-3` | `#103029` | tarjetas elevadas, hover |
| `surface-inset` | `#02100D` | zonas hundidas (inputs, code) |

### 1.4 Vidrio (glass)
El glass se construye con **fondo translúcido + blur + borde**. Valores de referencia:

| Token | Valor | Nota |
|---|---|---|
| `glass-fill` | `rgba(12, 35, 31, 0.55)` | relleno base de la superficie de vidrio |
| `glass-fill-strong` | `rgba(12, 35, 31, 0.78)` | cuando hay texto largo encima |
| `glass-blur` | `20–24px` | desenfoque (backdrop) |
| `glass-border` | `rgba(255, 255, 255, 0.10)` | hairline de 1px |
| `glass-highlight` | `rgba(255, 255, 255, 0.16)` | brillo superior interno (luz cenital) |

### 1.5 Bordes y líneas

| Token | Valor | Uso |
|---|---|---|
| `border-subtle` | `rgba(255,255,255,0.08)` | divisores, contornos suaves |
| `border-default` | `rgba(255,255,255,0.12)` | bordes de tarjetas |
| `border-strong` | `rgba(255,255,255,0.20)` | énfasis, foco |
| `border-accent` | `rgba(52,224,161,0.45)` | borde de elementos activos/acento |

### 1.6 Texto

| Token | Hex | Uso |
|---|---|---|
| `text-primary` | `#F2F7F5` | titulares y texto principal |
| `text-secondary` | `#9FB8B0` | párrafos de apoyo, subtítulos |
| `text-muted` | `#6E847D` | metadatos, captions, placeholders |
| `text-disabled` | `#4A5A55` | estados inactivos |
| `text-on-accent` | `#04110F` | texto sobre botón menta (oscuro sobre claro) |

### 1.7 Colores semánticos
Tonos que conviven con la paleta verde sin romper el ambiente. Usar con moderación.

| Token | Hex | Uso |
|---|---|---|
| `success` | `#34E0A1` | éxito (coincide con el acento) |
| `info` | `#5AD1D6` | informativo (teal-cyan) |
| `warning` | `#F5C451` | advertencia (ámbar cálido) |
| `error` | `#FF6B6B` | error (rojo suave) |

> Recordatorio (de `DESIGN.md`): nunca comunicar estado **solo** con color; reforzar con ícono/texto.

### 1.8 Gradientes

| Token | Definición | Uso |
|---|---|---|
| `grad-brand` | lineal 135°: `#00735C → #014B4D` | botones/superficies de marca |
| `grad-hero` | radial/lineal: `#00735C → #014B4D → #04110F` | fondo del héroe |
| `grad-glass-sheen` | lineal 180°: `rgba(255,255,255,.16) → rgba(255,255,255,0)` | brillo superior del vidrio |
| `glow-mint` | radial: `rgba(52,224,161,.35) → transparent` | resplandor del acento |
| `glow-emerald` | radial: `rgba(0,115,92,.40) → transparent` | luz focal verde detrás del contenido |

---

## 2. Tipografía

### 2.1 Familias
- **Sora** — titulares, números grandes, elementos de marca. Geométrica, premium, tech.
- **Poppins** — cuerpo, UI, botones, etiquetas. Legible y cercana.
- Fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`.

### 2.2 Escala tipográfica

| Estilo | Fuente | Tamaño (desktop) | Peso | Interlineado | Tracking |
|---|---|---|---|---|---|
| Display XL | Sora | 72 px | 700 | 1.05 | -2% |
| Display | Sora | 56 px | 700 | 1.08 | -2% |
| H1 | Sora | 44 px | 700 | 1.12 | -1% |
| H2 | Sora | 34 px | 600 | 1.18 | -1% |
| H3 | Sora | 26 px | 600 | 1.25 | 0 |
| H4 | Sora | 20 px | 600 | 1.3 | 0 |
| Body L | Poppins | 18 px | 400 | 1.6 | 0 |
| Body | Poppins | 16 px | 400 | 1.6 | 0 |
| Body S | Poppins | 14 px | 400 | 1.55 | 0 |
| Caption | Poppins | 13 px | 400 | 1.5 | 0 |
| Eyebrow / Label | Poppins | 12 px | 600 | 1.4 | +8% (MAYÚSCULAS) |
| Button | Poppins | 15 px | 600 | 1 | +1% |

### 2.3 Reglas tipográficas
- **Titulares en Sora, todo lo demás en Poppins.** No mezclar dentro de un mismo bloque.
- **Mobile:** reducir Display/H1/H2 ~25–30 % (ej. Display XL 72 → 40–44 px).
- **Ancho de lectura:** párrafos de máx. ~65–75 caracteres.
- **Pesos disponibles:** Sora 600/700 · Poppins 400/500/600. No usar más para mantener coherencia.
- **Eyebrows** (etiquetas de sección): mayúsculas, tracking amplio, en `mint-500` o `green-300`.

---

## 3. Espaciado y layout

### 3.1 Escala de espaciado (base 4 px)
`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128 · 160`

| Token | px | Uso típico |
|---|---|---|
| `space-1` | 4 | micro-ajustes |
| `space-2` | 8 | gap entre ícono y texto |
| `space-3` | 12 | padding interno pequeño |
| `space-4` | 16 | padding base de elementos |
| `space-6` | 24 | padding de tarjetas |
| `space-8` | 32 | gap de bento |
| `space-12` | 48 | separación de bloques |
| `space-16` | 64 | padding de tarjetas grandes |
| `space-20` | 80 | espaciado intra-sección |
| `space-24` | 96 | **espaciado entre secciones (desktop)** |
| `space-32` | 128 | secciones de gran respiro / héroe |

> Regla (de `DESIGN.md`): el espacio **entre** secciones (96–128) debe ser mayor que el espacio **dentro** de una sección.

### 3.2 Contenedor y grilla
- **Ancho máximo de contenido:** 1200 px (centrado).
- **Grilla:** 12 columnas, gutter 24–32 px.
- **Margen lateral:** 24 px (mobile) → 48–80 px (desktop).

### 3.3 Breakpoints

| Nombre | Ancho |
|---|---|
| `sm` | ≥ 640 px |
| `md` | ≥ 768 px |
| `lg` | ≥ 1024 px |
| `xl` | ≥ 1280 px |
| `2xl` | ≥ 1536 px |

---

## 4. Radios de esquina

| Token | px | Uso |
|---|---|---|
| `radius-sm` | 8 | inputs, badges, chips |
| `radius-md` | 12 | botones |
| `radius-lg` | 16 | tarjetas pequeñas |
| `radius-xl` | 24 | tarjetas / celdas de bento |
| `radius-2xl` | 32 | módulos grandes, héroe |
| `radius-pill` | 999 | botones pill, navbar, tags |

> Mantener consistencia: dentro de una misma composición, todas las celdas comparten radio.

---

## 5. Profundidad: sombras y glow

En dark, la elevación se logra con **luz + sombra suave**, nunca sombras duras.

| Token | Definición | Uso |
|---|---|---|
| `shadow-sm` | `0 2px 8px rgba(0,0,0,.30)` | elementos sutiles |
| `shadow-md` | `0 8px 24px rgba(0,0,0,.35)` | tarjetas |
| `shadow-lg` | `0 16px 48px rgba(0,0,0,.45)` | módulos elevados, modales |
| `glow-accent` | `0 0 32px rgba(52,224,161,.35)` | CTA y focos de acento |
| `glow-brand` | `0 0 64px rgba(0,115,92,.40)` | luz focal del héroe |
| `inner-highlight` | `inset 0 1px 0 rgba(255,255,255,.12)` | brillo superior del vidrio |

**Especificación de superficie de vidrio (glass) estándar:**
```
fondo:   glass-fill (rgba(12,35,31,.55))
blur:    backdrop-blur 20–24px
borde:   1px glass-border (rgba(255,255,255,.10))
luz:     inner-highlight (brillo superior)
sombra:  shadow-md
radio:   radius-xl (24px)
```

---

## 6. Componentes (especificación descriptiva)

### 6.1 Botones

**Primario (CTA):**
- Fondo: `mint-500` (`#34E0A1`); texto: `text-on-accent` (`#04110F`); peso 600.
- Radio: `radius-pill`. Padding: 14×28 px. Glow: `glow-accent`.
- Hover: `mint-400` + glow más intenso. Press: `mint-600`. Disabled: opacidad 40 %.

**Secundario (glass):**
- Superficie de vidrio (sección 5) + borde `border-default`; texto `text-primary`.
- Hover: borde `border-accent` + leve brillo.

**Terciario / ghost:**
- Sin fondo; texto `text-primary` o `mint-500`; subrayado/flecha en hover.

**Tamaños:** S (10×20), M (14×28, default), L (18×36).

### 6.2 Tarjeta de vidrio (Glass Card)
- Superficie glass estándar (sección 5).
- Padding: `space-6`/`space-8` (24–32 px). Radio: `radius-xl`.
- Hover (si es interactiva): sube a `surface-3`, borde `border-strong`, leve elevación.

### 6.3 Celda de bento (Bento Cell)
- Variante de Glass Card pensada para grilla modular.
- **Una idea por celda:** ícono/etiqueta + título (H3/H4) + descripción corta (Body S).
- Tamaños por jerarquía: `1×1`, `2×1`, `1×2`, `2×2` sobre la grilla.
- Gap entre celdas: `space-8` (32 px). Mismo radio en todas.
- La celda principal puede llevar gradiente `grad-brand` o un glow focal.

### 6.4 Navbar
- Barra de vidrio (glass) flotante tipo pill, con blur, sticky al hacer scroll.
- Izquierda: logo Kodecol (isotipo claro). Centro: enlaces (Body, `text-secondary`; activo en `text-primary`/`mint`). Derecha: CTA primario.
- En scroll: aumenta opacidad de fondo y sombra suave.
- Mobile: logo + menú hamburguesa que abre panel glass a pantalla.

### 6.5 Inputs / formularios
- Fondo `surface-inset`; borde `border-default`; texto `text-primary`; placeholder `text-muted`.
- Foco: borde `border-accent` + glow sutil.
- Radio `radius-sm`/`radius-md`. Estados error/success con borde semántico + ícono.

### 6.6 Tags / badges / chips
- Pill (`radius-pill`), fondo glass o `green-800`, texto `green-200`/`text-secondary`.
- Badge de acento: fondo `mint-500` translúcido + texto `mint-300`.

### 6.7 Eyebrow de sección
- Etiqueta pequeña sobre cada título de sección: MAYÚSCULAS, tracking +8%, color `mint-500`, a veces precedida por una línea/ícono.

### 6.8 Botón flotante de WhatsApp
- Botón circular fijo (abajo-derecha), `radius-pill`.
- Estilo de marca: fondo `grad-brand` o glass con borde `border-accent` + `glow-accent`; ícono de WhatsApp en `text-primary`/blanco.
- Tooltip opcional al hover: “Hablemos por WhatsApp”.
- (Se mantiene visible pero discreto; no tapar contenido clave.)

### 6.9 Logo
- **Isotipo claro** sobre fondos oscuros; versión a color sobre fondos claros puntuales.
- Área de protección mínima alrededor del logo = altura de la “K”. Va en el layout (padding/gap),
  **no** baked en el PNG: los assets que consume el sitio están recortados a su contenido real.
- No deformar, no recolorear fuera de la paleta, no aplicar sombras duras.
- El glow sobre un asset transparente se hace con `drop-shadow-glow-accent` /
  `drop-shadow-glow-brand`, nunca con `shadow-*`: un `box-shadow` dibuja un halo rectangular
  en vez del contorno de la marca.

**Assets** — originales en `public/images/logo/`; los `-trim` / `-white` los genera
`scripts/generate_brand_assets.mjs` (`pnpm brand:assets`) y se commitean.

| Archivo | Uso |
|---|---|
| `isotipo-white-trim.png` | El que usa el sitio: navbar, footer, top bar de portafolio, 404 y placeholders de foto, vía `shared/ui/kodecol_mark.tsx` |
| `isotipo-3d-trim.png` | Pieza focal de la tarjeta “Kodecol Engine” del hero (DESIGN.md §11) |
| `imagotipo-white.png` | Imagotipo completo sobre fondo oscuro; hoy alimenta la OG image |
| `isotipo-{white,color,black}.png`, `imagotipo_color.png` | Originales de marca (3840×3840 / 2081×1080). Fuente de los derivados, no se referencian desde `src/` |
| `src/app/icon.png`, `apple-icon.png`, `opengraph-image.png` | Convenciones de archivo de Next; se cablean solas |

El wordmark “Kodecol” del navbar y el footer es **texto** en Sora 700, no imagen: escala con la
tipografía y es legible para lectores de pantalla y buscadores.

---

## 7. Iconografía
- Estilo **lineal / outline**, grosor de trazo uniforme (~1.5–2 px), esquinas redondeadas (lenguaje SF Symbols).
- Tamaños: 16 / 20 / 24 / 32 px.
- Color por defecto `text-secondary`; en `mint-500` cuando marcan acción o jerarquía.
- Set coherente (una sola familia de íconos en todo el sitio).

---

## 8. Movimiento

| Token | Valor | Uso |
|---|---|---|
| `dur-fast` | 150 ms | hover, micro-interacciones |
| `dur-base` | 250 ms | transiciones de UI |
| `dur-slow` | 400 ms | entradas de sección |
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | curva principal (sensación iOS) |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | transiciones simétricas |

- Entradas al hacer scroll: fade + translate-y de ~16–24 px, escalonado (stagger ~60 ms).
- Respetar `prefers-reduced-motion`: desactivar desplazamientos, mantener solo fades mínimos o nada.

---

## 9. Accesibilidad — pares de contraste de referencia
- `text-primary #F2F7F5` sobre `bg #04110F` → contraste alto ✅
- `text-secondary #9FB8B0` sobre `surface-2 #0C2320` → cómodo para apoyo ✅
- `text-on-accent #04110F` sobre `mint-500 #34E0A1` → CTA legible ✅
- ⚠️ Evitar `mint-500` como texto pequeño sobre superficies claras/glass muy claro: usar `mint-700` para ganar contraste.
- Área táctil mínima: 44×44 px.

---

## 10. Resumen de tokens clave (cheat-sheet)

```
COLOR
  marca ............ green-600  #00735C
  petróleo ......... green-800  #014B4D
  acento ........... mint-500   #34E0A1
  fondo ............ bg         #04110F
  superficie ....... surface-2  #0C2320
  texto ............ text-primary #F2F7F5

TIPOGRAFÍA
  titulares ........ Sora 600/700
  cuerpo ........... Poppins 400/500/600

FORMA
  radio tarjeta .... 24px (radius-xl)
  radio botón ...... pill
  gap bento ........ 32px
  sección .......... 96–128px

MOVIMIENTO
  curva ............ cubic-bezier(0.16,1,0.3,1)
  duración base .... 250ms
```

---

## 11. Tokens de la dirección orgánica

> Acompaña a la dirección **híbrido orgánico** de `DESIGN.md` (§3, §7, §8 y §15.2).
> **Implementados en `globals.css` (nov. 2026):** `sky-50/100/200`, `cream-50/200`,
> `ink-petrol`, `ink-petrol-muted`, `cream-ink` (#F6F2E8, la crema de la tipografía motion) y
> las familias `--font-display` (Inter Tight) y `--font-serif` (Instrument Serif). Los
> colores de naturaleza (§11.2) y los velos (§11.3) siguen como referencia: los velos se
> escriben por escena con `color-mix` sobre `--color-bg`. Las tablas 1–10 siguen vigentes.

### 11.1 Atmósfera Cielo (superficies claras)

| Token propuesto | Hex | Uso |
|---|---|---|
| `sky-50` | `#F3F7F6` | fondo base de secciones Cielo (cielo pálido con matiz verde) |
| `sky-100` | `#E4EEEC` | superficies, tarjetas de vidrio claro (con alpha) |
| `sky-200` | `#C9DCDA` | bordes hairline sobre claro, niebla |
| `cream-50` | `#FAF7F0` | hueso: tarjeta de dato destacada |
| `cream-200` | `#EDE6D6` | beige retro (el del computador vintage) |
| `ink-petrol` | `#0E2A26` | texto principal sobre Cielo (≈ green-950 desaturado) |
| `ink-petrol-muted` | `#3F5A55` | texto secundario sobre Cielo |

- Vidrio claro de referencia: `rgba(250, 247, 240, 0.62)` + `blur(20px)` + borde `rgba(14, 42, 38, 0.10)`.
- CTA primario en Cielo: pill `ink-petrol` con texto `cream-50`; la menta queda para detalles.
- Texto de acento sobre Cielo: `mint-700` o `green-600`, nunca `mint-500` en tamaños pequeños.

### 11.2 Colores de la naturaleza (solo en imagen o como apoyo puntual)

| Token propuesto | Hex | Rol |
|---|---|---|
| `moss-400` | `#7A9A3A` | musgo iluminado (referencia para dirección de arte y velos) |
| `moss-700` | `#2F4A1F` | musgo en sombra |
| `earth-500` | `#8A6A4A` | tierra |
| `bloom-500` | `#E4572E` | flor silvestre — **solo** en fotografía, nunca en UI |

### 11.3 Velos de legibilidad sobre fotografía

| Token propuesto | Valor | Uso |
|---|---|---|
| `veil-forest` | `linear-gradient(180deg, rgba(4,17,15,0.55) 0%, rgba(4,17,15,0.25) 45%, rgba(4,17,15,0.75) 100%)` | Bosque: oscurece arriba (navbar) y abajo (contenido) |
| `veil-mist` | `linear-gradient(180deg, rgba(243,247,246,0.70) 0%, rgba(243,247,246,0) 55%)` | Cielo: niebla clara detrás del titular |

### 11.4 Serif de énfasis

| Rol | Candidatas (Google Fonts, vía `next/font/google`) |
|---|---|
| Remate de titulares, citas, cifras editoriales | **Instrument Serif** (itálica, primera opción) · Fraunces (itálica, más cálida/retro) |

- Variable propuesta: `--font-serif`; clase utilitaria `font-serif italic`.
- Tamaño: el mismo estilo de la escala §2.2 que el titular que remata (Display XL, Display o H1), peso regular; tracking 0.
- Nunca en cuerpo, botones ni navegación.
