// Motor de atuação dos personagens (regra 38 de log/decisoes.md, "animação com princípios").
// Troca a mistura antiga (todas as juntas juntas, smoothstep de 0,25 s) por 4 princípios da Disney,
// aplicados em código e sempre em função de t (determinístico, seguro para o render em partes do Remotion):
//   1. Sobreposição (overlapping action): olhos e sobrancelhas chegam primeiro, depois corpo, cabeça,
//      braço e por último o antebraço (cada grupo com atraso e duração próprios).
//   2. Antecipação: corpo e braços fazem um contra-movimento pequeno antes da troca de pose.
//   3. Passa e volta (follow-through): a pose passa um pouco do ponto e assenta (curva easeOutBack).
//   4. Pose viva (moving hold): cabeça, tronco e braços nunca congelam; oscilação lenta e pequena.
// Mais: piscada na troca de pose (o ator pisca quando muda de ideia) e estica e encolhe (squash & stretch)
// pela velocidade vertical do corpo, mantendo o volume.
// API igual à antiga: atuar(POSES, acoes, t, semente) devolve o mesmo objeto de parâmetros da pose.
const c01 = (x) => Math.max(0, Math.min(1, x));
const lerp = (a, b, p) => a + (b - a) * p;

// [atraso (s), duração (s), antecipação (fração da mudança), passa do ponto (força do easeOutBack)]
const GRUPO = {
  olho: [-0.06, 0.1, 0, 0],      // atraso negativo = chega antes da palavra (os olhos lideram)
  rosto: [-0.03, 0.2, 0, 0.8],
  corpo: [0, 0.34, 0.12, 0.9],
  perna: [0.02, 0.3, 0.08, 0.6],
  cabeca: [0.05, 0.36, 0.06, 1.2],
  braco: [0.06, 0.38, 0.14, 1.4],
  antebraco: [0.11, 0.4, 0.1, 1.7],
  outro: [0.04, 0.34, 0, 0.8],
};
const DE = {
  olhoX: 'olho', olhoY: 'olho',
  sobrancelha: 'rosto', boca: 'rosto', lupa: 'rosto',
  y: 'corpo', lean: 'corpo', yaw: 'corpo', sq: 'corpo', tilt: 'corpo',
  pE: 'perna', pD: 'perna',
  hYaw: 'cabeca', hPitch: 'cabeca', hTilt: 'cabeca',
  aE: 'braco', aD: 'braco', fE: 'braco', fD: 'braco', mE: 'braco', mD: 'braco', lupaInc: 'braco',
  cE: 'antebraco', cD: 'antebraco',
};

// curva de transição: antecipação (u < 0,2), depois easeOutBack (passa do ponto e assenta)
const curva = (u, ant, back) => {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  const A = ant > 0 ? 0.2 : 0;
  if (u < A) return -ant * Math.sin((u / A) * Math.PI);
  const s = (u - A) / (1 - A);
  const c3 = back + 1;
  return 1 + c3 * Math.pow(s - 1, 3) + back * Math.pow(s - 1, 2);
};

// a duração cresce um pouco com o tamanho da mudança (gesto grande pede mais tempo)
const peso = (antes, depois) => {
  if (Array.isArray(depois)) return Math.max(...depois.map((v, j) => Math.abs(v - ((antes || depois)[j] ?? v))));
  return typeof depois === 'number' ? Math.abs(depois - (antes ?? depois)) : 0;
};

// firme: pose de contato (mão na maçaneta, no botão, na peça): braço sem passar do ponto e sem pose viva,
// para a mão não atravessar o objeto nem escorregar dele
const misturaChave = (k, antes, depois, dt, firme) => {
  if (antes === undefined) return depois;
  if (typeof depois !== 'number' && !Array.isArray(depois)) return dt > 0.15 ? depois : antes;
  const g = DE[k] || 'outro';
  let [atraso, dur0, ant, back] = GRUPO[g];
  if (firme && (g === 'braco' || g === 'antebraco' || g === 'corpo')) back = 0;
  const dur = dur0 * (1 + Math.min(0.6, peso(antes, depois) * 0.25));
  const w = curva((dt - atraso) / dur, ant, back);
  if (Array.isArray(depois)) return depois.map((v, j) => lerp((antes || depois)[j] ?? v, v, w));
  return lerp(antes, depois, w);
};

// oscilação lenta e suave (soma de senos com fases da semente): base da "pose viva"
const onda = (t, s, f) => (Math.sin(t * f + s * 1.7) * 0.6 + Math.sin(t * f * 1.93 + s * 4.1) * 0.4);
const VIVA = {hYaw: [0.035, 0.7], hTilt: [0.025, 0.55], hPitch: [0.02, 0.8], lean: [0.012, 0.45], aE: [0.03, 0.9], aD: [0.03, 0.85], cE: [0.04, 1.1], cD: [0.04, 1.05], tilt: [0.02, 0.6]};

const MAX_DT = 0.75;   // além disso a transição já assentou
const LIDER = 0.06;    // a troca começa 0,06 s antes da marca para os olhos poderem liderar
export const atuar = (POSES, acoes, t, semente = 0) => {
  let i = 0;
  while (i < acoes.length - 1 && t + LIDER >= acoes[i + 1].t) i++;
  // começa da ação mais antiga cuja transição ainda pode estar em curso e empilha as seguintes
  let j = i;
  while (j > 0 && t - acoes[j].t < MAX_DT) j--;
  let v = POSES[acoes[j].a](Math.max(0, t - acoes[j].t), t);
  for (let k = j + 1; k <= i; k++) {
    const dt = t - acoes[k].t;
    const alvo = POSES[acoes[k].a](Math.max(0, dt), t);
    // atraso dos grupos medido a partir da marca; com LIDER os olhos (atraso -0,06) começam antes dela
    const out = {};
    for (const key of Object.keys(alvo)) out[key] = misturaChave(key, v[key], alvo[key], dt, alvo.firme);
    v = out;
  }
  // pose viva: soma pequena e lenta nas juntas que existem neste personagem
  const BRACO = {aE: 1, aD: 1, cE: 1, cD: 1, lean: 1};
  for (const key of Object.keys(VIVA)) {
    if (typeof v[key] !== 'number' || (v.firme && BRACO[key])) continue;
    v[key] += VIVA[key][0] * onda(t, semente + key.length, VIVA[key][1]);
  }
  // piscada na troca de pose (só quando a troca é recente e não é a primeira ação)
  const dtUlt = t - acoes[i].t;
  v.piscaTroca = i > 0 && dtUlt >= 0.02 && dtUlt < 0.16 ? 1 - Math.sin(((dtUlt - 0.02) / 0.14) * Math.PI) * 0.9 : 1;
  return v;
};

// estica e encolhe pela velocidade e aceleração vertical do corpo (volume constante)
export const elastico = (yEm, t, forca = 1) => {
  const h = 1 / 30;
  const y0 = yEm(t - h), y1 = yEm(t), y2 = yEm(t + h);
  const vy = (y2 - y0) / (2 * h);
  const ay = (y2 - 2 * y1 + y0) / (h * h);
  const s = 1 + forca * Math.max(-0.14, Math.min(0.14, 0.05 * Math.abs(vy) - 0.0016 * Math.max(0, ay)));
  return [1 / Math.sqrt(s), s, 1 / Math.sqrt(s)];
};

// ciclo de caminhada pela distância andada (regra 38): o pé que está no chão anda para trás na mesma
// velocidade do corpo, então o pé não patina. `dist` = distância percorrida (unidades) até agora.
// Passo de ~0,55 un. (ele com scale 1); velocidade boa de caminhada: 0,6 a 1,2 un./s.
// Use numa pose: POSES_BETO.anda = (l, t) => ({...parado(l, t), ...caminhada(distAte(t))}).
export const caminhada = (dist, {passo = 0.55, amp = 0.42} = {}) => {
  const fase = (dist / (2 * passo)) * Math.PI * 2;
  const s = Math.sin(fase);
  return {
    pE: s * amp, pD: -s * amp,
    fE: -s * amp * 0.8, fD: s * amp * 0.8, aE: 0.1, aD: 0.1, cE: 0.3 + Math.max(0, -s) * 0.25, cD: 0.3 + Math.max(0, s) * 0.25,
    y: Math.abs(Math.cos(fase)) * 0.035 - 0.01,           // sobe na passagem, desce no contato
    yaw: s * 0.05,                                          // o corpo gira um pouco a cada passo
    hTilt: -s * 0.025, hPitch: 0.08 + Math.abs(Math.cos(fase)) * 0.02,
  };
};
