import Link from "next/link";
import type { ProductBrand } from "@/core/domain/product_brand";
import { MAIN_CONTENT_ID } from "@/shared/ui/skip_link";
import { build_brand_theme } from "./brand_theme";
import { ProductTopBar } from "./product_top_bar";
import { MetricsSection } from "./sections/metrics_section";
import { OriginSection } from "./sections/origin_section";
import { PilotsSection } from "./sections/pilots_section";
import { PrinciplesSection } from "./sections/principles_section";
import { ProductClosingSection } from "./sections/product_closing_section";
import { ProductHeroSection } from "./sections/product_hero_section";
import { StackSection } from "./sections/stack_section";

interface ProductTemplateProps {
  brand: ProductBrand;
}

/**
 * Plantilla polimórfica de marca propia: recibe un ProductBrand por props y
 * sirve para cualquier producto. Añadir una marca = un JSON + assets, cero código.
 *
 * Aquí —y solo aquí— manda el color del producto: el tema entra como variables
 * CSS acotadas a este árbol, así que fuera de esta página el sitio sigue siendo
 * Kodecol de principio a fin.
 */
export function ProductTemplate({ brand }: ProductTemplateProps) {
  return (
    <div
      style={build_brand_theme(brand.theme)}
      className="min-h-screen bg-[var(--brand-ground)] text-[var(--brand-ink)]"
    >
      <ProductTopBar brand={brand} />
      <main id={MAIN_CONTENT_ID}>
        <ProductHeroSection brand={brand} />
        <OriginSection origin={brand.detail.origin} />
        <PrinciplesSection principles={brand.detail.principles} />
        <MetricsSection metrics={brand.detail.metrics} />
        <StackSection stack={brand.detail.stack} />
        <PilotsSection pilots={brand.detail.pilots} />
        <ProductClosingSection closing={brand.detail.closing} />
      </main>
      {/* La página de marca no tenía footer: era la única sin salida de vuelta
          al sitio ni atribución de quién opera el producto. */}
      <footer className="border-t border-[var(--brand-line)] px-6 py-8 text-center text-[13px] text-[var(--brand-ink-muted)]">
        Un producto de{" "}
        <Link
          href="/"
          className="text-[var(--brand-accent)] transition-opacity duration-fast hover:opacity-80"
        >
          Kodecol
        </Link>{" "}
        · <em>Construimos futuro.</em>
      </footer>
    </div>
  );
}
