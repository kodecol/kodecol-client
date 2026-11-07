"use client";

import { useEffect, useRef } from "react";

interface LibraryEffectsProps {
  /** Barra fina de progreso de lectura (en las guías). */
  progress?: boolean;
}

/**
 * Detalles que se notan: la barra de lectura y el halo de esfera que sigue al
 * cursor. El halo solo existe con puntero fino (no en el celular) y ninguno de
 * los dos corre si la persona pidió menos movimiento.
 */
export function LibraryEffects({ progress = false }: LibraryEffectsProps) {
  const bar_ref = useRef<HTMLDivElement>(null);
  const orb_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = bar_ref.current;
    if (!bar) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const on_scroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on_scroll, { passive: true });
    window.addEventListener("resize", on_scroll);
    return () => {
      window.removeEventListener("scroll", on_scroll);
      window.removeEventListener("resize", on_scroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const orb = orb_ref.current;
    if (!orb) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    const loop = () => {
      /* sigue con retraso, como una luz que flota */
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      orb.dataset.on = "";
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => delete orb.dataset.on;
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {progress ? <div ref={bar_ref} className="lib-progress" aria-hidden="true" /> : null}
      <div ref={orb_ref} className="lib-orb" aria-hidden="true" />
    </>
  );
}
