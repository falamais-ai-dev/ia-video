
// ---------- ateliê do Dalí (outra sala, mesma luz) ----------
const texTela = () => canvasTex('telaDali', 512, 640, (g, w, h) => {
  g.fillStyle = '#F3E3C0'; g.fillRect(0, 0, w, h); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#7FB2E6'); gr.addColorStop(0.6, '#F6D7A6'); gr.addColorStop(1, '#C98F6B'); g.fillStyle = gr; g.fillRect(30, 30, w - 60, h - 60);
  g.fillStyle = '#8E5A47'; g.fillRect(30, h * 0.72, w - 60, h * 0.28 - 30);
  g.fillStyle = '#F7D24A'; g.beginPath(); g.ellipse(w * 0.62, h * 0.5, 60, 90, 0.4, 0, 7); g.fill(); g.strokeStyle = LINHA; g.lineWidth = 6; g.stroke();
  g.fillStyle = '#7B3F8C'; g.beginPath(); g.moveTo(w * 0.25, h * 0.75); g.quadraticCurveTo(w * 0.3, h * 0.3, w * 0.4, h * 0.2); g.quadraticCurveTo(w * 0.45, h * 0.5, w * 0.38, h * 0.75); g.fill();
  g.strokeStyle = '#5A3720'; g.lineWidth = 18; g.strokeRect(9, 9, w - 18, h - 18);
});
const Cavalete = ({p, rot = 0}) => (
  <group position={p} rotation={[0, rot, 0]}>
    {[-1, 1].map((l) => <Linha key={l} a={[l * 0.3, 0, 0.12]} b={[l * 0.1, 1.55, 0]} r={0.018} cor="#8A5A34" />)}<Linha a={[0, 0, -0.35]} b={[0, 1.5, -0.02]} r={0.018} cor="#8A5A34" />
    <Cx a={[0.7, 0.04, 0.08]} p={[0, 0.62, 0.06]} m="#8A5A34" line={0.6} />
    <mesh position={[0, 1.05, 0.09]} rotation={[-0.08, 0, 0]} material={lm('telaM', texTela)}><boxGeometry args={[0.66, 0.82, 0.03]} /></mesh>
  </group>
);
const Chave = ({p, rot = [0, 0, 0], s = 1}) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh material={OURO()}><torusGeometry args={[0.035, 0.011, 8, 20]} /></mesh><mesh material={HULL(0.6)}><torusGeometry args={[0.035, 0.011, 8, 20]} /></mesh>
    <Ci rt={0.009} h={0.16} p={[0, -0.115, 0]} m={OURO()} seg={8} line={0.5} />
    <Cx a={[0.035, 0.016, 0.012]} p={[0.02, -0.17, 0]} m={OURO()} line={0.5} /><Cx a={[0.026, 0.014, 0.012]} p={[0.016, -0.145, 0]} m={OURO()} line={0.5} />
  </group>
);
const BigodeDali = ({mola = 0}) => (
  <group position={[0, 0.138, 0.162]}>
    {[-1, 1].map((l) => <group key={l} scale={[l, 1, 1]}>
      <Esf r={1} s={[0.04, 0.016, 0.016]} p={[0.03, 0, 0]} rot={[0, 0, 0.2]} m={LINHA} line={0} seg={10} />
      <group position={[0.065, 0.01, -0.004]} rotation={[0, 0, 1.15 + mola * Math.sin(mola * 20) * 0.3]}><Co r={0.01} h={0.17} p={[0, 0.085, 0]} m={LINHA} seg={6} line={0} /></group>
    </group>)}
  </group>
);
const CabeloDali = () => <group><Tn geo={<sphereGeometry args={[0.172, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />} p={[0, 0.17, -0.025]} rot={[-0.35, 0, 0]} m="#2B2326" line={0.6} /></group>;
const PAREDE_DALI = () => lm('parDali', () => texPapelParede('dali', '#8D5BA8', '#7A4A96', 'oval'));
const Atelie = ({t}) => (
  <group>
    <Sala x={XD} piso={lm('pisoDali', () => texTabuas('dali', '#9E6A3C', [5, 5]))} parede={PAREDE_DALI()} lambri="#5E3A6E" teto="#E8D6EE" />
    <Plano p={[XD, 0.003, 0.15]} rot={[-Math.PI / 2, 0, 0]} a={[2.0, 2.0]} m={MAT('tapM', () => new THREE.MeshToonMaterial({map: texTapete(), gradientMap: GRAD, transparent: true, alphaTest: 0.5}))} />
    <Cavalete p={[XD - 1.05, 0, -0.9]} rot={0.45} />
    <group position={[XD + 1.3, 0, -1.6]}><Cx a={[0.5, 0.6, 0.4]} p={[0, 0.3, 0]} m="#5E3A6E" line={0.7} />{[0, 1, 2].map((i) => <Pote key={i} p={[-0.15 + i * 0.15, 0.6, 0]} cor={['#F7D24A', '#D8323C', '#2F6FE0'][i]} h={0.12} r={0.04} />)}</group>
    <group position={[XD + 0.9, 1.65, -2.17]}><mesh material={MAT('quadroDali', () => new THREE.MeshToonMaterial({map: texTela(), gradientMap: GRAD}))}><planeGeometry args={[0.55, 0.68]} /></mesh></group>
  </group>
);

// ---------- o "prédio do sono": 3 andares em corte (acordado, hipnagogia, sono pesado) e o elevador ----------
const texPlacaAndar = (txt, fundo, letra = '#FFFFFF') => canvasTex('pa' + txt, 1024, 200, (g, w, h) => {
  g.fillStyle = fundo; g.beginPath(); g.roundRect(6, 6, w - 12, h - 12, 40); g.fill(); g.strokeStyle = LINHA; g.lineWidth = 12; g.stroke();
  g.font = '900 118px MontLE, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 18; g.strokeStyle = LINHA; g.strokeText(txt, w / 2, h / 2 + 6); g.fillStyle = letra; g.fillText(txt, w / 2, h / 2 + 6);
});
const texLua = () => canvasTex('luaSono', 1024, 512, (g, w, h) => {
  g.fillStyle = '#2E3A72'; g.fillRect(0, 0, w, h); SEED = 51; for (let i = 0; i < 70; i++) { g.fillStyle = 'rgba(255,250,220,' + (0.4 + rnd() * 0.5) + ')'; g.beginPath(); g.arc(rnd() * w, rnd() * h, 2 + rnd() * 4, 0, 7); g.fill(); }
  g.fillStyle = '#FFF0B0'; g.beginPath(); g.arc(w * 0.72, h * 0.38, 90, 0, 7); g.fill(); g.fillStyle = '#2E3A72'; g.beginPath(); g.arc(w * 0.72 + 45, h * 0.38 - 25, 80, 0, 7); g.fill();
});
const texSonho = () => canvasTex('sonhoPar', 1024, 512, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#8E6BD8'); gr.addColorStop(0.5, '#C08BE0'); gr.addColorStop(1, '#6FA8E0'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  SEED = 61; for (let i = 0; i < 40; i++) { const x = rnd() * w, y = rnd() * h, r = 8 + rnd() * 16; g.fillStyle = ['#FFE36A', '#FFFFFF', '#F6B9E8'][i % 3]; g.globalAlpha = 0.75; g.beginPath(); for (let a = 0; a < 10; a++) { const rr = a % 2 ? r * 0.4 : r, an = a * Math.PI / 5 - Math.PI / 2; g.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } g.closePath(); g.fill(); }
  g.globalAlpha = 0.25; g.fillStyle = '#FFFFFF'; for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(rnd() * w, rnd() * h, 40 + rnd() * 60, 0, 7); g.fill(); } g.globalAlpha = 1;
});
const texDia = () => canvasTex('diaPar', 1024, 512, (g, w, h) => { g.fillStyle = '#F6D36B'; g.fillRect(0, 0, w, h); g.fillStyle = '#F0C24E'; for (let i = 0; i < 16; i++) g.fillRect(i * 64 + 26, 0, 12, h); g.fillStyle = '#9FD3F0'; g.fillRect(w * 0.6, h * 0.2, 260, 200); g.strokeStyle = '#F7EBD2'; g.lineWidth = 18; g.strokeRect(w * 0.6, h * 0.2, 260, 200); g.beginPath(); g.moveTo(w * 0.6 + 130, h * 0.2); g.lineTo(w * 0.6 + 130, h * 0.2 + 200); g.stroke(); g.fillStyle = '#FFE36A'; g.beginPath(); g.arc(w * 0.6 + 70, h * 0.2 + 60, 30, 0, 7); g.fill(); });
const H_AND = 1.6;
const Andar = ({y0, parede, placa, tom}) => (
  <group position={[0, y0, 0]}>
    <Cx a={[3.5, 0.12, 1.8]} p={[0.35, -0.06, 0]} m={tom} line={0.9} sombra={false} />
    <mesh position={[0, H_AND / 2, -0.8]} material={parede}><planeGeometry args={[2.6, H_AND]} /></mesh>
    <mesh position={[-1.3, H_AND / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={parede}><planeGeometry args={[1.6, H_AND]} /></mesh>
    {/* parede entre o andar e o poço do elevador, com a porta */}
    <Cx a={[0.08, H_AND, 0.45]} p={[1.3, H_AND / 2, -0.58]} m={tom} line={0.7} sombra={false} /><Cx a={[0.08, H_AND, 0.45]} p={[1.3, H_AND / 2, 0.58]} m={tom} line={0.7} sombra={false} /><Cx a={[0.08, 0.3, 0.75]} p={[1.3, H_AND - 0.15, 0]} m={tom} line={0.7} sombra={false} />
    <mesh position={[-0.45, 1.3, -0.785]} material={lm('placa' + placa, () => texPlacaAndar(placa, '#372C2E'))}><planeGeometry args={[1.15, 0.225]} /></mesh>
  </group>
);
const Elevador = ({p, porta = 1}) => (
  <group position={p}>
    <Cx a={[0.66, 0.06, 0.74]} p={[0, 0.03, 0]} m="#C9A34A" line={0.8} />
    <Cx a={[0.66, 0.08, 0.74]} p={[0, 1.32, 0]} m="#C9A34A" line={0.8} sombra={false} />
    <mesh position={[0.32, 0.68, 0]} rotation={[0, -Math.PI / 2, 0]} material={T('#E8C46A')}><planeGeometry args={[0.74, 1.28]} /></mesh>
    {[[-0.31, -0.35], [0.31, -0.35], [-0.31, 0.35], [0.31, 0.35]].map(([x, z], i) => <Cx key={i} a={[0.04, 1.28, 0.04]} p={[x, 0.68, z]} m="#B08A3A" line={0.6} />)}
    {/* grade sanfonada da frente, recolhida para o lado */}
    {Array.from({length: 4}).map((_, i) => <Linha key={'g' + i} a={[0.28 - i * 0.03 * (1 + 4 * (1 - porta)), 0.06, 0.37]} b={[0.28 - i * 0.03 * (1 + 4 * (1 - porta)), 1.28, 0.37]} r={0.006} cor="#7A5A1A" />)}
    <Linha a={[0, 1.36, 0]} b={[0, 6, 0]} r={0.008} />
  </group>
);
const Predio = ({t, yc, objs, merge, acordado, luzTopo, flashA}) => (
  <group position={[XP, 0, 0]}>
    <Andar y0={0} parede={lm('parSono', texLua)} placa="SONO PESADO" tom="#5A6AAE" />
    <Andar y0={H_AND} parede={lm('parSonho', texSonho)} placa="HIPNAGOGIA" tom="#A67FE0" />
    <Andar y0={2 * H_AND} parede={lm('parDia', texDia)} placa="ACORDADO" tom="#E9B44C" />
    <Cx a={[3.6, 0.14, 1.9]} p={[0.35, 3 * H_AND + 0.07, 0]} m="#E07A5F" line={0.9} sombra={false} />
    {/* telhado: a lâmpada gigante (o "cérebro" do prédio) */}
    <group position={[0, 3 * H_AND + 0.14, 0]}>
      <Ci rt={0.26} rb={0.3} h={0.28} p={[0, 0.14, 0]} m={FERRO()} seg={20} line={0.8} />
      <Esf r={0.5} p={[0, 0.72, 0]} s={[1, 1.12, 1]} m={luzTopo > 0.02 ? CAB_ACESA(luzTopo) : T('#EAF6FA')} line={0.9} seg={28} />
      <Halo p={[0, 0.75, 0.3]} k={luzTopo} s={2.4} id={7} />
    </group>
    {/* poço do elevador */}
    {[[1.33, -0.42], [1.97, -0.42], [1.33, 0.42], [1.97, 0.42]].map(([x, z], i) => <Cx key={'po' + i} a={[0.06, 3 * H_AND, 0.06]} p={[x, 1.5 * H_AND, z]} m="#7A5A1A" line={0.6} />)}
    {/* sono pesado: travesseiros enormes */}
    {[[-0.7, 0.18, 0.1, 0.4], [-0.15, 0.15, -0.3, 0.35], [0.5, 0.2, 0.15, 0.42], [-0.9, 0.12, -0.5, 0.3]].map(([x, y, z, r], i) => <Esf key={'tr' + i} r={r} p={[x, y, z]} s={[1.3, 0.45, 0.9]} rot={[0, i * 0.7, 0]} m={i % 2 ? '#E8E4FA' : '#C9D3F4'} line={0.8} seg={18} />)}
    {/* hipnagogia: ideias soltas boiando */}
    {objs.u > 0.01 ? <GuardaChuva p={objs.U} rot={[0.3, 0, 0.5 + Math.sin(t) * 0.1]} s={objs.u} /> : null}
    {objs.v > 0.01 ? <Ventilador p={objs.V} rot={[0.2, -0.4, Math.sin(t * 0.8) * 0.2]} s={objs.v} gira={t * 3} /> : null}
    {objs.o > 0.01 ? <><Peixe p={[-0.3, H_AND + 1.12 + Math.sin(t * 1.4) * 0.04, -0.35]} t={t} /><Bule p={[0.75, H_AND + 1.02 + Math.sin(t * 1.1 + 1) * 0.04, -0.45]} t={t} /><Passaro p={[-0.95, H_AND + 1.2 + Math.sin(t * 1.7 + 2) * 0.05, -0.5]} t={t} /></> : null}
    {merge.k > 0.01 ? <Invencao p={merge.p} rot={[0.15, 0, Math.sin(t * 2) * 0.12]} s={merge.k} gira={t * 9} /> : null}
    {/* acordado: guarda-chuva e ventilador separados, cada um no seu canto */}
    <GuardaChuva p={[-0.95, 2 * H_AND + 0.3, -0.2]} rot={[0, 0, 0.2]} aberto={0.2} />
    <group position={[0.55, 2 * H_AND, -0.25]}><Cx a={[0.3, 0.4, 0.3]} p={[0, 0.2, 0]} m="#8A5A34" line={0.6} /><Ventilador p={[0, 0.62, 0]} gira={0} /></group>
  </group>
);
// estrelas do céu do sonho
const ESTRELAS = Array.from({length: 60}).map((_, i) => [Math.sin(i * 12.9) * 9, 0.5 + ((i * 7.31) % 9), -6 - ((i * 3.7) % 6), 0.08 + (i % 4) * 0.04]);
const Estrelas = ({t}) => <group position={[XP, 0, 0]}>{ESTRELAS.map(([x, y, z, s], i) => <Brilho key={i} id={100 + i} p={[x, y, z]} k={0.5 + 0.25 * Math.sin(t * 2 + i)} s={s * 3} />)}</group>;

// ---------- laboratório de Paris ----------
const texAzulejo = () => canvasTex('azulejo', 1024, 1024, (g, w) => {
  g.fillStyle = '#E3F1EC'; g.fillRect(0, 0, w, w); const n = 8, s = w / n;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { g.fillStyle = (i + j) % 2 ? '#D3EAE3' : '#EAF6F2'; g.fillRect(i * s + 4, j * s + 4, s - 8, s - 8); }
  g.strokeStyle = 'rgba(90,120,115,0.6)'; g.lineWidth = 6; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, w); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke(); }
}, [4, 2]);
const texPlacar = (n) => canvasTex('placar' + n, 768, 900, (g, w, h) => {
  g.fillStyle = '#2E4A44'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8A5A34'; g.lineWidth = 30; g.strokeRect(15, 15, w - 30, h - 30);
  g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 6; g.beginPath(); g.moveTo(w / 2, 90); g.lineTo(w / 2, h - 60); g.stroke();
  // ícones: olho aberto (acordado) e "Zz" (cochilo curto)
  g.strokeStyle = '#FFFFFF'; g.lineWidth = 12; g.beginPath(); g.ellipse(w * 0.25, 140, 80, 42, 0, 0, 7); g.stroke(); g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(w * 0.25, 140, 24, 0, 7); g.fill();
  g.font = '900 110px MontLE, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Zz', w * 0.75, 140);
  if (n >= 4) { g.font = '900 170px MontLE, sans-serif'; g.lineJoin = 'round'; g.lineWidth = 22; g.strokeStyle = LINHA; g.strokeText('3x', w * 0.75, h - 130); g.fillStyle = '#FFE36A'; g.fillText('3x', w * 0.75, h - 130); }
});
const Placar = ({p, rot = 0, n, luzes}) => (
  <group position={p} rotation={[0, rot, 0]}>
    {[-1, 1].map((l) => <Linha key={l} a={[l * 0.42, 0, 0.1]} b={[l * 0.3, 1.9, 0]} r={0.02} cor="#8A5A34" />)}
    <mesh position={[0, 1.25, 0.04]} material={lm('placarM' + Math.min(n, 4), () => texPlacar(Math.min(n, 4)))}><boxGeometry args={[0.85, 1.0, 0.04]} /></mesh>
    {/* lâmpadas: 1 acesa do lado acordado, até 3 do lado do cochilo */}
    {[0, 1, 2].map((i) => <Lampada key={'a' + i} p={[-0.21, 0.9 + i * 0.17, 0.07]} s={0.75} acesa={i === 0 ? 1 : 0} />)}
    {[0, 1, 2].map((i) => <Lampada key={'b' + i} p={[0.21, 0.9 + i * 0.17, 0.07]} s={0.75} acesa={luzes[i]} />)}
    {luzes.map((k, i) => <Halo key={'h' + i} p={[0.21, 1.0 + i * 0.17, 0.12]} k={k} s={0.3} id={40 + i} />)}
    <Halo p={[-0.21, 1.0, 0.12]} k={1} s={0.3} id={39} />
  </group>
);
const CadeiraLab = ({p, cor = '#7FA8C9'}) => (
  <group position={p}>
    {[[-0.2, -0.17], [0.2, -0.17], [-0.2, 0.17], [0.2, 0.17]].map(([x, z], i) => <Linha key={i} a={[x, 0, z]} b={[x, 0.4, z]} r={0.012} cor="#5A6474" />)}
    <Cx a={[0.48, 0.05, 0.42]} p={[0, 0.42, 0.02]} m={cor} line={0.7} />
    <Cx a={[0.48, 0.42, 0.05]} p={[0, 0.66, -0.2]} rot={[-0.1, 0, 0]} m={cor} line={0.7} />
  </group>
);
const Garrafa = ({p, rot = [0, 0, 0]}) => <group position={p} rotation={rot}><Ci rt={0.027} h={0.13} p={[0, 0, 0]} m="#6FB7E9" seg={12} line={0.6} /><Ci rt={0.012} h={0.035} p={[0, 0.08, 0]} m="#2F6FE0" seg={8} line={0.4} /></group>;
const Laboratorio = ({t}) => (
  <group>
    <Sala x={XL} piso={lm('pisoLab', () => texTabuas('lab', '#C9A57A', [5, 5]))} parede={lm('parLab', texAzulejo)} lambri="#7FA8A0" teto="#F2F2EA" />
    {/* janelão com a cidade e a torre ao fundo */}
    <group position={[XL - 0.2, 1.65, -2.17]}>
      <mesh position={[0, 0, -0.01]} material={MAT('vistaParis', () => new THREE.MeshBasicMaterial({map: texVista('paris'), fog: false}))}><planeGeometry args={[1.5, 1.2]} /></mesh>
      {[[0, 0.62, 1.6, 0.08], [0, -0.62, 1.68, 0.08], [-0.78, 0, 0.08, 1.3], [0.78, 0, 0.08, 1.3], [0, 0, 0.05, 1.2], [0, 0, 1.5, 0.05]].map(([x, y, w, h], i) => <Cx key={i} a={[w, h, 0.08]} p={[x, y, 0.03]} m="#F7F2E6" line={0.6} sombra={false} />)}
    </group>
    {/* bancada com aparelhos */}
    <group position={[XL + 1.9, 0, -1.6]}><Cx a={[0.9, 0.8, 0.5]} p={[0, 0.4, 0]} m="#EDEDE6" line={0.7} /><Cx a={[0.4, 0.3, 0.3]} p={[-0.15, 0.95, 0]} m="#5A6474" line={0.6} /><Ci rt={0.09} h={0.03} p={[-0.15, 0.95, 0.16]} rot={[Math.PI / 2, 0, 0]} m="#9FD8E8" seg={18} line={0.5} /><Pote p={[0.25, 0.8, 0]} cor="#9FD08A" /></group>
  </group>
);
