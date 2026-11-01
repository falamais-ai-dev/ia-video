// Senhor Sticker, vídeo 4 (01/11/2026), piloto do estilo Ricks Clips: "Santos Dumont NÃO inventou o relógio de pulso".
// Biblioteca 3D reaproveitada do vídeo da penicilina; cenas, atuação e câmera novas. Tempo vindo da fala (palavras.js).
import React from 'react';
import * as THREE from 'three';
import {AbsoluteFill, useCurrentFrame, Easing, getInputProps, staticFile, delayRender, continueRender} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {T, B, HULL, Tn, Esf, Cx, Ci, Co, Linha, canvasTex, PRATA, OURO, FERRO, MAT, GRAD, LINHA, Boneco, maoRepouso, Brilho, Faisca, Gota, Velocidade, Nuvem, CAB_ACESA, BigodeGuidao, Cavanhaque, Avental} from './toon2';
import {PALAVRAS} from './palavras';
import {Borrao, Aquece} from './cinema';
import {PosToon} from './pos';

export const DUR_RL = Math.ceil((PALAVRAS[PALAVRAS.length - 1].e + 0.6) * 30);
const IN = getInputProps();
const io = Easing.inOut(Easing.cubic);
const back = Easing.out(Easing.back(1.8));
const outQ = Easing.out(Easing.quad);
const inQ = Easing.in(Easing.quad);
const lin = (x) => x;
const lerp = (a, b, p) => a + (b - a) * p;
const mix = (a, b, p) => Array.isArray(a) ? a.map((v, i) => lerp(v, b[i], p)) : lerp(a, b, p);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const kf = (t, keys, ez = io) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1, e] = keys[i]; return mix(v0, v1, (e || ez)((t - t0) / Math.max(1e-6, t1 - t0))); }
  return keys[keys.length - 1][1];
};
const fx = (t, t0, d) => (t - t0) / d;
const fx01 = (t, t0, d) => { const k = (t - t0) / d; return k > 0 && k < 1 ? k : 0; };
const settle = (t, t0, amp, f = 14, dec = 5) => (t > t0 ? Math.sin((t - t0) * f) * amp * Math.exp(-(t - t0) * dec) : 0);
const add = (a, b) => a.map((v, i) => v + b[i]);
const pisca = (t, fase) => ((t + fase) % 2.6) < 0.09;
const expr = (t, tl, fase = 0) => {
  const tlv = []; for (const kv of tl) if (!tlv.length || kv[0] - tlv[tlv.length - 1][0] >= 0.23) tlv.push(kv);
  let cur = tlv[0][1], tc = -9; for (const [k, v] of tlv) if (t >= k) { cur = v; tc = k; }
  const troca = tlv.some(([k, v], i) => i > 0 && t >= k - 0.001 && t < k + 0.066 && !v.semPisca && !tlv[i - 1][1].semPisca);
  const o = {sob: 0, assim: 0, bochecha: 0, trem: 0, vivo: 0.5, palp: null, abre: 0, ...cur};
  o.escOlho = (cur.escOlho || 1) + kf(t, [[tc - 0.01, 0], [tc + 0.05, cur.pop ?? 0.08, outQ], [tc + 0.25, 0]]);
  if (troca || (pisca(t, fase) && !cur.semPisca && !cur.dorme)) o.olhos = 'pisca';
  return o;
};
// ---------- texturas pintadas ----------
let SEED = 1; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return SEED / 2147483647; };
const lm = (k, tex, extra = {}) => MAT(k, () => new THREE.MeshToonMaterial({map: tex(), gradientMap: GRAD, ...extra}));
const texTabuas = (k, base = '#B07842', rep = [6, 6]) => canvasTex('tab' + k, 1024, 1024, (g, w) => {
  SEED = 17; g.fillStyle = base; g.fillRect(0, 0, w, w); const n = 8, s = w / n;
  for (let i = 0; i < n; i++) { const v = rnd() * 26 - 13; g.fillStyle = `rgba(${v > 0 ? 255 : 60},${v > 0 ? 220 : 30},${v > 0 ? 170 : 10},${Math.abs(v) / 90})`; g.fillRect(i * s, 0, s, w);
    g.strokeStyle = 'rgba(90,50,22,0.35)'; g.lineWidth = 3; for (let k2 = 0; k2 < 5; k2++) { const x = i * s + 10 + rnd() * (s - 20); g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 8, w * 0.3, x - 8, w * 0.7, x + 3, w); g.stroke(); }
    const y = rnd() * w; g.strokeStyle = 'rgba(55,44,46,0.8)'; g.lineWidth = 5; g.beginPath(); g.moveTo(i * s, y); g.lineTo(i * s + s, y); g.stroke(); }
  g.strokeStyle = 'rgba(55,44,46,0.9)'; g.lineWidth = 7; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, w); g.stroke(); }
}, rep);
const texReboco = (k, base, manchas, rep = [3, 1.5]) => canvasTex('reb' + k, 1024, 1024, (g, w) => {
  SEED = 29; g.fillStyle = base; g.fillRect(0, 0, w, w);
  for (let i = 0; i < 90; i++) { g.fillStyle = manchas[i % manchas.length]; g.globalAlpha = 0.18; g.beginPath(); g.ellipse(rnd() * w, rnd() * w, 40 + rnd() * 140, 30 + rnd() * 90, rnd() * 3, 0, 7); g.fill(); }
  g.globalAlpha = 1;
  if (k === 'ofi') { // tijolinhos aparecendo onde o reboco caiu
    for (let m = 0; m < 3; m++) { const cx = 150 + m * 330 + rnd() * 80, cy = 220 + rnd() * 500; for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) { if (Math.abs(i) + Math.abs(j) > 3) continue; const x = cx + i * 46 + (j % 2) * 23, y = cy + j * 24;
      g.fillStyle = ['#C2674A', '#B65A40', '#CF7556'][(i + j + 9) % 3]; g.fillRect(x, y, 42, 20); g.strokeStyle = 'rgba(55,44,46,0.7)'; g.lineWidth = 3; g.strokeRect(x, y, 42, 20); } }
  }
}, rep);
const texPapelParede = (k, c1, c2, simb) => canvasTex('pp' + k, 1024, 1024, (g, w) => {
  g.fillStyle = c1; g.fillRect(0, 0, w, w);
  for (let i = 0; i < 8; i++) { g.fillStyle = c2; g.fillRect(i * 128 + 54, 0, 20, w); }
  g.fillStyle = c2; for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { const x = i * 128 + (j % 2) * 64 + 20, y = j * 128 + 64;
    if (simb === 'estrela') { g.beginPath(); for (let a = 0; a < 10; a++) { const r = a % 2 ? 7 : 17, an = a * Math.PI / 5 - Math.PI / 2; g.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r); } g.closePath(); g.fill(); }
    else { g.beginPath(); g.ellipse(x, y, 10, 16, 0, 0, 7); g.fill(); } }
}, [3, 1.5]);
// vista da janela: céu do fim da tarde, telhados da cidade e uma chaminé
const texVista = (k) => canvasTex('vista' + k, 1024, 1024, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#7FB2E6'); gr.addColorStop(0.6, '#F6D7A6'); gr.addColorStop(1, '#F9C98A'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,0.85)'; [[220, 220, 90], [700, 320, 120], [480, 140, 60]].forEach(([x, y, r]) => { for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(x + i * r * 0.55, y + Math.sin(i) * 12, r * (0.5 + 0.2 * (i % 2)), 0, 7); g.fill(); } });
  if (k === 'paris') { // torre de treliça pintada ao fundo (silhueta)
    g.fillStyle = '#8E7FA6'; g.beginPath(); g.moveTo(560, 900); g.quadraticCurveTo(640, 600, 655, 260); g.lineTo(665, 260); g.quadraticCurveTo(680, 600, 760, 900); g.closePath(); g.fill();
    g.fillStyle = '#F4D2A4'; g.beginPath(); g.moveTo(600, 900); g.quadraticCurveTo(660, 780, 720, 900); g.closePath(); g.fill();
    g.fillStyle = '#8E7FA6'; g.fillRect(610, 700, 100, 14); g.fillRect(636, 520, 48, 10); g.fillRect(658, 200, 4, 70);
  }
  for (let i = 0; i < 9; i++) { const x = i * 120 - 20, hh = 120 + ((i * 53) % 90); g.fillStyle = ['#C98F6B', '#B97B5E', '#D4A27A'][i % 3]; g.fillRect(x, h - hh, 112, hh); g.fillStyle = '#8E5A47'; g.beginPath(); g.moveTo(x - 8, h - hh); g.lineTo(x + 56, h - hh - 60); g.lineTo(x + 120, h - hh); g.fill();
    g.fillStyle = '#FFE7A8'; for (let j = 0; j < 2; j++) g.fillRect(x + 22 + j * 44, h - hh + 30, 22, 30); }
});
const texTapete = () => canvasTex('tapete', 512, 512, (g, w) => {
  const c = w / 2; ['#C45A3C', '#E9A84A', '#C45A3C', '#F0D08A', '#9B3F33'].forEach((cor, i) => { g.fillStyle = cor; g.beginPath(); g.arc(c, c, c * (1 - i * 0.18), 0, 7); g.fill(); });
  g.strokeStyle = 'rgba(255,240,210,0.6)'; g.lineWidth = 6; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; g.beginPath(); g.arc(c + Math.cos(a) * c * 0.73, c + Math.sin(a) * c * 0.73, 10, 0, 7); g.stroke(); }
});
// quadro de cortiça com rascunhos de invenções (só desenhos, sem letras)
const texRascunhos = () => canvasTex('rasc', 1024, 720, (g, w, h) => {
  g.fillStyle = '#C89B66'; g.fillRect(0, 0, w, h); SEED = 41; for (let i = 0; i < 1500; i++) { g.fillStyle = rnd() > 0.5 ? 'rgba(120,80,40,0.35)' : 'rgba(230,200,150,0.35)'; g.fillRect(rnd() * w, rnd() * h, 3, 3); }
  const papel = (x, y, ww, hh, r, desenho) => { g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = '#FBF4E2'; g.fillRect(-ww / 2, -hh / 2, ww, hh); g.strokeStyle = '#3B5BA8'; g.lineWidth = 5; g.lineCap = 'round'; desenho(g); g.fillStyle = '#D8323C'; g.beginPath(); g.arc(0, -hh / 2 + 14, 9, 0, 7); g.fill(); g.restore(); };
  papel(200, 200, 250, 210, -0.08, (g) => { g.beginPath(); g.arc(0, -10, 50, Math.PI * 0.8, Math.PI * 2.2); g.lineTo(18, 52); g.lineTo(-18, 52); g.closePath(); g.stroke(); for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-20, 60 + i * 10); g.lineTo(20, 60 + i * 10); g.stroke(); } g.beginPath(); g.moveTo(-14, 10); g.lineTo(-6, -20); g.lineTo(6, 0); g.lineTo(14, -20); g.stroke(); });
  papel(520, 180, 230, 200, 0.06, (g) => { g.beginPath(); g.arc(0, 0, 55, 0, 7); g.stroke(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; g.beginPath(); g.moveTo(Math.cos(a) * 55, Math.sin(a) * 55); g.lineTo(Math.cos(a) * 75, Math.sin(a) * 75); g.stroke(); } g.beginPath(); g.arc(0, 0, 18, 0, 7); g.stroke(); });
  papel(820, 230, 240, 230, -0.04, (g) => { g.strokeRect(-70, 20, 90, 60); g.beginPath(); g.moveTo(-25, 20); g.lineTo(-10, -20); g.lineTo(70, -75); g.lineTo(90, -20); g.lineTo(-5, -5); g.stroke(); g.beginPath(); g.arc(-25, 50, 20, 0, 7); g.stroke(); });
  papel(330, 520, 260, 220, 0.05, (g) => { g.beginPath(); g.moveTo(-90, 40); g.quadraticCurveTo(0, -80, 90, 40); g.stroke(); g.beginPath(); g.moveTo(0, -20); g.lineTo(0, 80); g.stroke(); for (let k = -1; k <= 1; k += 2) { g.beginPath(); g.moveTo(0, -40); g.lineTo(k * 70, -60); g.stroke(); } });
  papel(700, 520, 260, 220, -0.07, (g) => { for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-90, -50 + i * 32); g.lineTo(-90 + 150 - i * 30, -50 + i * 32); g.stroke(); } g.strokeStyle = '#D8323C'; g.beginPath(); g.arc(70, 40, 30, 0, 7); g.stroke(); });
});
const texZ = () => canvasTex('letraZ', 256, 256, (g, w) => { g.font = '900 210px MontLE, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 26; g.strokeStyle = LINHA; g.strokeText('Z', w / 2, w / 2 + 10); g.fillStyle = '#FFFFFF'; g.fillText('Z', w / 2, w / 2 + 10); });
const texHalo = () => canvasTex('halo', 256, 256, (g, w) => { const c = w / 2; const gr = g.createRadialGradient(c, c, 0, c, c, c); gr.addColorStop(0, 'rgba(255,236,150,0.9)'); gr.addColorStop(0.35, 'rgba(255,214,90,0.45)'); gr.addColorStop(1, 'rgba(255,200,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
const texFumaca = () => canvasTex('fumaca', 256, 256, (g, w) => { [[0.4, 0.55, 0.25], [0.6, 0.5, 0.28], [0.5, 0.35, 0.22]].forEach(([x, y, r]) => { const gr = g.createRadialGradient(x * w, y * w, 0, x * w, y * w, r * w); gr.addColorStop(0, 'rgba(120,115,120,0.9)'); gr.addColorStop(1, 'rgba(120,115,120,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x * w, y * w, r * w, 0, 7); g.fill(); }); });
const SPM = (k, tex, extra = {}) => MAT('sp' + k, () => new THREE.SpriteMaterial({map: tex(), transparent: true, depthWrite: false, fog: false, ...extra}));
// "Zzz" que sobe da cabeça de quem dorme
const Zzz = ({p, t, k = 1, id = 0, s = 0.11}) => k <= 0.01 ? null : <group>{[0, 1, 2].map((i) => { const u = ((t * 0.55 + i / 3 + id * 0.17) % 1);
  const m = MAT('zm' + id + i, () => new THREE.SpriteMaterial({map: texZ(), transparent: true, depthWrite: false, fog: false})); m.opacity = k * Math.sin(u * Math.PI); m.rotation = -0.3 + Math.sin(u * 6) * 0.2;
  return <sprite key={i} position={[p[0] + 0.08 + u * 0.16 + Math.sin(u * 9 + i) * 0.03, p[1] + 0.05 + u * 0.32, p[2]]} scale={[s * (0.6 + u * 0.7), s * (0.6 + u * 0.7), 1]} material={m} />; })}</group>;
const Halo = ({p, k, s = 0.9, id = 0}) => { if (k <= 0.01) return null; const m = MAT('halo' + id, () => new THREE.SpriteMaterial({map: texHalo(), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending})); m.opacity = Math.min(1, k) * 0.8; return <sprite position={p} scale={[s * (0.85 + 0.15 * k), s * (0.85 + 0.15 * k), 1]} material={m} />; };
const Fumaca = ({p, k, s = 0.3, id = 0}) => { if (k <= 0 || k >= 1) return null; const m = MAT('fum' + id, () => new THREE.SpriteMaterial({map: texFumaca(), transparent: true, depthWrite: false, fog: false})); m.opacity = (1 - k) * 0.9; return <sprite position={[p[0], p[1] + k * 0.25, p[2]]} scale={[s * (0.5 + k), s * (0.5 + k), 1]} material={m} />; };
// onda de choque do estrondo: anel achatado que cresce e some
const Onda = ({p, k, r = 0.5, id = 0}) => { if (k <= 0 || k >= 1) return null; const m = MAT('onda' + id, () => new THREE.MeshBasicMaterial({color: '#FFFFFF', transparent: true, depthWrite: false})); m.opacity = (1 - k) * 0.9;
  return <mesh position={p} rotation={[-Math.PI / 2, 0, 0]} scale={0.2 + k * r} material={m}><ringGeometry args={[0.9, 1, 40]} /></mesh>; };
// cabeça do boneco no mundo (para halo, Zzz e fumaça); sc = escala do boneco
const cabDe = (pos, sc = 1, dy = 0) => [pos[0], pos[1] + (1.09 + dy) * sc, pos[2]];
const Lampada = ({p, s = 1, acesa = 0}) => (
  <group position={p} scale={s}>
    <Ci rt={0.035} rb={0.03} h={0.05} p={[0, 0.025, 0]} m={FERRO()} seg={12} line={0.5} />
    <Esf r={0.06} p={[0, 0.1, 0]} s={[1, 1.15, 1]} m={acesa > 0.02 ? CAB_ACESA(acesa) : T('#EAF6FA')} line={0.6} seg={16} />
  </group>
);
const Pote = ({p, cor, h = 0.16, r = 0.05}) => (
  <group position={p}>
    <Ci rt={r} h={h} p={[0, h / 2, 0]} m={T(cor)} seg={14} line={0.6} />
    <Ci rt={r * 0.85} h={0.03} p={[0, h + 0.015, 0]} m="#8A5A30" seg={12} line={0.5} />
  </group>
);
const Engrenagem = ({p, r = 0.09, rot = [0, 0, 0], cor = '#C9A34A'}) => (
  <group position={p} rotation={rot}>
    <Ci rt={r} h={0.03} rot={[Math.PI / 2, 0, 0]} m={OURO()} seg={20} line={0.6} />
    {Array.from({length: 8}).map((_, i) => { const a = i / 8 * Math.PI * 2; return <Cx key={i} a={[r * 0.35, r * 0.35, 0.03]} p={[Math.cos(a) * r * 1.08, Math.sin(a) * r * 1.08, 0]} rot={[0, 0, a]} m={OURO()} line={0.5} />; })}
  </group>
);
// ---------- gato do laboratório (figurante que volta no fim) ----------
const LAR = '#EE9440', LAR2 = '#C9702A';
const OlhoGato = ({x, tipo, olhar = [0, 0]}) => {
  if (tipo === 'fechado') return <mesh position={[x, 0.006, 0.066]} rotation={[0, x * 6, Math.PI]} material={B(LINHA)}><torusGeometry args={[0.016, 0.0045, 6, 12, Math.PI]} /></mesh>;
  const R = tipo === 'grande' ? 0.026 : 0.02;
  return (
    <group position={[x, 0.012, 0.06]} rotation={[0, x * 7, 0]}>
      <Esf r={R} s={[1, 1.1, 0.45]} m={T(tipo === 'grande' ? '#FFFFFF' : '#D9F27A')} line={0.45} sombra={false} seg={14} />
      <mesh position={[olhar[0] * R * 0.4, olhar[1] * R * 0.3, R * 0.45]} scale={[tipo === 'grande' ? 1 : 0.35, 1, 1]} material={B(LINHA)}><sphereGeometry args={[R * (tipo === 'grande' ? 0.35 : 0.75), 10, 8]} /></mesh>
      {tipo === 'bravo' || tipo === 'semi' ? <mesh position={[0, R * 0.55, R * 0.3]} rotation={[0, 0, (x > 0 ? -1 : 1) * (tipo === 'bravo' ? 0.45 : 0)]} scale={[1.2, 0.6, 0.6]} material={T(LAR)}><sphereGeometry args={[R, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh> : null}
    </group>
  );
};
const CabGato = ({p, rot = [0, 0, 0], olhos = 'normal', olhoD, eriça = 0, boca = 'w', t = 0}) => (
  <group position={p} rotation={rot}>
    <Esf r={0.07} s={[1.12, 0.92, 0.95]} m={LAR} line={0.8} seg={20} />
    {[-1, 1].map((l) => <group key={l} position={[l * 0.045, 0.055, -0.005]} rotation={[0, 0, -l * (0.35 + eriça * 0.25)]}><Co r={0.026} h={0.055} p={[0, 0.02, 0]} m={LAR} seg={10} line={0.6} /><Co r={0.014} h={0.03} p={[0, 0.018, 0.012]} m="#F6B9A8" seg={8} line={0} /></group>)}
    <Esf r={0.032} p={[0, -0.025, 0.045]} s={[1.3, 0.75, 0.7]} m="#FFF4E6" line={0.4} seg={12} />
    <OlhoGato x={0.03} tipo={olhoD || olhos} /><OlhoGato x={-0.03} tipo={olhos} />
    <Esf r={0.009} p={[0, -0.012, 0.074]} m="#E06A7A" line={0.3} seg={8} />
    {boca === 'w' ? [-1, 1].map((l) => <mesh key={'b' + l} position={[l * 0.008, -0.026, 0.07]} rotation={[0, 0, Math.PI]} material={B(LINHA)}><torusGeometry args={[0.008, 0.0028, 4, 8, Math.PI]} /></mesh>)
      : <mesh position={[0, -0.03, 0.07]} scale={[1, 1.3, 1]} material={B('#5A2328')}><circleGeometry args={[0.012, 12]} /></mesh>}
    {[-1, 1].map((l) => [0.006, -0.008].map((dy, j) => <Linha key={l + '' + j} a={[l * 0.03, -0.02 + dy, 0.06]} b={[l * (0.1 + eriça * 0.02), -0.012 + dy * 2.2 + eriça * 0.01, 0.05]} r={0.0018} sombra={false} />))}
  </group>
);
const Rabo = ({pts, r = 0.018}) => { const geo = React.useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((v) => new THREE.Vector3(...v))), 20, r, 8, false), [JSON.stringify(pts)]); return <Tn geo={geo} m={LAR} line={0.6} />; };
const Gato = ({pos, ry = 0, pose = 'dorme', olhos = 'fechado', olhoD, t = 0, eriça = 0, bal = 0, s = 1, resp = 0}) => {
  const r = 1 + 0.03 * Math.sin(t * 2.2);
  return (
    <group position={pos} rotation={[0, ry, bal]} scale={s}>
      {pose === 'dorme' ? <>
        <Esf r={0.12} p={[0, 0.07, 0]} s={[1.25, 0.6 * r, 0.95]} m={LAR} line={0.9} seg={24} />
        {[-0.05, 0.02, 0.09].map((x, i) => <mesh key={i} position={[x, 0.142 * r, -0.01]} rotation={[0.1, 0, 0.2]} scale={[0.35, 0.12, 1]} material={T(LAR2)}><sphereGeometry args={[0.05, 10, 6]} /></mesh>)}
        <CabGato p={[0.11, 0.075, 0.08]} rot={[0.15, 0.5, -0.25]} olhos={olhos} olhoD={olhoD} t={t} />
        <Rabo pts={[[-0.14, 0.04, -0.02], [-0.15, 0.03, 0.08], [-0.06, 0.025, 0.14], [0.04, 0.025, 0.15]]} />
        {[[0.07, 0.11], [0.0, 0.12]].map(([x, z], i) => <Esf key={'p' + i} r={0.024} p={[x, 0.02, z]} s={[1.3, 0.7, 1]} m={LAR} line={0.5} seg={10} />)}
      </> : null}
      {pose === 'pendura' ? <>
        {[-1, 1].map((l) => <Linha key={'b' + l} a={[l * 0.04, -0.07, 0.01]} b={[l * 0.03, 0.02, 0.0]} r={0.012} cor={LAR} />)}
        {[-1, 1].map((l) => <Esf key={'pm' + l} r={0.018} p={[l * 0.03, 0.025, 0.005]} m={LAR} line={0.5} seg={10} />)}
        <Esf r={0.1} p={[0, -0.2, 0]} s={[0.85, 1.35 * r, 0.8]} m={LAR} line={0.9} seg={22} />
        <Esf r={0.06} p={[0, -0.2, 0.05]} s={[0.8, 1.3, 0.6]} m="#FFF4E6" line={0} seg={14} />
        <CabGato p={[0, -0.055, 0.035]} rot={[0.1, 0, 0]} olhos={olhos} olhoD={olhoD} eriça={eriça} boca="o" t={t} />
        {[-1, 1].map((l) => <Linha key={'pe' + l} a={[l * 0.05, -0.3, 0]} b={[l * 0.06 + Math.sin(t * 5 + l) * 0.01, -0.39, 0.02]} r={0.013} cor={LAR} />)}
        <Rabo pts={[[0, -0.3, -0.06], [0.04, -0.4, -0.08], [0.0, -0.48, -0.04 + Math.sin(t * 4) * 0.02], [-0.04, -0.52, 0.0]]} />
        {eriça > 0 ? Array.from({length: 10}).map((_, i) => { const a = i / 10 * Math.PI * 2; return <Co key={'e' + i} r={0.015} h={0.05 * eriça} p={[Math.cos(a) * 0.088, -0.2 + Math.sin(a) * 0.13, -0.01]} rot={[0, 0, a - Math.PI / 2]} m={LAR} seg={6} line={0.4} />; }) : null}
      </> : null}
      {pose === 'salto' ? <>
        <Esf r={0.1} p={[0, 0, 0]} s={[0.8, 1.6, 0.8]} rot={[0, 0, 0.15]} m={LAR} line={0.9} seg={22} />
        <CabGato p={[0.02, 0.17, 0.03]} rot={[0.2, 0, 0.1]} olhos="grande" eriça={1} boca="o" t={t} />
        {[-1, 1].map((l) => <Linha key={'a' + l} a={[l * 0.05, 0.08, 0.01]} b={[l * 0.1, 0.2, 0.02]} r={0.012} cor={LAR} />)}
        {[-1, 1].map((l) => <Linha key={'c' + l} a={[l * 0.05, -0.12, 0]} b={[l * 0.08, -0.24, 0.02]} r={0.013} cor={LAR} />)}
        <Rabo pts={[[0, -0.14, -0.05], [0.03, -0.25, -0.08], [0.0, -0.33, -0.05]]} />
        {Array.from({length: 12}).map((_, i) => { const a = i / 12 * Math.PI * 2; return <Co key={'e' + i} r={0.016} h={0.06} p={[Math.cos(a) * 0.08, Math.sin(a) * 0.16, -0.01]} rot={[0, 0, a - Math.PI / 2]} m={LAR} seg={6} line={0.4} />; })}
      </> : null}
    </group>
  );
};

// ---------- casca de sala (piso, 3 paredes, teto com vigas) ----------
const Plano = ({p, rot, a, m, recebe = true}) => <mesh position={p} rotation={rot} material={m} receiveShadow={recebe}><planeGeometry args={a} /></mesh>;
const Sala = ({x = 0, piso, parede, lambri = '#8A5A34', teto = '#E9DCC4', larg = 5.2, prof = 4.4, alt = 2.8, janela, vista = 'cidade', janX = -0.4}) => {
  const L = larg / 2, zb = -2.2;
  return (
    <group position={[x, 0, 0]}>
      <Plano p={[0, 0, 0]} rot={[-Math.PI / 2, 0, 0]} a={[larg + 2, prof + 4]} m={piso} />
      <Plano p={[0, alt / 2, zb]} rot={[0, 0, 0]} a={[larg, alt]} m={parede} />
      <Plano p={[-L, alt / 2, zb + prof / 2]} rot={[0, Math.PI / 2, 0]} a={[prof, alt]} m={parede} />
      <Plano p={[L, alt / 2, zb + prof / 2]} rot={[0, -Math.PI / 2, 0]} a={[prof, alt]} m={parede} />
      <Plano p={[0, alt, zb + prof / 2]} rot={[Math.PI / 2, 0, 0]} a={[larg, prof]} m={T(teto)} recebe={false} />
      {[-1.2, 0, 1.2].map((z, i) => <Cx key={'vg' + i} a={[larg, 0.12, 0.14]} p={[0, alt - 0.06, z]} m="#7A4E2C" sombra={false} line={0.7} />)}
      {/* lambri (meia-parede de madeira) com rodapé */}
      <Cx a={[larg, 0.75, 0.04]} p={[0, 0.375, zb + 0.02]} m={lambri} sombra={false} line={0.7} />
      <Cx a={[larg, 0.05, 0.07]} p={[0, 0.77, zb + 0.035]} m="#6A4022" sombra={false} line={0.6} />
      {[-1, 1].map((l) => <group key={'lb' + l}><Cx a={[0.04, 0.75, prof]} p={[l * (L - 0.02), 0.375, zb + prof / 2]} m={lambri} sombra={false} line={0.7} /><Cx a={[0.07, 0.05, prof]} p={[l * (L - 0.035), 0.77, zb + prof / 2]} m="#6A4022" sombra={false} line={0.6} /></group>)}
      {janela ? <group position={[janX, 1.62, zb + 0.01]}>
        <mesh position={[0, 0, -0.3]} material={MAT('vistaM' + vista, () => new THREE.MeshBasicMaterial({map: texVista(vista), fog: false}))}><planeGeometry args={[janela[0] * 1.8, janela[1] * 1.6]} /></mesh>
        {/* recorte: a parede fica na frente; a janela é um buraco com moldura */}
        <Cx a={[janela[0] + 0.12, 0.08, 0.1]} p={[0, janela[1] / 2, 0.02]} m="#F2E6CF" line={0.7} sombra={false} />
        <Cx a={[janela[0] + 0.22, 0.07, 0.16]} p={[0, -janela[1] / 2, 0.05]} m="#F2E6CF" line={0.7} sombra={false} />
        {[-1, 1].map((l) => <Cx key={l} a={[0.08, janela[1], 0.1]} p={[l * janela[0] / 2, 0, 0.02]} m="#F2E6CF" line={0.7} sombra={false} />)}
        <Cx a={[0.04, janela[1], 0.05]} p={[0, 0, 0.0]} m="#F2E6CF" line={0.5} sombra={false} />
        <Cx a={[janela[0], 0.04, 0.05]} p={[0, 0, 0.0]} m="#F2E6CF" line={0.5} sombra={false} />
      </group> : null}
    </group>
  );
};
// parede de fundo com buraco de janela: a parede é feita em 4 pedaços em volta do vão
const ParedeComJanela = ({x = 0, larg = 5.2, alt = 2.8, jw, jh, jx = 0, jy = 1.62, m, z = -2.2}) => {
  const L = larg / 2, a = jx - jw / 2, b = jx + jw / 2, c = jy - jh / 2, d = jy + jh / 2;
  return <group position={[x, 0, z]}>
    <Plano p={[(-L + a) / 2, alt / 2, 0]} a={[a + L, alt]} m={m} />
    <Plano p={[(b + L) / 2, alt / 2, 0]} a={[L - b, alt]} m={m} />
    <Plano p={[jx, c / 2, 0]} a={[jw, c]} m={m} />
    <Plano p={[jx, (d + alt) / 2, 0]} a={[jw, alt - d]} m={m} />
  </group>;
};
const CabeloInv = ({er = 0, touca = 0}) => (
  <group>
    {[-1, 1].map((l) => [0, 1, 2].map((i) => <Esf key={l + '' + i} r={0.045} p={[l * (0.16 + i * 0.012), 0.2 + i * 0.035 + er * 0.03, -0.03 - i * 0.02]} s={[0.8, 1 + er * 0.8, 0.9]} rot={[0, 0, -l * er * 0.6]} m="#DCD7CF" line={0.5} seg={10} />))}
    {[-0.05, 0.03, 0.09].map((x, i) => <Co key={'t' + i} r={0.026} h={0.03 + er * 0.12} p={[x, 0.345 + er * 0.03, -0.02]} rot={[0, 0, -x * 4 + (i - 1) * er * 0.4]} m="#DCD7CF" seg={8} line={0.5} />)}
    {touca > 0 ? <group position={[0, 0.3, -0.01]} rotation={[-0.15, 0, 0.35]}><Co r={0.15} h={0.32} p={[0.05, 0.12, 0]} rot={[0, 0, -0.5]} m="#6A6FD6" seg={18} line={0.7} /><Ci rt={0.155} h={0.05} m="#F4F0FF" seg={20} line={0.6} /><Esf r={0.04} p={[0.22, 0.2, 0]} m="#F4F0FF" line={0.5} seg={10} /></group> : null}
  </group>
);
const Gravata = ({cor = '#B83A3A'}) => <group position={[0, 0.86, 0.13]} rotation={[0.2, 0, 0]}>{[-1, 1].map((l) => <Co key={l} r={0.032} h={0.06} p={[l * 0.03, 0, 0]} rot={[0, 0, -l * Math.PI / 2]} m={cor} seg={4} line={0.5} />)}<Esf r={0.014} m={cor} line={0.4} seg={8} /></group>;
const Colete = () => <group>{[0.58, 0.67, 0.76].map((y, i) => <Esf key={i} r={0.012} p={[0, y, 0.175 - (y - 0.58) * 0.1]} m="#6A4022" line={0.3} seg={8} />)}</group>;
const Passaro = ({p, t}) => <group position={p} rotation={[0, 0.6, 0]}><Esf r={0.05} s={[1.2, 1, 1]} m="#F7D24A" line={0.6} seg={12} /><Esf r={0.035} p={[0.05, 0.04, 0]} m="#F7D24A" line={0.5} seg={10} /><Co r={0.012} h={0.03} p={[0.09, 0.04, 0]} rot={[0, 0, -Math.PI / 2]} m="#E07A5F" seg={6} line={0.4} />{[-1, 1].map((l) => <Esf key={l} r={0.04} p={[-0.01, 0.02, l * 0.04]} s={[0.9, 0.25, 0.7]} rot={[l * (0.4 + Math.sin(t * 14) * 0.5), 0, 0]} m="#E9B44C" line={0.4} seg={8} />)}</group>;
// ================= vídeo 3: objetos =================
const fonteOk = () => typeof document !== 'undefined' && document.fonts && document.fonts.check('900 40px MontLE');
// plaquinha com texto em português (redesenha quando a fonte carrega)
const texPlaca = (txt, w, h, fundo, tinta, borda) => canvasTex('pl' + txt + w + h + fundo + tinta + (fonteOk() ? 1 : 0), Math.round(w * 1024), Math.round(h * 1024), (g, W, H) => {
  g.fillStyle = fundo; g.fillRect(0, 0, W, H);
  if (borda) { g.strokeStyle = borda; g.lineWidth = Math.min(W, H) * 0.06; g.strokeRect(0, 0, W, H); }
  const linhas = txt.split('\n'); let fs = H / (linhas.length * 1.25 + 0.3);
  g.font = `900 ${fs}px MontLE, sans-serif`; const mx = Math.max(...linhas.map((l) => g.measureText(l).width)); if (mx > W * 0.88) fs *= W * 0.88 / mx;
  g.font = `900 ${fs}px MontLE, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = tinta;
  linhas.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (linhas.length - 1) / 2) * fs * 1.15 + fs * 0.05));
});
const Placa = ({p, rot = [0, 0, 0], txt, w = 0.6, h = 0.25, fundo = '#FFF4D6', tinta = '#372C2E', borda = '#372C2E', moldura = '#8A5A34', fio = false, s = 1}) => {
  const m = MAT('plm' + txt + w + h + fundo + tinta + (fonteOk() ? 1 : 0), () => new THREE.MeshBasicMaterial({map: texPlaca(txt, w, h, fundo, tinta, borda), toneMapped: false}));
  return <group position={p} rotation={rot} scale={s}>
    {moldura ? <Cx a={[w + 0.04, h + 0.04, 0.02]} p={[0, 0, -0.012]} m={moldura} line={0.6} sombra={false} /> : null}
    <mesh material={m}><planeGeometry args={[w, h]} /></mesh>
    {fio ? <><Linha a={[-w * 0.35, h / 2, -0.005]} b={[0, h / 2 + 0.12, -0.005]} r={0.004} /><Linha a={[w * 0.35, h / 2, -0.005]} b={[0, h / 2 + 0.12, -0.005]} r={0.004} /><Esf r={0.012} p={[0, h / 2 + 0.12, -0.005]} m="#8E98A3" line={0.3} seg={8} /></> : null}
  </group>;
};
const Papel = ({p, rot = [0, 0, 0], s = 1, cor = '#FBF4E2'}) => <Cx a={[0.16 * s, 0.003, 0.21 * s]} p={p} rot={rot} m={cor} line={0.35} sombra={false} />;
const Chapeu = ({cor = '#3A3436', y = 0.3}) => <group position={[0, y, -0.005]}><Ci rt={0.2} h={0.015} m={cor} line={0.6} seg={24} /><Esf r={0.13} p={[0, 0.03, 0]} s={[1, 0.7, 1]} m={cor} line={0.6} seg={18} /><Ci rt={0.132} h={0.025} p={[0, 0.02, 0]} m="#B83A3A" line={0} seg={20} /></group>;
// relógio de parede
const RelParede = ({p, t, vel = 1}) => <group position={p}><Ci rt={0.16} h={0.04} rot={[Math.PI / 2, 0, 0]} m="#F4F0E6" line={0.8} seg={28} /><Ci rt={0.17} h={0.03} p={[0, 0, -0.01]} rot={[Math.PI / 2, 0, 0]} m="#8A5A34" line={0.6} seg={28} />
  <group position={[0, 0, 0.025]} rotation={[0, 0, -t * vel]}><Cx a={[0.012, 0.13, 0.005]} p={[0, 0.06, 0]} m={LINHA} line={0} /></group>
  <group position={[0, 0, 0.028]} rotation={[0, 0, -t * vel / 12]}><Cx a={[0.016, 0.09, 0.005]} p={[0, 0.04, 0]} m={LINHA} line={0} /></group></group>;
// confete (pedacinhos de papel caindo e girando)
const CONF = Array.from({length: 60}).map((_, i) => [Math.sin(i * 12.9898) * 0.5 + 0.5, Math.sin(i * 78.233) * 0.5 + 0.5, Math.sin(i * 39.42) * 0.5 + 0.5, ['#E84A5F', '#F7D24A', '#4AA3E8', '#7FD08A', '#B57FE0', '#FF9A3C'][i % 6]]);
const Confete = ({c, t, t0, area = [2, 2, 1], n = 60}) => { const u = t - t0; if (u < 0 || u > 4) return null; return <group position={c}>{CONF.slice(0, n).map(([a, b, d, cor], i) => <mesh key={i} position={[(a - 0.5) * area[0] + Math.sin(u * 2 + i) * 0.05, area[1] - ((u * (0.5 + b * 0.5) + b * 0.3) * 0.9) % (area[1] + 0.3), (d - 0.5) * area[2]]} rotation={[u * 5 + i, u * 3 + i, 0]} material={T(cor, {side: THREE.DoubleSide})}><planeGeometry args={[0.03, 0.02]} /></mesh>)}</group>; };
const Poste = ({p, acesa = 0.6}) => <group position={p}><Ci rt={0.03} h={2.2} p={[0, 1.1, 0]} m="#2E3440" line={0.7} seg={10} /><Cx a={[0.16, 0.22, 0.16]} p={[0, 2.25, 0]} m={MAT('lampPoste', () => new THREE.MeshBasicMaterial({color: '#FFE7A0'}))} line={0.7} /><Co r={0.14} h={0.1} p={[0, 2.41, 0]} m="#2E3440" line={0.6} seg={4} /></group>;
// fachada de prédio (tijolo, janelas)
const texFachada = (k, cor) => canvasTex('fach' + k, 512, 1024, (g, w, h) => {
  g.fillStyle = cor; g.fillRect(0, 0, w, h); SEED = 3 + k.length;
  for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? -16 : 0; x < w; x += 32) { g.fillStyle = `rgba(0,0,0,${0.04 + rnd() * 0.06})`; g.fillRect(x + 1, y + 1, 30, 14); }
  for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) { const x = 60 + i * 150, y = 90 + j * 190; g.fillStyle = '#F2E6CF'; g.fillRect(x - 8, y - 8, 106, 146); g.fillStyle = rnd() > 0.5 ? '#FFE3A0' : '#7FA3C2'; g.fillRect(x, y, 90, 130); g.strokeStyle = '#372C2E'; g.lineWidth = 6; g.strokeRect(x, y, 90, 130); g.beginPath(); g.moveTo(x + 45, y); g.lineTo(x + 45, y + 130); g.moveTo(x, y + 65); g.lineTo(x + 90, y + 65); g.stroke(); }
});
const Fachada = ({p, w = 2, h = 4, k = 'a', cor = '#B86A4E'}) => <group position={p}><mesh position={[0, h / 2, 0]} material={MAT('fachM' + k, () => new THREE.MeshToonMaterial({map: texFachada(k, cor), gradientMap: GRAD}))} receiveShadow><boxGeometry args={[w, h, 0.4]} /></mesh><mesh position={[0, h / 2, 0]} material={HULL(1)}><boxGeometry args={[w, h, 0.4]} /></mesh><Cx a={[w + 0.1, 0.12, 0.5]} p={[0, h, 0]} m="#E9DCC4" line={0.6} /></group>;
// torre do relógio ao fundo (silhueta pintada)
const Torre = ({p, s = 1}) => <group position={p} scale={s}><Cx a={[1.2, 7, 1.2]} p={[0, 3.5, 0]} m="#C9B48A" line={1} /><Cx a={[1.4, 1.5, 1.4]} p={[0, 7.6, 0]} m="#D9C49A" line={1} />{[0, 1, 2, 3].map((i) => <group key={i} rotation={[0, i * Math.PI / 2, 0]}><Ci rt={0.5} h={0.05} p={[0, 7.6, 0.71]} rot={[Math.PI / 2, 0, 0]} m="#F4F0E6" line={0.8} seg={24} /><Cx a={[0.05, 0.4, 0.02]} p={[0, 7.75, 0.74]} m={LINHA} line={0} /><Cx a={[0.3, 0.05, 0.02]} p={[0.12, 7.6, 0.74]} m={LINHA} line={0} /></group>)}<Co r={1.0} h={2.4} p={[0, 9.5, 0]} m="#5E6A72" line={1} seg={4} /></group>;
// cortina vermelha (palco)
const Cortina = ({p, w = 1.5, h = 3, abre = 0}) => <group position={p}>{Array.from({length: 8}).map((_, i) => <Ci key={i} rt={0.1} h={h} p={[(i - 3.5) * w / 8, h / 2, Math.sin(i * 1.7) * 0.03]} m={i % 2 ? '#B3263A' : '#C93244'} line={0.6} seg={12} />)}</group>;
const Medalha = ({p, rot = [0, 0, 0], s = 1}) => <group position={p} rotation={rot} scale={s}><Linha a={[-0.05, 0.12, 0]} b={[0, 0, 0]} r={0.006} cor="#3A62B8" /><Linha a={[0.05, 0.12, 0]} b={[0, 0, 0]} r={0.006} cor="#3A62B8" /><Ci rt={0.035} h={0.012} p={[0, -0.03, 0]} rot={[Math.PI / 2, 0, 0]} m={OURO()} line={0.5} seg={18} /></group>;
// barraca de campanha
const Barraca = ({p, ry = 0, s = 1, cor = '#8C8A4E', cruz = false}) => <group position={p} rotation={[0, ry, 0]} scale={s}>
  <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0]} castShadow receiveShadow material={T(cor)}><cylinderGeometry args={[0.001, 0.9, 1.1, 4, 1]} /></mesh><mesh position={[0, 0.55, 0]} material={HULL(1)}><cylinderGeometry args={[0.001, 0.9, 1.1, 4, 1]} /></mesh>
  {cruz ? <group position={[0, 0.5, 0.5]} rotation={[-0.45, Math.PI / 4 * 0, 0]}><Cx a={[0.22, 0.07, 0.01]} m="#D8323C" line={0.3} /><Cx a={[0.07, 0.22, 0.01]} m="#D8323C" line={0.3} /></group> : null}</group>;
const Sacos = ({p, n = 5, ry = 0}) => <group position={p} rotation={[0, ry, 0]}>{Array.from({length: n * 2 - 1}).map((_, i) => { const lin = i < n ? 0 : 1, j = lin ? i - n : i; return <Esf key={i} r={0.12} s={[1.6, 0.6, 1]} p={[(j - (n - 1) / 2 + lin * 0.5) * 0.36, 0.07 + lin * 0.13, 0]} m="#B9A57A" line={0.6} seg={12} />; })}</group>;
const Capacete = ({cor = '#6E6F44', y = 0.27}) => <group position={[0, y, 0]}><Ci rt={0.23} rb={0.24} h={0.018} m={cor} line={0.6} seg={24} /><Esf r={0.15} p={[0, 0.0, 0]} s={[1, 0.62, 1]} m={cor} line={0.6} seg={18} /></group>;
const Seringa = ({p, rot = [0, 0, 0], s = 1}) => <group position={p} rotation={rot} scale={s}><Ci rt={0.018} h={0.12} m="#E4F3F8" line={0.5} seg={10} /><Ci rt={0.014} h={0.08} p={[0, -0.015, 0]} m="#F2C94C" line={0} seg={10} /><Linha a={[0, -0.06, 0]} b={[0, -0.12, 0]} r={0.003} cor="#C9CED6" /><Cx a={[0.05, 0.01, 0.02]} p={[0, 0.065, 0]} m="#C9CED6" line={0.3} /></group>;
const Cama = ({p, ry = 0}) => <group position={p} rotation={[0, ry, 0]}><Cx a={[0.8, 0.25, 1.5]} p={[0, 0.2, 0]} m="#8A5A34" line={0.8} /><Cx a={[0.78, 0.12, 1.45]} p={[0, 0.38, 0]} m="#7FB8E0" line={0.7} /><Cx a={[0.5, 0.08, 0.25]} p={[0, 0.48, -0.55]} m="#FFFFFF" line={0.6} /><Cx a={[0.82, 0.6, 0.06]} p={[0, 0.4, -0.75]} m="#8A5A34" line={0.8} /></group>;
const Brinquedo = ({p, tipo = 0, rot = 0}) => tipo === 0 ? <Cx a={[0.12, 0.12, 0.12]} p={[p[0], p[1] + 0.06, p[2]]} rot={[0, rot, 0]} m={['#E84A5F', '#4AA3E8', '#F7D24A'][Math.abs(Math.round(rot * 3)) % 3]} line={0.6} /> : tipo === 1 ? <Esf r={0.08} p={[p[0], p[1] + 0.08, p[2]]} m="#F7D24A" line={0.6} seg={14} /> : <Cx a={[0.3, 0.01, 0.25]} p={[p[0], p[1] + 0.005, p[2]]} rot={[0, rot, 0]} m={['#7FD08A', '#B57FE0'][Math.abs(Math.round(rot * 5)) % 2]} line={0.4} sombra={false} />;
const Brilhos = ({pts, t, t0 = 0, s = 0.12, id = 300}) => <>{pts.map((q, i) => { const u = ((t - t0) * 1.3 + i * 0.37) % 1; return <Brilho key={i} id={id + i} p={q} k={t > t0 ? u : 0} s={s} />; })}</>;
const texPedras = () => canvasTex('pedras', 1024, 1024, (g, w) => { SEED = 5; g.fillStyle = '#8E8A86'; g.fillRect(0, 0, w, w); for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) { const x = i * 64 + (j % 2) * 32, y = j * 64; g.fillStyle = ['#A39E98', '#9A948E', '#B0AAA2'][Math.floor(rnd() * 3)]; g.beginPath(); g.ellipse(x + 32, y + 32, 28, 26, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(55,44,46,0.6)'; g.lineWidth = 4; g.stroke(); } }, [8, 8]);
const texLama = () => canvasTex('lama', 1024, 1024, (g, w) => { SEED = 9; g.fillStyle = '#8A6A44'; g.fillRect(0, 0, w, w); for (let i = 0; i < 160; i++) { g.fillStyle = ['#7A5C3A', '#9C7A50', '#6E5234'][i % 3]; g.globalAlpha = 0.5; g.beginPath(); g.ellipse(rnd() * w, rnd() * w, 20 + rnd() * 70, 10 + rnd() * 30, rnd() * 3, 0, 7); g.fill(); } g.globalAlpha = 1; }, [6, 6]);
const Chao = ({p, a = [40, 40], m}) => <mesh position={p} rotation={[-Math.PI / 2, 0, 0]} material={m} receiveShadow><planeGeometry args={a} /></mesh>;
const PM = (pos, ry, v) => [pos[0] + v[0] * Math.cos(ry) + v[2] * Math.sin(ry), pos[1] + v[1], pos[2] - v[0] * Math.sin(ry) + v[2] * Math.cos(ry)];
const passo = (t, k = 1, vel = 9) => (l) => { const f = Math.sin(t * vel + (l > 0 ? 0 : Math.PI)); return [l * 0.075, 0.03 + Math.max(0, f) * 0.06 * k, 0.005 + f * 0.1 * k]; };
const quica = (t, k = 1, vel = 9) => Math.abs(Math.sin(t * vel)) * 0.025 * k;
const caminho = (t, pts) => { // pts: [t, [x,y,z], ry]; devolve pos, ry e se está andando
  if (t <= pts[0][0]) return {pos: pts[0][1], ry: pts[0][2], anda: 0};
  for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [t0, p0, r0] = pts[i - 1], [t1, p1, r1] = pts[i]; const u = cl((t - t0) / (t1 - t0)); const mov = Math.hypot(p1[0] - p0[0], p1[2] - p0[2]) > 0.01; return {pos: mix(p0, p1, io(u)), ry: lerp(r0, r1, cl(u * 3)), anda: mov ? 1 : 0}; }
  const l = pts[pts.length - 1]; return {pos: l[1], ry: l[2], anda: 0};
};
// boca falando: abre e fecha nas sílabas das palavras de um trecho
const fala = (t, t0, t1) => { if (t < t0 || t > t1) return null; for (const p of PALAVRAS) if (t >= p.s && t <= p.e) return Math.sin((t - p.s) * 26) > 0 ? 'O' : 'sorrisoD'; return 'sorriso'; };
const OculosSol = () => <group>{[-1, 1].map((l) => <mesh key={l} position={[l * 0.062, 0.19, 0.163]} rotation={[0, l * 0.35, 0]} scale={[1, 0.8, 0.4]} material={B('#2E2A2E')}><sphereGeometry args={[0.048, 14, 10]} /></mesh>)}<Linha a={[-0.02, 0.2, 0.17]} b={[0.02, 0.2, 0.17]} r={0.006} /></group>;
const Colar = () => <group position={[0, 0.8, 0.02]}>{Array.from({length: 14}).map((_, i) => { const a = i / 14 * Math.PI * 2; return <Esf key={i} r={0.03} p={[Math.cos(a) * 0.15, -0.05 - Math.max(0, Math.sin(a)) * 0.08 + 0.04, Math.sin(a) * 0.14 + 0.03]} m={['#F25C8A', '#F7D24A', '#FF9A3C'][i % 3]} line={0.3} seg={8} />; })}</group>;
const Oculos = () => <group>{[-1, 1].map((l) => <mesh key={l} position={[l * 0.062, 0.19, 0.162]} rotation={[0, l * 0.35, 0]} material={B(LINHA)}><torusGeometry args={[0.045, 0.006, 6, 20]} /></mesh>)}<Linha a={[-0.018, 0.2, 0.17]} b={[0.018, 0.2, 0.17]} r={0.005} /></group>;
const Jaleco = () => <group>{[0.52, 0.62, 0.72].map((y, i) => <Esf key={i} r={0.012} p={[0.03, y, 0.18 - (y - 0.52) * 0.08]} m="#A9B4C6" line={0.3} seg={8} />)}<Cx a={[0.07, 0.07, 0.01]} p={[-0.08, 0.68, 0.16]} rot={[-0.15, 0.4, 0]} m="#DCE6EE" line={0.4} /></group>;
const Topete = ({cor = '#6A4022'}) => <group><Tn geo={<sphereGeometry args={[0.17, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.4]} />} p={[0, 0.18, -0.01]} m={cor} line={0.6} /><Esf r={0.07} p={[0.03, 0.33, 0.07]} s={[1.3, 0.8, 1]} rot={[0.4, 0, 0.3]} m={cor} line={0.6} seg={12} /></group>;
const Coque = ({cor = '#8A4A2A'}) => <group><Tn geo={<sphereGeometry args={[0.172, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.45]} />} p={[0, 0.17, -0.01]} m={cor} line={0.6} /><Esf r={0.08} p={[0, 0.36, -0.08]} m={cor} line={0.6} seg={12} /></group>;
const Touca = () => <group position={[0, 0.3, 0]}><Ci rt={0.12} rb={0.15} h={0.08} m="#FFFFFF" line={0.6} seg={18} /><Cx a={[0.06, 0.018, 0.005]} p={[0, 0.0, 0.14]} m="#D8323C" line={0} /><Cx a={[0.018, 0.06, 0.005]} p={[0, 0.0, 0.14]} m="#D8323C" line={0} /></group>;
// ---------- céu e luz ----------
const CEU = new THREE.ShaderMaterial({side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: 'varying vec3 vp; void main(){ vp = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  uniforms: {noite: {value: 0}}, fragmentShader: 'uniform float noite; varying vec3 vp; void main(){ float h = clamp(vp.y*1.5+0.05,0.0,1.0); vec3 c = mix(vec3(0.86,0.93,0.98), vec3(0.24,0.52,0.9), pow(h,0.6)); vec3 n = mix(vec3(0.62,0.45,0.78), vec3(0.18,0.16,0.42), pow(h,0.6)); gl_FragColor = vec4(mix(c, n, noite),1.0); }'});
const Ceu = ({c, noite = 0}) => { CEU.uniforms.noite.value = noite; return <mesh position={c.pos} material={CEU} renderOrder={-1}><sphereGeometry args={[650, 32, 16]} /></mesh>; };
const Sol = ({alvo, area, luz: kLuz = 1, dir = [-8, 6.4, 5]}) => {
  const k = Math.max(1, area / 4);
  const tgt = React.useMemo(() => new THREE.Object3D(), []);
  const luz = React.useMemo(() => { const l = new THREE.DirectionalLight('#FFE2B4', 2.7); l.castShadow = true; l.shadow.mapSize.set(2048, 2048); l.shadow.bias = -0.0004; l.shadow.normalBias = 0.02; l.target = tgt; return l; }, [tgt]);
  tgt.position.set(...alvo); tgt.updateMatrixWorld(true);
  luz.position.set(alvo[0] + dir[0] * k, alvo[1] + dir[1] * k, alvo[2] + dir[2] * k); luz.updateMatrixWorld(true);
  const sc = luz.shadow.camera; sc.left = -area; sc.right = area; sc.top = area; sc.bottom = -area; sc.near = 0.5; sc.far = area * 8 + 40; sc.updateProjectionMatrix();
  luz.shadow.needsUpdate = true; luz.intensity = 2.5 * kLuz;
  return (
    <>
      <hemisphereLight args={['#9D86EC', '#9A82B4', 1.1 * (0.35 + 0.65 * kLuz)]} />
      <primitive object={tgt} />
      <primitive object={luz} />
      <directionalLight position={[alvo[0] + 6, alvo[1] + 4, alvo[2] + 7]} intensity={0.55} color="#FFE6C2" />
    </>
  );
};
const PapeisCaindo = ({c, t, t0, n = 10, alt = 1.2, area = 1}) => { const u = t - t0; if (u < 0 || u > 2.5) return null; return <group position={c}>{Array.from({length: n}).map((_, i) => { const y = alt - (u * (0.55 + (i % 4) * 0.12) + (i % 3) * 0.1); if (y < 0.01) return null; return <Papel key={i} p={[Math.sin(i * 4.1) * area + Math.sin(u * 3 + i) * 0.12, y, Math.cos(i * 2.3) * area * 0.5]} rot={[Math.sin(u * 4 + i) * 0.6, i, Math.cos(u * 3 + i) * 0.6]} />; })}</group>; };
const Pessoa = ({P}) => P && P.vis !== false ? <Boneco pos={P.pos} ry={P.ry} c={P.c} /> : null;
const Pequeno = ({P, s = 0.72}) => { const rel = (m) => m ? [(m[0] - P.pos[0]) / s, (m[1] - P.pos[1]) / s, (m[2] - P.pos[2]) / s] : undefined; return <group position={P.pos} scale={s}><Boneco pos={[0, 0, 0]} ry={P.ry} c={{...P.c, mP: rel(P.c.mP), mN: rel(P.c.mN)}} /></group>; };

const VEL = '#C2483E', VEL2 = '#A63A34';
const Poltrona = ({p, cor = VEL, cor2 = VEL2, rot = 0, esmaga = 0}) => (
  <group position={p} rotation={[0, rot, 0]} scale={[1 + esmaga * 0.12, 1 - esmaga * 0.18, 1 + esmaga * 0.12]}>
    {[[-0.27, -0.2], [0.27, -0.2], [-0.27, 0.2], [0.27, 0.2]].map(([x, z], i) => <Co key={i} r={0.03} h={0.15} p={[x, 0.075, z]} rot={[Math.PI, 0, 0]} m="#5A3720" seg={8} line={0.5} />)}
    <Cx a={[0.62, 0.22, 0.5]} p={[0, 0.25, 0]} m={cor} />
    <Cx a={[0.47, 0.08, 0.44]} p={[0, 0.4, 0.03]} m={cor2} line={0.7} />
    <Cx a={[0.62, 0.64, 0.12]} p={[0, 0.66, -0.2]} m={cor} />
    <Ci rt={0.07} h={0.66} p={[0, 0.98, -0.2]} rot={[0, 0, Math.PI / 2]} m={cor} />
    {[-1, 1].map((l) => <group key={l}><Cx a={[0.09, 0.2, 0.5]} p={[l * 0.285, 0.47, 0.0]} m={cor} /><Ci rt={0.055} h={0.52} p={[l * 0.285, 0.57, 0.0]} rot={[Math.PI / 2, 0, 0]} m={cor} /></group>)}
    {[[-0.15, 0.82], [0.15, 0.82], [0, 0.66], [-0.15, 0.5], [0.15, 0.5]].map(([x, y], i) => <Esf key={'b' + i} r={0.016} p={[x, y, -0.137]} m="#E9B44C" line={0.4} seg={8} />)}
  </group>
);

// ================= vídeo 4: tempos da fala =================
const norm = (w) => w.toLowerCase().replace(/[.,!?:"…]/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '');
const W_ = (txt, n = 0) => { let c = 0; for (const p of PALAVRAS) if (norm(p.w) === txt) { if (c === n) return p.s; c++; } throw new Error('palavra ' + txt + ' ' + n); };
const E_ = (txt, n = 0) => { let c = 0; for (const p of PALAVRAS) if (norm(p.w) === txt) { if (c === n) return p.e; c++; } throw new Error('palavra ' + txt + ' ' + n); };
const TM = {};
[['esse'], ['zoado'], ['paris'], ['pulseirinha'], ['em', 1], ['quatro'], ['homem'], ['usava'], ['relogio'], ['bolso'], ['corrente'], ['colete'], ['bigode'], ['relogio', 1], ['pulso'], ['isso'], ['joia'], ['madame'],
 ['so'], ['alberto'], ['problema'], ['ele'], ['pilotava'], ['duas'], ['maos'], ['la'], ['horas'], ['soltar'], ['comando'], ['cavar'], ['colete', 1], ['abrir'], ['tampinha'], ['torcer'], ['virar'], ['panqueca'],
 ['entao'], ['reclama'], ['amigo'], ['joalheiro'], ['louis'], ['cartier', 1], ['faz'], ['relogio', 2], ['quadrado'], ['preso'], ['pulso', 1], ['tira'], ['couro'],
 ['paris', 1], ['perdoa'], ['o', 5], ['alberto', 1], ['baile'], ['pulseira'], ['mas'], ['liga'], ['voa'], ['relogio', 3], ['cronometra'], ['recorde'],
 ['ai'], ['virada'], ['dez'], ['depois'], ['comeca'], ['guerra'], ['na'], ['trincheira'], ['ninguem'], ['cavar', 1], ['bolso', 1], ['ainda'], ['luva'], ['lama'],
 ['dezessete'], ['exercito'], ['entregar'], ['relogio', 4], ['tropa'], ['quem'], ['voltou'], ['largou'], ['bolso', 2], ['virou'], ['vovo'],
 ['detalhe'], ['inventou'], ['oitocentos'], ['dez', 1], ['feito'], ['rainha'], ['ele', 4], ['fez'], ['homem', 1], ['vergonha'],
 ['tipo'], ['fone'], ['parecia'], ['ridiculo'], ['ate'], ['voce'], ['comprar'], ['seu'], ['qual'], ['moda'], ['normal'], ['amanha'], ['comenta']].forEach(([w, n = 0]) => { TM[w + (n ? n + 1 : '')] = W_(w, n); });
TM.fim = DUR_RL / 30;

// cenários separados no mundo; só o do plano atual é desenhado
const XPAR = 0, XCEU = 40, XMAX = 90, XOFI = 110, XCAM = 140, XCAL = 180, XTRI = 200, XVOV = 230, XPAL = 250, XQUA = 270;

// ================= objetos =================
const DOURADO = '#E2B84A';
// relógio de bolso: tampa que abre, corrente
const RelBolso = ({p, rot = [0, 0, 0], s = 1, abre = 0, t = 0}) => (
  <group position={p} rotation={rot} scale={s}>
    <Ci rt={0.035} h={0.012} rot={[Math.PI / 2, 0, 0]} m={OURO()} seg={20} line={0.5} />
    <mesh position={[0, 0, 0.0065]} material={B('#FBF4E2')}><circleGeometry args={[0.029, 20]} /></mesh>
    <group position={[0, 0, 0.007]} rotation={[0, 0, -t * 2]}><Cx a={[0.003, 0.022, 0.002]} p={[0, 0.01, 0]} m={LINHA} line={0} /></group>
    <Ci rt={0.007} h={0.012} p={[0, 0.04, 0]} m={OURO()} seg={8} line={0.3} />
    <group position={[0, 0.035, 0.006]} rotation={[-abre * 2.2, 0, 0]}><Ci rt={0.035} h={0.006} p={[0, -0.035, 0.003]} rot={[Math.PI / 2, 0, 0]} m={OURO()} seg={20} line={0.5} /></group>
  </group>
);
// relógio de pulso quadrado (o "Santos")
const texMostrador = () => canvasTex('mostrador', 256, 256, (g, w) => {
  g.fillStyle = '#FFFBF0'; g.fillRect(0, 0, w, w); g.fillStyle = LINHA; g.font = '900 34px serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  ['XII', 'III', 'VI', 'IX'].forEach((r, i) => { const a = i * Math.PI / 2 - Math.PI / 2; g.fillText(r, w / 2 + Math.cos(a) * 88, w / 2 + Math.sin(a) * 88); });
  g.strokeStyle = '#2E4A9B'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(w / 2, w / 2); g.lineTo(w / 2 + 40, w / 2 - 40); g.stroke(); g.beginPath(); g.moveTo(w / 2, w / 2); g.lineTo(w / 2, w / 2 - 70); g.stroke();
});
const RelPulso = ({p, rot = [0, 0, 0], s = 1, tira = 1, parafusos = 1, brilho = 0, id = 0}) => (
  <group position={p} rotation={rot} scale={s}>
    <Cx a={[0.05, 0.05, 0.012]} m={OURO()} line={0.6} />
    <mesh position={[0, 0, 0.0065]} material={MAT('mostM', () => new THREE.MeshBasicMaterial({map: texMostrador()}))}><planeGeometry args={[0.04, 0.04]} /></mesh>
    {parafusos > 0 ? [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, y], i) => <Ci key={i} rt={0.004} h={0.004} p={[x * 0.021, y * 0.021, 0.008 + (1 - cl(parafusos * 4 - i)) * 0.06]} rot={[Math.PI / 2, (1 - cl(parafusos * 4 - i)) * 9, 0]} m={OURO()} seg={6} line={0.2} />) : null}
    {tira > 0 ? [-1, 1].map((l) => <Cx key={l} a={[0.032, 0.06 * tira, 0.006]} p={[0, l * (0.025 + 0.03 * tira), -0.001]} m="#7A4A26" line={0.4} />) : null}
    {brilho > 0 ? <Brilho id={500 + id} p={[0.02, 0.02, 0.02]} k={brilho} s={0.08} /> : null}
  </group>
);
// relógio de pulso no braço de um boneco: fica entre a mão e o cotovelo
const NoPulso = ({P, lado = -1, s = 1}) => { if (!P || P.vis === false) return null; const m = lado < 0 ? (P.c.mN || maoRepouso(P.pos, P.ry, -1)) : (P.c.mP || maoRepouso(P.pos, P.ry, 1)); const o = PM(P.pos, P.ry, [lado * 0.148, 0.79, 0]); const q = mix(m, o, 0.16);
  return <RelPulso p={q} rot={[0, P.ry, 0]} s={0.55 * s} />; };
// pulseira feminina (vitrine)
const Pulseira = ({p, rot = [0, 0, 0], s = 1, cor = '#E84A8A'}) => <group position={p} rotation={rot} scale={s}><mesh material={OURO()}><torusGeometry args={[0.06, 0.008, 8, 24]} /></mesh>{[0, 1, 2, 3, 4, 5].map((i) => <Esf key={i} r={0.012} p={[Math.cos(i * 1.05) * 0.06, Math.sin(i * 1.05) * 0.06, 0.006]} m={[cor, '#7FD0E8', '#FFFFFF'][i % 3]} line={0.3} seg={8} />)}</group>;
const Cartola = ({cor = '#2B2629', y = 0.3, inc = 0}) => <group position={[0, y, 0]} rotation={[0, 0, inc]}><Ci rt={0.19} h={0.014} m={cor} line={0.6} seg={24} /><Ci rt={0.12} rb={0.125} h={0.26} p={[0, 0.13, 0]} m={cor} line={0.6} seg={20} /><Ci rt={0.127} h={0.04} p={[0, 0.03, 0]} m="#8A2E3C" line={0} seg={20} /></group>;
// panamá do Dumont: aba larga e caída
const Panama = ({y = 0.3}) => <group position={[0, y, 0]} rotation={[0.12, 0, 0]}>
  <Tn geo={<cylinderGeometry args={[0.26, 0.29, 0.03, 26, 1, true]} />} p={[0, -0.01, 0]} m={T('#EFE3C2', {side: THREE.DoubleSide})} line={0.6} />
  <Ci rt={0.26} h={0.012} p={[0, 0.005, 0]} m="#EFE3C2" line={0.5} seg={26} />
  <Ci rt={0.13} rb={0.14} h={0.13} p={[0, 0.07, 0]} m="#EFE3C2" line={0.6} seg={20} /><Ci rt={0.142} h={0.035} p={[0, 0.03, 0]} m="#3A3F4A" line={0} seg={20} />
</group>;
const BigodeFino = () => <group position={[0, 0.135, 0.165]}>{[-1, 1].map((l) => <Esf key={l} r={1} s={[0.045, 0.011, 0.012]} p={[l * 0.04, 0, 0]} rot={[0, 0, -l * 0.25]} m={LINHA} line={0} seg={10} />)}</group>;
const BigodeGrosso = ({cor = LINHA}) => <group position={[0, 0.13, 0.165]}>{[-1, 1].map((l) => <Esf key={l} r={1} s={[0.06, 0.025, 0.02]} p={[l * 0.045, 0, 0]} rot={[0, 0, -l * 0.35]} m={cor} line={0.3} seg={12} />)}</group>;
const CabeloRisca = () => <group><Tn geo={<sphereGeometry args={[0.172, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.36]} />} p={[0, 0.17, -0.012]} rot={[-0.3, 0, 0]} m="#2B2326" line={0.6} /></group>;
const Monoculo = ({cai = 0}) => cai > 0.99 ? null : <group position={[0.062, 0.19 - cai * 0.6, 0.168 + cai * 0.1]} rotation={[0, 0.3, cai * 6]}><mesh material={OURO()}><torusGeometry args={[0.05, 0.006, 6, 20]} /></mesh><Linha a={[0.04, -0.03, 0]} b={[0.08, -0.25, -0.05]} r={0.002} cor={DOURADO} /></group>;
const Colarinho = () => <group><Ci rt={0.105} rb={0.12} h={0.06} p={[0, 0.84, 0.0]} m="#FFFFFF" line={0.5} seg={18} aberto /></group>;
const Corrente = () => <group><Linha a={[-0.11, 0.6, 0.165]} b={[0, 0.56, 0.18]} r={0.004} cor={DOURADO} /><Linha a={[0, 0.56, 0.18]} b={[0.11, 0.6, 0.165]} r={0.004} cor={DOURADO} /><Esf r={0.012} p={[0.115, 0.6, 0.162]} m={OURO()} line={0.3} seg={8} /></group>;
const Lupa = () => <group position={[0.062, 0.19, 0.175]} rotation={[Math.PI / 2, 0, 0]}><Ci rt={0.045} rb={0.035} h={0.07} p={[0, 0.03, 0]} m="#2B2629" line={0.5} seg={14} /></group>;
const Luvas = ({P, cor = '#7A5A3A'}) => P ? <>{[P.c.mP || maoRepouso(P.pos, P.ry, 1), P.c.mN || maoRepouso(P.pos, P.ry, -1)].map((m, i) => <Esf key={i} r={0.034} p={m} m={cor} line={0.5} seg={12} />)}</> : null;
const Fones = () => <group>{[-1, 1].map((l) => <Esf key={l} r={0.022} s={[0.8, 1, 0.8]} p={[l * 0.172, 0.15, 0.02]} m="#FFFFFF" line={0.4} seg={10} />)}</group>;
const Coroa = () => <group position={[0, 0.31, 0]}><Ci rt={0.11} h={0.05} m={OURO()} line={0.5} seg={18} aberto />{[0, 1, 2, 3, 4].map((i) => <Esf key={i} r={0.016} p={[Math.cos(i * 1.256) * 0.11, 0.04, Math.sin(i * 1.256) * 0.11]} m={['#E84A8A', '#7FD0E8'][i % 2]} line={0.3} seg={8} />)}</group>;
const CabeloRainha = () => <group><Tn geo={<sphereGeometry args={[0.175, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />} p={[0, 0.16, -0.015]} m="#6A3A22" line={0.6} />{[-1, 1].map((l) => <Esf key={l} r={0.05} p={[l * 0.16, 0.12, -0.02]} s={[0.7, 1.3, 0.8]} m="#6A3A22" line={0.5} seg={10} />)}</group>;
const CabeloMenino = () => <group><Tn geo={<sphereGeometry args={[0.174, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.4]} />} p={[0, 0.17, -0.01]} rot={[-0.15, 0, 0]} m="#4A3022" line={0.6} />{[0, 1, 2].map((i) => <Esf key={i} r={0.04} p={[-0.05 + i * 0.05, 0.33, 0.08]} s={[1, 0.7, 1]} m="#4A3022" line={0.4} seg={8} />)}</group>;
const Quepe = () => <group position={[0, 0.3, 0]}><Ci rt={0.15} rb={0.16} h={0.08} m="#6E6F44" line={0.6} seg={18} /><Cx a={[0.18, 0.012, 0.09]} p={[0, -0.03, 0.15]} m="#3E3A2A" line={0.4} /></group>;
// massa da panqueca e frigideira
const Frigideira = ({p, s = 1}) => <group position={p} scale={s}><Ci rt={0.17} rb={0.14} h={0.05} p={[0, 0.025, 0]} m="#2E2A2E" line={0.7} seg={22} aberto /><Ci rt={0.14} h={0.01} p={[0, 0.005, 0]} m="#3E3A3E" line={0} seg={20} /><Cx a={[0.3, 0.03, 0.04]} p={[0.3, 0.04, 0]} m="#5A3720" line={0.5} /></group>;
const Panqueca = ({p, rot = [0, 0, 0], s = 1, amassa = 0}) => <group position={p} rotation={rot} scale={[s * (1 + amassa * 0.3), s * (1 - amassa * 0.6), s * (1 + amassa * 0.3)]}><Ci rt={0.12} h={0.025} m="#E9B064" line={0.6} seg={22} /><mesh position={[0, 0.0135, 0]} rotation={[-Math.PI / 2, 0, 0]} material={B('#D99A4A')}><circleGeometry args={[0.08, 16]} /></mesh></group>;
const Garfo = ({p, rot = [0, 0, 0]}) => <group position={p} rotation={rot}><Cx a={[0.012, 0.16, 0.006]} m={PRATA()} line={0.3} />{[-1, 0, 1].map((i) => <Cx key={i} a={[0.004, 0.05, 0.004]} p={[i * 0.009, 0.1, 0]} m={PRATA()} line={0.2} />)}</group>;
const Mesa = ({p, r = 0.38, toalha = '#FFFFFF', h = 0.72}) => <group position={p}><Ci rt={r} h={0.04} p={[0, h, 0]} m={toalha} line={0.7} seg={24} /><Ci rt={r + 0.01} rb={r + 0.05} h={0.14} p={[0, h - 0.08, 0]} m={toalha} line={0.5} seg={24} aberto /><Ci rt={0.03} h={h} p={[0, h / 2, 0]} m="#2E2A2E" line={0.5} seg={10} /><Ci rt={0.16} h={0.02} p={[0, 0.01, 0]} m="#2E2A2E" line={0.5} seg={16} /></group>;
const Cadeira = ({p, ry = 0, cor = '#2E2A2E'}) => <group position={p} rotation={[0, ry, 0]}><Ci rt={0.17} h={0.03} p={[0, 0.45, 0]} m="#B07842" line={0.6} seg={16} />{[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <Linha key={i} a={[x * 0.11, 0.45, z * 0.11]} b={[x * 0.14, 0, z * 0.14]} r={0.008} cor={cor} />)}<mesh position={[0, 0.7, -0.15]} rotation={[0.1, 0, 0]} material={B(cor)}><torusGeometry args={[0.13, 0.009, 6, 18, Math.PI]} /></mesh></group>;
const Prato = ({p, sopa = false}) => <group position={p}><Ci rt={0.11} rb={0.07} h={0.04} p={[0, 0.02, 0]} m="#FFFFFF" line={0.5} seg={18} aberto={sopa} />{sopa ? <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} material={B('#E8A14A')}><circleGeometry args={[0.095, 18]} /></mesh> : null}</group>;
// toldo listrado
const texListra = (c1, c2) => canvasTex('listra' + c1 + c2, 256, 256, (g, w) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? c1 : c2; g.fillRect(i * 32, 0, 32, w); } });
const Toldo = ({p, w = 3, c1 = '#D8323C', c2 = '#FFF4E6'}) => <group position={p}><mesh rotation={[0.5, 0, 0]} position={[0, 0, 0.3]} material={lm('toldo' + c1, () => texListra(c1, c2))} castShadow><boxGeometry args={[w, 0.02, 0.8]} /></mesh><mesh rotation={[0.5, 0, 0]} position={[0, 0, 0.3]} material={HULL(1)}><boxGeometry args={[w, 0.02, 0.8]} /></mesh>
  {Array.from({length: Math.round(w / 0.3)}).map((_, i) => <Co key={i} r={0.08} h={0.12} p={[-w / 2 + 0.15 + i * 0.3, -0.24, 0.66]} rot={[Math.PI, 0, 0]} m={i % 2 ? c1 : c2} seg={3} line={0.4} />)}</group>;
// torre Eiffel estilizada
const Eiffel = ({p, s = 1}) => <group position={p} scale={s}>
  {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <group key={i} position={[x * 1.3, 0, z * 1.3]} rotation={[z * 0.32, 0, -x * 0.32]}><Cx a={[0.35, 3.2, 0.35]} p={[0, 1.55, 0]} m="#9A6E4A" line={0.8} /></group>)}
  <Cx a={[2.6, 0.25, 2.6]} p={[0, 3.0, 0]} m="#8E6242" line={0.8} />
  <mesh position={[0, 2.4, 0]} rotation={[0, Math.PI / 4, 0]} material={T('#9A6E4A')}><torusGeometry args={[1.5, 0.12, 6, 4, Math.PI]} /></mesh>
  <Tn geo={<cylinderGeometry args={[0.35, 1.0, 3.6, 4]} />} p={[0, 4.9, 0]} rot={[0, Math.PI / 4, 0]} m="#9A6E4A" line={0.8} />
  <Cx a={[1.1, 0.18, 1.1]} p={[0, 6.7, 0]} m="#8E6242" line={0.7} />
  <Tn geo={<cylinderGeometry args={[0.08, 0.35, 2.4, 4]} />} p={[0, 8.0, 0]} rot={[0, Math.PI / 4, 0]} m="#9A6E4A" line={0.8} />
  <Ci rt={0.03} h={0.8} p={[0, 9.5, 0]} m="#8E6242" line={0.4} seg={6} />
</group>;
// dirigível nº 6 com cesto
const Dirigivel = ({p, ry = 0, rz = 0, t = 0, sc = 1}) => <group position={p} rotation={[0, ry, rz]} scale={sc}>
  <Esf r={1} s={[2.3, 0.62, 0.62]} p={[0, 2.45, 0]} m="#F2D06B" line={1} seg={32} />
  {[-1.4, -0.5, 0.5, 1.4].map((x) => <mesh key={x} position={[x, 2.45, 0]} rotation={[0, Math.PI / 2, 0]} material={B('#D9B14E')}><torusGeometry args={[0.62 * Math.sqrt(1 - (x / 2.3) ** 2), 0.012, 4, 30]} /></mesh>)}
  <Co r={0.25} h={0.5} p={[-2.3, 2.45, 0]} rot={[0, 0, Math.PI / 2]} s={[1, 1, 0.15]} m="#D8323C" line={0.6} seg={4} />
  <Cx a={[2.2, 0.05, 0.05]} p={[0, 0.25, 0]} m="#8A5A34" line={0.5} />
  {[-0.9, -0.3, 0.3, 0.9].map((x) => [-1, 1].map((l) => <Linha key={x + '' + l} a={[x, 0.27, 0]} b={[x * 1.2, 1.9, l * 0.4]} r={0.004} />))}
  {/* cesto de vime */}
  <Cx a={[0.45, 0.3, 0.38]} p={[0.2, 0.12, 0]} m={lm('vime', () => texTabuas('vime', '#C99A5A', [2, 2]))} line={0.8} />
  {/* hélice */}
  <group position={[1.25, 0.25, 0]} rotation={[t * 25, 0, 0]}><Cx a={[0.03, 0.5, 0.06]} m="#7A4A26" line={0.4} /></group>
  <Esf r={0.04} p={[1.22, 0.25, 0]} m={FERRO()} line={0.3} seg={8} />
</group>;
// 14-bis estilizado (caixas de pipa)
const QuatorzeBis = ({p, ry = 0, rz = 0, t = 0}) => <group position={p} rotation={[0, ry, rz]}>
  {[0.35, -0.05].map((y, i) => <Cx key={i} a={[0.7, 0.02, 2.4]} p={[0, y, 0]} m="#F4ECD8" line={0.7} />)}
  {[-1.2, -0.6, 0, 0.6, 1.2].map((z) => <Cx key={z} a={[0.7, 0.4, 0.015]} p={[0, 0.15, z]} m="#F4ECD8" line={0.5} sombra={false} />)}
  <Cx a={[1.8, 0.05, 0.05]} p={[0.9, 0.12, 0]} m="#8A5A34" line={0.5} />
  <group position={[1.8, 0.15, 0]}><Cx a={[0.35, 0.25, 0.4]} m="#F4ECD8" line={0.6} /></group>
  <group position={[-0.45, 0.15, 0]} rotation={[t * 30, 0, 0]}><Cx a={[0.03, 0.7, 0.08]} m="#7A4A26" line={0.4} /></group>
  {[-0.4, 0.4].map((z) => <Ci key={z} rt={0.07} h={0.03} p={[0.1, -0.35, z]} rot={[Math.PI / 2, 0, 0]} m="#2E2A2E" line={0.4} seg={12} />)}
</group>;
// chuva (riscos caindo em volta de um ponto)
const CHUVA = Array.from({length: 70}).map((_, i) => [Math.sin(i * 12.9898) * 0.5 + 0.5, Math.sin(i * 78.233) * 0.5 + 0.5, Math.sin(i * 39.42) * 0.5 + 0.5]);
const Chuva = ({c, t, area = [4, 3, 3]}) => <group position={c}>{CHUVA.map(([a, b, d], i) => { const y = area[1] - ((t * 4 + b * area[1]) % area[1]); return <mesh key={i} position={[(a - 0.5) * area[0], y, (d - 0.5) * area[2]]} material={MAT('chuvaM', () => new THREE.MeshBasicMaterial({color: '#BFD3E6', transparent: true, opacity: 0.55}))}><boxGeometry args={[0.006, 0.16, 0.006]} /></mesh>; })}</group>;
const Bandeirolas = ({a, b, n = 12, cores = ['#2E4A9B', '#FFFFFF', '#D8323C']}) => <group><Linha a={a} b={b} r={0.004} />{Array.from({length: n}).map((_, i) => { const u = (i + 0.5) / n; const q = mix(a, b, u); return <Co key={i} r={0.07} h={0.14} p={[q[0], q[1] - 0.09 - Math.sin(u * Math.PI) * 0.15, q[2]]} rot={[Math.PI, 0, 0]} s={[1, 1, 0.15]} m={cores[i % cores.length]} seg={3} line={0.3} />; })}</group>;
const Caixa = ({p, s = 1, txt}) => <group position={p} scale={s}><Cx a={[0.6, 0.35, 0.4]} p={[0, 0.175, 0]} m="#A07A4A" line={0.7} />{txt ? <Placa p={[0, 0.2, 0.205]} txt={txt} w={0.4} h={0.12} fundo="#E9D7A6" moldura={null} borda={null} /> : null}</group>;
const Chandelier = ({p, s = 1}) => <group position={p} scale={s}><Linha a={[0, 0.6, 0]} b={[0, 0, 0]} r={0.008} cor={DOURADO} /><Esf r={0.12} m={OURO()} line={0.5} seg={14} />{[0, 1, 2, 3, 4, 5].map((i) => { const a = i * 1.047; return <group key={i}><Linha a={[0, 0, 0]} b={[Math.cos(a) * 0.3, -0.05, Math.sin(a) * 0.3]} r={0.008} cor={DOURADO} /><Esf r={0.035} p={[Math.cos(a) * 0.3, 0.0, Math.sin(a) * 0.3]} m={B('#FFF2B0')} line={0.3} seg={8} /></group>; })}</group>;
const Coluna = ({p, h = 2.8}) => <group position={p}><Ci rt={0.16} h={h} p={[0, h / 2, 0]} m="#F2E6CF" line={0.7} seg={16} /><Cx a={[0.42, 0.12, 0.42]} p={[0, h - 0.06, 0]} m="#E9DCC4" line={0.6} /><Cx a={[0.42, 0.12, 0.42]} p={[0, 0.06, 0]} m="#E9DCC4" line={0.6} /></group>;
const Celular = ({p, rot = [0, 0, 0], s = 1, comprado = 0}) => <group position={p} rotation={rot} scale={s}><Cx a={[0.16, 0.3, 0.02]} m="#2E2A2E" line={0.6} />
  <Placa p={[0, 0.02, 0.011]} txt={comprado > 0.5 ? 'COMPRADO!' : 'FONE\nSEM FIO'} w={0.13} h={0.12} fundo={comprado > 0.5 ? '#4CC38A' : '#FFFFFF'} tinta={comprado > 0.5 ? '#FFFFFF' : '#2E2A2E'} moldura={null} borda={null} />
  <Placa p={[0, -0.09, 0.011]} txt="COMPRAR" w={0.12} h={0.04} fundo="#F7D24A" moldura={null} borda={null} /></group>;
const Calendario = ({p, txt, s = 1, cor = '#C0392B'}) => <group position={p} scale={s}><Placa p={[0, 0, 0]} txt={txt} w={0.9} h={0.7} fundo="#FFFFFF" tinta={cor} moldura="#372C2E" /><Cx a={[0.95, 0.08, 0.04]} p={[0, 0.38, 0.01]} m="#C0392B" line={0.5} />{[-0.3, 0, 0.3].map((x) => <Ci key={x} rt={0.015} h={0.06} p={[x, 0.42, 0.03]} m={FERRO()} seg={6} line={0.2} />)}</group>;

// ================= cenários =================
const texGrama = () => canvasTex('grama', 1024, 1024, (g, w) => { SEED = 13; g.fillStyle = '#7FB45A'; g.fillRect(0, 0, w, w); for (let i = 0; i < 400; i++) { g.fillStyle = ['#8CC466', '#6FA24E', '#9ACD72'][i % 3]; g.globalAlpha = 0.5; g.beginPath(); g.ellipse(rnd() * w, rnd() * w, 10 + rnd() * 40, 6 + rnd() * 16, rnd() * 3, 0, 7); g.fill(); } g.globalAlpha = 1; }, [10, 10]);
const texTelhados = () => canvasTex('telhados', 1024, 1024, (g, w) => { SEED = 23; g.fillStyle = '#C9B48A'; g.fillRect(0, 0, w, w); for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) { const x = i * 64, y = j * 64; if ((i + j * 3) % 7 === 0) { g.fillStyle = '#7FB45A'; g.fillRect(x, y, 64, 64); continue; } g.fillStyle = ['#8E98A3', '#7E8893', '#B86A4E', '#A6B0BA'][Math.floor(rnd() * 4)]; g.fillRect(x + 4, y + 4, 56, 56); g.strokeStyle = 'rgba(55,44,46,0.5)'; g.lineWidth = 4; g.strokeRect(x + 4, y + 4, 56, 56); } g.strokeStyle = '#E9DCC4'; g.lineWidth = 18; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(0, 130 + k * 260); g.lineTo(w, 180 + k * 250); g.stroke(); } }, [6, 6]);
const PAREDE_MAX = () => lm('parMax', () => texPapelParede('max', '#B8324A', '#9C2A3E', 'oval'));
const PAREDE_OFI = () => lm('parOfi', () => texReboco('ofi', '#EBD9B4', ['#D9BF92', '#F6E8C8', '#CFB487']));
const PAREDE_VOV = () => lm('parVov', () => texPapelParede('vov', '#6E9A7A', '#5E8A6A', 'oval'));
const PAREDE_PAL = () => lm('parPal', () => texPapelParede('pal', '#F2D6E2', '#E9C46A', 'estrela'));
const PAREDE_QUA = () => lm('parQua', () => texPapelParede('qua', '#8FB8E8', '#7FA8DA', 'estrela'));

const ParisRua = ({t, joias = 1}) => (
  <group>
    <Chao p={[XPAR, 0, 0]} m={lm('pedrasM', texPedras)} />
    <Cx a={[16, 0.1, 2.0]} p={[XPAR, 0.05, -2.2]} m="#C9C0B4" line={0.6} />
    <Fachada p={[XPAR - 0.2, 0, -3.4]} w={3.4} h={4.0} k="cafe" cor="#E8D6B0" />
    <Toldo p={[XPAR - 0.2, 2.1, -3.15]} w={3.2} />
    <Placa p={[XPAR - 0.2, 2.75, -3.17]} txt="CAFÉ DE LA PAIX" w={1.9} h={0.3} fundo="#2E4A6B" tinta="#FFF4D6" borda={DOURADO} />
    <Placa p={[XPAR + 1.15, 1.35, -3.17]} txt={'PROIBIDO\nPULSEIRA'} w={0.5} h={0.3} fundo="#FFFFFF" tinta="#C0392B" />
    {/* joalheria ao lado, com vitrine */}
    <Fachada p={[XPAR + 3.3, 0, -3.4]} w={2.8} h={4.4} k="joia" cor="#C98F9B" />
    <Placa p={[XPAR + 3.3, 2.55, -3.17]} txt="JOALHERIA" w={1.5} h={0.28} fundo="#F7D24A" tinta="#6A3A22" borda="#6A3A22" />
    <Cx a={[1.8, 1.0, 0.5]} p={[XPAR + 3.3, 0.85, -2.95]} m={MAT('vitrine', () => new THREE.MeshToonMaterial({color: '#CFE9F2', gradientMap: GRAD, transparent: true, opacity: 0.35}))} line={0.8} />
    <Cx a={[1.8, 0.35, 0.5]} p={[XPAR + 3.3, 0.18, -2.95]} m="#6A3A22" line={0.7} />
    {joias ? [0, 1, 2, 3, 4].map((i) => <group key={i}><Cx a={[0.16, 0.2, 0.16]} p={[XPAR + 2.6 + i * 0.35, 0.45, -2.95]} m="#3A2A4A" line={0.5} /><Pulseira p={[XPAR + 2.6 + i * 0.35, 0.65 + Math.sin(t * 2 + i) * 0.01, -2.9]} rot={[0.2, 0, 0]} s={1.1} cor={['#E84A8A', '#7FD0E8', '#B57FE0', '#4CC38A', '#FF9A3C'][i]} /></group>) : null}
    {joias ? [0, 1, 2, 3].map((i) => <Brilho key={i} id={120 + i} p={[XPAR + 2.6 + i * 0.45, 0.8, -2.75]} k={((t * 0.9 + i * 0.3) % 1)} s={0.18} />) : null}
    <Fachada p={[XPAR - 3.6, 0, -3.5]} w={2.8} h={3.6} k="a" cor="#B86A4E" />
    <Placa p={[XPAR - 3.6, 2.2, -3.27]} txt="JORNAIS" w={1.0} h={0.24} fundo="#FFFFFF" tinta="#2E4A6B" />
    <Fachada p={[XPAR + 6.2, 0, -3.6]} w={2.6} h={3.8} k="b" cor="#D4A27A" />
    <Fachada p={[XPAR - 6.4, 0, -3.6]} w={2.6} h={4.2} k="c" cor="#C9B48A" />
    {[-5, -1.8, 1.6, 5].map((x) => <Poste key={x} p={[XPAR + x, 0.1, -1.4]} />)}
    <Eiffel p={[XPAR + 4, 0, -34]} s={2.4} />
    {/* mesas do café na calçada */}
    {[[-1.3, -1.6], [0.9, -1.7], [-2.6, -1.4]].map(([x, z], i) => <group key={i}><Mesa p={[XPAR + x, 0.1, z]} /><Cadeira p={[XPAR + x - 0.45, 0.1, z]} ry={Math.PI / 2} /><Cadeira p={[XPAR + x + 0.45, 0.1, z]} ry={-Math.PI / 2} /></group>)}
    {[[-6, 3.8, -10, 5], [5, 4.6, -12, 6], [0, 6.5, -16, 8]].map(([x, y, z, s], i) => <Nuvem key={i} id={80 + i} p={[XPAR + x, y, z]} s={s} />)}
  </group>
);
const CeuParis = ({t}) => (
  <group>
    <Chao p={[XCEU, -30, 0]} a={[400, 400]} m={lm('telhM', texTelhados)} />
    <Eiffel p={[XCEU + 16, -30, -42]} s={3.2} />
    {[[-12, 4, -20, 10], [10, -2, -25, 12], [-4, -8, -18, 9], [16, 6, -30, 14], [-18, -4, -10, 9]].map(([x, y, z, s], i) => <Nuvem key={i} id={150 + i} p={[XCEU + x, y, z]} s={s} />)}
  </group>
);
const Maxims = ({t}) => (
  <group>
    <Sala x={XMAX} piso={lm('pisoMax', () => texTabuas('max', '#7A4A2A', [5, 5]))} parede={PAREDE_MAX()} lambri="#5A2A1A" teto="#F2E0C0" />
    <Placa p={[XMAX, 2.2, -2.17]} txt="MAXIM'S" w={1.3} h={0.34} fundo="#2B2629" tinta={DOURADO} borda={DOURADO} />
    <Chandelier p={[XMAX, 2.2, -0.6]} s={1.3} />
    {[-1.6, 1.6].map((x) => <group key={x} position={[XMAX + x, 1.4, -2.17]}><Cx a={[0.7, 1.0, 0.03]} m="#E9C46A" line={0.6} /><Cx a={[0.6, 0.9, 0.03]} p={[0, 0, 0.01]} m="#F6EAD0" line={0.4} /></group>)}
    <Mesa p={[XMAX, 0, -0.6]} r={0.5} />
    <Prato p={[XMAX - 0.22, 0.74, -0.55]} /><Prato p={[XMAX + 0.22, 0.74, -0.55]} />
    <group position={[XMAX, 0.74, -0.72]}><Ci rt={0.035} h={0.2} p={[0, 0.1, 0]} m="#2F6F4A" line={0.5} seg={12} /><Ci rt={0.012} h={0.06} p={[0, 0.23, 0]} m="#2F6F4A" line={0.4} seg={8} /></group>
    <group position={[XMAX + 0.05, 0.74, -0.4]}><Ci rt={0.015} h={0.14} p={[0, 0.07, 0]} m="#FFF4E6" line={0.4} seg={8} /><Brilho id={160} p={[0, 0.17, 0]} k={0.5 + 0.3 * Math.sin(t * 9)} s={0.07} /></group>
    {[[-1.8, -1.2], [1.8, -1.0]].map(([x, z], i) => <group key={i}><Mesa p={[XMAX + x, 0, z]} r={0.4} /><Cadeira p={[XMAX + x - 0.5, 0, z]} ry={Math.PI / 2} cor="#6A2A1A" /></group>)}
  </group>
);
const OficinaCartier = ({t}) => (
  <group>
    <Sala x={XOFI} piso={lm('pisoOfi', () => texTabuas('ofi', '#B47A45', [5, 5]))} parede={PAREDE_OFI()} janela={[1.0, 0.9]} janX={1.2} vista="paris" />
    <Placa p={[XOFI - 0.8, 2.15, -2.17]} txt="ATELIÊ DO JOALHEIRO" w={1.4} h={0.26} fundo="#2B2629" tinta={DOURADO} borda={DOURADO} />
    <Cx a={[2.2, 0.07, 0.7]} p={[XOFI, 0.85, -1.4]} m={lm('bancOfi', () => texTabuas('banc', '#9A6232', [1, 1]))} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <Cx key={i} a={[0.07, 0.85, 0.07]} p={[XOFI + x * 1.0, 0.42, -1.4 + z * 0.28]} m="#7A4A26" line={0.6} />)}
    {[0, 1, 2, 3].map((i) => <Engrenagem key={i} p={[XOFI - 0.85 + i * 0.12, 0.92, -1.6 + (i % 2) * 0.12]} r={0.04 + (i % 2) * 0.02} rot={[-Math.PI / 2, 0, t * (i % 2 ? 2 : -3)]} />)}
    {[0, 1, 2].map((i) => <Pote key={i} p={[XOFI + 0.7 + i * 0.13, 0.885, -1.65]} cor={['#6FB7C9', '#E07A5F', '#9FD08A'][i]} h={0.1} r={0.035} />)}
    <RelParede p={[XOFI + 0.3, 2.2, -2.16]} t={t * 30} vel={1} />
    <Lampada p={[XOFI - 0.3, 0.885, -1.7]} s={1.2} acesa={1} />
  </group>
);
const Campo = ({t}) => (
  <group>
    <Chao p={[XCAM, 0, 0]} a={[120, 120]} m={lm('gramaM', texGrama)} />
    {Array.from({length: 18}).map((_, i) => <group key={i}><Ci rt={0.03} h={0.6} p={[XCAM - 9 + i, 0.3, -3]} m="#F4ECD8" line={0.4} seg={6} /></group>)}
    <Cx a={[18, 0.05, 0.05]} p={[XCAM, 0.45, -3]} m="#F4ECD8" line={0.4} /><Cx a={[18, 0.05, 0.05]} p={[XCAM, 0.25, -3]} m="#F4ECD8" line={0.4} />
    <Placa p={[XCAM - 2.5, 0.9, -2.95]} txt="CAMPO DE BAGATELLE" w={1.6} h={0.26} fundo="#FFFFFF" tinta="#2E4A6B" />
    <Eiffel p={[XCAM + 10, 0, -45]} s={2.2} />
    {[[-8, 5, -18, 8], [7, 6, -22, 9]].map(([x, y, z, s], i) => <Nuvem key={i} id={170 + i} p={[XCAM + x, y, z]} s={s} />)}
  </group>
);
const SalaCal = ({t, ano}) => (
  <group>
    <Sala x={XCAL} piso={lm('pisoCal', () => texTabuas('cal', '#9E6A3C', [5, 5]))} parede={lm('parCal', () => texReboco('cal', '#E6D6B4', ['#D6C29C', '#F2E4C6']))} />
    <Calendario p={[XCAL, 1.6, -2.15]} txt={ano} s={1.3} />
  </group>
);
const Trincheira = ({t}) => (
  <group>
    <Chao p={[XTRI, 0, 0]} m={lm('lamaM', texLama)} />
    {[-1, 1].map((l) => <group key={l}>{[0, 1, 2, 3].map((k) => <Sacos key={k} p={[XTRI - 3 + k * 2, 0, l * 0.95]} n={6} />)}{[0, 1, 2, 3].map((k) => <group key={'s' + k} position={[0, 0.3, 0]}><Sacos p={[XTRI - 2 + k * 2, 0, l * 0.98]} n={5} /></group>)}</group>)}
    {Array.from({length: 10}).map((_, i) => <Cx key={i} a={[0.5, 0.03, 0.9]} p={[XTRI - 3.5 + i * 0.75, 0.015, 0]} m="#7A5A3A" line={0.5} />)}
    {[-2.4, -0.8, 1.0, 2.6].map((x, i) => <Ci key={i} rt={0.025} h={0.8} p={[XTRI + x, 0.8, -1.3]} m="#5A4030" line={0.5} seg={6} />)}
    <Linha a={[XTRI - 2.4, 1.05, -1.3]} b={[XTRI - 0.8, 0.95, -1.3]} r={0.005} cor="#8E98A3" /><Linha a={[XTRI + 1.0, 1.05, -1.3]} b={[XTRI + 2.6, 0.95, -1.3]} r={0.005} cor="#8E98A3" />
    <Caixa p={[XTRI + 1.4, 0, 0.3]} txt="RELÓGIOS" />
    <Placa p={[XTRI - 1.6, 1.0, -0.8]} txt={'FRENTE\n→'} w={0.4} h={0.25} fundo="#E9D7A6" moldura="#5A4030" />
    {[[-6, 4, -12, 7], [5, 5, -14, 8]].map(([x, y, z, s], i) => <Nuvem key={i} id={180 + i} p={[XTRI + x, y, z]} s={s} />)}
    <Chuva c={[XTRI, 0, 0]} t={t} area={[5, 2.6, 3]} />
  </group>
);
const SalaVovo = ({t}) => (
  <group>
    <Sala x={XVOV} piso={lm('pisoVov', () => texTabuas('vov', '#9A6A3E', [5, 5]))} parede={PAREDE_VOV()} janela={[0.9, 0.8]} janX={-1.0} vista="paris" />
    <Plano p={[XVOV, 0.003, 0.1]} rot={[-Math.PI / 2, 0, 0]} a={[2.0, 2.0]} m={MAT('tapM', () => new THREE.MeshToonMaterial({map: texTapete(), gradientMap: GRAD, transparent: true, alphaTest: 0.5}))} />
    <RelParede p={[XVOV + 0.9, 2.0, -2.16]} t={t} vel={0.5} />
    <group position={[XVOV + 0.75, 0, -1.2]}><Cx a={[0.4, 0.6, 0.4]} p={[0, 0.3, 0]} m="#8A5A34" line={0.6} /><group position={[0, 0.6, 0]}><Cartola y={0.0} inc={0.2} /></group></group>
    <Gato pos={[XVOV - 0.6, 0.01, 0.35]} ry={0.6} pose="dorme" olhos="fechado" t={t} />
  </group>
);
const Palacio = ({t}) => (
  <group>
    <Sala x={XPAL} piso={lm('pisoPal', () => texTabuas('pal', '#D9B98A', [5, 5]))} parede={PAREDE_PAL()} lambri="#E9C46A" teto="#FFF4E6" janela={[0.9, 1.0]} janX={1.4} vista="cidade" />
    {[-1.9, -0.7, 0.7].map((x) => <Coluna key={x} p={[XPAL + x, 0, -2.0]} />)}
    <Chandelier p={[XPAL, 2.25, -0.8]} s={1.4} />
    <Placa p={[XPAL - 0.1, 2.2, -2.17]} txt="NÁPOLES" w={1.0} h={0.24} fundo="#FFF4E6" tinta="#8A5A12" borda={DOURADO} />
    <Cx a={[1.6, 0.05, 1.0]} p={[XPAL, 0.005, -0.7]} m="#B8324A" line={0.4} sombra={false} />
  </group>
);
const QuartoMenino = ({t}) => (
  <group>
    <Sala x={XQUA} piso={lm('pisoQua', () => texTabuas('qua', '#C99A6A', [5, 5]))} parede={PAREDE_QUA()} lambri="#FFFFFF" janela={[0.9, 0.8]} janX={0.9} />
    <Cama p={[XQUA - 1.4, 0, -1.3]} />
    {Array.from({length: 12}).map((_, i) => <Brinquedo key={i} p={[XQUA + Math.sin(i * 5.1) * 1.8, 0, Math.cos(i * 2.7) * 0.8 - 0.6]} tipo={i % 3} rot={i * 0.9} />)}
    <Placa p={[XQUA - 0.2, 1.9, -2.17]} txt={'NÃO\nENTRE'} w={0.5} h={0.3} fundo="#FFE9A8" tinta="#2E4A6B" />
    <Gato pos={[XQUA - 1.4, 0.45, -1.2]} ry={0.4} pose="dorme" olhos="fechado" t={t} />
  </group>
);

// ================= atuação =================
const COR_TERNO = '#3A3F4A';
// ---------- Santos Dumont ----------
const faceSD = (t) => expr(t, [
  [0, {olhos: 'semi', boca: 'nervoso', sob: -0.4, trem: 0.3}], [TM.pulseirinha, {olhos: 'tedio', boca: 'reta', sob: -0.5}],
  [TM.alberto, {olhos: 'normal', boca: 'sorriso'}], [TM.problema, {olhos: 'grande', boca: 'O', sob: -0.6, pop: 0.25}],
  [TM.ele, {olhos: 'normal', boca: 'sorrisoD', bochecha: 0.4}], [TM.soltar, {olhos: 'normal', boca: 'nervoso', olhar: [0, -0.7]}], [TM.abrir, {olhos: 'grande', boca: 'nervoso', trem: 0.5, semPisca: true}],
  [TM.torcer, {olhos: 'grande', boca: 'grito', trem: 0.8, sob: -0.9, semPisca: true}],
  [TM.entao, {olhos: 'bravo', boca: 'brava', sob: 0.3}], [TM.amigo, {olhos: 'normal', boca: 'sorriso', olhar: [0.6, 0]}],
  [TM.paris2, {olhos: 'semi', boca: 'reta', sob: -0.2}], [TM.mas, {olhos: 'semi', boca: 'canto', sob: 0.5, assim: 0.04}],
  [TM.voa, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.6}], [TM.recorde, {olhos: 'feliz', boca: 'grito', bochecha: 0.8, pop: 0.3}],
  [TM.detalhe, {olhos: 'semi', boca: 'nervoso', sob: -0.4}], [TM.inventou, {olhos: 'normal', boca: 'dentes', sob: -0.3}],
  [TM.qual, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5}], [TM.comenta - 0.4, {olhos: 'pisca', boca: 'canto', sob: 0.4}],
], 0.2);
const SD_PAR = [XPAR + 0.0, 0.1, -0.4];
const dumont = (t) => {
  const F = faceSD(t); let pos = SD_PAR, ry = 0, mP = null, mN = null, inc = 0, cab = [0, 0, 0], pe = null, vis = true, alt = 0, sentado = 0, relBolso = null, ombros = 0;
  const set = camEm(t).set;
  if (set === 'par' && t < TM.em2 - 0.06) { // gancho: encolhido, escondendo o pulso
    mN = PM(pos, ry, [-0.12, 0.62, 0.22]); mP = PM(pos, ry, [0.05, 0.6, 0.24]); inc = 0.08; cab = [0.15, 0, 0];
  } else if (set === 'ceu') { // no cesto do dirigível (a posição vem da cena)
    vis = false;
  } else if (set === 'max') {
    pos = [XMAX - 0.55, 0, -0.6]; ry = Math.PI / 2; sentado = 1;
    const g = Math.sin(t * 9) * 0.06; mP = PM(pos, ry, [0.2, 0.95 + g, 0.3]); mN = PM(pos, ry, [-0.18, 0.75, 0.3]);
  } else if (set === 'par' && t < TM.mas) { // no café, lendo nada, ouvindo a zoeira
    pos = [XPAR - 1.75, 0.1, -1.6]; ry = Math.PI / 2; sentado = 1; mP = PM(pos, ry, [0.18, 0.78, 0.3]); mN = PM(pos, ry, [-0.18, 0.78, 0.3]); cab = [0, -0.3, 0];
  } else if (set === 'par' && t < TM.voa) { // levanta e sai de nariz empinado
    const C = caminho(t, [[TM.mas, [XPAR - 1.2, 0.1, -1.0], 0.6], [TM.voa, [XPAR + 1.6, 0.1, -0.4], 1.2]]);
    pos = [C.pos[0], 0.1 + quica(t, C.anda), C.pos[2]]; ry = C.ry; pe = C.anda ? passo(t) : null; cab = [-0.25, 0, 0];
    mN = PM(pos, ry, [-0.2, 0.55 + Math.sin(t * 9) * 0.05, 0.1]);
  } else if (set === 'cam') { vis = false;
  } else if (set === 'par' && t > TM.detalhe - 0.1 && t < TM.oitocentos) { // sem graça, coça a nuca
    pos = [XPAR, 0.1, -0.5]; mP = PM(pos, ry, [0.1, 1.15, -0.05]); inc = 0.05; alt = -0.02;
  } else if (set === 'par' && t > TM.qual - 0.2) { // fecho: pisca e bate no relógio
    pos = [XPAR, 0.1, -0.5]; const bate = Math.max(0, Math.sin((t - TM.qual) * 7)); mN = PM(pos, ry, [-0.12, 0.72, 0.22]); mP = PM(pos, ry, [-0.05, 0.75 + bate * 0.04, 0.26]);
  } else { pos = [XPAR, 0.1, -0.5]; }
  return {pos, ry, vis, c: {cor: COR_TERNO, ...F, inc, cab, mP, mN, pe, alt, sentado, t, fase: 0.4, resp: t * 3,
    roupa: <><Colarinho /><Gravata cor="#D8323C" /></>, cabeca: <><CabeloRisca /><BigodeFino /><Panama y={0.31} /></>}};
};
// ---------- coro de cavalheiros ----------
const CAV = [
  {cor: '#4A3A5A', bigode: '#372C2E', mono: false},
  {cor: '#2E4A3A', bigode: '#6A4022', mono: true},
  {cor: '#5A3A2A', bigode: '#C9C2B8', mono: false},
  {cor: '#2E3A5A', bigode: '#372C2E', mono: false},
  {cor: '#4A4A3A', bigode: '#8A4A2A', mono: false},
  {cor: '#3A2A3A', bigode: '#372C2E', mono: false},
];
const RODA = [[-0.8, 0.0, 0], [0.8, 0.05, 0], [-0.55, -0.6, 0], [0.6, -0.6, 0], [-1.15, -0.3, 0], [1.15, -0.3, 0]];
const cavalheiro = (t, k) => {
  const v = CAV[k]; const set = camEm(t).set; let pos, ry = 0, mP = null, mN = null, inc = 0, cab = [0, 0, 0], pe = null, vis = true, lat = 0, rel = null, desmaio = 0, cai = 0, relP = 0;
  let F = expr(t, [[0, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5}]], k * 0.37);
  if (set === 'par' && t < TM.em2 - 0.06) { // roda zombando em volta do Dumont
    const [x, z, r] = RODA[k]; pos = [SD_PAR[0] + x, 0.1, SD_PAR[2] + z]; ry = Math.atan2(SD_PAR[0] - pos[0], SD_PAR[2] - pos[2]);
    const ri = Math.sin(t * 20 + k * 2); F = expr(t, [[0, {olhos: 'feliz', boca: ri > 0 ? 'grito' : 'sorrisoD', bochecha: 0.8}]], k);
    mP = PM(pos, ry, [0.12, 0.95 + Math.sin(t * 14 + k) * 0.03, 0.35]); mN = PM(pos, ry, [-0.18, 0.55 + Math.abs(Math.sin(t * 10 + k)) * 0.08, 0.15]); inc = -0.1 + Math.sin(t * 12 + k) * 0.06; cab = [-0.2, 0, 0];
  } else if (set === 'par' && t < TM.relogio2) { // desfile na calçada, todos tiram o relógio de bolso juntos
    const x0 = -4.5 + k * 0.85; const anda = t < TM.relogio - 0.2; const x = x0 + (Math.min(t, TM.relogio - 0.2) - 4.3) * 0.55;
    pos = [XPAR + x, 0.1, -1.0 + (k % 2) * 0.2]; ry = kf(t, [[TM.relogio - 0.2, Math.PI / 2], [TM.relogio + 0.1, 0.15, back]]); pe = anda ? passo(t) : null; pos = [pos[0], 0.1 + quica(t, anda ? 1 : 0), pos[2]];
    relP = kf(t, [[TM.relogio - 0.15, 0], [TM.relogio + 0.15, 1, back]]); const ab = kf(t, [[TM.bolso, 0], [TM.bolso + 0.2, 1, back]]);
    mP = relP > 0 ? PM(pos, ry, [0.1, 0.55 + relP * 0.38, 0.12 + relP * 0.2]) : PM(pos, ry, [0.2, 0.5 + Math.sin(t * 9) * 0.04, 0.05]); rel = relP > 0 ? {p: add(mP, [0, 0.05, 0.01]), abre: ab} : null;
    F = expr(t, [[0, {olhos: 'semi', boca: 'canto', sob: 0.4}], [TM.relogio, {olhos: 'normal', boca: 'sorriso', olhar: [0, -0.6]}], [TM.bigode, {olhos: 'semi', boca: 'canto', sob: 0.6, assim: 0.04}]], k);
  } else if (set === 'par' && t < TM.so) { // vitrine: um deles desmaia com as pulseiras
    if (k > 1) return {vis: false};
    pos = [XPAR + 2.9 + k * 0.7, 0.1, -2.2]; ry = k ? -0.7 : -0.9;
    desmaio = k === 0 ? kf(t, [[TM.madame - 0.1, 0], [TM.madame + 0.35, 1, Easing.in(Easing.quad)]]) : 0;
    F = expr(t, [[0, {olhos: 'normal', boca: 'reta', olhar: [0, 0.2]}], [TM.joia, {olhos: 'grande', boca: 'O', pop: 0.3, semPisca: true}], [TM.madame, {olhos: k ? 'grande' : 'fechado', boca: k ? 'O' : 'triste', semPisca: true}]], k);
    mP = desmaio > 0.5 ? PM(pos, ry, [0.3, 0.3, -0.1]) : PM(pos, ry, [0.1, 1.0, 0.2]); mN = desmaio > 0.5 ? PM(pos, ry, [-0.3, 0.3, -0.1]) : null;
  } else if (set === 'par' && t < TM.voa) { // jornal e zoeira no café
    if (k > 3) return {vis: false};
    const [x, z, r] = [[0.45, -1.25, 0.6], [1.45, -1.75, -0.6], [-0.95, -1.95, 0.6], [0.3, -2.25, 0.2]][k];
    pos = [XPAR + x, 0.1, z]; ry = r; inc = 0;
    const falando = k === 1 && t > TM.o6 - 0.05 && t < TM.mas;
    cai = k === 1 ? kf(t, [[TM.pulseira, 0], [TM.pulseira + 0.5, 1, Easing.in(Easing.quad)]]) : 0;
    F = falando ? {...expr(t, [[0, {olhos: 'semi', boca: 'canto', sob: 0.5}]], k), boca: fala(t, TM.o6 - 0.05, TM.mas) || 'canto'} : expr(t, [[0, {olhos: 'feliz', boca: Math.sin(t * 20 + k) > 0 ? 'grito' : 'sorrisoD', bochecha: 0.8}], [TM.mas, {olhos: 'grande', boca: 'O'}]], k);
    mP = k === 0 && t < TM.o6 ? PM(pos, ry, [0.12, 0.95, 0.3]) : PM(pos, ry, [0.15, 0.6 + Math.abs(Math.sin(t * 11 + k)) * 0.1, 0.2]);
    mN = k === 0 && t < TM.o6 ? PM(pos, ry, [-0.12, 0.95, 0.3]) : null;
  } else if (set === 'par' && t > TM.voltou - 0.1 && t < TM.bolso3) { // desfile de volta: soldados
    return {vis: false};
  } else if (set === 'par' && t > TM.ele5 - 0.1 && t < TM.tipo) { // callback: todos de relógio no pulso, disfarçando
    const [x, z, r] = RODA[k]; pos = [XPAR + x * 1.2, 0.1, -0.5 + z]; ry = Math.atan2(-x, 1.2) * 0.5;
    mN = PM(pos, ry, [-0.06, 0.82, 0.28]); mP = PM(pos, ry, [0.18, 0.5, 0.1]); cab = [0.25, 0.2 * (k % 2 ? 1 : -1), 0];
    F = expr(t, [[0, {olhos: 'semi', boca: 'canto', sob: 0.4, olhar: [k % 2 ? 0.7 : -0.7, -0.3]}]], k);
    return {pos, ry, vis, pulso: true, cai: k === 1 ? 0.5 : 0, c: {cor: v.cor, ...F, inc, cab, mP, mN, pe, t, fase: k * 0.31, resp: t * 3,
      roupa: <><Colarinho /><Corrente /></>, cabeca: <><BigodeGuidao /><Cartola y={0.31} />{v.mono ? <Monoculo cai={0} /> : null}</>}};
  } else if (set === 'par' && t > TM.qual - 0.2) { // fecho: acenam ao fundo
    if (k > 3) return {vis: false};
    pos = [XPAR - 1.6 + k * 1.05, 0.1, -2.2]; ry = 0; mP = PM(pos, ry, [0.25, 1.15 + Math.sin(t * 10 + k) * 0.06, 0.1]);
    F = expr(t, [[0, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5}]], k);
  } else return {vis: false};
  return {pos, ry, vis, rel, desmaio, cai, c: {cor: v.cor, ...F, inc, cab, mP, mN, pe, lat, t, fase: k * 0.31, resp: t * 3,
    roupa: <><Colarinho /><Corrente /></>, cabeca: <><BigodeGuidao /><Cartola y={0.31} />{v.mono ? <Monoculo cai={cai} /> : null}</>}};
};
// ---------- Cartier ----------
const cartier = (t) => {
  const set = camEm(t).set; let pos, ry, mP, mN, inc = 0, sentado = 0, F;
  if (set === 'max') { pos = [XMAX + 0.55, 0, -0.6]; ry = -Math.PI / 2 + 0.5; sentado = 1; mP = PM(pos, ry, [0.15, 0.78, 0.3]); mN = PM(pos, ry, [-0.15, 0.78, 0.3]);
    F = expr(t, [[0, {olhos: 'normal', boca: 'sorriso', olhar: [-0.3, 0]}], [TM.louis, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.4}]], 0.6);
  } else { pos = [XOFI, 0, -1.95]; ry = 0; inc = 0.3;
    const k = Math.sin(t * 14) * 0.03; mP = [XOFI + 0.2, 0.98 + k, -1.5]; mN = [XOFI - 0.2, 0.96 - k, -1.5];
    F = expr(t, [[0, {olhos: 'normal', boca: 'canto', olhar: [0, -0.8]}], [TM.couro, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5}]], 0.6);
  }
  return {pos, ry, c: {cor: '#5A4A3A', ...F, inc, mP, mN, sentado, t, fase: 0.6, resp: t * 3, roupa: <><Avental /></>, cabeca: <><BigodeGrosso /><Lupa /><CabeloInv /></>}};
};
// ---------- soldados ----------
const COR_KAKI = '#7A7A4E';
const soldado = (t, k) => {
  const set = camEm(t).set; let pos, ry = 0, mP = null, mN = null, inc = 0, cab = [0, 0, 0], pe = null, F, relLama = null;
  if (set === 'tri' && t < TM.dezessete - 0.1) {
    if (k > 1) return {vis: false};
    pos = k === 0 ? [XTRI - 0.2, 0, 0.1] : [XTRI + 0.7, 0, -0.25]; ry = k === 0 ? 0.3 : -0.4;
    if (k === 0) { // tenta tirar o relógio do bolso de luva
      const cav = Math.sin(t * 16) * 0.04; const cai = kf(t, [[TM.luva + 0.2, 0], [TM.lama, 1, Easing.in(Easing.quad)]]);
      mP = t < TM.luva + 0.2 ? PM(pos, ry, [0.08 + cav, 0.5, 0.2]) : PM(pos, ry, [0.12, 0.7, 0.35]); mN = PM(pos, ry, [-0.1, 0.55 + cav, 0.22]); inc = 0.25; cab = [0.35, 0, 0];
      relLama = t > TM.luva + 0.2 ? {p: mix(add(mP, [0, 0.03, 0.03]), [pos[0] + 0.15, 0.02, pos[2] + 0.4], cai), k: cai} : null;
      F = expr(t, [[0, {olhos: 'normal', boca: 'nervoso', olhar: [0, -0.8]}], [TM.luva, {olhos: 'grande', boca: 'nervoso', trem: 0.6, semPisca: true}], [TM.lama, {olhos: 'tedio', boca: 'triste', sob: -0.5}]], 0.1);
    } else { mP = PM(pos, ry, [0.15, 0.45, 0.1]); F = expr(t, [[0, {olhos: 'semi', boca: 'reta', sob: -0.2, olhar: [-0.6, -0.3]}]], 0.5); cab = [0.2, -0.4, 0]; }
  } else if (set === 'tri') { // fila recebendo os relógios
    if (k === 0) { // sargento na caixa
      pos = [XTRI + 1.4, 0, -0.25]; ry = 0; const e = Math.sin((t - TM.dezessete) * 5);
      mP = PM(pos, ry, [0.2, 0.7 + Math.max(0, e) * 0.2, 0.35 + Math.max(0, e) * 0.15]); mN = PM(pos, ry, [-0.2, 0.55, 0.3]);
      F = expr(t, [[0, {olhos: 'semi', boca: 'canto', sob: 0.3}], [TM.tropa, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.4}]], 0.2);
      return {pos, ry, sargento: true, c: {cor: COR_KAKI, ...F, inc, cab, mP, mN, t, fase: 0.2, resp: t * 3, cabeca: <><Quepe /><BigodeGrosso cor="#8A4A2A" /></>}};
    }
    const fila = k - 1; const avanca = Math.floor(cl((t - TM.dezessete) / 1.3, 0, 3.99));
    const lugar = fila - avanca; const recebeu = lugar < 0;
    const x = recebeu ? XTRI + 1.9 + (-lugar - 1) * 0.45 : XTRI + 0.55 - lugar * 0.55;
    pos = [x, 0, recebeu ? -0.3 : 0.45]; ry = recebeu ? 0.5 : Math.PI / 2;
    mN = recebeu ? PM(pos, ry, [-0.05, 0.85, 0.3]) : null; mP = recebeu ? PM(pos, ry, [0.12, 0.75, 0.32]) : null;
    F = expr(t, [[0, recebeu ? {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5, olhar: [-0.4, -0.6]} : {olhos: 'normal', boca: 'reta', olhar: [0.5, 0]}]], k * 0.3);
    return {pos, ry, pulso: recebeu, c: {cor: COR_KAKI, ...F, inc, cab, mP, mN, t, fase: k * 0.3, resp: t * 3, cabeca: <Capacete y={0.27} />}};
  } else if (set === 'par') { // desfile de volta, relógio no pulso
    const x = -4 + (t - TM.voltou + 0.1) * 1.2 + k * 0.6 - (k % 2) * 0.1; pos = [XPAR + x, 0.1 + quica(t, 1), -0.9 + (k % 2) * 0.5]; ry = Math.PI / 2; pe = passo(t);
    mN = PM(pos, ry, [-0.15, 1.1 + Math.sin(t * 9 + k) * 0.05, 0.15]); F = expr(t, [[0, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.6}]], k * 0.3);
    return {pos, ry, pulso: true, c: {cor: COR_KAKI, ...F, inc, cab, mP, mN, pe, t, fase: k * 0.3, resp: t * 3, cabeca: <Capacete y={0.27} />}};
  } else return {vis: false};
  return {pos, ry, relLama, c: {cor: COR_KAKI, ...F, inc, cab, mP, mN, pe, t, fase: k * 0.3, resp: t * 3, cabeca: <Capacete y={0.27} />}};
};
// ---------- vovô (o cavalheiro do começo, agora velhinho) ----------
const vovo = (t) => {
  const pos = [XVOV + 0.1, 0.12, -0.9]; const bal = Math.sin(t * 2) * 0.08; const dorme = t > TM.virou - 0.1;
  const F = expr(t, [[0, {olhos: 'semi', boca: 'reta', olhar: [0, -0.7]}], [TM.virou, {olhos: 'fechado', boca: 'O', dorme: true, semPisca: true}]], 0.1);
  const mP = [pos[0] + 0.2, 0.62, pos[2] + 0.3];
  return {pos, ry: 0, bal, dorme, rel: add(mP, [0, -0.05 - (dorme ? 0.12 : 0), 0.02]), c: {cor: CAV[0].cor, ...F, inc: -0.15, mP, mN: null, sentado: 1, t, fase: 0.1, resp: t * 2, alt: 0, roupa: <><Colarinho /><Corrente /></>, cabeca: <><BigodeGrosso cor="#F4F0E6" /><Oculos /></>}};
};
// ---------- rainha ----------
const rainha = (t) => {
  const pos = [XPAL - 0.1, 0, -0.8]; const ergue = kf(t, [[TM.oitocentos, 0], [TM.dez2, 1, back]]);
  const mN = PM(pos, 0, [-0.15 - ergue * 0.05, 0.6 + ergue * 0.55, 0.15 + ergue * 0.2]);
  const F = expr(t, [[0, {olhos: 'feliz', boca: 'sorriso', bochecha: 0.5}], [TM.rainha, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.8, pop: 0.2}]], 0.3);
  return {pos, ry: 0, c: {cor: '#E87FA8', ...F, mN, mP: PM(pos, 0, [0.22, 0.5, 0.1]), t, fase: 0.3, resp: t * 3, pele: '#FFF1E6', roupa: <><Colar /></>, cabeca: <><CabeloRainha /><Coroa /></>}};
};
// ---------- menino ("você") e amigo ----------
const menino = (t) => {
  const pos = [XQUA + 0.35, 0, -0.5]; const depois = t > TM.ate - 0.05;
  const dz = depois ? Math.abs(Math.sin(t * 8)) * 0.05 : 0;
  const F = depois ? expr(t, [[0, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.8}]], 0.2) : expr(t, [[0, {olhos: 'feliz', boca: 'grito', bochecha: 0.8}]], 0.2);
  const mP = depois ? PM(pos, -0.3, [0.25, 1.0 + Math.sin(t * 8) * 0.08, 0.15]) : PM(pos, -0.3, [0.05, 0.9, 0.4]);
  const mN = depois ? PM(pos, -0.3, [-0.2, 0.8, 0.3]) : PM(pos, -0.3, [-0.2, 0.5 + Math.abs(Math.sin(t * 12)) * 0.08, 0.15]);
  return {pos: [pos[0], dz, pos[2]], ry: depois ? 0 : -0.3, celular: depois ? add(mN, [0, 0.12, 0.03]) : null, c: {cor: '#9AA0A6', ...F, mP, mN, inc: depois ? 0 : -0.1, t, fase: 0.2, resp: t * 3, cabeca: <><CabeloMenino />{depois ? <Fones /> : null}</>, lat: depois ? Math.sin(t * 8) * 0.08 : 0}};
};
const amigo = (t) => {
  const pos = [XQUA - 0.55, 0, -0.9]; const F = expr(t, [[0, {olhos: 'fechado', boca: 'sorrisoD', bochecha: 0.5, dorme: true}]], 0.6);
  return {pos: [pos[0], Math.abs(Math.sin(t * 7)) * 0.04, pos[2]], ry: 0.4, c: {cor: '#E07A5F', ...F, t, fase: 0.6, resp: t * 3, lat: Math.sin(t * 7) * 0.1, cabeca: <><Topete cor="#2B2326" /><Fones /></>}};
};

// ================= câmera e planos =================
const PLANOS = [
  // gancho: close do pulso escondido, depois a roda de cavalheiros rindo
  {t0: 0, set: 'par', keys: [[0, [XPAR + 0.15, 1.05, 1.05], [XPAR - 0.05, 0.85, -0.3], 38], [TM.zoado - 0.05, [XPAR + 0.15, 1.05, 0.9], [XPAR - 0.05, 0.85, -0.3], 34]]},
  {t0: TM.zoado - 0.05, set: 'par', keys: [[TM.zoado - 0.05, [XPAR + 0.2, 1.55, 2.6], [XPAR, 0.85, -0.4], 46], [TM.pulseirinha - 0.1, [XPAR + 0.1, 1.45, 2.2], [XPAR, 0.9, -0.4], 44]]},
  {t0: TM.pulseirinha - 0.1, set: 'par', keys: [[TM.pulseirinha - 0.1, [XPAR + 0.05, 1.3, 1.3], [XPAR, 1.15, -0.4], 32], [TM.pulseirinha + 0.15, [XPAR + 0.05, 1.28, 1.2], [XPAR, 1.15, -0.4], 22, outQ], [TM.em2, [XPAR + 0.05, 1.28, 1.15], [XPAR, 1.15, -0.4], 21]]},
  // desfile em plongée e o relógio de bolso sincronizado
  {t0: TM.em2, set: 'par', keys: [[TM.em2, [XPAR - 3.2, 3.6, 1.8], [XPAR - 2.2, 0.5, -1.0], 44], [TM.relogio - 0.1, [XPAR - 1.6, 3.2, 1.6], [XPAR - 1.2, 0.5, -1.0], 44]]},
  {t0: TM.relogio - 0.1, set: 'par', keys: [[TM.relogio - 0.1, [XPAR - 0.3, 1.25, 1.2], [XPAR - 1.6, 1.0, -1.0], 40], [TM.corrente, [XPAR - 0.4, 1.2, 0.9], [XPAR - 1.5, 1.05, -1.0], 38]]},
  {t0: TM.corrente, set: 'par', keys: [[TM.corrente, [XPAR - 4.5 + 0.55 * (TM.relogio - 4.5) + 0.25, 0.8, 0.3], [XPAR - 4.5 + 0.55 * (TM.relogio - 4.5) + 0.05, 0.7, -0.95], 26], [TM.colete, [XPAR - 4.5 + 0.55 * (TM.relogio - 4.5) + 0.22, 0.79, 0.2], [XPAR - 4.5 + 0.55 * (TM.relogio - 4.5) + 0.05, 0.7, -0.95], 22]]},
  {t0: TM.colete, set: 'par', keys: [[TM.colete, [XPAR - 3.65 + 0.55 * (TM.relogio - 4.5) + 0.25, 0.82, 0.45], [XPAR - 3.65 + 0.55 * (TM.relogio - 4.5) + 0.05, 0.72, -0.75], 26], [TM.bigode, [XPAR - 3.65 + 0.55 * (TM.relogio - 4.5) + 0.22, 0.81, 0.35], [XPAR - 3.65 + 0.55 * (TM.relogio - 4.5) + 0.05, 0.72, -0.75], 22]]},
  {t0: TM.bigode, set: 'par', keys: [[TM.bigode, [XPAR - 2.8 + 0.55 * (TM.relogio - 4.5) + 0.3, 1.25, 0.2], [XPAR - 2.8 + 0.55 * (TM.relogio - 4.5) + 0.06, 1.24, -0.98], 22], [TM.relogio2 - 0.05, [XPAR - 2.8 + 0.55 * (TM.relogio - 4.5) + 0.28, 1.25, 0.1], [XPAR - 2.8 + 0.55 * (TM.relogio - 4.5) + 0.06, 1.24, -0.98], 18]]},
  // vitrine
  {t0: TM.relogio2 - 0.05, set: 'par', keys: [[TM.relogio2 - 0.05, [XPAR + 3.3, 1.0, -1.7], [XPAR + 3.3, 0.65, -2.95], 40], [TM.isso - 0.1, [XPAR + 3.3, 0.9, -2.0], [XPAR + 3.3, 0.65, -2.95], 34]]},
  {t0: TM.isso - 0.1, set: 'par', keys: [[TM.isso - 0.1, [XPAR + 1.7, 1.2, -1.2], [XPAR + 3.3, 0.8, -2.2], 44], [TM.so - 0.05, [XPAR + 1.8, 1.0, -1.3], [XPAR + 3.3, 0.5, -2.2], 44]]},
  // céu de Paris
  {t0: TM.so - 0.05, set: 'ceu', keys: [[TM.so - 0.05, [XCEU - 5, 2.0, 8], [XCEU, 1.3, 0], 46], [TM.ele - 0.05, [XCEU - 2.5, 2.2, 6.5], [XCEU, 1.2, 0], 44]]},
  {t0: TM.ele - 0.05, set: 'ceu', keys: [[TM.ele - 0.05, [XCEU + 0.6, 1.3, 2.2], [XCEU + 0.35, 0.75, 0.0], 38], [TM.la - 0.05, [XCEU + 0.6, 1.25, 1.95], [XCEU + 0.35, 0.75, 0.0], 36]]},
  {t0: TM.la - 0.05, set: 'ceu', keys: [[TM.la - 0.05, [XCEU + 1.6, 1.1, 1.2], [XCEU + 0.2, 0.9, 0], 40], [TM.soltar - 0.05, [XCEU + 1.4, 1.05, 1.0], [XCEU + 0.2, 0.9, 0], 38]]},
  {t0: TM.soltar - 0.05, set: 'ceu', keys: [[TM.soltar - 0.05, [XCEU + 1.35, 1.1, 0.6], [XCEU + 0.25, 0.85, 0.0], 40], [TM.cavar - 0.05, [XCEU + 1.3, 1.08, 0.55], [XCEU + 0.25, 0.85, 0.0], 38]]},
  {t0: TM.cavar - 0.05, set: 'ceu', keys: [[TM.cavar - 0.05, [XCEU + 1.0, 0.95, 0.45], [XCEU + 0.25, 0.7, 0.05], 38], [TM.abrir - 0.05, [XCEU + 0.95, 0.93, 0.42], [XCEU + 0.25, 0.7, 0.05], 34]]},
  {t0: TM.abrir - 0.05, set: 'ceu', keys: [[TM.abrir - 0.05, [XCEU + 0.8, 0.88, 0.22], [XCEU + 0.32, 0.84, 0.12], 30], [TM.torcer - 0.05, [XCEU + 0.75, 0.87, 0.2], [XCEU + 0.32, 0.84, 0.12], 24]]},
  {t0: TM.torcer - 0.05, set: 'ceu', keys: [[TM.torcer - 0.05, [XCEU - 4, 1.8, 5.5], [XCEU, 1.2, 0], 50], [TM.panqueca - 0.1, [XCEU - 3.2, 1.6, 4.6], [XCEU, 1.2, 0], 50]]},
  {t0: TM.panqueca - 0.1, set: 'par', keys: [[TM.panqueca - 0.1, [XPAR + 0.95, 1.55, -0.55], [XPAR + 0.9, 1.0, -1.7], 42], [TM.entao - 0.05, [XPAR + 0.95, 1.5, -0.7], [XPAR + 0.9, 0.95, -1.7], 40]]},
  // Maxim's
  {t0: TM.entao - 0.05, set: 'max', keys: [[TM.entao - 0.05, [XMAX, 1.5, 1.9], [XMAX, 0.95, -0.6], 44], [TM.joalheiro, [XMAX, 1.4, 1.5], [XMAX, 0.95, -0.6], 42]]},
  {t0: TM.joalheiro, set: 'max', keys: [[TM.joalheiro, [XMAX - 0.55, 1.35, 0.7], [XMAX + 0.45, 1.05, -0.6], 40], [TM.faz - 0.1, [XMAX - 0.5, 1.32, 0.55], [XMAX + 0.45, 1.05, -0.6], 38]]},
  // ateliê
  {t0: TM.faz - 0.1, set: 'ofi', keys: [[TM.faz - 0.1, [XOFI + 0.2, 1.6, 1.4], [XOFI, 0.95, -1.2], 44], [TM.relogio3, [XOFI + 0.1, 1.5, 1.1], [XOFI, 0.95, -1.25], 42]]},
  {t0: TM.relogio3, set: 'ofi', keys: [[TM.relogio3, [XOFI + 0.05, 1.2, -0.95], [XOFI, 0.95, -1.35], 32], [TM.preso, [XOFI + 0.03, 1.15, -1.0], [XOFI, 0.95, -1.35], 26]]},
  {t0: TM.preso, set: 'ofi', keys: [[TM.preso, [XOFI + 0.35, 1.05, -1.0], [XOFI, 0.93, -1.35], 30], [TM.tira, [XOFI + 0.3, 1.02, -1.05], [XOFI, 0.93, -1.35], 28]]},
  {t0: TM.tira, set: 'ofi', keys: [[TM.tira, [XOFI - 0.25, 1.1, -0.95], [XOFI, 0.93, -1.35], 30], [TM.paris2 - 0.05, [XOFI - 0.2, 1.08, -1.0], [XOFI, 0.93, -1.35], 26]]},
  // Paris não perdoa: jornal, monóculo na sopa, nariz empinado
  {t0: TM.paris2 - 0.05, set: 'par', keys: [[TM.paris2 - 0.05, [XPAR + 0.75, 1.3, 0.1], [XPAR + 0.7, 1.15, -1.2], 40], [TM.o6 - 0.05, [XPAR + 0.75, 1.28, -0.05], [XPAR + 0.7, 1.15, -1.2], 38]]},
  {t0: TM.o6 - 0.05, set: 'par', keys: [[TM.o6 - 0.05, [XPAR + 0.95, 1.3, -0.65], [XPAR + 1.4, 1.15, -1.75], 36], [TM.pulseira + 0.2, [XPAR + 0.95, 1.25, -0.7], [XPAR + 1.35, 1.1, -1.75], 34], [TM.mas - 0.05, [XPAR + 0.95, 1.15, -0.8], [XPAR + 0.95, 0.85, -1.7], 32]]},
  {t0: TM.mas - 0.05, set: 'par', keys: [[TM.mas - 0.05, [XPAR + 0.3, 1.2, 1.8], [XPAR - 0.4, 0.9, -1.0], 46], [TM.voa - 0.05, [XPAR + 1.0, 1.2, 1.7], [XPAR + 0.8, 0.9, -0.6], 44]]},
  // campo: 14-bis passa rente
  {t0: TM.voa - 0.05, set: 'cam', keys: [[TM.voa - 0.05, [XCAM - 1.0, 0.45, 3.2], [XCAM - 2.6, 1.0, -0.2], 50], [TM.cronometra, [XCAM - 0.6, 0.5, 3.0], [XCAM - 0.4, 1.1, -0.2], 48, lin]]},
  {t0: TM.cronometra, set: 'cam', keys: [[TM.cronometra, [XCAM - 0.3, 1.3, 3.6], [XCAM - 0.2, 1.0, -0.2], 40], [TM.ai - 0.05, [XCAM + 2.5, 1.3, 3.6], [XCAM + 3.0, 1.0, -0.2], 40, lin]]},
  // virada (preto com carimbo) e calendário
  {t0: TM.ai - 0.05, set: 'cal', keys: [[TM.ai - 0.05, [XCAL, 1.6, 1.0], [XCAL, 1.6, -2.1], 44], [TM.dez, [XCAL, 1.6, 0.9], [XCAL, 1.6, -2.1], 44]]},
  {t0: TM.dez, set: 'cal', keys: [[TM.dez, [XCAL, 1.6, 1.4], [XCAL, 1.6, -2.1], 44], [TM.guerra, [XCAL, 1.6, 0.6], [XCAL, 1.6, -2.1], 40], [TM.na - 0.05, [XCAL, 1.6, 0.5], [XCAL, 1.6, -2.1], 30, outQ]]},
  // trincheira
  {t0: TM.na - 0.05, set: 'tri', keys: [[TM.na - 0.05, [XTRI - 2.6, 1.5, 0.3], [XTRI, 0.7, 0], 48], [TM.ninguem, [XTRI - 1.8, 1.3, 0.25], [XTRI, 0.7, 0], 46]]},
  {t0: TM.ninguem, set: 'tri', keys: [[TM.ninguem, [XTRI + 0.35, 1.05, 1.6], [XTRI - 0.15, 0.9, 0.1], 38], [TM.ainda, [XTRI + 0.3, 1.03, 1.45], [XTRI - 0.15, 0.9, 0.1], 36]]},
  {t0: TM.ainda, set: 'tri', keys: [[TM.ainda, [XTRI + 0.28, 0.9, 1.1], [XTRI - 0.1, 0.62, 0.25], 34], [TM.lama - 0.1, [XTRI + 0.26, 0.88, 1.05], [XTRI - 0.05, 0.6, 0.28], 32]]},
  {t0: TM.lama - 0.1, set: 'tri', keys: [[TM.lama - 0.1, [XTRI + 0.35, 0.6, 0.75], [XTRI - 0.05, 0.05, 0.45], 42], [TM.dezessete - 0.4, [XTRI + 0.33, 0.58, 0.72], [XTRI - 0.05, 0.05, 0.45], 40]]},
  {t0: TM.dezessete - 0.4, set: 'tri', keys: [[TM.dezessete - 0.4, [XTRI + 0.6, 1.4, 2.6], [XTRI + 0.8, 0.8, 0.1], 46], [TM.entregar, [XTRI + 0.7, 1.35, 2.3], [XTRI + 0.9, 0.8, 0.1], 44]]},
  {t0: TM.entregar, set: 'tri', keys: [[TM.entregar, [XTRI + 1.0, 1.25, 2.2], [XTRI + 1.4, 0.85, 0.1], 42], [TM.quem - 0.05, [XTRI + 1.1, 1.2, 1.9], [XTRI + 1.5, 0.85, 0.1], 40]]},
  // desfile de volta
  {t0: TM.quem - 0.05, set: 'par', keys: [[TM.quem - 0.05, [XPAR + 1.0, 1.0, 2.2], [XPAR - 0.5, 1.0, -0.8], 50], [TM.bolso3 - 0.1, [XPAR + 1.4, 1.1, 2.0], [XPAR + 0.5, 1.0, -0.8], 48]]},
  // vovô
  {t0: TM.bolso3 - 0.1, set: 'vov', keys: [[TM.bolso3 - 0.1, [XVOV + 0.2, 1.2, 1.4], [XVOV + 0.1, 0.75, -0.9], 42], [TM.vovo, [XVOV + 0.2, 1.1, 0.9], [XVOV + 0.1, 0.8, -0.9], 38], [TM.detalhe - 0.05, [XVOV + 0.15, 1.05, 0.7], [XVOV + 0.1, 0.8, -0.9], 36]]},
  // detalhe: Dumont sem graça
  {t0: TM.detalhe - 0.05, set: 'par', keys: [[TM.detalhe - 0.05, [XPAR + 0.1, 1.35, 1.5], [XPAR, 1.15, -0.5], 38], [TM.oitocentos - 0.1, [XPAR + 0.08, 1.32, 1.2], [XPAR, 1.15, -0.5], 34]]},
  // palácio da rainha
  {t0: TM.oitocentos - 0.1, set: 'pal', keys: [[TM.oitocentos - 0.1, [XPAL, 1.5, 2.2], [XPAL, 1.0, -0.8], 44], [TM.feito, [XPAL - 0.05, 1.4, 1.6], [XPAL - 0.1, 1.05, -0.8], 42]]},
  {t0: TM.feito, set: 'pal', keys: [[TM.feito, [XPAL - 0.15, 1.45, 0.2], [XPAL - 0.3, 1.32, -0.75], 34], [TM.ele5 - 0.1, [XPAL - 0.15, 1.42, 0.05], [XPAL - 0.3, 1.32, -0.75], 30]]},
  // callback: coro de relógio no pulso
  {t0: TM.ele5 - 0.1, set: 'par', keys: [[TM.ele5 - 0.1, [XPAR, 1.5, 2.6], [XPAR, 0.95, -0.5], 46], [TM.tipo - 0.05, [XPAR, 1.4, 2.2], [XPAR, 0.95, -0.5], 44]]},
  // quarto do "você"
  {t0: TM.tipo - 0.05, set: 'qua', keys: [[TM.tipo - 0.05, [XQUA, 1.0, 1.6], [XQUA - 0.1, 0.65, -0.7], 44], [TM.ate - 0.05, [XQUA, 0.95, 1.3], [XQUA - 0.1, 0.65, -0.7], 42]]},
  {t0: TM.ate - 0.05, set: 'qua', keys: [[TM.ate - 0.05, [XQUA + 0.4, 0.85, 0.7], [XQUA + 0.35, 0.68, -0.5], 38], [TM.qual - 0.2, [XQUA + 0.4, 0.83, 0.55], [XQUA + 0.35, 0.68, -0.5], 36]]},
  // fecho
  {t0: TM.qual - 0.2, set: 'par', keys: [[TM.qual - 0.2, [XPAR + 0.05, 1.3, 1.3], [XPAR, 1.0, -0.5], 40], [TM.fim, [XPAR + 0.05, 1.25, 0.9], [XPAR, 1.05, -0.5], 38]]},
];
const TREMORES = [[TM.zoado, 0.012], [TM.madame + 0.3, 0.015], [TM.torcer, 0.02], [TM.panqueca, 0.02], [TM.pulseira + 0.5, 0.01], [TM.voa + 0.3, 0.02], [TM.guerra, 0.02], [TM.lama, 0.015], [TM.tropa, 0.01]];
const TROCAS = PLANOS.filter((p, i) => i > 0 && p.set !== PLANOS[i - 1].set).map((p) => p.t0);
const camEm = (t) => {
  let pl = PLANOS[0]; for (const p of PLANOS) if (t >= p.t0) pl = p;
  const k = pl.keys; let i = 1; while (i < k.length - 1 && t > k[i][0]) i++;
  const [t0, p0, l0, f0] = k[i - 1], [t1, p1, l1, f1, ez] = k[i];
  const u = (ez || io)(cl((t - t0) / Math.max(1e-6, t1 - t0)));
  const pos = mix(p0, p1, u), look = mix(l0, l1, u);
  const d = Math.hypot(pos[0] - look[0], pos[1] - look[1], pos[2] - look[2]);
  let tr = 0; for (const [a, amp] of TREMORES) if (t > a && t < a + 0.6) tr += amp * Math.exp(-(t - a) * 7);
  const deriva = [Math.sin(t * 0.7) * 0.01 * d + Math.sin(t * 61) * tr, Math.sin(t * 0.9 + 1) * 0.005 * d + Math.cos(t * 53) * tr, 0];
  return {pos: add(pos, deriva), look, fov: lerp(f0, f1, u), d, set: pl.set};
};
const Cam = ({c}) => { const {camera} = useThree(); camera.position.set(...c.pos); camera.fov = c.fov; camera.near = 0.03; camera.far = 900; camera.updateProjectionMatrix(); camera.lookAt(...c.look); return null; };

// ================= cenas =================
const Desmaiado = ({P}) => <group position={P.pos} rotation={[0, P.ry, 0]}><group position={[0, 0, 0]} rotation={[-P.desmaio * 1.45, 0, 0]}><Boneco pos={[0, 0, 0]} ry={0} c={{...P.c, mP: P.desmaio > 0.5 ? [0.3, 0.3, -0.1] : [0.1, 1.0, 0.2], mN: P.desmaio > 0.5 ? [-0.3, 0.3, -0.1] : undefined}} /></group></group>;
const CenaPar = ({t}) => {
  const SD = dumont(t); const Cs = [0, 1, 2, 3, 4, 5].map((k) => cavalheiro(t, k)); const Ss = [0, 1, 2, 3, 4].map((k) => soldado(t, k));
  const jornal = t > TM.paris2 - 0.1 && t < TM.o6 ? kf(t, [[TM.paris2 - 0.1, 0], [TM.perdoa, 1, back]]) : 0;
  const pq = t > TM.panqueca - 0.15 && t < TM.entao ? cl((t - TM.panqueca + 0.1) / 0.45) : 0;
  const desfile = t > TM.voltou - 0.2 && t < TM.bolso3;
  return (
    <group>
      <ParisRua t={t} />
      {SD.vis ? <><Boneco pos={SD.pos} ry={SD.ry} c={SD.c} /><NoPulso P={SD} /></> : null}
      {Cs.map((C, k) => C.vis === false ? null : C.desmaio > 0 ? <Desmaiado key={k} P={C} /> : <group key={k}><Boneco pos={C.pos} ry={C.ry} c={C.c} />{C.pulso ? <NoPulso P={C} /> : null}{C.rel ? <RelBolso p={C.rel.p} rot={[0, C.ry, 0]} abre={C.rel.abre} t={t} /> : null}</group>)}
      {Cs[0].rel && t > TM.relogio && t < TM.corrente ? [0, 1, 2, 3, 4, 5].map((k) => Cs[k].rel ? <Brilho key={'b' + k} id={300 + k} p={add(Cs[k].rel.p, [0, 0.06, 0.04])} k={fx01(t, TM.relogio + 0.1 + k * 0.05, 0.5)} s={0.16} /> : null) : null}
      {desfile ? Ss.map((S, k) => S.vis === false ? null : <group key={'s' + k}><Boneco pos={S.pos} ry={S.ry} c={S.c} /><NoPulso P={S} /></group>) : null}
      {desfile ? <><Bandeirolas a={[XPAR - 4, 2.6, -1.4]} b={[XPAR + 4, 2.6, -1.4]} n={16} /><Confete c={[XPAR, 0.1, -0.5]} t={t} t0={TM.voltou - 0.2} area={[5, 2.8, 2]} /></> : null}
      {/* jornal girando até a câmera */}
      {jornal > 0 ? <group position={mix([XPAR + 0.7, 1.15, -1.6], [XPAR + 0.7, 1.15, -1.05], jornal)} rotation={[0, 0, (1 - jornal) * 12]} scale={0.2 + jornal * 0.8}><Placa p={[0, 0, 0]} txt={'LE FIGARO\nMODA OU\nVERGONHA?'} w={0.42} h={0.5} fundo="#F4ECD8" tinta="#2B2629" moldura={null} /></group> : null}
      {/* sopa do cavalheiro do monóculo */}
      {t > TM.paris2 - 0.1 && t < TM.voa ? <><Prato p={[XPAR + 0.9, 0.84, -1.7]} sopa /><Gota id={33} p={[XPAR + 0.9, 0.95, -1.7]} k={fx01(t, TM.pulseira + 0.5, 0.4)} s={0.12} /><Onda id={2} p={[XPAR + 0.9, 0.875, -1.7]} k={fx01(t, TM.pulseira + 0.5, 0.5)} r={0.4} /></> : null}
      {/* panqueca caindo do céu na frigideira do café */}
      {t > TM.panqueca - 0.15 && t < TM.entao ? <><Frigideira p={[XPAR + 0.9, 0.84, -1.7]} /><Panqueca p={[XPAR + 0.9, lerp(2.4, 0.87, Easing.in(Easing.quad)(pq)), -1.7]} rot={[pq * 9, 0, 0]} amassa={pq >= 1 ? kf(t, [[TM.panqueca + 0.35, 1], [TM.panqueca + 0.6, 0, outQ]]) : 0} /><Onda id={3} p={[XPAR + 0.9, 0.88, -1.7]} k={fx01(t, TM.panqueca + 0.35, 0.4)} r={0.5} /></> : null}
      {/* gota de suor no gancho */}
      <Gota id={30} p={[XPAR + 0.17, 1.3, -0.3]} k={fx01(t, TM.pulseirinha + 0.05, 0.7)} s={0.09} />
      <Gota id={31} p={[XPAR + 0.17, 1.3, -0.3]} k={fx01(t, TM.inventou, 0.7)} s={0.09} />
    </group>
  );
};
const CenaCeu = ({t}) => {
  const F = faceSD(t);
  // trajetória: contorna a torre; na "panqueca" gira como pião
  const giro = t > TM.torcer ? (t - TM.torcer) * 7 : 0; const incl = kf(t, [[TM.soltar, 0], [TM.soltar + 0.4, 0.15], [TM.torcer, 0.25], [TM.torcer + 0.3, 0.4]]);
  const p = [XCEU, 0, 0], ry = Math.sin(t * 0.3) * 0.15 + giro;
  const solta = t > TM.soltar; const cava = t > TM.cavar && t < TM.abrir; const abre = kf(t, [[TM.abrir, 0], [TM.abrir + 0.3, 1, back]]);
  const loc = (v) => { const c = Math.cos(ry), s = Math.sin(ry); const x = v[0] * c + v[2] * s, z = -v[0] * s + v[2] * c; const y = v[1] + x * Math.sin(incl) * 0.5; return [p[0] + x, p[1] + y, p[2] + z]; };
  const pos = loc([0.2, 0.0, 0]); const P = {pos, ry: ry + Math.PI / 2};
  const lev = loc([0.42, 0.62, 0.0]), roda = loc([0.2, 0.62, -0.2]);
  const mP = solta ? (cava ? loc([0.22, 0.6, 0.08]) : loc([0.3, 0.78, 0.1])) : lev;
  const mN = roda;
  const relP = t > TM.cavar + 0.3 && t < TM.torcer + 0.2;
  const c = {cor: COR_TERNO, ...F, mP, mN, inc: cava ? 0.2 : 0, t, fase: 0.4, resp: t * 3, roupa: <><Colarinho /><Gravata cor="#D8323C" /></>, cabeca: <><CabeloRisca /><BigodeFino /><Panama y={0.31} /></>};
  return <group>
    <CeuParis t={t} />
    <group position={[0, 0, 0]}><Dirigivel p={p} ry={ry} rz={incl * 0.5} t={t} /></group>
    <Boneco pos={pos} ry={P.ry} c={c} /><NoPulso P={{pos, ry: P.ry, c}} />
    {/* alavanca e roda do leme */}
    <Linha a={loc([0.42, 0.3, 0])} b={lev} r={0.01} cor="#5A3720" /><group position={roda} rotation={[0, ry, t * 0.5]}><mesh material={B('#7A4A26')}><torusGeometry args={[0.07, 0.008, 6, 16]} /></mesh></group>
    {relP ? <RelBolso p={add(mP, [0, 0.05, 0.03])} rot={[0, ry + Math.PI / 2, 0]} abre={abre} t={t} s={2.2} /> : null}
    {/* o gato pendurado na corda, segurando também */}
    <group position={loc([-0.15, 0.55, 0.15])}><Gato pos={[0, 0, 0]} ry={ry} pose="pendura" olhos={t > TM.soltar ? 'grande' : 'normal'} eriça={t > TM.torcer ? 1 : 0} t={t} s={0.9} /></group>
    {t > TM.torcer ? [0, 1, 2].map((k) => <Velocidade key={k} id={20 + k} p={loc([-0.5 + k * 0.5, 1.2, 0.8])} k={((t - TM.torcer) * 2 + k * 0.33) % 1} s={0.9} rot={k} />) : null}
    <Passaro p={[XCEU - 1.5 + (t - TM.so) * 0.3, 1.6, 1.0]} t={t} />
  </group>;
};
const CenaMax = ({t}) => {
  const SD = dumont(t), CA = cartier(t);
  return <group>
    <Maxims t={t} />
    <Boneco pos={SD.pos} ry={SD.ry} c={SD.c} /><Boneco pos={CA.pos} ry={CA.ry} c={CA.c} />
    <group position={SD.c.mP} rotation={[0, 0, -0.4]}><Garfo p={[0, 0.04, 0]} /><Panqueca p={[0, 0.13, 0]} rot={[Math.PI / 2, 0, 0]} s={0.45} /></group>
    {[0, 1, 2].map((k) => <Faisca key={k} id={40 + k} p={[XMAX - 0.35 + k * 0.05, 1.45 + k * 0.05, -0.55]} k={fx01(t, TM.reclama + k * 0.25, 0.3)} s={0.25} />)}
  </group>;
};
const CenaOfi = ({t}) => {
  const CA = cartier(t); const mont = cl((t - TM.relogio3 + 0.2) / (TM.preso - TM.relogio3));
  const tira = cl((t - TM.preso) / (TM.tira - TM.preso + 0.4)); const pronto = t > TM.couro;
  return <group>
    <OficinaCartier t={t} />
    <Boneco pos={CA.pos} ry={CA.ry} c={CA.c} />
    <RelPulso p={[XOFI, 0.95, -1.35]} rot={[-Math.PI / 2 + 0.25, 0, 0]} s={3.2} parafusos={mont} tira={tira} brilho={pronto ? ((t - TM.couro) * 1.2) % 1 : 0} />
    {mont > 0 && mont < 1 ? <Faisca id={50} p={[XOFI + 0.05, 1.02, -1.3]} k={(t * 3) % 1} s={0.12} /> : null}
    {pronto ? [0, 1, 2].map((k) => <Brilho key={k} id={60 + k} p={[XOFI - 0.12 + k * 0.12, 1.08 + (k % 2) * 0.05, -1.3]} k={fx01(t, TM.couro + k * 0.15, 0.6)} s={0.16} />) : null}
  </group>;
};
const CenaCam = ({t}) => {
  const u = cl((t - TM.voa + 0.1) / (TM.ai - TM.voa + 0.1)); const ox = lerp(-3, 3, u); const p = [XCAM + ox, 1.0 + Math.sin(u * Math.PI) * 0.2, -0.2];
  const F = faceSD(t); const olha = t > TM.cronometra; const pos = add(p, [0.3, -0.35, 0.3]);
  const mN = olha ? add(pos, [0.05, 0.95, 0.15]) : add(pos, [0.25, 0.65, 0.2]); const mP = add(pos, [0.3, 0.65, -0.15]);
  const c = {cor: COR_TERNO, ...F, mP, mN, sentado: 0.6, cab: olha ? [0.3, 0.4, 0] : [0, 0, 0], t, fase: 0.4, resp: t * 3, roupa: <><Colarinho /><Gravata cor="#D8323C" /></>, cabeca: <><CabeloRisca /><BigodeFino /><Panama y={0.31} /></>};
  return <group>
    <Campo t={t} />
    <QuatorzeBis p={p} ry={Math.PI} rz={Math.sin(t * 3) * 0.04} t={t} />
    <Boneco pos={pos} ry={-Math.PI / 2} c={c} /><NoPulso P={{pos, ry: -Math.PI / 2, c}} />
    {[0, 1, 2].map((k) => <Velocidade key={k} id={70 + k} p={add(p, [1.5 + k * 0.4, 0.2 + k * 0.1, 0])} k={(t * 2 + k * 0.33) % 1} s={0.8} rot={0} />)}
    {/* linha pontilhada da largada à chegada */}
    {Array.from({length: 20}).map((_, i) => i / 20 < u ? <Esf key={i} r={0.03} p={[XCAM - 6 + i * 0.6, 0.05, 0.6]} m="#FFFFFF" line={0.3} seg={6} /> : null)}
  </group>;
};
const CenaCal = ({t}) => {
  const ano = t < TM.dez ? '1904' : String(1904 + Math.min(10, Math.floor((t - TM.dez) / ((TM.guerra - TM.dez) / 10))));
  const virando = t > TM.dez && t < TM.guerra;
  return <group>
    <SalaCal t={t} ano={ano} />
    {virando ? [0, 1, 2, 3].map((i) => { const u = ((t - TM.dez) * 4 + i * 0.25) % 1; return <Papel key={i} p={[XCAL + u * 1.5 - 0.2, 1.6 - u * 1.3 + Math.sin(u * 6) * 0.1, -2.0 + u * 0.8]} rot={[u * 6, i, u * 4]} s={2.5} />; }) : null}
    {t > TM.guerra ? <group position={[XCAL + 0.25, 1.35, -2.05]} rotation={[0, 0, -0.25]} scale={kf(t, [[TM.guerra, 2.2], [TM.guerra + 0.12, 1, outQ]])}><Placa p={[0, 0, 0]} txt="GUERRA!" w={0.8} h={0.22} fundo="#D8323C" tinta="#FFFFFF" borda="#FFFFFF" moldura={null} /></group> : null}
  </group>;
};
const CenaTri = ({t}) => {
  const Ss = [0, 1, 2, 3, 4].map((k) => soldado(t, k)); const S0 = Ss[0];
  return <group>
    <Trincheira t={t} />
    {Ss.map((S, k) => S.vis === false ? null : <group key={k}><Boneco pos={S.pos} ry={S.ry} c={S.c} />{S.pulso ? <NoPulso P={S} /> : null}{!S.sargento ? <Luvas P={S} /> : null}</group>)}
    {S0.relLama ? <RelBolso p={S0.relLama.p} rot={[S0.relLama.k * 4, 0, S0.relLama.k * 3]} abre={0.6} t={t} s={1.2} /> : null}
    <Gota id={34} p={[XTRI - 0.05, 0.12, 0.5]} k={fx01(t, TM.lama, 0.45)} s={0.14} /><Onda id={4} p={[XTRI - 0.05, 0.02, 0.5]} k={fx01(t, TM.lama, 0.6)} r={0.5} />
    {Ss[0].sargento ? <RelPulso p={add(Ss[0].c.mP, [0, 0.04, 0.02])} rot={[0, 0, 0]} s={0.9} /> : null}
    {t > TM.tropa - 0.05 ? <group position={[XTRI + 1.2, 1.55, 0.2]} rotation={[0, -0.2, -0.15]} scale={kf(t, [[TM.tropa - 0.05, 2.2], [TM.tropa + 0.1, 1, outQ]])}><Placa p={[0, 0, 0]} txt="ENTREGUE ✓" w={0.8} h={0.2} fundo="#4CC38A" tinta="#FFFFFF" borda="#FFFFFF" moldura={null} /></group> : null}
    {/* o gato de capacete, contrariado com a chuva */}
    <group position={[XTRI - 1.0, 0.62, -0.85]} scale={1.3}><CabGato p={[0, 0.06, 0]} olhos="bravo" t={t} /><group position={[0, 0.06, 0]} scale={0.45}><Capacete y={0.13} /></group></group>
  </group>;
};
const CenaVov = ({t}) => {
  const V = vovo(t);
  return <group>
    <SalaVovo t={t} />
    <group position={[V.pos[0], 0, V.pos[2]]} rotation={[V.bal, 0, 0]}><Poltrona p={[0, 0, -0.05]} cor="#8A6A3A" cor2="#7A5A2A" /><Boneco pos={[0, 0.12, 0]} ry={0} c={{...V.c, mP: [0.2, 0.62, 0.3]}} /></group>
    <RelBolso p={V.rel} rot={[0, 0, Math.sin(t * 3) * 0.3]} abre={0} t={t} s={1.2} />
    <Zzz p={[V.pos[0], 1.5, V.pos[2] + 0.1]} t={t} k={V.dorme ? 1 : 0} id={1} />
  </group>;
};
const CenaPal = ({t}) => {
  const Q = rainha(t);
  const espia = kf(t, [[TM.oitocentos, 0], [TM.oitocentos + 0.4, 1, back]]);
  return <group>
    <Palacio t={t} />
    <Boneco pos={Q.pos} ry={Q.ry} c={Q.c} />
    <RelPulso p={mix(Q.c.mN, PM(Q.pos, 0, [-0.148, 0.79, 0]), 0.16)} rot={[0, 0, 0]} s={0.6} />
    <group position={Q.c.mN}><Pulseira p={[0, -0.03, 0]} rot={[Math.PI / 2, 0, 0]} s={0.5} /></group>
    {[0, 1, 2].map((k) => <Brilho key={k} id={90 + k} p={add(Q.c.mN, [Math.cos(k * 2) * 0.1, 0.08 + Math.sin(k * 2) * 0.05, 0.05])} k={((t * 1.3 + k * 0.33) % 1)} s={0.12} />)}
    {t > TM.dez2 - 0.1 ? <group position={[XPAL + 0.4, 1.85, -0.6]} scale={kf(t, [[TM.dez2 - 0.1, 0], [TM.dez2 + 0.15, 1, back]])}><Placa p={[0, 0, 0]} txt="1810" w={0.4} h={0.16} fundo="#F7D24A" tinta="#6A3A22" moldura={null} /></group> : null}
    {t > TM.rainha ? <group position={[XPAL + 0.45, 1.5, -0.5]} rotation={[0, 0, -0.15]} scale={kf(t, [[TM.rainha, 2.2], [TM.rainha + 0.12, 1, outQ]])}><Placa p={[0, 0, 0]} txt="✓ VERDADE" w={0.6} h={0.16} fundo="#4CC38A" tinta="#FFFFFF" borda="#FFFFFF" moldura={null} /></group> : null}
    {/* Dumont espiando pela janela */}
    <group position={[XPAL + 1.4, 1.2 + espia * 0.2, -2.45]}><Boneco pos={[0, -0.9, 0]} ry={0} c={{cor: COR_TERNO, olhos: 'grande', boca: 'O', t, fase: 0.4, resp: t * 3, cabeca: <><CabeloRisca /><BigodeFino /><Panama y={0.31} /></>}} /></group>
  </group>;
};
const CenaQua = ({t}) => {
  const K = menino(t), A = amigo(t); const depois = t > TM.ate - 0.05;
  return <group>
    <QuartoMenino t={t} />
    <Pequeno P={K} />
    {!depois ? <Pequeno P={A} /> : null}
    {K.celular ? <Celular p={K.celular} rot={[0, 0, 0]} s={0.9} comprado={t > TM.comprar ? 1 : 0} /> : null}
    {depois && t > TM.comprar ? [0, 1, 2].map((k) => <Brilho key={k} id={110 + k} p={add(K.celular, [Math.cos(k * 2) * 0.12, 0.1 + Math.sin(k * 2) * 0.06, 0.05])} k={fx01(t, TM.comprar + k * 0.1, 0.6)} s={0.14} />) : null}
  </group>;
};

// ================= legenda e sobreposições =================
const GRUPOS = (() => { const g = []; let i = 0; while (i < PALAVRAS.length) { const a = PALAVRAS[i], l = a.w.replace(/[.,!?:"…]/g, ''); if (l.length <= 2 && i + 1 < PALAVRAS.length && !/[.,!?:…]$/.test(a.w)) { g.push({txt: a.w + ' ' + PALAVRAS[i + 1].w, s: a.s, e: PALAVRAS[i + 1].e}); i += 2; } else { g.push({txt: a.w, s: a.s, e: a.e}); i++; } } return g; })();
if (typeof document !== 'undefined' && !window.__montLE) {
  window.__montLE = true; const h = delayRender('fonte');
  new FontFace('MontLE', `url(${staticFile('Montserrat-Black.woff2')})`, {weight: '900'}).load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
}
const limpa = (x) => x.replace(/"/g, '').replace(/…$/, '').replace(/:$/, '');
const AMARELAS = new Set(['pulseirinha', 'bolso', 'madame', 'maos', 'panqueca', 'quadrado', 'couro', 'perdoa', 'recorde', 'virada', 'guerra', 'lama', 'dezessete', 'vovo', 'rainha', 'vergonha', 'ridiculo', 'comenta']);
const Legenda = ({t}) => {
  let cur = null;
  for (let i = 0; i < GRUPOS.length; i++) { const nx = GRUPOS[i + 1]; const fim = nx ? Math.min(nx.s, GRUPOS[i].e + 0.6) : GRUPOS[i].e + 0.5; if (t >= GRUPOS[i].s - 0.02 && t < fim) cur = GRUPOS[i]; }
  if (!cur || (t > TM.ai - 0.05 && t < TM.dez)) return null;
  const am = cur.txt.split(' ').some((w) => AMARELAS.has(norm(w)));
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1300, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <span style={{fontFamily: 'MontLE', fontWeight: 900, fontSize: 80, color: am ? '#FFE36A' : '#fff', WebkitTextStroke: '14px #372C2E', paintOrder: 'stroke fill', textShadow: '0 5px 9px rgba(0,0,0,0.3)'}}>{limpa(cur.txt)}</span>
  </div>;
};
// carimbo "PLOT TWIST" no preto
const PlotTwist = ({t}) => {
  if (t < TM.ai - 0.05 || t > TM.dez) return null;
  const k = kf(t, [[TM.virada - 0.05, 2.4], [TM.virada + 0.1, 1, outQ]]);
  return <AbsoluteFill style={{backgroundColor: '#14101A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    {t > TM.virada - 0.05 ? <div style={{transform: `rotate(-12deg) scale(${k})`, border: '16px solid #E8333C', borderRadius: 28, padding: '20px 50px', fontFamily: 'MontLE', fontWeight: 900, fontSize: 150, color: '#E8333C', letterSpacing: 4}}>PLOT TWIST</div> : null}
  </AbsoluteFill>;
};
// contador 1, 2, 3 das ações no ar
const Contador = ({t}) => {
  const marcas = [TM.soltar, TM.cavar, TM.abrir]; let n = 0, t0 = 0; marcas.forEach((m, i) => { if (t >= m) { n = i + 1; t0 = m; } });
  if (!n || t > TM.torcer) return null; const k = kf(t, [[t0, 1.6], [t0 + 0.15, 1, outQ]]);
  return <div style={{position: 'absolute', left: 120, top: 330, width: 170, height: 170, borderRadius: 85, background: '#FFFFFF', border: '10px solid #372C2E', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`, fontFamily: 'MontLE', fontWeight: 900, fontSize: 110, color: '#372C2E'}}>{n}</div>;
};
// cronômetro do recorde
const Cronometro = ({t}) => {
  if (t < TM.cronometra - 0.1 || t > TM.ai - 0.05) return null; const a = (t - TM.cronometra) * 360;
  return <div style={{position: 'absolute', left: 110, top: 300, width: 220, height: 220, borderRadius: 110, background: '#FFFFFF', border: '12px solid #372C2E', boxShadow: '0 8px 0 rgba(0,0,0,0.2)'}}>
    <div style={{position: 'absolute', left: 95, top: -40, width: 30, height: 34, background: '#372C2E', borderRadius: 6}} />
    <div style={{position: 'absolute', left: 100, top: 22, width: 8, height: 80, background: '#E8333C', borderRadius: 4, transformOrigin: '4px 80px', transform: `rotate(${a}deg)`}} />
  </div>;
};
// balão de comentário do fecho
const Balao = ({t}) => {
  if (t < TM.comenta - 0.6) return null; const k = kf(t, [[TM.comenta - 0.6, 0], [TM.comenta - 0.3, 1, back]]);
  return <div style={{position: 'absolute', left: 140, top: 300, transform: `scale(${k})`, transformOrigin: '50% 100%'}}>
    <div style={{width: 300, height: 200, borderRadius: 60, background: '#FFFFFF', border: '12px solid #372C2E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22}}>
      {[0, 1, 2].map((i) => <div key={i} style={{width: 38, height: 38, borderRadius: 19, background: '#372C2E', transform: `translateY(${Math.sin(t * 8 + i) * 8}px)`}} />)}
    </div>
    <div style={{position: 'absolute', left: 60, top: 178, width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderTop: '60px solid #372C2E'}} />
  </div>;
};

// ================= montagem =================
const ALVOS = {par: [XPAR, 0.6, -1], ceu: [XCEU, 0.6, 0], max: [XMAX, 0.6, -0.8], ofi: [XOFI, 0.6, -1], cam: [XCAM, 0.6, -0.5], cal: [XCAL, 1, -1.5], tri: [XTRI, 0.5, 0], vov: [XVOV, 0.5, -0.8], pal: [XPAL, 0.6, -0.8], qua: [XQUA, 0.5, -0.8]};
const AREAS = {par: 5, ceu: 4, max: 3.2, ofi: 3.2, cam: 6, cal: 3, tri: 4, vov: 3.2, pal: 3.2, qua: 3.2};
export const Relogio = () => {
  const t = useCurrentFrame() / 30;
  const c = camEm(t); const set = c.set;
  let chicote = 0; for (const tc of TROCAS) chicote += Math.max(0, Math.sin(cl((t - tc + 0.12) / 0.3) * Math.PI));
  const fora = set === 'par' || set === 'ceu' || set === 'cam' || set === 'tri';
  const kLuz = set === 'tri' ? 0.6 : 1;
  const tinta = set === 'tri' ? 'rgba(90,110,150,0.18)' : (set === 'vov' ? 'rgba(255,190,120,0.12)' : null);
  const flash = Math.max(fx01(t, TM.guerra, 0.25) > 0 ? 1 - fx01(t, TM.guerra, 0.25) : 0, fx01(t, TM.rainha, 0.2) > 0 ? (1 - fx01(t, TM.rainha, 0.2)) * 0.5 : 0, fx01(t, TM.tropa, 0.2) > 0 ? (1 - fx01(t, TM.tropa, 0.2)) * 0.4 : 0);
  return (
    <AbsoluteFill style={{backgroundColor: '#D3E3F0'}}>
      <Borrao k={chicote * 0.9} />
      <AbsoluteFill style={{filter: chicote > 0.02 ? 'url(#chicote)' : undefined}}>
        <ThreeCanvas width={1080} height={1920} dpr={IN.dpr || 2} shadows gl={{antialias: true}} camera={{fov: 50, position: [0, 2, 6]}}>
          <Cam c={c} />
          <fog attach="fog" args={[set === 'tri' ? '#9AA4B0' : (set === 'ceu' ? '#DCE8F4' : '#E8DFD0'), set === 'ceu' ? 30 : 14, set === 'ceu' ? 160 : (fora ? 70 : 40)]} />
          <Ceu c={c} noite={set === 'tri' ? 0.4 : 0} />
          <Sol alvo={ALVOS[set]} area={AREAS[set]} luz={kLuz} dir={[-8, 6.4, 5]} />
          {set === 'par' ? <CenaPar t={t} /> : null}
          {set === 'ceu' ? <CenaCeu t={t} /> : null}
          {set === 'max' ? <CenaMax t={t} /> : null}
          {set === 'ofi' ? <CenaOfi t={t} /> : null}
          {set === 'cam' ? <CenaCam t={t} /> : null}
          {set === 'cal' ? <CenaCal t={t} /> : null}
          {set === 'tri' ? <CenaTri t={t} /> : null}
          {set === 'vov' ? <CenaVov t={t} /> : null}
          {set === 'pal' ? <CenaPal t={t} /> : null}
          {set === 'qua' ? <CenaQua t={t} /> : null}
          {IN.pos !== false ? <><Aquece /><PosToon dpr={IN.dpr || 2} dof={IN.dof !== false} ao={IN.ao !== false} foco={c.look} bokeh={fora && c.d > 4 ? 0.8 : 1.6} faixa={fora && c.d > 4 ? 6 : 2.4} longe={fora ? 80 : 40} sat={0.0} /></> : null}
        </ThreeCanvas>
      </AbsoluteFill>
      {tinta ? <AbsoluteFill style={{backgroundColor: tinta, mixBlendMode: 'multiply'}} /> : null}
      {flash > 0 ? <AbsoluteFill style={{backgroundColor: `rgba(255,255,255,${flash * 0.8})`}} /> : null}
      <PlotTwist t={t} />
      <Contador t={t} />
      <Cronometro t={t} />
      <Balao t={t} />
      {IN.semLegenda ? null : <Legenda t={t} />}
    </AbsoluteFill>
  );
};
