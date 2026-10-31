// Prévia de 20 s do visual "jogo de montar": praça, banheiro com chuveiro elétrico, closes e comemoração.
import React from 'react';
import * as THREE from 'three';
import {AbsoluteFill, useCurrentFrame, Easing, interpolate} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Cam, rnd} from './three-common';
import {Ele, Ela, Perita, Ambiente, LuzJogo, RB, P, Q, ESFERA, Estatico} from './personagens-roblox';
import {FONT, YELLOW} from './lib';

const W = 1080, H = 1920;
const ease = Easing.inOut(Easing.cubic);
const lerp = (a, b, p) => a + (b - a) * p;
const lerp3 = (a, b, p) => a.map((v, i) => lerp(v, b[i], p));
const Bola = ({p, s, m}) => <mesh position={p} scale={s} material={m} geometry={ESFERA()} castShadow receiveShadow />;
const Cil = ({p, r, h, m, rot, seg = 20}) => <mesh position={p} rotation={rot} material={m} castShadow receiveShadow><cylinderGeometry args={[r, r, h, seg]} /></mesh>;
const GOTA = new THREE.CapsuleGeometry(0.025, 0.12, 3, 6);
const CROMO = P('#AEB6C0', {rough: 0.4, metalness: 0.6});
const OURO = P('#FFC93C', {rough: 0.25, metalness: 0.7, cc: 0.3});

// ================= praça =================
const Arvore = ({p, s = 1}) => (
  <group position={p} scale={s}>
    <Cil p={[0, 0.8, 0]} r={0.18} h={1.6} m={P('#8A5A2B', {rough: 0.7, cc: 0.1})} seg={12} />
    <Bola p={[0, 2.1, 0]} s={[1.0, 0.9, 1.0]} m={P('#3FAE3A', {rough: 0.5})} />
    <Bola p={[0.55, 1.8, 0.2]} s={[0.65, 0.6, 0.65]} m={P('#4DC244', {rough: 0.5})} />
    <Bola p={[-0.5, 1.85, -0.1]} s={[0.7, 0.62, 0.7]} m={P('#36A034', {rough: 0.5})} />
    <Bola p={[0.1, 2.65, 0.1]} s={[0.6, 0.5, 0.6]} m={P('#5BD150', {rough: 0.5})} />
  </group>
);
const Arbusto = ({p, c = '#45B83E'}) => (
  <group position={p}>
    <Bola p={[0, 0.3, 0]} s={[0.45, 0.35, 0.4]} m={P(c, {rough: 0.5})} />
    <Bola p={[0.35, 0.22, 0.05]} s={[0.3, 0.26, 0.3]} m={P(c, {rough: 0.5})} />
    {[0, 1, 2].map((i) => <Bola key={i} p={[-0.2 + i * 0.22, 0.52 - (i % 2) * 0.1, 0.3]} s={[0.06, 0.06, 0.06]} m={P(['#FF4F7B', '#FFD400', '#FFFFFF'][i])} />)}
  </group>
);
const Poste = ({p}) => (
  <group position={p}>
    <Cil p={[0, 0.08, 0]} r={0.18} h={0.16} m={P('#2E3440')} />
    <Cil p={[0, 1.4, 0]} r={0.06} h={2.6} m={P('#2E3440')} seg={12} />
    <RB p={[0, 2.85, 0]} s={[0.36, 0.42, 0.36]} r={0.1} m={P('#FFF2B0', {emissive: '#FFD860', emissiveIntensity: 0.6})} />
    <RB p={[0, 3.1, 0]} s={[0.46, 0.1, 0.46]} r={0.04} c="#2E3440" />
  </group>
);
const Banco = ({p, rot = 0}) => (
  <group position={p} rotation={[0, rot, 0]}>
    {[0, 1, 2].map((i) => <RB key={i} p={[0, 0.48, -0.15 + i * 0.16]} s={[1.6, 0.06, 0.13]} r={0.025} c="#C4803E" />)}
    {[0, 1].map((i) => <RB key={'e' + i} p={[0, 0.72 + i * 0.16, -0.26]} rot={[-0.15, 0, 0]} s={[1.6, 0.11, 0.05]} r={0.02} c="#C4803E" />)}
    {[-1, 1].map((s) => <RB key={s} p={[s * 0.68, 0.25, 0]} s={[0.08, 0.5, 0.5]} r={0.03} c="#2E3440" />)}
  </group>
);
const Janela = ({p}) => (
  <group position={p}>
    <RB s={[0.95, 0.85, 0.08]} r={0.03} c="#FFFFFF" />
    <RB p={[0, 0, 0.03]} s={[0.8, 0.7, 0.04]} r={0.02} m={P('#8CC4E6', {rough: 0.35, cc: 0.2})} />
    <RB p={[0, 0, 0.06]} s={[0.05, 0.7, 0.03]} r={0.01} c="#FFFFFF" />
    <RB p={[0, 0, 0.06]} s={[0.8, 0.05, 0.03]} r={0.01} c="#FFFFFF" />
    <RB p={[0, -0.5, 0.16]} s={[1.0, 0.18, 0.28]} r={0.05} c="#C4803E" />
    {[0, 1, 2, 3].map((i) => <Bola key={i} p={[-0.33 + i * 0.22, -0.36, 0.17]} s={[0.09, 0.09, 0.09]} m={P(['#FF4F7B', '#FFD400', '#A447FF', '#FF7A3D'][i])} />)}
  </group>
);
const Casa = ({p}) => (
  <group position={p}>
    <RB p={[0, 0.15, 0]} s={[5.3, 0.3, 3.7]} r={0.08} c="#D8D2C8" />
    <RB p={[0, 1.7, 0]} s={[5, 2.9, 3.4]} r={0.12} c="#FFE2B0" />
    {[-1, 1].map((s) => <RB key={s} p={[s * 1.25, 3.55, 0]} rot={[0, 0, s * -0.55]} s={[3.0, 0.22, 3.9]} r={0.08} c="#E2503A" />)}
    <RB p={[1.4, 4.0, -0.6]} s={[0.45, 1.0, 0.45]} r={0.06} c="#B9573C" />
    {/* porta com batente e maçaneta */}
    <RB p={[0, 1.1, 1.72]} s={[1.1, 1.85, 0.1]} r={0.04} c="#FFFFFF" />
    <RB p={[0, 1.08, 1.76]} s={[0.9, 1.7, 0.08]} r={0.05} c="#3D8FE0" />
    <Bola p={[0.3, 1.05, 1.83]} s={[0.06, 0.06, 0.06]} m={OURO} />
    <Janela p={[-1.7, 1.9, 1.72]} />
    <Janela p={[1.7, 1.9, 1.72]} />
  </group>
);
const Nuvem = ({p, t}) => (
  <group position={[p[0] + Math.sin(t * 0.25 + p[0]) * 0.5, p[1], p[2]]}>
    {[[0, 0, 0, 1], [0.9, -0.15, 0, 0.75], [-0.9, -0.2, 0, 0.7], [0.3, 0.45, 0, 0.7]].map(([x, y, z, s], i) => <Bola key={i} p={[x, y, z]} s={[s, s * 0.8, s * 0.8]} m={P('#E6EDF4', {rough: 0.8, cc: 0})} />)}
  </group>
);
// plataformas flutuantes de "fase" e moedas girando: cara de jogo, sem símbolo de nenhuma marca
const Plataformas = ({t}) => (
  <>
    {[[-6, 2.2, -12, '#FF4F7B'], [-3.2, 3.4, -14, '#3D8FE0'], [0.2, 4.6, -15, '#FFD400'], [3.6, 5.6, -14, '#A447FF'], [6.8, 6.6, -12, '#2ECC71']].map(([x, y, z, c], i) => (
      <group key={i} position={[x, y + Math.sin(t * 1.2 + i) * 0.12, z]}>
        <RB s={[2.2, 0.4, 2.2]} r={0.14} c={c} />
        <group position={[0, 0.85, 0]} rotation={[0, t * 2.4 + i, 0]}>
          <Cil r={0.32} h={0.08} rot={[Math.PI / 2, 0, 0]} m={OURO} seg={28} />
          <Cil p={[0, 0, 0.045]} r={0.2} h={0.02} rot={[Math.PI / 2, 0, 0]} m={P('#FFE27A', {rough: 0.3, metalness: 0.5})} seg={28} />
        </group>
      </group>
    ))}
  </>
);
const Praca = ({t}) => {
  const lajes = [];
  for (let z = -5; z <= 6; z++) for (let x = -1; x <= 1; x++) lajes.push(<RB key={x + ',' + z} p={[x * 1.05, 0.03, z * 1.05]} s={[1.0, 0.1, 1.0]} r={0.04} c={rnd(x * 7 + z * 3) > 0.5 ? '#DCC7A0' : '#D0B98F'} />);
  return (
    <>
      <Estatico>
      <RB p={[0, -0.25, -4]} s={[44, 0.5, 34]} r={0.2} c="#7ED957" sombra={false} />
      {[[-6, -2, 3, 2.2], [5.5, 1.5, 2.5, 3], [-4, 3.5, 2, 1.6], [6, -6, 3, 2.4]].map(([x, z, w, d], i) => <RB key={i} p={[x, 0.005, z]} s={[w, 0.03, d]} r={0.01} c="#6FCB4A" sombra={false} />)}
      {lajes}
      <Casa p={[0, 0, -8.5]} />
      <Arvore p={[-4.6, 0, -4.2]} />
      <Arvore p={[5.0, 0, -3.4]} s={1.15} />
      <Arvore p={[-7, 0, -9]} s={0.95} />
      <Arvore p={[7.2, 0, -9.5]} />
      <Arbusto p={[-2.4, 0, -1.2]} />
      <Arbusto p={[2.6, 0, -2.2]} c="#3DAA48" />
      <Arbusto p={[-2.6, 0, 2.6]} c="#3DAA48" />
      <Poste p={[-2.1, 0, 0.8]} />
      <Poste p={[2.1, 0, -4.4]} />
      <Banco p={[3.0, 0, 1.2]} rot={-0.9} />
      {/* cerca branca */}
      {Array.from({length: 9}).map((_, i) => <RB key={'c' + i} p={[-9 + i * 0.9, 0.45, -5.6]} s={[0.12, 0.9, 0.12]} r={0.04} c="#FFFFFF" />)}
      <RB p={[-5.4, 0.6, -5.6]} s={[7.4, 0.08, 0.06]} r={0.03} c="#FFFFFF" />
      </Estatico>
      <Plataformas t={t} />
      <Nuvem p={[-4, 10, -18]} t={t} />
      <Nuvem p={[5, 12, -20]} t={t} />
      <Nuvem p={[0, 14, -24]} t={t} />
    </>
  );
};

// ================= banheiro =================
const Banheiro = ({t, ligado}) => {
  const azul = [];
  const TA = 0.4;
  for (let i = 0; i < 13; i++) for (let j = 0; j < 12; j++) {
    const faixa = j === 4;
    azul.push(<RB key={'p' + i + '-' + j} p={[-2.4 + i * TA, 0.2 + j * TA, -2.0]} s={[0.37, 0.37, 0.06]} r={0.04} c={faixa ? '#1FB5A8' : (i + j) % 2 ? '#93C6E2' : '#ABD3EA'} sombra={false} />);
  }
  for (let i = 0; i < 9; i++) for (let j = 0; j < 12; j++) {
    const faixa = j === 4;
    azul.push(<RB key={'l' + i + '-' + j} p={[-2.6, 0.2 + j * TA, -1.8 + i * TA]} s={[0.06, 0.37, 0.37]} r={0.04} c={faixa ? '#1FB5A8' : (i + j) % 2 ? '#93C6E2' : '#ABD3EA'} sombra={false} />);
  }
  for (let i = 0; i < 13; i++) for (let k = 0; k < 10; k++) azul.push(<RB key={'f' + i + '-' + k} p={[-2.4 + i * TA, -0.03, -1.8 + k * TA]} s={[0.38, 0.06, 0.38]} r={0.03} c={(i + k) % 2 ? '#C9B497' : '#B9A283'} sombra={false} />);
  // água: gotas alongadas e translúcidas que param na cabeça e nos ombros dele
  const gotas = [];
  if (ligado) for (let i = 0; i < 46; i++) {
    const fase = (t * 1.7 + rnd(i)) % 1;
    const x = (rnd(i * 3.1) - 0.5) * 1.1, z = (rnd(i * 7.3) - 0.5) * 0.5;
    const fim = Math.abs(x) < 0.32 ? 2.3 : Math.abs(x) < 0.62 ? 1.6 : 0.05;
    gotas.push(<mesh key={i} position={[x + 0.2, 3.5 - fase * (3.5 - fim), z - 0.85 + fase * 0.25]} material={P('#5FB8EE', {rough: 0.3, cc: 0, transparent: true, opacity: 0.7})} geometry={GOTA} />);
  }
  return (
    <>
      {gotas}
      <Estatico>
      <RB p={[0.2, 2.4, -2.06]} s={[5.4, 5.0, 0.04]} r={0.01} c="#6F8597" sombra={false} />
      {azul}
      {/* chuveiro elétrico: cano cromado, corpo branco, crivo com furinhos, seletor vermelho */}
      <Cil p={[0.2, 4.3, -1.85]} r={0.05} h={0.8} m={CROMO} seg={14} />
      <Cil p={[0.2, 3.9, -1.5]} r={0.05} h={0.7} rot={[Math.PI / 2, 0, 0]} m={CROMO} seg={14} />
      <RB p={[0.2, 3.82, -1.0]} s={[0.56, 0.42, 0.56]} r={0.16} c="#E4E6EA" />
      <Cil p={[0.2, 3.58, -0.98]} r={0.22} h={0.08} m={P('#C5CCD6', {rough: 0.3, metalness: 0.4})} seg={28} />
      {Array.from({length: 12}).map((_, i) => <Cil key={i} p={[0.2 + Math.cos(i / 12 * 6.28) * 0.13, 3.535, -0.98 + Math.sin(i / 12 * 6.28) * 0.13]} r={0.018} h={0.01} m={P('#556070')} seg={8} />)}
      <Cil p={[0.2 + 0.3, 3.86, -1.0]} r={0.06} h={0.08} rot={[0, 0, Math.PI / 2]} m={P('#E53935', {rough: 0.3, cc: 0.3})} seg={16} />
      {/* registro */}
      <Cil p={[1.3, 1.7, -1.93]} r={0.12} h={0.06} rot={[Math.PI / 2, 0, 0]} m={CROMO} seg={20} />
      <RB p={[1.3, 1.7, -1.86]} s={[0.26, 0.05, 0.05]} r={0.02} m={CROMO} />
      {/* pia com espelho, toalha, plantinha e frascos */}
      <group position={[-1.6, 0, 0.6]} rotation={[0, Math.PI / 2, 0]}>
        <RB p={[0, 0.45, 0]} s={[0.3, 0.9, 0.3]} r={0.1} c="#FFFFFF" />
        <RB p={[0, 0.98, 0]} s={[0.9, 0.2, 0.6]} r={0.08} c="#FFFFFF" />
        <Cil p={[0, 1.15, -0.2]} r={0.03} h={0.2} m={CROMO} seg={10} />
        <RB p={[0, 1.95, -0.85]} s={[0.9, 1.1, 0.06]} r={0.08} c="#C4803E" />
        <RB p={[0, 1.95, -0.8]} s={[0.76, 0.96, 0.03]} r={0.06} m={P('#B9CCDA', {rough: 0.3, metalness: 0.4})} />
      </group>
      <Cil p={[-0.9, 2.6, -1.92]} r={0.025} h={1.0} rot={[0, 0, Math.PI / 2]} m={CROMO} seg={10} />
      <RB p={[-0.9, 2.22, -1.88]} s={[0.7, 0.8, 0.06]} r={0.04} c="#FF8FA8" />
      <RB p={[-0.9, 2.55, -1.84]} s={[0.72, 0.1, 0.07]} r={0.03} c="#FFFFFF" />
      <RB p={[1.6, 1.25, -1.82]} s={[1.0, 0.06, 0.3]} r={0.02} c="#FFFFFF" />
      {[['#FFD400', 0.22], ['#A447FF', 0.3], ['#2ECC71', 0.18]].map(([c, h], i) => <RB key={i} p={[1.3 + i * 0.28, 1.28 + h / 2, -1.82]} s={[0.16, h, 0.14]} r={0.05} c={c} />)}
      <Cil p={[1.85, 0.25, 0.9]} r={0.22} h={0.5} m={P('#D9774B', {rough: 0.6})} />
      {[[0, 0.75, 0], [0.15, 0.65, 0.1], [-0.14, 0.68, -0.05]].map(([x, y, z], i) => <Bola key={i} p={[1.85 + x, y, 0.9 + z]} s={[0.24, 0.3, 0.24]} m={P('#3FAE3A', {rough: 0.5})} />)}
      <RB p={[0.9, 0.02, 0.9]} s={[1.2, 0.04, 0.8]} r={0.02} c="#FF8FA8" />
      </Estatico>
    </>
  );
};

// confete de pecinhas na comemoração
const Confete = ({t}) => (
  <>
    {Array.from({length: 40}).map((_, i) => {
      const fase = (t * 0.5 + rnd(i * 2.3)) % 1;
      return <RB key={i} p={[(rnd(i) - 0.5) * 5, 5 - fase * 5, (rnd(i * 5.1) - 0.5) * 2.5]} rot={[t * 3 + i, t * 2 + i, 0]} s={[0.1, 0.1, 0.03]} r={0.012} c={['#FF4F7B', '#FFD400', '#3D8FE0', '#2ECC71', '#A447FF'][i % 5]} sombra={false} />;
    })}
  </>
);

// ================= legenda no molde do elevador =================
const Legenda = ({palavras, t0, wps = 3.1, amarela = []}) => {
  const frame = useCurrentFrame();
  const t = frame / 30 - t0;
  if (t < 0 || t > palavras.length / wps + 0.6) return null;
  const i = Math.min(palavras.length - 1, Math.floor(t * wps));
  return (
    <div style={{position: 'absolute', left: 0, width: 972, top: 1290, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 64, color: amarela.includes(i) ? YELLOW : 'white', WebkitTextStroke: '10px black', paintOrder: 'stroke fill', textShadow: '0 6px 14px rgba(0,0,0,0.45)'}}>{palavras[i]}</div>
  );
};

const CENAS = [0, 5, 10.2, 15];
export const DUR_ROBLOX = 600;
const Canvas = ({children, cam, look, fov = 40, area = 8}) => (
  <ThreeCanvas width={W} height={H} flat dpr={Q.dpr} shadows={Q.sombra > 0} gl={{antialias: Q.aa}} camera={{fov, position: [0, 3, 10]}}>
    <Cam pos={cam} look={look} fov={fov} />
    <Ambiente />
    <LuzJogo area={area} />
    {children}
  </ThreeCanvas>
);
const Trio = ({t, aE, aP, aA}) => (
  <>
    <Ele t={t} position={[0, 0, 0.3]} acoes={aE} />
    <Perita t={t} position={[-1.45, 0, 0.6]} rotationY={0.35} scale={0.7} acoes={aP} />
    <Ela t={t} position={[1.45, 0, -0.1]} rotationY={-0.3} acoes={aA} />
  </>
);
const CEU = 'linear-gradient(180deg, #4FA6EE 0%, #86C6F2 55%, #B4DCF5 100%)';

export const PreviaRoblox = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const flash = Math.max(...CENAS.slice(1).map((c) => interpolate(Math.abs(t - c), [0, 0.12], [0.85, 0], {extrapolateRight: 'clamp'})));
  let cena;
  if (t < CENAS[1]) {
    // 1. praça: abre de longe, gira e chega no trio
    const p = ease(t / CENAS[1]);
    const ang = lerp(0.75, -0.2, p), d = lerp(15, 9.4, p);
    cena = (
      <AbsoluteFill style={{background: CEU}}>
        <Canvas cam={[Math.sin(ang) * d, lerp(5.5, 2.6, p), Math.cos(ang) * d]} look={[0, 1.4, -0.5]}>
          <Praca t={t} />
          <Trio t={t} aE={[{t: 0, a: 'acena'}, {t: 2.2, a: 'aponta'}, {t: 3.6, a: 'pensa'}]} aP={[{t: 0, a: 'acena'}, {t: 1.6, a: 'lupa'}, {t: 3.4, a: 'explica'}]} aA={[{t: 0, a: 'acena'}, {t: 2.0, a: 'duvida'}, {t: 3.6, a: 'surpresa'}]} />
        </Canvas>
      </AbsoluteFill>
    );
  } else if (t < CENAS[2]) {
    // 2. banheiro: liga o chuveiro e sai água gelada
    const l = t - CENAS[1];
    const p = ease(Math.min(1, l / 5.2));
    cena = (
      <AbsoluteFill style={{background: '#A9CFE3'}}>
        <Canvas cam={lerp3([1.8, 3.4, 8.4], [0.3, 2.4, 6.4], p)} look={lerp3([0.2, 2.0, -0.8], [-0.3, 1.4, -0.6], p)} area={5}>
          <Banheiro t={l} ligado={l > 0.8} />
          <Ele t={l} position={[0.2, 0, -0.75]} acoes={[{t: 0, a: 'parado'}, {t: 0.5, a: 'apontaCima'}, {t: 1.5, a: 'surpresa'}, {t: 3.0, a: 'duvida'}]} />
          <Perita t={l} position={[-1.0, 0, 0.55]} rotationY={0.45} scale={0.65} acoes={[{t: 0, a: 'parado'}, {t: 1.8, a: 'peraAi'}, {t: 3.2, a: 'lupa'}]} />
        </Canvas>
        <Legenda t0={CENAS[1] + 0.3} palavras={['Se', 'você', 'liga', 'o', 'chuveiro', 'e', 'sai', 'água', 'gelada…', 'a', 'culpa', 'é', 'da', 'resistência.']} amarela={[4, 13]} />
      </AbsoluteFill>
    );
  } else if (t < CENAS[3]) {
    // 3. closes: rosto dele pensando, depois a Perita com a lupa
    const l = t - CENAS[2];
    const p = ease(clamp(l / 2.2)), q = ease(clamp((l - 2.4) / 1.1));
    const cam = lerp3(lerp3([1.0, 2.05, 4.2], [0.4, 1.95, 3.1], p), [-0.85, 1.15, 4.3], q);
    const look = lerp3([0, 1.85, 0.3], [-1.45, 0.72, 0.6], q);
    cena = (
      <AbsoluteFill style={{background: CEU}}>
        <Canvas cam={cam} look={look} fov={36}>
          <Praca t={t} />
          <Trio t={t} aE={[{t: 0, a: 'pensa'}, {t: 1.6, a: 'duvida'}]} aP={[{t: 0, a: 'parado'}, {t: 2.5, a: 'lupa'}, {t: 4.0, a: 'peraAi'}]} aA={[{t: 0, a: 'pensa'}]} />
        </Canvas>
        <Legenda t0={CENAS[2] + 0.4} palavras={['Mas', 'por', 'que', 'ela', 'esfria', 'no', 'inverno?']} amarela={[4]} />
      </AbsoluteFill>
    );
  } else {
    // 4. comemoração com plataformas e confete
    const l = t - CENAS[3];
    const p = ease(clamp(l / 5));
    cena = (
      <AbsoluteFill style={{background: CEU}}>
        <Canvas cam={lerp3([-1.1, 1.2, 9.8], [-0.5, 1.7, 11.0], p)} look={lerp3([-0.7, 2.0, -2], [-0.6, 2.4, -3], p)}>
          <Praca t={t} />
          <Trio t={l} aE={[{t: 0, a: 'surpresa'}, {t: 0.6, a: 'comemora'}]} aP={[{t: 0, a: 'pulo'}]} aA={[{t: 0, a: 'comemora'}]} />
          <Confete t={l} />
        </Canvas>
        <Legenda t0={CENAS[3] + 0.4} palavras={['Parabéns!', 'Você', 'entendeu', 'o', 'chuveiro.']} amarela={[4]} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      {cena}
      <AbsoluteFill style={{background: '#9CCBEA', opacity: flash * 0.45}} />
    </AbsoluteFill>
  );
};
const clamp = (x) => Math.max(0, Math.min(1, x));

// folha de modelo: ele, ela e a Perita de frente, 3/4 e perfil
export const FolhaRoblox = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #4FB0FF 0%, #E4F5FF 100%)'}}>
    <ThreeCanvas width={W} height={H} flat dpr={Q.dpr} shadows={Q.sombra > 0} gl={{antialias: Q.aa}} camera={{fov: 30, position: [0, 2, 6]}}>
      <Cam pos={[0, 2.6, 21]} look={[0, 2.1, 0]} fov={30} />
      <Ambiente />
      <LuzJogo area={10} />
      {[0, 0.8, 1.57].map((r, i) => <Ele key={'e' + i} t={0.5} position={[(i - 1) * 1.9, 4.5, 0]} rotationY={r} />)}
      {[0, 0.8, 1.57].map((r, i) => <Ela key={'a' + i} t={0.5} position={[(i - 1) * 1.9, 1.75, 0]} rotationY={r} />)}
      {[0, 0.8, 1.57].map((r, i) => <Perita key={'p' + i} t={0.5} position={[(i - 1) * 1.9, -0.8, 0]} rotationY={r} />)}
    </ThreeCanvas>
  </AbsoluteFill>
);
