"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { Fireflies } from "@/shared/ui/fireflies";

export interface TunnelImage {
  src: string;
  label: string;
  /** Las capturas de celular van verticales y más angostas. */
  portrait?: boolean;
}

interface PerspectiveTunnelProps {
  images: readonly TunnelImage[];
  /** El titular que queda en el centro del túnel. */
  children: ReactNode;
  /** Alto total del recorrido, en pantallas: más alto = viaje más lento. */
  length_vh?: number;
  className?: string;
}

const STAGGER_SPAN = 0.55;

/**
 * Túnel en perspectiva guiado por el scroll (Perspective Tunnel Hero): las
 * capturas vienen desde el fondo mientras el titular crece. A diferencia del
 * original NO secuestra la rueda: el escenario es `sticky` y el progreso sale
 * del scroll normal de la página, así que nadie queda atrapado.
 *
 * Con `prefers-reduced-motion` las tarjetas se quedan quietas a media
 * distancia, alrededor del titular.
 */
export function PerspectiveTunnel({ images, children, length_vh = 360, className }: PerspectiveTunnelProps) {
  const section_ref = useRef<HTMLDivElement>(null);
  const title_ref = useRef<HTMLDivElement>(null);
  const prompt_ref = useRef<HTMLDivElement>(null);
  const card_refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = section_ref.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = images.map((image, i) => {
      const golden = i * 137.5 * (Math.PI / 180);
      return {
        cos: Math.cos(golden),
        sin: Math.sin(golden),
        rx: 0.3 + (i % 3) * 0.08,
        ry: 0.27 + (i % 2) * 0.09,
        rot: (i % 2 ? -1 : 1) * (3 + (i % 5) * 2),
        portrait: Boolean(image.portrait),
      };
    });
    const state = { smooth: reduced ? 0.5 : 0, px: 0, py: 0, tx: 0, ty: 0 };
    let raf = 0;
    let active = false;

    const on_pointer = (event: PointerEvent) => {
      state.tx = (event.clientX / innerWidth - 0.5) * 2;
      state.ty = (event.clientY / innerHeight - 0.5) * 2;
    };

    const frame = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const progress = reduced
        ? 0.5
        : Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
      state.smooth += (progress - state.smooth) * (reduced ? 1 : 0.09);
      state.px += (state.tx - state.px) * 0.05;
      state.py += (state.ty - state.py) * 0.05;
      const W = innerWidth;
      const H = innerHeight;
      const mobile = W < 768;
      const far = mobile ? -1200 : -1700;
      const near = mobile ? 350 : 500;
      const pan = mobile ? 20 : 45;
      cards.forEach((card, i) => {
        const element = card_refs.current[i];
        if (!element) return;
        const start = (i / cards.length) * (1 - STAGGER_SPAN);
        const local = Math.max(0, Math.min(1, (state.smooth - start) / STAGGER_SPAN));
        const z = far + (near - far) * local;
        const opacity = local < 0.18 ? local / 0.18 : local > 0.82 ? Math.max(0, (0.98 - local) / 0.16) : 1;
        let width = mobile ? Math.max(130, Math.min(190, W * 0.4)) : Math.max(200, Math.min(300, W * 0.2));
        if (card.portrait) width *= 0.55;
        const x = card.cos * W * card.rx - state.px * pan;
        const y = card.sin * H * card.ry - state.py * pan;
        element.style.width = `${width}px`;
        element.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateZ(${card.rot}deg)`;
        element.style.opacity = String(state.smooth <= 0.0005 ? 0 : opacity);
      });
      const s = state.smooth;
      if (title_ref.current) {
        title_ref.current.style.transform = `scale(${s < 0.5 ? 0.85 + 0.3 * s : 1 + (s - 0.5) * 0.6})`;
        title_ref.current.style.opacity = String(s > 0.85 ? Math.max(0, (1 - s) / 0.15) : 1);
      }
      if (prompt_ref.current) prompt_ref.current.style.opacity = String(Math.max(0, 1 - s / 0.08));
      if (active && !reduced) raf = requestAnimationFrame(frame);
    };

    const intersection = new IntersectionObserver(([entry]) => {
      active = entry?.isIntersecting ?? false;
      if (active && !raf) raf = requestAnimationFrame(frame);
    });
    intersection.observe(section);
    window.addEventListener("pointermove", on_pointer, { passive: true });
    frame();

    return () => {
      cancelAnimationFrame(raf);
      intersection.disconnect();
      window.removeEventListener("pointermove", on_pointer);
    };
  }, [images]);

  return (
    <div
      ref={section_ref}
      className={cn("relative bg-[radial-gradient(80%_60%_at_50%_40%,var(--color-green-950),var(--color-surface-inset)_60%,var(--color-bg))]", className)}
      style={{ height: `${length_vh}vh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden [perspective:1200px]">
        <Fireflies mode="stars" />
        <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="absolute size-[48vmin] rounded-full border border-border-accent/30" />
          <span className="absolute size-[78vmin] rounded-full border border-dashed border-border-subtle" />
        </div>
        <div ref={title_ref} className="pointer-events-none absolute inset-0 z-[1] grid place-items-center px-6 text-center">
          {children}
        </div>
        <div aria-hidden className="absolute inset-0 z-[2] [transform-style:preserve-3d]">
          {images.map((image, i) => (
            <div
              key={`${image.src}-${i}`}
              ref={(element) => {
                card_refs.current[i] = element;
              }}
              className={cn(
                "absolute left-1/2 top-1/2 overflow-hidden rounded-lg border border-border-strong bg-black opacity-0 shadow-soft-lg will-change-transform",
                image.portrait ? "aspect-[9/16]" : "aspect-[16/10]",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- variante ya optimizada por scripts/generate_image_variants.mjs */}
              <img src={image.src} alt="" loading="lazy" decoding="async" className="size-full object-cover object-top" />
              <span className="absolute bottom-2.5 left-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-primary [text-shadow:0_1px_8px_#000]">
                {image.label}
              </span>
            </div>
          ))}
        </div>
        <div
          ref={prompt_ref}
          aria-hidden
          className="absolute bottom-24 left-1/2 z-[3] grid -translate-x-1/2 justify-items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted"
        >
          Baja
          <i className="h-[26px] w-px bg-gradient-to-b from-mint-500 to-transparent" />
        </div>
      </div>
    </div>
  );
}
