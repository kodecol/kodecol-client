import type { ServiceOffering } from "@/core/domain/service_offering";
import type { ServiceOfferingRepository } from "@/core/ports/service_offering_repository";
import aplicaciones_de_escritorio_raw from "@content/services/aplicaciones_de_escritorio.json";
import aplicaciones_moviles_raw from "@content/services/aplicaciones_moviles.json";
import automatizacion_de_procesos_raw from "@content/services/automatizacion_de_procesos.json";
import desarrollo_web_raw from "@content/services/desarrollo_web.json";
import inteligencia_artificial_a_la_medida_raw from "@content/services/inteligencia_artificial_a_la_medida.json";
import software_a_la_medida_raw from "@content/services/software_a_la_medida.json";
import { service_offering_schema } from "./service_offering_schema";

/*
  Adaptador local: importa los JSON estáticamente (compatible con SSG) y los valida
  al cargar el módulo. Un JSON inválido rompe `pnpm build` con el error de zod
  señalando el campo — gate de calidad de contenido, no un bug.

  Añadir un servicio = un JSON + una línea en `raw_services`.
*/

const raw_services: readonly unknown[] = [
  automatizacion_de_procesos_raw,
  inteligencia_artificial_a_la_medida_raw,
  desarrollo_web_raw,
  aplicaciones_moviles_raw,
  aplicaciones_de_escritorio_raw,
  software_a_la_medida_raw,
];

const services: readonly ServiceOffering[] = raw_services
  .map((raw) => service_offering_schema.parse(raw))
  .toSorted((a, b) => a.order - b.order);

/* Dos guardas que zod no puede ver, porque son del conjunto y no de un elemento. */
const duplicated_slug = services.find(
  (service, index) => services.findIndex((other) => other.slug === service.slug) !== index,
);
if (duplicated_slug) {
  throw new Error(
    `content/services: el slug "${duplicated_slug.slug}" está repetido. Los slugs son URLs: deben ser únicos.`,
  );
}

const featured_count = services.filter((service) => service.teaser.featured).length;
if (featured_count !== 1) {
  throw new Error(
    `content/services: hay ${featured_count} servicios con teaser.featured; el bento de la landing admite exactamente uno.`,
  );
}

const by_slug: ReadonlyMap<string, ServiceOffering> = new Map(
  services.map((service) => [service.slug, service]),
);

export class LocalServiceOfferingRepository implements ServiceOfferingRepository {
  get_all(): readonly ServiceOffering[] {
    return services;
  }

  get_all_slugs(): readonly string[] {
    return [...by_slug.keys()];
  }

  get_by_slug(slug: string): ServiceOffering | null {
    return by_slug.get(slug) ?? null;
  }
}
