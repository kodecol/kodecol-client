"use client";

import gsap from "gsap";
import * as React from "react";

/**
 * Carrusel en órbita: los videos giran en un anillo 3D.
 *
 * Mezcla dos componentes que propuso Cristian (7 nov. 2026):
 * - de «Circular Gallery» toma el anillo 3D, la profundidad y la opacidad que
 *   cae con el ángulo;
 * - de «Card Fan Carousel» (GSAP) toma el abanico: las tarjetas laterales se
 *   inclinan y bajan un poco, la del frente se levanta al pasar el cursor y
 *   todo se acomoda con un rebote elástico corto.
 *
 * Está pensado primero para el celular y para el navegador interno de Instagram:
 * - se arrastra con el dedo, con inercia y con imán a la tarjeta más cercana;
 * - solo la tarjeta del frente tiene un <video>; las demás muestran su imagen;
 * - avanza solo cada pocos segundos, pero se detiene si la persona lo toca, si
 *   sale de pantalla o si pidió menos movimiento.
 *
 * Con pocas guías el anillo se ve vacío, así que los elementos se repiten hasta
 * `min_ring`. Las copias son decorativas: salen del orden de tabulación y del
 * árbol de accesibilidad.
 */

export interface OrbitItem {
  id: string;
  title: string;
  /** Segunda línea corta: el tipo de video, el nivel, la fecha. */
  meta?: string;
  /** Imagen 9:16 que se ve mientras la tarjeta no está al frente. */
  poster: string;
  /** Clip corto, mudo y en bucle para la tarjeta del frente. */
  video?: string;
  href?: string;
  /** Texto del botón de la tarjeta del frente. */
  cta?: string;
}

interface OrbitCarouselProps {
  items: readonly OrbitItem[];
  /** Nombre accesible de la región. */
  label: string;
  /** Mínimo de tarjetas en el anillo (las guías se repiten hasta llegar). */
  min_ring?: number;
  /** Segundos entre un avance automático y el siguiente. 0 lo desactiva. */
  autoplay_seconds?: number;
  /** Se llama cuando cambia la tarjeta del frente (índice en `items`). */
  on_active_change?: (index: number) => void;
  className?: string;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;
/** Ángulo en (-180, 180]. */
const wrap180 = (deg: number) => {
  const a = mod(deg, 360);
  return a > 180 ? a - 360 : a;
};

export function OrbitCarousel({
  items,
  label,
  min_ring = 10,
  autoplay_seconds = 5,
  on_active_change,
  className,
}: OrbitCarouselProps) {
  /* múltiplo exacto de las guías: así dos vecinas nunca son la misma tarjeta */
  const ring_count = items.length === 0 ? 0 : Math.ceil(Math.max(min_ring, items.length) / items.length) * items.length;
  const ring = React.useMemo(
    () => Array.from({ length: ring_count }, (_, i) => ({ item: items[i % items.length], copy: i >= items.length })),
    [items, ring_count],
  );
  const step = ring_count ? 360 / ring_count : 0;

  const stage_ref = React.useRef<HTMLDivElement>(null);
  const card_refs = React.useRef<(HTMLElement | null)[]>([]);
  const state = React.useRef({ rot: 0, radius: 420, card_w: 240, dragging: false, hovered: false, visible: true });
  const tween = React.useRef<gsap.core.Tween | null>(null);
  const [active_ring, set_active_ring] = React.useState(0);
  const [reduced, set_reduced] = React.useState(false);

  const active_item = ring_count ? mod(active_ring, items.length) : 0;

  /* Pinta el anillo con el ángulo actual. Escribe estilos directo: nada de
     re-render por cuadro. */
  const apply = React.useCallback(() => {
    const { rot, radius } = state.current;
    for (let i = 0; i < ring_count; i++) {
      const el = card_refs.current[i];
      if (!el) continue;
      const theta = wrap180(i * step + rot);
      const t = Math.abs(theta) / 180; // 0 al frente, 1 atrás
      /* el abanico: las laterales se inclinan hacia afuera y bajan */
      const tilt = theta * 0.09;
      const dip = t * t * 46;
      el.style.transform = `translate(-50%, -50%) rotateY(${theta}deg) translateZ(${radius}px) translateY(${dip}px) rotateZ(${tilt}deg)`;
      el.style.opacity = String(Math.max(0, 1 - t * 1.25));
      el.style.filter = `brightness(${(1 - t * 0.7).toFixed(3)}) saturate(${(1 - t * 0.5).toFixed(3)})`;
      el.style.zIndex = String(1000 - Math.round(t * 1000));
      el.style.visibility = t > 0.62 ? "hidden" : "visible";
    }
    const front = mod(Math.round(-rot / step), ring_count);
    set_active_ring((prev) => (prev === front ? prev : front));
  }, [ring_count, step]);

  /* Medidas: el ancho de tarjeta y el radio salen del ancho del contenedor. */
  React.useEffect(() => {
    const stage = stage_ref.current;
    if (!stage || !ring_count) return;
    const measure = () => {
      const w = stage.clientWidth;
      const card_w = Math.round(Math.min(280, Math.max(150, w < 640 ? w * 0.5 : w * 0.21)));
      const spacing = w < 640 ? 1.02 : 1.12;
      state.current.card_w = card_w;
      state.current.radius = Math.round(((card_w / 2) / Math.tan(Math.PI / ring_count)) * spacing);
      stage.style.setProperty("--oc-card-w", `${card_w}px`);
      /* el anillo retrocede su radio: la tarjeta del frente queda a tamaño real */
      stage.style.setProperty("--oc-radius", `${state.current.radius}px`);
      apply();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [ring_count, apply]);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => set_reduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    on_active_change?.(active_item);
  }, [active_item, on_active_change]);

  const go_to = React.useCallback(
    (target_rot: number, soft = false) => {
      tween.current?.kill();
      if (reduced) {
        state.current.rot = target_rot;
        apply();
        return;
      }
      tween.current = gsap.to(state.current, {
        rot: target_rot,
        duration: soft ? 1.4 : 0.9,
        ease: soft ? "power2.inOut" : "elastic.out(1, 0.82)",
        onUpdate: apply,
      });
    },
    [apply, reduced],
  );

  const snap_rot = (rot: number) => Math.round(rot / step) * step;
  const next = React.useCallback(
    (dir: 1 | -1, soft = false) => go_to(snap_rot(state.current.rot) - dir * step, soft),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [go_to, step],
  );

  /* Avance automático, solo en pantalla y sin interacción. */
  React.useEffect(() => {
    const stage = stage_ref.current;
    if (!stage || !autoplay_seconds || reduced || ring_count < 2) return;
    const io = new IntersectionObserver(([e]) => {
      state.current.visible = e.isIntersecting;
    });
    io.observe(stage);
    const id = window.setInterval(() => {
      const s = state.current;
      if (s.visible && !s.dragging && !s.hovered && document.visibilityState === "visible") next(1, true);
    }, autoplay_seconds * 1000);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [autoplay_seconds, reduced, ring_count, next]);

  /* Arrastre con inercia e imán. */
  React.useEffect(() => {
    const stage = stage_ref.current;
    if (!stage || ring_count < 2) return;
    let start_x = 0;
    let start_y = 0;
    let start_rot = 0;
    let last_x = 0;
    let last_t = 0;
    let velocity = 0;
    let decided: "x" | "y" | null = null;
    let pointer: number | null = null;

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pointer = e.pointerId;
      decided = null;
      start_x = last_x = e.clientX;
      start_y = e.clientY;
      start_rot = state.current.rot;
      last_t = performance.now();
      velocity = 0;
    };
    const move = (e: PointerEvent) => {
      if (pointer !== e.pointerId) return;
      const dx = e.clientX - start_x;
      const dy = e.clientY - start_y;
      if (!decided) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        /* En el celular, un gesto vertical es scroll de la página: no se roba. */
        decided = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (decided === "x") {
          tween.current?.kill();
          state.current.dragging = true;
          stage.setPointerCapture(e.pointerId);
          stage.dataset.dragging = "";
        }
      }
      if (decided !== "x") return;
      const deg_per_px = step / state.current.card_w;
      state.current.rot = start_rot + dx * deg_per_px;
      const now = performance.now();
      velocity = ((e.clientX - last_x) / Math.max(1, now - last_t)) * deg_per_px; // grados por ms
      last_x = e.clientX;
      last_t = now;
      apply();
    };
    const up = (e: PointerEvent) => {
      if (pointer !== e.pointerId) return;
      pointer = null;
      if (decided === "x") {
        /* Inercia: proyecta 260 ms de la velocidad final y cae en la más cercana. */
        go_to(snap_rot(state.current.rot + velocity * 260));
        window.setTimeout(() => {
          state.current.dragging = false;
          delete stage.dataset.dragging;
        }, 0);
      }
      decided = null;
    };
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    return () => {
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ring_count, step, apply, go_to]);

  React.useEffect(() => () => void tween.current?.kill(), []);

  if (!ring_count) return null;

  const on_card_click = (e: React.MouseEvent, ring_index: number) => {
    if (stage_ref.current?.dataset.dragging !== undefined) {
      e.preventDefault();
      return;
    }
    if (ring_index !== active_ring) {
      /* Una lateral no navega: primero gira al frente. */
      e.preventDefault();
      const delta = wrap180(ring_index * step + state.current.rot);
      go_to(snap_rot(state.current.rot - delta));
    }
  };

  const current = items[active_item];

  return (
    <div
      className={"oc-root" + (className ? " " + className : "")}
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          next(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          next(-1);
        }
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") state.current.hovered = true;
      }}
      onPointerLeave={() => {
        state.current.hovered = false;
      }}
      onFocus={() => {
        state.current.hovered = true;
      }}
      onBlur={() => {
        state.current.hovered = false;
      }}
    >
      <style>{OC_CSS}</style>
      <div ref={stage_ref} className="oc-stage">
        <div className="oc-floor" aria-hidden="true" />
        <div className="oc-ring">
          {ring.map(({ item, copy }, i) => {
            const is_front = i === active_ring;
            const body = (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="oc-poster" src={item.poster} alt="" draggable={false} loading={i < 3 ? "eager" : "lazy"} />
                {is_front && item.video && !reduced ? (
                  <video
                    key={item.video}
                    className="oc-video"
                    src={item.video}
                    poster={item.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="oc-shade" aria-hidden="true" />
                <span className="oc-caption">
                  <span className="oc-title">{item.title}</span>
                  {item.meta ? <span className="oc-meta">{item.meta}</span> : null}
                </span>
              </>
            );
            const common = {
              ref: (el: HTMLElement | null) => {
                card_refs.current[i] = el;
              },
              className: "oc-card" + (is_front ? " oc-card--front" : ""),
              "aria-hidden": copy ? true : undefined,
              tabIndex: copy ? -1 : undefined,
              onClick: (e: React.MouseEvent) => on_card_click(e, i),
              draggable: false,
            };
            return item.href ? (
              <a
                key={i}
                {...common}
                href={item.href}
                aria-label={copy ? undefined : `${item.title}${item.meta ? ", " + item.meta : ""}`}
              >
                {body}
              </a>
            ) : (
              <div key={i} {...common}>
                {body}
              </div>
            );
          })}
        </div>
      </div>

      <div className="oc-controls">
        <button type="button" className="oc-arrow" onClick={() => next(-1)} aria-label="Anterior">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 18 9 12l6-6" />
          </svg>
        </button>
        <p className="oc-now" aria-live="polite">
          <span className="oc-count">
            {String(active_item + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <span className="oc-now-title">
            {current?.title}
            {current?.meta ? ` · ${current.meta}` : ""}
          </span>
        </p>
        <button type="button" className="oc-arrow" onClick={() => next(1)} aria-label="Siguiente">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const OC_CSS = `
.oc-root { position: relative; width: 100%; user-select: none; -webkit-user-select: none; }
.oc-stage {
  --oc-card-w: 240px;
  position: relative; width: 100%;
  height: calc(var(--oc-card-w) * 16 / 9 + 90px);
  perspective: 1600px; perspective-origin: 50% 40%;
  touch-action: pan-y; cursor: grab; overflow: visible;
}
.oc-stage[data-dragging] { cursor: grabbing; }
.oc-ring { position: absolute; inset: 0; transform-style: preserve-3d; transform: translateZ(calc(var(--oc-radius, 420px) * -1)); }
.oc-floor {
  position: absolute; left: 50%; bottom: 6px; width: min(900px, 120%); height: 120px; transform: translateX(-50%);
  background: radial-gradient(50% 50% at 50% 50%, rgba(246, 236, 210, .16), rgba(52, 224, 161, .05) 45%, transparent 72%);
  filter: blur(6px); pointer-events: none;
}
.oc-card {
  position: absolute; left: 50%; top: 46%;
  width: var(--oc-card-w); aspect-ratio: 9 / 16;
  border-radius: 18px; overflow: hidden; display: block; color: #f6f2e8; text-decoration: none;
  background: #071915;
  box-shadow: 0 0 0 1px rgba(230, 220, 196, .16), 0 30px 60px -20px rgba(0, 0, 0, .8);
  backface-visibility: hidden; -webkit-backface-visibility: hidden;
  will-change: transform, opacity;
  -webkit-tap-highlight-color: transparent;
  transition: box-shadow .5s ease;
}
.oc-card--front { box-shadow: 0 0 0 1px rgba(230, 220, 196, .32), 0 40px 80px -24px rgba(0, 0, 0, .9), 0 0 60px -10px rgba(246, 236, 210, .18); }
.oc-card > .oc-poster, .oc-card > .oc-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.oc-shade { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 52%, rgba(2, 10, 8, .88) 100%); pointer-events: none; }
.oc-caption { position: absolute; left: 14px; right: 14px; bottom: 14px; display: grid; gap: 4px; pointer-events: none; }
.oc-title { font-family: var(--font-sora), system-ui, sans-serif; font-weight: 600; font-size: 16px; line-height: 1.15; letter-spacing: -.01em; }
.oc-meta { font-family: var(--font-mono), ui-monospace, Menlo, monospace; font-size: 11px; letter-spacing: .04em; color: rgba(246, 242, 232, .7); }
.oc-card:not(.oc-card--front) .oc-caption { opacity: .0; }
.oc-card--front .oc-caption { opacity: 1; transition: opacity .5s ease .15s; }
@media (hover: hover) {
  .oc-card--front:hover { box-shadow: 0 0 0 1px rgba(52, 224, 161, .5), 0 50px 90px -24px rgba(0, 0, 0, .9), 0 0 80px -6px rgba(246, 236, 210, .24); }
}
.oc-card:focus-visible { outline: 2px solid #34e0a1; outline-offset: 4px; }

.oc-controls { display: flex; align-items: center; justify-content: center; gap: 18px; margin-top: 6px; }
.oc-arrow {
  all: unset; box-sizing: border-box; width: 48px; height: 48px; border-radius: 999px; display: grid; place-items: center; cursor: pointer;
  color: #f6f2e8; border: 1px solid rgba(230, 220, 196, .24); background: rgba(4, 17, 15, .6);
  transition: border-color .3s ease, transform .3s ease;
}
.oc-arrow:hover { border-color: rgba(230, 220, 196, .6); }
.oc-arrow:active { transform: scale(.94); }
.oc-arrow:focus-visible { outline: 2px solid #34e0a1; outline-offset: 3px; }
.oc-arrow svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.oc-now { margin: 0; min-width: 0; width: min(320px, 56vw); display: grid; justify-items: center; gap: 2px; text-align: center; }
.oc-count { font-family: var(--font-mono), ui-monospace, Menlo, monospace; font-size: 12px; letter-spacing: .12em; color: #34e0a1; }
.oc-now-title { font-size: 14px; color: rgba(246, 242, 232, .74); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
@media (prefers-reduced-motion: reduce) { .oc-card { transition: none; } }
`;
