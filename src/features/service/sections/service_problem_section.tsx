import type { ServiceProblem } from "@/core/domain/service_offering";
import { GlassCard } from "@/shared/ui/glass_card";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";

interface ServiceProblemSectionProps {
  problem: ServiceProblem;
}

/** El problema que resuelve el servicio: cuatro dolores concretos + cierre en voz de Kodecol. */
export function ServiceProblemSection({ problem }: ServiceProblemSectionProps) {
  return (
    <section
      id="problema"
      aria-labelledby="problema-title"
      className="bg-surface-1 px-6 py-24 md:py-[110px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading
            id="problema-title"
            align="left"
            eyebrow={problem.eyebrow}
            title={problem.title}
            subtitle={problem.description}
            className="max-w-[680px]"
          />
        </Reveal>

        <div className="mt-12 grid gap-[22px] md:grid-cols-2">
          {problem.items.map((item, index) => (
            <Reveal key={item.title} delay={60 + index * 40}>
              <GlassCard as="article" className="flex h-full flex-col gap-3 p-7">
                <h3 className="font-sora text-lg font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={260}>
          <p className="mt-8 rounded-xl border border-dashed border-border-default px-6 py-5 text-[15px] leading-relaxed text-text-primary">
            {problem.closing_note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
