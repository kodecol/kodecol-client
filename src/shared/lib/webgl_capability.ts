/**
 * Capacidad gráfica del equipo. Con WebGL por software (SwiftShader, llvmpipe…),
 * compilar y pintar un shader pesado bloquea el hilo principal varios segundos:
 * la página deja de responder. Los componentes WebGL lo consultan ANTES de
 * compilar y, si hace falta, muestran su versión estática.
 */

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|microsoft basic/i;

export function is_software_renderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  const debug = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) || "") : "";
  return SOFTWARE.test(renderer);
}

let cached: boolean | null = null;

/** ¿Hay GPU real para animar shaders? Se mide una vez con un contexto de 1×1 que se libera. */
export function has_capable_gpu(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    cached = gl ? !is_software_renderer(gl) : false;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}
