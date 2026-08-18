import type { Metadata } from "next";
import { get_service_offering_repository } from "@/adapters/content";
import { ServiceIndexTemplate } from "@/features/service/service_index_template";
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

/* Página de categoría del área comercial: hub de las seis líneas de servicio. */

const PATH = "/servicios";
const TITLE = "Servicios de desarrollo de software";
const DESCRIPTION =
  "Automatización de procesos, inteligencia artificial, desarrollo web, apps móviles y de escritorio, y software a la medida. Fábrica de software en Colombia.";

export const metadata: Metadata = build_page_metadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  og_image_path: build_og_image_path(["servicios"]),
  og_image_alt: "Servicios de Kodecol",
});

export default function ServicesIndexPage() {
  const services = get_service_offering_repository().get_all();
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
            og_image_url: build_absolute_url(build_og_image_path(["servicios"])),
            page_type: "CollectionPage",
            main_entity_id: `${canonical}#itemlist`,
            breadcrumb_id: `${canonical}#breadcrumb`,
          }),
          build_breadcrumb_node(canonical, [
            { name: "Inicio", path: "/" },
            { name: "Servicios", path: null },
          ]),
          build_item_list_node(
            canonical,
            services.map((service) => ({
              name: service.name,
              path: `/servicios/${service.slug}`,
            })),
          ),
        ])}
      />
      <ServiceIndexTemplate services={services} />
    </>
  );
}
