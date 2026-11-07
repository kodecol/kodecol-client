# Misma cuadra · guía para Claude

> De la **Biblioteca de Kodecol** (kodecol.co/biblioteca/guias/misma-cuadra). Así hicimos el reel «Misma cuadra» con Claude Opus 5.5 y HyperFrames.
> **Para ti, la persona:** llena la sección 1 con los datos de tu negocio. Luego, en Claude Code, deja este archivo en la carpeta del proyecto y escribe «Lee misma-cuadra.claude.md y empecemos». En claude.ai, adjúntalo al chat.
> **Para ti, Claude:** este archivo es el brief completo. Trabaja en el orden de la sección 9 y detente en cada punto marcado con **ALTO**: ahí esperas el OK de la persona antes de seguir.

---

## 1. El negocio (lo llena la persona)

- **Nombre del negocio:** [tu negocio]
- **Qué hace y dónde:** [qué vendes o qué servicio das, en qué ciudad]
- **Qué se reserva o se pide:** [mesas, citas, pedidos…]
- **Quién atiende en el video:** [una persona de tu equipo o tu asistente virtual, con su nombre]
- **Qué hace de verdad tu sistema:** [p. ej.: responde por WhatsApp e Instagram, agenda sin duplicar, recuerda un día antes]
- **Frase de cierre:** [tu mensaje en una línea]
- **Llamado a la acción:** [qué quieres que haga quien lo vea]
- **Logo:** [ruta al logo, si tienes permiso de usarlo; si no, solo el nombre en texto]

Claude: si falta algún dato, pregúntalo una sola vez y con todos los campos juntos. Muestra en pantalla **solo lo que el sistema del negocio hace de verdad**: si algo de la historia no aplica, propón otra escena y no lo inventes.

## 2. La idea

Dos negocios iguales en la misma cuadra, con las mismas mesas, el mismo menú y los mismos precios, pero uno siempre está lleno. ¿Por qué? Porque tiene un sistema. En el vacío nadie contesta y las reservas se pisan. En el lleno, [quien atiende] responde en segundos, en el canal de cada cliente, y sigue reservando aunque el local ya cerró.

## 3. Formato

- Vertical 9:16, 1080 × 1920, 60 fps, entre 55 y 65 segundos.
- Hecho con **HyperFrames** (HTML, CSS, GSAP y three.js que se renderizan a MP4):
  - una línea de tiempo en pausa;
  - todo determinista: nada de `Date.now()`, `Math.random()` sin semilla ni `requestAnimationFrame`;
  - la escena 3D se dibuja en función del tiempo de la línea.
- **Narración de principio a fin** con subtítulos grandes de dos tamaños: la frase normal y la palabra clave más grande y en color. Cada subtítulo se queda en pantalla al menos 1,5 s.
- **Estética:** cine de noche, rojo y negro con neón, ventanas cálidas, niebla suave, bloom y viñeta. Tono de un tráiler de producto de alta gama.

## 4. La ciudad 3D

- **Hecha en código** con three.js, sin descargar modelos:
  - manzanas con edificios de alturas variadas y ventanas encendidas;
  - calles con líneas y carros;
  - los **dos locales iguales lado a lado**, con mesas, sillas y comensales simples.
- **Vista principal:** isométrica desde arriba. Los edificios de adelante van bajos para no tapar la manzana.
- **El local lleno:** se enciende con luz cálida y se llena de gente. El vacío se apaga.
- **Rendimiento:** fusiona las piezas repetidas (ventanas, sillas, árboles) en **una malla por tipo**. Con cientos de mallas sueltas la escena tarda demasiado en cargar.
- **Sin titileo:**
  - nunca pongas dos caras en el mismo plano; sepáralas unos milímetros;
  - usa `logarithmicDepthBuffer` si hace falta;
  - revisa el render terminado cuadro a cuadro, no solo la vista previa.

## 5. La cámara de cine

- **Motion blur real:** acumula de 8 a 12 submuestras por cuadro, repartidas en el tiempo de obturación. Nada de desenfoque falso.
- **Profundidad de campo** en las tomas cercanas y a ras de calle.
- **Tomas a ras de calle** en el gancho y en «ya cerró», y **latigazos** (movimientos rápidos con blur) para pasar de una escena a otra.
- Cuando la cámara se detiene, se queda quieta de 1,5 a 2 s para que se pueda leer.
- Los movimientos usan curvas suaves (ease in-out); nada lineal.

## 6. La historia y la narración

| Tiempo | Acto | Narración (adáptala a tu negocio) | Qué se ve |
|---|---|---|---|
| 0–9 s | Gancho | «Misma cuadra. Dos [negocios]. Mismas mesas. Mismo menú. Mismos precios. Pero uno siempre está lleno. ¿Sabes por qué? Porque tiene un sistema.» | La ciudad desde arriba; uno se llena de luz y gente, el otro se apaga |
| 9–20 s | Noche | «Viernes, siete y cuarenta y dos de la noche. Tres personas quieren [reservar]. Una escribe por WhatsApp. Otra, por Instagram. Y otra llama.» | Reloj 7:42; tres mensajes viajan hacia los locales |
| 20–30 s | Frío | «Aquí, el celular vibra… y nadie lo ve. El teléfono suena… y nadie contesta. Y en la libreta, dos reservas a la misma hora.» | El local vacío en frío: celular en la mesa, teléfono sonando, libreta con dos nombres en la misma hora |
| 30–41 s | Giro | «Aquí contesta [quien atiende]. En segundos, y en el canal que cada uno prefiere. Ofrece las horas libres, confirma la [reserva]… y la agenda no deja que se pisen dos reservas.» | Pantallas oscuras como una app real: chat, horas libres y una agenda que rechaza la hora llena |
| 41–52 s | Más tarde | «Once y cuarenta y siete de la noche. El [negocio] ya cerró… pero [quien atiende] sigue reservando. Y un día antes, llama para recordar la reserva. El cliente confirma de viva voz.» | 11:47 en neón; el local cerrado con una reserva entrando; una llamada de recordatorio con su onda de voz |
| 52–64 s | Cierre | «Misma cuadra. Mismo menú. La diferencia no está en la cocina. Está en el sistema.» + [frase de cierre] | La cuadra completa; [llamado a la acción] y el logo |

## 7. El sonido

### Narración (ElevenLabs)

- **Una sola voz** de la biblioteca de ElevenLabs, natural y con ritmo de tráiler, en el español de tu país. Nada de locutor de radio.
- **Modelo y ajuste:** `eleven_v3` con estabilidad ≈ 0,5.
- **Tomas:** genera dos tomas completas y elige la de mejor ritmo.
- **Pausas:** escribe la narración como se habla. Los puntos suspensivos dan la pausa («y nadie lo ve…»).
- **Claude:** con la toma elegida, obtén los tiempos de cada palabra (transcripción con tiempos de ElevenLabs o Whisper) y **ancla a esas marcas cada corte, cada subtítulo y cada golpe de música**.
- Usar ElevenLabs en publicidad requiere un plan de pago.

### Música (Eleven Music)

Instrumental generada **por secciones** con un plan de composición. Las duraciones de las secciones se calzan a la narración real (Eleven Music pide 3 s o más por sección). Si el golpe no cae justo, adelanta o atrasa la pista unas décimas: nosotros la adelantamos 0,8 s.

- **Estilo global:** `dark cinematic hybrid trailer score, deep orchestral brass and low strings fused with modern dark electronic synths, huge sub-bass impacts, braams and metallic risers, tense, premium, futuristic and thrilling, like a high-end tech product film, red and black mood, night city, adrenaline, polished cinematic mix that leaves room for a voiceover, instrumental only`.
- **Evitar:** `vocals, singing, rap, vocal chops, choir, cheesy corporate, happy, ukulele, pop, lo-fi crackle, cartoonish, muddy mix, long intro, fade in, acoustic guitar`.
- **Secciones:**
  1. *City* (gancho, hasta «lleno»): `dark night-city atmosphere, low drone, soft ticking pulse, sparse mysterious piano motif, tension slowly rising; in the last second a fast reverse swell`.
  2. *Night* (desde «lleno»): `a big cinematic impact with sub boom on the very first beat, then a tense filtered electronic pulse like a clock ticking under a voiceover`.
  3. *Cold* (el local vacío): `cold, empty and uneasy, the beat disappears, muted low heartbeat and icy detuned pads; in the last second a hard reverse riser into the drop`.
  4. *Drop* (desde «Aquí contesta»): `the full beat drops on the first beat: heavy kick, distorted bass and a hooky dark synth motif, confident, fast, premium`.
  5. *Late* (11:47): `late-night breakdown: the drums drop out, a steady sub pulse and warm night pads, intimate and calm but still tense`.
  6. *Rise* (recordatorio): `the beat comes back filtered and builds fast, stacked risers and a snare roll climbing to the climax`.
  7. *Climax* (cierre): `maximum energy on the first beat: full drums, braams and the main motif, triumphant but dark; the last half second cuts to a sudden silence`.
  8. *Finale* (logo): `one huge final cinematic hit with sub boom, then a wide, warm, hopeful sustained synth chord that rings out and ends in silence`.

### Ambiente y efectos (Freesound, solo CC0)

- **Qué buscar en freesound.org**, filtrando por licencia CC0 (dominio público):
  - ciudad de noche y tráfico lejano;
  - murmullo y risas de restaurante, ambiente de café, platos y cubiertos;
  - carros pasando, uno sobre calle mojada;
  - un teléfono viejo sonando;
  - un marcador y un garabato (la libreta);
  - una persiana metálica que baja;
  - una sirena lejana y un neón que se enciende;
  - dos golpes graves de cine.
- **Cómo se coloca:** cada sonido en su segundo exacto. La mezcla de ambiente sube y baja por escena: caliente en el local lleno y vacía en el frío.
- **Crédito:** anota en `CREDITOS.md` el título, el autor y el enlace de cada sonido. CC BY obligaría a dar crédito en el post, así que preferimos CC0.

### Mezcla

- La música baja cuando habla la voz (ducking con la envolvente de la narración).
- Volumen final a **−14 LUFS** integrados y un pico máximo de −1 dBTP.

## 8. Las reglas

- No inventes cifras, clientes ni testimonios. Los nombres, las horas y los precios son de ejemplo, y lo que lo necesite dice «de ejemplo».
- Las pantallas se ven como una app real, en oscuro, pero solo con funciones que el sistema del negocio tiene de verdad.
- Nada de emojis: usa íconos reales.
- Solo usa logos que tengas permiso de usar, incluidos los de WhatsApp e Instagram si los muestras.

## 9. Orden de trabajo (Claude)

1. Confirma los datos de la sección 1 y qué hace de verdad el sistema del negocio.
2. Escribe la **narración completa** y el **guion con tiempos**, más un **storyboard** de 8 a 10 cuadros (puede ser una página HTML con un dibujo por escena). **ALTO**: espera el OK.
3. Genera la narración: dos tomas, la persona elige una. Obtén los tiempos por palabra. **ALTO**: OK a la voz.
4. Construye la ciudad 3D y la toma del gancho. Muéstrala en la vista previa (`npx hyperframes preview`). **ALTO**: OK al look antes de seguir con las demás escenas.
5. Anima el resto, escena por escena, anclado a la narración. Corrige con lo que te digan en la vista previa.
6. Suma la cámara de cine: motion blur por submuestras, profundidad de campo y latigazos.
7. Genera la música por secciones, coloca el ambiente y los efectos, y mezcla.
8. Revisa:
   - `npx hyperframes lint` y unos snapshots por escena;
   - ningún subtítulo cortado y todos legibles al menos 1,5 s;
   - la ciudad sin titileo.

   **ALTO**: OK final antes de renderizar.
9. Renderiza el máster a 60 fps con GPU (`--browser-gpu`). Revisa el video terminado: duración, resolución, volumen a −14 LUFS y ningún titileo.
10. Entrega el video, una portada (un cuadro limpio sin subtítulos, con el título grande abajo) y `CREDITOS.md`.

---

Hecho por Kodecol (kodecol.co). ¿Prefieres que lo hagamos nosotros? WhatsApp 322 497 0950.
Claude y Claude Opus son marcas de Anthropic. HyperFrames es un proyecto de código abierto de HeyGen; three.js es de código abierto (MIT). Kodecol no está afiliada a ellos.
