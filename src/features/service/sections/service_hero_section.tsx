import type { ServiceHero, ServiceIconName } from "@/core/domain/service_offering";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { build_whatsapp_url } from "@/shared/lib/build_whatsapp_url";
import { Button } from "@/shared/ui/button";
import { Chip } from "@/shared/ui/chip";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { LineIcon } from "@/shared/ui/line_icon";
import { Reveal } from "@/shared/ui/reveal";

interface ServiceHeroSectionProps {
  hero: ServiceHero;
  icon: ServiceIconName;
  /** Ancla del bloque de entregables, destino del CTA secundario. */
  deliverables_anchor: string;
}

/** Hero del servicio: único <h1> de la página. */
export function ServiceHeroSection({
  hero,
  icon,
  deliverables_anchor,
}: ServiceHeroSectionProps) {
  /* El número vive en site_config; el JSON solo aporta el mensaje (architecture.md §6). */
  const whatsapp_href = build_whatsapp_url(
    SITE_CONFIG.whatsapp_number,
    hero.primary_cta.whatsapp_message,
  );

  return (
    <section
      aria-labelledby="servicio-title"
      className="relative overflow-hidden px-6 pb-20 pt-10 md:pb-24 md:pt-14"
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
          <LineIcon name={icon} size={40} className="text-mint-500" />
        </Reveal>

        <Reveal delay={60}>
          <Eyebrow className="mt-6 block">{hero.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={100}>
          <h1
            id="servicio-title"
            className="mt-4 max-w-[860px] font-sora text-[30px] font-bold leading-[1.06] tracking-[-0.02em] text-text-primary md:text-[50px]"
          >
            {hero.headline_lead}
            <span className="bg-gradient-to-r from-mint-500 to-green-300 bg-clip-text text-transparent">
              {hero.headline_accent}
            </span>
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-6 max-w-[620px] text-lg leading-relaxed text-text-secondary">
            {hero.description}
          </p>
        </Reveal>

        <Reveal delay={180}>
          <ul className="mt-7 flex flex-wrap gap-2">
            {hero.chips.map((chip) => (
              <li key={chip}>
                <Chip>{chip}</Chip>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={whatsapp_href} external>
              {hero.primary_cta.label}
            </Button>
            <Button href={`#${deliverables_anchor}`} variant="secondary">
              {hero.secondary_cta_label}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
