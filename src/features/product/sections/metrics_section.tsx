import type { ProductBrand } from "@/core/domain/product_brand";
import { cn } from "@/shared/lib/cn";
import { Reveal } from "@/shared/ui/reveal";
import { WarpCarousel } from "@/shared/ui/warp_carousel";
import { build_brand_warp_cards } from "../brand_warp_cards";
import { BrandSectionHeading } from "./brand_section_heading";

interface MetricsSectionProps {
  brand: ProductBrand;
}

/**
 * Cifras de ingeniería: lo que un folleto de producto nunca muestra. Las
 * destacadas giran en el carrusel warp con la paleta de la marca; todas van
 * además como lista de definición (el canvas es decorativo). Al lado, los
 * canales con su estado real, sin prometer lo que no hay.
 */
export function MetricsSection({ brand }: MetricsSectionProps) {
  const { metrics, channels } = brand.detail;

  return (
    <section aria-labelledby="metricas-title" className="px-6 py-24">
      <div className="mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <BrandSectionHeading
            id="metricas-title"
            eyebrow={metrics.eyebrow}
            title={metrics.title}
            description={metrics.description}
          />
          {channels && channels.length > 0 ? (
            <ul className="-mt-4 grid gap-2.5">
              {channels.map((channel) => (
                <li
                  key={channel.name}
                  className="flex justify-between gap-3 rounded-[14px] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-[18px] py-3.5 text-sm text-[var(--brand-ink)]"
                >
                  {channel.name}
                  <span className={cn("text-xs", channel.live ? "text-[var(--brand-accent)]" : "text-[var(--brand-ink-dim)]")}>
                    {channel.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Reveal>
          <WarpCarousel
            cards={build_brand_warp_cards(brand)}
            background={brand.theme.ground}
            aria_label={`${brand.name} en cifras`}
            className="aspect-[5/4] w-full rounded-[28px] max-lg:aspect-auto max-lg:h-[460px]"
          />
          {/* Un <dl> solo admite dt/dd, opcionalmente envueltos en UN div. */}
          <dl className="sr-only">
            {metrics.items.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
