import { Button } from "@/shared/ui/button";
import { CurvedBand, type CurvedBandImage } from "@/shared/ui/curved_band";
import { GiantWord } from "@/shared/ui/giant_word";
import { LayeredScene } from "@/shared/ui/layered_scene";
import { Reveal } from "@/shared/ui/reveal";
import { WhatsappIcon } from "@/shared/ui/whatsapp_icon";
import { HERO_CONTENT } from "./content";
import { TrustBar } from "./trust_bar";

interface HeroSectionProps {
  /** Capturas del trabajo real para la banda curva; llegan desde el composition root. */
  work_images: readonly CurvedBandImage[];
}

/*
  La escena del héroe: render 3D propio de la pradera en capas. El fondo y el
  computador recortado comparten encuadre (object-position), así que la palabra
  gigante cae exactamente entre los dos.
*/
const HERO_SCENE = {
  background: { src_base: "/images/scenes/hero_desktop", fallback_extension: "jpg", width: 2560, height: 1440 },
  foreground: { src_base: "/images/scenes/hero_desktop_fg", fallback_extension: "png", width: 2560, height: 1440 },
  mobile_background: "/images/scenes/hero_mobile",
  mobile_foreground: "/images/scenes/hero_mobile_fg",
} as const;

/**
 * Héroe de la landing (#inicio), en la estética motion de Kodecol (K-24):
 * entrada en serif itálica, «crecer» en Inter Tight 900 pasando detrás del
 * computador, y el remate. Debajo, en un mismo bloque: lo que hacemos, las
 * empresas que confían y la banda curva del trabajo en línea.
 *
 * Server component: solo la palabra, las luciérnagas y la banda son hojas client.
 */
export function HeroSection({ work_images }: HeroSectionProps) {
  const content = HERO_CONTENT;

  return (
    <section id="inicio" aria-labelledby="inicio-title" className="relative">
      <LayeredScene
        background={HERO_SCENE.background}
        foreground={HERO_SCENE.foreground}
        mobile_background={HERO_SCENE.mobile_background}
        mobile_foreground={HERO_SCENE.mobile_foreground}
        object_position="var(--hero-op)"
        fireflies
        priority
        className="h-[860px] [--hero-op:50%_100%] md:h-[clamp(720px,100svh,1000px)] md:[--hero-op:50%_62%]"
        word={
          <div className="absolute left-1/2 top-[47%] z-[2] -translate-x-1/2 -translate-y-1/2 md:top-[40%]">
            <GiantWord text={content.word} appear="load" className="text-[27vw] md:text-[clamp(110px,17.5vw,290px)]" />
          </div>
        }
      >
        {/* Velo de legibilidad: oscurece arriba (navbar) y abajo (CTAs) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[4] bg-[linear-gradient(180deg,rgb(4_17_15/.55)_0%,transparent_22%,transparent_62%,rgb(4_17_15/.7)_86%,var(--color-bg)_100%)]"
        />
        <h1 id="inicio-title" className="sr-only">
          {content.title}
        </h1>
        <p
          aria-hidden
          className="absolute inset-x-0 top-[13%] z-[5] px-5 text-center font-serif text-[clamp(30px,3.6vw,54px)] italic leading-none tracking-[-0.02em] text-cream-ink [text-shadow:0_2px_30px_rgb(0_0_0/.45)] md:top-[15%]"
        >
          {content.entry}
        </p>
        <div className="absolute inset-x-0 bottom-8 z-[5] flex flex-col items-center gap-4 px-5 text-center">
          <p
            aria-hidden
            className="mb-1 font-display text-[clamp(38px,4.6vw,68px)] font-extrabold leading-[0.95] tracking-[-0.05em] text-cream-ink [text-shadow:0_2px_26px_rgb(0_0_0/.45)]"
          >
            {content.remate}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href={content.primary_cta.href} external>
              <WhatsappIcon size={20} />
              {content.primary_cta.label}
            </Button>
            <Button href={content.secondary_cta.href} variant="secondary">
              {content.secondary_cta.label}
            </Button>
          </div>
          <p className="flex items-center gap-2 text-[13px] text-text-muted">
            <span aria-hidden className="size-1.5 rounded-full bg-mint-500 shadow-glow-accent" />
            {content.microcopy}
          </p>
        </div>
      </LayeredScene>

      <Reveal className="mx-auto max-w-[1200px] px-6 pt-28">
        <p className="mx-auto max-w-[30ch] text-balance text-center font-display text-[clamp(22px,2.4vw,32px)] leading-[1.35] tracking-[-0.02em] text-text-secondary">
          {content.intro_lead}
          <strong className="font-semibold text-text-primary">{content.intro_emphasis}</strong>
          {content.intro_tail}
        </p>
      </Reveal>

      <TrustBar />

      {/* Banda alta: las capturas son el argumento, tienen que leerse. */}
      <div className="relative mb-[104px] mt-6 h-[clamp(300px,40vw,580px)]">
        <CurvedBand images={work_images} tile_height={72} curve={54} speed={5} className="absolute inset-0" />
        <p className="absolute -bottom-[34px] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-[0.14em] text-text-muted">
          {content.band_label}
        </p>
      </div>
    </section>
  );
}
