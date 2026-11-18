"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { has_capable_gpu } from "@/shared/lib/webgl_capability";

/*
  Warp Carousel (Louis Studios), portado a una hoja client sin dependencias.
  La geometría del anillo, la curva de giro y el shader son los del original;
  el control de estado se simplificó (autoplay, arrastre y flechas).
*/

export type WarpCardDetail = "ring" | "wave" | "line";

export interface WarpCard {
  /** Dos líneas separadas por "\n". */
  title: string;
  value: string;
  footer?: string;
  detail?: WarpCardDetail;
  /** 42 colores (malla 6×7) o menos, repartidos sobre la malla. */
  mesh: readonly string[];
  numeral: readonly [string, string];
  accent: string;
  glow: string;
}

interface WarpCarouselProps {
  cards: readonly WarpCard[];
  /** Color del escenario detrás del anillo: debe coincidir con el fondo de la sección. */
  background: string;
  font?: string;
  interval?: number;
  step?: number;
  aria_label: string;
  className?: string;
}

type Pose = [number, number, number];
type Rgb = [number, number, number];

const CW = 256;
const CH = 320;
const FOCAL = 734.103;
const G = {
  qA: 0.46401, XLA: 165.774, zA: 35.354, psiA: 1.44638, a1: 1.31454, a2: 1.10948,
  qB: 0.74999, XB: 204.525, ZB: 355.405, bB: 0.69311, bE: 0.04614, vC: 203.134,
  aC: 229.26, kB: 0.01087, bP: 0.99129, qPR: 1.01828, bPL: 1.0092, qPL: 1.07139,
};

function pose_at(q0: number): Pose {
  let q = q0;
  if (Math.abs(q) < 1) q -= G.kB * Math.sin(Math.PI * q) ** 2;
  const s = q < 0 ? -1 : 1;
  const a = Math.abs(q);
  const half = CW / 2;
  if (a <= G.qA) {
    const t = a / G.qA;
    const xl = -half + (G.XLA + half) * Math.pow(t, G.a1);
    const zl = G.zA * t ** 4;
    const psi = G.psiA * Math.pow(t, G.a2);
    return [s * (xl + half * Math.cos(psi)), zl + half * Math.sin(psi), s * psi];
  }
  const dXL = ((G.XLA + half) * G.a1) / G.qA;
  const dZL = (G.zA * 4) / G.qA;
  const dps = (G.psiA * G.a2) / G.qA;
  let Hx: number;
  let Hz: number;
  if (a <= G.qB) {
    const L = G.qB - G.qA;
    const t = (a - G.qA) / L;
    const hx = G.XLA + CW * Math.cos(G.psiA);
    const hz = G.zA + CW * Math.sin(G.psiA);
    const dhx = dXL - CW * Math.sin(G.psiA) * dps;
    const dhz = dZL + CW * Math.cos(G.psiA) * dps;
    const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
    const h10 = t ** 3 - 2 * t ** 2 + t;
    const h01 = -2 * t ** 3 + 3 * t ** 2;
    const h11 = t ** 3 - t ** 2;
    Hx = h00 * hx + h10 * L * dhx * G.bB + h01 * G.XB + h11 * L * G.vC * G.bE;
    Hz = h00 * hz + h10 * L * dhz * G.bB + h01 * G.ZB;
  } else {
    const d = a - G.qB;
    Hx = G.XB + G.vC * d + G.aC * d * d;
    Hz = G.ZB;
  }
  const qP = s < 0 ? G.qPL : G.qPR;
  const bP = s < 0 ? G.bPL : G.bP;
  const LP = qP - G.qA;
  const tp = Math.min(1, (a - G.qA) / LP);
  const psi =
    (2 * tp ** 3 - 3 * tp ** 2 + 1) * G.psiA +
    (tp ** 3 - 2 * tp ** 2 + tp) * LP * dps * bP +
    (-2 * tp ** 3 + 3 * tp ** 2) * Math.PI;
  return [s * (Hx - half * Math.cos(psi)), Hz - half * Math.sin(psi), s * psi];
}

const TK = [0, 3, 6, 8, 10, 11, 12, 13, 14, 16, 18, 21, 25, 30, 36, 45, 55, 70, 88, 110];
const TB = [0, 0.02175, 0.12069, 0.22549, 0.35493, 0.43254, 0.51436, 0.5952, 0.6751, 0.83199, 0.9709, 1.12669, 1.27958, 1.40975, 1.53561, 1.68385, 1.79183, 1.89191, 1.95233, 2];
const DRIFT = 0.06511;
const REST_PHASE = 81.828;
const STEP_FRAMES = 110;

const SLOPES = (() => {
  const n = TK.length;
  const h = TK.slice(1).map((x, i) => x - TK[i]);
  const dl = h.map((hi, i) => (TB[i + 1] - TB[i]) / hi);
  const d = new Array<number>(n).fill(0);
  for (let k = 1; k < n - 1; k++) {
    if (dl[k - 1] * dl[k] <= 0) d[k] = 0;
    else {
      const w1 = 2 * h[k] + h[k - 1];
      const w2 = h[k] + 2 * h[k - 1];
      d[k] = (w1 + w2) / (w1 / dl[k - 1] + w2 / dl[k]);
    }
  }
  const v = (dl[0] + dl[n - 2]) / 2;
  d[0] = v;
  d[n - 1] = v;
  return d;
})();

function spin(frames: number): number {
  if (frames <= 0) return 0;
  if (frames >= STEP_FRAMES) return 1;
  let i = 0;
  while (i < TK.length - 2 && frames > TK[i + 1]) i++;
  const h = TK[i + 1] - TK[i];
  const t = (frames - TK[i]) / h;
  const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
  const h10 = t ** 3 - 2 * t ** 2 + t;
  const h01 = -2 * t ** 3 + 3 * t ** 2;
  const h11 = t ** 3 - t ** 2;
  return (h00 * TB[i] + h10 * h * SLOPES[i] + h01 * TB[i + 1] + h11 * h * SLOPES[i + 1]) / 2;
}

function spin_n(frames: number, n: number): number {
  if (n <= STEP_FRAMES + 0.5) return spin((frames * STEP_FRAMES) / Math.max(1, n));
  const knee = 80;
  if (frames <= knee) return spin(frames);
  return spin(knee + ((frames - knee) * (STEP_FRAMES - knee)) / (n - knee));
}

function parse_color(c: string): Rgb {
  const m = /^#([0-9a-f]{3,8})$/i.exec((c || "").trim());
  if (!m) return [0, 0, 0];
  let h = m[1];
  if (h.length <= 4) h = h.split("").map((x) => x + x).join("");
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const rgba = (c: Rgb, a: number) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

function bspline(t: number, out: number[]) {
  const it = 1 - t;
  out[0] = (it * it * it) / 6;
  out[1] = (3 * t * t * t - 6 * t * t + 4) / 6;
  out[2] = (-3 * t * t * t + 3 * t * t + 3 * t + 1) / 6;
  out[3] = (t * t * t) / 6;
}

function mesh_grid(mesh: readonly string[]): Rgb[] {
  const cols = mesh.map(parse_color);
  const out: Rgb[] = [];
  for (let j = 0; j < 7; j++)
    for (let i = 0; i < 6; i++) {
      if (cols.length === 42) out.push(cols[j * 6 + i]);
      else out.push(cols[Math.min(cols.length - 1, Math.round(((j * 6 + i) / 41) * (cols.length - 1)))]);
    }
  return out;
}

function paint_mesh(ctx: CanvasRenderingContext2D, w: number, h: number, mesh: readonly string[]) {
  const grid = mesh_grid(mesh);
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const wx = new Float32Array(w * 4);
  const ix = new Int32Array(w * 4);
  const tmp = [0, 0, 0, 0];
  for (let x = 0; x < w; x++) {
    const u = ((x + 0.5) / w) * 5;
    const i = Math.floor(u);
    bspline(u - i, tmp);
    for (let k = 0; k < 4; k++) {
      wx[x * 4 + k] = tmp[k];
      ix[x * 4 + k] = Math.min(5, Math.max(0, i - 1 + k));
    }
  }
  const row = new Float32Array(18);
  let seed = 1234567;
  for (let y = 0; y < h; y++) {
    const v = ((y + 0.5) / h) * 6;
    const j = Math.floor(v);
    bspline(v - j, tmp);
    row.fill(0);
    for (let k = 0; k < 4; k++) {
      const jj = Math.min(6, Math.max(0, j - 1 + k));
      for (let i = 0; i < 6; i++) {
        const c = grid[jj * 6 + i];
        row[i * 3] += c[0] * tmp[k];
        row[i * 3 + 1] += c[1] * tmp[k];
        row[i * 3 + 2] += c[2] * tmp[k];
      }
    }
    for (let x = 0; x < w; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let k = 0; k < 4; k++) {
        const wgt = wx[x * 4 + k];
        const i3 = ix[x * 4 + k] * 3;
        r += row[i3] * wgt;
        g += row[i3 + 1] * wgt;
        b += row[i3 + 2] * wgt;
      }
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const n = (seed / 0x7fffffff - 0.5) * 1.6;
      const o = (y * w + x) * 4;
      d[o] = r + n;
      d[o + 1] = g + n;
      d[o + 2] = b + n;
      d[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

const font_str = (weight: number, px: number, family: string) => `${weight} ${px}px ${family}`;

function size_for_cap(ctx: CanvasRenderingContext2D, weight: number, family: string, cap: number, sample = "0") {
  ctx.font = font_str(weight, 100, family);
  const ascent = ctx.measureText(sample).actualBoundingBoxAscent || 71;
  return (cap / ascent) * 100;
}

function paint_card(canvas: HTMLCanvasElement, card: WarpCard, family: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const k = canvas.width / CW;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paint_mesh(ctx, canvas.width, canvas.height, card.mesh);
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.textBaseline = "alphabetic";
  const white: Rgb = [255, 255, 255];
  const accent = parse_color(card.accent);

  const small = size_for_cap(ctx, 400, family, 7.9, "H");
  ctx.font = font_str(400, small, family);
  ctx.fillStyle = rgba(white, 0.92);
  card.title.split("\n").slice(0, 2).forEach((line, i) => ctx.fillText(line, 17, 37 + i * 14));
  if (card.footer) {
    ctx.fillStyle = rgba(white, 0.85);
    ctx.fillText(card.footer, 17, 295);
  }

  let big = size_for_cap(ctx, 300, family, 50);
  ctx.font = font_str(300, big, family);
  let value_width = ctx.measureText(card.value).width;
  if (value_width > 200) {
    big *= 200 / value_width;
    ctx.font = font_str(300, big, family);
    value_width = ctx.measureText(card.value).width;
  }
  const detail = card.detail ?? "line";
  const x0 = (detail === "wave" ? 112 : 127) - value_width / 2;
  const n0 = parse_color(card.numeral[0]);
  const n1 = parse_color(card.numeral[1]);
  const grad = ctx.createLinearGradient(x0, 0, x0 + value_width, 0);
  grad.addColorStop(0, rgba(n0, 1));
  grad.addColorStop(1, rgba(n1, 1));

  if (detail === "ring") {
    for (let i = 0; i < 132; i++) {
      const a = (i / 132) * Math.PI * 2 - Math.PI / 2;
      const seed_len = 0.5 + 0.5 * Math.sin(i * 12.9898) * Math.sin(i * 4.1414 + 1.3);
      const top = 0.5 + 0.5 * Math.cos(a + Math.PI / 2);
      const len = 4 + 4.5 * Math.abs(seed_len) + 2 * top;
      ctx.strokeStyle = rgba(accent, 0.22 + 0.5 * top * top);
      ctx.lineWidth = 1 + 0.7 * top;
      ctx.beginPath();
      ctx.moveTo(126 + Math.cos(a) * 68, 156 + Math.sin(a) * 68);
      ctx.lineTo(126 + Math.cos(a) * (68 + len), 156 + Math.sin(a) * (68 + len));
      ctx.stroke();
    }
  } else if (detail === "wave") {
    for (let i = 0; i < 56; i++) {
      const x = 43 + i * 3;
      const r1 = Math.abs(Math.sin(i * 1.7 + 0.4) * Math.cos(i * 0.53));
      const hh = 1.5 + 6.5 * r1;
      const mark = i === 23;
      ctx.fillStyle = mark ? rgba(accent, 0.95) : rgba(white, 0.3);
      ctx.fillRect(x, 204 - (mark ? 8 : hh), mark ? 1.4 : 0.9, mark ? 16 : hh * 2);
    }
  } else {
    ctx.fillStyle = rgba(white, 0.22);
    ctx.fillRect(24, 205, 208, 0.8);
    ctx.fillStyle = rgba(accent, 0.9);
    ctx.fillRect(24, 204.4, 150, 2);
  }

  ctx.save();
  ctx.shadowColor = rgba(n1, 0.35);
  ctx.shadowBlur = 10 * k;
  ctx.font = font_str(300, big, family);
  ctx.fillStyle = grad;
  ctx.fillText(card.value, x0, 186);
  ctx.restore();
}

function glow_shape(pose: Pose): [number, number, number] {
  const [px, pz, ps] = pose;
  const c = Math.cos(ps);
  const sn = Math.sin(ps);
  if (c <= 0.02) return [0, 1, 0];
  const A = px;
  const B = FOCAL + pz;
  const t_near = B - 0.5 * CW * Math.abs(sn);
  let m = 0;
  let mx = 0;
  let mxx = 0;
  for (let u = -360; u <= 360; u += 3) {
    const h = Math.exp(-((Math.abs(u - 9) / 138) ** 4));
    if (h < 0.003) continue;
    const k = u / 1.8 / FOCAL;
    const den = sn * k - c;
    if (Math.abs(den) < 1e-4) continue;
    const s = (A - B * k) / den;
    const t = B + s * sn;
    if (t < 4) continue;
    if ((u / 1.8 / FOCAL) * t * sn - t * c >= 0) continue;
    const dsdk = (B * c - A * sn) / (den * den);
    const soft = Math.min(Math.abs(dsdk / FOCAL) * 2.2, 40) + 0.5;
    const cov = Math.max(0, Math.min(1, (CW * 0.5 - Math.abs(s)) / soft + 0.5));
    if (cov <= 0) continue;
    const near = Math.min(1, FOCAL / t);
    const rel = Math.exp(-((Math.max(t - t_near, 0) / 36) ** 1.5));
    const w = cov * near * near * rel * c * h;
    m += w;
    mx += w * u;
    mxx += w * u * u;
  }
  if (m < 0.5) return [0, 1, 0];
  const mu = mx / m;
  const sd = Math.sqrt(Math.max(1, mxx / m - mu * mu));
  const r = Math.max(6, sd / 0.581);
  return [mu, r, (m * 3) / (1.813 * r)];
}

const VERT = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
precision highp sampler2DArray;
uniform sampler2DArray uTex; uniform vec2 uRes; uniform float uUnit; uniform vec4 uPose[4];
uniform vec3 uGlowCol[4]; uniform vec3 uGlowShape[4]; uniform vec3 uBg; uniform float uWarp;
out vec4 outColor;
const float F = ${FOCAL.toFixed(2)}; const float CW = 256.0; const float CH = 320.0; const float CR = 10.0;
float lensH(float a){ if (a <= 232.0) return a;
  float k[9] = float[9](232.0, 238.0, 245.0, 253.0, 262.0, 275.0, 295.0, 325.0, 360.0);
  float d[9] = float[9](1.1759, 1.0671, 1.0156, 1.0965, 0.6487, 0.2700, -0.1991, -0.4782, -0.0318);
  float s = 232.0;
  for (int i = 0; i < 8; i++){ if (a <= k[i]) break; float x = min(a, k[i+1]); float t = (x - k[i]) / (k[i+1] - k[i]); s += (x - k[i]) * mix(1.0, mix(d[i], d[i+1], t * 0.5), uWarp); }
  if (a > 360.0) s += (a - 360.0) * mix(1.0, d[8], uWarp); return s; }
float lensS(float a){ float t = clamp((a - 262.0) / 93.0, 0.0, 2.0); return 1.0 + uWarp * (0.42 * pow(t, 1.5) + 0.045 * smoothstep(320.0, 360.0, a)); }
float sdRound(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r; }
vec4 shadeCard(vec4 pose, vec2 ps, float fx, float fy, out float depth){
  depth = 1e9; if (pose.w < 0.0) return vec4(0.0);
  float k = ps.x / F; float c = cos(pose.z), sn = sin(pose.z); float den = sn * k - c;
  if (abs(den) < 1e-5) return vec4(0.0);
  float A = pose.x, B = F + pose.y; float s = (A - B * k) / den; float t = B + s * sn;
  if (t < 4.0) return vec4(0.0);
  float y = t * ps.y / F; float dsdk = (B * c - A * sn) / (den * den);
  float fs = min(abs(dsdk / F) * fx, 48.0); float fyc = min(t / F * fy, 48.0);
  vec2 p = vec2(s, y); float d = sdRound(p, vec2(CW, CH) * 0.5, CR);
  vec2 q = abs(p) - vec2(CW, CH) * 0.5 + CR; vec2 n = q.x > q.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  if (q.x > 0.0 && q.y > 0.0) n = normalize(q);
  float fp = length(vec2(fs * n.x, fyc * n.y)) + 1e-4; if (d > fp) return vec4(0.0);
  float cov = clamp(0.5 - d / fp, 0.0, 1.0); if (cov <= 0.0) return vec4(0.0);
  vec2 uv = vec2(s / CW + 0.5, 0.5 - y / CH);
  vec4 tex = textureGrad(uTex, vec3(uv, pose.w), vec2(fs / CW, 0.0), vec2(0.0, fyc / CH));
  depth = t; return vec4(tex.rgb, 1.0) * cov; }
vec4 scene(vec2 ps, float fx, float fy){
  vec4 col[4]; float dep[4];
  for (int i = 0; i < 4; i++) col[i] = shadeCard(uPose[i], ps, fx, fy, dep[i]);
  for (int i = 0; i < 3; i++) for (int j = 0; j < 3; j++) if (j < 3 - i && dep[j] > dep[j+1]) {
    float td = dep[j]; dep[j] = dep[j+1]; dep[j+1] = td; vec4 tc = col[j]; col[j] = col[j+1]; col[j+1] = tc; }
  vec4 acc = vec4(0.0); for (int i = 0; i < 4; i++) acc += (1.0 - acc.a) * col[i]; return acc; }
vec4 glowAt(vec2 pu, float halfH){
  vec4 sum = vec4(0.0); float gH = min(halfH, 288.0);
  float dy = min(abs((gH - 11.0) - pu.y), abs(pu.y + (gH - 12.0))); if (dy > 40.0) return sum;
  for (int i = 0; i < 4; i++){ vec3 sh = uGlowShape[i]; if (sh.z <= 0.0) continue;
    float E = exp(-pow(abs(pu.x - sh.x) / sh.y, 4.0)); if (E < 0.002) continue;
    float v = exp(-pow(dy / (18.5 * (0.45 + 0.55 * sqrt(E))), 3.0)); float w = sh.z * E * v;
    sum += vec4(uGlowCol[i] * w, w); }
  return sum; }
vec3 stage(vec2 pu, float halfH){ vec4 g = glowAt(pu, halfH); if (g.a <= 0.0) return uBg;
  float I = clamp(g.a, 0.0, 1.0); vec3 drop = uBg - g.rgb / g.a; return uBg - drop * pow(vec3(I), vec3(0.8, 1.6, 1.0)); }
vec3 render(vec2 pu, float halfH){
  float au = min(abs(pu.x), 360.0); float px = 1.0 / uUnit; vec3 bg = stage(pu, halfH);
  if (au < 236.0 || uWarp <= 0.0) { vec4 c = scene(pu, px, px); return c.rgb + (1.0 - c.a) * bg; }
  float e = 0.064 * uWarp * smoothstep(275.0, 360.0, au); float S0 = lensS(au); float sg = pu.x < 0.0 ? -1.0 : 1.0;
  float blur = 1.0 + 30.0 * pow(smoothstep(240.0, 340.0, au), 1.5) * uWarp;
  float fyb = 1.0 + 15.0 * smoothstep(280.0, 352.0, au) * uWarp;
  float gain = 1.0 + 0.17 * smoothstep(285.0, 350.0, au) * uWarp; vec3 acc;
  for (int ch = 0; ch < 3; ch++){
    float off = uWarp * (ch == 0 ? -20.92 : (ch == 1 ? 0.0 : 11.91));
    float h = lensH(au) + off * smoothstep(289.8, 344.9, au);
    float h0 = lensH(au - 0.5) + off * smoothstep(289.8, 344.9, au - 0.5);
    float h1 = lensH(au + 0.5) + off * smoothstep(289.8, 344.9, au + 0.5);
    float fx = px * max(abs(h1 - h0), 0.02) * blur;
    float S = S0 * (ch == 0 ? 1.0 + e : (ch == 1 ? 1.0 : 1.0 - e));
    vec4 c = scene(vec2(sg * h, pu.y / S), fx, px / S * fyb);
    c.rgb = min(c.rgb * gain, vec3(c.a)); acc[ch] = (c.rgb + (1.0 - c.a) * bg)[ch]; }
  return acc; }
void main(){ vec2 pu = (gl_FragCoord.xy - 0.5 * uRes) / uUnit; float halfH = 0.5 * uRes.y / uUnit;
  outColor = vec4(render(pu, halfH), 1.0); }`;

const mod = (a: number, n: number) => ((a % n) + n) % n;

/**
 * Anillo de tarjetas con cifras que gira solo, con lente de gran angular en los
 * bordes (WebGL2). Se puede arrastrar y mover con flechas. Las cifras también
 * van como texto en la sección (el canvas es decorativo).
 */
export function WarpCarousel({
  cards,
  background,
  font = '"Inter Tight", system-ui, sans-serif',
  interval = 3.6667,
  step = 2,
  aria_label,
  className,
}: WarpCarouselProps) {
  const root_ref = useRef<HTMLDivElement>(null);
  const live_ref = useRef<HTMLDivElement>(null);
  /* Sin GPU real no se compila el shader: se muestran las tarjetas planas. */
  const [static_mode, set_static_mode] = useState(false);
  useEffect(() => {
    if (!has_capable_gpu()) set_static_mode(true);
  }, []);

  useEffect(() => {
    const root = root_ref.current;
    if (!root || static_mode || !has_capable_gpu()) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const list: WarpCard[] = [];
    while (list.length < 4) list.push(...cards);
    const N = list.length;
    const step_n = Math.max(1, Math.round(step));
    const gap = Math.max(0.5, interval);

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "absolute inset-0 size-full";
    root.prepend(canvas);
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) {
      canvas.remove();
      return;
    }
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      canvas.remove();
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "aPos");
    gl.linkProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    const aniso = gl.getExtension("EXT_texture_filter_anisotropic");
    const loc = Object.fromEntries(
      ["uTex", "uRes", "uUnit", "uPose", "uGlowCol", "uGlowShape", "uBg", "uWarp"].map((name) => [
        name,
        gl.getUniformLocation(program, name),
      ]),
    );

    const bg = parse_color(background);
    const glow_cols = list.map((c) => parse_color(c.glow));
    let W = 0;
    let H = 0;
    let unit = 1;
    let tex_w = 0;
    let raf = 0;
    let visible = true;
    let current = 0;
    let hidden_at = 0;
    const L = {
      P: 0, from: 0, to: 0, t0: 0, n: STEP_FRAMES, v: 0,
      mode: "rest" as "rest" | "spin" | "drag" | "spring",
      next_auto: Infinity, drag_x: 0, drag_p: 0, down_x: 0, moved: false, last_t: 0,
    };

    const paint_all = (w: number) => {
      const canvases = list.map((card) => {
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = Math.round((w * CH) / CW);
        paint_card(cv, card, font);
        return cv;
      });
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
      gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA8, w, canvases[0].height, canvases.length, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      canvases.forEach((cv, i) => {
        gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, w, cv.height, 1, gl.RGBA, gl.UNSIGNED_BYTE, cv);
      });
      gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (aniso) gl.texParameterf(gl.TEXTURE_2D_ARRAY, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
      tex_w = w;
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(2, Math.round(rect.width * dpr));
      H = Math.max(2, Math.round(rect.height * dpr));
      canvas.width = W;
      canvas.height = H;
      unit = Math.min(W / 720, H / 440);
      const want = Math.min(1024, Math.max(256, Math.round(CW * unit * 1.25)));
      if (want !== tex_w) paint_all(want);
    };

    const pose_set = (P: number) => {
      const ids = Array.from({ length: N }, (_, c) => ({ c, q: mod(c - P + N / 2, N) - N / 2 }))
        .sort((a, b) => Math.abs(a.q) - Math.abs(b.q))
        .slice(0, 4);
      return ids.map(({ c, q }) =>
        Math.abs(q) > 2.05 ? { pose: [0, 0, 0] as Pose, layer: -1 } : { pose: pose_at(q), layer: c },
      );
    };

    const poses = new Float32Array(16);
    const glows = new Float32Array(12);
    const shapes = new Float32Array(12);

    const draw = (now: number) => {
      if (L.mode === "spin") {
        const f = (now - L.t0) * 30;
        L.P = L.from + (L.to - L.from) * spin_n(f, L.n);
        if (f >= L.n) L.mode = "rest";
      } else if (L.mode === "spring") {
        const dt = Math.min(0.034, Math.max(0, now - L.last_t));
        L.last_t = now;
        for (let i = 0; i < 4; i++) {
          const acc = -60 * (L.P - L.to) - 13 * L.v;
          L.v += (acc * dt) / 4;
          L.P += (L.v * dt) / 4;
        }
        if (Math.abs(L.P - L.to) < 4e-4 && Math.abs(L.v) < 3e-3) {
          L.P = L.to;
          L.v = 0;
          L.mode = "rest";
        }
      }
      pose_set(L.P).forEach((s, i) => {
        poses.set([s.pose[0], s.pose[1], s.pose[2], s.layer], i * 4);
        const gc = s.layer >= 0 ? glow_cols[s.layer] : [255, 255, 255];
        glows.set([gc[0] / 255, gc[1] / 255, gc[2] / 255], i * 3);
        shapes.set(s.layer >= 0 ? glow_shape(s.pose) : [0, 1, 0], i * 3);
      });
      gl.viewport(0, 0, W, H);
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
      gl.uniform1i(loc.uTex, 0);
      gl.uniform2f(loc.uRes, W, H);
      gl.uniform1f(loc.uUnit, unit);
      gl.uniform4fv(loc.uPose, poses);
      gl.uniform3fv(loc.uGlowCol, glows);
      gl.uniform3fv(loc.uGlowShape, shapes);
      gl.uniform3f(loc.uBg, bg[0] / 255, bg[1] / 255, bg[2] / 255);
      gl.uniform1f(loc.uWarp, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const announce = () => {
      const card = list[mod(current, N)];
      if (live_ref.current) {
        live_ref.current.textContent = `${card.title.replace("\n", " ")}: ${card.value}. ${card.footer ?? ""}`;
      }
    };

    const go_to = (next: number, from_auto = false) => {
      const delta = next - current;
      current = next;
      const now = performance.now() / 1000;
      if (reduced) {
        L.P = Math.round(L.P) + delta;
        L.mode = "rest";
      } else if (L.mode !== "spring") {
        L.from = L.P;
        L.to = Math.round(L.P - DRIFT) + delta + DRIFT;
        L.t0 = now;
        L.n = from_auto ? gap * 30 : STEP_FRAMES;
        L.mode = "spin";
      }
      if (!from_auto) L.next_auto = now + gap;
      announce();
      kick();
    };

    const loop = () => {
      raf = 0;
      if (!visible) return;
      const now = performance.now() / 1000;
      if (!reduced && L.mode !== "drag" && L.mode !== "spring" && now >= L.next_auto) {
        L.next_auto = Math.max(L.next_auto + gap, now + gap * 0.5);
        go_to(current + step_n, true);
      }
      draw(now);
      if (L.mode !== "rest" || !reduced) raf = requestAnimationFrame(loop);
    };
    function kick() {
      if (!raf && visible) raf = requestAnimationFrame(loop);
    }

    const t0 = performance.now() / 1000;
    if (!reduced) {
      L.from = -step_n + DRIFT;
      L.to = DRIFT;
      L.t0 = t0 - REST_PHASE / 30;
      L.mode = "spin";
      L.P = L.from + (L.to - L.from) * spin(REST_PHASE);
      L.next_auto = t0 + (STEP_FRAMES - REST_PHASE) / 30;
    }
    resize();
    draw(t0);
    announce();

    const resize_observer = new ResizeObserver(() => {
      resize();
      draw(performance.now() / 1000);
    });
    resize_observer.observe(root);
    const intersection = new IntersectionObserver(([entry]) => {
      const now = performance.now() / 1000;
      const is_visible = entry?.isIntersecting ?? true;
      if (is_visible && !visible) {
        const dt = now - hidden_at;
        L.t0 += dt;
        L.next_auto += dt;
      }
      if (!is_visible) hidden_at = now;
      visible = is_visible;
      kick();
    });
    intersection.observe(root);

    const width_unit = () => {
      const r = root.getBoundingClientRect();
      return { r, u: Math.min(r.width / 720, r.height / 440) };
    };
    const on_down = (e: PointerEvent) => {
      if (e.button > 0) return;
      root.setPointerCapture(e.pointerId);
      L.mode = "drag";
      L.drag_x = L.down_x = e.clientX;
      L.drag_p = L.P;
      L.v = 0;
      L.moved = false;
      L.last_t = performance.now() / 1000;
      kick();
    };
    const on_move = (e: PointerEvent) => {
      if (L.mode !== "drag") return;
      const { u } = width_unit();
      const now = performance.now() / 1000;
      const P = L.drag_p - (e.clientX - L.drag_x) / (u * 300);
      const dt = Math.max(1 / 240, now - L.last_t);
      L.v = 0.6 * L.v + 0.4 * ((P - L.P) / dt);
      L.P = P;
      L.last_t = now;
      if (Math.abs(e.clientX - L.down_x) > 5) L.moved = true;
      draw(now);
    };
    const on_up = (e: PointerEvent) => {
      if (L.mode !== "drag") return;
      const now = performance.now() / 1000;
      L.next_auto = now + gap;
      if (!L.moved) {
        L.mode = "rest";
        const { r, u } = width_unit();
        const x = (e.clientX - r.left - r.width / 2) / u;
        if (x > 168) go_to(current + 1);
        else if (x < -168) go_to(current - 1);
        return;
      }
      if (now - L.last_t > 0.08) L.v = 0;
      const target = Math.round(L.P + L.v * 0.16);
      const from = Math.round(L.drag_p - DRIFT);
      L.to = target;
      L.mode = "spring";
      L.last_t = now;
      current += target - from;
      announce();
      kick();
    };
    const on_key = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      go_to(current + (e.key === "ArrowRight" ? 1 : -1));
    };
    root.addEventListener("pointerdown", on_down);
    root.addEventListener("pointermove", on_move);
    root.addEventListener("pointerup", on_up);
    root.addEventListener("pointercancel", on_up);
    root.addEventListener("keydown", on_key);
    void document.fonts?.ready.then(() => {
      tex_w = 0;
      resize();
      draw(performance.now() / 1000);
    });
    kick();

    return () => {
      cancelAnimationFrame(raf);
      resize_observer.disconnect();
      intersection.disconnect();
      root.removeEventListener("pointerdown", on_down);
      root.removeEventListener("pointermove", on_move);
      root.removeEventListener("pointerup", on_up);
      root.removeEventListener("pointercancel", on_up);
      root.removeEventListener("keydown", on_key);
      canvas.remove();
    };
  }, [cards, background, font, interval, step, static_mode]);

  if (static_mode) {
    return (
      <div className={cn("grid grid-cols-2 gap-3 overflow-hidden p-4", className)} style={{ background }}>
        {cards.map((card) => (
          <div
            key={card.value}
            className="flex flex-col justify-between rounded-xl p-4 text-white"
            style={{ background: `linear-gradient(160deg, ${card.mesh[0]}, ${card.mesh[20]} 50%, ${card.mesh[41]})` }}
          >
            <span className="whitespace-pre-line text-xs opacity-90">{card.title}</span>
            <span className="mt-4 font-display text-4xl font-light tracking-[-0.03em]">{card.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={root_ref}
      role="region"
      aria-roledescription="carrusel"
      aria-label={aria_label}
      tabIndex={0}
      className={cn("relative cursor-grab touch-pan-y select-none overflow-hidden", className)}
      style={{ background }}
    >
      <div ref={live_ref} aria-live="polite" className="sr-only" />
    </div>
  );
}
