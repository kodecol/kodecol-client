import type { BrandClip as BrandClipData } from "@/core/domain/product_brand";
import { cn } from "@/shared/lib/cn";

interface BrandClipProps {
  clip: BrandClipData;
  className?: string;
}

/**
 * Clip corto de la interfaz real, en bucle y sin audio. `preload="metadata"`:
 * el navegador no baja el video hasta que hace falta. El póster es el primer
 * cuadro, así que con `prefers-reduced-motion` o sin autoplay se ve igual.
 */
export function BrandClip({ clip, className }: BrandClipProps) {
  return (
    <figure className={cn("relative overflow-hidden bg-[var(--brand-surface)]", className)}>
      <video
        src={clip.src}
        poster={clip.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={clip.caption}
        className="block aspect-[16/10] w-full object-cover"
      />
      <figcaption className="absolute bottom-2.5 left-3 font-mono text-[10.5px] tracking-[0.08em] text-white/75 [text-shadow:0_1px_6px_#000]">
        {clip.caption}
      </figcaption>
    </figure>
  );
}
