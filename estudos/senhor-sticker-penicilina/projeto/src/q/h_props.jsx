
// ================= vídeo 3: objetos =================
const fonteOk = () => typeof document !== 'undefined' && document.fonts && document.fonts.check('900 40px MontLE');
// plaquinha com texto em português (redesenha quando a fonte carrega)
const texPlaca = (txt, w, h, fundo, tinta, borda) => canvasTex('pl' + txt + w + h + fundo + tinta + (fonteOk() ? 1 : 0), Math.round(w * 1024), Math.round(h * 1024), (g, W, H) => {
  g.fillStyle = fundo; g.fillRect(0, 0, W, H);
  if (borda) { g.strokeStyle = borda; g.lineWidth = Math.min(W, H) * 0.06; g.strokeRect(0, 0, W, H); }
  const linhas = txt.split('\n'); let fs = H / (linhas.length * 1.25 + 0.3);
  g.font = `900 ${fs}px MontLE, sans-serif`; const mx = Math.max(...linhas.map((l) => g.measureText(l).width)); if (mx > W * 0.88) fs *= W * 0.88 / mx;
  g.font = `900 ${fs}px MontLE, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = tinta;
  linhas.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (linhas.length - 1) / 2) * fs * 1.15 + fs * 0.05));
});
const Placa = ({p, rot = [0, 0, 0], txt, w = 0.6, h = 0.25, fundo = '#FFF4D6', tinta = '#372C2E', borda = '#372C2E', moldura = '#8A5A34', fio = false, s = 1}) => {
  const m = MAT('plm' + txt + w + h + fundo + tinta + (fonteOk() ? 1 : 0), () => new THREE.MeshBasicMaterial({map: texPlaca(txt, w, h, fundo, tinta, borda), toneMapped: false}));
  return <group position={p} rotation={rot} scale={s}>
    {moldura ? <Cx a={[w + 0.04, h + 0.04, 0.02]} p={[0, 0, -0.012]} m={moldura} line={0.6} sombra={false} /> : null}
    <mesh material={m}><planeGeometry args={[w, h]} /></mesh>
    {fio ? <><Linha a={[-w * 0.35, h / 2, -0.005]} b={[0, h / 2 + 0.12, -0.005]} r={0.004} /><Linha a={[w * 0.35, h / 2, -0.005]} b={[0, h / 2 + 0.12, -0.005]} r={0.004} /><Esf r={0.012} p={[0, h / 2 + 0.12, -0.005]} m="#8E98A3" line={0.3} seg={8} /></> : null}
  </group>;
};
// placa de Petri: vidro, ágar e colônias pintadas
const texAgar = (k, mofo = 0, limpo = 0) => canvasTex('agar' + k, 512, 512, (g, w) => {
  SEED = 7 + k.length; g.fillStyle = '#F1D27A'; g.fillRect(0, 0, w, w);
  for (let i = 0; i < 70; i++) { const x = rnd() * w, y = rnd() * w; const dx = x - w * 0.28, dy = y - w * 0.3; if (limpo && Math.hypot(dx, dy) < w * 0.3) continue; g.fillStyle = ['#D9A5C8', '#E8B9D6', '#C98DB8'][i % 3]; g.beginPath(); g.arc(x, y, 6 + rnd() * 10, 0, 7); g.fill(); }
  if (mofo) { g.fillStyle = '#7DB85A'; g.beginPath(); g.arc(w * 0.28, w * 0.3, w * 0.1, 0, 7); g.fill(); g.fillStyle = '#A5D67E'; g.beginPath(); g.arc(w * 0.26, w * 0.28, w * 0.05, 0, 7); g.fill(); }
});
const Petri = ({p, rot = [0, 0, 0], s = 1, k = 'a', mofo = 0, limpo = 0, line = 0.5}) => (
  <group position={p} rotation={rot} scale={s}>
    <Ci rt={0.075} h={0.018} p={[0, 0.009, 0]} m={MAT('vidro', () => new THREE.MeshToonMaterial({color: '#CFE9F2', gradientMap: GRAD, transparent: true, opacity: 0.55}))} line={line} seg={22} />
    <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} material={MAT('agarM' + k + mofo + limpo, () => new THREE.MeshToonMaterial({map: texAgar(k, mofo, limpo), gradientMap: GRAD}))}><circleGeometry args={[0.07, 22]} /></mesh>
  </group>
);
// pilha de placas que balança
const Pilha = ({p, n = 8, bal = 0, s = 1}) => <group position={p} scale={s}>{Array.from({length: n}).map((_, i) => <Petri key={i} k={'p' + (i % 4)} p={[Math.sin(i * 2.1) * 0.012 + bal * i * i * 0.0012, i * 0.02, Math.cos(i * 1.7) * 0.01]} rot={[0, i * 0.7, bal * i * 0.01]} line={0.35} />)}</group>;
const Xicara = ({p, s = 1, teia = 0}) => (
  <group position={p} scale={s}>
    <Ci rt={0.045} rb={0.035} h={0.07} p={[0, 0.035, 0]} m="#F4F0E6" line={0.6} seg={18} />
    <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]} material={T('#8C6B3E')}><circleGeometry args={[0.04, 18]} /></mesh>
    {[0, 1, 2].map((i) => <Esf key={i} r={0.012} p={[-0.015 + i * 0.014, 0.068, (i % 2) * 0.01]} s={[1, 0.4, 1]} m="#8FB86A" line={0} seg={8} />)}
    <mesh position={[0.05, 0.04, 0]} rotation={[0, 0, Math.PI / 2]} material={T('#F4F0E6')}><torusGeometry args={[0.018, 0.006, 6, 12, Math.PI]} /></mesh>
    <Ci rt={0.07} h={0.008} p={[0, 0.002, 0]} m="#F4F0E6" line={0.5} seg={20} />
  </group>
);
// mosca: corpo preto e asas que batem
const Mosca = ({p, t, s = 1}) => (
  <group position={p} scale={s} rotation={[0, t * 3, 0]}>
    <Esf r={0.014} s={[1.3, 1, 1]} m="#2E2A2E" line={0.4} seg={10} />
    {[-1, 1].map((l) => <mesh key={l} position={[0, 0.012, l * 0.012]} rotation={[l * (0.6 + Math.sin(t * 90) * 0.5), 0, 0]} scale={[1, 0.15, 0.6]} material={MAT('asa', () => new THREE.MeshBasicMaterial({color: '#E8F4FF', transparent: true, opacity: 0.7}))}><sphereGeometry args={[0.018, 8, 6]} /></mesh>)}
  </group>
);
const Papel = ({p, rot = [0, 0, 0], s = 1, cor = '#FBF4E2'}) => <Cx a={[0.16 * s, 0.003, 0.21 * s]} p={p} rot={rot} m={cor} line={0.35} sombra={false} />;
const Microscopio = ({p, rot = 0}) => (
  <group position={p} rotation={[0, rot, 0]}>
    <Cx a={[0.12, 0.02, 0.14]} p={[0, 0.01, 0]} m="#3B4A5C" line={0.6} />
    <Cx a={[0.03, 0.18, 0.03]} p={[0, 0.1, -0.05]} m="#3B4A5C" line={0.6} />
    <Ci rt={0.02} rb={0.025} h={0.16} p={[0, 0.2, -0.01]} rot={[0.4, 0, 0]} m="#D8DEE6" line={0.6} seg={14} />
    <Cx a={[0.09, 0.012, 0.08]} p={[0, 0.09, 0.0]} m="#3B4A5C" line={0.5} />
  </group>
);
const Mala = ({p, rot = [0, 0, 0], s = 1}) => (
  <group position={p} rotation={rot} scale={s}>
    <Cx a={[0.3, 0.22, 0.09]} p={[0, 0, 0]} m="#9A5B34" line={0.8} />
    <Cx a={[0.31, 0.03, 0.095]} p={[0, 0.03, 0]} m="#6A3A1E" line={0.4} />
    <mesh position={[0, 0.13, 0]} material={B(LINHA)}><torusGeometry args={[0.035, 0.008, 6, 14, Math.PI]} /></mesh>
    <Cx a={[0.07, 0.05, 0.005]} p={[0.07, -0.04, 0.048]} m="#F2D06B" line={0.3} />
  </group>
);
const Chapeu = ({cor = '#3A3436', y = 0.3}) => <group position={[0, y, -0.005]}><Ci rt={0.2} h={0.015} m={cor} line={0.6} seg={24} /><Esf r={0.13} p={[0, 0.03, 0]} s={[1, 0.7, 1]} m={cor} line={0.6} seg={18} /><Ci rt={0.132} h={0.025} p={[0, 0.02, 0]} m="#B83A3A" line={0} seg={20} /></group>;
const Porco = ({p, ry = 0, s = 1, t = 0, boca = 0}) => (
  <group position={p} rotation={[0, ry, 0]} scale={s}>
    <Esf r={0.13} p={[0, 0.13, 0]} s={[1.2, 0.95, 1]} m="#F5A9B8" line={0.9} seg={22} />
    <Esf r={0.09} p={[0.12, 0.2, 0.05]} m="#F5A9B8" line={0.8} seg={20} />
    <Ci rt={0.04} h={0.04} p={[0.2, 0.2, 0.07]} rot={[0, 0, Math.PI / 2]} m="#F28EA3" line={0.6} seg={14} />
    {[-1, 1].map((l) => <Esf key={'n' + l} r={0.008} p={[0.222, 0.2, 0.07 + l * 0.014]} m={LINHA} line={0} seg={6} />)}
    {[-1, 1].map((l) => <Esf key={'o' + l} r={0.013} p={[0.18, 0.25, 0.05 + l * 0.04]} m={LINHA} line={0} seg={8} />)}
    {[-1, 1].map((l) => <Co key={'e' + l} r={0.03} h={0.05} p={[0.1, 0.29, 0.05 + l * 0.05]} rot={[l * 0.4, 0, -0.3]} m="#F28EA3" line={0.5} seg={8} />)}
    {[[-0.08, -0.06], [-0.08, 0.06], [0.08, -0.06], [0.08, 0.06]].map(([x, z], i) => <Ci key={i} rt={0.022} h={0.06} p={[x, 0.03, z]} m="#F28EA3" line={0.5} seg={8} />)}
    {boca > 0 ? <Esf r={0.02} p={[0.19, 0.155, 0.07]} s={[1, boca, 1]} m="#8A2E3C" line={0.3} seg={8} /> : null}
    <mesh position={[-0.16, 0.17, 0]} rotation={[0, 0, t * 6]} material={B('#F28EA3')}><torusGeometry args={[0.02, 0.006, 6, 12, Math.PI * 1.6]} /></mesh>
  </group>
);
const Lixeira = ({p}) => <group position={p}><Ci rt={0.13} rb={0.1} h={0.3} p={[0, 0.15, 0]} m="#7E8C96" line={0.7} seg={20} aberto /><Ci rt={0.1} h={0.01} p={[0, 0.01, 0]} m="#5E6A72" line={0} seg={16} />{[0, 1, 2].map((i) => <Esf key={i} r={0.05} p={[-0.04 + i * 0.04, 0.29, (i % 2) * 0.03]} m="#FBF4E2" line={0.4} seg={8} />)}</group>;
const Arquivo = ({p, abre = 0, teia = 0}) => (
  <group position={p}>
    <Cx a={[0.45, 0.9, 0.5]} p={[0, 0.45, 0]} m="#8E9B7A" line={0.8} />
    {[0, 1, 2].map((i) => <group key={i} position={[0, 0.2 + i * 0.27, 0.25 + (i === 1 ? abre * 0.35 : 0)]}>
      <Cx a={[0.4, 0.23, i === 1 ? 0.45 : 0.02]} p={[0, 0, i === 1 ? -0.22 : 0]} m="#A3B08E" line={0.6} />
      <Cx a={[0.12, 0.025, 0.03]} p={[0, 0.04, 0.015]} m="#C9CED6" line={0.4} />
    </group>)}
    {teia > 0 ? <mesh position={[0.2, 0.75, 0.27]} scale={teia} material={MAT('teiaM', () => new THREE.MeshBasicMaterial({map: texTeia(), transparent: true, depthWrite: false}))}><planeGeometry args={[0.35, 0.35]} /></mesh> : null}
  </group>
);
const texTeia = () => canvasTex('teia', 256, 256, (g, w) => { g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 3; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; g.beginPath(); g.moveTo(w / 2, w / 2); g.lineTo(w / 2 + Math.cos(a) * w / 2, w / 2 + Math.sin(a) * w / 2); g.stroke(); } for (let r = 20; r < w / 2; r += 22) { g.beginPath(); for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI * 2; g.lineTo(w / 2 + Math.cos(a) * r, w / 2 + Math.sin(a) * r); } g.stroke(); } });
const Aranha = ({p, t}) => <group position={p}><Linha a={[0, 0.5, 0]} b={[0, 0.03, 0]} r={0.0015} cor="#FFFFFF" /><Esf r={0.025} m="#2E2A2E" line={0.4} seg={10} />{[-1, 1].map((l) => [0, 1, 2].map((i) => <Linha key={l + '' + i} a={[0, 0, 0]} b={[l * 0.05, -0.02 + Math.sin(t * 8 + i) * 0.008, (i - 1) * 0.025]} r={0.003} />))}{[-1, 1].map((l) => <Esf key={'o' + l} r={0.006} p={[l * 0.009, 0.006, 0.022]} m="#FFFFFF" line={0} seg={6} />)}</group>;
// bola de feno (o "ninguém deu bola")
const Feno = ({p, rot = 0, s = 1}) => <group position={p} rotation={[0, 0, rot]} scale={s}>{[0, 1, 2, 3, 4].map((i) => <mesh key={i} rotation={[i * 0.7, i * 1.3, i * 0.4]} material={B('#B08A52')}><torusGeometry args={[0.12, 0.006, 5, 24]} /></mesh>)}<Esf r={0.09} m={MAT('feno', () => new THREE.MeshToonMaterial({color: '#C9A266', gradientMap: GRAD, transparent: true, opacity: 0.5}))} line={0} seg={10} /></group>;
// relógio de parede
const Relogio = ({p, t, vel = 1}) => <group position={p}><Ci rt={0.16} h={0.04} rot={[Math.PI / 2, 0, 0]} m="#F4F0E6" line={0.8} seg={28} /><Ci rt={0.17} h={0.03} p={[0, 0, -0.01]} rot={[Math.PI / 2, 0, 0]} m="#8A5A34" line={0.6} seg={28} />
  <group position={[0, 0, 0.025]} rotation={[0, 0, -t * vel]}><Cx a={[0.012, 0.13, 0.005]} p={[0, 0.06, 0]} m={LINHA} line={0} /></group>
  <group position={[0, 0, 0.028]} rotation={[0, 0, -t * vel / 12]}><Cx a={[0.016, 0.09, 0.005]} p={[0, 0.04, 0]} m={LINHA} line={0} /></group></group>;
// bactéria com carinha
const Bacteria = ({p, cor = '#C77DBA', s = 1, olhos = 'normal', t = 0, fase = 0, susto = 0}) => {
  const b = 1 + 0.06 * Math.sin(t * 7 + fase);
  return <group position={p} scale={s}>
    <Esf r={0.05} s={[1.25 * b, 0.9 / b, 1]} p={[0, 0.045, 0]} m={cor} line={0.7} seg={16} />
    {[0, 1, 2, 3, 4, 5].map((i) => { const a = i / 6 * Math.PI * 2 + fase; return <Linha key={i} a={[Math.cos(a) * 0.05, 0.045, Math.sin(a) * 0.04]} b={[Math.cos(a) * 0.075, 0.05 + Math.sin(t * 9 + i) * 0.01, Math.sin(a) * 0.06]} r={0.003} />; })}
    {[-1, 1].map((l) => <group key={l}><Esf r={0.014 * (1 + susto * 0.5)} p={[l * 0.018, 0.06, 0.04]} m="#FFFFFF" line={0.3} seg={8} /><Esf r={0.007} p={[l * 0.018, 0.06, 0.053]} m={LINHA} line={0} seg={6} /></group>)}
    {susto > 0 ? <Esf r={0.01} p={[0, 0.035, 0.047]} s={[1, 1.4, 0.5]} m="#5A2440" line={0} seg={6} /> : <Linha a={[-0.012, 0.035, 0.047]} b={[0.012, 0.035, 0.047]} r={0.0025} />}
  </group>;
};
// o mofo: tufos verdes com cara (vilão e depois herói, de capa)
const Mofo = ({p, s = 1, t = 0, cara = 'mau', capa = 0}) => (
  <group position={p} scale={s}>
    {[[0, 0.06, 0, 0.07], [0.06, 0.04, 0.02, 0.05], [-0.06, 0.04, 0.01, 0.05], [0.02, 0.1, -0.02, 0.05], [-0.03, 0.03, 0.05, 0.04], [0.05, 0.03, -0.05, 0.045]].map(([x, y, z, r], i) => <Esf key={i} r={r * (1 + 0.04 * Math.sin(t * 3 + i))} p={[x, y, z]} m={i % 2 ? '#8CC56A' : '#6FAE52'} line={0.7} seg={14} />)}
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = i / 8 * Math.PI * 2; return <Esf key={'f' + i} r={0.012} p={[Math.cos(a) * 0.09, 0.13 + Math.sin(i * 3) * 0.02, Math.sin(a) * 0.06]} m="#D8F0B0" line={0.3} seg={6} />; })}
    {[-1, 1].map((l) => <group key={l}><Esf r={0.018} p={[l * 0.025, 0.08, 0.065]} m="#FFFFFF" line={0.3} seg={10} /><Esf r={0.009} p={[l * 0.022, 0.078, 0.082]} m={LINHA} line={0} seg={6} />
      <Cx a={[0.035, 0.007, 0.005]} p={[l * 0.026, 0.104, 0.075]} rot={[0, 0, cara === 'mau' ? l * 0.45 : -l * 0.2]} m={LINHA} line={0} /></group>)}
    {cara === 'mau' ? <Linha a={[-0.02, 0.05, 0.075]} b={[0.02, 0.058, 0.075]} r={0.004} /> : <mesh position={[0, 0.055, 0.074]} rotation={[0, 0, Math.PI]} material={B(LINHA)}><torusGeometry args={[0.018, 0.004, 5, 12, Math.PI]} /></mesh>}
    {capa > 0 ? <group position={[0, 0.1, -0.06]} rotation={[0.3 + Math.sin(t * 6) * 0.15, 0, 0]} scale={capa}><Tn geo={<planeGeometry args={[0.16, 0.18]} />} p={[0, -0.09, 0]} m={T('#D8323C', {side: THREE.DoubleSide})} line={0.5} /></group> : null}
    {capa > 0 ? <Cx a={[0.05, 0.012, 0.012]} p={[0, 0.115, 0.06]} m="#D8323C" line={0.3} /> : null}
  </group>
);
// confete (pedacinhos de papel caindo e girando)
const CONF = Array.from({length: 60}).map((_, i) => [Math.sin(i * 12.9898) * 0.5 + 0.5, Math.sin(i * 78.233) * 0.5 + 0.5, Math.sin(i * 39.42) * 0.5 + 0.5, ['#E84A5F', '#F7D24A', '#4AA3E8', '#7FD08A', '#B57FE0', '#FF9A3C'][i % 6]]);
const Confete = ({c, t, t0, area = [2, 2, 1], n = 60}) => { const u = t - t0; if (u < 0 || u > 4) return null; return <group position={c}>{CONF.slice(0, n).map(([a, b, d, cor], i) => <mesh key={i} position={[(a - 0.5) * area[0] + Math.sin(u * 2 + i) * 0.05, area[1] - ((u * (0.5 + b * 0.5) + b * 0.3) * 0.9) % (area[1] + 0.3), (d - 0.5) * area[2]]} rotation={[u * 5 + i, u * 3 + i, 0]} material={T(cor, {side: THREE.DoubleSide})}><planeGeometry args={[0.03, 0.02]} /></mesh>)}</group>; };
// frasco de vidro com líquido
const Frasco = ({p, cor = '#F2C94C', s = 1, brilho = 0, nivel = 0.7}) => (
  <group position={p} scale={s}>
    <Ci rt={0.035} rb={0.045} h={0.12} p={[0, 0.06, 0]} m={MAT('vidro2', () => new THREE.MeshToonMaterial({color: '#E4F3F8', gradientMap: GRAD, transparent: true, opacity: 0.45}))} line={0.5} seg={14} />
    <Ci rt={0.04 - 0.004 * nivel} rb={0.042} h={0.11 * nivel} p={[0, 0.056 * nivel + 0.004, 0]} m={cor} line={0} seg={14} />
    <Ci rt={0.016} h={0.04} p={[0, 0.135, 0]} m="#E4F3F8" line={0.4} seg={10} />
    <Ci rt={0.019} h={0.02} p={[0, 0.16, 0]} m="#B07A4A" line={0.4} seg={10} />
  </group>
);
// ônibus vermelho de dois andares
const Onibus = ({p, ry = 0, t = 0}) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Cx a={[2.2, 0.75, 0.85]} p={[0, 0.6, 0]} m="#D8323C" line={1} />
    <Cx a={[2.1, 0.68, 0.83]} p={[0, 1.3, 0]} m="#D8323C" line={1} />
    <Cx a={[2.12, 0.05, 0.86]} p={[0, 0.98, 0]} m="#F2E6CF" line={0.5} />
    {[0, 1].map((a) => Array.from({length: 5}).map((_, i) => <Cx key={a + '' + i} a={[0.32, 0.28, 0.01]} p={[-0.8 + i * 0.4, 0.72 + a * 0.62, 0.43]} m="#BFE3F2" line={0.4} sombra={false} />))}
    {[-0.7, 0.7].map((x) => [-1, 1].map((l) => <group key={x + '' + l} position={[x, 0.18, l * 0.42]} rotation={[Math.PI / 2, 0, 0]}><Ci rt={0.17} h={0.08} rot={[0, -t * 8, 0]} m="#2E2A2E" line={0.6} seg={16} /><Ci rt={0.08} h={0.09} m="#C9CED6" line={0} seg={10} /></group>))}
    <Cx a={[0.5, 0.16, 0.01]} p={[0.55, 1.6, 0.43]} m="#F7D24A" line={0.3} sombra={false} />
  </group>
);
const Poste = ({p, acesa = 0.6}) => <group position={p}><Ci rt={0.03} h={2.2} p={[0, 1.1, 0]} m="#2E3440" line={0.7} seg={10} /><Cx a={[0.16, 0.22, 0.16]} p={[0, 2.25, 0]} m={MAT('lampPoste', () => new THREE.MeshBasicMaterial({color: '#FFE7A0'}))} line={0.7} /><Co r={0.14} h={0.1} p={[0, 2.41, 0]} m="#2E3440" line={0.6} seg={4} /></group>;
// fachada de prédio (tijolo, janelas)
const texFachada = (k, cor) => canvasTex('fach' + k, 512, 1024, (g, w, h) => {
  g.fillStyle = cor; g.fillRect(0, 0, w, h); SEED = 3 + k.length;
  for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? -16 : 0; x < w; x += 32) { g.fillStyle = `rgba(0,0,0,${0.04 + rnd() * 0.06})`; g.fillRect(x + 1, y + 1, 30, 14); }
  for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) { const x = 60 + i * 150, y = 90 + j * 190; g.fillStyle = '#F2E6CF'; g.fillRect(x - 8, y - 8, 106, 146); g.fillStyle = rnd() > 0.5 ? '#FFE3A0' : '#7FA3C2'; g.fillRect(x, y, 90, 130); g.strokeStyle = '#372C2E'; g.lineWidth = 6; g.strokeRect(x, y, 90, 130); g.beginPath(); g.moveTo(x + 45, y); g.lineTo(x + 45, y + 130); g.moveTo(x, y + 65); g.lineTo(x + 90, y + 65); g.stroke(); }
});
const Fachada = ({p, w = 2, h = 4, k = 'a', cor = '#B86A4E'}) => <group position={p}><mesh position={[0, h / 2, 0]} material={MAT('fachM' + k, () => new THREE.MeshToonMaterial({map: texFachada(k, cor), gradientMap: GRAD}))} receiveShadow><boxGeometry args={[w, h, 0.4]} /></mesh><mesh position={[0, h / 2, 0]} material={HULL(1)}><boxGeometry args={[w, h, 0.4]} /></mesh><Cx a={[w + 0.1, 0.12, 0.5]} p={[0, h, 0]} m="#E9DCC4" line={0.6} /></group>;
// torre do relógio ao fundo (silhueta pintada)
const Torre = ({p, s = 1}) => <group position={p} scale={s}><Cx a={[1.2, 7, 1.2]} p={[0, 3.5, 0]} m="#C9B48A" line={1} /><Cx a={[1.4, 1.5, 1.4]} p={[0, 7.6, 0]} m="#D9C49A" line={1} />{[0, 1, 2, 3].map((i) => <group key={i} rotation={[0, i * Math.PI / 2, 0]}><Ci rt={0.5} h={0.05} p={[0, 7.6, 0.71]} rot={[Math.PI / 2, 0, 0]} m="#F4F0E6" line={0.8} seg={24} /><Cx a={[0.05, 0.4, 0.02]} p={[0, 7.75, 0.74]} m={LINHA} line={0} /><Cx a={[0.3, 0.05, 0.02]} p={[0.12, 7.6, 0.74]} m={LINHA} line={0} /></group>)}<Co r={1.0} h={2.4} p={[0, 9.5, 0]} m="#5E6A72" line={1} seg={4} /></group>;
// cortina vermelha (palco)
const Cortina = ({p, w = 1.5, h = 3, abre = 0}) => <group position={p}>{Array.from({length: 8}).map((_, i) => <Ci key={i} rt={0.1} h={h} p={[(i - 3.5) * w / 8, h / 2, Math.sin(i * 1.7) * 0.03]} m={i % 2 ? '#B3263A' : '#C93244'} line={0.6} seg={12} />)}</group>;
const Medalha = ({p, rot = [0, 0, 0], s = 1}) => <group position={p} rotation={rot} scale={s}><Linha a={[-0.05, 0.12, 0]} b={[0, 0, 0]} r={0.006} cor="#3A62B8" /><Linha a={[0.05, 0.12, 0]} b={[0, 0, 0]} r={0.006} cor="#3A62B8" /><Ci rt={0.035} h={0.012} p={[0, -0.03, 0]} rot={[Math.PI / 2, 0, 0]} m={OURO()} line={0.5} seg={18} /></group>;
// barraca de campanha
const Barraca = ({p, ry = 0, s = 1, cor = '#8C8A4E', cruz = false}) => <group position={p} rotation={[0, ry, 0]} scale={s}>
  <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0]} castShadow receiveShadow material={T(cor)}><cylinderGeometry args={[0.001, 0.9, 1.1, 4, 1]} /></mesh><mesh position={[0, 0.55, 0]} material={HULL(1)}><cylinderGeometry args={[0.001, 0.9, 1.1, 4, 1]} /></mesh>
  {cruz ? <group position={[0, 0.5, 0.5]} rotation={[-0.45, Math.PI / 4 * 0, 0]}><Cx a={[0.22, 0.07, 0.01]} m="#D8323C" line={0.3} /><Cx a={[0.07, 0.22, 0.01]} m="#D8323C" line={0.3} /></group> : null}</group>;
const Sacos = ({p, n = 5, ry = 0}) => <group position={p} rotation={[0, ry, 0]}>{Array.from({length: n * 2 - 1}).map((_, i) => { const lin = i < n ? 0 : 1, j = lin ? i - n : i; return <Esf key={i} r={0.12} s={[1.6, 0.6, 1]} p={[(j - (n - 1) / 2 + lin * 0.5) * 0.36, 0.07 + lin * 0.13, 0]} m="#B9A57A" line={0.6} seg={12} />; })}</group>;
const Capacete = ({cor = '#6E6F44', y = 0.27}) => <group position={[0, y, 0]}><Ci rt={0.23} rb={0.24} h={0.018} m={cor} line={0.6} seg={24} /><Esf r={0.15} p={[0, 0.0, 0]} s={[1, 0.62, 1]} m={cor} line={0.6} seg={18} /></group>;
const Seringa = ({p, rot = [0, 0, 0], s = 1}) => <group position={p} rotation={rot} scale={s}><Ci rt={0.018} h={0.12} m="#E4F3F8" line={0.5} seg={10} /><Ci rt={0.014} h={0.08} p={[0, -0.015, 0]} m="#F2C94C" line={0} seg={10} /><Linha a={[0, -0.06, 0]} b={[0, -0.12, 0]} r={0.003} cor="#C9CED6" /><Cx a={[0.05, 0.01, 0.02]} p={[0, 0.065, 0]} m="#C9CED6" line={0.3} /></group>;
const Cama = ({p, ry = 0}) => <group position={p} rotation={[0, ry, 0]}><Cx a={[0.8, 0.25, 1.5]} p={[0, 0.2, 0]} m="#8A5A34" line={0.8} /><Cx a={[0.78, 0.12, 1.45]} p={[0, 0.38, 0]} m="#7FB8E0" line={0.7} /><Cx a={[0.5, 0.08, 0.25]} p={[0, 0.48, -0.55]} m="#FFFFFF" line={0.6} /><Cx a={[0.82, 0.6, 0.06]} p={[0, 0.4, -0.75]} m="#8A5A34" line={0.8} /></group>;
const Brinquedo = ({p, tipo = 0, rot = 0}) => tipo === 0 ? <Cx a={[0.12, 0.12, 0.12]} p={[p[0], p[1] + 0.06, p[2]]} rot={[0, rot, 0]} m={['#E84A5F', '#4AA3E8', '#F7D24A'][Math.abs(Math.round(rot * 3)) % 3]} line={0.6} /> : tipo === 1 ? <Esf r={0.08} p={[p[0], p[1] + 0.08, p[2]]} m="#F7D24A" line={0.6} seg={14} /> : <Cx a={[0.3, 0.01, 0.25]} p={[p[0], p[1] + 0.005, p[2]]} rot={[0, rot, 0]} m={['#7FD08A', '#B57FE0'][Math.abs(Math.round(rot * 5)) % 2]} line={0.4} sombra={false} />;
// estrelinhas de limpeza (brilho que pisca em vários pontos)
const Brilhos = ({pts, t, t0 = 0, s = 0.12, id = 300}) => <>{pts.map((q, i) => { const u = ((t - t0) * 1.3 + i * 0.37) % 1; return <Brilho key={i} id={id + i} p={q} k={t > t0 ? u : 0} s={s} />; })}</>;
