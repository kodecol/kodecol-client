import Link from "next/link";
import type { ClientProject } from "@/core/domain/client_project";
import { Button } from "@/shared/ui/button";
import { Chip } from "@/shared/ui/chip";
import { DisplayHeading } from "@/shared/ui/display_heading";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { LineIcon } from "@/shared/ui/line_icon";
import { Reveal } from "@/shared/ui/reveal";
import { StaticPicture } from "@/shared/ui/static_picture";
import { PROJECT_STATUS_LABEL, StatusChip } from "@/shared/ui/status_chip";
import { PROJECTS_CONTENT } from "./content";
import { StackDepth } from "./stack_depth";

interface ProjectsSectionProps {
  /** Proyectos de dominio ya validados; llegan desde el composition root. */
  projects: readonly ClientProject[];
}

/**
 * Proyectos (#proyectos) en la landing: una pila de tarjetas sticky. Cada una
 * muestra el sitio del cliente encendido en un computador retro en la pradera
 * y lleva a su ficha. Server component; la profundidad de la pila es una hoja client.
 */
export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) return null;
  const content = PROJECTS_CONTENT;

  return (
    <section id="proyectos" aria-labelledby="proyectos-title" className="relative px-6 pb-6 pt-32">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <header className="mb-14 grid items-end gap-6 md:grid-cols-[1.1fr_.9fr] md:gap-x-16">
            <div className="grid gap-[18px]">
              <Eyebrow>{content.eyebrow}</Eyebrow>
              <DisplayHeading
                id="proyectos-title"
                lead={content.title_lead}
                accent={content.title_accent}
                className="max-w-[18ch] text-[clamp(34px,4.6vw,60px)] text-text-primary"
              />
            </div>
            <p className="max-w-[58ch] text-lg leading-relaxed text-text-secondary">{content.description}</p>
          </header>
        </Reveal>

        <StackDepth className="grid gap-7">
          {projects.map((project, index) => (
            <div
              key={project.slug}
              data-stack-item
              className="sticky"
              style={{ top: `calc(84px + ${index * 18}px)` }}
            >
              <Link
                href={`/proyectos/${project.slug}`}
                className="group grid origin-top overflow-hidden rounded-[32px] border border-border-default bg-[linear-gradient(160deg,var(--color-surface-3),var(--color-surface-1)_60%)] shadow-glass-lg will-change-transform md:min-h-[560px] md:grid-cols-[1.35fr_1fr]"
              >
                <div className="relative aspect-[16/10] md:aspect-auto">
                  <StaticPicture
                    src_base={project.scene.background.src_base}
                    fallback_extension={project.scene.background.fallback_extension}
                    width={1440}
                    height={900}
                    alt={`${project.name} encendido en un computador retro, en la pradera`}
                    fill
                    className="object-cover object-[62%_50%]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,var(--color-surface-1))] md:bg-[linear-gradient(90deg,transparent_60%,var(--color-surface-1))]"
                  />
                </div>
                <div className="flex flex-col gap-5 px-6 py-7 md:px-[46px] md:py-12">
                  <p className="text-xs uppercase tracking-[0.14em] text-text-muted">
                    {project.sector} · {project.city}
                  </p>
                  <h3 className="font-display text-[clamp(30px,3vw,42px)] font-extrabold leading-none tracking-[-0.045em] text-text-primary">
                    {project.name}
                    <em className="mt-1.5 block font-serif text-[.86em] font-normal italic tracking-[-0.01em] text-mint-300">
                      {project.teaser.accent}
                    </em>
                  </h3>
                  <p className="text-text-secondary">{project.teaser.summary}</p>
                  <ul className="grid gap-2.5 border-t border-border-default pt-[18px]">
                    {project.teaser.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5 text-[14.5px] text-green-100">
                        <span aria-hidden className="mt-3 h-px w-3.5 shrink-0 bg-mint-500" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <StatusChip status={project.status} label={PROJECT_STATUS_LABEL[project.status]} />
                    {project.teaser.chips.map((chip) => (
                      <Chip key={chip}>{chip}</Chip>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-mint-500">
                    {content.card_link_label}
                    <LineIcon
                      name="arrow_right"
                      size={16}
                      className="transition-transform duration-slow ease-kodecol group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </StackDepth>

        <div className="mt-11 flex justify-center">
          <Button href="/proyectos" variant="secondary">
            {content.all_label}
            <LineIcon name="arrow_right" size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
