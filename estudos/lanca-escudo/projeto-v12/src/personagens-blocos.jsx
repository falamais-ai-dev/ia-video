// Personagens fixos do Pera AI "em blocos" (estilo jogo de bloquinhos, feito do zero em código).
// Mesma API de personagens.jsx: <Ele t acoes position rotationY scale />, <Ela ... />, <Perita ... />.
// As ações são as mesmas (parado, acena, aponta, apontaCima, surpresa, pensa, duvida, comemora;
// Perita: parado, acena, lupa, peraAi, surpresa, pulo, explica). Altura: ele ~2,1, Perita ~1,6.
// Sem logo, nome ou personagem de terceiros: só caixas coloridas com contorno escuro.
import React from 'react';
import * as THREE from 'three';
import {POSES_BETO, POSES_PERITA, COR, Sombra} from './personagens';

const lerp = (a, b, p) => a + (b - a) * p;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smooth = (x) => { const p = clamp01(x); return p * p * (3 - 2 * p); };
const mats = {};
const M = (color) => {
  if (!mats[color]) mats[color] = new THREE.MeshStandardMaterial({color, flatShading: true, roughness: 0.8, metalness: 0});
  return mats[color];
};
const LINHA = new THREE.MeshBasicMaterial({color: '#1A1208', side: THREE.BackSide});
const piscar = (t, fase = 0) => {
  const c = (t + fase) % 3.1;
  return c < 0.12 ? 0.1 + Math.abs(c - 0.06) / 0.06 * 0.9 : 1;
};
const misturar = (POSES, acoes, t) => {
  let i = 0;
  while (i < acoes.length - 1 && t >= acoes[i + 1].t) i++;
  const atual = POSES[acoes[i].a](Math.max(0, t - acoes[i].t), t);
  if (i === 0) return atual;
  const antes = POSES[acoes[i - 1].a](t - acoes[i - 1].t, t);
  const p = smooth((t - acoes[i].t) / 0.25);
  const out = {};
  for (const k of Object.keys(atual)) out[k] = Array.isArray(atual[k]) ? atual[k].map((v, j) => lerp((antes[k] ?? atual[k])[j], v, p)) : typeof atual[k] === 'number' ? lerp(antes[k] ?? atual[k], atual[k], p) : (p < 0.5 ? antes[k] : atual[k]);
  return out;
};

// caixa com contorno escuro (o contorno é uma caixa um pouco maior, de dentro para fora)
export const Bloco = ({p = [0, 0, 0], s, c, r, linha = 0.035}) => (
  <group position={p} rotation={r}>
    {linha ? <mesh material={LINHA}><boxGeometry args={[s[0] + linha, s[1] + linha, s[2] + linha]} /></mesh> : null}
    <mesh material={M(c)}><boxGeometry args={s} /></mesh>
  </group>
);
// detalhe chapado do rosto (sem contorno)
const Det = ({p, s, c}) => <mesh position={p} material={M(c)}><boxGeometry args={s} /></mesh>;

// ============================================================
// PESSOA EM BLOCOS: pernas, tronco, braços em 2 blocos (com cotovelo), cabeça cúbica
// ============================================================
const BracoB = ({lado, a, fw, c, manga, pele}) => (
  <group position={[lado * 0.5, 1.38, 0]} rotation={[-fw, 0, lado * a]}>
    <Bloco p={[0, -0.17, 0]} s={[0.26, 0.36, 0.28]} c={manga} />
    <group position={[0, -0.34, 0]} rotation={[-c, 0, 0]}>
      <Bloco p={[0, -0.16, 0]} s={[0.24, 0.34, 0.26]} c={pele} />
    </group>
  </group>
);
const PernaB = ({lado, r, calca, tenis}) => (
  <group position={[lado * 0.17, 0.74, 0]} rotation={[r, 0, 0]}>
    <Bloco p={[0, -0.32, 0]} s={[0.32, 0.6, 0.32]} c={calca} />
    <Bloco p={[0, -0.67, 0.03]} s={[0.33, 0.14, 0.4]} c={tenis} />
  </group>
);

const CabeloCurtoB = ({cor}) => (
  <>
    <Bloco p={[0, 0.3, -0.03]} s={[0.68, 0.14, 0.64]} c={cor} />
    {/* franja em degraus e laterais curtas */}
    <Bloco p={[-0.1, 0.22, 0.27]} s={[0.46, 0.1, 0.12]} c={cor} linha={0} />
    <Bloco p={[0.2, 0.25, 0.27]} s={[0.24, 0.07, 0.12]} c={cor} linha={0} />
    {[-1, 1].map((s) => <Bloco key={s} p={[s * 0.31, 0.16, -0.12]} s={[0.08, 0.2, 0.38]} c={cor} linha={0} />)}
    <Bloco p={[0, 0.06, -0.3]} s={[0.66, 0.42, 0.08]} c={cor} linha={0} />
  </>
);
const CabeloLongoB = ({cor}) => (
  <>
    <Bloco p={[0, 0.3, -0.03]} s={[0.7, 0.14, 0.66]} c={cor} />
    <Bloco p={[0.08, 0.2, 0.28]} s={[0.5, 0.12, 0.12]} c={cor} linha={0} />
    {/* laterais até o ombro e cortina atrás até as costas */}
    {[-1, 1].map((s) => <Bloco key={s} p={[s * 0.33, -0.12, 0.02]} s={[0.1, 0.72, 0.56]} c={cor} />)}
    <Bloco p={[0, -0.25, -0.31]} s={[0.72, 1.0, 0.12]} c={cor} />
  </>
);

const CabecaB = ({p, t, v}) => {
  const pisca = piscar(t, v.fasePisca || 0);
  const ox = p.olhoX * 0.025, oy = p.olhoY * 0.02;
  const zF = 0.305;
  return (
    <group position={[0, 1.5, 0]} rotation={[p.hPitch, p.hYaw, p.hTilt]}>
      <group position={[0, 0.3, 0]}>
        <Bloco s={[0.6, 0.6, 0.6]} c={v.pele} />
        {v.cabelo === 'curto' ? <CabeloCurtoB cor={v.corCabelo} /> : <CabeloLongoB cor={v.corCabelo} />}
        {/* olhos: quadradinho branco, íris colorida e pupila, como pixels */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.13 + ox, 0.03 + oy, zF]} scale={[1, pisca, 1]}>
            <Det p={[0, 0, 0]} s={[0.12, 0.13, 0.01]} c="#FFFFFF" />
            <Det p={[s * -0.012, -0.01, 0.006]} s={[0.075, 0.1, 0.01]} c={v.iris} />
            <Det p={[s * -0.012, -0.01, 0.012]} s={[0.035, 0.05, 0.01]} c="#141010" />
            <Det p={[s * -0.012 + 0.022, 0.025, 0.016]} s={[0.022, 0.022, 0.01]} c="#FFFFFF" />
          </group>
        ))}
        {v.cilios ? [-1, 1].map((s) => <Det key={s} p={[s * 0.2 + ox, 0.1 + oy, zF]} s={[0.04, 0.025, 0.01]} c="#141010" />) : null}
        {/* sobrancelhas */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.13, 0.15 + p.sobrancelha * 0.03, zF]} rotation={[0, 0, s * (0.06 - p.sobrancelha * 0.14)]} material={M(v.corCabelo)}><boxGeometry args={[0.13, 0.03, 0.01]} /></mesh>
        ))}
        {/* boca: sorriso em degrau (3 blocos) ou "O" quadrado */}
        {p.boca > 0.5 ? (
          <Det p={[0, -0.14, zF]} s={[0.1, 0.1 * p.boca, 0.012]} c="#4A1E14" />
        ) : (
          <group position={[0, -0.13, zF]}>
            <Det p={[0, -0.02, 0]} s={[0.14 - p.boca * 0.06, 0.035, 0.012]} c={v.labio || '#4A1E14'} />
            {[-1, 1].map((s) => <Det key={s} p={[s * (0.085 - p.boca * 0.03), 0.005, 0]} s={[0.035, 0.035, 0.012]} c={v.labio || '#4A1E14'} />)}
          </group>
        )}
        {[-1, 1].map((s) => <Det key={s} p={[s * 0.22, -0.07, zF - 0.003]} s={[0.08, 0.04, 0.01]} c={v.bochecha} />)}
      </group>
    </group>
  );
};

export const VISUAL_B = {
  ele: {pele: '#EAB894', cabelo: 'curto', corCabelo: '#3A2618', iris: '#3D8FE0', bochecha: '#F2A6A0', camiseta: '#A7ACB2', manga: '#A7ACB2', calca: '#3D6FB6', tenis: '#F4F4F8', fasePisca: 0.9},
  ela: {pele: '#E6AD86', cabelo: 'longo', corCabelo: '#6A3A22', iris: '#5A3516', cilios: true, labio: '#B2454A', bochecha: '#F29C9C', camiseta: '#E04A2F', manga: '#26365F', calca: '#2E5690', tenis: '#FFFFFF', fasePisca: 2.1, escala: 0.94},
};

export const PessoaB = ({t, acoes = [{t: 0, a: 'parado'}], position = [0, 0, 0], rotationY = 0, scale = 1, visual = VISUAL_B.ele}) => {
  const v = visual;
  const p = misturar(POSES_BETO, acoes, t);
  return (
    <group position={position} rotation={[0, rotationY + p.yaw, 0]} scale={scale * (v.escala || 1)}>
      <Sombra r={0.6} y={-0.001} k={1 - p.y * 2} />
      <group position={[0, p.y, 0]}>
        <PernaB lado={1} r={p.pE} calca={v.calca} tenis={v.tenis} />
        <PernaB lado={-1} r={p.pD} calca={v.calca} tenis={v.tenis} />
        <group position={[0, 0.74, 0]} rotation={[p.lean, 0, 0]}>
          <group position={[0, -0.74, 0]}>
            <Bloco p={[0, 1.1, 0]} s={[0.74, 0.74, 0.38]} c={v.camiseta} />
            {/* barra da camiseta e cinto: dá leitura de roupa sem textura */}
            <Det p={[0, 0.77, 0]} s={[0.745, 0.06, 0.385]} c={v.calca} />
            <BracoB lado={1} a={p.aE} fw={p.fE} c={p.cE} manga={v.manga} pele={v.pele} />
            <BracoB lado={-1} a={p.aD} fw={p.fD} c={p.cD} manga={v.manga} pele={v.pele} />
            <CabecaB p={p} t={t} v={v} />
          </group>
        </group>
      </group>
    </group>
  );
};
export const Ele = (props) => <PessoaB {...props} visual={VISUAL_B.ele} />;
export const Ela = (props) => <PessoaB {...props} visual={VISUAL_B.ela} />;

// ============================================================
// PERITA EM BLOCOS: pera de camadas (voxel), olhos grandes, braços de bloco, lupa quadrada rosa
// ============================================================
const CAMADAS = [
  // [y base, altura, largura, cor]
  [0.0, 0.22, 0.86, COR.peraSombra],
  [0.22, 0.4, 1.0, COR.pera],
  [0.62, 0.38, 0.84, COR.pera],
  [1.0, 0.2, 0.6, '#FFD23A'],
  [1.2, 0.14, 0.42, '#FFDC4A'],
];
const BracoBloco = ({lado, mao, children}) => {
  const S = new THREE.Vector3(lado * 0.5, 0.48, 0.05), H = new THREE.Vector3(...mao);
  const d = H.clone().sub(S), len = Math.max(0.05, d.length());
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  const meio = S.clone().add(H).multiplyScalar(0.5);
  return (
    <>
      <group position={meio.toArray()} quaternion={q}>
        <Bloco s={[0.08, len, 0.08]} c={COR.contorno} linha={0} />
      </group>
      <group position={mao}>
        <Bloco s={[0.16, 0.16, 0.16]} c="#FFFFFF" />
        {children}
      </group>
    </>
  );
};
// lupa: aro quadrado branco com contorno, vidro azulado, cabo rosa
const VIDRO = new THREE.MeshStandardMaterial({color: '#CFEFFF', transparent: true, opacity: 0.4, roughness: 0.1});
const LupaB = ({inc = 0}) => (
  <group rotation={[0, 0, inc]}>
    <Bloco p={[0, 0.12, 0.02]} s={[0.08, 0.22, 0.08]} c={COR.rosa} />
    <group position={[0, 0.42, 0.04]}>
      {[[0, 0.18, 0.4, 0.06], [0, -0.18, 0.4, 0.06], [0.18, 0, 0.06, 0.42], [-0.18, 0, 0.06, 0.42]].map(([x, y, w, h], i) => (
        <Bloco key={i} p={[x, y, 0]} s={[w, h, 0.07]} c="#FFFFFF" />
      ))}
      <mesh material={VIDRO}><planeGeometry args={[0.3, 0.3]} /></mesh>
    </group>
  </group>
);

export const Perita = ({t, acoes = [{t: 0, a: 'parado'}], position = [0, 0, 0], rotationY = 0, scale = 1}) => {
  const p = misturar(POSES_PERITA, acoes, t);
  const pisca = piscar(t, 1.3);
  const sx = 1 / Math.sqrt(p.sq);
  const olhoGrande = 1 + p.lupa * 0.7;
  return (
    <group position={position} rotation={[0, rotationY + p.yaw, 0]} scale={scale}>
      <Sombra r={0.55} k={1 - p.y * 1.2} />
      <group position={[0, p.y + 0.14, 0]}>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.18, 0.06, 0]} rotation={[s > 0 ? p.pE : p.pD, 0, 0]}>
            <Bloco p={[0, -0.02, 0]} s={[0.07, 0.14, 0.07]} c={COR.contorno} linha={0} />
            <Bloco p={[0, -0.1, 0.05]} s={[0.17, 0.09, 0.24]} c={COR.rosa} />
          </group>
        ))}
        <group scale={[sx, p.sq, sx]} rotation={[0, 0, p.tilt]}>
          {CAMADAS.map(([y, h, w, c], i) => <Bloco key={i} p={[0, y + h / 2, 0]} s={[w, h, w]} c={c} linha={0.05} />)}
          {/* cabo e folha */}
          <group position={[0.02, 1.38, 0]} rotation={[0, 0, -0.25]}><Bloco s={[0.07, 0.2, 0.07]} c={COR.cabo} /></group>
          <group position={[0.1, 1.42, 0]} rotation={[0.2, 0, -0.9 + Math.sin(t * 2) * 0.08]}>
            <Bloco p={[0, 0.14, 0]} s={[0.16, 0.28, 0.05]} c={COR.folha} />
          </group>
          {/* olhos grandes quadrados (o direito cresce atrás da lupa) */}
          {[-1, 1].map((s) => {
            const g = s < 0 ? olhoGrande : 1;
            return (
              <group key={s} position={[s * 0.18, 0.76, 0.43]} scale={[g, g * pisca, g]}>
                <Bloco s={[0.2, 0.24, 0.02]} c="#FFFFFF" linha={0.04} />
                <Det p={[p.olhoX * 0.03, -0.02 + p.olhoY * 0.03, 0.015]} s={[0.1, 0.12, 0.01]} c="#141010" />
                <Det p={[0.03 + p.olhoX * 0.03, 0.02 + p.olhoY * 0.03, 0.022]} s={[0.035, 0.035, 0.01]} c="#FFFFFF" />
              </group>
            );
          })}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.18, 0.93 + p.sobrancelha * 0.035, 0.425]} rotation={[0, 0, s * (0.1 - p.sobrancelha * 0.15)]} material={M(COR.contorno)}><boxGeometry args={[0.17, 0.035, 0.02]} /></mesh>
          ))}
          {[-1, 1].map((s) => <Det key={s} p={[s * 0.36, 0.58, 0.505]} s={[0.12, 0.06, 0.01]} c={COR.bochecha} />)}
          {p.boca > 0.5 ? (
            <Det p={[0, 0.52, 0.505]} s={[0.12, 0.13 * p.boca, 0.012]} c="#4A1E14" />
          ) : (
            <group position={[0, 0.54, 0.505]}>
              <Det p={[0, -0.02, 0]} s={[0.16 - p.boca * 0.06, 0.04, 0.012]} c={COR.contorno} />
              {[-1, 1].map((s) => <Det key={s} p={[s * (0.1 - p.boca * 0.03), 0.01, 0]} s={[0.04, 0.04, 0.012]} c={COR.contorno} />)}
            </group>
          )}
          <BracoBloco lado={1} mao={p.mE} />
          <BracoBloco lado={-1} mao={p.mD}><LupaB inc={p.lupaInc} /></BracoBloco>
        </group>
      </group>
    </group>
  );
};

export const LuzBlocos = () => (
  <>
    <hemisphereLight args={['#FFF6E6', '#8FB7FF', 1.6]} />
    <directionalLight position={[3, 6, 4]} intensity={2.5} color="#FFF1D6" />
    <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#B9D4FF" />
  </>
);
