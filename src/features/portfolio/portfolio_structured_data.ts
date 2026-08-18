import type { DeveloperProfile } from "@/core/domain/developer_profile";
import { type JsonLdNode, prune_node, ref } from "@/shared/seo/schema_org_types";
import { ORGANIZATION_ID } from "@/shared/seo/site_nodes";
import { build_absolute_url } from "@/shared/seo/urls";

/*
  Mapea un DeveloperProfile a un nodo Person de schema.org.

  Vive aquí y no en shared/seo porque conoce el dominio: shared no sabe qué es un
  perfil de desarrollador (§2 de architecture.md). El ensamblaje del @graph lo
  hace el composition root en src/app/equipo/[slug]/page.tsx.
*/
export function build_person_node(
  profile: DeveloperProfile,
  canonical: string,
): JsonLdNode {
  return prune_node({
    "@type": "Person",
    "@id": `${canonical}#person`,
    name: profile.full_name,
    alternateName: profile.short_name,
    jobTitle: profile.role_badge,
    description: profile.tagline,
    disambiguatingDescription: profile.about,
    url: canonical,
    image: profile.photo_src ? build_absolute_url(profile.photo_src) : undefined,
    email: `mailto:${profile.contact.email}`,
    telephone: `+${profile.contact.whatsapp_number}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
      addressCountry: "CO",
    },
    worksFor: ref(ORGANIZATION_ID),
    /* Solo perfiles públicos reales: los campos son `string | null` en el dominio. */
    sameAs: [profile.contact.linkedin_url, profile.contact.github_url].filter(
      (url): url is string => url !== null,
    ),
    knowsAbout: profile.skill_groups.flatMap((group) => [...group.skills]),
    knowsLanguage: profile.languages.map((entry) => ({
      "@type": "Language",
      name: entry.language,
      alternateName: entry.level,
    })),
    alumniOf: profile.education.map((entry) => ({
      "@type": "EducationalOrganization",
      name: entry.institution,
    })),
    hasCredential: profile.certificates.map((certificate) => ({
      "@type": "EducationalOccupationalCredential",
      name: certificate.title,
      recognizedBy: { "@type": "Organization", name: certificate.issuer },
    })),
  });
}
