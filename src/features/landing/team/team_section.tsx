import { SITE_CONFIG } from "@/shared/config/site_config";
import { Button } from "@/shared/ui/button";
import { Chip } from "@/shared/ui/chip";
import { Fireflies } from "@/shared/ui/fireflies";
import { GiantWord } from "@/shared/ui/giant_word";
import { LineIcon } from "@/shared/ui/line_icon";
import { Reveal } from "@/shared/ui/reveal";
import { StaticPicture } from "@/shared/ui/static_picture";
import { TEAM_CONTENT } from "./content";

const to_base = (src: string) => src.replace(/\.[a-zA-Z]+$/, "");

/** Ancho de la cabeza en el retrato móvil de cada tarjeta: todas iguales. */
const HEAD_PX = 92;

/**
 * Equipo (#equipo), en la estética motion de Kodecol (K-24): la crew recortada
 * en la pradera de noche, con «construyen.» pasando detrás. Debajo, una tarjeta
 * de vidrio por persona con su perfil y su hoja de vida.
 *
 * En móvil las tarjetas van una debajo de otra, así que la foto de grupo no
 * casaría con ellas: la escena queda solo con el lockup y cada tarjeta abre con
 * el retrato de su persona, encuadrado por `photo_focus` para que todos se vean
 * del mismo tamaño.
 */
export function TeamSection() {
  const content = TEAM_CONTENT;

  return (
    <section id="equipo" aria-labelledby="equipo-title" className="relative pb-16">
      <h2 id="equipo-title" className="sr-only">
        {content.title}
      </h2>
      <div className="relative isolate h-[400px] overflow-hidden md:h-[clamp(640px,64vw,900px)]">
        <StaticPicture
          src_base="/images/scenes/cta_desktop"
          fallback_extension="jpg"
          width={1600}
          height={900}
          alt=""
          fill
          className="z-0 object-cover object-[50%_20%] brightness-[.55] saturate-[.9]"
        />
        <Fireflies className="z-[1]" />
        <p
          aria-hidden
          className="absolute inset-x-0 top-[33%] z-[4] text-center font-serif text-[clamp(30px,3.6vw,54px)] italic leading-none tracking-[-0.02em] text-cream-ink md:top-[11%]"
        >
          {content.entry}
        </p>
        <div className="absolute left-1/2 top-[54%] z-[2] -translate-x-1/2 -translate-y-1/2 md:top-[27%]">
          <GiantWord text={content.word} className="text-[13.5vw] md:text-[clamp(90px,14.5vw,240px)]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-[3] hidden items-end justify-center md:flex md:gap-[clamp(0px,6vw,110px)]">
          {content.members.map((member) => (
            <StaticPicture
              key={member.name}
              src_base={to_base(member.photo_src)}
              alt={`Foto de ${member.name}`}
              width={member.photo_width}
              height={member.photo_height}
              className="h-[300px] w-auto max-w-[50%] object-contain object-bottom drop-shadow-[0_30px_50px_rgb(0_0_0/.6)] md:h-[clamp(380px,42vw,600px)] md:max-w-none"
            />
          ))}
        </div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-[4] h-[32%] bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="relative z-[5] mx-auto -mt-10 grid max-w-[1200px] gap-[22px] px-6 md:-mt-[90px] md:grid-cols-2">
        {content.members.map((member, index) => (
          <Reveal key={member.name} delay={index * 100} className="h-full">
            <article className="flex h-full flex-col gap-3.5 overflow-hidden rounded-[28px] border border-border-default bg-glass-fill-strong p-[30px] shadow-glass-lg backdrop-blur-[22px]">
              <div
                aria-hidden
                className="relative -mx-[30px] -mt-[30px] mb-1 h-[240px] overflow-hidden [mask-image:linear-gradient(180deg,#000_62%,transparent)] md:hidden"
              >
                <StaticPicture
                  src_base="/images/scenes/cta_desktop"
                  fallback_extension="jpg"
                  width={1600}
                  height={900}
                  alt=""
                  fill
                  className="object-cover object-[50%_42%] brightness-[.5] saturate-[.9]"
                />
                <StaticPicture
                  src_base={to_base(member.photo_src)}
                  alt=""
                  width={member.photo_width}
                  height={member.photo_height}
                  className="absolute top-8 w-auto max-w-none drop-shadow-[0_24px_40px_rgb(0_0_0/.6)]"
                  style={{
                    height: `${Math.round(HEAD_PX / member.photo_focus.head)}px`,
                    left: `calc(50% - ${Math.round((HEAD_PX / member.photo_focus.head) * (member.photo_width / member.photo_height) * member.photo_focus.x)}px)`,
                  }}
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mint-500">{member.role}</p>
              <h3 className="font-display text-[clamp(26px,2.6vw,36px)] font-extrabold leading-none tracking-[-0.045em] text-text-primary">
                {member.name}
              </h3>
              <p className="text-[15.5px] leading-relaxed text-text-secondary">{member.bio}</p>
              <div className="flex flex-wrap gap-2">
                {member.chips.map((chip) => (
                  <Chip key={chip}>{chip}</Chip>
                ))}
              </div>
              {member.slug || member.cv_src ? (
                <div className="mt-auto flex flex-wrap items-center gap-[18px] pt-2">
                  {member.slug ? (
                    <Button href={`/equipo/${member.slug}`} variant="secondary" size="sm">
                      {content.profile_label}
                      <LineIcon name="arrow_right" size={14} />
                    </Button>
                  ) : null}
                  {member.cv_src ? (
                    <a
                      href={member.cv_src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-b border-mint-300/40 pb-0.5 text-sm font-semibold text-mint-300 hover:text-mint-500"
                    >
                      {content.cv_label}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto max-w-[1200px] px-6">
        <a
          href={SITE_CONFIG.whatsapp_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-[22px] flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-dashed border-border-strong px-7 py-[22px] text-text-secondary transition-colors duration-fast hover:border-border-accent"
        >
          <span>{content.join_lead}</span>
          <b className="inline-flex items-center gap-2 text-mint-500">
            {content.join_emphasis}
            <LineIcon name="arrow_right" size={16} />
          </b>
        </a>
      </div>
    </section>
  );
}
