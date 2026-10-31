# Piloto de traço (lança x escudo): monta no Blender 4.5 a cena exportada da v11 (glb + json de câmera/sol)
# com cel de 2 tons em EEVEE, sombra roxa, sol quente baixo, filete de luz, névoa creme e Line Art #372C2E
# com largura em pixels (5,5 px nos personagens, 3 px nos objetos, mais grosso no lado da sombra).
# uso: blender -b --factory-startup --python montar.py -- cena.glb cena.json saida.png
import bpy, bmesh, sys, json, math
from mathutils import Matrix, Vector, Color

argv = sys.argv[sys.argv.index('--') + 1:]
GLB, JSN, OUT = argv[:3]
W, H = 1080, 1920
PX_PERS, PX_OBJ = 5.5, 3.0          # largura do traço (px) no lado iluminado
K_SOMBRA = 1.45                     # lado da sombra: traço 45% mais grosso
LONGE = 60.0                        # traço some entre LONGE/2 e LONGE (como o contorno da v11)
TINTA = '#372C2E'

def lin(hexs):
    c = Color(); c.r, c.g, c.b = [int(hexs.lstrip('#')[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return c.from_srgb_to_scene_linear()

info = json.load(open(JSN))
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)
sc = bpy.context.scene
C = Matrix.Rotation(math.radians(90), 4, 'X')   # Y-up (three) -> Z-up (Blender), igual ao importador glTF
v3 = lambda a: (C @ Vector((a[0], a[1], a[2], 1))).to_3d()

# ---------- câmera ----------
M = Matrix([info['cam']['matriz'][i::4] for i in range(4)])
cam_d = bpy.data.cameras.new('cam'); cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam)
cam.matrix_world = C @ M
cam_d.sensor_fit = 'VERTICAL'; cam_d.angle_y = math.radians(info['cam']['fov'])
cam_d.clip_start = info['cam']['near']; cam_d.clip_end = info['cam']['far']
sc.camera = cam
CAM_P = cam.matrix_world.translation.copy(); CAM_F = -(cam.matrix_world.to_3x3() @ Vector((0, 0, 1))).normalized()
PIX = 2 * math.tan(cam_d.angle_y / 2) / H        # tamanho de 1 px por metro de profundidade

# ---------- sol quente e baixo (mesmo azimute da v11, elevação 22°) ----------
s0 = info['sol'][0]; d = v3(s0['pos']) - v3(s0['alvo']); hz = Vector((d.x, d.y, 0)).normalized()
para_sol = (hz + Vector((0, 0, math.tan(math.radians(22))))).normalized()
sun_d = bpy.data.lights.new('sol', 'SUN'); sun_d.energy = 4.0; sun_d.color = (1.0, 0.86, 0.66); sun_d.angle = math.radians(0.6)
sun = bpy.data.objects.new('sol', sun_d); sc.collection.objects.link(sun)
sun.rotation_euler = (-para_sol).to_track_quat('-Z', 'Y').to_euler()

# ---------- mundo: céu em degradê (igual ao shader da v11) só para a câmera, luz ambiente fraca ----------
wd = bpy.data.worlds.new('ceu'); sc.world = wd; wd.use_nodes = True; nt = wd.node_tree; nt.nodes.clear()
N = nt.nodes.new; L = nt.links.new
tc = N('ShaderNodeTexCoord'); sep = N('ShaderNodeSeparateXYZ'); L(tc.outputs['Generated'], sep.inputs[0])
mh = N('ShaderNodeMath'); mh.operation = 'MULTIPLY_ADD'; mh.inputs[1].default_value = 1.5; mh.inputs[2].default_value = 0.05; mh.use_clamp = True; L(sep.outputs['Z'], mh.inputs[0])
pw = N('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 0.6; L(mh.outputs[0], pw.inputs[0])
mx = N('ShaderNodeMix'); mx.data_type = 'RGBA'; L(pw.outputs[0], mx.inputs['Factor'])
mx.inputs[6].default_value = (*Color((0.86, 0.93, 0.98)).from_srgb_to_scene_linear(), 1); mx.inputs[7].default_value = (*Color((0.24, 0.52, 0.9)).from_srgb_to_scene_linear(), 1)
bg_c = N('ShaderNodeBackground'); L(mx.outputs[2], bg_c.inputs[0])
bg_l = N('ShaderNodeBackground'); bg_l.inputs[0].default_value = (0.35, 0.33, 0.45, 1); bg_l.inputs[1].default_value = 0.25
lp = N('ShaderNodeLightPath'); ms = N('ShaderNodeMixShader'); L(lp.outputs['Is Camera Ray'], ms.inputs[0]); L(bg_l.outputs[0], ms.inputs[1]); L(bg_c.outputs[0], ms.inputs[2])
L(ms.outputs[0], N('ShaderNodeOutputWorld').inputs[0])

# ---------- materiais cel ----------
NEB = lin('#E3E4DC'); SOMBRA = Color((0.68, 0.60, 0.90)); LUZ = Color((1.0, 0.95, 0.86)); CREME = Color((1.0, 0.97, 0.9))
def info_mat(m):
    """cor base e textura do material glTF importado"""
    cor, tex = (1, 1, 1, 1), None
    if m and m.use_nodes:
        p = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
        if p:
            cor = tuple(p.inputs['Base Color'].default_value)
            tex = next((n.image for n in m.node_tree.nodes if n.type == 'TEX_IMAGE' and n.image), None)
            if tex:   # com textura, o importador guarda o fator de cor num nó de multiplicar
                mu = next((n for n in m.node_tree.nodes if n.type == 'MIX' and n.blend_type == 'MULTIPLY'), None)
                if mu:
                    sk = next((x for x in (mu.inputs[6], mu.inputs[7]) if not x.is_linked), None)
                    if sk: cor = tuple(sk.default_value)
        e = next((n for n in m.node_tree.nodes if n.type == 'EMISSION'), None)   # KHR_materials_unlit
        if e and not p: cor = tuple(e.inputs['Color'].default_value)
    return cor, tex

def cel(nome, tipo, cor, tex, mask):
    m = bpy.data.materials.new(nome); m.use_nodes = True; t = m.node_tree; t.nodes.clear(); N = t.nodes.new; L = t.links.new
    base = N('ShaderNodeRGB'); base.outputs[0].default_value = cor; bs = base.outputs[0]
    if tex:
        it = N('ShaderNodeTexImage'); it.image = tex; mm = N('ShaderNodeMix'); mm.data_type = 'RGBA'; mm.blend_type = 'MULTIPLY'; mm.inputs['Factor'].default_value = 1
        L(it.outputs[0], mm.inputs[6]); L(bs, mm.inputs[7]); bs = mm.outputs[2]
    if tipo == 'UNLIT':
        col = bs
    else:
        dif = N('ShaderNodeBsdfDiffuse'); dif.inputs[0].default_value = (1, 1, 1, 1)
        s2r = N('ShaderNodeShaderToRGB'); L(dif.outputs[0], s2r.inputs[0])
        bw = N('ShaderNodeRGBToBW'); L(s2r.outputs[0], bw.inputs[0])
        rp = N('ShaderNodeValToRGB'); rp.color_ramp.interpolation = 'CONSTANT'; rp.color_ramp.elements[1].position = 0.32; L(bw.outputs[0], rp.inputs[0])
        sh = N('ShaderNodeMix'); sh.data_type = 'RGBA'; sh.blend_type = 'MULTIPLY'; sh.inputs['Factor'].default_value = 1; L(bs, sh.inputs[6]); sh.inputs[7].default_value = (*SOMBRA, 1)
        lt = N('ShaderNodeMix'); lt.data_type = 'RGBA'; lt.blend_type = 'MULTIPLY'; lt.inputs['Factor'].default_value = 1; L(bs, lt.inputs[6]); lt.inputs[7].default_value = (*LUZ, 1)
        mix = N('ShaderNodeMix'); mix.data_type = 'RGBA'; L(rp.outputs[0], mix.inputs['Factor']); L(sh.outputs[2], mix.inputs[6]); L(lt.outputs[2], mix.inputs[7]); col = mix.outputs[2]
        if tipo == 'METAL':   # brilho chapado de metal pintado
            gl = N('ShaderNodeBsdfAnisotropic') if False else N('ShaderNodeBsdfGlossy'); gl.inputs['Roughness'].default_value = 0.25
            s2 = N('ShaderNodeShaderToRGB'); L(gl.outputs[0], s2.inputs[0]); b2 = N('ShaderNodeRGBToBW'); L(s2.outputs[0], b2.inputs[0])
            r2 = N('ShaderNodeValToRGB'); r2.color_ramp.interpolation = 'CONSTANT'; r2.color_ramp.elements[1].position = 0.55; L(b2.outputs[0], r2.inputs[0])
            hm = N('ShaderNodeMix'); hm.data_type = 'RGBA'; L(r2.outputs[0], hm.inputs['Factor']); L(col, hm.inputs[6]); hm.inputs[7].default_value = (1, 0.98, 0.92, 1); col = hm.outputs[2]
        hsv = Color(cor[:3]).s
        if tipo == 'TOON' and hsv < 0.3 and not tex:   # filete de luz de ~2 px: só nas peles/cabeças claras, só do lado iluminado
            lw = N('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.5
            r3 = N('ShaderNodeValToRGB'); r3.color_ramp.interpolation = 'CONSTANT'; r3.color_ramp.elements[1].position = 0.9; L(lw.outputs['Facing'], r3.inputs[0])
            mk = N('ShaderNodeMath'); mk.operation = 'MULTIPLY'; L(r3.outputs[0], mk.inputs[0]); L(rp.outputs[0], mk.inputs[1])
            m2 = N('ShaderNodeMath'); m2.operation = 'MULTIPLY'; m2.inputs[1].default_value = 0.8; L(mk.outputs[0], m2.inputs[0])
            rm = N('ShaderNodeMix'); rm.data_type = 'RGBA'; L(m2.outputs[0], rm.inputs['Factor']); L(col, rm.inputs[6]); rm.inputs[7].default_value = (*CREME, 1); col = rm.outputs[2]
    # névoa creme ao longe (mesma curva do pós da v11: 6 m -> 90 m, máx. 60%)
    cd = N('ShaderNodeCameraData'); mr = N('ShaderNodeMapRange'); mr.interpolation_type = 'SMOOTHSTEP'
    mr.inputs['From Min'].default_value = 6; mr.inputs['From Max'].default_value = 90; mr.inputs['To Max'].default_value = 0.6; L(cd.outputs['View Z Depth'], mr.inputs['Value'])
    fm = N('ShaderNodeMix'); fm.data_type = 'RGBA'; L(mr.outputs['Result'], fm.inputs['Factor']); L(col, fm.inputs[6]); fm.inputs[7].default_value = (*NEB, 1)
    em = N('ShaderNodeEmission'); L(fm.outputs[2], em.inputs[0])
    if tex and tex.alpha_mode != 'NONE' and False: pass
    L(em.outputs[0], N('ShaderNodeOutputMaterial').inputs[0])
    return m

# ---------- quem é personagem, objeto ou já é traço ----------
objs = [o for o in sc.objects if o.type == 'MESH']
ORIG = {o: o.active_material for o in objs}; NV = {o: len(o.data.vertices) for o in objs}          # antes de trocar: malhas são compartilhadas entre objetos
for o in objs:
    if o.data.users > 1: o.data = o.data.copy()
    if not info_mat(ORIG[o])[1]:                     # sem textura: costura o torno/esfera (vértices duplicados viram traço)
        bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5); bm.to_mesh(o.data); bm.free()
def caixa(o):
    bb = [o.matrix_world @ Vector(c) for c in o.bound_box]
    mn = Vector([min(v[i] for v in bb) for i in range(3)]); mx = Vector([max(v[i] for v in bb) for i in range(3)])
    return (mn + mx) / 2, mx - mn
cabecas = [caixa(o)[0] for o in objs if o.name.startswith('LatheGeometry') and NV[o] == 1681]
# lança: cilindro longo e fino perto de um rei; escudo: o maior disco de 220 vértices perto de um rei
perto = lambda c, r: any(math.hypot(c.x - h.x, c.y - h.y) < r for h in cabecas)
def eixo(o):
    vs = [o.matrix_world @ v.co for v in o.data.vertices]; c, dm = caixa(o); ax = max(range(3), key=lambda i: dm[i])
    return min(vs, key=lambda v: v[ax]), max(vs, key=lambda v: v[ax])
haste = [eixo(o) for o in objs if o.name.startswith('Cylinder') and max(caixa(o)[1]) > 0.9 and sorted(caixa(o)[1])[1] < 0.25 and perto(caixa(o)[0], 1.0)]
escudos = [caixa(o) for o in objs if o.name.startswith('Cylinder') and NV[o] == 220 and perto(caixa(o)[0], 1.0)]
def na_lanca(c):
    for a0, a1 in haste:
        d = a1 - a0; t = (c - a0).dot(d) / d.length_squared
        if -0.1 < t < 1.3 and (a0 + d * t - c).length < 0.08: return True
    return False
no_escudo = lambda c: any((c - ec).length < max(ed) * 0.6 for ec, ed in escudos)
classe = {}
for o in objs:
    c, dm = caixa(o); mat = o.active_material; nome = mat.name if mat else ''
    if nome.startswith('UNLIT') and (Color(info_mat(mat)[0][:3]).v < 0.3): classe[o] = 'traco'; continue  # membros, olhos, sobrancelhas
    if o.get('instancias'): classe[o] = 'campo'; continue
    if cabecas and perto(c, 0.45) and c.z < 1.7 and max(dm) < 0.9 and not na_lanca(c) and not no_escudo(c): classe[o] = 'pers'
    else: classe[o] = 'obj'
print('CLASSES', {k: sum(1 for v in classe.values() if v == k) for k in set(classe.values())}, 'cabecas', len(cabecas), 'hastes', len(haste), 'escudos', len(escudos))

COLS = {k: bpy.data.collections.new('c_' + k) for k in ('pers', 'obj', 'resto')}
for c in COLS.values(): sc.collection.children.link(c)
COLS['resto'].lineart_usage = 'OCCLUSION_ONLY'
cache = {}
for o in objs:
    old = ORIG[o]; cor, tex = info_mat(old); nome = old.name if old else 'TOON'
    tipo = 'UNLIT' if nome.startswith('UNLIT') else 'METAL' if nome.startswith('METAL') else 'TOON'
    k = classe[o]; mask = {'pers': 0, 'obj': 1}.get(k, -1)
    if o.name.startswith('PlaneGeometry') and max(caixa(o)[1]) > 50: mask = -1   # chão
    key = (old.name if old else '-', mask)
    if key not in cache: cache[key] = cel(f'{tipo}_{k}_{len(cache)}', tipo, cor, tex, mask)
    o.data.materials.clear(); o.data.materials.append(cache[key])
    dest = COLS['pers'] if mask == 0 else COLS['obj'] if mask == 1 else COLS['resto']
    for c in list(o.users_collection): c.objects.unlink(o)
    dest.objects.link(o)
    if k == 'campo' or o.get('sombra') is False: o.visible_shadow = bool(o.get('sombra'))

# ---------- Line Art em pixels ----------
def grupo_px(px):
    g = bpy.data.node_groups.new(f'px{px:.2f}', 'GeometryNodeTree'); N = g.nodes.new; L = g.links.new
    g.interface.new_socket('Geometry', in_out='INPUT', socket_type='NodeSocketGeometry'); g.interface.new_socket('Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
    gi = N('NodeGroupInput'); go = N('NodeGroupOutput')
    tc = N('GeometryNodeGreasePencilToCurves'); tc.inputs['Layers as Instances'].default_value = True; L(gi.outputs[0], tc.inputs[0])
    pos = N('GeometryNodeInputPosition'); sub = N('ShaderNodeVectorMath'); sub.operation = 'SUBTRACT'; sub.inputs[1].default_value = CAM_P; L(pos.outputs[0], sub.inputs[0])
    dot = N('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'; dot.inputs[1].default_value = CAM_F; L(sub.outputs[0], dot.inputs[0])
    r = N('ShaderNodeMath'); r.operation = 'MULTIPLY'; r.inputs[1].default_value = px / 2 * PIX; L(dot.outputs['Value'], r.inputs[0])
    fade = N('ShaderNodeMapRange'); fade.interpolation_type = 'SMOOTHSTEP'; fade.inputs['From Min'].default_value = LONGE / 2; fade.inputs['From Max'].default_value = LONGE
    fade.inputs['To Min'].default_value = 1; fade.inputs['To Max'].default_value = 0; L(dot.outputs['Value'], fade.inputs['Value'])
    r2 = N('ShaderNodeMath'); r2.operation = 'MULTIPLY'; L(r.outputs[0], r2.inputs[0]); L(fade.outputs['Result'], r2.inputs[1])
    sr = N('GeometryNodeSetCurveRadius'); L(tc.outputs[0], sr.inputs['Curve']); L(r2.outputs[0], sr.inputs['Radius'])
    cg = N('GeometryNodeCurvesToGreasePencil'); cg.inputs['Instances as Layers'].default_value = True; L(sr.outputs[0], cg.inputs[0])
    L(cg.outputs[0], go.inputs[0])
    return g

gp_mat = bpy.data.materials.new('tinta'); bpy.data.materials.create_gpencil_data(gp_mat); gp_mat.grease_pencil.color = (*lin(TINTA), 1)
def lineart(nome, bit, px, sombra):
    bpy.ops.object.grease_pencil_add(type='LINEART_SCENE', location=(0, 0, 0)); o = bpy.context.object; o.name = nome
    md = next(m for m in o.modifiers if m.type == 'LINEART')
    md.source_type = 'COLLECTION'; md.source_collection = COLS['pers' if bit == 0 else 'obj']; md.use_custom_camera = False
    md.use_contour = True; md.use_crease = not sombra; md.use_material = not sombra; md.use_edge_mark = not sombra
    md.use_intersection = (bit == 0 and not sombra); md.use_loose = False; md.crease_threshold = math.radians(120)
    md.use_crease_on_smooth = False; md.use_crease_on_sharp = True
    if sombra:
        md.use_shadow = True; md.light_contour_object = sun; md.shadow_region_filtering = 'SHADED'
        md.shadow_camera_size = 20; md.shadow_camera_near = 0.1; md.shadow_camera_far = 200
    o.data.materials.clear(); o.data.materials.append(gp_mat); md.target_material = gp_mat
    md.target_layer = o.data.layers[0].name
    gn = o.modifiers.new('px', 'NODES'); gn.node_group = grupo_px(px)
    return o
for nome, bit, px, sb in [('la_pers', 0, PX_PERS, False), ('la_pers_sombra', 0, PX_PERS * K_SOMBRA, True), ('la_obj', 1, PX_OBJ, False), ('la_obj_sombra', 1, PX_OBJ * K_SOMBRA, True)]:
    lineart(nome, bit, px, sb)

# ---------- render ----------
r = sc.render; r.engine = 'BLENDER_EEVEE_NEXT'; r.resolution_x, r.resolution_y, r.resolution_percentage = W, H, 100
r.film_transparent = False; r.use_freestyle = False
sc.eevee.taa_render_samples = 32; sc.eevee.use_shadows = True; sc.eevee.shadow_resolution_scale = 1.0
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
sc.grease_pencil_settings.antialias_threshold = 1.0
r.image_settings.file_format = 'PNG'; r.filepath = OUT
bpy.ops.wm.save_as_mainfile(filepath=OUT.rsplit('.', 1)[0] + '.blend')
bpy.ops.render.render(write_still=True)
print('OK', OUT)
