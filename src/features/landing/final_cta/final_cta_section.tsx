import { SITE_CONFIG } from "@/shared/config/site_config";
import { Button } from "@/shared/ui/button";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { Reveal } from "@/shared/ui/reveal";
import { WhatsappIcon } from "@/shared/ui/whatsapp_icon";
import { FINAL_CTA_CONTENT } from "./content";

/**
 * CTA final (#cotizaciones): tarjeta centrada con gradiente radial verde, borde menta
 * y glow pulsante; "Solicitar cotización" es un mailto (fiel al mockup, sin formulario).
 */
export function FinalCtaSection() {
  const content = FINAL_CTA_CONTENT;

  return (
    <section
      id="cotizaciones"
      aria-labelledby="cotizaciones-title"
      className="bg-surface-1 px-6 pb-[120px] pt-24 md:pt-[110px]"
    >
      <Reveal className="mx-auto max-w-[980px]">
        <div
          className="relative overflow-hidden rounded-2xl border border-border-accent px-6 py-14 text-center md:px-10 md:py-[72px]"
          style={{
            background:
              "radial-gradient(120% 140% at 50% 0%, rgba(0,115,92,.55), rgba(1,75,77,.30) 55%, rgba(4,17,15,.6))",
          }}
        >
          {/* Glow superior pulsante */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-120px] h-[240px] w-[520px] -translate-x-1/2 animate-kc-pulse rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(52,224,161,.30), transparent 70%)",
            }}
          />

          <div className="relative flex flex-col items-center gap-6">
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h2
              id="cotizaciones-title"
              className="font-sora text-4xl font-bold tracking-[-0.01em] text-text-primary md:text-[52px]"
            >
              {content.title}
            </h2>
            <p className="max-w-[640px] text-lg leading-relaxed text-green-100">
              {content.subtitle}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <Button href={SITE_CONFIG.whatsapp_url} external>
                <WhatsappIcon size={20} />
                {content.primary_label}
              </Button>
              <Button href={`mailto:${SITE_CONFIG.email}`} variant="secondary" external>
                {content.secondary_label}
              </Button>
            </div>
            <p className="mt-4 font-mono text-[13px] text-text-brandmark">
              {content.contact_line}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
