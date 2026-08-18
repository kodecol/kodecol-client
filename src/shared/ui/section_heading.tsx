import { cn } from "@/shared/lib/cn";
import { Eyebrow } from "@/shared/ui/eyebrow";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  title_class_name?: string;
  /** id del heading: la <section> que lo contiene lo referencia con aria-labelledby. */
  id?: string;
  /** Nivel del heading. h2 por defecto; h3 cuando el bloque es una subsección. */
  as?: "h2" | "h3";
}

/** Encabezado de sección: eyebrow + H2 (Sora) + subtítulo opcional. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  title_class_name,
  id,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading
        id={id}
        className={cn(
          "font-sora text-3xl font-semibold leading-[1.18] tracking-[-0.01em] text-text-primary md:text-[34px]",
          title_class_name,
        )}
      >
        {title}
      </Heading>
      {subtitle ? (
        <p className="max-w-[680px] text-base leading-relaxed text-text-secondary">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
