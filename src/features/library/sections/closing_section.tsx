import { build_whatsapp_url } from "@/shared/lib/build_whatsapp_url";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { StaticPicture } from "@/shared/ui/static_picture";
import { LibraryStage, split_lockup } from "../library_stage";
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

/** «¿Prefieres que lo hagamos nosotros?»: la palabra clave pasa detrás del isotipo 3D, sobre la esfera entre el pasto. */
export function ClosingSection({ title, title_keyword, text, whatsapp_message, context, secondary }: ClosingSectionProps) {
  const lockup = split_lockup(title, title_keyword);
  return (
    <LibraryStage
      labelled_by="cierre-titulo"
      heading={title}
      heading_level="h2"
      backdrop={LIBRARY_BACKDROPS.closing}
      compact
      top={<p className="lib-kicker">Kodecol</p>}
      entry={lockup.entry}
      word={lockup.word}
      object={
        <StaticPicture
          src_base="/images/logo/isotipo-3d-trim"
          alt=""
          width={382}
          height={492}
          className="lib-stage-iso"
        />
      }
    >
      <p className="lib-lede">{text}</p>
      <div className="lib-closing-actions">
        <TrackedLink
          className="lib-btn lib-btn--menta"
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
    </LibraryStage>
  );
}
