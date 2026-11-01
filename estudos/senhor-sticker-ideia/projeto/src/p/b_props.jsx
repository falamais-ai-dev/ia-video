
// ---------- texturas pintadas ----------
let SEED = 1; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return SEED / 2147483647; };
const lm = (k, tex, extra = {}) => MAT(k, () => new THREE.MeshToonMaterial({map: tex(), gradientMap: GRAD, ...extra}));
const texTabuas = (k, base = '#B07842', rep = [6, 6]) => canvasTex('tab' + k, 1024, 1024, (g, w) => {
  SEED = 17; g.fillStyle = base; g.fillRect(0, 0, w, w); const n = 8, s = w / n;
  for (let i = 0; i < n; i++) { const v = rnd() * 26 - 13; g.fillStyle = `rgba(${v > 0 ? 255 : 60},${v > 0 ? 220 : 30},${v > 0 ? 170 : 10},${Math.abs(v) / 90})`; g.fillRect(i * s, 0, s, w);
    g.strokeStyle = 'rgba(90,50,22,0.35)'; g.lineWidth = 3; for (let k2 = 0; k2 < 5; k2++) { const x = i * s + 10 + rnd() * (s - 20); g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 8, w * 0.3, x - 8, w * 0.7, x + 3, w); g.stroke(); }
    const y = rnd() * w; g.strokeStyle = 'rgba(55,44,46,0.8)'; g.lineWidth = 5; g.beginPath(); g.moveTo(i * s, y); g.lineTo(i * s + s, y); g.stroke(); }
  g.strokeStyle = 'rgba(55,44,46,0.9)'; g.lineWidth = 7; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, w); g.stroke(); }
}, rep);
const texReboco = (k, base, manchas, rep = [3, 1.5]) => canvasTex('reb' + k, 1024, 1024, (g, w) => {
  SEED = 29; g.fillStyle = base; g.fillRect(0, 0, w, w);
  for (let i = 0; i < 90; i++) { g.fillStyle = manchas[i % manchas.length]; g.globalAlpha = 0.18; g.beginPath(); g.ellipse(rnd() * w, rnd() * w, 40 + rnd() * 140, 30 + rnd() * 90, rnd() * 3, 0, 7); g.fill(); }
  g.globalAlpha = 1;
  if (k === 'ofi') { // tijolinhos aparecendo onde o reboco caiu
    for (let m = 0; m < 3; m++) { const cx = 150 + m * 330 + rnd() * 80, cy = 220 + rnd() * 500; for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) { if (Math.abs(i) + Math.abs(j) > 3) continue; const x = cx + i * 46 + (j % 2) * 23, y = cy + j * 24;
      g.fillStyle = ['#C2674A', '#B65A40', '#CF7556'][(i + j + 9) % 3]; g.fillRect(x, y, 42, 20); g.strokeStyle = 'rgba(55,44,46,0.7)'; g.lineWidth = 3; g.strokeRect(x, y, 42, 20); } }
  }
}, rep);
const texPapelParede = (k, c1, c2, simb) => canvasTex('pp' + k, 1024, 1024, (g, w) => {
  g.fillStyle = c1; g.fillRect(0, 0, w, w);
  for (let i = 0; i < 8; i++) { g.fillStyle = c2; g.fillRect(i * 128 + 54, 0, 20, w); }
  g.fillStyle = c2; for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { const x = i * 128 + (j % 2) * 64 + 20, y = j * 128 + 64;
    if (simb === 'estrela') { g.beginPath(); for (let a = 0; a < 10; a++) { const r = a % 2 ? 7 : 17, an = a * Math.PI / 5 - Math.PI / 2; g.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r); } g.closePath(); g.fill(); }
    else { g.beginPath(); g.ellipse(x, y, 10, 16, 0, 0, 7); g.fill(); } }
}, [3, 1.5]);
// vista da janela: céu do fim da tarde, telhados da cidade e uma chaminé
const texVista = (k) => canvasTex('vista' + k, 1024, 1024, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#7FB2E6'); gr.addColorStop(0.6, '#F6D7A6'); gr.addColorStop(1, '#F9C98A'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,0.85)'; [[220, 220, 90], [700, 320, 120], [480, 140, 60]].forEach(([x, y, r]) => { for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(x + i * r * 0.55, y + Math.sin(i) * 12, r * (0.5 + 0.2 * (i % 2)), 0, 7); g.fill(); } });
  if (k === 'paris') { // torre de treliça pintada ao fundo (silhueta)
    g.fillStyle = '#8E7FA6'; g.beginPath(); g.moveTo(560, 900); g.quadraticCurveTo(640, 600, 655, 260); g.lineTo(665, 260); g.quadraticCurveTo(680, 600, 760, 900); g.closePath(); g.fill();
    g.fillStyle = '#F4D2A4'; g.beginPath(); g.moveTo(600, 900); g.quadraticCurveTo(660, 780, 720, 900); g.closePath(); g.fill();
    g.fillStyle = '#8E7FA6'; g.fillRect(610, 700, 100, 14); g.fillRect(636, 520, 48, 10); g.fillRect(658, 200, 4, 70);
  }
  for (let i = 0; i < 9; i++) { const x = i * 120 - 20, hh = 120 + ((i * 53) % 90); g.fillStyle = ['#C98F6B', '#B97B5E', '#D4A27A'][i % 3]; g.fillRect(x, h - hh, 112, hh); g.fillStyle = '#8E5A47'; g.beginPath(); g.moveTo(x - 8, h - hh); g.lineTo(x + 56, h - hh - 60); g.lineTo(x + 120, h - hh); g.fill();
    g.fillStyle = '#FFE7A8'; for (let j = 0; j < 2; j++) g.fillRect(x + 22 + j * 44, h - hh + 30, 22, 30); }
});
const texTapete = () => canvasTex('tapete', 512, 512, (g, w) => {
  const c = w / 2; ['#C45A3C', '#E9A84A', '#C45A3C', '#F0D08A', '#9B3F33'].forEach((cor, i) => { g.fillStyle = cor; g.beginPath(); g.arc(c, c, c * (1 - i * 0.18), 0, 7); g.fill(); });
  g.strokeStyle = 'rgba(255,240,210,0.6)'; g.lineWidth = 6; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; g.beginPath(); g.arc(c + Math.cos(a) * c * 0.73, c + Math.sin(a) * c * 0.73, 10, 0, 7); g.stroke(); }
});
// quadro de cortiça com rascunhos de invenções (só desenhos, sem letras)
const texRascunhos = () => canvasTex('rasc', 1024, 720, (g, w, h) => {
  g.fillStyle = '#C89B66'; g.fillRect(0, 0, w, h); SEED = 41; for (let i = 0; i < 1500; i++) { g.fillStyle = rnd() > 0.5 ? 'rgba(120,80,40,0.35)' : 'rgba(230,200,150,0.35)'; g.fillRect(rnd() * w, rnd() * h, 3, 3); }
  const papel = (x, y, ww, hh, r, desenho) => { g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = '#FBF4E2'; g.fillRect(-ww / 2, -hh / 2, ww, hh); g.strokeStyle = '#3B5BA8'; g.lineWidth = 5; g.lineCap = 'round'; desenho(g); g.fillStyle = '#D8323C'; g.beginPath(); g.arc(0, -hh / 2 + 14, 9, 0, 7); g.fill(); g.restore(); };
  papel(200, 200, 250, 210, -0.08, (g) => { g.beginPath(); g.arc(0, -10, 50, Math.PI * 0.8, Math.PI * 2.2); g.lineTo(18, 52); g.lineTo(-18, 52); g.closePath(); g.stroke(); for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-20, 60 + i * 10); g.lineTo(20, 60 + i * 10); g.stroke(); } g.beginPath(); g.moveTo(-14, 10); g.lineTo(-6, -20); g.lineTo(6, 0); g.lineTo(14, -20); g.stroke(); });
  papel(520, 180, 230, 200, 0.06, (g) => { g.beginPath(); g.arc(0, 0, 55, 0, 7); g.stroke(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; g.beginPath(); g.moveTo(Math.cos(a) * 55, Math.sin(a) * 55); g.lineTo(Math.cos(a) * 75, Math.sin(a) * 75); g.stroke(); } g.beginPath(); g.arc(0, 0, 18, 0, 7); g.stroke(); });
  papel(820, 230, 240, 230, -0.04, (g) => { g.strokeRect(-70, 20, 90, 60); g.beginPath(); g.moveTo(-25, 20); g.lineTo(-10, -20); g.lineTo(70, -75); g.lineTo(90, -20); g.lineTo(-5, -5); g.stroke(); g.beginPath(); g.arc(-25, 50, 20, 0, 7); g.stroke(); });
  papel(330, 520, 260, 220, 0.05, (g) => { g.beginPath(); g.moveTo(-90, 40); g.quadraticCurveTo(0, -80, 90, 40); g.stroke(); g.beginPath(); g.moveTo(0, -20); g.lineTo(0, 80); g.stroke(); for (let k = -1; k <= 1; k += 2) { g.beginPath(); g.moveTo(0, -40); g.lineTo(k * 70, -60); g.stroke(); } });
  papel(700, 520, 260, 220, -0.07, (g) => { for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-90, -50 + i * 32); g.lineTo(-90 + 150 - i * 30, -50 + i * 32); g.stroke(); } g.strokeStyle = '#D8323C'; g.beginPath(); g.arc(70, 40, 30, 0, 7); g.stroke(); });
});
const texZ = () => canvasTex('letraZ', 256, 256, (g, w) => { g.font = '900 210px MontLE, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 26; g.strokeStyle = LINHA; g.strokeText('Z', w / 2, w / 2 + 10); g.fillStyle = '#FFFFFF'; g.fillText('Z', w / 2, w / 2 + 10); });
const texHalo = () => canvasTex('halo', 256, 256, (g, w) => { const c = w / 2; const gr = g.createRadialGradient(c, c, 0, c, c, c); gr.addColorStop(0, 'rgba(255,236,150,0.9)'); gr.addColorStop(0.35, 'rgba(255,214,90,0.45)'); gr.addColorStop(1, 'rgba(255,200,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
const texFumaca = () => canvasTex('fumaca', 256, 256, (g, w) => { [[0.4, 0.55, 0.25], [0.6, 0.5, 0.28], [0.5, 0.35, 0.22]].forEach(([x, y, r]) => { const gr = g.createRadialGradient(x * w, y * w, 0, x * w, y * w, r * w); gr.addColorStop(0, 'rgba(120,115,120,0.9)'); gr.addColorStop(1, 'rgba(120,115,120,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x * w, y * w, r * w, 0, 7); g.fill(); }); });
const SPM = (k, tex, extra = {}) => MAT('sp' + k, () => new THREE.SpriteMaterial({map: tex(), transparent: true, depthWrite: false, fog: false, ...extra}));
// "Zzz" que sobe da cabeça de quem dorme
const Zzz = ({p, t, k = 1, id = 0, s = 0.11}) => k <= 0.01 ? null : <group>{[0, 1, 2].map((i) => { const u = ((t * 0.55 + i / 3 + id * 0.17) % 1);
  const m = MAT('zm' + id + i, () => new THREE.SpriteMaterial({map: texZ(), transparent: true, depthWrite: false, fog: false})); m.opacity = k * Math.sin(u * Math.PI); m.rotation = -0.3 + Math.sin(u * 6) * 0.2;
  return <sprite key={i} position={[p[0] + 0.08 + u * 0.16 + Math.sin(u * 9 + i) * 0.03, p[1] + 0.05 + u * 0.32, p[2]]} scale={[s * (0.6 + u * 0.7), s * (0.6 + u * 0.7), 1]} material={m} />; })}</group>;
const Halo = ({p, k, s = 0.9, id = 0}) => { if (k <= 0.01) return null; const m = MAT('halo' + id, () => new THREE.SpriteMaterial({map: texHalo(), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending})); m.opacity = Math.min(1, k) * 0.8; return <sprite position={p} scale={[s * (0.85 + 0.15 * k), s * (0.85 + 0.15 * k), 1]} material={m} />; };
const Fumaca = ({p, k, s = 0.3, id = 0}) => { if (k <= 0 || k >= 1) return null; const m = MAT('fum' + id, () => new THREE.SpriteMaterial({map: texFumaca(), transparent: true, depthWrite: false, fog: false})); m.opacity = (1 - k) * 0.9; return <sprite position={[p[0], p[1] + k * 0.25, p[2]]} scale={[s * (0.5 + k), s * (0.5 + k), 1]} material={m} />; };
// onda de choque do estrondo: anel achatado que cresce e some
const Onda = ({p, k, r = 0.5, id = 0}) => { if (k <= 0 || k >= 1) return null; const m = MAT('onda' + id, () => new THREE.MeshBasicMaterial({color: '#FFFFFF', transparent: true, depthWrite: false})); m.opacity = (1 - k) * 0.9;
  return <mesh position={p} rotation={[-Math.PI / 2, 0, 0]} scale={0.2 + k * r} material={m}><ringGeometry args={[0.9, 1, 40]} /></mesh>; };
// cabeça do boneco no mundo (para halo, Zzz e fumaça); sc = escala do boneco
const cabDe = (pos, sc = 1, dy = 0) => [pos[0], pos[1] + (1.09 + dy) * sc, pos[2]];

// ---------- objetos ----------
const Bola = ({p, id = 0}) => <Esf r={0.05} p={p} m={PRATA()} line={0.7} seg={22} />;
const Prato = ({p, tr = 0}) => (
  <group position={[p[0], p[1] + Math.abs(tr) * 0.01, p[2]]} rotation={[tr * 0.08, 0, tr * 0.06]}>
    <Ci rt={0.11} rb={0.095} h={0.016} p={[0, 0.008, 0]} m={FERRO()} seg={28} line={0.7} />
    <mesh position={[0, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]} material={PRATA()}><ringGeometry args={[0.07, 0.1, 28]} /></mesh>
  </group>
);
const VEL = '#C2483E', VEL2 = '#A63A34';
const Poltrona = ({p, cor = VEL, cor2 = VEL2, rot = 0, esmaga = 0}) => (
  <group position={p} rotation={[0, rot, 0]} scale={[1 + esmaga * 0.12, 1 - esmaga * 0.18, 1 + esmaga * 0.12]}>
    {[[-0.27, -0.2], [0.27, -0.2], [-0.27, 0.2], [0.27, 0.2]].map(([x, z], i) => <Co key={i} r={0.03} h={0.15} p={[x, 0.075, z]} rot={[Math.PI, 0, 0]} m="#5A3720" seg={8} line={0.5} />)}
    <Cx a={[0.62, 0.22, 0.5]} p={[0, 0.25, 0]} m={cor} />
    <Cx a={[0.47, 0.08, 0.44]} p={[0, 0.4, 0.03]} m={cor2} line={0.7} />
    <Cx a={[0.62, 0.64, 0.12]} p={[0, 0.66, -0.2]} m={cor} />
    <Ci rt={0.07} h={0.66} p={[0, 0.98, -0.2]} rot={[0, 0, Math.PI / 2]} m={cor} />
    {[-1, 1].map((l) => <group key={l}><Cx a={[0.09, 0.2, 0.5]} p={[l * 0.285, 0.47, 0.0]} m={cor} /><Ci rt={0.055} h={0.52} p={[l * 0.285, 0.57, 0.0]} rot={[Math.PI / 2, 0, 0]} m={cor} /></group>)}
    {[[-0.15, 0.82], [0.15, 0.82], [0, 0.66], [-0.15, 0.5], [0.15, 0.5]].map(([x, y], i) => <Esf key={'b' + i} r={0.016} p={[x, y, -0.137]} m="#E9B44C" line={0.4} seg={8} />)}
  </group>
);
const Luminaria = ({p, t, bal = 0, acesa = 1}) => (
  <group position={p}>
    <group rotation={[0, 0, bal]}>
      <Linha a={[0, 0, 0]} b={[0, -0.5, 0]} r={0.006} />
      <Co r={0.13} h={0.12} p={[0, -0.55, 0]} m="#2F6F6A" seg={20} line={0.8} />
      <Esf r={0.05} p={[0, -0.62, 0]} m={B('#FFF2B0')} line={0.5} seg={14} />
    </group>
  </group>
);
// gramofone, lâmpadas, potes e engrenagens da bancada
const Gramofone = ({p, rot = 0}) => (
  <group position={p} rotation={[0, rot, 0]}>
    <Cx a={[0.26, 0.14, 0.26]} p={[0, 0.07, 0]} m="#8A4E2A" />
    <Ci rt={0.11} h={0.012} p={[0, 0.146, 0]} m="#2B2326" seg={24} line={0.5} />
    <Linha a={[0.08, 0.15, 0.06]} b={[0.06, 0.32, -0.02]} r={0.01} cor="#C79B3A" />
    <group position={[0.06, 0.34, -0.02]} rotation={[0.6, 0, -0.5]}><Tn geo={<cylinderGeometry args={[0.16, 0.012, 0.32, 24, 1, true]} />} p={[0, 0.16, 0]} m={T('#E2A93B', {side: THREE.DoubleSide})} line={0.8} /></group>
  </group>
);
const Lampada = ({p, s = 1, acesa = 0}) => (
  <group position={p} scale={s}>
    <Ci rt={0.035} rb={0.03} h={0.05} p={[0, 0.025, 0]} m={FERRO()} seg={12} line={0.5} />
    <Esf r={0.06} p={[0, 0.1, 0]} s={[1, 1.15, 1]} m={acesa > 0.02 ? CAB_ACESA(acesa) : T('#EAF6FA')} line={0.6} seg={16} />
  </group>
);
const Pote = ({p, cor, h = 0.16, r = 0.05}) => (
  <group position={p}>
    <Ci rt={r} h={h} p={[0, h / 2, 0]} m={T(cor)} seg={14} line={0.6} />
    <Ci rt={r * 0.85} h={0.03} p={[0, h + 0.015, 0]} m="#8A5A30" seg={12} line={0.5} />
  </group>
);
const Engrenagem = ({p, r = 0.09, rot = [0, 0, 0], cor = '#C9A34A'}) => (
  <group position={p} rotation={rot}>
    <Ci rt={r} h={0.03} rot={[Math.PI / 2, 0, 0]} m={OURO()} seg={20} line={0.6} />
    {Array.from({length: 8}).map((_, i) => { const a = i / 8 * Math.PI * 2; return <Cx key={i} a={[r * 0.35, r * 0.35, 0.03]} p={[Math.cos(a) * r * 1.08, Math.sin(a) * r * 1.08, 0]} rot={[0, 0, a]} m={OURO()} line={0.5} />; })}
  </group>
);
