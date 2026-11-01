import sys, json, subprocess, numpy as np
sys.path.insert(0, '/mnt/project-files/ferramentas'); import sfx
SR = 48000; DUR = 71.0
def ler(p, filtro=None):
    cmd = ['ffmpeg', '-v', 'error', '-i', p] + (['-af', filtro] if filtro else []) + ['-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, check=True, capture_output=True).stdout, dtype=np.float32).copy()
voz = ler('/tmp/ideia/voz2/voz-final.wav')
PW = json.load(open('/tmp/ideia/voz2/palavras-final.json'))
lim = lambda w: w.lower().strip('.,!?:')
def W(w, n=0): return [p['s'] for p in PW if lim(p['w']) == w][n]
def E(w, n=0): return [p['e'] for p in PW if lim(p['w']) == w][n]
N = int(SR * DUR)
v = np.zeros(N, np.float32); v[:len(voz)] = voz[:N]
fx = np.zeros(N, np.float32); USADOS = []
def put(arq, t, g=0.5, ate=None):
    s = sfx.carregar(arq, ate=ate) * g; i = int(t * SR); fx[i:i + len(s)] += s[:max(0, N - i)]; USADOS.append(arq)
O = 'opengameart/'; C = O + '100-cc0-sfx/'; C2 = O + '100-cc0-sfx-2/'; SW = O + 'swishes-sound-pack/swishes_swish-11.wav'
BOING = O + 'cozy-sfx-sampler--e2-80-94-60-cute-sound/cozy-sfx-sampler_story_comedy-boing.mp3'
CLANG = lambda t, g=1.0: (put(C + 'gong_01.ogg', t, 0.45 * g, ate=2.0), put(C + 'metal_12.ogg', t, 0.5 * g), put(O + '75-cc0-breaking-falling-hit-sfx/bfh1_metal_hit_05.ogg', t, 0.5 * g))
# gancho
put(C + 'bell_02.ogg', W('bolas') - 0.03, 0.3)
put(O + '80-cc0-creature-sfx/snore.ogg', 0.0, 0.18, ate=2.6)
put(C + 'bell_03.ogg', W('gênio') - 0.03, 0.4)
# montagem
put(SW, W('funciona') - 0.1, 0.5)
put(C2 + 'sfx100v2_metal_06.ogg', W('metal') - 0.02, 0.45)
put(C + 'metal_06.ogg', W('chão') - 0.05, 0.3)
put(SW, W('cima') - 0.42, 0.35)
put(C + 'slam_02.ogg', W('cima') - 0.01, 0.45)
put(BOING, W('e', 0) - 0.1, 0.4)
put(C + 'hit_02.ogg', W('bola') + 0.18, 0.35)
put(C + 'bell_02.ogg', W('cada') - 0.03, 0.25)
put(O + '80-cc0-creature-sfx/snore.ogg', W('cochilar') + 0.5, 0.2, ate=2.6)
put(O + '80-cc0-creature-sfx/snore.ogg', W('pega'), 0.22, ate=2.6)
# o estrondo
put(SW, W('despencam'), 0.3)
CLANG(W('pratos', 1))
put(BOING, W('barulhão') + 0.05, 0.35)
put(C2 + 'sfx100v2_wood_hit_01.ogg', W('hora') + 0.1, 0.25)
# Edison e Dalí
put(C + 'bell_03.ogg', W('edison') - 0.04, 0.3)
put(C + 'bell_02.ogg', W('propósito') + 0.15, 0.3)
put(SW, W('e', 2) - 0.12, 0.55)
put(C + 'key_open_01.ogg', W('chave') - 0.05, 0.2)
put(C2 + 'sfx100v2_metal_hit_02.ogg', W('chave') + 0.22, 0.5)
# prédio
put(SW, W('porque') - 0.08, 0.4)
put(C + 'bell_02.ogg', W('cérebro') - 0.03, 0.3)
put(C + 'bell_01.ogg', W('andar') - 0.05, 0.35)
put(C + 'bell_03.ogg', W('hipnagogia') - 0.03, 0.25)
put(O + 'bubbles-pop/pop.ogg', W('ideias') + 0.02, 0.5)
put(C + 'bell_03.ogg', W('ideias') + 0.1, 0.3)
put(C2 + 'sfx100v2_wood_hit_01.ogg', W('nunca') + 0.1, 0.25)
put(SW, W('descer') + 0.05, 0.45)
put(C + 'plop_01.ogg', W('tudo') - 0.15, 0.45)
put(O + '80-cc0-creature-sfx/snore.ogg', W('tudo') + 0.25, 0.2, ate=1.2)
CLANG(W('estrondo'), 0.9)
put(C + 'spring_01.ogg', W('puxa'), 0.45)
put(C + 'bell_03.ogg', W('acorda', 1) - 0.03, 0.35)
put(O + '30-cc0-sfx-loops/rolling.ogg', W('não') + 0.05, 0.3, ate=1.0)
# Paris
put(SW, W('em', 3) - 0.12, 0.5)
put(C + 'bell_02.ogg', W('paris') - 0.03, 0.3)
put(O + '80-cc0-creature-sfx/snore.ogg', W('cochilando'), 0.18, ate=1.5)
put('soundjay/misc/pill-bottle-to-table-1.mp3', W('cochilou') + 0.44, 0.45)
put(C + 'bell_03.ogg', W('minutinho') + 0.2, 0.3)
for w in ['três', 'vezes', 'mais']: put('soundjay/buttons/button-46.mp3', W(w) - 0.02, 0.3)
put(C2 + 'sfx100v2_wood_hit_01.ogg', W('chance'), 0.3)
put(C + 'bell_03.ogg', W('truque') - 0.03, 0.35)
put(O + '80-cc0-creature-sfx/snore.ogg', W('já'), 0.3, ate=2.4)
put(O + 'electricity-sound-effects-0/spark.mp3', W('perdeu') - 0.02, 0.35, ate=0.6)
put(O + 'bubbles-pop/pop.ogg', W('efeito') - 0.1, 0.25)
# fecho: a bola cai no gato (fofo, sem estrondo) e o ronco continua
put(SW, W('gato') - 0.3, 0.4)
put(BOING, W('prato') + 0.17, 0.5)
put('/tmp/ideia/audio/miado.wav', W('prato') + 0.22, 0.32)  # miado bravo sintetizado (miado.py)
put(O + '80-cc0-creature-sfx/snore.ogg', W('prato') + 0.8, 0.3, ate=2.6)
tr = ler('/mnt/project-files/acervo-trilhas/mixkit/mixkit-2.mp3')
while len(tr) < N: tr = np.concatenate([tr, tr])
tr = tr[:N]
env = np.convolve(np.abs(v), np.ones(4800) / 4800, mode='same'); duck = 1 - 0.5 * np.clip(env / (env.max() * 0.25), 0, 1)
rms = lambda x: np.sqrt(np.mean(x[x != 0] ** 2) + 1e-12)
tr = tr / rms(tr) * rms(v) * 10 ** (-15 / 20) * duck
# a música some no instante do estrondo e volta logo depois
for t0 in [W('pratos', 1), W('estrondo')]:
    a, b = int(t0 * SR), int((t0 + 1.0) * SR); tr[a:b] *= 0.15; tr[b:b + 9600] *= np.linspace(0.15, 1, 9600)
tr[-int(1.5 * SR):] *= np.linspace(1, 0, int(1.5 * SR))
m = v + fx + tr
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s24le', '/tmp/ideia/audio/mix.wav'], input=m.astype(np.float32).tobytes(), check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', '/tmp/ideia/audio/mix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.84', '-ar', '48000', '-ac', '2', '/tmp/ideia/audio/final.wav'], check=True)
json.dump(sorted(set(USADOS)), open('/tmp/ideia/audio/usados.json', 'w'), indent=1)
print('ok', len(USADOS))
