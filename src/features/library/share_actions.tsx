"use client";

import { useState } from "react";
import { track_event } from "@/shared/analytics/track_event";
import { copy_text } from "./copy_text";

interface ShareActionsProps {
  slug: string;
  title: string;
  url: string;
}

/** «Ir al prompt», compartir (menú nativo del celular) y copiar el enlace. */
export function ShareActions({ slug, title, url }: ShareActionsProps) {
  const [toast, set_toast] = useState<string | null>(null);

  const notify = (text: string) => {
    set_toast(text);
    window.setTimeout(() => set_toast(null), 2600);
  };

  const share = async () => {
    track_event("biblioteca_compartir", { guia: slug, via: "nativo" });
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    notify((await copy_text(url)) ? "Copiamos el enlace para que lo pegues donde quieras." : url);
  };

  const copy_link = async () => {
    track_event("biblioteca_compartir", { guia: slug, via: "copiar_enlace" });
    notify((await copy_text(url)) ? "Enlace copiado" : url);
  };

  return (
    <div className="lib-ghero-actions">
      <a
        className="lib-btn lib-btn--menta"
        href="#prompt"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("prompt")?.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", "#prompt");
        }}
      >
        Ir al prompt
        <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </a>
      <button type="button" className="lib-btn lib-btn--linea" onClick={share}>
        <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
        </svg>
        Compartir
      </button>
      <button type="button" className="lib-btn lib-btn--linea" onClick={copy_link}>
        <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </svg>
        Copiar enlace
      </button>
      {toast ? (
        <p className="lib-toast" role="status">
          {toast}
        </p>
      ) : null}
    </div>
  );
}
