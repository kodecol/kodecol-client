import type { BrandDetail } from "@/core/domain/product_brand";
import { Reveal } from "@/shared/ui/reveal";
import { BrandSectionHeading } from "./brand_section_heading";

interface PrinciplesSectionProps {
  principles: BrandDetail["principles"];
}

/**
 * La bóveda: la decisión de arquitectura que define el producto.
 * Contraste deliberado con el resto — fondo sólido, sin adornos: es la sección
 * de la confianza y aquí el criterio de ingeniería es el argumento.
 */
export function PrinciplesSection({ principles }: PrinciplesSectionProps) {
  return (
    <section
      aria-labelledby="principios-title"
      className="border-y border-[var(--brand-line)] bg-[var(--brand-ground)] px-6 py-24 [background-image:linear-gradient(0deg,rgba(0,0,0,.35),rgba(0,0,0,.35))]"
    >
      <div className="mx-auto max-w-[1160px]">
        {/*
          El `title` se pasaba vacío, así que esta sección no emitía <h2> y la
          página saltaba de h1 a los h3 de los principios. El JSON ya trae el
          título (es obligatorio por schema); solo hacía falta usarlo.
        */}
        <BrandSectionHeading
          id="principios-title"
          eyebrow={principles.eyebrow}
          title={principles.title}
        />

        <div className="grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <p className="max-w-[20ch] font-sora text-[22px] font-semibold leading-[1.26] tracking-[-0.02em] text-[var(--brand-ink)] md:text-[32px]">
              {principles.quote_lead}
              <span className="text-[var(--brand-accent)]">
                {principles.quote_accent}
              </span>
              .
            </p>
          </Reveal>

          <ol className="flex flex-col">
            {principles.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <li className="grid grid-cols-[auto_1fr] gap-4 border-t border-[var(--brand-line)] py-5 last:border-b">
                  <span className="pt-0.5 font-mono text-[11.5px] tabular-nums text-[var(--brand-accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="mb-1.5 font-sora text-[15px] font-semibold leading-snug text-[var(--brand-ink)]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--brand-ink-muted)]">
                      {item.description}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
