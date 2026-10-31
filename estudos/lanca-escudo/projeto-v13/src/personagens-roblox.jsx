// Personagens fixos do Pera AI no visual de "jogo de montar" (inspirado no estilo Roblox, feito do zero em código).
// Peças lisas e arredondadas de plástico brilhante, sombras reais. Sem logo, nome, rosto ou personagem de terceiros.
// Mesma API de personagens.jsx: <Ele t acoes position rotationY scale />, <Ela ... />, <Perita ... />.
// Ações: parado, acena, aponta, apontaCima, surpresa, pensa, duvida, comemora;
// Perita: parado, acena, lupa, peraAi, surpresa, pulo, explica. Altura: ele ~2,2, Perita ~1,6.
// Use dentro de <ThreeCanvas flat shadows ...> com <Ambiente /> e <LuzJogo />.
import React, {useMemo, useRef, useLayoutEffect} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {getInputProps} from 'remotion';
import {POSES_BETO, POSES_PERITA, COR} from './personagens';
import {atuar, elastico} from './atuacao';

// qualidade do render (dá para testar pelo --props): aa = antisserrilhado, fis = material com verniz,
// sombra = tamanho do mapa de sombra (0 desliga), seg = segmentos da quina arredondada, esf = gomos das esferas
// nível (regra 38): 'pc' = render no PC do Sebastião (GPU): resolução cheia, sombra macia 2048, oclusão e SMAA;
// 'nuvem+' = reserva na nuvem com acabamento (mais lento); 'nuvem' = o rápido de antes, sem acabamento (padrão quando não passa nivel).
const NIVEIS = {
  pc: {aa: false, fis: false, sombra: 2048, seg: 3, esf: 24, dpr: 1, pos: true, dof: false, macia: true},   // dof: a profundidade de campo apaga a parede em planos com giro rápido (teste 30/10); só ligue em still
  'nuvem+': {aa: false, fis: false, sombra: 1024, seg: 2, esf: 16, dpr: 0.85, pos: true, dof: false, macia: true},
  nuvem: {aa: false, fis: false, sombra: 1024, seg: 2, esf: 16, dpr: 0.67, pos: false, dof: false, macia: false},
};
export const Q = {...NIVEIS[getInputProps().nivel || 'nuvem'], ...(getInputProps().q || {})};

const lerp = (a, b, p) => a + (b - a) * p;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smooth = (x) => { const p = clamp01(x); return p * p * (3 - 2 * p); };

// ---------- materiais de plástico (cache) ----------
const mats = {};
export const P = (color, {rough = 0.62, cc = 0.15, ...extra} = {}) => {
  const k = color + rough + cc + JSON.stringify(extra);
  if (!mats[k]) mats[k] = Q.fis ? new THREE.MeshPhysicalMaterial({color, roughness: rough, metalness: 0, clearcoat: cc, clearcoatRoughness: 0.6, ...extra}) : new THREE.MeshStandardMaterial({color, roughness: rough, metalness: 0, ...extra});
  return mats[k];
};
const PELE = (c) => P(c, {rough: 0.55, cc: 0.15});

// ---------- caixa arredondada (geometria em cache) ----------
const geos = {};
const rgeo = (w, h, d, r) => {
  const k = [w, h, d, r].join('|');
  if (!geos[k]) geos[k] = new RoundedBoxGeometry(w, h, d, Q.seg, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
  return geos[k];
};
export const RB = ({p = [0, 0, 0], s, r = 0.06, c, m, rot, sombra = true}) => (
  <mesh position={p} rotation={rot} geometry={rgeo(s[0], s[1], s[2], r)} material={m || P(c)} castShadow={sombra} receiveShadow />
);
let _esf = null;
export const ESFERA = () => _esf || (_esf = new THREE.SphereGeometry(1, Q.esf, Math.round(Q.esf * 2 / 3)));
const caps = {};
const capsula = (r, l) => caps[r + '|' + l] || (caps[r + '|' + l] = new THREE.CapsuleGeometry(r, l, 4, Math.max(8, Q.esf - 10)));
const Bola = ({p = [0, 0, 0], s = [1, 1, 1], m, rot}) => (
  <mesh position={p} rotation={rot} scale={s} material={m} geometry={ESFERA()} castShadow receiveShadow />
);
const Capsula = ({p, rot, r, l, m}) => (
  <mesh position={p} rotation={rot} material={m} geometry={capsula(r, l)} castShadow />
);

// ---------- piscar e mistura de poses ----------
const piscar = (t, fase = 0) => {
  const c = (t + fase) % 3.1;
  return c < 0.12 ? 0.1 + Math.abs(c - 0.06) / 0.06 * 0.9 : 1;
};
// mistura de poses: motor de atuação (atuacao.jsx, regra 38); `semente` desencontra a pose viva de cada personagem
const misturar = (POSES, acoes, t, semente = 0) => atuar(POSES, acoes, t, semente);

// ============================================================
// PESSOA: pernas com joelho, tênis com sola, cinto, camiseta com gola e barra de manga,
// braços com cotovelo e mão com polegar, cabeça arredondada, cabelo esculpido
// ============================================================
// objeto na mão (regra 35): `mao` = {obj, rot, pos, solto}. Por padrão o objeto fica nivelado com o corpo
// (desfaz a rotação do braço, como um punho firme) e só a posição segue a mão; `solto: true` gira junto com o antebraço.
const NaMao = ({mao, lado, a, fw, c, lean}) => {
  if (!mao || !mao.obj) return null;
  const inner = <group position={mao.pos || [0, 0, 0]} rotation={mao.rot || [0, 0, 0]}>{mao.obj}</group>;
  return (
    <group position={[0, -0.36, 0.02]}>
      {mao.solto ? inner : (
        <group rotation={[c, 0, 0]}><group rotation={[0, 0, -lado * a]}><group rotation={[fw, 0, 0]}><group rotation={[-lean, 0, 0]}>{inner}</group></group></group></group>
      )}
    </group>
  );
};
// braço nunca atravessa o tronco (pedido do Sebastião em 30/10: "o braço quando dobra entra dentro do corpo"):
// confere 4 pontos do braço contra a caixa do tronco e abre o ombro (a) o mínimo para sair. Vale para pose, mistura e passa-do-ponto.
const _br = new THREE.Object3D(), _an = new THREE.Object3D(), _v = new THREE.Vector3();
_br.add(_an);
const PONTOS_BRACO = [[0, [0, -0.2, 0]], [1, [0, -0.06, 0]], [1, [0, -0.18, 0]], [1, [0, -0.32, 0]]];
const colideTronco = (lado, a, fw, c) => {
  _br.position.set(lado * 0.5, 1.4, 0); _br.rotation.set(-fw, 0, lado * a);
  _an.position.set(0, -0.34, 0); _an.rotation.set(-c, 0, 0);
  _br.updateMatrixWorld(true);
  return PONTOS_BRACO.some(([k, q]) => {
    (k ? _an : _br).localToWorld(_v.set(...q));
    return Math.abs(_v.x) < 0.42 && _v.y > 0.84 && _v.y < 1.48 && Math.abs(_v.z) < 0.26;
  });
};
export const liberaBraco = (lado, a, fw, c) => {
  let k = 0;
  while (k < 20 && colideTronco(lado, a, fw, c)) { a += 0.04; k++; }
  return a;
};
const Braco = ({lado, a: a0, fw, c, v, mao, lean = 0}) => { const a = liberaBraco(lado, a0, fw, c); return (

  <group position={[lado * 0.5, 1.4, 0]} rotation={[-fw, 0, lado * a]}>
    <RB p={[0, -0.1, 0]} s={[0.28, 0.26, 0.3]} r={0.1} c={v.manga} />
    <RB p={[0, -0.215, 0]} s={[0.29, 0.05, 0.31]} r={0.025} c={v.barraManga || v.manga} />
    <RB p={[0, -0.29, 0]} s={[0.21, 0.14, 0.22]} r={0.08} m={PELE(v.pele)} />
    <group position={[0, -0.34, 0]} rotation={[-c, 0, 0]}>
      <RB p={[0, -0.12, 0]} s={[0.2, 0.26, 0.21]} r={0.08} m={PELE(v.pele)} />
      {/* mão: palma e polegar para dentro/frente */}
      <RB p={[0, -0.32, 0]} s={[0.17, 0.18, 0.13]} r={0.06} m={PELE(v.pele)} />
      <Capsula p={[-lado * 0.08, -0.28, 0.06]} rot={[0.4, 0, lado * 0.5]} r={0.035} l={0.06} m={PELE(v.pele)} />
      <NaMao mao={mao} lado={lado} a={a} fw={fw} c={c} lean={lean} />
    </group>
  </group>
); };
const Perna = ({lado, r, v}) => (
  <group position={[lado * 0.17, 0.8, 0]} rotation={[r, 0, 0]}>
    <RB p={[0, -0.2, 0]} s={[0.31, 0.4, 0.33]} r={0.09} c={v.calca} />
    <RB p={[0, -0.53, 0]} s={[0.29, 0.3, 0.31]} r={0.09} c={v.calca} />
    {/* barra dobrada da calça */}
    <RB p={[0, -0.64, 0]} s={[0.31, 0.06, 0.33]} r={0.03} c={v.barraCalca || v.calca} />
    {/* tênis: cabedal, biqueira e sola clara */}
    <RB p={[0, -0.72, 0.05]} s={[0.3, 0.13, 0.44]} r={0.06} c={v.tenis} />
    <RB p={[0, -0.7, 0.2]} s={[0.24, 0.07, 0.12]} r={0.035} c={v.tenisDet} />
    <RB p={[0, -0.785, 0.05]} s={[0.32, 0.04, 0.46]} r={0.02} c={v.sola} />
  </group>
);

const CabeloCurto = ({cor}) => {
  const m = P(cor, {rough: 0.5, cc: 0.4});
  return (
    <>
      <RB p={[0, 0.27, -0.03]} s={[0.7, 0.18, 0.66]} r={0.09} m={m} />
      <RB p={[0, 0.08, -0.29]} s={[0.68, 0.42, 0.14]} r={0.07} m={m} />
      {[-1, 1].map((s) => <RB key={s} p={[s * 0.325, 0.17, -0.12]} s={[0.05, 0.2, 0.36]} r={0.02} m={m} />)}
      {/* topete: franja levantada na frente e uma mecha caída de lado */}
      <RB p={[0, 0.31, 0.22]} rot={[-0.38, 0, 0]} s={[0.68, 0.13, 0.26]} r={0.06} m={m} />
      <RB p={[0.09, 0.39, 0.1]} rot={[-0.25, 0, -0.18]} s={[0.36, 0.12, 0.34]} r={0.06} m={m} />
      <RB p={[-0.19, 0.2, 0.3]} rot={[-0.2, 0, 0.35]} s={[0.22, 0.1, 0.1]} r={0.045} m={m} />
    </>
  );
};
const CabeloLongo = ({cor, presilha}) => {
  const m = P(cor, {rough: 0.45, cc: 0.5});
  return (
    <>
      <RB p={[0, 0.27, -0.03]} s={[0.72, 0.18, 0.68]} r={0.09} m={m} />
      <RB p={[0, -0.2, -0.28]} s={[0.7, 0.98, 0.16]} r={0.08} m={m} />
      {[-1, 1].map((s) => <RB key={s} p={[s * 0.345, -0.1, -0.02]} s={[0.1, 0.74, 0.34]} r={0.05} m={m} />)}
      {/* franja caindo de lado e ponta virada das mechas */}
      <Capsula p={[0.06, 0.22, 0.28]} rot={[0, 0, 1.25]} r={0.07} l={0.34} m={m} />
      <Capsula p={[-0.2, 0.25, 0.27]} rot={[0, 0, -0.9]} r={0.06} l={0.08} m={m} />
      {[-1, 1].map((s) => <Capsula key={s} p={[s * 0.33, -0.47, 0.05]} rot={[0.3, 0, s * -0.5]} r={0.06} l={0.08} m={m} />)}
      {/* presilha rosa */}
      <RB p={[0.25, 0.25, 0.3]} s={[0.12, 0.05, 0.04]} r={0.02} m={P(presilha, {rough: 0.5, cc: 0.3})} />
    </>
  );
};

const Cabeca = ({p, t, v, choro = 0, oculos = 0}) => {
  const pisca = piscar(t, v.fasePisca || 0) * (p.piscaTroca ?? 1);
  const ox = p.olhoX * 0.022, oy = p.olhoY * 0.02;
  const zF = 0.3;
  const escuro = P('#1A1210', {rough: 0.45, cc: 0.3});
  return (
    <group position={[0, 1.55, 0]} rotation={[p.hPitch, p.hYaw, p.hTilt]}>
      <group position={[0, 0.32, 0]}>
        <RB s={[0.64, 0.62, 0.6]} r={0.15} m={PELE(v.pele)} />
        {[-1, 1].map((s) => <RB key={s} p={[s * 0.32, -0.02, 0]} s={[0.07, 0.14, 0.1]} r={0.03} m={PELE(v.pele)} />)}
        {v.cabelo === 'curto' ? <CabeloCurto cor={v.corCabelo} /> : <CabeloLongo cor={v.corCabelo} presilha={v.presilha} />}
        {/* olhos: branco, íris, pupila e 2 brilhos; piscam fechando no meio */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.125 + ox, 0.035 + oy, zF]} rotation={[0, s * 0.12, 0]} scale={[1, pisca, 1]}>
            <Bola s={[0.072, 0.09, 0.03]} m={P('#FFFFFF', {rough: 0.45, cc: 0.3})} />
            <Bola p={[0, -0.008, 0.016]} s={[0.05, 0.062, 0.02]} m={P(v.iris, {rough: 0.45, cc: 0.3})} />
            <Bola p={[0, -0.008, 0.028]} s={[0.026, 0.032, 0.012]} m={escuro} />
            <Bola p={[0.016, 0.02, 0.036]} s={[0.012, 0.012, 0.006]} m={P('#FFFFFF')} />
            <Bola p={[-0.014, -0.03, 0.034]} s={[0.006, 0.006, 0.004]} m={P('#FFFFFF')} />
          </group>
        ))}
        {v.cilios ? [-1, 1].map((s) => (
          <RB key={s} p={[s * 0.185 + ox, 0.1 + oy, zF - 0.005]} rot={[0, 0, s * -0.5]} s={[0.05, 0.02, 0.02]} r={0.008} m={escuro} />
        )) : null}
        {[-1, 1].map((s) => (
          <RB key={s} p={[s * 0.125, 0.155 + p.sobrancelha * 0.03, zF + 0.005]} rot={[0, 0, s * (0.06 - p.sobrancelha * 0.14)]} s={[0.12, 0.032, 0.02]} r={0.012} c={v.corCabelo} />
        ))}
        <Bola p={[0, -0.05, zF + 0.01]} s={[0.04, 0.032, 0.03]} m={PELE(v.nariz)} />
        {p.boca > 0.5 ? (
          <group position={[0, -0.15, zF + 0.002]}>
            <Bola s={[0.055, 0.06 * p.boca, 0.015]} m={P('#5A1A16', {rough: 0.4, cc: 0.3})} />
            <Bola p={[0, -0.025 * p.boca, 0.008]} s={[0.032, 0.02, 0.01]} m={P('#F07A86')} />
          </group>
        ) : (
          <mesh position={[0, -0.12, zF + 0.004]} rotation={[0, 0, Math.PI]} material={P(v.labio, {rough: 0.4, cc: 0.3})}><torusGeometry args={[0.075 - p.boca * 0.035, 0.014, 8, 20, Math.PI]} /></mesh>
        )}
        {[-1, 1].map((s) => <Bola key={s} p={[s * 0.205, -0.075, zF - 0.012]} s={[0.05, 0.028, 0.012]} m={P(v.bochecha, {rough: 0.7, cc: 0, transparent: true, opacity: 0.75})} />)}
        {/* lágrimas (choro 0..1) e óculos de natação (oculos 0..1): acessórios do vídeo da cebola */}
        {choro > 0.02 && [-1, 1].map((s) => [0, 1, 2].map((k) => {
          const ph = (t * 1.6 + k / 3 + (s > 0 ? 0.17 : 0)) % 1;
          const r = 0.028 * choro;
          return <Bola key={s + 'l' + k} p={[s * 0.15, -0.02 - ph * 0.26, zF + 0.035]} s={[r, r * 1.35, r]} m={P('#4FB3F0', {rough: 0.3, transparent: true, opacity: 0.9 * (1 - ph * 0.6)})} />;
        }))}
        {oculos > 0.02 && <group position={[0, 0.035, 0]} scale={[1, oculos, 1]}>
          <RB p={[0, 0, -0.01]} s={[0.69, 0.07, 0.65]} r={0.03} c="#2E9E55" />
          {[-1, 1].map((s) => <group key={s} position={[s * 0.125, 0, zF + 0.05]}>
            <mesh material={P('#FFD400', {rough: 0.5})}><torusGeometry args={[0.092, 0.024, 8, 20]} /></mesh>
            <mesh material={P('#7FC8F0', {rough: 0.3, transparent: true, opacity: 0.4, depthWrite: false})}><circleGeometry args={[0.09, 20]} /></mesh>
          </group>)}
          <RB p={[0, 0, zF + 0.05]} s={[0.07, 0.035, 0.035]} r={0.012} c="#FFD400" />
        </group>}
      </group>
    </group>
  );
};

// pera do canal estampada no peito (o próprio logo do Pera AI)
const Emblema = () => (
  <group position={[0.17, 1.3, 0.205]} scale={0.085}>
    <Bola p={[0, -0.25, 0]} s={[0.5, 0.5, 0.15]} m={P(COR.pera)} />
    <Bola p={[0, 0.27, 0]} s={[0.32, 0.34, 0.12]} m={P(COR.pera)} />
    <Bola p={[0.15, 0.72, 0]} rot={[0, 0, -0.8]} s={[0.12, 0.28, 0.06]} m={P(COR.folha)} />
  </group>
);

export const VISUAL_R = {
  ele: {pele: '#F0BE98', nariz: '#E3A882', cabelo: 'curto', corCabelo: '#3A2618', iris: '#2F86E8', bochecha: '#F49A94', labio: '#7A2E22',
    camiseta: '#A9AEB6', manga: '#A9AEB6', barraManga: '#959BA4', gola: '#8E949D', calca: '#3E72C4', barraCalca: '#5A8BD6', cinto: '#5B3A22',
    tenis: '#F6F6FA', tenisDet: '#FF4F7B', sola: '#E2E4EA', fasePisca: 0.9, emblema: true},
  ela: {pele: '#E8B08A', nariz: '#D79A74', cabelo: 'longo', corCabelo: '#6A3A22', iris: '#6B3E1A', cilios: true, bochecha: '#F29C9C', labio: '#C2414E', presilha: '#FF4F7B',
    camiseta: '#E6492F', manga: '#283A66', barraManga: '#1E2D52', gola: '#283A66', calca: '#2E5690', barraCalca: '#4A72B0', cinto: '#2A1C14',
    tenis: '#FFFFFF', tenisDet: '#7B2FE0', sola: '#E8E2F2', fasePisca: 2.1, escala: 0.95},
};

export const PessoaR = ({t, acoes = [{t: 0, a: 'parado'}], position = [0, 0, 0], rotationY = 0, scale = 1, visual = VISUAL_R.ele, choro = 0, oculos = 0, maoD, maoE}) => {
  const v = visual;
  const sem = v.fasePisca || 0;
  const p = misturar(POSES_BETO, acoes, t, sem);
  const sq = elastico((tt) => misturar(POSES_BETO, acoes, tt, sem).y, t);
  return (
    <group position={position} rotation={[0, rotationY + p.yaw, 0]} scale={scale * (v.escala || 1)}>
      <group position={[0, p.y, 0]} scale={sq}>
        <Perna lado={1} r={p.pE} v={v} />
        <Perna lado={-1} r={p.pD} v={v} />
        <group position={[0, 0.8, 0]} rotation={[p.lean, 0, 0]}>
          <group position={[0, -0.8, 0]}>
            <RB p={[0, 0.88, 0]} s={[0.66, 0.2, 0.36]} r={0.07} c={v.calca} />
            <RB p={[0, 0.975, 0]} s={[0.68, 0.06, 0.38]} r={0.025} c={v.cinto} />
            <RB p={[0, 0.975, 0.19]} s={[0.09, 0.055, 0.02]} r={0.01} m={P('#E8C04A', {rough: 0.5, metalness: 0.6, cc: 0.3})} />
            {/* tronco da camiseta, um pouco mais largo nos ombros */}
            <RB p={[0, 1.2, 0]} s={[0.76, 0.56, 0.4]} r={0.13} c={v.camiseta} />
            <mesh position={[0, 1.46, 0]} rotation={[Math.PI / 2, 0, 0]} material={P(v.gola)} castShadow><torusGeometry args={[0.12, 0.035, 10, 24]} /></mesh>
            <mesh position={[0, 1.5, 0]} material={PELE(v.pele)} castShadow><cylinderGeometry args={[0.1, 0.11, 0.12, 16]} /></mesh>
            {v.emblema ? <Emblema /> : null}
            <Braco lado={1} a={p.aE} fw={p.fE} c={p.cE} v={v} mao={maoE} lean={p.lean} />
            <Braco lado={-1} a={p.aD} fw={p.fD} c={p.cD} v={v} mao={maoD} lean={p.lean} />
            <Cabeca p={p} t={t} v={v} choro={choro} oculos={oculos} />
          </group>
        </group>
      </group>
    </group>
  );
};
export const Ele = (props) => <PessoaR {...props} visual={VISUAL_R.ele} />;
export const Ela = (props) => <PessoaR {...props} visual={VISUAL_R.ela} />;

// ============================================================
// PERITA: a pera do logo em plástico brilhante, com braços e pernas de peça,
// luvas brancas, tênis rosa e lupa de aro branco com cabo rosa
// ============================================================
const PERFIL_PERA = [[0, 0], [0.3, 0.02], [0.47, 0.13], [0.56, 0.32], [0.56, 0.5], [0.5, 0.68], [0.39, 0.84], [0.3, 0.98], [0.26, 1.1], [0.21, 1.22], [0.12, 1.31], [0, 1.34]];
const usarPera = () => useMemo(() => {
  const curva = new THREE.SplineCurve(PERFIL_PERA.map(([r, y]) => new THREE.Vector2(r, y)));
  const g = new THREE.LatheGeometry(curva.getPoints(40), 48);
  g.computeVertexNormals();
  const cor = [], pos = g.attributes.position, a = new THREE.Color('#FFE45C'), b = new THREE.Color(COR.pera), c = new THREE.Color('#F08A00'), tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 1.34;
    const k = clamp01(0.75 * (1 - y) - 0.05);
    tmp.copy(b).lerp(k > 0.5 ? c : a, Math.abs(k - 0.5) * 2 * (k > 0.5 ? 0.9 : 0.7));
    cor.push(tmp.r, tmp.g, tmp.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(cor, 3));
  return g;
}, []);
const MPERA = Q.fis ? new THREE.MeshPhysicalMaterial({vertexColors: true, roughness: 0.6, clearcoat: 0.15, clearcoatRoughness: 0.6}) : new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.6});

const BracoPeca = ({lado, mao, children}) => {
  const S = new THREE.Vector3(lado * 0.5, 0.5, 0.08), H = new THREE.Vector3(...mao);
  const d = H.clone().sub(S), len = Math.max(0.05, d.length());
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  const meio = S.clone().add(H).multiplyScalar(0.5);
  return (
    <>
      <group position={meio.toArray()} quaternion={q}><Capsula p={[0, 0, 0]} r={0.055} l={Math.max(0.01, len - 0.1)} m={P(COR.contorno, {rough: 0.4})} /></group>
      <group position={mao}>
        <Bola s={[0.1, 0.1, 0.1]} m={P('#FFFFFF', {rough: 0.3, cc: 0.3})} />
        <Bola p={[-lado * 0.07, 0.04, 0.04]} s={[0.04, 0.05, 0.04]} m={P('#FFFFFF', {rough: 0.3, cc: 0.3})} />
        {children}
      </group>
    </>
  );
};
const VIDRO = new THREE.MeshStandardMaterial({color: '#D8F2FF', transparent: true, opacity: 0.35, roughness: 0.3});
const Lupa = ({inc = 0}) => (
  <group rotation={[0, 0, inc]}>
    <Capsula p={[0, 0.12, 0.02]} r={0.045} l={0.16} m={P(COR.rosa, {rough: 0.3, cc: 0.3})} />
    <group position={[0, 0.42, 0.04]}>
      <mesh material={P('#FFFFFF', {rough: 0.5, cc: 0.3})} castShadow><torusGeometry args={[0.2, 0.045, 14, 32]} /></mesh>
      <mesh material={VIDRO}><circleGeometry args={[0.19, 32]} /></mesh>
    </group>
  </group>
);

export const Perita = ({t, acoes = [{t: 0, a: 'parado'}], position = [0, 0, 0], rotationY = 0, scale = 1}) => {
  const geo = usarPera();
  const p = misturar(POSES_PERITA, acoes, t, 5);
  const pisca = piscar(t, 1.3) * p.piscaTroca;
  const sx = 1 / Math.sqrt(p.sq);
  const olhoGrande = 1 + p.lupa * 0.7;
  return (
    <group position={position} rotation={[0, rotationY + p.yaw, 0]} scale={scale}>
      <group position={[0, p.y + 0.16, 0]}>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.17, 0.06, 0]} rotation={[s > 0 ? p.pE : p.pD, 0, 0]}>
            <Capsula p={[0, -0.02, 0]} r={0.045} l={0.1} m={P(COR.contorno)} />
            <RB p={[0, -0.12, 0.05]} s={[0.17, 0.09, 0.26]} r={0.045} c={COR.rosa} />
            <RB p={[0, -0.16, 0.05]} s={[0.18, 0.03, 0.27]} r={0.012} c="#FFFFFF" />
          </group>
        ))}
        <group scale={[sx, p.sq, sx]} rotation={[0, 0, p.tilt]}>
          <mesh geometry={geo} material={MPERA} castShadow receiveShadow />
          <mesh position={[0.02, 1.44, 0]} rotation={[0, 0, -0.25]} material={P(COR.cabo, {rough: 0.6, cc: 0.2})} castShadow><cylinderGeometry args={[0.035, 0.045, 0.24, 12]} /></mesh>
          <group position={[0.1, 1.5, 0]} rotation={[0.2, 0, -0.9 + Math.sin(t * 2) * 0.08]}>
            <Bola p={[0, 0.15, 0]} s={[0.1, 0.18, 0.03]} m={P(COR.folha, {rough: 0.35, cc: 0.8})} />
          </group>
          {[-1, 1].map((s) => {
            const g = s < 0 ? olhoGrande : 1;
            return (
              <group key={s} position={[s * 0.16, 0.76, 0.4]} rotation={[-0.1, s * 0.3, 0]} scale={[g, g * pisca, g]}>
                <Bola s={[0.11, 0.135, 0.05]} m={P('#FFFFFF', {rough: 0.45, cc: 0.3})} />
                <Bola p={[p.olhoX * 0.03, -0.015 + p.olhoY * 0.03, 0.035]} s={[0.06, 0.072, 0.025]} m={P('#1A1210', {rough: 0.45, cc: 0.3})} />
                <Bola p={[0.022 + p.olhoX * 0.03, 0.018 + p.olhoY * 0.03, 0.055]} s={[0.018, 0.018, 0.008]} m={P('#FFFFFF')} />
              </group>
            );
          })}
          {[-1, 1].map((s) => (
            <RB key={s} p={[s * 0.16, 0.94 + p.sobrancelha * 0.04, 0.39]} rot={[0, s * 0.3, s * (0.1 - p.sobrancelha * 0.15)]} s={[0.13, 0.03, 0.025]} r={0.012} c={COR.contorno} />
          ))}
          {[-1, 1].map((s) => <Bola key={s} p={[s * 0.3, 0.58, 0.44]} rot={[0, s * 0.6, 0]} s={[0.07, 0.04, 0.015]} m={P(COR.bochecha, {rough: 0.7, cc: 0})} />)}
          {p.boca > 0.5 ? (
            <Bola p={[0, 0.54, 0.5]} s={[0.06, 0.075 * p.boca, 0.025]} m={P('#5A1A16')} />
          ) : (
            <mesh position={[0, 0.58, 0.5]} rotation={[0, 0, Math.PI]} material={P(COR.contorno)}><torusGeometry args={[0.085 - p.boca * 0.04, 0.018, 8, 20, Math.PI]} /></mesh>
          )}
          <BracoPeca lado={1} mao={p.mE} />
          <BracoPeca lado={-1} mao={p.mD}><Lupa inc={p.lupaInc} /></BracoPeca>
        </group>
      </group>
    </group>
  );
};

// reflexo suave de estúdio para o plástico brilhar (sem arquivo externo)
export const Ambiente = ({k = 0.28}) => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = k;
  }, [gl, scene, k]);
  return null;
};
// sol quente com sombra real + céu
export const LuzJogo = ({alvo = [0, 0, 0], area = 8, recorte = 0.55}) => (
  <>
    <hemisphereLight args={['#EAF4FF', '#B5D98A', recorte ? 0.95 : 1.05]} />
    {/* luz de recorte (regra 38): vem de trás e do alto, desenha a borda dos personagens e separa do fundo */}
    {recorte ? <directionalLight position={[alvo[0] - 4, 7, alvo[2] - 7]} intensity={recorte} color="#DCEBFF" /> : null}
    <directionalLight position={[alvo[0] + 5, 9, alvo[2] + 6]} intensity={1.75} color="#FFF0D8" castShadow
      shadow-mapSize={[Q.sombra || 512, Q.sombra || 512]} shadow-bias={-0.0004} shadow-normalBias={0.02}
      shadow-camera-left={-area} shadow-camera-right={area} shadow-camera-top={area} shadow-camera-bottom={-area} shadow-camera-near={0.5} shadow-camera-far={40} />
  </>
);

// Cenário parado vira poucas malhas: junta todas as peças de mesmo material numa só (menos chamadas de desenho,
// que é o que mais pesa no render sem placa de vídeo). Use só em volta do que não se mexe.
export const Estatico = ({children}) => {
  const ref = useRef();
  useLayoutEffect(() => {
    const g = ref.current;
    g.updateMatrixWorld(true);
    const inv = g.matrixWorld.clone().invert();
    const grupos = new Map(), escondidos = [], novos = [];
    g.traverse((o) => {
      if (!o.isMesh || o.userData.junto) return;
      const geo = (o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone());
      for (const nome of Object.keys(geo.attributes)) if (nome !== 'position' && nome !== 'normal') geo.deleteAttribute(nome);
      geo.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
      const k = o.material.uuid + (o.castShadow ? 'S' : 'n');
      if (!grupos.has(k)) grupos.set(k, {mat: o.material, sombra: o.castShadow, geos: []});
      grupos.get(k).geos.push(geo);
      escondidos.push(o);
    });
    for (const {mat, sombra, geos} of grupos.values()) {
      const m = new THREE.Mesh(mergeGeometries(geos), mat);
      m.castShadow = sombra; m.receiveShadow = true; m.userData.junto = true;
      g.add(m); novos.push(m);
    }
    escondidos.forEach((o) => { o.visible = false; });
    return () => { novos.forEach((m) => { g.remove(m); m.geometry.dispose(); }); escondidos.forEach((o) => { o.visible = true; }); };
  }, []);
  return <group ref={ref}>{children}</group>;
};

// posição da mão no mundo (regra 35): para mirar a câmera no objeto da mão e conferir se a mão chega na bancada/peça.
// lado: 'D' (direita, maoD) ou 'E' (esquerda, maoE). Mesmas props do <Ele>/<Ela>.
export const posMao = ({t, acoes = [{t: 0, a: 'parado'}], position = [0, 0, 0], rotationY = 0, scale = 1, escala = 1, lado = 'D', visual = VISUAL_R.ele}) => {
  const p = misturar(POSES_BETO, acoes, t, visual.fasePisca || 0);
  const L = lado === 'D' ? -1 : 1;
  const [a0, fw, c] = lado === 'D' ? [p.aD, p.fD, p.cD] : [p.aE, p.fE, p.cE];
  const a = liberaBraco(L, a0, fw, c);
  const g = new THREE.Object3D(); g.position.set(...position); g.rotation.set(0, rotationY + p.yaw, 0); g.scale.setScalar(scale * escala);
  const y = new THREE.Object3D(); y.position.set(0, p.y, 0); g.add(y);
  const b1 = new THREE.Object3D(); b1.position.set(0, 0.8, 0); b1.rotation.set(p.lean, 0, 0); y.add(b1);
  const b2 = new THREE.Object3D(); b2.position.set(0, -0.8, 0); b1.add(b2);
  const br = new THREE.Object3D(); br.position.set(L * 0.5, 1.4, 0); br.rotation.set(-fw, 0, L * a); b2.add(br);
  const an = new THREE.Object3D(); an.position.set(0, -0.34, 0); an.rotation.set(-c, 0, 0); br.add(an);
  const m = new THREE.Object3D(); m.position.set(0, -0.36, 0.02); an.add(m);
  g.updateMatrixWorld(true);
  return m.getWorldPosition(new THREE.Vector3()).toArray();
};
