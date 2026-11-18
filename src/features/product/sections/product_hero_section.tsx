import Image from "next/image";
import type { ProductBrand } from "@/core/domain/product_brand";
import { Reveal } from "@/shared/ui/reveal";
import { StaticPicture } from "@/shared/ui/static_picture";
import { VelarisGradient } from "@/shared/ui/velaris_gradient";

interface ProductHeroSectionProps {
  brand: ProductBrand;
}

/**
 * Héroe de la marca invitada: aquí sí manda su color. Gradiente vivo con la
 * paleta del producto, el titular con el degradado de la α y una captura real
 * de la app con notas flotantes de lo que pasa en una venta.
 */
export function ProductHeroSection({ brand }: ProductHeroSectionProps) {
  const { detail, theme } = brand;
  const accent_2 = theme.accent_2 ?? theme.accent;
  const accent_3 = theme.accent_3 ?? theme.accent_soft;

  return (
    /* Era un <header>, que dentro de <main> creaba un segundo landmark `banner`
       junto al ProductTopBar. Como sección con aria-labelledby queda un solo
       banner y el h1 nombra la región. */
    <section
      aria-labelledby="producto-title"
      className="relative isolate overflow-hidden px-6 pb-[90px] pt-[120px] md:min-h-[860px]"
    >
      <VelarisGradient
        background={theme.ground}
        colors={[theme.accent, accent_2, theme.accent, accent_3]}
        speed={1.6}
        grain={0.3}
        className="-z-20 opacity-90"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand-ground)_25%,transparent),color-mix(in_srgb,var(--brand-ground)_10%,transparent)_50%,var(--brand-ground))]"
      />

      <div className="relative mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <Image
              src={brand.isotype_src}
              /* Decorativo: el <h1> ya nombra la marca. */
              alt=""
              aria-hidden
              width={400}
              height={312}
              priority
              className="mb-7 h-auto w-16 drop-shadow-[0_8px_30px_color-mix(in_srgb,var(--brand-accent)_35%,transparent)]"
            />
            <p className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent)]">
              <span aria-hidden className="size-1.5 rounded-full bg-current shadow-[0_0_12px_currentColor]" />
              {detail.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1
              id="producto-title"
              className="mt-[18px] font-display text-[clamp(44px,6vw,86px)] font-extrabold leading-none tracking-[-0.04em] text-[var(--brand-ink)]"
            >
              <span className="sr-only">{brand.name}: </span>
              {detail.headline_lead}
              <span className="bg-[linear-gradient(100deg,var(--brand-accent),var(--brand-accent-3)_55%,var(--brand-accent-2))] bg-clip-text text-transparent">
                {detail.headline_accent}
              </span>
              .
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-[22px] max-w-[58ch] text-lg leading-relaxed text-[var(--brand-ink-muted)]">
              {detail.description}
            </p>
            <div className="mt-[30px] flex flex-wrap gap-3">
              <a
                href={detail.primary_cta.href}
                target={detail.primary_cta.external ? "_blank" : undefined}
                rel={detail.primary_cta.external ? "noopener noreferrer" : undefined}
                className="inline-flex min-h-12 items-center rounded-full bg-[linear-gradient(100deg,var(--brand-accent),color-mix(in_srgb,var(--brand-accent)_70%,black))] px-[26px] text-[15px] font-semibold text-white shadow-[0_12px_40px_-10px_color-mix(in_srgb,var(--brand-accent)_60%,transparent)] transition-transform duration-base ease-kodecol hover:-translate-y-0.5"
              >
                {detail.primary_cta.label}
              </a>
              {detail.journey ? (
                <a
                  href="#venta-real"
                  className="inline-flex min-h-12 items-center rounded-full border border-[var(--brand-line)] bg-white/[.04] px-[26px] text-[15px] font-semibold text-[var(--brand-ink)] transition-colors duration-fast hover:border-[var(--brand-accent)]"
                >
                  Ver cómo vende
                </a>
              ) : null}
            </div>
            <p className="mt-[18px] text-[13px] text-[var(--brand-ink-dim)]">{detail.chips.join(" · ")}</p>
          </Reveal>
        </div>

        {detail.hero_capture ? (
          <Reveal delay={160} className="relative">
            <div className="overflow-hidden rounded-[14px] border border-[var(--brand-line)] bg-[var(--brand-surface)] shadow-[0_30px_80px_-20px_rgb(0_0_0/.85)]">
              <div aria-hidden className="flex h-[30px] items-center gap-1.5 border-b border-white/[.06] bg-[var(--brand-surface-raised)] px-3">
                <i className="size-[9px] rounded-full bg-white/20" />
                <i className="size-[9px] rounded-full bg-white/20" />
                <i className="size-[9px] rounded-full bg-white/20" />
              </div>
              <StaticPicture
                src_base={detail.hero_capture.src_base}
                fallback_extension={detail.hero_capture.fallback_extension}
                alt={detail.hero_capture.alt}
                width={900}
                height={563}
                priority
                className="aspect-[16/10] h-auto w-full object-cover object-left-top"
              />
            </div>
            <p className="mt-2.5 text-right font-mono text-[11px] tracking-[0.08em] text-[var(--brand-ink-dim)]">
              {detail.hero_capture.caption}
            </p>
            {detail.hero_notes?.map((note, index) => (
              <div
                key={note.title}
                aria-hidden
                className={
                  index === 0
                    ? "absolute left-1.5 top-[16%] flex animate-kc-float items-center gap-2.5 rounded-2xl border border-white/10 bg-[color-mix(in_srgb,var(--brand-surface)_78%,transparent)] px-4 py-3 text-[13px] shadow-[0_20px_50px_-10px_rgb(0_0_0/.8)] backdrop-blur-[16px] md:-left-[30px]"
                    : "absolute bottom-[10%] right-1.5 flex animate-kc-float items-center gap-2.5 rounded-2xl border border-white/10 bg-[color-mix(in_srgb,var(--brand-surface)_78%,transparent)] px-4 py-3 text-[13px] shadow-[0_20px_50px_-10px_rgb(0_0_0/.8)] backdrop-blur-[16px] [animation-delay:-3s] md:-right-6"
                }
              >
                <span
                  className={
                    index === 0
                      ? "grid size-[30px] place-items-center rounded-[10px] bg-[var(--brand-accent)] font-bold text-white"
                      : "grid size-[30px] place-items-center rounded-[10px] bg-[var(--brand-accent-2)] font-bold text-white"
                  }
                >
                  {index === 0 ? "✓" : "α"}
                </span>
                <span>
                  <b className="block font-semibold text-[var(--brand-ink)]">{note.title}</b>
                  <span className="text-xs text-[var(--brand-ink-muted)]">{note.description}</span>
                </span>
              </div>
            ))}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
