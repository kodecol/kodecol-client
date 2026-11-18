"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/shared/lib/cn";
import { has_capable_gpu } from "@/shared/lib/webgl_capability";

interface SkyCloudsProps {
  className?: string;
  /** Altura (0–1, desde abajo) donde empiezan a aparecer las nubes. */
  horizon?: number;
}

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

/*
  Nubes cinematográficas: ruido fractal deformado por otro ruido (domain warping)
  para que las nubes tengan volumen, con luz de arriba y base más fría. El canvas
  es transparente: el cielo de la foto se ve detrás. Derivan muy despacio.
*/
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uTime;uniform float uHorizon;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float s=0.;float a=.5;for(int i=0;i<6;i++){s+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
void main(){
 vec2 uv=gl_FragCoord.xy/uRes;
 vec2 p=vec2(uv.x*uRes.x/uRes.y,uv.y)*vec2(1.4,2.6);
 float t=uTime*.012;
 vec2 q=vec2(fbm(p+vec2(t,0.)),fbm(p+vec2(5.2,1.3)-vec2(t*.6,0.)));
 float n=fbm(p+q*1.6+vec2(t*1.4,0.));
 float band=smoothstep(uHorizon,uHorizon+.22,uv.y)*(1.-smoothstep(.96,1.,uv.y)*.4);
 float cover=smoothstep(.48,.78,n)*band;
 float light=fbm(p*1.8+q+vec2(0.,.35)+vec2(t*1.4,0.));
 vec3 base=vec3(.71,.78,.86);
 vec3 lit=vec3(1.,.995,.98);
 vec3 col=mix(base,lit,smoothstep(.35,.75,light)+(uv.y-.5)*.25);
 float a=clamp(cover*1.15,0.,.94);
 gl_FragColor=vec4(col*a,a);
}`;

/**
 * Nubes en WebGL sobre una foto de cielo (atmósfera Cielo). Sin GPU real no
 * se pinta nada: queda el cielo de la foto. Con `prefers-reduced-motion`, un
 * cuadro quieto.
 */
export function SkyClouds({ className, horizon = 0.42 }: SkyCloudsProps) {
  const host_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = host_ref.current;
    if (!host || !has_capable_gpu()) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "absolute inset-0 size-full";
    host.appendChild(canvas);
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) {
      canvas.remove();
      return;
    }
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram();
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!program || !vs || !fs) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const u_res = gl.getUniformLocation(program, "uRes");
    const u_time = gl.getUniformLocation(program, "uTime");
    const u_horizon = gl.getUniformLocation(program, "uHorizon");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;
    let visible = true;

    const draw = (now: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(u_res, canvas.width, canvas.height);
      gl.uniform1f(u_time, reduced ? 40 : 40 + (now - start) / 1000);
      gl.uniform1f(u_horizon, horizon);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      draw(now);
      if (!reduced) raf = requestAnimationFrame(loop);
    };
    const resize = () => {
      /* Media resolución: las nubes son suaves y así el shader cuesta la cuarta parte. */
      const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.5;
      canvas.width = Math.max(2, Math.round(host.clientWidth * scale));
      canvas.height = Math.max(2, Math.round(host.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw(performance.now());
    };
    const resize_observer = new ResizeObserver(resize);
    resize_observer.observe(host);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    intersection.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      resize_observer.disconnect();
      intersection.disconnect();
      canvas.remove();
    };
  }, [horizon]);

  return <div ref={host_ref} aria-hidden className={cn("pointer-events-none absolute inset-0", className)} />;
}
