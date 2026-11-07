import Link from "next/link";
import {
  GUIDE_LEVEL_LABELS,
  GUIDE_TOPIC_LABELS,
  type GuideLine,
  type LibraryGuide,
} from "@/core/domain/library_guide";
import { FloatingReel } from "./floating_reel";
import { GuideCard, KeywordTitle } from "./guide_card";
import { GuideToc, type TocEntry } from "./guide_toc";
import { to_card } from "./guide_view_model";
import { format_duration, format_guide_date, get_guide_media, GUIDES_PATH, LIBRARY_PATH } from "./library_paths";
import { LibraryShell } from "./library_shell";
import { PromptTerminal } from "./prompt_terminal";
import { ClosingSection } from "./sections/closing_section";
import { ShareActions } from "./share_actions";
import { TrackedLink } from "./tracked_link";

interface GuideTemplateProps {
  guide: LibraryGuide;
  related: readonly LibraryGuide[];
  canonical_url: string;
}

const TOC: readonly TocEntry[] = [
  { id: "antes", label: "Antes de empezar" },
  { id: "prompt", label: "El prompt" },
  { id: "paso-a-paso", label: "Paso a paso" },
  { id: "recursos", label: "Voces, música y sonidos" },
  { id: "aprendimos", label: "Lo que aprendimos" },
  { id: "archivo", label: "Archivo para Claude" },
];

function Line({ line }: { line: GuideLine }) {
  return (
    <>
      {line.lead ? <b>{line.lead} </b> : null}
      {line.text}
    </>
  );
}

function SectionHead({ kicker, children, id }: { kicker: string; children: React.ReactNode; id: string }) {
  return (
    <div className="lib-sec-head">
      <p className="lib-kicker">{kicker}</p>
      <h2 id={id} className="lib-h2">
        {children}
      </h2>
    </div>
  );
}

/**
 * kodecol.co/biblioteca/guias/<slug>. Plantilla única: cada guía es un JSON.
 * Orden del requerimiento: encabezado y reel → antes de empezar → el prompt →
 * paso a paso → recursos → aprendizajes → archivo para Claude → cierre →
 * relacionadas → nota legal.
 */
export function GuideTemplate({ guide, related, canonical_url }: GuideTemplateProps) {
  const media = get_guide_media(guide.slug);
  const name = guide.title.split(":")[0];

  return (
    <LibraryShell
      crumbs={[
        { label: "Biblioteca", href: LIBRARY_PATH },
        { label: "Guías", href: GUIDES_PATH },
        { label: name },
      ]}
      legal={guide.legal}
      progress
      context={guide.slug}
    >
      <header className="lib-ghero">
        <div className="lib-wrap lib-ghero-grid">
          <div className="lib-ghero-copy">
            <p className="lib-kicker">Guía · {GUIDE_TOPIC_LABELS[guide.topic]}</p>
            <h1 className="lib-display">
              <KeywordTitle title={guide.title} keyword={guide.title_keyword} />
            </h1>
            <p className="lib-lede">{guide.summary}</p>
            <div className="lib-ghero-meta">
              <span className="lib-chip lib-chip--menta">Hecho con {guide.made_with[0]}</span>
              {guide.made_with.slice(1).map((tool) => (
                <span key={tool} className="lib-chip">
                  {tool}
                </span>
              ))}
              <span className="lib-chip">
                {GUIDE_LEVEL_LABELS[guide.level]} · {guide.duration}
              </span>
              <span className="lib-chip">{format_guide_date(guide.published_at)}</span>
            </div>
            <ShareActions slug={guide.slug} title={`${guide.title} · Biblioteca Kodecol`} url={canonical_url} />
          </div>
          <FloatingReel
            title={name}
            sources={[
              { id: "resultado", label: "Video final", duration: format_duration(guide.video_seconds.result), video: media.result_video, poster: media.result_poster },
              { id: "publicado", label: "En Instagram", duration: format_duration(guide.video_seconds.published), video: media.published_video, poster: media.published_poster },
            ]}
          />
        </div>
      </header>

      <div className="lib-wrap">
        <p className="lib-lede" style={{ maxWidth: "70ch", paddingBottom: 8 }}>
          {guide.intro}
        </p>
      </div>

      <div className="lib-wrap lib-body">
        <GuideToc entries={TOC} />
        <div className="lib-content">
          <section id="antes" aria-labelledby="antes-titulo">
            <SectionHead kicker="Antes de empezar" id="antes-titulo">
              Lo que <em className="lib-clave">necesitas</em>
            </SectionHead>
            <ul className="lib-needs">
              {guide.before_you_start.map((item) => (
                <li key={item.text}>
                  {item.lead ? <strong>{item.lead}</strong> : null}
                  <p>{item.text}</p>
                  {item.link ? (
                    <a href={item.link.href} target="_blank" rel="noopener noreferrer">
                      {item.link.label}
                      <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section id="prompt" aria-labelledby="prompt-titulo">
            <SectionHead kicker="El prompt" id="prompt-titulo">
              Cópialo y pégalo en <em className="lib-clave">Claude</em>
            </SectionHead>
            <p className="lib-lede" style={{ marginBottom: 28 }}>
              Lo resaltado son los datos de tu negocio. Cámbialos aquí o directamente en Claude.
            </p>
            <PromptTerminal slug={guide.slug} prompt={guide.prompt} />
          </section>

          <section id="paso-a-paso" aria-labelledby="pasos-titulo">
            <SectionHead kicker="Cómo lo hicimos" id="pasos-titulo">
              Paso a <em className="lib-clave">paso</em>
            </SectionHead>
            <ol className="lib-steps">
              {guide.steps.map((step) => (
                <li key={step.title}>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="recursos" aria-labelledby="recursos-titulo">
            <SectionHead kicker="Los recursos" id="recursos-titulo">
              {guide.sources.title}
            </SectionHead>
            <div className="lib-sources">
              {guide.sources.groups.map((group) => (
                <div key={group.title} className="lib-source">
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.text}>
                        <Line line={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="lib-rule">
                <span>
                  <b>Regla de licencias.</b> {guide.sources.rule}
                </span>
              </p>
            </div>
          </section>

          <section id="aprendimos" aria-labelledby="aprendimos-titulo">
            <SectionHead kicker="Lo que aprendimos haciéndolo" id="aprendimos-titulo">
              Lo que nos ahorró <em className="lib-clave">vueltas</em>
            </SectionHead>
            <ul className="lib-lessons">
              {guide.lessons.map((lesson) => (
                <li key={lesson.title}>
                  <q>{lesson.title}</q>
                  <p>{lesson.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="archivo" aria-labelledby="archivo-titulo">
            <div className="lib-download">
              <div className="grid gap-5">
                <p className="lib-kicker">Todo en un archivo para Claude</p>
                <h2 id="archivo-titulo">{guide.download.title}</h2>
                <p>{guide.download.text}</p>
                <TrackedLink
                  className="lib-btn lib-btn--menta justify-self-start"
                  href={media.claude_file}
                  download={media.claude_file_name}
                  event_name="biblioteca_descargar_md"
                  event_params={{ guia: guide.slug }}
                >
                  <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                  </svg>
                  Descargar {media.claude_file_name}
                </TrackedLink>
                <small>{guide.download.usage}</small>
              </div>
              <div className="lib-file" aria-hidden="true">
                <span className="lib-file-ext">.md</span>
                <span className="lib-file-lines">
                  <i style={{ width: "90%" }} />
                  <i style={{ width: "72%" }} />
                  <i style={{ width: "84%" }} />
                  <i style={{ width: "56%" }} />
                  <i style={{ width: "78%" }} />
                </span>
                <span className="lib-file-name">{media.claude_file_name}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ClosingSection
        title={guide.closing.title}
        title_keyword={guide.closing.title_keyword}
        text={guide.closing.text}
        whatsapp_message={guide.closing.whatsapp_message}
        context={guide.slug}
        secondary={{ label: "Ver más en la Biblioteca", href: LIBRARY_PATH }}
      />

      {related.length ? (
        <section className="lib-sec" aria-labelledby="relacionadas-titulo">
          <div className="lib-wrap">
            <div className="lib-sec-head">
              <p className="lib-kicker">Sigue explorando</p>
              <h2 id="relacionadas-titulo" className="lib-h2">
                Otras <em className="lib-clave">guías</em>
              </h2>
            </div>
            <div className="lib-cards lib-cards--related">
              {related.map((item) => (
                <GuideCard key={item.slug} guide={to_card(item)} />
              ))}
            </div>
            <Link href={GUIDES_PATH} className="lib-link mt-10 inline-block">
              Ver todas las guías
            </Link>
          </div>
        </section>
      ) : null}
    </LibraryShell>
  );
}

