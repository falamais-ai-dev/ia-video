// Demo 2 (3D): cilindro com os 365 dias; 23 bolinhas voam e grudam no dia de aniversário; duas caem no mesmo dia -> confete.
import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {Cam, rnd} from './three-common';
import {CapB, seqWords} from './captions';
import {HandCircle, f} from './lib';

export const D2_DUR = f(7.5);
const COLS = 24, ROWS = 16, R = 3.6, TW = 0.82, TH = 0.5, GAP_Y = 0.6;
const MONTH = ['#ff595e', '#ff924c', '#ffca3a', '#c5ca30', '#8ac926', '#52a675', '#36949d', '#1982c4', '#4267ac', '#6a4c93', '#b5179e', '#ff70a6'];
const DAYS_IN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthOf = (d) => { let m = 0, acc = 0; while (d >= acc + DAYS_IN[m]) { acc += DAYS_IN[m]; m++; } return m; };
const tilePos = (d) => {
  const col = d % COLS, row = Math.floor(d / COLS);
  const a = (col / COLS) * Math.PI * 2;
  return {a, x: Math.sin(a) * R, y: (ROWS / 2 - row - 0.5) * GAP_Y, z: Math.cos(a) * R};
};
// 23 aniversários; o último cai no mesmo dia do 9º
const MATCH = 9;
const BDAYS = Array.from({length: 23}, (_, k) => Math.floor(rnd(k + 3) * 365));
BDAYS[MATCH] = 7 * COLS + 5; // dia no meio do cilindro
BDAYS[22] = BDAYS[MATCH];
const BALL_COLORS = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ff924c', '#ff70a6'];
const FLY0 = f(0.6), FLY_STEP = 4, FLY_DUR = 12;
const landAt = (k) => FLY0 + k * FLY_STEP + FLY_DUR + (k === 22 ? 10 : 0);
const BURST = landAt(22);

export const D2Calendario = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const tp = tilePos(BDAYS[22]);
  // gira o cilindro para que o dia repetido termine de frente para a câmera
  const rotEnd = -tp.a;
  const rot = interpolate(frame, [0, BURST, D2_DUR], [rotEnd + 2.4, rotEnd, rotEnd], {easing: Easing.out(Easing.cubic)});
  const lit = useMemo(() => new Map(), []);
  lit.clear();
  BDAYS.forEach((d, k) => { if (frame >= landAt(k)) lit.set(d, (lit.get(d) || 0) + 1); });


  const camZ = interpolate(frame, [0, BURST - 30, BURST, D2_DUR], [21, 18.5, 10.5, 9.6], {easing: Easing.inOut(Easing.cubic)});
  const camY = interpolate(frame, [0, BURST], [1.5, tp.y + 0.4], {extrapolateRight: 'clamp'});
  const lookY = interpolate(frame, [0, BURST], [0, tp.y], {extrapolateRight: 'clamp'});
  // projeta o dia repetido na tela para o círculo desenhado cair em cima dele
  const pc = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  pc.position.set(0, camY, camZ); pc.lookAt(0, lookY, 0); pc.updateMatrixWorld();
  const scr = new THREE.Vector3(tp.x, tp.y, tp.z).applyAxisAngle(new THREE.Vector3(0, 1, 0), rot).project(pc);
  const sx = (scr.x + 1) / 2 * width, sy = (1 - scr.y) / 2 * height;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%,#ffd36e 0%,#ff8a3d 50%,#e8505b 100%)'}}>
      <ThreeCanvas flat width={width} height={height} camera={{fov: 40, position: [0, 0, 12]}}>
        <Cam pos={[0, camY, camZ]} look={[0, lookY, 0]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 6, 8]} intensity={2} color="#fff4e0" />
        <group rotation={[0, rot, 0]}>
          <Tiles frame={frame} lit={lit} />
          {BDAYS.map((d, k) => <Ball key={k} k={k} d={d} frame={frame} rot={rot} camZ={camZ} />)}
          <Confetti frame={frame} at={new THREE.Vector3(tp.x, tp.y, tp.z)} />
        </group>
      </ThreeCanvas>
      {frame >= BURST && <HandCircle x={sx} y={sy} rx={130} ry={100} delay={BURST + 2} sw={14} />}
      <CapB words={[...seqWords('23 aniversários', f(0.6), 14), ...seqWords('caem no calendário...', f(1.8), 11), ...seqWords('dois no mesmo dia!', BURST, 9)]} />
    </AbsoluteFill>
  );
};

// bolinha voa da frente da câmera até o dia (coordenadas do grupo que gira)
const Ball = ({k, d, frame, rot, camZ}) => {
  const t0 = landAt(k) - FLY_DUR;
  if (frame < t0) return null;
  const p = Math.min(1, (frame - t0) / FLY_DUR);
  const e = Easing.in(Easing.quad)(p);
  const tp = tilePos(d);
  const n = new THREE.Vector3(Math.sin(tp.a), 0, Math.cos(tp.a));
  const end = new THREE.Vector3(tp.x, tp.y + (k === 22 ? 0.0 : 0), tp.z).addScaledVector(n, 0.22).addScaledVector(new THREE.Vector3(n.z, 0, -n.x), k === 22 ? 0.2 : k === MATCH ? -0.2 : 0);
  // ponto de partida: perto da câmera, em coordenadas do mundo, convertido para o grupo
  const startW = new THREE.Vector3((rnd(k) - 0.5) * 6, 3 + rnd(k + 9) * 3, camZ - 3);
  const start = startW.applyAxisAngle(new THREE.Vector3(0, 1, 0), -rot);
  const pos = start.lerp(end, e);
  const sq = p >= 1 ? 1 + 0.4 * Math.exp(-(frame - landAt(k)) / 4) * Math.sin((frame - landAt(k)) * 1.2) : 1;
  return (
    <mesh position={pos} scale={[sq, 1 / sq, sq]}>
      <sphereGeometry args={[0.22, 20, 14]} />
      <meshStandardMaterial color={BALL_COLORS[k % BALL_COLORS.length]} roughness={0.25} emissive={k === 22 ? '#664400' : '#000000'} />
    </mesh>
  );
};

// confete: posição analítica (v·t + g·t²/2), girando
const CONF = Array.from({length: 260}, (_, i) => ({
  v: new THREE.Vector3((rnd(i) - 0.5) * 0.45, (rnd(i + 1) - 0.3) * 0.25, 0.08 + rnd(i + 2) * 0.3),
  c: ['#ffffff', '#fff36b', '#5ce1e6', '#ff70a6', '#8ac926'][i % 5], s: rnd(i + 5),
}));
const Confetti = ({frame, at}) => {
  const t = frame - BURST;
  if (t < 0) return null;
  const n = new THREE.Vector3(at.x, 0, at.z).normalize();
  const side = new THREE.Vector3(n.z, 0, -n.x);
  return CONF.map(({v, c, s}, i) => {
    const p = at.clone().addScaledVector(n, v.z * t).addScaledVector(side, v.x * t).add(new THREE.Vector3(0, v.y * t - 0.006 * t * t, 0));
    return (
      <mesh key={i} position={p} rotation={[t * 0.2 + s * 6, t * 0.13 + s * 3, 0]}>
        <planeGeometry args={[0.09, 0.05]} />
        <meshBasicMaterial color={c} side={THREE.DoubleSide} />
      </mesh>
    );
  });
};

// os 365 dias (instancedMesh); cor e tamanho atualizados a cada quadro
const Tiles = ({frame, lit}) => {
  const tiles = useRef();
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), c = new THREE.Color();
    for (let d = 0; d < 365; d++) {
      const p = tilePos(d);
      const hits = lit.get(d) || 0;
      const pulse = hits >= 2 ? 1 + 0.25 * Math.max(0, Math.sin((frame - BURST) / 3)) * Math.exp(-(frame - BURST) / 25) : 1;
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), p.a);
      m.compose(new THREE.Vector3(p.x, p.y, p.z), q, new THREE.Vector3(pulse, pulse, hits ? 1.6 : 1));
      tiles.current.setMatrixAt(d, m);
      if (hits >= 2) c.set('#fff36b'); else if (hits === 1) c.set('#ffffff'); else c.set(MONTH[monthOf(d)]).lerp(new THREE.Color('#ffffff'), 0.15);
      tiles.current.setColorAt(d, c);
    }
    tiles.current.instanceMatrix.needsUpdate = true;
    tiles.current.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh ref={tiles} args={[null, null, 365]}>
      <boxGeometry args={[TW, TH, 0.08]} />
      <meshStandardMaterial roughness={0.45} />
    </instancedMesh>
  );
};
