import type { BrandDetail } from "@/core/domain/product_brand";
import { Reveal } from "@/shared/ui/reveal";
import { BrandSectionHeading } from "./brand_section_heading";

interface PilotsSectionProps {
  pilots: BrandDetail["pilots"];
}

/** Dónde está hoy el producto: los negocios reales que ya lo usan. */
export function PilotsSection({ pilots }: PilotsSectionProps) {
  return (
    <section
      aria-labelledby="pilotos-title"
      className="px-6 py-24"
    >
      <div className="mx-auto max-w-[1160px]">
        <BrandSectionHeading
          id="pilotos-title"
          eyebrow={pilots.eyebrow}
          title={pilots.title}
          description={pilots.description}
        />

        <div className="grid gap-3.5 md:grid-cols-3">
          {pilots.items.map((pilot, index) => (
            <Reveal key={pilot.name} delay={index * 70}>
              <article className="flex h-full flex-col gap-2.5 rounded-lg border border-[var(--brand-line)] bg-[var(--brand-surface)] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-ink-dim)]">
                  {pilot.sector}
                </p>
                <h3 className="font-sora text-lg font-bold tracking-[-0.02em] text-[var(--brand-ink)]">
                  {pilot.name}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--brand-ink-muted)]">
                  {pilot.description}
                </p>
                <p className="mt-auto border-t border-[var(--brand-line)] pt-3.5 font-mono text-xs text-[var(--brand-accent-soft)]">
                  {pilot.figure}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
