"use client";

import { useEffect, useRef } from "react";

/**
 * La línea que une los pasos del recorrido: crece con el scroll a medida que la
 * sección entra. Con `prefers-reduced-motion` se pinta completa.
 */
export function FlowLine() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const line = ref.current;
    const row = line?.parentElement;
    if (!line || !row) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.transform = "scaleX(1)";
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = row.getBoundingClientRect();
      const k = Math.max(0, Math.min(1, (innerHeight * 0.85 - rect.top) / (rect.height * 0.9)));
      line.style.transform = `scaleX(${k.toFixed(3)})`;
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
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className="absolute inset-x-[8%] top-[34%] z-0 hidden h-0.5 origin-left scale-x-0 bg-gradient-to-r from-mint-500 to-green-300 shadow-glow-accent md:block"
    />
  );
}
