"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/shared/lib/cn";

interface FirefliesProps {
  /** "fireflies": luciérnagas que suben (pradera). "stars": estrellas quietas que titilan. */
  mode?: "fireflies" | "stars";
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  v: number;
  d: number;
  mint: boolean;
  tw: number;
}

/*
  Colores de las partículas: la luz cálida de la pradera, la menta de la marca y
  el blanco frío de las estrellas. Van en RGB porque se componen con alfa por
  partícula; son los mismos valores de --color-mint-500 y de la luz del render.
*/
const WARM = "255,214,150";
const MINT = "52,224,161";
const STAR = "230,240,255";

/**
 * Capa de luciérnagas o estrellas en canvas 2D (DESIGN.md §9: partículas
 * permitidas en escenas Bosque, pocas y lentas). Solo anima mientras está en
 * pantalla; con `prefers-reduced-motion` se pinta un único cuadro quieto.
 */
export function Fireflies({ mode = "fireflies", className }: FirefliesProps) {
  const canvas_ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvas_ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars = mode === "stars";
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let visible = true;

    const seed = (p: Partial<Particle>, anywhere: boolean): Particle => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 10,
      r: stars ? Math.random() * 1.2 + 0.2 : Math.random() * 2.2 + 0.6,
      v: stars ? 0 : Math.random() * 0.22 + 0.05,
      d: Math.random() * Math.PI * 2,
      mint: Math.random() < (stars ? 0.12 : 0.28),
      tw: Math.random() * 6,
      ...p,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = stars
        ? Math.round((width * height) / 5200)
        : Math.round(Math.max(24, Math.min(70, width / 26)));
      particles = Array.from({ length: count }, () => seed({}, true));
    };

    const frame = (t: number) => {
      raf = 0;
      if (!visible) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (!stars && !reduced) {
          p.y -= p.v;
          p.x += Math.sin(t / 2400 + p.d) * 0.18;
          if (p.y < -10) Object.assign(p, seed({}, false));
        }
        let alpha = stars
          ? 0.35 + 0.65 * Math.abs(Math.sin(t / 1800 + p.tw))
          : 0.25 + 0.75 * Math.pow(Math.abs(Math.sin(t / 1300 + p.tw)), 2);
        if (!stars) alpha *= Math.max(0, Math.min(1, (p.y / height) * 1.6));
        const color = p.mint ? MINT : stars ? STAR : WARM;
        const radius = p.r * (stars ? 3 : 7);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        glow.addColorStop(0, `rgba(${color},${alpha})`);
        glow.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const resize_observer = new ResizeObserver(() => {
      resize();
      kick();
    });
    resize_observer.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) kick();
    });
    intersection.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      resize_observer.disconnect();
      intersection.disconnect();
    };
  }, [mode]);

  return (
    <canvas
      ref={canvas_ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
