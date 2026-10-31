// Câmera "animação fluida" (regra 34 de log/decisoes.md; estudo do Short do Planeta Ninco, 28/10).
// Uso dentro de qualquer cena com <ThreeCanvas>:
//   const CAM = fazCamera(PLANOS, FIM);               // PLANOS em segundos da narração
//   <CAM.Cam t={t} />  (no lugar do R.Cam)            // câmera
//   <Lente cam={CAM} t={t} /> <Aquece />              // profundidade de campo + vinheta (precisa de @react-three/postprocessing)
//   fora do canvas: <Borrao k={CAM.em(t).borrao} /> e filter: 'url(#chicote)' no AbsoluteFill do canvas quando borrao > 0.03
// Cada plano: {a, de, para, olha, foco, z, dof, entra, soco, novela, tremor, ease}
//   a      = início (s), em cima da palavra; o plano dura até o próximo `a`
//   de/para = posição da câmera no começo e no fim (empurrão lento contínuo, nunca parado)
//   olha   = para onde a câmera aponta; foco = ponto nítido (padrão = olha)
//   z      = multiplica a distância até `olha` (o cenário em blocos é grande: macro de objeto ~1,5 un., rosto ~2,4, plano médio ~3,5)
//   dof    = força do desfoque (1 leve, 3 padrão, 5 a 6 detalhe)
//   entra  = 'chicote' (giro rápido + borrão horizontal de 0,16 s em cada lado do corte); padrão = corte seco
//   soco   = [t, fov]: zoom rápido (0,18 s) no número ou palavra forte
//   novela = t: zoom dramático até os olhos (piada do "final de novela")
//   tremor = t: tremida de 0,3 s no impacto
//   ease   = 'in' acelera (mergulho na peça antes do corte); padrão desacelera
//   segue  = (t) => [x,y,z]: plano de acompanhamento (regra 38); câmera e mira andam junto com esse ponto
//            (ex.: o personagem caminhando), a partir de onde ele estava no início do plano
//   vivo   = 0 tira a câmera na mão só neste plano (ex.: macro em que 1 cm já sai do foco)
import React, {useEffect, useState} from 'react';
import * as THREE from 'three';
import {continueRender, delayRender} from 'remotion';
import {useThree} from '@react-three/fiber';
import {EffectComposer, DepthOfField, Vignette, N8AO, SMAA, HueSaturation, BrightnessContrast} from '@react-three/postprocessing';

const lerp = (a, b, p) => a + (b - a) * p;
const c01 = (x) => Math.max(0, Math.min(1, x));
const smooth = (x) => { const p = c01(x); return p * p * (3 - 2 * p); };
const ease = (x, tipo) => (tipo === 'in' ? x * x * x : 1 - Math.pow(1 - x, 1.6));

// câmera na mão (regra 38): deriva lenta de poucos milímetros e um grau de giro, para o plano respirar
// como uma câmera operada; some no chicote e no soco. vivo = 0 desliga.
const deriva = (t, s, f) => Math.sin(t * f + s) * 0.6 + Math.sin(t * f * 2.37 + s * 3.1) * 0.4;
export const fazCamera = (PLANOS, FIM, {fov: FOV = 42, whip: WHIP = 0.16, vivo: VIVO = 1} = {}) => {
  const idx = (t) => { let i = 0; while (i < PLANOS.length - 1 && t >= PLANOS[i + 1].a) i++; return i; };
  const em = (t) => {
    const i = idx(t);
    const s = PLANOS[i];
    const b = i < PLANOS.length - 1 ? PLANOS[i + 1].a : FIM;
    const u = ease(c01((t - s.a) / (b - s.a)), s.ease);
    const z = s.z || 1;
    const pos = new THREE.Vector3(...s.de.map((v, k) => s.olha[k] + (lerp(v, s.para[k], u) - s.olha[k]) * z));
    const look = new THREE.Vector3(...s.olha);
    if (s.segue) {
      const p0 = s.segue(s.a), p1 = s.segue(t);
      const d = new THREE.Vector3(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]);
      pos.add(d); look.add(d);
    }
    let fov = FOV, giro = 0, borrao = 0;
    if (s.soco && t >= s.soco[0]) fov = lerp(FOV, s.soco[1], smooth((t - s.soco[0]) / 0.18));
    if (s.novela && t >= s.novela) { const k = smooth((t - s.novela) / 0.3); fov = lerp(FOV, 24, k); look.y += 0.04 * k; }
    if (s.tremor && t >= s.tremor && t < s.tremor + 0.3) {
      const k = 1 - (t - s.tremor) / 0.3;
      pos.x += Math.sin(t * 90) * 0.02 * k; pos.y += Math.cos(t * 70) * 0.025 * k;
    }
    if (VIVO) {
      const d = pos.distanceTo(look), a = VIVO * Math.min(1, d / 3) * (s.vivo ?? 1);
      pos.x += deriva(t, 0.3, 0.55) * 0.012 * a; pos.y += deriva(t, 1.9, 0.43) * 0.009 * a;
      look.x += deriva(t, 4.2, 0.37) * 0.008 * a; look.y += deriva(t, 2.6, 0.61) * 0.006 * a;
    }
    const prox = PLANOS[i + 1];
    if (prox && prox.entra === 'chicote' && t > b - WHIP) { const k = (t - (b - WHIP)) / WHIP; giro = k * k * 0.9; borrao = k; }
    if (s.entra === 'chicote' && t < s.a + WHIP) { const k = 1 - (t - s.a) / WHIP; giro = -k * k * 0.9; borrao = Math.max(borrao, k); }
    return {pos, look, fov, giro, borrao, foco: s.segue ? look.toArray() : (s.foco || s.olha), dof: s.dof || 3, plano: i};
  };
  // projeta um ponto 3D na tela (para círculo, rótulo etc. seguirem o objeto)
  const projeta = (t, p, W = 1080, H = 1920) => {
    const c = em(t);
    const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.05, 80);
    cam.position.copy(c.pos); cam.lookAt(c.look); if (c.giro) cam.rotateY(-c.giro);
    cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    const v = new THREE.Vector3(...p).project(cam);
    return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H];
  };
  const Cam = ({t}) => {
    const {camera} = useThree();
    const c = em(t);
    camera.position.copy(c.pos);
    if (camera.fov !== c.fov) { camera.fov = c.fov; camera.updateProjectionMatrix(); }
    camera.lookAt(c.look);
    if (c.giro) camera.rotateY(-c.giro);
    return null;
  };
  return {em, projeta, Cam};
};

// enquadramento por tipo de plano (regra 38): devolve {de, para, olha, z: 1} para um personagem em pé em `p`
// (pés), virado para `r` (rotationY). Os olhos caem no terço de cima e a cabeça nunca sai cortada.
//   tipo: 'rosto' (close de reação), 'busto' (cabeça e tronco, o padrão quando ele fala ou age),
//         'corpo' (inteiro, quando o corpo ou os pés contam a história), 'conjunto' (2 a 3 personagens)
//   lado: ângulo em relação à frente dele (0 = de frente, 0,5 = três-quartos, o padrão); altura: câmera
//   acima (+) ou abaixo (-) dos olhos; empurrao: quanto o plano se aproxima até o fim (0,08 = 8%);
//   perto: multiplica só a distância (0,85 = 15% mais perto); escala: tamanho do personagem (ela = 0,95)
// Alturas do <Ele> com scale 1: olhos ~1,9, cabeça 1,55 a 2,2. Campo de visão vertical 42° (0,768 x distância).
const TIPOS = {rosto: [1.5, 1.72, 0.1], busto: [2.5, 1.5, 0.05], corpo: [3.8, 1.12, 0], conjunto: [4.6, 1.15, 0.05]};
export const enquadra = (p, r, tipo = 'busto', {lado = 0.5, altura = 0, empurrao = 0.08, escala = 1, perto = 1} = {}) => {
  const [d0, y0, dy] = TIPOS[tipo];
  const d = d0 * escala * perto, ang = r + lado;
  const olha = [p[0], p[1] + y0 * escala, p[2]];
  const cam = (k) => [p[0] + Math.sin(ang) * d * k, p[1] + (y0 + dy + altura) * escala, p[2] + Math.cos(ang) * d * k];
  return {de: cam(1), para: cam(1 - empurrao), olha, z: 1};
};

// o EffectComposer só desenha a partir do 2º avanço: sem isto o 1º quadro de cada aba do render sai vazio
export const Aquece = () => {
  const {advance} = useThree();
  const [h] = useState(() => delayRender('aquecer o EffectComposer'));
  useEffect(() => {
    requestAnimationFrame(() => { advance(performance.now()); requestAnimationFrame(() => { advance(performance.now()); continueRender(h); }); });
  }, [advance, h]);
  return null;
};

// profundidade de campo (o foco do plano fica nítido) + vinheta leve
export const Lente = ({cam, t}) => {
  const c = cam.em(t);
  return (
    <EffectComposer multisampling={0}>
      <DepthOfField target={c.foco} focalLength={c.dof >= 5 ? 0.3 : 0.9} bokehScale={c.dof} height={640} />
      <Vignette offset={0.3} darkness={0.35} />
    </EffectComposer>
  );
};

// borrão horizontal do chicote (filtro SVG, só no eixo x)
export const Borrao = ({k}) => (
  <svg width="0" height="0" style={{position: 'absolute'}}>
    <filter id="chicote" x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation={`${(Math.max(0, k) * 60).toFixed(1)} 0`} /></filter>
  </svg>
);

// acabamento do render (regra 38): sombra de contato nas dobras (N8AO), cor um pouco mais viva,
// vinheta leve, profundidade de campo opcional e antisserrilhado SMAA por último.
// Liga com Q.pos (nível 'pc' ou 'nuvem+'); precisa do <Aquece /> dentro do mesmo canvas.
export const Acabamento = ({cam, t, ao = true, dof = false}) => {
  const c = cam ? cam.em(t) : null;
  return (
    <EffectComposer multisampling={0}>
      {ao ? <N8AO aoRadius={0.45} distanceFalloff={0.8} intensity={2.2} color="#1c1410" quality="medium" halfRes /> : <></>}
      {dof && c ? <DepthOfField target={c.foco} focalLength={c.dof >= 5 ? 0.3 : 0.9} bokehScale={c.dof} height={640} /> : <></>}
      <HueSaturation saturation={0.08} />
      <BrightnessContrast contrast={0.06} />
      <Vignette offset={0.35} darkness={0.25} />
      <SMAA />
    </EffectComposer>
  );
};
