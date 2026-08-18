"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE_CONFIG } from "@/shared/config/site_config";

interface NavbarClientProps {
  /** `href` de la página actual, para marcarla con aria-current. */
  current_href?: string;
}

/** Menú hamburguesa mobile: abre un panel glass a pantalla completa (DESIGN-SYSTEM.md §6.4). */
export function NavbarClient({ current_href }: NavbarClientProps) {
  const [open, set_open] = useState(false);

  /* Bloquea el scroll del body mientras el panel está abierto */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[86px] z-[90] flex flex-col gap-2 rounded-t-[24px] border-t border-glass-border bg-[rgba(4,17,15,.92)] px-8 py-10 backdrop-blur-[24px]"
        >
          <ul className="flex flex-col gap-2">
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
          <a
            href={SITE_CONFIG.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => set_open(false)}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-1 rounded-full bg-mint-500 px-6 py-3 text-sm font-semibold text-text-on-accent shadow-glow-accent-strong"
          >
            Contáctanos <span aria-hidden>→</span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
