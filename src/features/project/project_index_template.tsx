import Link from "next/link";
import type { ClientProject } from "@/core/domain/client_project";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { Button } from "@/shared/ui/button";
import { Chip } from "@/shared/ui/chip";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { Fireflies } from "@/shared/ui/fireflies";
import { GiantWord } from "@/shared/ui/giant_word";
import { LineIcon } from "@/shared/ui/line_icon";
import { PerspectiveTunnel, type TunnelImage } from "@/shared/ui/perspective_tunnel";
import { Reveal } from "@/shared/ui/reveal";
import { StaticPicture } from "@/shared/ui/static_picture";
import { PROJECT_STATUS_LABEL, StatusChip } from "@/shared/ui/status_chip";
import { WhatsappIcon } from "@/shared/ui/whatsapp_icon";

interface ProjectIndexTemplateProps {
  projects: readonly ClientProject[];
}

/**
 * /proyectos: el túnel en perspectiva (las capturas reales vienen desde el
 * fondo con el scroll), la lista de proyectos y un cierre con el orbe de luz
 * en la pradera de noche.
 */
export function ProjectIndexTemplate({ projects }: ProjectIndexTemplateProps) {
  /* Intercaladas: una de cada proyecto por vuelta, y la de celular al final. */
  const tunnel_images: TunnelImage[] = [];
  for (let round = 0; round < 3; round++) {
    for (const project of projects) {
      const shot = project.detail.desktop_shots[round];
      if (shot) tunnel_images.push({ src: `${shot.src_base}.webp`, label: project.name });
    }
  }
  for (const project of projects) {
    tunnel_images.push({ src: `${project.detail.mobile_shot.src_base}.webp`, label: project.name, portrait: true });
  }

  return (
    <>
      <section aria-labelledby="proyectos-title">
        <PerspectiveTunnel images={tunnel_images}>
          <div>
            <Eyebrow className="justify-center">Proyectos Kodecol</Eyebrow>
            <h1
              id="proyectos-title"
              className="mt-[18px] font-display text-[clamp(48px,8.4vw,124px)] font-extrabold leading-[.95] tracking-[-0.045em] text-text-primary"
            >
              Hecho aquí.
              <em className="block font-serif text-[.82em] font-normal italic tracking-[-0.02em] text-green-200">
                Funcionando allá afuera.
              </em>
            </h1>
            <p className="mt-5 text-text-secondary">Baja para atravesar el trabajo.</p>
          </div>
        </PerspectiveTunnel>
      </section>

      <div className="mx-auto max-w-[1200px] px-6">
        <section aria-label="Lista de proyectos" className="grid gap-[22px] py-[60px]">
          {projects.map((project, index) => (
            <Reveal key={project.slug}>
              <Link
                href={`/proyectos/${project.slug}`}
                className="group grid overflow-hidden rounded-[30px] border border-border-default bg-surface-1 transition-[border-color,transform] duration-slow ease-kodecol hover:-translate-y-1 hover:border-border-accent md:grid-cols-[1.2fr_1fr]"
              >
                <div className={index % 2 ? "relative min-h-[220px] overflow-hidden md:order-2 md:min-h-[380px]" : "relative min-h-[220px] overflow-hidden md:min-h-[380px]"}>
                  <StaticPicture
                    src_base={project.scene.background.src_base}
                    fallback_extension={project.scene.background.fallback_extension}
                    alt={`${project.name} encendido en un computador retro, en la pradera`}
                    width={1440}
                    height={900}
                    fill
                    className="object-cover transition-transform duration-1000 ease-kodecol group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-col justify-center gap-4 px-[22px] py-[26px] md:p-10">
                  <p className="text-xs uppercase tracking-[0.14em] text-text-muted">
                    {project.sector} · {project.city} · {project.year}
                  </p>
                  <h2 className="font-display text-[clamp(30px,3.4vw,46px)] font-extrabold leading-none tracking-[-0.045em] text-text-primary">
                    {project.name}
                  </h2>
                  <p className="text-text-secondary">{project.detail.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    <StatusChip status={project.status} label={PROJECT_STATUS_LABEL[project.status]} />
                    {project.teaser.chips.map((chip) => (
                      <Chip key={chip}>{chip}</Chip>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 font-semibold text-mint-500">
                    Ver el proyecto
                    <LineIcon name="arrow_right" size={16} className="transition-transform duration-slow group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </section>

        <section
          aria-labelledby="proyectos-cta-title"
          className="relative isolate mb-[120px] h-[clamp(640px,90svh,900px)] overflow-hidden rounded-[40px]"
        >
          <StaticPicture
            src_base="/images/scenes/cta_desktop"
            fallback_extension="jpg"
            width={1600}
            height={900}
            alt=""
            fill
            className="-z-10 object-cover object-[50%_70%]"
          />
          <Fireflies />
          <div className="relative grid justify-items-center gap-[18px] px-5 pt-[12%] text-center">
            <h2 id="proyectos-cta-title" className="sr-only">
              ¿El siguiente es el tuyo?
            </h2>
            <p aria-hidden className="font-serif text-[clamp(30px,3.6vw,54px)] italic leading-none text-cream-ink">
              ¿el siguiente
            </p>
            <GiantWord text="es el tuyo?" className="text-[clamp(70px,12vw,190px)]" />
            <p className="max-w-[54ch] text-lg text-green-100">
              Escríbenos qué vendes y dónde se te está escapando el cliente. Te decimos qué construiríamos.
            </p>
            <Button href={SITE_CONFIG.whatsapp_url} external>
              <WhatsappIcon size={20} />
              Hablemos por WhatsApp
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
