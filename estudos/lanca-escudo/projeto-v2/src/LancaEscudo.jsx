// Teste de estilo (31/10/2026): recriação dos ~15 s iniciais do Short de referência "lança x escudo",
// com assets 100% próprios (tudo em código). Mesmo ritmo de planos, mesmas piadas, mesmo timing palavra -> ação.
import React from 'react';
import * as THREE from 'three';
import {AbsoluteFill, useCurrentFrame, Easing, Audio, staticFile, getInputProps} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {T, B, HULL, Tn, Esf, Cx, Ci, Co, Palito, canvasTex, Brilho, Anel, Faisca, Gota, Boneco, maoMundo, Coroa, Capa, Barba, Bigode, Lanca, pontaLanca} from './toon';
import {PALAVRAS} from './palavras';
import {Borrao, Aquece} from './cinema';
import {PosToon} from './pos';

export const FPS = 30;
export const DUR_LE = Math.round(19.5 * FPS);
const W = 1080, H = 1920;
const IN = getInputProps();
const DPR = IN.dpr || 1;

// ---------- tempo ----------
const io = Easing.inOut(Easing.cubic);
const back = Easing.out(Easing.back(1.7));
const lerp = (a, b, p) => a + (b - a) * p;
const mix = (a, b, p) => Array.isArray(a) ? a.map((v, i) => lerp(v, b[i], p)) : lerp(a, b, p);
// keyframes [[t, v], ...]; v número ou vetor; ease opcional por chave ([t, v, ease])
const kf = (t, keys, ez = io) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1], [t1, v1, e] = keys[i];
      const p = (t - t0) / Math.max(1e-6, t1 - t0);
      return mix(v0, v1, (e || ez)(p));
    }
  }
  return keys[keys.length - 1][1];
};
const fx = (t, t0, d) => (t - t0) / d; // 0..1 durante o efeito
const W_ = (txt, n = 0) => { // início da n-ésima ocorrência da palavra
  let c = 0;
  for (const p of PALAVRAS) if (p.w.toLowerCase().replace(/[.,!?]/g, '') === txt) { if (c === n) return p.s; c++; }
  throw new Error('palavra ' + txt);
};
const TM = {
  lanca: W_('lança'), furava: W_('furava'), qualquer: W_('qualquer'), coisa: W_('coisa'), rei: W_('rei'), escudo: W_('escudo'),
  nada: W_('nada'), furava2: W_('furava', 1), pior: W_('pior'), os: W_('os'), guerra: W_('guerra'), cem: W_('cem'),
  agora: W_('agora'), arma: W_('arma'), entao: W_('então'), exercitos: W_('exércitos'), campo: W_('campo'),
  lanca2: W_('lança', 1), escudo2: W_('escudo', 1),
};
export const TEMPOS = TM;
const X0 = 300; // centro do campo de batalha

// ---------- câmera ----------
const PLANOS = [
  {t0: 0, keys: [
    [0, [0.05, 1.95, 6.3], [0.05, 1.38, 0], 50],
    [TM.qualquer + 0.3, [-0.2, 1.8, 5.4], [-0.25, 1.28, 0], 50],
    [TM.escudo + 0.05, [0.8, 1.5, 3.1], [0.85, 0.98, 0], 50],
    [TM.pior - 0.25, [0.85, 1.45, 2.85], [0.88, 0.96, 0], 50],
    [TM.pior + 0.35, [0.05, 1.95, 6.2], [0.05, 1.36, 0], 50],
    [TM.os - 0.02, [0.07, 1.92, 5.95], [0.05, 1.36, 0], 50],
    // chicote para a esquerda
    [TM.os + 0.28, [-3.05, 1.35, 3.3], [-3.4, 0.8, -0.3], 46],
    [TM.cem - 0.25, [-3.1, 1.15, 2.45], [-3.25, 0.82, -0.35], 46],
    [TM.agora - 0.15, [-3.1, 1.12, 2.3], [-3.25, 0.82, -0.35], 46],
    // grua para trás e para cima: revela a ponte, o rio e os patinhos
    [TM.arma - 0.6, [9.5, 5.6, 9.8], [2.0, -1.3, 0.3], 50],
    [TM.entao, [42, 31, 1.5], [0, -2, 0], 50],
  ]},
  {t0: TM.entao, keys: [
    [TM.entao, [X0, 19, 1.0], [X0, 0, -2.2], 46],
    [TM.exercitos + 0.1, [X0, 16, 0.6], [X0, 0, -2.0], 46],
  ]},
  {t0: TM.exercitos + 0.1, keys: [
    [TM.exercitos + 0.1, [X0, 0.45, 7.6], [X0, 0.9, 0], 42],
    [TM.lanca2 - 0.1, [X0 - 0.55, 1.0, 2.6], [X0 - 0.9, 0.84, 0], 42],
    [TM.escudo2 - 0.35, [X0 - 0.5, 0.98, 2.45], [X0 - 0.88, 0.84, 0], 42],
    [TM.escudo2 + 0.05, [X0 + 0.55, 1.0, 2.6], [X0 + 0.9, 0.84, 0], 42],
    [19.5, [X0 + 0.55, 0.97, 2.3], [X0 + 0.9, 0.84, 0], 42],
  ]},
];
const camEm = (t) => {
  let pl = PLANOS[0];
  for (const p of PLANOS) if (t >= p.t0) pl = p;
  const k = pl.keys;
  let i = 1; while (i < k.length - 1 && t > k[i][0]) i++;
  const [t0, p0, l0, f0] = k[i - 1], [t1, p1, l1, f1] = k[i];
  const u = io(Math.max(0, Math.min(1, (t - t0) / Math.max(1e-6, t1 - t0))));
  return {pos: mix(p0, p1, u), look: mix(l0, l1, u), fov: lerp(f0, f1, u)};
};
const Cam = ({c}) => {
  const {camera} = useThree();
  camera.position.set(...c.pos);
  if (camera.fov !== c.fov) { camera.fov = c.fov; }
  camera.near = 0.05; camera.far = 900; camera.updateProjectionMatrix();
  camera.lookAt(...c.look);
  return null;
};

// ---------- céu, névoa e luz ----------
const CEU = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: 'varying vec3 vp; void main(){ vp = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: 'varying vec3 vp; void main(){ float h = clamp(vp.y*1.6+0.08,0.0,1.0); vec3 c = mix(vec3(0.86,0.93,0.97), vec3(0.33,0.62,0.92), pow(h,0.8)); gl_FragColor = vec4(c,1.0); }',
});
const Ceu = ({c}) => <mesh position={c.pos} material={CEU} renderOrder={-1}><sphereGeometry args={[600, 32, 16]} /></mesh>;
const Luz = ({alvo, area}) => {
  const {scene} = useThree();
  const ref = React.useRef();
  React.useLayoutEffect(() => { if (ref.current) { ref.current.target.position.set(...alvo); ref.current.target.updateMatrixWorld(); scene.add(ref.current.target); } });
  return (
    <>
      <hemisphereLight args={['#FFF4E2', '#8DB36A', 1.25]} />
      <directionalLight ref={ref} position={[alvo[0] - 7, alvo[1] + 12, alvo[2] + 6]} intensity={2.3} color="#FFE9C8" castShadow
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0005} shadow-normalBias={0.03}
        shadow-camera-left={-area} shadow-camera-right={area} shadow-camera-top={area} shadow-camera-bottom={-area} shadow-camera-near={0.5} shadow-camera-far={area * 6 + 30} />
    </>
  );
};

// ---------- texturas ----------
const texLajota = () => canvasTex('lajota', 512, 512, (g, w) => {
  g.fillStyle = '#E3CFA4'; g.fillRect(0, 0, w, w);
  const n = 4; const s = w / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const o = (j % 2) * s / 2; const v = ((i * 7 + j * 13) % 5) * 5;
    g.fillStyle = `rgb(${222 - v},${203 - v},${158 - v})`; g.fillRect(i * s + o + 4, j * s + 4, s - 8, s - 8);
  }
  g.strokeStyle = '#B79B6E'; g.lineWidth = 5;
  for (let j = 0; j <= n; j++) { g.beginPath(); g.moveTo(0, j * s); g.lineTo(w, j * s); g.stroke(); }
  for (let j = 0; j < n; j++) for (let i = 0; i <= n; i++) { const x = i * s + (j % 2) * s / 2; g.beginPath(); g.moveTo(x, j * s); g.lineTo(x, j * s + s); g.stroke(); }
});
const texPedra = () => canvasTex('pedra', 512, 512, (g, w) => {
  g.fillStyle = '#B9AE9A'; g.fillRect(0, 0, w, w);
  const rows = 6, h = w / rows;
  for (let j = 0; j < rows; j++) { const o = (j % 2) * 40; for (let x = -80 + o; x < w; x += 110) { const v = ((x * 3 + j * 17) % 6) * 6; g.fillStyle = `rgb(${196 - v},${184 - v},${162 - v})`; g.fillRect(x + 4, j * h + 4, 102, h - 8); } }
  g.strokeStyle = '#8E8371'; g.lineWidth = 6;
  for (let j = 0; j <= rows; j++) { g.beginPath(); g.moveTo(0, j * h); g.lineTo(w, j * h); g.stroke(); }
});
const texRetalhos = (key, seed) => canvasTex(key, 1024, 1024, (g, w) => {
  const cores = ['#86C552', '#A9D660', '#E4CF66', '#6DB447', '#C8DA6A', '#93C95A', '#D9B85A'];
  let r = seed; const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
  g.fillStyle = '#7DBF4E'; g.fillRect(0, 0, w, w);
  const n = 10, s = w / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    g.fillStyle = cores[Math.floor(rnd() * cores.length)];
    g.fillRect(i * s, j * s, s, s);
    if (rnd() > 0.5) { g.strokeStyle = 'rgba(80,120,40,0.35)'; g.lineWidth = 6; for (let k = 8; k < s; k += 18) { g.beginPath(); g.moveTo(i * s + k, j * s); g.lineTo(i * s + k, j * s + s); g.stroke(); } }
  }
  g.strokeStyle = '#4E8C34'; g.lineWidth = 10;
  for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, w); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke(); }
});
const texPlaca = () => canvasTex('placa', 1024, 512, (g, w, h) => {
  g.fillStyle = '#B9824A'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(90,50,20,0.35)'; g.lineWidth = 6; for (let y = 40; y < h; y += 70) { g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + 12, w * 0.6, y - 10, w, y + 6); g.stroke(); }
  g.fillStyle = '#D8323C'; g.fillRect(0, 0, w / 2, 70); g.fillStyle = '#1FA3A0'; g.fillRect(w / 2, 0, w / 2, 70);
  g.fillStyle = '#2B1A0E'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '900 150px Montserrat'; g.fillText('ANOS DE', w / 2, 200); g.fillText('GUERRA', w / 2, 375);
  g.strokeStyle = '#2B1A0E'; g.lineWidth = 18; g.strokeRect(9, 9, w - 18, h - 18);
});
const texDigito = (d) => canvasTex('dig' + d, 256, 320, (g, w, h) => {
  g.fillStyle = '#F4EBD8'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#1A1410'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 250px Montserrat'; g.fillText(String(d), w / 2, h / 2 + 12);
  g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
});
const texRiscos = () => canvasTex('riscos', 1024, 512, (g, w, h) => {
  g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(60,45,30,0.85)'; g.lineCap = 'round'; g.lineWidth = 9;
  let n = 0;
  for (let y = 40; y < h - 60; y += 95) for (let x = 30; x < w - 120; x += 120) {
    for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(x + i * 20, y + (n % 3) * 2); g.lineTo(x + i * 20 + 3, y + 62); g.stroke(); }
    g.beginPath(); g.moveTo(x - 8, y + 50); g.lineTo(x + 75, y + 12); g.stroke(); n++;
  }
});
const texBandeira = (tipo) => canvasTex('band' + tipo, 512, 384, (g, w, h) => {
  g.fillStyle = tipo === 'v' ? '#D8323C' : '#1FA3A0'; g.fillRect(0, 0, w, h);
  if (tipo === 'v') { g.fillStyle = '#FFD23F'; g.beginPath(); g.moveTo(w * 0.2, h * 0.5); g.lineTo(w * 0.55, h * 0.2); g.lineTo(w * 0.55, h * 0.37); g.lineTo(w * 0.82, h * 0.37); g.lineTo(w * 0.82, h * 0.63); g.lineTo(w * 0.55, h * 0.63); g.lineTo(w * 0.55, h * 0.8); g.closePath(); g.fill(); }
  else { g.fillStyle = '#fff'; g.beginPath(); g.arc(w / 2, h / 2, h * 0.28, 0, Math.PI * 2); g.fill(); }
});
const texEmblema = () => canvasTex('emblema', 512, 512, (g, w) => {
  g.fillStyle = '#D8323C'; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 10, Math.PI / 2, Math.PI * 1.5); g.fill();
  g.fillStyle = '#1FA3A0'; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 10, -Math.PI / 2, Math.PI / 2); g.fill();
  g.strokeStyle = '#F2D27A'; g.lineWidth = 20; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 14, 0, Math.PI * 2); g.stroke();
  g.fillStyle = '#F2D27A'; g.beginPath(); g.arc(w / 2, w / 2, 60, 0, Math.PI * 2); g.fill();
});
const texSaco = () => canvasTex('saco', 256, 256, (g, w) => {
  g.fillStyle = '#E6CF9C'; g.fillRect(0, 0, w, w);
  g.fillStyle = '#2E8B3A'; g.font = '900 150px Montserrat'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', w * 0.25, w / 2 + 8);
});
const M = {}; const mt = (k, f) => (M[k] ||= f());
const mLajota = () => mt('laj', () => { const t = texLajota(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 3.4); return new THREE.MeshToonMaterial({map: t, gradientMap: T('#fff').gradientMap}); });
const mPedra = (rx = 2, ry = 1, k = 'p') => mt('ped' + k, () => { const t = texPedra().clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.needsUpdate = true; return new THREE.MeshToonMaterial({map: t, gradientMap: T('#fff').gradientMap}); });
const mTex = (k, tex, extra = {}) => mt(k, () => new THREE.MeshToonMaterial({map: tex(), gradientMap: T('#fff').gradientMap, ...extra}));

// ---------- cenário: ponte, rio, campos ----------
const Arco = () => {
  // face da ponte com 3 arcos (x fixo), extrudada 0.3
  const geo = React.useMemo(() => {
    const s = new THREE.Shape(); s.moveTo(-3.5, -2.1); s.lineTo(3.5, -2.1); s.lineTo(3.5, -0.6); s.lineTo(-3.5, -0.6); s.lineTo(-3.5, -2.1);
    [[-2.42, 0.8], [0, 0.82], [2.42, 0.8]].forEach(([c, r]) => {
      const h = new THREE.Path(); h.moveTo(c - r, -2.1); h.lineTo(c - r, -1.75); h.absarc(c, -1.75, r, Math.PI, 0, true); h.lineTo(c + r, -2.1); h.lineTo(c - r, -2.1); s.holes.push(h);
    });
    return new THREE.ExtrudeGeometry(s, {depth: 0.3, bevelEnabled: false});
  }, []);
  return geo;
};
const Hera = ({p, n = 5, s = 1}) => (
  <group position={p} scale={s}>
    {Array.from({length: n}).map((_, i) => <Esf key={i} r={0.13 + (i % 3) * 0.04} p={[(i - n / 2) * 0.17, (i % 2) * 0.08, 0]} m={i % 2 ? '#4E9E3A' : '#3E8A30'} line={0.8} />)}
  </group>
);
const Arvore = ({p, s = 1}) => (
  <group position={p} scale={s}>
    <Ci rt={0.12} rb={0.16} h={1.2} p={[0, 0.6, 0]} m="#8A5A2B" seg={10} />
    <Esf r={0.75} p={[0, 1.6, 0]} s={[1, 0.9, 1]} m="#4FAE3B" />
    <Esf r={0.5} p={[0.4, 1.35, 0.25]} m="#5DBE45" />
  </group>
);
const Montanhas = ({c = [0, 0, 0], n = 22, r0 = 95}) => (
  <group position={c}>
    {Array.from({length: n}).map((_, i) => {
      const a = i / n * Math.PI * 2 + 0.13, r = r0 + (i * 37 % 30), h = 16 + (i * 53 % 18);
      return <Tn key={i} geo={<coneGeometry args={[h * 0.9, h, 7]} />} p={[Math.cos(a) * r, h / 2 - 1, Math.sin(a) * r]} m={T(i % 2 ? '#8FA7D2' : '#9DB2DA')} line={0} sombra={false} />;
    })}
  </group>
);
const Castelo = ({p, cor, s = 1}) => (
  <group position={p} scale={s}>
    <Cx a={[4, 3, 3]} p={[0, 1.5, 0]} m="#D9CFC0" line={0.6} sombra={false} />
    {[[-2, -1.5], [2, -1.5], [-2, 1.5], [2, 1.5]].map(([x, z], i) => (
      <group key={i} position={[x, 0, z]}>
        <Ci rt={0.7} h={4.6} p={[0, 2.3, 0]} m="#E3DACB" line={0.6} sombra={false} />
        <Co r={0.9} h={1.8} p={[0, 5.5, 0]} m={cor} line={0.6} sombra={false} />
      </group>
    ))}
    <Ci rt={0.9} h={6} p={[0, 3, 0]} m="#E3DACB" line={0.6} sombra={false} />
    <Co r={1.15} h={2.4} p={[0, 7.2, 0]} m={cor} line={0.6} sombra={false} />
  </group>
);

// exército em InstancedMesh (corpo em cone + cabeça), com bandeiras
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _v = new THREE.Vector3();
const Exercito = ({pos, cor, ry}) => {
  // pos: lista de [x, y, z]
  const ref1 = React.useRef(), ref2 = React.useRef(), ref3 = React.useRef(), ref4 = React.useRef();
  const n = pos.length;
  React.useLayoutEffect(() => {
    _q.setFromEuler(new THREE.Euler(0, ry, 0));
    pos.forEach((p, i) => {
      _m.compose(_v.set(p[0], p[1] + 0.3, p[2]), _q, _s.set(1, 1, 1)); ref1.current.setMatrixAt(i, _m); ref3.current.setMatrixAt(i, _m);
      _m.compose(_v.set(p[0], p[1] + 0.78, p[2]), _q, _s.set(1, 1, 1)); ref2.current.setMatrixAt(i, _m); ref4.current.setMatrixAt(i, _m);
    });
    [ref1, ref2, ref3, ref4].forEach((r) => { r.current.instanceMatrix.needsUpdate = true; r.current.computeBoundingSphere(); });
  });
  return (
    <>
      <instancedMesh frustumCulled={false} ref={ref1} args={[null, T(cor), n]} castShadow><cylinderGeometry args={[0.1, 0.2, 0.55, 10]} /></instancedMesh>
      <instancedMesh frustumCulled={false} ref={ref3} args={[null, HULL(1), n]}><cylinderGeometry args={[0.1, 0.2, 0.55, 10]} /></instancedMesh>
      <instancedMesh frustumCulled={false} ref={ref2} args={[null, T('#9AA3AD'), n]} castShadow><sphereGeometry args={[0.19, 12, 10]} /></instancedMesh>
      <instancedMesh frustumCulled={false} ref={ref4} args={[null, HULL(1), n]}><sphereGeometry args={[0.19, 12, 10]} /></instancedMesh>
    </>
  );
};
const Bandeirola = ({p, tipo, h = 1.6, t = 0, s = 1}) => (
  <group position={p} scale={s}>
    <Ci rt={0.025} h={h} p={[0, h / 2, 0]} m="#6B4423" seg={8} line={0.6} />
    <mesh position={[0.3, h - 0.25, 0]} rotation={[0, Math.sin(t * 2.2 + p[0]) * 0.18, Math.sin(t * 3 + p[2]) * 0.03]} material={mTex('mb' + tipo, () => texBandeira(tipo), {side: THREE.DoubleSide})} castShadow>
      <planeGeometry args={[0.6, 0.42, 6, 1]} />
    </mesh>
  </group>
);
const blocoExercito = (cx, cz, nx, nz, esp = 0.85) => {
  const out = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) out.push([cx + (i - (nx - 1) / 2) * esp, 0, cz + (j - (nz - 1) / 2) * esp]);
  return out;
};

const Ponte = ({t}) => {
  const arco = Arco();
  return (
    <group>
      {/* tabuleiro */}
      <mesh position={[-0.8, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mLajota()} receiveShadow><planeGeometry args={[8.4, 7.0]} /></mesh>
      <mesh position={[-0.8, -0.3, 0]} material={mPedra(5, 0.4, 'tab')} receiveShadow><boxGeometry args={[8.4, 0.6, 7.0]} /></mesh>
      {/* faces com arcos (leste e oeste) e o vão escuro por baixo */}
      <mesh geometry={arco} position={[3.4, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mPedra(1.5, 0.6, 'arc')} receiveShadow />
      <mesh geometry={arco} position={[-5.3, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mPedra(1.5, 0.6, 'arc')} />
      {[-1.21, 1.21].map((z) => <mesh key={z} position={[-0.8, -1.35, z]} material={mPedra(4, 0.5, 'pil')}><boxGeometry args={[8.4, 1.5, 0.82]} /></mesh>)}
      {/* parapeitos laterais com hera */}
      {[3.25, -5.15].map((x) => <group key={x}>
        <mesh position={[x, 0.3, 0]} material={mPedra(3, 0.3, 'par')} castShadow receiveShadow><boxGeometry args={[0.3, 0.6, 7.0]} /></mesh>
        <mesh position={[x, 0.3, 0]} material={HULL(1)}><boxGeometry args={[0.3, 0.6, 7.0]} /></mesh>
        <Hera p={[x, 0.62, -2.2]} n={6} /><Hera p={[x, 0.55, 1.9]} n={4} />
        <Hera p={[x + (x > 0 ? 0.18 : -0.18), -0.4, 0.4]} n={5} s={0.8} />
      </group>)}
      {/* rio, margens e campos em retalho */}
      <mesh position={[0, -2.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={T('#4DB3DD')} receiveShadow><planeGeometry args={[400, 7.0]} /></mesh>
      {Array.from({length: 26}).map((_, i) => <mesh key={i} position={[-60 + i * 5 + (t * 0.6) % 5, -2.0, -2.6 + (i * 7 % 10) * 0.55]} rotation={[-Math.PI / 2, 0, 0]} material={B('#9FDDF3')}><planeGeometry args={[0.9, 0.05]} /></mesh>)}
      {[-1, 1].map((l) => <mesh key={l} position={[0, -1.0, l * 3.6]} material={mPedra(60, 1, 'mar')} receiveShadow><boxGeometry args={[400, 2.1, 0.2]} /></mesh>)}
      {[-1, 1].map((l) => <mesh key={'c' + l} position={[0, 0, l * (3.5 + 60)]} rotation={[-Math.PI / 2, 0, 0]} material={mTex('ret' + l, () => { const x = texRetalhos('ret' + l, l > 0 ? 7 : 3); x.wrapS = x.wrapT = THREE.RepeatWrapping; x.repeat.set(3, 1.5); return x; })} receiveShadow><planeGeometry args={[400, 120]} /></mesh>)}
      {/* estrada que continua nas margens */}
      {[-1, 1].map((l) => <mesh key={'e' + l} position={[-0.8, 0.01, l * 10]} rotation={[-Math.PI / 2, 0, 0]} material={T('#CFAE7A')} receiveShadow><planeGeometry args={[3, 13]} /></mesh>)}
      {[[8, 9], [-10, 7], [12, -8], [-9, -10], [18, 14], [-16, 18], [6, -16], [22, -5], [-22, -6], [14, 24], [-6, 26], [26, 10]].map(([x, z], i) => <Arvore key={i} p={[x, 0, z]} s={1 + (i % 3) * 0.25} />)}
    </group>
  );
};

// barraca do ferreiro em cima da ponte
const Bigorna = ({p, tremor = 0}) => (
  <group position={[p[0] + tremor, p[1], p[2]]}>
    <Ci rt={0.2} rb={0.24} h={0.36} p={[0, 0.18, 0]} m="#8A5A2B" seg={14} />
    <Cx a={[0.3, 0.12, 0.2]} p={[0, 0.42, 0]} m="#4A4F57" />
    <Cx a={[0.18, 0.1, 0.14]} p={[0, 0.51, 0]} m="#5A606A" />
    <Cx a={[0.36, 0.1, 0.24]} p={[0, 0.6, 0]} m="#636A75" />
    <Co r={0.06} h={0.2} p={[0, 0.6, 0.21]} rot={[Math.PI / 2, 0, 0]} m="#636A75" seg={10} />
  </group>
);
const Barril = ({p}) => (
  <group position={p}>
    <Ci rt={0.2} rb={0.18} h={0.5} p={[0, 0.25, 0]} m="#A0672E" seg={16} />
    {[0.1, 0.4].map((y) => <Ci key={y} rt={0.205} h={0.04} p={[0, y, 0]} m="#5A5F66" seg={16} line={0} />)}
    {[[-0.06, 0.1, 0.05], [0.07, 0.15, -0.04], [0.0, 0.05, 0.09]].map(([x, a, z], i) => <Lanca key={i} grip={[p[0] * 0 + x, 0.55, z]} dir={[a, 1, z]} comp={1.25} frente={0.65} />)}
  </group>
);
const Forja = ({p, t}) => (
  <group position={p}>
    <Cx a={[0.9, 0.85, 0.7]} p={[0, 0.42, 0]} m={mPedra(1, 1, 'forja')} />
    <mesh position={[0, 0.4, 0.351]} material={B('#FF8A2A')}><circleGeometry args={[0.2 + Math.sin(t * 7) * 0.008, 20, 0, Math.PI]} /></mesh>
    <mesh position={[0, 0.4, 0.352]} material={B('#FFD15A')}><circleGeometry args={[0.11, 16, 0, Math.PI]} /></mesh>
    <Ci rt={0.16} rb={0.2} h={0.9} p={[0.15, 1.25, -0.1]} m={mPedra(1, 1, 'cham')} seg={12} />
  </group>
);
const Saco = ({p, s = 1}) => (
  <group position={p} scale={s}>
    <Tn geo={<sphereGeometry args={[0.11, 18, 14]} />} m={mTex('saco', texSaco)} s={[1, 0.95, 1]} rot={[0, -0.6, 0]} />
    <Co r={0.05} h={0.07} p={[0, 0.11, 0]} m="#D9BE86" seg={10} />
    <Ci rt={0.055} h={0.02} p={[0, 0.085, 0]} m="#8A5A2B" seg={10} line={0.5} />
  </group>
);
const Escudo = ({p, normal, brilho = 0}) => {
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...normal).normalize());
  return (
    <group position={p} quaternion={q}>
      <Ci rt={0.27} h={0.04} m="#F1C232" seg={32} />
      <Ci rt={0.23} h={0.05} p={[0, 0.005, 0]} m="#1FA3A0" seg={32} line={0.5} />
      <Ci rt={0.12} h={0.06} p={[0, 0.01, 0]} m={T('#DDE6EE')} seg={24} line={0.5} />
      <Esf r={0.05} p={[0, 0.04, 0]} s={[1, 0.5, 1]} m="#F1C232" line={0.5} />
    </group>
  );
};
const Helmo = ({p, r = 0, flor = '#FF5E7E'}) => (
  <group position={p} rotation={[0.3, r, 0.5]}>
    <Tn geo={<sphereGeometry args={[0.12, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />} m={T('#8E98A3', {side: THREE.DoubleSide})} />
    <group rotation={[-0.3, 0, -0.5]}>
      <Palito a={[0, 0.05, 0]} b={[0.02, 0.26, 0]} r={0.008} cor="#3E9A35" />
      {[0, 1, 2, 3, 4].map((i) => { const a = i * Math.PI * 2 / 5; return <Esf key={i} r={0.03} p={[0.02 + Math.cos(a) * 0.035, 0.28, Math.sin(a) * 0.035]} m={flor} line={0.4} />; })}
      <Esf r={0.022} p={[0.02, 0.285, 0]} m="#FFD23F" line={0.4} />
    </group>
  </group>
);
const Flor = ({p, cor, s = 1}) => (
  <group position={p} scale={s}>
    <Palito a={[0, 0, 0]} b={[0, 0.22, 0]} r={0.008} cor="#3E9A35" />
    {[0, 1, 2, 3, 4].map((i) => { const a = i * Math.PI * 2 / 5; return <Esf key={i} r={0.032} p={[Math.cos(a) * 0.04, 0.24, Math.sin(a) * 0.04]} m={cor} line={0.4} />; })}
    <Esf r={0.024} p={[0, 0.245, 0]} m="#FFD23F" line={0.4} />
  </group>
);
const Contador = ({p, t}) => {
  // 099 -> 100, cada dígito vira com atraso; o último começa 0,25 s antes de "cem"
  const de = [0, 9, 9], para = [1, 0, 0];
  return (
    <group position={p}>
      <Cx a={[0.66, 0.3, 0.06]} m="#5B3A1E" />
      {[0, 1, 2].map((i) => {
        const t0 = TM.cem - 0.28 + (2 - i) * 0.07;
        const u = Math.max(0, Math.min(1, (t - t0) / 0.22));
        const ang = back(u) * Math.PI;
        const mostra = u < 0.5 ? de[i] : para[i];
        return (
          <group key={i} position={[(i - 1) * 0.2, 0, 0.04]}>
            <mesh rotation={[ang > Math.PI / 2 ? ang - Math.PI : ang, 0, 0]} material={mTex('d' + mostra, () => texDigito(mostra))}><planeGeometry args={[0.17, 0.23]} /></mesh>
          </group>
        );
      })}
    </group>
  );
};
const Barraca = ({t}) => (
  <group>
    {/* muro baixo do fundo, com o trecho alto dos riscos atrás do soldado velho */}
    <mesh position={[0.3, 0.25, -1.5]} material={mPedra(4, 0.4, 'muro')} castShadow receiveShadow><boxGeometry args={[5.6, 0.5, 0.3]} /></mesh>
    <mesh position={[0.3, 0.25, -1.5]} material={HULL(1)}><boxGeometry args={[5.6, 0.5, 0.3]} /></mesh>
    <mesh position={[-3.7, 0.75, -1.15]} material={mPedra(2, 1.2, 'muro2')} castShadow receiveShadow><boxGeometry args={[2.6, 1.5, 0.3]} /></mesh>
    <mesh position={[-3.7, 0.75, -1.15]} material={HULL(1)}><boxGeometry args={[2.6, 1.5, 0.3]} /></mesh>
    <mesh position={[-3.7, 0.85, -0.995]} material={mTex('riscos', texRiscos, {transparent: true})}><planeGeometry args={[2.3, 1.1]} /></mesh>
    <Hera p={[-3.1, 1.52, -1.1]} n={6} /><Hera p={[-4.6, 1.45, -1.1]} n={4} s={0.8} />
    <Hera p={[1.6, 0.52, -1.5]} n={5} s={0.8} />
    <Forja p={[-1.95, 0, -1.0]} t={t} />
    <Barril p={[0.68, 0, -0.75]} />
    <Bandeirola p={[-1.45, 0, -1.25]} tipo="v" h={2.1} t={t} s={1.2} />
    <Bandeirola p={[1.55, 0, -1.25]} tipo="a" h={2.1} t={t} s={1.2} />
    <mesh position={[0, 0.006, 1.15]} rotation={[-Math.PI / 2, 0, 0]} material={mTex('emb', texEmblema, {transparent: true})} receiveShadow><circleGeometry args={[0.38, 40]} /></mesh>
    {/* caixote onde os sacos descansam */}
    <Cx a={[0.4, 0.3, 0.35]} p={[-0.45, 0.15, -0.95]} m="#B07A40" />
    {/* placa e contador */}
    <group position={[-3.0, 0, -0.45]}>
      <Ci rt={0.04} h={1.4} p={[0, 0.7, -0.03]} m="#6B4423" seg={8} />
      <mesh position={[0, 1.25, 0.01]} material={mTex('placa', texPlaca)} castShadow><boxGeometry args={[0.86, 0.43, 0.04]} /></mesh>
      <mesh position={[0, 1.25, 0.01]} material={HULL(1)}><boxGeometry args={[0.86, 0.43, 0.04]} /></mesh>
      <Contador p={[0, 0.85, 0.02]} t={t} />
    </group>
    {[[-4.35, 0.03, 0.35, 0.2, '#FF5E7E'], [-3.95, 0.03, 0.75, 1.4, '#FFD23F'], [-3.35, 0.03, 0.45, 2.2, '#8A6CFF'], [-4.6, 0.03, -0.3, 0.9, '#FF8A3D']].map(([x, y, z, r, c], i) => <Helmo key={i} p={[x, y, z]} r={r} flor={c} />)}
  </group>
);

const Patos = ({t}) => {
  const x0 = 5.6 + t * 0.12;
  const um = (x, z, s, cor, i) => (
    <group key={i} position={[x, -2.0 + Math.sin(t * 3 + i) * 0.015, z]} rotation={[0, Math.PI / 2 + Math.sin(t * 1.3 + i) * 0.15, 0]} scale={s}>
      <Esf r={1} s={[0.17, 0.12, 0.24]} p={[0, 0.06, 0]} m={cor} />
      <Esf r={0.1} p={[0, 0.2, 0.14]} m={cor} />
      <Co r={0.04} h={0.09} p={[0, 0.19, 0.25]} rot={[Math.PI / 2, 0, 0]} m="#FF9A2E" seg={8} />
      <mesh position={[0.05, 0.23, 0.22]} material={B('#141010')}><sphereGeometry args={[0.014, 8, 6]} /></mesh>
      <mesh position={[-0.05, 0.23, 0.22]} material={B('#141010')}><sphereGeometry args={[0.014, 8, 6]} /></mesh>
    </group>
  );
  return <group>{um(x0, 0.45, 1, '#FFFFFF', 0)}{[1, 2, 3].map((i) => um(x0 - i * 0.38, 0.45 + (i % 2 ? 0.1 : -0.08), 0.48, '#FFD84A', i))}</group>;
};

// ---------- atuação dos personagens no tabuleiro ----------
const REI_V0 = [-1.15, 0, 0.05];
const FERR = [0.3, 0, -0.3];
const REI_A = [1.25, 0, 0.05];
const ESC = [0.93, 0.62, 0.3];
const poseRV = (t) => {
  const ry = kf(t, [[0, 0.45], [TM.pior - 0.05, 0.45], [TM.pior + 0.25, 1.2, back]]);
  const lunge = kf(t, [[TM.furava + 0.2, 0], [TM.qualquer, 0.1, Easing.in(Easing.quad)], [TM.qualquer + 0.3, 0.42], [TM.rei - 0.15, 0.42], [TM.rei + 0.2, 0]]);
  const REI_V = [REI_V0[0] + lunge, 0, REI_V0[2]];
  const bxp = kf(t, [[0, [-0.25, 0.3, -0.7]], [TM.furava - 0.1, [-0.25, 0.3, -0.7]], [TM.furava + 0.2, [-0.5, 0.3, -1.1]], [TM.qualquer, [-0.95, 0.25, -0.3], Easing.in(Easing.quad)], [TM.qualquer + 0.3, [-1.15, 0.3, -0.05]],
    [TM.rei - 0.15, [-1.35, 0.8, -0.05]], [TM.rei + 0.2, [-0.25, 0.3, -0.7]], [TM.pior, [-0.25, 0.3, -0.7]], [TM.pior + 0.3, [-1.4, 0.55, -0.3], back]]);
  const dir = kf(t, [[0, [0, 1, 0]], [TM.furava - 0.1, [0, 1, 0]], [TM.furava + 0.2, [1, 0.02, 0.18]], [TM.rei - 0.15, [1, 0.02, 0.18]], [TM.rei + 0.2, [0, 1, 0]], [TM.pior, [0, 1, 0]], [TM.pior + 0.3, [1, 0.42, 0.05], back]]);
  const frente = kf(t, [[TM.furava - 0.1, 0.9], [TM.furava + 0.2, 0.42], [TM.rei - 0.15, 0.42], [TM.rei + 0.2, 0.9], [TM.pior, 0.9], [TM.pior + 0.3, 0.6]]);
  const bravo = t > TM.pior + 0.1;
  const c = {cor: '#E34835', olhos: bravo ? 'ponto' : 'vilao', boca: bravo ? 'brava' : 'dentes', sob: bravo ? 1.1 : 0.6,
    cab: [0, kf(t, [[0, -0.15], [TM.qualquer, 0.25], [TM.rei, 0.1]]), 0], bxp, bxn: [0.05, 0.25, -0.2],
    corpo: <Capa cor="#9E2A22" />, cabeca: <><Coroa /><Barba cor="#7A4A26" comp={0.09} larg={0.05} /></>};
  const mao = maoMundo(REI_V, ry, 1, bxp);
  return {c, ry, mao, dir, frente, pos: REI_V};
};
const poseFE = (t, escudoP) => {
  const ry = kf(t, [[0, 0], [TM.rei + 0.3, 0], [TM.rei + 0.55, 1.05, back], [TM.pior - 0.1, 1.05], [TM.pior + 0.15, 0, back]]);
  const testando = t > TM.rei + 0.4 && t < TM.pior - 0.1;
  const levanta = kf(t, [[TM.rei - 0.1, 0], [TM.rei + 0.1, 1, back], [TM.rei + 0.32, 0]]);
  const sacoArm = [-0.3 - levanta * 0.5, 0.45 + levanta * 0.9, -0.5 - levanta * 0.4];
  const bxp = testando ? kf(t, [[TM.rei + 0.5, [-0.5, 0.2, -1.0]], [TM.nada - 0.2, [-0.5, 0.2, -1.0]], [TM.nada, [-1.3, 0.15, -0.15], Easing.in(Easing.quad)], [TM.furava2 + 0.2, [-1.42, 0.12, -0.02]]]) : (t > TM.pior ? [-0.55, 0.65, -0.7] : sacoArm);
  const bxn = testando ? kf(t, [[TM.rei + 0.5, [-0.4, 0.3, -1.1]], [TM.nada, [-1.0, 0.1, -0.6]]]) : (t > TM.pior ? [-0.55, 0.65, -0.7] : sacoArm);
  const susto1 = t > TM.qualquer + 0.06 && t < TM.rei - 0.1;
  const susto2 = t > TM.furava2 + 0.08 && t < TM.pior - 0.1;
  const focado = testando && !susto2;
  const c = {cor: '#9A5B21', olhos: susto1 || susto2 ? 'grande' : focado ? 'ponto' : 'fechado', boca: susto1 || susto2 ? 'o' : focado ? 'reta' : 'sorriso', sob: susto1 || susto2 ? -0.8 : focado ? 0.4 : 0,
    pz: kf(t, [[TM.qualquer, 0], [TM.qualquer + 0.1, 0.06, back], [TM.qualquer + 0.3, 0]]),
    cab: [0, 0, kf(t, [[0, 0.06], [TM.lanca, -0.06], [TM.qualquer, 0.06]])], bxp, bxn,
    corpo: <Ci rt={0.12} rb={0.2} h={0.3} p={[0, 0.5, 0.06]} s={[1, 1, 0.75]} m="#C9B79A" line={0.6} />, cabeca: <><Bigode s={1.3} /><Esf r={1} s={[0.235, 0.09, 0.23]} p={[0, 0.2, -0.02]} m="#3B2A20" line={0.7} /></>};
  const maoP = maoMundo(FERR, ry, 1, bxp), maoN = maoMundo(FERR, ry, -1, bxn);
  return {c, ry, maoP, maoN, testando, levanta};
};

const Tabuleiro = ({t}) => {
  // rei vermelho e a lança que atravessa a bigorna
  const rv = poseRV(t);
  const ponta = pontaLanca(rv.mao, rv.dir, rv.frente);
  // a bigorna fica onde a ponta chega em "qualquer" (calculado pela própria pose)
  const rvImp = poseRV(TM.qualquer);
  const pImp = pontaLanca(rvImp.mao, rvImp.dir, rvImp.frente);
  const bigX = pImp[0] + 0.16, bigZ = pImp[2];
  const tremor = Math.max(0, 1 - fx(t, TM.qualquer, 0.35)) * (t > TM.qualquer ? Math.sin((t - TM.qualquer) * 70) * 0.012 : 0);

  // ferreiro e o teste no escudo
  const fe = poseFE(t);
  // a lança do teste mira o escudo: direção e comprimento tirados da pose no instante do impacto
  const H = poseFE(TM.nada).maoP;
  const dS = [ESC[0] - H[0], ESC[1] - H[1], ESC[2] - H[2]];
  const frS = Math.max(0.37, Math.hypot(...dS));
  const dirS = dS.map((v) => v / Math.hypot(...dS));
  const lancaFe = (tt) => { const f = poseFE(tt); return {grip: f.maoP, dir: dirS}; };
  const escP = ESC;
  const raivaA = t > TM.pior + 0.1;
  const ryA = kf(t, [[0, -0.45], [TM.pior - 0.05, -0.45], [TM.pior + 0.25, -1.2, back]]);
  const escudoAgora = raivaA ? {p: kf(t, [[TM.pior, ESC], [TM.pior + 0.3, [REI_A[0] - 0.24, 0.95, REI_A[2] + 0.12], back]]), n: [-1, 0, 0.15]} : {p: ESC, n: [-1, 0, 0.28]};
  const cA = {cor: '#1F9A9A', olhos: raivaA ? 'ponto' : 'fechado', boca: raivaA ? 'brava' : 'sorriso', sob: raivaA ? 1.1 : -0.1,
    cab: [0, kf(t, [[0, 0.1], [TM.escudo, -0.2]]), 0], bxn: raivaA ? [-1.3, 0.4, -0.6] : [-0.9, 0.55, -0.6], bxp: [0.05, 0.25, -0.2],
    corpo: <Capa cor="#126B6B" />, cabeca: <><Coroa cor="#C9D3DC" gemas={['#1FC7C2', '#1FC7C2']} /><Barba comp={0.3} larg={0.13} /></>};

  // lança do teste: na mão até "pior", depois cai no chão
  let lanca2 = null;
  if (fe.testando) {
    const g = lancaFe(t);
    const dobra = kf(t, [[TM.furava2 - 0.12, 0], [TM.furava2 + 0.05, -1.0, back]]);
    lanca2 = <Lanca grip={g.grip} dir={g.dir} comp={1.15} frente={frS} dobra={dobra} borla="#1FA3A0" />;
  } else if (t >= TM.pior - 0.1 && t < TM.os + 1) {
    const u = Math.min(1, (t - (TM.pior - 0.1)) / 0.35);
    const g0 = lancaFe(TM.pior - 0.12);
    lanca2 = <group><Lanca grip={mix(g0.grip, [0.35, 0.04, 0.55], Easing.in(Easing.quad)(u))} dir={mix(g0.dir, [1, 0.0, 0.3], u)} comp={1.15} frente={frS} dobra={-1.0} borla="#1FA3A0" /></group>;
  }
  const sacosNaMao = !fe.testando;
  const susto1 = t > TM.qualquer + 0.06 && t < TM.rei - 0.1;
  const susto2 = t > TM.furava2 + 0.08 && t < TM.pior - 0.1;
  const cabF = [FERR[0], 1.1, FERR[2]];
  return (
    <group>
      <Bigorna p={[bigX, 0, bigZ]} tremor={tremor} />
      <Boneco pos={rv.pos} ry={rv.ry} c={rv.c} />
      <Lanca grip={rv.mao} dir={rv.dir} comp={1.55} frente={rv.frente} />
      <Brilho id={1} p={ponta} k={fx(t, TM.lanca - 0.05, 0.5)} s={0.45} />
      <Anel id={1} p={pImp} k={fx(t, TM.qualquer, 0.32)} s={0.5} />
      <Faisca id={1} p={pImp} k={fx(t, TM.qualquer, 0.3)} s={0.6} />
      <Boneco pos={FERR} ry={fe.ry} c={fe.c} />
      {sacosNaMao ? <><Saco p={[fe.maoP[0], fe.maoP[1] - 0.1, fe.maoP[2]]} /><Saco p={[fe.maoN[0], fe.maoN[1] - 0.1, fe.maoN[2]]} s={0.9} /></>
        : <><Saco p={[-0.55, 0.4, -0.95]} /><Saco p={[-0.33, 0.39, -0.92]} s={0.9} /></>}
      {lanca2}
      <Gota id={1} p={[cabF[0] + 0.24, cabF[1] + 0.08, cabF[2] + 0.12]} k={susto1 ? fx(t, TM.qualquer + 0.06, TM.rei - 0.1 - TM.qualquer - 0.06) : 0} />
      <Gota id={2} p={[cabF[0] - 0.05, cabF[1] + 0.1, cabF[2] + 0.22]} k={susto2 ? fx(t, TM.furava2 + 0.08, 0.7) : 0} />
      <Boneco pos={REI_A} ry={ryA} c={cA} />
      <Escudo p={escudoAgora.p} normal={escudoAgora.n} />
      <Anel id={2} p={escP} k={fx(t, TM.nada, 0.32)} s={0.45} />
      <Faisca id={2} p={escP} k={fx(t, TM.nada, 0.3)} s={0.55} />
      {/* brilho das duas armas visto do alto, em "arma" */}
      <Brilho id={3} p={[REI_V0[0] + 0.3, 1.6, 0.1]} k={fx(t, TM.arma - 0.05, 0.6)} s={2.6} />
      <Brilho id={4} p={[REI_A[0] - 0.2, 1.4, 0.15]} k={fx(t, TM.arma + 0.08, 0.6)} s={2.6} />
      {/* soldado velhíssimo */}
      <Boneco pos={[-3.75, 0, -0.25]} ry={0.35} c={{cor: '#8B5E3C', olhos: 'tedio', boca: 'reta', sob: 0, sobY: 0.075,
        pz: kf(t, [[TM.cem + 0.1, 0], [TM.cem + 0.35, -0.025], [TM.cem + 0.8, 0]]),
        cab: [0, 0.15, kf(t, [[TM.os, 0.04], [TM.cem + 0.2, 0.04], [TM.cem + 0.6, 0.12]])], bxp: [-0.35, 0.25, -0.75], bxn: [0, 0.18, 0],
        cabeca: <><Barba comp={0.5} larg={0.15} /><Tn geo={<sphereGeometry args={[0.245, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />} m="#8E98A3" p={[0, 0.07, -0.01]} rot={[-0.12, 0, 0.12]} /></>}} />
      <Lanca grip={maoMundo([-3.75, 0, -0.25], 0.35, 1, [-0.35, 0.25, -0.75])} dir={[0.04, 1, 0.02]} comp={2.0} frente={1.15} borla="#7A5A3A" />
    </group>
  );
};

// ---------- campo de batalha ----------
const seta = (lado) => { // fileiras atrás de cada rei, em cunha apontando para a trilha
  const out = [];
  for (let i = 0; i < 11; i++) for (let j = 0; j < 6; j++) out.push([X0 + lado * (1.5 + j * 0.62 + i * 0.12), 0, -0.9 - i * 0.82 - j * 0.18]);
  return out;
};
const Campo = ({t}) => {
  const dz = kf(t, [[TM.entao - 0.1, 5.5], [TM.exercitos + 0.15, 0]], Easing.out(Easing.quad)); const dx = 0;
  const marcha = (arr) => arr.map(([x, y, z], i) => [x, Math.abs(Math.sin(t * 9 + i)) * 0.06 * (dz > 0.01 ? 1 : 0), z - dz]);
  const RV = [X0 - 0.95, 0, 0], RA = [X0 + 0.95, 0, 0];
  const bxp = [-1.25, 0.55, -0.15];
  const ryV = 0.5, ryA = -0.5;
  const maoV = maoMundo(RV, ryV, 1, bxp);
  const dirV = [1, 0.03, 0.12];
  const pontaV = pontaLanca(maoV, dirV, 0.6);
  const escA = [RA[0] - 0.3, 0.68, RA[2] + 0.12];
  return (
    <group>
      <mesh position={[X0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mTex('campoChao', () => { const x = texRetalhos('campoChao', 11); x.wrapS = x.wrapT = THREE.RepeatWrapping; x.repeat.set(1, 1); return x; })} receiveShadow><planeGeometry args={[220, 220]} /></mesh>
      <mesh position={[X0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} material={T('#7CC350')} receiveShadow><planeGeometry args={[40, 40]} /></mesh>
      <mesh position={[X0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={T('#CDA06A')} receiveShadow><planeGeometry args={[0.9, 200]} /></mesh>
      {Array.from({length: 9}).map((_, i) => { const z = -20 + i * 2.6; return (
        <group key={i} position={[X0, 0, z]}>
          <Cx a={[0.14, 0.28, 0.28]} p={[-0.07, 0.14, 0]} m="#D8323C" line={0.7} />
          <Cx a={[0.14, 0.28, 0.28]} p={[0.07, 0.14, 0]} m="#1FA3A0" line={0.7} />
        </group>
      ); })}
      <Exercito pos={marcha(seta(-1))} cor="#D8323C" ry={0} />
      <Exercito pos={marcha(seta(1))} cor="#1FA3A0" ry={0} />
      {[-2.6, -5.2].map((z, i) => <Bandeirola key={'bv' + i} p={[X0 - 2.4 - i * 0.6, 0, z - dz]} tipo="v" t={t} h={1.9} />)}
      {[-2.6, -5.2].map((z, i) => <Bandeirola key={'ba' + i} p={[X0 + 2.0 + i * 0.6, 0, z - dz]} tipo="a" t={t} h={1.9} />)}
      {/* os dois reis frente a frente */}
      <Boneco pos={[RV[0], 0, -dz]} ry={ryV} c={{cor: '#E34835', olhos: 'ponto', boca: 'brava', sob: 1.1, bxp, bxn: [0.05, 0.25, -0.2], cab: [0, 0.35, 0], corpo: <Capa cor="#9E2A22" />, cabeca: <><Coroa /><Barba cor="#7A4A26" comp={0.09} larg={0.05} /></>}} />
      <Lanca grip={[maoV[0], maoV[1], maoV[2] - dz]} dir={dirV} comp={1.55} frente={0.6} />
      <Brilho id={5} p={pontaV} k={fx(t, TM.lanca2 - 0.04, 0.55)} s={0.5} />
      <Boneco pos={[RA[0], 0, -dz]} ry={ryA} c={{cor: '#1F9A9A', olhos: 'ponto', boca: 'brava', sob: 1.1, bxn: [-1.0, 0.45, -0.7], bxp: [0.05, 0.25, -0.2], cab: [0, -0.35, 0], corpo: <Capa cor="#126B6B" />, cabeca: <><Coroa cor="#C9D3DC" gemas={['#1FC7C2', '#1FC7C2']} /><Barba comp={0.3} larg={0.13} /></>}} />
      <Escudo p={[escA[0], escA[1], escA[2] - dz]} normal={[-1, 0, 0.35]} />
      <Brilho id={6} p={[escA[0] - 0.05, escA[1] + 0.02, escA[2] + 0.08]} k={fx(t, TM.escudo2 - 0.04, 0.6)} s={0.9} />
      {/* flores em primeiro plano */}
      {Array.from({length: 22}).map((_, i) => { const x = (i * 0.41 % 3.6) - 1.8; return <Flor key={i} p={[X0 + x + (x > 0 ? 0.5 : -0.5), 0, 5.4 + (i * 0.53 % 1.3)]} cor={i % 2 ? '#E8434F' : '#3E7BE6'} s={0.7 + (i % 3) * 0.12} />; })}
      {Array.from({length: 30}).map((_, i) => <Flor key={'f' + i} p={[X0 - 7 + (i * 1.7 % 14), 0, -4 + (i * 2.3 % 9)]} cor={i % 2 ? '#E8434F' : '#3E7BE6'} s={1} />)}
      {/* nuvens fofas */}
      {[[-6, 7.5, -16, 1.6], [4, 9, -20, 2], [10, 6.5, -14, 1.3], [-12, 8.5, -22, 1.8], [0, 11, -26, 2.2]].map(([x, y, z, s], i) => (
        <group key={'n' + i} position={[X0 + x + Math.sin(t * 0.2 + i) * 0.2, y, z]} scale={s}>
          <Esf r={1} m="#FFFFFF" line={0.8} sombra={false} /><Esf r={0.75} p={[1.1, -0.2, 0]} m="#FFFFFF" line={0.8} sombra={false} /><Esf r={0.7} p={[-1.1, -0.25, 0.1]} m="#FFFFFF" line={0.8} sombra={false} />
        </group>
      ))}
      <Montanhas c={[X0, 0, 0]} r0={70} />
    </group>
  );
};

// ---------- legenda: 1 palavra (2 quando a 1ª é curta), branca com contorno, fixa em y≈1360 ----------
const GRUPOS = (() => {
  const g = []; let i = 0;
  while (i < PALAVRAS.length) {
    const a = PALAVRAS[i], limpa = a.w.replace(/[.,!?]/g, '');
    if (limpa.length <= 2 && i + 1 < PALAVRAS.length && !/[.,!?]$/.test(a.w)) { g.push({txt: a.w + ' ' + PALAVRAS[i + 1].w, s: a.s, e: PALAVRAS[i + 1].e}); i += 2; }
    else { g.push({txt: a.w, s: a.s, e: a.e}); i++; }
  }
  return g;
})();
const Legenda = ({t}) => {
  let cur = null;
  for (let i = 0; i < GRUPOS.length; i++) { const nx = GRUPOS[i + 1]; const fim = nx ? Math.min(nx.s, GRUPOS[i].e + 0.6) : GRUPOS[i].e + 0.5; if (t >= GRUPOS[i].s - 0.02 && t < fim) cur = GRUPOS[i]; }
  if (!cur) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1360 - 60, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <span style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 82, color: '#fff', WebkitTextStroke: '15px #141010', paintOrder: 'stroke fill', textShadow: '0 6px 10px rgba(0,0,0,0.35)', letterSpacing: 0.5}}>{cur.txt}</span>
    </div>
  );
};

// ---------- composição ----------
export const LancaEscudo = () => {
  const frame = useCurrentFrame();
  const t = (IN.t0 ?? 0) + frame / FPS;
  const c = camEm(t);
  const noCampo = t >= TM.entao;
  const aereo = !noCampo && t > TM.agora;
  const alvo = noCampo ? [X0, 0, 0] : aereo ? mix(c.look, [0, 0, 0], Math.min(1, (t - TM.agora) / 1.5)) : [c.look[0], 0, c.look[2]];
  const area = noCampo ? (t < TM.exercitos + 0.1 ? 16 : 9) : aereo ? kf(t, [[TM.agora, 6], [TM.arma, 22], [TM.entao, 30]]) : 4.5;
  const fogNear = noCampo ? (t < TM.exercitos + 0.1 ? 40 : 14) : kf(t, [[TM.agora, 14], [TM.arma, 45], [TM.entao, 70]]);
  const fogFar = noCampo ? (t < TM.exercitos + 0.1 ? 170 : 85) : kf(t, [[TM.agora, 85], [TM.arma, 200], [TM.entao, 300]]);
  const chicote = Math.max(0, Math.sin(Math.max(0, Math.min(1, (t - TM.os + 0.02) / 0.32)) * Math.PI));
  return (
    <AbsoluteFill style={{backgroundColor: '#BFE0F5'}}>
      <Borrao k={chicote * 0.9} />
      <AbsoluteFill style={{filter: chicote > 0.02 ? 'url(#chicote)' : undefined}}>
        <ThreeCanvas width={W} height={H} dpr={DPR} shadows gl={{antialias: true}} camera={{fov: 50, position: [0, 2, 6]}}>
          <Cam c={c} />
          <fog attach="fog" args={['#CFE6F5', fogNear, fogFar]} />
          <Ceu c={c} />
          <Luz alvo={alvo} area={area} />
          {!noCampo ? <>
            <Ponte t={t} />
            <Barraca t={t} />
            <Tabuleiro t={t} />
            <Patos t={t} />
            <Exercito pos={blocoExercito(-3, 17, 12, 8, 0.9)} cor="#D8323C" ry={Math.PI} />
            <Exercito pos={blocoExercito(-3, -17, 12, 8, 0.9)} cor="#1FA3A0" ry={0} />
            {[-7, -3, 1].map((x, i) => <Bandeirola key={'av' + i} p={[x, 0, 13.8]} tipo="v" t={t} h={2.2} s={1.6} />)}
            {[-7, -3, 1].map((x, i) => <Bandeirola key={'aa' + i} p={[x, 0, -13.8]} tipo="a" t={t} h={2.2} s={1.6} />)}
            <Castelo p={[-30, 0, -62]} cor="#D8323C" s={1.4} />
            <Castelo p={[30, 0, -62]} cor="#1FA3A0" s={1.4} />
            <Castelo p={[-40, 0, 55]} cor="#D8323C" s={1.4} />
            <Montanhas />
          </> : <Campo t={t} />}
          {IN.pos !== false ? <><Aquece /><PosToon foco={c.look} bokeh={aereo ? 0.6 : noCampo && t < TM.exercitos + 0.1 ? 0.8 : 3.2} faixa={aereo ? 30 : 2.2} longe={aereo || (noCampo && t < TM.exercitos + 0.1) ? 120 : 30} /></> : null}
        </ThreeCanvas>
      </AbsoluteFill>
      <Legenda t={t} />
    </AbsoluteFill>
  );
};
