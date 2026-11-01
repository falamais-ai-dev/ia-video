
// ================= vídeo 3: cenários =================
const PISO_LAB = () => lm('pisoLab', () => texTabuas('lab', '#A9784A', [5, 5]));
const PAREDE_LAB = () => lm('parLab', () => texReboco('lab', '#D6E4D2', ['#C2D4BE', '#E6EFE0', '#B8CBB2']));
const PAREDE_COL = () => lm('parCol', () => texReboco('col', '#E6F4F2', ['#F4FBFA', '#D8ECEA']));
const PAREDE_FAB = () => lm('parFab', () => texReboco('fab', '#D9C3A0', ['#C9AE86', '#E8D6B6']));
const PAREDE_QUA = () => lm('parQua', () => texPapelParede('qua', '#8FB8E8', '#7FA8DA', 'estrela'));
const texPedras = () => canvasTex('pedras', 1024, 1024, (g, w) => { SEED = 5; g.fillStyle = '#8E8A86'; g.fillRect(0, 0, w, w); for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) { const x = i * 64 + (j % 2) * 32, y = j * 64; g.fillStyle = ['#A39E98', '#9A948E', '#B0AAA2'][Math.floor(rnd() * 3)]; g.beginPath(); g.ellipse(x + 32, y + 32, 28, 26, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(55,44,46,0.6)'; g.lineWidth = 4; g.stroke(); } }, [8, 8]);
const texLama = () => canvasTex('lama', 1024, 1024, (g, w) => { SEED = 9; g.fillStyle = '#8A6A44'; g.fillRect(0, 0, w, w); for (let i = 0; i < 160; i++) { g.fillStyle = ['#7A5C3A', '#9C7A50', '#6E5234'][i % 3]; g.globalAlpha = 0.5; g.beginPath(); g.ellipse(rnd() * w, rnd() * w, 20 + rnd() * 70, 10 + rnd() * 30, rnd() * 3, 0, 7); g.fill(); } g.globalAlpha = 1; }, [6, 6]);
const Chao = ({p, a = [40, 40], m}) => <mesh position={p} rotation={[-Math.PI / 2, 0, 0]} material={m} receiveShadow><planeGeometry args={a} /></mesh>;
const PAPEIS = Array.from({length: 22}).map((_, i) => [Math.sin(i * 7.7) * 1.9, Math.cos(i * 3.3) * 0.9 - 0.5, i * 1.3]);
const IlhaLab = ({p, limpo = false, t = 0, bal = 0}) => (
  <group position={p}>
    <Cx a={[1.8, 0.8, 0.6]} p={[0, 0.4, 0]} m={limpo ? '#F4F4F2' : '#C9B48A'} line={0.8} />
    <Cx a={[1.9, 0.06, 0.7]} p={[0, 0.83, 0]} m={limpo ? '#FFFFFF' : '#5E4A3A'} line={0.8} />
    {[-0.6, 0, 0.6].map((x) => <Cx key={x} a={[0.5, 0.3, 0.01]} p={[x, 0.5, 0.305]} m={limpo ? '#E6EEF2' : '#B39E74'} line={0.4} sombra={false} />)}
    {limpo ? <>
      {Array.from({length: 6}).map((_, i) => <Petri key={i} k={'l' + i} p={[-0.65 + i * 0.26, 0.86, 0.1]} />)}
      {Array.from({length: 4}).map((_, i) => <Frasco key={'f' + i} p={[-0.45 + i * 0.3, 0.86, -0.15]} cor={['#7FC8E8', '#F2C94C', '#B57FE0', '#7FD08A'][i]} />)}
      <Microscopio p={[0.7, 0.86, -0.12]} />
    </> : <>
      <Pilha p={[-0.55, 0.86, 0.05]} n={11} bal={bal} />
      <Pilha p={[-0.3, 0.86, -0.15]} n={7} bal={bal * 0.6} />
      <Pilha p={[0.62, 0.86, 0.12]} n={5} bal={bal * 0.4} />
      <Microscopio p={[0.3, 0.86, -0.12]} rot={-0.3} />
      <Xicara p={[-0.02, 0.86, 0.15]} />
      {[0, 1, 2, 3, 4].map((i) => <Papel key={i} p={[-0.2 + i * 0.22, 0.865 + i * 0.002, -0.2 + (i % 2) * 0.25]} rot={[0, i * 0.8, 0]} />)}
      {[0, 1, 2].map((i) => <Frasco key={'f' + i} p={[0.75 + (i % 2) * 0.1, 0.86, -0.15 + i * 0.09]} cor={['#7FC8E8', '#F2C94C', '#B57FE0'][i]} nivel={0.3 + i * 0.2} />)}
    </>}
  </group>
);
const Pia = ({p, bal = 0, n = 14}) => (
  <group position={p}>
    <Cx a={[0.8, 0.82, 0.55]} p={[0, 0.41, 0]} m="#BFC9CF" line={0.8} />
    <Cx a={[0.7, 0.12, 0.45]} p={[0, 0.8, 0]} m="#E8EEF2" line={0.6} />
    <Ci rt={0.015} h={0.3} p={[0, 0.98, -0.2]} m={PRATA()} line={0.4} seg={8} />
    <Cx a={[0.03, 0.03, 0.15]} p={[0, 1.12, -0.13]} m={PRATA()} line={0.4} />
    <Pilha p={[-0.15, 0.86, 0.02]} n={n} bal={bal} />
    <Pilha p={[0.12, 0.86, -0.02]} n={Math.round(n * 0.7)} bal={-bal * 0.8} />
    <Pilha p={[0.05, 0.86, 0.15]} n={5} bal={bal * 0.5} />
  </group>
);
const Porta = ({p, abre = 0, placa = true, txt = 'FÉRIAS!\nVOLTO EM SETEMBRO', bal = 0}) => (
  <group position={p}>
    <Cx a={[0.95, 2.05, 0.06]} p={[0, 1.025, -0.02]} m="#6A4022" line={0.8} />
    <group position={[-0.42, 0, 0.02]} rotation={[0, -abre * 1.4, 0]}>
      <Cx a={[0.84, 1.95, 0.05]} p={[0.42, 0.975, 0]} m="#9A6A3E" line={0.8} />
      <Esf r={0.03} p={[0.76, 1.0, 0.04]} m={OURO()} line={0.4} seg={10} />
      {placa ? <group position={[0.42, 1.42, 0.03]} rotation={[0, 0, Math.sin(bal) * 0.25 * Math.exp(-bal * 0.3)]}><Placa p={[0, -0.12, 0.01]} txt={txt} w={0.56} h={0.24} fundo="#FFF4D6" fio /></group> : null}
    </group>
  </group>
);
const Lab = ({t, I}) => (
  <group>
    <Sala x={XLAB} piso={PISO_LAB()} parede={PAREDE_LAB()} janela={[1.0, 0.9]} janX={-0.9} lambri="#7C8F7A" />
    <IlhaLab p={[XLAB + 0.2, 0, -0.9]} bal={I.bal} t={t} />
    <Pia p={[XLAB + 1.85, 0, -1.85]} bal={I.bal * 1.3} n={I.nPia} />
    <Porta p={[XLAB - 2.0, 0, -2.17]} abre={I.porta} placa={I.placaFerias} bal={I.balPlaca} />
    <Arquivo p={[XLAB - 1.45, 0, -1.9]} abre={I.gaveta} teia={I.teia} />
    {I.aranha > 0 ? <Aranha p={[XLAB - 1.3, 1.25 - I.aranha * 0.35, -1.6]} t={t} /> : null}
    <Lixeira p={[XLAB + 1.3, 0, -0.35]} />
    {/* parede do fundo: prateleira, placa, calendário, relógio */}
    <Cx a={[1.1, 0.04, 0.22]} p={[XLAB + 0.75, 1.55, -2.08]} m="#8A5A34" line={0.6} />
    {[0, 1, 2, 3, 4].map((i) => <Frasco key={i} p={[XLAB + 0.35 + i * 0.2, 1.57, -2.05]} cor={['#7FC8E8', '#F2C94C', '#B57FE0', '#E8907F', '#7FD08A'][i]} s={1.2} />)}
    <Placa p={[XLAB + 0.15, 2.0, -2.17]} txt={'NÃO MEXA NA\nMINHA BAGUNÇA'} w={0.75} h={0.3} fundo="#FFE9A8" />
    <group position={[XLAB + 1.55, 1.85, -2.17]}><Placa p={[0, 0, 0]} txt={I.calTxt} w={0.4} h={0.5} fundo="#FFFFFF" tinta="#C0392B" moldura="#372C2E" /></group>
    <Relogio p={[XLAB - 0.35, 2.35, -2.16]} t={t} vel={I.relVel} />
    {/* papéis no chão */}
    {PAPEIS.map(([x, z, r], i) => <Papel key={i} p={[XLAB + x, 0.004 + i * 0.0004, z]} rot={[0, r, 0]} s={1.1} />)}
    {/* lâmpada do teto */}
    <Linha a={[XLAB + 0.2, 2.8, -0.9]} b={[XLAB + 0.2, 2.35, -0.9]} r={0.006} />
    <Co r={0.2} h={0.14} p={[XLAB + 0.2, 2.3, -0.9]} m="#4E7A64" line={0.6} seg={16} aberto />
    <Esf r={0.06} p={[XLAB + 0.2, 2.24, -0.9]} m={MAT('lampLab' + (I.luz > 0.5 ? 1 : 0), () => new THREE.MeshBasicMaterial({color: I.luz > 0.5 ? '#FFF2B8' : '#8E8A7A'}))} line={0.3} seg={10} />
  </group>
);
const LabLimpo = ({t}) => (
  <group>
    <Sala x={XCOL} piso={lm('pisoCol', () => texTabuas('col', '#D9C8A8', [5, 5]))} parede={PAREDE_COL()} lambri="#BFD9D6" />
    <IlhaLab p={[XCOL + 0.2, 0, -0.9]} limpo />
    <Placa p={[XCOL - 0.55, 1.95, -2.17]} txt={'TUDO NO\nLUGAR'} w={0.6} h={0.3} fundo="#FFFFFF" tinta="#2E7D6B" />
    {/* estante de prêmios vazia, com teia */}
    <group position={[XCOL + 1.15, 0, -2.0]}>
      <Cx a={[0.9, 1.6, 0.3]} p={[0, 0.8, 0]} m="#E9DCC4" line={0.8} />
      {[0.45, 0.9, 1.35].map((y) => <Cx key={y} a={[0.84, 0.03, 0.26]} p={[0, y, 0.03]} m="#C9B48A" line={0.4} />)}
      <Placa p={[0, 1.72, 0.16]} txt="NOSSOS PRÊMIOS" w={0.85} h={0.16} fundo="#F7D24A" />
      <mesh position={[0.3, 1.25, 0.16]} material={MAT('teiaM', () => new THREE.MeshBasicMaterial({map: texTeia(), transparent: true, depthWrite: false}))}><planeGeometry args={[0.3, 0.3]} /></mesh>
    </group>
    <Brilhos pts={[[XCOL - 0.4, 0.95, -0.7], [XCOL + 0.5, 0.95, -0.8], [XCOL + 0.1, 0.92, -0.6], [XCOL - 0.7, 1.0, -0.9], [XCOL + 0.8, 1.05, -0.95], [XCOL - 1.6, 0.05, -0.2], [XCOL + 1.6, 0.05, 0.2]]} t={t} t0={TM.bancada - 0.2} s={0.16} />
  </group>
);
// placa de Petri gigante para os planos de perto
const PlacaGigante = ({t, M}) => (
  <group>
    <Sala x={XPL} piso={lm('pisoPl', () => texTabuas('pl', '#8A5A34', [3, 3]))} parede={PAREDE_LAB()} lambri="#7C8F7A" larg={8} prof={6} />
    <Ci rt={1.2} h={0.06} p={[XPL, 0.03, -0.3]} m={MAT('vidroG', () => new THREE.MeshToonMaterial({color: '#CFE9F2', gradientMap: GRAD, transparent: true, opacity: 0.35}))} line={1} seg={48} aberto />
    <mesh position={[XPL, 0.02, -0.3]} rotation={[-Math.PI / 2, 0, 0]} material={MAT('agarG', () => new THREE.MeshToonMaterial({color: '#F1D27A', gradientMap: GRAD}))} receiveShadow><circleGeometry args={[1.18, 48]} /></mesh>
    {M.anel > 0 ? <mesh position={[XPL - 0.45, 0.023, -0.55]} rotation={[-Math.PI / 2, 0, 0]} material={MAT('anel', () => new THREE.MeshBasicMaterial({color: '#FFF8DC', transparent: true, opacity: 0.6}))}><circleGeometry args={[0.55 * M.anel, 40]} /></mesh> : null}
    {M.halo > 0 ? <Halo p={[XPL - 0.45, 0.15, -0.5]} k={M.halo} s={1.6} id={7} /> : null}
    <Mofo p={[XPL - 0.45, 0.02, -0.55]} s={M.s} t={t} cara={M.cara} capa={M.capa} />
    {M.bact.map((b, i) => b.vis ? <Bacteria key={i} p={b.p} cor={b.cor} s={b.s} t={t} fase={i} susto={b.susto} /> : null)}
    {M.pows.map((q, i) => <Faisca key={i} id={200 + i} p={q.p} k={q.k} s={0.35} />)}
  </group>
);
const Rua = ({t, multidao}) => (
  <group>
    <Chao p={[XRUA, 0, 0]} m={lm('pedrasM', texPedras)} />
    <Cx a={[14, 0.12, 1.2]} p={[XRUA, 0.06, -2.0]} m="#B8B0A6" line={0.6} />
    <Fachada p={[XRUA, 0, -2.9]} w={3.2} h={4.2} k="hosp" cor="#E2CFA8" />
    <Placa p={[XRUA, 2.75, -2.68]} txt="HOSPITAL ST. MARY'S" w={2.2} h={0.32} fundo="#2E4A6B" tinta="#FFF4D6" borda="#F7D24A" />
    <Cx a={[0.9, 1.3, 0.1]} p={[XRUA, 0.65, -2.68]} m="#5E3A22" line={0.7} />
    <Fachada p={[XRUA - 3.0, 0, -3.0]} w={2.6} h={3.4} k="a" cor="#B86A4E" />
    <Fachada p={[XRUA + 3.0, 0, -3.0]} w={2.6} h={3.8} k="b" cor="#A85E48" />
    <Fachada p={[XRUA - 5.6, 0, -3.1]} w={2.4} h={4.4} k="c" cor="#C98F6B" />
    <Fachada p={[XRUA + 5.6, 0, -3.1]} w={2.4} h={3.2} k="d" cor="#B97B5E" />
    {[-4.2, -1.8, 1.8, 4.2].map((x) => <Poste key={x} p={[XRUA + x, 0.12, -1.55]} />)}
    <Torre p={[XRUA + 3.5, 0, -16]} s={1.3} />
    {t > TM.londres - 0.2 && t < TM.alexander + 0.2 ? <Onibus p={[XRUA + lerp(-7, 6, cl((t - TM.londres + 0.2) / 2.8)), 0, -0.9]} t={t} /> : null}
    {t > TM.mil - 0.1 && t < TM.alexander + 0.2 ? <group position={[XRUA, 2.1, -1.5]} scale={[1, kf(t, [[TM.mil - 0.1, 0], [TM.mil + 0.15, 1, back]]), 1]}><Placa p={[0, 0, 0]} txt="LONDRES, 1928" w={1.6} h={0.36} fundo="#F7D24A" moldura={null} /><Linha a={[-0.8, 0.18, 0]} b={[-1.8, 0.1, 0]} r={0.005} /><Linha a={[0.8, 0.18, 0]} b={[1.8, 0.1, 0]} r={0.005} /></group> : null}
    {[[-6, 3.5, -8, 5], [5, 4.5, -9, 6], [0, 6, -12, 7]].map(([x, y, z, s], i) => <Nuvem key={i} id={80 + i} p={[XRUA + x, y, z]} s={s} />)}
    {multidao}
  </group>
);
const Fabrica = ({t}) => (
  <group>
    <Sala x={XFAB} piso={lm('pisoFab', () => texTabuas('fab', '#9A7A5A', [5, 5]))} parede={PAREDE_FAB()} larg={6} lambri="#6A5A4A" />
    <Placa p={[XFAB, 2.3, -2.17]} txt="OXFORD" w={1.1} h={0.3} fundo="#2E4A6B" tinta="#FFF4D6" borda="#F7D24A" />
    {[-1.9, -1.2, 1.3, 2.0].map((x, i) => <group key={i} position={[XFAB + x, 0, -1.7]}>
      <Ci rt={0.32} h={1.5} p={[0, 0.85, 0]} m="#C98A4A" line={0.8} seg={22} />
      <Esf r={0.32} p={[0, 1.6, 0]} s={[1, 0.4, 1]} m="#C98A4A" line={0.8} seg={22} />
      <Ci rt={0.04} h={0.8} p={[0, 2.1, 0]} m="#8E98A3" line={0.5} seg={8} />
      <Ci rt={0.1} h={0.02} p={[0.2, 1.0, 0.25]} rot={[Math.PI / 2, 0, 0]} m="#F4F0E6" line={0.5} seg={16} />
      <Cx a={[0.01, 0.08, 0.005]} p={[0.2, 1.0, 0.27]} rot={[0, 0, t * (2 + i)]} m={LINHA} line={0} />
    </group>)}
    <Cx a={[3.8, 0.1, 0.45]} p={[XFAB, 0.75, -0.6]} m="#4A4E56" line={0.8} />
    <Cx a={[3.8, 0.7, 0.4]} p={[XFAB, 0.37, -0.6]} m="#6E7682" line={0.8} />
    {Array.from({length: 14}).map((_, i) => { const x = ((i * 0.3 + t * 0.6) % 4.2) - 2.1; return <Frasco key={i} p={[XFAB + x, 0.8, -0.6]} cor="#F2C94C" brilho={1} />; })}
    {Array.from({length: 5}).map((_, j) => <group key={'pr' + j}><Cx a={[1.2, 0.03, 0.2]} p={[XFAB - 2.25 + (j % 2) * 4.5, 0.9 + Math.floor(j / 2) * 0.45, -1.0]} rot={[0, (j % 2 ? -1 : 1) * Math.PI / 2, 0]} m="#8A5A34" line={0.5} />{Array.from({length: 5}).map((_, i) => <Frasco key={i} p={[XFAB - 2.25 + (j % 2) * 4.5, 0.92 + Math.floor(j / 2) * 0.45, -1.4 + i * 0.2]} cor="#F2C94C" s={0.9} />)}</group>)}
    <Placa p={[XFAB + 1.65, 1.15, -0.37]} txt={'PENICILINA\nEM MASSA'} w={0.6} h={0.3} fundo="#FFFFFF" tinta="#C0392B" />
  </group>
);
const AVIOES = [[-6, 5, -9, 0], [-9, 5.8, -11, 1.5]];
const Guerra = ({t}) => (
  <group>
    <Chao p={[XGUE, 0, 0]} m={lm('lamaM', texLama)} />
    <Barraca p={[XGUE - 1.6, 0, -2.2]} s={1.4} cor="#E8E2D0" cruz />
    <Barraca p={[XGUE + 1.4, 0, -2.6]} s={1.2} />
    <Barraca p={[XGUE + 3.2, 0, -3.5]} s={1.3} />
    <Barraca p={[XGUE - 3.8, 0, -3.2]} s={1.2} />
    <Sacos p={[XGUE + 0.9, 0, 0.55]} n={5} />
    <Sacos p={[XGUE - 1.4, 0, 0.7]} n={4} ry={0.3} />
    {[-2.4, -1.4, 2.2, 3.0].map((x, i) => <group key={i}><Ci rt={0.025} h={0.55} p={[XGUE + x, 0.27, 1.1]} m="#6A4A2E" line={0.5} seg={6} /></group>)}
    <Linha a={[XGUE - 2.4, 0.45, 1.1]} b={[XGUE - 1.4, 0.4, 1.1]} r={0.004} cor="#8E98A3" />
    <Linha a={[XGUE + 2.2, 0.45, 1.1]} b={[XGUE + 3.0, 0.4, 1.1]} r={0.004} cor="#8E98A3" />
    <Placa p={[XGUE - 1.6, 1.7, -1.4]} txt="ENFERMARIA" w={0.8} h={0.2} fundo="#FFFFFF" tinta="#C0392B" />
    {/* catre */}
    <Cx a={[0.6, 0.06, 1.3]} p={[XGUE - 0.5, 0.35, -0.6]} m="#8C8A4E" line={0.7} />
    {[-1, 1].map((l) => [-1, 1].map((m2) => <Ci key={l + '' + m2} rt={0.02} h={0.35} p={[XGUE - 0.5 + l * 0.27, 0.17, -0.6 + m2 * 0.6]} m="#5E4A3A" line={0.4} seg={6} />))}
    {AVIOES.map(([x, y, z, f], i) => { const px = XGUE + x + ((t * 1.2 + f) % 14); return <group key={i} position={[px, y, z]} rotation={[0, 0, Math.sin(t + i) * 0.1]}><Cx a={[0.9, 0.12, 0.14]} m="#7A7F5A" line={0.6} /><Cx a={[0.16, 0.03, 1.2]} p={[0.15, 0.05, 0]} m="#7A7F5A" line={0.6} /><Cx a={[0.12, 0.2, 0.03]} p={[-0.4, 0.1, 0]} m="#7A7F5A" line={0.5} /></group>; })}
    {[[-5, 4, -10, 6], [4, 5, -12, 7]].map(([x, y, z, s], i) => <Nuvem key={i} id={90 + i} p={[XGUE + x, y, z]} s={s} />)}
  </group>
);
const PLATEIA = Array.from({length: 9}).map((_, i) => [(i - 4) * 0.45 + (i % 2) * 0.1, 0.9 + (i % 3) * 0.12, ['#4A5A8A', '#8A4A5A', '#4A7A5A', '#6A5A8A', '#8A6A3A'][i % 5]]);
const Palco = ({t}) => (
  <group>
    <Chao p={[XNOB, 0, 0]} m={lm('pisoNob', () => texTabuas('nob', '#8A4A2A', [6, 6]))} />
    <Cx a={[6, 0.4, 2.4]} p={[XNOB, 0.2, -1.2]} m="#6A3A22" line={0.8} />
    <Cortina p={[XNOB - 2.2, 0.4, -2.3]} w={2} h={3.2} />
    <Cortina p={[XNOB + 2.2, 0.4, -2.3]} w={2} h={3.2} />
    <Cortina p={[XNOB, 0.4, -2.5]} w={6} h={3.2} />
    {Array.from({length: 12}).map((_, i) => <Co key={i} r={0.28} h={0.35} p={[XNOB - 2.75 + i * 0.5, 3.55, -2.2]} rot={[Math.PI, 0, 0]} m="#B3263A" line={0.5} seg={8} />)}
    <Placa p={[XNOB, 2.75, -2.2]} txt={'PRÊMIO NOBEL\n1945'} w={1.8} h={0.55} fundo="#F7D24A" tinta="#6A3A22" borda="#6A3A22" />
    <Cx a={[0.5, 0.9, 0.35]} p={[XNOB + 1.3, 0.85, -0.6]} m="#8A5A34" line={0.7} />
    {[-1.2, 0, 1.2].map((x, i) => <mesh key={i} position={[XNOB + x, 2.0, -0.9]} material={MAT('foco', () => new THREE.MeshBasicMaterial({color: '#FFF6C8', transparent: true, opacity: 0.16, depthWrite: false}))}><coneGeometry args={[0.55, 3.2, 20, 1, true]} /></mesh>)}
  </group>
);
const Quarto = ({t}) => (
  <group>
    <Sala x={XQUA} piso={lm('pisoQua', () => texTabuas('qua', '#C99A6A', [5, 5]))} parede={PAREDE_QUA()} lambri="#FFFFFF" janela={[0.9, 0.8]} janX={0.9} />
    <Cama p={[XQUA - 1.4, 0, -1.3]} />
    <Porta p={[XQUA + 2.0, 0, -2.17]} placa txt={'CIENTISTA\nTRABALHANDO'} abre={0.6} />
    {Array.from({length: 14}).map((_, i) => <Brinquedo key={i} p={[XQUA + Math.sin(i * 5.1) * 1.8, 0, Math.cos(i * 2.7) * 0.8 - 0.6]} tipo={i % 3} rot={i * 0.9} />)}
    <Placa p={[XQUA - 0.2, 1.9, -2.17]} txt={'LABORATÓRIO\nSECRETO'} w={0.7} h={0.3} fundo="#FFE9A8" tinta="#2E4A6B" />
    <Gato pos={[XQUA - 1.4, 0.45, -1.2]} ry={0.4} pose="dorme" olhos="fechado" t={t} />
  </group>
);
