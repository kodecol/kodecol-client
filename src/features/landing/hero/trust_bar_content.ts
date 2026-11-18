interface TrustBarContent {
  heading: string;
  brands: readonly string[];
}

/* Marcas como texto, no logos de imagen. Todas en mayúsculas para que la barra
   se lea pareja (MEGAGUAY ahora se llama PERPLEX GROUP). */
export const TRUST_BAR_CONTENT = {
  heading: "Empresas que ya construyen con Kodecol",
  brands: ["PERPLEX GROUP", "QUÁNTICA", "FEDEGOLF", "TERPEL", "ACERTEMOS"],
} as const satisfies TrustBarContent;
