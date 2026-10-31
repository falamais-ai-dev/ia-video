import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, YELLOW, pop} from './lib';

// Legenda A: frase curta (2 a 5 palavras), aparece inteira na primeira palavra. key = palavra em amarelo.
// items: [{from, to, text, key}] em quadros. y = centro da faixa (cima 410, baixo 1200).
export const CapA = ({items, y = 410}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const it = items.find((c) => frame >= c.from && frame < c.to);
  if (!it) return null;
  const p = pop(frame, fps, it.from);
  return (
    <div style={{position: 'absolute', left: 60, width: 852, top: y - 110, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      fontFamily: FONT, fontWeight: 900, fontSize: 96, lineHeight: 1.02, textTransform: 'uppercase', color: 'white', WebkitTextStroke: '13px black', paintOrder: 'stroke fill',
      textShadow: '0 8px 18px rgba(0,0,0,0.55)', transform: `scale(${0.85 + 0.15 * p})`}}>
      <span>{it.text.split(' ').map((w, i) => <span key={i} style={{color: w.replace(/[^\wÀ-ú%]/g, '').toUpperCase() === it.key.toUpperCase() ? YELLOW : 'white'}}>{w} </span>)}</span>
    </div>
  );
};

// Legenda B: palavra por palavra na faixa de baixo, cor alternando branco/amarelo/ciano.
// words: [{t, w}] em quadros; cada palavra fica até a próxima (ou t+12 na última).
const CYCLE = ['white', YELLOW, '#5ce1e6'];
export const CapB = ({words, y = 1200}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  let i = -1;
  for (let k = 0; k < words.length; k++) if (frame >= words[k].t) i = k;
  if (i < 0) return null;
  const end = i + 1 < words.length ? words[i + 1].t : words[i].t + 14;
  if (frame >= end) return null;
  const p = pop(frame, fps, words[i].t);
  return (
    <div style={{position: 'absolute', left: 60, width: 852, top: y - 80, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONT, fontWeight: 900, fontSize: 120, textTransform: 'uppercase', color: CYCLE[i % 3], WebkitTextStroke: '16px black', paintOrder: 'stroke fill',
      textShadow: '0 8px 18px rgba(0,0,0,0.55)', transform: `scale(${0.7 + 0.3 * p})`, whiteSpace: 'nowrap'}}>{words[i].w}</div>
  );
};

// helper: "palavra palavra" + quadro inicial + passo -> words
export const seqWords = (text, t0, step = 9) => text.split(' ').map((w, i) => ({t: t0 + i * step, w}));
