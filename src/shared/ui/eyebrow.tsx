import { cn } from "@/shared/lib/cn";

interface EyebrowProps {
  children: React.ReactNode;
  /** Variante pill con punto luminoso (como el hero del mockup). */
  pill?: boolean;
  className?: string;
}

/** Etiqueta de sección: mayúsculas, tracking amplio, acento menta. */
export function Eyebrow({ children, pill = false, className }: EyebrowProps) {
  if (pill) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border-default bg-glass-fill px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-mint-300 backdrop-blur-[16px]",
          className,
        )}
      >
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-mint-500 shadow-glow-accent-strong"
        />
        {children}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-mint-500",
        className,
      )}
    >
      {/* Línea guía: el gesto editorial de la dirección orgánica */}
      <span aria-hidden className="h-px w-[18px] bg-current opacity-70" />
      {children}
    </span>
  );
}
