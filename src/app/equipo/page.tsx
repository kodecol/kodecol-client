import type { Metadata } from "next";
import {
  get_developer_profile_repository,
  get_service_offering_repository,
} from "@/adapters/content";
import { PortfolioIndexTemplate } from "@/features/portfolio/portfolio_index_template";
import { build_service_links } from "@/shared/config/service_links";
import { build_page_metadata } from "@/shared/seo/build_page_metadata";
import { JsonLd } from "@/shared/seo/json_ld";
import { build_graph } from "@/shared/seo/schema_org_types";
import {
  build_breadcrumb_node,
  build_item_list_node,
  build_organization_node,
  build_web_page_node,
  build_website_node,
} from "@/shared/seo/site_nodes";
import { build_absolute_url, build_og_image_path } from "@/shared/seo/urls";

/* Página de categoría del equipo: hub hacia los portafolios individuales. */

const PATH = "/equipo";
const TITLE = "Equipo de desarrollo";
const DESCRIPTION =
  "La crew de Kodecol: desarrolladores full stack, front-end y líderes técnicos. Cada uno con su portafolio, su experiencia y los proyectos que ha construido.";

export const metadata: Metadata = build_page_metadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  og_image_path: build_og_image_path(["equipo"]),
  og_image_alt: "Equipo de Kodecol",
});

export default function TeamIndexPage() {
  const profiles = get_developer_profile_repository().get_all();
  const service_links = build_service_links(
    get_service_offering_repository().get_all(),
  );
  const canonical = build_absolute_url(PATH);

  return (
    <>
      <JsonLd
        graph={build_graph([
          build_organization_node(),
          build_website_node(),
          build_web_page_node({
            canonical,
            title: TITLE,
            description: DESCRIPTION,
            og_image_url: build_absolute_url(build_og_image_path(["equipo"])),
            page_type: "CollectionPage",
            main_entity_id: `${canonical}#itemlist`,
            breadcrumb_id: `${canonical}#breadcrumb`,
          }),
          build_breadcrumb_node(canonical, [
            { name: "Inicio", path: "/" },
            { name: "Equipo", path: null },
          ]),
          build_item_list_node(
            canonical,
            profiles.map((profile) => ({
              name: profile.full_name,
              path: `/equipo/${profile.slug}`,
            })),
          ),
        ])}
      />
      <PortfolioIndexTemplate profiles={profiles} service_links={service_links} />
    </>
  );
}
