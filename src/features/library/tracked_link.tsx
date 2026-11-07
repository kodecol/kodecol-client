"use client";

import { track_event } from "@/shared/analytics/track_event";

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  event_name: string;
  event_params?: Record<string, string | number>;
}

/** Enlace que manda un evento de GA4 al hacer clic (WhatsApp, Claude, descarga). */
export function TrackedLink({ event_name, event_params, onClick, children, ...rest }: TrackedLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track_event(event_name, event_params);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
