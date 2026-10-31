// Prévia do estilo "em blocos": praça de blocos com o trio e banheiro de blocos (teste para o chuveiro).
import React from 'react';
import {AbsoluteFill, useCurrentFrame, Easing, interpolate} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Cam, rnd} from './three-common';
import {Ele, Ela, Perita, LuzBlocos, Bloco} from './personagens-blocos';
import {FONT, YELLOW} from './lib';

const W = 1080, H = 1920;
const ease = Easing.inOut(Easing.cubic);
const lerp = (a, b, p) => a + (b - a) * p;
const lerp3 = (a, b, p) => a.map((v, i) => lerp(v, b[i], p));

// ---------------- cenário 1: praça de blocos ----------------
const Chao = () => {
  const tiles = [];
  for (let x = -8; x <= 8; x++) for (let z = -10; z <= 4; z++) {
    const caminho = Math.abs(x) <= 1 && z > -6;
    const h = caminho ? 0 : Math.floor(rnd(x * 31 + z * 7) * 3) * 0.04;
    const c = caminho ? (rnd(x + z * 13) > 0.5 ? '#F2D59A' : '#E8C784') : (rnd(x * 5 + z * 17) > 0.5 ? '#6CCB4F' : '#5DBA43');
    tiles.push(<Bloco key={x + ',' + z} p={[x, -0.25 + h, z]} s={[1, 0.5, 1]} c={c} linha={0.02} />);
  }
  return <>{tiles}</>;
};
const Arvore = ({p, s = 1}) => (
  <group position={p} scale={s}>
    <Bloco p={[0, 0.7, 0]} s={[0.4, 1.4, 0.4]} c="#8A5A2B" />
    <Bloco p={[0, 1.9, 0]} s={[1.5, 1.1, 1.5]} c="#3FAE3A" />
    <Bloco p={[0, 2.7, 0]} s={[0.9, 0.6, 0.9]} c="#52C447" />
  </group>
);
const Flor = ({p, c}) => (
  <group position={p}>
    <Bloco p={[0, 0.15, 0]} s={[0.06, 0.3, 0.06]} c="#2E8B2E" linha={0} />
    <Bloco p={[0, 0.34, 0]} s={[0.18, 0.12, 0.18]} c={c} linha={0.02} />
  </group>
);
const Casa = ({p}) => (
  <group position={p}>
    <Bloco p={[0, 1.4, 0]} s={[4.4, 2.8, 3]} c="#FFE6B8" />
    {[0, 1, 2].map((i) => <Bloco key={i} p={[0, 3.0 + i * 0.4, 0]} s={[4.8 - i * 1.3, 0.4, 3.4]} c={i % 2 ? '#E8513A' : '#D0402C'} />)}
    <Bloco p={[0, 0.75, 1.52]} s={[0.9, 1.5, 0.08]} c="#3D8FE0" />
    {[-1, 1].map((s) => <Bloco key={s} p={[s * 1.4, 1.7, 1.52]} s={[0.8, 0.7, 0.08]} c="#BFE8FF" />)}
  </group>
);
const Nuvem = ({p, t}) => (
  <group position={[p[0] + Math.sin(t * 0.3 + p[0]) * 0.4, p[1], p[2]]}>
    <Bloco s={[2.2, 0.6, 1.2]} c="#FFFFFF" linha={0} />
    <Bloco p={[0.3, 0.45, 0]} s={[1.2, 0.5, 1]} c="#FFFFFF" linha={0} />
  </group>
);
const Praca = ({t}) => (
  <>
    <Chao />
    <Casa p={[0, 0, -7.5]} />
    <Arvore p={[-4.5, 0, -4]} />
    <Arvore p={[4.8, 0, -3]} s={1.15} />
    <Arvore p={[-6.5, 0, -8]} s={0.9} />
    <Arvore p={[6.5, 0, -8.5]} />
    {[[-2.6, 1.2, '#FF4F7B'], [2.5, 0.6, '#FFD400'], [-3.2, -1.4, '#A447FF'], [3.4, -1.8, '#FF4F7B'], [2.2, 2.4, '#A447FF'], [-2.2, 2.6, '#FFD400']].map(([x, z, c], i) => <Flor key={i} p={[x, 0, z]} c={c} />)}
    <Nuvem p={[-3, 9, -14]} t={t} />
    <Nuvem p={[4, 11, -16]} t={t} />
  </>
);

// ---------------- cenário 2: banheiro de blocos com chuveiro ----------------
const Banheiro = ({t, ligado}) => {
  const azulejos = [];
  for (let x = -3; x <= 3; x++) for (let y = 0; y < 7; y++) azulejos.push(<Bloco key={'p' + x + y} p={[x * 0.8, y * 0.8 + 0.4, -2.0]} s={[0.78, 0.78, 0.2]} c={(x + y) % 2 ? '#BFE6FF' : '#E9F7FF'} linha={0.02} />);
  for (let z = -2; z <= 2; z++) for (let y = 0; y < 7; y++) azulejos.push(<Bloco key={'l' + z + y} p={[-2.9, y * 0.8 + 0.4, z * 0.8 - 0.4]} s={[0.2, 0.78, 0.78]} c={(z + y) % 2 ? '#BFE6FF' : '#E9F7FF'} linha={0.02} />);
  const piso = [];
  for (let x = -3; x <= 3; x++) for (let z = -2; z <= 3; z++) piso.push(<Bloco key={'c' + x + z} p={[x * 0.8, -0.1, z * 0.8 - 0.4]} s={[0.8, 0.2, 0.8]} c={(x + z) % 2 ? '#FFFFFF' : '#D9DEE6'} linha={0.02} />);
  // gotas de água: cubinhos caindo do chuveiro (determinístico)
  const gotas = [];
  if (ligado) for (let i = 0; i < 40; i++) {
    const fase = (t * 1.6 + rnd(i)) % 1;
    const x = (rnd(i * 3.1) - 0.5) * 1.1, z = (rnd(i * 7.3) - 0.5) * 0.6 + 0.1;
    // a água para na cabeça e nos ombros dele (não atravessa o corpo)
    const fim = Math.abs(x) < 0.32 ? 2.12 : Math.abs(x) < 0.62 ? 1.5 : 0.05;
    gotas.push(<mesh key={i} position={[x + 0.2, 3.35 - fase * (3.35 - fim), z - 0.9 + fase * 0.3]}><boxGeometry args={[0.06, 0.14, 0.06]} /><meshStandardMaterial color="#5EC8FF" transparent opacity={0.85} /></mesh>);
  }
  return (
    <>
      {azulejos}
      {piso}
      {/* cano, chuveiro elétrico (caixa branca com bocal) e registro */}
      <Bloco p={[0.2, 4.2, -1.75]} s={[0.12, 0.9, 0.12]} c="#C9CED6" />
      <Bloco p={[0.2, 3.65, -1.45]} s={[0.12, 0.12, 0.6]} c="#C9CED6" />
      <Bloco p={[0.2, 3.55, -1.0]} s={[0.55, 0.4, 0.55]} c="#FFFFFF" />
      <Bloco p={[0.2, 3.3, -0.95]} s={[0.4, 0.1, 0.4]} c="#9AA3AE" />
      <Bloco p={[1.4, 1.8, -1.85]} s={[0.25, 0.25, 0.15]} c="#C9CED6" />
      {gotas}
      {/* tapete e frasco */}
      <Bloco p={[1.6, 0.03, 1.0]} s={[1.2, 0.06, 0.8]} c="#FF8FA8" linha={0.02} />
      <Bloco p={[-2.55, 0.3, -1.6]} s={[0.25, 0.4, 0.25]} c="#FFD400" />
    </>
  );
};

// ---------------- legenda no molde do elevador: 1 palavra, ~60 px, inicial maiúscula ----------------
const Legenda = ({palavras, t0, wps = 3.1, amarela = []}) => {
  const frame = useCurrentFrame();
  const t = frame / 30 - t0;
  if (t < 0) return null;
  const i = Math.min(palavras.length - 1, Math.floor(t * wps));
  const w = palavras[i];
  return (
    <div style={{position: 'absolute', left: 0, width: 972, top: 1290, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 64, color: amarela.includes(i) ? YELLOW : 'white', WebkitTextStroke: '10px black', paintOrder: 'stroke fill', textShadow: '0 6px 14px rgba(0,0,0,0.45)'}}>{w}</div>
  );
};

export const DUR_BLOCOS = 300;
const CORTE = 4.6;
export const PreviaBlocos = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const flash = interpolate(Math.abs(t - CORTE), [0, 0.12], [0.85, 0], {extrapolateRight: 'clamp'});
  if (t < CORTE) {
    const p = ease(Math.min(1, t / CORTE));
    const ang = lerp(0.7, -0.25, p), d = lerp(13.5, 9.6, p);
    return (
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #58B7FF 0%, #A8DCFF 55%, #E6F6FF 100%)'}}>
        <ThreeCanvas width={W} height={H} flat gl={{antialias: true}} camera={{fov: 40, position: [0, 3, 10]}}>
          <Cam pos={[Math.sin(ang) * d, lerp(4.6, 2.4, p), Math.cos(ang) * d]} look={[0, 1.3, -0.5]} fov={40} />
          <LuzBlocos />
          <Praca t={t} />
          <Ele t={t} position={[0, 0, 0.3]} acoes={[{t: 0, a: 'acena'}, {t: 1.6, a: 'pensa'}, {t: 3.0, a: 'comemora'}]} />
          <Perita t={t} position={[-1.45, 0, 0.6]} rotationY={0.35} scale={0.7} acoes={[{t: 0, a: 'acena'}, {t: 1.4, a: 'lupa'}, {t: 3.0, a: 'pulo'}]} />
          <Ela t={t} position={[1.45, 0, -0.1]} rotationY={-0.3} acoes={[{t: 0, a: 'acena'}, {t: 1.6, a: 'duvida'}, {t: 3.0, a: 'comemora'}]} />
        </ThreeCanvas>
        <AbsoluteFill style={{background: 'white', opacity: flash}} />
      </AbsoluteFill>
    );
  }
  const l = t - CORTE;
  const p = ease(Math.min(1, l / 5.4));
  const ligado = l > 0.7;
  return (
    <AbsoluteFill style={{background: '#DFF3FF'}}>
      <ThreeCanvas width={W} height={H} flat gl={{antialias: true}} camera={{fov: 40, position: [0, 3, 8]}}>
        <Cam pos={lerp3([1.6, 3.4, 8.6], [0.2, 2.3, 6.6], p)} look={lerp3([0.2, 1.9, -0.8], [-0.3, 1.35, -0.6], p)} fov={40} />
        <LuzBlocos />
        <Banheiro t={l} ligado={ligado} />
        <Ele t={l} position={[0.2, 0, -0.75]} acoes={[{t: 0, a: 'parado'}, {t: 0.6, a: 'apontaCima'}, {t: 1.4, a: 'surpresa'}, {t: 2.6, a: 'duvida'}]} />
        <Perita t={l} position={[-1.05, 0, 0.5]} rotationY={0.45} scale={0.65} acoes={[{t: 0, a: 'parado'}, {t: 1.6, a: 'peraAi'}, {t: 2.8, a: 'lupa'}]} />
      </ThreeCanvas>
      <Legenda t0={CORTE + 0.3} palavras={['Se', 'você', 'liga', 'o', 'chuveiro', 'e', 'sai', 'água', 'gelada…', 'a', 'culpa', 'é', 'da', 'resistência.']} amarela={[4, 13]} />
      <AbsoluteFill style={{background: 'white', opacity: flash}} />
    </AbsoluteFill>
  );
};

// folha de modelo: ele, ela e a Perita de frente, 3/4 e perfil
export const FolhaBlocos = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #58B7FF 0%, #E6F6FF 100%)'}}>
    <ThreeCanvas width={W} height={H} flat gl={{antialias: true}} camera={{fov: 30, position: [0, 2, 6]}}>
      <Cam pos={[0, 2.6, 21]} look={[0, 2.1, 0]} fov={30} />
      <LuzBlocos />
      {[0, 0.8, 1.57].map((r, i) => <Ele key={'e' + i} t={0.5} position={[(i - 1) * 1.9, 4.5, 0]} rotationY={r} />)}
      {[0, 0.8, 1.57].map((r, i) => <Ela key={'a' + i} t={0.5} position={[(i - 1) * 1.9, 1.75, 0]} rotationY={r} />)}
      {[0, 0.8, 1.57].map((r, i) => <Perita key={'p' + i} t={0.5} position={[(i - 1) * 1.9, -0.8, 0]} rotationY={r} />)}
    </ThreeCanvas>
  </AbsoluteFill>
);
