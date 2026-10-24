// Demo 4 (parallax 2.5D): cena IA aprovada (A08) separada em fundo + pessoa, com balões 3D entre as camadas,
// confete na frente e chapéu de festa 3D que "encaixa" na cabeça (piada visual).
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing, spring} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {Cam, rnd, useTex} from './three-common';
import {CapB, seqWords} from './captions';
import {f} from './lib';

export const D4_DUR = f(6.5);
const VIS_H = 7.28; // altura visível em z=0 com fov 40 a 10 de distância
const FG_H = VIS_H, FG_W = FG_H * 1080 / 1920, FG_Y = -0.13 * VIS_H;
const BG_Z = -3, BG_H = VIS_H * 13 / 10 * 1.15, BG_W = BG_H * 1080 / 1920;
const HAT_AT = f(2.3);
// topo da cabeça no A08: x=534, y=120 (px da imagem)
const headTop = [((534 - 540) / 1080) * FG_W, FG_Y + FG_H / 2 - (120 / 1920) * FG_H];

const BALLOONS = [
  {x: -1.55, y: -0.2, z: -1.6, c: '#ff595e'}, {x: 1.6, y: 0.4, z: -1.2, c: '#ffca3a'}, {x: -1.0, y: 1.9, z: -2.2, c: '#1982c4'},
  {x: 1.2, y: 2.3, z: -2.4, c: '#8ac926'}, {x: -2.0, y: -2.0, z: 1.4, c: '#ff70a6'}, {x: 2.1, y: -1.5, z: 1.8, c: '#6a4c93'},
];
const Balloon = ({b, i, frame}) => {
  const y = b.y + frame * 0.006 + Math.sin(frame / 14 + i) * 0.06;
  const sway = Math.sin(frame / 20 + i * 2) * 0.08;
  const str = useMemo(() => new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.42, 0), new THREE.Vector3(0.05, -1.1, 0), new THREE.Vector3(-0.03, -1.9, 0)]), []);
  return (
    <group position={[b.x + sway, y, b.z]} rotation={[0, 0, sway]}>
      <mesh scale={[1, 1.2, 1]}><sphereGeometry args={[0.36, 32, 24]} /><meshStandardMaterial color={b.c} roughness={0.18} metalness={0.05} /></mesh>
      <mesh position={[0, -0.44, 0]}><coneGeometry args={[0.06, 0.08, 12]} /><meshStandardMaterial color={b.c} /></mesh>
      <line geometry={str}><lineBasicMaterial color="white" /></line>
    </group>
  );
};

const CONF = Array.from({length: 140}, (_, i) => ({x: (rnd(i) - 0.5) * 5, y0: 4 + rnd(i + 1) * 6, z: 1 + rnd(i + 2) * 3.5, v: 0.025 + rnd(i + 3) * 0.03,
  c: ['#ffffff', '#ffd400', '#5ce1e6', '#ff70a6', '#8ac926'][i % 5], s: rnd(i + 4)}));

const stripes = () => {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#1982c4'; g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#ffd400';
  for (let k = -256; k < 512; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 32, 0); g.lineTo(k + 32 + 128, 256); g.lineTo(k + 128, 256); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
};

export const D4Parallax = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const bg = useTex('img/A08-fundo.jpg');
  const fg = useTex('img/A08-frente.png');
  const hatTex = useMemo(stripes, []);
  const e = Easing.inOut(Easing.sin)(frame / D4_DUR);
  const cam = [interpolate(e, [0, 1], [-0.6, 0.6]), interpolate(e, [0, 1], [0.15, 0.55]), interpolate(e, [0, 1], [10, 8.0])];
  const hp = spring({frame: frame - HAT_AT, fps, config: {damping: 9, stiffness: 140, mass: 0.7}});
  const hatY = headTop[1] + 0.3 + (1 - hp) * 4; // cai do alto e quica
  return (
    <AbsoluteFill style={{background: '#f2b46b'}}>
      <ThreeCanvas flat width={width} height={height} camera={{fov: 40, position: [0, 0, 10]}}>
        <Cam pos={cam} look={[0, 0.35, 0]} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[-3, 5, 6]} intensity={2.2} color="#ffe2b0" />
        {bg && <mesh position={[0, 0.2, BG_Z]}><planeGeometry args={[BG_W, BG_H]} /><meshBasicMaterial map={bg} toneMapped={false} /></mesh>}
        {BALLOONS.slice(0, 4).map((b, i) => <Balloon key={i} b={b} i={i} frame={frame} />)}
        {fg && <mesh position={[0, FG_Y, 0]}><planeGeometry args={[FG_W, FG_H]} /><meshBasicMaterial map={fg} transparent alphaTest={0.5} toneMapped={false} /></mesh>}
        {frame >= HAT_AT - 12 && (
          <group position={[headTop[0] - 0.02, hatY, 0]} rotation={[0, 0, -0.18]}>
            <mesh><coneGeometry args={[0.33, 0.75, 40, 1, true]} /><meshStandardMaterial map={hatTex} side={THREE.DoubleSide} roughness={0.5} /></mesh>
            <mesh position={[0, 0.4, 0]}><sphereGeometry args={[0.1, 20, 14]} /><meshStandardMaterial color="#ff595e" roughness={0.6} /></mesh>
          </group>
        )}
        {BALLOONS.slice(4).map((b, i) => <Balloon key={i} b={b} i={i + 4} frame={frame} />)}
        {CONF.map((p, i) => (
          <mesh key={i} position={[p.x + Math.sin(frame / 10 + i) * 0.15, p.y0 - frame * p.v, p.z]} rotation={[frame * 0.15 + p.s * 5, frame * 0.1, p.s]}>
            <planeGeometry args={[0.07, 0.04]} /><meshBasicMaterial color={p.c} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </ThreeCanvas>
      <CapB words={[...seqWords('e se tiver 23 na sua festa?', f(0.3), 10), ...seqWords('alguém divide seu bolo?', f(3.4), 11)]} />
    </AbsoluteFill>
  );
};
