export interface TeamMemberCard {
  /** `null` para quien todavía no tiene página propia: la tarjeta no enlaza.
      Enlazar a una ficha inexistente daría 404. */
  slug: string | null;
  name: string;
  role: string;
  bio: string;
  chips: readonly string[];
  /** Foto recortada (con alfa) en public/: la palabra gigante pasa detrás.
      Las variantes AVIF/WebP las genera `pnpm assets`. */
  photo_src: string;
  photo_width: number;
  photo_height: number;
  /** Hoja de vida en PDF, si la persona la publica. */
  cv_src: string | null;
}

export interface TeamContent {
  eyebrow: string;
  title: string;
  /** El lockup motion (K-24): entrada en serif y palabra gigante. */
  entry: string;
  word: string;
  members: readonly TeamMemberCard[];
  profile_label: string;
  cv_label: string;
  join_lead: string;
  join_emphasis: string;
}
