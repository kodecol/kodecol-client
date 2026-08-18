import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { get_service_offering_repository } from "@/adapters/content";
import { ServiceTemplate } from "@/features/service/service_template";
import {
  build_faq_node,
  build_service_node,
} from "@/features/service/service_structured_data";
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

/*
  Composition root de los servicios: único punto donde app conoce el adaptador.
  Rutas 100% estáticas (SSG); un slug desconocido responde 404.
*/

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  const repository = get_service_offering_repository();
  return repository.get_all_slugs().map((slug) => ({ slug }));
}

const build_path = (slug: string) => `/servicios/${slug}`;

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = get_service_offering_repository().get_by_slug(slug);
  if (!service) return {};

  return build_page_metadata({
    title: service.seo.title,
    description: service.seo.description,
    path: build_path(slug),
    og_image_path: build_og_image_path(["servicios", slug]),
    og_image_alt: `${service.name} — Kodecol`,
    keywords: service.seo.keywords,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const repository = get_service_offering_repository();
  const service = repository.get_by_slug(slug);
  if (!service) notFound();

  const all_services = repository.get_all();
  /* Las otras cinco: nunca se enlaza a sí misma. */
  const related_services = all_services.filter((item) => item.slug !== service.slug);
  const canonical = build_absolute_url(build_path(slug));

  return (
    <>
      <JsonLd
        graph={build_graph([
          build_organization_node(),
          build_website_node(),
          build_web_page_node({
            canonical,
            title: service.seo.title,
            description: service.seo.description,
            og_image_url: build_absolute_url(build_og_image_path(["servicios", slug])),
            main_entity_id: `${canonical}#service`,
            breadcrumb_id: `${canonical}#breadcrumb`,
          }),
          build_breadcrumb_node(canonical, [
            { name: "Inicio", path: "/" },
            { name: "Servicios", path: "/servicios" },
            { name: service.name, path: null },
          ]),
          build_service_node(service, canonical),
          build_faq_node(service, canonical),
        ])}
      />
      <ServiceTemplate
        service={service}
        related_services={related_services}
        service_links={build_service_links(all_services)}
      />
    </>
  );
}
