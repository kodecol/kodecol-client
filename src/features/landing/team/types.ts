export interface TeamMemberCard {
  /** `null` para quien todavía no tiene página propia: la tarjeta no enlaza.
      Enlazar a una ficha inexistente daría 404. */
  slug: string | null;
  name: string;
  role: string;
  bio: string;
  chips: readonly string[];
  /** Foto en public/ o null si aún no hay (se pinta placeholder de marca).
      La extensión indica el fallback de <picture>; las variantes AVIF/WebP las
      genera `pnpm assets`. */
  photo_src: string | null;
}

export interface TeamContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  members: readonly TeamMemberCard[];
  join_lead: string;
  join_emphasis: string;
}
