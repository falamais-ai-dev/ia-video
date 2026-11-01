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
