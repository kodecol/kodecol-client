import Image from "next/image";
import Link from "next/link";
import type { ProductBrand } from "@/core/domain/product_brand";
import { Chip } from "@/shared/ui/chip";
import { LineIcon } from "@/shared/ui/line_icon";

interface BrandShowcaseCardProps {
  brand: ProductBrand;
}

/**
 * Tarjeta de una marca propia dentro de la landing.
 *
 * Regla de marca: **fuera de su página de detalle manda Kodecol**. La tarjeta usa
 * el acento menta corporativo; lo único que conserva el color del producto es su
 * isotipo, que es identidad, no una decisión cromática de la sección.
 */
export function BrandShowcaseCard({ brand }: BrandShowcaseCardProps) {
  const { teaser } = brand;

  return (
    <Link
      href={`/marcas/${brand.slug}`}
      aria-label={`${brand.name} — ${teaser.kind}`}
      className="group relative block overflow-hidden rounded-2xl border border-border-default bg-glass-fill shadow-glass-lg backdrop-blur-[22px] transition-[transform,border-color,box-shadow] duration-slow ease-kodecol hover:-translate-y-1.5 hover:border-border-accent hover:shadow-[0_26px_70px_rgba(0,0,0,.55),0_0_70px_rgba(52,224,161,.12)] focus-visible:-translate-y-1.5 focus-visible:border-border-accent"
    >
      {/* Luz de marca corporativa en la esquina, no el color del producto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 8%, rgba(52,224,161,.10), transparent 58%)",
        }}
      />

      <div className="relative grid lg:grid-cols-[1fr_1.05fr]">
        <div className="flex flex-col justify-center gap-6 p-8 md:p-12">
          <div className="flex items-center gap-4">
            <Image
              src={brand.isotype_src}
              alt=""
              aria-hidden
              width={400}
              height={312}
              className="h-auto w-[42px]"
            />
            <div>
              <p className="font-sora text-[25px] font-bold leading-none tracking-[-0.03em] text-text-primary">
                {brand.name}
              </p>
              <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                {teaser.kind}
              </p>
            </div>
          </div>

          <p className="font-sora text-xl font-bold leading-[1.16] tracking-[-0.025em] text-text-primary md:text-2xl">
            {teaser.claim_lead}
            <span className="text-mint-500">{teaser.claim_accent}</span>.
          </p>

          <p className="max-w-[44ch] text-sm leading-relaxed text-text-secondary">
            {teaser.summary}
          </p>

          <div className="flex flex-wrap gap-2">
            {teaser.chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </div>

          <span className="inline-flex items-center gap-2 text-sm font-semibold text-mint-500">
            {teaser.cta_label}
            <LineIcon
              name="arrow_right"
              size={16}
              className="transition-transform duration-slow ease-kodecol group-hover:translate-x-1"
            />
          </span>
        </div>

        <div className="relative grid min-h-[300px] place-items-center p-8 pt-0 lg:p-8 lg:pl-0">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 60% at 60% 45%, rgba(52,224,161,.12), transparent 70%)",
            }}
          />
          {/* Mismo duotono corporativo que el campo de fondo: `mix-blend-color` toma el tono de Kodecol y conserva la luminancia de la captura. */}
          {/* after:absolute after:inset-0 after:bg-green-600 after:mix-blend-color after:content-[''] */}
          <div className="relative w-full max-w-[430px] overflow-hidden rounded-xl border border-border-subtle shadow-[0_24px_70px_rgba(0,0,0,.6)]">
            <Image
              src={brand.gallery[0]}
              alt={`Captura de la interfaz de ${brand.name}: ${brand.teaser.kind}`}
              width={480}
              height={347}
              className="w-full brightness-[.72]"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
