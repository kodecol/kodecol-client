import type { DeveloperProfile } from "@/core/domain/developer_profile";
import { Chip } from "@/shared/ui/chip";
import { GlassCard } from "@/shared/ui/glass_card";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";

interface SkillsSectionProps {
  profile: DeveloperProfile;
}

/** Stack & Skills: 4 tarjetas glass con chips de tecnologías. */
export function SkillsSection({ profile }: SkillsSectionProps) {
  return (
    <section
      aria-labelledby="habilidades-title"
      className="bg-surface-1 px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1000px]">
        <Reveal>
          <SectionHeading
            id="habilidades-title"
            align="left"
            eyebrow="Stack & Skills"
            title="Las herramientas con las que construyo."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {profile.skill_groups.map((group, index) => (
            <Reveal key={group.title} delay={60 + index * 60}>
              <GlassCard interactive className="h-full p-6">
                <h3 className="font-sora text-base font-semibold text-text-primary">
                  {group.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <Chip key={skill}>{skill}</Chip>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
