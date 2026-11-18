"use client";

import { useEffect, useRef } from "react";

interface StackDepthProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Pila de tarjetas sticky: cuando la siguiente tarjeta sube y tapa a la anterior,
 * la de atrás se encoge un 6 % y se apaga, como si se alejara. Hoja client mínima:
 * solo escucha el scroll; las tarjetas las pinta la sección (server).
 */
export function StackDepth({ children, className }: StackDepthProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-stack-item]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      for (let i = 0; i < items.length - 1; i++) {
        const current = items[i].getBoundingClientRect();
        const next = items[i + 1].getBoundingClientRect();
        const k = Math.max(0, Math.min(1, (current.bottom - next.top) / current.height));
        const card = items[i].firstElementChild as HTMLElement | null;
        if (!card) continue;
        card.style.transform = `scale(${1 - k * 0.06})`;
        card.style.filter = `brightness(${1 - k * 0.45})`;
      }
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
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
