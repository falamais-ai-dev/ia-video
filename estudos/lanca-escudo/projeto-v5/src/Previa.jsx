// Prévias das 3 opções de personagem fixo: 6 s cada, câmera girando devagar.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, Easing, interpolate} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Cam} from './three-common';
import {Beto, Ele, Ela, Perita, LuzPersonagem, COR} from './personagens';
import {FONT, YELLOW, pop} from './lib';

const W = 1080, H = 1920;
const ease = Easing.inOut(Easing.cubic);

const Fundo = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #EBDDFF 0%, #FFF3DE 70%, #FFE9C4 100%)'}} />
);
const Chao = () => (
  <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}><circleGeometry args={[2.2, 40]} /><meshStandardMaterial color="#D8C3FF" flatShading /></mesh>
    <mesh position={[0, -0.09, 0]}><cylinderGeometry args={[2.2, 2.25, 0.17, 40]} /><meshStandardMaterial color={COR.roxoClaro} flatShading /></mesh>
  </>
);
const Titulo = ({n, nome, sub}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, 2);
  return (
    <div style={{position: 'absolute', left: 60, width: 852, top: 300, textAlign: 'center', fontFamily: FONT, fontWeight: 900, textTransform: 'uppercase', color: 'white', WebkitTextStroke: '12px black', paintOrder: 'stroke fill', textShadow: '0 8px 18px rgba(0,0,0,0.45)', transform: `scale(${0.85 + 0.15 * p})`}}>
      <div style={{fontSize: 56}}>Opção {n}</div>
      <div style={{fontSize: 96, color: YELLOW, lineHeight: 1}}>{nome}</div>
      <div style={{fontSize: 46, marginTop: 10}}>{sub}</div>
    </div>
  );
};
// órbita: começa de 3/4, passa pela frente e termina mais perto
const orbita = (t, dur, alvoY = 1.0, dist0 = 6.2, dist1 = 4.6) => {
  const p = ease(Math.min(1, t / dur));
  const ang = lerp(0.55, -0.3, p);
  const d = lerp(dist0, dist1, p);
  return {pos: [Math.sin(ang) * d, alvoY + 0.35, Math.cos(ang) * d], look: [0, alvoY, 0]};
};
const lerp = (a, b, p) => a + (b - a) * p;

const Palco = ({children, cam}) => (
  <AbsoluteFill>
    <Fundo />
    <ThreeCanvas width={W} height={H} flat gl={{antialias: true}} camera={{fov: 40, position: [0, 2, 6]}}>
      <Cam pos={cam.pos} look={cam.look} fov={40} />
      <LuzPersonagem />
      <Chao />
      {children}
    </ThreeCanvas>
  </AbsoluteFill>
);

export const DUR1 = 180;
export const Opcao1 = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill>
      <Palco cam={orbita(t, 6, 1.75, 8.2, 7.4)}>
        <Beto t={t} position={[0, 0, 0]} acoes={[{t: 0, a: 'acena'}, {t: 1.3, a: 'aponta'}, {t: 2.5, a: 'surpresa'}, {t: 3.5, a: 'pensa'}, {t: 4.7, a: 'comemora'}]} />
      </Palco>
      <Titulo n={1} nome="Beto" sub="O “você” do roteiro" />
    </AbsoluteFill>
  );
};
export const Opcao2 = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill>
      <Palco cam={orbita(t, 6, 1.35, 6.6, 5.9)}>
        <Perita t={t} acoes={[{t: 0, a: 'acena'}, {t: 1.2, a: 'lupa'}, {t: 2.7, a: 'peraAi'}, {t: 3.7, a: 'surpresa'}, {t: 4.6, a: 'pulo'}]} />
      </Palco>
      <Titulo n={2} nome="Perita" sub="A pera do logo, viva" />
    </AbsoluteFill>
  );
};
export const Opcao3 = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill>
      <Palco cam={orbita(t, 6, 1.8, 8.8, 8.0)}>
        <Beto t={t} position={[-0.6, 0, 0]} rotationY={0.25} emblema acoes={[{t: 0, a: 'pensa'}, {t: 2.3, a: 'surpresa'}, {t: 3.4, a: 'duvida'}, {t: 4.7, a: 'comemora'}]} />
        <Perita t={t} position={[0.75, 0, 0.3]} rotationY={-0.35} scale={0.72} acoes={[{t: 0, a: 'parado'}, {t: 1.0, a: 'peraAi'}, {t: 2.2, a: 'lupa'}, {t: 3.4, a: 'explica'}, {t: 4.7, a: 'pulo'}]} />
      </Palco>
      <Titulo n={3} nome="Beto + Perita" sub="Você pergunta, a pera investiga" />
    </AbsoluteFill>
  );
};

// folha de modelo: frente, 3/4 e perfil das duas personagens
export const Folha = () => (
  <AbsoluteFill>
    <Fundo />
    <ThreeCanvas width={W} height={H} flat gl={{antialias: true}} camera={{fov: 30, position: [0, 2, 6]}}>
      <Cam pos={[0, 1.9, 14.5]} look={[0, 1.45, 0]} fov={30} />
      <LuzPersonagem />
      {[0, 0.8, 1.57].map((r, i) => <Beto key={'b' + i} t={0.5} position={[(i - 1) * 1.6, 1.6, 0]} rotationY={r} emblema={false} />)}
      {[0, 0.8, 1.57].map((r, i) => <Perita key={'p' + i} t={0.5} position={[(i - 1) * 1.6, -0.75, 0]} rotationY={r} />)}
    </ThreeCanvas>
  </AbsoluteFill>
);

// teste rápido de pose (câmera de frente)
export const Teste = ({quem = 'pera', acao = 'lupa', l = 1, rot = 0, perto = false}) => (
  <AbsoluteFill>
    <Fundo />
    <ThreeCanvas flat width={W} height={H} camera={{fov: 30, position: [0, 2, 6]}}>
      <Cam pos={quem === 'pera' ? [0, 1.0, 4.6] : perto ? [0, 1.65, 2.6] : [0, 1.3, 6.2]} look={quem === 'pera' ? [0, 0.85, 0] : perto ? [0, 1.55, 0] : [0, 1.15, 0]} fov={30} />
      <LuzPersonagem />
      {quem === 'pera' ? <Perita t={l} acoes={[{t: 0, a: acao}]} /> : quem === 'ele' ? <Ele t={l} rotationY={rot} acoes={[{t: 0, a: acao}]} /> : quem === 'ela' ? <Ela t={l} rotationY={rot} acoes={[{t: 0, a: acao}]} /> : <Beto t={l} acoes={[{t: 0, a: acao}]} emblema />}
    </ThreeCanvas>
  </AbsoluteFill>
);

// os 3 personagens juntos (pedido de 25/10 20:01): ele, a Perita no meio e ela
export const DUR_TRIO = 240;
export const Trio = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill>
      <Palco cam={orbita(t, 8, 1.45, 9.6, 8.4)}>
        <Ele t={t} position={[0, 0, 0.25]} rotationY={0} acoes={[{t: 0, a: 'acena'}, {t: 1.8, a: 'pensa'}, {t: 3.4, a: 'surpresa'}, {t: 4.6, a: 'aponta'}, {t: 6.2, a: 'comemora'}]} />
        <Perita t={t} position={[-1.3, 0, 0.45]} rotationY={0.35} scale={0.7} acoes={[{t: 0, a: 'acena'}, {t: 1.6, a: 'peraAi'}, {t: 2.8, a: 'lupa'}, {t: 4.6, a: 'explica'}, {t: 6.2, a: 'pulo'}]} />
        <Ela t={t} position={[1.3, 0, -0.2]} rotationY={-0.3} acoes={[{t: 0, a: 'acena'}, {t: 1.8, a: 'duvida'}, {t: 3.4, a: 'surpresa'}, {t: 4.6, a: 'pensa'}, {t: 6.2, a: 'comemora'}]} />
      </Palco>
    </AbsoluteFill>
  );
};
