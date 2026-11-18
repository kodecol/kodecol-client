import { cn } from "@/shared/lib/cn";

interface StatusChipProps {
  /** `live` = en producción (punto menta fijo); `building` = en construcción (ámbar, titila). */
  status: "live" | "building";
  label: string;
  className?: string;
}

/**
 * Estado de un proyecto o producto. El color nunca va solo: siempre acompaña
 * a un texto (DESIGN.md §12).
 */
export function StatusChip({ status, label, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-2 whitespace-nowrap rounded-full border border-border-subtle bg-white/[.04] px-3 text-xs text-text-secondary",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          status === "live"
            ? "bg-mint-500 shadow-glow-accent"
            : "animate-kc-blink bg-warning shadow-[0_0_10px_var(--color-warning)]",
        )}
      />
      {label}
    </span>
  );
}

export const PROJECT_STATUS_LABEL = {
  live: "En producción",
  building: "En construcción",
} as const;
