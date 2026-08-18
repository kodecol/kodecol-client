import type { Metadata } from "next";
import {
  get_product_brand_repository,
  get_service_offering_repository,
} from "@/adapters/content";
import { ProductIndexTemplate } from "@/features/product/product_index_template";
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

/* Página de categoría de las marcas propias: hub hacia cada producto. */

const PATH = "/marcas";
/* Sin "de Kodecol": el template del layout ya añade "· Kodecol" al título. */
const TITLE = "Marcas propias";
const DESCRIPTION =
  "Los productos que Kodecol diseña, construye y opera. Software propio en producción con clientes reales, no prototipos de escaparate.";

export const metadata: Metadata = build_page_metadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  og_image_path: build_og_image_path(["marcas"]),
  og_image_alt: "Marcas propias de Kodecol",
});

export default function BrandsIndexPage() {
  const brands = get_product_brand_repository().get_all();
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
            og_image_url: build_absolute_url(build_og_image_path(["marcas"])),
            page_type: "CollectionPage",
            main_entity_id: `${canonical}#itemlist`,
            breadcrumb_id: `${canonical}#breadcrumb`,
          }),
          build_breadcrumb_node(canonical, [
            { name: "Inicio", path: "/" },
            { name: "Marcas propias", path: null },
          ]),
          build_item_list_node(
            canonical,
            brands.map((brand) => ({
              name: brand.name,
              path: `/marcas/${brand.slug}`,
            })),
          ),
        ])}
      />
      <ProductIndexTemplate brands={brands} service_links={service_links} />
    </>
  );
}
