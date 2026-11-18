import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { get_client_project_repository, get_service_offering_repository } from "@/adapters/content";
import { build_creative_work_node } from "@/features/project/project_structured_data";
import { ProjectTemplate } from "@/features/project/project_template";
import { build_service_links } from "@/shared/config/service_links";
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
import { Footer } from "@/shared/ui/footer";
import { Navbar } from "@/shared/ui/navbar";
import { MAIN_CONTENT_ID } from "@/shared/ui/skip_link";

/*
  Composition root de las fichas de proyecto: único punto donde app conoce el
  adaptador. Rutas 100% estáticas (SSG); un slug desconocido responde 404.
*/

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return get_client_project_repository()
    .get_all_slugs()
    .map((slug) => ({ slug }));
}

const build_path = (slug: string) => `/proyectos/${slug}`;

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = get_client_project_repository().get_by_slug(slug);
  if (!project) return {};
  return build_page_metadata({
    title: project.seo.title,
    description: project.seo.description,
    path: build_path(slug),
    og_image_path: build_og_image_path(["proyectos", slug]),
    og_image_alt: `${project.name} — ${project.sector}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const repository = get_client_project_repository();
  const project = repository.get_by_slug(slug);
  if (!project) notFound();

  const all = repository.get_all();
  const next = all[(all.findIndex((item) => item.slug === slug) + 1) % all.length];
  const canonical = build_absolute_url(build_path(slug));
  const service_links = build_service_links(get_service_offering_repository().get_all());

  return (
    <>
      <JsonLd
        graph={build_graph([
          build_organization_node(),
          build_website_node(),
          build_web_page_node({
            canonical,
            title: project.seo.title,
            description: project.seo.description,
            og_image_url: build_absolute_url(build_og_image_path(["proyectos", slug])),
            main_entity_id: `${canonical}#project`,
            breadcrumb_id: `${canonical}#breadcrumb`,
          }),
          build_breadcrumb_node(canonical, [
            { name: "Inicio", path: "/" },
            { name: "Proyectos", path: "/proyectos" },
            { name: project.name, path: null },
          ]),
          build_creative_work_node(project, canonical),
        ])}
      />
      <Navbar current_href="/proyectos" />
      <main id={MAIN_CONTENT_ID}>
        <ProjectTemplate project={project} next={next} />
      </main>
      <Footer service_links={service_links} />
    </>
  );
}
