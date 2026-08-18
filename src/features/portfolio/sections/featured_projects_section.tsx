import type { DeveloperProfile } from "@/core/domain/developer_profile";
import { Chip } from "@/shared/ui/chip";
import { GlassCard } from "@/shared/ui/glass_card";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";

interface FeaturedProjectsSectionProps {
  profile: DeveloperProfile;
}

/** Proyectos destacados: 1 tarjeta grande (featured, gradiente de marca) + tarjetas de apoyo. */
export function FeaturedProjectsSection({ profile }: FeaturedProjectsSectionProps) {
  const featured = profile.projects.find((project) => project.featured);
  const others = profile.projects.filter((project) => !project.featured);

  return (
    <section
      aria-labelledby="proyectos-title"
      className="px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1000px]">
        <Reveal>
          <SectionHeading
            id="proyectos-title"
            align="left"
            eyebrow="Proyectos destacados"
            title="Cosas que he construido."
          />
        </Reveal>

        <div className="mt-10 grid gap-5">
          {featured ? (
            <Reveal delay={60}>
              <article
                className="relative overflow-hidden rounded-xl border border-border-accent p-7 shadow-glass md:p-9"
                style={{
                  background:
                    "linear-gradient(150deg, rgba(0,115,92,.45), rgba(1,75,77,.30))",
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(52,224,161,.22), transparent 70%)",
                  }}
                />
                <span className="relative w-fit rounded-full border border-border-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-mint-300">
                  {featured.badge}
                </span>
                <h3 className="relative mt-4 font-sora text-xl font-semibold text-text-primary md:text-2xl">
                  {featured.title}
                </h3>
                <p className="relative mt-3 max-w-[640px] text-[15px] leading-relaxed text-green-100">
                  {featured.description}
                </p>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  {featured.chips.map((chip) => (
                    <Chip key={chip}>{chip}</Chip>
                  ))}
                </div>
              </article>
            </Reveal>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {others.map((project, index) => (
              <Reveal key={project.title} delay={120 + index * 60}>
                <GlassCard as="article" interactive className="flex h-full flex-col gap-3 p-6">
                  <span className="w-fit rounded-full border border-border-subtle px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                    {project.badge}
                  </span>
                  <h3 className="font-sora text-lg font-semibold text-text-primary">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {project.description}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {project.chips.map((chip) => (
                      <Chip key={chip}>{chip}</Chip>
                    ))}
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
