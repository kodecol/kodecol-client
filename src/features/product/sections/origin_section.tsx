import type { BrandDetail } from "@/core/domain/product_brand";
import { Reveal } from "@/shared/ui/reveal";
import { BrandSectionHeading } from "./brand_section_heading";

interface OriginSectionProps {
  origin: BrandDetail["origin"];
}

/** Por qué existe el producto, contado desde el lado de quien lo construyó. */
export function OriginSection({ origin }: OriginSectionProps) {
  return (
    <section
      aria-labelledby="origen-title"
      className="px-6 py-24"
    >
      <div className="mx-auto max-w-[1160px]">
        <BrandSectionHeading id="origen-title" eyebrow={origin.eyebrow} title={origin.title} />
        {/* Diagnóstico → resolución: el primero pesa más, así que se lleva más
            ancho y las dos columnas quedan ópticamente equilibradas. */}
        <div className="grid items-start gap-10 md:grid-cols-[1.35fr_1fr]">
          {origin.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 32)} delay={index * 80}>
              <p className="max-w-[64ch] text-base leading-relaxed text-[var(--brand-ink-muted)]">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
