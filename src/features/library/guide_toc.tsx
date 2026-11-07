"use client";

import { useEffect, useState } from "react";

export interface TocEntry {
  id: string;
  label: string;
}

/** Índice lateral pegajoso (escritorio). Marca la sección que se está leyendo. */
export function GuideToc({ entries }: { entries: readonly TocEntry[] }) {
  const [current, set_current] = useState(entries[0]?.id);

  useEffect(() => {
    const nodes = entries.map((entry) => document.getElementById(entry.id)).filter((n): n is HTMLElement => !!n);
    const observer = new IntersectionObserver(
      (items) => {
        const visible = items.filter((i) => i.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) set_current(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [entries]);

  return (
    <nav className="lib-toc" aria-label="En esta guía">
      <p>En esta guía</p>
      <ol>
        {entries.map((entry) => (
          <li key={entry.id}>
            <a href={`#${entry.id}`} aria-current={entry.id === current ? "true" : undefined}>
              {entry.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
