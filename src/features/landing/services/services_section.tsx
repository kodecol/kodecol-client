import Link from "next/link";
import type { ServiceOffering } from "@/core/domain/service_offering";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { Button } from "@/shared/ui/button";
import { LineIcon } from "@/shared/ui/line_icon";
import { Reveal } from "@/shared/ui/reveal";
import { StaticPicture } from "@/shared/ui/static_picture";
import { WhatsappIcon } from "@/shared/ui/whatsapp_icon";
import { SERVICES_CONTENT } from "./content";

interface ServicesSectionProps {
  services: readonly ServiceOffering[];
}

/**
 * Servicios (#servicios), en atmósfera Cielo (DESIGN.md §3.1): cielo de día
 * sobre la pradera, texto petróleo y la lista de servicios en un panel de vidrio
 * claro. Entra con un corte limpio de color desde el Bosque de arriba.
 *
 * Cada fila enlaza a su página de servicio: es el enlazado interno que hace que
 * las seis páginas de detalle existan para un buscador.
 */
export function ServicesSection({ services }: ServicesSectionProps) {
  const content = SERVICES_CONTENT;

  return (
    <section
      id="servicios"
      aria-labelledby="servicios-title"
      className="relative isolate overflow-hidden bg-sky-50 px-6 py-32 text-ink-petrol"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <StaticPicture
          src_base="/images/scenes/sky_desktop"
          fallback_extension="jpg"
          width={1600}
          height={900}
          alt=""
          fill
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-sky-50)_15%,transparent),transparent_30%,color-mix(in_srgb,var(--color-sky-50)_25%,transparent)_55%,color-mix(in_srgb,var(--color-sky-50)_10%,transparent))]" />
      </div>

      <div className="relative mx-auto max-w-[1200px]">
        <Reveal>
          <header className="mb-14 grid items-end gap-6 md:grid-cols-[1.1fr_.9fr] md:gap-x-16">
            <div className="grid gap-[18px]">
              <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-mint-700">
                <span aria-hidden className="h-px w-[18px] bg-current opacity-70" />
                {content.eyebrow}
              </p>
              <h2
                id="servicios-title"
                className="max-w-[18ch] text-balance font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-none tracking-[-0.045em]"
              >
                {content.title_lead}
                <em className="font-serif text-[1.06em] font-normal italic tracking-[-0.01em]">
                  {content.title_accent}
                </em>
              </h2>
            </div>
            <p className="max-w-[58ch] text-lg leading-relaxed text-ink-petrol-muted">{content.subtitle}</p>
          </header>
        </Reveal>

        <Reveal>
          <ul className="rounded-[28px] border border-ink-petrol/10 bg-cream-50/75 px-[22px] py-1.5 shadow-[0_30px_80px_-30px_color-mix(in_srgb,var(--color-ink-petrol)_35%,transparent)] backdrop-blur-[22px]">
            {services.map((service) => (
              <li key={service.slug} className="border-b border-ink-petrol/15 last:border-b-0">
                <Link
                  href={`/servicios/${service.slug}`}
                  className="group grid grid-cols-[1fr_28px] items-center gap-x-6 gap-y-1.5 rounded px-2 py-[26px] transition-[background-color,padding] duration-slow ease-kodecol hover:bg-cream-50/80 md:grid-cols-[70px_1.1fr_1.4fr_40px] md:hover:px-5"
                >
                  <span className="col-span-full font-mono text-[13px] text-ink-petrol-muted md:col-span-1">
                    {String(service.order).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[clamp(20px,2vw,26px)] font-semibold tracking-[-0.02em]">
                    {service.teaser.title}
                    {service.teaser.badge ? (
                      <span className="ml-2.5 inline-block rounded-full border border-mint-700/40 px-2.5 py-0.5 align-middle font-poppins text-[10px] font-semibold uppercase tracking-[0.14em] text-mint-700">
                        {service.teaser.badge}
                      </span>
                    ) : null}
                  </h3>
                  <p className="text-[15.5px] leading-relaxed text-ink-petrol-muted">{service.teaser.description}</p>
                  <LineIcon
                    name="arrow_right"
                    size={22}
                    className="row-span-2 row-start-2 justify-self-end transition-transform duration-slow ease-kodecol group-hover:translate-x-1 md:row-span-1 md:row-start-auto"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <div className="mt-11 flex flex-wrap items-center justify-between gap-[18px] rounded-3xl border border-ink-petrol/10 bg-cream-50/60 px-[30px] py-[26px] backdrop-blur-[20px]">
            <p className="max-w-[52ch] text-[17px]">
              <strong className="font-semibold">{content.cta_lead}</strong>
              {content.cta_text}
            </p>
            <Button href={SITE_CONFIG.whatsapp_url} external variant="ink">
              <WhatsappIcon size={19} />
              {content.cta_label}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
