// Senhor Sticker, vídeo 3 (01/11/2026), piloto do estilo novo: "ele saiu de férias sem lavar a louça" (Fleming e a penicilina).
// Muitos planos curtos, cenários cheios, piadas visuais com plaquinhas, tempo vindo da fala.
import React from 'react';
import * as THREE from 'three';
import {AbsoluteFill, useCurrentFrame, Easing, getInputProps, staticFile, delayRender, continueRender} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {T, B, HULL, Tn, Esf, Cx, Ci, Co, Linha, canvasTex, PRATA, OURO, FERRO, MAT, GRAD, LINHA, Boneco, maoRepouso, Brilho, Faisca, Gota, Velocidade, Nuvem, CAB_ACESA, BigodeGuidao, Cavanhaque} from './toon2';
import {PALAVRAS} from './palavras';
import {Borrao, Aquece} from './cinema';
import {PosToon} from './pos';

export const DUR_PN = Math.round(76 * 30);
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
const W_ = (txt, n = 0) => { let c = 0; for (const p of PALAVRAS) if (p.w.toLowerCase().replace(/[.,!?:"]/g, '') === txt) { if (c === n) return p.s; c++; } throw new Error(txt); };
const E_ = (txt, n = 0) => { let c = 0; for (const p of PALAVRAS) if (p.w.toLowerCase().replace(/[.,!?:"]/g, '') === txt) { if (c === n) return p.e; c++; } throw new Error(txt); };
const TM = {};
[['ele'], ['saiu'], ['férias'], ['lavar'], ['louça'], ['salvou'], ['milhões'], ['vidas'], ['londres'], ['mil'], ['oito'], ['alexander'], ['fleming'], ['laboratório'], ['bagunçado'], ['hospital'],
 ['placas'], ['bactéria'], ['empilhadas'], ['pia'], ['xícara'], ['chá'], ['esquecida'], ['papel'], ['canto'], ['colegas'], ['zombavam'], ['isso'], ['ou'], ['chiqueiro'],
 ['só'], ['ombros'], ['saiu', 1], ['férias', 1], ['sem', 1], ['limpar'], ['nada'], ['semanas'], ['pilha'], ['lá'], ['esfriou'], ['esquentou'], ['alguma'], ['crescer'],
 ['volta'], ['pegou'], ['placa'], ['jogar'], ['fora'], ['parou'], ['tinha', 1], ['mofo'], ['verde'], ['canto', 1], ['volta', 1], ['bactérias'], ['sumido'], ['círculo'], ['limpinho'],
 ['aquele'], ['mofo', 1], ['matava'], ['bactéria', 1], ['fleming', 1], ['fleming', 2], ['chamou'], ['penicilina'], ['só', 1], ['ninguém'], ['bola'], ['não'], ['fabricar'], ['remédio'], ['descoberta'], ['esquecida', 1], ['dez'], ['anos'],
 ['até'], ['segunda'], ['guerra'], ['dois'], ['cientistas'], ['oxford'], ['florey'], ['chain'], ['descobriram'], ['produzir'], ['massa'], ['repente'], ['arranhão'], ['infeccionado'], ['sentença'], ['morte'],
 ['mil', 1], ['cinco'], ['três'], ['ganharam'], ['prêmio'], ['nobel'], ['colegas', 1], ['organizados'], ['bancada'], ['impecável'], ['nenhuma'], ['medalha'],
 ['então'], ['próxima'], ['mandarem'], ['você'], ['arrumar'], ['quarto'], ['diga'], ['fazendo'], ['ciência']].forEach(([w, n = 0]) => { TM[w.normalize('NFD').replace(/[̀-ͯ]/g, '') + (n ? n + 1 : '')] = W_(w, n); });
TM.fim = DUR_PN / 30;
// cenários separados no mundo; só o do plano atual é desenhado
const XLAB = 0, XCOL = 14, XRUA = 40, XPL = 26, XFAB = 60, XGUE = 80, XNOB = 100, XQUA = 120;
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

// ---------- objetos ----------
const Bola = ({p, id = 0}) => <Esf r={0.05} p={p} m={PRATA()} line={0.7} seg={22} />;
const Prato = ({p, tr = 0}) => (
  <group position={[p[0], p[1] + Math.abs(tr) * 0.01, p[2]]} rotation={[tr * 0.08, 0, tr * 0.06]}>
    <Ci rt={0.11} rb={0.095} h={0.016} p={[0, 0.008, 0]} m={FERRO()} seg={28} line={0.7} />
    <mesh position={[0, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]} material={PRATA()}><ringGeometry args={[0.07, 0.1, 28]} /></mesh>
  </group>
);
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
const Luminaria = ({p, t, bal = 0, acesa = 1}) => (
  <group position={p}>
    <group rotation={[0, 0, bal]}>
      <Linha a={[0, 0, 0]} b={[0, -0.5, 0]} r={0.006} />
      <Co r={0.13} h={0.12} p={[0, -0.55, 0]} m="#2F6F6A" seg={20} line={0.8} />
      <Esf r={0.05} p={[0, -0.62, 0]} m={B('#FFF2B0')} line={0.5} seg={14} />
    </group>
  </group>
);
// gramofone, lâmpadas, potes e engrenagens da bancada
const Gramofone = ({p, rot = 0}) => (
  <group position={p} rotation={[0, rot, 0]}>
    <Cx a={[0.26, 0.14, 0.26]} p={[0, 0.07, 0]} m="#8A4E2A" />
    <Ci rt={0.11} h={0.012} p={[0, 0.146, 0]} m="#2B2326" seg={24} line={0.5} />
    <Linha a={[0.08, 0.15, 0.06]} b={[0.06, 0.32, -0.02]} r={0.01} cor="#C79B3A" />
    <group position={[0.06, 0.34, -0.02]} rotation={[0.6, 0, -0.5]}><Tn geo={<cylinderGeometry args={[0.16, 0.012, 0.32, 24, 1, true]} />} p={[0, 0.16, 0]} m={T('#E2A93B', {side: THREE.DoubleSide})} line={0.8} /></group>
  </group>
);
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

// ---------- oficina do inventor ----------
const PISO_OFI = () => lm('pisoOfi', () => texTabuas('ofi', '#B47A45', [5, 5]));
const PAREDE_OFI = () => lm('parOfi', () => texReboco('ofi', '#EBD9B4', ['#D9BF92', '#F6E8C8', '#CFB487']));
const Bancada = ({p, t}) => (
  <group position={p}>
    <Cx a={[1.3, 0.07, 0.6]} p={[0, 0.8, 0]} m={lm('bancadaM', () => texTabuas('banc', '#9A6232', [1, 1]))} />
    {[[-0.6, -0.25], [0.6, -0.25], [-0.6, 0.25], [0.6, 0.25]].map(([x, z], i) => <Cx key={i} a={[0.07, 0.8, 0.07]} p={[x, 0.4, z]} m="#7A4A26" line={0.6} />)}
    <Cx a={[1.2, 0.04, 0.5]} p={[0, 0.25, 0]} m="#7A4A26" line={0.6} />
    <Gramofone p={[-0.38, 0.835, -0.05]} rot={0.5} />
    <Lampada p={[0.05, 0.835, 0.1]} s={1.2} acesa={0} /><Lampada p={[0.22, 0.835, 0.0]} s={0.9} /><Lampada p={[0.36, 0.835, 0.15]} s={1} />
    <Engrenagem p={[0.4, 0.95, -0.22]} r={0.1} rot={[0, -0.2, 0.2]} /><Engrenagem p={[0.53, 0.88, -0.2]} r={0.06} rot={[0, -0.2, 0.1 + t]} />
    <Pote p={[-0.05, 0.835, -0.2]} cor="#6FB7C9" /><Pote p={[0.12, 0.835, -0.22]} cor="#E07A5F" h={0.2} r={0.045} />
    {[-0.3, -0.1, 0.1].map((x, i) => <Pote key={'b' + i} p={[x, 0.29, 0.05]} cor={['#7E9A45', '#C9A34A', '#8E6BD8'][i]} h={0.24} r={0.07} />)}
  </group>
);
const Prateleira = ({p, t, pulo = 0}) => (
  <group position={p}>
    {[0, 0.42].map((y, j) => <group key={j}>
      <Cx a={[1.1, 0.04, 0.22]} p={[0, y, 0]} m="#8A5A34" line={0.6} />
      {[-0.4, -0.22, -0.05, 0.12, 0.3, 0.44].map((x, i) => { const k = (i + j) % 3; const pl = Math.max(0, pulo * Math.sin((i * 1.7 + j) * 3 + t * 30) * 0.03);
        return k === 0 ? <Pote key={i} p={[x, y + 0.02 + pl, 0]} cor={['#6FB7C9', '#E07A5F', '#9FD08A', '#E9B44C'][(i + j) % 4]} h={0.14 + (i % 2) * 0.05} r={0.04} />
          : k === 1 ? <Cx key={i} a={[0.06, 0.2, 0.15]} p={[x, y + 0.12 + pl, 0]} rot={[0, 0, (i % 2 ? 0.12 : 0)]} m={['#7B3F8C', '#2F6F6A', '#C2483E'][(i + j) % 3]} line={0.6} />
          : <Lampada key={i} p={[x, y + 0.02 + pl, 0]} s={0.8} />; })}
    </group>)}
  </group>
);
const Oficina = ({t, pulo = 0, balLum = 0}) => (
  <group>
    <Sala x={0} piso={PISO_OFI()} parede={PAREDE_OFI()} />
    <Plano p={[0, 0.003, 0.15]} rot={[-Math.PI / 2, 0, 0]} a={[2.0, 2.0]} m={MAT('tapM', () => new THREE.MeshToonMaterial({map: texTapete(), gradientMap: GRAD, transparent: true, alphaTest: 0.5}))} />
    <Bancada p={[-1.6, 0, -1.65]} t={t} />
    <Prateleira p={[1.35, 1.25, -2.08]} t={t} pulo={pulo} />
    <mesh position={[-0.15, 1.62, -2.18]} material={lm('rascM', texRascunhos)}><planeGeometry args={[1.25, 0.88]} /></mesh>
    <Cx a={[1.33, 0.05, 0.04]} p={[-0.15, 2.08, -2.17]} m="#7A4E2C" line={0.6} sombra={false} /><Cx a={[1.33, 0.05, 0.04]} p={[-0.15, 1.16, -2.17]} m="#7A4E2C" line={0.6} sombra={false} />
    <Luminaria p={[0.55, 2.8, 0.3]} t={t} bal={balLum} />
    {/* janela na parede da esquerda (luz do fim da tarde) */}
    <group position={[-2.58, 1.55, -0.6]} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.02]} material={MAT('vistaOfi', () => new THREE.MeshBasicMaterial({map: texVista('cidade'), fog: false}))}><planeGeometry args={[0.9, 1.05]} /></mesh>
      {[[0, 0.55, 1.05, 0.08], [0, -0.56, 1.12, 0.08], [-0.49, 0, 0.08, 1.15], [0.49, 0, 0.08, 1.15], [0, 0, 0.04, 1.05], [0, 0, 0.9, 0.04]].map(([x, y, w, h], i) => <Cx key={i} a={[w, h, 0.08]} p={[x, y, 0.02]} m="#F2E6CF" line={0.6} sombra={false} />)}
    </group>
    {/* vaso de planta no canto e relógio de parede */}
    <group position={[2.0, 0, -1.7]}><Ci rt={0.16} rb={0.12} h={0.3} p={[0, 0.15, 0]} m="#C2674A" line={0.7} />{[0, 1, 2, 3, 4].map((i) => <Esf key={i} r={0.14} p={[Math.sin(i * 1.3) * 0.12, 0.42 + i * 0.07, Math.cos(i * 1.3) * 0.1]} s={[1, 0.6, 1]} m={i % 2 ? '#6E9A44' : '#5E8A3A'} line={0.6} seg={12} />)}</group>
    <group position={[1.35, 2.2, -2.17]}><Ci rt={0.16} h={0.04} rot={[Math.PI / 2, 0, 0]} m="#F7EBD2" line={0.7} seg={28} /><Linha a={[0, 0, 0.03]} b={[0, 0.1, 0.03]} r={0.008} /><Linha a={[0, 0, 0.03]} b={[Math.sin(t * 0.5) * 0.07, Math.cos(t * 0.5) * 0.07, 0.03]} r={0.006} /></group>
  </group>
);
// cabelo do inventor: tufos grisalhos dos lados (espetados no susto)
const CabeloInv = ({er = 0, touca = 0}) => (
  <group>
    {[-1, 1].map((l) => [0, 1, 2].map((i) => <Esf key={l + '' + i} r={0.045} p={[l * (0.16 + i * 0.012), 0.2 + i * 0.035 + er * 0.03, -0.03 - i * 0.02]} s={[0.8, 1 + er * 0.8, 0.9]} rot={[0, 0, -l * er * 0.6]} m="#DCD7CF" line={0.5} seg={10} />))}
    {[-0.05, 0.03, 0.09].map((x, i) => <Co key={'t' + i} r={0.026} h={0.03 + er * 0.12} p={[x, 0.345 + er * 0.03, -0.02]} rot={[0, 0, -x * 4 + (i - 1) * er * 0.4]} m="#DCD7CF" seg={8} line={0.5} />)}
    {touca > 0 ? <group position={[0, 0.3, -0.01]} rotation={[-0.15, 0, 0.35]}><Co r={0.15} h={0.32} p={[0.05, 0.12, 0]} rot={[0, 0, -0.5]} m="#6A6FD6" seg={18} line={0.7} /><Ci rt={0.155} h={0.05} m="#F4F0FF" seg={20} line={0.6} /><Esf r={0.04} p={[0.22, 0.2, 0]} m="#F4F0FF" line={0.5} seg={10} /></group> : null}
  </group>
);
const Gravata = ({cor = '#B83A3A'}) => <group position={[0, 0.86, 0.13]} rotation={[0.2, 0, 0]}>{[-1, 1].map((l) => <Co key={l} r={0.032} h={0.06} p={[l * 0.03, 0, 0]} rot={[0, 0, -l * Math.PI / 2]} m={cor} seg={4} line={0.5} />)}<Esf r={0.014} m={cor} line={0.4} seg={8} /></group>;
const Colete = () => <group>{[0.58, 0.67, 0.76].map((y, i) => <Esf key={i} r={0.012} p={[0, y, 0.175 - (y - 0.58) * 0.1]} m="#6A4022" line={0.3} seg={8} />)}</group>;
// guarda-chuva, ventilador e a ideia que junta os dois (guarda-chuva com hélice)
const GuardaChuva = ({p, rot = [0, 0, 0], s = 1, aberto = 1}) => (
  <group position={p} rotation={rot} scale={s}>
    <Tn geo={<coneGeometry args={[0.24 * aberto + 0.04, 0.12, 8, 1, true]} />} p={[0, 0.06, 0]} m={T('#D8323C', {side: THREE.DoubleSide})} line={0.7} />
    <Linha a={[0, 0.12, 0]} b={[0, -0.3, 0]} r={0.008} cor="#5A3720" />
    <mesh position={[0.03, -0.3, 0]} rotation={[0, 0, Math.PI]} material={B('#5A3720')}><torusGeometry args={[0.03, 0.008, 6, 12, Math.PI]} /></mesh>
  </group>
);
const Ventilador = ({p, rot = [0, 0, 0], s = 1, gira = 0, base = true}) => (
  <group position={p} rotation={rot} scale={s}>
    {base ? <><Ci rt={0.08} rb={0.1} h={0.03} p={[0, -0.2, 0]} m="#2F6F6A" seg={18} line={0.6} /><Linha a={[0, -0.19, 0]} b={[0, -0.04, 0]} r={0.012} cor="#2F6F6A" /></> : null}
    <Esf r={0.04} p={[0, 0, -0.02]} m="#2F6F6A" line={0.6} seg={12} />
    <group position={[0, 0, 0.03]} rotation={[0, 0, gira]}>{[0, 1, 2].map((i) => <Esf key={i} r={0.08} p={[Math.cos(i * 2.094) * 0.07, Math.sin(i * 2.094) * 0.07, 0]} s={[1, 0.45, 0.12]} rot={[0, 0, i * 2.094]} m="#9FD8E8" line={0.5} seg={12} />)}</group>
    <mesh position={[0, 0, 0.04]} material={B(LINHA)}><torusGeometry args={[0.15, 0.004, 4, 30]} /></mesh>
  </group>
);
const Invencao = ({p, rot = [0, 0, 0], s = 1, gira = 0}) => (
  <group position={p} rotation={rot} scale={s}>
    <GuardaChuva p={[0, 0, 0]} />
    <Linha a={[0, 0.12, 0]} b={[0, 0.2, 0]} r={0.01} cor="#2F6F6A" />
    <group position={[0, 0.21, 0]} rotation={[0, gira, 0]}>{[0, 1, 2].map((i) => <Esf key={i} r={0.11} p={[Math.cos(i * 2.094) * 0.1, 0, Math.sin(i * 2.094) * 0.1]} s={[1, 0.1, 0.35]} rot={[0, -i * 2.094, 0]} m="#9FD8E8" line={0.5} seg={12} />)}<Esf r={0.025} m="#2F6F6A" line={0.4} seg={8} /></group>
  </group>
);
const Peixe = ({p, t}) => <group position={p} rotation={[0, Math.sin(t * 1.3) * 0.4, Math.sin(t * 2) * 0.1]}><Esf r={0.08} s={[1.4, 0.8, 0.5]} m="#F2A541" line={0.6} seg={14} /><Co r={0.06} h={0.08} p={[-0.13, 0, 0]} rot={[0, 0, Math.PI / 2]} s={[1, 1, 0.3]} m="#E07A5F" seg={4} line={0.5} /><Esf r={0.015} p={[0.07, 0.02, 0.035]} m={B(LINHA)} line={0} seg={6} /></group>;
const Bule = ({p, t}) => <group position={p} rotation={[0.2, t * 0.4, 0.15]}><Esf r={0.09} s={[1, 0.85, 1]} m="#76C9C0" line={0.6} seg={14} /><Co r={0.025} h={0.12} p={[0.11, 0.03, 0]} rot={[0, 0, -1.1]} m="#76C9C0" seg={8} line={0.5} /><Esf r={0.025} p={[0, 0.09, 0]} m="#F4F0FF" line={0.4} seg={8} /><mesh position={[-0.1, 0.01, 0]} rotation={[0, 0, Math.PI / 2]} material={B('#4FA79E')}><torusGeometry args={[0.04, 0.01, 6, 12, Math.PI]} /></mesh></group>;
const Passaro = ({p, t}) => <group position={p} rotation={[0, 0.6, 0]}><Esf r={0.05} s={[1.2, 1, 1]} m="#F7D24A" line={0.6} seg={12} /><Esf r={0.035} p={[0.05, 0.04, 0]} m="#F7D24A" line={0.5} seg={10} /><Co r={0.012} h={0.03} p={[0.09, 0.04, 0]} rot={[0, 0, -Math.PI / 2]} m="#E07A5F" seg={6} line={0.4} />{[-1, 1].map((l) => <Esf key={l} r={0.04} p={[-0.01, 0.02, l * 0.04]} s={[0.9, 0.25, 0.7]} rot={[l * (0.4 + Math.sin(t * 14) * 0.5), 0, 0]} m="#E9B44C" line={0.4} seg={8} />)}</group>;

// ---------- ateliê do Dalí (outra sala, mesma luz) ----------
const texTela = () => canvasTex('telaDali', 512, 640, (g, w, h) => {
  g.fillStyle = '#F3E3C0'; g.fillRect(0, 0, w, h); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#7FB2E6'); gr.addColorStop(0.6, '#F6D7A6'); gr.addColorStop(1, '#C98F6B'); g.fillStyle = gr; g.fillRect(30, 30, w - 60, h - 60);
  g.fillStyle = '#8E5A47'; g.fillRect(30, h * 0.72, w - 60, h * 0.28 - 30);
  g.fillStyle = '#F7D24A'; g.beginPath(); g.ellipse(w * 0.62, h * 0.5, 60, 90, 0.4, 0, 7); g.fill(); g.strokeStyle = LINHA; g.lineWidth = 6; g.stroke();
  g.fillStyle = '#7B3F8C'; g.beginPath(); g.moveTo(w * 0.25, h * 0.75); g.quadraticCurveTo(w * 0.3, h * 0.3, w * 0.4, h * 0.2); g.quadraticCurveTo(w * 0.45, h * 0.5, w * 0.38, h * 0.75); g.fill();
  g.strokeStyle = '#5A3720'; g.lineWidth = 18; g.strokeRect(9, 9, w - 18, h - 18);
});
const Cavalete = ({p, rot = 0}) => (
  <group position={p} rotation={[0, rot, 0]}>
    {[-1, 1].map((l) => <Linha key={l} a={[l * 0.3, 0, 0.12]} b={[l * 0.1, 1.55, 0]} r={0.018} cor="#8A5A34" />)}<Linha a={[0, 0, -0.35]} b={[0, 1.5, -0.02]} r={0.018} cor="#8A5A34" />
    <Cx a={[0.7, 0.04, 0.08]} p={[0, 0.62, 0.06]} m="#8A5A34" line={0.6} />
    <mesh position={[0, 1.05, 0.09]} rotation={[-0.08, 0, 0]} material={lm('telaM', texTela)}><boxGeometry args={[0.66, 0.82, 0.03]} /></mesh>
  </group>
);
const Chave = ({p, rot = [0, 0, 0], s = 1}) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh material={OURO()}><torusGeometry args={[0.035, 0.011, 8, 20]} /></mesh><mesh material={HULL(0.6)}><torusGeometry args={[0.035, 0.011, 8, 20]} /></mesh>
    <Ci rt={0.009} h={0.16} p={[0, -0.115, 0]} m={OURO()} seg={8} line={0.5} />
    <Cx a={[0.035, 0.016, 0.012]} p={[0.02, -0.17, 0]} m={OURO()} line={0.5} /><Cx a={[0.026, 0.014, 0.012]} p={[0.016, -0.145, 0]} m={OURO()} line={0.5} />
  </group>
);
const BigodeDali = ({mola = 0}) => (
  <group position={[0, 0.138, 0.162]}>
    {[-1, 1].map((l) => <group key={l} scale={[l, 1, 1]}>
      <Esf r={1} s={[0.04, 0.016, 0.016]} p={[0.03, 0, 0]} rot={[0, 0, 0.2]} m={LINHA} line={0} seg={10} />
      <group position={[0.065, 0.01, -0.004]} rotation={[0, 0, 1.15 + mola * Math.sin(mola * 20) * 0.3]}><Co r={0.01} h={0.17} p={[0, 0.085, 0]} m={LINHA} seg={6} line={0} /></group>
    </group>)}
  </group>
);
const CabeloDali = () => <group><Tn geo={<sphereGeometry args={[0.172, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />} p={[0, 0.17, -0.025]} rot={[-0.35, 0, 0]} m="#2B2326" line={0.6} /></group>;
const PAREDE_DALI = () => lm('parDali', () => texPapelParede('dali', '#8D5BA8', '#7A4A96', 'oval'));
const Atelie = ({t}) => (
  <group>
    <Sala x={XD} piso={lm('pisoDali', () => texTabuas('dali', '#9E6A3C', [5, 5]))} parede={PAREDE_DALI()} lambri="#5E3A6E" teto="#E8D6EE" />
    <Plano p={[XD, 0.003, 0.15]} rot={[-Math.PI / 2, 0, 0]} a={[2.0, 2.0]} m={MAT('tapM', () => new THREE.MeshToonMaterial({map: texTapete(), gradientMap: GRAD, transparent: true, alphaTest: 0.5}))} />
    <Cavalete p={[XD - 1.05, 0, -0.9]} rot={0.45} />
    <group position={[XD + 1.3, 0, -1.6]}><Cx a={[0.5, 0.6, 0.4]} p={[0, 0.3, 0]} m="#5E3A6E" line={0.7} />{[0, 1, 2].map((i) => <Pote key={i} p={[-0.15 + i * 0.15, 0.6, 0]} cor={['#F7D24A', '#D8323C', '#2F6FE0'][i]} h={0.12} r={0.04} />)}</group>
    <group position={[XD + 0.9, 1.65, -2.17]}><mesh material={MAT('quadroDali', () => new THREE.MeshToonMaterial({map: texTela(), gradientMap: GRAD}))}><planeGeometry args={[0.55, 0.68]} /></mesh></group>
  </group>
);

// ---------- o "prédio do sono": 3 andares em corte (acordado, hipnagogia, sono pesado) e o elevador ----------
const texPlacaAndar = (txt, fundo, letra = '#FFFFFF') => canvasTex('pa' + txt, 1024, 200, (g, w, h) => {
  g.fillStyle = fundo; g.beginPath(); g.roundRect(6, 6, w - 12, h - 12, 40); g.fill(); g.strokeStyle = LINHA; g.lineWidth = 12; g.stroke();
  g.font = '900 118px MontLE, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 18; g.strokeStyle = LINHA; g.strokeText(txt, w / 2, h / 2 + 6); g.fillStyle = letra; g.fillText(txt, w / 2, h / 2 + 6);
});
const texLua = () => canvasTex('luaSono', 1024, 512, (g, w, h) => {
  g.fillStyle = '#2E3A72'; g.fillRect(0, 0, w, h); SEED = 51; for (let i = 0; i < 70; i++) { g.fillStyle = 'rgba(255,250,220,' + (0.4 + rnd() * 0.5) + ')'; g.beginPath(); g.arc(rnd() * w, rnd() * h, 2 + rnd() * 4, 0, 7); g.fill(); }
  g.fillStyle = '#FFF0B0'; g.beginPath(); g.arc(w * 0.72, h * 0.38, 90, 0, 7); g.fill(); g.fillStyle = '#2E3A72'; g.beginPath(); g.arc(w * 0.72 + 45, h * 0.38 - 25, 80, 0, 7); g.fill();
});
const texSonho = () => canvasTex('sonhoPar', 1024, 512, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#8E6BD8'); gr.addColorStop(0.5, '#C08BE0'); gr.addColorStop(1, '#6FA8E0'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  SEED = 61; for (let i = 0; i < 40; i++) { const x = rnd() * w, y = rnd() * h, r = 8 + rnd() * 16; g.fillStyle = ['#FFE36A', '#FFFFFF', '#F6B9E8'][i % 3]; g.globalAlpha = 0.75; g.beginPath(); for (let a = 0; a < 10; a++) { const rr = a % 2 ? r * 0.4 : r, an = a * Math.PI / 5 - Math.PI / 2; g.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } g.closePath(); g.fill(); }
  g.globalAlpha = 0.25; g.fillStyle = '#FFFFFF'; for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(rnd() * w, rnd() * h, 40 + rnd() * 60, 0, 7); g.fill(); } g.globalAlpha = 1;
});
const texDia = () => canvasTex('diaPar', 1024, 512, (g, w, h) => { g.fillStyle = '#F6D36B'; g.fillRect(0, 0, w, h); g.fillStyle = '#F0C24E'; for (let i = 0; i < 16; i++) g.fillRect(i * 64 + 26, 0, 12, h); g.fillStyle = '#9FD3F0'; g.fillRect(w * 0.6, h * 0.2, 260, 200); g.strokeStyle = '#F7EBD2'; g.lineWidth = 18; g.strokeRect(w * 0.6, h * 0.2, 260, 200); g.beginPath(); g.moveTo(w * 0.6 + 130, h * 0.2); g.lineTo(w * 0.6 + 130, h * 0.2 + 200); g.stroke(); g.fillStyle = '#FFE36A'; g.beginPath(); g.arc(w * 0.6 + 70, h * 0.2 + 60, 30, 0, 7); g.fill(); });
const H_AND = 1.6;
const Andar = ({y0, parede, placa, tom}) => (
  <group position={[0, y0, 0]}>
    <Cx a={[3.5, 0.12, 1.8]} p={[0.35, -0.06, 0]} m={tom} line={0.9} sombra={false} />
    <mesh position={[0, H_AND / 2, -0.8]} material={parede}><planeGeometry args={[2.6, H_AND]} /></mesh>
    <mesh position={[-1.3, H_AND / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={parede}><planeGeometry args={[1.6, H_AND]} /></mesh>
    {/* parede entre o andar e o poço do elevador, com a porta */}
    <Cx a={[0.08, H_AND, 0.45]} p={[1.3, H_AND / 2, -0.58]} m={tom} line={0.7} sombra={false} /><Cx a={[0.08, H_AND, 0.45]} p={[1.3, H_AND / 2, 0.58]} m={tom} line={0.7} sombra={false} /><Cx a={[0.08, 0.3, 0.75]} p={[1.3, H_AND - 0.15, 0]} m={tom} line={0.7} sombra={false} />
    <mesh position={[-0.45, 1.3, -0.785]} material={lm('placa' + placa, () => texPlacaAndar(placa, '#372C2E'))}><planeGeometry args={[1.15, 0.225]} /></mesh>
  </group>
);
const Elevador = ({p, porta = 1}) => (
  <group position={p}>
    <Cx a={[0.66, 0.06, 0.74]} p={[0, 0.03, 0]} m="#C9A34A" line={0.8} />
    <Cx a={[0.66, 0.08, 0.74]} p={[0, 1.32, 0]} m="#C9A34A" line={0.8} sombra={false} />
    <mesh position={[0.32, 0.68, 0]} rotation={[0, -Math.PI / 2, 0]} material={T('#E8C46A')}><planeGeometry args={[0.74, 1.28]} /></mesh>
    {[[-0.31, -0.35], [0.31, -0.35], [-0.31, 0.35], [0.31, 0.35]].map(([x, z], i) => <Cx key={i} a={[0.04, 1.28, 0.04]} p={[x, 0.68, z]} m="#B08A3A" line={0.6} />)}
    {/* grade sanfonada da frente, recolhida para o lado */}
    {Array.from({length: 4}).map((_, i) => <Linha key={'g' + i} a={[0.28 - i * 0.03 * (1 + 4 * (1 - porta)), 0.06, 0.37]} b={[0.28 - i * 0.03 * (1 + 4 * (1 - porta)), 1.28, 0.37]} r={0.006} cor="#7A5A1A" />)}
    <Linha a={[0, 1.36, 0]} b={[0, 6, 0]} r={0.008} />
  </group>
);
const Predio = ({t, yc, objs, merge, acordado, luzTopo, flashA}) => (
  <group position={[XP, 0, 0]}>
    <Andar y0={0} parede={lm('parSono', texLua)} placa="SONO PESADO" tom="#5A6AAE" />
    <Andar y0={H_AND} parede={lm('parSonho', texSonho)} placa="HIPNAGOGIA" tom="#A67FE0" />
    <Andar y0={2 * H_AND} parede={lm('parDia', texDia)} placa="ACORDADO" tom="#E9B44C" />
    <Cx a={[3.6, 0.14, 1.9]} p={[0.35, 3 * H_AND + 0.07, 0]} m="#E07A5F" line={0.9} sombra={false} />
    {/* telhado: a lâmpada gigante (o "cérebro" do prédio) */}
    <group position={[0, 3 * H_AND + 0.14, 0]}>
      <Ci rt={0.26} rb={0.3} h={0.28} p={[0, 0.14, 0]} m={FERRO()} seg={20} line={0.8} />
      <Esf r={0.5} p={[0, 0.72, 0]} s={[1, 1.12, 1]} m={luzTopo > 0.02 ? CAB_ACESA(luzTopo) : T('#EAF6FA')} line={0.9} seg={28} />
      <Halo p={[0, 0.75, 0.3]} k={luzTopo} s={2.4} id={7} />
    </group>
    {/* poço do elevador */}
    {[[1.33, -0.42], [1.97, -0.42], [1.33, 0.42], [1.97, 0.42]].map(([x, z], i) => <Cx key={'po' + i} a={[0.06, 3 * H_AND, 0.06]} p={[x, 1.5 * H_AND, z]} m="#7A5A1A" line={0.6} />)}
    {/* sono pesado: travesseiros enormes */}
    {[[-0.7, 0.18, 0.1, 0.4], [-0.15, 0.15, -0.3, 0.35], [0.5, 0.2, 0.15, 0.42], [-0.9, 0.12, -0.5, 0.3]].map(([x, y, z, r], i) => <Esf key={'tr' + i} r={r} p={[x, y, z]} s={[1.3, 0.45, 0.9]} rot={[0, i * 0.7, 0]} m={i % 2 ? '#E8E4FA' : '#C9D3F4'} line={0.8} seg={18} />)}
    {/* hipnagogia: ideias soltas boiando */}
    {objs.u > 0.01 ? <GuardaChuva p={objs.U} rot={[0.3, 0, 0.5 + Math.sin(t) * 0.1]} s={objs.u} /> : null}
    {objs.v > 0.01 ? <Ventilador p={objs.V} rot={[0.2, -0.4, Math.sin(t * 0.8) * 0.2]} s={objs.v} gira={t * 3} /> : null}
    {objs.o > 0.01 ? <><Peixe p={[-0.3, H_AND + 1.12 + Math.sin(t * 1.4) * 0.04, -0.35]} t={t} /><Bule p={[0.75, H_AND + 1.02 + Math.sin(t * 1.1 + 1) * 0.04, -0.45]} t={t} /><Passaro p={[-0.95, H_AND + 1.2 + Math.sin(t * 1.7 + 2) * 0.05, -0.5]} t={t} /></> : null}
    {merge.k > 0.01 ? <Invencao p={merge.p} rot={[0.15, 0, Math.sin(t * 2) * 0.12]} s={merge.k} gira={t * 9} /> : null}
    {/* acordado: guarda-chuva e ventilador separados, cada um no seu canto */}
    <GuardaChuva p={[-0.95, 2 * H_AND + 0.3, -0.2]} rot={[0, 0, 0.2]} aberto={0.2} />
    <group position={[0.55, 2 * H_AND, -0.25]}><Cx a={[0.3, 0.4, 0.3]} p={[0, 0.2, 0]} m="#8A5A34" line={0.6} /><Ventilador p={[0, 0.62, 0]} gira={0} /></group>
  </group>
);
// estrelas do céu do sonho
const ESTRELAS = Array.from({length: 60}).map((_, i) => [Math.sin(i * 12.9) * 9, 0.5 + ((i * 7.31) % 9), -6 - ((i * 3.7) % 6), 0.08 + (i % 4) * 0.04]);
const Estrelas = ({t}) => <group position={[XP, 0, 0]}>{ESTRELAS.map(([x, y, z, s], i) => <Brilho key={i} id={100 + i} p={[x, y, z]} k={0.5 + 0.25 * Math.sin(t * 2 + i)} s={s * 3} />)}</group>;

// ---------- laboratório de Paris ----------
const texAzulejo = () => canvasTex('azulejo', 1024, 1024, (g, w) => {
  g.fillStyle = '#E3F1EC'; g.fillRect(0, 0, w, w); const n = 8, s = w / n;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { g.fillStyle = (i + j) % 2 ? '#D3EAE3' : '#EAF6F2'; g.fillRect(i * s + 4, j * s + 4, s - 8, s - 8); }
  g.strokeStyle = 'rgba(90,120,115,0.6)'; g.lineWidth = 6; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, w); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke(); }
}, [4, 2]);
const texPlacar = (n) => canvasTex('placar' + n, 768, 900, (g, w, h) => {
  g.fillStyle = '#2E4A44'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8A5A34'; g.lineWidth = 30; g.strokeRect(15, 15, w - 30, h - 30);
  g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 6; g.beginPath(); g.moveTo(w / 2, 90); g.lineTo(w / 2, h - 60); g.stroke();
  // ícones: olho aberto (acordado) e "Zz" (cochilo curto)
  g.strokeStyle = '#FFFFFF'; g.lineWidth = 12; g.beginPath(); g.ellipse(w * 0.25, 140, 80, 42, 0, 0, 7); g.stroke(); g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(w * 0.25, 140, 24, 0, 7); g.fill();
  g.font = '900 110px MontLE, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Zz', w * 0.75, 140);
  if (n >= 4) { g.font = '900 170px MontLE, sans-serif'; g.lineJoin = 'round'; g.lineWidth = 22; g.strokeStyle = LINHA; g.strokeText('3x', w * 0.75, h - 130); g.fillStyle = '#FFE36A'; g.fillText('3x', w * 0.75, h - 130); }
});
const Placar = ({p, rot = 0, n, luzes}) => (
  <group position={p} rotation={[0, rot, 0]}>
    {[-1, 1].map((l) => <Linha key={l} a={[l * 0.42, 0, 0.1]} b={[l * 0.3, 1.9, 0]} r={0.02} cor="#8A5A34" />)}
    <mesh position={[0, 1.25, 0.04]} material={lm('placarM' + Math.min(n, 4), () => texPlacar(Math.min(n, 4)))}><boxGeometry args={[0.85, 1.0, 0.04]} /></mesh>
    {/* lâmpadas: 1 acesa do lado acordado, até 3 do lado do cochilo */}
    {[0, 1, 2].map((i) => <Lampada key={'a' + i} p={[-0.21, 0.9 + i * 0.17, 0.07]} s={0.75} acesa={i === 0 ? 1 : 0} />)}
    {[0, 1, 2].map((i) => <Lampada key={'b' + i} p={[0.21, 0.9 + i * 0.17, 0.07]} s={0.75} acesa={luzes[i]} />)}
    {luzes.map((k, i) => <Halo key={'h' + i} p={[0.21, 1.0 + i * 0.17, 0.12]} k={k} s={0.3} id={40 + i} />)}
    <Halo p={[-0.21, 1.0, 0.12]} k={1} s={0.3} id={39} />
  </group>
);
const CadeiraLab = ({p, cor = '#7FA8C9'}) => (
  <group position={p}>
    {[[-0.2, -0.17], [0.2, -0.17], [-0.2, 0.17], [0.2, 0.17]].map(([x, z], i) => <Linha key={i} a={[x, 0, z]} b={[x, 0.4, z]} r={0.012} cor="#5A6474" />)}
    <Cx a={[0.48, 0.05, 0.42]} p={[0, 0.42, 0.02]} m={cor} line={0.7} />
    <Cx a={[0.48, 0.42, 0.05]} p={[0, 0.66, -0.2]} rot={[-0.1, 0, 0]} m={cor} line={0.7} />
  </group>
);
const Garrafa = ({p, rot = [0, 0, 0]}) => <group position={p} rotation={rot}><Ci rt={0.027} h={0.13} p={[0, 0, 0]} m="#6FB7E9" seg={12} line={0.6} /><Ci rt={0.012} h={0.035} p={[0, 0.08, 0]} m="#2F6FE0" seg={8} line={0.4} /></group>;
const Laboratorio = ({t}) => (
  <group>
    <Sala x={XL} piso={lm('pisoLab', () => texTabuas('lab', '#C9A57A', [5, 5]))} parede={lm('parLab', texAzulejo)} lambri="#7FA8A0" teto="#F2F2EA" />
    {/* janelão com a cidade e a torre ao fundo */}
    <group position={[XL - 0.2, 1.65, -2.17]}>
      <mesh position={[0, 0, -0.01]} material={MAT('vistaParis', () => new THREE.MeshBasicMaterial({map: texVista('paris'), fog: false}))}><planeGeometry args={[1.5, 1.2]} /></mesh>
      {[[0, 0.62, 1.6, 0.08], [0, -0.62, 1.68, 0.08], [-0.78, 0, 0.08, 1.3], [0.78, 0, 0.08, 1.3], [0, 0, 0.05, 1.2], [0, 0, 1.5, 0.05]].map(([x, y, w, h], i) => <Cx key={i} a={[w, h, 0.08]} p={[x, y, 0.03]} m="#F7F2E6" line={0.6} sombra={false} />)}
    </group>
    {/* bancada com aparelhos */}
    <group position={[XL + 1.9, 0, -1.6]}><Cx a={[0.9, 0.8, 0.5]} p={[0, 0.4, 0]} m="#EDEDE6" line={0.7} /><Cx a={[0.4, 0.3, 0.3]} p={[-0.15, 0.95, 0]} m="#5A6474" line={0.6} /><Ci rt={0.09} h={0.03} p={[-0.15, 0.95, 0.16]} rot={[Math.PI / 2, 0, 0]} m="#9FD8E8" seg={18} line={0.5} /><Pote p={[0.25, 0.8, 0]} cor="#9FD08A" /></group>
  </group>
);

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
// placa de Petri: vidro, ágar e colônias pintadas
const texAgar = (k, mofo = 0, limpo = 0) => canvasTex('agar' + k, 512, 512, (g, w) => {
  SEED = 7 + k.length; g.fillStyle = '#F1D27A'; g.fillRect(0, 0, w, w);
  for (let i = 0; i < 70; i++) { const x = rnd() * w, y = rnd() * w; const dx = x - w * 0.28, dy = y - w * 0.3; if (limpo && Math.hypot(dx, dy) < w * 0.3) continue; g.fillStyle = ['#D9A5C8', '#E8B9D6', '#C98DB8'][i % 3]; g.beginPath(); g.arc(x, y, 6 + rnd() * 10, 0, 7); g.fill(); }
  if (mofo) { g.fillStyle = '#7DB85A'; g.beginPath(); g.arc(w * 0.28, w * 0.3, w * 0.1, 0, 7); g.fill(); g.fillStyle = '#A5D67E'; g.beginPath(); g.arc(w * 0.26, w * 0.28, w * 0.05, 0, 7); g.fill(); }
});
const Petri = ({p, rot = [0, 0, 0], s = 1, k = 'a', mofo = 0, limpo = 0, line = 0.5}) => (
  <group position={p} rotation={rot} scale={s}>
    <Ci rt={0.075} h={0.018} p={[0, 0.009, 0]} m={MAT('vidro', () => new THREE.MeshToonMaterial({color: '#CFE9F2', gradientMap: GRAD, transparent: true, opacity: 0.55}))} line={line} seg={22} />
    <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} material={MAT('agarM' + k + mofo + limpo, () => new THREE.MeshToonMaterial({map: texAgar(k, mofo, limpo), gradientMap: GRAD}))}><circleGeometry args={[0.07, 22]} /></mesh>
  </group>
);
// pilha de placas que balança
const Pilha = ({p, n = 8, bal = 0, s = 1}) => <group position={p} scale={s}>{Array.from({length: n}).map((_, i) => <Petri key={i} k={'p' + (i % 4)} p={[Math.sin(i * 2.1) * 0.006 + bal * i * 0.0022, i * 0.02, Math.cos(i * 1.7) * 0.005]} rot={[0, i * 0.7, bal * 0.04]} line={0.35} />)}</group>;
const Xicara = ({p, s = 1, teia = 0}) => (
  <group position={p} scale={s}>
    <Ci rt={0.045} rb={0.035} h={0.07} p={[0, 0.035, 0]} m="#F4F0E6" line={0.6} seg={18} />
    <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]} material={T('#8C6B3E')}><circleGeometry args={[0.04, 18]} /></mesh>
    {[0, 1, 2].map((i) => <Esf key={i} r={0.012} p={[-0.015 + i * 0.014, 0.068, (i % 2) * 0.01]} s={[1, 0.4, 1]} m="#8FB86A" line={0} seg={8} />)}
    <mesh position={[0.05, 0.04, 0]} rotation={[0, 0, Math.PI / 2]} material={T('#F4F0E6')}><torusGeometry args={[0.018, 0.006, 6, 12, Math.PI]} /></mesh>
    <Ci rt={0.07} h={0.008} p={[0, 0.002, 0]} m="#F4F0E6" line={0.5} seg={20} />
  </group>
);
// mosca: corpo preto e asas que batem
const Mosca = ({p, t, s = 1}) => (
  <group position={p} scale={s} rotation={[0, t * 3, 0]}>
    <Esf r={0.014} s={[1.3, 1, 1]} m="#2E2A2E" line={0.4} seg={10} />
    {[-1, 1].map((l) => <mesh key={l} position={[0, 0.012, l * 0.012]} rotation={[l * (0.6 + Math.sin(t * 90) * 0.5), 0, 0]} scale={[1, 0.15, 0.6]} material={MAT('asa', () => new THREE.MeshBasicMaterial({color: '#E8F4FF', transparent: true, opacity: 0.7}))}><sphereGeometry args={[0.018, 8, 6]} /></mesh>)}
  </group>
);
const Papel = ({p, rot = [0, 0, 0], s = 1, cor = '#FBF4E2'}) => <Cx a={[0.16 * s, 0.003, 0.21 * s]} p={p} rot={rot} m={cor} line={0.35} sombra={false} />;
const Microscopio = ({p, rot = 0}) => (
  <group position={p} rotation={[0, rot, 0]}>
    <Cx a={[0.12, 0.02, 0.14]} p={[0, 0.01, 0]} m="#3B4A5C" line={0.6} />
    <Cx a={[0.03, 0.18, 0.03]} p={[0, 0.1, -0.05]} m="#3B4A5C" line={0.6} />
    <Ci rt={0.02} rb={0.025} h={0.16} p={[0, 0.2, -0.01]} rot={[0.4, 0, 0]} m="#D8DEE6" line={0.6} seg={14} />
    <Cx a={[0.09, 0.012, 0.08]} p={[0, 0.09, 0.0]} m="#3B4A5C" line={0.5} />
  </group>
);
const Mala = ({p, rot = [0, 0, 0], s = 1}) => (
  <group position={p} rotation={rot} scale={s}>
    <Cx a={[0.3, 0.22, 0.09]} p={[0, 0, 0]} m="#9A5B34" line={0.8} />
    <Cx a={[0.31, 0.03, 0.095]} p={[0, 0.03, 0]} m="#6A3A1E" line={0.4} />
    <mesh position={[0, 0.13, 0]} material={B(LINHA)}><torusGeometry args={[0.035, 0.008, 6, 14, Math.PI]} /></mesh>
    <Cx a={[0.07, 0.05, 0.005]} p={[0.07, -0.04, 0.048]} m="#F2D06B" line={0.3} />
  </group>
);
const Chapeu = ({cor = '#3A3436', y = 0.3}) => <group position={[0, y, -0.005]}><Ci rt={0.2} h={0.015} m={cor} line={0.6} seg={24} /><Esf r={0.13} p={[0, 0.03, 0]} s={[1, 0.7, 1]} m={cor} line={0.6} seg={18} /><Ci rt={0.132} h={0.025} p={[0, 0.02, 0]} m="#B83A3A" line={0} seg={20} /></group>;
const Porco = ({p, ry = 0, s = 1, t = 0, boca = 0}) => (
  <group position={p} rotation={[0, ry, 0]} scale={s}>
    <Esf r={0.13} p={[0, 0.13, 0]} s={[1.2, 0.95, 1]} m="#F5A9B8" line={0.9} seg={22} />
    <Esf r={0.09} p={[0.12, 0.2, 0.05]} m="#F5A9B8" line={0.8} seg={20} />
    <Ci rt={0.04} h={0.04} p={[0.2, 0.2, 0.07]} rot={[0, 0, Math.PI / 2]} m="#F28EA3" line={0.6} seg={14} />
    {[-1, 1].map((l) => <Esf key={'n' + l} r={0.008} p={[0.222, 0.2, 0.07 + l * 0.014]} m={LINHA} line={0} seg={6} />)}
    {[-1, 1].map((l) => <Esf key={'o' + l} r={0.013} p={[0.18, 0.25, 0.05 + l * 0.04]} m={LINHA} line={0} seg={8} />)}
    {[-1, 1].map((l) => <Co key={'e' + l} r={0.03} h={0.05} p={[0.1, 0.29, 0.05 + l * 0.05]} rot={[l * 0.4, 0, -0.3]} m="#F28EA3" line={0.5} seg={8} />)}
    {[[-0.08, -0.06], [-0.08, 0.06], [0.08, -0.06], [0.08, 0.06]].map(([x, z], i) => <Ci key={i} rt={0.022} h={0.06} p={[x, 0.03, z]} m="#F28EA3" line={0.5} seg={8} />)}
    {boca > 0 ? <Esf r={0.02} p={[0.19, 0.155, 0.07]} s={[1, boca, 1]} m="#8A2E3C" line={0.3} seg={8} /> : null}
    <mesh position={[-0.16, 0.17, 0]} rotation={[0, 0, t * 6]} material={B('#F28EA3')}><torusGeometry args={[0.02, 0.006, 6, 12, Math.PI * 1.6]} /></mesh>
  </group>
);
const Lixeira = ({p}) => <group position={p}><Ci rt={0.13} rb={0.1} h={0.3} p={[0, 0.15, 0]} m="#7E8C96" line={0.7} seg={20} aberto /><Ci rt={0.1} h={0.01} p={[0, 0.01, 0]} m="#5E6A72" line={0} seg={16} />{[0, 1, 2].map((i) => <Esf key={i} r={0.05} p={[-0.04 + i * 0.04, 0.29, (i % 2) * 0.03]} m="#FBF4E2" line={0.4} seg={8} />)}</group>;
const Arquivo = ({p, abre = 0, teia = 0}) => (
  <group position={p}>
    <Cx a={[0.45, 0.9, 0.5]} p={[0, 0.45, 0]} m="#8E9B7A" line={0.8} />
    {[0, 1, 2].map((i) => <group key={i} position={[0, 0.2 + i * 0.27, 0.25 + (i === 1 ? abre * 0.35 : 0)]}>
      <Cx a={[0.4, 0.23, i === 1 ? 0.45 : 0.02]} p={[0, 0, i === 1 ? -0.22 : 0]} m="#A3B08E" line={0.6} />
      <Cx a={[0.12, 0.025, 0.03]} p={[0, 0.04, 0.015]} m="#C9CED6" line={0.4} />
    </group>)}
    {teia > 0 ? <mesh position={[0.2, 0.75, 0.27]} scale={teia} material={MAT('teiaM', () => new THREE.MeshBasicMaterial({map: texTeia(), transparent: true, depthWrite: false}))}><planeGeometry args={[0.35, 0.35]} /></mesh> : null}
  </group>
);
const texTeia = () => canvasTex('teia', 256, 256, (g, w) => { g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 3; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; g.beginPath(); g.moveTo(w / 2, w / 2); g.lineTo(w / 2 + Math.cos(a) * w / 2, w / 2 + Math.sin(a) * w / 2); g.stroke(); } for (let r = 20; r < w / 2; r += 22) { g.beginPath(); for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI * 2; g.lineTo(w / 2 + Math.cos(a) * r, w / 2 + Math.sin(a) * r); } g.stroke(); } });
const Aranha = ({p, t}) => <group position={p}><Linha a={[0, 0.5, 0]} b={[0, 0.03, 0]} r={0.0015} cor="#FFFFFF" /><Esf r={0.025} m="#2E2A2E" line={0.4} seg={10} />{[-1, 1].map((l) => [0, 1, 2].map((i) => <Linha key={l + '' + i} a={[0, 0, 0]} b={[l * 0.05, -0.02 + Math.sin(t * 8 + i) * 0.008, (i - 1) * 0.025]} r={0.003} />))}{[-1, 1].map((l) => <Esf key={'o' + l} r={0.006} p={[l * 0.009, 0.006, 0.022]} m="#FFFFFF" line={0} seg={6} />)}</group>;
// bola de feno (o "ninguém deu bola")
const Feno = ({p, rot = 0, s = 1}) => <group position={p} rotation={[0, 0, rot]} scale={s}>{[0, 1, 2, 3, 4].map((i) => <mesh key={i} rotation={[i * 0.7, i * 1.3, i * 0.4]} material={B('#B08A52')}><torusGeometry args={[0.12, 0.006, 5, 24]} /></mesh>)}<Esf r={0.09} m={MAT('feno', () => new THREE.MeshToonMaterial({color: '#C9A266', gradientMap: GRAD, transparent: true, opacity: 0.5}))} line={0} seg={10} /></group>;
// relógio de parede
const Relogio = ({p, t, vel = 1}) => <group position={p}><Ci rt={0.16} h={0.04} rot={[Math.PI / 2, 0, 0]} m="#F4F0E6" line={0.8} seg={28} /><Ci rt={0.17} h={0.03} p={[0, 0, -0.01]} rot={[Math.PI / 2, 0, 0]} m="#8A5A34" line={0.6} seg={28} />
  <group position={[0, 0, 0.025]} rotation={[0, 0, -t * vel]}><Cx a={[0.012, 0.13, 0.005]} p={[0, 0.06, 0]} m={LINHA} line={0} /></group>
  <group position={[0, 0, 0.028]} rotation={[0, 0, -t * vel / 12]}><Cx a={[0.016, 0.09, 0.005]} p={[0, 0.04, 0]} m={LINHA} line={0} /></group></group>;
// bactéria com carinha
const Bacteria = ({p, cor = '#C77DBA', s = 1, olhos = 'normal', t = 0, fase = 0, susto = 0}) => {
  const b = 1 + 0.06 * Math.sin(t * 7 + fase);
  return <group position={p} scale={s}>
    <Esf r={0.05} s={[1.25 * b, 0.9 / b, 1]} p={[0, 0.045, 0]} m={cor} line={0.7} seg={16} />
    {[0, 1, 2, 3, 4, 5].map((i) => { const a = i / 6 * Math.PI * 2 + fase; return <Linha key={i} a={[Math.cos(a) * 0.05, 0.045, Math.sin(a) * 0.04]} b={[Math.cos(a) * 0.075, 0.05 + Math.sin(t * 9 + i) * 0.01, Math.sin(a) * 0.06]} r={0.003} />; })}
    {[-1, 1].map((l) => <group key={l}><Esf r={0.014 * (1 + susto * 0.5)} p={[l * 0.018, 0.06, 0.04]} m="#FFFFFF" line={0.3} seg={8} /><Esf r={0.007} p={[l * 0.018, 0.06, 0.053]} m={LINHA} line={0} seg={6} /></group>)}
    {susto > 0 ? <Esf r={0.01} p={[0, 0.035, 0.047]} s={[1, 1.4, 0.5]} m="#5A2440" line={0} seg={6} /> : <Linha a={[-0.012, 0.035, 0.047]} b={[0.012, 0.035, 0.047]} r={0.0025} />}
  </group>;
};
// o mofo: tufos verdes com cara (vilão e depois herói, de capa)
const Mofo = ({p, s = 1, t = 0, cara = 'mau', capa = 0}) => (
  <group position={p} scale={s}>
    {[[0, 0.06, 0, 0.07], [0.06, 0.04, 0.02, 0.05], [-0.06, 0.04, 0.01, 0.05], [0.02, 0.1, -0.02, 0.05], [-0.03, 0.03, 0.05, 0.04], [0.05, 0.03, -0.05, 0.045]].map(([x, y, z, r], i) => <Esf key={i} r={r * (1 + 0.04 * Math.sin(t * 3 + i))} p={[x, y, z]} m={i % 2 ? '#8CC56A' : '#6FAE52'} line={0.7} seg={14} />)}
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = i / 8 * Math.PI * 2; return <Esf key={'f' + i} r={0.012} p={[Math.cos(a) * 0.09, 0.13 + Math.sin(i * 3) * 0.02, Math.sin(a) * 0.06]} m="#D8F0B0" line={0.3} seg={6} />; })}
    {[-1, 1].map((l) => <group key={l}><Esf r={0.018} p={[l * 0.025, 0.08, 0.065]} m="#FFFFFF" line={0.3} seg={10} /><Esf r={0.009} p={[l * 0.022, 0.078, 0.082]} m={LINHA} line={0} seg={6} />
      <Cx a={[0.035, 0.007, 0.005]} p={[l * 0.026, 0.104, 0.075]} rot={[0, 0, cara === 'mau' ? l * 0.45 : -l * 0.2]} m={LINHA} line={0} /></group>)}
    {cara === 'mau' ? <Linha a={[-0.02, 0.05, 0.075]} b={[0.02, 0.058, 0.075]} r={0.004} /> : <mesh position={[0, 0.055, 0.074]} rotation={[0, 0, Math.PI]} material={B(LINHA)}><torusGeometry args={[0.018, 0.004, 5, 12, Math.PI]} /></mesh>}
    {capa > 0 ? <group position={[0, 0.1, -0.06]} rotation={[0.3 + Math.sin(t * 6) * 0.15, 0, 0]} scale={capa}><Tn geo={<planeGeometry args={[0.16, 0.18]} />} p={[0, -0.09, 0]} m={T('#D8323C', {side: THREE.DoubleSide})} line={0.5} /></group> : null}
    {capa > 0 ? <Cx a={[0.05, 0.012, 0.012]} p={[0, 0.115, 0.06]} m="#D8323C" line={0.3} /> : null}
  </group>
);
// confete (pedacinhos de papel caindo e girando)
const CONF = Array.from({length: 60}).map((_, i) => [Math.sin(i * 12.9898) * 0.5 + 0.5, Math.sin(i * 78.233) * 0.5 + 0.5, Math.sin(i * 39.42) * 0.5 + 0.5, ['#E84A5F', '#F7D24A', '#4AA3E8', '#7FD08A', '#B57FE0', '#FF9A3C'][i % 6]]);
const Confete = ({c, t, t0, area = [2, 2, 1], n = 60}) => { const u = t - t0; if (u < 0 || u > 4) return null; return <group position={c}>{CONF.slice(0, n).map(([a, b, d, cor], i) => <mesh key={i} position={[(a - 0.5) * area[0] + Math.sin(u * 2 + i) * 0.05, area[1] - ((u * (0.5 + b * 0.5) + b * 0.3) * 0.9) % (area[1] + 0.3), (d - 0.5) * area[2]]} rotation={[u * 5 + i, u * 3 + i, 0]} material={T(cor, {side: THREE.DoubleSide})}><planeGeometry args={[0.03, 0.02]} /></mesh>)}</group>; };
// frasco de vidro com líquido
const Frasco = ({p, cor = '#F2C94C', s = 1, brilho = 0, nivel = 0.7}) => (
  <group position={p} scale={s}>
    <Ci rt={0.035} rb={0.045} h={0.12} p={[0, 0.06, 0]} m={MAT('vidro2', () => new THREE.MeshToonMaterial({color: '#E4F3F8', gradientMap: GRAD, transparent: true, opacity: 0.45}))} line={0.5} seg={14} />
    <Ci rt={0.04 - 0.004 * nivel} rb={0.042} h={0.11 * nivel} p={[0, 0.056 * nivel + 0.004, 0]} m={cor} line={0} seg={14} />
    <Ci rt={0.016} h={0.04} p={[0, 0.135, 0]} m="#E4F3F8" line={0.4} seg={10} />
    <Ci rt={0.019} h={0.02} p={[0, 0.16, 0]} m="#B07A4A" line={0.4} seg={10} />
  </group>
);
// ônibus vermelho de dois andares
const Onibus = ({p, ry = 0, t = 0}) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Cx a={[2.2, 0.75, 0.85]} p={[0, 0.6, 0]} m="#D8323C" line={1} />
    <Cx a={[2.1, 0.68, 0.83]} p={[0, 1.3, 0]} m="#D8323C" line={1} />
    <Cx a={[2.12, 0.05, 0.86]} p={[0, 0.98, 0]} m="#F2E6CF" line={0.5} />
    {[0, 1].map((a) => Array.from({length: 5}).map((_, i) => <Cx key={a + '' + i} a={[0.32, 0.28, 0.01]} p={[-0.8 + i * 0.4, 0.72 + a * 0.62, 0.43]} m="#BFE3F2" line={0.4} sombra={false} />))}
    {[-0.7, 0.7].map((x) => [-1, 1].map((l) => <group key={x + '' + l} position={[x, 0.18, l * 0.42]} rotation={[Math.PI / 2, 0, 0]}><Ci rt={0.17} h={0.08} rot={[0, -t * 8, 0]} m="#2E2A2E" line={0.6} seg={16} /><Ci rt={0.08} h={0.09} m="#C9CED6" line={0} seg={10} /></group>))}
    <Cx a={[0.5, 0.16, 0.01]} p={[0.55, 1.6, 0.43]} m="#F7D24A" line={0.3} sombra={false} />
  </group>
);
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
// estrelinhas de limpeza (brilho que pisca em vários pontos)
const Brilhos = ({pts, t, t0 = 0, s = 0.12, id = 300}) => <>{pts.map((q, i) => { const u = ((t - t0) * 1.3 + i * 0.37) % 1; return <Brilho key={i} id={id + i} p={q} k={t > t0 ? u : 0} s={s} />; })}</>;

// ================= vídeo 3: cenários =================
const PISO_LAB = () => lm('pisoLab', () => texTabuas('lab', '#A9784A', [5, 5]));
const PAREDE_LAB = () => lm('parLab', () => texReboco('lab', '#D6E4D2', ['#C2D4BE', '#E6EFE0', '#B8CBB2']));
const PAREDE_COL = () => lm('parCol', () => texReboco('col', '#E6F4F2', ['#F4FBFA', '#D8ECEA']));
const PAREDE_FAB = () => lm('parFab', () => texReboco('fab', '#D9C3A0', ['#C9AE86', '#E8D6B6']));
const PAREDE_QUA = () => lm('parQua', () => texPapelParede('qua', '#8FB8E8', '#7FA8DA', 'estrela'));
const texPedras = () => canvasTex('pedras', 1024, 1024, (g, w) => { SEED = 5; g.fillStyle = '#8E8A86'; g.fillRect(0, 0, w, w); for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) { const x = i * 64 + (j % 2) * 32, y = j * 64; g.fillStyle = ['#A39E98', '#9A948E', '#B0AAA2'][Math.floor(rnd() * 3)]; g.beginPath(); g.ellipse(x + 32, y + 32, 28, 26, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(55,44,46,0.6)'; g.lineWidth = 4; g.stroke(); } }, [8, 8]);
const texLama = () => canvasTex('lama', 1024, 1024, (g, w) => { SEED = 9; g.fillStyle = '#8A6A44'; g.fillRect(0, 0, w, w); for (let i = 0; i < 160; i++) { g.fillStyle = ['#7A5C3A', '#9C7A50', '#6E5234'][i % 3]; g.globalAlpha = 0.5; g.beginPath(); g.ellipse(rnd() * w, rnd() * w, 20 + rnd() * 70, 10 + rnd() * 30, rnd() * 3, 0, 7); g.fill(); } g.globalAlpha = 1; }, [6, 6]);
const Chao = ({p, a = [40, 40], m}) => <mesh position={p} rotation={[-Math.PI / 2, 0, 0]} material={m} receiveShadow><planeGeometry args={a} /></mesh>;
const PAPEIS = Array.from({length: 22}).map((_, i) => [Math.sin(i * 7.7) * 1.9, Math.cos(i * 3.3) * 0.9 - 0.5, i * 1.3]);
const IlhaLab = ({p, limpo = false, t = 0, bal = 0}) => (
  <group position={p}>
    <Cx a={[1.8, 0.8, 0.6]} p={[0, 0.4, 0]} m={limpo ? '#F4F4F2' : '#C9B48A'} line={0.8} />
    <Cx a={[1.9, 0.06, 0.7]} p={[0, 0.83, 0]} m={limpo ? '#FFFFFF' : '#5E4A3A'} line={0.8} />
    {[-0.6, 0, 0.6].map((x) => <Cx key={x} a={[0.5, 0.3, 0.01]} p={[x, 0.5, 0.305]} m={limpo ? '#E6EEF2' : '#B39E74'} line={0.4} sombra={false} />)}
    {limpo ? <>
      {Array.from({length: 6}).map((_, i) => <Petri key={i} k={'l' + i} p={[-0.65 + i * 0.26, 0.86, 0.1]} />)}
      {Array.from({length: 4}).map((_, i) => <Frasco key={'f' + i} p={[-0.45 + i * 0.3, 0.86, -0.15]} cor={['#7FC8E8', '#F2C94C', '#B57FE0', '#7FD08A'][i]} />)}
      <Microscopio p={[0.7, 0.86, -0.12]} />
    </> : <>
      <Pilha p={[-0.55, 0.86, 0.05]} n={11} bal={bal} />
      <Pilha p={[-0.3, 0.86, -0.15]} n={7} bal={bal * 0.6} />
      <Pilha p={[0.62, 0.86, 0.12]} n={5} bal={bal * 0.4} />
      <Microscopio p={[0.3, 0.86, -0.12]} rot={-0.3} />
      <Xicara p={[-0.02, 0.86, 0.15]} />
      {[0, 1, 2, 3, 4].map((i) => <Papel key={i} p={[-0.2 + i * 0.22, 0.865 + i * 0.002, -0.2 + (i % 2) * 0.25]} rot={[0, i * 0.8, 0]} />)}
      {[0, 1, 2].map((i) => <Frasco key={'f' + i} p={[0.75 + (i % 2) * 0.1, 0.86, -0.15 + i * 0.09]} cor={['#7FC8E8', '#F2C94C', '#B57FE0'][i]} nivel={0.3 + i * 0.2} />)}
    </>}
  </group>
);
const Pia = ({p, bal = 0, n = 14}) => (
  <group position={p}>
    <Cx a={[0.8, 0.82, 0.55]} p={[0, 0.41, 0]} m="#BFC9CF" line={0.8} />
    <Cx a={[0.7, 0.12, 0.45]} p={[0, 0.8, 0]} m="#E8EEF2" line={0.6} />
    <Ci rt={0.015} h={0.3} p={[0, 0.98, -0.2]} m={PRATA()} line={0.4} seg={8} />
    <Cx a={[0.03, 0.03, 0.15]} p={[0, 1.12, -0.13]} m={PRATA()} line={0.4} />
    <Pilha p={[-0.15, 0.86, 0.02]} n={n} bal={bal} />
    <Pilha p={[0.12, 0.86, -0.02]} n={Math.round(n * 0.7)} bal={-bal * 0.8} />
    <Pilha p={[0.05, 0.86, 0.15]} n={5} bal={bal * 0.5} />
  </group>
);
const Porta = ({p, abre = 0, placa = true, txt = 'FÉRIAS!\nVOLTO EM SETEMBRO', bal = 0}) => (
  <group position={p}>
    <Cx a={[0.95, 2.05, 0.06]} p={[0, 1.025, -0.02]} m="#6A4022" line={0.8} />
    <group position={[-0.42, 0, 0.02]} rotation={[0, -abre * 1.4, 0]}>
      <Cx a={[0.84, 1.95, 0.05]} p={[0.42, 0.975, 0]} m="#9A6A3E" line={0.8} />
      <Esf r={0.03} p={[0.76, 1.0, 0.04]} m={OURO()} line={0.4} seg={10} />
      {placa ? <group position={[0.42, 1.42, 0.03]} rotation={[0, 0, Math.sin(bal) * 0.25 * Math.exp(-bal * 0.3)]}><Placa p={[0, -0.12, 0.01]} txt={txt} w={0.56} h={0.24} fundo="#FFF4D6" fio /></group> : null}
    </group>
  </group>
);
const Lab = ({t, I}) => (
  <group>
    <Sala x={XLAB} piso={PISO_LAB()} parede={PAREDE_LAB()} janela={[1.0, 0.9]} janX={-0.9} lambri="#7C8F7A" />
    <IlhaLab p={[XLAB + 0.2, 0, -0.9]} bal={I.bal} t={t} />
    <Pia p={[XLAB + 1.85, 0, -1.85]} bal={I.bal * 1.3} n={I.nPia} />
    <Porta p={[XLAB - 2.0, 0, -2.17]} abre={I.porta} placa={I.placaFerias} bal={I.balPlaca} />
    <Arquivo p={[XLAB - 1.45, 0, -1.9]} abre={I.gaveta} teia={I.teia} />
    {I.aranha > 0 ? <Aranha p={[XLAB - 1.3, 1.25 - I.aranha * 0.35, -1.6]} t={t} /> : null}
    <Lixeira p={[XLAB + 1.3, 0, -0.35]} />
    {/* parede do fundo: prateleira, placa, calendário, relógio */}
    <Cx a={[1.1, 0.04, 0.22]} p={[XLAB + 0.75, 1.55, -2.08]} m="#8A5A34" line={0.6} />
    {[0, 1, 2, 3, 4].map((i) => <Frasco key={i} p={[XLAB + 0.35 + i * 0.2, 1.57, -2.05]} cor={['#7FC8E8', '#F2C94C', '#B57FE0', '#E8907F', '#7FD08A'][i]} s={1.2} />)}
    <Placa p={[XLAB + 0.15, 2.0, -2.17]} txt={'NÃO MEXA NA\nMINHA BAGUNÇA'} w={0.75} h={0.3} fundo="#FFE9A8" />
    <group position={[XLAB + 1.55, 1.85, -2.17]}><Placa p={[0, 0, 0]} txt={I.calTxt} w={0.4} h={0.5} fundo="#FFFFFF" tinta="#C0392B" moldura="#372C2E" /></group>
    <Relogio p={[XLAB - 0.35, 2.35, -2.16]} t={t} vel={I.relVel} />
    {/* papéis no chão */}
    {PAPEIS.map(([x, z, r], i) => <Papel key={i} p={[XLAB + x, 0.004 + i * 0.0004, z]} rot={[0, r, 0]} s={1.1} />)}
    {/* lâmpada do teto */}
    <Linha a={[XLAB + 0.2, 2.8, -0.9]} b={[XLAB + 0.2, 2.35, -0.9]} r={0.006} />
    <Co r={0.2} h={0.14} p={[XLAB + 0.2, 2.3, -0.9]} m="#4E7A64" line={0.6} seg={16} aberto />
    <Esf r={0.06} p={[XLAB + 0.2, 2.24, -0.9]} m={MAT('lampLab' + (I.luz > 0.5 ? 1 : 0), () => new THREE.MeshBasicMaterial({color: I.luz > 0.5 ? '#FFF2B8' : '#8E8A7A'}))} line={0.3} seg={10} />
  </group>
);
const LabLimpo = ({t}) => (
  <group>
    <Sala x={XCOL} piso={lm('pisoCol', () => texTabuas('col', '#D9C8A8', [5, 5]))} parede={PAREDE_COL()} lambri="#BFD9D6" />
    <IlhaLab p={[XCOL + 0.2, 0, -0.9]} limpo />
    <Placa p={[XCOL - 0.55, 1.95, -2.17]} txt={'TUDO NO\nLUGAR'} w={0.6} h={0.3} fundo="#FFFFFF" tinta="#2E7D6B" />
    {/* estante de prêmios vazia, com teia */}
    <group position={[XCOL + 1.15, 0, -2.0]}>
      <Cx a={[0.9, 1.6, 0.3]} p={[0, 0.8, 0]} m="#E9DCC4" line={0.8} />
      {[0.45, 0.9, 1.35].map((y) => <Cx key={y} a={[0.84, 0.03, 0.26]} p={[0, y, 0.03]} m="#C9B48A" line={0.4} />)}
      <Placa p={[0, 1.72, 0.16]} txt="NOSSOS PRÊMIOS" w={0.85} h={0.16} fundo="#F7D24A" />
      <mesh position={[0.3, 1.25, 0.16]} material={MAT('teiaM', () => new THREE.MeshBasicMaterial({map: texTeia(), transparent: true, depthWrite: false}))}><planeGeometry args={[0.3, 0.3]} /></mesh>
    </group>
    <Brilhos pts={[[XCOL - 0.4, 0.95, -0.7], [XCOL + 0.5, 0.95, -0.8], [XCOL + 0.1, 0.92, -0.6], [XCOL - 0.7, 1.0, -0.9], [XCOL + 0.8, 1.05, -0.95], [XCOL - 1.6, 0.05, -0.2], [XCOL + 1.6, 0.05, 0.2]]} t={t} t0={TM.bancada - 0.2} s={0.16} />
  </group>
);
// placa de Petri gigante para os planos de perto
const PlacaGigante = ({t, M}) => (
  <group>
    <Sala x={XPL} piso={lm('pisoPl', () => texTabuas('pl', '#8A5A34', [3, 3]))} parede={PAREDE_LAB()} lambri="#7C8F7A" larg={8} prof={6} />
    <Ci rt={1.2} h={0.06} p={[XPL, 0.03, -0.3]} m={MAT('vidroG', () => new THREE.MeshToonMaterial({color: '#CFE9F2', gradientMap: GRAD, transparent: true, opacity: 0.35}))} line={1} seg={48} aberto />
    <mesh position={[XPL, 0.02, -0.3]} rotation={[-Math.PI / 2, 0, 0]} material={MAT('agarG', () => new THREE.MeshToonMaterial({color: '#F1D27A', gradientMap: GRAD}))} receiveShadow><circleGeometry args={[1.18, 48]} /></mesh>
    {M.anel > 0 ? <mesh position={[XPL - 0.45, 0.023, -0.55]} rotation={[-Math.PI / 2, 0, 0]} material={MAT('anel', () => new THREE.MeshBasicMaterial({color: '#FFF8DC', transparent: true, opacity: 0.6}))}><circleGeometry args={[0.55 * M.anel, 40]} /></mesh> : null}
    {M.halo > 0 ? <Halo p={[XPL - 0.45, 0.15, -0.5]} k={M.halo} s={1.6} id={7} /> : null}
    <Mofo p={[XPL - 0.45, 0.02, -0.55]} s={M.s} t={t} cara={M.cara} capa={M.capa} />
    {M.bact.map((b, i) => b.vis ? <Bacteria key={i} p={b.p} cor={b.cor} s={b.s} t={t} fase={i} susto={b.susto} /> : null)}
    {M.pows.map((q, i) => <Faisca key={i} id={200 + i} p={q.p} k={q.k} s={0.35} />)}
  </group>
);
const Rua = ({t, multidao}) => (
  <group>
    <Chao p={[XRUA, 0, 0]} m={lm('pedrasM', texPedras)} />
    <Cx a={[14, 0.12, 1.2]} p={[XRUA, 0.06, -2.0]} m="#B8B0A6" line={0.6} />
    <Fachada p={[XRUA, 0, -2.9]} w={3.2} h={4.2} k="hosp" cor="#E2CFA8" />
    <Placa p={[XRUA, 2.75, -2.68]} txt="HOSPITAL ST. MARY'S" w={2.2} h={0.32} fundo="#2E4A6B" tinta="#FFF4D6" borda="#F7D24A" />
    <Cx a={[0.9, 1.3, 0.1]} p={[XRUA, 0.65, -2.68]} m="#5E3A22" line={0.7} />
    <Fachada p={[XRUA - 3.0, 0, -3.0]} w={2.6} h={3.4} k="a" cor="#B86A4E" />
    <Fachada p={[XRUA + 3.0, 0, -3.0]} w={2.6} h={3.8} k="b" cor="#A85E48" />
    <Fachada p={[XRUA - 5.6, 0, -3.1]} w={2.4} h={4.4} k="c" cor="#C98F6B" />
    <Fachada p={[XRUA + 5.6, 0, -3.1]} w={2.4} h={3.2} k="d" cor="#B97B5E" />
    {[-4.2, -1.8, 1.8, 4.2].map((x) => <Poste key={x} p={[XRUA + x, 0.12, -1.55]} />)}
    <Torre p={[XRUA + 3.5, 0, -16]} s={1.3} />
    {t > TM.londres - 0.2 && t < TM.alexander + 0.2 ? <Onibus p={[XRUA + lerp(-7, 6, cl((t - TM.londres + 0.2) / 2.8)), 0, -0.9]} t={t} /> : null}
    {t > TM.mil - 0.1 && t < TM.alexander + 0.2 ? <group position={[XRUA, 2.1, -1.5]} scale={[1, kf(t, [[TM.mil - 0.1, 0], [TM.mil + 0.15, 1, back]]), 1]}><Placa p={[0, 0, 0]} txt="LONDRES, 1928" w={1.6} h={0.36} fundo="#F7D24A" moldura={null} /><Linha a={[-0.8, 0.18, 0]} b={[-1.8, 0.1, 0]} r={0.005} /><Linha a={[0.8, 0.18, 0]} b={[1.8, 0.1, 0]} r={0.005} /></group> : null}
    {[[-6, 3.5, -8, 5], [5, 4.5, -9, 6], [0, 6, -12, 7]].map(([x, y, z, s], i) => <Nuvem key={i} id={80 + i} p={[XRUA + x, y, z]} s={s} />)}
    {multidao}
  </group>
);
const Fabrica = ({t}) => (
  <group>
    <Sala x={XFAB} piso={lm('pisoFab', () => texTabuas('fab', '#9A7A5A', [5, 5]))} parede={PAREDE_FAB()} larg={6} lambri="#6A5A4A" />
    <Placa p={[XFAB, 2.3, -2.17]} txt="OXFORD" w={1.1} h={0.3} fundo="#2E4A6B" tinta="#FFF4D6" borda="#F7D24A" />
    {[-1.9, -1.2, 1.3, 2.0].map((x, i) => <group key={i} position={[XFAB + x, 0, -1.7]}>
      <Ci rt={0.32} h={1.5} p={[0, 0.85, 0]} m="#C98A4A" line={0.8} seg={22} />
      <Esf r={0.32} p={[0, 1.6, 0]} s={[1, 0.4, 1]} m="#C98A4A" line={0.8} seg={22} />
      <Ci rt={0.04} h={0.8} p={[0, 2.1, 0]} m="#8E98A3" line={0.5} seg={8} />
      <Ci rt={0.1} h={0.02} p={[0.2, 1.0, 0.25]} rot={[Math.PI / 2, 0, 0]} m="#F4F0E6" line={0.5} seg={16} />
      <Cx a={[0.01, 0.08, 0.005]} p={[0.2, 1.0, 0.27]} rot={[0, 0, t * (2 + i)]} m={LINHA} line={0} />
    </group>)}
    <Cx a={[3.8, 0.1, 0.45]} p={[XFAB, 0.75, -0.6]} m="#4A4E56" line={0.8} />
    <Cx a={[3.8, 0.7, 0.4]} p={[XFAB, 0.37, -0.6]} m="#6E7682" line={0.8} />
    {Array.from({length: 14}).map((_, i) => { const x = ((i * 0.3 + t * 0.6) % 4.2) - 2.1; return <Frasco key={i} p={[XFAB + x, 0.8, -0.6]} cor="#F2C94C" brilho={1} />; })}
    {Array.from({length: 5}).map((_, j) => <group key={'pr' + j}><Cx a={[1.2, 0.03, 0.2]} p={[XFAB - 2.25 + (j % 2) * 4.5, 0.9 + Math.floor(j / 2) * 0.45, -1.0]} rot={[0, (j % 2 ? -1 : 1) * Math.PI / 2, 0]} m="#8A5A34" line={0.5} />{Array.from({length: 5}).map((_, i) => <Frasco key={i} p={[XFAB - 2.25 + (j % 2) * 4.5, 0.92 + Math.floor(j / 2) * 0.45, -1.4 + i * 0.2]} cor="#F2C94C" s={0.9} />)}</group>)}
    <Placa p={[XFAB + 1.65, 1.15, -0.37]} txt={'PENICILINA\nEM MASSA'} w={0.6} h={0.3} fundo="#FFFFFF" tinta="#C0392B" />
  </group>
);
const AVIOES = [[-6, 5, -9, 0], [-9, 5.8, -11, 1.5]];
const Guerra = ({t}) => (
  <group>
    <Chao p={[XGUE, 0, 0]} m={lm('lamaM', texLama)} />
    <Barraca p={[XGUE - 1.6, 0, -2.2]} s={1.4} cor="#E8E2D0" cruz />
    <Barraca p={[XGUE + 1.4, 0, -2.6]} s={1.2} />
    <Barraca p={[XGUE + 3.2, 0, -3.5]} s={1.3} />
    <Barraca p={[XGUE - 3.8, 0, -3.2]} s={1.2} />
    <Sacos p={[XGUE + 0.9, 0, 0.55]} n={5} />
    <Sacos p={[XGUE - 1.4, 0, 0.7]} n={4} ry={0.3} />
    {[-2.4, -1.4, 2.2, 3.0].map((x, i) => <group key={i}><Ci rt={0.025} h={0.55} p={[XGUE + x, 0.27, 1.1]} m="#6A4A2E" line={0.5} seg={6} /></group>)}
    <Linha a={[XGUE - 2.4, 0.45, 1.1]} b={[XGUE - 1.4, 0.4, 1.1]} r={0.004} cor="#8E98A3" />
    <Linha a={[XGUE + 2.2, 0.45, 1.1]} b={[XGUE + 3.0, 0.4, 1.1]} r={0.004} cor="#8E98A3" />
    <Placa p={[XGUE - 1.6, 1.7, -1.4]} txt="ENFERMARIA" w={0.8} h={0.2} fundo="#FFFFFF" tinta="#C0392B" />
    {/* catre */}
    <Cx a={[0.6, 0.06, 1.3]} p={[XGUE - 0.5, 0.35, -0.6]} m="#8C8A4E" line={0.7} />
    {[-1, 1].map((l) => [-1, 1].map((m2) => <Ci key={l + '' + m2} rt={0.02} h={0.35} p={[XGUE - 0.5 + l * 0.27, 0.17, -0.6 + m2 * 0.6]} m="#5E4A3A" line={0.4} seg={6} />))}
    {AVIOES.map(([x, y, z, f], i) => { const px = XGUE + x + ((t * 1.2 + f) % 14); return <group key={i} position={[px, y, z]} rotation={[0, 0, Math.sin(t + i) * 0.1]}><Cx a={[0.9, 0.12, 0.14]} m="#7A7F5A" line={0.6} /><Cx a={[0.16, 0.03, 1.2]} p={[0.15, 0.05, 0]} m="#7A7F5A" line={0.6} /><Cx a={[0.12, 0.2, 0.03]} p={[-0.4, 0.1, 0]} m="#7A7F5A" line={0.5} /></group>; })}
    {[[-5, 4, -10, 6], [4, 5, -12, 7]].map(([x, y, z, s], i) => <Nuvem key={i} id={90 + i} p={[XGUE + x, y, z]} s={s} />)}
  </group>
);
const PLATEIA = Array.from({length: 9}).map((_, i) => [(i - 4) * 0.45 + (i % 2) * 0.1, 0.9 + (i % 3) * 0.12, ['#4A5A8A', '#8A4A5A', '#4A7A5A', '#6A5A8A', '#8A6A3A'][i % 5]]);
const Palco = ({t}) => (
  <group>
    <Chao p={[XNOB, 0, 0]} m={lm('pisoNob', () => texTabuas('nob', '#8A4A2A', [6, 6]))} />
    <Cx a={[6, 0.4, 2.4]} p={[XNOB, 0.2, -1.2]} m="#6A3A22" line={0.8} />
    <Cortina p={[XNOB - 2.2, 0.4, -2.3]} w={2} h={3.2} />
    <Cortina p={[XNOB + 2.2, 0.4, -2.3]} w={2} h={3.2} />
    <Cortina p={[XNOB, 0.4, -2.5]} w={6} h={3.2} />
    {Array.from({length: 12}).map((_, i) => <Co key={i} r={0.28} h={0.35} p={[XNOB - 2.75 + i * 0.5, 3.55, -2.2]} rot={[Math.PI, 0, 0]} m="#B3263A" line={0.5} seg={8} />)}
    <Placa p={[XNOB, 2.75, -2.2]} txt={'PRÊMIO NOBEL\n1945'} w={1.8} h={0.55} fundo="#F7D24A" tinta="#6A3A22" borda="#6A3A22" />
    <Cx a={[0.5, 0.9, 0.35]} p={[XNOB + 1.3, 0.85, -0.6]} m="#8A5A34" line={0.7} />
    {[-1.2, 0, 1.2].map((x, i) => <mesh key={i} position={[XNOB + x, 2.0, -0.9]} material={MAT('foco', () => new THREE.MeshBasicMaterial({color: '#FFF6C8', transparent: true, opacity: 0.16, depthWrite: false}))}><coneGeometry args={[0.55, 3.2, 20, 1, true]} /></mesh>)}
  </group>
);
const Quarto = ({t}) => (
  <group>
    <Sala x={XQUA} piso={lm('pisoQua', () => texTabuas('qua', '#C99A6A', [5, 5]))} parede={PAREDE_QUA()} lambri="#FFFFFF" janela={[0.9, 0.8]} janX={0.9} />
    <Cama p={[XQUA - 1.4, 0, -1.3]} />
    <Porta p={[XQUA + 2.0, 0, -2.17]} placa txt={'CIENTISTA\nTRABALHANDO'} abre={0.6} />
    {Array.from({length: 14}).map((_, i) => <Brinquedo key={i} p={[XQUA + Math.sin(i * 5.1) * 1.8, 0, Math.cos(i * 2.7) * 0.8 - 0.6]} tipo={i % 3} rot={i * 0.9} />)}
    <Placa p={[XQUA - 0.2, 1.9, -2.17]} txt={'LABORATÓRIO\nSECRETO'} w={0.7} h={0.3} fundo="#FFE9A8" tinta="#2E4A6B" />
    <Gato pos={[XQUA - 1.4, 0.45, -1.2]} ry={0.4} pose="dorme" olhos="fechado" t={t} />
  </group>
);

// ================= vídeo 3: atuação =================
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
const COR_JAL = '#F4F2EC';
const CabeloFl = () => <group><Tn geo={<sphereGeometry args={[0.172, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.38]} />} p={[0, 0.17, -0.012]} rot={[-0.25, 0, 0.12]} m="#B9B2A8" line={0.6} />{[-1, 1].map((l) => <Esf key={l} r={0.045} p={[l * 0.165, 0.19, -0.04]} s={[0.7, 1, 0.9]} m="#B9B2A8" line={0.5} seg={10} />)}</group>;
const OculosSol = () => <group>{[-1, 1].map((l) => <mesh key={l} position={[l * 0.062, 0.19, 0.163]} rotation={[0, l * 0.35, 0]} scale={[1, 0.8, 0.4]} material={B('#2E2A2E')}><sphereGeometry args={[0.048, 14, 10]} /></mesh>)}<Linha a={[-0.02, 0.2, 0.17]} b={[0.02, 0.2, 0.17]} r={0.006} /></group>;
const Colar = () => <group position={[0, 0.8, 0.02]}>{Array.from({length: 14}).map((_, i) => { const a = i / 14 * Math.PI * 2; return <Esf key={i} r={0.03} p={[Math.cos(a) * 0.15, -0.05 - Math.max(0, Math.sin(a)) * 0.08 + 0.04, Math.sin(a) * 0.14 + 0.03]} m={['#F25C8A', '#F7D24A', '#FF9A3C'][i % 3]} line={0.3} seg={8} />; })}</group>;
const Oculos = () => <group>{[-1, 1].map((l) => <mesh key={l} position={[l * 0.062, 0.19, 0.162]} rotation={[0, l * 0.35, 0]} material={B(LINHA)}><torusGeometry args={[0.045, 0.006, 6, 20]} /></mesh>)}<Linha a={[-0.018, 0.2, 0.17]} b={[0.018, 0.2, 0.17]} r={0.005} /></group>;
const Jaleco = () => <group>{[0.52, 0.62, 0.72].map((y, i) => <Esf key={i} r={0.012} p={[0.03, y, 0.18 - (y - 0.52) * 0.08]} m="#A9B4C6" line={0.3} seg={8} />)}<Cx a={[0.07, 0.07, 0.01]} p={[-0.08, 0.68, 0.16]} rot={[-0.15, 0.4, 0]} m="#DCE6EE" line={0.4} /></group>;
const Topete = ({cor = '#6A4022'}) => <group><Tn geo={<sphereGeometry args={[0.17, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.4]} />} p={[0, 0.18, -0.01]} m={cor} line={0.6} /><Esf r={0.07} p={[0.03, 0.33, 0.07]} s={[1.3, 0.8, 1]} rot={[0.4, 0, 0.3]} m={cor} line={0.6} seg={12} /></group>;
const Coque = ({cor = '#8A4A2A'}) => <group><Tn geo={<sphereGeometry args={[0.172, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.45]} />} p={[0, 0.17, -0.01]} m={cor} line={0.6} /><Esf r={0.08} p={[0, 0.36, -0.08]} m={cor} line={0.6} seg={12} /></group>;
const Touca = () => <group position={[0, 0.3, 0]}><Ci rt={0.12} rb={0.15} h={0.08} m="#FFFFFF" line={0.6} seg={18} /><Cx a={[0.06, 0.018, 0.005]} p={[0, 0.0, 0.14]} m="#D8323C" line={0} /><Cx a={[0.018, 0.06, 0.005]} p={[0, 0.0, 0.14]} m="#D8323C" line={0} /></group>;
const Etiqueta = ({txt, k}) => k > 0.01 ? <group position={[0, 1.55, 0]} scale={k}><Placa p={[0, 0, 0]} txt={txt} w={0.42} h={0.13} fundo="#FFFFFF" tinta="#2E4A6B" moldura="#2E4A6B" /></group> : null;

// ---------- Fleming (o Senhor Sticker de jaleco) ----------
const B0 = [0.3, 0, -1.5], DOOR = [-1.75, 0, -1.6];
const faceFl = (t) => expr(t, [
  [0, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5}], [TM.louca, {olhos: 'semi', boca: 'canto', sob: 0.4}],
  [TM.salvou, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.8, pop: 0.2}],
  [TM.alexander, {olhos: 'normal', boca: 'sorriso', olhar: [0, -0.8]}], [TM.baguncado, {olhos: 'normal', boca: 'canto', olhar: [0, -0.8]}],
  [TM.colegas, {olhos: 'normal', boca: 'reta', olhar: [-0.8, 0.1]}], [TM.chiqueiro, {olhos: 'semi', boca: 'reta', sob: -0.2, olhar: [-0.7, 0]}],
  [TM.so, {olhos: 'semi', boca: 'canto', sob: 0.5, assim: 0.03, olhar: [0.3, 0]}], [TM.saiu2, {olhos: 'feliz', boca: 'sorrisoD'}],
  [TM.volta, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5}], [TM.pegou, {olhos: 'normal', boca: 'sorriso', olhar: [0.5, -0.5]}],
  [TM.parou - 0.05, {olhos: 'grande', boca: 'O', sob: -0.9, pop: 0.35, semPisca: true, olhar: [0.3, -0.6]}],
  [TM.fleming3 - 0.1, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.8}], [TM.penicilina + 0.3, {olhos: 'feliz', boca: 'grito', bochecha: 0.8}],
  [TM.so2, {olhos: 'tedio', boca: 'triste', sob: -0.3}], [TM.nao, {olhos: 'normal', boca: 'nervoso', olhar: [0.2, -0.6], sob: -0.5}], [TM.remedio + 0.1, {olhos: 'grande', boca: 'nervoso', trem: 0.6, sob: -0.8, semPisca: true}],
  [TM.descoberta, {olhos: 'semi', boca: 'triste', sob: -0.5}],
  [TM.mil2, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.7}], [TM.nobel, {olhos: 'feliz', boca: 'grito', bochecha: 0.9, pop: 0.3}],
], 0.2);
const fleming = (t) => {
  const F = faceFl(t); let pos = B0, ry = 0, mP = null, mN = null, inc = 0, cab = [0, 0, 0], pe = null, vis = true, mala = 0, chapeu = 0, praia = 0, placa = null, alt = 0, estica = 0, frasco = null;
  if (t < TM.salvou - 0.19) { // tchau na porta, de mala e chapéu
    pos = DOOR; ry = 0.35; mala = 1; chapeu = 1;
    mP = PM(pos, ry, [0.3, 1.25 + Math.sin(t * 12) * 0.05, 0.1 + Math.sin(t * 12) * 0.03]); mN = PM(pos, ry, [-0.24, 0.33, 0.04]);
  } else if (t < TM.londres) { // nos ombros da multidão (rua)
    pos = [XRUA, 0.6, 0.3]; ry = 0; placa = [XRUA + 0.02, 2.13, 0.42];
    mP = [XRUA + 0.1, 2.03, 0.4]; mN = [XRUA - 0.1, 2.03, 0.4];
  } else if (t < TM.so) { // trabalhando na bancada
    pos = B0; inc = t < TM.colegas ? 0.32 : 0.05; cab = t < TM.colegas ? [0.35, 0, 0] : [0, 0.25, 0];
    mP = PM(pos, ry, [0.2, 0.88, 0.32]); mN = PM(pos, ry, [-0.2, 0.88, 0.32]);
  } else if (t < TM.saiu2) { // dá de ombros
    const k = kf(t, [[TM.so, 0], [TM.ombros, 1, back], [TM.saiu2 - 0.15, 1]]);
    mP = PM(pos, ry, [0.32 + 0.05 * k, 0.5 + 0.48 * k, 0.12]); mN = PM(pos, ry, [-0.32 - 0.05 * k, 0.5 + 0.48 * k, 0.12]); alt = -0.04 * k; cab = [0, 0, 0.12 * k];
  } else if (t < TM.sem2) { // pega o chapéu e sai pela porta
    const C = caminho(t, [[TM.saiu2, B0, 0], [TM.saiu2 + 0.15, B0, -1.4], [TM.ferias2 + 0.45, [-0.9, 0, -1.4], -1.4], [TM.sem2 - 0.05, [-2.0, 0, -2.0], -2.2]]);
    pos = C.pos; ry = C.ry; pe = C.anda ? passo(t) : null; pos = [pos[0], quica(t, C.anda), pos[2]]; chapeu = 1; mala = 1;
    mP = PM(pos, ry, [0.25, 0.45 + Math.sin(t * 9) * 0.04, Math.sin(t * 9) * 0.08]); mN = PM(pos, ry, [-0.24, 0.33, 0.04]);
  } else if (t < TM.volta - 0.1) { vis = false;
  } else if (t < TM.pegou) { // volta das férias: óculos escuros e colar havaiano
    const C = caminho(t, [[TM.volta - 0.1, [-2.0, 0, -2.05], 0.3], [TM.pegou, [-1.55, 0, -1.35], 0.3]]);
    pos = [C.pos[0], quica(t, 1), C.pos[2]]; ry = C.ry; pe = passo(t); praia = 1; mala = 1;
    mP = PM(pos, ry, [0.3, 1.2 + Math.sin(t * 12) * 0.05, 0.1]); mN = PM(pos, ry, [-0.24, 0.33, 0.04]);
  } else if (t < TM.tinha2) { // pega a placa e leva até o lixo... e para
    const ir = kf(t, [[TM.pegou, 0], [TM.jogar, 1]]);
    pos = [lerp(B0[0], 0.75, ir), 0, -1.5]; ry = lerp(0, 0.9, ir); praia = 1;
    const mao = mix([-0.25, 0.92, -1.0], [1.12, 1.0, -1.45], ir);
    mP = t > TM.parou ? add(mao, [0, 0.03 * Math.sin(t * 40) * kf(t, [[TM.parou, 1], [TM.parou + 0.5, 0]]), 0]) : mao; mN = PM(pos, ry, [-0.25, 0.45, 0.05]); placa = add(mP, [0, 0.02, 0]);
    inc = 0.1;
  } else if (t < TM.so2) { // o "Rei Leão": ergue a placa
    praia = t < TM.fleming3 ? 1 : 0; const k = kf(t, [[TM.fleming3 - 0.05, 0], [TM.chamou + 0.2, 1, back]]);
    mP = PM(pos, ry, [0.08, lerp(0.9, 1.75, k), 0.15]); mN = PM(pos, ry, [-0.08, lerp(0.9, 1.75, k), 0.15]); placa = [pos[0], lerp(0.95, 1.82, k), pos[2] + 0.16]; estica = 0.2 * k; cab = [-0.25 * k, 0, 0];
  } else if (t < TM.nao) { // desanimado, placa na mão
    mP = PM(pos, ry, [0.18, 0.62, 0.22]); placa = add(mP, [-0.05, 0.02, 0]); mN = PM(pos, ry, [-0.25, 0.42, 0.05]); inc = 0.12; cab = [0.2, 0, 0];
  } else if (t < TM.descoberta) { // tenta fabricar: derrama o frasco e só sai uma gota
    const k = kf(t, [[TM.nao, 0], [TM.fabricar, 1]]);
    mP = PM(pos, ry, [0.15, 0.95 + 0.05 * k, 0.35]); mN = PM(pos, ry, [-0.12, 0.92, 0.33]); frasco = {p: add(mP, [0, 0.02, 0]), rot: [0, 0, -1.6 * k]}; inc = 0.15;
  } else if (t < TM.ate) { // guarda na gaveta
    const C = caminho(t, [[TM.descoberta - 0.05, B0, -0.8], [TM.descoberta + 0.6, [-1.15, 0, -1.3], -2.6], [TM.esquecida2 + 0.1, [-1.15, 0, -1.3], -2.6], [TM.anos, [-0.2, 0, -1.6], 1.6 - 2 * Math.PI]]);
    pos = [C.pos[0], quica(t, C.anda), C.pos[2]]; ry = C.ry; pe = C.anda ? passo(t) : null;
    const guarda = t > TM.descoberta + 0.6 && t < TM.esquecida2 + 0.1;
    mP = guarda ? [-1.42, 0.62, -1.45] : PM(pos, ry, [0.25, 0.6, 0.1]); mN = PM(pos, ry, [-0.24, 0.42, 0.04]); placa = t < TM.esquecida2 - 0.2 ? add(mP, [0, 0.02, 0]) : null; inc = guarda ? 0.3 : 0;
  } else { // no palco do Nobel
    pos = [XNOB, 0.4, -0.9]; ry = 0; const med = kf(t, [[TM.ganharam, 0], [TM.premio, 1, back]]);
    const ap = t > TM.nobel ? 1 : 0; mP = ap ? [XNOB + 0.28, 1.95 + Math.sin(t * 10) * 0.04, -0.75] : PM(pos, ry, [0.25, 0.45, 0.05]); mN = ap ? [XNOB - 0.28, 1.95 + Math.cos(t * 10) * 0.04, -0.75] : PM(pos, ry, [-0.25, 0.45, 0.05]);
    return {pos, ry, vis, med, c: {cor: COR_JAL, ...F, inc, cab, mP, mN, pe: null, t, fase: 0.3, resp: t * 3, roupa: <><Jaleco /><Gravata cor="#3A62B8" /></>, cabeca: <CabeloFl />}};
  }
  return {pos, ry, vis, mala, placa, frasco, c: {cor: praia ? '#F28E5A' : COR_JAL, ...F, inc, cab, mP, mN, pe, alt, estica, t, fase: 0.3, resp: t * 3,
    roupa: praia ? <><Colar /></> : <><Jaleco /><Gravata cor="#3A62B8" /></>, cabeca: <><CabeloFl />{chapeu ? <Chapeu y={0.31} /> : null}{praia ? <OculosSol /> : null}</>}};
};
// ---------- colegas zombando (laboratório) e orgulhosos (laboratório limpo) ----------
const COLS = [
  {cab: () => <><Oculos /><Topete cor="#3A3436" /></>, cor: '#E8EEF2', pele: null, gr: '#2E7D6B'},
  {cab: () => <><BigodeGuidao /></>, cor: '#F2EEE2', pele: '#FFF1E6', gr: '#B83A3A'},
  {cab: () => <><Topete cor="#C9702A" /></>, cor: '#EEF2E6', pele: null, gr: '#7A4AA8'},
];
const colega = (t, k) => {
  const v = COLS[k]; let pos, ry, F, mP = null, mN = null, inc = 0, cab = [0, 0, 0], vis = true, lat = 0;
  if ((t > TM.colegas - 0.5 && t < TM.so + 0.1) || (t > TM.so2 - 0.2 && t < TM.nao)) { // na porta do laboratório
    pos = [[-1.7, 0, -1.25], [-1.25, 0, -1.0], [-0.95, 0, -1.55]][k]; ry = [0.7, 0.55, 0.45][k];
    if (t < TM.so2) {
      const ri = Math.sin(t * 22 + k) * 0.5 + 0.5;
      F = expr(t, [[0, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.6}], [TM.fleming2 - 0.1, {olhos: k === 1 ? 'semi' : 'feliz', boca: 'sorrisoD', sob: k === 1 ? 0.5 : 0, bochecha: 0.6}], [TM.chiqueiro + 0.1, {olhos: 'feliz', boca: 'grito', bochecha: 0.9}]], k);
      if (k === 1) { const b = fala(t, TM.fleming2, TM.chiqueiro + 0.6); if (b) F = {...F, boca: b}; }
      mN = k === 1 ? PM(pos, ry, [0.25, 0.85 + 0.05 * ri, 0.32]) : PM(pos, ry, [-0.02, 1.08, 0.2]); // aponta / tapa o nariz
      mP = k === 1 ? PM(pos, ry, [0.3, 0.55, 0.1]) : PM(pos, ry, [0.25, 0.4 + 0.08 * ri, 0.1]);
      inc = (k === 1 ? 0.05 : -0.1) - 0.08 * ri * (t > TM.chiqueiro ? 1 : 0.4); lat = 0.05 * Math.sin(t * 11 + k);
    } else { // bocejando ("ninguém deu bola")
      F = expr(t, [[0, {olhos: 'fechado', boca: 'grito', abre: 0.4, semPisca: true}], [TM.bola + 0.3 + k * 0.1, {olhos: 'tedio', boca: 'reta', semPisca: true}]], k);
      mP = PM(pos, ry, [0.05, 1.12, 0.18]); mN = PM(pos, ry, [-0.32, 1.05 + k * 0.05, 0.0]); inc = -0.15;
    }
  } else if (t > TM.colegas2 - 0.3) { // laboratório limpo: posam, brilham... e sem medalha
    pos = [[XCOL - 0.5, 0, -0.2], [XCOL + 0.2, 0, -0.1], [XCOL + 0.9, 0, -0.2]][k]; ry = [0.15, 0, -0.15][k];
    const triste = t > TM.nenhuma + 0.1;
    F = expr(t, [[0, {olhos: 'semi', boca: 'canto', sob: 0.4, assim: 0.03}], [TM.bancada, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.4}], [TM.nenhuma + 0.15 + k * 0.08, {olhos: 'normal', boca: 'O', olhar: [0, -1], sob: -0.4, semPisca: true}], [TM.medalha + 0.25, {olhos: 'tedio', boca: 'triste', sob: -0.5, olhar: [0, -0.6]}]], k);
    mP = triste ? PM(pos, ry, [0.08, 0.72, 0.2]) : PM(pos, ry, [0.25, 0.5, 0.08]); mN = triste ? PM(pos, ry, [-0.08, 0.72, 0.2]) : PM(pos, ry, [-0.25, 0.5, 0.08]);
    inc = triste ? 0.2 : -0.08; cab = triste ? [0.4, 0, 0] : [0, 0, 0];
  } else return {vis: false};
  return {pos, ry, vis, c: {cor: v.cor, pele: v.pele, ...F, mP, mN, inc, lat, cab, t, fase: k * 1.7, resp: t * 3 + k, cabeca: v.cab(), roupa: <><Jaleco /><Gravata cor={v.gr} /></>}};
};
// ---------- multidão na rua (gancho) ----------
const MULT = Array.from({length: 16}).map((_, i) => ({x: (i % 8 - 3.5) * 0.42 + (Math.floor(i / 8) % 2) * 0.2, z: 0.85 + Math.floor(i / 8) * 0.55 - Math.abs(i % 8 - 3.5) * 0.05, cor: ['#E58FA0', '#7FB8E0', '#9FD08A', '#B79BE0', '#F0B66A', '#E07F6A', '#6AC0B0', '#D9A05B'][i % 8], chapeu: i % 3 === 0, fase: i * 1.37}));
const pessoaMult = (t, m, i) => {
  if (Math.abs(m.x) < 0.45) return null;
  const pul = Math.max(0, Math.sin(t * 9 + m.fase)) * 0.06; const pos = [XRUA + m.x, pul, m.z]; const ry = -m.x * 0.25 + Math.PI;
  const F = {olhos: i % 2 ? 'feliz' : 'normal', boca: 'sorrisoD', bochecha: 0.5, ...(pisca(t, m.fase) ? {olhos: 'pisca'} : {})};
  return {pos, ry, c: {cor: m.cor, ...F, mP: PM(pos, ry, [0.2, 1.2 + Math.sin(t * 9 + m.fase) * 0.06, 0.05]), mN: PM(pos, ry, [-0.2, 1.15 + Math.cos(t * 9 + m.fase) * 0.06, 0.05]), t, fase: m.fase, resp: t * 3 + m.fase, cabeca: m.chapeu ? <Chapeu y={0.31} cor={['#3A3436', '#6A4022'][i % 2]} /> : null}};
};
// ---------- Florey e Chain (Oxford) ----------
const oxford = (t, k) => {
  const pos = [XFAB + (k ? 0.5 : -0.5), 0, -1.05], ry = k ? -0.2 : 0.2;
  const acesa = kf(t, [[TM.descobriram - 0.05, 0], [TM.descobriram + 0.12, 1, outQ], [TM.massa + 0.6, 1], [TM.massa + 1.0, 0]]);
  const F = expr(t, [[0, {olhos: 'normal', boca: 'O', olhar: [k ? -0.4 : 0.4, -0.7]}], [TM.florey + k * 0.55, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5}], [TM.descobriram, {olhos: 'grande', boca: 'grito', pop: 0.3, semPisca: true}], [TM.produzir, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.7}]], k * 0.9);
  const lendo = t < TM.florey; const toca = kf(t, [[TM.massa - 0.25, 0], [TM.massa, 1, back], [TM.massa + 0.5, 1], [TM.massa + 0.7, 0]]);
  const papel = lendo ? [XFAB, 1.0, -0.8] : null;
  const mP = lendo ? (k ? [XFAB + 0.08, 1.0, -0.8] : [XFAB + 0.02, 0.98, -0.8]) : (toca > 0 ? mix(PM(pos, ry, [k ? -0.25 : 0.25, 0.5, 0.1]), [XFAB, 1.55, -0.95], toca) : PM(pos, ry, [0.25, 0.5 + 0.4 * acesa, 0.1]));
  const mN = lendo ? (k ? [XFAB - 0.02, 0.98, -0.8] : [XFAB - 0.08, 1.0, -0.8]) : PM(pos, ry, [-0.25, 0.5 + 0.4 * acesa, 0.1]);
  return {pos, ry, papel, c: {cor: k ? '#9AA6B8' : '#B8A68A', ...F, acesa, mP, mN, inc: lendo ? 0.15 : 0, t, fase: k * 2.1, resp: t * 3 + k, roupa: <><Jaleco /><Gravata cor={k ? '#D8323C' : '#2E4A6B'} /></>, cabeca: k ? <><BigodeGuidao /><Topete cor="#2E2A2E" /></> : <Topete cor="#8A5A34" />}};
};
// ---------- soldado e enfermeira ----------
const soldado = (t) => {
  const cura = t > TM.morte - 0.1; const pul = cura ? Math.max(0, Math.sin((t - TM.morte) * 9)) * 0.12 : 0;
  const pos = [XGUE - 0.25, pul, -0.2], ry = 0.25;
  const F = expr(t, [[0, {olhos: 'tedio', boca: 'triste', sob: -0.6, pele: '#E4F0D0'}], [TM.infeccionado, {olhos: 'grande', boca: 'nervoso', trem: 0.6, sob: -0.9, semPisca: true}], [TM.nao + 0, {olhos: 'tedio', boca: 'triste'}], [TM.sentenca, {olhos: 'grande', boca: 'O', sob: -0.6}], [TM.morte + 0.05, {olhos: 'feliz', boca: 'grito', bochecha: 0.8, pop: 0.3}]], 0.5);
  const braco = PM(pos, ry, [0.3, 0.62, 0.18]);
  const mP = cura ? PM(pos, ry, [0.25, 1.3 + Math.sin(t * 10) * 0.05, 0.05]) : braco; const mN = cura ? PM(pos, ry, [-0.25, 1.3 + Math.cos(t * 10) * 0.05, 0.05]) : add(braco, [-0.12, 0.02, 0.05]);
  return {pos, ry, braco: cura ? null : braco, verde: !cura && t > TM.arranhao, c: {cor: '#8C8A4E', ...F, pele: cura ? null : '#EEF4DC', mP, mN, t, fase: 1.1, resp: t * 3, cabeca: <Capacete />, roupa: <Colete />}};
};
const enfermeira = (t) => {
  const C = caminho(t, [[TM.repente, [XGUE + 1.3, 0, -0.5], -1.2], [TM.infeccionado, [XGUE + 0.4, 0, -0.15], -1.3]]);
  const pos = [C.pos[0], quica(t, C.anda), C.pos[2]], ry = C.ry;
  const inj = kf(t, [[TM.infeccionado + 0.2, 0], [TM.nao, 1], [TM.sentenca, 1], [TM.sentenca + 0.3, 0]]);
  const F = expr(t, [[0, {olhos: 'normal', boca: 'sorriso'}], [TM.nao, {olhos: 'semi', boca: 'canto', sob: 0.3}], [TM.morte, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.6}]], 2);
  const mP = mix(PM(pos, ry, [0.25, 0.75, 0.25]), [XGUE + 0.05, 0.72, 0.0], inj);
  return {pos, ry, seringa: mP, c: {cor: '#FFFFFF', ...F, pe: C.anda ? passo(t) : null, mP, mN: PM(pos, ry, [-0.25, 0.45, 0.05]), t, fase: 2, resp: t * 3, cabeca: <><Coque cor="#6A4022" /><Touca /></>}};
};
// ---------- palco do Nobel: Florey e Chain ao lado ----------
const laureado = (t, k) => {
  const pos = [XNOB + (k ? 0.8 : -0.8), 0.4, -0.95], ry = k ? -0.25 : 0.25; const ap = t > TM.nobel;
  const F = expr(t, [[0, {olhos: 'normal', boca: 'sorriso'}], [TM.ganharam + k * 0.1, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.6}], [TM.nobel, {olhos: 'feliz', boca: 'grito', bochecha: 0.8}]], k + 3);
  const mP = ap ? PM(pos, ry, [0.22, 1.25 + Math.sin(t * 11 + k) * 0.05, 0.1]) : PM(pos, ry, [0.25, 0.45, 0.05]); const mN = ap ? PM(pos, ry, [-0.22, 1.25 + Math.cos(t * 11 + k) * 0.05, 0.1]) : PM(pos, ry, [-0.25, 0.45, 0.05]);
  return {pos, ry, c: {cor: k ? '#9AA6B8' : '#B8A68A', ...F, mP, mN, t, fase: k * 2.1, resp: t * 3 + k, roupa: <Gravata cor={k ? '#D8323C' : '#2E4A6B'} />, cabeca: k ? <><BigodeGuidao /><Topete cor="#2E2A2E" /></> : <Topete cor="#8A5A34" />}};
};
const PLAT = Array.from({length: 7}).map((_, i) => ({x: (i - 3) * 0.55, cor: ['#4A5A8A', '#8A4A5A', '#4A7A5A', '#6A5A8A', '#8A6A3A', '#5A6A7A', '#7A4A6A'][i], fase: i * 1.9}));
const plateia = (t, p, i) => { const pos = [XNOB + p.x, -0.45, 1.3 + (i % 2) * 0.25], ry = Math.PI; const bate = t > TM.mil2 ? Math.abs(Math.sin(t * 14 + p.fase)) : 0;
  return {pos, ry, c: {cor: p.cor, olhos: 'normal', boca: 'sorriso', mP: PM(pos, ry, [0.03 + 0.06 * bate, 0.95, 0.2]), mN: PM(pos, ry, [-0.03 - 0.06 * bate, 0.95, 0.2]), t, fase: p.fase, resp: t * 3, cabeca: i % 3 === 0 ? <Chapeu y={0.31} /> : (i % 3 === 1 ? <Coque cor="#3A3436" /> : null)}}; };
// ---------- quarto: a criança cientista e a mãe ----------
const crianca = (t) => {
  const pos = [XQUA, 0, -0.5], ry = 0; const sobe = kf(t, [[TM.diga - 0.1, 0], [TM.diga + 0.25, 1, back]]);
  const F = expr(t, [[0, {olhos: 'normal', boca: 'O', olhar: [0, -0.8]}], [TM.mandarem, {olhos: 'normal', boca: 'reta', olhar: [0.8, 0.2]}], [TM.diga - 0.05, {olhos: 'semi', boca: 'canto', sob: 0.5, assim: 0.03, olhar: [0, 0]}], [TM.fazendo, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.8}]], 0.7);
  const mP = PM(pos, ry, [0.12, lerp(0.75, 1.15, sobe), 0.3]); const mN = PM(pos, ry, [-0.12, lerp(0.75, 1.15, sobe), 0.3]);
  return {pos, ry, placa: [pos[0], lerp(0.78, 1.2, sobe), pos[2] + 0.32], c: {cor: COR_JAL, ...F, mP, mN, t, fase: 0.7, resp: t * 3, roupa: <Jaleco />, cabeca: <><Topete cor="#C9702A" /><OculosSol /></>}};
};
const mae = (t) => {
  const pos = [XQUA + 1.55, 0, -1.55], ry = -0.6; const ap = kf(t, [[TM.mandarem - 0.1, 0], [TM.mandarem + 0.1, 1, back]]);
  const F = expr(t, [[0, {olhos: 'bravo', boca: 'reta', sob: -0.6}], [TM.arrumar, {olhos: 'bravo', boca: 'grito', sob: -0.8, trem: 0.3}], [TM.fazendo + 0.2, {olhos: 'grande', boca: 'O', sob: 0.6, semPisca: true}]], 1.3);
  const mP = mix(PM(pos, ry, [0.25, 0.55, 0.05]), PM(pos, ry, [0.18, 1.0 + 0.04 * Math.sin(t * 14), 0.42]), ap);
  return {pos, ry, c: {cor: '#D46A8C', ...F, mP, mN: PM(pos, ry, [-0.2, 0.6, -0.02]), t, fase: 1.3, resp: t * 3, cabeca: <Coque cor="#8A4A2A" />}};
};
// ---------- estado do laboratório ----------
const MESES = ['AGO\n1928', 'SET\n1928'];
const labEstado = (t) => {
  const bal = Math.sin(t * 6) * (t < TM.salvou - 0.2 ? 1.2 : t > TM.placas && t < TM.pia ? 1.5 : t > TM.semanas && t < TM.alguma ? 0.4 : 0.3);
  const nPia = t < TM.empilhadas ? 14 : Math.min(26, 14 + Math.floor((t - TM.empilhadas) * 12));
  const porta = t < TM.salvou - 0.19 ? 1 : (t > TM.ferias2 + 0.3 && t < TM.sem2 + 0.2 ? 1 - cl((t - TM.sem2) / 0.2) : (t > TM.volta - 0.15 && t < TM.pegou ? 1 : 0));
  const placaFerias = t < TM.salvou - 0.19 || (t > TM.sem2 - 0.1 && t < TM.volta + 0.4);
  const balPlaca = t > TM.sem2 ? (t - TM.sem2) * 9 : 0;
  const gaveta = t > TM.descoberta + 0.5 && t < TM.esquecida2 + 0.2 ? kf(t, [[TM.descoberta + 0.5, 0], [TM.descoberta + 0.8, 1], [TM.esquecida2, 1], [TM.esquecida2 + 0.2, 0]]) : 0;
  const teia = kf(t, [[TM.dez - 0.3, 0], [TM.anos + 0.3, 1]]);
  const aranha = kf(t, [[TM.dez, 0], [TM.anos + 0.4, 1]]);
  const tl = t > TM.semanas && t < TM.volta; // time-lapse
  const calTxt = t < TM.semanas ? 'AGO\n1928' : (t < TM.volta ? MESES[Math.floor((t - TM.semanas) * 1.2) % 2] : (t < TM.dez - 0.2 ? 'SET\n1928' : (t < TM.ate ? String(1929 + Math.min(9, Math.floor((t - TM.dez + 0.2) * 11))) : '1938')));
  const luz = t > TM.nada && t < TM.volta - 0.1 ? 0 : 1;
  return {bal, nPia, porta, placaFerias, balPlaca, gaveta, teia, aranha, calTxt, relVel: tl || (t > TM.dez && t < TM.ate) ? 40 : 1, luz};
};
// ---------- estado da placa gigante (mofo e bactérias) ----------
const BACT = Array.from({length: 26}).map((_, i) => { const a = i * 2.4, r = 0.25 + ((i * 0.37) % 0.8); return {x: Math.cos(a) * r - 0.1, z: Math.sin(a) * r * 0.8 - 0.3, cor: ['#C77DBA', '#E58FB0', '#A97DD8'][i % 3], fase: i * 0.9}; });
const MOLD = [XPL - 0.45, 0, -0.55];
const placaEstado = (t) => {
  const s = kf(t, [[TM.alguma - 0.1, 0.1], [TM.crescer + 0.6, 1.6, outQ], [TM.mofo, 1.9], [TM.verde, 2.4, back], [TM.aquele, 2.5], [TM.mofo2, 2.7]]);
  const cara = t < TM.aquele ? 'mau' : 'heroi'; const capa = kf(t, [[TM.aquele, 0], [TM.aquele + 0.25, 1, back]]);
  const anel = kf(t, [[TM.volta2, 0], [TM.sumido + 0.3, 1, outQ]]);
  const halo = t > TM.circulo - 0.05 && t < TM.aquele ? 0.5 + 0.2 * Math.sin(t * 6) : 0;
  const pows = [];
  const bact = BACT.map((b, i) => {
    const d = Math.hypot(b.x + 0.45, b.z + 0.55); const perto = d < 0.6;
    let p = [XPL + b.x, 0.022, b.z], vis = true, susto = 0;
    const tSome = TM.volta2 + 0.1 + (d / 0.6) * (TM.sumido - TM.volta2 + 0.4);
    if (perto && t > TM.volta2 - 0.3) { susto = 1; const fug = cl((t - TM.volta2 + 0.3) / 1.5); const dir = [b.x + 0.45, b.z + 0.55].map((v) => v / Math.max(0.05, d)); p = [p[0] + dir[0] * fug * 0.35, p[1] + Math.abs(Math.sin(t * 14 + i)) * 0.03, p[2] + dir[1] * fug * 0.35];
      if (t > tSome) vis = false; if (t > tSome && t < tSome + 0.3) pows.push({p: add(p, [0, 0.06, 0]), k: (t - tSome) / 0.3}); }
    if (!perto && t > TM.circulo) susto = 1;
    if (i === 3 && t > TM.bacteria2 - 0.05) { vis = t < TM.bacteria2 + 0.1; if (t > TM.bacteria2 + 0.05 && t < TM.bacteria2 + 0.35) pows.push({p: add(p, [0, 0.08, 0]), k: (t - TM.bacteria2 - 0.05) / 0.3}); }
    return {p, vis, susto, cor: b.cor, s: 1.0};
  });
  return {s, cara, capa, anel, halo, bact, pows};
};
// ================= vídeo 3: câmera, cenas e montagem =================
const V = (a) => a;
const PLANOS = [
  {t0: 0, set: 'lab', keys: [[0, [-0.6, 1.25, 1.4], [-1.55, 0.95, -1.6], 44], [TM.louca, [-0.75, 1.2, 1.0], [-1.6, 0.95, -1.6], 42]]},
  {t0: TM.louca, set: 'lab', keys: [[TM.louca, [1.35, 1.3, -0.95], [1.85, 1.0, -1.85], 38], [TM.salvou - 0.2, [1.45, 1.25, -1.15], [1.85, 1.0, -1.85], 36]]},
  {t0: TM.salvou - 0.19, set: 'rua', keys: [[TM.salvou - 0.19, [XRUA, 1.45, 3.4], [XRUA, 1.55, 0.3], 48], [TM.londres, [XRUA + 0.3, 2.2, 3.0], [XRUA, 1.7, 0.3], 46]]},
  {t0: TM.londres, set: 'rua', keys: [[TM.londres, [XRUA - 1.4, 1.0, 4.6], [XRUA, 1.8, -2.6], 50], [TM.alexander, [XRUA - 0.2, 1.3, 3.8], [XRUA, 2.1, -2.6], 46]]},
  {t0: TM.alexander, set: 'lab', keys: [[TM.alexander, [0.2, 1.7, 2.8], [0.2, 1.0, -1.2], 48], [TM.baguncado, [0.3, 1.6, 2.4], [0.2, 1.0, -1.2], 46], [TM.placas, [0.5, 1.5, 2.1], [0.3, 1.0, -1.3], 44]]},
  {t0: TM.placas, set: 'lab', keys: [[TM.placas, [-0.4, 1.95, -0.3], [-0.38, 0.95, -0.85], 40], [TM.pia, [-0.45, 1.65, -0.3], [-0.38, 1.0, -0.85], 36]]},
  {t0: TM.pia, set: 'lab', keys: [[TM.pia, [1.5, 1.45, -0.95], [1.8, 1.05, -1.85], 38], [TM.xicara, [1.55, 1.4, -1.05], [1.8, 1.05, -1.85], 36]]},
  {t0: TM.xicara, set: 'lab', keys: [[TM.xicara, [0.32, 1.08, -0.3], [0.18, 0.9, -0.75], 34], [TM.papel, [0.28, 1.02, -0.38], [0.18, 0.9, -0.75], 30]]},
  {t0: TM.papel, set: 'lab', keys: [[TM.papel, [-0.6, 0.28, 0.7], [-0.3, 0.12, -0.6], 50], [TM.colegas, [-0.3, 0.32, 0.55], [0.0, 0.12, -0.6], 48]]},
  {t0: TM.colegas, set: 'lab', keys: [[TM.colegas, [-0.75, 1.25, 1.3], [-1.3, 0.95, -1.3], 44], [TM.fleming2, [-0.8, 1.2, 1.0], [-1.3, 0.98, -1.3], 42]]},
  {t0: TM.fleming2, set: 'lab', keys: [[TM.fleming2, [-0.5, 1.25, 0.3], [-1.25, 1.05, -1.0], 36], [TM.chiqueiro, [-0.58, 1.22, 0.1], [-1.25, 1.05, -1.0], 33]]},
  {t0: TM.chiqueiro + 0.05, set: 'lab', keys: [[TM.chiqueiro + 0.05, [-0.35, 0.5, 0.45], [-0.75, 0.22, -0.35], 40], [TM.so, [-0.38, 0.46, 0.35], [-0.75, 0.24, -0.35], 36]]},
  {t0: TM.so, set: 'lab', keys: [[TM.so, [0.35, 1.2, 0.35], [0.3, 1.0, -1.5], 40], [TM.saiu2, [0.33, 1.18, 0.15], [0.3, 1.0, -1.5], 38]]},
  {t0: TM.saiu2, set: 'lab', keys: [[TM.saiu2, [1.2, 1.5, 1.6], [-0.4, 0.9, -1.5], 46], [TM.sem2, [1.0, 1.5, 1.4], [-1.4, 0.9, -1.7], 46]]},
  {t0: TM.sem2, set: 'lab', keys: [[TM.sem2, [-1.45, 1.45, -0.3], [-1.95, 1.2, -2.15], 42], [TM.semanas - 0.1, [-1.55, 1.42, -0.6], [-1.95, 1.25, -2.15], 38]]},
  {t0: TM.semanas - 0.1, set: 'lab', keys: [[TM.semanas - 0.1, [0.4, 1.6, 2.3], [0.3, 1.1, -1.4], 46], [TM.alguma - 0.15, [0.4, 1.5, 1.9], [0.3, 1.05, -1.4], 44]]},
  {t0: TM.alguma - 0.15, set: 'pl', keys: [[TM.alguma - 0.15, [MOLD[0] + 0.2, 1.1, MOLD[2] + 1.0], [MOLD[0], 0.05, MOLD[2]], 40], [TM.volta - 0.1, [MOLD[0] + 0.12, 0.7, MOLD[2] + 0.6], [MOLD[0], 0.08, MOLD[2]], 36]]},
  {t0: TM.volta - 0.1, set: 'lab', keys: [[TM.volta - 0.1, [-1.0, 1.3, 0.4], [-1.8, 1.0, -1.8], 42], [TM.pegou, [-1.05, 1.28, 0.25], [-1.6, 1.0, -1.6], 40]]},
  {t0: TM.pegou, set: 'lab', keys: [[TM.pegou, [2.1, 1.25, -0.5], [0.8, 0.95, -1.5], 40], [TM.parou - 0.1, [1.95, 1.2, -0.75], [0.95, 0.98, -1.5], 36]]},
  {t0: TM.parou - 0.1, set: 'lab', keys: [[TM.parou - 0.1, [2.05, 1.18, -0.05], [0.75, 1.12, -1.5], 42], [TM.parou + 0.15, [2.05, 1.18, -0.05], [0.75, 1.12, -1.5], 22, outQ], [TM.tinha2, [2.05, 1.18, -0.05], [0.75, 1.12, -1.5], 20]]},
  {t0: TM.tinha2, set: 'pl', keys: [[TM.tinha2, [MOLD[0] + 0.3, 0.6, MOLD[2] + 1.1], [MOLD[0], 0.18, MOLD[2]], 38], [TM.volta2 - 0.3, [MOLD[0] + 0.2, 0.55, MOLD[2] + 0.95], [MOLD[0], 0.18, MOLD[2]], 34]]},
  {t0: TM.volta2 - 0.3, set: 'pl', keys: [[TM.volta2 - 0.3, [XPL + 0.3, 1.0, 0.9], [XPL - 0.3, 0.05, -0.45], 44], [TM.circulo, [XPL + 0.1, 1.25, 0.6], [XPL - 0.35, 0.05, -0.5], 44]]},
  {t0: TM.circulo, set: 'pl', keys: [[TM.circulo, [MOLD[0], 2.5, MOLD[2] + 0.25], [MOLD[0], 0, MOLD[2]], 40], [TM.aquele, [MOLD[0], 2.1, MOLD[2] + 0.25], [MOLD[0], 0, MOLD[2]], 40]]},
  {t0: TM.aquele, set: 'pl', keys: [[TM.aquele, [MOLD[0] + 0.45, 0.5, MOLD[2] + 1.05], [MOLD[0], 0.2, MOLD[2]], 38], [TM.fleming3, [MOLD[0] + 0.3, 0.45, MOLD[2] + 0.9], [MOLD[0], 0.2, MOLD[2]], 34]]},
  {t0: TM.fleming3, set: 'lab', keys: [[TM.fleming3, [0.35, 0.95, 1.0], [0.3, 1.4, -1.5], 46], [TM.so2, [0.33, 0.92, 0.75], [0.3, 1.45, -1.5], 44]]},
  {t0: TM.so2, set: 'lab', keys: [[TM.so2, [0.0, 1.2, 2.4], [-0.6, 0.7, -1.0], 46], [TM.nao - 0.2, [0.1, 1.15, 2.2], [-0.6, 0.7, -1.0], 46]]},
  {t0: TM.nao - 0.2, set: 'lab', keys: [[TM.nao - 0.2, [0.8, 1.25, 0.35], [0.35, 1.0, -1.45], 40], [TM.descoberta, [0.75, 1.22, 0.15], [0.35, 1.0, -1.45], 38]]},
  {t0: TM.descoberta, set: 'lab', keys: [[TM.descoberta, [0.4, 1.45, 0.7], [-0.9, 0.8, -1.5], 46], [TM.dez - 0.05, [0.25, 1.4, 0.5], [-1.2, 0.8, -1.6], 44]]},
  {t0: TM.dez - 0.05, set: 'lab', keys: [[TM.dez - 0.05, [-1.0, 1.15, -0.8], [-1.45, 0.85, -1.85], 38], [TM.ate, [-1.05, 1.1, -0.9], [-1.45, 0.85, -1.85], 32]]},
  {t0: TM.ate, set: 'gue', keys: [[TM.ate, [XGUE, 1.5, 4.6], [XGUE, 1.7, -2], 48], [TM.dois, [XGUE + 0.3, 1.0, 3.8], [XGUE, 1.3, -2], 46]]},
  {t0: TM.dois, set: 'fab', keys: [[TM.dois, [XFAB, 1.65, 2.9], [XFAB, 1.1, -1.0], 44], [TM.florey, [XFAB, 1.6, 2.5], [XFAB, 1.1, -1.0], 42]]},
  {t0: TM.florey, set: 'fab', keys: [[TM.florey, [XFAB - 0.45, 1.35, 1.3], [XFAB - 0.5, 1.2, -1.05], 40], [TM.chain - 0.05, [XFAB - 0.45, 1.35, 1.3], [XFAB - 0.5, 1.2, -1.05], 40], [TM.chain + 0.2, [XFAB + 0.45, 1.35, 1.3], [XFAB + 0.5, 1.2, -1.05], 40], [TM.descobriram, [XFAB + 0.4, 1.35, 1.2], [XFAB + 0.45, 1.2, -1.05], 40]]},
  {t0: TM.descobriram, set: 'fab', keys: [[TM.descobriram, [XFAB + 0.3, 1.35, 1.3], [XFAB, 1.05, -0.9], 44], [TM.produzir, [XFAB + 1.8, 1.2, 1.4], [XFAB, 0.8, -0.6], 44], [TM.repente - 0.05, [XFAB + 1.2, 1.4, 1.9], [XFAB, 0.9, -0.8], 46]]},
  {t0: TM.repente - 0.15, set: 'gue', keys: [[TM.repente - 0.15, [XGUE + 0.4, 1.25, 1.7], [XGUE - 0.15, 0.95, -0.2], 40], [TM.infeccionado, [XGUE + 0.35, 1.22, 1.45], [XGUE - 0.15, 0.95, -0.2], 38]]},
  {t0: TM.infeccionado, set: 'gue', keys: [[TM.infeccionado, [XGUE + 0.2, 1.3, 2.4], [XGUE + 0.05, 0.9, -0.2], 42], [TM.sentenca, [XGUE + 0.2, 1.28, 2.2], [XGUE + 0.05, 0.9, -0.2], 40]]},
  {t0: TM.sentenca, set: 'gue', keys: [[TM.sentenca, [XGUE + 0.3, 1.3, 3.3], [XGUE - 0.1, 1.0, -0.2], 46], [TM.mil2 - 0.1, [XGUE + 0.25, 1.3, 3.0], [XGUE - 0.1, 1.0, -0.2], 44]]},
  {t0: TM.mil2 - 0.1, set: 'nob', keys: [[TM.mil2 - 0.1, [XNOB, 2.1, 4.4], [XNOB, 1.4, -1.0], 46], [TM.ganharam, [XNOB, 2.0, 3.8], [XNOB, 1.45, -1.0], 44]]},
  {t0: TM.ganharam, set: 'nob', keys: [[TM.ganharam, [XNOB, 1.45, 0.75], [XNOB, 1.3, -0.9], 38], [TM.colegas2 - 0.25, [XNOB, 1.45, 0.5], [XNOB, 1.3, -0.9], 34]]},
  {t0: TM.colegas2 - 0.25, set: 'col', keys: [[TM.colegas2 - 0.25, [XCOL + 0.2, 1.45, 3.6], [XCOL + 0.2, 0.95, -0.8], 44], [TM.bancada, [XCOL + 0.2, 1.4, 3.2], [XCOL + 0.2, 0.95, -0.8], 42]]},
  {t0: TM.bancada, set: 'col', keys: [[TM.bancada, [XCOL + 1.55, 1.45, -0.95], [XCOL + 0.1, 0.88, -0.95], 42], [TM.nenhuma - 0.1, [XCOL + 1.4, 1.4, -1.0], [XCOL + 0.1, 0.88, -0.95], 40]]},
  {t0: TM.nenhuma - 0.1, set: 'col', keys: [[TM.nenhuma - 0.1, [XCOL + 0.2, 1.3, 2.7], [XCOL + 0.2, 0.92, -0.2], 42], [TM.entao, [XCOL + 0.2, 1.28, 2.4], [XCOL + 0.2, 0.92, -0.2], 40]]},
  {t0: TM.entao, set: 'qua', keys: [[TM.entao, [XQUA + 0.7, 1.45, 2.8], [XQUA + 0.7, 0.8, -1.0], 46], [TM.arrumar, [XQUA + 0.75, 1.4, 2.4], [XQUA + 0.75, 0.85, -1.0], 44]]},
  {t0: TM.arrumar, set: 'qua', keys: [[TM.arrumar, [XQUA + 0.85, 1.25, 0.45], [XQUA + 1.5, 1.0, -1.55], 38], [TM.diga - 0.05, [XQUA + 0.88, 1.24, 0.3], [XQUA + 1.5, 1.0, -1.55], 36]]},
  {t0: TM.diga - 0.05, set: 'qua', keys: [[TM.diga - 0.05, [XQUA + 0.05, 0.95, 1.15], [XQUA, 0.82, -0.5], 38], [TM.fim, [XQUA + 0.05, 0.95, 0.85], [XQUA, 0.84, -0.5], 36]]},
];
const TREMORES = [[TM.empilhadas, 0.01], [TM.chiqueiro + 0.1, 0.012], [TM.sem2 + 0.1, 0.02], [TM.parou, 0.02], [TM.verde, 0.015], [TM.guerra, 0.02], [TM.nobel, 0.015], [TM.massa, 0.012], [TM.arrumar, 0.012]];
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
const Cam = ({c}) => { const {camera} = useThree(); camera.position.set(...c.pos); camera.fov = c.fov; camera.near = 0.05; camera.far = 700; camera.updateProjectionMatrix(); camera.lookAt(...c.look); return null; };

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

// ---------- cenas ----------

// ---------- pedaços comuns ----------
const PapeisCaindo = ({c, t, t0, n = 10, alt = 1.2, area = 1}) => { const u = t - t0; if (u < 0 || u > 2.5) return null; return <group position={c}>{Array.from({length: n}).map((_, i) => { const y = alt - (u * (0.55 + (i % 4) * 0.12) + (i % 3) * 0.1); if (y < 0.01) return null; return <Papel key={i} p={[Math.sin(i * 4.1) * area + Math.sin(u * 3 + i) * 0.12, y, Math.cos(i * 2.3) * area * 0.5]} rot={[Math.sin(u * 4 + i) * 0.6, i, Math.cos(u * 3 + i) * 0.6]} />; })}</group>; };
const Pessoa = ({P}) => P && P.vis !== false ? <Boneco pos={P.pos} ry={P.ry} c={P.c} /> : null;
const Pequeno = ({P, s = 0.72}) => { const rel = (m) => m ? [(m[0] - P.pos[0]) / s, (m[1] - P.pos[1]) / s, (m[2] - P.pos[2]) / s] : undefined; return <group position={P.pos} scale={s}><Boneco pos={[0, 0, 0]} ry={P.ry} c={{...P.c, mP: rel(P.c.mP), mN: rel(P.c.mN)}} /></group>; };
const Feixe = ({de, para, r = 0.5, k = 1}) => { if (k <= 0.01) return null; const a = new THREE.Vector3(...de), b = new THREE.Vector3(...para); const len = a.distanceTo(b); const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), b.clone().sub(a).normalize());
  return <mesh position={a.clone().add(b).multiplyScalar(0.5)} quaternion={q} material={MAT('feixe' + Math.round(k * 10), () => new THREE.MeshBasicMaterial({color: '#FFF3B0', transparent: true, opacity: 0.22 * Math.round(k * 10) / 10, depthWrite: false, side: THREE.DoubleSide}))}><cylinderGeometry args={[0.08, r, len, 20, 1, true]} /></mesh>; };

// ---------- cenas ----------
const CUP = [0.18, 0.86, -0.75];
const CenaLab = ({t}) => {
  const I = labEstado(t); const FL = fleming(t); const Cs = [0, 1, 2].map((k) => colega(t, k));
  const porco = kf(t, [[TM.chiqueiro + 0.1, 0], [TM.chiqueiro + 0.3, 1, back], [TM.so + 0.3, 1], [TM.so + 0.5, 0]]);
  const leao = t > TM.fleming3 && t < TM.so2 ? kf(t, [[TM.fleming3, 0], [TM.chamou + 0.2, 1]]) : 0;
  const fenoU = cl((t - TM.so2) / 1.6);
  return (
    <group>
      <Lab t={t} I={I} />
      {FL.vis && FL.pos[0] < XRUA - 10 ? <Boneco pos={FL.pos} ry={FL.ry} c={FL.c} /> : null}
      {FL.vis && FL.mala && FL.c.mN ? <Mala p={add(FL.c.mN, [0, -0.13, 0])} rot={[0, FL.ry, 0]} /> : null}
      {FL.vis && FL.placa && FL.pos[0] < XRUA - 10 ? <Petri p={add(FL.placa, [0, -0.01, 0])} k="fl" mofo={t > TM.pegou ? 1 : 0} limpo={t > TM.pegou ? 1 : 0} s={1.2} /> : null}
      {FL.frasco ? <group position={FL.frasco.p} rotation={FL.frasco.rot}><Frasco p={[0, -0.06, 0]} cor="#F2C94C" nivel={0.2} /></group> : null}
      {FL.frasco ? <><Gota id={31} p={add(FL.frasco.p, [0.14, -0.02, 0])} k={fx01(t, TM.fabricar + 0.1, 0.5)} s={0.06} /><Fumaca id={5} p={add(FL.frasco.p, [0.05, 0.1, 0])} k={fx01(t, TM.remedio, 0.8)} s={0.35} /></> : null}
      {Cs.map((C, k) => C.vis && C.pos[0] < XCOL - 5 ? <Boneco key={k} pos={C.pos} ry={C.ry} c={C.c} /> : null)}
      <Mosca p={[CUP[0] + Math.cos(t * 5) * 0.13, CUP[1] + 0.14 + Math.sin(t * 7) * 0.04, CUP[2] + Math.sin(t * 5) * 0.1]} t={t} />
      {porco > 0 ? <Porco p={[-0.75, -0.25 + porco * 0.25, -0.35]} ry={-1.1} s={1.1} t={t} boca={Math.sin(t * 20) > 0 ? 1 : 0.3} /> : null}
      {porco > 0 ? [0, 1, 2, 3].map((i) => <Papel key={'pp' + i} p={[-0.75 + Math.cos(i * 1.6) * 0.35 * porco, 0.02 + porco * (0.45 + i * 0.08), -0.35 + Math.sin(i * 1.6) * 0.3 * porco]} rot={[i, i * 2, porco * 2]} />) : null}
      <PapeisCaindo c={[0.75, 0, -1.9]} t={t} t0={TM.baguncado - 0.1} n={8} alt={1.5} area={0.5} />
      <PapeisCaindo c={[-0.3, 0, -0.2]} t={t} t0={TM.papel - 0.2} n={10} alt={0.9} area={0.6} />
      {t > TM.so2 && t < TM.nao + 0.2 ? <Feno p={[lerp(-2.4, 2.4, fenoU), 0.12 + Math.abs(Math.sin(fenoU * 12)) * 0.12, -0.3]} rot={-fenoU * 18} s={1.2} /> : null}
      <Feixe de={[-0.9, 2.3, -2.1]} para={[0.3, 1.0, -1.4]} r={0.6} k={leao} />
      <Halo p={[0.3, 1.86, -1.3]} k={leao} s={1.2} id={3} />
      {leao > 0 ? [0, 1, 2, 3].map((k) => <Brilho key={k} id={40 + k} p={[0.3 + Math.cos(k * 1.6) * 0.25, 1.86 + Math.sin(k * 1.6) * 0.2, -1.3]} k={fx01(t, TM.chamou + k * 0.15, 0.6)} s={0.2} />) : null}
      {t > TM.dez - 0.25 && t < TM.ate ? <Placa p={[-1.45, 1.05, -1.72]} rot={[-0.1, 0, 0]} txt={I.calTxt} w={0.3} h={0.22} fundo="#FFFFFF" tinta="#C0392B" moldura="#372C2E" /> : null}
      <Faisca id={6} p={[1.12, 1.05, -1.42]} k={fx01(t, TM.parou, 0.3)} s={0.4} />
    </group>
  );
};
const CenaPlaca = ({t}) => <PlacaGigante t={t} M={placaEstado(t)} />;
const CenaRua = ({t}) => {
  const FL = fleming(t); const mult = t < TM.londres ? MULT.map((m, i) => pessoaMult(t, m, i)) : [];
  return <Rua t={t} multidao={<>
    {mult.map((P, i) => P ? <Boneco key={i} pos={P.pos} ry={P.ry} c={P.c} /> : null)}
    {t < TM.londres ? <><Cx a={[0.5, 0.6, 0.5]} p={[XRUA, 0.3, 0.3]} m="#9A6A3E" line={0.8} /><Boneco pos={FL.pos} ry={FL.ry} c={FL.c} /><Petri p={FL.placa} k="ru" mofo={1} limpo={1} s={1.4} />
      <Halo p={add(FL.placa, [0, 0.05, 0])} k={0.7} s={0.9} id={4} /><Confete c={[XRUA, 0, 0.6]} t={t} t0={TM.salvou - 0.2} area={[3, 2.6, 1.6]} />
      {[0, 1, 2].map((i) => { const u = cl((t - TM.milhoes - i * 0.15) / 1.2); return u > 0 && u < 1 ? <group key={i} position={[XRUA + (i - 1) * 0.9, 1.4 + u * 1.2 - u * u * 0.6, 1.0]} rotation={[u * 6, 0, u * 4]}><Chapeu y={0} cor={['#3A3436', '#6A4022', '#2E4A6B'][i]} /></group> : null; })}</> : null}
  </>} />;
};
const CenaFab = ({t}) => {
  const Fo = oxford(t, 0), Ch = oxford(t, 1);
  return <group>
    <Fabrica t={t} />
    <Boneco pos={Fo.pos} ry={Fo.ry} c={Fo.c} /><Boneco pos={Ch.pos} ry={Ch.ry} c={Ch.c} />
    {Fo.papel ? <Placa p={Fo.papel} rot={[-0.3, Math.PI, 0]} txt={'FLEMING\n1929'} w={0.22} h={0.28} fundo="#FBF4E2" moldura={null} /> : null}
    <group position={Fo.pos}><Etiqueta txt="FLOREY" k={kf(t, [[TM.florey - 0.05, 0], [TM.florey + 0.15, 1, back]])} /></group>
    <group position={Ch.pos}><Etiqueta txt="CHAIN" k={kf(t, [[TM.chain - 0.05, 0], [TM.chain + 0.15, 1, back]])} /></group>
    {[Fo, Ch].map((P, k) => <Halo key={k} p={add(P.pos, [0, 1.12, 0.1])} k={P.c.acesa} s={1.0} id={10 + k} />)}
    <Faisca id={13} p={[XFAB, 1.6, -0.9]} k={fx01(t, TM.massa, 0.35)} s={0.4} />
  </group>;
};
const CenaGuerra = ({t}) => {
  const S = soldado(t), E = enfermeira(t);
  const sent = kf(t, [[TM.sentenca - 0.1, 0], [TM.sentenca + 0.1, 1, back]]); const carimbo = kf(t, [[TM.morte - 0.05, 2.2], [TM.morte + 0.1, 1, outQ]]);
  return <group>
    <Guerra t={t} />
    <Boneco pos={S.pos} ry={S.ry} c={S.c} />
    {t > TM.repente - 0.3 ? <Boneco pos={E.pos} ry={E.ry} c={{...E.c, pe: E.c.pe}} /> : null}
    {t > TM.repente - 0.3 ? <Seringa p={E.seringa} rot={[0, 0, 1.3]} s={1.1} /> : null}
    {S.braco ? <><Cx a={[0.06, 0.012, 0.012]} p={add(S.braco, [-0.04, 0.03, 0.02])} rot={[0, 0, 0.5]} m="#D8323C" line={0} />{S.verde ? <Halo p={add(S.braco, [-0.04, 0.03, 0.05])} k={0.5 + 0.3 * Math.sin(t * 10)} s={0.35} id={12} /> : null}</> : null}
    {sent > 0 && t < TM.mil2 ? <group position={[XGUE - 0.35, 1.7, 0.1]} scale={sent} rotation={[0, 0.2, -0.05]}><Placa p={[0, 0, 0]} txt={'SENTENÇA\nDE MORTE'} w={0.62} h={0.36} fundo="#FBF4E2" moldura="#8A5A34" />
      {t > TM.morte - 0.05 ? <group position={[0, 0, 0.02]} scale={carimbo} rotation={[0, 0, -0.25]}><Placa p={[0, 0, 0]} txt="CANCELADA" w={0.66} h={0.16} fundo="#D8323C" tinta="#FFFFFF" borda="#FFFFFF" moldura={null} /></group> : null}</group> : null}
    <Confete c={[XGUE - 0.2, 0, 0]} t={t} t0={TM.morte} area={[2.2, 2.2, 1.2]} n={40} />
    {/* o gato de capacete espiando atrás dos sacos */}
    {t > TM.sentenca - 0.5 ? <group position={[XGUE + 0.75, 0.17 + kf(t, [[TM.sentenca - 0.3, -0.15], [TM.sentenca, 0, back]]), 0.42]} scale={1.3}><CabGato p={[0, 0.06, 0]} rot={[0, 0, 0]} olhos={t > TM.morte ? 'grande' : 'normal'} t={t} /><group position={[0, 0.06, 0]} scale={0.45}><Capacete y={0.13} /></group></group> : null}
  </group>;
};
const CenaNobel = ({t}) => {
  const FL = fleming(t); const L = [laureado(t, 0), laureado(t, 1)];
  return <group>
    <Palco t={t} />
    <Boneco pos={FL.pos} ry={FL.ry} c={FL.c} />{L.map((P, k) => <Boneco key={k} pos={P.pos} ry={P.ry} c={P.c} />)}
    {FL.med > 0 ? [FL, ...L].map((P, k) => <Medalha key={k} p={PM(P.pos, P.ry, [0, 0.73, 0.165])} rot={[0.2, P.ry, 0]} s={FL.med} />) : null}
    {PLAT.map((p, i) => { const P = plateia(t, p, i); return <Boneco key={i} pos={P.pos} ry={P.ry} c={P.c} />; })}
    <Confete c={[XNOB, 0.4, -0.6]} t={t} t0={TM.nobel} area={[3, 2.4, 1.4]} />
    {[0, 1, 2, 3].map((k) => <Brilho key={k} id={60 + k} p={[XNOB - 0.9 + k * 0.6, 1.1 + (k % 2) * 0.2, -0.7]} k={fx01(t, TM.premio + k * 0.1, 0.6)} s={0.25} />)}
  </group>;
};
const CenaCol = ({t}) => {
  const Cs = [0, 1, 2].map((k) => colega(t, k)); const u = cl((t - TM.nenhuma) / 1.6);
  return <group>
    <LabLimpo t={t} />
    {Cs.map((C, k) => C.vis ? <Boneco key={k} pos={C.pos} ry={C.ry} c={C.c} /> : null)}
    {t > TM.nenhuma ? <Mosca p={[XCOL + lerp(-1.2, 1.6, u), 1.35 + Math.sin(t * 6) * 0.08, 0.2]} t={t} s={1.4} /> : null}
  </group>;
};
const CenaQuarto = ({t}) => {
  const K = crianca(t), M = mae(t);
  return <group>
    <Quarto t={t} />
    <Pequeno P={K} /><Petri p={K.placa} k="qu" mofo={1} s={1.1} />
    <Boneco pos={M.pos} ry={M.ry} c={M.c} />
    {[0, 1, 2].map((k) => <Brilho key={k} id={70 + k} p={add(K.placa, [Math.cos(k * 2.1) * 0.15, 0.1 + Math.sin(k * 2.1) * 0.08, 0.05])} k={fx01(t, TM.fazendo + k * 0.12, 0.6)} s={0.18} />)}
  </group>;
};
// ---------- legenda ----------
const GRUPOS = (() => { const g = []; let i = 0; while (i < PALAVRAS.length) { const a = PALAVRAS[i], l = a.w.replace(/[.,!?:"]/g, ''); if (l.length <= 2 && i + 1 < PALAVRAS.length && !/[.,!?:]$/.test(a.w)) { g.push({txt: a.w + ' ' + PALAVRAS[i + 1].w, s: a.s, e: PALAVRAS[i + 1].e}); i += 2; } else { g.push({txt: a.w, s: a.s, e: a.e}); i++; } } return g; })();
if (typeof document !== 'undefined' && !window.__montLE) {
  window.__montLE = true; const h = delayRender('fonte');
  window.__montLEp = new FontFace('MontLE', `url(${staticFile('Montserrat-Black.woff2')})`, {weight: '900'}).load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
}
const limpa = (x) => x.replace(/"/g, '').replace(/\.\.\.$/, '').replace(/:$/, '');
const Legenda = ({t}) => {
  let cur = null;
  for (let i = 0; i < GRUPOS.length; i++) { const nx = GRUPOS[i + 1]; const fim = nx ? Math.min(nx.s, GRUPOS[i].e + 0.6) : GRUPOS[i].e + 0.5; if (t >= GRUPOS[i].s - 0.02 && t < fim) cur = GRUPOS[i]; }
  if (!cur) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1300, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <span style={{fontFamily: 'MontLE', fontWeight: 900, fontSize: 80, color: '#fff', WebkitTextStroke: '14px #372C2E', paintOrder: 'stroke fill', textShadow: '0 5px 9px rgba(0,0,0,0.3)'}}>{limpa(cur.txt)}</span>
  </div>;
};


const ALVOS = {lab: [0, 0.6, -1], col: [XCOL, 0.6, -1], pl: [XPL - 0.3, 0, -0.4], rua: [XRUA, 1, -1], fab: [XFAB, 0.6, -0.8], gue: [XGUE, 0.5, -0.5], nob: [XNOB, 0.8, -0.8], qua: [XQUA, 0.5, -0.8]};
const AREAS = {lab: 3.2, col: 3.2, pl: 2, rua: 6, fab: 3.5, gue: 5, nob: 4, qua: 3.2};
export const Penicilina = () => {
  const [fonte, setFonte] = React.useState(fonteOk());
  React.useLayoutEffect(() => { if (fonte) return; const h = delayRender('fonte das placas'); (window.__montLEp || Promise.resolve()).then(() => document.fonts.load('900 40px MontLE')).then(() => { setFonte(true); continueRender(h); }).catch(() => { setFonte(true); continueRender(h); }); }, []);
  const t = useCurrentFrame() / 30;
  if (!fonte) return <AbsoluteFill style={{backgroundColor: '#D3E3F0'}} />;
  const c = camEm(t); const set = c.set;
  let chicote = 0; for (const tc of TROCAS) chicote += Math.max(0, Math.sin(cl((t - tc + 0.12) / 0.3) * Math.PI));
  const fora = set === 'rua' || set === 'gue' || set === 'nob';
  const tl = set === 'lab' && t > TM.semanas - 0.1 && t < TM.alguma; // time-lapse: dia e noite piscando
  const escuro = set === 'lab' && t > TM.nada && t < TM.volta - 0.1;
  const kLuz = tl ? (0.65 + 0.35 * Math.sin(t * 6)) : (escuro ? 0.4 : (set === 'pl' && t < TM.volta ? 0.6 : 1));
  const tinta = tl && t > TM.esfriou && t < TM.esquentou ? 'rgba(90,150,255,0.28)' : (tl && t > TM.esquentou ? 'rgba(255,150,60,0.25)' : (escuro ? 'rgba(20,20,60,0.25)' : null));
  const flash = Math.max(fx01(t, TM.parou, 0.25) > 0 ? 1 - fx01(t, TM.parou, 0.25) : 0, fx01(t, TM.circulo, 0.3) > 0 ? (1 - fx01(t, TM.circulo, 0.3)) * 0.6 : 0, fx01(t, TM.morte, 0.2) > 0 ? (1 - fx01(t, TM.morte, 0.2)) * 0.5 : 0);
  const vinheta = t > TM.parou && t < TM.tinha2 ? 1 : 0;
  return (
    <AbsoluteFill style={{backgroundColor: '#D3E3F0'}}>
      <Borrao k={chicote * 0.9} />
      <AbsoluteFill style={{filter: chicote > 0.02 ? 'url(#chicote)' : undefined}}>
        <ThreeCanvas width={1080} height={1920} dpr={IN.dpr || 2} shadows gl={{antialias: true}} camera={{fov: 50, position: [0, 2, 6]}}>
          <Cam c={c} />
          <fog attach="fog" args={[set === 'rua' ? '#C9CDD6' : (set === 'gue' ? '#D8C0A0' : '#E8DFD0'), set === 'rua' ? 7 : (fora ? 14 : 14), set === 'rua' ? 32 : (fora ? 60 : 40)]} />
          <Ceu c={c} noite={set === 'gue' ? 0.45 : (set === 'rua' ? 0.12 : 0)} />
          <Sol alvo={ALVOS[set]} area={AREAS[set]} luz={kLuz} dir={set === 'lab' ? [-6, 6.4, 6] : [-8, 6.4, 5]} />
          {set === 'lab' ? <CenaLab t={t} /> : null}
          {set === 'col' ? <CenaCol t={t} /> : null}
          {set === 'pl' ? <CenaPlaca t={t} /> : null}
          {set === 'rua' ? <CenaRua t={t} /> : null}
          {set === 'fab' ? <CenaFab t={t} /> : null}
          {set === 'gue' ? <CenaGuerra t={t} /> : null}
          {set === 'nob' ? <CenaNobel t={t} /> : null}
          {set === 'qua' ? <CenaQuarto t={t} /> : null}
          {IN.pos !== false ? <><Aquece /><PosToon dpr={IN.dpr || 2} dof={IN.dof !== false} ao={IN.ao !== false} foco={c.look} bokeh={fora && c.d > 4 ? 0.8 : 1.6} faixa={fora && c.d > 4 ? 6 : 2.4} longe={fora ? 80 : 40} sat={0.0} /></> : null}
        </ThreeCanvas>
      </AbsoluteFill>
      {tinta ? <AbsoluteFill style={{backgroundColor: tinta, mixBlendMode: 'multiply'}} /> : null}
      {vinheta ? <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(20,10,30,0.55) 100%)'}} /> : null}
      {flash > 0 ? <AbsoluteFill style={{backgroundColor: `rgba(255,255,255,${flash * 0.8})`}} /> : null}
      {IN.semLegenda ? null : <Legenda t={t} />}
    </AbsoluteFill>
  );
};
