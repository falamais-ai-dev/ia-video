// Câmera sem cortes secos (estudo em estudos/estudo-cortes/ESTUDO.md).
// Entre planos do mesmo cenário a câmera anda até o novo enquadramento; quando a distância ou o giro
// seriam grandes demais para andar sem enjoar, ou ao trocar de cenário, os dois planos se fundem em 0,33 s.
const lerp = (a, b, p) => a + (b - a) * p;
const mix = (a, b, p) => (Array.isArray(a) ? a.map((v, i) => lerp(v, b[i], p)) : lerp(a, b, p));
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const suave = (x) => { const p = cl(x); return p * p * p * (p * (p * 6 - 15) + 10); };
const io = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const FUSAO = 1 / 6; // metade da fusão, em segundos
const MAX_DIST = 2.6, MAX_GIRO = 70, ANTECIPA = 0.2;

export const fazCameraSuave = (PLANOS, TREMORES) => {
  const bruto = (pl, t) => {
    const k = pl.keys; let i = 1; while (i < k.length - 1 && t > k[i][0]) i++;
    const [t0, p0, l0, f0] = k[i - 1], [t1, p1, l1, f1, ez] = k[i];
    const u = (ez || io)(cl((t - t0) / Math.max(1e-6, t1 - t0)));
    return {pos: mix(p0, p1, u), look: mix(l0, l1, u), fov: lerp(f0, f1, u)};
  };
  const P = [];
  const mistura = (i, t) => {
    const pl = P[i], b = bruto(pl, t);
    if (pl.tipo !== 'anda') return b;
    const s = suave((t - pl.inicio) / pl.dur);
    return {pos: mix(pl.de.pos, b.pos, s), look: mix(pl.de.look, b.look, s), fov: lerp(pl.de.fov, b.fov, s)};
  };
  PLANOS.forEach((pl, i) => {
    const prox = PLANOS[i + 1];
    if (i === 0) { P.push({...pl, tipo: 'inicio', inicio: pl.t0}); return; }
    const inicio = Math.max(pl.t0 - ANTECIPA, P[i - 1].inicio + 0.05);
    const de = mistura(i - 1, inicio), para = bruto(pl, pl.t0 + 0.2);
    const dist = Math.hypot(de.pos[0] - para.pos[0], de.pos[1] - para.pos[1], de.pos[2] - para.pos[2]);
    const dir = (c) => { const v = [c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]]; const n = Math.hypot(...v) || 1; return v.map((x) => x / n); };
    const a = dir(de), b = dir(para);
    const giro = Math.acos(cl(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1)) * 180 / Math.PI;
    if (pl.set === PLANOS[i - 1].set && !pl.funde && dist <= MAX_DIST && giro <= MAX_GIRO) {
      const fim = prox ? prox.t0 : pl.t0 + 2;
      const dur = Math.min(cl(0.55 + dist * 0.22 + giro * 0.004, 0.55, 1.15), Math.max(0.35, (fim - inicio) * 0.9));
      P.push({...pl, tipo: 'anda', inicio, de, dur});
    } else P.push({...pl, tipo: 'funde', inicio: pl.t0});
  });
  const idx = (t) => { let n = 0; for (let i = 0; i < P.length; i++) if (t >= P[i].inicio) n = i; return n; };
  const comVida = (c, set, t) => {
    const d = Math.hypot(c.pos[0] - c.look[0], c.pos[1] - c.look[1], c.pos[2] - c.look[2]);
    let tr = 0; for (const [a, amp] of TREMORES) if (t > a && t < a + 0.6) tr += amp * 0.5 * Math.exp(-(t - a) * 7);
    const deriva = [Math.sin(t * 0.7) * 0.01 * d + Math.sin(t * 61) * tr, Math.sin(t * 0.9 + 1) * 0.005 * d + Math.cos(t * 53) * tr, 0];
    return {pos: c.pos.map((v, i) => v + deriva[i]), look: c.look, fov: c.fov, d, set};
  };
  const noPlano = (i, t) => comVida(mistura(i, t), P[i].set, t);
  const em = (t) => noPlano(idx(t), t);
  // fusão em andamento no instante t: i é o plano que entra, k vai de 0 a 1
  const fusao = (t) => { for (let i = 1; i < P.length; i++) if (P[i].tipo === 'funde' && t >= P[i].t0 - FUSAO && t < P[i].t0 + FUSAO) return {i, t0: P[i].t0, k: suave((t - P[i].t0 + FUSAO) / (2 * FUSAO))}; return null; };
  return {em, noPlano, fusao, P};
};
