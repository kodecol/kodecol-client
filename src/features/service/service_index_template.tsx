import Link from "next/link";
import type { ServiceOffering } from "@/core/domain/service_offering";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { build_service_links } from "@/shared/config/service_links";
import { Button } from "@/shared/ui/button";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { Footer } from "@/shared/ui/footer";
import { GlassCard } from "@/shared/ui/glass_card";
import { LineIcon } from "@/shared/ui/line_icon";
import { Navbar } from "@/shared/ui/navbar";
import { Reveal } from "@/shared/ui/reveal";
import { MAIN_CONTENT_ID } from "@/shared/ui/skip_link";
import { Breadcrumb } from "@/shared/ui/breadcrumb";

interface ServiceIndexTemplateProps {
  services: readonly ServiceOffering[];
}

/**
 * Página índice de servicios (/servicios).
 *
 * Es la página de categoría del área comercial: da un destino real a la miga de
 * pan y al navbar, y concentra el enlazado hacia las seis páginas de detalle.
 */
export function ServiceIndexTemplate({ services }: ServiceIndexTemplateProps) {
  return (
    <>
      <Navbar />
      <main id={MAIN_CONTENT_ID}>
        <Breadcrumb
          crumbs={[
            { label: "Inicio", href: "/" },
            { label: "Servicios", href: null },
          ]}
        />

        <section
          aria-labelledby="servicios-index-title"
          className="relative overflow-hidden px-6 pb-16 pt-10 md:pb-20 md:pt-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[860px] max-w-full -translate-x-1/2"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 0%, rgba(0,115,92,.28), transparent 75%)",
            }}
          />
          <div className="relative mx-auto max-w-[1200px]">
            <Reveal>
              <Eyebrow className="block">Lo que construimos</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h1
                id="servicios-index-title"
                className="mt-4 max-w-[860px] font-sora text-[30px] font-bold leading-[1.06] tracking-[-0.02em] text-text-primary md:text-[50px]"
              >
                Servicios de desarrollo de software{" "}
                <span className="bg-gradient-to-r from-mint-500 to-green-300 bg-clip-text text-transparent">
                  en Colombia
                </span>
              </h1>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 max-w-[660px] text-lg leading-relaxed text-text-secondary">
                Desde una automatización puntual hasta una plataforma completa. Cada
                línea tiene su página, con lo que incluye, cómo trabajamos, qué cuesta
                y las preguntas que siempre nos hacen antes de empezar.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <div className="mt-9">
                <Button href={SITE_CONFIG.whatsapp_url} external>
                  Cuéntanos tu proyecto
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          aria-labelledby="listado-servicios-title"
          className="bg-surface-1 px-6 py-20 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <h2 id="listado-servicios-title" className="sr-only">
              Listado de servicios
            </h2>
            <div className="grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Reveal key={service.slug} delay={60 + index * 40}>
                  <GlassCard as="article" interactive className="h-full">
                    <Link
                      href={`/servicios/${service.slug}`}
                      className="flex h-full flex-col gap-3 p-7"
                    >
                      <LineIcon
                        name={service.icon}
                        size={32}
                        className="text-mint-500"
                      />
                      {service.teaser.badge ? (
                        <span className="w-fit rounded-full border border-border-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-mint-300">
                          {service.teaser.badge}
                        </span>
                      ) : null}
                      <h3 className="font-sora text-xl font-semibold text-text-primary">
                        {service.teaser.title}
                      </h3>
                      <p className="text-[14px] leading-relaxed text-text-secondary">
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
      </main>
      <Footer service_links={build_service_links(services)} />
    </>
  );
}
