
// ================= vídeo 3: atuação =================
const PM = (pos, ry, v) => [pos[0] + v[0] * Math.cos(ry) + v[2] * Math.sin(ry), pos[1] + v[1], pos[2] - v[0] * Math.sin(ry) + v[2] * Math.cos(ry)];
const passo = (t, k = 1, vel = 9) => (l) => { const f = Math.sin(t * vel + (l > 0 ? 0 : Math.PI)); return [l * 0.075, 0.03 + Math.max(0, f) * 0.06 * k, 0.005 + f * 0.1 * k]; };
const quica = (t, k = 1, vel = 9) => Math.abs(Math.sin(t * vel)) * 0.025 * k;
const caminho = (t, pts) => { // pts: [t, [x,y,z], ry]; devolve pos, ry e se está andando
  if (t <= pts[0][0]) return {pos: pts[0][1], ry: pts[0][2], anda: 0};
  for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [t0, p0, r0] = pts[i - 1], [t1, p1, r1] = pts[i]; const u = cl((t - t0) / (t1 - t0)); const mov = Math.hypot(p1[0] - p0[0], p1[2] - p0[2]) > 0.01; return {pos: mix(p0, p1, io(u)), ry: lerp(r0, r1, cl(u * 3)), anda: mov ? 1 : 0}; }
  const l = pts[pts.length - 1]; return {pos: l[1], ry: l[2], anda: 0};
};
// boca falando: abre e fecha nas sílabas das palavras de um trecho
const fala = (t, t0, t1) => { if (t < t0 || t > t1) return null; for (const p of PALAVRAS) if (t >= p.s && t <= p.e) return Math.sin((t - p.s) * 26) > 0 ? 'O' : 'sorrisoD'; return 'sorriso'; };
const COR_JAL = '#F4F2EC';
const CabeloFl = () => <group><Tn geo={<sphereGeometry args={[0.172, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.38]} />} p={[0, 0.17, -0.012]} rot={[-0.25, 0, 0.12]} m="#B9B2A8" line={0.6} />{[-1, 1].map((l) => <Esf key={l} r={0.045} p={[l * 0.165, 0.19, -0.04]} s={[0.7, 1, 0.9]} m="#B9B2A8" line={0.5} seg={10} />)}</group>;
const OculosSol = () => <group>{[-1, 1].map((l) => <mesh key={l} position={[l * 0.062, 0.19, 0.163]} rotation={[0, l * 0.35, 0]} scale={[1, 0.8, 0.4]} material={B('#2E2A2E')}><sphereGeometry args={[0.048, 14, 10]} /></mesh>)}<Linha a={[-0.02, 0.2, 0.17]} b={[0.02, 0.2, 0.17]} r={0.006} /></group>;
const Colar = () => <group position={[0, 0.8, 0.02]}>{Array.from({length: 14}).map((_, i) => { const a = i / 14 * Math.PI * 2; return <Esf key={i} r={0.03} p={[Math.cos(a) * 0.15, -0.05 - Math.max(0, Math.sin(a)) * 0.08 + 0.04, Math.sin(a) * 0.14 + 0.03]} m={['#F25C8A', '#F7D24A', '#FF9A3C'][i % 3]} line={0.3} seg={8} />; })}</group>;
const Oculos = () => <group>{[-1, 1].map((l) => <mesh key={l} position={[l * 0.062, 0.19, 0.162]} rotation={[0, l * 0.35, 0]} material={B(LINHA)}><torusGeometry args={[0.045, 0.006, 6, 20]} /></mesh>)}<Linha a={[-0.018, 0.2, 0.17]} b={[0.018, 0.2, 0.17]} r={0.005} /></group>;
const Jaleco = () => <group>{[0.52, 0.62, 0.72].map((y, i) => <Esf key={i} r={0.012} p={[0.03, y, 0.18 - (y - 0.52) * 0.08]} m="#A9B4C6" line={0.3} seg={8} />)}<Cx a={[0.07, 0.07, 0.01]} p={[-0.08, 0.68, 0.16]} rot={[-0.15, 0.4, 0]} m="#DCE6EE" line={0.4} /></group>;
const Topete = ({cor = '#6A4022'}) => <group><Tn geo={<sphereGeometry args={[0.17, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.4]} />} p={[0, 0.18, -0.01]} m={cor} line={0.6} /><Esf r={0.07} p={[0.03, 0.33, 0.07]} s={[1.3, 0.8, 1]} rot={[0.4, 0, 0.3]} m={cor} line={0.6} seg={12} /></group>;
const Coque = ({cor = '#8A4A2A'}) => <group><Tn geo={<sphereGeometry args={[0.172, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.45]} />} p={[0, 0.17, -0.01]} m={cor} line={0.6} /><Esf r={0.08} p={[0, 0.36, -0.08]} m={cor} line={0.6} seg={12} /></group>;
const Touca = () => <group position={[0, 0.3, 0]}><Ci rt={0.12} rb={0.15} h={0.08} m="#FFFFFF" line={0.6} seg={18} /><Cx a={[0.06, 0.018, 0.005]} p={[0, 0.0, 0.14]} m="#D8323C" line={0} /><Cx a={[0.018, 0.06, 0.005]} p={[0, 0.0, 0.14]} m="#D8323C" line={0} /></group>;
const Etiqueta = ({txt, k}) => k > 0.01 ? <group position={[0, 1.55, 0]} scale={k}><Placa p={[0, 0, 0]} txt={txt} w={0.42} h={0.13} fundo="#FFFFFF" tinta="#2E4A6B" moldura="#2E4A6B" /></group> : null;

// ---------- Fleming (o Senhor Sticker de jaleco) ----------
const B0 = [0.3, 0, -1.5], DOOR = [-1.75, 0, -1.6];
const faceFl = (t) => expr(t, [
  [0, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5}], [TM.louca, {olhos: 'semi', boca: 'canto', sob: 0.4}],
  [TM.salvou, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.8, pop: 0.2}],
  [TM.alexander, {olhos: 'normal', boca: 'sorriso', olhar: [0, -0.8]}], [TM.baguncado, {olhos: 'normal', boca: 'canto', olhar: [0, -0.8]}],
  [TM.colegas, {olhos: 'normal', boca: 'reta', olhar: [-0.8, 0.1]}], [TM.chiqueiro, {olhos: 'semi', boca: 'reta', sob: -0.2, olhar: [-0.7, 0]}],
  [TM.so, {olhos: 'semi', boca: 'canto', sob: 0.5, assim: 0.03, olhar: [0.3, 0]}], [TM.saiu2, {olhos: 'feliz', boca: 'sorrisoD'}],
  [TM.volta, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5}], [TM.pegou, {olhos: 'normal', boca: 'sorriso', olhar: [0.5, -0.5]}],
  [TM.parou - 0.05, {olhos: 'grande', boca: 'O', sob: -0.9, pop: 0.35, semPisca: true, olhar: [0.3, -0.6]}],
  [TM.fleming3 - 0.1, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.8}], [TM.penicilina + 0.3, {olhos: 'feliz', boca: 'grito', bochecha: 0.8}],
  [TM.so2, {olhos: 'tedio', boca: 'triste', sob: -0.3}], [TM.nao, {olhos: 'normal', boca: 'nervoso', olhar: [0.2, -0.6], sob: -0.5}], [TM.remedio + 0.1, {olhos: 'grande', boca: 'nervoso', trem: 0.6, sob: -0.8, semPisca: true}],
  [TM.descoberta, {olhos: 'semi', boca: 'triste', sob: -0.5}],
  [TM.mil2, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.7}], [TM.nobel, {olhos: 'feliz', boca: 'grito', bochecha: 0.9, pop: 0.3}],
], 0.2);
const fleming = (t) => {
  const F = faceFl(t); let pos = B0, ry = 0, mP = null, mN = null, inc = 0, cab = [0, 0, 0], pe = null, vis = true, mala = 0, chapeu = 0, praia = 0, placa = null, alt = 0, estica = 0, frasco = null;
  if (t < TM.salvou - 0.19) { // tchau na porta, de mala e chapéu
    pos = DOOR; ry = 0.35; mala = 1; chapeu = 1;
    mP = PM(pos, ry, [0.3, 1.25 + Math.sin(t * 12) * 0.05, 0.1 + Math.sin(t * 12) * 0.03]); mN = PM(pos, ry, [-0.24, 0.33, 0.04]);
  } else if (t < TM.londres) { // nos ombros da multidão (rua)
    pos = [XRUA, 0.6, 0.3]; ry = 0; placa = [XRUA + 0.02, 2.13, 0.42];
    mP = [XRUA + 0.1, 2.03, 0.4]; mN = [XRUA - 0.1, 2.03, 0.4];
  } else if (t < TM.so) { // trabalhando na bancada
    pos = B0; inc = t < TM.colegas ? 0.32 : 0.05; cab = t < TM.colegas ? [0.35, 0, 0] : [0, 0.25, 0];
    mP = PM(pos, ry, [0.2, 0.88, 0.32]); mN = PM(pos, ry, [-0.2, 0.88, 0.32]);
  } else if (t < TM.saiu2) { // dá de ombros
    const k = kf(t, [[TM.so, 0], [TM.ombros, 1, back], [TM.saiu2 - 0.15, 1]]);
    mP = PM(pos, ry, [0.32 + 0.05 * k, 0.5 + 0.48 * k, 0.12]); mN = PM(pos, ry, [-0.32 - 0.05 * k, 0.5 + 0.48 * k, 0.12]); alt = -0.04 * k; cab = [0, 0, 0.12 * k];
  } else if (t < TM.sem2) { // pega o chapéu e sai pela porta
    const C = caminho(t, [[TM.saiu2, B0, 0], [TM.saiu2 + 0.15, B0, -1.4], [TM.ferias2 + 0.45, [-0.9, 0, -1.4], -1.4], [TM.sem2 - 0.05, [-2.0, 0, -2.0], -2.2]]);
    pos = C.pos; ry = C.ry; pe = C.anda ? passo(t) : null; pos = [pos[0], quica(t, C.anda), pos[2]]; chapeu = 1; mala = 1;
    mP = PM(pos, ry, [0.25, 0.45 + Math.sin(t * 9) * 0.04, Math.sin(t * 9) * 0.08]); mN = PM(pos, ry, [-0.24, 0.33, 0.04]);
  } else if (t < TM.volta - 0.1) { vis = false;
  } else if (t < TM.pegou) { // volta das férias: óculos escuros e colar havaiano
    const C = caminho(t, [[TM.volta - 0.1, [-2.0, 0, -2.05], 0.3], [TM.pegou, [-1.55, 0, -1.35], 0.3]]);
    pos = [C.pos[0], quica(t, 1), C.pos[2]]; ry = C.ry; pe = passo(t); praia = 1; mala = 1;
    mP = PM(pos, ry, [0.3, 1.2 + Math.sin(t * 12) * 0.05, 0.1]); mN = PM(pos, ry, [-0.24, 0.33, 0.04]);
  } else if (t < TM.tinha2) { // pega a placa e leva até o lixo... e para
    const ir = kf(t, [[TM.pegou, 0], [TM.jogar, 1]]);
    pos = [lerp(B0[0], 0.75, ir), 0, -1.5]; ry = lerp(0, 0.9, ir); praia = 1;
    const mao = mix([-0.25, 0.92, -1.0], [1.12, 1.0, -1.45], ir);
    mP = t > TM.parou ? add(mao, [0, 0.03 * Math.sin(t * 40) * kf(t, [[TM.parou, 1], [TM.parou + 0.5, 0]]), 0]) : mao; mN = PM(pos, ry, [-0.25, 0.45, 0.05]); placa = add(mP, [0, 0.02, 0]);
    inc = 0.1;
  } else if (t < TM.so2) { // o "Rei Leão": ergue a placa
    praia = t < TM.fleming3 ? 1 : 0; const k = kf(t, [[TM.fleming3 - 0.05, 0], [TM.chamou + 0.2, 1, back]]);
    mP = PM(pos, ry, [0.08, lerp(0.9, 1.75, k), 0.15]); mN = PM(pos, ry, [-0.08, lerp(0.9, 1.75, k), 0.15]); placa = [pos[0], lerp(0.95, 1.82, k), pos[2] + 0.16]; estica = 0.2 * k; cab = [-0.25 * k, 0, 0];
  } else if (t < TM.nao) { // desanimado, placa na mão
    mP = PM(pos, ry, [0.18, 0.62, 0.22]); placa = add(mP, [-0.05, 0.02, 0]); mN = PM(pos, ry, [-0.25, 0.42, 0.05]); inc = 0.12; cab = [0.2, 0, 0];
  } else if (t < TM.descoberta) { // tenta fabricar: derrama o frasco e só sai uma gota
    const k = kf(t, [[TM.nao, 0], [TM.fabricar, 1]]);
    mP = PM(pos, ry, [0.15, 0.95 + 0.05 * k, 0.35]); mN = PM(pos, ry, [-0.12, 0.92, 0.33]); frasco = {p: add(mP, [0, 0.02, 0]), rot: [0, 0, -1.6 * k]}; inc = 0.15;
  } else if (t < TM.ate) { // guarda na gaveta
    const C = caminho(t, [[TM.descoberta - 0.05, B0, -0.8], [TM.descoberta + 0.6, [-1.15, 0, -1.3], -2.6], [TM.esquecida2 + 0.1, [-1.15, 0, -1.3], -2.6], [TM.anos, [-0.2, 0, -1.6], 1.6 - 2 * Math.PI]]);
    pos = [C.pos[0], quica(t, C.anda), C.pos[2]]; ry = C.ry; pe = C.anda ? passo(t) : null;
    const guarda = t > TM.descoberta + 0.6 && t < TM.esquecida2 + 0.1;
    mP = guarda ? [-1.42, 0.62, -1.45] : PM(pos, ry, [0.25, 0.6, 0.1]); mN = PM(pos, ry, [-0.24, 0.42, 0.04]); placa = t < TM.esquecida2 - 0.2 ? add(mP, [0, 0.02, 0]) : null; inc = guarda ? 0.3 : 0;
  } else { // no palco do Nobel
    pos = [XNOB, 0.4, -0.9]; ry = 0; const med = kf(t, [[TM.ganharam, 0], [TM.premio, 1, back]]);
    const ap = t > TM.nobel ? 1 : 0; mP = ap ? [XNOB + 0.28, 1.95 + Math.sin(t * 10) * 0.04, -0.75] : PM(pos, ry, [0.25, 0.45, 0.05]); mN = ap ? [XNOB - 0.28, 1.95 + Math.cos(t * 10) * 0.04, -0.75] : PM(pos, ry, [-0.25, 0.45, 0.05]);
    return {pos, ry, vis, med, c: {cor: COR_JAL, ...F, inc, cab, mP, mN, pe: null, t, fase: 0.3, resp: t * 3, roupa: <><Jaleco /><Gravata cor="#3A62B8" /></>, cabeca: <CabeloFl />}};
  }
  return {pos, ry, vis, mala, placa, frasco, c: {cor: praia ? '#F28E5A' : COR_JAL, ...F, inc, cab, mP, mN, pe, alt, estica, t, fase: 0.3, resp: t * 3,
    roupa: praia ? <><Colar /></> : <><Jaleco /><Gravata cor="#3A62B8" /></>, cabeca: <><CabeloFl />{chapeu ? <Chapeu y={0.31} /> : null}{praia ? <OculosSol /> : null}</>}};
};
// ---------- colegas zombando (laboratório) e orgulhosos (laboratório limpo) ----------
const COLS = [
  {cab: () => <><Oculos /><Topete cor="#3A3436" /></>, cor: '#E8EEF2', pele: null, gr: '#2E7D6B'},
  {cab: () => <><BigodeGuidao /></>, cor: '#F2EEE2', pele: '#FFF1E6', gr: '#B83A3A'},
  {cab: () => <><Topete cor="#C9702A" /></>, cor: '#EEF2E6', pele: null, gr: '#7A4AA8'},
];
const colega = (t, k) => {
  const v = COLS[k]; let pos, ry, F, mP = null, mN = null, inc = 0, cab = [0, 0, 0], vis = true, lat = 0;
  if ((t > TM.colegas - 0.5 && t < TM.so + 0.1) || (t > TM.so2 - 0.2 && t < TM.nao)) { // na porta do laboratório
    pos = [[-1.7, 0, -1.25], [-1.25, 0, -1.0], [-0.95, 0, -1.55]][k]; ry = [0.7, 0.55, 0.45][k];
    if (t < TM.so2) {
      const ri = Math.sin(t * 22 + k) * 0.5 + 0.5;
      F = expr(t, [[0, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.6}], [TM.fleming2 - 0.1, {olhos: k === 1 ? 'semi' : 'feliz', boca: 'sorrisoD', sob: k === 1 ? 0.5 : 0, bochecha: 0.6}], [TM.chiqueiro + 0.1, {olhos: 'feliz', boca: 'grito', bochecha: 0.9}]], k);
      if (k === 1) { const b = fala(t, TM.fleming2, TM.chiqueiro + 0.6); if (b) F = {...F, boca: b}; }
      mN = k === 1 ? PM(pos, ry, [0.25, 0.85 + 0.05 * ri, 0.32]) : PM(pos, ry, [-0.02, 1.08, 0.2]); // aponta / tapa o nariz
      mP = k === 1 ? PM(pos, ry, [0.3, 0.55, 0.1]) : PM(pos, ry, [0.25, 0.4 + 0.08 * ri, 0.1]);
      inc = (k === 1 ? 0.05 : -0.1) - 0.08 * ri * (t > TM.chiqueiro ? 1 : 0.4); lat = 0.05 * Math.sin(t * 11 + k);
    } else { // bocejando ("ninguém deu bola")
      F = expr(t, [[0, {olhos: 'fechado', boca: 'grito', abre: 0.4, semPisca: true}], [TM.bola + 0.3 + k * 0.1, {olhos: 'tedio', boca: 'reta', semPisca: true}]], k);
      mP = PM(pos, ry, [0.05, 1.12, 0.18]); mN = PM(pos, ry, [-0.32, 1.05 + k * 0.05, 0.0]); inc = -0.15;
    }
  } else if (t > TM.colegas2 - 0.3) { // laboratório limpo: posam, brilham... e sem medalha
    pos = [[XCOL - 0.5, 0, -0.2], [XCOL + 0.2, 0, -0.1], [XCOL + 0.9, 0, -0.2]][k]; ry = [0.15, 0, -0.15][k];
    const triste = t > TM.nenhuma + 0.1;
    F = expr(t, [[0, {olhos: 'semi', boca: 'canto', sob: 0.4, assim: 0.03}], [TM.bancada, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.4}], [TM.nenhuma + 0.15 + k * 0.08, {olhos: 'normal', boca: 'O', olhar: [0, -1], sob: -0.4, semPisca: true}], [TM.medalha + 0.25, {olhos: 'tedio', boca: 'triste', sob: -0.5, olhar: [0, -0.6]}]], k);
    mP = triste ? PM(pos, ry, [0.08, 0.72, 0.2]) : PM(pos, ry, [0.25, 0.5, 0.08]); mN = triste ? PM(pos, ry, [-0.08, 0.72, 0.2]) : PM(pos, ry, [-0.25, 0.5, 0.08]);
    inc = triste ? 0.2 : -0.08; cab = triste ? [0.4, 0, 0] : [0, 0, 0];
  } else return {vis: false};
  return {pos, ry, vis, c: {cor: v.cor, pele: v.pele, ...F, mP, mN, inc, lat, cab, t, fase: k * 1.7, resp: t * 3 + k, cabeca: v.cab(), roupa: <><Jaleco /><Gravata cor={v.gr} /></>}};
};
// ---------- multidão na rua (gancho) ----------
const MULT = Array.from({length: 16}).map((_, i) => ({x: (i % 8 - 3.5) * 0.42 + (Math.floor(i / 8) % 2) * 0.2, z: 0.85 + Math.floor(i / 8) * 0.55 - Math.abs(i % 8 - 3.5) * 0.05, cor: ['#E58FA0', '#7FB8E0', '#9FD08A', '#B79BE0', '#F0B66A', '#E07F6A', '#6AC0B0', '#D9A05B'][i % 8], chapeu: i % 3 === 0, fase: i * 1.37}));
const pessoaMult = (t, m, i) => {
  if (Math.abs(m.x) < 0.45) return null;
  const pul = Math.max(0, Math.sin(t * 9 + m.fase)) * 0.06; const pos = [XRUA + m.x, pul, m.z]; const ry = -m.x * 0.25 + Math.PI;
  const F = {olhos: i % 2 ? 'feliz' : 'normal', boca: 'sorrisoD', bochecha: 0.5, ...(pisca(t, m.fase) ? {olhos: 'pisca'} : {})};
  return {pos, ry, c: {cor: m.cor, ...F, mP: PM(pos, ry, [0.2, 1.2 + Math.sin(t * 9 + m.fase) * 0.06, 0.05]), mN: PM(pos, ry, [-0.2, 1.15 + Math.cos(t * 9 + m.fase) * 0.06, 0.05]), t, fase: m.fase, resp: t * 3 + m.fase, cabeca: m.chapeu ? <Chapeu y={0.31} cor={['#3A3436', '#6A4022'][i % 2]} /> : null}};
};
// ---------- Florey e Chain (Oxford) ----------
const oxford = (t, k) => {
  const pos = [XFAB + (k ? 0.5 : -0.5), 0, -1.05], ry = k ? -0.2 : 0.2;
  const acesa = kf(t, [[TM.descobriram - 0.05, 0], [TM.descobriram + 0.12, 1, outQ], [TM.massa + 0.6, 1], [TM.massa + 1.0, 0]]);
  const F = expr(t, [[0, {olhos: 'normal', boca: 'O', olhar: [k ? -0.4 : 0.4, -0.7]}], [TM.florey + k * 0.55, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5}], [TM.descobriram, {olhos: 'grande', boca: 'grito', pop: 0.3, semPisca: true}], [TM.produzir, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.7}]], k * 0.9);
  const lendo = t < TM.florey; const toca = kf(t, [[TM.massa - 0.25, 0], [TM.massa, 1, back], [TM.massa + 0.5, 1], [TM.massa + 0.7, 0]]);
  const papel = lendo ? [XFAB, 1.0, -0.8] : null;
  const mP = lendo ? (k ? [XFAB + 0.08, 1.0, -0.8] : [XFAB + 0.02, 0.98, -0.8]) : (toca > 0 ? mix(PM(pos, ry, [k ? -0.25 : 0.25, 0.5, 0.1]), [XFAB, 1.55, -0.95], toca) : PM(pos, ry, [0.25, 0.5 + 0.4 * acesa, 0.1]));
  const mN = lendo ? (k ? [XFAB - 0.02, 0.98, -0.8] : [XFAB - 0.08, 1.0, -0.8]) : PM(pos, ry, [-0.25, 0.5 + 0.4 * acesa, 0.1]);
  return {pos, ry, papel, c: {cor: k ? '#9AA6B8' : '#B8A68A', ...F, acesa, mP, mN, inc: lendo ? 0.15 : 0, t, fase: k * 2.1, resp: t * 3 + k, roupa: <><Jaleco /><Gravata cor={k ? '#D8323C' : '#2E4A6B'} /></>, cabeca: k ? <><BigodeGuidao /><Topete cor="#2E2A2E" /></> : <Topete cor="#8A5A34" />}};
};
// ---------- soldado e enfermeira ----------
const soldado = (t) => {
  const cura = t > TM.morte - 0.1; const pul = cura ? Math.max(0, Math.sin((t - TM.morte) * 9)) * 0.12 : 0;
  const pos = [XGUE - 0.25, pul, -0.2], ry = 0.25;
  const F = expr(t, [[0, {olhos: 'tedio', boca: 'triste', sob: -0.6, pele: '#E4F0D0'}], [TM.infeccionado, {olhos: 'grande', boca: 'nervoso', trem: 0.6, sob: -0.9, semPisca: true}], [TM.nao + 0, {olhos: 'tedio', boca: 'triste'}], [TM.sentenca, {olhos: 'grande', boca: 'O', sob: -0.6}], [TM.morte + 0.05, {olhos: 'feliz', boca: 'grito', bochecha: 0.8, pop: 0.3}]], 0.5);
  const braco = PM(pos, ry, [0.3, 0.62, 0.18]);
  const mP = cura ? PM(pos, ry, [0.25, 1.3 + Math.sin(t * 10) * 0.05, 0.05]) : braco; const mN = cura ? PM(pos, ry, [-0.25, 1.3 + Math.cos(t * 10) * 0.05, 0.05]) : add(braco, [-0.12, 0.02, 0.05]);
  return {pos, ry, braco: cura ? null : braco, verde: !cura && t > TM.arranhao, c: {cor: '#8C8A4E', ...F, pele: cura ? null : '#EEF4DC', mP, mN, t, fase: 1.1, resp: t * 3, cabeca: <Capacete />, roupa: <Colete />}};
};
const enfermeira = (t) => {
  const C = caminho(t, [[TM.repente, [XGUE + 1.3, 0, -0.5], -1.2], [TM.infeccionado, [XGUE + 0.4, 0, -0.15], -1.3]]);
  const pos = [C.pos[0], quica(t, C.anda), C.pos[2]], ry = C.ry;
  const inj = kf(t, [[TM.infeccionado + 0.2, 0], [TM.nao, 1], [TM.sentenca, 1], [TM.sentenca + 0.3, 0]]);
  const F = expr(t, [[0, {olhos: 'normal', boca: 'sorriso'}], [TM.nao, {olhos: 'semi', boca: 'canto', sob: 0.3}], [TM.morte, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.6}]], 2);
  const mP = mix(PM(pos, ry, [0.25, 0.75, 0.25]), [XGUE + 0.05, 0.72, 0.0], inj);
  return {pos, ry, seringa: mP, c: {cor: '#FFFFFF', ...F, pe: C.anda ? passo(t) : null, mP, mN: PM(pos, ry, [-0.25, 0.45, 0.05]), t, fase: 2, resp: t * 3, cabeca: <><Coque cor="#6A4022" /><Touca /></>}};
};
// ---------- palco do Nobel: Florey e Chain ao lado ----------
const laureado = (t, k) => {
  const pos = [XNOB + (k ? 0.8 : -0.8), 0.4, -0.95], ry = k ? -0.25 : 0.25; const ap = t > TM.nobel;
  const F = expr(t, [[0, {olhos: 'normal', boca: 'sorriso'}], [TM.ganharam + k * 0.1, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.6}], [TM.nobel, {olhos: 'feliz', boca: 'grito', bochecha: 0.8}]], k + 3);
  const mP = ap ? PM(pos, ry, [0.22, 1.25 + Math.sin(t * 11 + k) * 0.05, 0.1]) : PM(pos, ry, [0.25, 0.45, 0.05]); const mN = ap ? PM(pos, ry, [-0.22, 1.25 + Math.cos(t * 11 + k) * 0.05, 0.1]) : PM(pos, ry, [-0.25, 0.45, 0.05]);
  return {pos, ry, c: {cor: k ? '#9AA6B8' : '#B8A68A', ...F, mP, mN, t, fase: k * 2.1, resp: t * 3 + k, roupa: <Gravata cor={k ? '#D8323C' : '#2E4A6B'} />, cabeca: k ? <><BigodeGuidao /><Topete cor="#2E2A2E" /></> : <Topete cor="#8A5A34" />}};
};
const PLAT = Array.from({length: 7}).map((_, i) => ({x: (i - 3) * 0.55, cor: ['#4A5A8A', '#8A4A5A', '#4A7A5A', '#6A5A8A', '#8A6A3A', '#5A6A7A', '#7A4A6A'][i], fase: i * 1.9}));
const plateia = (t, p, i) => { const pos = [XNOB + p.x, -0.45, 1.3 + (i % 2) * 0.25], ry = Math.PI; const bate = t > TM.mil2 ? Math.abs(Math.sin(t * 14 + p.fase)) : 0;
  return {pos, ry, c: {cor: p.cor, olhos: 'normal', boca: 'sorriso', mP: PM(pos, ry, [0.03 + 0.06 * bate, 0.95, 0.2]), mN: PM(pos, ry, [-0.03 - 0.06 * bate, 0.95, 0.2]), t, fase: p.fase, resp: t * 3, cabeca: i % 3 === 0 ? <Chapeu y={0.31} /> : (i % 3 === 1 ? <Coque cor="#3A3436" /> : null)}}; };
// ---------- quarto: a criança cientista e a mãe ----------
const crianca = (t) => {
  const pos = [XQUA, 0, -0.5], ry = 0; const sobe = kf(t, [[TM.diga - 0.1, 0], [TM.diga + 0.25, 1, back]]);
  const F = expr(t, [[0, {olhos: 'normal', boca: 'O', olhar: [0, -0.8]}], [TM.mandarem, {olhos: 'normal', boca: 'reta', olhar: [0.8, 0.2]}], [TM.diga - 0.05, {olhos: 'semi', boca: 'canto', sob: 0.5, assim: 0.03, olhar: [0, 0]}], [TM.fazendo, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.8}]], 0.7);
  const mP = PM(pos, ry, [0.12, lerp(0.75, 1.15, sobe), 0.3]); const mN = PM(pos, ry, [-0.12, lerp(0.75, 1.15, sobe), 0.3]);
  return {pos, ry, placa: [pos[0], lerp(0.78, 1.2, sobe), pos[2] + 0.32], c: {cor: COR_JAL, ...F, mP, mN, t, fase: 0.7, resp: t * 3, roupa: <Jaleco />, cabeca: <><Topete cor="#C9702A" /><OculosSol /></>}};
};
const mae = (t) => {
  const pos = [XQUA + 1.55, 0, -1.55], ry = -0.6; const ap = kf(t, [[TM.mandarem - 0.1, 0], [TM.mandarem + 0.1, 1, back]]);
  const F = expr(t, [[0, {olhos: 'bravo', boca: 'reta', sob: -0.6}], [TM.arrumar, {olhos: 'bravo', boca: 'grito', sob: -0.8, trem: 0.3}], [TM.fazendo + 0.2, {olhos: 'grande', boca: 'O', sob: 0.6, semPisca: true}]], 1.3);
  const mP = mix(PM(pos, ry, [0.25, 0.55, 0.05]), PM(pos, ry, [0.18, 1.0 + 0.04 * Math.sin(t * 14), 0.42]), ap);
  return {pos, ry, c: {cor: '#D46A8C', ...F, mP, mN: PM(pos, ry, [-0.2, 0.6, -0.02]), t, fase: 1.3, resp: t * 3, cabeca: <Coque cor="#8A4A2A" />}};
};
// ---------- estado do laboratório ----------
const MESES = ['AGO\n1928', 'SET\n1928'];
const labEstado = (t) => {
  const bal = Math.sin(t * 6) * (t < TM.salvou - 0.2 ? 1.2 : t > TM.placas && t < TM.pia ? 1.5 : t > TM.semanas && t < TM.alguma ? 0.4 : 0.3);
  const nPia = t < TM.empilhadas ? 14 : Math.min(26, 14 + Math.floor((t - TM.empilhadas) * 12));
  const porta = t < TM.salvou - 0.19 ? 1 : (t > TM.ferias2 + 0.3 && t < TM.sem2 + 0.2 ? 1 - cl((t - TM.sem2) / 0.2) : (t > TM.volta - 0.15 && t < TM.pegou ? 1 : 0));
  const placaFerias = t < TM.salvou - 0.19 || (t > TM.sem2 - 0.1 && t < TM.volta + 0.4);
  const balPlaca = t > TM.sem2 ? (t - TM.sem2) * 9 : 0;
  const gaveta = t > TM.descoberta + 0.5 && t < TM.esquecida2 + 0.2 ? kf(t, [[TM.descoberta + 0.5, 0], [TM.descoberta + 0.8, 1], [TM.esquecida2, 1], [TM.esquecida2 + 0.2, 0]]) : 0;
  const teia = kf(t, [[TM.dez - 0.3, 0], [TM.anos + 0.3, 1]]);
  const aranha = kf(t, [[TM.dez, 0], [TM.anos + 0.4, 1]]);
  const tl = t > TM.semanas && t < TM.volta; // time-lapse
  const calTxt = t < TM.semanas ? 'AGO\n1928' : (t < TM.volta ? MESES[Math.floor((t - TM.semanas) * 1.2) % 2] : (t < TM.dez - 0.2 ? 'SET\n1928' : (t < TM.ate ? String(1929 + Math.min(9, Math.floor((t - TM.dez + 0.2) * 11))) : '1938')));
  const luz = t > TM.nada && t < TM.volta - 0.1 ? 0 : 1;
  return {bal, nPia, porta, placaFerias, balPlaca, gaveta, teia, aranha, calTxt, relVel: tl || (t > TM.dez && t < TM.ate) ? 40 : 1, luz};
};
// ---------- estado da placa gigante (mofo e bactérias) ----------
const BACT = Array.from({length: 26}).map((_, i) => { const a = i * 2.4, r = 0.25 + ((i * 0.37) % 0.8); return {x: Math.cos(a) * r - 0.1, z: Math.sin(a) * r * 0.8 - 0.3, cor: ['#C77DBA', '#E58FB0', '#A97DD8'][i % 3], fase: i * 0.9}; });
const MOLD = [XPL - 0.45, 0, -0.55];
const placaEstado = (t) => {
  const s = kf(t, [[TM.alguma - 0.1, 0.1], [TM.crescer + 0.6, 1.6, outQ], [TM.mofo, 1.9], [TM.verde, 2.4, back], [TM.aquele, 2.5], [TM.mofo2, 2.7]]);
  const cara = t < TM.aquele ? 'mau' : 'heroi'; const capa = kf(t, [[TM.aquele, 0], [TM.aquele + 0.25, 1, back]]);
  const anel = kf(t, [[TM.volta2, 0], [TM.sumido + 0.3, 1, outQ]]);
  const halo = t > TM.circulo - 0.05 && t < TM.aquele ? 0.5 + 0.2 * Math.sin(t * 6) : 0;
  const pows = [];
  const bact = BACT.map((b, i) => {
    const d = Math.hypot(b.x + 0.45, b.z + 0.55); const perto = d < 0.6;
    let p = [XPL + b.x, 0.022, b.z], vis = true, susto = 0;
    const tSome = TM.volta2 + 0.1 + (d / 0.6) * (TM.sumido - TM.volta2 + 0.4);
    if (perto && t > TM.volta2 - 0.3) { susto = 1; const fug = cl((t - TM.volta2 + 0.3) / 1.5); const dir = [b.x + 0.45, b.z + 0.55].map((v) => v / Math.max(0.05, d)); p = [p[0] + dir[0] * fug * 0.35, p[1] + Math.abs(Math.sin(t * 14 + i)) * 0.03, p[2] + dir[1] * fug * 0.35];
      if (t > tSome) vis = false; if (t > tSome && t < tSome + 0.3) pows.push({p: add(p, [0, 0.06, 0]), k: (t - tSome) / 0.3}); }
    if (!perto && t > TM.circulo) susto = 1;
    if (i === 3 && t > TM.bacteria2 - 0.05) { vis = t < TM.bacteria2 + 0.1; if (t > TM.bacteria2 + 0.05 && t < TM.bacteria2 + 0.35) pows.push({p: add(p, [0, 0.08, 0]), k: (t - TM.bacteria2 - 0.05) / 0.3}); }
    return {p, vis, susto, cor: b.cor, s: 1.0};
  });
  return {s, cara, capa, anel, halo, bact, pows};
};
