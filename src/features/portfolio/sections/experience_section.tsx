import type { DeveloperProfile } from "@/core/domain/developer_profile";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section_heading";
import { ExperienceTimeline } from "./experience_timeline";

interface ExperienceSectionProps {
  profile: DeveloperProfile;
}

/** Experiencia: sección server que envuelve el timeline client (la hoja interactiva). */
export function ExperienceSection({ profile }: ExperienceSectionProps) {
  return (
    <section
      aria-labelledby="experiencia-title"
      className="px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-[820px]">
        <Reveal>
          <SectionHeading
            id="experiencia-title"
            align="left"
            eyebrow="Experiencia"
            title="Una trayectoria construyendo de todo."
          />
        </Reveal>
        <Reveal delay={80}>
          <ExperienceTimeline entries={profile.experience} />
        </Reveal>
      </div>
    </section>
  );
}
