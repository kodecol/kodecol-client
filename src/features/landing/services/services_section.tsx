import Link from "next/link";
import type { ServiceOffering } from "@/core/domain/service_offering";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { GlassCard } from "@/shared/ui/glass_card";
import { LineIcon } from "@/shared/ui/line_icon";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";
import { SERVICES_CONTENT } from "./content";

interface ServicesSectionProps {
  services: readonly ServiceOffering[];
}

/**
 * Servicios (#servicios): bento de 3 columnas con celda estrella 2×2 en gradiente
 * de marca + 5 celdas glass de apoyo + tira CTA de borde discontinuo (fiel al mockup).
 *
 * Cada tarjeta enlaza a su página de servicio: es el enlazado interno que hace
 * que las seis páginas de detalle existan para un buscador.
 */
export function ServicesSection({ services }: ServicesSectionProps) {
  const content = SERVICES_CONTENT;
  const featured = services.find((service) => service.teaser.featured);
  const support = services.filter((service) => !service.teaser.featured);

  return (
    <section
      id="servicios"
      aria-labelledby="servicios-title"
      className="relative bg-surface-1 px-6 py-24 md:py-[110px]"
    >
      {/* Glow radial superior de la sección */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[760px] max-w-full -translate-x-1/2"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(0,115,92,.25), transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading
            id="servicios-title"
            align="left"
            eyebrow={content.eyebrow}
            title={content.title}
            subtitle={content.subtitle}
            className="max-w-[680px]"
          />
        </Reveal>

        <div className="mt-12 grid gap-[22px] md:grid-cols-3 md:auto-rows-[minmax(150px,auto)]">
          {featured ? (
            <Reveal delay={60} className="md:col-span-2 md:row-span-2">
              <article
                className="relative h-full overflow-hidden rounded-xl border border-border-accent shadow-glass"
                style={{
                  background:
                    "linear-gradient(150deg, rgba(0,115,92,.55), rgba(1,75,77,.35))",
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(52,224,161,.25), transparent 70%)",
                  }}
                />
                <Link
                  href={`/servicios/${featured.slug}`}
                  className="relative flex h-full flex-col justify-end p-7 md:p-9"
                >
                  <LineIcon
                    name={featured.icon}
                    size={44}
                    className="mb-auto text-mint-500"
                  />
                  <span className="mt-8 w-fit rounded-full border border-border-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-mint-300">
                    {featured.teaser.badge}
                  </span>
                  <h3 className="mt-4 font-sora text-2xl font-semibold text-text-primary md:text-[26px]">
                    {featured.teaser.title}
                  </h3>
                  <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-green-100">
                    {featured.teaser.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mint-500">
                    {content.card_link_label}
                    <LineIcon name="arrow_right" size={14} />
                  </span>
                </Link>
              </article>
            </Reveal>
          ) : null}

          {support.map((service, index) => (
            <Reveal key={service.slug} delay={100 + index * 40}>
              <GlassCard as="article" interactive className="h-full rounded-xl">
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
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-semibold text-mint-500">
                    {content.card_link_label}
                    <LineIcon name="arrow_right" size={13} />
                  </span>
                </Link>
              </GlassCard>
            </Reveal>
          ))}

          {/* Tira CTA full-width con borde discontinuo */}
          <Reveal delay={320} className="md:col-span-3">
            <a
              href={SITE_CONFIG.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-border-default px-6 py-5 text-[15px] text-text-secondary transition-colors duration-fast hover:border-border-accent"
            >
              <span>
                {content.cta_lead}
                <strong className="font-semibold text-text-primary">
                  {content.cta_emphasis}
                </strong>
                {content.cta_tail}
              </span>
              <span className="font-semibold text-mint-500">
                {content.cta_link_label}
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
