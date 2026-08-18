import type { BrandDetail } from "@/core/domain/product_brand";
import { Reveal } from "@/shared/ui/reveal";
import { BrandSectionHeading } from "./brand_section_heading";

interface StackSectionProps {
  stack: BrandDetail["stack"];
}

/** Con qué está hecho: las mismas decisiones técnicas que Kodecol toma en un encargo. */
export function StackSection({ stack }: StackSectionProps) {
  return (
    <section
      aria-labelledby="stack-title"
      className="px-6 py-24"
    >
      <div className="mx-auto max-w-[1160px]">
        <BrandSectionHeading id="stack-title" eyebrow={stack.eyebrow} title={stack.title} />

        <div className="grid gap-3.5 md:grid-cols-3">
          {stack.groups.map((group, index) => (
            <Reveal key={group.title} delay={index * 70}>
              <div className="h-full rounded-lg border border-[var(--brand-line)] bg-[var(--brand-surface)] p-6">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.13em] text-[var(--brand-ink-muted)]">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-2.5 text-sm text-[var(--brand-ink)]"
                    >
                      <span
                        aria-hidden
                        className="size-1 shrink-0 -translate-y-0.5 rounded-full bg-[var(--brand-accent)]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
