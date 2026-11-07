import type { LibraryGuide } from "@/core/domain/library_guide";
import { OrbitCarousel } from "@/shared/ui/orbit_carousel";
import { Backdrop } from "./backdrop";
import { FeaturedGuide } from "./guide_card";
import { GuideFilters } from "./guide_filters";
import { to_card } from "./guide_view_model";
import { build_orbit_items } from "./library_index_template";
import { LIBRARY_BACKDROPS, LIBRARY_PATH } from "./library_paths";
import { LibraryShell } from "./library_shell";
import { ClosingSection } from "./sections/closing_section";

/** kodecol.co/biblioteca/guias: la destacada grande arriba, los videos y todas las guías con filtros. */
export function GuidesIndexTemplate({ guides }: { guides: readonly LibraryGuide[] }) {
  const [latest] = guides;
  const cards = guides.map((guide, index) => to_card(guide, index === 0));

  return (
    <LibraryShell crumbs={[{ label: "Biblioteca", href: LIBRARY_PATH }, { label: "Guías" }]} context="guias">
      <section className="lib-hero" aria-labelledby="guias-titulo" style={{ minHeight: "min(720px, 80svh)" }}>
        <Backdrop media={LIBRARY_BACKDROPS.guides} priority />
        <div className="lib-hero-shade" aria-hidden="true" />
        <div className="lib-wrap lib-hero-in">
          <p className="lib-kicker">Biblioteca · Sección</p>
          <h1 id="guias-titulo" className="lib-display">
            Guías para crear con <em className="lib-clave">IA</em>
          </h1>
          <p className="lib-lede">
            Los prompts reales detrás de nuestros videos, con el paso a paso y de dónde salió cada voz y cada sonido. Cópialos, cámbiales el nombre y hazlos con tu negocio.
          </p>
        </div>
      </section>

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
