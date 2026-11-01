
// ---------- gato do laboratório (figurante que volta no fim) ----------
const LAR = '#EE9440', LAR2 = '#C9702A';
const OlhoGato = ({x, tipo, olhar = [0, 0]}) => {
  if (tipo === 'fechado') return <mesh position={[x, 0.006, 0.066]} rotation={[0, x * 6, Math.PI]} material={B(LINHA)}><torusGeometry args={[0.016, 0.0045, 6, 12, Math.PI]} /></mesh>;
  const R = tipo === 'grande' ? 0.026 : 0.02;
  return (
    <group position={[x, 0.012, 0.06]} rotation={[0, x * 7, 0]}>
      <Esf r={R} s={[1, 1.1, 0.45]} m={T(tipo === 'grande' ? '#FFFFFF' : '#D9F27A')} line={0.45} sombra={false} seg={14} />
      <mesh position={[olhar[0] * R * 0.4, olhar[1] * R * 0.3, R * 0.45]} scale={[tipo === 'grande' ? 1 : 0.35, 1, 1]} material={B(LINHA)}><sphereGeometry args={[R * (tipo === 'grande' ? 0.35 : 0.75), 10, 8]} /></mesh>
      {tipo === 'bravo' || tipo === 'semi' ? <mesh position={[0, R * 0.55, R * 0.3]} rotation={[0, 0, (x > 0 ? -1 : 1) * (tipo === 'bravo' ? 0.45 : 0)]} scale={[1.2, 0.6, 0.6]} material={T(LAR)}><sphereGeometry args={[R, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh> : null}
    </group>
  );
};
const CabGato = ({p, rot = [0, 0, 0], olhos = 'normal', olhoD, eriça = 0, boca = 'w', t = 0}) => (
  <group position={p} rotation={rot}>
    <Esf r={0.07} s={[1.12, 0.92, 0.95]} m={LAR} line={0.8} seg={20} />
    {[-1, 1].map((l) => <group key={l} position={[l * 0.045, 0.055, -0.005]} rotation={[0, 0, -l * (0.35 + eriça * 0.25)]}><Co r={0.026} h={0.055} p={[0, 0.02, 0]} m={LAR} seg={10} line={0.6} /><Co r={0.014} h={0.03} p={[0, 0.018, 0.012]} m="#F6B9A8" seg={8} line={0} /></group>)}
    <Esf r={0.032} p={[0, -0.025, 0.045]} s={[1.3, 0.75, 0.7]} m="#FFF4E6" line={0.4} seg={12} />
    <OlhoGato x={0.03} tipo={olhoD || olhos} /><OlhoGato x={-0.03} tipo={olhos} />
    <Esf r={0.009} p={[0, -0.012, 0.074]} m="#E06A7A" line={0.3} seg={8} />
    {boca === 'w' ? [-1, 1].map((l) => <mesh key={'b' + l} position={[l * 0.008, -0.026, 0.07]} rotation={[0, 0, Math.PI]} material={B(LINHA)}><torusGeometry args={[0.008, 0.0028, 4, 8, Math.PI]} /></mesh>)
      : <mesh position={[0, -0.03, 0.07]} scale={[1, 1.3, 1]} material={B('#5A2328')}><circleGeometry args={[0.012, 12]} /></mesh>}
    {[-1, 1].map((l) => [0.006, -0.008].map((dy, j) => <Linha key={l + '' + j} a={[l * 0.03, -0.02 + dy, 0.06]} b={[l * (0.1 + eriça * 0.02), -0.012 + dy * 2.2 + eriça * 0.01, 0.05]} r={0.0018} sombra={false} />))}
  </group>
);
const Rabo = ({pts, r = 0.018}) => { const geo = React.useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((v) => new THREE.Vector3(...v))), 20, r, 8, false), [JSON.stringify(pts)]); return <Tn geo={geo} m={LAR} line={0.6} />; };
const Gato = ({pos, ry = 0, pose = 'dorme', olhos = 'fechado', olhoD, t = 0, eriça = 0, bal = 0, s = 1, resp = 0}) => {
  const r = 1 + 0.03 * Math.sin(t * 2.2);
  return (
    <group position={pos} rotation={[0, ry, bal]} scale={s}>
      {pose === 'dorme' ? <>
        <Esf r={0.12} p={[0, 0.07, 0]} s={[1.25, 0.6 * r, 0.95]} m={LAR} line={0.9} seg={24} />
        {[-0.05, 0.02, 0.09].map((x, i) => <mesh key={i} position={[x, 0.142 * r, -0.01]} rotation={[0.1, 0, 0.2]} scale={[0.35, 0.12, 1]} material={T(LAR2)}><sphereGeometry args={[0.05, 10, 6]} /></mesh>)}
        <CabGato p={[0.11, 0.075, 0.08]} rot={[0.15, 0.5, -0.25]} olhos={olhos} olhoD={olhoD} t={t} />
        <Rabo pts={[[-0.14, 0.04, -0.02], [-0.15, 0.03, 0.08], [-0.06, 0.025, 0.14], [0.04, 0.025, 0.15]]} />
        {[[0.07, 0.11], [0.0, 0.12]].map(([x, z], i) => <Esf key={'p' + i} r={0.024} p={[x, 0.02, z]} s={[1.3, 0.7, 1]} m={LAR} line={0.5} seg={10} />)}
      </> : null}
      {pose === 'pendura' ? <>
        {[-1, 1].map((l) => <Linha key={'b' + l} a={[l * 0.04, -0.07, 0.01]} b={[l * 0.03, 0.02, 0.0]} r={0.012} cor={LAR} />)}
        {[-1, 1].map((l) => <Esf key={'pm' + l} r={0.018} p={[l * 0.03, 0.025, 0.005]} m={LAR} line={0.5} seg={10} />)}
        <Esf r={0.1} p={[0, -0.2, 0]} s={[0.85, 1.35 * r, 0.8]} m={LAR} line={0.9} seg={22} />
        <Esf r={0.06} p={[0, -0.2, 0.05]} s={[0.8, 1.3, 0.6]} m="#FFF4E6" line={0} seg={14} />
        <CabGato p={[0, -0.055, 0.035]} rot={[0.1, 0, 0]} olhos={olhos} olhoD={olhoD} eriça={eriça} boca="o" t={t} />
        {[-1, 1].map((l) => <Linha key={'pe' + l} a={[l * 0.05, -0.3, 0]} b={[l * 0.06 + Math.sin(t * 5 + l) * 0.01, -0.39, 0.02]} r={0.013} cor={LAR} />)}
        <Rabo pts={[[0, -0.3, -0.06], [0.04, -0.4, -0.08], [0.0, -0.48, -0.04 + Math.sin(t * 4) * 0.02], [-0.04, -0.52, 0.0]]} />
        {eriça > 0 ? Array.from({length: 10}).map((_, i) => { const a = i / 10 * Math.PI * 2; return <Co key={'e' + i} r={0.015} h={0.05 * eriça} p={[Math.cos(a) * 0.088, -0.2 + Math.sin(a) * 0.13, -0.01]} rot={[0, 0, a - Math.PI / 2]} m={LAR} seg={6} line={0.4} />; }) : null}
      </> : null}
      {pose === 'salto' ? <>
        <Esf r={0.1} p={[0, 0, 0]} s={[0.8, 1.6, 0.8]} rot={[0, 0, 0.15]} m={LAR} line={0.9} seg={22} />
        <CabGato p={[0.02, 0.17, 0.03]} rot={[0.2, 0, 0.1]} olhos="grande" eriça={1} boca="o" t={t} />
        {[-1, 1].map((l) => <Linha key={'a' + l} a={[l * 0.05, 0.08, 0.01]} b={[l * 0.1, 0.2, 0.02]} r={0.012} cor={LAR} />)}
        {[-1, 1].map((l) => <Linha key={'c' + l} a={[l * 0.05, -0.12, 0]} b={[l * 0.08, -0.24, 0.02]} r={0.013} cor={LAR} />)}
        <Rabo pts={[[0, -0.14, -0.05], [0.03, -0.25, -0.08], [0.0, -0.33, -0.05]]} />
        {Array.from({length: 12}).map((_, i) => { const a = i / 12 * Math.PI * 2; return <Co key={'e' + i} r={0.016} h={0.06} p={[Math.cos(a) * 0.08, Math.sin(a) * 0.16, -0.01]} rot={[0, 0, a - Math.PI / 2]} m={LAR} seg={6} line={0.4} />; })}
      </> : null}
    </group>
  );
};
