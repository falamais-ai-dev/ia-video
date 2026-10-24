// Demo 3 (gráfico animado em SVG): chance de 2 pessoas fazerem aniversário no mesmo dia, de 1 a 70 pessoas.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {CapA} from './captions';
import {FONT, YELLOW, NumBadge, Seal, f, pop} from './lib';

export const D3_DUR = f(7);
const prob = (n) => { let q = 1; for (let k = 0; k < n; k++) q *= (365 - k) / 365; return 1 - q; };
const NMAX = 70;
const X0 = 190, X1 = 900, Y0 = 1480, Y1 = 760; // área do gráfico (fora dos 10% da direita e da faixa da legenda)
const sx = (n) => X0 + (n / NMAX) * (X1 - X0);
const sy = (p) => Y0 - p * (Y0 - Y1);
const DRAW0 = f(0.5), DRAW1 = f(4.2);

export const D3Grafico = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // a curva desacelera perto de 23 para o número "pousar"
  const nNow = interpolate(frame, [DRAW0, f(2.4), f(3.0), DRAW1], [1, 23, 23, NMAX], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const pts = [];
  for (let n = 1; n <= nNow; n += 0.5) pts.push([sx(n), sy(prob(Math.floor(n)) + (prob(Math.ceil(n)) - prob(Math.floor(n))) * (n % 1))]);
  const last = pts[pts.length - 1] || [sx(1), sy(0)];
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${last[0]},${Y0} L${X0},${Y0} Z`;
  const pct = prob(Math.round(nNow)) * 100;
  const at23 = frame >= f(2.4);
  const grow = pop(frame, fps, 0);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg,#2ec4b6 0%,#1982c4 55%,#6a4c93 100%)'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', transform: `scale(${0.9 + 0.1 * grow})`, transformOrigin: '50% 60%'}}>
        <defs>
          <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd400" stopOpacity="0.55" /><stop offset="1" stopColor="#ffd400" stopOpacity="0.05" /></linearGradient>
          <filter id="gl"><feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((p) => <line key={p} x1={X0} x2={X1} y1={sy(p)} y2={sy(p)} stroke="white" strokeOpacity={p === 0.5 ? 0.7 : 0.22} strokeWidth={p === 0.5 ? 5 : 3} strokeDasharray={p === 0.5 ? '18 14' : undefined} />)}
        <text x={X0 - 18} y={sy(0.5) + 14} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={46} fill="white">50%</text>
        <text x={X0 - 18} y={sy(1) + 14} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={46} fill="white">100%</text>
        <path d={area} fill="url(#ar)" />
        <path d={line} fill="none" stroke={YELLOW} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" filter="url(#gl)" />
        {at23 && <line x1={sx(23)} x2={sx(23)} y1={Y0} y2={sy(prob(23))} stroke="white" strokeWidth={6} strokeDasharray="14 12" />}
        <circle cx={last[0]} cy={last[1]} r={26} fill="white" stroke={YELLOW} strokeWidth={10} />
        <text x={(X0 + X1) / 2} y={Y0 + 160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill="white" letterSpacing={3}>PESSOAS NA SALA →</text>
      </svg>
      {/* número que acompanha a ponta da curva */}
      <div style={{position: 'absolute', left: Math.max(20, Math.min(last[0] - 210, 540)), top: last[1] - 190, width: 420, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 110,
        color: 'white', WebkitTextStroke: '14px black', paintOrder: 'stroke fill', textShadow: '0 8px 18px rgba(0,0,0,0.5)'}}>{pct.toFixed(pct < 99.5 ? 1 : 1).replace('.', ',')}%</div>
      {at23 && <NumBadge x={sx(23)} y={Y0 + 10} r={62} n="23" delay={f(2.4)} />}
      {frame >= f(4.4) && <Seal x={600} y={1340} text="99,9% COM 70" size={62} delay={f(4.4)} bg="#ff595e" />}
      <CapA items={[{from: 0, to: f(2.4), text: 'cada pessoa a mais...', key: 'MAIS'}, {from: f(2.4), to: f(4.3), text: 'com 23, meio a meio', key: '23'}, {from: f(4.3), to: D3_DUR, text: 'com 70, quase certeza', key: '70'}]} />
    </AbsoluteFill>
  );
};
