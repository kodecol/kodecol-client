import type { ProductBrand } from "@/core/domain/product_brand";
import { CANVAS_PALETTE as P } from "@/shared/config/canvas_palette";
import { build_warp_mesh, split_in_two_lines } from "@/shared/lib/warp_mesh";
import type { WarpCard } from "@/shared/ui/warp_carousel";

/*
  Fuera de su página manda Kodecol (architecture.md §6): las tarjetas de cifras de
  una marca propia se pintan con la paleta corporativa, en cuatro "estaciones"
  de la pradera. Las cifras salen del JSON del producto, no se escriben aquí.
*/
const MESHES = [
  build_warp_mesh(P.surface_inset, [[0.82, 0.86, 0.55, P.mint_500], [0.2, 0.25, 0.7, P.green_800], [0.55, 0.55, 0.35, P.surface_2]]),
  build_warp_mesh(P.green_950, [[0.5, 0.95, 0.6, P.green_400], [0.3, 0.1, 0.55, P.cream_200], [0.85, 0.4, 0.4, P.green_700]]),
  build_warp_mesh(P.green_900, [[0.5, 0.5, 0.55, P.green_600], [0.12, 0.1, 0.4, P.green_200], [0.9, 0.9, 0.5, P.surface_inset]]),
  build_warp_mesh(P.surface_1, [[0.5, 0.05, 0.6, P.green_300], [0.6, 0.95, 0.6, P.green_500], [0.1, 0.6, 0.4, P.green_800]]),
];
const NUMERALS = [
  [P.mint_300, P.green_50],
  [P.cream_200, P.green_50],
  [P.green_200, P.green_50],
  [P.mint_300, P.cream_ink],
] as const;
const DETAILS = ["ring", "wave", "line", "ring"] as const;

export function build_brand_metric_cards(brand: ProductBrand): WarpCard[] {
  const showcase = brand.teaser.showcase;
  if (!showcase) return [];
  const items = showcase.metric_values
    .map((value) => brand.detail.metrics.items.find((item) => item.value === value))
    .filter((item) => item !== undefined);
  return items.map((item, i) => ({
    title: split_in_two_lines(item.label),
    value: item.value,
    footer: brand.name,
    detail: DETAILS[i % DETAILS.length],
    mesh: MESHES[i % MESHES.length],
    numeral: NUMERALS[i % NUMERALS.length],
    accent: P.mint_500,
    glow: i % 2 ? P.green_300 : P.mint_500,
  }));
}
