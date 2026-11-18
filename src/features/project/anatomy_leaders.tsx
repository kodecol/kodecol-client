"use client";

import { useEffect, useRef, useState } from "react";

interface AnatomyLeadersProps {
  children: React.ReactNode;
}

/**
 * Líneas guía de los callouts técnicos: de cada nota a su marcador sobre la
 * captura, en codo, y se dibujan al entrar en pantalla (motion editorial).
 *
 * Hoja client mínima: mide las posiciones (dependen del layout) y pinta un SVG
 * encima. Las notas y los marcadores los pinta la sección (server) y se
 * emparejan por `data-callout` / `data-marker`.
 */
export function AnatomyLeaders({ children }: AnatomyLeadersProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [paths, set_paths] = useState<{ d: string; length: number; x: number; y: number }[]>([]);
  const [drawn, set_drawn] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const measure = () => {
      if (window.matchMedia("(max-width: 1000px)").matches) {
        set_paths([]);
        return;
      }
      const box = root.getBoundingClientRect();
      const next = Array.from(root.querySelectorAll<HTMLElement>("[data-callout]")).flatMap((note) => {
        const marker = root.querySelector<HTMLElement>(`[data-marker="${note.dataset.callout}"]`);
        if (!marker) return [];
        const n = note.getBoundingClientRect();
        const m = marker.getBoundingClientRect();
        const left = note.dataset.side === "left";
        const x1 = (left ? n.right + 10 : n.left - 10) - box.left;
        const y1 = n.top + 14 - box.top;
        const x2 = m.left + m.width / 2 - box.left;
        const y2 = m.top + m.height / 2 - box.top;
        const xm = left ? x1 + 22 : x1 - 22;
        return [{ d: `M${x1} ${y1} H${xm} L${x2} ${y2}`, length: Math.abs(xm - x1) + Math.hypot(x2 - xm, y2 - y1) + 2, x: x1, y: y1 }];
      });
      set_paths(next);
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    const intersection = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          measure();
          set_drawn(true);
          intersection.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    intersection.observe(root);
    return () => {
      resize.disconnect();
      intersection.disconnect();
    };
  }, []);

  return (
    <div ref={ref} data-drawn={drawn} className="group/anatomy relative">
      {children}
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-[2] size-full overflow-visible">
        {paths.map((path) => (
          <g key={path.d}>
            <path
              d={path.d}
              fill="none"
              strokeWidth={1}
              className="stroke-mint-300/75 transition-[stroke-dashoffset] duration-[1400ms] ease-kodecol motion-reduce:transition-none"
              style={{ strokeDasharray: path.length, strokeDashoffset: drawn ? 0 : path.length }}
            />
            <circle cx={path.x} cy={path.y} r={2.5} className="fill-mint-500" />
          </g>
        ))}
      </svg>
    </div>
  );
}
