// Exportador do piloto de traço: roda a cena da v11 (LancaEscudo2) sem tocar no código dela,
// captura a cena three.js do quadro pedido e manda um .glb + câmera/sol em JSON para um servidor local.
import React from '../../projeto-v11/node_modules/react';
import * as THREE from '../../projeto-v11/node_modules/three/build/three.module.js';
import {GLTFExporter} from '../../projeto-v11/node_modules/three/examples/jsm/exporters/GLTFExporter.js';
import {registerRoot, Composition, useCurrentFrame, delayRender, continueRender, getInputProps} from '../../projeto-v11/node_modules/remotion';
import {LancaEscudo2, DUR_LE2} from '../../projeto-v11/src/LancaEscudo2';

const IN = getInputProps();
const PORTA = IN.porta || 8765;
let ultima = null;
// o renderer chama scene.onBeforeRender(renderer, scene, camera) a cada desenho (render é atribuído por instância, não no protótipo)
const origOBR = THREE.Object3D.prototype.onBeforeRender;
THREE.Object3D.prototype.onBeforeRender = function (r, scene, camera, ...x) {
  if (this.isScene && camera && camera.isPerspectiveCamera) ultima = {scene: this, camera};
  return origOBR.call(this, r, scene, camera, ...x);
};

// casca invertida (HULL) -> peso do traço da malha irmã; casca sai do arquivo
const pesoHull = (m) => (m && m.isShaderMaterial && m.side === THREE.BackSide && m.uniforms && m.uniforms.k ? m.uniforms.k.value / 0.0036 : 0);
const matPara = (m, cache) => {
  if (cache.has(m)) return cache.get(m);
  let o;
  if (m.isMeshMatcapMaterial) {
    // metal em matcap: cor média do matcap como base, marcado para o Blender trocar por metal toon
    o = new THREE.MeshStandardMaterial({color: m.color, metalness: 1, roughness: 0.35});
    const c = m.matcap && m.matcap.image; if (c && c.getContext) { const d = c.getContext('2d').getImageData(c.width / 2 - 20, c.height / 2 - 20, 40, 40).data; let r = 0, g = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; } const n = d.length / 4; o.color.setRGB(r / n / 255, g / n / 255, b / n / 255, THREE.SRGBColorSpace); }
    o.name = 'METAL';
  } else if (m.isMeshBasicMaterial) {
    o = new THREE.MeshBasicMaterial({color: m.color, map: m.map, side: m.side, transparent: m.transparent, opacity: m.opacity}); o.name = 'UNLIT';
  } else {
    o = new THREE.MeshStandardMaterial({color: m.color, map: m.map || null, side: m.side, transparent: m.transparent, opacity: m.opacity, roughness: 1, metalness: 0}); o.name = 'TOON';
  }
  o.name += '_' + (m.color ? m.color.getHexString() : 'x') + (m.map ? '_tex' : '');
  cache.set(m, o); return o;
};
const montar = (scene) => {
  scene.updateMatrixWorld(true);
  const raiz = new THREE.Group(); raiz.name = 'cena';
  const cache = new Map(); const stats = {malhas: 0, cascas: 0, instancias: 0, pulados: {}};
  const pula = (k) => { stats.pulados[k] = (stats.pulados[k] || 0) + 1; };
  const visivel = (o) => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
  // peso de traço por geometria/irmão
  const peso = new Map();
  scene.traverse((o) => { if (o.isMesh && pesoHull(o.material) && o.parent) o.parent.children.forEach((s) => { if (s !== o && s.isMesh && s.geometry === o.geometry) peso.set(s, pesoHull(o.material)); }); });
  scene.traverse((o) => {
    if (!visivel(o)) return;
    if (o.isSprite) return pula('sprite');
    if (o.isPoints) return pula('points');
    if (!o.isMesh) return;
    const m = Array.isArray(o.material) ? o.material[0] : o.material;
    if (pesoHull(m)) { stats.cascas++; return; }
    if (m.isShaderMaterial) return pula('shader:' + (o.geometry.type || '?'));
    const mat = matPara(m, cache);
    if (o.isInstancedMesh) {
      // assa as instâncias numa malha só (o Blender não precisa de extensão)
      const n = o.count; const g0 = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry;
      const pos = g0.attributes.position, nor = g0.attributes.normal; const vc = pos.count;
      const P = new Float32Array(vc * n * 3), N = new Float32Array(vc * n * 3);
      const M = new THREE.Matrix4(), W = new THREE.Matrix4(), NM = new THREE.Matrix3(), v = new THREE.Vector3();
      for (let i = 0; i < n; i++) { o.getMatrixAt(i, M); W.multiplyMatrices(o.matrixWorld, M); NM.getNormalMatrix(W);
        for (let j = 0; j < vc; j++) { v.fromBufferAttribute(pos, j).applyMatrix4(W); P.set([v.x, v.y, v.z], (i * vc + j) * 3); if (nor) { v.fromBufferAttribute(nor, j).applyMatrix3(NM).normalize(); N.set([v.x, v.y, v.z], (i * vc + j) * 3); } } }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); if (nor) g.setAttribute('normal', new THREE.BufferAttribute(N, 3));
      const mesh = new THREE.Mesh(g, mat); mesh.name = 'inst_' + (o.name || o.geometry.type) + '_' + n;
      mesh.userData = {traco: peso.get(o) || (pesoInst(o, scene) || 0), instancias: n, sombra: o.castShadow};
      raiz.add(mesh); stats.instancias += n; return;
    }
    const mesh = new THREE.Mesh(o.geometry, mat); mesh.name = (o.name || o.geometry.type) + '_' + stats.malhas;
    o.matrixWorld.decompose(mesh.position, mesh.quaternion, mesh.scale);
    mesh.userData = {traco: peso.get(o) || 0, sombra: o.castShadow};
    raiz.add(mesh); stats.malhas++;
  });
  return {raiz, stats};
};
// instanced com casca: casca é outro InstancedMesh com a mesma geometria (soldados, copas)
const pesoInst = (o, scene) => { let w = 0; o.parent && o.parent.children.forEach((s) => { if (s !== o && s.isInstancedMesh && s.geometry === o.geometry && pesoHull(s.material)) w = pesoHull(s.material); }); return w; };

const manda = (nome, corpo, tipo) => fetch(`http://localhost:${PORTA}/${nome}`, {method: 'POST', body: corpo, headers: {'Content-Type': tipo}});

const Exporta = () => {
  const f = useCurrentFrame();
  const [h] = React.useState(() => delayRender('exportando glb', {timeoutInMilliseconds: 600000}));
  React.useEffect(() => {
    let vivo = true;
    const vai = async () => {
      for (let i = 0; i < 40 && !ultima; i++) await new Promise((r) => setTimeout(r, 250));
      await new Promise((r) => setTimeout(r, 1500));
      const {scene, camera} = ultima;
      const {raiz, stats} = montar(scene);
      const sol = []; scene.traverse((o) => { if (o.isDirectionalLight) { const t = new THREE.Vector3(); o.target.getWorldPosition(t); sol.push({pos: o.getWorldPosition(new THREE.Vector3()).toArray(), alvo: t.toArray(), int: o.intensity, cor: '#' + o.color.getHexString(), sombra: o.castShadow}); } });
      camera.updateMatrixWorld(true);
      const info = {quadro: f, cam: {matriz: camera.matrixWorld.toArray(), fov: camera.fov, aspect: camera.aspect, near: camera.near, far: camera.far},
        nevoa: scene.fog ? {cor: '#' + scene.fog.color.getHexString(), near: scene.fog.near, far: scene.fog.far} : null, sol, stats};
      const glb = await new GLTFExporter().parseAsync(raiz, {binary: true, onlyVisible: true, maxTextureSize: 2048});
      await manda(`q${f}.glb`, glb, 'application/octet-stream');
      await manda(`q${f}.json`, JSON.stringify(info, null, 1), 'application/json');
      if (vivo) continueRender(h);
    };
    vai().catch(async (e) => { await manda(`q${f}.erro.txt`, String(e && e.stack || e), 'text/plain'); continueRender(h); });
    return () => { vivo = false; };
  }, []);
  return <LancaEscudo2 />;
};
registerRoot(() => <Composition id="Exporta" component={Exporta} durationInFrames={DUR_LE2} fps={30} width={1080} height={1920} />);
