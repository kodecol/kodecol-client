import { Reveal } from "@/shared/ui/reveal";

interface BrandSectionHeadingProps {
  eyebrow: string;
  title?: string;
  description?: string;
  /** id del <h2>: la <section> lo referencia con aria-labelledby. */
  id?: string;
}

/** Encabezado de sección en la paleta de la marca invitada. */
export function BrandSectionHeading({
  eyebrow,
  title,
  description,
  id,
}: BrandSectionHeadingProps) {
  return (
    <header className="mb-12 flex max-w-[64ch] flex-col gap-4">
      <Reveal>
        <p className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent)]">
          <span
            aria-hidden
            className="size-[5px] rounded-full bg-current shadow-[0_0_12px_currentColor]"
          />
          {eyebrow}
        </p>
      </Reveal>
      {title ? (
        <Reveal delay={60}>
          <h2
            id={id}
            className="font-sora text-[26px] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--brand-ink)] md:text-[36px]"
          >
            {title}
          </h2>
        </Reveal>
      ) : null}
      {description ? (
        <Reveal delay={110}>
          <p className="text-base leading-relaxed text-[var(--brand-ink-muted)]">
            {description}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
