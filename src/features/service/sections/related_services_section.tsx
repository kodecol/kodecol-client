import Link from "next/link";
import type { ServiceOffering } from "@/core/domain/service_offering";
import { GlassCard } from "@/shared/ui/glass_card";
import { LineIcon } from "@/shared/ui/line_icon";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";

interface RelatedServicesSectionProps {
  services: readonly ServiceOffering[];
}

/**
 * Otros servicios. Además de ayudar a quien navega, es enlazado interno real:
 * cada página de servicio apunta a las otras cinco, así que el peso circula en
 * vez de morir en una hoja.
 */
export function RelatedServicesSection({ services }: RelatedServicesSectionProps) {
  if (services.length === 0) return null;

  return (
    <section
      id="otros-servicios"
      aria-labelledby="otros-servicios-title"
      className="bg-surface-1 px-6 py-24 md:py-[110px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading
            id="otros-servicios-title"
            align="left"
            eyebrow="Seguimos construyendo"
            title="Otros servicios de Kodecol"
            subtitle="Casi ningún proyecto es de una sola cosa. Estas son las demás líneas con las que solemos combinarlo."
            className="max-w-[680px]"
          />
        </Reveal>

        <div className="mt-12 grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={60 + index * 40}>
              <GlassCard
                as="article"
                interactive
                className="h-full transition-colors"
              >
                <Link
                  href={`/servicios/${service.slug}`}
                  className="flex h-full flex-col gap-3 p-6"
                >
                  <LineIcon name={service.icon} size={28} className="text-mint-500" />
                  <h3 className="font-sora text-lg font-semibold text-text-primary">
                    {service.teaser.title}
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-text-secondary">
                    {service.teaser.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-mint-500">
                    Ver servicio
                    <LineIcon name="arrow_right" size={14} />
                  </span>
                </Link>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
