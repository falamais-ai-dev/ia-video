import React from 'react';
import * as THREE from 'three';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {T, Boneco, CoroaOuro, CoroaPrata, Barba, Cavanhaque, BigodeGuidao, Avental, Elmo, Lanca, maoRepouso, ombro} from './toon2';
import {Aquece} from './cinema';
import {PosToon} from './pos';

export const Sol = ({alvo = [0, 0, 0], area = 4}) => {
  const {scene} = useThree();
  const ref = React.useRef();
  React.useLayoutEffect(() => { if (ref.current) { ref.current.target.position.set(...alvo); ref.current.target.updateMatrixWorld(); scene.add(ref.current.target); } });
  return (
    <>
      <hemisphereLight args={['#B8AEDF', '#A08E78', 1.15]} />
      <directionalLight ref={ref} position={[alvo[0] - 8, alvo[1] + 6.4, alvo[2] + 5]} intensity={2.6} color="#FFD9A6" castShadow
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.02}
        shadow-camera-left={-area} shadow-camera-right={area} shadow-camera-top={area} shadow-camera-bottom={-area} shadow-camera-near={0.5} shadow-camera-far={area * 6 + 30} />
      <directionalLight position={[alvo[0] + 6, alvo[1] + 4, alvo[2] - 7]} intensity={0.7} color="#FFE8C8" />
    </>
  );
};
const Cam = ({pos, look, fov}) => { const {camera} = useThree(); camera.position.set(...pos); camera.fov = fov; camera.near = 0.05; camera.far = 600; camera.updateProjectionMatrix(); camera.lookAt(...look); return null; };

export const Elenco = () => {
  const t = useCurrentFrame() / 30;
  const P = [[-0.9, 0, 0], [-0.3, 0, 0], [0.3, 0, 0], [0.9, 0, 0]];
  return (
    <AbsoluteFill style={{background: '#cfe3f2'}}>
      <ThreeCanvas width={1080} height={1920} shadows gl={{antialias: true}} camera={{fov: 40, position: [0, 1, 4]}}>
        <Cam pos={[0, 1.0, 3.3]} look={[0, 0.7, 0]} fov={40} />
        <Sol />
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={T('#E1C99A')} receiveShadow><planeGeometry args={[20, 20]} /></mesh>
        <Boneco pos={P[0]} ry={0.25} c={{cor: '#E34835', olhos: 'semi', boca: 'dentes', sob: 0.4, capa: '#9E2A22', resp: t * 3,
          mP: [P[0][0] + 0.25, 0.45, 0.1], cabeca: <><CoroaOuro /><Cavanhaque /></>}} />
        <Lanca grip={[P[0][0] + 0.25, 0.45, 0.1]} dir={[0, 1, 0]} comp={1.5} frente={0.95} />
        <Boneco pos={P[1]} ry={0} c={{cor: '#D9CBB0', olhos: 'grande', boca: 'O', sob: -0.7, resp: t * 3 + 1, roupa: <Avental />, cabeca: <BigodeGuidao />}} />
        <Boneco pos={P[2]} ry={-0.2} c={{cor: '#1F9A9A', olhos: 'bravo', boca: 'brava', sob: 1, capa: '#126B6B', resp: t * 3 + 2, cabeca: <><CoroaPrata /><Barba comp={0.24} /></>}} />
        <Boneco pos={P[3]} ry={-0.3} c={{cor: '#8B5E3C', olhos: 'tedio', boca: 'reta', sob: 0, resp: t * 3 + 3, mP: [P[3][0] - 0.22, 0.75, 0.1], cabeca: <><Elmo /><Barba comp={0.42} y={0.06} /></>}} />
        <Lanca grip={[P[3][0] - 0.22, 0.75, 0.1]} dir={[0.02, 1, 0]} comp={1.6} frente={0.8} borla="#7A5A3A" />
        <Aquece /><PosToon foco={[0, 0.7, 0]} bokeh={1} faixa={3} longe={30} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
