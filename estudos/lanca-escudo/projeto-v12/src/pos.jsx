// Pós-processamento do visual toon (como o tutorial descreve): oclusão de ambiente, contorno por
// profundidade + normal (silhueta E dobras internas), profundidade de campo, cor e SMAA.
import React, {use, useMemo, useLayoutEffect} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {Effect, EffectAttribute} from 'postprocessing';
import {EffectComposer, EffectComposerContext, N8AO, DepthOfField, HueSaturation, BrightnessContrast, Vignette, SMAA} from '@react-three/postprocessing';

const FRAG = /* glsl */`
uniform sampler2D tNorm; uniform float cNear; uniform float cFar; uniform float px; uniform vec3 tinta; uniform float longe;
uniform vec3 neb; uniform float nebIni; uniform float nebFim; uniform float nebMax; uniform float rimK;
float lz(vec2 uv){ float d = readDepth(uv); return (cNear * cFar) / (cFar - d * (cFar - cNear)); }
vec3 nr(vec2 uv){ return normalize(texture2D(tNorm, uv).xyz * 2.0 - 1.0); }
void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor){
  // traço com peso: silhueta mais grossa do lado da sombra e perto da câmera, dobras internas finas,
  // e uma leve variação "à mão" ao longo da linha
  float d0 = lz(uv);
  float perto = clamp(2.6 / max(d0, 0.001), 0.75, 1.25);
  float mao = 1.0;
  vec2 o1 = texelSize * px * 0.8 * perto, o2 = texelSize * px * 1.55 * perto * mao;
  float ed1, ed2;
  {
    float dl = lz(uv - vec2(o1.x, 0.0)), dr = lz(uv + vec2(o1.x, 0.0)), du = lz(uv + vec2(0.0, o1.y)), dd = lz(uv - vec2(0.0, o1.y));
    ed1 = smoothstep(0.045, 0.065, abs(dl + dr + du + dd - 4.0 * d0) / max(d0, 0.001));
  }
  {
    vec2 a = uv - vec2(o2.x, 0.0), b = uv + vec2(o2.x, 0.0), c = uv + vec2(0.0, o2.y), dd2 = uv - vec2(0.0, o2.y);
    float dl = lz(a), dr = lz(b), du = lz(c), dd = lz(dd2);
    ed2 = smoothstep(0.06, 0.09, abs(dl + dr + du + dd - 4.0 * d0) / max(d0, 0.001));
    // o objeto da frente decide o peso: se ele está na sombra, a linha engrossa
    vec2 un = uv; float dm = d0;
    if (dl < dm) { dm = dl; un = a; } if (dr < dm) { dm = dr; un = b; } if (du < dm) { dm = du; un = c; } if (dd < dm) { dm = dd; un = dd2; }
    float ln = dot(texture2D(inputBuffer, un).rgb, vec3(0.299, 0.587, 0.114));
    ed2 *= 1.0 - smoothstep(0.42, 0.7, ln);
  }
  float ed = max(ed1, ed2);
  vec2 o = texelSize * px * 0.6;
  vec3 n0 = nr(uv);
  float en = 0.0;
  en = max(en, 1.0 - dot(n0, nr(uv - vec2(o.x, 0.0))));
  en = max(en, 1.0 - dot(n0, nr(uv + vec2(o.x, 0.0))));
  en = max(en, 1.0 - dot(n0, nr(uv + vec2(0.0, o.y))));
  en = max(en, 1.0 - dot(n0, nr(uv - vec2(0.0, o.y))));
  en = smoothstep(0.38, 0.46, en);
  float e = max(ed, en) * (1.0 - smoothstep(longe * 0.5, longe, d0));
  o = texelSize * px;
  // filete de luz: faixa logo dentro da silhueta (depois do traço geométrico), onde a borda está a 4-9 px
  float lum = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
  vec2 oF = o * 15.0, oN = o * 3.0; float iz = 1.0 / max(d0, 0.001);
  float fl = (lz(uv - vec2(oF.x, 0.0)) - d0) * iz, fr = (lz(uv + vec2(oF.x, 0.0)) - d0) * iz;
  float fu = (lz(uv + vec2(0.0, oF.y)) - d0) * iz, fd = (lz(uv - vec2(0.0, oF.y)) - d0) * iz;
  float nl = (lz(uv - vec2(oN.x, 0.0)) - d0) * iz, nr2 = (lz(uv + vec2(oN.x, 0.0)) - d0) * iz;
  float nu = (lz(uv + vec2(0.0, oN.y)) - d0) * iz, nd = (lz(uv - vec2(0.0, oN.y)) - d0) * iz;
  float lado = max(max(min(fl, -fr + 1.0) , min(fr, -fl + 1.0)), max(min(fu, -fd + 1.0), min(fd, -fu + 1.0)));
  float grosso = 1.0 - smoothstep(0.1, 0.25, min(max(fl, fr), max(fu, fd)) * step(0.2, min(fl, fr) + min(fu, fd)));
  float rim = smoothstep(0.2, 0.4, lado) * (1.0 - smoothstep(0.03, 0.08, max(max(nl, nr2), max(nu, nd)))) * smoothstep(0.3, 0.45, lum) * (1.0 - smoothstep(longe * 0.25, longe * 0.5, d0));
  float satu = max(inputColor.r, max(inputColor.g, inputColor.b)) - min(inputColor.r, min(inputColor.g, inputColor.b));
  rim *= 1.0 - smoothstep(0.18, 0.3, satu); // só nas cabeças e peles claras, nunca no metal dourado
  // pontas finas (os dois lados longe no mesmo eixo) não ganham filete
  rim *= 1.0 - smoothstep(0.1, 0.25, min(fl, fr)) ; rim *= 1.0 - smoothstep(0.1, 0.25, min(fu, fd));
  vec3 col = mix(inputColor.rgb, vec3(1.0, 0.97, 0.9), rim * rimK);
  // névoa creme ao longe (perspectiva atmosférica); o céu (profundidade ~1) fica como está
  float ceu = step(0.99995, readDepth(uv));
  float nb = smoothstep(nebIni, nebFim, d0) * nebMax * (1.0 - ceu);
  col = mix(col, neb, nb);
  outputColor = vec4(mix(col, tinta, e * 0.92 * (1.0 - nb)), inputColor.a);
}`;
class ContornoFx extends Effect {
  constructor() {
    super('Contorno', FRAG, {attributes: EffectAttribute.DEPTH, uniforms: new Map([
      ['tNorm', new THREE.Uniform(null)], ['cNear', new THREE.Uniform(0.05)], ['cFar', new THREE.Uniform(900)],
      ['px', new THREE.Uniform(1.8)], ['tinta', new THREE.Uniform(new THREE.Color('#372C2E'))], ['longe', new THREE.Uniform(40)],
      ['neb', new THREE.Uniform(new THREE.Color('#E3E4DC'))], ['nebIni', new THREE.Uniform(6)], ['nebFim', new THREE.Uniform(90)], ['nebMax', new THREE.Uniform(0.6)], ['rimK', new THREE.Uniform(0.75)],
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

export const PosToon = ({foco, bokeh = 3, faixa = 2.5, longe = 40, dof = true, ao = true, sat = 0.12, dpr = 1}) => (
  <EffectComposer multisampling={0} enableNormalPass>
    {ao ? <N8AO aoRadius={0.5} distanceFalloff={0.6} intensity={2.4} color="#2a1a14" quality="high" /> : <></>}
    <Contorno longe={longe} px={2.2 * dpr} />
    {dof ? <DepthOfField target={foco} worldFocusRange={faixa} bokehScale={bokeh} resolutionScale={1} /> : <></>}
    <HueSaturation saturation={sat} />
    <BrightnessContrast contrast={0.09} brightness={0.02} />
    <Vignette offset={0.38} darkness={0.22} />
    <SMAA />
  </EffectComposer>
);
