"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { GuidePrompt } from "@/core/domain/library_guide";
import { track_event } from "@/shared/analytics/track_event";
import { copy_text, select_node } from "./copy_text";
import { LIBRARY_BACKDROPS } from "./library_paths";
import { TrackedLink } from "./tracked_link";

type Version = "quick" | "full";

interface PromptTerminalProps {
  slug: string;
  prompt: GuidePrompt;
}

const TOKEN = /\[[^\]]+\]/g;

/**
 * El prompt dentro de la pantalla de un CRT beige: la firma visual de la
 * Biblioteca. Dos versiones, personalizador opcional que reemplaza los
 * corchetes en vivo (no guarda ni envía nada) y copiar con destello de fósforo.
 */
export function PromptTerminal({ slug, prompt }: PromptTerminalProps) {
  const [version, set_version] = useState<Version>("quick");
  const [values, set_values] = useState<Record<string, string>>({});
  const [status, set_status] = useState<{ text: string; warn?: boolean } | null>(null);
  const [copied, set_copied] = useState(false);
  const [flash, set_flash] = useState(0);
  const pre_ref = useRef<HTMLPreElement>(null);
  const base_id = useId();

  const text = version === "quick" ? prompt.quick : prompt.full;

  /* corchete → valor escrito por la persona */
  const replacement = useMemo(() => {
    const map = new Map<string, string>();
    for (const field of prompt.fields) {
      const value = values[field.id]?.trim();
      if (value) for (const token of field.tokens) map.set(token, value);
    }
    return map;
  }, [prompt.fields, values]);

  const final_text = useMemo(() => text.replace(TOKEN, (token) => replacement.get(token) ?? token), [text, replacement]);

  /* Solo los campos que aparecen en la versión que se está viendo. */
  const visible_fields = prompt.fields.filter((field) => field.tokens.some((token) => text.includes(token)));

  const pieces = useMemo(() => {
    const out: { text: string; token?: boolean; filled?: boolean }[] = [];
    let last = 0;
    for (const match of text.matchAll(TOKEN)) {
      const index = match.index ?? 0;
      if (index > last) out.push({ text: text.slice(last, index) });
      const value = replacement.get(match[0]);
      out.push({ text: value ?? match[0], token: true, filled: value !== undefined });
      last = index + match[0].length;
    }
    if (last < text.length) out.push({ text: text.slice(last) });
    return out;
  }, [text, replacement]);

  const choose = (next: Version) => {
    set_version(next);
    set_status(null);
    if (pre_ref.current) pre_ref.current.scrollTop = 0;
  };

  const on_copy = async () => {
    const ok = await copy_text(final_text);
    track_event("biblioteca_copiar_prompt", {
      guia: slug,
      version: version === "quick" ? "rapida" : "completa",
      personalizado: replacement.size > 0 ? 1 : 0,
      resultado: ok ? "copiado" : "seleccion_manual",
    });
    if (ok) {
      set_copied(true);
      set_flash((n) => n + 1);
      set_status({ text: "Listo. Ahora abre Claude y pégalo en una conversación nueva." });
      window.setTimeout(() => set_copied(false), 2600);
    } else {
      if (pre_ref.current) select_node(pre_ref.current);
      set_status({
        text: "Tu navegador no nos deja copiar. Dejamos el texto seleccionado: mantén presionado y elige Copiar.",
        warn: true,
      });
    }
  };

  const tabs: { id: Version; label: string; size: number }[] = [
    { id: "quick", label: "Versión rápida", size: prompt.quick.length },
    { id: "full", label: "Versión completa", size: prompt.full.length },
  ];

  return (
    <div className="grid gap-5">
      <div className="lib-ptabs" role="tablist" aria-label="Versión del prompt">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${base_id}-tab-${tab.id}`}
            aria-selected={version === tab.id}
            aria-controls={`${base_id}-panel`}
            tabIndex={version === tab.id ? 0 : -1}
            onClick={() => choose(tab.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const next = tabs[(index + 1) % tabs.length];
                choose(next.id);
                document.getElementById(`${base_id}-tab-${next.id}`)?.focus();
              }
            }}
          >
            {tab.label}
            <small>{tab.size.toLocaleString("es-CO")}</small>
          </button>
        ))}
      </div>

      <details className="lib-perso">
        <summary>
          Ponle los datos de tu negocio <small>opcional</small>
          <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <div className="lib-perso-fields">
          {visible_fields.map((field) => (
            <label key={field.id} htmlFor={`${base_id}-${field.id}`}>
              {field.label}
              <input
                id={`${base_id}-${field.id}`}
                value={values[field.id] ?? ""}
                placeholder={field.placeholder}
                autoComplete="off"
                onChange={(e) => set_values((prev) => ({ ...prev, [field.id]: e.target.value }))}
              />
            </label>
          ))}
        </div>
        <p className="lib-perso-note">Lo que escribas solo cambia el texto en tu pantalla. No se guarda ni se envía.</p>
      </details>

      <div className="lib-crt" data-flash={flash ? "" : undefined} key={`crt-${flash}`}>
        {/* En escritorio el prompt vive dentro del CRT renderizado por motion-kodecol;
            en el celular la pantalla sería muy chica y queda el bisel dibujado en CSS. */}
        <picture className="lib-crt-photo">
          <source type="image/webp" srcSet={LIBRARY_BACKDROPS.crt_monitor.webp} />
          { }
          <img src={LIBRARY_BACKDROPS.crt_monitor.png} alt="" width={1264} height={928} loading="lazy" decoding="async" />
        </picture>
        <div className="lib-crt-recess">
          <div
            className="lib-screen"
            id={`${base_id}-panel`}
            role="tabpanel"
            aria-labelledby={`${base_id}-tab-${version}`}
            data-long={version === "full" ? "" : undefined}
            data-flash={flash ? "" : undefined}
          >
            <div className="lib-screen-bar" aria-hidden="true">
              <span>
                kodecol:~/biblioteca/{slug}$ cat {version === "quick" ? "rapida" : "completa"}.txt
              </span>
              <span>{final_text.length.toLocaleString("es-CO")} caracteres</span>
            </div>
            <pre ref={pre_ref} tabIndex={0}>
              {pieces.map((piece, i) =>
                piece.token ? (
                  <span key={i} className="lib-token" data-filled={piece.filled ? "" : undefined}>
                    {piece.text}
                  </span>
                ) : (
                  piece.text
                ),
              )}
              <span className="lib-cursor" aria-hidden="true" />
            </pre>
            <span className="lib-screen-fade" aria-hidden="true" />
            <span className="lib-flash" aria-hidden="true" />
          </div>
        </div>
        <div className="lib-crt-chin" aria-hidden="true">
          <span className="lib-crt-vents">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="lib-crt-knobs">
            <i />
            <i />
            <span className="lib-crt-led" />
          </span>
        </div>
      </div>

      <div className="lib-copy">
        <div className="lib-copy-actions">
          <button type="button" className="lib-btn lib-btn--menta" onClick={on_copy}>
            <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
              {copied ? (
                <path d="m5 12 5 5 9-10" />
              ) : (
                <>
                  <rect x="8" y="8" width="12" height="12" rx="2" />
                  <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                </>
              )}
            </svg>
            {copied ? "Copiado" : "Copiar prompt"}
          </button>
          <TrackedLink
            className="lib-btn lib-btn--linea"
            href="https://claude.ai/new"
            target="_blank"
            rel="noopener noreferrer"
            event_name="biblioteca_abrir_claude"
            event_params={{ guia: slug }}
          >
            Abrir Claude
            <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </TrackedLink>
        </div>
        <p className="lib-status" role="status" data-warn={status?.warn ? "" : undefined}>
          {status?.text}
        </p>
      </div>
    </div>
  );
}
