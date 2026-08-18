import Link from "next/link";
import type { ProductBrand } from "@/core/domain/product_brand";
import type { NavLink } from "@/shared/config/site_config";
import { Breadcrumb } from "@/shared/ui/breadcrumb";
import { Chip } from "@/shared/ui/chip";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { Footer } from "@/shared/ui/footer";
import { GlassCard } from "@/shared/ui/glass_card";
import { LineIcon } from "@/shared/ui/line_icon";
import { Navbar } from "@/shared/ui/navbar";
import { Reveal } from "@/shared/ui/reveal";
import { MAIN_CONTENT_ID } from "@/shared/ui/skip_link";

interface ProductIndexTemplateProps {
  brands: readonly ProductBrand[];
  service_links: readonly NavLink[];
}

/**
 * Página índice de marcas propias (/marcas).
 *
 * Fuera de su página de detalle manda Kodecol (§6 de architecture.md): aquí no
 * se aplica ningún tema de marca invitada, solo el acento menta corporativo.
 */
export function ProductIndexTemplate({
  brands,
  service_links,
}: ProductIndexTemplateProps) {
  return (
    <>
      <Navbar />
      <main id={MAIN_CONTENT_ID}>
        <Breadcrumb
          crumbs={[
            { label: "Inicio", href: "/" },
            { label: "Marcas propias", href: null },
          ]}
        />

        <section
          aria-labelledby="marcas-index-title"
          className="relative overflow-hidden px-6 pb-16 pt-10 md:pb-20 md:pt-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[860px] max-w-full -translate-x-1/2"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 0%, rgba(0,115,92,.28), transparent 75%)",
            }}
          />
          <div className="relative mx-auto max-w-[1200px]">
            <Reveal>
              <Eyebrow className="block">Marcas propias</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h1
                id="marcas-index-title"
                className="mt-4 max-w-[860px] font-sora text-[30px] font-bold leading-[1.06] tracking-[-0.02em] text-text-primary md:text-[50px]"
              >
                No solo construimos para otros. También construimos{" "}
                <span className="bg-gradient-to-r from-mint-500 to-green-300 bg-clip-text text-transparent">
                  lo nuestro
                </span>
              </h1>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 max-w-[660px] text-lg leading-relaxed text-text-secondary">
                Parte de lo que sabemos hacer lo probamos primero en nuestros propios
                productos. Nacen aquí, los operamos nosotros y salen al mercado con
                marca propia.
              </p>
            </Reveal>
          </div>
        </section>

        <section
          aria-labelledby="listado-marcas-title"
          className="bg-surface-1 px-6 py-20 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <h2 id="listado-marcas-title" className="sr-only">
              Listado de marcas propias
            </h2>
            <div className="grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
              {brands.map((brand, index) => (
                <Reveal key={brand.slug} delay={60 + index * 40}>
                  <GlassCard as="article" interactive className="h-full">
                    <Link
                      href={`/marcas/${brand.slug}`}
                      className="flex h-full flex-col gap-3 p-7"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-mint-500">
                        {brand.teaser.kind}
                      </span>
                      <h3 className="font-sora text-xl font-semibold text-text-primary">
                        {brand.name}
                      </h3>
                      <p className="text-[14px] leading-relaxed text-text-secondary">
                        {brand.teaser.summary}
                      </p>
                      <ul className="flex flex-wrap gap-2 pt-1">
                        {brand.teaser.chips.map((chip) => (
                          <li key={chip}>
                            <Chip>{chip}</Chip>
                          </li>
                        ))}
                      </ul>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-mint-500">
                        {brand.teaser.cta_label}
                        <LineIcon name="arrow_right" size={14} />
                      </span>
                    </Link>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer service_links={service_links} />
    </>
  );
}
