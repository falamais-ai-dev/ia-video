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
