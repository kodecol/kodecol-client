import Link from "next/link";
import type { DeveloperProfile } from "@/core/domain/developer_profile";
import { MAIN_CONTENT_ID } from "@/shared/ui/skip_link";
import { PortfolioTopBar } from "./portfolio_top_bar";
import { AboutSection } from "./sections/about_section";
import { ContactSection } from "./sections/contact_section";
import { EducationSection } from "./sections/education_section";
import { ExperienceSection } from "./sections/experience_section";
import { FeaturedProjectsSection } from "./sections/featured_projects_section";
import { ProfileHeroSection } from "./sections/profile_hero_section";
import { SkillsSection } from "./sections/skills_section";

interface PortfolioTemplateProps {
  profile: DeveloperProfile;
}

/**
 * Plantilla polimórfica del portafolio: una sola estructura que se comporta según
 * el DeveloperProfile recibido (validado por zod en el adaptador). Añadir un
 * desarrollador nuevo = crear su JSON; esta plantilla no cambia.
 */
export function PortfolioTemplate({ profile }: PortfolioTemplateProps) {
  return (
    <>
      <PortfolioTopBar profile={profile} />
      <main id={MAIN_CONTENT_ID}>
        <ProfileHeroSection profile={profile} />
        <AboutSection profile={profile} />
        <SkillsSection profile={profile} />
        <ExperienceSection profile={profile} />
        <EducationSection profile={profile} />
        <FeaturedProjectsSection profile={profile} />
        <ContactSection profile={profile} />
      </main>
      <footer className="border-t border-border-subtle bg-surface-1 px-6 py-8 text-center text-[13px] text-text-muted">
        Parte de la{" "}
        <Link href="/equipo" className="text-mint-500 hover:text-mint-400">
          crew de Kodecol
        </Link>{" "}
        · <em>Construimos futuro.</em>
      </footer>
    </>
  );
}
