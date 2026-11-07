import { build_whatsapp_url } from "@/shared/lib/build_whatsapp_url";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { Backdrop } from "../backdrop";
import { KeywordTitle } from "../guide_card";
import { LIBRARY_BACKDROPS } from "../library_paths";
import { TrackedLink } from "../tracked_link";

interface ClosingSectionProps {
  title: string;
  title_keyword: string;
  text: string;
  whatsapp_message: string;
  /** Guía o página desde donde se escribe, para la medición. */
  context: string;
  secondary?: { label: string; href: string };
}

/** «¿Prefieres que lo hagamos nosotros?» sobre la esfera entre el pasto. */
export function ClosingSection({ title, title_keyword, text, whatsapp_message, context, secondary }: ClosingSectionProps) {
  return (
    <section className="lib-closing" aria-labelledby="cierre-titulo">
      <Backdrop media={LIBRARY_BACKDROPS.closing} />
      <div className="lib-closing-shade" aria-hidden="true" />
      <div className="lib-wrap lib-closing-in">
        <p className="lib-kicker">Kodecol</p>
        <h2 id="cierre-titulo">
          <KeywordTitle title={title} keyword={title_keyword} />
        </h2>
        <p>{text}</p>
        <div className="lib-closing-actions">
          <TrackedLink
            className="lib-btn lib-btn--beige"
            href={build_whatsapp_url(SITE_CONFIG.whatsapp_number, whatsapp_message)}
            target="_blank"
            rel="noopener noreferrer"
            event_name="biblioteca_whatsapp"
            event_params={{ origen: `cierre-${context}` }}
          >
            <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" />
            </svg>
            Escríbenos por WhatsApp
          </TrackedLink>
          <span className="lib-number">{SITE_CONFIG.whatsapp_display}</span>
          {secondary ? (
            <a className="lib-link" href={secondary.href}>
              {secondary.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
