import Link from "next/link";
import type { DeveloperProfile } from "@/core/domain/developer_profile";
import type { NavLink } from "@/shared/config/site_config";
import { Chip } from "@/shared/ui/chip";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { Footer } from "@/shared/ui/footer";
import { GlassCard } from "@/shared/ui/glass_card";
import { LineIcon } from "@/shared/ui/line_icon";
import { Navbar } from "@/shared/ui/navbar";
import { Reveal } from "@/shared/ui/reveal";
import { MAIN_CONTENT_ID } from "@/shared/ui/skip_link";
import { Breadcrumb } from "@/shared/ui/breadcrumb";

interface PortfolioIndexTemplateProps {
  profiles: readonly DeveloperProfile[];
  service_links: readonly NavLink[];
}

/** Página índice del equipo (/equipo): hub hacia los portafolios individuales. */
export function PortfolioIndexTemplate({
  profiles,
  service_links,
}: PortfolioIndexTemplateProps) {
  return (
    <>
      <Navbar />
      <main id={MAIN_CONTENT_ID}>
        <Breadcrumb
          crumbs={[
            { label: "Inicio", href: "/" },
            { label: "Equipo", href: null },
          ]}
        />

        <section
          aria-labelledby="equipo-index-title"
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
              <Eyebrow className="block">La crew</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h1
                id="equipo-index-title"
                className="mt-4 max-w-[860px] font-sora text-[30px] font-bold leading-[1.06] tracking-[-0.02em] text-text-primary md:text-[50px]"
              >
                Las personas que{" "}
                <span className="bg-gradient-to-r from-mint-500 to-green-300 bg-clip-text text-transparent">
                  construyen futuro
                </span>
              </h1>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 max-w-[660px] text-lg leading-relaxed text-text-secondary">
                Detrás de cada solución hay un equipo humano. Cada desarrollador tiene
                su propio espacio: su historia, su experiencia y los proyectos que ha
                hecho realidad.
              </p>
            </Reveal>
          </div>
        </section>

        <section
          aria-labelledby="listado-equipo-title"
          className="bg-surface-1 px-6 py-20 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <h2 id="listado-equipo-title" className="sr-only">
              Listado del equipo
            </h2>
            <div className="grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile, index) => (
                <Reveal key={profile.slug} delay={60 + index * 40}>
                  <GlassCard as="article" interactive className="h-full">
                    <Link
                      href={`/equipo/${profile.slug}`}
                      className="flex h-full flex-col gap-3 p-7"
                    >
                      <h3 className="font-sora text-xl font-semibold text-text-primary">
                        {profile.full_name}
                      </h3>
                      <p className="text-sm font-medium text-mint-500">
                        {profile.role_badge}
                      </p>
                      <p className="text-[14px] leading-relaxed text-text-secondary">
                        {profile.tagline}
                      </p>
                      <ul className="flex flex-wrap gap-2 pt-1">
                        {profile.metrics.map((metric) => (
                          <li key={metric.label}>
                            <Chip>
                              {metric.value} {metric.label}
                            </Chip>
                          </li>
                        ))}
                      </ul>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-mint-500">
                        Ver portafolio
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
