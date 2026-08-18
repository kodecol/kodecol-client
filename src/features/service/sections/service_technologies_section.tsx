import type { ServiceTechnologies } from "@/core/domain/service_offering";
import { Chip } from "@/shared/ui/chip";
import { GlassCard } from "@/shared/ui/glass_card";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";

interface ServiceTechnologiesSectionProps {
  technologies: ServiceTechnologies;
}

/** Con qué lo construimos: grupos de tecnologías + nota honesta de cierre. */
export function ServiceTechnologiesSection({
  technologies,
}: ServiceTechnologiesSectionProps) {
  return (
    <section
      id="tecnologias"
      aria-labelledby="tecnologias-title"
      className="px-6 py-24 md:py-[110px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading
            id="tecnologias-title"
            align="left"
            eyebrow={technologies.eyebrow}
            title={technologies.title}
            subtitle={technologies.description}
            className="max-w-[680px]"
          />
        </Reveal>

        <div className="mt-12 grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
          {technologies.groups.map((group, index) => (
            <Reveal key={group.title} delay={60 + index * 40}>
              <GlassCard className="flex h-full flex-col gap-4 p-7">
                <h3 className="font-sora text-base font-semibold text-text-primary">
                  {group.title}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <p className="mt-8 rounded-xl border border-dashed border-border-default px-6 py-5 text-[15px] leading-relaxed text-text-secondary">
            {technologies.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
