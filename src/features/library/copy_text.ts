/**
 * Copia texto con tres intentos, en este orden:
 * 1. la API del portapapeles;
 * 2. execCommand("copy") sobre un textarea, que es lo que funciona en el
 *    navegador interno de Instagram y de Facebook;
 * 3. nada: devuelve false y quien llama deja el texto seleccionado.
 */
export async function copy_text(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* sigue con el plan B */
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:16px;";
    document.body.append(area);
    area.select();
    area.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Deja seleccionado el contenido de un nodo para copiarlo a mano. */
export function select_node(node: Node): void {
  const range = document.createRange();
  range.selectNodeContents(node);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}
