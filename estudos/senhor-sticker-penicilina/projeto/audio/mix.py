import sys, json, subprocess, numpy as np
sys.path.insert(0, '/mnt/project-files/ferramentas'); import sfx
SR = 48000; DUR = 76.0
def ler(p, filtro=None):
    cmd = ['ffmpeg', '-v', 'error', '-i', p] + (['-af', filtro] if filtro else []) + ['-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, check=True, capture_output=True).stdout, dtype=np.float32).copy()
voz = ler('/tmp/peni/voz/voz-final.wav')
PW = json.load(open('/tmp/peni/voz/palavras-final.json'))
lim = lambda w: w.lower().strip('.,!?:"')
def W(w, n=0): return [p['s'] for p in PW if lim(p['w']) == w][n]
def E(w, n=0): return [p['e'] for p in PW if lim(p['w']) == w][n]
N = int(SR * DUR)
v = np.zeros(N, np.float32); v[:len(voz)] = voz[:N]
fx = np.zeros(N, np.float32); USADOS = []
def put(arq, t, g=0.5, ate=None):
    s = sfx.carregar(arq, ate=ate) * g; i = max(0, int(t * SR)); fx[i:i + len(s)] += s[:max(0, N - i)]; USADOS.append(arq)
S = '/tmp/peni/audio/sint/'
O = 'opengameart/'; C = O + '100-cc0-sfx/'; C2 = O + '100-cc0-sfx-2/'; CR = O + '80-cc0-creature-sfx/'
SW = O + 'swishes-sound-pack/swishes_swish-11.wav'; WH = 'soundjay/misc/whip-whoosh-02.mp3'
BOING = O + 'cozy-sfx-sampler--e2-80-94-60-cute-sound/cozy-sfx-sampler_story_comedy-boing.mp3'
POP = O + 'bubbles-pop/pop.ogg'
# gancho: tchau, louça balançando, multidão
put(C + 'bell_02.ogg', W('ele') + 0.05, 0.3)
put(C2 + 'sfx100v2_metal_06.ogg', W('louça') + 0.1, 0.18)
put(C + 'metal_06.ogg', W('louça') + 0.35, 0.15)
put(WH, W('salvou') - 0.3, 0.45)
put(S + 'multidao.wav', W('salvou') - 0.1, 0.35)
put(O + '25-cc0-bang-firework-sfx/fw_02.ogg', W('vidas') - 0.2, 0.18)
# Londres
put(WH, W('londres') - 0.25, 0.45)
put('soundjay/misc/bulb-horn-01.mp3', W('mil') + 0.3, 0.35)
put(C + 'bell_03.ogg', W('mil') - 0.02, 0.25)
# laboratório bagunçado
put(SW, W('alexander') - 0.25, 0.4)
put('soundjay/misc/paper-rustle-3.mp3', W('bagunçado'), 0.4, ate=1.2)
put(SW, W('placas') - 0.15, 0.3)
for i in range(4): put(C2 + 'sfx100v2_metal_06.ogg', W('empilhadas') + i * 0.12, 0.12)
put(POP, W('pia') - 0.05, 0.3)
put(CR + 'bug_01.ogg', W('xícara') - 0.1, 0.35, ate=1.4)
put('soundjay/misc/paper-rustle-6.mp3', W('papel') - 0.1, 0.4, ate=1.3)
# colegas zombando + porco
put(SW, W('colegas') - 0.2, 0.35)
put(CR + 'ooh.ogg', W('zombavam') + 0.2, 0.18)
put(CR + 'nose.ogg', W('isso') - 0.3, 0.25)
put(S + 'porco.wav', W('chiqueiro') + 0.3, 0.45)
put(BOING, W('chiqueiro') + 0.12, 0.3)
# dá de ombros e sai
put(C + 'spring_01.ogg', W('ombros') - 0.05, 0.3)
put('soundjay/misc/briefcase-lock-3.mp3', W('saiu', 1), 0.35)
put(O + 'door-open-door-close-set/qubodup-doorset_ogg_qubodup-doorclose03.ogg', W('sem', 1) + 0.05, 0.5)
put(C + 'switch_01.ogg', W('nada') - 0.05, 0.4)
# semanas: tique-taque acelerado, páginas, frio e calor
put('soundjay/clock/clock-ticking-2.mp3', W('semanas') - 0.1, 0.35, ate=3.8)
for i in range(5): put('soundjay/misc/page-flip-02.mp3', W('semanas') + 0.4 + i * 0.75, 0.2)
put('soundjay/misc/wind-chime-1.mp3', W('esfriou'), 0.15, ate=0.8)
put(O + '40-cc0-water-splash-slime-sfx/slime_03.ogg', W('alguma'), 0.35)
put(O + '40-cc0-water-splash-slime-sfx/slime_07.ogg', W('crescer') - 0.1, 0.35)
# volta das férias, para
put(O + 'door-open-door-close-set/qubodup-doorset_ogg_qubodup-dooropen02.ogg', W('volta') - 0.2, 0.4)
put(C + 'bell_02.ogg', W('volta') + 0.2, 0.25)
put(SW, W('pegou') - 0.15, 0.3)
put(S + 'disco.wav', W('parou') - 0.05, 0.5)
# o mofo
put(O + '40-cc0-water-splash-slime-sfx/slime_10.ogg', W('mofo') - 0.05, 0.4)
put(CR + 'monster_02.ogg', W('verde') + 0.05, 0.12)
for k, w in enumerate(['volta', 'bactérias', 'tinham', 'sumido']): put(POP, W(w, 1 if w == 'volta' else 0) + 0.15, 0.3)
put(CR + 'cute_02.ogg', W('bactérias') + 0.1, 0.2)
put(S + 'coro.wav', W('círculo') - 0.1, 0.4)
put(SW, W('aquele') - 0.15, 0.3)
put(C2 + 'sfx100v2_wood_hit_01.ogg', W('bactéria', 1) + 0.05, 0.4)
put(POP, W('bactéria', 1) + 0.1, 0.35)
put(S + 'coro.wav', W('fleming', 2) + 0.2, 0.35)
put(C + 'bell_03.ogg', W('penicilina') + 0.1, 0.35)
# ninguém deu bola
put(S + 'grilos.wav', W('só', 1) - 0.1, 0.3, ate=1.8)
put(O + 'air-whoosh/whoosh2.mp3', W('ninguém'), 0.25)
put(CR + 'breath.ogg', W('bola') + 0.2, 0.2)
put('soundjay/misc/pill-bottle-1.mp3', W('fabricar') - 0.2, 0.3)
put(O + '40-cc0-water-splash-slime-sfx/bubble_01.ogg', W('fabricar') + 0.3, 0.35)
put(O + 'steam-release-sounds/' + __import__('os').listdir('/mnt/project-files/acervo-sfx/opengameart/steam-release-sounds')[0], W('remédio'), 0.2, ate=0.8)
put('soundjay/cabinet/cabinet-door-close-3.mp3', W('esquecida', 1) + 0.1, 0.45)
put('soundjay/clock/clock-ticking-2.mp3', W('dez') - 0.2, 0.3, ate=1.4)
for i in range(6): put('soundjay/misc/page-flip-02.mp3', W('dez') - 0.15 + i * 0.12, 0.15)
# Segunda Guerra
put(WH, W('até') - 0.25, 0.5)
put(S + 'aviao.wav', W('até') - 0.1, 0.25)
put(O + '25-cc0-bang-firework-sfx/cannon_02.ogg', W('guerra') - 0.05, 0.25)
# Oxford
put(WH, W('dois') - 0.25, 0.45)
put('soundjay/misc/paper-rustle-2.mp3', W('cientistas'), 0.25, ate=1.0)
put(POP, W('florey') + 0.05, 0.35); put(POP, W('chain') + 0.05, 0.35)
put(C + 'bell_03.ogg', W('descobriram'), 0.4)
put(O + 'electricity-sound-effects-0/spark.mp3', W('descobriram') + 0.05, 0.2, ate=0.5)
for i in range(8): put('soundjay/misc/pill-bottle-to-table-1.mp3', W('produzir') + i * 0.16, 0.15)
put(C + 'slam_02.ogg', W('massa') + 0.02, 0.35)
# o soldado
put(WH, W('repente') - 0.4, 0.45)
put(CR + 'hurt_02.ogg', W('arranhão') + 0.1, 0.2)
put(CR + 'cough_02.ogg', W('infeccionado') + 0.4, 0.2)
put(POP, W('não', 1) + 0.1, 0.3)
put(C2 + 'sfx100v2_wood_hit_01.ogg', W('sentença') - 0.05, 0.35)
put(C + 'slam_02.ogg', W('morte') + 0.02, 0.55)
put(S + 'multidao.wav', W('morte') + 0.15, 0.2)
put(CR + 'cute_05.ogg', W('morte') + 0.5, 0.2)
# Nobel
put(WH, W('mil', 1) - 0.35, 0.45)
put(S + 'aplausos.wav', W('mil', 1) - 0.1, 0.35)
put(S + 'fanfarra.wav', W('nobel') - 0.05, 0.4)
put(O + '25-cc0-bang-firework-sfx/fw_01.ogg', W('nobel') + 0.1, 0.25)
put(S + 'aplausos.wav', W('nobel') + 0.3, 0.3)
# colegas organizados
put(WH, W('colegas', 1) - 0.4, 0.4)
put(C + 'bell_01.ogg', W('organizados') + 0.2, 0.3)
put('soundjay/misc/wind-chime-2.mp3', W('impecável'), 0.25, ate=1.2)
put(CR + 'bug_02.ogg', W('nenhuma'), 0.25, ate=1.6)
put(S + 'trombone.wav', W('medalha') + 0.15, 0.45)
# fecho: o quarto
put(WH, W('então') - 0.35, 0.45)
put(C2 + 'sfx100v2_wood_hit_01.ogg', W('arrumar') - 0.05, 0.3)
put(SW, W('diga') - 0.2, 0.3)
put(C + 'bell_03.ogg', W('ciência') - 0.05, 0.4)
# trilha: Mixkit 10 "Playful"; some na parada dramática e no "ninguém deu bola"
tr = ler('/mnt/project-files/acervo-trilhas/mixkit/mixkit-10.mp3')
while len(tr) < N: tr = np.concatenate([tr, tr])
tr = tr[:N].copy()
def corta(t0, t1, f=0.06):
    a, b = int(t0 * SR), int(t1 * SR); fl = int(f * SR); tr[a - fl:a] *= np.linspace(1, 0, fl); tr[a:b] = 0; tr[b:b + fl * 3] *= np.linspace(0, 1, fl * 3)
corta(W('parou') - 0.05, W('tinha', 1))
corta(W('só', 1) - 0.05, W('não', 1) - 0.4)
tr[-int(1.5 * SR):] *= np.linspace(1, 0, int(1.5 * SR))
# ducking pela voz
win = int(0.05 * SR); env = np.sqrt(np.convolve(v ** 2, np.ones(win) / win, 'same')); duck = np.where(env > 0.01, 10 ** (-15 / 20), 10 ** (-6 / 20))
duck = np.convolve(duck, np.ones(int(0.15 * SR)) / int(0.15 * SR), 'same')
m = v + fx + tr * duck * 0.55
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s24le', '/tmp/peni/audio/mix.wav'], input=m.astype(np.float32).tobytes(), check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', '/tmp/peni/audio/mix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.89', '-ar', '48000', '-ac', '2', '/tmp/peni/audio/final.wav'], check=True)
json.dump(sorted(set(USADOS)), open('/tmp/peni/audio/usados.json', 'w'), ensure_ascii=False, indent=0)
print('ok', len(set(USADOS)))
