import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { get_library_guide_repository } from "@/adapters/content";
import { GuideTemplate } from "@/features/library/guide_template";
import { build_guide_path, get_guide_media } from "@/features/library/library_paths";
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
  Composition root de las guías. Rutas 100% estáticas; un slug desconocido es 404.
  /biblioteca/guias/<slug> es el enlace que se manda por mensaje directo: no se
  cambia nunca.
*/

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return get_library_guide_repository()
    .get_all_slugs()
    .map((slug) => ({ slug }));
}

const og_path = (slug: string) => build_og_image_path(["biblioteca", "guias", slug]);

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = get_library_guide_repository().get_by_slug(slug);
  if (!guide) return {};
  return build_page_metadata({
    title: guide.seo.title,
    description: guide.seo.description,
    path: build_guide_path(slug),
    og_type: "article",
    og_image_path: og_path(slug),
    og_image_alt: `${guide.title} · Biblioteca de Kodecol`,
  });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const repository = get_library_guide_repository();
  const guide = repository.get_by_slug(slug);
  if (!guide) notFound();

  const related = guide.related
    .map((item) => repository.get_by_slug(item))
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const canonical = build_absolute_url(build_guide_path(slug));
  const media = get_guide_media(slug);

  return (
    <>
      <JsonLd
        graph={build_graph([
          build_organization_node(),
          build_website_node(),
          build_web_page_node({
            canonical,
            title: guide.seo.title,
            description: guide.seo.description,
            og_image_url: build_absolute_url(og_path(slug)),
            breadcrumb_id: `${canonical}#breadcrumb`,
          }),
          build_breadcrumb_node(canonical, [
            { name: "Inicio", path: "/" },
            { name: "Biblioteca", path: "/biblioteca" },
            { name: "Guías", path: "/biblioteca/guias" },
            { name: guide.title.split(":")[0], path: null },
          ]),
          {
            "@type": "HowTo",
            "@id": `${canonical}#howto`,
            name: guide.title,
            description: guide.summary,
            inLanguage: "es-CO",
            datePublished: guide.published_at,
            image: build_absolute_url(media.cover_9x16.jpg),
            step: guide.steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.title,
              text: step.text,
            })),
          },
        ])}
      />
      <GuideTemplate guide={guide} related={related} canonical_url={canonical} />
    </>
  );
}
