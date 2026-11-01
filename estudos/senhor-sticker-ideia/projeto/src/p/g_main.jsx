
// ---------- câmera ----------
const TG = TM.gato - 0.15;
const PLANOS = [
  {t0: 0, set: 'ofi', keys: [[0, [0.0, 1.02, 2.5], [0, 0.74, 0], 46], [TM.acordar, [0.02, 1.02, 2.15], [0, 0.78, 0], 46], [TM.funciona - 0.02, [0.0, 1.05, 1.95], [0, 0.85, 0], 46]]},
  {t0: TM.funciona, set: 'ofi', keys: [[TM.funciona, [0.05, 1.5, 3.6], [-0.42, 0.72, 0.15], 52], [TM.pratos + 0.4, [-0.05, 1.38, 3.4], [-0.38, 0.62, 0.15], 52], [TM.cima + 0.3, [0.0, 1.35, 3.3], [-0.22, 0.75, 0.05], 50], [TM.cada, [0.15, 1.2, 2.6], [0, 0.75, 0], 46], [TM.agora - 0.05, [0.05, 1.12, 2.0], [0, 0.88, 0], 44]]},
  {t0: TM.agora, set: 'ofi', keys: [[TM.agora, [0.32, 1.15, 2.0], [0.0, 0.95, 0.05], 40], [TM.mao2 - 0.05, [0.25, 1.12, 1.75], [0, 0.93, 0.05], 40]]},
  {t0: TM.mao2, set: 'ofi', keys: [[TM.mao2, [0.95, 0.68, 0.95], [0.42, 0.48, 0.12], 38], [TM.despencam, [0.9, 0.6, 0.85], [0.42, 0.42, 0.12], 38], [TM.pratos2, [0.85, 0.35, 0.85], [0.42, 0.15, 0.12], 40], [TM.barulhao - 0.02, [0.86, 0.33, 0.88], [0.42, 0.14, 0.12], 40]]},
  {t0: TM.barulhao, set: 'ofi', keys: [[TM.barulhao, [0.25, 1.35, 3.4], [0.25, 1.2, 0], 52], [TM.hora + 0.5, [0.2, 1.3, 3.1], [0.25, 1.2, 0], 52]]},
  {t0: TM.parece, set: 'ofi', keys: [[TM.parece, [0.95, 1.5, 1.75], [0.56, 2.0, 0.4], 46], [TM.mas - 0.02, [0.9, 1.55, 1.55], [0.56, 2.0, 0.4], 46]]},
  {t0: TM.mas, set: 'ofi', keys: [[TM.mas, [-0.55, 1.25, 1.25], [-0.92, 1.0, -1.1], 46], [TM.e1 - 0.02, [-0.62, 1.2, 1.0], [-0.92, 1.02, -1.1], 46]]},
  {t0: TM.e1, set: 'dali', keys: [[TM.e1, [XD + 0.25, 1.05, 2.4], [XD + 0.1, 0.75, 0], 46], [TM.chave - 0.1, [XD + 0.15, 1.0, 2.0], [XD + 0.15, 0.75, 0], 46], [TM.porque - 0.02, [XD + 0.12, 0.98, 1.85], [XD + 0.15, 0.75, 0], 46]]},
  {t0: TM.porque, set: 'predio', keys: [[TM.porque, [XP + 0.3, 2.8, 10.5], [XP + 0.3, 2.7, 0], 46], [TM.sono2, [XP + 0.3, 2.3, 9.5], [XP + 0.3, 2.2, 0], 46], [TM.cerebro, [XP + 0.3, 3.4, 10.2], [XP + 0.3, 3.2, 0], 46], [TM.andar, [XP + 0.5, 2.6, 7.5], [XP + 0.6, 2.4, 0], 46], [TM.esquisito + 0.3, [XP + 0.65, 2.7, 6.9], [XP + 0.65, 2.55, 0], 46], [TM.ali - 0.02, [XP + 0.6, 2.68, 6.4], [XP + 0.6, 2.55, 0], 46]]},
  {t0: TM.ali, set: 'predio', keys: [[TM.ali, [XP + 0.2, 2.5, 3.6], [XP + 0.05, 2.38, 0.1], 44], [TM.acordado - 0.02, [XP + 0.3, 2.5, 3.3], [XP + 0.15, 2.4, 0.1], 44]]},
  {t0: TM.acordado, set: 'predio', keys: [[TM.acordado, [XP - 0.15, 4.0, 3.3], [XP - 0.25, 3.85, 0], 44], [TM.normal - 0.02, [XP - 0.2, 3.98, 3.0], [XP - 0.28, 3.85, 0], 44]]},
  {t0: TM.normal, set: 'predio', keys: [[TM.normal, [XP + 1.0, 3.6, 6.5], [XP + 1.0, 3.6, 0], 46], [TM.descer, [XP + 1.0, 3.5, 6.5], [XP + 1.0, 3.5, 0], 46], [TM.tudo + 0.3, [XP + 0.9, 1.2, 6.2], [XP + 0.9, 0.8, 0], 46], [TM.estrondo - 0.12, [XP + 0.85, 1.1, 5.6], [XP + 0.9, 0.8, 0], 46]]},
  {t0: TM.estrondo - 0.1, set: 'ofi', keys: [[TM.estrondo - 0.1, [0.85, 0.4, 0.85], [0.42, 0.2, 0.12], 40], [TM.puxa - 0.02, [0.83, 0.36, 0.82], [0.42, 0.15, 0.12], 40]]},
  {t0: TM.puxa, set: 'predio', keys: [[TM.puxa, [XP + 0.9, 1.1, 5.6], [XP + 0.9, 1.0, 0], 46], [TM.meio2, [XP + 1.15, 2.45, 5.0], [XP + 1.25, 2.3, 0], 46], [TM.acorda2 - 0.02, [XP + 1.1, 2.45, 4.5], [XP + 1.25, 2.35, 0], 44]]},
  {t0: TM.acorda2, set: 'ofi', keys: [[TM.acorda2, [0.15, 1.2, 2.2], [0.05, 0.95, 0], 44], [TM.nao - 0.05, [0.12, 1.15, 2.0], [0.05, 0.9, 0], 44], [TM.nao + 0.3, [0.5, 0.7, 1.6], [0.5, 0.2, 0.1], 44], [TM.em - 0.02, [0.55, 0.62, 1.45], [0.6, 0.15, 0.1], 44]]},
  {t0: TM.em, set: 'lab', keys: [[TM.em, [XL - 0.25, 2.15, 1.2], [XL - 0.2, 1.62, -2.2], 40], [TM.cientistas, [XL - 0.1, 1.55, 3.0], [XL, 0.85, -0.6], 48], [TM.sentada, [XL + 0.1, 1.45, 3.4], [XL, 0.8, -0.6], 50], [TM.quem - 0.02, [XL, 1.4, 3.3], [XL, 0.8, -0.6], 50]]},
  {t0: TM.quem, set: 'lab', keys: [[TM.quem, [XL - 0.4, 1.2, 2.5], [XL - 0.75, 0.82, 0.2], 44], [TM.tres - 0.02, [XL - 0.45, 1.18, 2.25], [XL - 0.75, 0.84, 0.2], 44]]},
  {t0: TM.tres, set: 'lab', keys: [[TM.tres, [XL + 0.45, 1.25, 3.1], [XL + 1.25, 1.15, 0.9], 44], [TM.truque - 0.02, [XL + 0.52, 1.25, 2.85], [XL + 1.25, 1.17, 0.9], 44]]},
  {t0: TM.truque, set: 'lab', keys: [[TM.truque, [XL - 0.4, 1.25, 2.4], [XL - 0.72, 0.98, 0.2], 44], [TM.ja - 0.02, [XL - 0.45, 1.22, 2.2], [XL - 0.72, 0.98, 0.2], 44]]},
  {t0: TM.ja, set: 'lab', keys: [[TM.ja, [XL + 0.25, 1.15, 2.1], [XL + 0.78, 0.78, 0.2], 44], [TG - 0.02, [XL + 0.3, 1.12, 1.85], [XL + 0.78, 0.8, 0.2], 44]]},
  {t0: TG, set: 'ofi', keys: [[TG, [0.85, 0.55, 1.25], [0.45, 0.2, 0.12], 42], [TM.prato + 0.2, [0.8, 0.6, 1.35], [0.42, 0.25, 0.1], 42], [TM.prato + 0.9, [0.75, 0.9, 2.5], [0.6, 0.55, 0.15], 48], [71, [0.58, 0.97, 2.4], [0.32, 0.57, 0.05], 46]]},
];
const TREMORES = [[TM.pratos2, 0.025], [TM.barulhao, 0.03], [TM.estrondo, 0.03], [TM.chave + 0.22, 0.012], [TM.cima, 0.015]];
const camEm = (t) => {
  let pl = PLANOS[0]; for (const p of PLANOS) if (t >= p.t0) pl = p;
  const k = pl.keys; let i = 1; while (i < k.length - 1 && t > k[i][0]) i++;
  const [t0, p0, l0, f0] = k[i - 1], [t1, p1, l1, f1] = k[i];
  const u = io(cl((t - t0) / Math.max(1e-6, t1 - t0)));
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
const CenaOficina = ({t}) => {
  const I = inventorOfi(t); const [bR, bL] = bolasOfi(t, I); const P = pratosOfi(t); const Po = poltronaOfi(t); const G = gatoOfi(t);
  const pulo = Math.max(0, 1 - Math.abs(t - TM.barulhao - 0.2) * 2.5);
  const cab = cabDe(I.pos, 1);
  const brilho = (t0, d = 0.5) => fx01(t, t0 - 0.04, d);
  return (
    <group>
      <Oficina t={t} pulo={pulo} balLum={G.balLum || 0} />
      <Poltrona p={[0, Po.y, 0]} esmaga={Po.es} />
      {P.map(([x, y, z, tr], i) => <Prato key={i} p={[x, y, z]} tr={tr} />)}
      <Boneco pos={I.pos} ry={I.ry} c={I.c} />
      <Halo p={[cab[0], cab[1], cab[2] + 0.05]} k={I.c.acesa} s={1.1} id={1} />
      {I.c.acesa > 0.5 && t < TM.funciona ? [0, 1, 2, 3].map((k) => <Brilho key={k} id={20 + k} p={[cab[0] + Math.cos(k * 1.6) * 0.3, cab[1] + Math.sin(k * 1.6) * 0.25, cab[2] + 0.1]} k={fx01(t, TM.genio + k * 0.12, 0.6)} s={0.18} />) : null}
      <Zzz p={cab} t={t} k={I.zz} id={1} s={0.1 * (I.zz > 1 ? 1.4 : 1)} />
      {bR ? <Bola p={bR} /> : null}{bL ? <Bola p={bL} /> : null}
      <Brilho id={2} p={bR ? add(bR, [0.02, 0.03, 0.05]) : [0, -9, 0]} k={Math.max(brilho(TM.bolas), brilho(TM.cada), brilho(TM.aco))} s={0.22} />
      <Brilho id={3} p={bL ? add(bL, [0.02, 0.03, 0.05]) : [0, -9, 0]} k={Math.max(brilho(TM.aco), brilho(TM.mao))} s={0.22} />
      {/* estrondo: faísca e onda nos dois pratos */}
      {[TM.pratos2, TM.estrondo].map((t0, j) => [0.42, -0.42].map((x, i) => <group key={j + '' + i}><Faisca id={4 + i + j * 2} p={[x * (j ? 1.1 : 1), 0.1, 0.16]} k={fx01(t, t0, 0.3)} s={0.45} /><Onda p={[x, 0.02, 0.12]} k={fx01(t, t0, 0.45)} r={0.6} id={i + j * 2} /></group>))}
      <Faisca id={9} p={[0.45, 0.24, 0.16]} k={fx01(t, TM.metal, 0.25) + fx01(t, TM.chao, 0.01) * 0} s={0.3} />
      <Gota id={1} p={[cab[0] + 0.2, cab[1] + 0.12, cab[2] + 0.12]} k={fx01(t, TM.barulhao + 0.4, 0.7) + fx01(t, TM.pesada + 0.1, 0.7)} />
      <Gato pos={G.pos} ry={G.ry} pose={G.pose} olhos={G.olhos} olhoD={G.olhoD} t={t} eriça={G.eriça || 0} bal={G.bal || 0} s={(G.s || 1)} />
      {t > TG ? <Velocidade id={3} p={[0.6, 0.4, 0.2]} k={0} /> : null}
      {I.c.acesa > 0.02 && t > TM.acorda2 && t < TG ? <Invencao p={add(I.c.mP, [0, 0.08, 0])} s={0.55} gira={t * 9} /> : null}
      {t > TM.cima - 0.05 && t < TM.cima + 0.4 ? [0, 1, 2].map((k) => <Nuvem key={k} id={40 + k} p={[-0.4 + k * 0.4, 0.1, 0.35]} s={0.35 * (1 + (t - TM.cima) * 2)} />) : null}
    </group>
  );
};
const CenaDali = ({t}) => {
  const D = daliF(t);
  return (
    <group>
      <Atelie t={t} />
      <Poltrona p={[XD, 0, 0]} cor="#C99A3A" cor2="#B6862C" />
      <Prato p={[XD + 0.44, 0, 0.12]} tr={settle(t, TM.chave + 0.22, 1, 30, 4)} />
      <Boneco pos={D.pos} c={D.c} />
      <Chave p={D.chave} rot={D.chaveRot} s={1.1} />
      <Brilho id={11} p={add(D.chave, [0.03, -0.02, 0.06])} k={fx01(t, TM.chave - 0.05, 0.5)} s={0.25} />
      <Faisca id={12} p={[XD + 0.44, 0.08, 0.16]} k={fx01(t, TM.chave + 0.22, 0.3)} s={0.35} />
      <Onda p={[XD + 0.44, 0.02, 0.12]} k={fx01(t, TM.chave + 0.22, 0.45)} r={0.5} id={8} />
      {/* pincel na outra mão */}
      <Linha a={D.c.mN} b={add(D.c.mN, [-0.05, 0.22, 0.02])} r={0.008} cor="#8A5A34" /><Esf r={0.018} p={add(D.c.mN, [-0.055, 0.24, 0.02])} s={[1, 1.6, 1]} m="#D8323C" line={0.4} seg={8} />
    </group>
  );
};
const CenaPredio = ({t}) => {
  const S = sonhador(t); const O = objsSonho(t); const A = acordadoTopo(t);
  const luzTopo = kf(t, [[TM.cerebro - 0.05, 0], [TM.cerebro + 0.12, 1, outQ], [TM.andar - 0.2, 1], [TM.andar + 0.2, 0.15]]);
  const yc = cyElev(t);
  const M = [XP - 0.2, H_AND + 0.72, 0.2];
  const placaFx = (t0) => fx01(t, t0 - 0.04, 0.6);
  return (
    <group>
      <Predio t={t} yc={yc} objs={O.objs} merge={O.merge} luzTopo={luzTopo} />
      <Elevador p={[XP + 1.65, yc, 0]} />
      <group position={S.pos} scale={S.S}><Boneco pos={[0, 0, 0]} c={S.c} /></group>
      <Halo p={add(cabDe(S.pos, S.S), [0, 0, 0.1])} k={S.acesa} s={0.9} id={2} />
      <Zzz p={cabDe(S.pos, S.S)} t={t} k={t > TM.tudo - 0.1 && t < TM.estrondo ? 1 : 0} id={2} />
      <Boneco pos={A.pos} c={A.c} />
      {/* brilho nas placas quando o andar é dito */}
      <Brilho id={13} p={[XP - 0.45, 1.3, -0.7]} k={placaFx(TM.sono2)} s={0.4} />
      <Brilho id={14} p={[XP - 0.45, H_AND + 1.3, -0.7]} k={placaFx(TM.hipnagogia)} s={0.45} />
      <Brilho id={15} p={[XP - 0.45, 2 * H_AND + 1.3, -0.7]} k={placaFx(TM.acordado)} s={0.4} />
      {/* a junção: puf de nuvem e faísca */}
      {O.poof && t < TM.ideias + 0.5 ? [0, 1, 2, 3].map((k) => <Nuvem key={k} id={60 + k} p={add(M, [Math.cos(k * 1.57) * 0.12, Math.sin(k * 1.57) * 0.1, 0.05])} s={0.35 * (0.6 + (t - TM.ideias) * 3) * (1 - cl((t - TM.ideias - 0.3) / 0.2))} />) : null}
      <Faisca id={16} p={add(M, [0, 0, 0.1])} k={fx01(t, TM.ideias, 0.3)} s={0.5} />
      {/* esquecer: as ideias somem em fumaça */}
      {[[-0.3, H_AND + 1.12, -0.35], [0.75, H_AND + 1.02, -0.45], [-0.95, H_AND + 1.2, -0.5], [0.15, H_AND + 0.95, 0.2]].map((p, k) => <Fumaca key={k} id={k} p={add([XP, 0, 0], p)} k={fx01(t, TM.esquecer + k * 0.06, 0.6)} s={0.4} />)}
      <Velocidade id={17} p={[XP + 1.65, yc + 1.0, 0.45]} k={(t > TM.descer + 0.1 && t < TM.tudo - 0.2) || (t > TM.puxa && t < TM.puxa + 0.45) ? (t * 5) % 1 : 0} s={0.7} rot={Math.PI / 2} />
      <Estrelas t={t} />
      {[[-5, 1, -6, 4], [5.5, 2, -6, 4.5], [-5, 5, -4, 3], [5, 6, -5, 3.5], [0, -4, -8, 6]].map(([x, y, z, s], i) => <Nuvem key={'nb' + i} id={70 + i} p={[XP + x, y, z]} s={s} />)}
    </group>
  );
};
const CenaLab = ({t}) => {
  const Vs = VOL.map((_, i) => voluntario(t, i)); const C0 = cientista(t, 0), C1 = cientista(t, 1);
  const luzes = [kf(t, [[TM.tres, 0], [TM.tres + 0.12, 1]]), kf(t, [[TM.vezes, 0], [TM.vezes + 0.12, 1]]), kf(t, [[TM.mais, 0], [TM.mais + 0.12, 1]])];
  const nPl = t > TM.chance - 0.05 ? 4 : 0;
  return (
    <group>
      <Laboratorio t={t} />
      {Vs.map((V, i) => <group key={i}>
        <CadeiraLab p={[VOL[i].x, 0, VOL[i].z]} />
        <Boneco pos={V.pos} c={V.c} />
        <Garrafa p={V.garrafa.p} rot={V.garrafa.rot} />
        <Zzz p={cabDe(V.pos)} t={t} k={V.zz} id={10 + i} s={i === 2 ? 0.16 : 0.09} />
        <Halo p={add(cabDe(V.pos), [0, 0, 0.1])} k={V.acesa} s={1.0} id={10 + i} />
      </group>)}
      {[0, 1, 2, 3].map((k) => <Brilho key={k} id={50 + k} p={add(cabDe(Vs[0].pos), [Math.cos(k * 1.6 + 0.4) * 0.3, Math.sin(k * 1.6 + 0.4) * 0.26, 0.12])} k={fx01(t, TM.truque + k * 0.1, 0.6)} s={0.2} />)}
      <Fumaca id={9} p={add(cabDe(Vs[2].pos), [0, 0.18, 0])} k={fx01(t, TM.efeito - 0.1, 1.0)} s={0.35} />
      {[C0, C1].map((C, k) => <group key={'c' + k}><Boneco pos={C.pos} ry={C.ry} c={C.c} /><Cx a={[0.16, 0.22, 0.015]} p={C.prancheta} rot={[-0.5, C.ry, 0]} m="#C9A57A" line={0.5} /></group>)}
      <Placar p={[XL + 1.25, 0, 0.9]} rot={-0.35} n={nPl} luzes={luzes} />
      <Brilho id={55} p={[XL + 1.25 + 0.1, 1.05, 1.05]} k={fx01(t, TM.chance - 0.04, 0.6)} s={0.4} />
      <Brilho id={56} p={[XL - 0.05, 2.0, -2.1]} k={fx01(t, TM.paris - 0.04, 0.6)} s={0.35} />
    </group>
  );
};

// ---------- legenda ----------
const GRUPOS = (() => { const g = []; let i = 0; while (i < PALAVRAS.length) { const a = PALAVRAS[i], l = a.w.replace(/[.,!?:]/g, ''); if (l.length <= 2 && i + 1 < PALAVRAS.length && !/[.,!?:]$/.test(a.w)) { g.push({txt: a.w + ' ' + PALAVRAS[i + 1].w, s: a.s, e: PALAVRAS[i + 1].e}); i += 2; } else { g.push({txt: a.w, s: a.s, e: a.e}); i++; } } return g; })();
if (typeof document !== 'undefined' && !window.__montLE) {
  window.__montLE = true; const h = delayRender('fonte');
  new FontFace('MontLE', `url(${staticFile('Montserrat-Black.woff2')})`, {weight: '900'}).load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
}
const limpa = (x) => x.replace(/\.\.\.$/, '').replace(/:$/, '');
const Legenda = ({t}) => {
  let cur = null;
  for (let i = 0; i < GRUPOS.length; i++) { const nx = GRUPOS[i + 1]; const fim = nx ? Math.min(nx.s, GRUPOS[i].e + 0.6) : GRUPOS[i].e + 0.5; if (t >= GRUPOS[i].s - 0.02 && t < fim) cur = GRUPOS[i]; }
  if (!cur) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1300, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <span style={{fontFamily: 'MontLE', fontWeight: 900, fontSize: 80, color: '#fff', WebkitTextStroke: '14px #372C2E', paintOrder: 'stroke fill', textShadow: '0 5px 9px rgba(0,0,0,0.3)'}}>{limpa(cur.txt)}</span>
  </div>;
};

export const Ideia = () => {
  const t = useCurrentFrame() / 30;
  const c = camEm(t);
  const set = c.set;
  const chicote = Math.max(0, Math.sin(cl((t - TM.e1 + 0.12) / 0.3) * Math.PI)) + Math.max(0, Math.sin(cl((t - TM.em + 0.12) / 0.3) * Math.PI));
  const ALVO = {ofi: [0, 0.4, 0], dali: [XD, 0.4, 0], predio: [XP + 0.3, 2.4, 0], lab: [XL, 0.4, -0.5]}[set];
  const AREA = {ofi: 3.6, dali: 3, predio: 4.5, lab: 3.8}[set];
  const fora = set === 'predio';
  return (
    <AbsoluteFill style={{backgroundColor: '#D3E3F0'}}>
      <Borrao k={chicote * 0.9} />
      <AbsoluteFill style={{filter: chicote > 0.02 ? 'url(#chicote)' : undefined}}>
        <ThreeCanvas width={1080} height={1920} dpr={IN.dpr || 2} shadows gl={{antialias: true}} camera={{fov: 50, position: [0, 2, 6]}}>
          <Cam c={c} />
          <fog attach="fog" args={['#E8DFD0', fora ? 30 : 14, fora ? 90 : 40]} />
          <Ceu c={c} noite={fora ? 0.62 : 0} />
          <Sol alvo={ALVO} area={AREA} luz={fora ? 0.8 : 1} dir={set === 'predio' ? [-6, 6.4, 8] : [-8, 6.4, 5]} />
          {set === 'ofi' ? <CenaOficina t={t} /> : null}
          {set === 'dali' ? <CenaDali t={t} /> : null}
          {set === 'predio' ? <CenaPredio t={t} /> : null}
          {set === 'lab' ? <CenaLab t={t} /> : null}
          {IN.pos !== false ? <><Aquece /><PosToon dpr={IN.dpr || 2} dof={IN.dof !== false} ao={IN.ao !== false} foco={c.look} bokeh={fora && c.d > 6 ? 0.8 : 1.6} faixa={fora && c.d > 6 ? 8 : 2.6} longe={fora ? 120 : 40} sat={0.0} /></> : null}
        </ThreeCanvas>
      </AbsoluteFill>
      {IN.semLegenda ? null : <Legenda t={t} />}
    </AbsoluteFill>
  );
};
