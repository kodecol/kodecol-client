import { Button } from "@/shared/ui/button";
import { LivingGradient } from "@/shared/ui/living_gradient";
import { Reveal } from "@/shared/ui/reveal";
import { WhatsappIcon } from "@/shared/ui/whatsapp_icon";
import { HERO_CONTENT } from "./content";
import { TrustBar } from "./trust_bar";
import { HeroVisual } from "./hero_visual";

/**
 * Héroe de la landing (#inicio): split texto/render 3D sobre gradiente radial verde,
 * con glow pulsante y la trust bar de marcas al final (fiel al mockup).
 */
export function HeroSection() {
  const content = HERO_CONTENT;

  return (
    <section
      id="inicio"
      aria-labelledby="inicio-title"
      className="relative overflow-hidden px-6 pt-[150px] md:pt-[170px]"
      style={{
        background:
          "radial-gradient(120% 90% at 72% 18%, #00735C 0%, #014B4D 34%, #04110F 72%)",
      }}
    >
      {/* Ambiente: gradiente vivo en WebGL sobre el fondo CSS, que queda de
          respaldo si no hay WebGL o el usuario reduce movimiento. */}
      <LivingGradient className="pointer-events-none absolute inset-0" />

      {/* Luz focal pulsante detrás del contenido */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[-20%] size-[620px] animate-kc-pulse rounded-full blur-[10px]"
        style={{
          background:
            "radial-gradient(circle, rgba(52,224,161,.20), transparent 70%)",
        }}
      />
      {/* Fundido inferior hacia el fondo base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 120%, rgba(4,17,15,.9), transparent)",
        }}
      />

      <div className="relative mx-auto grid min-h-[560px] max-w-[1200px] items-center gap-10 md:gap-14 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col items-start gap-6">
          <Reveal delay={80}>
            <h1
              id="inicio-title"
              className="font-sora text-[30px] font-bold leading-[1.06] tracking-[-0.02em] text-text-primary md:text-[52px] lg:text-[60px]"
            >
              {content.title_lead}
              <span className="bg-gradient-to-r from-mint-500 to-green-300 bg-clip-text text-transparent">
                {content.title_accent}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="max-w-[540px] text-lg leading-relaxed text-text-secondary">
              {content.description_lead}
              <strong className="font-medium text-text-primary">
                {content.description_emphasis}
              </strong>
              {content.description_tail}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-wrap items-center gap-4">
              <Button href={content.primary_cta.href} external>
                <WhatsappIcon size={20} />
                {content.primary_cta.label}
              </Button>
              <Button href={content.secondary_cta.href} variant="secondary">
                {content.secondary_cta.label}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <p className="text-[13px] text-text-muted">{content.microcopy}</p>
          </Reveal>
        </div>

        <Reveal delay={160} className="flex justify-center">
          <HeroVisual />
        </Reveal>
      </div>

      <TrustBar />
    </section>
  );
}
