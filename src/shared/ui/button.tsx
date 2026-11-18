import Link from "next/link";
import { cn } from "@/shared/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "ink";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  external?: boolean;
  className?: string;
  aria_label?: string;
}

const variant_classes: Record<ButtonVariant, string> = {
  primary:
    "bg-mint-500 text-text-on-accent shadow-glow-accent-strong hover:bg-mint-400 hover:-translate-y-0.5 active:bg-mint-600",
  secondary:
    "bg-glass-fill text-text-primary border border-border-default backdrop-blur-[16px] hover:border-border-accent hover:bg-surface-3/60 hover:-translate-y-0.5",
  ghost:
    "text-text-primary hover:text-mint-500",
  /* CTA primario sobre la atmósfera Cielo: pill petróleo con texto claro (DESIGN.md §7). */
  ink: "bg-ink-petrol text-cream-50 hover:-translate-y-0.5 hover:bg-green-950",
};

const size_classes: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-[15px]",
  lg: "px-9 py-4.5 text-base",
};

/** Botón pill del sistema: primario (menta), secundario (glass), ghost o tinta (Cielo). Siempre es un enlace. */
export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className,
  aria_label,
}: ButtonProps) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold tracking-[0.01em] transition-[background-color,border-color,color,transform,box-shadow] duration-fast ease-kodecol",
    variant_classes[variant],
    size_classes[size],
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={aria_label}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} aria-label={aria_label}>
      {children}
    </Link>
  );
}
