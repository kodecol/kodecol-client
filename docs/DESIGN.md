# DESIGN.md — Kodecol

> Reglas y dirección de diseño del proyecto.
> Este documento define **cómo pensamos el diseño** (filosofía, principios y reglas de uso).
> Los valores exactos (hex, escalas, tokens, componentes) viven en `docs/DESIGN-SYSTEM.md`.
> **Qué es la marca y en qué cree** vive en [`docs/business/KNOWLEDGE_BASE.md`](./docs/business/KNOWLEDGE_BASE.md): léelo primero.

> **Estado (2026-11):** la dirección **híbrido orgánico** (naturaleza + tecnología retro +
> espacio) ya está implementada en la landing, /proyectos, la página de Axi y la Biblioteca
> (§15.1). Las páginas de servicio y de equipo todavía usan la tipografía anterior (§15.2).

---

## 1. Filosofía de diseño — *naturaleza que computa*

El diseño de Kodecol es la traducción visual de su SOUL: **tecnología con propósito, consciente
y humana**. Y su concepto de marca, *Raíz y circuito*: la tecnología bien hecha crece como algo
vivo.

Visualmente, eso significa que **la máquina vive dentro del paisaje, no al revés**: musgo, niebla,
cordillera y luz natural como escenario; interfaces de vidrio y objetos tecnológicos (a veces
retro) como protagonistas serenos dentro de él.

Cuatro ideas guían cada decisión visual:

- **Vivo, no sintético.** Fotografía y texturas orgánicas en lugar de gradientes abstractos y
  fondos planos. El verde de Kodecol es musgo y bosque, no un neón de pantalla.
- **Premium sin ostentación.** La elegancia nace del espacio, la jerarquía y la contención. Una
  imagen poderosa y poco texto valen más que diez efectos.
- **Retro honesto.** Guiños a la tecnología que duraba (computadores beige, CRT, fósforo verde,
  tipografía editorial) como calidez y memoria, nunca como disfraz *vaporwave*.
- **Colombiano sin postal.** El país aparece en la luz, el paisaje y el acento; nunca en clichés
  turísticos.

> Regla de oro: si un elemento no comunica, no guía o no genera confianza, sobra.

---

## 2. Principios rectores

1. **Menos, pero mejor.** Cada sección defiende su existencia. Antes de añadir, preguntar qué se puede quitar.
2. **El espacio es un elemento de diseño.** El aire —y el paisaje que respira detrás— es lo que hace que algo se sienta premium.
3. **Una jerarquía clara por pantalla.** Obvio qué es lo más importante, qué es secundario y cuál es la acción principal.
4. **Consistencia sobre creatividad puntual.** Mejor un sistema coherente que una pantalla brillante y diez incoherentes.
5. **El verde manda, pero vivo.** La naturaleza pone el ambiente; el acento menta se reserva para guiar la acción.
6. **La imagen cuenta, la UI acompaña.** La fotografía lleva la emoción; las superficies de vidrio llevan la información. Si compiten, gana la lectura.
7. **Accesible por defecto.** Contraste, tamaños y áreas táctiles no son opcionales, tampoco sobre fotografía.

---

## 3. Dirección visual — híbrido orgánico

### 3.1 Dos atmósferas

El sitio alterna dos ambientes. Cada sección pertenece a uno; nunca se mezclan dentro de la misma.

| Atmósfera | Referencia | Cuándo | Base |
|---|---|---|---|
| 🌲 **Bosque** | Musgo, bosque de niebla, esporas flotando, luz filtrada (ref. *Meridian*) | Hero, secciones de filosofía, marcas propias, CTA final | Oscura con matiz verde; fotografía desenfocada detrás del contenido |
| ☀️ **Cielo** | Colina de pasto, cordillera, cielo andino de mañana (ref. *Deadwax*) | Secciones de respiro: servicios, prueba social, equipo | Clara, luz de día; texto oscuro verde-petróleo |

- **Bosque es la atmósfera por defecto** (conserva la herencia oscura de la marca). **Cielo** es
  el contrapunto que da aire: úsalo en 1–2 secciones por página, no más.
- La transición entre atmósferas se hace con un corte limpio o con niebla (degradado suave),
  nunca con un borde duro de color.

### 3.2 Estética general

- **Composición editorial:** titular grande centrado sobre el paisaje, mucho aire, pocas piezas.
- **Vidrio sobre naturaleza:** las tarjetas y la navbar son vidrio que difumina la fotografía de fondo.
- **Bento orgánico:** módulos de vidrio de distinto peso flotando sobre el paisaje, con radios generosos.
- **Objeto héroe:** un único elemento focal por escena (un computador retro en una colina, una
  tarjeta de datos entre el musgo), como pieza de museo en su entorno.

---

## 4. Reglas de glassmorphism — *vidrio sobre naturaleza*

El vidrio sigue siendo la firma de interfaz de Kodecol. Ahora lo que difumina es paisaje.

**Sí:**
- Glass en **navbar, tarjetas destacadas, módulos del bento, burbujas de dato y modales**.
- Siempre los tres ingredientes juntos: **fondo translúcido + blur + borde hairline luminoso**.
- En **Bosque**: vidrio oscuro teñido de verde (como hoy).
- En **Cielo**: vidrio claro/crema translúcido con texto oscuro; se permite una tarjeta blanca
  casi opaca como pieza de dato destacada (ej. una métrica grande), una por escena.
- Brillo interior leve en el borde superior (luz cenital).

**No:**
- Glass sobre fondos planos sin nada detrás.
- Apilar varias capas de vidrio (ruido + coste GPU).
- Vidrio tan transparente que la fotografía compita con el texto: si hay párrafos, subir opacidad.

**Regla de capas:**
`Paisaje (foto/textura) → Velo de legibilidad (oscuro o niebla) → Vidrio → Contenido → Acento`

---

## 5. Reglas de bento

- **Una idea por celda.** Un servicio, una métrica, un beneficio.
- **Jerarquía por tamaño.** La celda más grande contiene lo más importante.
- **Ritmo visual.** 1 grande + 2 medianas + varias pequeñas.
- **Radios y gaps uniformes;** la variedad está en el tamaño, no en el estilo.
- **Bento flotante:** en secciones con paisaje, las celdas pueden desalinearse levemente
  (como las burbujas de la referencia *Meridian*) solo en desktop y solo en el hero. El resto del
  sitio mantiene la grilla.
- **Mobile:** una sola columna, jerarquía de mayor a menor.

---

## 6. Espacio y composición

- **Respiración generosa.** Mejor que sobre espacio a que falte; en Bosque y Cielo el paisaje *es* el espacio.
- **Grilla de 12 columnas** con contenedor máximo centrado.
- **Composición central para escenas héroe** (titular + objeto focal centrados); composición en
  grilla para secciones de información.
- **Ritmo vertical:** el espacio entre secciones es notablemente mayor que dentro de ellas.
- **Zona de lectura protegida:** el texto nunca cae sobre la parte más detallada de una foto;
  se compone la imagen dejando cielo, niebla o desenfoque donde va el texto.

---

## 7. Uso del color (proporción y rol)

**Regla 60 / 30 / 10, reinterpretada:**
- **60 % — Atmósfera:** la fotografía/textura de Bosque (verdes oscuros, musgo) o de Cielo
  (azul pálido, crema, pasto).
- **30 % — Verdes de marca:** esmeralda / petróleo en superficies de vidrio, tipografía de Cielo,
  velos y gradientes de niebla.
- **10 % — Acento menta luminoso:** **solo** para guiar (CTA primario, enlaces activos,
  indicadores, barras de progreso).

**Colores de la naturaleza (soporte fotográfico, no de UI):**
tierra, crema/hueso, beige retro y **flor** (el rojo-coral de una flor silvestre en primer plano).
Aparecen **en la imagen**, no como fondos de botón ni texto. Excepción: crema/hueso como base de
superficies Cielo. Valores propuestos en `docs/DESIGN-SYSTEM.md` §11.

**Reglas:**
- El **acento menta es escaso.** Un CTA principal por sección. En Cielo, el CTA primario puede ser
  **pill negro/petróleo con texto claro** (ref. *Deadwax*) y la menta queda para detalles.
- Nada de glows tipo neón. La luz viene de la foto (sol filtrado, niebla), no de un *box-shadow*.
- Texto largo siempre en off-white (Bosque) o petróleo profundo (Cielo); nunca verde saturado.

---

## 8. Tipografía (principios)

- **Tres roles:**
  1. **Titulares:** Sora (sans geométrica, con carácter).
  2. **Énfasis emocional:** una **serif display con itálica** (*propuesta*, ver `DESIGN-SYSTEM.md` §11)
     para el remate del titular — el patrón *"See your next move / **before you make it.**"*.
     Encaja con el patrón de copy de Kodecol (frase directa + remate en énfasis).
  3. **Cuerpo y UI:** Poppins.
- **La serif es condimento:** solo en el remate de titulares principales, citas y alguna cifra
  editorial. Nunca en párrafos, botones ni navegación.
- **Contraste de jerarquía evidente;** pocos tamaños, escala fija.
- **Líneas de lectura cómodas** e interlineado holgado.
- **Mayúsculas con criterio:** eyebrows y navegación pequeña con tracking amplio (ref. *Deadwax*); nunca párrafos.

---

## 9. Profundidad, sombras y luz

- **La luz es natural.** La profundidad nace de la fotografía: planos de foco (primer plano
  nítido, fondo desenfocado), niebla atmosférica y luz filtrada.
- **Elevación = luz** en la UI: cuanto más elevado, más claro su borde superior.
- **Sombras:** suaves y difusas; en Cielo pueden ser algo más presentes (hay luz de día que las justifica). Nunca duras.
- **Partículas** (esporas, polen, semillas de diente de león): permitidas en escenas Bosque como
  capa sutil, pocas, lentas y desactivadas con reducir movimiento.

---

## 10. Movimiento y animación (principios)

- **Sutil y con propósito:** la animación confirma y guía, no entretiene.
- **Orgánico:** movimientos lentos y respirados (flotar, derivar, niebla que se mueve), curvas
  *ease-out* suaves. Nada de rebotes mecánicos.
- **Micro-interacciones:** hover/press con leve elevación y brillo de borde.
- **Entrada de secciones:** aparición leve y escalonada al hacer scroll.
- **Reducir movimiento es obligatorio:** el sitio funciona perfecto con todo quieto.

---

## 11. Dirección de arte — imágenes, iconografía e ilustración

### 11.1 Fotografía e imagen generada
La imagen es la mitad de la marca. Criterios:

- **Territorio:** paisaje y naturaleza colombiana — musgo, helechos, frailejones de páramo,
  bosque de niebla, cordillera, colinas de pasto, cafetal, flor silvestre.
- **Luz natural:** mañana o tarde dorada; niebla; luz filtrada entre hojas. Nada de flash ni estudio.
- **Planos:** macro con profundidad de campo corta (primer plano nítido, fondo en bokeh) o
  panorámica serena con mucho cielo para el texto.
- **Tecnología dentro del paisaje:** un objeto por escena, integrado con naturalidad —
  un computador retro beige en una colina, un teclado entre el musgo, una pantalla CRT con
  fósforo verde en el bosque—. Surrealismo tranquilo, fotográfico, creíble.
- **Personas:** reales, del equipo o de clientes, con luz natural. Nada de stock de oficina.
- **Evitar:** stock genérico, circuitos azules, robots, cerebros de neón, hologramas, clichés
  turísticos, gradientes abstractos como protagonista.

**Prompt base (generación de imagen):**
```
Photorealistic scene, [Colombian landscape: moss-covered cloud forest / Andean grass hill /
páramo with frailejones], soft natural [morning|golden hour] light, light mist, shallow depth of
field, a single [retro beige computer / vintage CRT monitor with green phosphor glow] placed
naturally in the scene, calm and serene, lush greens, generous empty space [top|center] for
headline text, editorial, no people, no text, no logos
```

### 11.2 Tratamiento
- En **Bosque**, velo oscuro verde sobre la foto para garantizar contraste AA del texto.
- En **Cielo**, cielo limpio o niebla clara detrás del titular.
- Las capturas de producto siguen yendo en vidrio o en duotono corporativo (ver `architecture.md` §6).

### 11.3 Iconografía
Lineal, fina y uniforme (outline). Se permiten formas orgánicas (hoja, brote, raíz) cuando el
concepto lo pide. Acentuada en menta solo cuando aporta jerarquía.

### 11.4 Logo
Respetar área de protección y legibilidad. Versión clara del isotipo sobre Bosque; versión
petróleo sobre Cielo. Nunca sobre la zona más detallada de una foto.

---

## 12. Accesibilidad (no negociable)

- **Contraste AA siempre, también sobre fotografía:** si el texto no cumple, se añade velo o se
  recompone la imagen; no se negocia.
- En **Cielo**, cuidado con la menta como texto: usar `mint-700` o petróleo.
- **Área táctil mínima** cómoda en mobile.
- **No depender solo del color** para estados.
- **Jerarquía semántica:** un solo H1, headings en orden, `alt` en imágenes de contenido
  (las fotos de paisaje decorativas llevan `alt=""`).

---

## 13. Do's & Don'ts

**Hacer ✅**
- Paisaje natural colombiano como escenario; vidrio encima para la información.
- Un objeto focal por escena, idealmente tecnología dentro de la naturaleza.
- Titular directo + remate en serif itálica.
- Alternar Bosque y Cielo con intención; Bosque por defecto.
- Menta solo para guiar la acción.
- Movimiento lento y orgánico, que se apaga con reducir movimiento.

**Evitar ❌**
- Gradientes abstractos o fondos planos como protagonistas.
- Glows de neón, circuitos azules, robots y demás clichés de "tech".
- Retro como disfraz (vaporwave, glitch, píxel art gratuito).
- Clichés turísticos de Colombia.
- Texto sobre la zona más detallada de una foto.
- Mezclar las dos atmósferas en la misma sección.
- Rellenar el espacio "porque se ve vacío".

---

## 14. La estética en una frase

> **Tecnología que crece en el paisaje: vidrio y luz sobre musgo y montaña, con la calma de una
> máquina que se hizo para durar y el acento de una marca que es orgullosamente colombiana.**

---

## 15. Implementación técnica (mapa concepto → código)

> Valores exactos en `docs/DESIGN-SYSTEM.md`, materializados como tokens en
> `src/app/globals.css` (`@theme` de Tailwind 4).

### 15.1 Implementado

| Concepto de diseño | Implementación |
|---|---|
| Tokens de color/espaciado/radios | `@theme` en `src/app/globals.css` — nunca hex sueltos en componentes |
| Tipografías Sora + Poppins | `next/font/google` en `src/app/layout.tsx` → variables `--font-sora` / `--font-poppins` |
| Glass estándar (fondo + blur + borde + luz) | componente `shared/ui/glass_card.tsx` |
| Celdas bento (1×1, 2×1, 2×2) | `shared/ui/bento_cell.tsx` |
| CTA primario / secundario glass / ghost | `shared/ui/button.tsx` (variantes × tamaños) |
| Eyebrow de sección | `shared/ui/eyebrow.tsx` + `shared/ui/section_heading.tsx` |
| Entrada de secciones al hacer scroll | `shared/ui/reveal.tsx` (IntersectionObserver + `data-delay`) |
| Keyframes de marca | `kc-pulse`, `kc-float`, `kc-spin`, `kc-rise` en `globals.css` |
| Gradiente vivo de ambiente (hero) | `shared/ui/living_gradient.tsx` — ruido simplex en WebGL; colores desde tokens del `@theme` |
| Campo 3D de capturas (marcas propias) | `features/landing/own_brands/brand_marquee.tsx` — plano inclinado en CSS puro; keyframes `kc-drift-*` |
| Imágenes de contenido con AVIF/WebP | `shared/ui/static_picture.tsx` + `scripts/generate_image_variants.mjs` |
| Paleta de una marca invitada | `features/product/brand_theme.ts` → variables `--brand-*` acotadas a `/marcas/[slug]` |
| Navbar pill glass flotante | `shared/ui/navbar.tsx` (+ `navbar_client.tsx` para menú mobile) |
| Botón flotante de WhatsApp | `shared/ui/whatsapp_float.tsx` |
| Reducir movimiento | bloque global `@media (prefers-reduced-motion: reduce)` en `globals.css` |
| Datos de contacto / navegación | `shared/config/site_config.ts` (única fuente) |
| Serif display + Inter Tight (K-24) | `next/font/google` en `layout.tsx` → `--font-serif` / `--font-display`; titular + remate con `shared/ui/display_heading.tsx` |
| Palabra gigante detrás del objeto | `shared/ui/giant_word.tsx` + clases `.kc-giant` en `globals.css` |
| Escenas fotográficas en capas (Bosque) | `shared/ui/layered_scene.tsx`: render 3D propio + recorte con alfa en `public/images/scenes/` |
| Atmósfera Cielo | tokens `sky-*`, `cream-*`, `ink-petrol*`; sección de servicios; botón `variant="ink"` |
| Atmósfera Espacio | `shared/ui/black_hole.tsx` (trazado de rayos en WebGL, disco en verdes de marca) |
| Gradiente vivo | `shared/ui/velaris_gradient.tsx` (reemplaza a `living_gradient`) |
| Partículas (luciérnagas, estrellas) | `shared/ui/fireflies.tsx` |
| Motion editorial de proyectos | `features/project/`: callouts con líneas guía, cotas, recorrido con línea animada |

### 15.2 Pendiente de implementar (dirección orgánica)

| Concepto | Propuesta técnica |
|---|---|
| Tipografía en el resto del sitio | Servicios y equipo aún usan Sora en titulares: migrarlos a `DisplayHeading` (la Biblioteca ya migró vía `library.css`) |
| Variante clara de `glass_card` | Hoy el vidrio claro de Cielo vive en la sección de servicios; promoverlo a `shared/ui` cuando haya un segundo uso |

Mientras no se implemente, **el código manda sobre este documento en lo técnico** y este
documento manda en la intención: toda pieza nueva debería acercarse a la dirección orgánica.

**Reglas de oro al codificar:**
- El acento menta (`mint-500`) es escaso: un CTA principal por sección.
- Glass siempre con los tres ingredientes y sobre algo que difuminar (foto o textura).
- No apilar capas de `backdrop-filter`.
- Fotografía de fondo siempre vía `StaticPicture`, con variantes precalculadas.
- Mobile-first: el bento colapsa a 1 columna manteniendo jerarquía de mayor a menor.
