"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

export interface GuideCardData {
  slug: string;
  href: string;
  title: string;
  title_keyword: string;
  summary: string;
  tags: readonly string[];
  date: string;
  cover: { jpg: string; webp: string };
  preview: string;
  is_new?: boolean;
}

/** El título con su palabra clave en menta. */
export function KeywordTitle({ title, keyword }: { title: string; keyword: string }) {
  const at = title.lastIndexOf(keyword);
  if (at < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, at)}
      <em className="lib-clave">{keyword}</em>
      {title.slice(at + keyword.length)}
    </>
  );
}

/**
 * La portada 3:4 del muro de Instagram. Al pasar el cursor (o, en el celular,
 * cuando la tarjeta está en pantalla) reproduce un fragmento mudo del reel.
 */
function CoverMedia({ cover, preview, alt, priority }: { cover: GuideCardData["cover"]; preview: string; alt: string; priority?: boolean }) {
  const box_ref = useRef<HTMLDivElement>(null);
  const video_ref = useRef<HTMLVideoElement>(null);
  const [armed, set_armed] = useState(false);
  const [playing, set_playing] = useState(false);

  useEffect(() => {
    const box = box_ref.current;
    if (!box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const card = box.closest("a") ?? box;
    const play = () => {
      set_armed(true);
      requestAnimationFrame(() => video_ref.current?.play().then(() => set_playing(true)).catch(() => {}));
    };
    const stop = () => {
      video_ref.current?.pause();
      set_playing(false);
    };
    if (fine) {
      card.addEventListener("pointerenter", play);
      card.addEventListener("pointerleave", stop);
      return () => {
        card.removeEventListener("pointerenter", play);
        card.removeEventListener("pointerleave", stop);
      };
    }
    const io = new IntersectionObserver(([entry]) => (entry.intersectionRatio > 0.7 ? play() : stop()), {
      threshold: [0, 0.7, 1],
    });
    io.observe(box);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box_ref} className="lib-card-media" data-playing={playing ? "" : undefined}>
      <picture>
        <source type="image/webp" srcSet={cover.webp} />
        { }
        <img src={cover.jpg} alt={alt} width={720} height={960} loading={priority ? "eager" : "lazy"} decoding="async" />
      </picture>
      {armed ? <video ref={video_ref} src={preview} muted loop playsInline preload="auto" aria-hidden="true" /> : null}
    </div>
  );
}

export function GuideCard({ guide, className }: { guide: GuideCardData; className?: string }) {
  return (
    <Link href={guide.href} className={cn("lib-card", className)}>
      <div className="relative">
        <CoverMedia cover={guide.cover} preview={guide.preview} alt={`Portada de la guía ${guide.title}`} />
        {guide.is_new ? <span className="lib-chip lib-chip--menta lib-card-badge">Nueva</span> : null}
      </div>
      <div className="lib-card-body">
        <h3>
          <KeywordTitle title={guide.title} keyword={guide.title_keyword} />
        </h3>
        <p>{guide.summary}</p>
        <div className="lib-card-tags">
          {guide.tags.map((tag) => (
            <span key={tag} className="lib-chip">
              {tag}
            </span>
          ))}
        </div>
        <span className="lib-card-go">
          Ver la guía
          <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function FeaturedGuide({ guide }: { guide: GuideCardData }) {
  return (
    <Link href={guide.href} className="lib-featured">
      <CoverMedia cover={guide.cover} preview={guide.preview} alt={`Portada de la guía ${guide.title}`} priority />
      <div className="grid content-start gap-6">
        <span className="lib-new">La más nueva · {guide.date}</span>
        <h3>
          <KeywordTitle title={guide.title} keyword={guide.title_keyword} />
        </h3>
        <p className="lib-lede">{guide.summary}</p>
        <div className="lib-card-tags">
          {guide.tags.map((tag) => (
            <span key={tag} className="lib-chip">
              {tag}
            </span>
          ))}
        </div>
        <span className="lib-btn lib-btn--beige justify-self-start">
          Abrir la guía
          <svg className="lib-ico" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
