import type { DeveloperProfile } from "@/core/domain/developer_profile";
import { Chip } from "@/shared/ui/chip";
import { GlassCard } from "@/shared/ui/glass_card";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";

interface EducationSectionProps {
  profile: DeveloperProfile;
}

/**
 * Educación & Certificados en 2 columnas; idiomas y habilidades blandas
 * solo se pintan si el perfil las trae (polimorfismo por datos).
 */
export function EducationSection({ profile }: EducationSectionProps) {
  return (
    <section
      aria-labelledby="formacion-title"
      className="bg-surface-1 px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1000px]">
        <Reveal>
          <SectionHeading
            id="formacion-title"
            align="left"
            eyebrow="Formación"
            title="Educación & Certificados"
          />
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Reveal delay={60}>
            <GlassCard className="h-full p-6">
              <h3 className="font-sora text-base font-semibold text-text-primary">
                Educación
              </h3>
              <ul className="mt-5 flex flex-col gap-5">
                {profile.education.map((entry) => (
                  <li key={entry.title}>
                    <p className="text-[15px] font-medium text-text-primary">
                      {entry.title}
                    </p>
                    <p className="mt-0.5 text-sm text-text-secondary">
                      {entry.institution}
                    </p>
                    {entry.period ? (
                      <p className="mt-0.5 font-mono text-xs text-text-muted">
                        {entry.period}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>

              {profile.languages.length > 0 ? (
                <>
                  <h3 className="mt-7 font-sora text-base font-semibold text-text-primary">
                    Idiomas
                  </h3>
                  <ul className="mt-3 flex flex-col gap-1">
                    {profile.languages.map((entry) => (
                      <li key={entry.language} className="text-sm text-text-secondary">
                        {entry.language} ·{" "}
                        <span className="text-green-200">{entry.level}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </GlassCard>
          </Reveal>

          <Reveal delay={120}>
            <GlassCard className="h-full p-6">
              <h3 className="font-sora text-base font-semibold text-text-primary">
                Certificados
              </h3>
              <ul className="mt-5 flex flex-col gap-5">
                {profile.certificates.map((entry) => (
                  <li key={entry.title}>
                    <p className="text-[15px] font-medium text-text-primary">
                      {entry.title}
                    </p>
                    <p className="mt-0.5 text-sm text-text-secondary">{entry.issuer}</p>
                  </li>
                ))}
              </ul>

              {profile.soft_skills.length > 0 ? (
                <>
                  <h3 className="mt-7 font-sora text-base font-semibold text-text-primary">
                    Habilidades blandas
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.soft_skills.map((skill) => (
                      <Chip key={skill}>{skill}</Chip>
                    ))}
                  </div>
                </>
              ) : null}
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
