import type { ServiceProcess } from "@/core/domain/service_offering";
import { Chip } from "@/shared/ui/chip";
import { GlassCard } from "@/shared/ui/glass_card";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";

interface ServiceProcessSectionProps {
  process: ServiceProcess;
}

/** Cómo trabajamos: los pasos van en <ol> porque son una secuencia, no una lista suelta. */
export function ServiceProcessSection({ process }: ServiceProcessSectionProps) {
  return (
    <section
      id="proceso"
      aria-labelledby="proceso-title"
      className="bg-surface-1 px-6 py-24 md:py-[110px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading
            id="proceso-title"
            align="left"
            eyebrow={process.eyebrow}
            title={process.title}
            subtitle={process.description}
            className="max-w-[680px]"
          />
        </Reveal>

        <ol className="mt-12 grid gap-[22px] md:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={60 + index * 50} className="h-full">
                <GlassCard className="flex h-full flex-col gap-3 p-7">
                  <span
                    aria-hidden
                    className="font-sora text-sm font-bold tracking-[0.1em] text-mint-500"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-sora text-lg font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
                  <Chip className="mt-auto w-fit">{step.duration}</Chip>
                </GlassCard>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
