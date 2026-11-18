import type { CSSProperties } from "react";
import type { BrandTheme } from "@/core/domain/product_brand";

/**
 * Traduce la paleta de una marca propia a variables CSS acotadas a su página.
 *
 * Por qué existe: los colores de una marca invitada son **contenido** (viven en su
 * JSON y los valida zod), no design system. Los componentes de la plantilla los
 * consumen como `var(--brand-*)`, así que siguen sin llevar un solo hex dentro
 * (architecture.md §7) y la plantilla sirve para cualquier marca futura.
 */
export function build_brand_theme(theme: BrandTheme): CSSProperties {
  return {
    "--brand-ground": theme.ground,
    "--brand-surface": theme.surface,
    "--brand-surface-raised": theme.surface_raised,
    "--brand-accent": theme.accent,
    "--brand-accent-soft": theme.accent_soft,
    "--brand-ink": theme.ink,
    "--brand-ink-muted": theme.ink_muted,
    "--brand-ink-dim": theme.ink_dim,
    "--brand-line": theme.line,
    /* Acentos secundarios: si la marca no los trae, caen al principal. */
    "--brand-accent-2": theme.accent_2 ?? theme.accent,
    "--brand-accent-3": theme.accent_3 ?? theme.accent_soft,
  } as CSSProperties;
}
