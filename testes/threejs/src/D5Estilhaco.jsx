// Demo 5 (transição 3D): o último quadro da cena anterior vira vidro, estilhaça e voa na direção da câmera,
// revelando a próxima cena por baixo.
import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {Cam, rnd, useTex} from './three-common';
import {D1Pares, D1_DUR} from './D1Pares';
import {f} from './lib';

export const D5_DUR = D1_DUR;
const VIS_H = 7.28, VIS_W = VIS_H * 1080 / 1920;
const GX = 9, GY = 16, START = f(0.35);
const IMPACT = [0.1, 0.9]; // ponto de impacto (coordenadas do mundo)

const buildShards = () => {
  const pts = [];
  for (let j = 0; j <= GY; j++) for (let i = 0; i <= GX; i++) {
    const edge = i === 0 || j === 0 || i === GX || j === GY;
    const jx = edge ? 0 : (rnd(i * 31 + j) - 0.5) * 0.7, jy = edge ? 0 : (rnd(i * 17 + j * 3) - 0.5) * 0.7;
    pts.push([(i + jx) / GX, (j + jy) / GY]);
  }
  const P = (i, j) => pts[j * (GX + 1) + i];
  const tris = [];
  for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
    const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1);
    if ((i + j) % 2) { tris.push([a, b, c], [a, c, d]); } else { tris.push([a, b, d], [b, c, d]); }
  }
  const pos = new Float32Array(tris.length * 9), uv = new Float32Array(tris.length * 6);
  const meta = tris.map((t, k) => {
    const w = t.map(([u, v]) => [(u - 0.5) * VIS_W, (0.5 - v) * VIS_H]);
    const cx = (w[0][0] + w[1][0] + w[2][0]) / 3, cy = (w[0][1] + w[1][1] + w[2][1]) / 3;
    t.forEach(([u, v], n) => { uv[k * 6 + n * 2] = u; uv[k * 6 + n * 2 + 1] = 1 - v; });
    const dist = Math.hypot(cx - IMPACT[0], cy - IMPACT[1]);
    const axis = new THREE.Vector3(rnd(k) - 0.5, rnd(k + 1) - 0.5, rnd(k + 2) - 0.5).normalize();
    return {w, cx, cy, dist, axis, spin: 0.08 + rnd(k + 3) * 0.12, push: 0.04 + rnd(k + 4) * 0.05, fwd: 0.18 + rnd(k + 5) * 0.2};
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return {g, meta};
};

const Shards = ({frame, tex}) => {
  const {g, meta} = useMemo(buildShards, []);
  const pos = g.attributes.position.array;
  const q = new THREE.Quaternion(), v = new THREE.Vector3();
  meta.forEach((m, k) => {
    const t = Math.max(0, frame - START - m.dist * 2.2); // a onda de quebra sai do ponto de impacto
    const e = t * t;
    q.setFromAxisAngle(m.axis, t * m.spin);
    const dx = (m.cx - IMPACT[0]) * m.push * t, dy = (m.cy - IMPACT[1]) * m.push * t - 0.002 * e, dz = m.fwd * t + 0.004 * e;
    m.w.forEach(([x, y], n) => {
      v.set(x - m.cx, y - m.cy, 0).applyQuaternion(q);
      pos[k * 9 + n * 3] = m.cx + v.x + dx; pos[k * 9 + n * 3 + 1] = m.cy + v.y + dy; pos[k * 9 + n * 3 + 2] = v.z + dz;
    });
  });
  g.attributes.position.needsUpdate = true;
  g.computeVertexNormals();
  return <mesh geometry={g}><meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.15} metalness={0.1} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.55} /></mesh>;
};

export const D5Estilhaco = ({src = 'img/d4-ultimo-quadro.png'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const tex = useTex(src);
  const done = frame > f(2.2);
  // flash curto no impacto
  const flash = Math.max(0, 1 - Math.abs(frame - START) / 3) * 0.6;
  return (
    <AbsoluteFill>
      <D1Pares />
      {!done && (
        <ThreeCanvas flat width={width} height={height} camera={{fov: 40, position: [0, 0, 10]}} style={{position: 'absolute', inset: 0}}>
          <Cam pos={[0, 0, 10]} look={[0, 0, 0]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[2, 3, 6]} intensity={1.2} />
          {tex && <Shards frame={frame} tex={tex} />}
        </ThreeCanvas>
      )}
      <AbsoluteFill style={{background: 'white', opacity: flash}} />
    </AbsoluteFill>
  );
};
