/*
  El copy de cada servicio ya no vive aquí: es contenido de dominio y viene del
  repositorio (content/services/*.json), para que el título de la tarjeta y el de
  su página no puedan divergir. Este archivo solo tipa el copy DE LA SECCIÓN.
*/

export interface ServicesContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Texto del enlace de cada tarjeta hacia su página de servicio. */
  card_link_label: string;
  cta_lead: string;
  cta_emphasis: string;
  cta_tail: string;
  cta_link_label: string;
}
