import { CANVAS_PALETTE } from "@/shared/config/canvas_palette";
import { BlackHole } from "@/shared/ui/black_hole";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { Reveal } from "@/shared/ui/reveal";
import { WHY_KODECOL_CONTENT } from "./content";

/**
 * Por qué Kodecol (#nosotros), en atmósfera Espacio: un agujero negro trazado en
 * tiempo real, con el disco de gas en los verdes de la marca y las estrellas que
 * continúan las luciérnagas de la pradera. Debajo, los cuatro pilares del SOUL.
 *
 * Server component: el agujero negro es la única hoja client.
 */
export function WhyKodecolSection() {
  const content = WHY_KODECOL_CONTENT;

  return (
    <section
      id="nosotros"
      aria-labelledby="nosotros-title"
      className="relative isolate min-h-[980px] overflow-hidden bg-black md:h-svh md:max-h-[1000px] md:min-h-[820px]"
    >
      <BlackHole
        focus={[0.7, 0.47]}
        narrow_focus={[0.5, 0.78]}
        scrim="left"
        hot_color={CANVAS_PALETTE.green_50}
        mid_color={CANVAS_PALETTE.mint_500}
        cool_color={CANVAS_PALETTE.green_800}
        className="z-0"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[200px] bg-gradient-to-b from-bg to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[200px] bg-gradient-to-t from-bg to-transparent" />

      <div className="relative z-[2] mx-auto flex h-full max-w-[1200px] flex-col justify-start gap-6 px-6 pt-32 md:justify-center md:pt-0">
        <Reveal>
          <Eyebrow className="text-green-200">{content.eyebrow}</Eyebrow>
          <h2
            id="nosotros-title"
            className="mt-6 max-w-[13ch] text-balance font-display text-[clamp(38px,5vw,70px)] font-light leading-none tracking-[-0.035em] text-text-primary"
          >
            {content.title_lead}{" "}
            <em className="block font-serif font-normal italic text-green-200">{content.title_accent}</em>
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-text-secondary">{content.subtitle}</p>
        </Reveal>
        <Reveal>
          <ul className="mt-8 grid max-w-[760px] grid-cols-2 border-t border-white/15 md:grid-cols-4">
            {content.differentiators.map((item) => (
              <li key={item.title} className="pr-[18px] pt-[18px]">
                <h3 className="font-display text-sm font-semibold tracking-[-0.01em] text-text-primary">{item.title}</h3>
                <p className="mt-1 text-[13px] leading-normal text-text-muted">{item.description}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
