import type { ServiceOffering } from "@/core/domain/service_offering";
import type { NavLink } from "@/shared/config/site_config";
import { Footer } from "@/shared/ui/footer";
import { Navbar } from "@/shared/ui/navbar";
import { MAIN_CONTENT_ID } from "@/shared/ui/skip_link";
import { Breadcrumb } from "@/shared/ui/breadcrumb";
import { RelatedServicesSection } from "./sections/related_services_section";
import { ServiceClosingSection } from "./sections/service_closing_section";
import { ServiceDeliverablesSection } from "./sections/service_deliverables_section";
import { ServiceFaqSection } from "./sections/service_faq_section";
import { ServiceHeroSection } from "./sections/service_hero_section";
import { ServiceProblemSection } from "./sections/service_problem_section";
import { ServiceProcessSection } from "./sections/service_process_section";
import { ServiceResultsSection } from "./sections/service_results_section";
import { ServiceTechnologiesSection } from "./sections/service_technologies_section";

interface ServiceTemplateProps {
  service: ServiceOffering;
  /** Las otras cinco líneas: enlazado interno entre páginas hermanas. */
  related_services: readonly ServiceOffering[];
  /** Enlaces a los 6 servicios para la columna del footer, ya resueltos por app/. */
  service_links: readonly NavLink[];
}

/** Ancla del bloque de entregables; el CTA secundario del hero apunta aquí. */
const DELIVERABLES_ANCHOR = "que-incluye";

/**
 * Plantilla polimórfica de servicio: recibe un ServiceOffering por props y sirve
 * para cualquiera de las seis líneas. Añadir un servicio = un JSON, cero código.
 *
 * A diferencia de /marcas/[slug], aquí manda Kodecol de principio a fin: navbar
 * y footer globales, sin tema de marca invitada.
 */
export function ServiceTemplate({
  service,
  related_services,
  service_links,
}: ServiceTemplateProps) {
  return (
    <>
      <Navbar />
      <main id={MAIN_CONTENT_ID}>
        <Breadcrumb
          crumbs={[
            { label: "Inicio", href: "/" },
            { label: "Servicios", href: "/servicios" },
            { label: service.name, href: null },
          ]}
        />
        <ServiceHeroSection
          hero={service.hero}
          icon={service.icon}
          deliverables_anchor={DELIVERABLES_ANCHOR}
        />
        <ServiceProblemSection problem={service.problem} />
        <ServiceDeliverablesSection
          deliverables={service.deliverables}
          anchor={DELIVERABLES_ANCHOR}
        />
        <ServiceProcessSection process={service.process} />
        <ServiceTechnologiesSection technologies={service.technologies} />
        <ServiceResultsSection results={service.results} />
        <ServiceFaqSection faq={service.faq} />
        <RelatedServicesSection services={related_services} />
        <ServiceClosingSection closing={service.closing} />
      </main>
      <Footer service_links={service_links} />
    </>
  );
}
