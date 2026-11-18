"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

/*
  Banda curva de imágenes (Scroll Tilted Grid de Louis Studios, de lado): una
  fila que corre de derecha a izquierda por el interior de un cilindro. Cada
  tarjeta se corta en franjas verticales giradas sobre el eje del cilindro, así
  que se curva a lo largo; un solo keyframe por tarjeta la lleva por el arco.
*/

const SLICES = 16;
const CAMERA = 1.6;
const MAX_WIDTH = 55;
/** Solape entre franjas vecinas, a cada lado: tapa las ranuras del redondeo 3D. */
const SEAM_PX = 1.5;

function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

interface Layout {
  columns: number;
  sweep: number;
  unit: number;
  limit: number;
}

function measure(width: number, height: number, tile: number, aspect: number, gap: number, bend: number): Layout {
  const h = Math.min((tile / 100) * height, ((MAX_WIDTH / 100) * width) / aspect);
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0)) return { columns: 2, sweep: 0, unit: 0, limit: 0 };
  const deg = (rad: number) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n: number) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return { columns, sweep, unit: round(unit), limit: round(Math.min(sweep, limit)) };
}

export interface CurvedBandImage {
  src: string;
  alt: string;
}

interface CurvedBandProps {
  images: readonly CurvedBandImage[];
  /** Segundos para avanzar una tarjeta. */
  speed?: number;
  /** Alto de la tarjeta en % del alto del contenedor. */
  tile_height?: number;
  aspect_ratio?: number;
  gap?: number;
  /** Centro vertical de la fila, en %. */
  axis?: number;
  /** Cuánto se curva la fila hacia el borde, en grados (5–85). */
  curve?: number;
  /** Ancho del fundido en cada extremo, en %. */
  fade?: number;
  className?: string;
}

/**
 * Hoja client: un ResizeObserver dimensiona el bucle y cada tarjeta cambia de
 * imagen al dar la vuelta, fuera de cuadro. Todo lo demás es CSS en el
 * compositor; con `prefers-reduced-motion` la banda queda quieta.
 */
export function CurvedBand({
  images,
  speed = 4.5,
  tile_height = 60,
  aspect_ratio = 16 / 10,
  gap = 6,
  axis = 46,
  curve = 62,
  fade = 16,
  className,
}: CurvedBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const orbit = `kc-orbit-${id}`;
  const tile_class = `kc-tile-${id}`;
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;
  const [layout, set_layout] = useState<Layout | null>(null);
  const [shown, set_shown] = useState<Record<number, number>>({});

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const next = measure(entry.contentRect.width, entry.contentRect.height, tile_height, aspect_ratio, gap, bend);
      set_layout((prev) =>
        prev && prev.columns === next.columns && prev.sweep === next.sweep && prev.unit === next.unit ? prev : next,
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [tile_height, aspect_ratio, gap, bend]);

  const { columns, sweep, unit, limit } = layout ?? measure(1200, 360, tile_height, aspect_ratio, gap, bend);
  const u = (n: number) =>
    `calc(${+n.toFixed(4)} * min(${tile_height}cqh, ${+(MAX_WIDTH / aspect_ratio).toFixed(4)}cqw))`;
  const r = 100 * arc(bend);
  const radius = `${+r.toFixed(3)}cqw`;
  const turn = (deg: number) => `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`;
  const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
  const css =
    `@keyframes ${orbit}{from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}` +
    `0%,${hide}%,${100 - hide}%,100%{visibility:hidden}` +
    `${hide + 0.001}%,${100 - hide - 0.001}%{visibility:visible}}` +
    `@media(prefers-reduced-motion:reduce){.${tile_class}{animation-play-state:paused!important}}`;
  const share = aspect_ratio / SLICES;
  const duration = columns * speed;
  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${100 - fade}%,transparent)`;

  return (
    <div ref={ref} aria-hidden className={cn("relative overflow-hidden", className)} style={{ containerType: "size" }}>
      <style>{css}</style>
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: layout ? 1 : 0,
          perspective: `${+(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          const first = columns - 1 - t;
          const image = images[(shown[t] ?? first) % Math.max(images.length, 1)];
          return (
            <div
              key={t}
              className={cn(tile_class, "absolute")}
              style={{
                left: `calc(50% - ${u(aspect_ratio / 2)})`,
                top: `calc(${axis}% - ${u(0.5)})`,
                width: u(aspect_ratio),
                height: u(1),
                transformStyle: "preserve-3d",
                animation: `${orbit} ${duration}s linear ${-t * speed}s infinite`,
              }}
              onAnimationIteration={(event) => {
                const lap = Math.round(event.elapsedTime / duration);
                set_shown((prev) => {
                  const next = lap * columns + first;
                  return prev[t] === next ? prev : { ...prev, [t]: next };
                });
              }}
            >
              {Array.from({ length: SLICES }, (_, k) => {
                /*
                  Cada franja se solapa con sus vecinas por los DOS lados. Con un
                  solo píxel hacia la derecha, el redondeo de la rotación 3D abría
                  a ratos una ranura de 1 px que dejaba ver el fondo: una línea
                  vertical que titilaba al girar la banda. La primera y la última
                  no se extienden hacia fuera, para no deformar el borde redondeado.
                */
                const pad_left = k === 0 ? 0 : SEAM_PX;
                const pad_right = k === SLICES - 1 ? 0 : SEAM_PX;
                return (
                <div
                  key={k}
                  className={cn(
                    "absolute top-0 overflow-hidden bg-surface-2 [backface-visibility:hidden]",
                    k === 0 && "rounded-l-[10px]",
                    k === SLICES - 1 && "rounded-r-[10px]",
                  )}
                  style={{
                    left: `calc(${u((aspect_ratio - share) / 2)} - ${pad_left}px)`,
                    width: `calc(${u(share)} + ${pad_left + pad_right}px)`,
                    height: u(1),
                    transform: turn((aspect_ratio / 2 - (k + 0.5) * share) * unit),
                  }}
                >
                  {/* Fondo y no <img>: son ~200 franjas decorativas de unas pocas
                      imágenes; como fondo no inflan el árbol de accesibilidad. */}
                  {image ? (
                    <span
                      className="absolute top-0 bg-cover bg-top"
                      style={{
                        left: `calc(${u(-k * share)} + ${pad_left}px)`,
                        width: u(aspect_ratio),
                        height: u(1),
                        backgroundImage: `url(${image.src})`,
                      }}
                    />
                  ) : null}
                </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
