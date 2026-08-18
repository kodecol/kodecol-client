import type { DeveloperProfile } from "@/core/domain/developer_profile";
import { build_whatsapp_url } from "@/shared/lib/build_whatsapp_url";
import { Button } from "@/shared/ui/button";
import { KodecolMark } from "@/shared/ui/kodecol_mark";
import { LineIcon } from "@/shared/ui/line_icon";
import { Reveal } from "@/shared/ui/reveal";
import { WhatsappIcon } from "@/shared/ui/whatsapp_icon";
import { StaticPicture } from "@/shared/ui/static_picture";

interface ProfileHeroSectionProps {
  profile: DeveloperProfile;
}

/** Héroe del portafolio: foto con glow + badge de rol, nombre, tagline, CTAs y 3 métricas. */
export function ProfileHeroSection({ profile }: ProfileHeroSectionProps) {
  return (
    <section
      aria-labelledby="perfil-title"
      className="relative overflow-hidden px-6 pb-16 pt-[140px] md:pt-[160px]"
      style={{
        background:
          "radial-gradient(110% 80% at 22% 30%, #00735C 0%, #014B4D 40%, #04110F 78%)",
      }}
    >
      <div className="relative mx-auto grid max-w-[1100px] items-center gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-14">
        <Reveal className="flex justify-center">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 animate-kc-pulse rounded-full blur-[24px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(52,224,161,.30), transparent 70%)",
              }}
            />
            {profile.photo_src ? (
              /* LCP real de la página: aquí `priority` sí corresponde. El PNG
                 original son 1,9 MB a 1024×1536; la variante AVIF a 460 px pesa
                 ~10 KB. Las genera scripts/generate_image_variants.mjs. */
              <StaticPicture
                src_base={profile.photo_src.replace(/\.[a-zA-Z]+$/, "")}
                alt={`Foto de ${profile.full_name}`}
                width={460}
                height={690}
                priority
                className="max-h-[400px] w-auto object-contain drop-shadow-[0_16px_48px_rgba(0,0,0,.45)]"
              />
            ) : (
              /* Placeholder de marca mientras no hay foto */
              <div className="grid size-[280px] place-items-center rounded-2xl border border-border-default bg-glass-fill backdrop-blur-[18px]">
                <KodecolMark size={88} className="opacity-70" />
              </div>
            )}
          </div>
        </Reveal>

        <div className="flex flex-col items-start gap-5">
          <Reveal>
            <span className="rounded-full border border-border-accent bg-glass-fill px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-mint-300 backdrop-blur-[16px]">
              {profile.role_badge}
            </span>
          </Reveal>
          <Reveal delay={60}>
            <h1
              id="perfil-title"
              className="font-sora text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-text-primary md:text-5xl"
            >
              {profile.full_name}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-[560px] text-lg leading-relaxed text-text-secondary">
              {profile.tagline}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <p className="inline-flex items-center gap-2 text-sm text-text-muted">
              <LineIcon name="pin" size={16} className="text-mint-500" />
              {profile.location}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-wrap items-center gap-3">
              <Button href={profile.cv_src} external size="sm">
                <LineIcon name="download" size={18} />
                Descargar CV
              </Button>
              <Button
                href={build_whatsapp_url(profile.contact.whatsapp_number)}
                variant="secondary"
                size="sm"
                external
              >
                <WhatsappIcon size={18} />
                WhatsApp
              </Button>
              {profile.contact.linkedin_url ? (
                <Button
                  href={profile.contact.linkedin_url}
                  variant="secondary"
                  size="sm"
                  external
                >
                  LinkedIn
                </Button>
              ) : null}
              {profile.contact.github_url ? (
                <Button
                  href={profile.contact.github_url}
                  variant="secondary"
                  size="sm"
                  external
                >
                  GitHub
                </Button>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={240} className="w-full">
            {/* El <dt> (término) va antes que el <dd> (definición), como manda
                la lista; el orden visual —cifra arriba— lo da flex-col-reverse.
                Antes el DOM los tenía invertidos. */}
            <dl className="mt-4 grid grid-cols-3 gap-4 border-t border-border-subtle pt-6">
              {profile.metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs text-text-muted">{metric.label}</dt>
                  <dd className="font-sora text-2xl font-bold text-mint-500 md:text-3xl">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
