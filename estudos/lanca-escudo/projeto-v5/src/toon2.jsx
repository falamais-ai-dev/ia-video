// Kit toon v2 (31/10/2026, depois da comparação com o original): traço marrom-escuro, cel de 2 tons,
// metal em matcap, boneco "cabeça de lâmpada" com corpo de feijão, membros de linha e braços em espaço de mundo
// (a mão vai exatamente onde a cena manda: 2 ossos com cotovelo calculado).
import React from 'react';
import * as THREE from 'three';

export const LINHA = '#372C2E';
const LIN = new THREE.Color(LINHA);

// ---------- materiais ----------
const grad = (() => {
  const d = new Uint8Array([120, 120, 120, 255, 255, 255, 255, 255]);
  const t = new THREE.DataTexture(d, 2, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.generateMipmaps = false; t.needsUpdate = true;
  return t;
})();
export const GRAD = grad;
const mats = {};
export const T = (color, extra = {}) => {
  const k = 't' + color + JSON.stringify(Object.keys(extra)) + (extra.map ? extra.map.uuid : '') + (extra.side || '');
  if (!mats[k]) mats[k] = new THREE.MeshToonMaterial({color, gradientMap: grad, ...extra});
  return mats[k];
};
export const B = (color) => { const k = 'b' + color; if (!mats[k]) mats[k] = new THREE.MeshBasicMaterial({color}); return mats[k]; };

// texturas em canvas (cache)
const texs = {};
export const canvasTex = (key, w, h, draw, rep) => {
  if (!texs[key]) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); }
    texs[key] = t;
  }
  return texs[key];
};
// matcap de metal (prata ou ouro): brilho em cima à esquerda, borda escura, reflexo quente embaixo
const matcap = (k, c1, c2, c3) => canvasTex('mc' + k, 256, 256, (g, w) => {
  const gr = g.createRadialGradient(w * 0.36, w * 0.32, 4, w * 0.5, w * 0.5, w * 0.52);
  gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.12, c1); gr.addColorStop(0.55, c2); gr.addColorStop(0.9, c3); gr.addColorStop(1, '#2a2226');
  g.fillStyle = gr; g.fillRect(0, 0, w, w);
  g.fillStyle = 'rgba(255,214,150,0.35)'; g.beginPath(); g.ellipse(w * 0.62, w * 0.82, w * 0.22, w * 0.07, -0.3, 0, Math.PI * 2); g.fill();
});
export const PRATA = () => mats.prata ||= new THREE.MeshMatcapMaterial({matcap: matcap('prata', '#EEF2F6', '#AEB8C4', '#5F6874')});
export const OURO = () => mats.ouro ||= new THREE.MeshMatcapMaterial({matcap: matcap('ouro', '#FFF2B8', '#F2B93A', '#8A5A12')});
export const FERRO = () => mats.ferro ||= new THREE.MeshMatcapMaterial({matcap: matcap('ferro', '#C9CED6', '#6E7682', '#2F343C')});
export const MAT = (k, f) => mats['x' + k] ||= f();

// ---------- contorno (casca invertida, largura ~constante na tela, cor do traço) ----------
const hullMats = {};
export const HULL = (px = 1) => {
  if (!hullMats[px]) hullMats[px] = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {k: {value: 0.0036 * px}, cap: {value: 0.06 * px}, cor: {value: LIN}},
    vertexShader: `uniform float k; uniform float cap;
      void main(){
        vec4 p = vec4(position,1.0); vec3 n = normal;
        #ifdef USE_INSTANCING
          p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
        #endif
        vec4 mv = modelViewMatrix * p;
        vec3 nv = normalize(normalMatrix * n);
        mv.xyz += nv * min(k * -mv.z, cap);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `uniform vec3 cor; void main(){ gl_FragColor = vec4(cor,1.0); }`,
  });
  return hullMats[px];
};
export const Tn = ({geo, m, p, rot, s, line = 1, sombra = true, recebe = true, children, q}) => {
  const obj = geo && geo.isBufferGeometry;
  const mat = typeof m === 'string' ? T(m) : m;
  return (
    <group position={p} rotation={rot} scale={s} quaternion={q}>
      {obj ? <mesh geometry={geo} material={mat} castShadow={sombra} receiveShadow={recebe} /> : <mesh material={mat} castShadow={sombra} receiveShadow={recebe}>{geo}</mesh>}
      {line ? (obj ? <mesh geometry={geo} material={HULL(line)} /> : <mesh material={HULL(line)}>{geo}</mesh>) : null}
      {children}
    </group>
  );
};
export const Esf = ({r = 1, seg = 28, ...o}) => <Tn geo={<sphereGeometry args={[r, seg, Math.round(seg * 0.7)]} />} {...o} />;
export const Cx = ({a, ...o}) => <Tn geo={<boxGeometry args={a} />} {...o} />;
export const Ci = ({rt, rb, h, seg = 24, aberto = false, ...o}) => <Tn geo={<cylinderGeometry args={[rt, rb ?? rt, h, seg, 1, aberto]} />} {...o} />;
export const Co = ({r, h, seg = 24, ...o}) => <Tn geo={<coneGeometry args={[r, h, seg]} />} {...o} />;
// linha (membro, cabo fino) entre dois pontos do mundo
const _up = new THREE.Vector3(0, 1, 0);
export const Linha = ({a, b, r = 0.0055, cor = LINHA, sombra = true}) => {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
  const len = va.distanceTo(vb); if (len < 1e-5) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(_up, vb.clone().sub(va).normalize());
  return <mesh position={va.clone().add(vb).multiplyScalar(0.5)} quaternion={q} material={B(cor)} castShadow={sombra}><cylinderGeometry args={[r, r, len, 6]} /></mesh>;
};

// ---------- geometrias do boneco ----------
const lathe = (pts, seg = 32) => {
  const curve = new THREE.SplineCurve(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  return new THREE.LatheGeometry(curve.getPoints(40).map((v) => new THREE.Vector2(Math.max(0, v.x), v.y)), seg);
};
const PERFIL_CAB = Array.from({length: 41}, (_, i) => { const v = i / 40; return [Math.pow(Math.sin(Math.PI * v), 0.8) * (0.93 + 0.12 * v) * 0.165, 0.345 * (1 - Math.cos(Math.PI * v)) / 2]; });
export const raioCab = (y) => { // raio da cabeça na altura y (para colar olhos e boca na superfície)
  for (let i = 1; i < PERFIL_CAB.length; i++) { const [r0, y0] = PERFIL_CAB[i - 1], [r1, y1] = PERFIL_CAB[i]; if (y <= y1) return r0 + (r1 - r0) * (y - y0) / (y1 - y0); }
  return 0;
};
const G = {};
const geoCab = () => G.cab ||= new THREE.LatheGeometry(PERFIL_CAB.map(([x, y]) => new THREE.Vector2(x, y)), 40);
const geoCorpo = () => G.corpo ||= new THREE.LatheGeometry(Array.from({length: 41}, (_, i) => { const v = i / 40; return new THREE.Vector2(Math.pow(Math.sin(Math.PI * v), 0.7) * (0.19 - 0.075 * v), 0.4 + 0.49 * (1 - Math.cos(Math.PI * v)) / 2); }), 36);
const geoSobr = () => G.sobr ||= (() => { const s = new THREE.Shape(); s.moveTo(-0.034, -0.007); s.quadraticCurveTo(0, 0.004, 0.036, -0.002); s.lineTo(0.036, 0.004); s.quadraticCurveTo(0, 0.02, -0.034, 0.011); s.closePath(); return new THREE.ExtrudeGeometry(s, {depth: 0.008, bevelEnabled: false}); })();
const geoCapa = () => G.capa ||= (() => {
  const g = new THREE.CylinderGeometry(0.15, 0.27, 0.5, 40, 6, true, Math.PI * 0.5, Math.PI);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { // dobras verticais que abrem para baixo
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const a = Math.atan2(x, z); const k = (0.25 - y) / 0.5;
    const f = 1 + Math.sin(a * 9) * 0.06 * k;
    p.setX(i, x * f); p.setZ(i, z * f);
  }
  g.computeVertexNormals(); return g;
})();
const geoBarba = (comp) => G['barba' + comp] ||= new THREE.LatheGeometry(Array.from({length: 21}, (_, i) => { const v = i / 20; return new THREE.Vector2(0.108 * Math.pow(1 - v, 0.55) * Math.min(1, 0.35 + v * 6) + 0.0001, comp * v); }), 24);

// ---------- rosto ----------
const PELE = '#FFFFFF';
const Olho = ({x, y = 0.19, tipo, lado, olhar = [0, 0]}) => {
  const z = raioCab(y) - 0.012;
  if (tipo === 'fechado') return <mesh position={[x, y - 0.006, z + 0.012]} material={B(LINHA)}><torusGeometry args={[0.026, 0.0065, 6, 16, Math.PI]} /></mesh>;
  if (tipo === 'pisca') return <mesh position={[x, y - 0.004, z + 0.013]} material={B(LINHA)}><boxGeometry args={[0.052, 0.008, 0.006]} /></mesh>;
  const R = tipo === 'grande' ? 0.046 : 0.037;
  const pup = tipo === 'grande' ? 0.0095 : 0.015;
  return (
    <group position={[x, y, z]} rotation={[0, x * 1.6, 0]}>
      <Esf r={R} s={[1, 1.12, 0.42]} m={T('#FFFFFF')} line={0.55} sombra={false} seg={20} />
      <mesh position={[olhar[0] * R * 0.45, olhar[1] * R * 0.4, R * 0.43]} material={B(LINHA)}><sphereGeometry args={[pup, 12, 10]} /></mesh>
      <mesh position={[olhar[0] * R * 0.45 - pup * 0.3, olhar[1] * R * 0.4 + pup * 0.35, R * 0.44 + 0.004]} material={B('#ffffff')}><sphereGeometry args={[pup * 0.32, 8, 6]} /></mesh>
      {/* pálpebra: semi (deboche/tédio) ou brava (cai no meio) */}
      {tipo === 'semi' || tipo === 'bravo' || tipo === 'tedio' ? (
        <group rotation={[0, 0, tipo === 'bravo' ? lado * 0.45 : tipo === 'semi' ? lado * -0.12 : 0]}>
          <mesh position={[0, R * (tipo === 'tedio' ? 0.62 : 0.72), 0.004]} scale={[1.05, 0.62, 0.5]} material={T(PELE)}><sphereGeometry args={[R, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
          <mesh position={[0, R * (tipo === 'tedio' ? 0.0 : 0.12), R * 0.44]} material={B(LINHA)}><boxGeometry args={[R * 2.1, 0.006, 0.004]} /></mesh>
        </group>
      ) : null}
    </group>
  );
};
const Sobr = ({lado, sob = 0, alt = 0}) => {
  const y = 0.245 + alt - Math.max(0, sob) * 0.008;
  return <mesh geometry={geoSobr()} position={[lado * 0.058, y, raioCab(y) - 0.004]} rotation={[-0.25, lado * 0.35, lado * sob * 0.38]} scale={[lado, 1, 1]} material={B(LINHA)} />;
};
const Boca = ({tipo, abre = 0}) => {
  const y = 0.105, z = raioCab(y) + 0.001;
  const L = B(LINHA);
  if (tipo === 'sorriso') return <mesh position={[0, y + 0.012, z - 0.004]} rotation={[0.25, 0, Math.PI]} material={L}><torusGeometry args={[0.04, 0.0065, 6, 20, Math.PI * 0.8]} /></mesh>;
  if (tipo === 'canto') return <mesh position={[0.012, y + 0.008, z - 0.003]} rotation={[0.25, 0, Math.PI + 0.35]} material={L}><torusGeometry args={[0.036, 0.0065, 6, 20, Math.PI * 0.55]} /></mesh>;
  if (tipo === 'brava') return (
    <group position={[0, y - 0.004, z - 0.004]} rotation={[0.3, 0, 0]}>
      <mesh material={B(LINHA)}><boxGeometry args={[0.082, 0.036, 0.004]} /></mesh>
      <mesh position={[0, 0, 0.002]} material={B('#FFFFFF')}><boxGeometry args={[0.07, 0.024, 0.004]} /></mesh>
      <mesh position={[0, 0, 0.0045]} material={L}><boxGeometry args={[0.07, 0.004, 0.002]} /></mesh>
      {[-0.018, 0, 0.018].map((x) => <mesh key={x} position={[x, 0, 0.0045]} material={L}><boxGeometry args={[0.0035, 0.024, 0.002]} /></mesh>)}
    </group>
  );
  if (tipo === 'dentes' || tipo === 'brava') {
    const inv = tipo === 'brava';
    return (
      <group position={[0, y + (inv ? -0.004 : 0.008), z - 0.006]} rotation={[0.28, 0, inv ? 0 : Math.PI]}>
        <mesh material={B('#FFFFFF')}><circleGeometry args={[0.046, 22, 0, Math.PI]} /></mesh>
        <mesh position={[0, 0, 0.001]} material={L}><torusGeometry args={[0.046, 0.0065, 6, 22, Math.PI]} /></mesh>
        <mesh position={[0, 0.0, 0.002]} material={L}><boxGeometry args={[0.094, 0.0065, 0.003]} /></mesh>
        {[-0.016, 0.016].map((x) => <mesh key={x} position={[x, 0.016, 0.002]} material={L}><boxGeometry args={[0.0045, 0.03, 0.003]} /></mesh>)}
      </group>
    );
  }
  if (tipo === 'O') return <group position={[0, y, z - 0.002]}><mesh scale={[1, 1.25 + abre, 1]} material={B('#5A2E2E')}><circleGeometry args={[0.02, 18]} /></mesh><mesh scale={[1, 1.25 + abre, 1]} position={[0, 0, 0.001]} material={L}><torusGeometry args={[0.02, 0.006, 6, 18]} /></mesh></group>;
  if (tipo === 'reta') return <mesh position={[0, y, z]} material={L}><boxGeometry args={[0.05, 0.0065, 0.004]} /></mesh>;
  return null;
};

// ---------- boneco ----------
// c: {cor, olhos, boca, sob, olhar, cab:[rx,ry,rz], estica (squash/stretch), resp (fase da respiração), mP/mN (mãos no mundo ou null),
//     roupa (JSX no corpo), cabeca (JSX na cabeça), capa (cor), capaAng}
const OMB = 0.148, OMB_Y = 0.79, L1 = 0.2, L2 = 0.2;
const paraMundo = (pos, ry, p) => [pos[0] + p[0] * Math.cos(ry) + p[2] * Math.sin(ry), pos[1] + p[1], pos[2] - p[0] * Math.sin(ry) + p[2] * Math.cos(ry)];
export const ombro = (pos, ry, lado, sy = 1) => paraMundo(pos, ry, [lado * OMB, OMB_Y * sy, 0.0]);
export const maoRepouso = (pos, ry, lado, abre = 0.12, frente = 0.06, alt = 0.42) => paraMundo(pos, ry, [lado * (OMB + abre), alt, frente]);
const cotovelo = (s, h, dobra) => {
  // 2 ossos: cotovelo afastado do meio, para fora/baixo (dobra = vetor de preferência no mundo)
  const S = new THREE.Vector3(...s), Hh = new THREE.Vector3(...h);
  let d = S.distanceTo(Hh); const L = L1 + L2;
  if (d > L * 0.999) { Hh.copy(S).add(Hh.clone().sub(S).normalize().multiplyScalar(L * 0.999)); d = L * 0.999; }
  const mid = S.clone().add(Hh).multiplyScalar(0.5);
  const ax = Hh.clone().sub(S).normalize();
  const pref = new THREE.Vector3(...dobra);
  const perp = pref.sub(ax.clone().multiplyScalar(pref.dot(ax))).normalize();
  const off = Math.sqrt(Math.max(0, L1 * L1 - (d / 2) * (d / 2)));
  return [mid.add(perp.multiplyScalar(off)).toArray(), Hh.toArray()];
};
const Braco = ({s, h, dobra, mao = PELE}) => {
  const [e, hh] = cotovelo(s, h, dobra);
  return (
    <>
      <Linha a={s} b={e} /><Linha a={e} b={hh} />
      <mesh position={e} material={B(LINHA)}><sphereGeometry args={[0.0058, 6, 6]} /></mesh>
      <Esf r={0.021} p={hh} m={T(mao)} line={0.5} seg={14} />
    </>
  );
};
export const Boneco = ({pos, ry = 0, c}) => {
  const {cor, olhos = 'normal', boca = 'sorriso', sob = 0, olhar = [0, 0], cab = [0, 0, 0], estica = 0, resp = 0, alt = 0} = c;
  const sy = 1 + 0.013 * Math.sin(resp) + estica * 0.12, sx = 1 - 0.006 * Math.sin(resp) - estica * 0.06;
  const sP = ombro(pos, ry, 1, sy), sN = ombro(pos, ry, -1, sy);
  const mP = c.mP || maoRepouso(pos, ry, 1), mN = c.mN || maoRepouso(pos, ry, -1);
  const fora = (lado) => paraMundo([0, 0, 0], ry, [lado * 0.7, -0.6, -0.2]);
  return (
    <>
      <group position={pos} rotation={[0, ry, 0]}>
        {/* pernas finas e longas, pezinhos virados para fora */}
        {[-1, 1].map((l) => <group key={l}>
          <Linha a={[l * 0.06, 0.43, 0]} b={[l * 0.072, 0.03, 0.005]} />
          <mesh position={[l * 0.082, 0.016, 0.022]} rotation={[0, l * 0.55, 0]} scale={[0.6, 0.45, 1]} material={B(LINHA)} castShadow><sphereGeometry args={[0.03, 12, 8]} /></mesh>
        </group>)}
        <group scale={[sx, sy, sx]}>
          <Tn geo={geoCorpo()} m={cor} s={[1, 1, 0.86]} />
          {c.roupa}
          {c.capa ? <group position={[0, 0.6, -0.02]} rotation={[c.capaAng || 0, 0, 0]}><Tn geo={geoCapa()} m={T(c.capa, {side: THREE.DoubleSide})} /></group> : null}
          {/* cabeça de lâmpada */}
          <group position={[0, 0.87 + alt, 0]} rotation={cab} scale={1.3}>
            <Tn geo={geoCab()} m={PELE} />
            <Olho x={0.062} tipo={olhos} lado={1} olhar={olhar} />
            <Olho x={-0.062} tipo={olhos} lado={-1} olhar={olhar} />
            {olhos !== 'fechado' || sob ? <><Sobr lado={1} sob={sob} /><Sobr lado={-1} sob={sob} /></> : null}
            <Boca tipo={boca} abre={c.abre || 0} />
            {c.cabeca}
          </group>
        </group>
      </group>
      <Braco s={sP} h={mP} dobra={fora(1)} />
      <Braco s={sN} h={mN} dobra={fora(-1)} />
    </>
  );
};

// ---------- acessórios ----------
export const CoroaOuro = () => (
  <group position={[0, 0.3, -0.005]} rotation={[-0.1, 0, 0]}>
    <Ci rt={0.128} rb={0.122} h={0.06} m={OURO()} seg={28} aberto line={0.6} />
    {[0, 1, 2, 3, 4].map((i) => { const a = (i - 2) * 0.62; return (
      <group key={i} position={[Math.sin(a) * 0.125, 0.06, Math.cos(a) * 0.125]}>
        <Co r={0.03} h={0.07} m={OURO()} seg={8} line={0.6} />
        <Esf r={0.014} p={[0, 0.042, 0]} m={OURO()} line={0.5} seg={10} />
      </group>
    ); })}
    {[[-0.6, '#D8323C'], [0, '#2F6FE0'], [0.6, '#D8323C']].map(([a, c], i) => <Esf key={i} r={0.016} p={[Math.sin(a) * 0.128, 0, Math.cos(a) * 0.128]} s={[1, 1, 0.6]} m={T(c)} line={0.5} seg={10} />)}
  </group>
);
export const CoroaPrata = () => (
  <group position={[0, 0.3, -0.005]} rotation={[-0.1, 0, 0]}>
    <Ci rt={0.13} rb={0.124} h={0.055} m={PRATA()} seg={28} aberto line={0.6} />
    {[-0.75, 0, 0.75].map((a, i) => <Esf key={i} r={0.045} p={[Math.sin(a) * 0.12, 0.045, Math.cos(a) * 0.12]} s={[1, 1.1, 0.45]} rot={[0, a, 0]} m={PRATA()} line={0.6} seg={16} />)}
    {[-0.75, 0, 0.75].map((a, i) => <Esf key={'g' + i} r={0.014} p={[Math.sin(a) * 0.14, 0.045, Math.cos(a) * 0.14]} m={T('#1FC7C2')} line={0.4} seg={10} />)}
  </group>
);
export const Barba = ({comp = 0.22, cor = '#FFFFFF', y = 0.075, z = 0.12, ang = 0}) => (
  <group position={[0, y, z]} rotation={[Math.PI + 0.25, 0, ang]}>
    <Tn geo={geoBarba(comp)} m={cor} s={[1, 1, 0.55]} />
    {[-0.035, 0.035].map((x) => <mesh key={x} position={[x, comp * 0.55, 0.058]} rotation={[0.1, 0, x * 3]} material={B('#C9C1B8')}><boxGeometry args={[0.005, comp * 0.5, 0.004]} /></mesh>)}
  </group>
);
export const Cavanhaque = () => (
  <group>
    <Esf r={1} s={[0.035, 0.05, 0.03]} p={[0, 0.03, 0.105]} m="#7A4A26" line={0.5} seg={14} />
    {[-1, 1].map((l) => <Esf key={l} r={1} s={[0.03, 0.009, 0.012]} p={[l * 0.026, 0.135, 0.128]} rot={[0, 0, l * 0.35]} m="#7A4A26" line={0.4} seg={10} />)}
  </group>
);
export const BigodeGuidao = () => (
  <group position={[0, 0.138, raioCab(0.138) + 0.004]}>
    {[-1, 1].map((l) => (
      <group key={l} scale={[l, 1, 1]}>
        <Esf r={1} s={[0.042, 0.017, 0.016]} p={[0.034, 0, 0]} rot={[0, 0, -0.15]} m={LINHA} line={0} seg={14} />
        <mesh position={[0.074, 0.012, -0.004]} rotation={[0, 0, 0.6]} material={B(LINHA)}><torusGeometry args={[0.014, 0.0065, 6, 12, Math.PI * 1.3]} /></mesh>
      </group>
    ))}
  </group>
);
export const Avental = () => (
  <group>
    <Tn geo={<cylinderGeometry args={[0.172, 0.212, 0.36, 28, 1, true, -Math.PI * 0.32, Math.PI * 0.64]} />} p={[0, 0.58, 0.012]} s={[1, 1, 0.9]} m={T('#8A5226', {side: THREE.DoubleSide})} />
    <Cx a={[0.11, 0.07, 0.012]} p={[0, 0.52, 0.19]} rot={[-0.08, 0, 0]} m="#7A4520" line={0.5} />
    <Linha a={[-0.12, 0.76, 0.12]} b={[-0.1, 0.84, 0.05]} r={0.006} cor="#6A3A1A" />
    <Linha a={[0.12, 0.76, 0.12]} b={[0.1, 0.84, 0.05]} r={0.006} cor="#6A3A1A" />
  </group>
);
export const Elmo = ({cor = '#8E98A3'}) => (
  <group position={[0, 0.185, -0.01]} rotation={[-0.15, 0, 0.1]}>
    <Tn geo={<sphereGeometry args={[0.188, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />} m={FERRO()} />
    <Ci rt={0.195} h={0.025} m={FERRO()} seg={24} line={0.5} />
  </group>
);

// lança: cabo de madeira, ponta prateada, borla que balança; a frente pode entortar (rad, para baixo no mundo)
export const Lanca = ({grip, dir, comp = 1.5, frente = 0.5, dobra = 0, borla = '#D8323C', borlaAng = 0}) => {
  const d = new THREE.Vector3(...dir).normalize();
  const G0 = new THREE.Vector3(...grip);
  const tras = G0.clone().addScaledVector(d, -(comp - frente));
  const pivo = G0.clone().addScaledVector(d, frente - 0.3);
  // direção da parte da frente depois de entortar
  const eixo = new THREE.Vector3().crossVectors(d, _up); if (eixo.lengthSq() < 1e-6) eixo.set(1, 0, 0); eixo.normalize();
  const d2 = d.clone().applyAxisAngle(eixo, -dobra);
  const q2 = new THREE.Quaternion().setFromUnitVectors(_up, d2);
  const bpos = pivo.clone().addScaledVector(d2, 0.02);
  return (
    <group>
      <Tn geo={<cylinderGeometry args={[0.014, 0.014, tras.distanceTo(pivo), 8]} />} p={tras.clone().add(pivo).multiplyScalar(0.5).toArray()} q={new THREE.Quaternion().setFromUnitVectors(_up, d)} m={MAT('madeira', () => new THREE.MeshToonMaterial({color: '#9A6332', gradientMap: grad}))} line={0.7} />
      <group position={pivo.toArray()} quaternion={q2}>
        <Ci rt={0.014} h={0.14} p={[0, 0.07, 0]} m="#9A6332" seg={8} line={0.7} />
        <Ci rt={0.026} rb={0.02} h={0.04} p={[0, 0.15, 0]} m={OURO()} seg={10} line={0.6} />
        <Tn geo={<coneGeometry args={[0.042, 0.16, 4]} />} p={[0, 0.25, 0]} s={[1, 1, 0.35]} m={PRATA()} line={0.7} />
      </group>
      {/* borla pendurada no colar da ponta */}
      <group position={bpos.toArray()} rotation={[0, 0, borlaAng]}>
        <Linha a={[0, 0, 0]} b={[0, -0.05, 0]} r={0.004} cor="#8A1E1E" />
        <Co r={0.022} h={0.06} p={[0, -0.075, 0]} m={borla} seg={10} line={0.5} />
      </group>
    </group>
  );
};
export const pontaDe = (grip, dir, frente, dobra = 0) => {
  const d = new THREE.Vector3(...dir).normalize();
  const pivo = new THREE.Vector3(...grip).addScaledVector(d, frente - 0.3);
  const eixo = new THREE.Vector3().crossVectors(d, _up); if (eixo.lengthSq() < 1e-6) eixo.set(1, 0, 0); eixo.normalize();
  return pivo.addScaledVector(d.clone().applyAxisAngle(eixo, -dobra), 0.31).toArray();
};

// ---------- sprites de efeito (material por id) ----------
const spriteMat = {};
const SM = (key, draw, id = 0) => (spriteMat[key + id] ||= new THREE.SpriteMaterial({map: canvasTex(key, 256, 256, draw), transparent: true, depthWrite: false, fog: false}));
const estrela = (g, w) => {
  const c = w / 2; const gr = g.createRadialGradient(c, c, 0, c, c, c * 0.5);
  gr.addColorStop(0, 'rgba(255,255,240,1)'); gr.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w);
  g.fillStyle = '#fff'; g.beginPath(); const R = c * 0.96, r = c * 0.1;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2; const rr = i % 2 ? r : R; g.lineTo(c + Math.cos(a) * rr, c + Math.sin(a) * rr); } g.closePath(); g.fill();
};
const faisca = (g, w) => {
  const c = w / 2; g.lineCap = 'round';
  for (let i = 0; i < 10; i++) { const a = i * 2 * Math.PI / 10 + 0.2; g.strokeStyle = i % 2 ? '#FFD84A' : '#ffffff'; g.lineWidth = i % 2 ? 9 : 13; g.beginPath(); g.moveTo(c + Math.cos(a) * c * 0.35, c + Math.sin(a) * c * 0.35); g.lineTo(c + Math.cos(a) * c * (i % 2 ? 0.75 : 0.97), c + Math.sin(a) * c * (i % 2 ? 0.75 : 0.97)); g.stroke(); }
  const gr = g.createRadialGradient(c, c, 0, c, c, c * 0.35); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w);
};
const gota = (g, w) => {
  g.fillStyle = '#8FD8FF'; g.strokeStyle = LINHA; g.lineWidth = 12;
  g.beginPath(); g.moveTo(w / 2, 24); g.bezierCurveTo(w * 0.84, w * 0.55, w * 0.78, w * 0.9, w / 2, w * 0.9); g.bezierCurveTo(w * 0.22, w * 0.9, w * 0.16, w * 0.55, w / 2, 24); g.fill(); g.stroke();
  g.fillStyle = '#fff'; g.beginPath(); g.ellipse(w * 0.42, w * 0.66, 13, 22, -0.3, 0, Math.PI * 2); g.fill();
};
const velocidade = (g, w) => { g.strokeStyle = 'rgba(255,255,255,0.95)'; g.lineCap = 'round'; [[0.3, 10], [0.45, 7], [0.55, 12], [0.7, 8]].forEach(([y, lw], i) => { g.lineWidth = lw; g.beginPath(); g.moveTo(w * (0.05 + i * 0.07), w * y); g.lineTo(w * 0.95, w * y); g.stroke(); }); };
const nuvem = (g, w) => {
  const blobs = [[0.3, 0.6, 0.22], [0.5, 0.48, 0.28], [0.7, 0.58, 0.22], [0.42, 0.66, 0.2], [0.6, 0.68, 0.2], [0.2, 0.7, 0.14], [0.82, 0.7, 0.14]];
  blobs.forEach(([x, y, r]) => { const gr = g.createRadialGradient(x * w, (y - 0.06) * w, r * w * 0.2, x * w, y * w, r * w); gr.addColorStop(0, 'rgba(255,252,246,1)'); gr.addColorStop(0.6, 'rgba(250,240,236,0.98)'); gr.addColorStop(0.85, 'rgba(226,234,246,0.92)'); gr.addColorStop(1, 'rgba(226,234,246,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x * w, y * w, r * w, 0, Math.PI * 2); g.fill(); });
};
export const Brilho = ({id = 0, p, k, s = 0.5}) => (k > 0 && k < 1) ? <sprite position={p} scale={[s * Math.sin(k * Math.PI), s * Math.sin(k * Math.PI), 1]} material={SM('estrela', estrela, id)} material-rotation={k * 1.4} /> : null;
export const Faisca = ({id = 0, p, k, s = 0.7}) => (k > 0 && k < 1) ? <sprite position={p} scale={[s * (0.5 + 0.8 * Math.sqrt(k)), s * (0.5 + 0.8 * Math.sqrt(k)), 1]} material={SM('faisca', faisca, id)} material-opacity={k < 0.5 ? 1 : (1 - k) * 2} /> : null;
export const Gota = ({id = 0, p, k, s = 0.075}) => (k > 0 && k < 1) ? <sprite position={[p[0], p[1] - k * k * 0.18, p[2]]} scale={[s * 0.75, s, 1]} material={SM('gota', gota, id)} material-opacity={k < 0.85 ? 1 : (1 - k) / 0.15} /> : null;
export const Velocidade = ({id = 0, p, k, s = 0.6, rot = 0}) => (k > 0 && k < 1) ? <sprite position={p} scale={[s, s * 0.5, 1]} material={SM('vel', velocidade, id)} material-opacity={1 - k} material-rotation={rot} /> : null;
export const Nuvem = ({id = 0, p, s = 6}) => <sprite position={p} scale={[s, s * 0.62, 1]} material={SM('nuvem', nuvem, id)} />;
