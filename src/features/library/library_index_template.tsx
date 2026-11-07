import Link from "next/link";
import type { LibraryGuide } from "@/core/domain/library_guide";
import { GUIDE_LEVEL_LABELS } from "@/core/domain/library_guide";
import { OrbitCarousel, type OrbitItem } from "@/shared/ui/orbit_carousel";
import { Backdrop } from "./backdrop";
import { LibraryFolder } from "./library_folder";
import { build_guide_path, format_duration, format_guide_date, get_guide_media, LIBRARY_BACKDROPS } from "./library_paths";
import { LIBRARY_SECTIONS } from "./library_sections";
import { LibraryShell } from "./library_shell";
import { ClosingSection } from "./sections/closing_section";

interface LibraryIndexTemplateProps {
  guides: readonly LibraryGuide[];
}

/** Los dos videos de cada guía en el anillo: el video final y su publicación en Instagram. */
export function build_orbit_items(guides: readonly LibraryGuide[]): OrbitItem[] {
  return guides.flatMap((guide) => {
    const media = get_guide_media(guide.slug);
    const name = guide.title.split(":")[0];
    return [
      {
        id: `${guide.slug}-resultado`,
        title: name,
        meta: `Video final · ${format_duration(guide.video_seconds.result)}`,
        poster: media.result_poster,
        video: media.result_preview,
        href: build_guide_path(guide.slug),
      },
      {
        id: `${guide.slug}-publicado`,
        title: name,
        meta: `Publicación en Instagram · ${format_duration(guide.video_seconds.published)}`,
        poster: media.published_poster,
        video: media.published_preview,
        href: build_guide_path(guide.slug),
      },
    ];
  });
}

/** kodecol.co/biblioteca: la portada, las carpetas de las secciones y los videos en órbita. */
export function LibraryIndexTemplate({ guides }: LibraryIndexTemplateProps) {
  const latest = guides[0];
  const sections = LIBRARY_SECTIONS.filter((section) => section.slug !== "guias" || guides.length > 0);

  return (
    <LibraryShell crumbs={[{ label: "Biblioteca" }]} context="biblioteca">
      <section className="lib-hero" aria-labelledby="biblioteca-titulo">
        <Backdrop media={LIBRARY_BACKDROPS.hero} priority />
        <div className="lib-hero-shade" aria-hidden="true" />
        <div className="lib-wrap lib-hero-in">
          <p className="lib-kicker">Biblioteca Kodecol</p>
          <h1 id="biblioteca-titulo" className="lib-display">
            Construye con <em className="lib-clave">IA</em>.
          </h1>
          <p className="lib-lede">
            Guías, prompts y recursos para construir con IA. Lo que usamos de verdad, listo para que lo hagas con tu negocio.
          </p>
          <div className="lib-hero-meta">
            <span className="lib-chip">
              {guides.length} {guides.length === 1 ? "guía" : "guías"}
            </span>
            {latest ? <span className="lib-chip">Actualizada el {format_guide_date(latest.published_at)}</span> : null}
            <span className="lib-chip">Gratis y sin registro</span>
          </div>
          <a className="lib-scrollcue" href="#secciones">
            <i aria-hidden="true" />
            Abre una carpeta
          </a>
        </div>
      </section>

      <section id="secciones" className="lib-sec" aria-labelledby="secciones-titulo">
        <div className="lib-wrap">
          <div className="lib-sec-head">
            <p className="lib-kicker">Secciones</p>
            <h2 id="secciones-titulo" className="lib-h2">
              Todo lo que compartimos, <em className="lib-clave">ordenado</em>.
            </h2>
          </div>
          {sections.map((section) => (
            <div key={section.slug} className="lib-folders">
              <div className="lib-folder-stage">
                <LibraryFolder
                  label={section.title}
                  meta={`${guides.length} ${guides.length === 1 ? "guía" : "guías"} · toca para abrir`}
                  image={section.folder_image}
                  files={guides.map((guide) => ({
                    name: guide.title.split(":")[0],
                    meta: GUIDE_LEVEL_LABELS[guide.level],
                    image: get_guide_media(guide.slug).result_poster,
                    href: build_guide_path(guide.slug),
                  }))}
                />
              </div>
              <div className="lib-folder-copy">
                <h3>{section.title}</h3>
                <p>{section.description}</p>
                <ul className="lib-folder-list">
                  {guides.map((guide) => (
                    <li key={guide.slug}>
                      <Link href={build_guide_path(guide.slug)}>
                        <span>{guide.title.split(":")[0]}</span>
                        <span>{format_guide_date(guide.published_at)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={section.href} className="lib-btn lib-btn--linea justify-self-start">
                  Entrar a {section.title}
                  <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lib-sec" aria-labelledby="videos-titulo" style={{ paddingTop: 0 }}>
        <div className="lib-wrap">
          <div className="lib-sec-head">
            <p className="lib-kicker">Los videos</p>
            <h2 id="videos-titulo" className="lib-h2">
              Videos hechos con <em className="lib-clave">IA</em>
            </h2>
            <p className="lib-lede">Cada video final y su publicación en Instagram. Desliza para recorrerlos y selecciona el del frente para abrir su guía.</p>
          </div>
        </div>
        <OrbitCarousel items={build_orbit_items(guides)} label="Videos de la Biblioteca" />
      </section>

      <ClosingSection
        title="¿Prefieres que lo hagamos nosotros?"
        title_keyword="nosotros"
        text="En Kodecol hacemos videos, automatizaciones y software con IA para empresas. Cuéntanos tu negocio y te decimos cómo lo haríamos."
        whatsapp_message="Hola, vi la Biblioteca de Kodecol y quiero algo así para mi negocio."
        context="biblioteca"
      />
    </LibraryShell>
  );
}
