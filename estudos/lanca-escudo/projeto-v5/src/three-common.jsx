import {useThree} from '@react-three/fiber';
// câmera controlada pelo quadro (o Remotion renderiza cada quadro do zero)
export const Cam = ({pos, look = [0, 0, 0], fov}) => {
  const {camera} = useThree();
  camera.position.set(...pos);
  if (fov && camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
  camera.lookAt(...look);
  return null;
};
// pseudo-aleatório determinístico
export const rnd = (k) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
// carrega textura e segura o render até ela chegar
export const useTex = (src) => {
  const [handle] = useState(() => delayRender('textura ' + src));
  const [tex, setTex] = useState(null);
  useEffect(() => {
    new THREE.TextureLoader().load(staticFile(src), (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; setTex(t); continueRender(handle); });
  }, [src, handle]);
  return tex;
};
