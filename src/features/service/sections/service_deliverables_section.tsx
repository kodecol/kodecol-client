import type { ServiceDeliverables } from "@/core/domain/service_offering";
import { GlassCard } from "@/shared/ui/glass_card";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";

interface ServiceDeliverablesSectionProps {
  deliverables: ServiceDeliverables;
  /** id del bloque: es el destino del CTA secundario del hero. */
  anchor: string;
}

/** Qué incluye el servicio: bento con el primer entregable a doble ancho. */
export function ServiceDeliverablesSection({
  deliverables,
  anchor,
}: ServiceDeliverablesSectionProps) {
  return (
    <section
      id={anchor}
      aria-labelledby="entregables-title"
      className="px-6 py-24 md:py-[110px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading
            id="entregables-title"
            align="left"
            eyebrow={deliverables.eyebrow}
            title={deliverables.title}
            subtitle={deliverables.description}
            className="max-w-[680px]"
          />
        </Reveal>

        <div className="mt-12 grid gap-[22px] md:grid-cols-3">
          {deliverables.items.map((item, index) => (
            <Reveal
              key={item.title}
              delay={60 + index * 40}
              /* El primero pesa más: jerarquía por tamaño (DESIGN.md §5). */
              className={index === 0 ? "md:col-span-2" : undefined}
            >
              <GlassCard
                as="article"
                interactive
                className="flex h-full flex-col gap-4 p-7"
              >
                <h3 className="font-sora text-lg font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-text-secondary">
                  {item.description}
                </p>
                <ul className="mt-auto flex flex-col gap-2 pt-2">
                  {item.items.map((entry) => (
                    <li
                      key={entry}
                      className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-text-secondary"
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] size-1 shrink-0 rounded-full bg-mint-500"
                      />
                      {entry}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
