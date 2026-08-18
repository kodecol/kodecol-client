import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { get_product_brand_repository } from "@/adapters/content";
import { ProductTemplate } from "@/features/product/product_template";
import { build_software_application_node } from "@/features/product/product_structured_data";
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
  Composition root de las marcas propias: único punto donde app conoce el adaptador.
  Rutas 100% estáticas (SSG); un slug desconocido responde 404.
  Aquí se ensambla también el @graph: los nodos del sitio los da shared/seo y el
  del producto features/product.
*/

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  const repository = get_product_brand_repository();
  return repository.get_all_slugs().map((slug) => ({ slug }));
}

const build_path = (slug: string) => `/marcas/${slug}`;

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = get_product_brand_repository().get_by_slug(slug);
  if (!brand) return {};

  return build_page_metadata({
    title: brand.seo.title,
    description: brand.seo.description,
    path: build_path(slug),
    og_image_path: build_og_image_path(["marcas", slug]),
    og_image_alt: `${brand.name} — ${brand.teaser.kind}`,
    keywords: brand.seo.keywords,
  });
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = get_product_brand_repository().get_by_slug(slug);
  if (!brand) notFound();

  const canonical = build_absolute_url(build_path(slug));

  return (
    <>
      <JsonLd
        graph={build_graph([
          build_organization_node(),
          build_website_node(),
          build_web_page_node({
            canonical,
            title: brand.seo.title,
            description: brand.seo.description,
            og_image_url: build_absolute_url(build_og_image_path(["marcas", slug])),
            main_entity_id: `${canonical}#software`,
            breadcrumb_id: `${canonical}#breadcrumb`,
          }),
          build_breadcrumb_node(canonical, [
            { name: "Inicio", path: "/" },
            { name: "Marcas propias", path: "/marcas" },
            { name: brand.name, path: null },
          ]),
          build_software_application_node(brand, canonical),
        ])}
      />
      <ProductTemplate brand={brand} />
    </>
  );
}
