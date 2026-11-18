import type { BrandDetail } from "@/core/domain/product_brand";
import { cn } from "@/shared/lib/cn";
import { Reveal } from "@/shared/ui/reveal";
import { BrandClip } from "../brand_clip";
import { BrandSectionHeading } from "./brand_section_heading";

interface JourneySectionProps {
  journey: NonNullable<BrandDetail["journey"]>;
  pillars: BrandDetail["pillars"];
}

const TONE_TEXT = ["text-[var(--brand-accent-2)]", "text-[var(--brand-accent-3)]", "text-[var(--brand-accent)]"];
const TONE_VAR = {
  accent: "var(--brand-accent)",
  accent_2: "var(--brand-accent-2)",
  accent_3: "var(--brand-accent-3)",
} as const;

/**
 * Una venta real, paso a paso, y los pilares del producto con un clip de la
 * interfaz real cada uno. Es la prueba antes de la promesa.
 */
export function JourneySection({ journey, pillars }: JourneySectionProps) {
  return (
    <section id="venta-real" aria-labelledby="venta-real-title" className="scroll-mt-24 px-6 py-[120px]">
      <div className="mx-auto max-w-[1160px]">
        <BrandSectionHeading
          id="venta-real-title"
          eyebrow={journey.eyebrow}
          title={journey.title}
          description={journey.description}
        />
        <ol className="grid gap-4 md:grid-cols-3">
          {journey.steps.map((step, index) => (
            <Reveal key={step.time} delay={index * 70}>
              <li className="h-full rounded-3xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-7">
                <span
                  className={cn(
                    "block font-display text-[46px] font-light leading-none tracking-[-0.04em] tabular-nums",
                    TONE_TEXT[index % TONE_TEXT.length],
                  )}
                >
                  {step.time}
                </span>
                <span className="mt-3.5 block text-[var(--brand-ink-muted)]">{step.text}</span>
              </li>
            </Reveal>
          ))}
        </ol>

        {pillars && pillars.length > 0 ? (
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 70}>
                <article
                  className="relative h-full overflow-hidden rounded-3xl border border-[var(--brand-line)] bg-[var(--brand-surface)] pb-8"
                  style={{ "--tone": TONE_VAR[pillar.tone] } as React.CSSProperties}
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 z-[1] h-0.5 bg-[var(--tone)]" />
                  <BrandClip clip={pillar.clip} className="border-b border-[var(--brand-line)]" />
                  <div className="px-7 pt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tone)]">{pillar.label}</p>
                    <h3 className="mt-3 font-display text-[22px] font-semibold tracking-[-0.02em] text-[var(--brand-ink)]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--brand-ink-muted)]">{pillar.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
