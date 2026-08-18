import { SITE_CONFIG } from "@/shared/config/site_config";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";
import { TEAM_CONTENT } from "./content";
import { TeamMemberCard } from "./team_member_card";

/** Equipo (#equipo): encabezado centrado + tarjetas de la crew + invitación a unirse. */
export function TeamSection() {
  const content = TEAM_CONTENT;

  return (
    <section
      id="equipo"
      aria-labelledby="equipo-title"
      className="relative bg-bg px-6 py-24 md:py-[110px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[760px] max-w-full -translate-x-1/2"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(0,115,92,.25), transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-[980px]">
        <Reveal>
          <SectionHeading
            id="equipo-title"
            eyebrow={content.eyebrow}
            title={content.title}
            subtitle={content.subtitle}
            className="mx-auto max-w-[600px]"
            title_class_name="md:text-[38px]"
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {content.members.map((member, index) => (
            <Reveal key={member.slug} delay={index * 100}>
              <TeamMemberCard member={member} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-12 text-center text-sm text-text-muted">
            {content.join_lead}
            <a
              href={SITE_CONFIG.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-mint-500 hover:text-mint-400"
            >
              {content.join_emphasis}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
