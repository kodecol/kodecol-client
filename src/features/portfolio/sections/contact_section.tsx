import type { DeveloperProfile } from "@/core/domain/developer_profile";
import { build_whatsapp_url } from "@/shared/lib/build_whatsapp_url";
import { Button } from "@/shared/ui/button";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { LineIcon } from "@/shared/ui/line_icon";
import { Reveal } from "@/shared/ui/reveal";
import { WhatsappIcon } from "@/shared/ui/whatsapp_icon";

interface ContactSectionProps {
  profile: DeveloperProfile;
}

/** Contacto: tarjeta CTA con gradiente radial, WhatsApp + correo (fiel al mockup). */
export function ContactSection({ profile }: ContactSectionProps) {
  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className="bg-surface-1 px-6 pb-24 pt-16 md:pt-20"
    >
      <Reveal className="mx-auto max-w-[820px]">
        <div
          className="relative overflow-hidden rounded-2xl border border-border-accent px-6 py-12 text-center md:px-10 md:py-16"
          style={{
            background:
              "radial-gradient(120% 140% at 50% 0%, rgba(0,115,92,.55), rgba(1,75,77,.30) 55%, rgba(4,17,15,.6))",
          }}
        >
          <div className="relative flex flex-col items-center gap-5">
            <Eyebrow>Hablemos</Eyebrow>
            <h2
              id="contacto-title"
              className="font-sora text-3xl font-bold text-text-primary md:text-4xl"
            >
              ¿Construimos algo juntos?
            </h2>
            <p className="max-w-[520px] text-base leading-relaxed text-green-100">
              Hablemos de tu proyecto, una automatización o ese producto que
              tienes en mente.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                href={build_whatsapp_url(profile.contact.whatsapp_number)}
                external
              >
                <WhatsappIcon size={20} />
                WhatsApp
              </Button>
              <Button
                href={`mailto:${profile.contact.email}`}
                variant="secondary"
                external
              >
                <LineIcon name="mail" size={18} />
                Enviar correo
              </Button>
            </div>
            <p className="mt-3 font-mono text-[13px] text-text-brandmark">
              wa.me/{profile.contact.whatsapp_number} · {profile.contact.email}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
