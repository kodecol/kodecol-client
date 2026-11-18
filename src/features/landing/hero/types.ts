export interface HeroCta {
  label: string;
  href: string;
  external: boolean;
}

export interface HeroContent {
  /** El titular completo, para el <h1> (los lectores de pantalla y Google). */
  title: string;
  /** La misma frase, partida en el lockup motion (K-24): entrada · palabra · remate. */
  entry: string;
  word: string;
  remate: string;
  primary_cta: HeroCta;
  secondary_cta: HeroCta;
  microcopy: string;
  /** Lo que hacemos, en una frase, con un tramo enfatizado. */
  intro_lead: string;
  intro_emphasis: string;
  intro_tail: string;
  band_label: string;
}
