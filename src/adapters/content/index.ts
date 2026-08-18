import type { DeveloperProfileRepository } from "@/core/ports/developer_profile_repository";
import type { ProductBrandRepository } from "@/core/ports/product_brand_repository";
import type { ServiceOfferingRepository } from "@/core/ports/service_offering_repository";
import { LocalDeveloperProfileRepository } from "./local_developer_profile_repository";
import { LocalProductBrandRepository } from "./local_product_brand_repository";
import { LocalServiceOfferingRepository } from "./local_service_offering_repository";

/**
 * Factorías de repositorio: único punto de wiring del hexágono.
 * Para migrar a un CMS basta con devolver otra implementación del mismo puerto.
 */
export function get_developer_profile_repository(): DeveloperProfileRepository {
  return new LocalDeveloperProfileRepository();
}

export function get_product_brand_repository(): ProductBrandRepository {
  return new LocalProductBrandRepository();
}

export function get_service_offering_repository(): ServiceOfferingRepository {
  return new LocalServiceOfferingRepository();
}
