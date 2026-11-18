import { Reveal } from "@/shared/ui/reveal";
import { TRUST_BAR_CONTENT } from "./trust_bar_content";

/**
 * Barra de confianza (prueba social) bajo el héroe: nombres como texto, apagados
 * en verde-gris, que se iluminan al hover. Una línea fina la separa de la frase
 * de arriba para que el bloque se lea como una sola unidad.
 */
export function TrustBar() {
  return (
    <div className="relative mx-auto max-w-[1200px] px-6 pt-[72px]">
      <span
        aria-hidden
        className="absolute left-1/2 top-9 h-px w-14 -translate-x-1/2 bg-gradient-to-r from-transparent via-border-strong to-transparent"
      />
      <Reveal>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          {TRUST_BAR_CONTENT.heading}
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-11 gap-y-4">
          {TRUST_BAR_CONTENT.brands.map((brand) => (
            <li
              key={brand}
              className="font-display text-[15px] font-semibold tracking-[0.06em] text-text-brandmark transition-colors duration-fast hover:text-text-primary md:text-[17px]"
            >
              {brand}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
