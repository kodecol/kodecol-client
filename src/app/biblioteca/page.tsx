import type { Metadata } from "next";
import { get_library_guide_repository } from "@/adapters/content";
import { LibraryIndexTemplate } from "@/features/library/library_index_template";
import { LIBRARY_PATH } from "@/features/library/library_paths";
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

const TITLE = "Biblioteca: guías y prompts para construir con IA";
const DESCRIPTION =
  "Guías, prompts y recursos para construir con IA. Lo que usamos de verdad en Kodecol, listo para que lo hagas con tu negocio. Gratis y sin registro.";

export const metadata: Metadata = build_page_metadata({
  title: TITLE,
  description: DESCRIPTION,
  path: LIBRARY_PATH,
  og_image_path: build_og_image_path(["biblioteca"]),
  og_image_alt: "Biblioteca de Kodecol",
});

export default function LibraryPage() {
  const guides = get_library_guide_repository().get_all();
  const canonical = build_absolute_url(LIBRARY_PATH);
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
            og_image_url: build_absolute_url(build_og_image_path(["biblioteca"])),
            breadcrumb_id: `${canonical}#breadcrumb`,
          }),
          build_breadcrumb_node(canonical, [
            { name: "Inicio", path: "/" },
            { name: "Biblioteca", path: null },
          ]),
        ])}
      />
      <LibraryIndexTemplate guides={guides} />
    </>
  );
}
