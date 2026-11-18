import type { OwnBrandsContent } from "./types";

/* Copy del marco de la sección #marcas. Lo de cada producto vive en content/products/. */
export const OWN_BRANDS_CONTENT = {
  eyebrow: "Marca propia de Kodecol",
  cta_label: "Conocer",
} as const satisfies OwnBrandsContent;
