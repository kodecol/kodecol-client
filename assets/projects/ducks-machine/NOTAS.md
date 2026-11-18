# Ducks Machine · notas de captura (18 nov. 2026)

Fuente: diseño local, NO publicado (`clientes/ducks-machine/kb/design/index.html`, servido con `serve.py` en localhost:5180). Estado: plantilla en espera de aprobación del cliente; el port a Next.js está en pausa. Presentarlo como proyecto en construcción.

- **Título:** `Ducks Machine`
- **Meta description:** «Commercial vehicle wraps, lettering and window graphics in Campbell, CA.»
- **Idioma:** inglés por defecto con traducción completa al español (botones EN / ES; guarda la elección en `localStorage`).

## Qué es
Taller de rotulación comercial de vehículos en Campbell, California (Bay Area): wraps de flotas, rotulado en vinil, gráficos de ventana, polarizado y acabados. Diseño, impresión e instalación en el mismo taller.

## Lo que se ve
1. **Hero** «Your van is already a billboard. Make it sell.» con CTAs «Get a quote» (amarillo) y «WhatsApp»; una van 3D (VW Crafter de techo alto) en un estudio nocturno con piso reflejante.
2. **Historia 3D con scroll** («Scroll to wrap it»): la van se rotula nivel por nivel al bajar: 01 Lettering, 02 Spot graphics, 03 Partial wrap, 04 Full wrap, 05 Window tint, 06 Fleets (flota de 5 vans). Una línea de escaneo amarilla «imprime» la van.
3. **Configurador** en el paso 06: nombre del negocio, teléfono y combinación de colores se pintan en vivo sobre las vans; CTA «Quote this design» («Preview only…»).
4. **Recent work**: portafolio filtrable (All, Vans, Box trucks, Food trucks, Pickups & cars, Window graphics).
5. **Services**: tablero en dos grupos (Brand your vehicles / Protect & finish) con foto al pasar el cursor.
6. **The shop**: dirección, horario L–S 9:00–18:00, «Design · Large-format printing · Installation».
7. **How it works**: cuatro pasos (medir, diseñar y aprobar prueba, imprimir y laminar, instalar y entregar).
8. **Get a quote**: formulario que arma el mensaje y abre WhatsApp (no envía nada por sí solo); teléfono, correo y dirección con botón copiar.
- Claim de cierre: «Master every surface. Own every terrain.»
- Ojo: los nombres de clientes del portafolio y el modelo 3D tienen pendientes de confirmación en el brief del cliente; no citarlos en el copy de Kodecol.

## Tecnología visible
WebGL con three.js r186 (importmap), GSAP y Lenis para el scroll; posproceso con bloom, sombras y piso reflejante; ajuste dinámico de resolución según rendimiento.

## Estilo
- Asfalto/grafito (#0A0B0E, #121419, #1B1E25), texto #F2F3F5, **amarillo pato #FFD21F** y azul gorra #2E55FF.
- Tipografía: Saira expandida itálica 800 para display, Hanken Grotesk para texto, IBM Plex Mono para etiquetas.

## Capturas
- `desktop_hero.png` (p = 0, hero con van blanca), `desktop_2.png` (p = 0,6, «Every panel, printed.», wrap completo), `desktop_3.png` (p = 0,9, flota + configurador).
- `mobile_hero.png` (p = 0), `mobile_2.png` (p = 0,6).
- `screen_4x3.png`: 1600×1200 del hero (p = 0), textura para el CRT.
