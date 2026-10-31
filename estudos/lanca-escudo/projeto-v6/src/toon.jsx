// Kit "toon com contorno" (estudo de estilo, 31/10/2026): material toon em 3 faixas, contorno preto por casca invertida
// (largura constante na tela), sprites de efeito e o boneco de cabeça de ovo com braços e pernas de palito.
import React from 'react';
import * as THREE from 'three';

// ---------- material toon (cache) ----------
const grad = (() => {
  const d = new Uint8Array([70, 70, 70, 255, 165, 165, 165, 255, 255, 255, 255, 255]);
  const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.generateMipmaps = false; t.needsUpdate = true;
  return t;
})();
const mats = {};
export const T = (color, extra = {}) => {
  const k = color + JSON.stringify(extra);
  if (!mats[k]) mats[k] = new THREE.MeshToonMaterial({color, gradientMap: grad, ...extra});
  return mats[k];
};
export const B = (color) => { const k = 'b' + color; if (!mats[k]) mats[k] = new THREE.MeshBasicMaterial({color}); return mats[k]; };

// contorno: casca de faces de trás empurrada pela normal em espaço de câmera, proporcional à distância
// (linha de largura quase constante na tela, como tinta). Funciona também em InstancedMesh.
const hullMats = {};
export const HULL = (px = 1) => {
  if (!hullMats[px]) hullMats[px] = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {k: {value: 0.0021 * px}, cap: {value: 0.05 * px}},
    vertexShader: `uniform float k; uniform float cap;
      void main(){
        vec4 p = vec4(position,1.0); vec3 n = normal;
        #ifdef USE_INSTANCING
          p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
        #endif
        vec4 mv = modelViewMatrix * p;
        vec3 nv = normalize(normalMatrix * n);
        float w = min(k * -mv.z, cap);
        mv.xyz += nv * w;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `void main(){ gl_FragColor = vec4(0.07,0.05,0.05,1.0); }`,
  });
  return hullMats[px];
};

// peça com contorno: geometria dada como elemento JSX (ex. <sphereGeometry args=.../>)
export const Tn = ({geo, m, p, rot, s, line = 1, sombra = true, recebe = true, children}) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh material={typeof m === 'string' ? T(m) : m} castShadow={sombra} receiveShadow={recebe}>{geo}</mesh>
    {line ? <mesh material={HULL(line)}>{geo}</mesh> : null}
    {children}
  </group>
);
export const Esf = ({r = 1, ...o}) => <Tn geo={<sphereGeometry args={[r, 28, 20]} />} {...o} />;
export const Cx = ({a, ...o}) => <Tn geo={<boxGeometry args={a} />} {...o} />;
export const Ci = ({rt, rb, h, seg = 24, ...o}) => <Tn geo={<cylinderGeometry args={[rt, rb ?? rt, h, seg]} />} {...o} />;
export const Co = ({r, h, seg = 24, ...o}) => <Tn geo={<coneGeometry args={[r, h, seg]} />} {...o} />;
// palito preto (sem contorno, já é preto) entre dois pontos
export const Palito = ({a, b, r = 0.022, cor = '#141010'}) => {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
  const mid = va.clone().add(vb).multiplyScalar(0.5);
  const len = va.distanceTo(vb);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
  return <mesh position={mid} quaternion={q} material={B(cor)} castShadow><cylinderGeometry args={[r, r, len, 8]} /></mesh>;
};

// ---------- texturas em canvas (cache) ----------
const texs = {};
export const canvasTex = (key, w, h, draw) => {
  if (!texs[key]) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    texs[key] = t;
  }
  return texs[key];
};
const spriteMat = {};
const SM = (key, draw, id = 0) => {
  const kk = key + ':' + id;
  if (!spriteMat[kk]) spriteMat[kk] = new THREE.SpriteMaterial({map: canvasTex(key, 256, 256, draw), transparent: true, depthWrite: false, fog: false});
  return spriteMat[kk];
};
// estrela de brilho de 4 pontas
const estrela = (g, w) => {
  const c = w / 2; const gr = g.createRadialGradient(c, c, 0, c, c, c * 0.5);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,250,220,0)');
  g.fillStyle = gr; g.fillRect(0, 0, w, w);
  g.fillStyle = '#fff'; g.beginPath();
  const R = c * 0.96, r = c * 0.12;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2; const rr = i % 2 ? r : R; g.lineTo(c + Math.cos(a) * rr, c + Math.sin(a) * rr); }
  g.closePath(); g.fill();
};
const anel = (g, w) => { g.strokeStyle = '#fff'; g.lineWidth = 18; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 14, 0, Math.PI * 2); g.stroke(); };
const faisca = (g, w) => {
  g.strokeStyle = '#fff'; g.lineCap = 'round'; const c = w / 2;
  for (let i = 0; i < 9; i++) { const a = i * 2 * Math.PI / 9 + 0.2; g.lineWidth = 12; g.beginPath(); g.moveTo(c + Math.cos(a) * c * 0.45, c + Math.sin(a) * c * 0.45); g.lineTo(c + Math.cos(a) * c * 0.95, c + Math.sin(a) * c * 0.95); g.stroke(); }
  g.strokeStyle = '#FFD84A'; for (let i = 0; i < 9; i++) { const a = i * 2 * Math.PI / 9 + 0.55; g.lineWidth = 8; g.beginPath(); g.moveTo(c + Math.cos(a) * c * 0.4, c + Math.sin(a) * c * 0.4); g.lineTo(c + Math.cos(a) * c * 0.75, c + Math.sin(a) * c * 0.75); g.stroke(); }
};
const gota = (g, w) => {
  g.fillStyle = '#7FD3FF'; g.strokeStyle = '#141010'; g.lineWidth = 14;
  g.beginPath(); g.moveTo(w / 2, 20); g.bezierCurveTo(w * 0.85, w * 0.55, w * 0.8, w * 0.92, w / 2, w * 0.92); g.bezierCurveTo(w * 0.2, w * 0.92, w * 0.15, w * 0.55, w / 2, 20); g.fill(); g.stroke();
  g.fillStyle = '#fff'; g.beginPath(); g.ellipse(w * 0.42, w * 0.66, 14, 24, -0.3, 0, Math.PI * 2); g.fill();
};
export const Brilho = ({id = 0, p, k, s = 0.5}) => (k > 0 && k < 1) ? <sprite position={p} scale={[s * Math.sin(k * Math.PI), s * Math.sin(k * Math.PI), 1]} material={SM('estrela', estrela, id)} material-rotation={k * 1.2} /> : null;
export const Anel = ({id = 0, p, k, s = 0.8}) => (k > 0 && k < 1) ? <sprite position={p} scale={[s * (0.3 + k), s * (0.3 + k), 1]} material={SM('anel', anel, id)} material-opacity={1 - k} /> : null;
export const Faisca = ({id = 0, p, k, s = 0.7}) => (k > 0 && k < 1) ? <sprite position={p} scale={[s * (0.5 + 0.7 * k), s * (0.5 + 0.7 * k), 1]} material={SM('faisca', faisca, id)} material-opacity={k < 0.6 ? 1 : (1 - k) / 0.4} /> : null;
export const Gota = ({id = 0, p, k, s = 0.12}) => (k > 0 && k < 1) ? <sprite position={[p[0], p[1] - k * 0.12, p[2]]} scale={[s * 0.75, s, 1]} material={SM('gota', gota, id)} material-opacity={k < 0.8 ? 1 : (1 - k) * 5} /> : null;

// ---------- boneco cabeça de ovo ----------
// cfg: {cor, cor2 (capa), olhos: 'ponto'|'fechado'|'vilao'|'grande'|'raiva'|'tedio', boca: 'sorriso'|'dentes'|'reta'|'o'|'nenhuma',
//       sob (inclinação da sobrancelha, + = brava), cab: [rx, ry, rz], bxp/bxn: [rx, rz, cotovelo] (braço do lado +x / -x local),
//       pernas, extras de cabeça (cabeca: JSX), corpo (JSX)}
const PELE = '#FFF3EA';
const Olho = ({x, tipo, lado}) => {
  const y = 0.035, z = 0.212;
  if (tipo === 'fechado') return <mesh position={[x, y - 0.01, z]} rotation={[0, 0, 0]} material={B('#141010')}><torusGeometry args={[0.03, 0.009, 6, 16, Math.PI]} /></mesh>;
  if (tipo === 'grande') return (
    <group position={[x, y + 0.01, z - 0.012]}>
      <Esf r={0.05} m={T('#ffffff')} s={[1, 1.15, 0.5]} line={0.6} sombra={false} />
      <mesh position={[lado * -0.006, -0.004, 0.026]} material={B('#141010')}><sphereGeometry args={[0.018, 12, 10]} /></mesh>
    </group>
  );
  const ponto = <mesh position={[x, y, z]} scale={[1, tipo === 'vilao' || tipo === 'tedio' ? 0.75 : 1.25, 0.5]} material={B('#141010')}><sphereGeometry args={[0.026, 12, 10]} /></mesh>;
  if (tipo === 'tedio' || tipo === 'vilao') return (
    <>
      {ponto}
      {/* pálpebra caída: meia esfera da cor da pele cobrindo a metade de cima, com risco preto */}
      <mesh position={[x, y + 0.012, z + 0.004]} rotation={[0, 0, lado * (tipo === 'vilao' ? -0.25 : 0)]} material={B(PELE)}><boxGeometry args={[0.075, 0.03, 0.02]} /></mesh>
      <mesh position={[x, y - 0.002, z + 0.016]} rotation={[0, 0, lado * (tipo === 'vilao' ? -0.25 : 0)]} material={B('#141010')}><boxGeometry args={[0.07, 0.009, 0.006]} /></mesh>
    </>
  );
  return ponto;
};
const Boca = ({tipo, y = -0.075}) => {
  const z = 0.205;
  if (tipo === 'sorriso') return <mesh position={[0, y + 0.02, z]} rotation={[0, 0, Math.PI]} material={B('#141010')}><torusGeometry args={[0.055, 0.01, 6, 20, Math.PI]} /></mesh>;
  if (tipo === 'dentes') return (
    <group position={[0, y + 0.012, z + 0.002]}>
      <mesh rotation={[0, 0, Math.PI]} material={B('#ffffff')}><circleGeometry args={[0.058, 20, 0, Math.PI]} /></mesh>
      <mesh rotation={[0, 0, Math.PI]} position={[0, 0, 0.001]} material={B('#141010')}><torusGeometry args={[0.058, 0.009, 6, 20, Math.PI]} /></mesh>
      <mesh position={[0, 0, 0.002]} material={B('#141010')}><boxGeometry args={[0.12, 0.009, 0.004]} /></mesh>
      <mesh position={[0, -0.022, 0.002]} material={B('#141010')}><boxGeometry args={[0.007, 0.045, 0.004]} /></mesh>
    </group>
  );
  if (tipo === 'reta') return <mesh position={[0, y, z]} material={B('#141010')}><boxGeometry args={[0.07, 0.011, 0.01]} /></mesh>;
  if (tipo === 'o') return <mesh position={[0, y, z]} material={B('#141010')}><torusGeometry args={[0.022, 0.009, 6, 14]} /></mesh>;
  if (tipo === 'brava') return <mesh position={[0, y - 0.015, z]} material={B('#141010')}><torusGeometry args={[0.045, 0.01, 6, 20, Math.PI]} /></mesh>;
  return null;
};

// cadeia do braço (a mesma conta é usada para achar a mão no mundo: maoMundo)
const OMBRO = [0.115, 0.74, 0];
const L1 = 0.2, L2 = 0.19;
const _o = {raiz: new THREE.Object3D(), ombro: new THREE.Object3D(), cot: new THREE.Object3D(), mao: new THREE.Object3D()};
_o.raiz.add(_o.ombro); _o.ombro.add(_o.cot); _o.cot.add(_o.mao);
export const maoMundo = (pos, ry, lado, b, escala = 1) => {
  _o.raiz.position.set(...pos); _o.raiz.rotation.set(0, ry, 0); _o.raiz.scale.setScalar(escala);
  _o.ombro.position.set(lado * OMBRO[0], OMBRO[1], OMBRO[2]); _o.ombro.rotation.set(b[0], 0, lado * b[1], 'YXZ');
  _o.cot.position.set(0, -L1, 0); _o.cot.rotation.set(b[2], 0, 0);
  _o.mao.position.set(0, -L2, 0);
  _o.raiz.updateMatrixWorld(true);
  return _o.mao.getWorldPosition(new THREE.Vector3()).toArray();
};
const Braco = ({lado, b}) => {
  const cot = [0, -L1, 0];
  return (
    <group position={[lado * OMBRO[0], OMBRO[1], OMBRO[2]]} rotation={new THREE.Euler(b[0], 0, lado * b[1], 'YXZ')}>
      <Palito a={[0, 0, 0]} b={cot} />
      <group position={cot} rotation={[b[2], 0, 0]}>
        <Palito a={[0, 0, 0]} b={[0, -L2, 0]} />
        <mesh position={[0, -L2, 0]} material={B('#141010')}><sphereGeometry args={[0.034, 12, 10]} /></mesh>
      </group>
    </group>
  );
};
export const Boneco = ({pos, ry = 0, escala = 1, c}) => {
  const {cor, cab = [0, 0, 0], olhos = 'ponto', boca = 'sorriso', sob = 0, bxp = [0, 0.15, 0.1], bxn = [0, 0.15, 0.1], sobY = 0.09} = c;
  const pz = c.pz || 0; // pulinho / afundar
  return (
    <group position={[pos[0], pos[1] + pz, pos[2]]} rotation={[0, ry, 0]} scale={escala}>
      {/* pernas e pés */}
      {[-1, 1].map((l) => <Palito key={l} a={[l * 0.075, 0.33, 0]} b={[l * 0.08, 0.03, 0.01]} />)}
      {[-1, 1].map((l) => <mesh key={'p' + l} position={[l * 0.085, 0.025, 0.035]} scale={[1, 0.6, 1.5]} material={B('#141010')} castShadow><sphereGeometry args={[0.04, 12, 10]} /></mesh>)}
      {/* túnica em cone */}
      <Ci rt={0.115} rb={0.235} h={0.5} p={[0, 0.55, 0]} m={cor} />
      {c.corpo}
      <Braco lado={1} b={bxp} />
      <Braco lado={-1} b={bxn} />
      {/* cabeça de ovo */}
      <group position={[0, 1.02, 0]} rotation={cab}>
        <Esf r={1} s={[0.23, 0.26, 0.225]} m={PELE} />
        <Olho x={0.075} tipo={olhos} lado={1} />
        <Olho x={-0.075} tipo={olhos} lado={-1} />
        {/* sobrancelhas grossas: sob > 0 brava (desce no meio), < 0 preocupada */}
        {[-1, 1].map((l) => <mesh key={'s' + l} position={[l * 0.078, sobY - Math.abs(sob) * 0.012, 0.205]} rotation={[-0.2, 0, -l * sob * 0.5]} material={B('#141010')}><boxGeometry args={[0.075, 0.02, 0.02]} /></mesh>)}
        <Boca tipo={boca} />
        {c.cabeca}
      </group>
    </group>
  );
};

// acessórios
export const Coroa = ({cor = '#F6C431', gemas = ['#D8323C', '#2F6FE0']}) => (
  <group position={[0, 0.2, 0]} rotation={[-0.08, 0, 0]}>
    <Ci rt={0.15} rb={0.14} h={0.07} m={T(cor)} seg={24} />
    {[0, 1, 2, 3, 4, 5].map((i) => { const a = i * Math.PI / 3; return <Co key={i} r={0.032} h={0.09} p={[Math.sin(a) * 0.13, 0.075, Math.cos(a) * 0.13]} m={T(cor)} seg={8} />; })}
    {[0, 1, 2].map((i) => { const a = (i - 1) * 0.7; return <Esf key={'g' + i} r={0.02} p={[Math.sin(a) * 0.15, 0, Math.cos(a) * 0.15]} m={T(gemas[i % 2])} line={0.6} />; })}
  </group>
);
export const Capa = ({cor}) => (
  <group position={[0, 0.55, -0.02]}>
    <Tn geo={<cylinderGeometry args={[0.15, 0.29, 0.56, 24, 1, true, Math.PI * 0.55, Math.PI * 0.9]} />} m={T(cor, {side: THREE.DoubleSide})} />
  </group>
);
export const Barba = ({cor = '#ffffff', comp = 0.2, larg = 0.13}) => (
  <Co r={larg} h={comp} p={[0, -0.16 - comp * 0.35, 0.12]} s={[1, 1, 0.6]} rot={[Math.PI, 0, 0]} m={cor} />
);
export const Bigode = ({cor = '#141010', s = 1}) => (
  <group position={[0, -0.04, 0.215]} scale={s}>
    {[-1, 1].map((l) => <Esf key={l} r={1} s={[0.06, 0.022, 0.02]} p={[l * 0.05, 0, 0]} rot={[0, 0, l * 0.3]} m={cor} line={0.5} />)}
  </group>
);

// lança: cabo de madeira, ponta prateada e borla; `dobra` entorta a parte da frente (rad)
export const Lanca = ({grip, dir, comp = 1.5, frente = 0.5, dobra = 0, borla = '#D8323C'}) => {
  // grip = ponto da mão; dir = vetor unitário para a ponta; frente = distância da mão até a ponta
  const d = new THREE.Vector3(...dir).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
  const tras = comp - frente; // atrás da mão
  const pivo = frente - 0.32; // onde dobra (a partir da mão)
  return (
    <group position={grip} quaternion={q}>
      <Ci rt={0.018} h={tras + pivo} p={[0, (pivo - tras) / 2, 0]} m="#9A6332" seg={10} line={0.7} />
      <group position={[0, pivo, 0]} rotation={[0, 0, dobra]}>
        <Ci rt={0.018} h={0.2} p={[0, 0.1, 0]} m="#9A6332" seg={10} line={0.7} />
        <Ci rt={0.03} rb={0.022} h={0.05} p={[0, 0.2, 0]} m="#E8C43A" seg={12} line={0.7} />
        <Esf r={1} s={[0.045, 0.1, 0.02]} p={[0, 0.3, 0]} m={T('#DDE6EE')} line={0.7} />
        <Co r={0.04} h={0.06} p={[0, 0.17, 0]} rot={[Math.PI, 0, 0]} m={borla} seg={10} line={0.6} />
      </group>
    </group>
  );
};
export const pontaLanca = (grip, dir, frente, dobra = 0) => {
  const d = new THREE.Vector3(...dir).normalize();
  return [grip[0] + d.x * (frente - 0.02), grip[1] + d.y * (frente - 0.02), grip[2] + d.z * (frente - 0.02)];
};
