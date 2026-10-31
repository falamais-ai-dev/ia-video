// Kit "cena viva" (regra 38): informação dentro da cena e mundo que se mexe.
// Ideia tirada da comparação "versão anterior x final" do Desmontando o Mundo (pesquisa/desmontando-curso/):
// o que separa a animação boa da fraca é cada frase virar algo que muda diante do olho (número de um
// medidor subindo, etiqueta presa na peça, bolhas, chama) e um fundo que nunca está morto.
//   <Medidor>  placa 3D espetada no objeto com um número que muda ao vivo (4 °C → 5 °C, 2 MIN, 35.000 V)
//   <Etiqueta> pílula branca presa a um ponto 3D por um pontinho, segue o objeto na tela (fora do canvas)
//   <Poeira>   partículas lentas na luz: a camada ambiente mais barata (some sozinha em plano de detalhe)
// Tudo em função de t; nada de useFrame (regra do Remotion).
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';

const c01 = (x) => Math.max(0, Math.min(1, x));
const rnd = (k) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const entra = (t, a, dur = 0.35) => {
  const s = c01((t - a) / dur);
  if (s <= 0) return 0;
  const b = 1.6;                                    // easeOutBack: passa do ponto e assenta
  return 1 + (b + 1) * Math.pow(s - 1, 3) + b * Math.pow(s - 1, 2);
};

// textura de texto em cache (uma por texto/cor): a fonte Montserrat já está carregada pelo Video.jsx
const texs = {};
const texTexto = (txt, {fundo = '#1F2A44', cor = '#FFFFFF', w = 512, h = 192, size = 120} = {}) => {
  const k = [txt, fundo, cor, w, h, size].join('|');
  if (texs[k]) return texs[k];
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d');
  g.fillStyle = fundo; g.fillRect(0, 0, w, h);
  g.fillStyle = cor; g.font = `900 ${size}px Montserrat`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(txt, w / 2, h / 2 + size * 0.05, w - 24);
  const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4;
  return (texs[k] = tx);
};
const _q = new THREE.Quaternion();
const fmtNum = (v, casas) => v.toLocaleString('pt-BR', {minimumFractionDigits: casas, maximumFractionDigits: casas});

// placa sempre de frente para a câmera; haste até o ponto `p` (a ponta da haste toca o objeto)
// valor: número (formatado em pt-BR) ou texto; faixa: cor da barra embaixo (vermelho = quente/perigo, azul = frio)
export const Medidor = ({t, p, valor, unidade = '', casas = 0, a = 0, faixa = '#E8433A', haste = 0.45, largura = 0.5, escala = 1}) => {
  const k = entra(t, a) * escala;
  if (k <= 0.001) return null;
  const txt = (typeof valor === 'number' ? fmtNum(valor, casas) : valor) + (unidade ? ' ' + unidade : '');
  const map = texTexto(txt);
  const h = largura * 192 / 512;
  // vira para a câmera mesmo dentro de um grupo girado: q = (giro do pai)^-1 · giro da câmera
  const vira = (m) => (r, s, cam) => { m.parent.getWorldQuaternion(_q); m.quaternion.copy(_q.invert().multiply(cam.quaternion)); m.updateMatrixWorld(); };
  return (
    <group position={p} scale={k}>
      <mesh position={[0, haste / 2, 0]}><cylinderGeometry args={[0.012, 0.012, haste, 8]} /><meshStandardMaterial color="#8C929C" roughness={0.5} /></mesh>
      <group position={[0, haste + h / 2, 0]}>
        <mesh ref={(m) => { if (m) m.onBeforeRender = vira(m); }}>
          <planeGeometry args={[largura, h]} />
          <meshBasicMaterial map={map} toneMapped={false} />
        </mesh>
        <mesh ref={(m) => { if (m) m.onBeforeRender = vira(m); }} position={[0, -h / 2 - 0.012, 0.001]}>
          <planeGeometry args={[largura, 0.025]} />
          <meshBasicMaterial color={faixa} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

// etiqueta em pílula presa a um ponto 3D (fica fora do <ThreeCanvas>, por cima do vídeo)
// cam = objeto da fazCamera; o pontinho fica no objeto e a pílula acima dele (dy em px)
export const Etiqueta = ({t, cam, p, a, b, texto, cor = '#E8433A', dy = -90, min = 160, max = 1120}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (t < a || t >= b) return null;
  const [x, y] = cam.projeta(t, p);
  const k = spring({frame: frame - Math.round(a * fps), fps, config: {damping: 12, stiffness: 180, mass: 0.6}});
  const py = Math.min(max, Math.max(min, y + dy));
  const meia = Math.min(380, 60 + texto.length * 16);   // metade da largura estimada da pílula
  const px = Math.min(972 - meia, Math.max(60 + meia, x));
  return (
    <>
      <div style={{position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: 'white', border: '4px solid #1d1d1d', transform: `scale(${k})`}} />
      <div style={{position: 'absolute', left: px, top: py, transform: `translate(-50%,-50%) scale(${k})`, background: 'white', borderRadius: 40, padding: '10px 26px 10px 20px',
        fontFamily: 'Montserrat', fontWeight: 900, fontSize: 48, color: '#1d1d1d', whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,0.35)'}}>
        <span style={{display: 'inline-block', width: 16, height: 16, borderRadius: 8, background: cor, marginRight: 12, verticalAlign: 'middle', position: 'relative', top: -3}} />
        {texto.toUpperCase()}
      </div>
    </>
  );
};

// poeira na luz: N partículas lentas numa caixa em volta de `centro` (tamanho `caixa`), cor quente
export const Poeira = ({t, centro = [0, 1.2, 0], caixa = [4, 2.4, 3], n = 60, cor = '#FFF3D6', tamanho = 0.012}) => {
  const base = useMemo(() => Array.from({length: n}, (_, i) => [rnd(i * 3.1), rnd(i * 7.3), rnd(i * 1.7), rnd(i * 5.9)]), [n]);
  return (
    <group position={centro}>
      {base.map(([u, v, w, ph], i) => {
        const x = (u - 0.5) * caixa[0] + Math.sin(t * 0.21 + ph * 6.3) * 0.12;
        const y = ((v + t * 0.015 * (0.5 + ph)) % 1 - 0.5) * caixa[1];
        const z = (w - 0.5) * caixa[2] + Math.cos(t * 0.17 + ph * 4.1) * 0.12;
        const s = tamanho * (0.6 + ph);
        return <mesh key={i} position={[x, y, z]} scale={s}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color={cor} transparent opacity={0.35 + 0.3 * Math.sin(t * 1.3 + ph * 9)} depthWrite={false} toneMapped={false} /></mesh>;
      })}
    </group>
  );
};
