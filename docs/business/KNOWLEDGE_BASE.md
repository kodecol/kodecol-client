# KNOWLEDGE_BASE.md — Kodecol

> Base de conocimiento del negocio: **qué es Kodecol, qué hace, qué vende, en qué cree y cómo habla.**
> Es la fuente de verdad para escribir copy, JSON de servicios, prompts de imagen, propuestas
> comerciales o cualquier pieza que hable en nombre de la marca.
>
> - **Diseño** (cómo se ve): [`DESIGN.md`](../../DESIGN.md) · valores exactos en [`DESIGN-SYSTEM.md`](../DESIGN-SYSTEM.md).
> - **Código** (cómo se construye): [`architecture.md`](../../architecture.md).
>
> Regla: este documento **describe**, no inventa. Todo dato comercial (clientes, cifras, precios)
> debe existir antes en la realidad y en el repo. Lo aspiracional se marca como tal.

---

## 1. Kodecol en una frase

> **Kodecol es una fábrica de software colombiana que construye tecnología con propósito:
> productos digitales, automatización e inteligencia artificial que resuelven problemas reales
> de empresas reales, sin perder la humanidad en el camino.**

| Pieza | Texto oficial |
|---|---|
| Tagline | **Tecnología con propósito.** |
| Sub-tagline | Fábrica de software · Crecimiento consciente. |
| Posicionamiento | Aliados de crecimiento consciente. |
| Manifiesto corto | No vendemos software. Construimos futuro. |
| Promesa del hero | El software que tu empresa necesita para crecer de verdad. |
| Idea fuerza | No construimos software para que exista: lo construimos para que **impacte**. |

Fuente en código: `src/shared/config/site_config.ts` (tagline, descripción) y los `content.ts`
de cada sección en `src/features/landing/`.

---

## 2. Ficha de la empresa

| Dato | Valor |
|---|---|
| Razón social | KODECOL S.A.S |
| NIT | 902095005-6 |
| Registro | Cámara de Comercio de Bogotá · matrícula 4140238 |
| Verificación pública | [RUES](https://www.rues.org.co/buscar/RM/kodecol) |
| País | Colombia |
| Sitio | https://kodecol.co |
| Canal comercial principal | WhatsApp — 322 497 0950 |
| Correo | ver `SITE_CONFIG.email` |

> Estos datos **no se copian en componentes**: la única fuente en código es `site_config.ts`.
> Aquí están para consulta humana. Si cambia el registro real, se cambian ambos.

---

## 3. Qué hacemos

Kodecol diseña, construye y opera software. Tiene dos líneas de negocio:

1. **Fábrica de software (servicios):** construimos para otras empresas, desde una automatización
   puntual hasta un producto digital completo.
2. **Marcas propias (producto):** construimos lo nuestro, lo operamos nosotros y lo llevamos al
   mercado con marca propia. Lo que funciona aquí se convierte en conocimiento para los clientes.

> *"Parte de lo que sabemos hacer lo probamos primero en nuestros propios productos."*

### 3.1 Para quién

Empresas colombianas —pymes en crecimiento y compañías medianas o grandes— que ya sienten el
costo de operar a mano, con sistemas que no se hablan o con herramientas genéricas que se
quedaron cortas. El interlocutor típico es quien decide o sufre la operación: gerencia, dirección
comercial, operaciones, tecnología.

No es para quien busca "una app porque toca tener app". Si el caso no pide software, se lo decimos.

---

## 4. Qué vendemos — los seis servicios

El orden es el del sitio (`order` en `content/services/*.json`). Cada servicio tiene su página en
`/servicios/<slug>`.

| # | Servicio | Promesa (headline) | Dolor que resuelve | Frase de cierre (nuestra postura) |
|---|---|---|---|---|
| 1 | **Automatización de procesos** · *servicio estrella* | Le devuelve **horas a tu equipo** | El costo invisible de hacerlo a mano: copiar y pegar entre Excel, ERP y correo; errores; sistemas que no se hablan; cero trazabilidad | Automatizamos para liberar a las personas, no para reemplazarlas sin criterio. |
| 2 | **IA a la medida** | Inteligencia artificial que **no inventa datos** | Todo el mundo quiere IA y casi nadie sabe para qué: modelos que alucinan, pilotos que no salen a producción, costos que se disparan | La IA entiende e interpreta. El dato lo calcula el sistema, y un humano confirma lo que importa. |
| 3 | **Desarrollo web** | Sitios que cargan rápido y **convierten de verdad** | Tener sitio no es tener presencia: lento en el celular, invisible en Google, visitas que no convierten | Un sitio se mide por lo que genera, no por lo que le gusta a quien lo aprobó. |
| 4 | **Aplicaciones móviles** | Apps que la gente **abre dos veces** | El cementerio de apps que nadie usa: apps que debían ser web, que se caen sin señal, imposibles de actualizar | La mejor app es a veces no hacer una app. Lo decimos antes de cobrarte por construirla. |
| 5 | **Apps de escritorio** | Software para operaciones que **no pueden parar** | No todo cabe en una pestaña: sin internet no hay operación, el navegador no habla con la balanza | Escritorio cuando el caso lo pide, nube cuando conviene. La decisión es del problema, no de la moda. |
| 6 | **Software a la medida** | Software hecho para cómo trabaja **tu empresa** | Cuando el enlatado ya no alcanza: la verdad vive en un Excel, licencias que crecen sin parar, procesos torcidos para caber | Construir a la medida no es siempre la respuesta. Cuando no lo es, te lo decimos. |

**Patrón común de todos los servicios** (y del copy que se escriba para uno nuevo):

- Se empieza por el **problema**, nunca por la herramienta.
- Se entrega **funcionando dentro de la operación**, documentado en español y sostenible sin
  depender de nosotros ("Lo que recibes, no lo que prometemos").
- Siempre hay una **salida honesta**: si el caso no necesita lo que vendemos, lo decimos.
- El código y la documentación son **del cliente**.

### 4.1 Marcas propias

| Marca | Qué es | Estado | Claim |
|---|---|---|---|
| **Axi Connect** | SaaS para vender por WhatsApp con agentes de IA | En producción · 3 empresas piloto · Colombia | *Vende en cada conversación.* |

Axi Connect es **la prueba más honesta de cómo trabajamos**: lo pensamos, lo construimos y lo
operamos. Su principio de diseño —**"el dato no pasa por la IA"**: los precios los calcula el
servidor, el agente no puede inventar un producto, un pago lo confirma una persona, si no sabe
escala— es el mismo que vendemos en *IA a la medida*.

Axi Connect tiene identidad propia (coral, con violeta y ámbar en la α). Ver "Marca invitada"
en `architecture.md` §6. Su prueba más concreta (agosto de 2026, hamburguesería piloto): el
cliente saludó a las 6:09 p. m., el pedido quedó creado a las 6:14 y entregado a las 6:17, sin
que nadie del negocio tocara el teléfono. En el sitio de Kodecol no se publican sus precios.

### 4.2 Cómo se vende

- **Entrada:** WhatsApp o solicitud de cotización. Cada servicio tiene un mensaje precargado
  ("Hola Kodecol, quiero automatizar un proceso de mi empresa.").
- **Primer paso:** diagnóstico. Entender el proceso real (no el del manual) y priorizar por retorno.
- **Relación:** aliado, no proveedor. Nos involucramos en el resultado.
- **No publicamos precios** en el sitio: cada proyecto se cotiza tras entender el caso.

---

## 5. Prueba social

Empresas que ya construyen futuro con Kodecol (barra de confianza del hero):

**PERPLEX GROUP · QUÁNTICA · FEDEGOLF · TERPEL · ACERTEMOS**

MEGAGUAY cambió de nombre a **PERPLEX GROUP** (nov. 2026). Los nombres de la barra van todos
en mayúsculas para que se lean parejos.

> Solo se añade un nombre cuando hay relación real y permiso para mostrarlo. Nada de logos de
> relleno, testimonios inventados ni `aggregateRating` (ver `architecture.md` §10, regla 4).

### 5.1 Proyectos publicados (/proyectos)

| Proyecto | Qué es | Estado |
|---|---|---|
| **Neon Night** | E-commerce de relojes, joyas y perfumes de lujo (Bogotá): catálogo por líneas, pago con Bold, panel propio | En producción · neonightonline.com |
| **The Brothers Inc** | Estudio de grabación y sello (Bogotá): reproductor persistente, tienda de drops, reservas y agenda por WhatsApp con Axi | En producción · thebrothersinc.co · **falta el permiso escrito del cliente** |
| **Ducks Machine** | Taller de rotulación de vehículos (Campbell, California): van 3D que se rotula con el scroll, configurador, cotización por WhatsApp | En construcción · no publicado |

Fuente en código: `content/projects/*.json`. Ningún proyecto lleva cifras de resultados
inventadas: solo lo que se ve en el sitio y lo que dice su código.

---

## 6. Filosofía — el SOUL de Kodecol

> **Creemos en empresas que crecen sin destruir, que innovan sin olvidar y que avanzan sin perder
> humanidad.**

Cada solución busca hacer al cliente **más eficiente, más responsable y más sostenible**.

### 6.1 Los cuatro pilares

| Pilar | Qué significa en la práctica |
|---|---|
| 🎯 **Tecnología con propósito** | Construimos pensando en el mañana: soluciones que optimizan recursos y reducen desperdicios. Si algo no resuelve un problema real, no se construye. |
| 🌿 **Automatización consciente** | Automatizamos para **liberar** a las personas, no para reemplazarlas sin criterio. La máquina hace lo repetitivo; la persona vuelve a lo que necesita criterio. |
| ⭐ **Calidad que se siente** | Software útil, inteligente y bien hecho, con diseño cuidado y pensamiento estratégico. Rápido en gama baja, accesible, medible. |
| 🤝 **Aliado, no proveedor** | Nos involucramos en tu crecimiento. Tu resultado es nuestro objetivo. |

### 6.2 Principios de trabajo (lo que nos distingue en la mesa)

1. **Honestidad antes que venta.** Decimos cuándo no hace falta una app, una IA o un desarrollo a la medida.
2. **Problema primero, herramienta después.** Nadie compra "IA": compra horas, ventas o menos errores.
3. **El humano confirma lo que importa.** Pagos, aprobaciones y decisiones críticas no se automatizan a ciegas.
4. **Sostenible también es mantenible.** Documentado, con código del cliente, que otro equipo pueda tomar.
5. **Lo probamos en casa.** Lo que recomendamos lo operamos en nuestros propios productos.

---

## 7. Concepto de marca — *Raíz y circuito*

> **Kodecol es tecnología que crece como algo vivo.**
> Naturaleza y computación no son opuestos: las dos son sistemas que conectan, se adaptan y duran.

La marca vive en el cruce de tres territorios:

### 7.1 Lo natural — *crecer sin destruir*
El verde de Kodecol no es un color corporativo cualquiera: es **musgo, bosque de niebla, páramo,
cafetal**. Representa el crecimiento consciente: orgánico, paciente, que se ramifica y echa raíces
en vez de arrasar. La tecnología bien hecha se parece a un ecosistema: cada pieza cumple una
función y nada sobra.

### 7.2 Lo retro — *tecnología que dura*
Un computador beige sobre una colina de pasto, fósforo verde en una pantalla CRT, el clic de un
teclado mecánico. Lo retro es **nostalgia honesta**: recuerda una época en que las máquinas se
hacían para durar y se entendían. Es la antítesis del software desechable y del "hype" del mes.
Kodecol hace tecnología de hoy con el espíritu de la que duraba.

### 7.3 Lo colombiano — *construido aquí, para aquí*
Kodecol es colombiana y lo dice con orgullo. Talento local, empresas locales, problemas locales
(la mala señal en bodega, la facturación que no puede parar, el negocio que vende por WhatsApp).
El paisaje colombiano —cordillera, niebla, selva, sabana, flor— es el escenario natural de la marca.

**Orgullo sin folclor de postal:** Colombia se expresa en la luz, el paisaje, el acento y los
problemas que resolvemos, no en sombreros vueltiaos, banderas ni clichés turísticos.

### 7.4 Metáforas de marca (banco para copy e imagen)

| Metáfora | Uso |
|---|---|
| Raíces / echar raíz | Relaciones de largo plazo, software que se queda |
| Ramificar / crecer | Escalar, nuevos módulos, crecimiento del cliente |
| Ecosistema | Integraciones, sistemas que se hablan |
| Sembrar / cosechar | Inversión en tecnología → resultados |
| Niebla que se levanta | Claridad, datos, trazabilidad |
| Máquina en el paisaje | La tecnología al servicio de lo vivo, no al revés |

> Usarlas con mesura: una metáfora por pieza. Si todo "florece", nada florece.

---

## 8. Voz y acento

Kodecol habla **como un colega colombiano que sabe mucho y no necesita demostrarlo**.

### 8.1 Rasgos

| Rasgo | Cómo se nota |
|---|---|
| **Cálida y cercana** | Tuteo (*tú*, *tu empresa*, *tu equipo*). Nunca "usted" corporativo ni "vosotros". |
| **Concreta** | Cifras, ejemplos y escenas reales: "copiar datos de un sistema a otro", "la balanza", "la bodega sin señal". |
| **Honesta** | Admite límites: "a veces no hacer una app es la mejor app". |
| **Con humor seco** | Imágenes que se quedan: *"el cementerio de apps que nadie usa"*, *"el proveedor de internet tuvo una mañana mala"*. |
| **Segura, no arrogante** | Afirma sin superlativos. La prueba es el producto, no el adjetivo. |
| **Español colombiano neutro** | Léxico de aquí (*celular*, *computador*, *cotización*, *bodega*), sin regionalismos que excluyan ni modismos forzados. |

### 8.2 Palabras

| ✅ Sí | ❌ No |
|---|---|
| construir, resolver, liberar, crecer, sostener | disruptivo, revolucionario, sinergia, *best-in-class* |
| propósito, consciente, criterio, real | "soluciones integrales 360°", "líderes del mercado" |
| tu equipo, tu operación, tu empresa | "el usuario final", "stakeholders" (en copy público) |
| celular, computador, cotización | móvil (como sustantivo), ordenador, presupuesto (como sinónimo de cotización) |
| inteligencia artificial / IA, con un para qué | "IA" como adorno, sin problema detrás |

### 8.3 Estructura de un buen titular Kodecol

Frase directa + **remate en énfasis** (el sitio lo pinta con acento de color o itálica):

- *Automatización de procesos que le devuelve* **horas a tu equipo.**
- *Inteligencia artificial que* **no inventa datos.**
- *El software que tu empresa necesita para* **crecer de verdad.**

### 8.4 Antes / después

| Antes (genérico) | Después (Kodecol) |
|---|---|
| Ofrecemos soluciones tecnológicas innovadoras de clase mundial. | Construimos el software que tu empresa necesita para crecer de verdad. |
| Potenciamos tu negocio con IA de última generación. | IA que entiende e interpreta. Los precios los calcula tu sistema. |
| Desarrollamos apps móviles a la medida. | Apps que la gente abre dos veces. |
| Optimizamos tus procesos para maximizar la eficiencia. | Convertimos el trabajo repetitivo en flujos que corren solos, para que tu equipo vuelva a lo que sí necesita criterio. |

---

## 9. La crew

| Persona | Rol | Foco |
|---|---|---|
| Cristian David Velásquez | Fundador y CTO | Automatización, IA y arquitectura cloud |
| Juan Carlos López | CMO · Director de mercadeo | Marca, posicionamiento y generación de demanda |

Invitación abierta: *"¿Eres desarrollador/a y compartes el crecimiento consciente? Únete a la crew."*

Fuente en código: `src/features/landing/team/content.ts` y `content/developers/*.json`.

---

## 10. Cómo usar y mantener este documento

**Úsalo para:**
- Escribir o revisar copy de la landing (`content.ts`) y de servicios (`content/services/*.json`).
- Redactar un servicio o marca propia nueva (seguir el patrón del §4).
- Escribir prompts de imagen y briefs de dirección de arte (con el §7 y `DESIGN.md` §11).
- Propuestas comerciales, perfiles en redes, presentaciones.

**Actualízalo cuando:**
- Se añada, quite o reordene un servicio o una marca propia.
- Cambie un cliente de la barra de confianza, un miembro de la crew o un dato legal.
- Cambie el tagline, el posicionamiento o un pilar de la filosofía.

**Checklist rápido antes de publicar copy:**
1. ¿Empieza por un problema real del cliente?
2. ¿Suena a colega colombiano, con tuteo y sin jerga vacía?
3. ¿Hay al menos una escena concreta (una bodega, una balanza, un Excel)?
4. ¿Tiene su salida honesta o su "no te vamos a vender humo"?
5. ¿Ningún dato inventado?
