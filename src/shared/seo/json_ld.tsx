import type { JsonLdGraph } from "./schema_org_types";

/*
  Escapa lo que puede romper o secuestrar el <script>:
  - `<` cierra el script si el contenido trae un "</script>" dentro de una cadena.
  - `>` y `&` se escapan por si el HTML se reprocesa en otro contexto.
  - U+2028/U+2029 son saltos de línea válidos en JSON pero ilegales en un literal JS.
  Escapar `<` ya neutraliza `</script>`, así que no hace falta tocar `/`.
*/
function escape_json_ld(json: string): string {
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

interface JsonLdProps {
  graph: JsonLdGraph;
  /** id del <script>: permite a los e2e localizarlo y delata duplicados. */
  id?: string;
}

/** Datos estructurados de la página. Server component: cero JavaScript en el cliente. */
export function JsonLd({ graph, id = "structured-data" }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escape_json_ld(JSON.stringify(graph)) }}
    />
  );
}
