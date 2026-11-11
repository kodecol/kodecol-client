"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SITE_CONFIG } from "@/shared/config/site_config";

interface NavbarClientProps {
  /** `href` de la página actual, para marcarla con aria-current. */
  current_href?: string;
}

/**
 * Menú hamburguesa mobile: abre un panel glass a pantalla completa
 * (DESIGN-SYSTEM.md §6.4).
 *
 * El panel se monta con un portal en <body> por una razón concreta: el <nav> que
 * envuelve este componente lleva `backdrop-filter`, y un elemento con
 * backdrop-filter se convierte en el bloque contenedor de sus descendientes
 * `position: fixed`. Dentro del nav, el `inset-0` del panel se resolvía contra la
 * píldora del navbar —no contra el viewport— y quedaba una caja de ~80 px con los
 * enlaces desbordados y sin fondo detrás. El portal lo saca de ese contenedor.
 */
export function NavbarClient({ current_href }: NavbarClientProps) {
  const [open, set_open] = useState(false);
  const [mounted, set_mounted] = useState(false);

  /* El portal solo existe en cliente: en el prerender no hay document. */
  useEffect(() => set_mounted(true), []);

  useEffect(() => {
    if (!open) return;

    /* Bloquea el scroll del fondo mientras el panel está abierto */
    const previous_overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const on_key = (event: KeyboardEvent) => {
      if (event.key === "Escape") set_open(false);
    };
    document.addEventListener("keydown", on_key);

    return () => {
      document.body.style.overflow = previous_overflow;
      document.removeEventListener("keydown", on_key);
    };
  }, [open]);

  const panel = (
    <div
      id="mobile-menu"
      className="fixed inset-x-0 bottom-0 top-[96px] z-[90] flex flex-col overflow-y-auto overscroll-contain rounded-t-[24px] border-t border-glass-border bg-[rgba(4,17,15,.97)] px-8 pb-12 pt-8 backdrop-blur-[24px] md:hidden"
    >
      <nav aria-label="Navegación mobile">
        <ul className="flex flex-col gap-1">
          {SITE_CONFIG.nav_links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={link.href === current_href ? "page" : undefined}
                onClick={() => set_open(false)}
                className="block rounded-lg py-3 font-sora text-xl font-semibold text-text-primary transition-colors hover:text-mint-500 aria-[current=page]:text-mint-500"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <a
        href={SITE_CONFIG.whatsapp_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => set_open(false)}
        className="mt-8 inline-flex min-h-11 items-center justify-center gap-1 rounded-full bg-mint-500 px-6 py-3 text-sm font-semibold text-text-on-accent shadow-glow-accent-strong"
      >
        Contáctanos <span aria-hidden>→</span>
      </a>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => set_open(!open)}
        className="grid size-11 place-items-center rounded-full text-text-primary"
      >
        <svg
          aria-hidden
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          {open ? (
            <>
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </>
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {open && mounted ? createPortal(panel, document.body) : null}
    </div>
  );
}
