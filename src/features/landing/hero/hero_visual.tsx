"use client";

import { useEffect, useRef } from "react";
import { StaticPicture } from "@/shared/ui/static_picture";

/**
 * Isotipo 3D de la marca como pieza focal del hero (DESIGN.md §11).
 * Flota en bucle y responde al mouse con un tilt 3D pronunciado: el cursor recorre
 * la sección de borde a borde y la pieza gira hasta ±10° en X y ±17° en Y.
 * El tilt solo se activa con puntero fino y sin prefers-reduced-motion.
 */
/* Grados de giro a los extremos de la sección (cx, cy van de -0.5 a 0.5). */
const TILT_X_RANGE = -20;
const TILT_Y_RANGE = 34;
const PERSPECTIVE = 900;
export function HeroVisual() {
  const section_ref = useRef<HTMLDivElement>(null);
  const mark_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mark = mark_ref.current;
    if (!mark) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* El área de escucha es la sección hero completa, como en el mockup */
    const zone = document.getElementById("inicio") ?? section_ref.current;
    if (!zone) return;

    let frame = 0;
    const on_move = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = zone.getBoundingClientRect();
        const cx = (event.clientX - rect.left) / rect.width - 0.5;
        const cy = (event.clientY - rect.top) / rect.height - 0.5;
        mark.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${cy * TILT_X_RANGE}deg) rotateY(${cx * TILT_Y_RANGE}deg)`;
      });
    };
    const on_leave = () => {
      cancelAnimationFrame(frame);
      mark.style.transform = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`;
    };

    zone.addEventListener("mousemove", on_move);
    zone.addEventListener("mouseleave", on_leave);
    return () => {
      cancelAnimationFrame(frame);
      zone.removeEventListener("mousemove", on_move);
      zone.removeEventListener("mouseleave", on_leave);
    };
  }, []);

  return (
    <div ref={section_ref} className="animate-kc-float">
      <div
        ref={mark_ref}
        className="transition-transform duration-fast ease-kodecol will-change-transform"
      >
        {/*
          Sin `priority` a propósito. Generaba un <link rel="preload"> para un PNG
          de 301 KB que es DECORATIVO (aria-hidden) y que en móvil queda bajo el
          pliegue, compitiendo por ancho de banda con la CSS y las fuentes. En
          escritorio el LCP es el <h1>, que es texto.
        */}
        <StaticPicture
          src_base="/images/logo/isotipo-3d-trim"
          alt=""
          width={382}
          height={492}
          className="h-auto w-[220px] md:w-[280px] lg:w-[320px]"
        />
      </div>
    </div>
  );
}
