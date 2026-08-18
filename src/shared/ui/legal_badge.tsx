import { SITE_CONFIG } from "@/shared/config/site_config";
import { LineIcon } from "@/shared/ui/line_icon";

/**
 * Sello de empresa constituida: acredita el registro mercantil y enlaza al RUES
 * para que cualquiera pueda verificarlo por su cuenta.
 *
 * La verificabilidad es lo que genera confianza, así que la tarjeta entera es el
 * enlace y los datos se muestran completos: razón social, NIT, matrícula y cámara.
 * Los valores viven en site_config.ts (única fuente, architecture.md §6).
 */
export function LegalBadge() {
  const { legal } = SITE_CONFIG;

  const registry = [
    { label: "NIT", value: legal.tax_id },
    { label: "Matrícula", value: legal.registration_number },
    { label: "Registro", value: legal.chamber },
    { label: "Categoría", value: legal.category },
  ];

  return (
    <a
      href={legal.rues_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${legal.business_name}, empresa constituida — verificar el registro en el RUES`}
      className="group block rounded-xl border border-border-subtle bg-surface-inset/50 p-6 transition-[border-color,background-color] duration-base ease-kodecol hover:border-border-accent hover:bg-surface-inset"
    >
      <div className="flex flex-wrap items-center gap-3">
        <LineIcon
          name="shield_check"
          size={18}
          className="text-mint-500"
        />
        {/* Era un <h2>: un encabezado dentro de un <a> es un antipatrón y además
            competía en el esquema de la página con los h2 de sección. El
            aria-label del enlace ya describe el bloque. */}
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
          Empresa constituida
        </p>
      </div>

      <p className="mt-4 font-sora text-lg font-bold tracking-[-0.02em] text-text-primary">
        {legal.business_name}
      </p>

      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {registry.map((item) => (
          <div key={item.label} className="flex items-baseline gap-1.5">
            <dt className="text-[11px] uppercase tracking-[0.1em] text-text-disabled">
              {item.label}
            </dt>
            <dd className="text-[13px] tabular-nums text-text-secondary">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-mint-500">
        Verificar en el RUES
        <LineIcon
          name="arrow_right"
          size={13}
          className="-rotate-45 transition-transform duration-base ease-kodecol group-hover:translate-x-0.5"
        />
      </span>
    </a>
  );
}
