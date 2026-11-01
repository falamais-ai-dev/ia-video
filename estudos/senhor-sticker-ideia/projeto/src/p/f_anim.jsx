
// ---------- atuação: inventor na oficina ----------
const SP = [0, 0.02, 0.0], ST = [-0.58, 0, 0.55], PB = [-0.95, 0, -1.05];
const HP = [0.42, 0.6, 0.12], HN = [-0.42, 0.6, 0.12];
const E1 = W_('e', 0); // "e uma bola": o pulo para a poltrona
const COR_INV = '#E3A33C';
const faceInv = (t) => expr(t, [
  [0, DORME], [TM.acordar + 0.05, {olhos: 'grande', boca: 'O', sob: -0.8, pop: 0.3, semPisca: true}], [TM.genio, {olhos: 'feliz', boca: 'sorrisoD', sob: -0.3, bochecha: 0.6}],
  [TM.funciona, {olhos: 'normal', boca: 'sorriso', olhar: [0.5, -0.1]}], [TM.poltrona + 0.1, {olhos: 'normal', boca: 'O', olhar: [0.4, 0.7], sob: -0.4}], [TM.cima + 0.05, {olhos: 'grande', boca: 'nervoso', sob: -0.8, pop: 0.3, semPisca: true}],
  [E1, {olhos: 'feliz', boca: 'sorrisoD'}], [TM.bola + 0.15, {olhos: 'grande', boca: 'O', sob: -0.6, semPisca: true}], [TM.pesada + 0.05, {olhos: 'grande', boca: 'nervoso', sob: -0.9, trem: 0.6, semPisca: true}],
  [TM.mao, {olhos: 'normal', boca: 'sorriso'}], [TM.ai, {olhos: 'semi', boca: 'sorriso', palp: 0.55}], [TM.cochilar + 0.1, DORME],
  [TM.barulhao, {olhos: 'grande', boca: 'grito', sob: -1, trem: 1, semPisca: true, pop: 0.38}], [TM.hora, {olhos: 'grande', boca: 'nervoso', sob: -0.9, trem: 0.6, semPisca: true}],
  [TM.parece, {olhos: 'tedio', boca: 'triste', olhar: [0.3, 0.7], sob: -0.3}],
  [TM.mas, {olhos: 'normal', boca: 'sorriso'}], [TM.edison, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.5}], [TM.proposito, {olhos: 'semi', boca: 'canto', sob: 0.35, assim: 0.02}],
  [TM.estrondo - 1.5, DORME],
  [TM.acorda2, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.7}], [TM.nao, {olhos: 'normal', boca: 'O', olhar: [0.4, -0.7]}],
  [TM.gato - 0.3, DORME], [TM.prato + 0.45, {...DORME, boca: 'sorriso'}],
], 0.3);
const inventorOfi = (t) => {
  let pos = SP, ry = 0, sentado = 1, mP = HP, mN = HN, er = 0, inc = 0, cab = [0, 0, 0], estica = 0, acesa = 0, zz = 0;
  const F = faceInv(t);
  if (t < TM.funciona) { cab = t < TM.acordar ? [0.25, 0, 0.08] : [0, 0, 0]; acesa = kf(t, [[TM.genio - 0.05, 0], [TM.genio + 0.12, 1, outQ]]); zz = t < TM.acordar ? 1 : 0; }
  else if (t < E1 - 0.1) { pos = ST; ry = 0.45; sentado = 0;
    const ap = kf(t, [[TM.funciona + 0.2, 0], [TM.pratos, 1], [TM.cima - 0.3, 1], [TM.cima, 0]]);
    mP = mix(maoRepouso(ST, ry, 1), [ST[0] + 0.42, 0.95, ST[2] + 0.15], ap); mN = maoRepouso(ST, ry, -1, 0.14 + 0.1 * ap);
    inc = -0.12 * kf(t, [[TM.cima - 0.05, 0], [TM.cima + 0.08, 1, outQ], [TM.cima + 0.5, 0]]); }
  else if (t < TM.bola) { const u = cl((t - (E1 - 0.1)) / (TM.bola - E1 + 0.1)); const e = io(u);
    pos = [lerp(ST[0], SP[0], e), lerp(ST[1], SP[1], e) + Math.sin(u * Math.PI) * 0.35, lerp(ST[2], SP[2], e)]; ry = lerp(0.45, 0, e); sentado = cl(u * 1.6);
    mP = [pos[0] + 0.3, pos[1] + 0.85, pos[2] + 0.1]; mN = [pos[0] - 0.3, pos[1] + 0.85, pos[2] + 0.1]; estica = Math.sin(u * Math.PI) * 0.5; }
  else if (t < TM.barulhao) {
    const y = kf(t, [[TM.bola, 0.68], [TM.bola + 0.2, 0.68], [TM.pesada, 0.53, outQ], [TM.pesada + 0.45, 0.6], [TM.amolece, 0.6], [TM.amolece + 0.6, 0.565]]);
    const dx = kf(t, [[TM.amolece, 0], [TM.amolece + 0.6, 0.02], [TM.despencam, 0.03], [TM.despencam + 0.2, 0.05]]);
    mP = [HP[0] + dx, y, HP[2]]; mN = [HN[0] - dx, y, HN[2]];
    estica = -0.6 * kf(t, [[TM.pesada - 0.02, 0], [TM.pesada + 0.08, 1, outQ], [TM.pesada + 0.4, 0]]);
    cab = [kf(t, [[TM.cochilar, 0], [TM.cochilar + 0.6, 0.22], [TM.pega, 0.22], [TM.sono, 0.42]]), 0, kf(t, [[TM.pega, 0.06], [TM.sono, 0.14]])];
    inc = kf(t, [[TM.pega, 0], [TM.sono, 0.08]]); zz = kf(t, [[TM.cochilar + 0.2, 0], [TM.cochilar + 0.6, 1]]); }
  else if (t < TM.parece) {
    pos = [0, kf(t, [[TM.barulhao, 0.02], [TM.barulhao + 0.14, 0.4, outQ], [TM.barulhao + 0.5, 0.36], [TM.barulhao + 0.75, 0.02, inQ]]) + settle(t, TM.barulhao + 0.75, 0.03, 18, 6), 0];
    sentado = kf(t, [[TM.barulhao, 1], [TM.barulhao + 0.12, 0.25], [TM.barulhao + 0.6, 0.3], [TM.barulhao + 0.75, 1]]);
    const up = kf(t, [[TM.barulhao, 0], [TM.barulhao + 0.12, 1, outQ], [TM.barulhao + 0.7, 1], [TM.barulhao + 1.0, 0]]);
    mP = mix([0.3, 0.63, 0.12], [0.36, pos[1] + 1.25, 0.18], up); mN = mix([-0.3, 0.63, 0.12], [-0.36, pos[1] + 1.25, 0.18], up);
    er = kf(t, [[TM.barulhao, 0], [TM.barulhao + 0.1, 1, outQ], [TM.hora + 0.6, 0.6]]); estica = 0.5 * Math.sin(cl((t - TM.barulhao) / 0.3) * Math.PI); }
  else if (t < TM.mas) { mP = [0.3, 0.63, 0.12]; mN = [-0.3, 0.63, 0.12]; er = 0.6; cab = [-0.25 + Math.sin(t * 3) * 0.05, 0.15, Math.sin(t * 2.2) * 0.1]; }
  else if (t < TM.e1) { pos = PB; ry = 0.3; sentado = 0;
    const ergue = kf(t, [[TM.edison, 0], [TM.proposito - 0.1, 1, back]]);
    mN = mix(maoRepouso(PB, ry, -1), [PB[0] - 0.22, 0.55, PB[2] + 0.12], 1); mP = mix(maoRepouso(PB, ry, 1), [PB[0] + 0.28, 1.2, PB[2] + 0.22], ergue);
    acesa = kf(t, [[TM.edison - 0.05, 0], [TM.edison + 0.1, 0.8, outQ], [TM.proposito, 0.8], [TM.proposito + 0.4, 0]]); inc = -0.06; }
  else if (t < TM.puxa) { // inserção: as bolas caem e batem no prato do estrondo
    const sol = kf(t, [[TM.estrondo - 0.4, 0], [TM.estrondo - 0.2, 0.04]]); mP = [HP[0] + sol, 0.57, HP[2]]; mN = [HN[0] - sol, 0.57, HN[2]]; cab = [0.42, 0, 0.14]; inc = 0.08; zz = 1; }
  else if (t < TM.gato - 0.15) { acesa = 1; mN = [-0.3, 0.63, 0.12];
    mP = kf(t, [[TM.acorda2, [0.34, 1.06, 0.18]], [TM.nao, [0.34, 1.06, 0.18]], [TM.nao + 0.3, [0.36, 0.98, 0.2]]]); cab = [0, 0, 0.05]; er = 0.3; }
  else { const sol = kf(t, [[TM.prato - 0.1, 0], [TM.prato + 0.05, 0.03]]); mP = [HP[0] + sol, 0.6 + 0.005 * Math.sin(t * 2), HP[2]]; mN = [HN[0], 0.6, HN[2]]; cab = [0.35, 0, 0.1]; inc = 0.06;
    zz = kf(t, [[TM.prato + 0.4, 1], [TM.prato + 0.9, 1.6]]); }
  return {pos, ry, zz, er, c: {cor: COR_INV, ...F, cab: [F.cab ? F.cab[0] + cab[0] : cab[0], cab[1], cab[2]], sentado, mP, mN, inc, estica, acesa, t, fase: 0.4, resp: t * 3,
    roupa: <><Gravata /><Colete /></>, cabeca: <CabeloInv er={er} />}};
};
// bolas de aço na oficina (lado +x e lado -x)
const bolasOfi = (t, I) => {
  const naMao = (m) => [m[0], m[1] - 0.07, m[2]];
  const noPrato = (x, t0, quique = 0.06) => [x, 0.067 + Math.abs(Math.sin(cl((t - t0) / 0.35) * Math.PI)) * quique * Math.exp(-(t - t0) * 3), 0.12];
  if (t < TM.funciona) return [naMao(I.c.mP), naMao(I.c.mN)];
  if (t < TM.bola - 0.3) return [null, null];
  if (t < TM.bola + 0.2) { const y = kf(t, [[TM.bola - 0.25, 1.9], [TM.bola + 0.2, 0.55, inQ]]); return [[HP[0], y, HP[2]], [HN[0], y + 0.06, HN[2]]]; }
  if (t < TM.barulhao) {
    if (t < TM.despencam) return [naMao(I.c.mP), naMao(I.c.mN)];
    const u = cl((t - TM.despencam) / (TM.pratos2 - TM.despencam));
    return t < TM.pratos2 ? [[HP[0] + 0.05, lerp(0.525, 0.067, inQ(u)), HP[2]], [HN[0] - 0.05, lerp(0.525, 0.067, inQ(cl(u * 1.03))), HN[2]]] : [noPrato(0.42, TM.pratos2), noPrato(-0.42, TM.pratos2)];
  }
  if (t < TM.mas) return [noPrato(0.42, TM.pratos2), noPrato(-0.42, TM.pratos2)];
  if (t < TM.e1) return [naMao(I.c.mP), null];
  if (t < TM.puxa) { const u = cl((t - (TM.estrondo - 0.3)) / 0.3); return t < TM.estrondo ? [[0.46, lerp(0.5, 0.067, inQ(u)), 0.12], [-0.46, lerp(0.5, 0.067, inQ(u)), 0.12]] : [noPrato(0.46, TM.estrondo), noPrato(-0.46, TM.estrondo)]; }
  if (t < TM.gato - 0.15) { const r = kf(t, [[TM.nao, 0], [TM.nao + 0.9, 1, outQ]]); return [[0.42 + r * 0.55, 0.05 + 0.017 * (1 - r), 0.12 + r * 0.2], [-0.42 - r * 0.5, 0.05 + 0.017 * (1 - r), 0.12 + r * 0.25]]; }
  // fim: a bola da direita cai em cima do gato, quica e rola
  if (t < TM.prato) return [naMao(I.c.mP), naMao(I.c.mN)];
  const tb = TM.prato + 0.17;
  if (t < tb) return [[0.45, lerp(0.53, 0.215, inQ(cl((t - TM.prato) / 0.19))), 0.12], naMao(I.c.mN)];
  const u = cl((t - tb) / 0.5); const x = 0.45 + u * 0.2 + cl((t - tb - 0.5) / 0.8) * 0.25;
  return [[x, t < tb + 0.5 ? 0.215 + Math.sin(u * Math.PI) * 0.16 - u * 0.165 : 0.05, 0.12 + u * 0.1], naMao(I.c.mN)];
};
const pratosOfi = (t) => {
  if (t < TM.funciona || t > TM.e1) return [[0.42, 0, 0.12, settle(t, TM.pratos2, 1, 30, 4) + settle(t, TM.estrondo, 1, 30, 4)], [-0.42, 0, 0.12, settle(t, TM.pratos2, 1, 30, 4) + settle(t, TM.estrondo, 1, 30, 4)]];
  const u = kf(t, [[TM.dois2 > 0 ? W_('dois') - 0.05 : 0, 0], [TM.metal, 1, outQ]]);
  const tr = settle(t, TM.metal, 1.2, 26, 3.5);
  return [[lerp(1.9, 0.42, u), 0, 0.12, tr], [lerp(-1.9, -0.42, u), 0, 0.12, -tr]];
};
const poltronaOfi = (t) => {
  if (t < TM.funciona || t > TM.e1) return {y: 0, es: 0};
  const y = kf(t, [[TM.cima - 0.42, 3.4], [TM.cima, 0, inQ]]);
  return {y, es: t > TM.cima ? Math.max(0, settle(t, TM.cima, 1.2, 16, 5)) + Math.max(0, -settle(t, TM.cima, 0.5, 16, 5)) * -0.5 : 0};
};
// gato na oficina
const G0 = [0.85, 0, 0.55], LUM = [0.55, 2.8, 0.3];
const gatoOfi = (t) => {
  if (t < TM.barulhao) return {pos: G0, ry: -0.5, pose: 'dorme', olhos: 'fechado', olhoD: t > TM.genio + 0.1 && t < TM.funciona - 0.2 ? 'normal' : undefined};
  const tp = TM.barulhao + 0.42;
  const balc = settle(t, tp, 0.45, 5, 0.9);
  const ancora = [LUM[0] + Math.sin(balc) * 0.6, LUM[1] - Math.cos(balc) * 0.6, LUM[2] + 0.14];
  if (t < tp) { const u = cl((t - TM.barulhao - 0.04) / 0.38); return {pos: [lerp(G0[0], ancora[0], u), lerp(0.15, ancora[1] - 0.2, io(u)) + Math.sin(u * Math.PI) * 0.4, lerp(G0[2], ancora[2], u)], ry: -0.2, pose: 'salto', bal: -0.3 + u * 0.3, balLum: 0}; }
  if (t < TM.gato - 0.15) return {pos: ancora, ry: -0.25, pose: 'pendura', olhos: t < TM.pior ? 'grande' : 'bravo', eriça: kf(t, [[tp, 1], [TM.pior, 0.6]]), bal: balc, balLum: balc};
  // fim: enrolado em cima do prato da direita
  // a bola cai na cabeça do gato: ele leva o susto, mia bravo e pula para fora do prato
  const ti = TM.prato + 0.19, tp2 = ti + 0.1;
  if (t < tp2) return {pos: [0.47, 0.017, 0.12], ry: 0.15, pose: 'dorme', s: 0.92, olhos: 'fechado', olhoD: t > TM.gato + 0.1 && t < TM.esse + 0.35 ? 'normal' : (t > ti ? 'grande' : undefined)};
  const u = cl((t - tp2) / 1.3);
  return {pos: [lerp(0.47, 1.45, u), 0.2 + Math.sin(Math.min(1, u * 1.15) * Math.PI) * 0.7, lerp(0.12, 0.55, u)], ry: -0.4, pose: 'salto', bal: -0.5 + u * 0.6, s: 0.92};
};
const ZZ_DE = (I) => cabDe(I.pos, 1, 0.02);

// ---------- Dalí ----------
const faceDali = (t) => expr(t, [[0, {olhos: 'semi', palp: 0.72, boca: 'reta', sob: -0.2, vivo: 0.2}], [TM.chave + 0.22, {olhos: 'grande', boca: 'O', sob: -1, escOlho: 1.4, pop: 0.4, semPisca: true}], [TM.chave + 0.75, {olhos: 'grande', boca: 'sorrisoD', sob: -1, escOlho: 1.3, semPisca: true}]], 0.9);
const daliF = (t) => {
  const F = faceDali(t);
  const pos = [XD, 0.02, 0], mP = [XD + 0.42, 0.58 + 0.008 * Math.sin(t * 2), 0.12], mN = [XD - 0.3, 0.72, 0.24];
  const mola = t > TM.chave + 0.22 ? Math.exp(-(t - TM.chave - 0.22) * 2.5) : 0;
  return {pos, c: {cor: '#6D3A86', ...F, cab: [t < TM.chave + 0.22 ? 0.2 : -0.08, -0.08, 0.05], sentado: 1, mP, mN, t, fase: 0.9, resp: t * 3, roupa: <Gravata cor="#E9B44C" />, cabeca: <><CabeloDali /><BigodeDali mola={mola} /></>},
    chave: t < TM.chave ? [mP[0], mP[1] - 0.04, mP[2]] : [mP[0] + 0.02, kf(t, [[TM.chave, 0.54], [TM.chave + 0.22, 0.2, inQ]]) + Math.abs(Math.sin(cl((t - TM.chave - 0.22) / 0.25) * Math.PI)) * 0.04 * (t > TM.chave + 0.22 ? 1 : 0), mP[2]],
    chaveRot: t < TM.chave + 0.22 ? [0, 0.4, 0] : [0, 0.4, kf(t, [[TM.chave + 0.22, 0], [TM.chave + 0.5, 1.4, outQ]])]};
};

// ---------- prédio do sono: elevador, ideias e o inventor de touca ----------
const cyElev = (t) => {
  if (t < TM.porque + 0.6) return 2 * H_AND;
  if (t < TM.normal) return kf(t, [[TM.porque + 0.6, 2 * H_AND], [TM.andar, H_AND]]) + settle(t, TM.andar, 0.05, 14, 5);
  if (t < TM.descer) return 2 * H_AND;
  if (t < TM.puxa) return Math.max(0, kf(t, [[TM.descer, 2 * H_AND], [TM.tudo - 0.15, 0, inQ]])) + (t > TM.tudo - 0.15 ? Math.abs(settle(t, TM.tudo - 0.15, 0.12, 12, 6)) : 0);
  return kf(t, [[TM.puxa, 0], [TM.puxa + 0.45, H_AND + 0.35, outQ], [TM.puxa + 0.8, H_AND - 0.1], [TM.meio2, H_AND]]) + (t > TM.meio2 ? settle(t, TM.meio2, 0.04, 14, 5) : 0);
};
const faceSonho = (t) => expr(t, [
  [0, {olhos: 'semi', boca: 'reta', palp: 0.6}], [TM.andar, {olhos: 'normal', boca: 'O'}], [TM.esquisito, {olhos: 'grande', boca: 'O', sob: -0.8, pop: 0.3, olhar: [-0.6, 0.2]}],
  [TM.ideias + 0.15, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.7}], [TM.normal, {olhos: 'semi', palp: 0.6, boca: 'reta'}], [TM.descer + 0.15, {olhos: 'grande', boca: 'grito', sob: -1, semPisca: true}],
  [TM.tudo - 0.1, DORME], [TM.estrondo, {olhos: 'grande', boca: 'grito', sob: -1, trem: 1, semPisca: true, pop: 0.38}], [TM.meio2 + 0.1, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.6}],
], 0.6);
const sonhador = (t) => {
  const F = faceSonho(t); const y = cyElev(t); const S = 0.8;
  const pos = [XP + 1.62, y + 0.06, 0.02];
  const alegre = Math.max(kf(t, [[TM.ideias, 0], [TM.ideias + 0.15, 1, back], [TM.acordado, 1], [TM.acordado + 0.2, 0]]), 0);
  const pega = kf(t, [[TM.meio2, 0], [TM.meio2 + 0.4, 1]]);
  const susto = kf(t, [[TM.descer, 0], [TM.descer + 0.15, 1], [TM.tudo - 0.2, 1], [TM.tudo, 0]]) + kf(t, [[TM.estrondo, 0], [TM.estrondo + 0.1, 1], [TM.meio2, 1], [TM.meio2 + 0.2, 0]]);
  const base = (l) => [pos[0] + l * 0.17, pos[1] + 0.36, pos[2] + 0.06];
  const cima = (l) => [pos[0] + l * 0.26, pos[1] + 1.12, pos[2] + 0.1];
  const mP = mix(mix(base(1), cima(1), Math.min(1, alegre + susto)), [pos[0] - 0.32, pos[1] + 0.82, pos[2] + 0.2], pega);
  const mN = mix(base(-1), cima(-1), Math.min(1, alegre + susto));
  const acesa = kf(t, [[TM.ideias, 0], [TM.ideias + 0.2, 1], [TM.normal - 0.05, 1], [TM.normal, 0], [TM.meio2 + 0.05, 0], [TM.meio2 + 0.3, 1]]);
  return {pos, S, acesa, c: {cor: COR_INV, ...F, sentado: 0, mP: mP.map((v, i) => (v - pos[i]) / S), mN: mN.map((v, i) => (v - pos[i]) / S), t, fase: 0.6, resp: t * 3, acesa,
    roupa: <><Gravata /><Colete /></>, cabeca: <CabeloInv er={susto > 0.5 ? 1 : 0} touca={1} />}, mPw: mP, mNw: mN};
};
const objsSonho = (t) => {
  const H = H_AND;
  const U0 = [-0.75, H + 0.75 + Math.sin(t * 1.2) * 0.05, 0.15], V0 = [0.3, H + 0.6 + Math.sin(t * 1.5 + 1) * 0.05, 0.15], M = [-0.2, H + 0.72, 0.2];
  const j = kf(t, [[TM.junta - 0.05, 0], [TM.ideias + 0.02, 1, inQ]]);
  const poof = t > TM.ideias + 0.02;
  const someTudo = kf(t, [[TM.esquecer, 1], [TM.tudo + 0.1, 0]]) * (t < TM.puxa ? 1 : 0) + (t >= TM.puxa ? kf(t, [[TM.puxa + 0.4, 0], [TM.puxa + 0.7, 1]]) : 0);
  const outros = t < TM.esquecer ? 1 : someTudo;
  const mk = t < TM.ideias + 0.02 ? 0 : t < TM.esquecer ? kf(t, [[TM.ideias + 0.02, 0.2], [TM.ideias + 0.3, 1, back]]) : t < TM.puxa ? someTudo : kf(t, [[TM.meio2 - 0.3, 0], [TM.meio2, 1, back]]);
  const mp = t < TM.puxa ? kf(t, [[TM.ideias, M], [TM.juntaria + 0.6, [0.15, H + 0.95, 0.2]]]) : kf(t, [[TM.meio2, [0.6, H + 0.9, 0.2]], [TM.meio2 + 0.4, [1.3, H + 0.86, 0.22]]]);
  return {objs: {U: mix(U0, M, j), V: mix(V0, [M[0] + 0.1, M[1], M[2]], j), u: poof ? 0 : 1, v: poof ? 0 : 1, o: outros}, merge: {k: mk, p: mp}, poof};
};
const acordadoTopo = (t) => {
  const pos = [XP - 0.3, 2 * H_AND, 0.1];
  const nega = t > TM.nunca ? Math.sin((t - TM.nunca) * 16) * 0.4 * Math.exp(-(t - TM.nunca) * 2.2) : 0;
  const F = expr(t, [[0, {olhos: 'semi', boca: 'reta', sob: 0.4}], [TM.nunca, {olhos: 'bravo', boca: 'brava', sob: 0.8}]], 0.2);
  return {pos, c: {cor: COR_INV, ...F, cab: [0, nega, 0], sentado: 0, mP: [pos[0] - 0.1, pos[1] + 0.62, pos[2] + 0.2], mN: [pos[0] + 0.1, pos[1] + 0.66, pos[2] + 0.21], t, fase: 0.2, resp: t * 3, roupa: <><Gravata /><Colete /></>, cabeca: <CabeloInv />}};
};

// ---------- laboratório: voluntários e cientistas ----------
const VOL = [[-0.8, 0.2, '#7FB8E0'], [0, 0.2, '#E58FA0'], [0.8, 0.2, '#9FD08A'], [-0.8, -0.8, '#B79BE0'], [0, -0.8, '#F0B66A'], [0.8, -0.8, '#76C9C0'], [-0.8, -1.8, '#E9D36A'], [0, -1.8, '#A9B4C6'], [0.8, -1.8, '#E29B6B']].map(([x, z, cor], i) => ({x: XL + x, z, cor, fase: i * 0.77}));
const voluntario = (t, i) => {
  const v = VOL[i]; const pos = [v.x, 0.02, v.z];
  let F = {...DORME, vivo: 0}, cab = [0.25 + 0.07 * Math.sin(t * 1.3 + v.fase), 0, 0.06 * Math.sin(t * 0.7 + v.fase)], inc = 0.04, lat = 0, acesa = 0, zz = i === 4 || i === 7 ? 0.6 : 0, solta = false, garrafa;
  let mP = [v.x + 0.2, 0.52, v.z + 0.2], mN = [v.x - 0.16, 0.48, v.z + 0.22];
  garrafa = {p: [mP[0], mP[1] - 0.075, mP[2]], rot: [0, 0, 0]};
  if (i === 0) { // cochilo curto: a garrafa cai, ele acorda e acende
    F = expr(t, [[0, DORME], [TM.minutinho, {olhos: 'grande', boca: 'O', sob: -0.8, semPisca: true, pop: 0.35}], [TM.minutinho + 0.5, {olhos: 'feliz', boca: 'sorrisoD', bochecha: 0.6}], [TM.truque, {olhos: 'grande', boca: 'sorrisoD', sob: -0.6, pop: 0.3}]], 0.1);
    const tc = TM.cochilou + 0.12, tg = tc + 0.32;
    if (t > tc) { const u = cl((t - tc) / 0.32); garrafa = {p: [mP[0] + u * 0.05, t < tg ? lerp(0.445, 0.03, inQ(u)) : 0.03 + Math.abs(Math.sin(cl((t - tg) / 0.3) * Math.PI)) * 0.04 * Math.exp(-(t - tg) * 4), mP[2] + u * 0.08], rot: [0, 0, t < tg ? u * 0.8 : Math.PI / 2]}; mP = [mP[0] + 0.02, 0.5, mP[2]]; }
    if (t > TM.minutinho) cab = [0, 0, 0];
    acesa = kf(t, [[TM.minutinho + 0.2, 0], [TM.minutinho + 0.5, 1, outQ]]);
    const soco = kf(t, [[TM.truque, 0], [TM.truque + 0.2, 1, back], [TM.ja, 1]]); mP = mix(mP, [v.x + 0.26, 1.2, v.z + 0.22], soco);
  }
  if (i === 2) { // sono fundo demais: largado, roncando, a lâmpada pisca e queima
    cab = [0.45 + 0.04 * Math.sin(t * 1.1), 0, 0.3]; inc = -0.22; lat = -0.12; zz = 1;
    F = {...DORME, boca: 'O', abre: 0.4 + 0.3 * Math.sin(t * 2.2)};
    mP = [v.x + 0.3, 0.3, v.z + 0.22]; garrafa = {p: [v.x + 0.45, 0.03, v.z + 0.45], rot: [0, 0.6, Math.PI / 2]};
    const fl = t > TM.perdeu && t < TM.perdeu + 0.5 ? ((Math.floor((t - TM.perdeu) * 30) % 4) < 2 ? 0.7 : 0) : 0; acesa = fl;
  }
  return {pos, zz, acesa, garrafa, c: {cor: v.cor, ...F, cab, inc, lat, sentado: 1, mP, mN, t, fase: v.fase, resp: t * 3 + v.fase, acesa, vivo: 0.1}};
};
const Oculos = () => <group>{[-1, 1].map((l) => <mesh key={l} position={[l * 0.062, 0.19, 0.162]} rotation={[0, l * 0.35, 0]} material={B(LINHA)}><torusGeometry args={[0.045, 0.006, 6, 20]} /></mesh>)}<Linha a={[-0.018, 0.2, 0.17]} b={[0.018, 0.2, 0.17]} r={0.005} /></group>;
const Jaleco = () => <group>{[0.52, 0.62, 0.72].map((y, i) => <Esf key={i} r={0.012} p={[0.03, y, 0.18 - (y - 0.52) * 0.08]} m="#A9B4C6" line={0.3} seg={8} />)}<Cx a={[0.07, 0.07, 0.01]} p={[-0.08, 0.68, 0.16]} rot={[-0.15, 0.4, 0]} m="#DCE6EE" line={0.4} /></group>;
const cientista = (t, k) => {
  const pos = k === 0 ? [XL - 1.5, 0, 0.9] : [XL + 1.55, 0, -0.75], ry = k === 0 ? 0.55 : -0.55;
  const F = expr(t, k === 0 ? [[0, {olhos: 'normal', boca: 'sorriso', olhar: [0.6, -0.2]}], [TM.minutinho + 0.2, {olhos: 'grande', boca: 'O', sob: -0.6}], [TM.truque + 0.1, {olhos: 'feliz', boca: 'sorrisoD'}], [TM.perdeu, {olhos: 'semi', boca: 'triste', sob: -0.4}]]
    : [[0, {olhos: 'normal', boca: 'reta', olhar: [-0.5, -0.3]}], [TM.cochilando, {olhos: 'semi', boca: 'canto'}]], k * 1.3);
  const prancheta = [pos[0] + (k === 0 ? 0.1 : -0.1), 0.72, pos[2] + 0.2];
  return {pos, ry, prancheta, c: {cor: '#F4F4F2', ...F, sentado: 0, mN: [prancheta[0] - 0.05, prancheta[1] - 0.04, prancheta[2]], mP: [prancheta[0] + 0.1, prancheta[1] + 0.04 + 0.01 * Math.sin(t * 9), prancheta[2] + 0.03], t, fase: k, resp: t * 3 + k, cabeca: <><Oculos /><CabeloInv /></>, roupa: <Jaleco />}};
};
