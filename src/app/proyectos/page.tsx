import type { Metadata } from "next";
import { get_client_project_repository, get_service_offering_repository } from "@/adapters/content";
import { ProjectIndexTemplate } from "@/features/project/project_index_template";
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
import { Footer } from "@/shared/ui/footer";
import { Navbar } from "@/shared/ui/navbar";
import { MAIN_CONTENT_ID } from "@/shared/ui/skip_link";

/* Página de categoría de los proyectos hechos para clientes: hub hacia cada ficha. */

const PATH = "/proyectos";
const TITLE = "Proyectos";
const DESCRIPTION =
  "Sitios y productos que Kodecol construyó para clientes reales: e-commerce de lujo, un estudio de música y un sitio 3D para un taller de rotulación.";

export const metadata: Metadata = build_page_metadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  og_image_path: build_og_image_path(["proyectos"]),
  og_image_alt: "Proyectos de Kodecol",
});

export default function ProjectsIndexPage() {
  const projects = get_client_project_repository().get_all();
  const service_links = build_service_links(get_service_offering_repository().get_all());
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
            og_image_url: build_absolute_url(build_og_image_path(["proyectos"])),
            page_type: "CollectionPage",
            main_entity_id: `${canonical}#itemlist`,
            breadcrumb_id: `${canonical}#breadcrumb`,
          }),
          build_breadcrumb_node(canonical, [
            { name: "Inicio", path: "/" },
            { name: "Proyectos", path: null },
          ]),
          build_item_list_node(
            canonical,
            projects.map((project) => ({ name: project.name, path: `/proyectos/${project.slug}` })),
          ),
        ])}
      />
      <Navbar current_href="/proyectos" />
      <main id={MAIN_CONTENT_ID}>
        <ProjectIndexTemplate projects={projects} />
      </main>
      <Footer service_links={service_links} />
    </>
  );
}
