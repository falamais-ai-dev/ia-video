
// ---------- casca de sala (piso, 3 paredes, teto com vigas) ----------
const Plano = ({p, rot, a, m, recebe = true}) => <mesh position={p} rotation={rot} material={m} receiveShadow={recebe}><planeGeometry args={a} /></mesh>;
const Sala = ({x = 0, piso, parede, lambri = '#8A5A34', teto = '#E9DCC4', larg = 5.2, prof = 4.4, alt = 2.8, janela, vista = 'cidade', janX = -0.4}) => {
  const L = larg / 2, zb = -2.2;
  return (
    <group position={[x, 0, 0]}>
      <Plano p={[0, 0, 0]} rot={[-Math.PI / 2, 0, 0]} a={[larg + 2, prof + 4]} m={piso} />
      <Plano p={[0, alt / 2, zb]} rot={[0, 0, 0]} a={[larg, alt]} m={parede} />
      <Plano p={[-L, alt / 2, zb + prof / 2]} rot={[0, Math.PI / 2, 0]} a={[prof, alt]} m={parede} />
      <Plano p={[L, alt / 2, zb + prof / 2]} rot={[0, -Math.PI / 2, 0]} a={[prof, alt]} m={parede} />
      <Plano p={[0, alt, zb + prof / 2]} rot={[Math.PI / 2, 0, 0]} a={[larg, prof]} m={T(teto)} recebe={false} />
      {[-1.2, 0, 1.2].map((z, i) => <Cx key={'vg' + i} a={[larg, 0.12, 0.14]} p={[0, alt - 0.06, z]} m="#7A4E2C" sombra={false} line={0.7} />)}
      {/* lambri (meia-parede de madeira) com rodapé */}
      <Cx a={[larg, 0.75, 0.04]} p={[0, 0.375, zb + 0.02]} m={lambri} sombra={false} line={0.7} />
      <Cx a={[larg, 0.05, 0.07]} p={[0, 0.77, zb + 0.035]} m="#6A4022" sombra={false} line={0.6} />
      {[-1, 1].map((l) => <group key={'lb' + l}><Cx a={[0.04, 0.75, prof]} p={[l * (L - 0.02), 0.375, zb + prof / 2]} m={lambri} sombra={false} line={0.7} /><Cx a={[0.07, 0.05, prof]} p={[l * (L - 0.035), 0.77, zb + prof / 2]} m="#6A4022" sombra={false} line={0.6} /></group>)}
      {janela ? <group position={[janX, 1.62, zb + 0.01]}>
        <mesh position={[0, 0, -0.3]} material={MAT('vistaM' + vista, () => new THREE.MeshBasicMaterial({map: texVista(vista), fog: false}))}><planeGeometry args={[janela[0] * 1.8, janela[1] * 1.6]} /></mesh>
        {/* recorte: a parede fica na frente; a janela é um buraco com moldura */}
        <Cx a={[janela[0] + 0.12, 0.08, 0.1]} p={[0, janela[1] / 2, 0.02]} m="#F2E6CF" line={0.7} sombra={false} />
        <Cx a={[janela[0] + 0.22, 0.07, 0.16]} p={[0, -janela[1] / 2, 0.05]} m="#F2E6CF" line={0.7} sombra={false} />
        {[-1, 1].map((l) => <Cx key={l} a={[0.08, janela[1], 0.1]} p={[l * janela[0] / 2, 0, 0.02]} m="#F2E6CF" line={0.7} sombra={false} />)}
        <Cx a={[0.04, janela[1], 0.05]} p={[0, 0, 0.0]} m="#F2E6CF" line={0.5} sombra={false} />
        <Cx a={[janela[0], 0.04, 0.05]} p={[0, 0, 0.0]} m="#F2E6CF" line={0.5} sombra={false} />
      </group> : null}
    </group>
  );
};
// parede de fundo com buraco de janela: a parede é feita em 4 pedaços em volta do vão
const ParedeComJanela = ({x = 0, larg = 5.2, alt = 2.8, jw, jh, jx = 0, jy = 1.62, m, z = -2.2}) => {
  const L = larg / 2, a = jx - jw / 2, b = jx + jw / 2, c = jy - jh / 2, d = jy + jh / 2;
  return <group position={[x, 0, z]}>
    <Plano p={[(-L + a) / 2, alt / 2, 0]} a={[a + L, alt]} m={m} />
    <Plano p={[(b + L) / 2, alt / 2, 0]} a={[L - b, alt]} m={m} />
    <Plano p={[jx, c / 2, 0]} a={[jw, c]} m={m} />
    <Plano p={[jx, (d + alt) / 2, 0]} a={[jw, alt - d]} m={m} />
  </group>;
};

// ---------- oficina do inventor ----------
const PISO_OFI = () => lm('pisoOfi', () => texTabuas('ofi', '#B47A45', [5, 5]));
const PAREDE_OFI = () => lm('parOfi', () => texReboco('ofi', '#EBD9B4', ['#D9BF92', '#F6E8C8', '#CFB487']));
const Bancada = ({p, t}) => (
  <group position={p}>
    <Cx a={[1.3, 0.07, 0.6]} p={[0, 0.8, 0]} m={lm('bancadaM', () => texTabuas('banc', '#9A6232', [1, 1]))} />
    {[[-0.6, -0.25], [0.6, -0.25], [-0.6, 0.25], [0.6, 0.25]].map(([x, z], i) => <Cx key={i} a={[0.07, 0.8, 0.07]} p={[x, 0.4, z]} m="#7A4A26" line={0.6} />)}
    <Cx a={[1.2, 0.04, 0.5]} p={[0, 0.25, 0]} m="#7A4A26" line={0.6} />
    <Gramofone p={[-0.38, 0.835, -0.05]} rot={0.5} />
    <Lampada p={[0.05, 0.835, 0.1]} s={1.2} acesa={0} /><Lampada p={[0.22, 0.835, 0.0]} s={0.9} /><Lampada p={[0.36, 0.835, 0.15]} s={1} />
    <Engrenagem p={[0.4, 0.95, -0.22]} r={0.1} rot={[0, -0.2, 0.2]} /><Engrenagem p={[0.53, 0.88, -0.2]} r={0.06} rot={[0, -0.2, 0.1 + t]} />
    <Pote p={[-0.05, 0.835, -0.2]} cor="#6FB7C9" /><Pote p={[0.12, 0.835, -0.22]} cor="#E07A5F" h={0.2} r={0.045} />
    {[-0.3, -0.1, 0.1].map((x, i) => <Pote key={'b' + i} p={[x, 0.29, 0.05]} cor={['#7E9A45', '#C9A34A', '#8E6BD8'][i]} h={0.24} r={0.07} />)}
  </group>
);
const Prateleira = ({p, t, pulo = 0}) => (
  <group position={p}>
    {[0, 0.42].map((y, j) => <group key={j}>
      <Cx a={[1.1, 0.04, 0.22]} p={[0, y, 0]} m="#8A5A34" line={0.6} />
      {[-0.4, -0.22, -0.05, 0.12, 0.3, 0.44].map((x, i) => { const k = (i + j) % 3; const pl = Math.max(0, pulo * Math.sin((i * 1.7 + j) * 3 + t * 30) * 0.03);
        return k === 0 ? <Pote key={i} p={[x, y + 0.02 + pl, 0]} cor={['#6FB7C9', '#E07A5F', '#9FD08A', '#E9B44C'][(i + j) % 4]} h={0.14 + (i % 2) * 0.05} r={0.04} />
          : k === 1 ? <Cx key={i} a={[0.06, 0.2, 0.15]} p={[x, y + 0.12 + pl, 0]} rot={[0, 0, (i % 2 ? 0.12 : 0)]} m={['#7B3F8C', '#2F6F6A', '#C2483E'][(i + j) % 3]} line={0.6} />
          : <Lampada key={i} p={[x, y + 0.02 + pl, 0]} s={0.8} />; })}
    </group>)}
  </group>
);
const Oficina = ({t, pulo = 0, balLum = 0}) => (
  <group>
    <Sala x={0} piso={PISO_OFI()} parede={PAREDE_OFI()} />
    <Plano p={[0, 0.003, 0.15]} rot={[-Math.PI / 2, 0, 0]} a={[2.0, 2.0]} m={MAT('tapM', () => new THREE.MeshToonMaterial({map: texTapete(), gradientMap: GRAD, transparent: true, alphaTest: 0.5}))} />
    <Bancada p={[-1.6, 0, -1.65]} t={t} />
    <Prateleira p={[1.35, 1.25, -2.08]} t={t} pulo={pulo} />
    <mesh position={[-0.15, 1.62, -2.18]} material={lm('rascM', texRascunhos)}><planeGeometry args={[1.25, 0.88]} /></mesh>
    <Cx a={[1.33, 0.05, 0.04]} p={[-0.15, 2.08, -2.17]} m="#7A4E2C" line={0.6} sombra={false} /><Cx a={[1.33, 0.05, 0.04]} p={[-0.15, 1.16, -2.17]} m="#7A4E2C" line={0.6} sombra={false} />
    <Luminaria p={[0.55, 2.8, 0.3]} t={t} bal={balLum} />
    {/* janela na parede da esquerda (luz do fim da tarde) */}
    <group position={[-2.58, 1.55, -0.6]} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.02]} material={MAT('vistaOfi', () => new THREE.MeshBasicMaterial({map: texVista('cidade'), fog: false}))}><planeGeometry args={[0.9, 1.05]} /></mesh>
      {[[0, 0.55, 1.05, 0.08], [0, -0.56, 1.12, 0.08], [-0.49, 0, 0.08, 1.15], [0.49, 0, 0.08, 1.15], [0, 0, 0.04, 1.05], [0, 0, 0.9, 0.04]].map(([x, y, w, h], i) => <Cx key={i} a={[w, h, 0.08]} p={[x, y, 0.02]} m="#F2E6CF" line={0.6} sombra={false} />)}
    </group>
    {/* vaso de planta no canto e relógio de parede */}
    <group position={[2.0, 0, -1.7]}><Ci rt={0.16} rb={0.12} h={0.3} p={[0, 0.15, 0]} m="#C2674A" line={0.7} />{[0, 1, 2, 3, 4].map((i) => <Esf key={i} r={0.14} p={[Math.sin(i * 1.3) * 0.12, 0.42 + i * 0.07, Math.cos(i * 1.3) * 0.1]} s={[1, 0.6, 1]} m={i % 2 ? '#6E9A44' : '#5E8A3A'} line={0.6} seg={12} />)}</group>
    <group position={[1.35, 2.2, -2.17]}><Ci rt={0.16} h={0.04} rot={[Math.PI / 2, 0, 0]} m="#F7EBD2" line={0.7} seg={28} /><Linha a={[0, 0, 0.03]} b={[0, 0.1, 0.03]} r={0.008} /><Linha a={[0, 0, 0.03]} b={[Math.sin(t * 0.5) * 0.07, Math.cos(t * 0.5) * 0.07, 0.03]} r={0.006} /></group>
  </group>
);
// cabelo do inventor: tufos grisalhos dos lados (espetados no susto)
const CabeloInv = ({er = 0, touca = 0}) => (
  <group>
    {[-1, 1].map((l) => [0, 1, 2].map((i) => <Esf key={l + '' + i} r={0.045} p={[l * (0.16 + i * 0.012), 0.2 + i * 0.035 + er * 0.03, -0.03 - i * 0.02]} s={[0.8, 1 + er * 0.8, 0.9]} rot={[0, 0, -l * er * 0.6]} m="#DCD7CF" line={0.5} seg={10} />))}
    {[-0.05, 0.03, 0.09].map((x, i) => <Co key={'t' + i} r={0.026} h={0.03 + er * 0.12} p={[x, 0.345 + er * 0.03, -0.02]} rot={[0, 0, -x * 4 + (i - 1) * er * 0.4]} m="#DCD7CF" seg={8} line={0.5} />)}
    {touca > 0 ? <group position={[0, 0.3, -0.01]} rotation={[-0.15, 0, 0.35]}><Co r={0.15} h={0.32} p={[0.05, 0.12, 0]} rot={[0, 0, -0.5]} m="#6A6FD6" seg={18} line={0.7} /><Ci rt={0.155} h={0.05} m="#F4F0FF" seg={20} line={0.6} /><Esf r={0.04} p={[0.22, 0.2, 0]} m="#F4F0FF" line={0.5} seg={10} /></group> : null}
  </group>
);
const Gravata = ({cor = '#B83A3A'}) => <group position={[0, 0.86, 0.13]} rotation={[0.2, 0, 0]}>{[-1, 1].map((l) => <Co key={l} r={0.032} h={0.06} p={[l * 0.03, 0, 0]} rot={[0, 0, -l * Math.PI / 2]} m={cor} seg={4} line={0.5} />)}<Esf r={0.014} m={cor} line={0.4} seg={8} /></group>;
const Colete = () => <group>{[0.58, 0.67, 0.76].map((y, i) => <Esf key={i} r={0.012} p={[0, y, 0.175 - (y - 0.58) * 0.1]} m="#6A4022" line={0.3} seg={8} />)}</group>;
// guarda-chuva, ventilador e a ideia que junta os dois (guarda-chuva com hélice)
const GuardaChuva = ({p, rot = [0, 0, 0], s = 1, aberto = 1}) => (
  <group position={p} rotation={rot} scale={s}>
    <Tn geo={<coneGeometry args={[0.24 * aberto + 0.04, 0.12, 8, 1, true]} />} p={[0, 0.06, 0]} m={T('#D8323C', {side: THREE.DoubleSide})} line={0.7} />
    <Linha a={[0, 0.12, 0]} b={[0, -0.3, 0]} r={0.008} cor="#5A3720" />
    <mesh position={[0.03, -0.3, 0]} rotation={[0, 0, Math.PI]} material={B('#5A3720')}><torusGeometry args={[0.03, 0.008, 6, 12, Math.PI]} /></mesh>
  </group>
);
const Ventilador = ({p, rot = [0, 0, 0], s = 1, gira = 0, base = true}) => (
  <group position={p} rotation={rot} scale={s}>
    {base ? <><Ci rt={0.08} rb={0.1} h={0.03} p={[0, -0.2, 0]} m="#2F6F6A" seg={18} line={0.6} /><Linha a={[0, -0.19, 0]} b={[0, -0.04, 0]} r={0.012} cor="#2F6F6A" /></> : null}
    <Esf r={0.04} p={[0, 0, -0.02]} m="#2F6F6A" line={0.6} seg={12} />
    <group position={[0, 0, 0.03]} rotation={[0, 0, gira]}>{[0, 1, 2].map((i) => <Esf key={i} r={0.08} p={[Math.cos(i * 2.094) * 0.07, Math.sin(i * 2.094) * 0.07, 0]} s={[1, 0.45, 0.12]} rot={[0, 0, i * 2.094]} m="#9FD8E8" line={0.5} seg={12} />)}</group>
    <mesh position={[0, 0, 0.04]} material={B(LINHA)}><torusGeometry args={[0.15, 0.004, 4, 30]} /></mesh>
  </group>
);
const Invencao = ({p, rot = [0, 0, 0], s = 1, gira = 0}) => (
  <group position={p} rotation={rot} scale={s}>
    <GuardaChuva p={[0, 0, 0]} />
    <Linha a={[0, 0.12, 0]} b={[0, 0.2, 0]} r={0.01} cor="#2F6F6A" />
    <group position={[0, 0.21, 0]} rotation={[0, gira, 0]}>{[0, 1, 2].map((i) => <Esf key={i} r={0.11} p={[Math.cos(i * 2.094) * 0.1, 0, Math.sin(i * 2.094) * 0.1]} s={[1, 0.1, 0.35]} rot={[0, -i * 2.094, 0]} m="#9FD8E8" line={0.5} seg={12} />)}<Esf r={0.025} m="#2F6F6A" line={0.4} seg={8} /></group>
  </group>
);
const Peixe = ({p, t}) => <group position={p} rotation={[0, Math.sin(t * 1.3) * 0.4, Math.sin(t * 2) * 0.1]}><Esf r={0.08} s={[1.4, 0.8, 0.5]} m="#F2A541" line={0.6} seg={14} /><Co r={0.06} h={0.08} p={[-0.13, 0, 0]} rot={[0, 0, Math.PI / 2]} s={[1, 1, 0.3]} m="#E07A5F" seg={4} line={0.5} /><Esf r={0.015} p={[0.07, 0.02, 0.035]} m={B(LINHA)} line={0} seg={6} /></group>;
const Bule = ({p, t}) => <group position={p} rotation={[0.2, t * 0.4, 0.15]}><Esf r={0.09} s={[1, 0.85, 1]} m="#76C9C0" line={0.6} seg={14} /><Co r={0.025} h={0.12} p={[0.11, 0.03, 0]} rot={[0, 0, -1.1]} m="#76C9C0" seg={8} line={0.5} /><Esf r={0.025} p={[0, 0.09, 0]} m="#F4F0FF" line={0.4} seg={8} /><mesh position={[-0.1, 0.01, 0]} rotation={[0, 0, Math.PI / 2]} material={B('#4FA79E')}><torusGeometry args={[0.04, 0.01, 6, 12, Math.PI]} /></mesh></group>;
const Passaro = ({p, t}) => <group position={p} rotation={[0, 0.6, 0]}><Esf r={0.05} s={[1.2, 1, 1]} m="#F7D24A" line={0.6} seg={12} /><Esf r={0.035} p={[0.05, 0.04, 0]} m="#F7D24A" line={0.5} seg={10} /><Co r={0.012} h={0.03} p={[0.09, 0.04, 0]} rot={[0, 0, -Math.PI / 2]} m="#E07A5F" seg={6} line={0.4} />{[-1, 1].map((l) => <Esf key={l} r={0.04} p={[-0.01, 0.02, l * 0.04]} s={[0.9, 0.25, 0.7]} rot={[l * (0.4 + Math.sin(t * 14) * 0.5), 0, 0]} m="#E9B44C" line={0.4} seg={8} />)}</group>;
