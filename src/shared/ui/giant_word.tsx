"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

interface GiantWordProps {
  text: string;
  className?: string;
  /** "load": aparece al montar (hero). "view": al entrar en pantalla. */
  appear?: "load" | "view";
  /** Deriva horizontal suave con el scroll, como en los videos. */
  drift?: boolean;
}

/** Desplazamiento máximo de la deriva, en px, a una pantalla de distancia. */
const DRIFT_PX = 90;

/**
 * Palabra gigante de la estética motion Kodecol (K-24): Inter Tight 900 con una
 * capa desenfocada y otra nítida enmascarada al centro (estilos `.kc-giant` en
 * globals.css). Es decorativa —el texto real vive en el heading de la sección—,
 * así que va `aria-hidden`.
 *
 * Hoja client: necesita IntersectionObserver para la entrada y el scroll para la
 * deriva. Con `prefers-reduced-motion` aparece quieta y sin desenfoque animado.
 */
export function GiantWord({
  text,
  className,
  appear = "view",
  drift = true,
}: GiantWordProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, set_shown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (appear === "load") {
      const frame = requestAnimationFrame(() => set_shown(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          set_shown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [appear]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !drift) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
      const k = Math.max(-1, Math.min(1, offset));
      element.style.transform = `translateX(${(k * -DRIFT_PX).toFixed(1)}px)`;
    };
    const on_scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on_scroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", on_scroll);
    };
  }, [drift]);

  return (
    <span
      ref={ref}
      aria-hidden
      data-state={shown ? "shown" : "hidden"}
      className={cn("kc-giant relative will-change-transform", className)}
    >
      <span className="kc-giant__blur">{text}</span>
      <span className="kc-giant__sharp">{text}</span>
    </span>
  );
}
