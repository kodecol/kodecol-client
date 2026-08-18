import Link from "next/link";
import type { BrandDetail } from "@/core/domain/product_brand";
import { Reveal } from "@/shared/ui/reveal";

interface ProductClosingSectionProps {
  closing: BrandDetail["closing"];
}

/**
 * Cierre a dos puertas: una lleva al sitio del producto (el giño de venta) y la
 * otra a Kodecol (que es quien protagoniza). Cada CTA lleva el color de su marca
 * — es la expresión literal de la relación entre las dos.
 */
export function ProductClosingSection({ closing }: ProductClosingSectionProps) {
  return (
    <section
      aria-labelledby="cierre-marca-title"
      className="relative overflow-hidden border-t border-[var(--brand-line)] px-6 py-[100px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 100% at 50% 0%, var(--brand-accent), transparent 62%)",
          opacity: 0.15,
        }}
      />

      <div className="relative mx-auto flex max-w-[1160px] flex-col items-center gap-5 text-center">
        <Reveal>
          <h2
            id="cierre-marca-title"
            className="max-w-[17ch] font-sora text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--brand-ink)] md:text-[42px]"
          >
            {closing.title}
          </h2>
        </Reveal>

        <Reveal delay={70}>
          <p className="max-w-[58ch] text-base leading-relaxed text-[var(--brand-ink-muted)]">
            {closing.description}
          </p>
        </Reveal>

        <Reveal delay={130}>
          <div className="mt-3 flex flex-wrap justify-center gap-3.5">
            <a
              href={closing.product_cta.href}
              target={closing.product_cta.external ? "_blank" : undefined}
              rel={
                closing.product_cta.external ? "noopener noreferrer" : undefined
              }
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--brand-accent)] px-7 py-3 text-sm font-semibold text-[var(--brand-ground)] shadow-[0_0_34px_color-mix(in_srgb,var(--brand-accent)_38%,transparent)] transition-transform duration-base ease-kodecol hover:-translate-y-0.5"
            >
              {closing.product_cta.label}
            </a>
            {/* Verde de Kodecol, deliberadamente, dentro del mundo de la marca invitada */}
            <Link
              href={closing.kodecol_cta.href}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-mint-500 px-7 py-3 text-sm font-semibold text-text-on-accent shadow-glow-accent transition-transform duration-base ease-kodecol hover:-translate-y-0.5"
            >
              {closing.kodecol_cta.label}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <p className="max-w-[52ch] text-[13px] leading-relaxed text-[var(--brand-ink-dim)]">
            {closing.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
