import type { BrandDetail } from "@/core/domain/product_brand";
import { cn } from "@/shared/lib/cn";
import { Reveal } from "@/shared/ui/reveal";
import { BrandSectionHeading } from "./brand_section_heading";

interface MetricsSectionProps {
  metrics: BrandDetail["metrics"];
}

/** Bento de cifras de ingeniería: lo que un folleto de producto nunca muestra. */
export function MetricsSection({ metrics }: MetricsSectionProps) {
  return (
    <section
      aria-labelledby="metricas-title"
      className="px-6 py-24"
    >
      <div className="mx-auto max-w-[1160px]">
        <BrandSectionHeading
          id="metricas-title"
          eyebrow={metrics.eyebrow}
          title={metrics.title}
          description={metrics.description}
        />

        {/*
          Un <dl> solo admite dt/dd, opcionalmente envueltos en UN <div>. Antes la
          cadena era dl > div(Reveal) > div > dt,dd — dos niveles — así que la
          asociación término/definición no era válida. Ahora la tarjeta es el
          propio Reveal (que ya renderiza un div) y no hay otro div dentro.

          El label tampoco se duplica: era sr-only en el <dt> y visible en un <p>,
          de modo que un lector de pantalla lo anunciaba dos veces. Ahora el <dt>
          es el label visible y el orden visual (cifra arriba) lo da `order`.
        */}
        <dl className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {metrics.items.map((metric, index) => (
            <Reveal
              key={metric.label}
              delay={index * 50}
              className={cn(
                "flex h-full flex-col gap-1.5 rounded-lg border p-5",
                metric.featured
                  ? "border-[var(--brand-accent)]/30 bg-[var(--brand-accent)]/10"
                  : "border-[var(--brand-line)] bg-[var(--brand-surface)]",
                /* La última celda ocupa el resto de la fila para cerrar la grilla */
                index === metrics.items.length - 1 && "col-span-2",
              )}
            >
              <dt className="order-2 text-xs leading-snug text-[var(--brand-ink-muted)]">
                {metric.label}
              </dt>
              <dd
                className={cn(
                  "order-1 font-mono text-[28px] font-medium leading-none tabular-nums md:text-[36px]",
                  metric.featured
                    ? "text-[var(--brand-accent)]"
                    : "text-[var(--brand-ink)]",
                )}
              >
                {metric.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
