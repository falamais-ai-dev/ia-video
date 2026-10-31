// Pós-processamento do visual toon (como o tutorial descreve): oclusão de ambiente, contorno por
// profundidade + normal (silhueta E dobras internas), profundidade de campo, cor e SMAA.
import React, {use, useMemo, useLayoutEffect} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {Effect, EffectAttribute} from 'postprocessing';
import {EffectComposer, EffectComposerContext, N8AO, DepthOfField, HueSaturation, BrightnessContrast, Vignette, SMAA} from '@react-three/postprocessing';

const FRAG = /* glsl */`
uniform sampler2D tNorm; uniform float cNear; uniform float cFar; uniform float px; uniform vec3 tinta; uniform float longe;
float lz(vec2 uv){ float d = readDepth(uv); return (cNear * cFar) / (cFar - d * (cFar - cNear)); }
vec3 nr(vec2 uv){ return normalize(texture2D(tNorm, uv).xyz * 2.0 - 1.0); }
void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor){
  vec2 o = texelSize * px;
  float d0 = lz(uv);
  float dl = lz(uv - vec2(o.x, 0.0)), dr = lz(uv + vec2(o.x, 0.0)), du = lz(uv + vec2(0.0, o.y)), dd = lz(uv - vec2(0.0, o.y));
  float lap = abs(dl + dr + du + dd - 4.0 * d0) / max(d0, 0.001);
  float ed = smoothstep(0.045, 0.065, lap);
  vec3 n0 = nr(uv);
  float en = 0.0;
  en = max(en, 1.0 - dot(n0, nr(uv - vec2(o.x, 0.0))));
  en = max(en, 1.0 - dot(n0, nr(uv + vec2(o.x, 0.0))));
  en = max(en, 1.0 - dot(n0, nr(uv + vec2(0.0, o.y))));
  en = max(en, 1.0 - dot(n0, nr(uv - vec2(0.0, o.y))));
  en = smoothstep(0.38, 0.46, en);
  float e = max(ed, en) * (1.0 - smoothstep(longe * 0.5, longe, d0));
  outputColor = vec4(mix(inputColor.rgb, tinta, e * 0.92), inputColor.a);
}`;
class ContornoFx extends Effect {
  constructor() {
    super('Contorno', FRAG, {attributes: EffectAttribute.DEPTH, uniforms: new Map([
      ['tNorm', new THREE.Uniform(null)], ['cNear', new THREE.Uniform(0.05)], ['cFar', new THREE.Uniform(900)],
      ['px', new THREE.Uniform(1.8)], ['tinta', new THREE.Uniform(new THREE.Color('#372C2E'))], ['longe', new THREE.Uniform(40)],
    ])});
  }
}
const Contorno = ({px = 2.2, longe = 40}) => {
  const {normalPass, camera} = use(EffectComposerContext);
  const fx = useMemo(() => new ContornoFx(), []);
  fx.uniforms.get('tNorm').value = normalPass ? normalPass.texture : null;
  fx.uniforms.get('cNear').value = camera.near; fx.uniforms.get('cFar').value = camera.far;
  fx.uniforms.get('px').value = px; fx.uniforms.get('longe').value = longe;
  return <primitive object={fx} dispose={null} />;
};

export const PosToon = ({foco, bokeh = 3, faixa = 2.5, longe = 40, dof = true, ao = true, sat = 0.12}) => (
  <EffectComposer multisampling={0} enableNormalPass>
    {ao ? <N8AO aoRadius={0.5} distanceFalloff={0.6} intensity={2.4} color="#2a1a14" quality="high" /> : <></>}
    <Contorno longe={longe} />
    {dof ? <DepthOfField target={foco} worldFocusRange={faixa} bokehScale={bokeh} height={720} /> : <></>}
    <HueSaturation saturation={sat} />
    <BrightnessContrast contrast={0.09} brightness={0.02} />
    <Vignette offset={0.38} darkness={0.22} />
    <SMAA />
  </EffectComposer>
);
