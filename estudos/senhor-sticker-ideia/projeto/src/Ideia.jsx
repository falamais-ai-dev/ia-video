// Senhor Sticker, vídeo 2 (31/10/2026): "dormir segurando bolas de aço" (Edison, Dalí, hipnagogia, estudo de Paris de 2021).
// Mesmo estilo da v17 (lança x escudo): 3D toon com contorno, cabeça de lâmpada, câmera sempre andando, tempo vindo da fala.
import React from 'react';
import * as THREE from 'three';
import {AbsoluteFill, useCurrentFrame, Easing, getInputProps, staticFile, delayRender, continueRender} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {T, B, HULL, Tn, Esf, Cx, Ci, Co, Linha, canvasTex, PRATA, OURO, FERRO, MAT, GRAD, LINHA, Boneco, maoRepouso, Brilho, Faisca, Gota, Velocidade, Nuvem, CAB_ACESA} from './toon2';
import {PALAVRAS} from './palavras';
import {Borrao, Aquece} from './cinema';
import {PosToon} from './pos';

export const DUR_ID = 71 * 30;
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
const W_ = (txt, n = 0) => { let c = 0; for (const p of PALAVRAS) if (p.w.toLowerCase().replace(/[.,!?:]/g, '') === txt) { if (c === n) return p.s; c++; } throw new Error(txt); };
const E_ = (txt, n = 0) => { let c = 0; for (const p of PALAVRAS) if (p.w.toLowerCase().replace(/[.,!?:]/g, '') === txt) { if (c === n) return p.e; c++; } throw new Error(txt); };
const TM = {
  dormir: W_('dormir'), bolas: W_('bolas'), aco: W_('aço'), acordar: W_('acordar'), genio: W_('gênio'),
  funciona: W_('funciona'), pratos: W_('pratos'), metal: W_('metal'), chao: W_('chão'), poltrona: W_('poltrona'), cima: W_('cima'), bola: W_('bola'), pesada: W_('pesada'), cada: W_('cada'), mao: W_('mão'),
  ai: W_('aí'), cochilar: W_('cochilar'), agora: W_('agora'), estranha: W_('estranha'), segundo: W_('segundo'), pega: W_('pega'), sono: W_('sono'), mao2: W_('mão', 1), amolece: W_('amolece'),
  bolas2: W_('bolas', 1), despencam: W_('despencam'), pratos2: W_('pratos', 1), barulhao: W_('barulhão'), acorda: W_('acorda'), hora: W_('hora'),
  parece: W_('parece'), pior: W_('pior'), mundo: W_('mundo'), mas: W_('mas'), dizem: W_('dizem'), edison: W_('edison'), proposito: W_('propósito'),
  e1: W_('e', 2), salvador: W_('salvador'), dali: W_('dalí'), igual: W_('igual'), chave: W_('chave'),
  porque: W_('porque'), sono2: W_('sono', 1), pesado: W_('pesado'), cerebro: W_('cérebro'), andar: W_('andar'), esquisito: W_('esquisito'), meio: W_('meio'), caminho: W_('caminho'), hipnagogia: W_('hipnagogia'),
  ali: W_('ali'), junta: W_('junta'), ideias: W_('ideias'), acordado: W_('acordado'), nunca: W_('nunca'), juntaria: W_('juntaria'),
  normal: W_('normal'), descer: W_('descer'), direto: W_('direto'), esquecer: W_('esquecer'), tudo: W_('tudo'), mas2: W_('mas', 1), estrondo: W_('estrondo'), puxa: W_('puxa'), volta: W_('volta'), meio2: W_('meio', 1),
  acorda2: W_('acorda', 1), segurando2: W_('segurando', 1), ideia: W_('ideia'), nao: W_('não'), bolas3: W_('bolas', 2),
  dois2: W_('dois', 1), cientistas: W_('cientistas'), paris: W_('paris'), testaram: W_('testaram'), gente: W_('gente'), cochilando: W_('cochilando'), sentada: W_('sentada'),
  quem: W_('quem'), cochilou: W_('cochilou'), minutinho: W_('minutinho'), tres: W_('três'), vezes: W_('vezes'), mais: W_('mais'), chance: W_('chance'), truque: W_('truque'), escondido: W_('escondido'), problema: W_('problema'),
  ja: W_('já'), dormiu: W_('dormiu'), fundo: W_('fundo'), demais: W_('demais'), perdeu: W_('perdeu'), efeito: W_('efeito'),
  gato: W_('gato'), esse: W_('esse'), dormiu2: W_('dormiu', 1), cima2: W_('cima', 1), prato: W_('prato'),
};
TM.em = W_('em', 3);
// conjuntos (cenários) separados no mundo; só o do plano atual é desenhado
const XD = 12, XP = 40, XL = 80;
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
const DORME = {olhos: 'fechado', boca: 'O', abre: -0.5, sob: -0.2, semPisca: true, dorme: true, vivo: 0.1};

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

// ---------- atuação: inventor na oficina ----------
const SP = [0, 0.02, 0.0], ST = [-0.58, 0, 0.55], PB = [-0.95, 0, -1.05];
const HP = [0.42, 0.6, 0.12], HN = [-0.42, 0.6, 0.12];
const E1 = W_('e', 0); // "e uma bola": o pulo para a poltrona
const COR_INV = '#E3A33C';
const faceInv = (t) => expr(t, [
  [0, DORME], [TM.acordar + 0.05, {olhos: 'grande', boca: 'O', sob: -0.8, pop: 0.3, semPisca: true}], [TM.genio, {olhos: 'feliz', boca: 'sorrisoD', sob: -0.3, bochecha: 0.6}],
  [TM.funciona, {olhos: 'normal', boca: 'sorriso', olhar: [0.5, -0.1]}], [TM.poltrona + 0.1, {olhos: 'normal', boca: 'O', olhar: [0.4, 0.7], sob: -0.4}], [TM.cima + 0.05, {olhos: 'grande', boca: 'nervoso', sob: -0.8, pop: 0.3, semPisca: true}],
  [E1, {olhos: 'feliz', boca: 'sorrisoD'}], [TM.bola + 0.15, {olhos: 'grande', boca: 'O', sob: -0.6, semPisca: true}], [TM.pesada + 0.05, {olhos: 'grande', boca: 'nervoso', sob: -0.9, trem: 0.6, semPisca: true}],
  [TM.mao, {olhos: 'normal', boca: 'sorriso'}], [TM.ai, {olhos: 'semi', boca: 'sorriso', palp: 0.55}], [TM.cochilar + 0.1, DORME],
  [TM.barulhao, {olhos: 'grande', boca: 'grito', sob: -1, trem: 1, semPisca: true, pop: 0.38}], [TM.hora, {olhos: 'grande', boca: 'nervoso', sob: -0.9, trem: 0.6, semPisca: true}],
  [TM.parece, {olhos: 'tedio', boca: 'triste', olhar: [0.3, 0.7], sob: -0.3}],
  [TM.mas, {olhos: 'normal', boca: 'sorriso'}], [TM.edison, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5}], [TM.proposito, {olhos: 'semi', boca: 'canto', sob: 0.35, assim: 0.02}],
  [TM.estrondo - 1.5, DORME],
  [TM.acorda2, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.7}], [TM.nao, {olhos: 'normal', boca: 'O', olhar: [0.4, -0.7]}],
  [TM.gato - 0.3, DORME], [TM.prato + 0.45, {...DORME, boca: 'sorriso'}],
], 0.3);
const inventorOfi = (t) => {
  let pos = SP, ry = 0, sentado = 1, mP = HP, mN = HN, er = 0, inc = 0, cab = [0, 0, 0], estica = 0, acesa = 0, zz = 0;
  const F = faceInv(t);
  if (t < TM.funciona) { cab = t < TM.acordar ? [0.25, 0, 0.08] : [0, 0, 0]; acesa = kf(t, [[TM.genio - 0.05, 0], [TM.genio + 0.12, 1, outQ]]); zz = t < TM.acordar ? 1 : 0; }
  else if (t < E1 - 0.1) { pos = ST; ry = 0.45; sentado = 0;
    const ap = kf(t, [[TM.funciona + 0.2, 0], [TM.pratos, 1], [TM.cima - 0.3, 1], [TM.cima, 0]]);
    mP = mix(maoRepouso(ST, ry, 1), [ST[0] + 0.42, 0.95, ST[2] + 0.15], ap); mN = maoRepouso(ST, ry, -1, 0.14 + 0.1 * ap);
    inc = -0.12 * kf(t, [[TM.cima - 0.05, 0], [TM.cima + 0.08, 1, outQ], [TM.cima + 0.5, 0]]); }
  else if (t < TM.bola) { const u = cl((t - (E1 - 0.1)) / (TM.bola - E1 + 0.1)); const e = io(u);
    pos = [lerp(ST[0], SP[0], e), lerp(ST[1], SP[1], e) + Math.sin(u * Math.PI) * 0.35, lerp(ST[2], SP[2], e)]; ry = lerp(0.45, 0, e); sentado = cl(u * 1.6);
    mP = [pos[0] + 0.3, pos[1] + 0.85, pos[2] + 0.1]; mN = [pos[0] - 0.3, pos[1] + 0.85, pos[2] + 0.1]; estica = Math.sin(u * Math.PI) * 0.5; }
  else if (t < TM.barulhao) {
    const y = kf(t, [[TM.bola, 0.68], [TM.bola + 0.2, 0.68], [TM.pesada, 0.53, outQ], [TM.pesada + 0.45, 0.6], [TM.amolece, 0.6], [TM.amolece + 0.6, 0.565]]);
    const dx = kf(t, [[TM.amolece, 0], [TM.amolece + 0.6, 0.02], [TM.despencam, 0.03], [TM.despencam + 0.2, 0.05]]);
    mP = [HP[0] + dx, y, HP[2]]; mN = [HN[0] - dx, y, HN[2]];
    estica = -0.6 * kf(t, [[TM.pesada - 0.02, 0], [TM.pesada + 0.08, 1, outQ], [TM.pesada + 0.4, 0]]);
    cab = [kf(t, [[TM.cochilar, 0], [TM.cochilar + 0.6, 0.22], [TM.pega, 0.22], [TM.sono, 0.42]]), 0, kf(t, [[TM.pega, 0.06], [TM.sono, 0.14]])];
    inc = kf(t, [[TM.pega, 0], [TM.sono, 0.08]]); zz = kf(t, [[TM.cochilar + 0.2, 0], [TM.cochilar + 0.6, 1]]); }
  else if (t < TM.parece) {
    pos = [0, kf(t, [[TM.barulhao, 0.02], [TM.barulhao + 0.14, 0.4, outQ], [TM.barulhao + 0.5, 0.36], [TM.barulhao + 0.75, 0.02, inQ]]) + settle(t, TM.barulhao + 0.75, 0.03, 18, 6), 0];
    sentado = kf(t, [[TM.barulhao, 1], [TM.barulhao + 0.12, 0.25], [TM.barulhao + 0.6, 0.3], [TM.barulhao + 0.75, 1]]);
    const up = kf(t, [[TM.barulhao, 0], [TM.barulhao + 0.12, 1, outQ], [TM.barulhao + 0.7, 1], [TM.barulhao + 1.0, 0]]);
    mP = mix([0.3, 0.63, 0.12], [0.36, pos[1] + 1.25, 0.18], up); mN = mix([-0.3, 0.63, 0.12], [-0.36, pos[1] + 1.25, 0.18], up);
    er = kf(t, [[TM.barulhao, 0], [TM.barulhao + 0.1, 1, outQ], [TM.hora + 0.6, 0.6]]); estica = 0.5 * Math.sin(cl((t - TM.barulhao) / 0.3) * Math.PI); }
  else if (t < TM.mas) { mP = [0.3, 0.63, 0.12]; mN = [-0.3, 0.63, 0.12]; er = 0.6; cab = [-0.25 + Math.sin(t * 3) * 0.05, 0.15, Math.sin(t * 2.2) * 0.1]; }
  else if (t < TM.e1) { pos = PB; ry = 0.3; sentado = 0;
    const ergue = kf(t, [[TM.edison, 0], [TM.proposito - 0.1, 1, back]]);
    mN = mix(maoRepouso(PB, ry, -1), [PB[0] - 0.22, 0.55, PB[2] + 0.12], 1); mP = mix(maoRepouso(PB, ry, 1), [PB[0] + 0.28, 1.2, PB[2] + 0.22], ergue);
    acesa = kf(t, [[TM.edison - 0.05, 0], [TM.edison + 0.1, 0.8, outQ], [TM.proposito, 0.8], [TM.proposito + 0.4, 0]]); inc = -0.06; }
  else if (t < TM.puxa) { // inserção: as bolas caem e batem no prato do estrondo
    const sol = kf(t, [[TM.estrondo - 0.4, 0], [TM.estrondo - 0.2, 0.04]]); mP = [HP[0] + sol, 0.57, HP[2]]; mN = [HN[0] - sol, 0.57, HN[2]]; cab = [0.42, 0, 0.14]; inc = 0.08; zz = 1; }
  else if (t < TM.gato - 0.15) { acesa = 1; mN = [-0.3, 0.63, 0.12];
    mP = kf(t, [[TM.acorda2, [0.34, 1.06, 0.18]], [TM.nao, [0.34, 1.06, 0.18]], [TM.nao + 0.3, [0.36, 0.98, 0.2]]]); cab = [0, 0, 0.05]; er = 0.3; }
  else { const sol = kf(t, [[TM.prato - 0.1, 0], [TM.prato + 0.05, 0.03]]); mP = [HP[0] + sol, 0.6 + 0.005 * Math.sin(t * 2), HP[2]]; mN = [HN[0], 0.6, HN[2]]; cab = [0.35, 0, 0.1]; inc = 0.06;
    zz = kf(t, [[TM.prato + 0.4, 1], [TM.prato + 0.9, 1.6]]); }
  return {pos, ry, zz, er, c: {cor: COR_INV, ...F, cab: [F.cab ? F.cab[0] + cab[0] : cab[0], cab[1], cab[2]], sentado, mP, mN, inc, estica, acesa, t, fase: 0.4, resp: t * 3,
    roupa: <><Gravata /><Colete /></>, cabeca: <CabeloInv er={er} />}};
};
// bolas de aço na oficina (lado +x e lado -x)
const bolasOfi = (t, I) => {
  const naMao = (m) => [m[0], m[1] - 0.07, m[2]];
  const noPrato = (x, t0, quique = 0.06) => [x, 0.067 + Math.abs(Math.sin(cl((t - t0) / 0.35) * Math.PI)) * quique * Math.exp(-(t - t0) * 3), 0.12];
  if (t < TM.funciona) return [naMao(I.c.mP), naMao(I.c.mN)];
  if (t < TM.bola - 0.3) return [null, null];
  if (t < TM.bola + 0.2) { const y = kf(t, [[TM.bola - 0.25, 1.9], [TM.bola + 0.2, 0.55, inQ]]); return [[HP[0], y, HP[2]], [HN[0], y + 0.06, HN[2]]]; }
  if (t < TM.barulhao) {
    if (t < TM.despencam) return [naMao(I.c.mP), naMao(I.c.mN)];
    const u = cl((t - TM.despencam) / (TM.pratos2 - TM.despencam));
    return t < TM.pratos2 ? [[HP[0] + 0.05, lerp(0.525, 0.067, inQ(u)), HP[2]], [HN[0] - 0.05, lerp(0.525, 0.067, inQ(cl(u * 1.03))), HN[2]]] : [noPrato(0.42, TM.pratos2), noPrato(-0.42, TM.pratos2)];
  }
  if (t < TM.mas) return [noPrato(0.42, TM.pratos2), noPrato(-0.42, TM.pratos2)];
  if (t < TM.e1) return [naMao(I.c.mP), null];
  if (t < TM.puxa) { const u = cl((t - (TM.estrondo - 0.3)) / 0.3); return t < TM.estrondo ? [[0.46, lerp(0.5, 0.067, inQ(u)), 0.12], [-0.46, lerp(0.5, 0.067, inQ(u)), 0.12]] : [noPrato(0.46, TM.estrondo), noPrato(-0.46, TM.estrondo)]; }
  if (t < TM.gato - 0.15) { const r = kf(t, [[TM.nao, 0], [TM.nao + 0.9, 1, outQ]]); return [[0.42 + r * 0.55, 0.05 + 0.017 * (1 - r), 0.12 + r * 0.2], [-0.42 - r * 0.5, 0.05 + 0.017 * (1 - r), 0.12 + r * 0.25]]; }
  // fim: a bola da direita cai em cima do gato, quica e rola
  if (t < TM.prato) return [naMao(I.c.mP), naMao(I.c.mN)];
  const tb = TM.prato + 0.17;
  if (t < tb) return [[0.45, lerp(0.53, 0.215, inQ(cl((t - TM.prato) / 0.19))), 0.12], naMao(I.c.mN)];
  const u = cl((t - tb) / 0.5); const x = 0.45 + u * 0.2 + cl((t - tb - 0.5) / 0.8) * 0.25;
  return [[x, t < tb + 0.5 ? 0.215 + Math.sin(u * Math.PI) * 0.16 - u * 0.165 : 0.05, 0.12 + u * 0.1], naMao(I.c.mN)];
};
const pratosOfi = (t) => {
  if (t < TM.funciona || t > TM.e1) return [[0.42, 0, 0.12, settle(t, TM.pratos2, 1, 30, 4) + settle(t, TM.estrondo, 1, 30, 4)], [-0.42, 0, 0.12, settle(t, TM.pratos2, 1, 30, 4) + settle(t, TM.estrondo, 1, 30, 4)]];
  const u = kf(t, [[TM.dois2 > 0 ? W_('dois') - 0.05 : 0, 0], [TM.metal, 1, outQ]]);
  const tr = settle(t, TM.metal, 1.2, 26, 3.5);
  return [[lerp(1.9, 0.42, u), 0, 0.12, tr], [lerp(-1.9, -0.42, u), 0, 0.12, -tr]];
};
const poltronaOfi = (t) => {
  if (t < TM.funciona || t > TM.e1) return {y: 0, es: 0};
  const y = kf(t, [[TM.cima - 0.42, 3.4], [TM.cima, 0, inQ]]);
  return {y, es: t > TM.cima ? Math.max(0, settle(t, TM.cima, 1.2, 16, 5)) + Math.max(0, -settle(t, TM.cima, 0.5, 16, 5)) * -0.5 : 0};
};
// gato na oficina
const G0 = [0.85, 0, 0.55], LUM = [0.55, 2.8, 0.3];
const gatoOfi = (t) => {
  if (t < TM.barulhao) return {pos: G0, ry: -0.5, pose: 'dorme', olhos: 'fechado', olhoD: t > TM.genio + 0.1 && t < TM.funciona - 0.2 ? 'normal' : undefined};
  const tp = TM.barulhao + 0.42;
  const balc = settle(t, tp, 0.45, 5, 0.9);
  const ancora = [LUM[0] + Math.sin(balc) * 0.6, LUM[1] - Math.cos(balc) * 0.6, LUM[2] + 0.14];
  if (t < tp) { const u = cl((t - TM.barulhao - 0.04) / 0.38); return {pos: [lerp(G0[0], ancora[0], u), lerp(0.15, ancora[1] - 0.2, io(u)) + Math.sin(u * Math.PI) * 0.4, lerp(G0[2], ancora[2], u)], ry: -0.2, pose: 'salto', bal: -0.3 + u * 0.3, balLum: 0}; }
  if (t < TM.gato - 0.15) return {pos: ancora, ry: -0.25, pose: 'pendura', olhos: t < TM.pior ? 'grande' : 'bravo', eriça: kf(t, [[tp, 1], [TM.pior, 0.6]]), bal: balc, balLum: balc};
  // fim: enrolado em cima do prato da direita
  // a bola cai na cabeça do gato: ele leva o susto, mia bravo e pula para fora do prato
  const ti = TM.prato + 0.19, tp2 = ti + 0.1;
  if (t < tp2) return {pos: [0.47, 0.017, 0.12], ry: 0.15, pose: 'dorme', s: 0.92, olhos: 'fechado', olhoD: t > TM.gato + 0.1 && t < TM.esse + 0.35 ? 'normal' : (t > ti ? 'grande' : undefined)};
  const u = cl((t - tp2) / 1.3);
  return {pos: [lerp(0.47, 1.45, u), 0.2 + Math.sin(Math.min(1, u * 1.15) * Math.PI) * 0.7, lerp(0.12, 0.55, u)], ry: -0.4, pose: 'salto', bal: -0.5 + u * 0.6, s: 0.92};
};
const ZZ_DE = (I) => cabDe(I.pos, 1, 0.02);

// ---------- Dalí ----------
const faceDali = (t) => expr(t, [[0, {olhos: 'semi', palp: 0.72, boca: 'reta', sob: -0.2, vivo: 0.2}], [TM.chave + 0.22, {olhos: 'grande', boca: 'O', sob: -1, escOlho: 1.4, pop: 0.4, semPisca: true}], [TM.chave + 0.75, {olhos: 'grande', boca: 'sorrisoD', sob: -1, escOlho: 1.3, semPisca: true}]], 0.9);
const daliF = (t) => {
  const F = faceDali(t);
  const pos = [XD, 0.02, 0], mP = [XD + 0.42, 0.58 + 0.008 * Math.sin(t * 2), 0.12], mN = [XD - 0.3, 0.72, 0.24];
  const mola = t > TM.chave + 0.22 ? Math.exp(-(t - TM.chave - 0.22) * 2.5) : 0;
  return {pos, c: {cor: '#6D3A86', ...F, cab: [t < TM.chave + 0.22 ? 0.2 : -0.08, -0.08, 0.05], sentado: 1, mP, mN, t, fase: 0.9, resp: t * 3, roupa: <Gravata cor="#E9B44C" />, cabeca: <><CabeloDali /><BigodeDali mola={mola} /></>},
    chave: t < TM.chave ? [mP[0], mP[1] - 0.04, mP[2]] : [mP[0] + 0.02, kf(t, [[TM.chave, 0.54], [TM.chave + 0.22, 0.2, inQ]]) + Math.abs(Math.sin(cl((t - TM.chave - 0.22) / 0.25) * Math.PI)) * 0.04 * (t > TM.chave + 0.22 ? 1 : 0), mP[2]],
    chaveRot: t < TM.chave + 0.22 ? [0, 0.4, 0] : [0, 0.4, kf(t, [[TM.chave + 0.22, 0], [TM.chave + 0.5, 1.4, outQ]])]};
};

// ---------- prédio do sono: elevador, ideias e o inventor de touca ----------
const cyElev = (t) => {
  if (t < TM.porque + 0.6) return 2 * H_AND;
  if (t < TM.normal) return kf(t, [[TM.porque + 0.6, 2 * H_AND], [TM.andar, H_AND]]) + settle(t, TM.andar, 0.05, 14, 5);
  if (t < TM.descer) return 2 * H_AND;
  if (t < TM.puxa) return Math.max(0, kf(t, [[TM.descer, 2 * H_AND], [TM.tudo - 0.15, 0, inQ]])) + (t > TM.tudo - 0.15 ? Math.abs(settle(t, TM.tudo - 0.15, 0.12, 12, 6)) : 0);
  return kf(t, [[TM.puxa, 0], [TM.puxa + 0.45, H_AND + 0.35, outQ], [TM.puxa + 0.8, H_AND - 0.1], [TM.meio2, H_AND]]) + (t > TM.meio2 ? settle(t, TM.meio2, 0.04, 14, 5) : 0);
};
const faceSonho = (t) => expr(t, [
  [0, {olhos: 'semi', boca: 'reta', palp: 0.6}], [TM.andar, {olhos: 'normal', boca: 'O'}], [TM.esquisito, {olhos: 'grande', boca: 'O', sob: -0.8, pop: 0.3, olhar: [-0.6, 0.2]}],
  [TM.ideias + 0.15, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.7}], [TM.normal, {olhos: 'semi', palp: 0.6, boca: 'reta'}], [TM.descer + 0.15, {olhos: 'grande', boca: 'grito', sob: -1, semPisca: true}],
  [TM.tudo - 0.1, DORME], [TM.estrondo, {olhos: 'grande', boca: 'grito', sob: -1, trem: 1, semPisca: true, pop: 0.38}], [TM.meio2 + 0.1, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.6}],
], 0.6);
const sonhador = (t) => {
  const F = faceSonho(t); const y = cyElev(t); const S = 0.8;
  const pos = [XP + 1.62, y + 0.06, 0.02];
  const alegre = Math.max(kf(t, [[TM.ideias, 0], [TM.ideias + 0.15, 1, back], [TM.acordado, 1], [TM.acordado + 0.2, 0]]), 0);
  const pega = kf(t, [[TM.meio2, 0], [TM.meio2 + 0.4, 1]]);
  const susto = kf(t, [[TM.descer, 0], [TM.descer + 0.15, 1], [TM.tudo - 0.2, 1], [TM.tudo, 0]]) + kf(t, [[TM.estrondo, 0], [TM.estrondo + 0.1, 1], [TM.meio2, 1], [TM.meio2 + 0.2, 0]]);
  const base = (l) => [pos[0] + l * 0.17, pos[1] + 0.36, pos[2] + 0.06];
  const cima = (l) => [pos[0] + l * 0.26, pos[1] + 1.12, pos[2] + 0.1];
  const mP = mix(mix(base(1), cima(1), Math.min(1, alegre + susto)), [pos[0] - 0.32, pos[1] + 0.82, pos[2] + 0.2], pega);
  const mN = mix(base(-1), cima(-1), Math.min(1, alegre + susto));
  const acesa = kf(t, [[TM.ideias, 0], [TM.ideias + 0.2, 1], [TM.normal - 0.05, 1], [TM.normal, 0], [TM.meio2 + 0.05, 0], [TM.meio2 + 0.3, 1]]);
  return {pos, S, acesa, c: {cor: COR_INV, ...F, sentado: 0, mP: mP.map((v, i) => (v - pos[i]) / S), mN: mN.map((v, i) => (v - pos[i]) / S), t, fase: 0.6, resp: t * 3, acesa,
    roupa: <><Gravata /><Colete /></>, cabeca: <CabeloInv er={susto > 0.5 ? 1 : 0} touca={1} />}, mPw: mP, mNw: mN};
};
const objsSonho = (t) => {
  const H = H_AND;
  const U0 = [-0.75, H + 0.75 + Math.sin(t * 1.2) * 0.05, 0.15], V0 = [0.3, H + 0.6 + Math.sin(t * 1.5 + 1) * 0.05, 0.15], M = [-0.2, H + 0.72, 0.2];
  const j = kf(t, [[TM.junta - 0.05, 0], [TM.ideias + 0.02, 1, inQ]]);
  const poof = t > TM.ideias + 0.02;
  const someTudo = kf(t, [[TM.esquecer, 1], [TM.tudo + 0.1, 0]]) * (t < TM.puxa ? 1 : 0) + (t >= TM.puxa ? kf(t, [[TM.puxa + 0.4, 0], [TM.puxa + 0.7, 1]]) : 0);
  const outros = t < TM.esquecer ? 1 : someTudo;
  const mk = t < TM.ideias + 0.02 ? 0 : t < TM.esquecer ? kf(t, [[TM.ideias + 0.02, 0.2], [TM.ideias + 0.3, 1, back]]) : t < TM.puxa ? someTudo : kf(t, [[TM.meio2 - 0.3, 0], [TM.meio2, 1, back]]);
  const mp = t < TM.puxa ? kf(t, [[TM.ideias, M], [TM.juntaria + 0.6, [0.15, H + 0.95, 0.2]]]) : kf(t, [[TM.meio2, [0.6, H + 0.9, 0.2]], [TM.meio2 + 0.4, [1.3, H + 0.86, 0.22]]]);
  return {objs: {U: mix(U0, M, j), V: mix(V0, [M[0] + 0.1, M[1], M[2]], j), u: poof ? 0 : 1, v: poof ? 0 : 1, o: outros}, merge: {k: mk, p: mp}, poof};
};
const acordadoTopo = (t) => {
  const pos = [XP - 0.3, 2 * H_AND, 0.1];
  const nega = t > TM.nunca ? Math.sin((t - TM.nunca) * 16) * 0.4 * Math.exp(-(t - TM.nunca) * 2.2) : 0;
  const F = expr(t, [[0, {olhos: 'semi', boca: 'reta', sob: 0.4}], [TM.nunca, {olhos: 'bravo', boca: 'brava', sob: 0.8}]], 0.2);
  return {pos, c: {cor: COR_INV, ...F, cab: [0, nega, 0], sentado: 0, mP: [pos[0] - 0.1, pos[1] + 0.62, pos[2] + 0.2], mN: [pos[0] + 0.1, pos[1] + 0.66, pos[2] + 0.21], t, fase: 0.2, resp: t * 3, roupa: <><Gravata /><Colete /></>, cabeca: <CabeloInv />}};
};

// ---------- laboratório: voluntários e cientistas ----------
const VOL = [[-0.8, 0.2, '#7FB8E0'], [0, 0.2, '#E58FA0'], [0.8, 0.2, '#9FD08A'], [-0.8, -0.8, '#B79BE0'], [0, -0.8, '#F0B66A'], [0.8, -0.8, '#76C9C0'], [-0.8, -1.8, '#E9D36A'], [0, -1.8, '#A9B4C6'], [0.8, -1.8, '#E29B6B']].map(([x, z, cor], i) => ({x: XL + x, z, cor, fase: i * 0.77}));
const voluntario = (t, i) => {
  const v = VOL[i]; const pos = [v.x, 0.02, v.z];
  let F = {...DORME, vivo: 0}, cab = [0.25 + 0.07 * Math.sin(t * 1.3 + v.fase), 0, 0.06 * Math.sin(t * 0.7 + v.fase)], inc = 0.04, lat = 0, acesa = 0, zz = i === 4 || i === 7 ? 0.6 : 0, solta = false, garrafa;
  let mP = [v.x + 0.2, 0.52, v.z + 0.2], mN = [v.x - 0.16, 0.48, v.z + 0.22];
  garrafa = {p: [mP[0], mP[1] - 0.075, mP[2]], rot: [0, 0, 0]};
  if (i === 0) { // cochilo curto: a garrafa cai, ele acorda e acende
    F = expr(t, [[0, DORME], [TM.minutinho, {olhos: 'grande', boca: 'O', sob: -0.8, semPisca: true, pop: 0.35}], [TM.minutinho + 0.5, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.6}], [TM.truque, {olhos: 'grande', boca: 'sorrisoD', sob: -0.6, pop: 0.3}]], 0.1);
    const tc = TM.cochilou + 0.12, tg = tc + 0.32;
    if (t > tc) { const u = cl((t - tc) / 0.32); garrafa = {p: [mP[0] + u * 0.05, t < tg ? lerp(0.445, 0.03, inQ(u)) : 0.03 + Math.abs(Math.sin(cl((t - tg) / 0.3) * Math.PI)) * 0.04 * Math.exp(-(t - tg) * 4), mP[2] + u * 0.08], rot: [0, 0, t < tg ? u * 0.8 : Math.PI / 2]}; mP = [mP[0] + 0.02, 0.5, mP[2]]; }
    if (t > TM.minutinho) cab = [0, 0, 0];
    acesa = kf(t, [[TM.minutinho + 0.2, 0], [TM.minutinho + 0.5, 1, outQ]]);
    const soco = kf(t, [[TM.truque, 0], [TM.truque + 0.2, 1, back], [TM.ja, 1]]); mP = mix(mP, [v.x + 0.26, 1.2, v.z + 0.22], soco);
  }
  if (i === 2) { // sono fundo demais: largado, roncando, a lâmpada pisca e queima
    cab = [0.45 + 0.04 * Math.sin(t * 1.1), 0, 0.3]; inc = -0.22; lat = -0.12; zz = 1;
    F = {...DORME, boca: 'O', abre: 0.4 + 0.3 * Math.sin(t * 2.2)};
    mP = [v.x + 0.3, 0.3, v.z + 0.22]; garrafa = {p: [v.x + 0.45, 0.03, v.z + 0.45], rot: [0, 0.6, Math.PI / 2]};
    const fl = t > TM.perdeu && t < TM.perdeu + 0.5 ? ((Math.floor((t - TM.perdeu) * 30) % 4) < 2 ? 0.7 : 0) : 0; acesa = fl;
  }
  return {pos, zz, acesa, garrafa, c: {cor: v.cor, ...F, cab, inc, lat, sentado: 1, mP, mN, t, fase: v.fase, resp: t * 3 + v.fase, acesa, vivo: 0.1}};
};
const Oculos = () => <group>{[-1, 1].map((l) => <mesh key={l} position={[l * 0.062, 0.19, 0.162]} rotation={[0, l * 0.35, 0]} material={B(LINHA)}><torusGeometry args={[0.045, 0.006, 6, 20]} /></mesh>)}<Linha a={[-0.018, 0.2, 0.17]} b={[0.018, 0.2, 0.17]} r={0.005} /></group>;
const Jaleco = () => <group>{[0.52, 0.62, 0.72].map((y, i) => <Esf key={i} r={0.012} p={[0.03, y, 0.18 - (y - 0.52) * 0.08]} m="#A9B4C6" line={0.3} seg={8} />)}<Cx a={[0.07, 0.07, 0.01]} p={[-0.08, 0.68, 0.16]} rot={[-0.15, 0.4, 0]} m="#DCE6EE" line={0.4} /></group>;
const cientista = (t, k) => {
  const pos = k === 0 ? [XL - 1.5, 0, 0.9] : [XL + 1.55, 0, -0.75], ry = k === 0 ? 0.55 : -0.55;
  const F = expr(t, k === 0 ? [[0, {olhos: 'normal', boca: 'sorriso', olhar: [0.6, -0.2]}], [TM.minutinho + 0.2, {olhos: 'grande', boca: 'O', sob: -0.6}], [TM.truque + 0.1, {olhos: 'feliz', boca: 'sorrisoD'}], [TM.perdeu, {olhos: 'semi', boca: 'triste', sob: -0.4}]]
    : [[0, {olhos: 'normal', boca: 'reta', olhar: [-0.5, -0.3]}], [TM.cochilando, {olhos: 'semi', boca: 'canto'}]], k * 1.3);
  const prancheta = [pos[0] + (k === 0 ? 0.1 : -0.1), 0.72, pos[2] + 0.2];
  return {pos, ry, prancheta, c: {cor: '#F4F4F2', ...F, sentado: 0, mN: [prancheta[0] - 0.05, prancheta[1] - 0.04, prancheta[2]], mP: [prancheta[0] + 0.1, prancheta[1] + 0.04 + 0.01 * Math.sin(t * 9), prancheta[2] + 0.03], t, fase: k, resp: t * 3 + k, cabeca: <><Oculos /><CabeloInv /></>, roupa: <Jaleco />}};
};

// ---------- câmera ----------
const TG = TM.gato - 0.15;
const PLANOS = [
  {t0: 0, set: 'ofi', keys: [[0, [0.0, 1.02, 2.5], [0, 0.74, 0], 46], [TM.acordar, [0.02, 1.02, 2.15], [0, 0.78, 0], 46], [TM.funciona - 0.02, [0.0, 1.05, 1.95], [0, 0.85, 0], 46]]},
  {t0: TM.funciona, set: 'ofi', keys: [[TM.funciona, [0.05, 1.5, 3.6], [-0.42, 0.72, 0.15], 52], [TM.pratos + 0.4, [-0.05, 1.38, 3.4], [-0.38, 0.62, 0.15], 52], [TM.cima + 0.3, [0.0, 1.35, 3.3], [-0.22, 0.75, 0.05], 50], [TM.cada, [0.15, 1.2, 2.6], [0, 0.75, 0], 46], [TM.agora - 0.05, [0.05, 1.12, 2.0], [0, 0.88, 0], 44]]},
  {t0: TM.agora, set: 'ofi', keys: [[TM.agora, [0.32, 1.15, 2.0], [0.0, 0.95, 0.05], 40], [TM.mao2 - 0.05, [0.25, 1.12, 1.75], [0, 0.93, 0.05], 40]]},
  {t0: TM.mao2, set: 'ofi', keys: [[TM.mao2, [0.95, 0.68, 0.95], [0.42, 0.48, 0.12], 38], [TM.despencam, [0.9, 0.6, 0.85], [0.42, 0.42, 0.12], 38], [TM.pratos2, [0.85, 0.35, 0.85], [0.42, 0.15, 0.12], 40], [TM.barulhao - 0.02, [0.86, 0.33, 0.88], [0.42, 0.14, 0.12], 40]]},
  {t0: TM.barulhao, set: 'ofi', keys: [[TM.barulhao, [0.25, 1.35, 3.4], [0.25, 1.2, 0], 52], [TM.hora + 0.5, [0.2, 1.3, 3.1], [0.25, 1.2, 0], 52]]},
  {t0: TM.parece, set: 'ofi', keys: [[TM.parece, [0.95, 1.5, 1.75], [0.56, 2.0, 0.4], 46], [TM.mas - 0.02, [0.9, 1.55, 1.55], [0.56, 2.0, 0.4], 46]]},
  {t0: TM.mas, set: 'ofi', keys: [[TM.mas, [-0.55, 1.25, 1.25], [-0.92, 1.0, -1.1], 46], [TM.e1 - 0.02, [-0.62, 1.2, 1.0], [-0.92, 1.02, -1.1], 46]]},
  {t0: TM.e1, set: 'dali', keys: [[TM.e1, [XD + 0.25, 1.05, 2.4], [XD + 0.1, 0.75, 0], 46], [TM.chave - 0.1, [XD + 0.15, 1.0, 2.0], [XD + 0.15, 0.75, 0], 46], [TM.porque - 0.02, [XD + 0.12, 0.98, 1.85], [XD + 0.15, 0.75, 0], 46]]},
  {t0: TM.porque, set: 'predio', keys: [[TM.porque, [XP + 0.3, 2.8, 10.5], [XP + 0.3, 2.7, 0], 46], [TM.sono2, [XP + 0.3, 2.3, 9.5], [XP + 0.3, 2.2, 0], 46], [TM.cerebro, [XP + 0.3, 3.4, 10.2], [XP + 0.3, 3.2, 0], 46], [TM.andar, [XP + 0.5, 2.6, 7.5], [XP + 0.6, 2.4, 0], 46], [TM.esquisito + 0.3, [XP + 0.65, 2.7, 6.9], [XP + 0.65, 2.55, 0], 46], [TM.ali - 0.02, [XP + 0.6, 2.68, 6.4], [XP + 0.6, 2.55, 0], 46]]},
  {t0: TM.ali, set: 'predio', keys: [[TM.ali, [XP + 0.2, 2.5, 3.6], [XP + 0.05, 2.38, 0.1], 44], [TM.acordado - 0.02, [XP + 0.3, 2.5, 3.3], [XP + 0.15, 2.4, 0.1], 44]]},
  {t0: TM.acordado, set: 'predio', keys: [[TM.acordado, [XP - 0.15, 4.0, 3.3], [XP - 0.25, 3.85, 0], 44], [TM.normal - 0.02, [XP - 0.2, 3.98, 3.0], [XP - 0.28, 3.85, 0], 44]]},
  {t0: TM.normal, set: 'predio', keys: [[TM.normal, [XP + 1.0, 3.6, 6.5], [XP + 1.0, 3.6, 0], 46], [TM.descer, [XP + 1.0, 3.5, 6.5], [XP + 1.0, 3.5, 0], 46], [TM.tudo + 0.3, [XP + 0.9, 1.2, 6.2], [XP + 0.9, 0.8, 0], 46], [TM.estrondo - 0.12, [XP + 0.85, 1.1, 5.6], [XP + 0.9, 0.8, 0], 46]]},
  {t0: TM.estrondo - 0.1, set: 'ofi', keys: [[TM.estrondo - 0.1, [0.85, 0.4, 0.85], [0.42, 0.2, 0.12], 40], [TM.puxa - 0.02, [0.83, 0.36, 0.82], [0.42, 0.15, 0.12], 40]]},
  {t0: TM.puxa, set: 'predio', keys: [[TM.puxa, [XP + 0.9, 1.1, 5.6], [XP + 0.9, 1.0, 0], 46], [TM.meio2, [XP + 1.15, 2.45, 5.0], [XP + 1.25, 2.3, 0], 46], [TM.acorda2 - 0.02, [XP + 1.1, 2.45, 4.5], [XP + 1.25, 2.35, 0], 44]]},
  {t0: TM.acorda2, set: 'ofi', keys: [[TM.acorda2, [0.15, 1.2, 2.2], [0.05, 0.95, 0], 44], [TM.nao - 0.05, [0.12, 1.15, 2.0], [0.05, 0.9, 0], 44], [TM.nao + 0.3, [0.5, 0.7, 1.6], [0.5, 0.2, 0.1], 44], [TM.em - 0.02, [0.55, 0.62, 1.45], [0.6, 0.15, 0.1], 44]]},
  {t0: TM.em, set: 'lab', keys: [[TM.em, [XL - 0.25, 2.15, 1.2], [XL - 0.2, 1.62, -2.2], 40], [TM.cientistas, [XL - 0.1, 1.55, 3.0], [XL, 0.85, -0.6], 48], [TM.sentada, [XL + 0.1, 1.45, 3.4], [XL, 0.8, -0.6], 50], [TM.quem - 0.02, [XL, 1.4, 3.3], [XL, 0.8, -0.6], 50]]},
  {t0: TM.quem, set: 'lab', keys: [[TM.quem, [XL - 0.4, 1.2, 2.5], [XL - 0.75, 0.82, 0.2], 44], [TM.tres - 0.02, [XL - 0.45, 1.18, 2.25], [XL - 0.75, 0.84, 0.2], 44]]},
  {t0: TM.tres, set: 'lab', keys: [[TM.tres, [XL + 0.45, 1.25, 3.1], [XL + 1.25, 1.15, 0.9], 44], [TM.truque - 0.02, [XL + 0.52, 1.25, 2.85], [XL + 1.25, 1.17, 0.9], 44]]},
  {t0: TM.truque, set: 'lab', keys: [[TM.truque, [XL - 0.4, 1.25, 2.4], [XL - 0.72, 0.98, 0.2], 44], [TM.ja - 0.02, [XL - 0.45, 1.22, 2.2], [XL - 0.72, 0.98, 0.2], 44]]},
  {t0: TM.ja, set: 'lab', keys: [[TM.ja, [XL + 0.25, 1.15, 2.1], [XL + 0.78, 0.78, 0.2], 44], [TG - 0.02, [XL + 0.3, 1.12, 1.85], [XL + 0.78, 0.8, 0.2], 44]]},
  {t0: TG, set: 'ofi', keys: [[TG, [0.85, 0.55, 1.25], [0.45, 0.2, 0.12], 42], [TM.prato + 0.2, [0.8, 0.6, 1.35], [0.42, 0.25, 0.1], 42], [TM.prato + 0.9, [0.75, 0.9, 2.5], [0.6, 0.55, 0.15], 48], [71, [0.58, 0.97, 2.4], [0.32, 0.57, 0.05], 46]]},
];
const TREMORES = [[TM.pratos2, 0.025], [TM.barulhao, 0.03], [TM.estrondo, 0.03], [TM.chave + 0.22, 0.012], [TM.cima, 0.015]];
const camEm = (t) => {
  let pl = PLANOS[0]; for (const p of PLANOS) if (t >= p.t0) pl = p;
  const k = pl.keys; let i = 1; while (i < k.length - 1 && t > k[i][0]) i++;
  const [t0, p0, l0, f0] = k[i - 1], [t1, p1, l1, f1] = k[i];
  const u = io(cl((t - t0) / Math.max(1e-6, t1 - t0)));
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
const CenaOficina = ({t}) => {
  const I = inventorOfi(t); const [bR, bL] = bolasOfi(t, I); const P = pratosOfi(t); const Po = poltronaOfi(t); const G = gatoOfi(t);
  const pulo = Math.max(0, 1 - Math.abs(t - TM.barulhao - 0.2) * 2.5);
  const cab = cabDe(I.pos, 1);
  const brilho = (t0, d = 0.5) => fx01(t, t0 - 0.04, d);
  return (
    <group>
      <Oficina t={t} pulo={pulo} balLum={G.balLum || 0} />
      <Poltrona p={[0, Po.y, 0]} esmaga={Po.es} />
      {P.map(([x, y, z, tr], i) => <Prato key={i} p={[x, y, z]} tr={tr} />)}
      <Boneco pos={I.pos} ry={I.ry} c={I.c} />
      <Halo p={[cab[0], cab[1], cab[2] + 0.05]} k={I.c.acesa} s={1.1} id={1} />
      {I.c.acesa > 0.5 && t < TM.funciona ? [0, 1, 2, 3].map((k) => <Brilho key={k} id={20 + k} p={[cab[0] + Math.cos(k * 1.6) * 0.3, cab[1] + Math.sin(k * 1.6) * 0.25, cab[2] + 0.1]} k={fx01(t, TM.genio + k * 0.12, 0.6)} s={0.18} />) : null}
      <Zzz p={cab} t={t} k={I.zz} id={1} s={0.1 * (I.zz > 1 ? 1.4 : 1)} />
      {bR ? <Bola p={bR} /> : null}{bL ? <Bola p={bL} /> : null}
      <Brilho id={2} p={bR ? add(bR, [0.02, 0.03, 0.05]) : [0, -9, 0]} k={Math.max(brilho(TM.bolas), brilho(TM.cada), brilho(TM.aco))} s={0.22} />
      <Brilho id={3} p={bL ? add(bL, [0.02, 0.03, 0.05]) : [0, -9, 0]} k={Math.max(brilho(TM.aco), brilho(TM.mao))} s={0.22} />
      {/* estrondo: faísca e onda nos dois pratos */}
      {[TM.pratos2, TM.estrondo].map((t0, j) => [0.42, -0.42].map((x, i) => <group key={j + '' + i}><Faisca id={4 + i + j * 2} p={[x * (j ? 1.1 : 1), 0.1, 0.16]} k={fx01(t, t0, 0.3)} s={0.45} /><Onda p={[x, 0.02, 0.12]} k={fx01(t, t0, 0.45)} r={0.6} id={i + j * 2} /></group>))}
      <Faisca id={9} p={[0.45, 0.24, 0.16]} k={fx01(t, TM.metal, 0.25) + fx01(t, TM.chao, 0.01) * 0} s={0.3} />
      <Gota id={1} p={[cab[0] + 0.2, cab[1] + 0.12, cab[2] + 0.12]} k={fx01(t, TM.barulhao + 0.4, 0.7) + fx01(t, TM.pesada + 0.1, 0.7)} />
      <Gato pos={G.pos} ry={G.ry} pose={G.pose} olhos={G.olhos} olhoD={G.olhoD} t={t} eriça={G.eriça || 0} bal={G.bal || 0} s={(G.s || 1)} />
      {t > TG ? <Velocidade id={3} p={[0.6, 0.4, 0.2]} k={0} /> : null}
      {I.c.acesa > 0.02 && t > TM.acorda2 && t < TG ? <Invencao p={add(I.c.mP, [0, 0.08, 0])} s={0.55} gira={t * 9} /> : null}
      {t > TM.cima - 0.05 && t < TM.cima + 0.4 ? [0, 1, 2].map((k) => <Nuvem key={k} id={40 + k} p={[-0.4 + k * 0.4, 0.1, 0.35]} s={0.35 * (1 + (t - TM.cima) * 2)} />) : null}
    </group>
  );
};
const CenaDali = ({t}) => {
  const D = daliF(t);
  return (
    <group>
      <Atelie t={t} />
      <Poltrona p={[XD, 0, 0]} cor="#C99A3A" cor2="#B6862C" />
      <Prato p={[XD + 0.44, 0, 0.12]} tr={settle(t, TM.chave + 0.22, 1, 30, 4)} />
      <Boneco pos={D.pos} c={D.c} />
      <Chave p={D.chave} rot={D.chaveRot} s={1.1} />
      <Brilho id={11} p={add(D.chave, [0.03, -0.02, 0.06])} k={fx01(t, TM.chave - 0.05, 0.5)} s={0.25} />
      <Faisca id={12} p={[XD + 0.44, 0.08, 0.16]} k={fx01(t, TM.chave + 0.22, 0.3)} s={0.35} />
      <Onda p={[XD + 0.44, 0.02, 0.12]} k={fx01(t, TM.chave + 0.22, 0.45)} r={0.5} id={8} />
      {/* pincel na outra mão */}
      <Linha a={D.c.mN} b={add(D.c.mN, [-0.05, 0.22, 0.02])} r={0.008} cor="#8A5A34" /><Esf r={0.018} p={add(D.c.mN, [-0.055, 0.24, 0.02])} s={[1, 1.6, 1]} m="#D8323C" line={0.4} seg={8} />
    </group>
  );
};
const CenaPredio = ({t}) => {
  const S = sonhador(t); const O = objsSonho(t); const A = acordadoTopo(t);
  const luzTopo = kf(t, [[TM.cerebro - 0.05, 0], [TM.cerebro + 0.12, 1, outQ], [TM.andar - 0.2, 1], [TM.andar + 0.2, 0.15]]);
  const yc = cyElev(t);
  const M = [XP - 0.2, H_AND + 0.72, 0.2];
  const placaFx = (t0) => fx01(t, t0 - 0.04, 0.6);
  return (
    <group>
      <Predio t={t} yc={yc} objs={O.objs} merge={O.merge} luzTopo={luzTopo} />
      <Elevador p={[XP + 1.65, yc, 0]} />
      <group position={S.pos} scale={S.S}><Boneco pos={[0, 0, 0]} c={S.c} /></group>
      <Halo p={add(cabDe(S.pos, S.S), [0, 0, 0.1])} k={S.acesa} s={0.9} id={2} />
      <Zzz p={cabDe(S.pos, S.S)} t={t} k={t > TM.tudo - 0.1 && t < TM.estrondo ? 1 : 0} id={2} />
      <Boneco pos={A.pos} c={A.c} />
      {/* brilho nas placas quando o andar é dito */}
      <Brilho id={13} p={[XP - 0.45, 1.3, -0.7]} k={placaFx(TM.sono2)} s={0.4} />
      <Brilho id={14} p={[XP - 0.45, H_AND + 1.3, -0.7]} k={placaFx(TM.hipnagogia)} s={0.45} />
      <Brilho id={15} p={[XP - 0.45, 2 * H_AND + 1.3, -0.7]} k={placaFx(TM.acordado)} s={0.4} />
      {/* a junção: puf de nuvem e faísca */}
      {O.poof && t < TM.ideias + 0.5 ? [0, 1, 2, 3].map((k) => <Nuvem key={k} id={60 + k} p={add(M, [Math.cos(k * 1.57) * 0.12, Math.sin(k * 1.57) * 0.1, 0.05])} s={0.35 * (0.6 + (t - TM.ideias) * 3) * (1 - cl((t - TM.ideias - 0.3) / 0.2))} />) : null}
      <Faisca id={16} p={add(M, [0, 0, 0.1])} k={fx01(t, TM.ideias, 0.3)} s={0.5} />
      {/* esquecer: as ideias somem em fumaça */}
      {[[-0.3, H_AND + 1.12, -0.35], [0.75, H_AND + 1.02, -0.45], [-0.95, H_AND + 1.2, -0.5], [0.15, H_AND + 0.95, 0.2]].map((p, k) => <Fumaca key={k} id={k} p={add([XP, 0, 0], p)} k={fx01(t, TM.esquecer + k * 0.06, 0.6)} s={0.4} />)}
      <Velocidade id={17} p={[XP + 1.65, yc + 1.0, 0.45]} k={(t > TM.descer + 0.1 && t < TM.tudo - 0.2) || (t > TM.puxa && t < TM.puxa + 0.45) ? (t * 5) % 1 : 0} s={0.7} rot={Math.PI / 2} />
      <Estrelas t={t} />
      {[[-5, 1, -6, 4], [5.5, 2, -6, 4.5], [-5, 5, -4, 3], [5, 6, -5, 3.5], [0, -4, -8, 6]].map(([x, y, z, s], i) => <Nuvem key={'nb' + i} id={70 + i} p={[XP + x, y, z]} s={s} />)}
    </group>
  );
};
const CenaLab = ({t}) => {
  const Vs = VOL.map((_, i) => voluntario(t, i)); const C0 = cientista(t, 0), C1 = cientista(t, 1);
  const luzes = [kf(t, [[TM.tres, 0], [TM.tres + 0.12, 1]]), kf(t, [[TM.vezes, 0], [TM.vezes + 0.12, 1]]), kf(t, [[TM.mais, 0], [TM.mais + 0.12, 1]])];
  const nPl = t > TM.chance - 0.05 ? 4 : 0;
  return (
    <group>
      <Laboratorio t={t} />
      {Vs.map((V, i) => <group key={i}>
        <CadeiraLab p={[VOL[i].x, 0, VOL[i].z]} />
        <Boneco pos={V.pos} c={V.c} />
        <Garrafa p={V.garrafa.p} rot={V.garrafa.rot} />
        <Zzz p={cabDe(V.pos)} t={t} k={V.zz} id={10 + i} s={i === 2 ? 0.16 : 0.09} />
        <Halo p={add(cabDe(V.pos), [0, 0, 0.1])} k={V.acesa} s={1.0} id={10 + i} />
      </group>)}
      {[0, 1, 2, 3].map((k) => <Brilho key={k} id={50 + k} p={add(cabDe(Vs[0].pos), [Math.cos(k * 1.6 + 0.4) * 0.3, Math.sin(k * 1.6 + 0.4) * 0.26, 0.12])} k={fx01(t, TM.truque + k * 0.1, 0.6)} s={0.2} />)}
      <Fumaca id={9} p={add(cabDe(Vs[2].pos), [0, 0.18, 0])} k={fx01(t, TM.efeito - 0.1, 1.0)} s={0.35} />
      {[C0, C1].map((C, k) => <group key={'c' + k}><Boneco pos={C.pos} ry={C.ry} c={C.c} /><Cx a={[0.16, 0.22, 0.015]} p={C.prancheta} rot={[-0.5, C.ry, 0]} m="#C9A57A" line={0.5} /></group>)}
      <Placar p={[XL + 1.25, 0, 0.9]} rot={-0.35} n={nPl} luzes={luzes} />
      <Brilho id={55} p={[XL + 1.25 + 0.1, 1.05, 1.05]} k={fx01(t, TM.chance - 0.04, 0.6)} s={0.4} />
      <Brilho id={56} p={[XL - 0.05, 2.0, -2.1]} k={fx01(t, TM.paris - 0.04, 0.6)} s={0.35} />
    </group>
  );
};

// ---------- legenda ----------
const GRUPOS = (() => { const g = []; let i = 0; while (i < PALAVRAS.length) { const a = PALAVRAS[i], l = a.w.replace(/[.,!?:]/g, ''); if (l.length <= 2 && i + 1 < PALAVRAS.length && !/[.,!?:]$/.test(a.w)) { g.push({txt: a.w + ' ' + PALAVRAS[i + 1].w, s: a.s, e: PALAVRAS[i + 1].e}); i += 2; } else { g.push({txt: a.w, s: a.s, e: a.e}); i++; } } return g; })();
if (typeof document !== 'undefined' && !window.__montLE) {
  window.__montLE = true; const h = delayRender('fonte');
  new FontFace('MontLE', `url(${staticFile('Montserrat-Black.woff2')})`, {weight: '900'}).load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
}
const limpa = (x) => x.replace(/\.\.\.$/, '').replace(/:$/, '');
const Legenda = ({t}) => {
  let cur = null;
  for (let i = 0; i < GRUPOS.length; i++) { const nx = GRUPOS[i + 1]; const fim = nx ? Math.min(nx.s, GRUPOS[i].e + 0.6) : GRUPOS[i].e + 0.5; if (t >= GRUPOS[i].s - 0.02 && t < fim) cur = GRUPOS[i]; }
  if (!cur) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1300, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <span style={{fontFamily: 'MontLE', fontWeight: 900, fontSize: 80, color: '#fff', WebkitTextStroke: '14px #372C2E', paintOrder: 'stroke fill', textShadow: '0 5px 9px rgba(0,0,0,0.3)'}}>{limpa(cur.txt)}</span>
  </div>;
};

export const Ideia = () => {
  const t = useCurrentFrame() / 30;
  const c = camEm(t);
  const set = c.set;
  const chicote = Math.max(0, Math.sin(cl((t - TM.e1 + 0.12) / 0.3) * Math.PI)) + Math.max(0, Math.sin(cl((t - TM.em + 0.12) / 0.3) * Math.PI));
  const ALVO = {ofi: [0, 0.4, 0], dali: [XD, 0.4, 0], predio: [XP + 0.3, 2.4, 0], lab: [XL, 0.4, -0.5]}[set];
  const AREA = {ofi: 3.6, dali: 3, predio: 4.5, lab: 3.8}[set];
  const fora = set === 'predio';
  return (
    <AbsoluteFill style={{backgroundColor: '#D3E3F0'}}>
      <Borrao k={chicote * 0.9} />
      <AbsoluteFill style={{filter: chicote > 0.02 ? 'url(#chicote)' : undefined}}>
        <ThreeCanvas width={1080} height={1920} dpr={IN.dpr || 2} shadows gl={{antialias: true}} camera={{fov: 50, position: [0, 2, 6]}}>
          <Cam c={c} />
          <fog attach="fog" args={['#E8DFD0', fora ? 30 : 14, fora ? 90 : 40]} />
          <Ceu c={c} noite={fora ? 0.62 : 0} />
          <Sol alvo={ALVO} area={AREA} luz={fora ? 0.8 : 1} dir={set === 'predio' ? [-6, 6.4, 8] : [-8, 6.4, 5]} />
          {set === 'ofi' ? <CenaOficina t={t} /> : null}
          {set === 'dali' ? <CenaDali t={t} /> : null}
          {set === 'predio' ? <CenaPredio t={t} /> : null}
          {set === 'lab' ? <CenaLab t={t} /> : null}
          {IN.pos !== false ? <><Aquece /><PosToon dpr={IN.dpr || 2} dof={IN.dof !== false} ao={IN.ao !== false} foco={c.look} bokeh={fora && c.d > 6 ? 0.8 : 1.6} faixa={fora && c.d > 6 ? 8 : 2.6} longe={fora ? 120 : 40} sat={0.0} /></> : null}
        </ThreeCanvas>
      </AbsoluteFill>
      {IN.semLegenda ? null : <Legenda t={t} />}
    </AbsoluteFill>
  );
};
