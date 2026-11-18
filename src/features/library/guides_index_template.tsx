import type { LibraryGuide } from "@/core/domain/library_guide";
import type { NavLink } from "@/shared/config/site_config";
import { OrbitCarousel } from "@/shared/ui/orbit_carousel";
import { FeaturedGuide } from "./guide_card";
import { GuideFilters } from "./guide_filters";
import { to_card } from "./guide_view_model";
import { build_orbit_items } from "./library_index_template";
import { get_guide_media, LIBRARY_BACKDROPS, LIBRARY_PATH } from "./library_paths";
import { LibraryShell } from "./library_shell";
import { LibraryStage } from "./library_stage";
import { PhoneFan } from "./phone_fan";
import { ClosingSection } from "./sections/closing_section";

/** kodecol.co/biblioteca/guias: la destacada grande arriba, los videos y todas las guías con filtros. */
export function GuidesIndexTemplate({
  guides,
  service_links,
}: {
  guides: readonly LibraryGuide[];
  service_links?: readonly NavLink[];
}) {
  const [latest] = guides;
  const cards = guides.map((guide, index) => to_card(guide, index === 0));

  return (
    <LibraryShell crumbs={[{ label: "Biblioteca", href: LIBRARY_PATH }, { label: "Guías" }]} context="guias" service_links={service_links}>
      <LibraryStage
        labelled_by="guias-titulo"
        heading="Guías para crear con IA"
        backdrop={LIBRARY_BACKDROPS.guides}
        priority
        top={<p className="lib-kicker">Biblioteca · Sección</p>}
        entry="guías para crear"
        word="con IA."
        object={
          <PhoneFan
            items={guides.slice(0, 3).map((guide) => {
              const media = get_guide_media(guide.slug);
              return { poster: media.result_poster, video: media.result_preview, label: guide.title.split(":")[0] };
            })}
          />
        }
      >
        <p className="lib-lede">
          Los prompts reales detrás de nuestros videos, con el paso a paso y de dónde salió cada voz y cada sonido. Cópialos, cámbiales el nombre y hazlos con tu negocio.
        </p>
      </LibraryStage>

      {latest ? (
        <section className="lib-sec" aria-label="La guía más nueva">
          <div className="lib-wrap">
            <FeaturedGuide guide={cards[0]} />
          </div>
        </section>
      ) : null}

      <section className="lib-sec" aria-labelledby="videos-titulo" style={{ paddingTop: 0 }}>
        <div className="lib-wrap">
          <div className="lib-sec-head">
            <p className="lib-kicker">Los videos</p>
            <h2 id="videos-titulo" className="lib-h2">
              Videos de las <em className="lib-clave">guías</em>
            </h2>
          </div>
        </div>
        <OrbitCarousel items={build_orbit_items(guides)} label="Videos de las guías" />
      </section>

      <section className="lib-sec" aria-labelledby="todas-titulo" style={{ paddingTop: 0 }}>
        <div className="lib-wrap">
          <div className="lib-sec-head">
            <p className="lib-kicker">Todas las guías</p>
            <h2 id="todas-titulo" className="lib-h2">
              Elige por tema o por <em className="lib-clave">nivel</em>.
            </h2>
          </div>
          <GuideFilters guides={cards} />
        </div>
      </section>

      <ClosingSection
        title="¿Prefieres que lo hagamos nosotros?"
        title_keyword="nosotros"
        text="En Kodecol hacemos videos, automatizaciones y software con IA para empresas. Cuéntanos tu negocio y te decimos cómo lo haríamos."
        whatsapp_message="Hola, vi las guías de la Biblioteca de Kodecol y quiero algo así para mi negocio."
        context="guias"
      />
    </LibraryShell>
  );
}
