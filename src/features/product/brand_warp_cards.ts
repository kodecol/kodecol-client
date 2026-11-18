import type { ProductBrand } from "@/core/domain/product_brand";
import { build_warp_mesh, split_in_two_lines } from "@/shared/lib/warp_mesh";
import type { WarpCard } from "@/shared/ui/warp_carousel";

/*
  Dentro de su página manda la marca: las tarjetas de cifras se pintan con su
  paleta (que es contenido y viene validada del JSON), no con la de Kodecol.
*/
export function build_brand_warp_cards(brand: ProductBrand): WarpCard[] {
  const { ground, accent, accent_soft } = brand.theme;
  const accent_2 = brand.theme.accent_2 ?? accent;
  const accent_3 = brand.theme.accent_3 ?? accent_soft;
  const tones = [accent, accent_2, accent_3, accent];
  const meshes = [
    build_warp_mesh(ground, [[0.8, 0.85, 0.6, accent], [0.5, 0.5, 0.3, accent_soft]]),
    build_warp_mesh(ground, [[0.25, 0.8, 0.6, accent_2], [0.6, 0.55, 0.3, accent_2]]),
    build_warp_mesh(ground, [[0.5, 0.9, 0.6, accent_3], [0.85, 0.5, 0.35, accent_3]]),
    build_warp_mesh(ground, [[0.15, 0.85, 0.5, accent], [0.85, 0.85, 0.5, accent_2], [0.5, 0.15, 0.45, accent_3]]),
  ];
  const showcase = brand.teaser.showcase;
  const items = showcase
    ? showcase.metric_values
        .map((value) => brand.detail.metrics.items.find((item) => item.value === value))
        .filter((item) => item !== undefined)
    : brand.detail.metrics.items.filter((item) => item.featured);
  return items.map((item, i) => ({
    title: split_in_two_lines(item.label),
    value: item.value,
    footer: brand.name,
    detail: (["ring", "wave", "line", "ring"] as const)[i % 4],
    mesh: meshes[i % meshes.length],
    numeral: [accent_soft, brand.theme.ink] as const,
    accent: tones[i % tones.length],
    glow: tones[i % tones.length],
  }));
}
