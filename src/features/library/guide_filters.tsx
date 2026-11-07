"use client";

import { useMemo, useState } from "react";
import { GuideCard, type GuideCardData } from "./guide_card";

export interface FilterableGuide extends GuideCardData {
  topic: string;
  topic_label: string;
  level: string;
  level_label: string;
}

const ALL = "todas";

/**
 * Filtros por tema y nivel. Solo aparecen los temas y niveles que tienen guías:
 * una ficha que lleva a una lista vacía no sirve.
 */
export function GuideFilters({ guides }: { guides: readonly FilterableGuide[] }) {
  const [topic, set_topic] = useState(ALL);
  const [level, set_level] = useState(ALL);

  const topics = useMemo(() => unique(guides.map((g) => [g.topic, g.topic_label] as const)), [guides]);
  const levels = useMemo(() => unique(guides.map((g) => [g.level, g.level_label] as const)), [guides]);
  const shown = guides.filter((g) => (topic === ALL || g.topic === topic) && (level === ALL || g.level === level));
  const count = (key: "topic" | "level", value: string) => guides.filter((g) => g[key] === value).length;

  return (
    <>
      <div className="lib-filters" role="group" aria-label="Filtrar guías">
        <button type="button" className="lib-filter" aria-pressed={topic === ALL && level === ALL} onClick={() => (set_topic(ALL), set_level(ALL))}>
          Todas <span>{guides.length}</span>
        </button>
        {topics.map(([value, label]) => (
          <button key={value} type="button" className="lib-filter" aria-pressed={topic === value} onClick={() => set_topic(topic === value ? ALL : value)}>
            {label} <span>{count("topic", value)}</span>
          </button>
        ))}
        <span className="lib-filter-sep" aria-hidden="true" />
        {levels.map(([value, label]) => (
          <button key={value} type="button" className="lib-filter" aria-pressed={level === value} onClick={() => set_level(level === value ? ALL : value)}>
            {label} <span>{count("level", value)}</span>
          </button>
        ))}
      </div>
      <div className="lib-cards" aria-live="polite">
        {shown.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </>
  );
}

function unique(pairs: readonly (readonly [string, string])[]): [string, string][] {
  const seen = new Map<string, string>();
  for (const [value, label] of pairs) if (!seen.has(value)) seen.set(value, label);
  return [...seen.entries()];
}
