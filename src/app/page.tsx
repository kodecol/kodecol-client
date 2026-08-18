import type { Metadata } from "next";
import {
  get_developer_profile_repository,
  get_product_brand_repository,
  get_service_offering_repository,
} from "@/adapters/content";
import { FinalCtaSection } from "@/features/landing/final_cta/final_cta_section";
import { HeroSection } from "@/features/landing/hero/hero_section";
import { OwnBrandsSection } from "@/features/landing/own_brands/own_brands_section";
import { ServicesSection } from "@/features/landing/services/services_section";
import { TeamSection } from "@/features/landing/team/team_section";
import { WhyKodecolSection } from "@/features/landing/why_kodecol/why_kodecol_section";
import { build_service_links } from "@/shared/config/service_links";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { build_page_metadata } from "@/shared/seo/build_page_metadata";
import { JsonLd } from "@/shared/seo/json_ld";
import { build_graph, prune_node, ref } from "@/shared/seo/schema_org_types";
import {
  build_entity_stub_node,
  build_organization_node,
  build_web_page_node,
  build_website_node,
} from "@/shared/seo/site_nodes";
import { build_absolute_url } from "@/shared/seo/urls";
import { Footer } from "@/shared/ui/footer";
import { Navbar } from "@/shared/ui/navbar";
import { MAIN_CONTENT_ID } from "@/shared/ui/skip_link";

/**
 * Landing de Kodecol: composición de los slices.
 * Único punto donde app conoce el adaptador; los slices reciben dominio por props.
 */

/*
  La OG image se apunta explícitamente al PNG de src/app/opengraph-image.png.
  Hay que hacerlo: definir `openGraph` en una página REEMPLAZA el objeto entero,
  incluida la imagen que la convención de archivo añadiría. Sin esta línea el
  home se quedaba literalmente sin og:image (comprobado en el HTML generado).
*/
export const metadata: Metadata = build_page_metadata({
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  path: "/",
  og_image_path: "/opengraph-image.png",
  og_image_alt: SITE_CONFIG.title,
});

export default function LandingPage() {
  const brands = get_product_brand_repository().get_all();
  const services = get_service_offering_repository().get_all();
  const profiles = get_developer_profile_repository().get_all();

  const canonical = build_absolute_url("/");
  const organization = build_organization_node();

  return (
    <>
      <JsonLd
        graph={build_graph([
          /*
            El home es la página de la empresa, así que su Organization enlaza el
            grafo completo del sitio: quién trabaja aquí, qué productos operamos y
            qué servicios ofrecemos. Es lo que permite a un buscador entender la
            entidad "Kodecol" en vez de leer cuatro páginas sueltas.
          */
          prune_node({
            ...organization,
            employee: profiles.map((profile) =>
              ref(`${build_absolute_url(`/equipo/${profile.slug}`)}#person`),
            ),
            owns: brands.map((brand) =>
              ref(`${build_absolute_url(`/marcas/${brand.slug}`)}#software`),
            ),
            makesOffer: services.map((service) => ({
              "@type": "Offer",
              itemOffered: ref(
                `${build_absolute_url(`/servicios/${service.slug}`)}#service`,
              ),
            })),
          }),
          build_website_node(),
          build_web_page_node({
            canonical,
            title: SITE_CONFIG.title,
            description: SITE_CONFIG.description,
            og_image_url: build_absolute_url("/opengraph-image.png"),
          }),
          /* Resúmenes de las entidades referenciadas arriba: sin ellos, las
             referencias @id apuntarían fuera del grafo y se descartarían. */
          ...profiles.map((profile) =>
            build_entity_stub_node({
              id: `${build_absolute_url(`/equipo/${profile.slug}`)}#person`,
              type: "Person",
              name: profile.full_name,
              path: `/equipo/${profile.slug}`,
              description: profile.role_badge,
            }),
          ),
          ...brands.map((brand) =>
            build_entity_stub_node({
              id: `${build_absolute_url(`/marcas/${brand.slug}`)}#software`,
              type: "SoftwareApplication",
              name: brand.name,
              path: `/marcas/${brand.slug}`,
              description: brand.teaser.kind,
            }),
          ),
          ...services.map((service) =>
            build_entity_stub_node({
              id: `${build_absolute_url(`/servicios/${service.slug}`)}#service`,
              type: "Service",
              name: service.name,
              path: `/servicios/${service.slug}`,
              description: service.teaser.description,
            }),
          ),
        ])}
      />
      <Navbar current_href="/#inicio" />
      <main id={MAIN_CONTENT_ID}>
        <HeroSection />
        <ServicesSection services={services} />
        <WhyKodecolSection />
        <OwnBrandsSection brands={brands} />
        <TeamSection />
        <FinalCtaSection />
      </main>
      <Footer service_links={build_service_links(services)} />
    </>
  );
}
