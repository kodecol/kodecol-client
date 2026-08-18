import type { ServiceFaq } from "@/core/domain/service_offering";
import { GlassCard } from "@/shared/ui/glass_card";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";

interface ServiceFaqSectionProps {
  faq: ServiceFaq;
}

/**
 * Preguntas frecuentes.
 *
 * Deliberadamente SIN <details>: la respuesta está siempre visible. Google pide
 * que el contenido del FAQPage sea visible para el usuario, y así además no hay
 * JavaScript de por medio. La superficie va `strong` porque son textos largos
 * (DESIGN.md §4).
 */
export function ServiceFaqSection({ faq }: ServiceFaqSectionProps) {
  return (
    <section
      id="preguntas-frecuentes"
      aria-labelledby="faq-title"
      className="px-6 py-24 md:py-[110px]"
    >
      <div className="mx-auto max-w-[900px]">
        <Reveal>
          <SectionHeading
            id="faq-title"
            align="left"
            eyebrow={faq.eyebrow}
            title={faq.title}
            subtitle={faq.description}
          />
        </Reveal>

        <div className="mt-12 flex flex-col gap-4">
          {faq.items.map((item, index) => (
            <Reveal key={item.question} delay={60 + index * 40}>
              <GlassCard as="article" strong className="flex flex-col gap-3 p-7">
                <h3 className="font-sora text-lg font-semibold text-text-primary">
                  {item.question}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-text-secondary">
                  {item.answer}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
