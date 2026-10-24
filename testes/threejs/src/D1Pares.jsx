// Demo 1 (3D): 23 bonequinhos em roda e as 253 ligações entre pares sendo desenhadas.
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {CapA} from './captions';
import {useThree} from '@react-three/fiber';
import {NumBadge, Label, f} from './lib';

export const D1_DUR = f(7);
const N = 23, R = 3.4;
const PALETTE = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ff924c', '#52a675', '#4267ac', '#c5ca30', '#ff70a6'];
const LINE_START = f(1.2), LINE_STEP = 0.5; // 253 linhas em ~4,2 s
const heads = Array.from({length: N}, (_, i) => {
  const a = (i / N) * Math.PI * 2;
  return new THREE.Vector3(Math.cos(a) * R, 1.05, Math.sin(a) * R);
});
const PAIRS = [];
for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) PAIRS.push([i, j]);
// ordem embaralhada fixa, para a teia crescer espalhada
const order = PAIRS.map((p, k) => [p, Math.sin(k * 12.9898) * 43758.5453 % 1]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);

const Person = ({i, frame, fps}) => {
  const a = (i / N) * Math.PI * 2;
  const color = PALETTE[i % PALETTE.length];
  const t = frame + 6 - i * 0.7; // entram um a um
  const s = interpolate(t, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
  const bob = Math.sin((frame + i * 7) / 9) * 0.04;
  return (
    <group position={[Math.cos(a) * R, bob, Math.sin(a) * R]} scale={s}>
      <mesh position={[0, 0.45, 0]}><capsuleGeometry args={[0.24, 0.42, 6, 16]} /><meshStandardMaterial color={color} roughness={0.35} /></mesh>
      <mesh position={[0, 1.05, 0]}><sphereGeometry args={[0.22, 24, 16]} /><meshStandardMaterial color="#ffd7b0" roughness={0.5} /></mesh>
    </group>
  );
};

const Web = ({frame}) => {
  const tubes = useMemo(() => order.map(([i, j], k) => {
    const a = heads[i], b = heads[j];
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += 0.6 + a.distanceTo(b) * 0.35;
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const g = new THREE.TubeGeometry(curve, 20, 0.026, 5, false);
    return {g, color: new THREE.Color().setHSL((k * 0.137) % 1, 0.95, 0.5)};
  }), []);
  return tubes.map(({g, color}, k) => {
    const p = Math.max(0, Math.min(1, (frame - LINE_START - k * LINE_STEP) / 8));
    g.setDrawRange(0, Math.floor(g.index.count * p / 3) * 3);
    return p > 0 ? <mesh key={k} geometry={g}><meshBasicMaterial color={color} /></mesh> : null;
  });
};

export const D1Pares = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const ang = interpolate(frame, [0, D1_DUR], [0.2, 1.1]);
  const z = interpolate(frame, [0, D1_DUR], [0, 1], {easing: Easing.inOut(Easing.cubic)});
  const hd = 11 - 2 * z, hy = 14 - 2.2 * z; // câmera alta olhando a roda de cima, aproximando
  const camPos = [Math.sin(ang) * hd, hy, Math.cos(ang) * hd];
  const drawn = Math.min(253, Math.max(0, Math.floor((frame - LINE_START) / LINE_STEP)));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#ffb347 0%,#ff6f61 55%,#d6336c 100%)'}}>
      <ThreeCanvas flat width={width} height={height} camera={{fov: 48, position: camPos}} onCreated={({camera}) => camera.lookAt(0, 0.6, 0)}>
        <CamLook pos={camPos} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 8, 5]} intensity={2.2} color="#fff1d6" />
        <hemisphereLight args={['#ffe0b0', '#c2185b', 0.6]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}><circleGeometry args={[4.1, 64]} /><meshStandardMaterial color="#fff3dc" roughness={0.9} /></mesh>
        {Array.from({length: N}, (_, i) => <Person key={i} i={i} frame={frame} fps={fps} />)}
        <Web frame={frame} />
      </ThreeCanvas>
      <CapA items={[{from: 0, to: f(2.6), text: '23 pessoas na sala', key: '23'}, {from: f(2.6), to: D1_DUR, text: 'quantos pares dá?', key: 'PARES'}]} />
      {frame >= LINE_START && <NumBadge x={540} y={1440} r={120} n={drawn} fs={drawn > 99 ? 96 : 120} delay={LINE_START} />}
      {frame >= LINE_START && <Label x={540} y={1590} size={60} w={500} delay={LINE_START + 4}>pares</Label>}
    </AbsoluteFill>
  );
};

// mantém a câmera mirando o centro a cada quadro
const CamLook = ({pos}) => {
  const {camera} = useThree();
  camera.position.set(...pos);
  camera.lookAt(0, 0, -1.0);
  return null;
};
