# Presione uno · guía para Claude

> De la **Biblioteca de Kodecol** (kodecol.co/biblioteca/guias/presione-uno). Así hicimos el reel «Presione uno» con Claude Opus 5.5 y HyperFrames.
> **Para ti, la persona:** llena la sección 1 con los datos de tu negocio. Luego, en Claude Code, deja este archivo en la carpeta del proyecto y escribe «Lee presione-uno.claude.md y empecemos». En claude.ai, adjúntalo al chat.
> **Para ti, Claude:** este archivo es el brief completo. Trabaja en el orden de la sección 8 y detente en cada punto marcado con **ALTO**: ahí esperas el OK de la persona antes de seguir.

---

## 1. El negocio (lo llena la persona)

- **Nombre del negocio:** [tu negocio]
- **Qué vende y dónde:** [qué vendes, en qué ciudad]
- **Producto del ejemplo:** [un producto real, con talla, color o presentación]
- **Quién atiende en el video:** [una persona de tu equipo o tu asistente virtual, con su nombre]
- **Nombre del cliente del video:** [un nombre común; de ejemplo]
- **Frase principal:** [tu mensaje en una línea]
- **Llamado a la acción:** [qué quieres que haga quien lo vea: escribir por WhatsApp, visitar la tienda…]
- **Logo:** [ruta al logo, si tienes permiso de usarlo; si no, solo el nombre en texto]

Claude: si falta algún dato, pregúntalo una sola vez y con todos los campos juntos. No inventes datos del negocio.

## 2. La idea

El cliente llama y le contesta una máquina: «Para continuar, presione uno». Eso cuesta ventas. La grabación se frena como una cinta, alguien dice «Arreglemos esto.», y ahora contesta [quien atiende], que resuelve el pedido en segundos. Cierra con la escala: decenas de mensajes respondidos.

## 3. Formato

- Vertical 9:16, 1080 × 1920, 60 fps, entre 30 y 40 segundos.
- Hecho con **HyperFrames**: HTML, CSS y GSAP que se renderizan a MP4. Una composición raíz con una línea de tiempo en pausa; nada de animaciones que dependan del reloj real.
- Los primeros 3 segundos se entienden sin sonido.
- **Fondo siempre claro.** Títulos grandes, planos y anchos, como portada de revista: sin bordes, sombras ni 3D en las letras, y con aire entre ellas para que no se monten.
- La interfaz va **dentro de la pantalla del celular** y es minimalista. Nada de tarjetas flotando encima del teléfono.
- Transiciones rápidas y naturales. Cuando la cámara termina de moverse, se queda quieta para que se pueda leer la pantalla.
- Cada texto se queda quieto al menos 1,5 s. Una tarjeta con cifras, de 2 a 3 s.

## 4. La historia, en 5 actos

1. **Gancho (0–3 s).** Un celular 3D acostado sobre una superficie blanca, con la cámara a ras de la mesa. Suena un timbre de celular común. Detrás, de pie y gigante, «Cliente llamando», con un reflejo suave en la mesa.
2. **El problema (3–7 s).** Contesta una contestadora con voz robótica: «Gracias por llamar. Para continuar, presione uno. Para escu—». La imagen se enfría y alrededor flotan mensajes de clientes sin responder, cada uno con su hora.
3. **El corte (7–8 s).** La grabación se frena en seco, como una cinta que se detiene (0,2 s). Cae un velo claro con desenfoque y una voz dice «Arreglemos esto.», que también aparece grande en pantalla.
4. **La solución (8–24 s).** Contesta [quien atiende], dentro de la pantalla del celular: su nombre, una onda de voz y la transcripción por turnos.
   - El cliente pide [producto]. Le confirman que hay y cuándo le llega, y le preguntan «¿Te lo separo?». El cliente responde «¡Sí, de una!».
   - El pedido aparece en la misma pantalla con «Pago por confirmar» y cifras de ejemplo. La cámara se acerca al pedido.
5. **La escala y el cierre (24–36 s).**
   - Decenas de tarjetas de mensajes se van respondiendo en onda, de arriba abajo. Las del centro llevan mensajes reales y un avatar con iniciales; las lejanas van en boceto.
   - Aparece «[frase principal]» y cierra con [llamado a la acción] y el logo.
   - El último cuadro empalma con el primero para que el bucle no se note.

## 5. El sonido

### Voces (ElevenLabs)

| Papel | Qué buscar | Ajustes |
|---|---|---|
| Contestadora | Voz robótica de la biblioteca de ElevenLabs, plana, de conmutador | Modelo `eleven_multilingual_v2` o `eleven_v3`; frase cortada en «escu—» |
| [quien atiende] | Voz cálida y cercana, en el español de tu país | Estabilidad ≈ 0,5. Pruébala con la frase real, no con la de muestra |
| «Arreglemos esto.» | Voz firme y corta; puede ser la tuya | Una sola frase |
| Cliente | **Una voz real**, grabada con el celular por alguien del equipo | Límpiala con Auphonic o similar: ruido fuera y volumen parejo |

- Genera cada frase por separado y en dos o tres tomas, y quédate con la más natural.
- Usar voces de ElevenLabs en publicidad requiere un plan de pago.
- **Claude:** cuando estén las voces, mide el inicio y el fin de cada palabra (con la transcripción con tiempos de ElevenLabs o con Whisper) y **ancla todos los tiempos de la animación a esas marcas**. Nunca al revés.

### Música (Eleven Music)

Instrumental generada por secciones con un plan de composición. Entra cuando el cliente termina «¡Sí, de una!» y llega hasta el final.

- **Estilo global:** `old money luxury drill instrumental, classy and confident attitude, 142 bpm UK drill rhythm, elegant dark piano and pizzicato orchestral strings, harpsichord accents, deep sliding 808 bass glides, crisp drill hi-hats with triplet rolls, polished radio-ready mix, instrumental only`.
- **Evitar:** `vocals, rap, singing, vocal chops, lo-fi, pop, edm, rock, happy, cartoonish, muddy mix, long intro`.
- **Secciones** (Eleven Music pide 3 s o más por sección; calza las duraciones a tus escenas reales):
  1. *Drop* (≈ 3,2 s): `full beat drops on the very first beat with a heavy 808 and a string stab, no intro`.
  2. *Groove* (≈ 6,2 s): `the drill groove rides with the piano and strings motif, 808 slides, hi-hat rolls`.
  3. *Ending* (≈ 4,6 s): `the motif resolves on a final 808 hit and a sustained string chord, drums stop in the last second`.
- No siempre respeta las secciones: escucha cada toma y genera otra si el golpe no cae donde debe.

### Efectos

- **Timbre:** un timbre de celular real y reconocible, no sintetizado. Nosotros usamos «Cell Ringtone» de Freesound, CC0.
- **Vibración, clic, brillo, barridos:** de dominio público (CC0) o de la licencia de Pixabay. HyperFrames trae una biblioteca de sonidos.
- **Licencias:** CC0 y Pixabay se usan libres. CC BY obliga a poner el crédito en la descripción del post. Anota cada sonido con su autor y su enlace en `CREDITOS.md`.

### Mezcla

- Voces adelante. La música baja cuando alguien habla.
- Volumen final a **−14 LUFS** integrados y un pico máximo de −1 dBTP, el nivel de Instagram y TikTok.

## 6. Las reglas

- No inventes cifras, clientes ni testimonios. Si un precio o un negocio es de ejemplo, que diga «de ejemplo» en pantalla.
- Si quien atiende es un asistente virtual, que en pantalla diga «Atendida por un asistente virtual».
- Nada de emojis: usa íconos reales.
- Solo usa logos que tengas permiso de usar.
- Las pantallas del celular se ven como una app real, pero no copies la marca de ninguna app que no sea tuya.

## 7. Lo que tiene que salir

- `index.html` (la composición), las escenas y los recursos en `assets/`.
- `renders/<nombre>_9x16_master.mp4`: 1080 × 1920, 60 fps, −14 LUFS.
- `CREDITOS.md` con las voces, la música y cada efecto, con su licencia.
- Una portada: un cuadro limpio del video, sin subtítulos, con el título grande abajo.

## 8. Orden de trabajo (Claude)

1. Confirma los datos de la sección 1.
2. Escribe el **guion con tiempos**: actos, segundo a segundo, qué se ve y qué se oye, y el texto exacto de cada voz. **ALTO**: espera el OK.
3. Genera o recibe las voces. Mide sus tiempos y ajusta el guion a ellas. **ALTO**: que la persona escuche y apruebe las voces.
4. Anima escena por escena en HyperFrames. Muestra cada escena en la vista previa (`npx hyperframes preview`) y corrige con lo que te digan.
5. Agrega la música y los efectos, y mezcla.
6. Revisa: `npx hyperframes check` sin errores, sin textos cortados, cada texto legible al menos 1,5 s y los primeros 3 s claros sin sonido. **ALTO**: OK final antes de renderizar.
7. Renderiza el máster a 60 fps y verifica la duración, la resolución y el volumen (−14 LUFS).
8. Entrega el video, la portada y `CREDITOS.md`.

---

Hecho por Kodecol (kodecol.co). ¿Prefieres que lo hagamos nosotros? WhatsApp 322 497 0950.
Claude y Claude Opus son marcas de Anthropic. HyperFrames es un proyecto de código abierto de HeyGen. Kodecol no está afiliada a ellos.
