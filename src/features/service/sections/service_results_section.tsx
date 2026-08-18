import type { ServiceResults } from "@/core/domain/service_offering";
import { GlassCard } from "@/shared/ui/glass_card";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";

interface ServiceResultsSectionProps {
  results: ServiceResults;
}

/**
 * Lo que cambia: métricas + casos de uso.
 *
 * Ojo con la jerarquía: el valor de la métrica va en <p>, no en heading. Los
 * únicos h3 del bloque son los títulos de los casos, para que el esquema de la
 * página siga leyéndose como un índice y no como una nube de cifras.
 */
export function ServiceResultsSection({ results }: ServiceResultsSectionProps) {
  return (
    <section
      id="resultados"
      aria-labelledby="resultados-title"
      className="bg-surface-1 px-6 py-24 md:py-[110px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading
            id="resultados-title"
            align="left"
            eyebrow={results.eyebrow}
            title={results.title}
            subtitle={results.description}
            className="max-w-[680px]"
          />
        </Reveal>

        {/*
          El <dl> solo admite dt/dd, opcionalmente envueltos en UN <div>. Por eso
          la tarjeta es el propio Reveal (que ya renderiza un div) y no hay otro
          div dentro: dl > div > dt,dd. El orden del DOM es término → definición;
          el orden visual (valor arriba) se resuelve con `order`.
        */}
        <dl className="mt-12 grid gap-[22px] md:grid-cols-2 lg:grid-cols-4">
          {results.metrics.map((metric, index) => (
            <Reveal
              key={metric.label}
              delay={60 + index * 40}
              className="flex h-full flex-col gap-2 rounded-xl border border-border-default bg-glass-fill-strong p-7 shadow-glass backdrop-blur-[18px]"
            >
              <dt className="order-2 text-sm font-semibold text-text-primary">
                {metric.label}
              </dt>
              <dd className="order-1 font-sora text-2xl font-bold leading-tight text-mint-500">
                {metric.value}
              </dd>
              <dd className="order-3 text-[13px] leading-relaxed text-text-muted">
                {metric.description}
              </dd>
            </Reveal>
          ))}
        </dl>

        <div className="mt-[22px] grid gap-[22px] md:grid-cols-3">
          {results.use_cases.map((use_case, index) => (
            <Reveal key={use_case.title} delay={220 + index * 40}>
              <GlassCard
                as="article"
                interactive
                className="flex h-full flex-col gap-3 p-7"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-mint-500">
                  {use_case.sector}
                </span>
                <h3 className="font-sora text-lg font-semibold text-text-primary">
                  {use_case.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  {use_case.description}
                </p>
                <p className="mt-auto border-t border-border-subtle pt-4 text-[13.5px] font-medium text-mint-300">
                  {use_case.result}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
