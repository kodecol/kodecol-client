import { CANVAS_PALETTE as P } from "@/shared/config/canvas_palette";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { Button } from "@/shared/ui/button";
import { GiantWord } from "@/shared/ui/giant_word";
import { Reveal } from "@/shared/ui/reveal";
import { StaticPicture } from "@/shared/ui/static_picture";
import { VelarisGradient } from "@/shared/ui/velaris_gradient";
import { WhatsappIcon } from "@/shared/ui/whatsapp_icon";
import { FINAL_CTA_CONTENT } from "./content";

/**
 * CTA final (#cotizaciones): gradiente vivo en los verdes de la marca y el
 * lockup motion (K-24) con «construir?» pasando detrás del isotipo 3D.
 */
export function FinalCtaSection() {
  const content = FINAL_CTA_CONTENT;

  return (
    <section id="cotizaciones" aria-labelledby="cotizaciones-title" className="px-6 pb-[120px] pt-10">
      <Reveal className="mx-auto max-w-[1200px]">
        <div className="relative isolate grid min-h-[560px] place-items-center overflow-hidden rounded-[40px] border border-border-default text-center">
          <VelarisGradient
            background={P.bg}
            colors={[P.green_300, P.green_600, P.green_900, P.cream_200]}
            className="-z-10"
          />
          <div className="grid justify-items-center gap-[22px] px-6 py-[70px]">
            <h2 id="cotizaciones-title" className="sr-only">
              {content.title}
            </h2>
            <div aria-hidden className="relative grid justify-items-center">
              <p className="relative z-[3] font-serif text-[clamp(32px,4vw,56px)] italic leading-none tracking-[-0.02em] text-cream-ink">
                {content.entry}
              </p>
              <GiantWord text={content.word} className="z-[1] mt-[0.04em] text-[clamp(76px,15vw,220px)]" />
              <StaticPicture
                src_base="/images/logo/isotipo-3d-trim"
                alt=""
                width={382}
                height={492}
                className="relative z-[2] -mt-[clamp(60px,11vw,170px)] h-auto w-[clamp(120px,13vw,190px)] animate-kc-float drop-shadow-[0_30px_60px_rgb(0_0_0/.6)]"
              />
            </div>
            <p className="max-w-[58ch] text-lg leading-relaxed text-green-100">{content.subtitle}</p>
            <Button href={SITE_CONFIG.whatsapp_url} external>
              <WhatsappIcon size={20} />
              {content.primary_label}
            </Button>
            <p className="select-all font-mono text-[13px] text-text-brandmark">{content.contact_line}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
