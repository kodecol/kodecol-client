"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

/** Un bucle cinematográfico en dos encuadres: ancho (escritorio) y alto (celular). */
export interface BackdropMedia {
  wide: { video: string; poster: string };
  tall: { video: string; poster: string };
}

interface BackdropProps {
  media: BackdropMedia;
  /** Imagen principal de la página (LCP): se pide de inmediato. */
  priority?: boolean;
  /** La esfera «respira»: un brillo lento sobre todo el cuadro. */
  breathe?: boolean;
  className?: string;
}

const WIDE_QUERY = "(min-width: 900px)";

/**
 * Fondo cinematográfico (videos de motion-kodecol, 7 nov. 2026) con paralaje
 * lento, grano y viñeta. Primero pinta el primer cuadro como imagen —es lo
 * que cuenta para la carga— y después monta el video del encuadre que toca.
 * Sin video si la persona activó el ahorro de datos o pidió menos movimiento.
 */
export function Backdrop({ media, priority = false, breathe = false, className }: BackdropProps) {
  const root_ref = useRef<HTMLDivElement>(null);
  const move_ref = useRef<HTMLDivElement>(null);
  const [video, set_video] = useState<string | null>(null);
  const [playing, set_playing] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const save_data = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced || save_data) return;
    const mq = window.matchMedia(WIDE_QUERY);
    const pick = () => set_video(mq.matches ? media.wide.video : media.tall.video);
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, [media]);

  useEffect(() => {
    const root = root_ref.current;
    const move = move_ref.current;
    if (!root || !move) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / (window.innerHeight / 2 + rect.height / 2);
      move.style.transform = `translate3d(0, ${(progress * 7).toFixed(2)}%, 0)`;
    };
    const on_scroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on_scroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", on_scroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root_ref} className={cn("lib-backdrop", className)} aria-hidden="true">
      <div ref={move_ref} className={cn("lib-backdrop-move", breathe && "lib-breathe")}>
        <picture>
          <source media={WIDE_QUERY} srcSet={media.wide.poster} />
          { }
          <img
            src={media.tall.poster}
            alt=""
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
          />
        </picture>
        {video ? (
          <video
            key={video}
            className="lib-backdrop-video"
            data-playing={playing ? "" : undefined}
            src={video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onPlaying={() => set_playing(true)}
          />
        ) : null}
      </div>
    </div>
  );
}
