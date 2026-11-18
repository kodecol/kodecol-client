/**
 * Malla de 6×7 colores para las tarjetas del carrusel warp, a partir de manchas
 * de color sobre un fondo: [x, y, radio, hex] en coordenadas 0–1. Así una
 * paleta de marca se convierte en tarjetas sin escribir 42 colores a mano.
 *
 * Pura (sin React): la llaman componentes de servidor en build.
 */
export type WarpBlob = readonly [number, number, number, string];

function parse_hex(hex: string): number[] {
  const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function build_warp_mesh(background: string, blobs: readonly WarpBlob[]): string[] {
  const base = parse_hex(background);
  const out: string[] = [];
  for (let j = 0; j < 7; j++) {
    for (let i = 0; i < 6; i++) {
      const x = i / 5;
      const y = j / 6;
      let c = [...base];
      for (const [bx, by, br, hex] of blobs) {
        const d = Math.hypot(x - bx, y - by) / br;
        let w = Math.max(0, 1 - d * d);
        w = w * w * (3 - 2 * w);
        const bc = parse_hex(hex);
        c = c.map((v, k) => v + (bc[k] - v) * w);
      }
      out.push(
        `#${c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("")}`,
      );
    }
  }
  return out;
}

/** Parte una etiqueta en dos líneas por el espacio más cercano a la mitad. */
export function split_in_two_lines(label: string): string {
  const words = label.split(" ");
  if (words.length < 2) return label;
  let best = 1;
  let best_gap = Infinity;
  for (let i = 1; i < words.length; i++) {
    const gap = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
    if (gap < best_gap) {
      best_gap = gap;
      best = i;
    }
  }
  const first = words.slice(0, best).join(" ");
  return `${first.charAt(0).toUpperCase()}${first.slice(1)}\n${words.slice(best).join(" ")}`;
}
