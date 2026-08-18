/**
 * Tipos mínimos de schema.org para los datos estructurados del sitio.
 *
 * No se usa `schema-dts` a propósito: pelea con el patrón `@graph` + referencias
 * `{"@id": …}` (obliga a `WithContext<>` y a castear cada arista) y añade megas de
 * tipos para los ocho nodos que emitimos. Con estas cuatro definiciones basta.
 */

/** Valor serializable dentro de un nodo JSON-LD. */
export type JsonLdValue =
  | string
  | number
  | boolean
  | JsonLdNode
  | readonly JsonLdValue[];

/** Nodo genérico: todo lo que emitimos cumple esta forma. */
export interface JsonLdNode {
  readonly "@type"?: string | readonly string[];
  readonly "@id"?: string;
  readonly [key: string]: JsonLdValue | undefined;
}

/**
 * Grafo de una página. Un solo `@graph` por página y un solo `<script>`:
 * Google resuelve las referencias `@id` únicamente dentro del mismo bloque.
 */
export interface JsonLdGraph {
  readonly "@context": "https://schema.org";
  readonly "@graph": readonly JsonLdNode[];
}

/** Referencia a otro nodo del grafo, para no escribir el objeto a mano en cada arista. */
export function ref(id: string): JsonLdNode {
  return { "@id": id };
}

/** Envuelve los nodos de una página en su grafo. Lo llama cada `page.tsx`. */
export function build_graph(nodes: readonly JsonLdNode[]): JsonLdGraph {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * Descarta claves vacías antes de serializar.
 *
 * Imprescindible: `photo_src`, `linkedin_url` y `github_url` son `string | null`
 * en el dominio, así que sin poda saldrían cosas como `"sameAs": [null, null]`,
 * que los validadores marcan como error.
 */
export function prune_node(node: JsonLdNode): JsonLdNode {
  return Object.fromEntries(
    Object.entries(node).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0),
    ),
  ) as JsonLdNode;
}
