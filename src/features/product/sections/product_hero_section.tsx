import Image from "next/image";
import type { ProductBrand } from "@/core/domain/product_brand";
import { Reveal } from "@/shared/ui/reveal";
import { BrandChip } from "../brand_chip";

interface ProductHeroSectionProps {
  brand: ProductBrand;
}

/** Héroe de la marca invitada: aquí sí manda su color, ya dentro de su página. */
export function ProductHeroSection({ brand }: ProductHeroSectionProps) {
  const { detail } = brand;

  return (
    /* Era un <header>, que dentro de <main> creaba un segundo landmark `banner`
       junto al ProductTopBar. Como sección con aria-labelledby queda un solo
       banner y el h1 nombra la región. */
    <section
      aria-labelledby="producto-title"
      className="relative overflow-hidden px-6 py-[88px] md:py-24"
    >
      {/* Atmósfera radial de la marca (nunca degradado lineal a pantalla completa) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-48 size-[620px] rounded-full bg-[var(--brand-accent)] opacity-20 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-16 size-[480px] rounded-full bg-[var(--brand-ink)] opacity-[.06] blur-[110px]"
      />

      <div className="relative mx-auto grid max-w-[1160px] items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
        <div>
          <Reveal>
            <Image
              src={brand.wordmark_src}
              /* Decorativo: el <h1> de debajo ya nombra la marca, así que
                 repetirlo en el alt duplicaría el anuncio. */
              alt=""
              aria-hidden
              width={660}
              height={100}
              priority
              className="mb-7 h-[34px] w-auto"
            />
          </Reveal>

          <Reveal delay={80}>
            <p className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent)]">
              <span
                aria-hidden
                className="size-[5px] rounded-full bg-current shadow-[0_0_12px_currentColor]"
              />
              {detail.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-5 font-sora text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--brand-ink)] md:text-[48px] lg:text-[56px]">
              {detail.headline_lead}
              {/* Degradado cálido, no tricolor: en una cadena larga el arco completo
                  deja las últimas letras apagadas sobre el fondo oscuro. */}
              <span className="bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-accent-soft)] bg-clip-text text-transparent">
                {detail.headline_accent}
              </span>
              .
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-[var(--brand-ink-muted)]">
              {detail.description}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap gap-2">
              {detail.chips.map((chip, index) => (
                <BrandChip key={chip} live={index === 0}>
                  {chip}
                </BrandChip>
              ))}
            </div>
          </Reveal>

          <Reveal delay={240}>
            <a
              href={detail.primary_cta.href}
              target={detail.primary_cta.external ? "_blank" : undefined}
              rel={
                detail.primary_cta.external ? "noopener noreferrer" : undefined
              }
              className="mt-9 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--brand-accent)] px-7 py-3 text-sm font-semibold text-[var(--brand-ground)] shadow-[0_0_34px_color-mix(in_srgb,var(--brand-accent)_38%,transparent)] transition-transform duration-base ease-kodecol hover:-translate-y-0.5"
            >
              {detail.primary_cta.label}
            </a>
          </Reveal>
        </div>

        <Reveal delay={140} className="flex justify-center">
          <Image
            src={brand.gallery[0]}
            alt={`Captura de la interfaz de ${brand.name}: ${brand.teaser.kind}`}
            width={480}
            height={347}
            priority
            className="w-full max-w-[470px] rounded-2xl border border-[var(--brand-line)] shadow-[0_24px_70px_rgba(0,0,0,.6)]"
          />
        </Reveal>
      </div>
    </section>
  );
}
