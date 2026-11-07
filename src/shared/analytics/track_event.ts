/**
 * Evento de GA4 desde un componente de cliente.
 *
 * Sin GA cargado (dev, previews, bloqueadores) no hace nada: la medición nunca
 * puede romper un clic. Las utm del mensaje directo las toma GA4 solo.
 */
type Gtag = (command: "event", name: string, params?: Record<string, string | number>) => void;

export function track_event(name: string, params: Record<string, string | number> = {}): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  try {
    gtag?.("event", name, params);
  } catch {
    /* la medición no interrumpe nada */
  }
}
