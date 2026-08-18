import type { ServiceClosing } from "@/core/domain/service_offering";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { build_whatsapp_url } from "@/shared/lib/build_whatsapp_url";
import { Button } from "@/shared/ui/button";
import { Reveal } from "@/shared/ui/reveal";

interface ServiceClosingSectionProps {
  closing: ServiceClosing;
}

/** Cierre del servicio: misma tarjeta radial verde que el CTA final de la landing. */
export function ServiceClosingSection({ closing }: ServiceClosingSectionProps) {
  const whatsapp_href = build_whatsapp_url(
    SITE_CONFIG.whatsapp_number,
    closing.primary_cta.whatsapp_message,
  );

  return (
    <section
      id="contacto"
      aria-labelledby="cierre-title"
      className="px-6 py-24 md:py-[110px]"
    >
      <Reveal>
        <div
          className="relative mx-auto flex max-w-[900px] flex-col items-center gap-6 overflow-hidden rounded-2xl border border-border-accent px-7 py-14 text-center md:px-14"
          style={{
            background:
              "radial-gradient(70% 120% at 50% 0%, rgba(0,115,92,.45), rgba(4,17,15,.9))",
          }}
        >
          <h2
            id="cierre-title"
            className="font-sora text-[26px] font-bold leading-tight text-text-primary md:text-[34px]"
          >
            {closing.title}
          </h2>
          <p className="max-w-[560px] text-base leading-relaxed text-text-secondary">
            {closing.description}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={whatsapp_href} external>
              {closing.primary_cta.label}
            </Button>
            <Button href={`mailto:${SITE_CONFIG.email}`} variant="secondary">
              {closing.secondary_cta_label}
            </Button>
          </div>
          <p className="text-[13px] text-text-muted">{closing.note}</p>
        </div>
      </Reveal>
    </section>
  );
}
