"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/shared/lib/cn";
import { has_capable_gpu, is_software_renderer } from "@/shared/lib/webgl_capability";

interface VelarisGradientProps {
  /** Fondo base y cuatro colores que mezcla el ruido. Hex de 6 dígitos. */
  background: string;
  colors: readonly [string, string, string, string];
  speed?: number;
  grain?: number;
  className?: string;
}

const VERT = `attribute vec2 position;varying vec2 vUv;
void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;

/* Shader del componente Velaris: tres capas de ruido simplex, viñeta, brillo y grano. */
const FRAG = `precision highp float;varying vec2 vUv;
uniform vec2 u_resolution;uniform float u_time;uniform float u_grain;uniform vec3 u_colors[4];uniform vec3 u_bg;
vec3 permute(vec3 x){return mod(((x*34.)+1.)*x,289.);}
float snoise(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);
vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;
vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;
m*=1.79284291400159-.85373472095314*(a0*a0+h*h);vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
return 130.*dot(m,g);}
void main(){vec2 uv=vUv;float ratio=u_resolution.x/u_resolution.y;vec2 p=uv-.5;p.x*=ratio;float t=u_time*.1;
float n1=snoise(p*.4+vec2(t*.2,-t*.3));float n2=snoise(p*.55+vec2(-t*.15,t*.25)+n1*.25);float n3=snoise(p*.75+vec2(t*.1,-t*.2)+n2*.2);
vec3 col=u_bg;float dist=length(p)*1.5;float vignette=1.-smoothstep(.3,1.2,dist);
col=mix(col,u_colors[0],smoothstep(-.2,.5,n1)*.85);col=mix(col,u_colors[1],smoothstep(-.1,.6,n2)*.7);
col=mix(col,u_colors[2],smoothstep(-.3,.4,n3)*.6);col=mix(col,u_colors[3],smoothstep(0.,.7,n1*n2)*.5);
float glow=smoothstep(.8,0.,dist)*.3;col+=u_colors[1]*glow;col=mix(col*.2,col,vignette);
float grain=fract(sin(dot(uv,vec2(12.9898,78.233)))*43758.5453+u_time);col+=(grain-.5)*u_grain*.1;
gl_FragColor=vec4(col,1.);}`;

function hex_to_rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

/**
 * Gradiente vivo (componente Velaris): ruido simplex en WebGL con grano de
 * película. Los colores llegan por props desde quien lo usa —tokens de Kodecol o
 * la paleta de una marca invitada—, así que aquí no hay decisión cromática.
 *
 * Solo dibuja mientras está en pantalla. Con `prefers-reduced-motion` pinta un
 * cuadro fijo. Sin WebGL queda el fondo CSS del contenedor.
 */
export function VelarisGradient({
  background,
  colors,
  speed = 2,
  grain = 0.35,
  className,
}: VelarisGradientProps) {
  const host_ref = useRef<HTMLDivElement>(null);
  const colors_key = colors.join(",");

  useEffect(() => {
    const host = host_ref.current;
    if (!host || !has_capable_gpu()) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "absolute inset-0 size-full";
    host.appendChild(canvas);
    const gl = canvas.getContext("webgl");
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const loc = {
      res: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      grain: gl.getUniformLocation(program, "u_grain"),
      colors: gl.getUniformLocation(program, "u_colors"),
      bg: gl.getUniformLocation(program, "u_bg"),
    };
    const flat = new Float32Array(colors_key.split(",").flatMap(hex_to_rgb));
    const bg = hex_to_rgb(background);
    /* Sin GPU (o con reducir movimiento) se pinta un solo cuadro. */
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || is_software_renderer(gl);
    let raf = 0;
    let visible = true;

    const draw = (t: number) => {
      gl.uniform2f(loc.res, canvas.width, canvas.height);
      gl.uniform1f(loc.time, (reduced ? 8000 : t) * 0.001 * speed);
      gl.uniform1f(loc.grain, grain);
      gl.uniform3f(loc.bg, bg[0], bg[1], bg[2]);
      gl.uniform3fv(loc.colors, flat);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const loop = (t: number) => {
      raf = 0;
      if (!visible) return;
      draw(t);
      if (!reduced) raf = requestAnimationFrame(loop);
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = host.clientWidth * dpr;
      canvas.height = host.clientHeight * dpr;
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
  }, [background, colors_key, speed, grain]);

  return (
    <div
      ref={host_ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ background }}
    />
  );
}
