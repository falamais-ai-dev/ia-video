import sys, json, subprocess, numpy as np
sys.path.insert(0, '/mnt/project-files/ferramentas'); import sfx
SR = 48000; DUR = 70.0
def ler(p, filtro=None):
    cmd = ['ffmpeg', '-v', 'error', '-i', p] + (['-af', filtro] if filtro else []) + ['-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, check=True, capture_output=True).stdout, dtype=np.float32).copy()
voz = ler('/tmp/recria/voz2/voz-final.wav')
PW = json.load(open('/tmp/recria/voz2/palavras-final.json'))
def W(w, n=0): return [p['s'] for p in PW if p['w'].lower().strip('.,!?:') == w][n]
def E(w, n=0): return [p['e'] for p in PW if p['w'].lower().strip('.,!?:') == w][n]
N = int(SR * DUR)
v = np.zeros(N, np.float32); v[:len(voz)] = voz[:N]
fx = np.zeros(N, np.float32)
def put(arq, t, g=0.5, ate=None):
    s = sfx.carregar(arq, ate=ate) * g; i = int(t * SR); fx[i:i + len(s)] += s[:max(0, N - i)]
O = 'opengameart/'; J = O + '512-sound-effects-8-bit-style/the-essential-retro-video-game-sound-effects-collection-512-sounds-by-juhani-junkala_'
# 1a parte (igual à v1, nos tempos novos)
put(O + '100-cc0-sfx/bell_02.ogg', W('lança') - 0.03, 0.35)
put(O + '100-cc0-sfx/metal_06.ogg', W('qualquer') - 0.01, 0.55)
put(O + '202-more-sound-effects/money_money_24.mp3', W('rei') - 0.05, 0.35)
put(O + '75-cc0-breaking-falling-hit-sfx/bfh1_metal_hit_05.ogg', W('nada') - 0.01, 0.55)
put(O + 'cozy-sfx-sampler--e2-80-94-60-cute-sound/cozy-sfx-sampler_story_comedy-boing.mp3', W('furava', 1) - 0.08, 0.5)
put(O + '100-cc0-sfx-2/sfx100v2_wood_hit_01.ogg', W('pior') + 0.2, 0.3)
put(O + 'swishes-sound-pack/swishes_swish-11.wav', W('os') - 0.03, 0.6)
for k in range(3): put('soundjay/buttons/button-46.mp3', W('cem') - 0.18 + k * 0.07, 0.3)
put(O + '80-cc0-creature-sfx/cute_04.ogg', W('agora') + 0.6, 0.18)
put(O + '100-cc0-sfx/bell_03.ogg', W('arma') - 0.05, 0.3)
put(J + 'movement_footsteps_sfx_movement_footstepsloop3_slow.wav', W('então'), 0.25)
put(J + 'movement_footsteps_sfx_movement_footstepsloop3_slow.wav', W('então') + 0.45, 0.25)
put(O + '100-cc0-sfx/bell_02.ogg', W('lança', 1) - 0.03, 0.35)
put(O + '100-cc0-sfx/bell_03.ogg', W('escudo', 1) - 0.03, 0.35)
# continuação
put(J + 'movement_footsteps_sfx_movement_footstepsloop3_slow.wav', W('os', 2) + 0.1, 0.22)
put(O + '100-cc0-sfx/bell_02.ogg', W('lança', 2) - 0.03, 0.35)
put(O + '100-cc0-sfx/bell_03.ogg', W('escudo', 2) - 0.03, 0.35)
put(J + 'movement_footsteps_sfx_movement_footsteps1a.wav', W('pegou'), 0.3)
put(J + 'movement_footsteps_sfx_movement_footstepsloop3_fast.wav', W('correu'), 0.35)
put(J + 'movement_footsteps_sfx_movement_footstepsloop3_fast.wav', W('correu') + 1.0, 0.35, ate=1.0)
put(O + 'swishes-sound-pack/swishes_swish-11.wav', W('encostou') - 0.4, 0.5)
put(O + '100-cc0-sfx/metal_06.ogg', W('encostou') + 0.25, 0.35)
put(O + '100-cc0-sfx-2/sfx100v2_wood_hit_01.ogg', W('mentira') + 0.05, 0.45)
put(O + '100-cc0-sfx-2/sfx100v2_wood_hit_01.ogg', W('mentira', 1) + 0.05, 0.45)
for w in ['dia', 'semana', 'ano']: put(O + 'swishes-sound-pack/swishes_swish-11.wav', W(w) - 0.05, 0.4)
put(J + 'general-sounds_coins_sfx_coin_cluster1.wav', W('contava'), 0.35)
put(J + 'general-sounds_coins_sfx_coin_double1.wav', W('contava') + 0.8, 0.3)
put(J + 'general-sounds_coins_sfx_coin_cluster3.wav', W('dinheiro') + 0.2, 0.3)
put(O + '100-cc0-sfx-2/sfx100v2_wood_hit_01.ogg', W('placa') + 0.12, 0.45)
put(O + '100-cc0-sfx/bell_02.ogg', W('espada') - 0.03, 0.35)
put(O + '50-cc0-retro-synth-sfx/retro_coin_01.ogg', W('metade') + 0.05, 0.3)
put(O + 'swishes-sound-pack/swishes_swish-11.wav', W('soldado') - 0.15, 0.5)
put('soundjay/buttons/button-46.mp3', W('cento') - 0.05, 0.35)
tr = ler('/mnt/project-files/acervo-trilhas/mixkit/mixkit-10.mp3')
while len(tr) < N: tr = np.concatenate([tr, tr])
tr = tr[:N]
env = np.convolve(np.abs(v), np.ones(4800) / 4800, mode='same'); duck = 1 - 0.5 * np.clip(env / (env.max() * 0.25), 0, 1)
rms = lambda x: np.sqrt(np.mean(x[x != 0] ** 2) + 1e-12)
tr = tr / rms(tr) * rms(v) * 10 ** (-15 / 20) * duck
# o mundo trava: a música para de repente e volta no "porque"
a, b = int((E('encostou') + 0.3) * SR), int((W('porque') - 0.05) * SR)
tr[a:b] = 0; tr[b:b + 4800] *= np.linspace(0, 1, 4800)
tr[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR))
m = v + fx + tr
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s24le', '/tmp/recria/audio/mix2.wav'], input=m.astype(np.float32).tobytes(), check=True)
print('ok')
