import { DisplayHeading } from "@/shared/ui/display_heading";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { Reveal } from "@/shared/ui/reveal";
import { PROCESS_CONTENT } from "./content";

/** «Cómo empezamos» (#como-empezamos): tres pasos, sin fricción, antes de la crew. */
export function ProcessSection() {
  const content = PROCESS_CONTENT;

  return (
    <section id="como-empezamos" aria-labelledby="como-empezamos-title" className="px-6 pb-24 pt-36">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="mb-14 grid gap-[18px]">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <DisplayHeading
            id="como-empezamos-title"
            lead={content.title_lead}
            accent={content.title_accent}
            className="max-w-[18ch] text-[clamp(34px,4.6vw,60px)] text-text-primary"
          />
        </Reveal>
        <ol className="grid gap-[18px] md:grid-cols-3">
          {content.steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 60}>
              <li className="h-full rounded-3xl border border-border-default bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface-2)_60%,transparent),color-mix(in_srgb,var(--color-surface-1)_30%,transparent))] px-7 pb-8 pt-[30px]">
                <span aria-hidden className="font-display text-[54px] font-light leading-none tracking-[-0.04em] text-green-300">
                  {index + 1}
                </span>
                <h3 className="mt-[22px] font-display text-[21px] font-semibold tracking-[-0.02em] text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-text-secondary">{step.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
