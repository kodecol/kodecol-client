"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { has_capable_gpu } from "@/shared/lib/webgl_capability";

/*
  Black Hole Hero Section, portado a una hoja client sin dependencias.
  Cada píxel lanza un rayo y lo integra hacia atrás por el espacio curvo de
  Schwarzschild: el halo, el anillo y la sombra salen de la física, no de capas.
  Shaders del original; la plomería de WebGL se simplificó.
*/

export interface BlackHoleProps {
  /** Dónde cae el agujero en el cuadro, fracciones de ancho y alto. */
  focus: [number, number];
  /** En celular no cabe al lado del texto: va abajo y centrado, con velo arriba. */
  narrow_focus?: [number, number];
  /** Velo sobre un borde para que el texto se lea. */
  scrim?: "none" | "left" | "top";
  scrim_strength?: number;
  elevation?: number;
  fov?: number;
  steps?: number;
  resolution?: number;
  hot_color: string;
  mid_color: string;
  cool_color: string;
  star_brightness?: number;
  glow?: number;
  doppler?: number;
  roll?: number;
  spin_speed?: number;
  className?: string;
}

const VERT = `attribute vec2 aPos;varying vec2 vUv;void main(){vUv=aPos*0.5+0.5;gl_Position=vec4(aPos,0.0,1.0);}`;

const SCENE_FRAG = `precision highp float;
#define MAX_STEPS 460
#define WIND_CYCLE 46.0
varying vec2 vUv;
uniform vec2 uRes; uniform float uTime; uniform vec3 uCamPos; uniform vec3 uRight; uniform vec3 uUp; uniform vec3 uFwd;
uniform float uTanHalf; uniform vec2 uFocus; uniform float uSteps; uniform float uSkyR; uniform float uDiskIn; uniform float uDiskOut;
uniform float uThick; uniform float uDensity; uniform float uSpin; uniform float uGrain; uniform float uBright; uniform float uDoppler;
uniform vec3 uHot; uniform vec3 uMid; uniform vec3 uCool; uniform float uStars; uniform float uEncode; uniform vec2 uJitter; uniform float uSeed;
float hash13(vec3 p){p=fract(p*0.3183099+vec3(0.1,0.2,0.3));p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float vnoise(vec3 x){vec3 i=floor(x);vec3 f=fract(x);f=f*f*(3.0-2.0*f);
 float n000=hash13(i);float n100=hash13(i+vec3(1.0,0.0,0.0));float n010=hash13(i+vec3(0.0,1.0,0.0));float n110=hash13(i+vec3(1.0,1.0,0.0));
 float n001=hash13(i+vec3(0.0,0.0,1.0));float n101=hash13(i+vec3(1.0,0.0,1.0));float n011=hash13(i+vec3(0.0,1.0,1.0));float n111=hash13(i+vec3(1.0,1.0,1.0));
 return mix(mix(mix(n000,n100,f.x),mix(n010,n110,f.x),f.y),mix(mix(n001,n101,f.x),mix(n011,n111,f.x),f.y),f.z);}
float fbm(vec3 p,float lod){float a=0.5;float s=0.0;for(int i=0;i<4;i++){s+=(i==3?a*lod:a)*vnoise(p);p=p*2.03+vec3(11.3,7.1,3.7);a*=0.5;}return s;}
void gasAt(vec3 p,float rd,float dt,out float dens,out vec3 tint,out float heat){
 float rn=clamp((rd-uDiskIn)/max(0.001,uDiskOut-uDiskIn),0.0,1.0);float tk=uThick*(0.35+1.25*rn);float v=p.y/tk;float sheet=exp(-v*v);
 float lod=clamp(1.0-dt*uGrain*14.0,0.0,1.0);float phi=atan(p.z,p.x);float omega=uSpin*pow(uDiskIn/rd,1.5);float lr=log(rd)*1.1+uSpin*uTime*0.05;
 float u=uTime/WIND_CYCLE;float fA=fract(u);float fB=fract(u+0.5);float w=abs(2.0*fA-1.0);
 float cA=fbm(vec3(vec2(cos(phi+omega*fA*WIND_CYCLE),sin(phi+omega*fA*WIND_CYCLE))*(rd*uGrain),lr),lod);
 float cB=fbm(vec3(vec2(cos(phi+omega*fB*WIND_CYCLE),sin(phi+omega*fB*WIND_CYCLE))*(rd*uGrain),lr+40.0),lod);
 float clouds=mix(cA,cB,w);float fil=clouds*clouds*1.75;float inner=smoothstep(0.0,0.07,rn);float outer=1.0-smoothstep(0.45,1.0,rn);
 float prof=inner*outer*pow(uDiskIn/rd,2.0);dens=max(0.0,fil*1.5-0.30)*sheet*prof*uDensity*4.6;
 heat=pow(uDiskIn/rd,0.8)*(0.72+0.55*clouds);tint=mix(uCool,uMid,smoothstep(0.10,0.52,heat));tint=mix(tint,uHot,smoothstep(0.52,1.05,heat));}
vec3 starField(vec3 d){vec3 a=abs(d);vec2 uv;float face;
 if(a.x>=a.y&&a.x>=a.z){uv=d.yz/a.x;face=d.x>0.0?0.0:1.0;}else if(a.y>=a.z){uv=d.xz/a.y;face=d.y>0.0?2.0:3.0;}else{uv=d.xy/a.z;face=d.z>0.0?4.0:5.0;}
 vec3 col=vec3(0.0);
 for(int k=0;k<3;k++){float sc=90.0*pow(2.2,float(k));vec2 p=uv*sc;vec2 id=floor(p);vec2 f=fract(p)-0.5;float h=hash13(vec3(id,face*19.0));
  if(h>0.965){vec2 off=vec2(hash13(vec3(id,face+11.0)),hash13(vec3(id,face+23.0)));float dd=length(f-(off-0.5)*0.7);float s=smoothstep(0.055,0.0,dd);float warm=hash13(vec3(id,face+51.0));
   col+=s*(0.6+4.5*fract(h*97.0))*mix(vec3(0.72,0.82,1.0),vec3(1.0,0.88,0.72),warm)/pow(2.2,float(k));}}
 col+=vec3(0.013,0.017,0.030)*fbm(d*2.6,1.0);return col;}
void main(){
 vec2 uv=(gl_FragCoord.xy+uJitter-uFocus*uRes)/uRes.y;vec3 dir=normalize(uFwd+(uv.x*uRight+uv.y*uUp)*2.0*uTanHalf);
 vec3 pos=uCamPos;vec3 vel=dir;vec3 hv=cross(pos,vel);float h2=dot(hv,hv);float h=sqrt(h2);float swept=0.0;
 vec3 col=vec3(0.0);float transmit=1.0;bool captured=false;
 float jitter=fract(sin(dot(gl_FragCoord.xy+uSeed,vec2(12.9898,78.233)))*43758.5453);
 for(int i=0;i<MAX_STEPS;i++){
  if(float(i)>=uSteps)break;float r2=dot(pos,pos);float r=sqrt(r2);
  if(r<1.0){captured=true;break;} if(r>uSkyR&&dot(pos,vel)>0.0)break; if(transmit<0.004)break;
  float dt=clamp(0.14*(r-1.0),0.025,1.1);
  if(r<uDiskOut*1.25){float rn=clamp((r-uDiskIn)/max(0.001,uDiskOut-uDiskIn),0.0,1.0);float tk=uThick*(0.35+1.25*rn);dt=min(dt,max(tk*0.38,abs(pos.y)*0.5));}
  swept+=h*dt/r2;float deep=exp(-1.3*max(0.0,swept-4.6));
  jitter=fract(jitter+0.6180339887);vec3 mid=pos+vel*(dt*jitter);float rd=length(mid.xz);
  if(rd>uDiskIn&&rd<uDiskOut&&abs(mid.y)<uThick*5.0){float dens;float heat;vec3 tint;gasAt(mid,rd,dt,dens,tint,heat);
   if(dens>0.001){vec3 tang=normalize(cross(vec3(0.0,1.0,0.0),vec3(mid.x,0.0,mid.z)));float beta=min(0.85,sqrt(0.5/max(rd,1.5)));
    float gam=inversesqrt(max(1e-4,1.0-beta*beta));vec3 toObs=-normalize(vel);float g=1.0/(gam*(1.0-beta*dot(tang,toObs)));g*=sqrt(max(0.05,1.0-1.0/rd));
    float boost=pow(max(g,0.02),3.0*uDoppler);vec3 shift=mix(vec3(1.0),g>1.0?vec3(0.86,0.94,1.14):vec3(1.15,0.82,0.62),clamp(abs(g-1.0)*1.6,0.0,1.0)*uDoppler);
    float emit=uBright*(0.26+2.0*heat*heat);col+=tint*shift*(emit*boost*dens*transmit*dt*deep);transmit*=exp(-dens*0.30*dt);}}
  vec3 acc=-1.5*h2*pos/(r2*r2*r);vel+=acc*dt;pos+=vel*dt;}
 if(!captured&&uStars>0.001){vec3 toHole=normalize(-uCamPos);float sI=length(cross(normalize(dir),toHole));float sS=length(cross(normalize(vel),toHole));
  float stretch=clamp(sI/max(1e-3,sS),1.0,40.0);col+=starField(normalize(vel))*uStars*transmit/stretch;}
 if(uEncode>0.5)col=col/(1.0+col);gl_FragColor=vec4(col,1.0);}`;

const BLEND_FRAG = `precision highp float;varying vec2 vUv;uniform sampler2D uCur;uniform sampler2D uPrev;uniform float uAlpha;
void main(){gl_FragColor=vec4(mix(texture2D(uPrev,vUv).rgb,texture2D(uCur,vUv).rgb,uAlpha),1.0);}`;
const BRIGHT_FRAG = `precision highp float;varying vec2 vUv;uniform sampler2D uTex;uniform vec2 uTexel;uniform float uDecode;uniform float uPack;uniform float uThreshold;
void main(){vec3 s=texture2D(uTex,vUv+uTexel*vec2(-1.0,-1.0)).rgb+texture2D(uTex,vUv+uTexel*vec2(1.0,-1.0)).rgb+texture2D(uTex,vUv+uTexel*vec2(-1.0,1.0)).rgb+texture2D(uTex,vUv+uTexel*vec2(1.0,1.0)).rgb;
s*=0.25;if(uDecode>0.5)s=s/max(vec3(0.002),1.0-s);float l=max(s.r,max(s.g,s.b));s*=max(0.0,l-uThreshold)/max(0.0001,l);gl_FragColor=vec4(s*uPack,1.0);}`;
const BLUR_FRAG = `precision highp float;varying vec2 vUv;uniform sampler2D uTex;uniform vec2 uStep;
void main(){vec3 s=texture2D(uTex,vUv).rgb*0.2270270;s+=(texture2D(uTex,vUv+uStep*1.3846154).rgb+texture2D(uTex,vUv-uStep*1.3846154).rgb)*0.3162162;
s+=(texture2D(uTex,vUv+uStep*3.2307692).rgb+texture2D(uTex,vUv-uStep*3.2307692).rgb)*0.0702702;gl_FragColor=vec4(s,1.0);}`;
const COMPOSITE_FRAG = `precision highp float;varying vec2 vUv;uniform sampler2D uScene;uniform sampler2D uBloom;uniform float uDecode;uniform float uPack;
uniform float uGlow;uniform float uExposure;uniform float uVignette;uniform float uScrimDir;uniform float uScrimAmt;uniform float uSeed;
vec3 aces(vec3 x){return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0);}
void main(){vec3 scene=texture2D(uScene,vUv).rgb;if(uDecode>0.5)scene=scene/max(vec3(0.002),1.0-scene);vec3 bloom=texture2D(uBloom,vUv).rgb/uPack;
vec3 c=scene+bloom*uGlow;c=aces(c*uExposure);c=pow(max(c,0.0),vec3(0.4545));vec2 d=vUv-0.5;c*=1.0-uVignette*dot(d,d)*1.9;
if(uScrimDir>0.5){float x=uScrimDir<1.5?vUv.x:1.0-vUv.y;c*=1.0-uScrimAmt*pow(1.0-clamp(x,0.0,1.0),2.4);}
float n=fract(sin(dot(gl_FragCoord.xy+uSeed,vec2(12.9898,78.233)))*43758.5453);c+=(n-0.5)/255.0;gl_FragColor=vec4(c,1.0);}`;

const RAD = Math.PI / 180;
const HALTON: [number, number][] = [
  [0.5, 0.333], [0.25, 0.667], [0.75, 0.111], [0.125, 0.444],
  [0.625, 0.778], [0.375, 0.222], [0.875, 0.556], [0.0625, 0.889],
];

function hex_to_linear(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  const srgb = [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  return srgb.map((v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))) as [number, number, number];
}

interface Program {
  program: WebGLProgram;
  u: Record<string, WebGLUniformLocation | null>;
}
interface Target {
  fb: WebGLFramebuffer;
  tex: WebGLTexture;
  w: number;
  h: number;
}

/**
 * Agujero negro trazado en tiempo real (sección Espacio). Pide pocos pasos en
 * celular, baja la resolución interna y solo anima mientras se ve. Sin WebGL o
 * con un renderizador por software (detectado antes de compilar) queda un
 * disco de luz estático en CSS.
 */
export function BlackHole({
  focus,
  narrow_focus,
  scrim = "none",
  scrim_strength = 0.85,
  elevation = -5.5,
  fov = 42,
  steps = 260,
  resolution = 0.62,
  hot_color,
  mid_color,
  cool_color,
  star_brightness = 0.9,
  glow = 1.1,
  doppler = 0.4,
  roll = -18,
  spin_speed = 0.06,
  className,
}: BlackHoleProps) {
  const host_ref = useRef<HTMLDivElement>(null);
  const [fx, fy] = focus;
  const [nx, ny] = narrow_focus ?? focus;
  const [static_mode, set_static_mode] = useState(false);
  useEffect(() => {
    if (!has_capable_gpu()) set_static_mode(true);
  }, []);

  useEffect(() => {
    const host = host_ref.current;
    if (!host || static_mode || !has_capable_gpu()) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "absolute inset-0 size-full";
    host.appendChild(canvas);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 760px)").matches;
    const focus_x = narrow ? nx : fx;
    const focus_y = narrow ? ny : fy;
    const scrim_dir = narrow && scrim !== "none" ? "top" : scrim;
    const max_steps = narrow ? Math.min(steps, 180) : steps;
    const options: WebGLContextAttributes = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" };
    const gl = (canvas.getContext("webgl2", options) || canvas.getContext("webgl", options)) as WebGL2RenderingContext | WebGLRenderingContext | null;
    const give_up = () => canvas.remove();
    if (!gl) return give_up();

    const is_gl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const link = (frag: string): Program | null => {
      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, frag);
      const program = gl.createProgram();
      if (!vs || !fs || !program) return null;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.bindAttribLocation(program, 0, "aPos");
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
      const u: Program["u"] = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(program, i);
        if (info) u[info.name] = gl.getUniformLocation(program, info.name);
      }
      return { program, u };
    };

    let hdr = true;
    let tex_type: number = gl.UNSIGNED_BYTE;
    let internal: number = gl.RGBA;
    if (is_gl2) {
      const gl2 = gl as WebGL2RenderingContext;
      if (gl2.getExtension("EXT_color_buffer_half_float") || gl2.getExtension("EXT_color_buffer_float")) {
        tex_type = gl2.HALF_FLOAT;
        internal = gl2.RGBA16F;
      } else hdr = false;
    } else {
      const half = gl.getExtension("OES_texture_half_float");
      if (half && gl.getExtension("EXT_color_buffer_half_float")) tex_type = half.HALF_FLOAT_OES;
      else hdr = false;
    }
    if (!hdr) {
      tex_type = gl.UNSIGNED_BYTE;
      internal = gl.RGBA;
    }
    const filter = is_gl2 || !hdr || gl.getExtension("OES_texture_half_float_linear") ? gl.LINEAR : gl.NEAREST;
    const pack = hdr ? 1 : 0.12;

    const make_target = (w: number, h: number): Target | null => {
      const tex = gl.createTexture();
      const fb = gl.createFramebuffer();
      if (!tex || !fb) return null;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, gl.RGBA, tex_type, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return ok ? { fb, tex, w, h } : null;
    };

    const scene_p = link(SCENE_FRAG);
    const blend_p = link(BLEND_FRAG);
    const bright_p = link(BRIGHT_FRAG);
    const blur_p = link(BLUR_FRAG);
    const comp_p = link(COMPOSITE_FRAG);
    if (!scene_p || !blend_p || !bright_p || !blur_p || !comp_p) return give_up();

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let scene: Target | null = null;
    let hist_a: Target | null = null;
    let hist_b: Target | null = null;
    let bloom_a: Target | null = null;
    let bloom_b: Target | null = null;
    let settled = 0;
    let width = 0;
    let height = 0;

    const drop_targets = () => {
      for (const t of [scene, hist_a, hist_b, bloom_a, bloom_b]) {
        if (!t) continue;
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fb);
      }
      settled = 0;
    };
    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const scale = resolution;
      const w = Math.max(2, Math.round(rect.width * dpr));
      const h = Math.max(2, Math.round(rect.height * dpr));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      drop_targets();
      const sw = Math.max(2, Math.round(w * scale));
      const sh = Math.max(2, Math.round(h * scale));
      scene = make_target(sw, sh);
      hist_a = make_target(sw, sh);
      hist_b = make_target(sw, sh);
      bloom_a = make_target(Math.max(2, sw >> 2), Math.max(2, sh >> 2));
      bloom_b = make_target(Math.max(2, sw >> 2), Math.max(2, sh >> 2));
    };

    const pass = (p: Program, target: Target | null) => {
      gl.useProgram(p.program);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null);
      gl.viewport(0, 0, target ? target.w : width, target ? target.h : height);
    };
    const draw = () => gl.drawArrays(gl.TRIANGLES, 0, 3);
    const bind = (tex: WebGLTexture, unit: number) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
    };

    const hot = hex_to_linear(hot_color);
    const mid = hex_to_linear(mid_color);
    const cool = hex_to_linear(cool_color);
    const dist = 24;
    const el = elevation * RAD;
    const cam = [dist * Math.cos(el), dist * Math.sin(el), 0];
    const fwd = [-cam[0] / dist, -cam[1] / dist, -cam[2] / dist];
    let right = [fwd[2], 0, -fwd[0]];
    const rl = Math.hypot(right[0], right[1], right[2]) || 1;
    right = right.map((v) => v / rl);
    const up = [
      right[1] * fwd[2] - right[2] * fwd[1],
      right[2] * fwd[0] - right[0] * fwd[2],
      right[0] * fwd[1] - right[1] * fwd[0],
    ];
    const cr = Math.cos(roll * RAD);
    const sr = Math.sin(roll * RAD);
    const R = right.map((v, i) => v * cr + up[i] * sr);
    const U = right.map((v, i) => -v * sr + up[i] * cr);

    const render = (t: number) => {
      if (!scene || !hist_a || !hist_b || !bloom_a || !bloom_b) return;
      pass(scene_p, scene);
      const u = scene_p.u;
      gl.uniform2f(u.uRes, scene.w, scene.h);
      gl.uniform1f(u.uTime, t);
      gl.uniform3f(u.uCamPos, cam[0], cam[1], cam[2]);
      gl.uniform3f(u.uRight, R[0], R[1], R[2]);
      gl.uniform3f(u.uUp, U[0], U[1], U[2]);
      gl.uniform3f(u.uFwd, fwd[0], fwd[1], fwd[2]);
      gl.uniform1f(u.uTanHalf, Math.tan(fov * 0.5 * RAD));
      gl.uniform2f(u.uFocus, focus_x, 1 - focus_y);
      gl.uniform1f(u.uSteps, max_steps);
      gl.uniform1f(u.uSkyR, Math.max(dist * 1.35, 15 * 2.4));
      gl.uniform1f(u.uDiskIn, 3);
      gl.uniform1f(u.uDiskOut, 15);
      gl.uniform1f(u.uThick, 0.26);
      gl.uniform1f(u.uDensity, 1);
      gl.uniform1f(u.uSpin, spin_speed * 6.2831853);
      gl.uniform1f(u.uGrain, 0.48);
      gl.uniform1f(u.uBright, 1);
      gl.uniform1f(u.uDoppler, doppler);
      gl.uniform3f(u.uHot, hot[0], hot[1], hot[2]);
      gl.uniform3f(u.uMid, mid[0], mid[1], mid[2]);
      gl.uniform3f(u.uCool, cool[0], cool[1], cool[2]);
      gl.uniform1f(u.uStars, star_brightness);
      gl.uniform1f(u.uEncode, hdr ? 0 : 1);
      const jitter = HALTON[settled % HALTON.length];
      gl.uniform2f(u.uJitter, jitter[0] - 0.5, jitter[1] - 0.5);
      gl.uniform1f(u.uSeed, (settled % 64) * 17.13);
      draw();

      pass(blend_p, hist_b);
      bind(scene.tex, 0);
      bind(hist_a.tex, 1);
      gl.uniform1i(blend_p.u.uCur, 0);
      gl.uniform1i(blend_p.u.uPrev, 1);
      gl.uniform1f(blend_p.u.uAlpha, settled === 0 ? 1 : 0.14);
      draw();
      const shown: Target = hist_b;
      hist_b = hist_a;
      hist_a = shown;
      settled++;

      pass(bright_p, bloom_a);
      bind(shown.tex, 0);
      gl.uniform1i(bright_p.u.uTex, 0);
      gl.uniform2f(bright_p.u.uTexel, 1 / shown.w, 1 / shown.h);
      gl.uniform1f(bright_p.u.uDecode, hdr ? 0 : 1);
      gl.uniform1f(bright_p.u.uPack, pack);
      gl.uniform1f(bright_p.u.uThreshold, 0.85);
      draw();
      const blur = (src: Target, dst: Target, dx: number, dy: number) => {
        pass(blur_p, dst);
        bind(src.tex, 0);
        gl.uniform1i(blur_p.u.uTex, 0);
        gl.uniform2f(blur_p.u.uStep, dx / dst.w, dy / dst.h);
        draw();
      };
      blur(bloom_a, bloom_b, 1, 0);
      blur(bloom_b, bloom_a, 0, 1);
      blur(bloom_a, bloom_b, 2.6, 0);
      blur(bloom_b, bloom_a, 0, 2.6);

      pass(comp_p, null);
      bind(shown.tex, 0);
      bind(bloom_a.tex, 1);
      const c = comp_p.u;
      gl.uniform1i(c.uScene, 0);
      gl.uniform1i(c.uBloom, 1);
      gl.uniform1f(c.uDecode, hdr ? 0 : 1);
      gl.uniform1f(c.uPack, pack);
      gl.uniform1f(c.uGlow, glow * 0.26);
      gl.uniform1f(c.uExposure, 0.9);
      gl.uniform1f(c.uVignette, 0.28);
      gl.uniform1f(c.uScrimDir, scrim_dir === "left" ? 1 : scrim_dir === "top" ? 3 : 0);
      gl.uniform1f(c.uScrimAmt, scrim_strength);
      gl.uniform1f(c.uSeed, (t * 60) % 1000);
      draw();
    };

    let clock = reduced ? 6 : 0;
    let last = 0;
    let visible = false;
    let raf = 0;
    const tick = (now: number) => {
      raf = 0;
      if (!visible) {
        last = 0;
        return;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      clock += dt;
      render(clock);
      raf = requestAnimationFrame(tick);
    };
    const settle = (passes: number) => {
      for (let i = 0; i < passes; i++) render(clock);
    };

    const still = reduced;
    resize();
    settle(reduced ? 16 : 2);
    const resize_observer = new ResizeObserver(() => {
      resize();
      settle(reduced ? 16 : 1);
    });
    resize_observer.observe(host);
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible && !raf && !still) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "100px" },
    );
    intersection.observe(host);
    const on_lost = (event: Event) => {
      event.preventDefault();
      visible = false;
      canvas.style.display = "none";
    };
    canvas.addEventListener("webglcontextlost", on_lost);

    return () => {
      cancelAnimationFrame(raf);
      resize_observer.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("webglcontextlost", on_lost);
      drop_targets();
      canvas.remove();
    };
  }, [static_mode, fx, fy, nx, ny, scrim, scrim_strength, elevation, fov, steps, resolution, hot_color, mid_color, cool_color, star_brightness, glow, doppler, roll, spin_speed]);

  /* Versión estática: un disco de luz en los mismos colores, sin trazado de rayos. */
  const static_background = static_mode
    ? `radial-gradient(14% 22% at ${fx * 100}% ${fy * 100}%, black 55%, transparent 60%), radial-gradient(34% 9% at ${fx * 100}% ${fy * 100}%, ${hot_color}, ${mid_color} 35%, ${cool_color} 60%, transparent 75%), black`
    : undefined;

  return (
    <div
      ref={host_ref}
      aria-hidden
      className={cn("absolute inset-0 bg-black", className)}
      style={static_background ? { background: static_background } : undefined}
    />
  );
}
