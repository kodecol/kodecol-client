"use client";

import { useEffect, useRef, useState } from "react";

interface ReelSource {
  id: string;
  label: string;
  /** «1:04» */
  duration: string;
  video: string;
  poster: string;
}

interface FloatingReelProps {
  sources: readonly ReelSource[];
  title: string;
}

/**
 * El reel como objeto: un celular que flota con luz suave debajo, como en el
 * set. Arranca solo, en silencio y en bucle; el sonido se activa con un toque.
 * Alterna el video final (lo que sale del prompt) y su publicación en Instagram.
 */
export function FloatingReel({ sources, title }: FloatingReelProps) {
  const [active, set_active] = useState(0);
  const [muted, set_muted] = useState(true);
  const video_ref = useRef<HTMLVideoElement>(null);
  const source = sources[active];

  useEffect(() => {
    const video = video_ref.current;
    if (!video) return;
    video.muted = muted;
    video.play().catch(() => {
      /* sin autoplay (ahorro de datos): queda la imagen previa y el toque lo arranca */
    });
  }, [active, muted]);

  const toggle_sound = () => {
    const video = video_ref.current;
    const next = !muted;
    set_muted(next);
    if (video && !next) {
      video.currentTime = 0;
    }
  };

  return (
    <figure className="lib-reel" style={{ margin: 0 }}>
      <div className="lib-reel-float">
        <span className="lib-reel-light" aria-hidden="true" />
        <div className="lib-reel-device">
          <div className="lib-reel-screen" style={{ backgroundImage: `url(${source.poster})` }}>
            <video
              key={source.video}
              ref={video_ref}
              src={source.video}
              poster={source.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={`${title}: ${source.label.toLowerCase()}`}
              onClick={() => video_ref.current?.play().catch(() => {})}
            />
            <button type="button" className="lib-reel-sound" aria-pressed={!muted} onClick={toggle_sound}>
              <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4Z" />
                {muted ? <path d="M17 9l4 6M21 9l-4 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
              </svg>
              {muted ? "Activar sonido" : "Silenciar"}
            </button>
          </div>
        </div>
      </div>
      {sources.length > 1 ? (
        <div className="lib-reel-tabs" role="tablist" aria-label="Qué video ver">
          {sources.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => set_active(index)}
            >
              {item.label} <span className="lib-reel-dur">{item.duration}</span>
            </button>
          ))}
        </div>
      ) : null}
    </figure>
  );
}
