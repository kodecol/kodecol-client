import type { ProductBrand } from "@/core/domain/product_brand";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { Reveal } from "@/shared/ui/reveal";
import { BrandMarquee } from "./brand_marquee";
import { BrandShowcaseCard } from "./brand_showcase_card";
import { OWN_BRANDS_CONTENT } from "./content";

interface OwnBrandsSectionProps {
  /** Marcas de dominio ya validadas; llegan desde el composition root. */
  brands: readonly ProductBrand[];
}

/**
 * Sección #marcas: las marcas propias de Kodecol, con el campo 3D de capturas
 * de fondo y una tarjeta por producto.
 *
 * Server component: el marquee es CSS y la tarjeta es un enlace. Cero JS.
 */
export function OwnBrandsSection({ brands }: OwnBrandsSectionProps) {
  if (brands.length === 0) return null;

  const content = OWN_BRANDS_CONTENT;
  /* El campo de fondo se alimenta de las capturas de todas las marcas. */
  const gallery = brands.flatMap((brand) => [...brand.gallery]);

  return (
    <section
      id="marcas"
      aria-labelledby="marcas-title"
      className="relative overflow-hidden bg-bg px-6 py-[110px] md:py-[130px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-260px] size-[820px] -translate-x-1/2 rounded-full blur-[30px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,115,92,.28), transparent 68%)",
        }}
      />

      <BrandMarquee images={gallery} />

      {/* Scrim: sostiene la legibilidad del encabezado y devuelve suelo limpio
          antes de las tarjetas (DESIGN.md §4, regla de capas). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[760px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(4,17,15,.72) 0%, rgba(4,17,15,.80) 38%, rgba(4,17,15,.94) 72%, #04110F 97%)",
        }}
      />

      <div className="relative mx-auto max-w-[1160px]">
        <header className="mb-14 flex flex-col gap-[18px]">
          <Reveal>
            <Eyebrow>{content.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2
              id="marcas-title"
              className="font-sora text-[30px] font-bold leading-[1.08] tracking-[-0.02em] text-text-primary md:text-[44px] lg:text-[50px]"
            >
              {content.title_lead}
              <span className="text-mint-500">{content.title_accent}</span>.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-[64ch] text-base leading-relaxed text-text-secondary">
              {content.description}
            </p>
          </Reveal>
        </header>

        <div className="flex flex-col gap-6">
          {brands.map((brand, index) => (
            <Reveal key={brand.slug} delay={180 + index * 60}>
              <BrandShowcaseCard brand={brand} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
