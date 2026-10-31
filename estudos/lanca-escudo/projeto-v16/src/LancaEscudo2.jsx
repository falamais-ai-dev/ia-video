// Teste de estilo v2 (31/10/2026): refeito a partir da comparação justa com o original.
// Ponte vista de frente (o rio corre na direção da câmera), personagens "cabeça de lâmpada", traço marrom,
// sol dourado baixo, metal em matcap, cenário cheio, milhares de soldados, animação com antecipação e vida.
import React from 'react';
import * as THREE from 'three';
import {AbsoluteFill, useCurrentFrame, Easing, getInputProps, staticFile, delayRender, continueRender} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {tingeNuvens, T, B, HULL, Tn, Esf, Cx, Ci, Co, Linha, canvasTex, PRATA, OURO, FERRO, MAT, GRAD, LINHA, Boneco, maoRepouso, CoroaOuro, CoroaPrata, Barba, Cavanhaque, BigodeGuidao, Avental, Elmo, Lanca, pontaDe, Brilho, Faisca, Gota, Velocidade, Nuvem} from './toon2';
import {PALAVRAS} from './palavras';
import {Borrao, Aquece} from './cinema';
import {PosToon} from './pos';

export const DUR_LE2 = 70 * 30;
const IN = getInputProps();
const io = Easing.inOut(Easing.cubic);
const back = Easing.out(Easing.back(1.8));
const outQ = Easing.out(Easing.quad);
const inQ = Easing.in(Easing.quad);
const lerp = (a, b, p) => a + (b - a) * p;
const mix = (a, b, p) => Array.isArray(a) ? a.map((v, i) => lerp(v, b[i], p)) : lerp(a, b, p);
const kf = (t, keys, ez = io) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1, e] = keys[i]; return mix(v0, v1, (e || ez)((t - t0) / Math.max(1e-6, t1 - t0))); }
  return keys[keys.length - 1][1];
};
const fx = (t, t0, d) => (t - t0) / d;
const settle = (t, t0, amp, f = 14, dec = 5) => (t > t0 ? Math.sin((t - t0) * f) * amp * Math.exp(-(t - t0) * dec) : 0);
const W_ = (txt, n = 0) => { let c = 0; for (const p of PALAVRAS) if (p.w.toLowerCase().replace(/[.,!?]/g, '') === txt) { if (c === n) return p.s; c++; } throw new Error(txt); };
const TM = {lanca: W_('lança'), furava: W_('furava'), qualquer: W_('qualquer'), coisa: W_('coisa'), rei: W_('rei'), escudo: W_('escudo'), nada: W_('nada'), furava2: W_('furava', 1),
  pior: W_('pior'), inimigo: W_('inimigo'), os: W_('os'), guerra: W_('guerra'), cem: W_('cem'), agora: W_('agora'), arma: W_('arma'), entao: W_('então'), exercitos: W_('exércitos'),
  campo: W_('campo'), lanca2: W_('lança', 1), escudo2: W_('escudo', 1),
  osReis: W_('os', 2), pararam: W_('pararam'), trilha: W_('trilha'), vermelho: W_('vermelho'), lanca3: W_('lança', 2), qualquer2: W_('qualquer', 1), coisa2: W_('coisa', 1),
  verde: W_('verde'), escudo3: W_('escudo', 2), nada2: W_('nada', 1), fura2: W_('fura', 1), pegou: W_('pegou'), correu: W_('correu'), mirou: W_('mirou'), encostou: W_('encostou'),
  mundo: W_('mundo'), travou: W_('travou'), porque: W_('porque'), furasse: W_('furasse'), mentira1: W_('mentira'), aguentasse: W_('aguentasse'), mentira2: W_('mentira', 1),
  entao2: W_('então', 1), ficaram: W_('ficaram'), dia: W_('dia'), semana: W_('semana'), ano: W_('ano'), enquanto: W_('enquanto'), ponte: W_('ponte'), contava: W_('contava'),
  pendurava: W_('pendurava'), placa: W_('placa'), espada: W_('espada'), metade: W_('metade'), preco: W_('preço'), soldado: W_('soldado'), virou: W_('virou'), cento: W_('cento')};
const X0 = 300;
// piscar: fechado ~0,1 s a cada ~2,6 s (fase por personagem)
const pisca = (t, fase) => ((t + fase) % 2.6) < 0.09;
// troca de expressão passa por um piscar (2 quadros), como no desenho
const piscaEm = (t, tempos) => tempos.some((x) => t > x - 0.035 && t < x + 0.035);
// linha do tempo de expressões: cada chave vale até a próxima (troca seca em 2 quadros, com piscar)
const expr = (t, tl, fase = 0) => {
  // cada expressão fica no mínimo 0,23 s (7 quadros): chaves mais próximas que isso são ignoradas
  const tlv = []; for (const kv of tl) if (!tlv.length || kv[0] - tlv[tlv.length - 1][0] >= 0.23) tlv.push(kv);
  let cur = tlv[0][1], tc = -9; for (const [k, v] of tlv) if (t >= k) { cur = v; tc = k; }
  // piscada de troca: sempre 2 quadros inteiros, e nunca quando a troca envolve um susto (semPisca no rosto antigo ou no novo)
  const troca = tlv.some(([k, v], i) => i > 0 && t >= k - 0.001 && t < k + 0.066 && !v.semPisca && !tlv[i - 1][1].semPisca);
  const o = {sob: 0, assim: 0, bochecha: 0, trem: 0, vivo: 0.5, palp: null, abre: 0, ...cur};
  o.escOlho = (cur.escOlho || 1) + kf(t, [[tc - 0.01, 0], [tc + 0.05, cur.pop ?? 0.08, outQ], [tc + 0.25, 0]]);
  if (troca || (pisca(t, fase) && !cur.semPisca)) o.olhos = 'pisca';
  return o;
};
const pop = (t, t0, a = 0.25) => kf(t, [[t0 - 0.01, 0], [t0 + 0.05, a, outQ], [t0 + 0.3, 0]]);

// ---------- câmera (sempre em movimento) ----------
const PLANOS = [
  {t0: 0, keys: [
    [0, [0.02, 1.16, 4.2], [0.0, 0.76, 0], 50],
    [TM.qualquer + 0.35, [-0.16, 1.1, 3.85], [-0.16, 0.7, 0], 50],
    [TM.escudo + 0.05, [0.5, 1.08, 3.7], [0.55, 0.7, 0], 50],
    [TM.pior - 0.25, [0.56, 1.06, 3.5], [0.6, 0.7, 0], 50],
    [TM.pior + 0.3, [0.02, 1.16, 4.3], [0.02, 0.72, 0], 50],
    [TM.os - 0.02, [0.06, 1.15, 4.15], [0.03, 0.72, 0], 50],
    [TM.os + 0.28, [-3.2, 1.08, 4.6], [-3.25, 0.86, -0.4], 48],
    [TM.agora - 0.15, [-3.12, 1.02, 4.0], [-3.12, 0.9, -0.4], 48],
    [TM.agora + 0.9, [-1.4, 1.7, 7.6], [-0.7, -0.35, 0], 50],
    [TM.arma - 0.25, [0.2, 4.2, 12.5], [0, -0.9, 0], 50],
    [TM.entao, [0, 27, 21], [0, -1, -9], 50],
  ]},
  {t0: TM.entao, keys: [[TM.entao, [X0, 17, 1.4], [X0, 0, -2.8], 46], [TM.exercitos + 0.1, [X0, 14, 0.9], [X0, 0, -2.5], 46]]},
  {t0: TM.exercitos + 0.1, keys: [
    [TM.exercitos + 0.1, [X0, 0.42, 6.3], [X0, 0.85, 0], 44],
    [TM.lanca2 - 0.1, [X0 - 0.42, 0.95, 2.8], [X0 - 0.85, 0.78, 0], 44],
    [TM.escudo2 - 0.38, [X0 - 0.4, 0.94, 2.65], [X0 - 0.83, 0.78, 0], 44],
    [TM.escudo2 + 0.05, [X0 + 0.45, 0.95, 2.8], [X0 + 0.86, 0.78, 0], 44],
    [TM.osReis - 0.3, [X0 + 0.45, 0.93, 2.5], [X0 + 0.86, 0.78, 0], 44],
    [TM.osReis + 0.25, [X0, 0.95, 3.6], [X0, 0.78, 0], 44],
    [TM.trilha + 0.2, [X0, 0.9, 2.5], [X0, 0.86, 0], 44],
    [TM.vermelho - 0.1, [X0 - 0.2, 0.98, 2.0], [X0 - 0.42, 0.94, 0.1], 44],
    [TM.verde - 0.4, [X0 - 0.24, 0.98, 1.85], [X0 - 0.44, 0.94, 0.1], 44],
    [TM.verde, [X0 + 0.2, 0.98, 2.0], [X0 + 0.38, 0.94, 0.1], 44],
    [TM.fura2 + 0.5, [X0 + 0.24, 0.98, 1.85], [X0 + 0.38, 0.94, 0.1], 44],
    [TM.pegou, [X0 - 0.5, 1.05, 4.0], [X0 - 0.5, 0.75, 0], 44],
    [TM.correu, [X0 - 1.25, 0.95, 3.1], [X0 - 1.15, 0.75, 0], 44],
    [TM.encostou - 0.55, [X0 - 0.6, 0.85, 2.3], [X0 - 0.5, 0.72, 0.1], 44],
    [TM.encostou + 0.3, [X0 - 0.12, 0.8, 1.3], [X0 - 0.03, 0.7, 0.28], 44],
    [TM.travou + 0.9, [X0 - 0.1, 0.78, 1.12], [X0 - 0.03, 0.7, 0.28], 40],
    [TM.porque + 0.2, [X0, 1.05, 2.7], [X0, 1.05, 0], 44],
    [TM.entao2 - 0.1, [X0, 1.05, 2.6], [X0, 1.05, 0], 44],
    [TM.entao2 + 0.5, [X0 + 0.3, 1.9, 6.2], [X0, 0.6, -0.5], 44],
    [TM.ficaram, [X0 + 0.25, 1.7, 5.6], [X0, 0.65, -0.4], 44],
  ]},
  // espera em cortes secos, um por batida: parados (lateral baixa), dia (geral alto), semana (barba), ano (ninho)
  {t0: TM.ficaram + 0.3, keys: [[TM.ficaram + 0.3, [X0 + 1.7, 0.55, 2.6], [X0 + 0.1, 0.82, 0], 42], [TM.dia - 0.1, [X0 + 1.35, 0.6, 2.2], [X0 + 0.05, 0.84, 0], 42]]},
  {t0: TM.dia - 0.1, keys: [[TM.dia - 0.1, [X0 + 0.3, 2.3, 7.0], [X0, 0.6, -0.5], 44], [TM.semana - 0.1, [X0 + 0.2, 2.0, 6.1], [X0, 0.62, -0.45], 44]]},
  {t0: TM.semana - 0.1, keys: [[TM.semana - 0.1, [X0 + 0.15, 1.05, 2.45], [X0 + 0.05, 0.95, 0], 44], [TM.ano - 0.1, [X0 + 0.13, 1.03, 2.05], [X0 + 0.07, 0.96, 0], 44]]},
  {t0: TM.ano - 0.1, keys: [[TM.ano - 0.1, [X0 - 0.28, 1.3, 1.45], [X0 - 0.38, 1.28, 0], 44], [TM.enquanto, [X0 - 0.3, 1.32, 1.15], [X0 - 0.38, 1.3, 0], 44]]},
  {t0: TM.enquanto - 0.05, keys: [
    [TM.enquanto - 0.05, [0.5, 4.2, 8.5], [0, 0.4, -0.8], 46],
    [TM.contava - 0.3, [-0.1, 1.25, 2.6], [-0.15, 0.85, -1.3], 46],
    [TM.pendurava - 0.2, [-0.05, 1.18, 2.3], [-0.12, 0.82, -1.3], 46],
    [TM.placa + 0.3, [0.3, 1.2, 2.2], [0.36, 1.05, -1.3], 46],
    [TM.soldado, [0.28, 1.18, 2.0], [0.34, 1.02, -1.3], 46],
  ]},
  {t0: TM.soldado - 0.05, keys: [
    [TM.soldado - 0.05, [-3.22, 1.12, 4.7], [-3.22, 0.9, -0.3], 46],
    [TM.cento + 1.2, [-3.2, 1.06, 4.2], [-3.2, 0.9, -0.3], 46],
    [70, [-3.18, 1.03, 4.0], [-3.18, 0.9, -0.3], 46],
  ]},
];
const camEm = (t) => {
  let pl = PLANOS[0]; for (const p of PLANOS) if (t >= p.t0) pl = p;
  const k = pl.keys; let i = 1; while (i < k.length - 1 && t > k[i][0]) i++;
  const [t0, p0, l0, f0] = k[i - 1], [t1, p1, l1, f1] = k[i];
  const u = io(Math.max(0, Math.min(1, (t - t0) / Math.max(1e-6, t1 - t0))));
  const pos = mix(p0, p1, u), look = mix(l0, l1, u);
  const d = Math.hypot(pos[0] - look[0], pos[1] - look[1], pos[2] - look[2]);
  const deriva = [Math.sin(t * 0.7) * 0.012 * d, Math.sin(t * 0.9 + 1) * 0.006 * d, 0];
  return {pos: [pos[0] + deriva[0], pos[1] + deriva[1], pos[2]], look, fov: lerp(f0, f1, u), d};
};
const segueCorrida = (t, c) => {
  const a = TM.pegou + 0.3, b = TM.encostou + 0.15;
  if (t < a - 0.3 || t > b + 0.3) return c;
  const D = duelo(t, 0); const look = [D.RV[0] + 0.2, 0.78, 0.1], pos = [D.RV[0] + 0.12, 1.0, 3.2];
  const w = Math.min(1, Math.max(0, (t - (a - 0.3)) / 0.3)) * Math.min(1, Math.max(0, ((b + 0.3) - t) / 0.3));
  return {...c, pos: mix(c.pos, pos, w), look: mix(c.look, look, w)};
};
const segueNinho = (t, c) => {
  if (t < TM.ano - 0.1 || t >= TM.enquanto - 0.05) return c;
  const D = duelo(t, 0), u = Math.min(1, (t - TM.ano + 0.1) / (TM.enquanto - TM.ano));
  return {...c, pos: [D.RV[0] + 0.15, lerp(1.5, 1.46, u), D.RV[2] + lerp(2.3, 1.95, u)], look: [D.RV[0], 1.12, D.RV[2]], fov: 44};
};
const Cam = ({c}) => { const {camera} = useThree(); camera.position.set(...c.pos); camera.fov = c.fov; camera.near = 0.12; camera.far = 700; camera.updateProjectionMatrix(); camera.lookAt(...c.look); return null; };

// ---------- céu e luz ----------
const CEU = new THREE.ShaderMaterial({side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: 'varying vec3 vp; void main(){ vp = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  uniforms: {noite: {value: 0}}, fragmentShader: 'uniform float noite; varying vec3 vp; void main(){ float h = clamp(vp.y*1.5+0.05,0.0,1.0); vec3 c = mix(vec3(0.86,0.93,0.98), vec3(0.24,0.52,0.9), pow(h,0.6)); vec3 n = mix(vec3(0.16,0.17,0.32), vec3(0.04,0.05,0.16), pow(h,0.6)); gl_FragColor = vec4(mix(c, n, noite),1.0); }'});
const Ceu = ({c, noite = 0}) => { CEU.uniforms.noite.value = noite; return <mesh position={c.pos} material={CEU} renderOrder={-1}><sphereGeometry args={[650, 32, 16]} /></mesh>; };
const Sol = ({alvo, area, luz: kLuz = 1}) => {
  // alvo e câmera de sombra atualizados ANTES do quadro ser desenhado (no corpo do render, não num efeito);
  // antes o alvo era ajustado depois do desenho e a sombra aparecia só em alguns quadros (pisca-pisca).
  const k = Math.max(1, area / 4);
  const tgt = React.useMemo(() => new THREE.Object3D(), []);
  const luz = React.useMemo(() => { const l = new THREE.DirectionalLight('#FFE2B4', 2.7); l.castShadow = true; l.shadow.mapSize.set(2048, 2048); l.shadow.bias = -0.0004; l.shadow.normalBias = 0.02; l.target = tgt; return l; }, [tgt]);
  tgt.position.set(...alvo); tgt.updateMatrixWorld(true);
  luz.position.set(alvo[0] - 8 * k, alvo[1] + 6.4 * k, alvo[2] + 5 * k); luz.updateMatrixWorld(true);
  const sc = luz.shadow.camera; sc.left = -area; sc.right = area; sc.top = area; sc.bottom = -area; sc.near = 0.5; sc.far = area * 8 + 40; sc.updateProjectionMatrix();
  luz.shadow.needsUpdate = true; luz.intensity = 2.5 * kLuz;
  return (
    <>
      <hemisphereLight args={['#9D86EC', '#9A82B4', 1.1 * (0.35 + 0.65 * kLuz)]} />
      <primitive object={tgt} />
      <primitive object={luz} />
      <directionalLight position={[alvo[0] + 6, alvo[1] + 4, alvo[2] - 7]} intensity={0.65} color="#FFE6C2" />
    </>
  );
};

// ---------- texturas pintadas ----------
let SEED = 1; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return SEED / 2147483647; };
const texLajota = () => canvasTex('laj2', 1024, 1024, (g, w) => {
  SEED = 7; g.fillStyle = '#C9AE82'; g.fillRect(0, 0, w, w);
  const n = 6, s = w / n;
  for (let j = 0; j < n; j++) for (let i = -1; i < n; i++) {
    const x = i * s + (j % 2) * s / 2, y = j * s; const v = rnd() * 18 - 9;
    g.fillStyle = `rgb(${226 + v},${206 + v},${164 + v})`; g.fillRect(x + 5, y + 5, s - 10, s - 10);
    g.fillStyle = 'rgba(150,120,80,0.25)'; for (let k = 0; k < 7; k++) { g.beginPath(); g.arc(x + 10 + rnd() * (s - 20), y + 10 + rnd() * (s - 20), 1.5 + rnd() * 3, 0, 7); g.fill(); }
    if (rnd() > 0.6) { g.strokeStyle = 'rgba(80,60,50,0.55)'; g.lineWidth = 3; g.beginPath(); let cx = x + s * (0.2 + rnd() * 0.3), cy = y + 8; g.moveTo(cx, cy); for (let k = 0; k < 4; k++) { cx += (rnd() - 0.4) * s * 0.25; cy += s * 0.2; g.lineTo(cx, cy); } g.stroke(); }
  }
  g.strokeStyle = 'rgba(70,52,46,0.85)'; g.lineWidth = 5;
  for (let j = 0; j <= n; j++) { g.beginPath(); g.moveTo(0, j * s); g.lineTo(w, j * s); g.stroke(); }
  for (let j = 0; j < n; j++) for (let i = -1; i <= n; i++) { const x = i * s + (j % 2) * s / 2; g.beginPath(); g.moveTo(x, j * s); g.lineTo(x, j * s + s); g.stroke(); }
}, [3, 1]);
const texPedra = (k, rep) => canvasTex('ped2' + k, 512, 512, (g, w) => {
  SEED = 11; g.fillStyle = '#9E9282'; g.fillRect(0, 0, w, w);
  const rows = 5, h = w / rows;
  for (let j = 0; j < rows; j++) { const o = (j % 2) * 55; for (let x = -110 + o; x < w; x += 115) { const v = rnd() * 20 - 10; g.fillStyle = `rgb(${190 + v},${178 + v},${158 + v})`; g.beginPath(); g.roundRect(x + 5, j * h + 5, 105, h - 10, 10); g.fill(); g.fillStyle = 'rgba(255,240,220,0.18)'; g.fillRect(x + 10, j * h + 9, 90, 6); } }
  g.strokeStyle = 'rgba(70,52,46,0.8)'; g.lineWidth = 5;
  for (let j = 0; j <= rows; j++) { g.beginPath(); g.moveTo(0, j * h); g.lineTo(w, j * h); g.stroke(); }
  for (let j = 0; j < rows; j++) { const o = (j % 2) * 55; for (let x = -110 + o; x < w; x += 115) { g.beginPath(); g.moveTo(x + 2, j * h); g.lineTo(x + 2, j * h + h); g.stroke(); } }
}, rep);
const texGrama = (k, rep, base = '#8FA552') => canvasTex('gr2' + k, 1024, 1024, (g, w) => {
  SEED = 23; g.fillStyle = base; g.fillRect(0, 0, w, w);
  for (let i = 0; i < 70; i++) { const c = ['rgba(120,150,70,0.5)', 'rgba(160,170,80,0.45)', 'rgba(100,130,60,0.45)', 'rgba(185,175,95,0.35)'][i % 4]; g.fillStyle = c; g.beginPath(); g.ellipse(rnd() * w, rnd() * w, 40 + rnd() * 120, 20 + rnd() * 60, rnd() * 3, 0, 7); g.fill(); }
  g.lineWidth = 3; for (let i = 0; i < 2200; i++) { const x = rnd() * w, y = rnd() * w; g.strokeStyle = rnd() > 0.5 ? 'rgba(80,110,50,0.5)' : 'rgba(190,200,120,0.45)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 6, y - 8 - rnd() * 8); g.stroke(); }
}, rep);
// chão longe: campos em retalho com o rio sinuoso pintado (encaixa no canal reto perto da ponte)
const RIO = (z) => Math.sin(z * 0.045) * 9 * Math.min(1, Math.max(0, (Math.abs(z) - 14) / 20));
const texLonge = () => canvasTex('longe2', 2048, 2048, (g, w) => {
  SEED = 5; const S = 400; const px = (x) => (x / S + 0.5) * w;
  const cores = ['#93A856', '#A7B160', '#C2B66A', '#7F9A4B', '#B0A85E', '#8EA14F'];
  for (let i = 0; i < 26; i++) for (let j = 0; j < 26; j++) { g.fillStyle = cores[Math.floor(rnd() * cores.length)]; g.fillRect(i * w / 26, j * w / 26, w / 26 + 1, w / 26 + 1); }
  g.strokeStyle = 'rgba(70,95,45,0.7)'; g.lineWidth = 5; for (let i = 0; i <= 26; i++) { g.beginPath(); g.moveTo(i * w / 26, 0); g.lineTo(i * w / 26, w); g.stroke(); g.beginPath(); g.moveTo(0, i * w / 26); g.lineTo(w, i * w / 26); g.stroke(); }
  g.strokeStyle = '#4C8FB0'; g.lineWidth = (5.6 / S) * w; g.lineCap = 'round'; g.beginPath();
  for (let z = -S / 2; z <= S / 2; z += 2) { const X = px(RIO(z)), Y = px(z); if (z === -S / 2) g.moveTo(X, Y); else g.lineTo(X, Y); } g.stroke();
  g.strokeStyle = 'rgba(160,215,235,0.5)'; g.lineWidth = (1.2 / S) * w; g.stroke();
});
const texPlaca = () => canvasTex('placa2', 1024, 560, (g, w, h) => {
  g.fillStyle = '#B37A43'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(90,50,20,0.4)'; g.lineWidth = 5; for (let y = 30; y < h; y += 46) { g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + 10, w * 0.6, y - 8, w, y + 5); g.stroke(); }
  g.fillStyle = '#C8352F'; g.fillRect(40, 60, w / 2 - 40, 150); g.fillStyle = '#1C9C98'; g.fillRect(w / 2, 60, w / 2 - 40, 150);
  g.fillStyle = '#FBF1DC'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 120px "DejaVu Serif"'; g.fillText('ANOS DE', w / 2, 140);
  g.fillStyle = '#2E1D12'; g.font = 'bold 170px "DejaVu Serif"'; g.fillText('GUERRA', w / 2, 360);
  g.strokeStyle = '#372C2E'; g.lineWidth = 16; g.strokeRect(8, 8, w - 16, h - 16);
});
const texDig = (d) => canvasTex('dg2' + d, 256, 340, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#FBF3E2'); gr.addColorStop(1, '#E2D3B5'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = '#231A14'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 250px "DejaVu Serif"'; g.fillText(String(d), w / 2, h / 2 + 10);
  g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
});
const texRiscos = () => canvasTex('risc2', 1024, 512, (g, w, h) => {
  g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(55,44,46,0.85)'; g.lineCap = 'round'; g.lineWidth = 8; SEED = 3;
  for (let y = 40; y < h - 70; y += 92) for (let x = 30 + (y % 3) * 10; x < w - 110; x += 112) {
    for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(x + i * 18, y + rnd() * 4); g.lineTo(x + i * 18 + 3, y + 58); g.stroke(); }
    g.beginPath(); g.moveTo(x - 8, y + 48); g.lineTo(x + 70, y + 10); g.stroke();
  }
});
const texBand = (tipo) => canvasTex('bd3' + tipo, 512, 360, (g, w, h) => {
  // tecido: degradê vertical (claro em cima, mais escuro embaixo) + dobras verticais suaves
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, tipo === 'v' ? '#D4483E' : '#25A7A1'); gr.addColorStop(1, tipo === 'v' ? '#A92F2A' : '#14807C');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 4; i++) { const x = w * (0.18 + i * 0.22); const d = g.createLinearGradient(x - 40, 0, x + 40, 0); d.addColorStop(0, 'rgba(0,0,0,0)'); d.addColorStop(0.5, i % 2 ? 'rgba(255,255,255,0.10)' : 'rgba(40,10,20,0.14)'); d.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = d; g.fillRect(x - 40, 0, 80, h); }
  g.fillStyle = tipo === 'v' ? 'rgba(120,25,25,0.55)' : 'rgba(10,80,78,0.55)'; g.fillRect(0, 0, 50, h);
  g.fillStyle = 'rgba(255,240,200,0.5)'; g.fillRect(56, 10, w - 70, 6); g.fillRect(56, h - 16, w - 70, 6);
  if (tipo === 'v') { g.fillStyle = '#FFD23F'; g.beginPath(); g.moveTo(w * 0.22, h * 0.5); g.lineTo(w * 0.52, h * 0.2); g.lineTo(w * 0.52, h * 0.38); g.lineTo(w * 0.8, h * 0.38); g.lineTo(w * 0.8, h * 0.62); g.lineTo(w * 0.52, h * 0.62); g.lineTo(w * 0.52, h * 0.8); g.closePath(); g.fill(); g.strokeStyle = '#372C2E'; g.lineWidth = 8; g.stroke(); }
  else { g.fillStyle = '#FBF1DC'; g.beginPath(); g.arc(w * 0.55, h / 2, h * 0.26, 0, 7); g.fill(); g.strokeStyle = '#372C2E'; g.lineWidth = 8; g.stroke(); }
});
const texEmblema = () => canvasTex('emb2', 1024, 1024, (g, w) => {
  const c = w / 2;
  g.fillStyle = '#C8352F'; g.beginPath(); g.arc(c, c, c - 40, Math.PI / 2, Math.PI * 1.5); g.fill();
  g.fillStyle = '#1C9C98'; g.beginPath(); g.arc(c, c, c - 40, -Math.PI / 2, Math.PI / 2); g.fill();
  g.strokeStyle = '#E6B84A'; g.lineWidth = 46; g.beginPath(); g.arc(c, c, c - 60, 0, 7); g.stroke();
  g.strokeStyle = '#372C2E'; g.lineWidth = 12; g.beginPath(); g.arc(c, c, c - 34, 0, 7); g.stroke(); g.beginPath(); g.arc(c, c, c - 86, 0, 7); g.stroke();
  g.fillStyle = '#E6B84A'; g.beginPath(); g.arc(c, c, 120, 0, 7); g.fill(); g.stroke();
  g.fillStyle = 'rgba(255,240,210,0.25)'; for (let i = 0; i < 300; i++) { g.beginPath(); g.arc(Math.random() * w, Math.random() * w, 2 + Math.random() * 3, 0, 7); g.fill(); }
});
const texMadeira = () => canvasTex('mad2', 512, 512, (g, w) => {
  g.fillStyle = '#A36A35'; g.fillRect(0, 0, w, w); SEED = 9;
  for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? 'rgba(120,70,30,0.35)' : 'rgba(190,130,70,0.25)'; g.fillRect(i * w / 8, 0, w / 8, w); }
  g.strokeStyle = 'rgba(80,45,20,0.5)'; g.lineWidth = 3; for (let i = 0; i < 40; i++) { const x = rnd() * w; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 10, w * 0.3, x - 10, w * 0.6, x + 4, w); g.stroke(); }
  g.strokeStyle = 'rgba(55,44,46,0.9)'; g.lineWidth = 6; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * w / 8, 0); g.lineTo(i * w / 8, w); g.stroke(); }
}, [1, 1]);
const texSaco = () => canvasTex('saco2', 256, 256, (g, w) => { g.fillStyle = '#E3CB97'; g.fillRect(0, 0, w, w); g.fillStyle = '#2E8B3A'; g.font = 'bold 150px "DejaVu Serif"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', w * 0.25, w / 2 + 8); });
const texEscudo = () => canvasTex('esc2', 512, 512, (g, w) => {
  const c = w / 2; g.fillStyle = '#9FA9B5'; g.fillRect(0, 0, w, w);
  for (let i = 0; i < 90; i++) { const a = i / 90 * Math.PI * 2; g.strokeStyle = i % 2 ? 'rgba(255,255,255,0.35)' : 'rgba(60,70,80,0.25)'; g.lineWidth = 5; g.beginPath(); g.moveTo(c, c); g.lineTo(c + Math.cos(a) * c, c + Math.sin(a) * c); g.stroke(); }
});
const lm = (k, tex, extra = {}) => MAT(k, () => new THREE.MeshToonMaterial({map: tex(), gradientMap: GRAD, ...extra}));

// ---------- cenário da ponte ----------
const geoFace = () => MAT('gface', () => {
  const s = new THREE.Shape(); s.moveTo(-6, -0.45); s.lineTo(-2.75, -0.45); s.lineTo(-2.75, -1.85); s.lineTo(2.75, -1.85); s.lineTo(2.75, -0.45); s.lineTo(6, -0.45); s.lineTo(6, 0); s.lineTo(-6, 0); s.closePath();
  [-1.38, 1.38].forEach((c) => { const r = 1.12; const h = new THREE.Path(); h.moveTo(c - r, -1.8); h.lineTo(c - r, -1.42); h.absarc(c, -1.42, r, Math.PI, 0, true); h.lineTo(c + r, -1.8); h.closePath(); s.holes.push(h); });
  const g = new THREE.ExtrudeGeometry(s, {depth: 0.3, bevelEnabled: false});
  const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.35, uv.getY(i) * 0.35);
  return g;
});
const Hera = ({p, n = 6, pend = 0.5, t = 0, s = 1}) => (
  <group position={p} scale={s}>
    {Array.from({length: n}).map((_, i) => {
      const x = (i - n / 2) * 0.16, L = pend * (0.5 + ((i * 37) % 10) / 10); const sw = Math.sin(t * 1.6 + i) * 0.02;
      return <group key={i}>
        <Linha a={[x, 0, 0]} b={[x + sw, -L, 0.02]} r={0.008} cor="#3F6E2C" />
        {[0.25, 0.5, 0.75, 1].map((f) => <Esf key={f} r={0.045 + (i % 3) * 0.01} p={[x + sw * f + (f * 13 % 2 ? 0.02 : -0.02), -L * f, 0.03]} s={[1, 0.8, 0.6]} m={i % 2 ? '#5E8F3A' : '#4C7C30'} line={0.5} seg={10} />)}
      </group>;
    })}
    {Array.from({length: n}).map((_, i) => <Esf key={'t' + i} r={0.09} p={[(i - n / 2) * 0.16, 0.03, 0]} s={[1.2, 0.7, 0.9]} m={i % 2 ? '#5E8F3A' : '#4C7C30'} line={0.6} seg={12} />)}
  </group>
);
const Salgueiro = ({p, s = 1, t = 0}) => (
  <group position={p} scale={s}>
    <Ci rt={0.16} rb={0.24} h={1.6} p={[0, 0.8, 0]} m={lm('tronco', texMadeira)} seg={10} />
    <Esf r={1.1} p={[0, 2.1, 0]} s={[1.2, 0.75, 1.2]} m="#7F9C45" />
    {Array.from({length: 10}).map((_, i) => { const a = i / 10 * Math.PI * 2; const sw = Math.sin(t * 1.2 + i) * 0.04; return <Tn key={i} geo={<coneGeometry args={[0.32, 1.5, 7]} />} p={[Math.cos(a) * 1.05 + sw, 1.35, Math.sin(a) * 1.05]} rot={[Math.PI, 0, sw]} m={i % 2 ? '#86A34A' : '#6F8E3C'} line={0.7} />; })}
  </group>
);
const Castelo = ({p, cor, s = 1}) => (
  <group position={p} scale={s}>
    <Esf r={9} p={[0, -6.5, 0]} s={[1.4, 0.9, 1.1]} m={T('#8DA155')} line={0} />
    <Cx a={[4, 3, 3]} p={[0, 1.5, 0]} m={lm('pedc', () => texPedra('c', [3, 2]))} line={0.6} sombra={false} />
    {[[-2, -1.5], [2, -1.5], [-2, 1.5], [2, 1.5]].map(([x, z], i) => <group key={i} position={[x, 0, z]}><Ci rt={0.7} h={4.6} p={[0, 2.3, 0]} m="#D8CCB8" line={0.6} sombra={false} /><Co r={0.9} h={1.8} p={[0, 5.5, 0]} m={cor} line={0.6} sombra={false} /></group>)}
    <Ci rt={0.9} h={6.5} p={[0, 3.25, 0]} m="#E0D5C3" line={0.6} sombra={false} /><Co r={1.15} h={2.4} p={[0, 7.7, 0]} m={cor} line={0.6} sombra={false} />
    <mesh position={[0.4, 9.6, 0]} material={T(cor, {side: THREE.DoubleSide})}><planeGeometry args={[0.9, 0.55]} /></mesh>
    {/* janelas, ameias e bandeirinhas nas torres */}
    {[[-2, -1.5], [2, -1.5], [-2, 1.5], [2, 1.5]].map(([x, z], i) => <group key={'j' + i} position={[x, 0, z]}>
      {[1.8, 3.3].map((y) => <mesh key={y} position={[0, y, 0.71]} material={B('#3A2C30')}><boxGeometry args={[0.28, 0.5, 0.02]} /></mesh>)}
      <Linha a={[0, 6.3, 0]} b={[0, 7.3, 0]} r={0.03} />
      <mesh position={[0.25, 7.1, 0]} material={T(cor, {side: THREE.DoubleSide})}><planeGeometry args={[0.5, 0.3]} /></mesh>
    </group>)}
    {[2.2, 3.6, 5.0].map((y) => <mesh key={'k' + y} position={[0, y, 0.91]} material={B('#3A2C30')}><boxGeometry args={[0.32, 0.55, 0.02]} /></mesh>)}
    {[-1.5, -0.5, 0.5, 1.5].map((x) => <Cx key={'a' + x} a={[0.5, 0.45, 0.5]} p={[x, 3.2, 1.3]} m={lm('pedc', () => texPedra('c', [3, 2]))} line={0.5} sombra={false} />)}
    <mesh position={[0, 1.0, 1.51]} material={B('#4A3322')}><circleGeometry args={[0.6, 16, 0, Math.PI]} /></mesh>
    <Linha a={[0, 8.8, 0]} b={[0, 10, 0]} r={0.04} />
  </group>
);
// fundo pintado em camadas (como o original): cilindros com pintura feita em canvas, sem traço e sem profundidade,
// para ler como cenário pintado e enevoado atrás do 3D. A pintura é periódica em x para não ter emenda.
const rndP = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const pinceladas = (g, w, h, n, cores, mascara) => {
  for (let i = 0; i < n; i++) { const x = rndP(i) * w, y = rndP(i + 0.5) * h; if (mascara && !mascara(x, y)) continue;
    g.fillStyle = cores[i % cores.length]; g.globalAlpha = 0.05 + rndP(i + 0.25) * 0.08;
    g.beginPath(); g.ellipse(x, y, 6 + rndP(i + 0.7) * 26, 2 + rndP(i + 0.9) * 6, (rndP(i + 0.3) - 0.5) * 0.6, 0, 7); g.fill(); }
  g.globalAlpha = 1;
};
const texFundoLonge = () => canvasTex('fundoLonge', 8192, 1024, (g, w, h) => {
  const TAU = Math.PI * 2;
  const alt = (x) => { const u = x / w * TAU; return h * (0.36 + 0.13 * Math.sin(u * 3 + 0.4) + 0.08 * Math.sin(u * 7 + 1.3) + 0.045 * Math.sin(u * 17 + 2.1) + 0.02 * Math.sin(u * 41)); };
  // cordilheira distante (lilás azulado, clareando para a base pela névoa)
  const gr = g.createLinearGradient(0, h * 0.15, 0, h); gr.addColorStop(0, '#9FA9C9'); gr.addColorStop(0.55, '#BCC3D6'); gr.addColorStop(1, '#E6E4DA');
  g.fillStyle = gr; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 2) g.lineTo(x, h - alt(x)); g.lineTo(w, h); g.closePath(); g.fill();
  // neve nos picos
  // neve nos picos: uma faixa contínua que acompanha o cume (sem colunas)
  g.fillStyle = '#F4F2EE'; g.globalAlpha = 0.9; g.beginPath();
  for (let x = 0; x <= w; x += 4) g.lineTo(x, h - alt(x));
  for (let x = w; x >= 0; x -= 4) { const a = alt(x); g.lineTo(x, h - a + Math.max(0, a - h * 0.47) * (0.6 + 0.15 * Math.sin(x / w * Math.PI * 2 * 23))); }
  g.closePath(); g.fill(); g.globalAlpha = 1;
  // face de sombra das encostas (lado direito de cada subida)
  // encostas na sombra: o lado que desce fica mais frio, em degradê suave (sem colunas)
  for (let x = 0; x <= w; x += 2) { const d = (alt(x) - alt(x + 6)) / 6; if (d > 0) { const a = alt(x);
    const gs = g.createLinearGradient(0, h - a, 0, h - a * 0.45); gs.addColorStop(0, 'rgba(120,130,170,' + Math.min(0.35, d * 0.6) + ')'); gs.addColorStop(1, 'rgba(120,130,170,0)');
    g.fillStyle = gs; g.fillRect(x, h - a, 2, a * 0.55); } }
  pinceladas(g, w, h, 18000, ['#FFFFFF', '#8E98BC', '#C9CFE0', '#E9E3D6'], (x, y) => y > h - alt(x) + 3);
  // segunda fileira, mais perto e mais escura
  const alt2 = (x) => { const u = x / w * TAU; return h * (0.2 + 0.06 * Math.sin(u * 5 + 2.2) + 0.04 * Math.sin(u * 11 + 0.7) + 0.015 * Math.sin(u * 29)); };
  const gr2 = g.createLinearGradient(0, h * 0.5, 0, h); gr2.addColorStop(0, '#8C9BB5'); gr2.addColorStop(1, '#D9DCD3');
  g.fillStyle = gr2; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 2) g.lineTo(x, h - alt2(x)); g.lineTo(w, h); g.closePath(); g.fill();
  pinceladas(g, w, h, 12000, ['#FFFFFF', '#7F8DAA', '#E5E1D4'], (x, y) => y > h - alt2(x) + 3);
});
const texFundoPerto = () => canvasTex('fundoPerto', 8192, 1024, (g, w, h) => {
  const TAU = Math.PI * 2;
  const alt = (x) => { const u = x / w * TAU; return h * (0.2 + 0.05 * Math.sin(u * 4 + 1.0) + 0.035 * Math.sin(u * 9 + 2.5) + 0.012 * Math.sin(u * 23)); };
  const gr = g.createLinearGradient(0, h * 0.6, 0, h); gr.addColorStop(0, '#93AA86'); gr.addColorStop(1, '#C8D1B4');
  g.fillStyle = gr; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 2) g.lineTo(x, h - alt(x)); g.lineTo(w, h); g.closePath(); g.fill();
  // castelinhos pintados no alto de alguns morros
  for (let k = 0; k < 12; k++) { const x = (k + 0.3 + rndP(k) * 0.4) / 12 * w, y = h - alt(x); const s = 26 + rndP(k + 3) * 14;
    g.fillStyle = '#B7AFA6'; g.fillRect(x - s, y - s * 1.1, s * 2, s * 1.2); g.fillRect(x - s * 1.25, y - s * 1.7, s * 0.55, s * 1.8); g.fillRect(x + s * 0.7, y - s * 1.7, s * 0.55, s * 1.8);
    g.fillStyle = k % 2 ? '#B9837A' : '#7FA3A1'; [[x - s * 0.98, s * 0.55], [x + s * 0.98, s * 0.55]].forEach(([cx, r]) => { g.beginPath(); g.moveTo(cx - r * 0.7, y - s * 1.7); g.lineTo(cx, y - s * 2.6); g.lineTo(cx + r * 0.7, y - s * 1.7); g.fill(); }); }
  // vale com plantações em retalhos (como o vale pintado do original)
  for (let i = 0; i < 520; i++) { const x = rndP(i * 7.3 + 1) * w, ya = h - alt(x); const y = ya + 14 + rndP(i * 2.9 + 2) * (h - ya - 30) * 0.8;
    const pw = 40 + rndP(i * 4.1) * 90, ph = 8 + rndP(i * 6.7) * 14 * (0.5 + (y - ya) / (h * 0.25)), sk = (rndP(i * 9.1) - 0.5) * 30;
    g.fillStyle = ['#B9C27F', '#A3B56E', '#CDBF86', '#93AE6C', '#C2C994'][i % 5]; g.globalAlpha = 0.85;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + pw, y + sk * 0.2); g.lineTo(x + pw + sk, y + ph); g.lineTo(x + sk, y + ph - sk * 0.2); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,250,230,0.35)'; g.lineWidth = 1.5; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(x + sk * k / 4, y + ph * k / 4); g.lineTo(x + pw + sk * k / 4, y + ph * k / 4 + sk * 0.05); g.stroke(); } }
  g.globalAlpha = 1;
  // copas de árvores em grupos, escuras embaixo e iluminadas em cima
  for (let i = 0; i < 1040; i++) { const x = rndP(i * 3.1) * w, ya = h - alt(x); const y = ya + 6 + rndP(i * 5.7) * (h - ya) * 0.55; const r = 9 + rndP(i * 1.9) * 16 * (0.6 + (y - ya) / (h * 0.3));
    g.fillStyle = '#6F8C66'; g.globalAlpha = 0.9; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    g.fillStyle = '#A9C08D'; g.globalAlpha = 0.6; g.beginPath(); g.arc(x - r * 0.25, y - r * 0.3, r * 0.55, 0, 7); g.fill(); }
  g.globalAlpha = 1;
  pinceladas(g, w, h, 18000, ['#FFFFFF', '#5F7B58', '#D8DCC4', '#B7C79A'], (x, y) => y > h - alt(x) + 3);
  // névoa quente na base
  const nv = g.createLinearGradient(0, h * 0.7, 0, h); nv.addColorStop(0, 'rgba(236,230,214,0)'); nv.addColorStop(1, 'rgba(236,230,214,0.85)');
  g.fillStyle = nv; g.fillRect(0, h * 0.7, w, h * 0.3);
});
const NOITE_FP = new THREE.Color('#3B4270'), BRANCO_FP = new THREE.Color('#FFFFFF');
const FundoPintado = ({c = [0, 0, 0], r = 95, noite = 0}) => (
  <group position={c}>
    {[[r * 1.35, 42, -6, 'fundoLonge', texFundoLonge, 2], [r, 30, -3, 'fundoPerto', texFundoPerto, 3]].map(([R, H, y0, k, tx, rep]) => {
      const m = MAT('fp' + k, () => { const t = tx().clone(); t.wrapS = THREE.RepeatWrapping; t.repeat.set(rep, 1); t.needsUpdate = true;
        return new THREE.MeshBasicMaterial({map: t, transparent: true, depthWrite: false, fog: false, side: THREE.BackSide}); });
      m.color.copy(BRANCO_FP).lerp(NOITE_FP, noite);
      return <mesh key={k} position={[0, y0 + H / 2, 0]} material={m} renderOrder={k === 'fundoLonge' ? -0.9 : -0.8}><cylinderGeometry args={[R, R, H, 96, 1, true]} /></mesh>;
    })}
  </group>
);
const Montanhas = ({c = [0, 0, 0], r0 = 110}) => (
  <group position={c}>
    {Array.from({length: 24}).map((_, i) => { const a = i / 24 * Math.PI * 2 + 0.13, r = r0 + (i * 37 % 35), h = 18 + (i * 53 % 20);
      return <group key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]}>{[[-0.7, 0.55], [0.75, 0.62]].map(([o, f], j) => <Tn key={'s' + j} geo={<coneGeometry args={[h * f * 0.9, h * f, 24]} />} p={[o * h, h * f / 2 - 1, (j - 0.5) * h * 0.4]} m={T(j ? '#B9C8E6' : '#A3B7DC', {fog: false})} line={0} sombra={false} />)}<Tn geo={<coneGeometry args={[h * 0.95, h, 28]} />} p={[0, h / 2 - 1, 0]} m={T(i % 2 ? '#9CB2D8' : '#AFC1E0', {fog: false})} line={0} sombra={false} /><Tn geo={<coneGeometry args={[h * 0.3, h * 0.32, 28]} />} p={[0, h * 0.84 - 1, 0]} m={T('#F6F6FA', {fog: false})} line={0} sombra={false} /></group>; })}
  </group>
);
// bandeira em rabo de andorinha (V), ondulando
const geoBand = (t, fase) => {
  const g = new THREE.PlaneGeometry(1.0, 0.62, 14, 6); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) + 0.5, y = p.getY(i);
    const corte = x > 0.78 ? (x - 0.78) / 0.22 * 0.31 * (1 - Math.abs(y) / 0.31) : 0; // entalhe em V
    const yy = y * (1 - (x > 0.78 && Math.abs(y) < corte ? 0 : 0));
    p.setXYZ(i, x - (x > 0.78 && Math.abs(y) < 0.31 ? Math.max(0, corte - 0) * 0.9 : 0), yy - x * 0.06, Math.sin(x * 5 - t * 4 + fase) * 0.07 * x);
  }
  g.computeVertexNormals(); return g;
};
const Bandeira = ({p, tipo, t, h = 2.6}) => (
  <group position={p}>
    <Ci rt={0.035} rb={0.045} h={h} p={[0, h / 2, 0]} m={lm('mastro', texMadeira)} seg={10} line={0.7} />
    <Esf r={0.07} p={[0, h + 0.06, 0]} m={OURO()} line={0.6} seg={14} />
    <mesh geometry={geoBand(t, p[0])} position={[0.04, h - 0.4, 0]} material={lm('band' + tipo, () => texBand(tipo), {side: THREE.DoubleSide})} castShadow />
  </group>
);
const Bigorna = ({p, tremor = 0}) => (
  <group position={[p[0] + tremor, p[1], p[2]]}>
    <Ci rt={0.24} rb={0.29} h={0.24} p={[0, 0.12, 0]} m={lm('toco', texMadeira)} seg={14} />
    <Tn geo={<boxGeometry args={[0.36, 0.08, 0.26]} />} p={[0, 0.28, 0]} m={FERRO()} />
    <Tn geo={<boxGeometry args={[0.2, 0.1, 0.17]} />} p={[0, 0.37, 0]} m={FERRO()} />
    <Tn geo={<boxGeometry args={[0.5, 0.15, 0.3]} />} p={[0.03, 0.495, 0]} m={FERRO()} />
    <Tn geo={<coneGeometry args={[0.075, 0.3, 14]} />} p={[-0.37, 0.535, 0]} rot={[0, 0, Math.PI / 2]} m={FERRO()} />
    <Tn geo={<boxGeometry args={[0.1, 0.06, 0.2]} />} p={[0.33, 0.54, 0]} m={FERRO()} />
    <mesh position={[-0.222, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} material={B('#151214')}><circleGeometry args={[0.03, 14]} /></mesh>
    <mesh position={[0.282, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} material={B('#151214')}><circleGeometry args={[0.03, 14]} /></mesh>
  </group>
);
const Barril = ({p, t}) => (
  <group position={p}>
    <Tn geo={<cylinderGeometry args={[0.22, 0.2, 0.55, 18]} />} p={[0, 0.275, 0]} m={lm('barril', texMadeira)} />
    {[0.08, 0.47].map((y) => <Ci key={y} rt={0.225} h={0.045} p={[0, y, 0]} m={FERRO()} seg={18} line={0.5} />)}
    {[0.08, 0.47].map((y) => [0, 1, 2, 3, 4, 5].map((i) => <mesh key={y + '' + i} position={[Math.sin(i) * 0.228, y, Math.cos(i) * 0.228]} material={B('#3a3a40')}><sphereGeometry args={[0.009, 6, 5]} /></mesh>))}
    {[[-0.07, 0.1, 0.05], [0.07, 0.16, -0.04], [0.0, 0.05, 0.09]].map(([x, a, z], i) => <Lanca key={i} grip={[x, 0.6, z]} dir={[a, 1, z]} comp={1.3} frente={0.7} borlaAng={Math.sin(t * 2 + i) * 0.1} />)}
  </group>
);
const Mesa = ({p}) => (
  <group position={p}>
    <Tn geo={<boxGeometry args={[0.8, 0.06, 0.45]} />} p={[0, 0.52, 0]} m={lm('mesa', texMadeira)} />
    {[[-0.34, -0.18], [0.34, -0.18], [-0.34, 0.18], [0.34, 0.18]].map(([x, z], i) => <Ci key={i} rt={0.025} h={0.5} p={[x, 0.25, z]} m="#7A4B24" seg={8} line={0.6} />)}
    {[[-0.22, 0.02, 4], [-0.1, -0.08, 6], [0.05, 0.06, 3], [0.2, -0.05, 5]].map(([x, z, n], i) => <group key={i} position={[x, 0.55, z]}>{Array.from({length: n}).map((_, k) => <Ci key={k} rt={0.032} h={0.012} p={[(k % 2) * 0.003, k * 0.013 + 0.006, 0]} m={OURO()} seg={14} line={0.4} />)}</group>)}
    {[[0.3, 0.12], [-0.3, 0.1], [0.12, 0.15]].map(([x, z], i) => <Ci key={'s' + i} rt={0.032} h={0.012} p={[x, 0.556, z]} rot={[0.05, 0, 0.1]} m={OURO()} seg={14} line={0.4} />)}
  </group>
);
const Suporte = ({p}) => (
  <group position={p}>
    {[-0.35, 0.35].map((x) => <Ci key={x} rt={0.03} h={1.0} p={[x, 0.5, 0]} m="#7A4B24" seg={8} line={0.6} />)}
    <Cx a={[0.8, 0.05, 0.08]} p={[0, 0.85, 0]} m="#8A5A2B" line={0.6} />
    <Cx a={[0.8, 0.05, 0.08]} p={[0, 0.25, 0]} m="#8A5A2B" line={0.6} />
    {[-0.24, -0.08, 0.08, 0.24].map((x, i) => <Lanca key={i} grip={[x, 0.35, 0.05]} dir={[0, 1, 0.08]} comp={1.35} frente={1.0} />)}
  </group>
);
const Forja = ({p, t}) => (
  <group position={p}>
    <Cx a={[0.9, 0.8, 0.7]} p={[0, 0.4, 0]} m={lm('forja', () => texPedra('f', [1.5, 1.2]))} />
    <mesh position={[0, 0.36, 0.351]} material={B('#FF8A2A')}><circleGeometry args={[0.2 + Math.sin(t * 6) * 0.006, 20, 0, Math.PI]} /></mesh>
    <mesh position={[0, 0.36, 0.352]} material={B('#FFD15A')}><circleGeometry args={[0.11, 16, 0, Math.PI]} /></mesh>
    <Ci rt={0.16} rb={0.21} h={1.0} p={[0.15, 1.3, -0.1]} m={lm('cham', () => texPedra('ch', [1, 1]))} seg={12} />
  </group>
);
const Saco = ({p, s = 1}) => (
  <group position={p} scale={s}>
    <Tn geo={<sphereGeometry args={[0.1, 18, 14]} />} m={lm('saco', texSaco)} s={[1, 0.92, 1]} rot={[0, -0.5, 0]} />
    <Co r={0.045} h={0.06} p={[0, 0.1, 0]} m="#D9BE86" seg={10} />
    <Ci rt={0.05} h={0.018} p={[0, 0.08, 0]} m="#7A4B24" seg={10} line={0.5} />
  </group>
);
const Escudo = ({p, normal}) => {
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...normal).normalize());
  return (
    <group position={p} quaternion={q}>
      <Ci rt={0.27} h={0.035} m={OURO()} seg={36} />
      <Ci rt={0.235} h={0.045} p={[0, 0.004, 0]} m="#1C9C98" seg={36} line={0.5} />
      <Tn geo={<cylinderGeometry args={[0.15, 0.15, 0.05, 36]} />} p={[0, 0.008, 0]} m={MAT('escmet', () => new THREE.MeshMatcapMaterial({matcap: PRATA().matcap, map: texEscudo()}))} line={0.5} />
      <Esf r={0.05} p={[0, 0.035, 0]} s={[1, 0.55, 1]} m={PRATA()} line={0.5} seg={16} />
      {Array.from({length: 8}).map((_, i) => { const a = i / 8 * Math.PI * 2; return <Esf key={i} r={0.012} p={[Math.cos(a) * 0.205, 0.03, Math.sin(a) * 0.205]} m={PRATA()} line={0.3} seg={8} />; })}
    </group>
  );
};
const Contador = ({p, t}) => {
  const est = t < TM.cento - 0.3 ? {de: [0, 9, 9], para: [1, 0, 0], t0: TM.cem - 0.28} : {de: [1, 0, 0], para: [1, 0, 1], t0: TM.cento - 0.05};
  const {de, para} = est;
  return (
    <group position={p}>
      <Cx a={[0.86, 0.38, 0.07]} m="#5B3A1E" />
      {[0, 1, 2].map((i) => {
        const t0 = est.t0 + (2 - i) * 0.07; const u = de[i] === para[i] ? 0 : Math.max(0, Math.min(1, (t - t0) / 0.22));
        const ang = back(u) * Math.PI; const mostra = u < 0.5 ? de[i] : para[i];
        return <group key={i} position={[(i - 1) * 0.27, 0, 0.045]}><mesh rotation={[ang > Math.PI / 2 ? ang - Math.PI : ang, 0, 0]} material={lm('d' + mostra, () => texDig(mostra))}><planeGeometry args={[0.23, 0.3]} /></mesh></group>;
      })}
    </group>
  );
};
const Tumulo = ({p, flor, r = 0}) => (
  <group position={p} rotation={[0, r, 0]}>
    <Esf r={0.2} p={[0, -0.08, 0]} s={[1.2, 0.5, 0.9]} m="#8B7A5A" line={0.6} />
    <group position={[0, 0.06, 0]} rotation={[0.25, 0, 0.35]}><Tn geo={<sphereGeometry args={[0.12, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />} m={FERRO()} /><Ci rt={0.125} h={0.02} m={FERRO()} seg={18} line={0.4} /></group>
    <Linha a={[0.02, 0.12, 0]} b={[0.03, 0.36, 0.02]} r={0.007} cor="#3E7A2E" />
    {[0, 1, 2, 3, 4].map((i) => { const a = i * Math.PI * 2 / 5; return <Esf key={i} r={0.03} p={[0.03 + Math.cos(a) * 0.035, 0.38, 0.02 + Math.sin(a) * 0.035]} m={flor} line={0.35} seg={10} />; })}
    <Esf r={0.022} p={[0.03, 0.385, 0.02]} m="#FFD23F" line={0.35} seg={10} />
  </group>
);
const Patos = ({t}) => {
  const z0 = 2.6 + t * 0.1;
  const um = (x, z, s, cor, i) => (
    <group key={i} position={[x, -1.7 + Math.sin(t * 3 + i) * 0.012, z]} rotation={[0, Math.sin(t * 1.3 + i) * 0.2, 0]} scale={s}>
      <Esf r={1} s={[0.15, 0.11, 0.22]} p={[0, 0.06, 0]} m={cor} line={0.6} />
      <Esf r={0.09} p={[0, 0.19, 0.13]} m={cor} line={0.6} />
      <Co r={0.035} h={0.08} p={[0, 0.18, 0.23]} rot={[Math.PI / 2, 0, 0]} m="#FF9A2E" seg={8} line={0.5} />
      {[-1, 1].map((l) => <mesh key={l} position={[l * 0.045, 0.22, 0.2]} material={B(LINHA)}><sphereGeometry args={[0.012, 8, 6]} /></mesh>)}
    </group>
  );
  return <group>{um(0.9, z0, 2.4, '#FFFFFF', 0)}{[1, 2, 3].map((i) => um(0.9 + (i % 2 ? 0.22 : -0.18), z0 - i * 0.62, 1.25, '#FFD84A', i))}</group>;
};

// soldados em InstancedMesh (corpo, cabeça, elmo, lança), com contorno
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _v = new THREE.Vector3();
const GS = {};
const gsCorpo = () => GS.c ||= new THREE.LatheGeometry(Array.from({length: 21}, (_, i) => { const v = i / 20; return new THREE.Vector2(Math.pow(Math.sin(Math.PI * v), 0.7) * (0.19 - 0.075 * v) * 0.8, 0.5 * (1 - Math.cos(Math.PI * v)) / 2); }), 14);
const gsCab = () => GS.h ||= new THREE.SphereGeometry(0.13, 14, 10);
const gsElmo = () => GS.e ||= new THREE.SphereGeometry(0.14, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2);
const gsLanca = () => GS.l ||= new THREE.CylinderGeometry(0.01, 0.01, 1.1, 5);
// rosto de cada soldado: 2 olhos, 2 sobrancelhas (bravas, preocupadas ou neutras, variando), boca (reta ou gritando)
const gsOlho = () => GS.o ||= new THREE.SphereGeometry(0.022, 8, 6);
const gsSob = () => GS.s ||= new THREE.BoxGeometry(0.06, 0.014, 0.012);
const gsBoca = () => GS.b ||= new THREE.CircleGeometry(0.03, 12);
const _e = new THREE.Euler();
const RostosSoldados = ({pos, S}) => {
  const ro = React.useRef(), rs = React.useRef(), rb = React.useRef(); const n = pos.length;
  React.useLayoutEffect(() => {
    pos.forEach((p, i) => {
      const h = (Math.sin(i * 12.9898) * 43758.5453) % 1, tipo = Math.abs(h) < 0.6 ? 0 : Math.abs(h) < 0.85 ? 1 : 2;
      const y = p[1] + 0.68 * S, z = p[2] + 0.118 * S;
      [-1, 1].forEach((l, k) => {
        _q.identity(); _s.set(S, S, S); _m.compose(_v.set(p[0] + l * 0.046 * S, y + 0.012 * S, z), _q, _s); ro.current.setMatrixAt(i * 2 + k, _m);
        const ang = tipo === 0 ? l * 0.45 : tipo === 1 ? -l * 0.35 : 0; _q.setFromEuler(_e.set(0, 0, ang));
        _m.compose(_v.set(p[0] + l * 0.048 * S, y + 0.058 * S, z - 0.004 * S), _q, _s); rs.current.setMatrixAt(i * 2 + k, _m);
      });
      _q.identity(); _s.set(S * (tipo === 2 ? 0.8 : 1.2), S * (tipo === 2 ? 1.1 : 0.22), S);
      _m.compose(_v.set(p[0], y - 0.05 * S, z - 0.01 * S), _q, _s); rb.current.setMatrixAt(i, _m);
    });
    [ro, rs, rb].forEach((x) => { x.current.instanceMatrix.needsUpdate = true; });
  });
  return (
    <>
      <instancedMesh frustumCulled={false} ref={ro} args={[gsOlho(), B('#2A1E1E'), n * 2]} />
      <instancedMesh frustumCulled={false} ref={rs} args={[gsSob(), B('#2A1E1E'), n * 2]} />
      <instancedMesh frustumCulled={false} ref={rb} args={[gsBoca(), B('#4A2224'), n]} />
    </>
  );
};
// instâncias genéricas: lista de [x, y, z, escala, rotY]
const Inst = ({lista, geo, mat, sombra = false}) => {
  const r = React.useRef();
  React.useLayoutEffect(() => { lista.forEach(([x, y, z, k, a = 0], i) => { _q.setFromEuler(_e.set(0, a, 0)); _s.set(k, k, k); _m.compose(_v.set(x, y, z), _q, _s); r.current.setMatrixAt(i, _m); }); r.current.instanceMatrix.needsUpdate = true; });
  return <instancedMesh frustumCulled={false} ref={r} args={[geo, mat, lista.length]} castShadow={sombra} />;
};
const sorteio = (seed, n, f) => { let a = seed; const r = () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; const o = []; for (let i = 0; i < n; i++) { const v = f(r); if (v) o.push(v); } return o; };
// arvorezinhas redondas espalhadas pelas colinas do fundo
const ARV = sorteio(9, 260, (r) => { const x = (r() - 0.5) * 90, z = -30 - r() * 30; if (Math.abs(x) < 6) return null; return [x, 0, z, 0.8 + r() * 0.9, r() * 6]; });
const geoCopa = () => GS.copa ||= new THREE.SphereGeometry(1, 12, 8);
const geoTronco = () => GS.tr ||= new THREE.CylinderGeometry(0.12, 0.16, 1.2, 6).translate(0, 0.6, 0);
const Arvoredo = ({lista}) => (
  <>
    <Inst lista={lista} geo={geoTronco()} mat={T('#7A5233')} />
    <Inst lista={lista.map(([x, y, z, k, a]) => [x, y + 1.6 * k, z, k, a])} geo={geoCopa()} mat={T('#6E9A3E')} />
    <Inst lista={lista.map(([x, y, z, k, a]) => [x, y + 1.6 * k, z, k * 1.06, a])} geo={geoCopa()} mat={HULL(1)} />
  </>
);
// capim e flores do campo (milhares)
const TUFOS = sorteio(21, 2600, (r) => { const x = (r() - 0.5) * 14, z = 7 - r() * 22; if (Math.abs(x) < 0.6) return null; return [X0 + x, 0, z, (0.45 + r() * 0.5) * (z > 3 ? 0.6 : 1), r() * 6]; });
const FLORES = sorteio(33, 500, (r) => { const x = (r() - 0.5) * 12, z = 6.5 - r() * 16; if (Math.abs(x) < 0.7) return null; return [X0 + x, 0.16 + r() * 0.08, z, 0.8 + r() * 0.5, 0]; });
const geoTufo = () => GS.tufo ||= (() => { const g = []; for (let k = 0; k < 4; k++) { const c = new THREE.ConeGeometry(0.018, 0.2, 4).translate(0, 0.1, 0); c.rotateZ((k - 1.5) * 0.25); c.translate((k - 1.5) * 0.02, 0, 0); g.push(c); } return mergeGeos(g); })();
const geoFlor = () => GS.flor ||= new THREE.SphereGeometry(0.035, 8, 6);
const mergeGeos = (gs) => { const pos = []; const idx = []; let off = 0; gs.forEach((g) => { const gi = g.index ? g : g; const p = gi.attributes.position.array; for (let i = 0; i < p.length; i++) pos.push(p[i]); const ix = gi.index ? gi.index.array : [...Array(p.length / 3).keys()]; for (const v of ix) idx.push(v + off); off += p.length / 3; }); const m = new THREE.BufferGeometry(); m.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); m.setIndex(idx); m.computeVertexNormals(); return m; };
const Capinzal = ({g = 1}) => (
  <>
    <Inst lista={g === 1 ? TUFOS : TUFOS.map(([x, y, z, k, a]) => [x, y, z, k * g, a])} geo={geoTufo()} mat={T('#6F9440')} />
    <Inst lista={FLORES.filter((_, i) => i % 3 === 0)} geo={geoFlor()} mat={T('#F25A5A')} />
    <Inst lista={FLORES.filter((_, i) => i % 3 === 1)} geo={geoFlor()} mat={T('#FFFFFF')} />
    <Inst lista={FLORES.filter((_, i) => i % 3 === 2)} geo={geoFlor()} mat={T('#F7CF3B')} />
  </>
);
const Exercito = ({pos, cor, s: S = 1}) => {
  const r = [React.useRef(), React.useRef(), React.useRef(), React.useRef(), React.useRef(), React.useRef()];
  const n = pos.length;
  React.useLayoutEffect(() => {
    _q.identity();
    pos.forEach((p, i) => {
      _s.set(S, S, S);
      _m.compose(_v.set(p[0], p[1] + 0.25 * S, p[2]), _q, _s); r[0].current.setMatrixAt(i, _m); r[1].current.setMatrixAt(i, _m);
      _m.compose(_v.set(p[0], p[1] + 0.68 * S, p[2]), _q, _s); r[2].current.setMatrixAt(i, _m); r[3].current.setMatrixAt(i, _m);
      _m.compose(_v.set(p[0], p[1] + 0.71 * S, p[2]), _q, _s); r[4].current.setMatrixAt(i, _m);
      _m.compose(_v.set(p[0] + 0.17 * S, p[1] + 0.75 * S, p[2] + 0.04 * S), _q, _s); r[5].current.setMatrixAt(i, _m);
    });
    r.forEach((x) => { x.current.instanceMatrix.needsUpdate = true; });
  });
  return (
    <>
      <instancedMesh frustumCulled={false} ref={r[0]} args={[gsCorpo(), T(cor), n]} castShadow />
      <instancedMesh frustumCulled={false} ref={r[1]} args={[gsCorpo(), HULL(1), n]} />
      <instancedMesh frustumCulled={false} ref={r[2]} args={[gsCab(), T('#FFFFFF'), n]} castShadow />
      <instancedMesh frustumCulled={false} ref={r[3]} args={[gsCab(), HULL(1), n]} />
      <instancedMesh frustumCulled={false} ref={r[4]} args={[gsElmo(), FERRO(), n]} />
      <instancedMesh frustumCulled={false} ref={r[5]} args={[gsLanca(), B('#6B4A2A'), n]} />
      <RostosSoldados pos={pos} S={S} />
    </>
  );
};
const bloco = (cx, cz, nx, nz, esp = 0.62) => { const o = []; for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) o.push([cx + (i - (nx - 1) / 2) * esp, 0, cz + (j - (nz - 1) / 2) * esp]); return o; };
const EXV = [...bloco(-8.5, -14, 22, 16, 0.36), ...bloco(-17.5, -14, 20, 16, 0.36), ...bloco(-12, -23, 30, 16, 0.36)];
const EXA = [...bloco(8.5, -14, 22, 16, 0.36), ...bloco(17.5, -14, 20, 16, 0.36), ...bloco(12, -23, 30, 16, 0.36)];

// ---------- personagens no tabuleiro ----------
const ANV = [-0.36, 0, 0.32];
const FERR = [0.27, 0, -0.12];
const REI_A = [0.98, 0, 0.16];
const ESC = [0.7, 0.6, 0.36]; const ESC_N = [-0.86, 0, 0.5];

const reiV = (t) => {
  const x = kf(t, [[0, -0.97], [TM.furava - 0.1, -0.97], [TM.qualquer - 0.13, -1.03], [TM.qualquer, -0.8, inQ], [TM.qualquer + 0.12, -0.78], [TM.rei - 0.05, -0.8], [TM.rei + 0.35, -0.97]]);
  const pos = [x, 0, 0.16];
  const ry = kf(t, [[0, 0.32], [TM.pior - 0.05, 0.32], [TM.pior + 0.22, 0.78, back]]);
  // ponta da lança: atravessa a bigorna e sai 0,14 do outro lado
  const pontaX = kf(t, [[TM.furava + 0.25, -1.0], [TM.qualquer - 0.13, -1.06], [TM.qualquer, 0.1, inQ], [TM.qualquer + 0.07, 0.15], [TM.qualquer + 0.2, 0.09]]);
  let grip, dir, frente;
  const vert = {grip: [x + 0.23, 0.46, 0.25], dir: [0, 1, 0], fr: 0.95};
  const hor = {dir: [1, 0, 0.0], fr: 0.5};
  if (t < TM.furava - 0.12 || (t > TM.rei + 0.3 && t < TM.pior - 0.05)) { grip = vert.grip; dir = vert.dir; frente = vert.fr; }
  else if (t < TM.furava + 0.25) { const u = io(fx(t, TM.furava - 0.12, 0.37)); dir = mix([0, 1, 0], [1, 0, 0], u); frente = lerp(0.95, 0.5, u); grip = mix(vert.grip, [-1.0 - 0.5, 0.5, ANV[2]], u); }
  else if (t < TM.rei - 0.1) { dir = hor.dir; frente = hor.fr; grip = [pontaX - 0.5, 0.5, ANV[2]]; }
  else if (t <= TM.rei + 0.3) { const u = io(fx(t, TM.rei - 0.1, 0.4)); dir = mix([1, 0, 0], [0, 1, 0], u); frente = lerp(0.5, 0.95, u); grip = mix([-0.55, 0.5, ANV[2]], vert.grip, u); }
  else { const u = back(Math.min(1, fx(t, TM.pior - 0.05, 0.3))); dir = mix([0, 1, 0], [1, 0.38, 0.12], u); frente = lerp(0.95, 0.62, u); grip = mix(vert.grip, [x + 0.25, 0.62, 0.3], u); }
  const bravo = t > TM.pior + 0.05;
  const estoca = t > TM.qualquer - 0.02 && t < TM.rei;
  const c = {cor: '#D9473A', capa: '#9E2A22', resp: t * 3.0,
    ...expr(t, [
      [0, {olhos: 'semi', boca: 'canto', assim: 0.024, sob: 0.1, olhar: [0.1, 0], vivo: 0.5}],
      [W_('vendeu'), {olhos: 'feliz', boca: 'sorriso', sob: -0.2, assim: 0.015, olhar: [0, 0]}],
      [TM.lanca, {olhos: 'normal', boca: 'sorrisoD', sob: -0.5, altSob: 0.006, olhar: [0.3, 0.55], vivo: 0.2}],
      [TM.furava - 0.12, {olhos: 'semi', palp: 0.64, boca: 'canto', sob: 0.6, assim: 0.012, olhar: [0.75, -0.35], vivo: 0.08}],
      [TM.qualquer - 0.03, {olhos: 'normal', boca: 'sorrisoD', abre: 0.35, sob: -0.7, pop: 0.25, olhar: [0.6, -0.2], vivo: 0.1, semPisca: true}],
      [TM.coisa, {olhos: 'feliz', boca: 'sorrisoD', abre: 0.2, bochecha: 0.8, sob: -0.4, olhar: [0, 0]}],
      [TM.rei, {olhos: 'semi', boca: 'canto', assim: 0.024, sob: 0.1, olhar: [0.2, 0], vivo: 0.4}],
      [TM.escudo - 0.15, {olhos: 'normal', boca: 'reta', sob: 0.35, assim: -0.015, olhar: [0.8, 0], vivo: 0.2}],
      [TM.nada + 0.05, {olhos: 'semi', palp: 0.55, boca: 'reta', sob: 0.7, olhar: [0.85, 0], vivo: 0.1}],
      [TM.pior + 0.05, {olhos: 'bravo', boca: 'brava', sob: 1.15, trem: 0.35, pop: 0.2, olhar: [0.8, 0], vivo: 0.25}],
    ], 0.3),
    inc: kf(t, [[TM.furava - 0.15, 0], [TM.qualquer - 0.12, -0.08], [TM.qualquer, 0.2, inQ], [TM.qualquer + 0.3, 0.14], [TM.coisa, -0.1, back], [TM.rei, 0.02], [TM.pior, 0], [TM.pior + 0.2, 0.1, back]]),
    lat: kf(t, [[TM.coisa - 0.05, 0], [TM.coisa + 0.1, 0.1, back], [TM.rei, 0]]),
    cab: [kf(t, [[TM.furava - 0.2, 0], [TM.furava, 0.12], [TM.qualquer, -0.05, back], [TM.rei, 0]]), bravo ? 0.15 : kf(t, [[0, -0.1], [TM.qualquer, 0.25], [TM.rei + 0.3, 0.05]]), kf(t, [[0, 0.06], [W_('vendeu'), -0.12, back], [TM.lanca, 0.02], [TM.coisa, -0.15, back], [TM.rei, 0.1, back], [TM.escudo, 0.03], [TM.pior, -0.06]])],
    capaAng: 0.05 * Math.sin(t * 2.2) + settle(t, TM.qualquer, 0.25, 12, 4) + settle(t, TM.pior, 0.12),
    mP: grip, mN: t > TM.furava && t < TM.rei + 0.2 ? [grip[0] - 0.32, grip[1] - 0.02, grip[2] - 0.05] : null,
    cabeca: <><CoroaOuro /><Cavanhaque /></>};
  return {pos, ry, c, grip, dir, frente};
};
const ferreiro = (t) => {
  const ry = kf(t, [[0, -0.05], [TM.rei + 0.35, -0.05], [TM.rei + 0.6, 0.5, back], [TM.pior - 0.15, 0.5], [TM.pior + 0.1, 0, back]]);
  const pulo = kf(t, [[TM.coisa - 0.08, 0], [TM.coisa + 0.02, 0.07, outQ], [TM.coisa + 0.2, 0, inQ]]) + kf(t, [[TM.furava2 + 0.05, 0], [TM.furava2 + 0.13, 0.05, outQ], [TM.furava2 + 0.3, 0, inQ]]);
  const pos = [FERR[0] + kf(t, [[TM.coisa - 0.08, 0], [TM.coisa + 0.1, 0.06]]), pulo, FERR[2]];
  const susto1 = t > TM.coisa - 0.06 && t < TM.rei - 0.15;
  const vende = t > TM.rei - 0.15 && t < TM.rei + 0.35;
  const testa = t > TM.rei + 0.45 && t < TM.pior - 0.12;
  const susto2 = t > TM.furava2 + 0.06 && t < TM.pior + 2;
  const estica = kf(t, [[TM.coisa - 0.08, 0], [TM.coisa + 0.02, 0.9, outQ], [TM.coisa + 0.25, -0.2], [TM.coisa + 0.45, 0]]) + kf(t, [[TM.furava2 + 0.05, 0], [TM.furava2 + 0.15, 0.7, outQ], [TM.furava2 + 0.4, 0]]);
  // mãos
  let mP = null, mN = null, lanca = null, sacos = 'mao';
  const levanta = kf(t, [[TM.rei - 0.15, 0], [TM.rei, 1, back], [TM.rei + 0.3, 0.2]]);
  if (!testa && t < TM.pior - 0.12) {
    mP = maoRepouso(pos, ry, 1, 0.1 + levanta * 0.05, 0.12, 0.47 + levanta * 0.38);
    mN = maoRepouso(pos, ry, -1, 0.1 + levanta * 0.05, 0.12, 0.47 + levanta * 0.38);
    if (susto1) { mP = maoRepouso(pos, ry, 1, 0.16, 0.1, 0.62); mN = maoRepouso(pos, ry, -1, 0.16, 0.1, 0.62); }
  }
  if (t > TM.rei + 0.35) sacos = 'mesa';
  if (testa) {
    // mira o escudo: direção fixa, empurra em 2 quadros, depois continua empurrando enquanto a ponta entorta
    const imp = [ESC[0] - 0.07, ESC[1], ESC[2] - 0.02];
    const d = [1, 0, 0.12]; const L = Math.hypot(...d); const dir = d.map((v) => v / L);
    const fr = 0.45;
    const recuo = kf(t, [[TM.rei + 0.45, 0.3], [TM.nada - 0.14, 0.12], [TM.nada - 0.07, 0.17], [TM.nada, 0, inQ], [TM.furava2 + 0.2, -0.07]]);
    const grip = [imp[0] - dir[0] * (fr + recuo), imp[1] - dir[1] * (fr + recuo), imp[2] - dir[2] * (fr + recuo)];
    const dobra = kf(t, [[TM.furava2 - 0.12, 0], [TM.furava2 + 0.06, 1.15, back]]);
    lanca = {grip, dir, fr, dobra};
    mP = grip; mN = [grip[0] - dir[0] * 0.28, grip[1] - dir[1] * 0.28 - 0.01, grip[2] - dir[2] * 0.28];
  }
  if (t >= TM.pior - 0.12) { mP = maoRepouso(pos, ry, 1, 0.02, 0.17, 0.66); mN = maoRepouso(pos, ry, -1, 0.02, 0.17, 0.66); }
  const c = {cor: '#7F8C99', resp: t * 3.2 + 1, estica, roupa: <Avental />, cabeca: <BigodeGuidao />,
    ...expr(t, [
      [0, {olhos: 'feliz', boca: 'sorriso', olhar: [0, 0], vivo: 0.4}],
      [W_('vendeu'), {olhos: 'normal', boca: 'canto', assim: 0.022, sob: 0.15, olhar: [-0.7, 0], vivo: 0.3}],
      [TM.lanca, {olhos: 'normal', boca: 'O', abre: -0.5, sob: -0.5, altSob: 0.008, olhar: [-0.6, 0.45], vivo: 0.2}],
      [TM.furava, {olhos: 'semi', boca: 'canto', ladoBoca: -1, sob: 0.35, assim: -0.02, olhar: [0.1, 0], vivo: 0.3}],
      [TM.coisa - 0.05, {olhos: 'grande', boca: 'grito', sob: -1, altSob: 0.014, trem: 1, pop: 0.38, abre: 0.3, olhar: [-0.7, -0.2], vivo: 0.2, semPisca: true}],
      [W_('pra'), {olhos: 'grande', boca: 'nervoso', sob: -0.9, altSob: 0.01, trem: 0.7, olhar: [-0.8, -0.1], vivo: 0.3, semPisca: true}],
      [TM.rei - 0.08, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 1, sob: -0.3, pop: 0.15, olhar: [0, 0], vivo: 0.3}],
      [TM.rei + 0.4, {olhos: 'semi', palp: 0.5, boca: 'reta', sob: 0.6, olhar: [0.75, 0], vivo: 0.12}],
      [TM.escudo, {olhos: 'semi', palp: 0.58, boca: 'canto', sob: 0.75, assim: 0.02, olhar: [0.8, -0.05], vivo: 0.1}],
      [TM.nada, {olhos: 'grande', boca: 'O', abre: 0.1, sob: -0.6, pop: 0.25, olhar: [0.7, 0], vivo: 0.2, semPisca: true}],
      [TM.furava2 + 0.04, {olhos: 'grande', boca: 'O', abre: 0.45, sob: -1, altSob: 0.014, trem: 1, pop: 0.32, olhar: [0.6, -0.1], vivo: 0.2, semPisca: true}],
      [W_('pro'), {olhos: 'grande', boca: 'nervoso', sob: -0.9, trem: 0.4, olhar: [-0.8, 0], vivo: 0.1, semPisca: true}],
      [TM.pior + 0.1, {olhos: 'grande', boca: 'nervoso', sob: -0.9, trem: 0.4, olhar: [0.8, 0], vivo: 0.1, semPisca: true}],
      [TM.inimigo, {olhos: 'grande', boca: 'nervoso', sob: -0.9, trem: 0.4, olhar: [-0.8, 0], vivo: 0.1, semPisca: true}],
      [W_('dele'), {olhos: 'triste', boca: 'nervoso', sob: -1.1, altSob: 0.006, trem: 0.3, olhar: [0, -0.1], vivo: 0.8, ritmo: 0.3}],
    ], 1.1),
    inc: kf(t, [[TM.coisa - 0.06, 0], [TM.coisa + 0.04, -0.16, outQ], [TM.coisa + 0.5, -0.08], [TM.rei - 0.1, 0], [TM.rei + 0.05, 0.1, back], [TM.rei + 0.45, 0.06], [TM.nada, 0.1], [TM.furava2 + 0.04, -0.14, outQ], [TM.pior, -0.06], [W_('dele'), 0.06]]),
    lat: kf(t, [[W_('pro'), 0], [W_('pro') + 0.1, 0.08, back], [TM.pior + 0.1, -0.08, back], [TM.inimigo, 0.08, back], [W_('dele'), 0]]),
    cab: [kf(t, [[TM.rei + 0.3, 0], [TM.rei + 0.5, 0.15], [TM.nada, 0.05], [TM.pior, 0]]), susto1 ? -0.35 : 0, settle(t, TM.coisa, 0.12) + settle(t, TM.furava2 + 0.05, 0.1) + kf(t, [[0, 0.1], [W_('vendeu'), -0.1, back], [TM.lanca, 0.05], [TM.furava, 0.14, back], [TM.coisa, 0], [TM.rei, -0.15, back], [TM.rei + 0.4, 0.04], [W_('pro'), 0.12, back], [TM.pior + 0.1, -0.12, back], [TM.inimigo, 0.12, back], [W_('dele'), 0.18]])], mP, mN};
  return {pos, ry, c, lanca, sacos, susto1, susto2};
};
const reiA = (t) => {
  const bravo = t > TM.pior + 0.08;
  const ry = kf(t, [[0, -0.32], [TM.pior - 0.02, -0.32], [TM.pior + 0.25, -0.78, back]]);
  const esc = bravo ? {p: kf(t, [[TM.pior, ESC], [TM.pior + 0.3, [REI_A[0] - 0.26, 0.86, REI_A[2] + 0.18], back]]), n: [-0.95, 0, 0.3]} : {p: [ESC[0] + settle(t, TM.nada, -0.03, 20, 6), ESC[1], ESC[2]], n: ESC_N};
  const c = {cor: '#1F9A9A', capa: '#126B6B', resp: t * 2.8 + 2,
    ...expr(t, [
      [0, {olhos: 'semi', boca: 'canto', ladoBoca: -1, assim: 0.025, sob: 0.05, olhar: [-0.2, 0], vivo: 0.5}],
      [TM.coisa, {olhos: 'semi', palp: 0.6, boca: 'reta', sob: 0.3, olhar: [-0.8, -0.1], vivo: 0.2}],
      [TM.escudo, {olhos: 'normal', boca: 'sorriso', sob: -0.35, assim: 0.02, olhar: [0, 0.1]}],
      [W_('que', 1), {olhos: 'semi', boca: 'canto', ladoBoca: -1, assim: 0.025, olhar: [-0.65, -0.15], vivo: 0.15}],
      [TM.nada + 0.08, {olhos: 'feliz', boca: 'sorrisoD', sob: -0.3, pop: 0.12, olhar: [0, 0]}],
      [TM.furava2 + 0.05, {olhos: 'semi', palp: 0.4, boca: 'canto', ladoBoca: -1, sob: -0.2, assim: 0.03, olhar: [-0.7, -0.1], vivo: 0.15}],
      [W_('pro'), {olhos: 'semi', boca: 'canto', ladoBoca: -1, assim: 0.03, sob: 0.1, olhar: [-0.5, 0], vivo: 0.2}],
      [TM.pior + 0.08, {olhos: 'bravo', boca: 'brava', sob: 1.15, trem: 0.35, pop: 0.2, olhar: [-0.8, 0], vivo: 0.25}],
    ], 2.0),
    inc: kf(t, [[0, -0.06], [TM.escudo, -0.1], [TM.nada + 0.08, -0.14, back], [TM.pior, 0], [TM.pior + 0.2, 0.1, back]]),
    cab: [kf(t, [[0, -0.1], [TM.coisa, 0.05], [TM.escudo, -0.12, back], [TM.pior, 0]]), kf(t, [[0, 0.1], [TM.escudo, -0.15]]), kf(t, [[0, -0.06], [TM.escudo, 0.12, back], [W_('que', 1), -0.05], [TM.nada + 0.08, 0.14, back], [TM.pior, 0]])],
    capaAng: 0.05 * Math.sin(t * 2.0 + 1) + settle(t, TM.pior, 0.12),
    mN: [esc.p[0] + 0.05, esc.p[1] - 0.02, esc.p[2] - 0.06], cabeca: <><CoroaPrata /><Barba comp={0.26} ang={Math.sin(t * 2) * 0.04} /></>};
  return {pos: REI_A, ry, c, esc};
};

const VelhoSoldado = ({t}) => {
  const pos = [-3.72, 0, 0.12], ry = 0.35;
  // no "cem": revira os olhos e suspira. No fim ("virou ... cento e um"): estica o braço, vira o número, suspira de novo
  const vira = t > TM.virou - 0.2 && t < TM.cento + 0.6;
  const g = vira ? kf(t, [[TM.virou - 0.2, [-3.47, 0.78, 0.3]], [TM.virou + 0.3, [-3.15, 0.86, 0.12]]]) : [-3.47, 0.78, 0.3];
  const mN = t > TM.virou ? kf(t, [[TM.virou, [-3.5, 0.66, 0.34]], [TM.cento - 0.25, [-3.18, 0.92, -0.33]], [TM.cento + 0.4, [-3.18, 0.92, -0.33]], [TM.cento + 0.9, [-3.5, 0.66, 0.34]]]) : [-3.5, 0.66, 0.34];
  const suspiro = (t > TM.cem + 0.15 && t < TM.cem + 0.9) || (t > TM.cento + 0.5 && t < TM.cento + 1.5);
  const revira = (t > TM.cem - 0.1 && t < TM.cem + 0.5) || (t > TM.soldado && t < TM.virou);
  const olhaPlaca = t > TM.virou && t < TM.cento + 0.4;
  const c = {cor: '#8B5E3C', resp: t * 1.6, t, fase: 0.4, olhos: ((t + 0.4) % 3.4) < 0.22 ? 'pisca' : 'tedio', palp: revira ? 0.35 : 0.62, boca: suspiro ? 'O' : 'reta', abre: suspiro ? -0.6 : 0,
    sob: revira ? -0.5 : -0.15, vivo: 0.25, ritmo: 1.6, olhar: revira ? [0.1, 0.7] : olhaPlaca ? [0.8, 0.1] : t > TM.cento + 1.5 ? [0, 0] : [0.3, -0.2],
    estica: kf(t, [[TM.cem + 0.15, 0], [TM.cem + 0.5, -0.35], [TM.cem + 1.0, 0]]) + kf(t, [[TM.cento + 0.5, 0], [TM.cento + 0.9, -0.35], [TM.cento + 1.5, 0]]),
    cab: [0, olhaPlaca ? 0.45 : 0.2, kf(t, [[TM.os, 0.08], [TM.cem + 0.2, 0.08], [TM.cem + 0.6, 0.18]])],
    mP: g, mN, cabeca: <><Elmo /><Barba comp={0.42} y={0.065} /></>};
  return <><Boneco pos={pos} ry={ry} c={c} /><Lanca grip={g} dir={[0.06, 1, 0.03]} comp={1.85} frente={1.0} borla="#7A5A3A" /></>;
};
// ---------- volta à ponte (52 a 70 s): ferreiro rico vendendo a espada ----------
const texPlacaNova = () => canvasTex('placaNova', 1024, 700, (g, w, h) => {
  g.fillStyle = '#C08A4E'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(90,50,20,0.45)'; g.lineWidth = 6; for (let y = 40; y < h; y += 70) { g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + 12, w * 0.6, y - 10, w, y + 6); g.stroke(); }
  g.strokeStyle = '#5B3A1E'; g.lineWidth = 22; g.strokeRect(11, 11, w - 22, h - 22);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#2E1D12'; g.font = 'bold 120px "DejaVu Serif"'; g.fillText('ESPADA', w / 2, 120);
  g.font = 'bold 70px "DejaVu Serif"'; g.fillText('CORTA LANÇA', w / 2, 230); g.fillText('E ESCUDO', w / 2, 310);
  g.fillStyle = '#D8352F'; g.beginPath(); g.ellipse(w / 2, 505, 420, 150, -0.05, 0, 7); g.fill(); g.strokeStyle = '#5B1A16'; g.lineWidth = 10; g.stroke();
  g.fillStyle = '#FFF3D6'; g.font = 'bold 100px "DejaVu Sans"'; g.fillText('METADE', w / 2, 460); g.font = 'bold 84px "DejaVu Sans"'; g.fillText('DO PREÇO!', w / 2, 560);
});
const Espada = ({p, t}) => (
  <group position={p} rotation={[0, 0, 0.08 * settle(t, TM.espada, 1, 10, 4)]}>
    <Tn geo={<boxGeometry args={[0.05, 0.6, 0.012]} />} p={[0, 0.42, 0]} m={PRATA()} />
    <Tn geo={<coneGeometry args={[0.036, 0.08, 4]} />} p={[0, 0.76, 0]} rot={[0, Math.PI / 4, 0]} m={PRATA()} />
    <Tn geo={<boxGeometry args={[0.22, 0.03, 0.04]} />} p={[0, 0.11, 0]} m={OURO()} />
    <Ci rt={0.018} h={0.12} p={[0, 0.04, 0]} m="#5B3A1E" seg={8} line={0.5} />
    <Esf r={0.026} p={[0, -0.03, 0]} m={OURO()} line={0.5} />
  </group>
);
const Ponte2 = ({t}) => {
  const pos = [-0.15, 0, -1.38], ry = 0;
  // contando: as mãos tiram moeda dos sacos (vermelho e turquesa) e empilham
  const conta = t > TM.contava - 0.2 && t < TM.pendurava;
  const ciclo = (t * 2.6) % 1, lado = Math.floor(t * 2.6) % 2;
  const mP = conta && lado === 0 ? kf(ciclo, [[0, [0.18, 0.62, -0.86]], [0.5, [0.0, 0.66, -0.98]], [1, [0.18, 0.62, -0.86]]]) : t > TM.pendurava - 0.1 && t < TM.espada + 0.3 ? kf(t, [[TM.pendurava - 0.1, [0.15, 0.7, -1.2]], [TM.pendurava + 0.3, [0.55, 1.25, -1.35]], [TM.placa + 0.4, [0.55, 1.25, -1.35]], [TM.espada, [0.3, 0.9, -0.86]]]) : t > TM.metade ? [0.35, 0.85 + 0.03 * Math.sin(t * 5), -0.98] : maoRepouso(pos, ry, 1, 0.08, 0.2, 0.62);
  const mN = conta && lado === 1 ? kf(ciclo, [[0, [-0.5, 0.62, -0.86]], [0.5, [-0.3, 0.66, -0.98]], [1, [-0.5, 0.62, -0.86]]]) : maoRepouso(pos, ry, -1, 0.08, 0.2, 0.62);
  const ex = expr(t, [
    [0, {olhos: 'feliz', boca: 'sorriso', olhar: [0, 0]}],
    [TM.contava - 0.2, {olhos: 'grande', boca: 'sorrisoD', sob: -0.5, bochecha: 0.9, olhar: [0.2, -0.6], vivo: 0.2}],
    [TM.contava + 1.0, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 1, sob: -0.3, olhar: [0, -0.4]}],
    [TM.pendurava - 0.1, {olhos: 'normal', boca: 'canto', assim: 0.02, sob: 0.2, olhar: [0.6, 0.6], vivo: 0.2}],
    [TM.espada, {olhos: 'semi', boca: 'canto', assim: 0.03, sob: 0.3, olhar: [0, 0], vivo: 0.3}],
    [TM.metade, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.8, sob: -0.4, olhar: [0, 0], pop: 0.2}],
    [TM.preco + 0.4, {olhos: 'semi', palp: 0.45, boca: 'canto', assim: 0.03, sob: 0.2, olhar: [0, 0], vivo: 0.4}],
  ], 1.1);
  const placaY = kf(t, [[TM.pendurava - 0.05, 3.6], [TM.placa + 0.1, 1.32, back]]) + settle(t, TM.placa + 0.1, 0.04, 12, 4);
  const moedaPula = (k) => { const u = ((t * 2.6) + k * 0.5) % 1; return conta ? [k ? -0.32 : 0.02, 0.62 + Math.sin(u * Math.PI) * 0.18, -0.93] : null; };
  return (
    <group>
      <Boneco pos={pos} ry={ry} c={{cor: '#7F8C99', resp: t * 3.2 + 1, t, roupa: <Avental />, cabeca: <BigodeGuidao />, ...ex, mP, mN,
        cab: [conta ? 0.12 : 0, 0, kf(t, [[TM.contava, 0.05], [TM.pendurava, -0.08], [TM.metade, 0.12, back], [TM.preco + 0.4, 0.04]])], inc: conta ? 0.08 : 0}} />
      {/* sacos dos dois reis, abertos, e pilhas de moedas */}
      <Saco p={[0.25, 0.65, -0.98]} /><Saco p={[-0.52, 0.65, -0.96]} s={1.1} />
      <mesh position={[0.25, 0.73, -0.91]} material={B('#D9473A')}><boxGeometry args={[0.12, 0.03, 0.01]} /></mesh>
      <mesh position={[-0.52, 0.74, -0.89]} material={B('#1F9A9A')}><boxGeometry args={[0.13, 0.03, 0.01]} /></mesh>
      {[[-0.15, 7], [-0.05, 11], [0.06, 5]].map(([x, n]) => Array.from({length: Math.min(n, Math.floor(Math.max(0, t - TM.contava) * 4) + 2)}).map((_, k) => <Ci key={x + '-' + k} rt={0.03} h={0.012} p={[x, 0.556 + k * 0.013, -0.86]} m={OURO()} seg={14} line={0.4} />))}
      {[0, 1].map((k) => { const q = moedaPula(k); return q ? <Ci key={'mp' + k} rt={0.03} h={0.012} p={q} rot={[t * 9, 0, 0]} m={OURO()} seg={14} line={0.4} /> : null; })}
      <Brilho id={12} p={[-0.05, 0.75, -0.83]} k={fx(t, TM.contava + 0.6, 0.5)} s={0.3} />
      {/* placa nova pendurada por cordas */}
      {t > TM.pendurava - 0.05 ? <group position={[0.42, placaY, -1.42]} rotation={[0, 0, settle(t, TM.placa + 0.1, 0.06, 9, 3)]}>
        <Linha a={[-0.36, 0.26, 0]} b={[-0.3, 1.4, 0]} r={0.006} cor="#5B3A1E" /><Linha a={[0.36, 0.26, 0]} b={[0.3, 1.4, 0]} r={0.006} cor="#5B3A1E" />
        <Tn geo={<boxGeometry args={[0.98, 0.67, 0.04]} />} m={lm('placaNova', texPlacaNova)} />
      </group> : null}
      <Espada p={[0.12, 0.58, -0.88]} t={t} />
      <Brilho id={13} p={[0.12, 1.25, -0.83]} k={fx(t, TM.espada - 0.05, 0.6)} s={0.55} />
      <Brilho id={14} p={[0.42, 1.15, -1.38]} k={fx(t, TM.metade - 0.05, 0.6)} s={0.5} />
      <VelhoSoldado t={t} />
      <Bigorna p={ANV} />
    </group>
  );
};
const Tabuleiro = ({t}) => {
  const rv = reiV(t), fe = ferreiro(t), ra = reiA(t);
  const ponta = pontaDe(rv.grip, rv.dir, rv.frente);
  const vx = (reiV(t + 0.03).grip[0] - reiV(t - 0.03).grip[0]) / 0.06;
  const tremor = settle(t, TM.qualquer, 0.02, 60, 9);
  const cab = [FERR[0], 1.15, FERR[2]];
  return (
    <group>
      <Bigorna p={ANV} tremor={tremor} />
      <Boneco pos={rv.pos} ry={rv.ry} c={rv.c} />
      <Lanca grip={rv.grip} dir={rv.dir} comp={1.55} frente={rv.frente} borlaAng={0.12 * Math.sin(t * 3) + Math.max(-0.9, Math.min(0.9, -vx * 0.12)) + settle(t, TM.qualquer + 0.05, 0.5, 10, 3)} />
      <Brilho id={1} p={ponta} k={fx(t, TM.lanca - 0.04, 0.5)} s={0.4} />
      <Velocidade id={1} p={[ANV[0] - 0.55, 0.5, ANV[2] + 0.02]} k={fx(t, TM.qualquer - 0.07, 0.25)} s={0.7} />
      <Faisca id={1} p={[ANV[0] - 0.26, 0.56, ANV[2] + 0.1]} k={fx(t, TM.qualquer - 0.02, 0.25)} s={0.4} />
      <Faisca id={7} p={[ANV[0] + 0.33, 0.56, ANV[2] + 0.1]} k={fx(t, TM.qualquer + 0.03, 0.22)} s={0.3} />
      <Boneco pos={fe.pos} ry={fe.ry} c={fe.c} />
      {fe.sacos === 'mao' ? <><Saco p={[fe.c.mP[0], fe.c.mP[1] - 0.1, fe.c.mP[2]]} /><Saco p={[fe.c.mN[0], fe.c.mN[1] - 0.1, fe.c.mN[2]]} s={0.9} /></>
        : <><Saco p={[-0.25, 0.65, -1.15]} /><Saco p={[-0.05, 0.64, -1.1]} s={0.9} /></>}
      {fe.lanca ? <Lanca grip={fe.lanca.grip} dir={fe.lanca.dir} comp={1.15} frente={fe.lanca.fr} dobra={fe.lanca.dobra} borla="#1C9C98" borlaAng={settle(t, TM.nada, 0.5, 11, 3)} /> : null}
      {t >= TM.pior - 0.12 && t < TM.os + 0.5 ? (() => { const u = Math.min(1, fx(t, TM.pior - 0.12, 0.3)); const g0 = ferreiro(TM.pior - 0.13).lanca; return <Lanca grip={mix(g0.grip, [0.5, 0.03, 0.55], inQ(u))} dir={mix(g0.dir, [1, 0, -0.3], u)} comp={1.15} frente={g0.fr} dobra={1.15} borla="#1C9C98" />; })() : null}
      <Velocidade id={2} p={[ESC[0] - 0.4, 0.58, ESC[2] - 0.05]} k={fx(t, TM.nada - 0.07, 0.22)} s={0.5} rot={-0.25} />
      <Faisca id={2} p={ESC} k={fx(t, TM.nada - 0.02, 0.3)} s={0.55} />
      <Gota id={1} p={[cab[0] + 0.17, cab[1] + 0.15, cab[2] + 0.12]} k={fe.susto1 ? fx(t, TM.coisa, 0.7) : 0} />
      <Gota id={2} p={[cab[0] - 0.15, cab[1] + 0.17, cab[2] + 0.12]} k={fe.susto2 ? fx(t, TM.furava2 + 0.08, 0.7) : 0} />
      <Gota id={3} p={[cab[0] + 0.15, cab[1] + 0.16, cab[2] + 0.12]} k={fe.susto2 ? fx(t, TM.pior + 0.1, 0.7) : 0} />
      <Boneco pos={ra.pos} ry={ra.ry} c={ra.c} />
      <Escudo p={ra.esc.p} normal={ra.esc.n} />
      <Brilho id={3} p={[-0.6, 1.7, 0.2]} k={fx(t, TM.arma - 0.04, 0.6)} s={2.4} />
      <Brilho id={4} p={[0.8, 1.4, 0.3]} k={fx(t, TM.arma + 0.1, 0.6)} s={2.4} />
      <VelhoSoldado t={t} />
    </group>
  );
};

const Ponte = ({t}) => (
  <group>
    <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} material={lm('laj', texLajota)} receiveShadow><planeGeometry args={[12, 3.8]} /></mesh>
    <mesh geometry={geoFace()} position={[0, 0, 1.6]} material={lm('face', () => texPedra('fc', [1, 1]))} receiveShadow castShadow />
    <mesh geometry={geoFace()} position={[0, 0, -1.9]} material={lm('face', () => texPedra('fc', [1, 1]))} />
    <mesh geometry={geoFace()} position={[0, 0, 1.6]} material={HULL(1)} />
    <mesh position={[0, -0.235, 0]} material={lm('tab', () => texPedra('tb', [6, 1]))}><boxGeometry args={[12, 0.44, 3.5]} /></mesh>
    <mesh position={[0, -1.1, -0.15]} material={lm('pil', () => texPedra('pl', [1, 2]))}><boxGeometry args={[0.52, 1.4, 3.4]} /></mesh>
    <Hera p={[-2.1, 0.0, 1.95]} n={7} pend={0.7} t={t} /><Hera p={[1.2, 0.0, 1.95]} n={6} pend={0.9} t={t} /><Hera p={[-4.6, 0, 1.95]} n={5} pend={0.4} t={t} />
    {/* muro do fundo com ameias */}
    <Tn geo={<boxGeometry args={[9.2, 0.55, 0.28]} />} p={[-0.9, 0.275, -1.72]} m={lm('muro', () => texPedra('mr', [9, 0.6]))} />
    {Array.from({length: 13}).map((_, i) => <Cx key={i} a={[0.32, 0.26, 0.3]} p={[-5.2 + i * 0.68, 0.68, -1.72]} m={lm('muro', () => texPedra('mr', [9, 0.6]))} line={0.8} />)}
    <Tn geo={<boxGeometry args={[2.8, 1.45, 0.3]} />} p={[-3.8, 0.725, -1.2]} m={lm('muro2', () => texPedra('m2', [2.5, 1.4]))} />
    {[0, 1, 2, 3].map((i) => <Cx key={'a' + i} a={[0.34, 0.26, 0.32]} p={[-4.9 + i * 0.72, 1.58, -1.2]} m={lm('muro2', () => texPedra('m2', [2.5, 1.4]))} line={0.8} />)}
    <mesh position={[-3.8, 0.85, -1.045]} material={lm('riscos', texRiscos, {transparent: true})}><planeGeometry args={[2.5, 1.2]} /></mesh>
    <Hera p={[-3.0, 1.45, -1.05]} n={5} pend={0.5} t={t} s={0.8} />
    {/* água, margens e campos */}
    <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]} material={T('#3F86A8')} receiveShadow><planeGeometry args={[5.6, 30]} /></mesh>
    {[-1, 1].map((l) => <mesh key={'rp' + l} position={[0, -0.86, l * 14.05]} rotation={[-Math.PI / 2 - l * 0.7, 0, 0]} material={T('#4C8FB0', {side: THREE.DoubleSide})}><planeGeometry args={[5.75, 2.75]} /></mesh>)}
    {Array.from({length: 14}).map((_, i) => <mesh key={i} position={[-2.2 + (i * 1.37 % 4.4), -1.69, -10 + ((i * 3.1 + t * 0.5) % 24)]} rotation={[-Math.PI / 2, 0, 0]} material={B('#8FCBE0')}><planeGeometry args={[0.04, 0.6]} /></mesh>)}
    {[-1, 1].map((l) => <mesh key={l} position={[l * 2.85, -0.9, 0]} material={lm('mar', () => texPedra('mr2', [12, 1]))} receiveShadow><boxGeometry args={[0.2, 1.8, 30]} /></mesh>)}
    {[-1, 1].map((l) => <mesh key={'g' + l} position={[l * (2.95 + 60), 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={lm('grama', () => texGrama('b', [30, 8]))} receiveShadow><planeGeometry args={[120, 30]} /></mesh>)}
    {[-1, 1].map((l) => <mesh key={'f' + l} position={[0, -0.02, l * (15 + 100)]} rotation={[-Math.PI / 2, 0, 0]} material={MAT('longe' + l, () => { const tx = texLonge().clone(); tx.needsUpdate = true; tx.offset.set(0, l > 0 ? 0 : 0.5); tx.repeat.set(1, 0.5); return new THREE.MeshToonMaterial({map: tx, gradientMap: GRAD}); })} receiveShadow><planeGeometry args={[400, 200]} /></mesh>)}
    {[[-4.2, -6, 1], [4.4, -8, 1.1], [-5, -16, 1.3], [5.2, -19, 1.2], [-4, 6, 1.1], [4.6, 7, 1], [-8, -30, 1.4], [9, -34, 1.5], [-3.9, 11, 1.2]].map(([x, z, s], i) => <Salgueiro key={i} p={[x, 0, z]} s={s} t={t} />)}
  </group>
);
const Barraca = ({t, mesaZ = -1.2}) => (
  <group>
    <Forja p={[-1.85, 0, -1.25]} t={t} />
    <Mesa p={[-0.15, 0, mesaZ]} />
    <Barril p={[0.85, 0, -1.15]} t={t} />
    <Suporte p={[1.75, 0, -1.4]} />
    <Bandeira p={[-1.3, 0, -1.5]} tipo="v" t={t} />
    <Bandeira p={[1.3, 0, -1.5]} tipo="a" t={t} />
    <mesh position={[0.1, 0.012, 1.45]} rotation={[-Math.PI / 2, 0, 0]} material={lm('emb', texEmblema, {transparent: true})} receiveShadow><circleGeometry args={[0.58, 48]} /></mesh>
    {/* placa e contador, grandes */}
    <group position={[-2.95, 0, -0.45]}>
      {[-0.5, 0.5].map((x) => <Ci key={x} rt={0.045} h={1.55} p={[x, 0.775, -0.03]} m={lm('poste', texMadeira)} seg={8} />)}
      <Tn geo={<boxGeometry args={[1.15, 0.63, 0.05]} />} p={[0, 1.38, 0.01]} m={lm('placa', texPlaca)} />
      <Contador p={[0, 0.88, 0.02]} t={t} />
    </group>
    {[[-4.45, 0.8, '#FF5E7E', 0.2], [-4.0, 0.95, '#FFD23F', -0.3], [-3.55, 0.85, '#9B7CFF', 0.4]].map(([x, z, c, r], i) => <Tumulo key={i} p={[x, 0, z]} flor={c} r={r} />)}
  </group>
);

// ---------- campo de batalha ----------
const cunha = (lado) => { const o = []; for (let i = 0; i < 40; i++) for (let j = 0; j < 22; j++) o.push([X0 + lado * (1.3 + j * 0.27 + i * 0.15), 0, -0.9 - i * 0.31 - j * 0.08]); return o; };
const CV = cunha(-1), CA = cunha(1);
// ---------- duelo no campo (21 a 52 s) ----------
const TRAVA = () => TM.encostou + 0.3; // instante em que o mundo para
const duelo = (t0, dz) => {
  const trava = TRAVA();
  const t = Math.min(t0, trava); // corpo congela na trava; olhos voltam a mexer depois
  const vivo = t0 > TM.entao2;
  const RAx = kf(t, [[TM.osReis, X0 + 0.85], [TM.pararam + 0.3, X0 + 0.38]]);
  // vermelho: anda até o meio, recua de costas, corre (rápido), câmera lenta no fim
  const RVx = kf(t, [[TM.osReis, X0 - 0.85], [TM.pararam + 0.3, X0 - 0.42], [TM.pegou, X0 - 0.42], [TM.correu - 0.05, X0 - 1.65], [TM.correu + 0.1, X0 - 1.72, back], [TM.encostou - 0.55, X0 - 0.95, inQ], [trava, X0 - 0.79, outQ]]);
  const andando = (t > TM.osReis && t < TM.pararam + 0.3) || (t > TM.pegou && t < TM.correu - 0.05);
  const correndo = t > TM.correu + 0.1 && t < TM.encostou - 0.55;
  const passo = andando ? Math.abs(Math.sin(t * 9)) * 0.03 : correndo ? Math.abs(Math.sin(t * 16)) * 0.06 : 0;
  const RV = [RVx, passo, -dz], RA = [RAx, t > TM.osReis && t < TM.pararam + 0.3 ? Math.abs(Math.sin(t * 9 + 1)) * 0.03 : 0, -dz];
  const ataque = t > TM.pegou;
  const ryV = ataque ? 0.75 : kf(t, [[TM.osReis, 0.3], [TM.pararam, 0.5], [TM.vermelho - 0.2, 0.5], [TM.vermelho + 0.1, 0.3], [TM.verde - 0.2, 0.3], [TM.verde + 0.1, 0.5]]), ryA = kf(t, [[TM.osReis, -0.3], [TM.pararam, -0.5], [TM.verde - 0.2, -0.5], [TM.verde + 0.1, -0.22], [TM.pegou - 0.2, -0.22], [TM.pegou + 0.1, -0.5]]);
  // lança: deitada até o grito; em pé no grito do vermelho; mirando no ataque
  // lança: até o ataque fica em pé ao lado do rei (a ponta nunca atravessa o escudo do outro rei); em pé no grito
  // (sobe e desce em 7 quadros, e desce ANTES da câmera ir para o verde); só deita para mirar depois de recuar, longe do escudo
  const alto = kf(t, [[TM.vermelho + 0.12, 0], [TM.vermelho + 0.36, 1, outQ], [TM.verde - 0.75, 1], [TM.verde - 0.5, 0]]);
  const deita = kf(t, [[TM.correu - 0.45, 0], [TM.correu - 0.05, 1, outQ]]);
  const dirPre = mix([0.12, 1, 0.08], [0.15, 1, 0.05], alto);
  const dirV = mix(dirPre, [1, 0, 0], deita);
  const gripPre = [RV[0] + 0.24, 0.6 + alto * (0.02 + 0.08 * Math.max(0, Math.sin((t - TM.vermelho) * 6))), RV[2] + 0.3];
  const grip = mix(gripPre, [RV[0] + 0.24, 0.68, RV[2] + 0.3], deita);
  const ergue = kf(t, [[TM.escudo2 - 0.12, 0], [TM.escudo2 + 0.05, 0.16, outQ], [TM.escudo2 + 0.6, 0.08], [TM.verde, 0.08], [TM.escudo3 - 0.1, 0.24, outQ], [TM.fura2 + 0.4, 0.06], [TM.correu, 0]]);
  const escA = [RA[0] - 0.3, 0.68 + ergue + settle(t, TM.escudo2 + 0.05, 0.03, 14, 4) + settle(t, TM.escudo3, 0.03, 14, 4), RA[2] + 0.28];
  const ponta = pontaDe(grip, dirV, 0.55);
  // expressões
  const exV = expr(t0, [
    [0, {olhos: 'bravo', boca: 'brava', sob: 1.2, trem: 0.4, vivo: 0.3, olhar: [0.8, 0]}],
    [TM.lanca2, {olhos: 'bravo', boca: 'grito', sob: 1.25, trem: 0.4, pop: 0.2, olhar: [0.8, 0]}],
    [TM.lanca2 + 0.45, {olhos: 'bravo', boca: 'brava', sob: 1.2, trem: 0.4, vivo: 0.3, olhar: [0.8, 0]}],
    [TM.pararam, {olhos: 'semi', palp: 0.55, boca: 'canto', sob: 0.6, assim: 0.02, olhar: [0.8, 0], vivo: 0.15}],
    [TM.vermelho + 0.3, {olhos: 'grande', boca: 'grito', abre: 0.3, sob: 1.3, trem: 0.6, pop: 0.3, olhar: [0.6, 0], semPisca: true}],
    [TM.coisa2 + 0.3, {olhos: 'bravo', boca: 'canto', sob: 0.9, assim: 0.02, olhar: [0.8, 0]}],
    [TM.verde + 0.4, {olhos: 'semi', palp: 0.6, boca: 'reta', sob: 1.0, olhar: [0.8, 0], vivo: 0.1}],
    [TM.fura2 + 0.2, {olhos: 'bravo', boca: 'brava', sob: 1.3, trem: 0.5, pop: 0.15, olhar: [0.8, 0]}],
    [TM.pegou, {olhos: 'semi', palp: 0.5, boca: 'canto', sob: 0.7, assim: 0.025, olhar: [0.8, 0], vivo: 0.1}],
    [TM.correu, {olhos: 'bravo', boca: 'grito', abre: 0.2, sob: 1.3, trem: 0.3, pop: 0.2, olhar: [0.9, 0], semPisca: true}],
    [TM.encostou - 0.5, {olhos: 'grande', boca: 'brava', sob: 1.0, olhar: [0.9, 0], escOlho: 1.1, semPisca: true}],
    [TM.entao2, {olhos: 'semi', palp: 0.6, boca: 'reta', sob: 0.4, olhar: [0.6, 0], vivo: 0.4, ritmo: 1.3}],
    [TM.semana, {olhos: 'tedio', palp: 0.7, boca: 'reta', sob: -0.1, olhar: [0.2, -0.3], vivo: 0.5, ritmo: 1.1}],
    [TM.ano, {olhos: 'tedio', palp: 0.75, boca: 'triste', sob: -0.6, olhar: [0, 0.4], vivo: 0.3}],
  ], 0.6);
  const exA = expr(t0, [
    [0, {olhos: 'bravo', boca: 'brava', sob: 1.2, trem: 0.4, vivo: 0.3, olhar: [-0.8, 0]}],
    [TM.escudo2, {olhos: 'bravo', boca: 'grito', sob: 1.25, trem: 0.4, pop: 0.2, olhar: [-0.8, 0]}],
    [TM.escudo2 + 0.5, {olhos: 'bravo', boca: 'brava', sob: 1.2, trem: 0.4, vivo: 0.3, olhar: [-0.8, 0]}],
    [TM.pararam, {olhos: 'semi', palp: 0.55, boca: 'canto', ladoBoca: -1, sob: 0.6, assim: 0.02, olhar: [-0.8, 0], vivo: 0.15}],
    [TM.vermelho + 0.3, {olhos: 'semi', palp: 0.62, boca: 'reta', sob: 0.9, olhar: [-0.8, 0.05], vivo: 0.1}],
    [TM.qualquer2, {olhos: 'normal', boca: 'canto', ladoBoca: -1, sob: -0.3, assim: 0.03, olhar: [-0.7, 0], vivo: 0.2}],
    [TM.verde + 0.3, {olhos: 'grande', boca: 'grito', abre: 0.3, sob: 1.3, trem: 0.6, pop: 0.3, olhar: [-0.6, 0], semPisca: true}],
    [TM.fura2 + 0.4, {olhos: 'bravo', boca: 'canto', ladoBoca: -1, sob: 0.9, assim: 0.02, olhar: [-0.8, 0]}],
    [TM.correu + 0.3, {olhos: 'grande', boca: 'O', abre: 0.2, sob: -0.8, trem: 0.6, pop: 0.25, olhar: [-0.8, 0], semPisca: true}],
    [TM.mirou, {olhos: 'grande', boca: 'nervoso', sob: -1, trem: 0.8, olhar: [-0.8, -0.1], semPisca: true}],
    [TM.entao2, {olhos: 'semi', palp: 0.6, boca: 'reta', sob: 0.4, olhar: [-0.6, 0], vivo: 0.4, ritmo: 1.4}],
    [TM.semana, {olhos: 'tedio', palp: 0.7, boca: 'reta', sob: -0.1, olhar: [-0.2, -0.3], vivo: 0.5, ritmo: 1.2}],
    [TM.ano, {olhos: 'fechado', boca: 'O', abre: -0.5, sob: 0, olhar: [0, 0], vivo: 0}],
  ], 1.7);
  if (t0 > trava && !vivo) { exV.vivo = 0; exA.vivo = 0; exV.olhos = exV.olhos === 'pisca' ? 'grande' : exV.olhos; exA.olhos = exA.olhos === 'pisca' ? 'grande' : exA.olhos; exV.trem = 0; exA.trem = 0; }
  const tt = vivo ? t0 : t; // relógio do rosto
  const barba = 0.26 + 0.4 * Math.min(1, Math.max(0, (t0 - TM.semana) / 2.4));
  // gestos nas batidas fortes: punho erguido no grito de cada rei; o verde se protege quando o vermelho corre
  const gV = kf(t, [[TM.vermelho + 0.15, 0], [TM.vermelho + 0.32, 1.1, outQ], [TM.vermelho + 0.45, 1], [TM.coisa2 + 0.2, 1], [TM.coisa2 + 0.55, 0]]);
  const gA = kf(t, [[TM.verde + 0.15, 0], [TM.verde + 0.32, 1.1, outQ], [TM.verde + 0.45, 1], [TM.fura2 + 0.2, 1], [TM.fura2 + 0.55, 0]]);
  const dA = kf(t, [[TM.correu + 0.15, 0], [TM.correu + 0.35, 1, outQ], [trava, 1]]);
  const mNV = mix([grip[0] - 0.3, grip[1] - 0.02, grip[2] - 0.04], [RV[0] - 0.27, 0.98 + 0.03 * Math.sin(t * 22) * gV, RV[2] + 0.36], gV);
  const mPA = mix(mix(maoRepouso(RA, ryA, 1), [RA[0] + 0.34, 0.96 + 0.03 * Math.sin(t * 20) * gA, RA[2] + 0.34], gA), [RA[0] - 0.05, 0.9, RA[2] + 0.3], dA);
  const cV = {cor: '#D9473A', capa: '#9E2A22', resp: tt * 3, t: tt, ...exV, mP: grip, mN: mNV,
    inc: kf(t, [[TM.vermelho, 0], [TM.vermelho + 0.2, 0.14, back], [TM.coisa2 + 0.4, 0.04], [TM.pegou, 0], [TM.correu, 0.22], [trava, 0.2]]),
    capaAng: 0.06 * Math.sin(tt * 2.4) + (correndo ? 0.5 : 0) + settle(t, TM.encostou - 0.55, 0.3),
    cab: [0, 0.1 + 0.05 * Math.sin(tt * 1.7), settle(t, TM.lanca2, 0.12) + settle(t, TM.vermelho + 0.3, 0.1)],
    estica: kf(t, [[TM.lanca2 - 0.1, 0], [TM.lanca2 + 0.05, 0.35, outQ], [TM.lanca2 + 0.4, 0], [TM.vermelho + 0.2, 0], [TM.vermelho + 0.35, 0.3, outQ], [TM.vermelho + 0.8, 0]]),
    cabeca: <><CoroaOuro /><Cavanhaque /></>};
  const cA = {cor: '#1F9A9A', capa: '#126B6B', resp: tt * 2.8 + 1, t: tt, fase: 1, ...exA, mP: mPA, mN: [escA[0] + 0.05, escA[1] - 0.02, escA[2] - 0.06],
    inc: kf(t, [[TM.verde, 0], [TM.verde + 0.25, 0.15, back], [TM.fura2 + 0.4, 0.04], [TM.correu, -0.12, back], [trava, -0.14]]),
    capaAng: 0.06 * Math.sin(tt * 2.1 + 1) + settle(t, TM.escudo2, 0.2) + settle(t, TM.verde + 0.3, 0.2),
    cab: [0, -0.1 - 0.05 * Math.sin(tt * 1.5), settle(t, TM.escudo2, -0.12) + settle(t, TM.verde + 0.3, -0.1)],
    estica: kf(t, [[TM.escudo2 - 0.1, 0], [TM.escudo2 + 0.05, 0.4, outQ], [TM.escudo2 + 0.4, 0], [TM.verde + 0.2, 0], [TM.verde + 0.35, 0.3, outQ], [TM.verde + 0.8, 0], [TM.correu + 0.2, 0], [TM.correu + 0.35, -0.25, outQ], [TM.correu + 0.7, -0.1]]),
    cabeca: <><CoroaPrata /><Barba comp={barba} ang={Math.sin(tt * 2) * 0.04} /></>};
  return {RV, RA, ryV, ryA, grip, dirV, escA, ponta, cV, cA, borla: correndo ? -0.9 : 0.15 * Math.sin(tt * 2.6)};
};
// passagem do tempo e congelamento: cartões "mentira", teia, neve, ninho, passarinho parado no ar
const texCarta = (k) => canvasTex('carta' + k, 512, 600, (g, w, h) => {
  g.fillStyle = '#FFF8EA'; g.strokeStyle = '#372C2E'; g.lineWidth = 14; g.beginPath(); g.roundRect(10, 10, w - 20, h - 20, 40); g.fill(); g.stroke();
  g.lineCap = 'round';
  if (k === 1) { // escudo furado
    g.fillStyle = '#1F9A9A'; g.beginPath(); g.arc(w / 2, 230, 140, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#E5B53A'; g.lineWidth = 10; g.beginPath(); g.arc(w / 2, 230, 140, 0, 7); g.stroke();
    g.fillStyle = '#C9CDD3'; g.beginPath(); g.arc(w / 2, 230, 45, 0, 7); g.fill(); g.stroke();
    g.fillStyle = '#372C2E'; g.beginPath(); g.arc(w / 2 + 70, 190, 34, 0, 7); g.fill();
    g.strokeStyle = '#8A6A44'; g.lineWidth = 16; g.beginPath(); g.moveTo(40, 300); g.lineTo(w / 2 + 70, 190); g.stroke();
  } else { // lança entortada
    g.strokeStyle = '#8A6A44'; g.lineWidth = 18; g.beginPath(); g.moveTo(60, 330); g.lineTo(330, 240); g.quadraticCurveTo(380, 225, 390, 300); g.stroke();
    g.fillStyle = '#C9CDD3'; g.strokeStyle = '#372C2E'; g.lineWidth = 10; g.beginPath(); g.moveTo(370, 300); g.lineTo(410, 300); g.lineTo(392, 380); g.closePath(); g.fill(); g.stroke();
  }
  g.fillStyle = '#372C2E'; g.textAlign = 'center'; g.font = 'bold 66px "DejaVu Serif"'; g.fillText(k === 1 ? 'NADA FURA' : 'FURA TUDO', w / 2, 500);
});
const texCarimbo = () => canvasTex('carimbo', 600, 220, (g, w, h) => {
  g.strokeStyle = '#D8352F'; g.lineWidth = 16; g.beginPath(); g.roundRect(14, 14, w - 28, h - 28, 26); g.stroke();
  g.fillStyle = '#D8352F'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 120px "DejaVu Sans"'; g.fillText('MENTIRA!', w / 2, h / 2 + 6);
});
const texTeia = () => canvasTex('teia', 512, 512, (g, w) => {
  g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 3; const c = w / 2;
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; g.beginPath(); g.moveTo(c, c); g.lineTo(c + Math.cos(a) * c, c + Math.sin(a) * c); g.stroke(); }
  for (let r = 30; r < c; r += 34) { g.beginPath(); for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI * 2; const x = c + Math.cos(a) * r, y = c + Math.sin(a) * r; if (i) g.quadraticCurveTo(c + Math.cos(a - 0.31) * r * 0.9, c + Math.sin(a - 0.31) * r * 0.9, x, y); else g.moveTo(x, y); } g.stroke(); }
});
const texFloco = () => canvasTex('floco', 64, 64, (g, w) => { const gr = g.createRadialGradient(32, 32, 2, 32, 32, 30); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.6, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
const Carta = ({k, p, t, t0, tStamp, tFim, s = 0.52}) => {
  if (t < t0 || t > tFim) return null;
  const a = Math.min(1, back(Math.min(1, (t - t0) / 0.3))) * (t > tFim - 0.2 ? (tFim - t) / 0.2 : 1);
  const u = t > tStamp ? Math.min(1, (t - tStamp) / 0.12) : 0;
  return (
    <group position={p}>
      <sprite scale={[s * a, s * 1.17 * a, 1]} material={MAT('carta' + k, () => new THREE.SpriteMaterial({map: texCarta(k), depthTest: false, transparent: true}))} renderOrder={10} />
      {u > 0 ? <sprite position={[0, 0.02, 0.01]} scale={[s * 1.0 * (1.4 - 0.4 * u), s * 0.37 * (1.4 - 0.4 * u), 1]} material={MAT('carimbo', () => new THREE.SpriteMaterial({map: texCarimbo(), depthTest: false, transparent: true, rotation: -0.25}))} renderOrder={11} /> : null}
    </group>
  );
};
const Neve = ({t, centro, k}) => {
  const ref = React.useRef(); const N = 900;
  const geo = React.useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3)); return g; }, []);
  const p = geo.attributes.position.array;
  for (let i = 0; i < N; i++) { const h1 = (Math.sin(i * 91.7) * 4375.5) % 1, h2 = (Math.sin(i * 17.3) * 9137.1) % 1, h3 = (Math.sin(i * 53.1) * 1731.3) % 1;
    p[i * 3] = centro[0] + h1 * 6 + Math.sin(t * 1.3 + i) * 0.08; p[i * 3 + 1] = 3.2 - ((t * 0.55 + Math.abs(h2) * 3.2) % 3.2); p[i * 3 + 2] = centro[2] + h3 * 4; }
  geo.attributes.position.needsUpdate = true;
  if (k <= 0) return null;
  // nas passadas de normal/profundidade (material trocado), a neve não desenha: senão cada floco vira um quadrado com contorno
  geo.userData.mat = geo.userData.mat || null;
  return <points ref={ref} geometry={geo} frustumCulled={false} onBeforeRender={(r, sc, cam, g, m) => { g.setDrawRange(0, m && m.isPointsMaterial ? Infinity : 0); }} material={MAT('neve', () => new THREE.PointsMaterial({map: texFloco(), size: 0.045, transparent: true, alphaTest: 0.08, depthWrite: false, color: '#FFFFFF'}))} />;
};
const Passagem = ({t, D}) => {
  const trava = TRAVA();
  const teia = Math.min(1, Math.max(0, (t - TM.semana - 0.2) / 0.8));
  const neve = t > TM.ano - 0.1;
  const neveTopo = Math.min(1, Math.max(0, (t - TM.ano) / 1.2));
  const ninho = t > TM.ano + 0.3;
  const cabV = [D.RV[0], 1.3, D.RV[2]];
  return (
    <group>
      {/* passarinho parado no ar quando o mundo trava */}
      {t > TM.mirou && t < TM.entao2 + 1 ? (() => { const tp = Math.min(t, trava); const x = X0 - 1.2 + (tp - TM.mirou) * 0.9; return <group position={[x, 1.75 + Math.sin(tp * 3) * 0.05, -0.6]}>
        <Esf r={0.045} p={[0, 0, 0]} m="#5BA8E8" line={0.6} /><Esf r={0.03} p={[0.045, 0.03, 0]} m="#5BA8E8" line={0.5} />
        <Co r={0.012} h={0.03} p={[0.08, 0.03, 0]} rot={[0, 0, -Math.PI / 2]} m="#FF9A2E" seg={6} line={0.4} />
        <mesh position={[0.055, 0.04, 0.026]} material={B(LINHA)}><sphereGeometry args={[0.006, 6, 4]} /></mesh>
        <Tn geo={<boxGeometry args={[0.07, 0.008, 0.05]} />} p={[-0.01, 0.03 + 0.02 * Math.sin(tp * 30), 0.03]} rot={[0.6 * Math.sin(tp * 30), 0, 0.3]} m="#3E86C8" />
        <Tn geo={<boxGeometry args={[0.07, 0.008, 0.05]} />} p={[-0.01, 0.03 + 0.02 * Math.sin(tp * 30), -0.03]} rot={[-0.6 * Math.sin(tp * 30), 0, 0.3]} m="#3E86C8" /></group>; })() : null}
      <Carta k={1} p={[X0 + 0.19, 1.5, 0.25]} s={0.36} t={t} t0={TM.furasse - 0.15} tStamp={TM.mentira1} tFim={TM.entao2 - 0.1} />
      <Carta k={2} p={[X0 - 0.19, 1.5, 0.25]} s={0.36} t={t} t0={TM.aguentasse - 0.15} tStamp={TM.mentira2} tFim={TM.entao2 - 0.1} />
      {teia > 0 ? <mesh position={[D.ponta[0] - 0.12, D.ponta[1] - 0.08, D.ponta[2] + 0.04]} rotation={[0, 0.5, 0]} scale={teia} material={MAT('teia', () => new THREE.MeshBasicMaterial({map: texTeia(), transparent: true, depthWrite: false, side: THREE.DoubleSide}))}><planeGeometry args={[0.32, 0.32]} /></mesh> : null}
      {neveTopo > 0 ? <>
        <mesh position={[cabV[0], 1.31, cabV[2]]} scale={[1, neveTopo * 0.5, 1]} material={T('#FFFFFF')}><sphereGeometry args={[0.16, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
        <mesh position={[D.RA[0], 1.31, D.RA[2]]} scale={[1, neveTopo * 0.5, 1]} material={T('#FFFFFF')}><sphereGeometry args={[0.16, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      </> : null}
      {ninho ? <group position={[cabV[0], 1.37 + neveTopo * 0.04, cabV[2]]} scale={Math.min(1, back(Math.min(1, (t - TM.ano - 0.3) / 0.3)))}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={T('#8A5A32')}><torusGeometry args={[0.07, 0.03, 8, 16]} /></mesh>
        <Esf r={0.035} p={[0, 0.045, 0]} m="#F7CF3B" line={0.5} />
        <Co r={0.012} h={0.03} p={[0, 0.05, 0.04]} rot={[Math.PI / 2, 0, 0]} m="#FF9A2E" seg={6} line={0.4} />
        {[-1, 1].map((l) => <mesh key={l} position={[l * 0.014, 0.06, 0.03]} material={B(LINHA)}><sphereGeometry args={[0.005, 6, 4]} /></mesh>)}
      </group> : null}
      <Neve t={t} centro={[X0 - 3, 0, -2.5]} k={neve ? 1 : 0} />
    </group>
  );
};
const Campo = ({t, noite = 0}) => {
  const dz = kf(t, [[TM.entao - 0.1, 5], [TM.exercitos + 0.15, 0]], outQ);
  const marcha = (arr) => arr.map(([x, y, z], i) => [x, Math.abs(Math.sin(t * 9 + i * 0.7)) * 0.05 * (dz > 0.01 ? 1 : 0), z - dz]);
  const D = duelo(t, dz);
  return (
    <group>
      <mesh position={[X0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={lm('campo', () => texGrama('c', [40, 40]))} receiveShadow><planeGeometry args={[240, 240]} /></mesh>
      <mesh position={[X0, 0.01, -50]} rotation={[-Math.PI / 2, 0, 0]} material={lm('trilha', () => canvasTex('trilha', 256, 1024, (g, w, h) => { SEED = 31; g.fillStyle = '#CDA873'; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = ['rgba(150,110,70,0.5)', 'rgba(230,205,160,0.6)', 'rgba(120,90,60,0.4)'][i % 3]; g.beginPath(); g.ellipse(rnd() * w, rnd() * h, 2 + rnd() * 7, 1.5 + rnd() * 4, rnd() * 3, 0, 7); g.fill(); } g.fillStyle = 'rgba(110,140,60,0.8)'; for (let y = 0; y < h; y += 6) { g.fillRect(0, y, 6 + rnd() * 14, 4); g.fillRect(w - 6 - rnd() * 14, y, 20, 4); } }, [1, 60]))} receiveShadow><planeGeometry args={[0.95, 200]} /></mesh>
      {Array.from({length: 12}).map((_, i) => { const z = -1.2 - i * 2.4; return (
        <group key={i} position={[X0, 0, z]}>
          <Cx a={[0.13, 0.3, 0.26]} p={[-0.065, 0.15, 0]} m={lm('mv', () => texPedra('mv', [0.3, 0.3]), {color: '#E07070'})} line={0.7} />
          <Cx a={[0.13, 0.3, 0.26]} p={[0.065, 0.15, 0]} m={lm('ma', () => texPedra('ma', [0.3, 0.3]), {color: '#70C8C4'})} line={0.7} />
        </group>); })}
      <Exercito pos={marcha(CV)} cor="#C8352F" s={0.6} />
      <Exercito pos={marcha(CA)} cor="#1C9C98" s={0.6} />
      {[[-2.6, -2.2], [-3.8, -5.0], [-2.9, -7.6]].map(([x, z], i) => <Bandeira key={'v' + i} p={[X0 + x, 0, z - dz]} tipo="v" t={t} h={2.2} />)}
      {[[2.4, -2.2], [3.6, -5.0], [2.7, -7.6]].map(([x, z], i) => <Bandeira key={'a' + i} p={[X0 + x, 0, z - dz]} tipo="a" t={t} h={2.2} />)}
      <Boneco pos={D.RV} ry={D.ryV} c={D.cV} />
      <Lanca grip={D.grip} dir={D.dirV} comp={1.55} frente={0.55} borlaAng={D.borla} />
      <Brilho id={5} p={pontaDe(D.grip, D.dirV, 0.55)} k={Math.max(fx(t, TM.lanca2 - 0.04, 0.55) < 1 ? fx(t, TM.lanca2 - 0.04, 0.55) : 0, fx(t, TM.lanca3 - 0.04, 0.55) < 1 ? fx(t, TM.lanca3 - 0.04, 0.55) : 0)} s={0.5} />
      <Boneco pos={D.RA} ry={D.ryA} c={D.cA} />
      <Escudo p={D.escA} normal={[-0.9, 0, 0.45]} />
      <Brilho id={6} p={[D.escA[0] - 0.02, D.escA[1] + (t > TM.escudo3 - 0.2 ? -0.06 : 0.03), D.escA[2] + 0.06]} k={Math.max(fx(t, TM.escudo2 - 0.04, 0.6) < 1 ? fx(t, TM.escudo2 - 0.04, 0.6) : 0, fx(t, TM.escudo3 - 0.04, 0.6) < 1 ? fx(t, TM.escudo3 - 0.04, 0.6) : 0)} s={t > TM.escudo3 - 0.2 ? 0.45 : 0.9} />
      <Velocidade id={8} p={[D.RV[0] - 0.35, 0.6, D.RV[2] + 0.1]} k={t > TM.correu && t < TM.encostou - 0.6 ? (t * 4) % 1 : 0} s={0.8} />
      {t > TM.correu && t < TM.encostou ? [0, 1, 2].map((k) => <Nuvem key={'po' + k} id={30 + k} p={[D.RV[0] - 0.25 - k * 0.22, 0.08 + k * 0.03, D.RV[2] + 0.05]} s={0.22 + k * 0.08} />) : null}
      <Brilho id={9} p={D.ponta} k={t > TM.encostou + 0.25 && t < TM.travou + 1.2 ? 0.5 : fx(t, TM.encostou + 0.1, 0.3)} s={0.35} />
      <Passagem t={t} D={D} />
      {/* capim e flores em primeiro plano */}
      {Array.from({length: 40}).map((_, i) => { const x = (i * 0.37 % 4.4) - 2.2; if (Math.abs(x) < 0.55) return null; const z = 4.2 + (i * 0.61 % 1.6);
        return <group key={i} position={[X0 + x, 0, z]}>
          <Tn geo={<coneGeometry args={[0.03, 0.22 + (i % 3) * 0.06, 5]} />} p={[0, 0.12, 0]} rot={[0, 0, Math.sin(t * 2 + i) * 0.1]} m={i % 2 ? '#7E9A45' : '#6A8A3A'} line={0.5} />
          {i % 3 === 0 ? <><Linha a={[0.05, 0, 0]} b={[0.06, 0.26, 0]} r={0.006} cor="#3E7A2E" />{[0, 1, 2, 3, 4].map((k) => { const a = k * 1.256; return <Esf key={k} r={0.026} p={[0.06 + Math.cos(a) * 0.03, 0.28, Math.sin(a) * 0.03]} m={i % 2 ? '#E8434F' : '#4A7BE0'} line={0.35} seg={8} />; })}</> : null}
        </group>; })}
      {[[-7, 9, -24, 9], [5, 11, -30, 11], [14, 8, -22, 8], [-16, 10, -32, 10], [1, 14, -40, 13]].map(([x, y, z, s], i) => <Nuvem key={i} id={i} p={[X0 + x + Math.sin(t * 0.15 + i) * 0.3, y, z]} s={s} />)}
      <FundoPintado c={[X0, 0, 0]} r={70} noite={noite} /><Capinzal g={1 + 1.6 * Math.min(1, Math.max(0, (t - TM.semana) / 2.2))} /><Arvoredo lista={ARV.map(([x, y, z, k, a]) => [X0 + x, y, z - 8, k, a])} />
    </group>
  );
};

// ---------- legenda ----------
const GRUPOS = (() => { const g = []; let i = 0; while (i < PALAVRAS.length) { const a = PALAVRAS[i], l = a.w.replace(/[.,!?]/g, ''); if (l.length <= 2 && i + 1 < PALAVRAS.length && !/[.,!?]$/.test(a.w)) { g.push({txt: a.w + ' ' + PALAVRAS[i + 1].w, s: a.s, e: PALAVRAS[i + 1].e}); i += 2; } else { g.push({txt: a.w, s: a.s, e: a.e}); i++; } } return g; })();
// fonte embutida no projeto (o PC não tem Montserrat instalada)
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

export const LancaEscudo2 = () => {
  const t = useCurrentFrame() / 30;
  const c = segueNinho(t, segueCorrida(t, camEm(t)));
  const ponte2 = t >= TM.enquanto - 0.05;
  const noCampo = t >= TM.entao && !ponte2;
  // passagem do tempo: dia e noite cada vez mais rápidos (um dia, uma semana, um ano)
  // cada ciclo leva no mínimo ~0,5 s (antes 0,2 s virava um pisca-pisca): 1 ciclo no dia, 2 na semana, 3 no ano
  const fase = t < TM.dia - 0.1 ? 0 : t < TM.semana - 0.1 ? (t - TM.dia + 0.1) / (TM.semana - TM.dia) : t < TM.ano - 0.1 ? 1 + (t - TM.semana + 0.1) / (TM.ano - TM.semana) * 2 : Math.min(6, 3 + (t - TM.ano + 0.1) / (TM.enquanto - 0.4 - TM.ano + 0.1) * 3);
  const noite = noCampo && t > TM.dia - 0.1 && t < TM.enquanto - 0.4 ? 0.5 - 0.5 * Math.cos(fase * Math.PI * 2) : 0;
  tingeNuvens(noite);
  const trava = noCampo && t > TRAVA() && t < TM.porque + 0.35 ? Math.min(1, (t - TRAVA()) / 0.12) * Math.min(1, (TM.porque + 0.35 - t) / 0.3) : 0;
  const topo = noCampo && t < TM.exercitos + 0.1;
  const aereo = !noCampo && t > TM.agora + 0.2;
  const alvo = noCampo ? [X0, 0, -2] : ponte2 ? [-1.4, 0, 0] : aereo ? [0, 0, -6] : [-1.4, 0, 0];
  const area = noCampo ? (topo ? 14 : 8) : ponte2 ? 5.5 : aereo ? 30 : 5.5;
  const fogN = ponte2 ? 9 : noCampo ? (topo ? 30 : 9) : aereo ? kf(t, [[TM.agora, 9], [TM.entao, 45]]) : 9;
  const fogF = ponte2 ? 75 : noCampo ? (topo ? 140 : 75) : aereo ? kf(t, [[TM.agora, 75], [TM.entao, 220]]) : 75;
  const chicote = Math.max(0, Math.sin(Math.max(0, Math.min(1, (t - TM.os + 0.02) / 0.32)) * Math.PI));
  const amplo = aereo || topo || (t > TM.os + 0.2 && t < TM.agora + 0.2) || (noCampo && t > TM.entao2 + 0.3) || (ponte2 && t < TM.contava - 0.5);
  return (
    <AbsoluteFill style={{backgroundColor: '#D3E3F0'}}>
      <Borrao k={chicote * 0.9} />
      <AbsoluteFill style={{filter: chicote > 0.02 ? 'url(#chicote)' : undefined}}>
        <ThreeCanvas width={1080} height={1920} dpr={IN.dpr || 2} shadows gl={{antialias: true}} camera={{fov: 50, position: [0, 2, 6]}}>
          <Cam c={c} />
          <fog attach="fog" args={['#E3E4DC', fogN * 1.6, fogF * 1.8]} />
          <Ceu c={c} noite={noite} />
          <Sol alvo={alvo} area={area} luz={1 - 0.75 * noite} />
          {!noCampo ? <>
            <Ponte t={t} /><Barraca t={t} mesaZ={ponte2 ? -0.98 : -1.2} />{ponte2 ? <Ponte2 t={t} /> : <Tabuleiro t={t} />}<Patos t={t} />
            {!ponte2 ? <><Exercito pos={EXV} cor="#C8352F" s={0.55} /><Exercito pos={EXA} cor="#1C9C98" s={0.55} /></> : null}
            {[[-8, -10.5], [-13, -10.5], [-18, -10.5], [-12, -19.5]].map(([x, z], i) => <Bandeira key={'ev' + i} p={[x, 0, z]} tipo="v" t={t} h={2.6} />)}
            {[[8, -10.5], [13, -10.5], [18, -10.5], [12, -19.5]].map(([x, z], i) => <Bandeira key={'ea' + i} p={[x, 0, z]} tipo="a" t={t} h={2.6} />)}
            <Castelo p={[-24, 0, -48]} cor="#C8352F" s={1.3} /><Castelo p={[24, 0, -50]} cor="#1C9C98" s={1.3} /><Castelo p={[-7, 0, -38]} cor="#C8352F" s={1.1} /><Castelo p={[8, 0, -40]} cor="#1C9C98" s={1.1} />
            {[[-6, 10, -26, 9], [8, 12, -34, 11], [-18, 13, -40, 12], [20, 11, -38, 10]].map(([x, y, z, s], i) => <Nuvem key={i} id={10 + i} p={[x, y, z]} s={s} />)}
            <FundoPintado r={85} /><Arvoredo lista={ARV} />
          </> : <Campo t={t} noite={noite} />}
          {IN.pos !== false ? <><Aquece /><PosToon dpr={IN.dpr || 2} dof={IN.dof !== false} ao={IN.ao !== false} foco={c.look} bokeh={amplo ? 0.6 : 2.2} faixa={amplo ? 14 : 3.2} longe={amplo ? 260 : 60} sat={lerp(amplo ? -0.04 : 0.0, -0.9, trava)} /></> : null}
        </ThreeCanvas>
      </AbsoluteFill>
      <Legenda t={t} />
    </AbsoluteFill>
  );
};
