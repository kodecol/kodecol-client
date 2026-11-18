import Link from "next/link";
import type { ClientProject, ProjectImage } from "@/core/domain/client_project";
import { CANVAS_PALETTE as P } from "@/shared/config/canvas_palette";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { cn } from "@/shared/lib/cn";
import { Breadcrumb } from "@/shared/ui/breadcrumb";
import { BrowserFrame } from "@/shared/ui/browser_frame";
import { Button } from "@/shared/ui/button";
import { Chip } from "@/shared/ui/chip";
import { DisplayHeading } from "@/shared/ui/display_heading";
import { GiantWord } from "@/shared/ui/giant_word";
import { LayeredScene } from "@/shared/ui/layered_scene";
import { LineIcon } from "@/shared/ui/line_icon";
import { StaticPicture } from "@/shared/ui/static_picture";
import { PROJECT_STATUS_LABEL, StatusChip } from "@/shared/ui/status_chip";
import { VelarisGradient } from "@/shared/ui/velaris_gradient";
import { WhatsappIcon } from "@/shared/ui/whatsapp_icon";
import { AnatomyLeaders } from "./anatomy_leaders";
import { FlowLine } from "./flow_line";

interface ProjectTemplateProps {
  project: ClientProject;
  next: ClientProject;
}

/** Barra del navegador: 30 px. Las coordenadas de los callouts son sobre la captura. */
const BAR = 30;

function Shot({ image, label, className }: { image: ProjectImage; label: string; className?: string }) {
  return (
    <BrowserFrame label={label} className={className}>
      <StaticPicture
        src_base={image.src_base}
        fallback_extension={image.fallback_extension}
        alt={image.alt}
        width={1000}
        height={625}
        className="aspect-[16/10] h-auto w-full object-cover object-top"
      />
    </BrowserFrame>
  );
}

function Chapter({ n, id, lead, accent }: { n: string; id: string; lead: string; accent: string }) {
  return (
    <div className="mb-9 flex items-baseline gap-[18px]">
      <span aria-hidden className="font-mono text-[15px] font-light tracking-[0.08em] text-mint-500">
        {n}
      </span>
      <DisplayHeading
        id={id}
        lead={lead}
        accent={accent}
        className="text-[clamp(32px,4vw,54px)] text-text-primary"
        accent_class_name="text-green-200"
      />
      <span aria-hidden className="h-px flex-1 self-center bg-gradient-to-r from-border-strong to-transparent" />
    </div>
  );
}

/**
 * Ficha de proyecto (plantilla polimórfica: recibe un ClientProject). Abre con
 * la escena de la pradera y la frase motion (K-24), y explica el trabajo con
 * capturas reales y gráficos editoriales: 01 anatomía con callouts técnicos,
 * 02 el celular con sus cotas, 03 el recorrido y 04 la ficha técnica.
 */
export function ProjectTemplate({ project, next }: ProjectTemplateProps) {
  const { scene, detail } = project;
  const site_label = project.site_url ? project.site_url.replace(/^https?:\/\//, "") : "Vista previa privada";
  const left = detail.callouts.map((c, i) => ({ ...c, n: String(i + 1).padStart(2, "0") })).filter((c) => c.side === "left");
  const right = detail.callouts.map((c, i) => ({ ...c, n: String(i + 1).padStart(2, "0") })).filter((c) => c.side === "right");
  const Note = ({ c }: { c: (typeof left)[number] }) => (
    <div
      data-callout={c.n}
      data-side={c.side}
      className="transition-[opacity,transform] duration-700 ease-kodecol group-data-[drawn=false]/anatomy:translate-y-2.5 group-data-[drawn=false]/anatomy:opacity-0 max-[1000px]:!translate-y-0 max-[1000px]:!opacity-100"
    >
      <p className="font-mono text-[11px] tracking-[0.12em] text-mint-500">
        {c.n} · {c.kicker.toUpperCase()}
      </p>
      <p className="mt-1.5 font-display text-[17px] font-bold leading-tight tracking-[-0.02em] text-text-primary">{c.title}</p>
      <p className="mt-1.5 text-[13.5px] leading-normal text-text-secondary">{c.description}</p>
    </div>
  );

  return (
    <>
      <section aria-label={`${project.name}: ${scene.entry} ${scene.word}`}>
        <LayeredScene
          background={scene.background}
          foreground={scene.foreground}
          object_position="var(--case-op)"
          fireflies
          priority
          className="h-[760px] [--case-op:68%_50%] md:h-[clamp(640px,92svh,940px)] md:[--case-op:50%_40%]"
          word={
            <div
              className="absolute left-1/2 z-[2] -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${scene.word_top}%` }}
            >
              <GiantWord text={scene.word} appear="load" className="text-[24vw] md:text-[clamp(90px,13vw,210px)]" />
            </div>
          }
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[4] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-bg)_75%,transparent),color-mix(in_srgb,var(--color-bg)_25%,transparent)_38%,transparent_60%),linear-gradient(180deg,color-mix(in_srgb,var(--color-bg)_55%,transparent),transparent_25%,transparent_70%,var(--color-bg))]"
          />
          <p
            aria-hidden
            className="absolute inset-x-0 top-[11%] z-[5] px-5 text-center font-serif text-[clamp(28px,3vw,46px)] italic leading-none tracking-[-0.02em] text-cream-ink [text-shadow:0_2px_30px_rgb(0_0_0/.45)] md:top-[8%]"
          >
            {scene.entry}
          </p>
          <p
            aria-hidden
            className="absolute bottom-[9%] left-[max(24px,calc((100vw-1200px)/2+24px))] z-[5] max-w-[16ch] font-display text-[clamp(30px,3.6vw,56px)] font-extrabold leading-[0.95] tracking-[-0.05em] text-cream-ink [text-shadow:0_2px_26px_rgb(0_0_0/.45)]"
          >
            {scene.remate}
          </p>
        </LayeredScene>
      </section>

      <div className="[&>nav]:pt-6 md:[&>nav]:pt-6">
        <Breadcrumb
          crumbs={[
            { label: "Inicio", href: "/" },
            { label: "Proyectos", href: "/proyectos" },
            { label: project.name, href: null },
          ]}
        />
      </div>

      <div className="mx-auto max-w-[1200px] px-6">
        <header className="grid items-end gap-x-10 gap-y-6 pb-10 pt-8 md:grid-cols-[1fr_auto]">
          <div>
            <h1 className="font-display text-[clamp(40px,5vw,72px)] font-extrabold leading-none tracking-[-0.045em] text-text-primary">
              {project.name}
              <em className="mt-1.5 block font-serif text-[.7em] font-normal italic tracking-[-0.01em] text-mint-300">
                {detail.headline_lead} {detail.headline_accent}
              </em>
            </h1>
            <p className="mt-3.5 max-w-[58ch] text-lg leading-relaxed text-text-secondary">{detail.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <StatusChip status={project.status} label={PROJECT_STATUS_LABEL[project.status]} />
            {project.teaser.chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </div>
        </header>

        <dl className="grid grid-cols-2 border-y border-border-default md:grid-cols-5">
          {[
            ["Cliente", project.name],
            ["Sector", project.sector],
            ["Ciudad", project.city],
            ["Año", project.year],
            ["Sitio", site_label],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 py-[22px] pr-[18px]">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">{label}</dt>
              <dd className="mt-1.5 truncate text-[15px] text-text-primary">
                {label === "Sitio" && project.site_url ? (
                  <a href={project.site_url} target="_blank" rel="noopener noreferrer" className="hover:text-mint-500">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby="anatomia-title" className="pb-10 pt-20">
          <Chapter n="01" id="anatomia-title" lead="Anatomía de la" accent="portada." />
          <AnatomyLeaders>
            <div className="grid gap-x-7 min-[1001px]:grid-cols-[220px_minmax(0,1fr)_220px]">
              <div className="relative z-[2] order-2 mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 min-[1001px]:order-none min-[1001px]:mt-0 min-[1001px]:flex min-[1001px]:flex-col min-[1001px]:justify-around min-[1001px]:text-right">
                {left.map((c) => (
                  <Note key={c.n} c={c} />
                ))}
              </div>
              <div className="relative z-[1]">
                <Shot image={detail.desktop_shots[0]} label={site_label} />
                {detail.callouts.map((c, i) => (
                  <span
                    key={c.title}
                    data-marker={String(i + 1).padStart(2, "0")}
                    aria-hidden
                    className="absolute z-[3] -ml-[13px] -mt-[13px] grid size-[26px] place-items-center rounded-full bg-mint-500 font-mono text-[10px] font-semibold text-text-on-accent shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-mint-500)_22%,transparent),var(--shadow-glow-accent)] after:absolute after:-inset-1.5 after:animate-kc-ping after:rounded-full after:border after:border-mint-500"
                    style={{ left: `${c.x}%`, top: `calc(${BAR}px + (100% - ${BAR}px) * ${c.y / 100})` }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                ))}
                <span
                  aria-hidden
                  className="pointer-events-none absolute z-[2] rounded-md border border-dashed border-mint-300/55"
                  style={{
                    left: `${detail.crop.x}%`,
                    width: `${detail.crop.width}%`,
                    top: `calc(${BAR}px + (100% - ${BAR}px) * ${detail.crop.y / 100})`,
                    height: `calc((100% - ${BAR}px) * ${detail.crop.height / 100})`,
                  }}
                >
                  <i className="absolute -top-5 left-0 whitespace-nowrap font-mono text-[10px] not-italic tracking-[0.1em] text-mint-300">
                    {detail.crop.label}
                  </i>
                </span>
              </div>
              <div className="relative z-[2] order-3 mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 min-[1001px]:order-none min-[1001px]:mt-0 min-[1001px]:flex min-[1001px]:flex-col min-[1001px]:justify-around">
                {right.map((c) => (
                  <Note key={c.n} c={c} />
                ))}
              </div>
            </div>
          </AnatomyLeaders>
        </section>

        <section aria-labelledby="celular-title" className="grid items-center justify-items-center gap-[70px] py-[70px] md:grid-cols-[auto_minmax(0,1fr)] md:justify-items-stretch">
          <div className="relative pb-2.5 pr-11 pt-[34px]">
            <span aria-hidden className="absolute left-0 right-11 top-1 grid h-3.5 place-items-center border-x border-mint-300 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-mint-300">
              <span className="relative bg-bg px-2 font-mono text-[11px] text-mint-300">390 px</span>
            </span>
            <div className="w-[230px] overflow-hidden rounded-[26px] border-[5px] border-black bg-black shadow-soft-lg md:w-[270px]">
              <StaticPicture
                src_base={detail.mobile_shot.src_base}
                fallback_extension={detail.mobile_shot.fallback_extension}
                alt={detail.mobile_shot.alt}
                width={300}
                height={649}
                className="aspect-[9/19] h-auto w-full object-cover object-top"
              />
            </div>
            <span aria-hidden className="absolute bottom-2.5 right-1.5 top-[34px] grid w-3.5 place-items-center border-y border-mint-300 before:absolute before:inset-y-0 before:left-1/2 before:w-px before:bg-mint-300">
              <span className="relative bg-bg py-2 font-mono text-[11px] text-mint-300 [writing-mode:vertical-rl]">
                844 px · primer pliegue
              </span>
            </span>
          </div>
          <div className="w-full">
            <Chapter n="02" id="celular-title" lead="En el" accent="celular." />
            <ol className="border-t border-border-default">
              {detail.mobile_notes.map((note, i) => (
                <li key={note.title} className="grid grid-cols-[54px_1fr] gap-4 border-b border-border-default py-5">
                  <span aria-hidden className="font-display text-[30px] font-light leading-none text-green-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-text-primary">{note.title}</h3>
                    <p className="mt-1 text-[15px] text-text-secondary">{note.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="recorrido-title" className="py-[70px]">
          <Chapter n="03" id="recorrido-title" lead="El" accent="recorrido." />
          <ol className="relative grid gap-[26px] md:grid-cols-3">
            <FlowLine />
            {detail.flow.map((step, i) => (
              <li key={step.title} className="group relative z-[1]">
                <Shot
                  image={detail.desktop_shots[i]}
                  label={site_label}
                  className={cn(
                    "transition-transform duration-slow ease-kodecol group-hover:-translate-y-1.5 group-hover:rotate-0",
                    ["-rotate-2", "rotate-[1.5deg]", "-rotate-1"][i],
                  )}
                />
                <p className="mt-[22px] font-mono text-[13px] font-light tracking-[0.1em] text-mint-500">PASO 0{i + 1}</p>
                <h3 className="mt-2 font-display text-[26px] font-extrabold tracking-[-0.04em] text-text-primary">{step.title}</h3>
                <p className="mt-1.5 text-[15px] text-text-secondary">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="ficha-title" className="pb-[90px] pt-[70px]">
          <Chapter n="04" id="ficha-title" lead="Ficha" accent="técnica." />
          <dl className="grid border-t border-border-default md:grid-cols-2">
            {detail.spec.map((row) => (
              <div key={row.label} className="grid gap-1 border-b border-border-default py-[18px] pr-6 md:grid-cols-[170px_1fr] md:gap-4">
                <dt className="pt-[3px] font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">{row.label}</dt>
                <dd className="text-[15px] text-text-primary">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Link
          href={`/proyectos/${next.slug}`}
          className="grid grid-cols-[1fr_auto] items-center gap-5 rounded-[28px] border border-border-default bg-surface-1 p-[34px] transition-colors duration-slow hover:border-border-accent"
        >
          <span>
            <span className="text-xs uppercase tracking-[0.14em] text-text-muted">Siguiente proyecto</span>
            <span className="mt-1.5 block font-display text-[clamp(26px,3vw,40px)] font-bold tracking-[-0.03em] text-text-primary">
              {next.name}
            </span>
          </span>
          <LineIcon name="arrow_right" size={22} className="text-mint-500" />
        </Link>

        <section aria-labelledby="proyecto-cta-title" className="pb-[120px] pt-[60px]">
          <div className="relative isolate grid min-h-[420px] place-items-center overflow-hidden rounded-[40px] border border-border-default text-center">
            <VelarisGradient background={P.bg} colors={[P.green_300, P.green_600, P.green_900, P.cream_200]} className="-z-10" />
            <div className="grid justify-items-center gap-[22px] px-6 py-16">
              <DisplayHeading
                id="proyecto-cta-title"
                lead="¿Quieres algo así"
                accent="para tu negocio?"
                className="text-[clamp(36px,5vw,70px)] text-text-primary"
                accent_class_name="text-green-50"
              />
              <p className="max-w-[58ch] text-lg text-green-100">Cuéntanos qué vendes. Te mostramos qué construiríamos y por qué.</p>
              <Button href={SITE_CONFIG.whatsapp_url} external>
                <WhatsappIcon size={20} />
                Hablemos por WhatsApp
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
