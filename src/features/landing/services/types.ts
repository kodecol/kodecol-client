/*
  El copy de cada servicio no vive aquí: es contenido de dominio y viene del
  repositorio (content/services/*.json), para que el título de la fila y el de
  su página no puedan divergir. Este archivo solo tipa el copy DE LA SECCIÓN.
*/

export interface ServicesContent {
  eyebrow: string;
  /** El titular se parte: la cola va en serif itálica. */
  title_lead: string;
  title_accent: string;
  subtitle: string;
  cta_lead: string;
  cta_text: string;
  cta_label: string;
}
