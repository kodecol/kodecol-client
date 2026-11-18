import { cn } from "@/shared/lib/cn";

interface BrowserFrameProps {
  /** Lo que se ve en la barra: el dominio del sitio. */
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** Marco de navegador para mostrar capturas de sitios reales. */
export function BrowserFrame({ label, children, className }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[14px] border border-border-default bg-surface-inset shadow-[0_30px_80px_-20px_rgb(0_0_0/.85)]",
        className,
      )}
    >
      <div aria-hidden className="flex h-[30px] items-center gap-1.5 border-b border-white/[.06] bg-surface-1 px-3">
        <i className="size-[9px] rounded-full bg-white/20" />
        <i className="size-[9px] rounded-full bg-white/20" />
        <i className="size-[9px] rounded-full bg-white/20" />
        <span className="ml-2.5 truncate font-mono text-[11px] text-text-muted">{label}</span>
      </div>
      {children}
    </div>
  );
}
