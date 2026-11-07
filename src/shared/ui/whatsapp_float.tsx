import { SITE_CONFIG } from "@/shared/config/site_config";
import { WhatsappIcon } from "@/shared/ui/whatsapp_icon";

/** Botón flotante de WhatsApp, persistente abajo-derecha (DESIGN-SYSTEM.md §6.8). */
export function WhatsappFloat() {
  return (
    <a
      href={SITE_CONFIG.whatsapp_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablemos por WhatsApp"
      title="Hablemos por WhatsApp"
      data-whatsapp-float=""
      className="fixed bottom-[26px] right-[26px] z-[120] grid size-[58px] animate-kc-rise place-items-center rounded-full border border-border-accent bg-gradient-to-br from-green-600 to-green-800 text-text-primary shadow-[0_8px_24px_rgba(0,0,0,.35),0_0_26px_rgba(52,224,161,.35)] transition-transform duration-fast ease-kodecol hover:scale-105"
    >
      <WhatsappIcon size={26} />
    </a>
  );
}
