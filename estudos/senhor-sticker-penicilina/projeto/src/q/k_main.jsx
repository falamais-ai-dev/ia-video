// ================= vídeo 3: câmera, cenas e montagem =================
const V = (a) => a;
const PLANOS = [
  {t0: 0, set: 'lab', keys: [[0, [-0.6, 1.25, 1.4], [-1.55, 0.95, -1.6], 44], [TM.louca, [-0.75, 1.2, 1.0], [-1.6, 0.95, -1.6], 42]]},
  {t0: TM.louca, set: 'lab', keys: [[TM.louca, [1.35, 1.3, -0.95], [1.85, 1.0, -1.85], 38], [TM.salvou - 0.2, [1.45, 1.25, -1.15], [1.85, 1.0, -1.85], 36]]},
  {t0: TM.salvou - 0.19, set: 'rua', keys: [[TM.salvou - 0.19, [XRUA, 1.45, 3.4], [XRUA, 1.55, 0.3], 48], [TM.londres, [XRUA + 0.3, 2.2, 3.0], [XRUA, 1.7, 0.3], 46]]},
  {t0: TM.londres, set: 'rua', keys: [[TM.londres, [XRUA - 1.4, 1.0, 4.6], [XRUA, 1.8, -2.6], 50], [TM.alexander, [XRUA - 0.2, 1.3, 3.8], [XRUA, 2.1, -2.6], 46]]},
  {t0: TM.alexander, set: 'lab', keys: [[TM.alexander, [0.2, 1.7, 2.8], [0.2, 1.0, -1.2], 48], [TM.baguncado, [0.3, 1.6, 2.4], [0.2, 1.0, -1.2], 46], [TM.placas, [0.5, 1.5, 2.1], [0.3, 1.0, -1.3], 44]]},
  {t0: TM.placas, set: 'lab', keys: [[TM.placas, [-0.4, 1.95, -0.3], [-0.38, 0.95, -0.85], 40], [TM.pia, [-0.45, 1.65, -0.3], [-0.38, 1.0, -0.85], 36]]},
  {t0: TM.pia, set: 'lab', keys: [[TM.pia, [1.5, 1.45, -0.95], [1.8, 1.05, -1.85], 38], [TM.xicara, [1.55, 1.4, -1.05], [1.8, 1.05, -1.85], 36]]},
  {t0: TM.xicara, set: 'lab', keys: [[TM.xicara, [0.32, 1.08, -0.3], [0.18, 0.9, -0.75], 34], [TM.papel, [0.28, 1.02, -0.38], [0.18, 0.9, -0.75], 30]]},
  {t0: TM.papel, set: 'lab', keys: [[TM.papel, [-0.6, 0.28, 0.7], [-0.3, 0.12, -0.6], 50], [TM.colegas, [-0.3, 0.32, 0.55], [0.0, 0.12, -0.6], 48]]},
  {t0: TM.colegas, set: 'lab', keys: [[TM.colegas, [-0.75, 1.25, 1.3], [-1.3, 0.95, -1.3], 44], [TM.fleming2, [-0.8, 1.2, 1.0], [-1.3, 0.98, -1.3], 42]]},
  {t0: TM.fleming2, set: 'lab', keys: [[TM.fleming2, [-0.5, 1.25, 0.3], [-1.25, 1.05, -1.0], 36], [TM.chiqueiro, [-0.58, 1.22, 0.1], [-1.25, 1.05, -1.0], 33]]},
  {t0: TM.chiqueiro + 0.05, set: 'lab', keys: [[TM.chiqueiro + 0.05, [-0.35, 0.5, 0.45], [-0.75, 0.22, -0.35], 40], [TM.so, [-0.38, 0.46, 0.35], [-0.75, 0.24, -0.35], 36]]},
  {t0: TM.so, set: 'lab', keys: [[TM.so, [0.35, 1.2, 0.35], [0.3, 1.0, -1.5], 40], [TM.saiu2, [0.33, 1.18, 0.15], [0.3, 1.0, -1.5], 38]]},
  {t0: TM.saiu2, set: 'lab', keys: [[TM.saiu2, [1.2, 1.5, 1.6], [-0.4, 0.9, -1.5], 46], [TM.sem2, [1.0, 1.5, 1.4], [-1.4, 0.9, -1.7], 46]]},
  {t0: TM.sem2, set: 'lab', keys: [[TM.sem2, [-1.45, 1.45, -0.3], [-1.95, 1.2, -2.15], 42], [TM.semanas - 0.1, [-1.55, 1.42, -0.6], [-1.95, 1.25, -2.15], 38]]},
  {t0: TM.semanas - 0.1, set: 'lab', keys: [[TM.semanas - 0.1, [0.4, 1.6, 2.3], [0.3, 1.1, -1.4], 46], [TM.alguma - 0.15, [0.4, 1.5, 1.9], [0.3, 1.05, -1.4], 44]]},
  {t0: TM.alguma - 0.15, set: 'pl', keys: [[TM.alguma - 0.15, [MOLD[0] + 0.2, 1.1, MOLD[2] + 1.0], [MOLD[0], 0.05, MOLD[2]], 40], [TM.volta - 0.1, [MOLD[0] + 0.12, 0.7, MOLD[2] + 0.6], [MOLD[0], 0.08, MOLD[2]], 36]]},
  {t0: TM.volta - 0.1, set: 'lab', keys: [[TM.volta - 0.1, [-1.0, 1.3, 0.4], [-1.8, 1.0, -1.8], 42], [TM.pegou, [-1.05, 1.28, 0.25], [-1.6, 1.0, -1.6], 40]]},
  {t0: TM.pegou, set: 'lab', keys: [[TM.pegou, [2.1, 1.25, -0.5], [0.8, 0.95, -1.5], 40], [TM.parou - 0.1, [1.95, 1.2, -0.75], [0.95, 0.98, -1.5], 36]]},
  {t0: TM.parou - 0.1, set: 'lab', keys: [[TM.parou - 0.1, [2.05, 1.18, -0.05], [0.75, 1.12, -1.5], 42], [TM.parou + 0.15, [2.05, 1.18, -0.05], [0.75, 1.12, -1.5], 22, outQ], [TM.tinha2, [2.05, 1.18, -0.05], [0.75, 1.12, -1.5], 20]]},
  {t0: TM.tinha2, set: 'pl', keys: [[TM.tinha2, [MOLD[0] + 0.3, 0.6, MOLD[2] + 1.1], [MOLD[0], 0.18, MOLD[2]], 38], [TM.volta2 - 0.3, [MOLD[0] + 0.2, 0.55, MOLD[2] + 0.95], [MOLD[0], 0.18, MOLD[2]], 34]]},
  {t0: TM.volta2 - 0.3, set: 'pl', keys: [[TM.volta2 - 0.3, [XPL + 0.3, 1.0, 0.9], [XPL - 0.3, 0.05, -0.45], 44], [TM.circulo, [XPL + 0.1, 1.25, 0.6], [XPL - 0.35, 0.05, -0.5], 44]]},
  {t0: TM.circulo, set: 'pl', keys: [[TM.circulo, [MOLD[0], 2.5, MOLD[2] + 0.25], [MOLD[0], 0, MOLD[2]], 40], [TM.aquele, [MOLD[0], 2.1, MOLD[2] + 0.25], [MOLD[0], 0, MOLD[2]], 40]]},
  {t0: TM.aquele, set: 'pl', keys: [[TM.aquele, [MOLD[0] + 0.45, 0.5, MOLD[2] + 1.05], [MOLD[0], 0.2, MOLD[2]], 38], [TM.fleming3, [MOLD[0] + 0.3, 0.45, MOLD[2] + 0.9], [MOLD[0], 0.2, MOLD[2]], 34]]},
  {t0: TM.fleming3, set: 'lab', keys: [[TM.fleming3, [0.35, 0.95, 1.0], [0.3, 1.4, -1.5], 46], [TM.so2, [0.33, 0.92, 0.75], [0.3, 1.45, -1.5], 44]]},
  {t0: TM.so2, set: 'lab', keys: [[TM.so2, [0.0, 1.2, 2.4], [-0.6, 0.7, -1.0], 46], [TM.nao - 0.2, [0.1, 1.15, 2.2], [-0.6, 0.7, -1.0], 46]]},
  {t0: TM.nao - 0.2, set: 'lab', keys: [[TM.nao - 0.2, [0.8, 1.25, 0.35], [0.35, 1.0, -1.45], 40], [TM.descoberta, [0.75, 1.22, 0.15], [0.35, 1.0, -1.45], 38]]},
  {t0: TM.descoberta, set: 'lab', keys: [[TM.descoberta, [0.4, 1.45, 0.7], [-0.9, 0.8, -1.5], 46], [TM.dez - 0.05, [0.25, 1.4, 0.5], [-1.2, 0.8, -1.6], 44]]},
  {t0: TM.dez - 0.05, set: 'lab', keys: [[TM.dez - 0.05, [-1.0, 1.15, -0.8], [-1.45, 0.85, -1.85], 38], [TM.ate, [-1.05, 1.1, -0.9], [-1.45, 0.85, -1.85], 32]]},
  {t0: TM.ate, set: 'gue', keys: [[TM.ate, [XGUE, 1.5, 4.6], [XGUE, 1.7, -2], 48], [TM.dois, [XGUE + 0.3, 1.0, 3.8], [XGUE, 1.3, -2], 46]]},
  {t0: TM.dois, set: 'fab', keys: [[TM.dois, [XFAB, 1.65, 2.9], [XFAB, 1.1, -1.0], 44], [TM.florey, [XFAB, 1.6, 2.5], [XFAB, 1.1, -1.0], 42]]},
  {t0: TM.florey, set: 'fab', keys: [[TM.florey, [XFAB - 0.45, 1.35, 1.3], [XFAB - 0.5, 1.2, -1.05], 40], [TM.chain - 0.05, [XFAB - 0.45, 1.35, 1.3], [XFAB - 0.5, 1.2, -1.05], 40], [TM.chain + 0.2, [XFAB + 0.45, 1.35, 1.3], [XFAB + 0.5, 1.2, -1.05], 40], [TM.descobriram, [XFAB + 0.4, 1.35, 1.2], [XFAB + 0.45, 1.2, -1.05], 40]]},
  {t0: TM.descobriram, set: 'fab', keys: [[TM.descobriram, [XFAB + 0.3, 1.35, 1.3], [XFAB, 1.05, -0.9], 44], [TM.produzir, [XFAB + 1.8, 1.2, 1.4], [XFAB, 0.8, -0.6], 44], [TM.repente - 0.05, [XFAB + 1.2, 1.4, 1.9], [XFAB, 0.9, -0.8], 46]]},
  {t0: TM.repente - 0.15, set: 'gue', keys: [[TM.repente - 0.15, [XGUE + 0.4, 1.25, 1.7], [XGUE - 0.15, 0.95, -0.2], 40], [TM.infeccionado, [XGUE + 0.35, 1.22, 1.45], [XGUE - 0.15, 0.95, -0.2], 38]]},
  {t0: TM.infeccionado, set: 'gue', keys: [[TM.infeccionado, [XGUE + 0.2, 1.3, 2.4], [XGUE + 0.05, 0.9, -0.2], 42], [TM.sentenca, [XGUE + 0.2, 1.28, 2.2], [XGUE + 0.05, 0.9, -0.2], 40]]},
  {t0: TM.sentenca, set: 'gue', keys: [[TM.sentenca, [XGUE + 0.3, 1.3, 3.3], [XGUE - 0.1, 1.0, -0.2], 46], [TM.mil2 - 0.1, [XGUE + 0.25, 1.3, 3.0], [XGUE - 0.1, 1.0, -0.2], 44]]},
  {t0: TM.mil2 - 0.1, set: 'nob', keys: [[TM.mil2 - 0.1, [XNOB, 2.1, 4.4], [XNOB, 1.4, -1.0], 46], [TM.ganharam, [XNOB, 2.0, 3.8], [XNOB, 1.45, -1.0], 44]]},
  {t0: TM.ganharam, set: 'nob', keys: [[TM.ganharam, [XNOB, 1.45, 0.75], [XNOB, 1.3, -0.9], 38], [TM.colegas2 - 0.25, [XNOB, 1.45, 0.5], [XNOB, 1.3, -0.9], 34]]},
  {t0: TM.colegas2 - 0.25, set: 'col', keys: [[TM.colegas2 - 0.25, [XCOL + 0.2, 1.45, 3.6], [XCOL + 0.2, 0.95, -0.8], 44], [TM.bancada, [XCOL + 0.2, 1.4, 3.2], [XCOL + 0.2, 0.95, -0.8], 42]]},
  {t0: TM.bancada, set: 'col', keys: [[TM.bancada, [XCOL + 1.55, 1.45, -0.95], [XCOL + 0.1, 0.88, -0.95], 42], [TM.nenhuma - 0.1, [XCOL + 1.4, 1.4, -1.0], [XCOL + 0.1, 0.88, -0.95], 40]]},
  {t0: TM.nenhuma - 0.1, set: 'col', keys: [[TM.nenhuma - 0.1, [XCOL + 0.2, 1.3, 2.7], [XCOL + 0.2, 0.92, -0.2], 42], [TM.entao, [XCOL + 0.2, 1.28, 2.4], [XCOL + 0.2, 0.92, -0.2], 40]]},
  {t0: TM.entao, set: 'qua', keys: [[TM.entao, [XQUA + 0.7, 1.45, 2.8], [XQUA + 0.7, 0.8, -1.0], 46], [TM.arrumar, [XQUA + 0.75, 1.4, 2.4], [XQUA + 0.75, 0.85, -1.0], 44]]},
  {t0: TM.arrumar, set: 'qua', keys: [[TM.arrumar, [XQUA + 0.85, 1.25, 0.45], [XQUA + 1.5, 1.0, -1.55], 38], [TM.diga - 0.05, [XQUA + 0.88, 1.24, 0.3], [XQUA + 1.5, 1.0, -1.55], 36]]},
  {t0: TM.diga - 0.05, set: 'qua', keys: [[TM.diga - 0.05, [XQUA + 0.05, 0.95, 1.15], [XQUA, 0.82, -0.5], 38], [TM.fim, [XQUA + 0.05, 0.95, 0.85], [XQUA, 0.84, -0.5], 36]]},
];
const TREMORES = [[TM.empilhadas, 0.01], [TM.chiqueiro + 0.1, 0.012], [TM.sem2 + 0.1, 0.02], [TM.parou, 0.02], [TM.verde, 0.015], [TM.guerra, 0.02], [TM.nobel, 0.015], [TM.massa, 0.012], [TM.arrumar, 0.012]];
const TROCAS = PLANOS.filter((p, i) => i > 0 && p.set !== PLANOS[i - 1].set).map((p) => p.t0);
const camEm = (t) => {
  let pl = PLANOS[0]; for (const p of PLANOS) if (t >= p.t0) pl = p;
  const k = pl.keys; let i = 1; while (i < k.length - 1 && t > k[i][0]) i++;
  const [t0, p0, l0, f0] = k[i - 1], [t1, p1, l1, f1, ez] = k[i];
  const u = (ez || io)(cl((t - t0) / Math.max(1e-6, t1 - t0)));
  const pos = mix(p0, p1, u), look = mix(l0, l1, u);
  const d = Math.hypot(pos[0] - look[0], pos[1] - look[1], pos[2] - look[2]);
  let tr = 0; for (const [a, amp] of TREMORES) if (t > a && t < a + 0.6) tr += amp * Math.exp(-(t - a) * 7);
  const deriva = [Math.sin(t * 0.7) * 0.01 * d + Math.sin(t * 61) * tr, Math.sin(t * 0.9 + 1) * 0.005 * d + Math.cos(t * 53) * tr, 0];
  return {pos: add(pos, deriva), look, fov: lerp(f0, f1, u), d, set: pl.set};
};
const Cam = ({c}) => { const {camera} = useThree(); camera.position.set(...c.pos); camera.fov = c.fov; camera.near = 0.05; camera.far = 700; camera.updateProjectionMatrix(); camera.lookAt(...c.look); return null; };

// ---------- céu e luz ----------
const CEU = new THREE.ShaderMaterial({side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: 'varying vec3 vp; void main(){ vp = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  uniforms: {noite: {value: 0}}, fragmentShader: 'uniform float noite; varying vec3 vp; void main(){ float h = clamp(vp.y*1.5+0.05,0.0,1.0); vec3 c = mix(vec3(0.86,0.93,0.98), vec3(0.24,0.52,0.9), pow(h,0.6)); vec3 n = mix(vec3(0.62,0.45,0.78), vec3(0.18,0.16,0.42), pow(h,0.6)); gl_FragColor = vec4(mix(c, n, noite),1.0); }'});
const Ceu = ({c, noite = 0}) => { CEU.uniforms.noite.value = noite; return <mesh position={c.pos} material={CEU} renderOrder={-1}><sphereGeometry args={[650, 32, 16]} /></mesh>; };
const Sol = ({alvo, area, luz: kLuz = 1, dir = [-8, 6.4, 5]}) => {
  const k = Math.max(1, area / 4);
  const tgt = React.useMemo(() => new THREE.Object3D(), []);
  const luz = React.useMemo(() => { const l = new THREE.DirectionalLight('#FFE2B4', 2.7); l.castShadow = true; l.shadow.mapSize.set(2048, 2048); l.shadow.bias = -0.0004; l.shadow.normalBias = 0.02; l.target = tgt; return l; }, [tgt]);
  tgt.position.set(...alvo); tgt.updateMatrixWorld(true);
  luz.position.set(alvo[0] + dir[0] * k, alvo[1] + dir[1] * k, alvo[2] + dir[2] * k); luz.updateMatrixWorld(true);
  const sc = luz.shadow.camera; sc.left = -area; sc.right = area; sc.top = area; sc.bottom = -area; sc.near = 0.5; sc.far = area * 8 + 40; sc.updateProjectionMatrix();
  luz.shadow.needsUpdate = true; luz.intensity = 2.5 * kLuz;
  return (
    <>
      <hemisphereLight args={['#9D86EC', '#9A82B4', 1.1 * (0.35 + 0.65 * kLuz)]} />
      <primitive object={tgt} />
      <primitive object={luz} />
      <directionalLight position={[alvo[0] + 6, alvo[1] + 4, alvo[2] + 7]} intensity={0.55} color="#FFE6C2" />
    </>
  );
};

// ---------- cenas ----------

// ---------- pedaços comuns ----------
const PapeisCaindo = ({c, t, t0, n = 10, alt = 1.2, area = 1}) => { const u = t - t0; if (u < 0 || u > 2.5) return null; return <group position={c}>{Array.from({length: n}).map((_, i) => { const y = alt - (u * (0.55 + (i % 4) * 0.12) + (i % 3) * 0.1); if (y < 0.01) return null; return <Papel key={i} p={[Math.sin(i * 4.1) * area + Math.sin(u * 3 + i) * 0.12, y, Math.cos(i * 2.3) * area * 0.5]} rot={[Math.sin(u * 4 + i) * 0.6, i, Math.cos(u * 3 + i) * 0.6]} />; })}</group>; };
const Pessoa = ({P}) => P && P.vis !== false ? <Boneco pos={P.pos} ry={P.ry} c={P.c} /> : null;
const Pequeno = ({P, s = 0.72}) => { const rel = (m) => m ? [(m[0] - P.pos[0]) / s, (m[1] - P.pos[1]) / s, (m[2] - P.pos[2]) / s] : undefined; return <group position={P.pos} scale={s}><Boneco pos={[0, 0, 0]} ry={P.ry} c={{...P.c, mP: rel(P.c.mP), mN: rel(P.c.mN)}} /></group>; };
const Feixe = ({de, para, r = 0.5, k = 1}) => { if (k <= 0.01) return null; const a = new THREE.Vector3(...de), b = new THREE.Vector3(...para); const len = a.distanceTo(b); const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), b.clone().sub(a).normalize());
  return <mesh position={a.clone().add(b).multiplyScalar(0.5)} quaternion={q} material={MAT('feixe' + Math.round(k * 10), () => new THREE.MeshBasicMaterial({color: '#FFF3B0', transparent: true, opacity: 0.22 * Math.round(k * 10) / 10, depthWrite: false, side: THREE.DoubleSide}))}><cylinderGeometry args={[0.08, r, len, 20, 1, true]} /></mesh>; };

// ---------- cenas ----------
const CUP = [0.18, 0.86, -0.75];
const CenaLab = ({t}) => {
  const I = labEstado(t); const FL = fleming(t); const Cs = [0, 1, 2].map((k) => colega(t, k));
  const porco = kf(t, [[TM.chiqueiro + 0.1, 0], [TM.chiqueiro + 0.3, 1, back], [TM.so + 0.3, 1], [TM.so + 0.5, 0]]);
  const leao = t > TM.fleming3 && t < TM.so2 ? kf(t, [[TM.fleming3, 0], [TM.chamou + 0.2, 1]]) : 0;
  const fenoU = cl((t - TM.so2) / 1.6);
  return (
    <group>
      <Lab t={t} I={I} />
      {FL.vis && FL.pos[0] < XRUA - 10 ? <Boneco pos={FL.pos} ry={FL.ry} c={FL.c} /> : null}
      {FL.vis && FL.mala && FL.c.mN ? <Mala p={add(FL.c.mN, [0, -0.13, 0])} rot={[0, FL.ry, 0]} /> : null}
      {FL.vis && FL.placa && FL.pos[0] < XRUA - 10 ? <Petri p={add(FL.placa, [0, -0.01, 0])} k="fl" mofo={t > TM.pegou ? 1 : 0} limpo={t > TM.pegou ? 1 : 0} s={1.2} /> : null}
      {FL.frasco ? <group position={FL.frasco.p} rotation={FL.frasco.rot}><Frasco p={[0, -0.06, 0]} cor="#F2C94C" nivel={0.2} /></group> : null}
      {FL.frasco ? <><Gota id={31} p={add(FL.frasco.p, [0.14, -0.02, 0])} k={fx01(t, TM.fabricar + 0.1, 0.5)} s={0.06} /><Fumaca id={5} p={add(FL.frasco.p, [0.05, 0.1, 0])} k={fx01(t, TM.remedio, 0.8)} s={0.35} /></> : null}
      {Cs.map((C, k) => C.vis && C.pos[0] < XCOL - 5 ? <Boneco key={k} pos={C.pos} ry={C.ry} c={C.c} /> : null)}
      <Mosca p={[CUP[0] + Math.cos(t * 5) * 0.13, CUP[1] + 0.14 + Math.sin(t * 7) * 0.04, CUP[2] + Math.sin(t * 5) * 0.1]} t={t} />
      {porco > 0 ? <Porco p={[-0.75, -0.25 + porco * 0.25, -0.35]} ry={-1.1} s={1.1} t={t} boca={Math.sin(t * 20) > 0 ? 1 : 0.3} /> : null}
      {porco > 0 ? [0, 1, 2, 3].map((i) => <Papel key={'pp' + i} p={[-0.75 + Math.cos(i * 1.6) * 0.35 * porco, 0.02 + porco * (0.45 + i * 0.08), -0.35 + Math.sin(i * 1.6) * 0.3 * porco]} rot={[i, i * 2, porco * 2]} />) : null}
      <PapeisCaindo c={[0.75, 0, -1.9]} t={t} t0={TM.baguncado - 0.1} n={8} alt={1.5} area={0.5} />
      <PapeisCaindo c={[-0.3, 0, -0.2]} t={t} t0={TM.papel - 0.2} n={10} alt={0.9} area={0.6} />
      {t > TM.so2 && t < TM.nao + 0.2 ? <Feno p={[lerp(-2.4, 2.4, fenoU), 0.12 + Math.abs(Math.sin(fenoU * 12)) * 0.12, -0.3]} rot={-fenoU * 18} s={1.2} /> : null}
      <Feixe de={[-0.9, 2.3, -2.1]} para={[0.3, 1.0, -1.4]} r={0.6} k={leao} />
      <Halo p={[0.3, 1.86, -1.3]} k={leao} s={1.2} id={3} />
      {leao > 0 ? [0, 1, 2, 3].map((k) => <Brilho key={k} id={40 + k} p={[0.3 + Math.cos(k * 1.6) * 0.25, 1.86 + Math.sin(k * 1.6) * 0.2, -1.3]} k={fx01(t, TM.chamou + k * 0.15, 0.6)} s={0.2} />) : null}
      {t > TM.dez - 0.25 && t < TM.ate ? <Placa p={[-1.45, 1.05, -1.72]} rot={[-0.1, 0, 0]} txt={I.calTxt} w={0.3} h={0.22} fundo="#FFFFFF" tinta="#C0392B" moldura="#372C2E" /> : null}
      <Faisca id={6} p={[1.12, 1.05, -1.42]} k={fx01(t, TM.parou, 0.3)} s={0.4} />
    </group>
  );
};
const CenaPlaca = ({t}) => <PlacaGigante t={t} M={placaEstado(t)} />;
const CenaRua = ({t}) => {
  const FL = fleming(t); const mult = t < TM.londres ? MULT.map((m, i) => pessoaMult(t, m, i)) : [];
  return <Rua t={t} multidao={<>
    {mult.map((P, i) => P ? <Boneco key={i} pos={P.pos} ry={P.ry} c={P.c} /> : null)}
    {t < TM.londres ? <><Cx a={[0.5, 0.6, 0.5]} p={[XRUA, 0.3, 0.3]} m="#9A6A3E" line={0.8} /><Boneco pos={FL.pos} ry={FL.ry} c={FL.c} /><Petri p={FL.placa} k="ru" mofo={1} limpo={1} s={1.4} />
      <Halo p={add(FL.placa, [0, 0.05, 0])} k={0.7} s={0.9} id={4} /><Confete c={[XRUA, 0, 0.6]} t={t} t0={TM.salvou - 0.2} area={[3, 2.6, 1.6]} />
      {[0, 1, 2].map((i) => { const u = cl((t - TM.milhoes - i * 0.15) / 1.2); return u > 0 && u < 1 ? <group key={i} position={[XRUA + (i - 1) * 0.9, 1.4 + u * 1.2 - u * u * 0.6, 1.0]} rotation={[u * 6, 0, u * 4]}><Chapeu y={0} cor={['#3A3436', '#6A4022', '#2E4A6B'][i]} /></group> : null; })}</> : null}
  </>} />;
};
const CenaFab = ({t}) => {
  const Fo = oxford(t, 0), Ch = oxford(t, 1);
  return <group>
    <Fabrica t={t} />
    <Boneco pos={Fo.pos} ry={Fo.ry} c={Fo.c} /><Boneco pos={Ch.pos} ry={Ch.ry} c={Ch.c} />
    {Fo.papel ? <Placa p={Fo.papel} rot={[-0.3, Math.PI, 0]} txt={'FLEMING\n1929'} w={0.22} h={0.28} fundo="#FBF4E2" moldura={null} /> : null}
    <group position={Fo.pos}><Etiqueta txt="FLOREY" k={kf(t, [[TM.florey - 0.05, 0], [TM.florey + 0.15, 1, back]])} /></group>
    <group position={Ch.pos}><Etiqueta txt="CHAIN" k={kf(t, [[TM.chain - 0.05, 0], [TM.chain + 0.15, 1, back]])} /></group>
    {[Fo, Ch].map((P, k) => <Halo key={k} p={add(P.pos, [0, 1.12, 0.1])} k={P.c.acesa} s={1.0} id={10 + k} />)}
    <Faisca id={13} p={[XFAB, 1.6, -0.9]} k={fx01(t, TM.massa, 0.35)} s={0.4} />
  </group>;
};
const CenaGuerra = ({t}) => {
  const S = soldado(t), E = enfermeira(t);
  const sent = kf(t, [[TM.sentenca - 0.1, 0], [TM.sentenca + 0.1, 1, back]]); const carimbo = kf(t, [[TM.morte - 0.05, 2.2], [TM.morte + 0.1, 1, outQ]]);
  return <group>
    <Guerra t={t} />
    <Boneco pos={S.pos} ry={S.ry} c={S.c} />
    {t > TM.repente - 0.3 ? <Boneco pos={E.pos} ry={E.ry} c={{...E.c, pe: E.c.pe}} /> : null}
    {t > TM.repente - 0.3 ? <Seringa p={E.seringa} rot={[0, 0, 1.3]} s={1.1} /> : null}
    {S.braco ? <><Cx a={[0.06, 0.012, 0.012]} p={add(S.braco, [-0.04, 0.03, 0.02])} rot={[0, 0, 0.5]} m="#D8323C" line={0} />{S.verde ? <Halo p={add(S.braco, [-0.04, 0.03, 0.05])} k={0.5 + 0.3 * Math.sin(t * 10)} s={0.35} id={12} /> : null}</> : null}
    {sent > 0 && t < TM.mil2 ? <group position={[XGUE - 0.35, 1.7, 0.1]} scale={sent} rotation={[0, 0.2, -0.05]}><Placa p={[0, 0, 0]} txt={'SENTENÇA\nDE MORTE'} w={0.62} h={0.36} fundo="#FBF4E2" moldura="#8A5A34" />
      {t > TM.morte - 0.05 ? <group position={[0, 0, 0.02]} scale={carimbo} rotation={[0, 0, -0.25]}><Placa p={[0, 0, 0]} txt="CANCELADA" w={0.66} h={0.16} fundo="#D8323C" tinta="#FFFFFF" borda="#FFFFFF" moldura={null} /></group> : null}</group> : null}
    <Confete c={[XGUE - 0.2, 0, 0]} t={t} t0={TM.morte} area={[2.2, 2.2, 1.2]} n={40} />
    {/* o gato de capacete espiando atrás dos sacos */}
    {t > TM.sentenca - 0.5 ? <group position={[XGUE + 0.75, 0.17 + kf(t, [[TM.sentenca - 0.3, -0.15], [TM.sentenca, 0, back]]), 0.42]} scale={1.3}><CabGato p={[0, 0.06, 0]} rot={[0, 0, 0]} olhos={t > TM.morte ? 'grande' : 'normal'} t={t} /><group position={[0, 0.06, 0]} scale={0.45}><Capacete y={0.13} /></group></group> : null}
  </group>;
};
const CenaNobel = ({t}) => {
  const FL = fleming(t); const L = [laureado(t, 0), laureado(t, 1)];
  return <group>
    <Palco t={t} />
    <Boneco pos={FL.pos} ry={FL.ry} c={FL.c} />{L.map((P, k) => <Boneco key={k} pos={P.pos} ry={P.ry} c={P.c} />)}
    {FL.med > 0 ? [FL, ...L].map((P, k) => <Medalha key={k} p={PM(P.pos, P.ry, [0, 0.73, 0.165])} rot={[0.2, P.ry, 0]} s={FL.med} />) : null}
    {PLAT.map((p, i) => { const P = plateia(t, p, i); return <Boneco key={i} pos={P.pos} ry={P.ry} c={P.c} />; })}
    <Confete c={[XNOB, 0.4, -0.6]} t={t} t0={TM.nobel} area={[3, 2.4, 1.4]} />
    {[0, 1, 2, 3].map((k) => <Brilho key={k} id={60 + k} p={[XNOB - 0.9 + k * 0.6, 1.1 + (k % 2) * 0.2, -0.7]} k={fx01(t, TM.premio + k * 0.1, 0.6)} s={0.25} />)}
  </group>;
};
const CenaCol = ({t}) => {
  const Cs = [0, 1, 2].map((k) => colega(t, k)); const u = cl((t - TM.nenhuma) / 1.6);
  return <group>
    <LabLimpo t={t} />
    {Cs.map((C, k) => C.vis ? <Boneco key={k} pos={C.pos} ry={C.ry} c={C.c} /> : null)}
    {t > TM.nenhuma ? <Mosca p={[XCOL + lerp(-1.2, 1.6, u), 1.35 + Math.sin(t * 6) * 0.08, 0.2]} t={t} s={1.4} /> : null}
  </group>;
};
const CenaQuarto = ({t}) => {
  const K = crianca(t), M = mae(t);
  return <group>
    <Quarto t={t} />
    <Pequeno P={K} /><Petri p={K.placa} k="qu" mofo={1} s={1.1} />
    <Boneco pos={M.pos} ry={M.ry} c={M.c} />
    {[0, 1, 2].map((k) => <Brilho key={k} id={70 + k} p={add(K.placa, [Math.cos(k * 2.1) * 0.15, 0.1 + Math.sin(k * 2.1) * 0.08, 0.05])} k={fx01(t, TM.fazendo + k * 0.12, 0.6)} s={0.18} />)}
  </group>;
};
// ---------- legenda ----------
const GRUPOS = (() => { const g = []; let i = 0; while (i < PALAVRAS.length) { const a = PALAVRAS[i], l = a.w.replace(/[.,!?:"]/g, ''); if (l.length <= 2 && i + 1 < PALAVRAS.length && !/[.,!?:]$/.test(a.w)) { g.push({txt: a.w + ' ' + PALAVRAS[i + 1].w, s: a.s, e: PALAVRAS[i + 1].e}); i += 2; } else { g.push({txt: a.w, s: a.s, e: a.e}); i++; } } return g; })();
if (typeof document !== 'undefined' && !window.__montLE) {
  window.__montLE = true; const h = delayRender('fonte');
  window.__montLEp = new FontFace('MontLE', `url(${staticFile('Montserrat-Black.woff2')})`, {weight: '900'}).load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
}
const limpa = (x) => x.replace(/"/g, '').replace(/\.\.\.$/, '').replace(/:$/, '');
const Legenda = ({t}) => {
  let cur = null;
  for (let i = 0; i < GRUPOS.length; i++) { const nx = GRUPOS[i + 1]; const fim = nx ? Math.min(nx.s, GRUPOS[i].e + 0.6) : GRUPOS[i].e + 0.5; if (t >= GRUPOS[i].s - 0.02 && t < fim) cur = GRUPOS[i]; }
  if (!cur) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1300, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <span style={{fontFamily: 'MontLE', fontWeight: 900, fontSize: 80, color: '#fff', WebkitTextStroke: '14px #372C2E', paintOrder: 'stroke fill', textShadow: '0 5px 9px rgba(0,0,0,0.3)'}}>{limpa(cur.txt)}</span>
  </div>;
};


const ALVOS = {lab: [0, 0.6, -1], col: [XCOL, 0.6, -1], pl: [XPL - 0.3, 0, -0.4], rua: [XRUA, 1, -1], fab: [XFAB, 0.6, -0.8], gue: [XGUE, 0.5, -0.5], nob: [XNOB, 0.8, -0.8], qua: [XQUA, 0.5, -0.8]};
const AREAS = {lab: 3.2, col: 3.2, pl: 2, rua: 6, fab: 3.5, gue: 5, nob: 4, qua: 3.2};
export const Penicilina = () => {
  const [fonte, setFonte] = React.useState(fonteOk());
  React.useLayoutEffect(() => { if (fonte) return; const h = delayRender('fonte das placas'); (window.__montLEp || Promise.resolve()).then(() => document.fonts.load('900 40px MontLE')).then(() => { setFonte(true); continueRender(h); }).catch(() => { setFonte(true); continueRender(h); }); }, []);
  const t = useCurrentFrame() / 30;
  if (!fonte) return <AbsoluteFill style={{backgroundColor: '#D3E3F0'}} />;
  const c = camEm(t); const set = c.set;
  let chicote = 0; for (const tc of TROCAS) chicote += Math.max(0, Math.sin(cl((t - tc + 0.12) / 0.3) * Math.PI));
  const fora = set === 'rua' || set === 'gue' || set === 'nob';
  const tl = set === 'lab' && t > TM.semanas - 0.1 && t < TM.alguma; // time-lapse: dia e noite piscando
  const escuro = set === 'lab' && t > TM.nada && t < TM.volta - 0.1;
  const kLuz = tl ? (0.65 + 0.35 * Math.sin(t * 6)) : (escuro ? 0.4 : (set === 'pl' && t < TM.volta ? 0.6 : 1));
  const tinta = tl && t > TM.esfriou && t < TM.esquentou ? 'rgba(90,150,255,0.28)' : (tl && t > TM.esquentou ? 'rgba(255,150,60,0.25)' : (escuro ? 'rgba(20,20,60,0.25)' : null));
  const flash = Math.max(fx01(t, TM.parou, 0.25) > 0 ? 1 - fx01(t, TM.parou, 0.25) : 0, fx01(t, TM.circulo, 0.3) > 0 ? (1 - fx01(t, TM.circulo, 0.3)) * 0.6 : 0, fx01(t, TM.morte, 0.2) > 0 ? (1 - fx01(t, TM.morte, 0.2)) * 0.5 : 0);
  const vinheta = t > TM.parou && t < TM.tinha2 ? 1 : 0;
  return (
    <AbsoluteFill style={{backgroundColor: '#D3E3F0'}}>
      <Borrao k={chicote * 0.9} />
      <AbsoluteFill style={{filter: chicote > 0.02 ? 'url(#chicote)' : undefined}}>
        <ThreeCanvas width={1080} height={1920} dpr={IN.dpr || 2} shadows gl={{antialias: true}} camera={{fov: 50, position: [0, 2, 6]}}>
          <Cam c={c} />
          <fog attach="fog" args={[set === 'rua' ? '#C9CDD6' : (set === 'gue' ? '#D8C0A0' : '#E8DFD0'), set === 'rua' ? 7 : (fora ? 14 : 14), set === 'rua' ? 32 : (fora ? 60 : 40)]} />
          <Ceu c={c} noite={set === 'gue' ? 0.45 : (set === 'rua' ? 0.12 : 0)} />
          <Sol alvo={ALVOS[set]} area={AREAS[set]} luz={kLuz} dir={set === 'lab' ? [-6, 6.4, 6] : [-8, 6.4, 5]} />
          {set === 'lab' ? <CenaLab t={t} /> : null}
          {set === 'col' ? <CenaCol t={t} /> : null}
          {set === 'pl' ? <CenaPlaca t={t} /> : null}
          {set === 'rua' ? <CenaRua t={t} /> : null}
          {set === 'fab' ? <CenaFab t={t} /> : null}
          {set === 'gue' ? <CenaGuerra t={t} /> : null}
          {set === 'nob' ? <CenaNobel t={t} /> : null}
          {set === 'qua' ? <CenaQuarto t={t} /> : null}
          {IN.pos !== false ? <><Aquece /><PosToon dpr={IN.dpr || 2} dof={IN.dof !== false} ao={IN.ao !== false} foco={c.look} bokeh={fora && c.d > 4 ? 0.8 : 1.6} faixa={fora && c.d > 4 ? 6 : 2.4} longe={fora ? 80 : 40} sat={0.0} /></> : null}
        </ThreeCanvas>
      </AbsoluteFill>
      {tinta ? <AbsoluteFill style={{backgroundColor: tinta, mixBlendMode: 'multiply'}} /> : null}
      {vinheta ? <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(20,10,30,0.55) 100%)'}} /> : null}
      {flash > 0 ? <AbsoluteFill style={{backgroundColor: `rgba(255,255,255,${flash * 0.8})`}} /> : null}
      {IN.semLegenda ? null : <Legenda t={t} />}
    </AbsoluteFill>
  );
};
