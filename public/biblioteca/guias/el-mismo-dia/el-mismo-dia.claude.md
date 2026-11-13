# El mismo día · guía para Claude

> De la **Biblioteca de Kodecol** (kodecol.co/biblioteca/guias/el-mismo-dia). Así hicimos el reel «El mismo día» con Claude Fable 5.2 y HyperFrames.
> **Para ti, la persona:** llena la sección 1 con los datos de tu negocio. Luego, en Claude Code, deja este archivo en la carpeta del proyecto y escribe «Lee el-mismo-dia.claude.md y empecemos». En claude.ai, adjúntalo al chat.
> **Para ti, Claude:** este archivo es el brief completo. Trabaja en el orden de la sección 9 y detente en cada punto marcado con **ALTO**: ahí esperas el OK de la persona antes de seguir.

---

## 1. El negocio (lo llena la persona)

- **Nombre del negocio:** [tu negocio]
- **Qué vende y dónde:** [qué vendes, en qué ciudad]
- **El producto de la foto:** [un producto llamativo, con su precio y sus tallas o variantes]
- **Quién atiende:** [tu asistente o una persona de tu equipo, con su nombre]
- **La clienta o el cliente de ejemplo:** [nombre] y su ciudad de entrega
- **Qué hace de verdad tu sistema:** [p. ej.: reconoce fotos y cotiza, contesta audios con voz, escribe primero a quien no volvió, envía promociones por el canal oficial]
- **Colores:** [el color de tu marca para el día bueno; el rojo de alerta se queda para el día malo]
- **Llamado a la acción:** [qué quieres que haga quien lo vea]
- **Logo:** [ruta al logo, si tienes permiso de usarlo; si no, solo el nombre en texto]
- **Modelo 3D del celular:** [ruta a un GLB con licencia para publicidad]

Claude: si falta algún dato, pregúntalo una sola vez y con todos los campos juntos. Muestra en pantalla **solo lo que el sistema del negocio hace de verdad**: si una escena no aplica, propón otra y no la inventes.

## 2. La idea

Te acaban de restringir el WhatsApp de tu negocio, con todos tus clientes adentro. ¿Por qué? Porque copiaste y pegaste la misma promoción trescientas veces. Ahora mira ese mismo día con [quien atiende]: la foto se cotiza sola, el audio se contesta con voz, a quien no volvió se le escribe primero y la promoción sale por el canal oficial. Al final, el WhatsApp sigue ahí, vendiendo.

## 3. Formato

- Vertical 9:16, 1080 × 1920, 60 fps, entre 35 y 40 segundos.
- Hecho con **HyperFrames** (HTML, CSS, GSAP y three.js que se renderizan a MP4):
  - una línea de tiempo en pausa;
  - todo determinista: nada de `Date.now()`, `Math.random()` sin semilla ni `requestAnimationFrame`;
  - la escena 3D se dibuja en función del tiempo de la línea.
- **Narración de principio a fin** con subtítulos grandes de dos tamaños: la frase normal y la palabra clave más grande y en color. Cada subtítulo se queda al menos 1,5 s.
- **Ritmo:** un cambio cada 2 a 4 s, y cada bloque abre con una pregunta que el plano siguiente responde.
- **Dos mundos de color:** rojo de alerta para el día a mano y el color de la marca para el día con [quien atiende]. El cambio ocurre en una sola vuelta del celular.

## 4. El celular y su pantalla

- **Un solo celular 3D** es el protagonista de principio a fin. Nada de paneles, tarjetas ni gráficos al lado: la cámara es la que se acerca a la foto, al audio, al pedido y a la promoción.
- **La pantalla se dibuja en un lienzo 2D** que se usa como textura de la pantalla del modelo. No uses HTML dentro del 3D: en el render y en la vista previa se ven distintos.
- **El chat** se parece a una app real en tema oscuro: burbujas del cliente y del negocio, nota de voz con su onda, tarjeta de pedido. Datos de ejemplo.
- **En el lienzo**, cambia `arcTo` por `arc` para las esquinas redondeadas: con aceleración por GPU, `arcTo` puede dibujar moños.
- **Letreros gigantes de pie** detrás del celular («Número restringido.», «Todo al día.»), con aire para las letras que bajan (g, p, y).
- **Sin parpadeo:** nada en pantalla debe cambiar más de unas 4 veces por segundo. Un enjambre de burbujas que cambia a 9 Hz se ve como parpadeo en el video terminado aunque la vista previa se vea bien.

## 5. La cámara de cine

- **Motion blur real:** acumula varias submuestras por cuadro en un lienzo 2D, repartidas en el tiempo de obturación.
- **Sobrevuelo** del celular acostado en el gancho; luego la cámara **sube** para que se lea la pantalla.
- **Acercamientos extremos** a cada función, con la mira siguiendo la pantalla. Un acercamiento hasta «Pago por confirmar» en el pedido.
- **Salida de golpe** para la promoción y vuelta a entrar.
- Cuando la cámara se detiene, se queda quieta lo suficiente para leer. Curvas suaves; nada lineal.

## 6. La historia y la narración

N = narrador · C = la clienta (nota de voz) · A = [quien atiende] (respuesta con voz).

| Tiempo | Bloque | Narración (adáptala a tu negocio) | Qué se ve |
|---|---|---|---|
| 0–5 s | Gancho | N: «Te acaban de restringir el WhatsApp de tu negocio… con todos tus clientes adentro.» | Sobrevuelo del celular; en «restringir» todo se pone rojo y cae «Número restringido.»; la cámara sube a la pantalla |
| 5–9 s | Por qué | N: «¿Por qué? Copiaste y pegaste la misma promoción… ¡trescientas veces!» | El contador corre de 0 a 300 y sale un enjambre de burbujas grises |
| 9–12 s | Rebobinado | N: «Ahora mira el mismo día… con [quien atiende].» | El celular da una vuelta, el enjambre regresa y el mundo cambia al color de la marca (drop de la música) |
| 12–16 s | La foto | N: «[La clienta] manda una foto. [Quien atiende] la reconoce, y cotiza con tu precio.» | La foto del producto; un barrido la reconoce («[producto] · [talla]»); la respuesta con el precio |
| 16–23 s | El audio | N: «¿Y si pregunta por audio?» · C: «¿Me llega antes del sábado?» · A: «¡Sí, [la clienta]! A [ciudad] te llega el viernes.» | Acercamiento a la nota de voz de la clienta y luego a la respuesta, con la onda moviéndose con la voz |
| 23–27 s | Seguimiento | N: «¿No volvió a escribir? [Quien atiende] le escribe primero… y cierra el pedido.» | Mensaje que sale primero, «Sí, la quiero», el pedido y el acercamiento a «Pago por confirmar» |
| 27–31 s | Promoción | N: «¿Y tu promoción? Sale sin copiar ni pegar, por el canal oficial.» | La cámara sale de golpe; trescientos mensajes en filas ordenadas |
| 31–39 s | Cierre | N: «El mismo día… y tu WhatsApp sigue ahí, vendiendo.» + [llamado a la acción] | El encuadre del gancho con «Todo al día.», el logo y el llamado |

## 7. El sonido

### Voces (ElevenLabs)

- **Narrador:** una voz natural y cercana de la biblioteca, con `eleven_multilingual_v2`, estabilidad 0,3, similitud 0,85, estilo 0,5 y velocidad 1,1, en el español de tu país.
- **Una sola toma:** genera la narración COMPLETA de una vez y córtala por frases en los silencios. Generadas una por una, algunas frases terminan «arriba», como si faltara algo.
- **La clienta:** voz joven con `eleven_v3`, filtrada como nota de voz (pasabanda de teléfono y un poco de compresión).
- **[Quien atiende]:** voz cálida y segura con `eleven_v3`.
- **Claude:** con las tomas elegidas, obtén los tiempos de cada frase y **ancla a esas marcas cada corte, cada subtítulo y el drop de la música**.
- Usar ElevenLabs en publicidad requiere un plan de pago.

### Música (Eleven Music)

Plan de composición por secciones a **120 bpm exactos**. Eleven Music no siempre respeta las secciones: si los cortes no caen, rearma la pista por compases (a 120 bpm un compás dura 2 s) para que el drop caiga justo en el cambio de mundo.

- **Estilo global:** `dark premium cinematic electronic instrumental for a tech product film`, `exactly 120 bpm, 4/4, steady grid`, `deep sub bass, tight punchy kick, crisp minimal percussion, glassy analog synth plucks`, `sleek, confident, expensive, modern`, `minor key`, `polished mix that leaves room for a voiceover`, `instrumental only`.
- **Evitar:** `vocals, singing, vocal chops, cheesy corporate, happy ukulele, rock guitars, dubstep wobble, lo-fi crackle, cartoonish, muddy mix, tempo changes, fade in`.
- **Secciones:**
  1. *Alarm* (6 s): `starts immediately with a heavy dark impact and a low ominous drone, tense ticking pulse, no drums yet, feeling of something just went wrong`.
  2. *Frantic* (10 s): `anxious fast ticking sixteenth-note pulse and rising tension, nervous arpeggio climbing, filtered kick building; in the final bar everything cuts to a single reversed swell`.
  3. *Drop* (36 s): `the full beat drops on the first beat: deep bass groove, four-on-the-floor kick, clean claps, confident head-nodding groove under a voiceover, glassy synth motif with small variations every four bars, calm, in control, premium`.
  4. *Resolve* (14 s): `warmer uplifting chords join the same groove, triumphant but restrained; a big final hit on the last downbeat and the chord rings out naturally`.

### Efectos

- Digitales y limpios: vibración del celular, impactos graves, barridos, tecleo, clics suaves, un brillo y un pop. **Nada de campanas, timbres ni ticks metálicos.**
- Cada corte o verbo con su propio sonido; no repitas el mismo efecto en todos los cortes.
- Solo CC0 (Freesound filtrando por licencia) o sintetizados con código: tonos, subgraves y el rebobinado.
- Anota en `CREDITOS.md` el título, el autor y el enlace de cada sonido.

### Mezcla

- La música baja cuando hablan las voces (ducking con la envolvente de la narración).
- Volumen final a **−14 LUFS** integrados y un pico máximo de −1 dBTP.

## 8. Las reglas

- No prometas lo que no pasa: no digas «nunca te van a bloquear». Muestra lo que el sistema hace (canal oficial, un mensaje por contacto, solo a quien ya escribió).
- El aviso de restricción es genérico, sin la interfaz ni los logos de WhatsApp ni de otras apps.
- El pago no se confirma solo si en tu negocio lo confirma una persona: muéstralo como «Pago por confirmar».
- No inventes cifras, clientes ni testimonios. Nombres, cifras y precios son de ejemplo.
- Nada de emojis: usa íconos reales. Solo logos que tengas permiso de usar.
- Fotos de producto propias o con licencia (Unsplash, por ejemplo), sin rostros si no tienes autorización.

## 9. Orden de trabajo (Claude)

1. Confirma los datos de la sección 1 y qué hace de verdad el sistema del negocio.
2. Escribe la **narración completa** y el **guion con tiempos**, más un **storyboard** de 8 cuadros (puede ser una página HTML con un dibujo por bloque). **ALTO**: espera el OK.
3. Genera las voces: la narración en una sola toma, cortada por frases, y las dos voces del chat. **ALTO**: OK a las voces.
4. Monta el celular 3D, la pantalla en lienzo 2D y la toma del gancho. Muéstrala en la vista previa (`npx hyperframes preview`). **ALTO**: OK al look antes de seguir.
5. Anima el resto, bloque por bloque, anclado a la narración. Corrige con lo que te digan en la vista previa.
6. Suma la cámara de cine: motion blur por submuestras, acercamientos y la salida de golpe.
7. Genera la música por secciones, rearma por compases si hace falta, coloca los efectos y mezcla.
8. Revisa:
   - `npx hyperframes lint` y unos snapshots por bloque;
   - ningún subtítulo ni letrero cortado, y todos legibles al menos 1,5 s;
   - nada que cambie más de unas 4 veces por segundo.

   **ALTO**: OK final antes de renderizar.
9. Renderiza el máster a 60 fps con GPU (`--browser-gpu`). Revisa el video terminado: duración, resolución, volumen a −14 LUFS y ningún parpadeo.
10. Entrega el video, una portada (un cuadro limpio sin subtítulos, con el título grande abajo) y `CREDITOS.md`.

---

Hecho por Kodecol (kodecol.co). ¿Prefieres que lo hagamos nosotros? WhatsApp 322 497 0950.
Claude y Claude Fable son marcas de Anthropic. HyperFrames es un proyecto de código abierto de HeyGen; three.js es de código abierto (MIT). WhatsApp es una marca de Meta. Kodecol no está afiliada a ellos.
