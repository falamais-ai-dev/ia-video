// Personagens fixos do Pera AI em 3D low-poly (Three.js dentro do ThreeCanvas do Remotion).
// Tudo feito com formas simples em código: sem modelo externo, sem IA, sem cota.
// Uso: <Beto t={seg} acoes={[{t: 0, a: 'acena'}, {t: 1.5, a: 'aponta'}]} />
//      <Perita t={seg} acoes={[{t: 0, a: 'lupa'}]} />
// t = tempo em segundos (frame / fps). As ações trocam com mistura de 0,25 s.
import React, {useMemo} from 'react';
import * as THREE from 'three';

// ---------- paleta (a mesma do perfil e do banner) ----------
export const COR = {
  pele: '#C68A5C', peleSombra: '#A86E44', cabelo: '#1E1610',
  camiseta: '#FFFFFF', jeans: '#3D6FB6', jeansEscuro: '#2E5690', tenis: '#F4F4F8', sola: '#FF4F7B',
  pera: '#FFC21A', peraLuz: '#FFE45C', peraSombra: '#F29A00', cabo: '#6B3E12', folha: '#4CC24A',
  contorno: '#2B1A00', rosa: '#FF4F7B', roxo: '#7B2FE0', roxoClaro: '#A447FF', branco: '#FFFFFF', bochecha: '#FF8FA8',
};

const lerp = (a, b, p) => a + (b - a) * p;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smooth = (x) => { const p = clamp01(x); return p * p * (3 - 2 * p); };
const mats = {};
const M = (color, extra = {}) => {
  const k = color + JSON.stringify(extra);
  if (!mats[k]) mats[k] = new THREE.MeshStandardMaterial({color, flatShading: true, roughness: 0.75, metalness: 0, ...extra});
  return mats[k];
};
const LINHA = new THREE.MeshBasicMaterial({color: COR.contorno, side: THREE.BackSide});

// piscar determinístico: fecha ~0,12 s a cada ~3 s
const piscar = (t, fase = 0) => {
  const c = (t + fase) % 3.1;
  return c < 0.12 ? 0.1 + Math.abs(c - 0.06) / 0.06 * 0.9 : 1;
};

// mistura de poses: acoes ordenadas por t; cada pose é um objeto de números
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

// ============================================================
// BETO: o "você" do roteiro. Brasileiro comum, camiseta branca e jeans,
// cabelo preto cacheado, pele morena. Proporção de boneco (cabeça grande).
// ============================================================
const BASE_B = {y: 0, lean: 0, yaw: 0, hYaw: 0, hPitch: 0, hTilt: 0,
  aE: 0.12, fE: 0, cE: 0.15, aD: 0.12, fD: 0, cD: 0.15, pE: 0, pD: 0,
  sobrancelha: 0, boca: 0, olhoX: 0, olhoY: 0};
const respira = (t) => Math.sin(t * 2.4) * 0.012;
// fase da faca (0 em cima, 1 embaixo), definida pelo vídeo
export let corteK = () => 0;
export const setCorte = (fn) => { corteK = fn; };
export const POSES_BETO = {
  parado: (l, t) => ({...BASE_B, y: respira(t), hTilt: Math.sin(t * 0.9) * 0.04}),
  acena: (l, t) => ({...BASE_B, y: respira(t), aD: 2.55 + Math.sin(l * 11) * 0.28, fD: 0.15, cD: 0.35, hTilt: 0.1, sobrancelha: 0.3}),
  aponta: (l, t) => ({...BASE_B, y: respira(t), aD: 1.45, fD: 0.35, cD: 0.05, hYaw: -0.5, olhoX: -1, lean: 0.03}),
  apontaCima: (l, t) => ({...BASE_B, y: respira(t), aD: 0.5, fD: 2.6, cD: 0.1, hPitch: -0.3, olhoY: 1}),
  surpresa: (l, t) => {
    const pulo = Math.max(0, Math.sin(Math.min(l, 0.42) / 0.42 * Math.PI)) * 0.18;
    return {...BASE_B, y: pulo, lean: -0.08, aE: 0.75, fE: 0.6, cE: 1.9, aD: 0.75, fD: 0.6, cD: 1.9, sobrancelha: 1, boca: 1, hPitch: -0.08};
  },
  pensa: (l, t) => ({...BASE_B, y: respira(t), aD: 0.1, fD: 0.75, cD: 2.75, aE: 0.25, fE: 0.4, cE: 1.3, hTilt: 0.18, hPitch: -0.12, olhoY: 1, olhoX: 0.6, sobrancelha: 0.5, boca: 0.25}),
  comemora: (l, t) => {
    const pulo = Math.abs(Math.sin(l * 6)) * 0.22;
    return {...BASE_B, y: pulo, aE: 2.75 + Math.sin(l * 12) * 0.1, cE: 0.2, aD: 2.75 - Math.sin(l * 12) * 0.1, cD: 0.2, pE: -0.25 * Math.abs(Math.sin(l * 6)), pD: -0.25 * Math.abs(Math.sin(l * 6)), sobrancelha: 0.6, boca: 0.6};
  },
  // cortar na tábua (vídeo da cebola): braço direito para a frente, subindo e descendo junto com a faca (corteK)
  // mão direita na frente do peito, sobre a tábua (no visual jogo de montar ela fica a ~0,5 un. à frente do corpo):
  // a faca vai na mão (maoD) e o braço inteiro desce no corte; mão esquerda segura a cebola
  corta: (l, t) => ({...BASE_B, y: respira(t), aD: -0.75, fD: 1.5 - 0.6 * corteK(t), cD: 0.8, aE: -0.55, fE: 1.0, cE: 0.6, hPitch: 0.28, olhoY: -1, lean: 0.05}),
  // mostra o objeto que está na mão esquerda (maoE), olhando para ele
  mostra: (l, t) => ({...BASE_B, y: respira(t), aE: -0.4, fE: 1.2, cE: 0.8, aD: 0.15, fD: 0.1, cD: 0.3, hYaw: 0.35, hPitch: 0.12, olhoX: 1, olhoY: -0.5, sobrancelha: 0.4, boca: 0.3}),
  // segura algo na mão direita (maoD) na frente do corpo
  segura: (l, t) => ({...BASE_B, y: respira(t), aD: -0.4, fD: 1.2, cD: 1.0, hYaw: -0.25, hPitch: 0.1, olhoX: -0.6, sobrancelha: 0.3}),
  duvida: (l, t) => ({...BASE_B, y: respira(t), aE: 0.55, fE: 0.5, cE: 1.2, aD: 0.55, fD: 0.5, cD: 1.2, hTilt: -0.2, sobrancelha: -0.4, boca: 0.35}),
};

const Braco = ({lado, a, fw, c, manga = COR.camiseta, pele = COR.pele}) => {
  // lado: +1 esquerdo (x+), -1 direito. a = abrir, fw = levantar para frente, c = dobrar cotovelo
  return (
    <group position={[lado * 0.37, 0.6, 0]} rotation={[-fw, 0, lado * a]}>
      <mesh position={[0, -0.09, 0]} material={M(manga)}><cylinderGeometry args={[0.12, 0.115, 0.22, 7]} /></mesh>
      <mesh position={[0, -0.27, 0]} material={M(pele)}><cylinderGeometry args={[0.078, 0.075, 0.2, 6]} /></mesh>
      <group position={[0, -0.36, 0]} rotation={[-c, 0, 0]}>
        <mesh position={[0, -0.13, 0]} material={M(pele)}><cylinderGeometry args={[0.075, 0.07, 0.27, 6]} /></mesh>
        <mesh position={[0, -0.3, 0]} scale={[1, 1.1, 0.9]} material={M(pele)}><icosahedronGeometry args={[0.095, 1]} /></mesh>
      </group>
    </group>
  );
};

const Perna = ({lado, r, calca = COR.jeans}) => (
  <group position={[lado * 0.16, 0.74, 0]} rotation={[r, 0, 0]}>
    <mesh position={[0, -0.33, 0]} material={M(calca)}><cylinderGeometry args={[0.135, 0.12, 0.64, 7]} /></mesh>
    <mesh position={[0, -0.68, 0.05]} material={M(COR.tenis)}><boxGeometry args={[0.22, 0.12, 0.36]} /></mesh>
    <mesh position={[0, -0.735, 0.05]} material={M(COR.sola)}><boxGeometry args={[0.235, 0.035, 0.375]} /></mesh>
  </group>
);

// cachos: bolinhas low-poly em volta do topo da cabeça (posições fixas)
const CACHOS = (() => {
  const out = [];
  let k = 0;
  for (let anel = 0; anel < 3; anel++) {
    const el = [1.25, 0.85, 0.42][anel], n = [9, 11, 8][anel];
    for (let i = 0; i < n; i++) {
      const az = (i / n) * Math.PI * 2 + anel * 0.4;
      // sem cachos na testa baixa (na frente, só o anel de cima)
      if (anel === 0 && Math.cos(az) > -0.1) continue;
      if (anel === 1 && Math.cos(az) > 0.55) continue;
      const r = 0.42;
      const x = Math.sin(az) * Math.cos(Math.PI / 2 - el) * r * 1.02, z = Math.cos(az) * Math.cos(Math.PI / 2 - el) * r * 0.98, y = Math.sin(Math.PI / 2 - el) * r;
      out.push({p: [x, y + 0.02, z - 0.01], s: 0.13 + ((k++ * 37) % 5) * 0.008});
    }
  }
  out.push({p: [0, 0.43, 0], s: 0.2});
  return out;
})();

// cabelo curto com topete (ele): calota cobrindo topo e nuca, mechas de volume na frente
const CabeloCurto = ({cor}) => (
  <group>
    <mesh rotation={[-0.6, 0, 0]} material={M(cor)}><sphereGeometry args={[0.455, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} /></mesh>
    {[[-0.14, 0.38, 0.2, 0.13], [0.04, 0.42, 0.2, 0.14], [0.19, 0.36, 0.18, 0.12], [-0.02, 0.44, 0.02, 0.15]].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]} scale={[1.2, 0.7, 1]} material={M(cor)}><icosahedronGeometry args={[r, 0]} /></mesh>
    ))}
  </group>
);
// cabelo comprido liso (ela): calota com risca, cortina atrás até as costas e mechas na frente dos ombros
const CabeloLongo = ({cor}) => (
  <group>
    <mesh rotation={[-0.5, 0, 0]} material={M(cor)}><sphereGeometry args={[0.46, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.52]} /></mesh>
    <mesh position={[0, -0.42, -0.14]} material={M(cor)}><cylinderGeometry args={[0.43, 0.38, 0.75, 10, 1, false, Math.PI * 0.55, Math.PI * 0.9]} /></mesh>
    <mesh position={[0, -0.42, -0.14]} rotation={[0, Math.PI, 0]} material={M(cor)}><cylinderGeometry args={[0.43, 0.38, 0.75, 10, 1, false, Math.PI * 0.55, Math.PI * 0.9]} /></mesh>
    <mesh position={[0, -0.42, -0.2]} scale={[1, 1, 0.5]} material={M(cor)}><cylinderGeometry args={[0.4, 0.36, 0.75, 10]} /></mesh>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.36, -0.3, 0.1]} rotation={[0.1, 0, s * 0.06]} material={M(cor)}><boxGeometry args={[0.14, 0.62, 0.2]} /></mesh>
    ))}
    {/* franja com risca de lado */}
    <mesh position={[0.1, 0.3, 0.3]} rotation={[0.5, 0, -0.5]} scale={[1.6, 0.6, 0.7]} material={M(cor)}><icosahedronGeometry args={[0.14, 0]} /></mesh>
    <mesh position={[-0.2, 0.27, 0.28]} rotation={[0.5, 0, 0.6]} scale={[1.3, 0.6, 0.7]} material={M(cor)}><icosahedronGeometry args={[0.12, 0]} /></mesh>
  </group>
);

const Cabeca = ({p, t, v}) => {
  const pisca = piscar(t, v.fasePisca || 0);
  const olhoY = 0.02 + p.olhoY * 0.025;
  const ox = p.olhoX * 0.025;
  const cabelo = v.corCabelo || COR.cabelo;
  return (
    <group position={[0, 0.88, 0]} rotation={[p.hPitch, p.hYaw, p.hTilt]}>
      <group position={[0, 0.36, 0]}>
        <mesh scale={[1, 1.06, 0.95]} material={M(v.pele)}><icosahedronGeometry args={[0.42, 2]} /></mesh>
        {/* orelhas e nariz */}
        <mesh position={[0.41, -0.02, 0]} scale={[0.5, 1, 0.8]} material={M(v.pele)}><icosahedronGeometry args={[0.09, 0]} /></mesh>
        <mesh position={[-0.41, -0.02, 0]} scale={[0.5, 1, 0.8]} material={M(v.pele)}><icosahedronGeometry args={[0.09, 0]} /></mesh>
        <mesh position={[0, -0.06, 0.4]} material={M(v.peleSombra)}><icosahedronGeometry args={[0.05, 0]} /></mesh>
        {/* cabelo */}
        {v.cabelo === 'cachos' ? CACHOS.map((c, i) => <mesh key={i} position={c.p} material={M(cabelo)}><icosahedronGeometry args={[c.s, 0]} /></mesh>) : null}
        {v.cabelo === 'curto' ? <CabeloCurto cor={cabelo} /> : null}
        {v.cabelo === 'longo' ? <CabeloLongo cor={cabelo} /> : null}
        {/* olhos: ponto preto (Beto) ou íris colorida com pupila e brilho */}
        {[-1, 1].map((s) => v.iris ? (
          <group key={s} position={[s * 0.14 + ox, olhoY, 0.372]} scale={[1, pisca, 1]}>
            <mesh scale={[0.058, 0.08, 0.035]} material={M(v.iris, {roughness: 0.3})}><sphereGeometry args={[1, 12, 8]} /></mesh>
            <mesh position={[0, -0.004, 0.022]} scale={[0.03, 0.042, 0.02]} material={M('#141010', {roughness: 0.2})}><sphereGeometry args={[1, 10, 8]} /></mesh>
            <mesh position={[0.018, 0.025, 0.03]} scale={0.013} material={M(COR.branco)}><sphereGeometry args={[1, 6, 4]} /></mesh>
          </group>
        ) : (
          <mesh key={s} position={[s * 0.14 + ox, olhoY, 0.375]} scale={[0.055, 0.085 * pisca, 0.04]} material={M('#141010', {roughness: 0.3})}><sphereGeometry args={[1, 10, 8]} /></mesh>
        ))}
        {/* cílios (ela) */}
        {v.cilios ? [-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.2 + ox, olhoY + 0.06 * pisca, 0.35]} rotation={[0, s * 0.4, s * -0.6]} material={M('#141010')}><boxGeometry args={[0.05, 0.018, 0.02]} /></mesh>
        )) : null}
        {/* sobrancelhas */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.14, 0.14 + p.sobrancelha * 0.04, 0.37]} rotation={[0, 0, s * (0.08 - p.sobrancelha * 0.12)]} material={M(cabelo)}><boxGeometry args={[v.sobrancelhaGrossa ? 0.15 : 0.13, v.sobrancelhaGrossa ? 0.042 : 0.03, 0.03]} /></mesh>
        ))}
        {/* bigode e cavanhaque (ele) */}
        {v.bigode ? (
          <group position={[0, -0.115, 0.385]}>
            {[-1, 1].map((s) => <mesh key={s} position={[s * 0.055, 0, 0]} rotation={[0, s * 0.35, s * 0.28]} scale={[1, 0.55, 0.6]} material={M(cabelo)}><boxGeometry args={[0.13, 0.06, 0.06]} /></mesh>)}
          </group>
        ) : null}
        {v.cavanhaque ? (
          <>
            <mesh position={[0, -0.345, 0.28]} rotation={[0.6, 0, 0]} scale={[1.1, 0.75, 0.7]} material={M(cabelo)}><icosahedronGeometry args={[0.085, 0]} /></mesh>
          </>
        ) : null}
        {/* boca: sorriso que vira "O" com boca > 0.5 */}
        {p.boca > 0.5 ? (
          <mesh position={[0, -0.19, 0.37]} scale={[0.055, 0.07 * p.boca, 0.03]} material={M('#4A1E14')}><sphereGeometry args={[1, 10, 8]} /></mesh>
        ) : (
          <mesh position={[0, v.bigode ? -0.185 : -0.16, 0.37]} rotation={[0, 0, Math.PI]} material={M(v.labio || '#4A1E14')}><torusGeometry args={[(v.bigode ? 0.06 : 0.085) - p.boca * 0.04, 0.016, 4, 12, Math.PI]} /></mesh>
        )}
        {v.bochecha ? [-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.24, -0.1, 0.32]} rotation={[0, s * 0.6, 0]} scale={[0.06, 0.035, 0.02]} material={M(v.bochecha)}><sphereGeometry args={[1, 8, 6]} /></mesh>
        )) : null}
      </group>
    </group>
  );
};

// peraazinha bordada no peito (o próprio logo do canal, sem marca de terceiros)
const Emblema = () => (
  <group position={[0.15, 0.5, 0.33]} rotation={[-0.05, 0.4, 0]} scale={0.14}>
    <mesh position={[0, -0.25, 0]} material={M(COR.pera)}><sphereGeometry args={[0.5, 10, 8]} /></mesh>
    <mesh position={[0, 0.25, 0]} material={M(COR.pera)}><sphereGeometry args={[0.32, 10, 8]} /></mesh>
    <mesh position={[0.12, 0.68, 0]} rotation={[0, 0, -0.8]} scale={[0.12, 0.28, 0.05]} material={M(COR.folha)}><sphereGeometry args={[1, 8, 6]} /></mesh>
  </group>
);

// visuais prontos, sem nomes. ELE é o personagem principal (o "você"); ELA e a Perita aparecem às vezes. Beto fica como reserva.
export const VISUAL = {
  beto: {pele: COR.pele, peleSombra: COR.peleSombra, cabelo: 'cachos', corCabelo: COR.cabelo, camiseta: COR.camiseta, manga: COR.camiseta, calca: COR.jeans},
  // ele (o principal): versão criança, sem barba. Pele clara, cabelo castanho-escuro curto com topete, olhos azuis, camiseta cinza lisa
  ele: {pele: '#EAB894', peleSombra: '#D39A76', cabelo: 'curto', corCabelo: '#3A2618', iris: '#3D8FE0', bochecha: '#F2A6A0', camiseta: '#A7ACB2', manga: '#A7ACB2', calca: COR.jeans, fasePisca: 0.9},
  // ela: pele clara-morena, cabelo castanho comprido liso, olhos castanhos, blusa vermelha com mangas azul-marinho
  ela: {pele: '#E6AD86', peleSombra: '#CC9068', cabelo: 'longo', corCabelo: '#6A3A22', iris: '#5A3516', cilios: true, labio: '#B2454A', bochecha: '#F29C9C', camiseta: '#E04A2F', manga: '#26365F', calca: COR.jeansEscuro, fasePisca: 2.1, escala: 0.94},
};

export const Pessoa = ({t, acoes = [{t: 0, a: 'parado'}], position = [0, 0, 0], rotationY = 0, scale = 1, visual = VISUAL.beto, emblema = false}) => {
  const v = visual;
  const p = misturar(POSES_BETO, acoes, t);
  return (
    <group position={position} rotation={[0, rotationY + p.yaw, 0]} scale={scale * (v.escala || 1)}>
      <Sombra r={0.55} y={-0.001} k={1 - p.y * 2} />
      <group position={[0, p.y, 0]}>
        <Perna lado={1} r={p.pE} calca={v.calca} />
        <Perna lado={-1} r={p.pD} calca={v.calca} />
        <group position={[0, 0.74, 0]} rotation={[p.lean, 0, 0]}>
          <mesh position={[0, 0.04, 0]} material={M(v.calca)}><cylinderGeometry args={[0.31, 0.3, 0.16, 8]} /></mesh>
          <mesh position={[0, 0.38, 0]} material={M(v.camiseta)}><cylinderGeometry args={[0.34, 0.32, 0.6, 8]} /></mesh>
          <mesh position={[0, 0.69, 0]} scale={[1, 0.45, 0.85]} material={M(v.manga === v.camiseta ? v.camiseta : v.manga)}><sphereGeometry args={[0.34, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
          {emblema ? <Emblema /> : null}
          <mesh position={[0, 0.78, 0]} material={M(v.pele)}><cylinderGeometry args={[0.1, 0.11, 0.18, 6]} /></mesh>
          <Braco lado={1} a={p.aE} fw={p.fE} c={p.cE} manga={v.manga} pele={v.pele} />
          <Braco lado={-1} a={p.aD} fw={p.fD} c={p.cD} manga={v.manga} pele={v.pele} />
          <Cabeca p={p} t={t} v={v} />
        </group>
      </group>
    </group>
  );
};
export const Beto = ({camiseta, ...props}) => <Pessoa {...props} visual={camiseta ? {...VISUAL.beto, camiseta, manga: camiseta} : VISUAL.beto} />;
export const Ele = (props) => <Pessoa {...props} visual={VISUAL.ele} />;
export const Ela = (props) => <Pessoa {...props} visual={VISUAL.ela} />;

// ============================================================
// PERITA: a pera do logo, viva. Detetive do canal ("perita" = quem investiga).
// Corpo de pera com contorno escuro como no perfil, olhos grandes, lupa rosa.
// ============================================================
const PERFIL_PERA = [[0, 0], [0.3, 0.02], [0.47, 0.13], [0.56, 0.32], [0.56, 0.5], [0.5, 0.68], [0.39, 0.84], [0.3, 0.98], [0.26, 1.1], [0.21, 1.22], [0.12, 1.31], [0, 1.34]];
const usarPera = () => useMemo(() => {
  const pts = PERFIL_PERA.map(([r, y]) => new THREE.Vector2(r, y));
  const g = new THREE.LatheGeometry(pts, 14);
  g.computeVertexNormals();
  // cor por vértice: mais claro em cima à esquerda, mais escuro embaixo (como o degradê do logo)
  const cor = [], pos = g.attributes.position, a = new THREE.Color(COR.peraLuz), b = new THREE.Color(COR.pera), c = new THREE.Color(COR.peraSombra), tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 1.34, x = pos.getX(i);
    const k = clamp01(0.55 * (1 - y) + 0.3 * (x > 0 ? x : 0) - 0.1);
    tmp.copy(b).lerp(k > 0.5 ? c : a, Math.abs(k - 0.5) * 2 * (k > 0.5 ? 1 : 0.6));
    cor.push(tmp.r, tmp.g, tmp.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(cor, 3));
  return g;
}, []);
const MPERA = new THREE.MeshStandardMaterial({vertexColors: true, flatShading: true, roughness: 0.6});

// braços de "mangueira" (desenho animado clássico): cada pose diz onde fica a mão
// (mE = mão esquerda, x+; mD = mão direita, que segura a lupa), no espaço do corpo.
const BASE_P = {y: 0, sq: 1, yaw: 0, tilt: 0, mE: [0.8, 0.2, 0.15], mD: [-0.8, 0.2, 0.15], lupaInc: 0.35, lupa: 0, sobrancelha: 0, boca: 0, olhoX: 0, olhoY: 0, pE: 0, pD: 0};
const quica = (t) => 1 + Math.sin(t * 3) * 0.02;
export const POSES_PERITA = {
  parado: (l, t) => ({...BASE_P, sq: quica(t), tilt: Math.sin(t * 1.1) * 0.05, mE: [0.8, 0.2 + Math.sin(t * 3) * 0.02, 0.15]}),
  acena: (l, t) => ({...BASE_P, sq: quica(t), mE: [0.85 + Math.sin(l * 11) * 0.12, 1.1, 0.2], tilt: -0.08, sobrancelha: 0.3}),
  // lupa na frente do olho direito: o olho fica enorme atrás do vidro
  lupa: (l, t) => ({...BASE_P, sq: quica(t), mD: [-0.2, 0.3, 0.75], lupaInc: 0, lupa: smooth(l / 0.35), tilt: 0.04, yaw: Math.sin(l * 2.2) * 0.15, sobrancelha: 0.4, olhoX: Math.sin(l * 2.2) * 0.5}),
  // "Pera aí!": mão levantada para a frente, testa franzida
  peraAi: (l, t) => {
    const k = smooth(l / 0.2);
    return {...BASE_P, sq: 1 + (1 - k) * 0.1, mE: [0.62, 0.92, 0.5], sobrancelha: -0.7, boca: 0.4, tilt: -0.06};
  },
  surpresa: (l, t) => {
    const pulo = Math.max(0, Math.sin(Math.min(l, 0.45) / 0.45 * Math.PI));
    return {...BASE_P, y: pulo * 0.35, sq: 1 + (pulo > 0.05 ? 0.12 : -0.1 * smooth(l / 0.1)), mE: [0.85, 0.95, 0.25], mD: [-0.85, 0.75, 0.25], lupaInc: 0.6, sobrancelha: 1, boca: 1};
  },
  pulo: (l, t) => {
    const fase = (l * 2.2) % 1;
    const alto = Math.sin(fase * Math.PI);
    const sq = fase < 0.1 || fase > 0.92 ? 0.86 : 1 + alto * 0.08;
    return {...BASE_P, y: alto * 0.42, sq, mE: [0.75, 1.15, 0.1], mD: [-0.75, 1.0, 0.1], lupaInc: 0.2, boca: 0.6, sobrancelha: 0.6, pE: -0.4 * alto, pD: 0.4 * alto};
  },
  explica: (l, t) => ({...BASE_P, sq: quica(t), mE: [0.75 + Math.sin(l * 4) * 0.08, 0.55 + Math.sin(l * 4) * 0.08, 0.55], tilt: 0.08, sobrancelha: 0.2, boca: 0.3 + Math.abs(Math.sin(l * 9)) * 0.2}),
};

const BracoPera = ({lado, mao, children}) => {
  const S = new THREE.Vector3(lado * 0.5, 0.5, 0.12), H = new THREE.Vector3(...mao);
  const C = S.clone().add(H).multiplyScalar(0.5).add(new THREE.Vector3(lado * 0.1, -0.1, 0));
  const curva = new THREE.QuadraticBezierCurve3(S, C, H);
  return (
    <>
      <mesh material={M(COR.contorno)}><tubeGeometry args={[curva, 12, 0.03, 5, false]} /></mesh>
      <group position={mao}>
        <mesh material={LINHA} scale={1.18}><icosahedronGeometry args={[0.085, 1]} /></mesh>
        <mesh material={M(COR.branco)}><icosahedronGeometry args={[0.085, 1]} /></mesh>
        {children}
      </group>
    </>
  );
};

const VIDRO = new THREE.MeshStandardMaterial({color: '#CFEFFF', transparent: true, opacity: 0.35, roughness: 0.1});
// lupa presa à mão: cabo rosa para cima, aro branco com contorno (inc = inclinação para fora)
const Lupa = ({inc = 0}) => (
  <group rotation={[0, 0, inc]}>
    <mesh position={[0, 0.1, 0.02]} material={M(COR.rosa)}><cylinderGeometry args={[0.045, 0.045, 0.2, 6]} /></mesh>
    <group position={[0, 0.42, 0.04]}>
      <mesh material={LINHA} scale={[1.05, 1.05, 1.6]}><torusGeometry args={[0.2, 0.04, 6, 18]} /></mesh>
      <mesh material={M(COR.branco)}><torusGeometry args={[0.2, 0.04, 6, 18]} /></mesh>
      <mesh material={VIDRO}><circleGeometry args={[0.19, 18]} /></mesh>
    </group>
  </group>
);

export const Perita = ({t, acoes = [{t: 0, a: 'parado'}], position = [0, 0, 0], rotationY = 0, scale = 1}) => {
  const geo = usarPera();
  const p = misturar(POSES_PERITA, acoes, t);
  const pisca = piscar(t, 1.3);
  const sx = 1 / Math.sqrt(p.sq);
  const olhoGrande = 1 + p.lupa * 0.7;
  return (
    <group position={position} rotation={[0, rotationY + p.yaw, 0]} scale={scale}>
      <Sombra r={0.5} k={1 - p.y * 1.2} />
      <group position={[0, p.y + 0.14, 0]}>
        {/* perninhas e tênis rosa */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.16, 0.08, 0]} rotation={[s > 0 ? p.pE : p.pD, 0, 0]}>
            <mesh position={[0, -0.04, 0]} material={M(COR.contorno)}><cylinderGeometry args={[0.032, 0.032, 0.16, 5]} /></mesh>
            <mesh position={[0, -0.13, 0.05]} material={M(COR.rosa)} scale={[1, 0.6, 1.4]}><icosahedronGeometry args={[0.08, 1]} /></mesh>
          </group>
        ))}
        <group scale={[sx, p.sq, sx]} rotation={[0, 0, p.tilt]}>
          <mesh geometry={geo} material={MPERA} />
          <mesh geometry={geo} material={LINHA} scale={[1.045, 1.03, 1.045]} position={[0, -0.02, 0]} />
          {/* brilho branco do logo */}
          <mesh position={[-0.33, 0.42, 0.37]} rotation={[0, -0.7, 0.25]} scale={[0.045, 0.2, 0.02]} material={M('#FFF6D8', {roughness: 0.3})}><sphereGeometry args={[1, 8, 6]} /></mesh>
          {/* cabo e folha */}
          <mesh position={[0.02, 1.44, 0]} rotation={[0, 0, -0.25]} material={M(COR.cabo)}><cylinderGeometry args={[0.03, 0.04, 0.24, 5]} /></mesh>
          <group position={[0.1, 1.5, 0]} rotation={[0.2, 0, -0.9 + Math.sin(t * 2) * 0.08]}>
            <mesh position={[0, 0.15, 0]} scale={[0.09, 0.17, 0.03]} material={LINHA}><sphereGeometry args={[1.15, 8, 6]} /></mesh>
            <mesh position={[0, 0.15, 0]} scale={[0.09, 0.17, 0.03]} material={M(COR.folha)}><sphereGeometry args={[1, 8, 6]} /></mesh>
          </group>
          {/* rosto */}
          {[-1, 1].map((s) => {
            const g = s < 0 ? olhoGrande : 1;
            return (
              <group key={s} position={[s * 0.16, 0.74, 0.405]} rotation={[-0.1, s * 0.3, 0]} scale={[g, g * pisca, g]}>
                <mesh scale={[0.115, 0.14, 0.06]} material={LINHA}><sphereGeometry args={[1.12, 12, 8]} /></mesh>
                <mesh scale={[0.115, 0.14, 0.06]} material={M(COR.branco, {roughness: 0.4})}><sphereGeometry args={[1, 12, 8]} /></mesh>
                <mesh position={[p.olhoX * 0.03, -0.015 + p.olhoY * 0.03, 0.05]} scale={[0.06, 0.07, 0.03]} material={M('#141010', {roughness: 0.2})}><sphereGeometry args={[1, 10, 8]} /></mesh>
                <mesh position={[0.02 + p.olhoX * 0.03, 0.015 + p.olhoY * 0.03, 0.075]} scale={0.018} material={M(COR.branco)}><sphereGeometry args={[1, 6, 4]} /></mesh>
              </group>
            );
          })}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.16, 0.93 + p.sobrancelha * 0.04, 0.4]} rotation={[0, s * 0.3, s * (0.1 - p.sobrancelha * 0.15)]} material={M(COR.contorno)}><boxGeometry args={[0.13, 0.03, 0.03]} /></mesh>
          ))}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.3, 0.58, 0.44]} rotation={[0, s * 0.6, 0]} scale={[0.07, 0.04, 0.02]} material={M(COR.bochecha)}><sphereGeometry args={[1, 8, 6]} /></mesh>
          ))}
          {p.boca > 0.5 ? (
            <mesh position={[0, 0.54, 0.5]} scale={[0.06, 0.075 * p.boca, 0.03]} material={M('#4A1E14')}><sphereGeometry args={[1, 10, 8]} /></mesh>
          ) : (
            <mesh position={[0, 0.57, 0.5]} rotation={[0, 0, Math.PI]} material={M(COR.contorno)}><torusGeometry args={[0.085 - p.boca * 0.04, 0.018, 4, 12, Math.PI]} /></mesh>
          )}
          <BracoPera lado={1} mao={p.mE} />
          <BracoPera lado={-1} mao={p.mD}><Lupa inc={p.lupaInc} /></BracoPera>
        </group>
      </group>
    </group>
  );
};

// sombra de contato redonda (sem shadow map: mais rápido no render)
const SOMBRA = new THREE.MeshBasicMaterial({color: '#000000', transparent: true, opacity: 0.18, depthWrite: false});
export const Sombra = ({r = 0.5, y = 0.002, k = 1}) => (
  <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={Math.max(0.4, k)} material={SOMBRA}><circleGeometry args={[r, 24]} /></mesh>
);

// luz padrão das cenas com personagem: dia claro e quente
export const LuzPersonagem = () => (
  <>
    <hemisphereLight args={['#FFF4E0', '#A890D0', 1.7]} />
    <directionalLight position={[3, 5, 4]} intensity={2.4} color="#FFF1D6" />
    <directionalLight position={[-4, 2, -2]} intensity={0.45} color="#B9A4FF" />
  </>
);
