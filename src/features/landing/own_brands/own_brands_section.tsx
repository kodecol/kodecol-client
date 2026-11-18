import Image from "next/image";
import type { ProductBrand } from "@/core/domain/product_brand";
import { CANVAS_PALETTE } from "@/shared/config/canvas_palette";
import { Button } from "@/shared/ui/button";
import { DisplayHeading } from "@/shared/ui/display_heading";
import { GiantWord } from "@/shared/ui/giant_word";
import { LayeredScene } from "@/shared/ui/layered_scene";
import { LineIcon } from "@/shared/ui/line_icon";
import { Reveal } from "@/shared/ui/reveal";
import { WarpCarousel } from "@/shared/ui/warp_carousel";
import { build_brand_metric_cards } from "./brand_metric_cards";
import { OWN_BRANDS_CONTENT } from "./content";

interface OwnBrandsSectionProps {
  /** Marcas de dominio ya validadas; llegan desde el composition root. */
  brands: readonly ProductBrand[];
}

/**
 * Sección #marcas: la presentación de las marcas propias en la landing.
 *
 * Por cada marca con `showcase`: una escena de la pradera con el producto (la
 * palabra gigante pasa detrás del celular) que se funde desde el fondo de la
 * sección anterior, el titular, una prueba real y sus cifras en el carrusel warp.
 *
 * Fuera de su página manda Kodecol: menta y verdes; lo único que conserva el
 * color del producto es su isotipo (architecture.md §6).
 */
export function OwnBrandsSection({ brands }: OwnBrandsSectionProps) {
  const showcased = brands.filter((brand) => brand.teaser.showcase);
  if (showcased.length === 0) return null;
  const content = OWN_BRANDS_CONTENT;

  return (
    <section id="marcas" aria-labelledby="marcas-title" className="relative overflow-hidden pb-36">
      <h2 id="marcas-title" className="sr-only">
        Marcas propias de Kodecol
      </h2>
      {showcased.map((brand) => {
        const showcase = brand.teaser.showcase!;
        const metrics = brand.detail.metrics.items.filter((item) => showcase.metric_values.includes(item.value));
        const title_id = `marca-${brand.slug}-title`;
        return (
          <article key={brand.slug} aria-labelledby={title_id}>
            <LayeredScene
              background={showcase.scene.background}
              foreground={showcase.scene.foreground}
              object_position="var(--axi-op)"
              className="mb-14 h-[clamp(640px,68vw,960px)] [--axi-op:72%_30%] md:[--axi-op:50%_30%]"
              /* La pradera aparece desde el fondo: sin franja vacía ni borde duro
                 entre secciones (DESIGN.md §3.1, transición con niebla). */
              layer_class_name="!top-[9%] !h-[91%] [mask-image:linear-gradient(180deg,transparent_0%,black_16%,black_78%,transparent_100%)]"
              word={
                <div className="absolute left-1/2 top-[34%] z-[2] -translate-x-1/2 -translate-y-1/2 md:left-[62%]">
                  <GiantWord text={showcase.scene.word} className="text-[30vw] md:text-[clamp(120px,21vw,360px)]" />
                </div>
              }
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[4] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-bg)_70%,transparent),transparent_45%),linear-gradient(180deg,transparent_70%,var(--color-bg))]"
              />
              <div className="absolute bottom-[13%] left-[max(24px,calc((100vw-1200px)/2+24px))] z-[5] max-w-[420px]">
                <div className="flex items-center gap-3.5">
                  <Image src={brand.isotype_src} alt="" aria-hidden width={400} height={312} className="h-auto w-12" />
                  <div>
                    <p className="font-display text-2xl font-bold tracking-[-0.03em] text-text-primary">{brand.name}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                      {content.eyebrow}
                    </p>
                  </div>
                </div>
                <p
                  aria-hidden
                  className="mt-5 font-serif text-[clamp(28px,3vw,44px)] italic leading-none tracking-[-0.02em] text-cream-ink [text-shadow:0_2px_30px_rgb(0_0_0/.45)]"
                >
                  {showcase.scene.entry}
                </p>
              </div>
            </LayeredScene>

            <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-6 lg:grid-cols-[.95fr_1.05fr]">
              <Reveal>
                <DisplayHeading
                  as="h3"
                  id={title_id}
                  lead={showcase.headline_lead}
                  accent={showcase.headline_accent}
                  className="text-[clamp(34px,4.4vw,58px)] text-text-primary"
                  accent_class_name="text-mint-300"
                />
                <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-text-secondary">{showcase.summary}</p>

                <div className="mt-8 rounded-[22px] border border-border-default bg-glass-fill p-6 backdrop-blur-[20px]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                    {showcase.proof.label}
                  </p>
                  <ol className="relative mt-4 grid grid-cols-3 gap-3 before:absolute before:inset-x-1.5 before:top-[7px] before:h-px before:bg-gradient-to-r before:from-mint-500 before:to-mint-500/20">
                    {showcase.proof.steps.map((step) => (
                      <li key={step.time} className="relative pt-6">
                        <span aria-hidden className="absolute left-0 top-0.5 size-[11px] rounded-full border-2 border-mint-500 bg-bg" />
                        <span className="block font-display text-[22px] font-semibold tabular-nums tracking-[-0.02em] text-text-primary">
                          {step.time}
                        </span>
                        <span className="text-[13px] text-text-secondary">{step.label}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3.5 text-sm text-text-secondary">{showcase.proof.footnote}</p>
                </div>

                <div className="mt-7">
                  <Button href={`/marcas/${brand.slug}`}>
                    {content.cta_label} {brand.name}
                    <LineIcon name="arrow_right" size={16} />
                  </Button>
                </div>
              </Reveal>

              <Reveal>
                <WarpCarousel
                  cards={build_brand_metric_cards(brand)}
                  background={CANVAS_PALETTE.bg}
                  aria_label={`${brand.name} en cifras`}
                  className="aspect-[5/4] w-full rounded-[28px] max-lg:aspect-auto max-lg:h-[460px]"
                />
                {/* Las cifras también como texto: el canvas es decorativo. */}
                <dl className="sr-only">
                  {metrics.map((item) => (
                    <div key={item.value}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3.5 text-center text-xs text-text-muted">{showcase.metrics_caption}</p>
              </Reveal>
            </div>
          </article>
        );
      })}
    </section>
  );
}
