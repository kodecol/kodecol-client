import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { get_developer_profile_repository } from "@/adapters/content";
import { build_person_node } from "@/features/portfolio/portfolio_structured_data";
import { PortfolioTemplate } from "@/features/portfolio/portfolio_template";
import { build_page_metadata } from "@/shared/seo/build_page_metadata";
import { JsonLd } from "@/shared/seo/json_ld";
import { build_graph } from "@/shared/seo/schema_org_types";
import {
  build_breadcrumb_node,
  build_organization_node,
  build_web_page_node,
  build_website_node,
} from "@/shared/seo/site_nodes";
import { build_absolute_url, build_og_image_path } from "@/shared/seo/urls";

/*
  Composition root del portafolio: único punto donde app conoce el adaptador.
  Rutas 100% estáticas (SSG); un slug desconocido responde 404.
  Aquí se ensambla también el @graph de datos estructurados: los nodos los
  construyen shared/seo (sitio) y features/portfolio (la persona).
*/

interface PortfolioPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  const repository = get_developer_profile_repository();
  return repository.get_all_slugs().map((slug) => ({ slug }));
}

const build_path = (slug: string) => `/equipo/${slug}`;

export async function generateMetadata({
  params,
}: PortfolioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = get_developer_profile_repository().get_by_slug(slug);
  if (!profile) return {};

  return build_page_metadata({
    title: profile.seo.title,
    description: profile.seo.description,
    path: build_path(slug),
    /* Es una persona, no un sitio: og:type profile. */
    og_type: "profile",
    og_image_path: build_og_image_path(["equipo", slug]),
    og_image_alt: `${profile.full_name} — ${profile.role_badge}`,
    keywords: profile.seo.keywords,
  });
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { slug } = await params;
  const profile = get_developer_profile_repository().get_by_slug(slug);
  if (!profile) notFound();

  const canonical = build_absolute_url(build_path(slug));

  return (
    <>
      <JsonLd
        graph={build_graph([
          build_organization_node(),
          build_website_node(),
          build_web_page_node({
            canonical,
            title: profile.seo.title,
            description: profile.seo.description,
            og_image_url: build_absolute_url(build_og_image_path(["equipo", slug])),
            page_type: "ProfilePage",
            main_entity_id: `${canonical}#person`,
            breadcrumb_id: `${canonical}#breadcrumb`,
          }),
          build_breadcrumb_node(canonical, [
            { name: "Inicio", path: "/" },
            { name: "Equipo", path: "/equipo" },
            { name: profile.short_name, path: null },
          ]),
          build_person_node(profile, canonical),
        ])}
      />
      <PortfolioTemplate profile={profile} />
    </>
  );
}
