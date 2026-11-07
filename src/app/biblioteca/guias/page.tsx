import type { Metadata } from "next";
import { get_library_guide_repository } from "@/adapters/content";
import { GuidesIndexTemplate } from "@/features/library/guides_index_template";
import { GUIDES_PATH } from "@/features/library/library_paths";
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

const TITLE = "Guías para crear con IA";
const DESCRIPTION =
  "Los prompts reales detrás de los videos de Kodecol, con el paso a paso y de dónde salió cada voz y cada sonido. Cópialos y hazlos con tu negocio.";

export const metadata: Metadata = build_page_metadata({
  title: TITLE,
  description: DESCRIPTION,
  path: GUIDES_PATH,
  og_image_path: build_og_image_path(["biblioteca", "guias"]),
  og_image_alt: "Guías para crear con IA · Biblioteca de Kodecol",
});

export default function GuidesPage() {
  const guides = get_library_guide_repository().get_all();
  const canonical = build_absolute_url(GUIDES_PATH);
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
            og_image_url: build_absolute_url(build_og_image_path(["biblioteca", "guias"])),
            breadcrumb_id: `${canonical}#breadcrumb`,
          }),
          build_breadcrumb_node(canonical, [
            { name: "Inicio", path: "/" },
            { name: "Biblioteca", path: "/biblioteca" },
            { name: "Guías", path: null },
          ]),
        ])}
      />
      <GuidesIndexTemplate guides={guides} />
    </>
  );
}
