# mixagem do vídeo do relógio: voz + efeitos (acervo-sfx CC0/Soundjay e sintetizados) + trilha Mixkit "Comical" com caixa de marcha na guerra
import sys, json, subprocess, numpy as np
sys.path.insert(0, '/mnt/project-files/ferramentas'); import sfx
P = '/home/user/ia-video/estudos/senhor-sticker-relogio/projeto/'
SR = 48000; PW = json.load(open(P + 'voz/palavras-final.json')); DUR = round(PW[-1]['e'] + 0.6, 2)
def ler(p, filtro=None):
    cmd = ['ffmpeg', '-v', 'error', '-i', p] + (['-af', filtro] if filtro else []) + ['-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, check=True, capture_output=True).stdout, dtype=np.float32).copy()
voz = ler(P + 'voz/voz-final.wav')
import unicodedata
lim = lambda w: unicodedata.normalize('NFC', w.lower().strip('.,!?:"…'))
def W(w, n=0): return [p['s'] for p in PW if lim(p['w']) == w][n]
def E(w, n=0): return [p['e'] for p in PW if lim(p['w']) == w][n]
N = int(SR * DUR)
v = np.zeros(N, np.float32); v[:min(N, len(voz))] = voz[:N]
fx = np.zeros(N, np.float32); USADOS = []
def put(arq, t, g=0.5, ate=None):
    s = sfx.carregar(arq, ate=ate) * g; i = max(0, int(t * SR)); fx[i:i + len(s)] += s[:max(0, N - i)]; USADOS.append(arq)
S = '/tmp/relogio/audio/sint/'
O = 'opengameart/'; C = O + '100-cc0-sfx/'; C2 = O + '100-cc0-sfx-2/'; CR = O + '80-cc0-creature-sfx/'; Z = O + 'cozy-sfx-sampler--e2-80-94-60-cute-sound/'
SW = O + 'swishes-sound-pack/swishes_swish-11.wav'; WH = 'soundjay/misc/whip-whoosh-02.mp3'
BOING = Z + 'cozy-sfx-sampler_story_comedy-boing.mp3'; POP = O + 'bubbles-pop/pop.ogg'
CLK = O + '7-mechanical-clicks-and-buzzes/mechanical_mechanical_clicks-0'
SPL = O + '40-cc0-water-splash-slime-sfx/'
# gancho: café de Paris rindo do pulso
put(S + 'risada.wav', W('zoado') - 0.1, 0.4)
put(C2 + 'sfx100v2_wood_hit_01.ogg', W('zoado') + 0.05, 0.4)
put(S + 'risada.wav', W('inteira') + 0.1, 0.25)
put(SPL + 'bubble_01.ogg', W('pulseirinha') + 0.3, 0.3)
# 1904: relógios de bolso sincronizados
put(WH, W('em', 1) - 0.3, 0.4)
for i in range(4): put(CLK + str(1 + i % 5) + '.mp3', W('homem') + i * 0.28, 0.3, ate=0.3)
put(C + 'bell_03.ogg', W('relógio') + 0.1, 0.2)
put(S + 'gangster.wav', W('com') - 0.1, 0.5)
for w in ['corrente', 'colete', 'bigode']: put(SW, W(w) - 0.12, 0.2)
put(C + 'spring_01.ogg', W('bigode') + 0.15, 0.25)
# joia de madame: desmaio
put(WH, W('relógio', 1) - 0.3, 0.4)
put('soundjay/misc/wind-chime-2.mp3', W('joia') - 0.1, 0.25, ate=1.2)
put(BOING, W('madame') + 0.1, 0.4)
put(CR + 'cute_02.ogg', W('madame') + 0.4, 0.2)
# Alberto e o dirigível
put(O + 'air-whoosh/whoosh2.mp3', W('só') - 0.2, 0.3)
put(S + 'motor.wav', W('alberto') - 0.1, 0.35)
put(S + 'vento.wav', W('ele') - 0.1, 0.35)
put(S + 'motor.wav', W('ele') + 0.5, 0.2)
# cinco ações, cada uma com som
put(SW, W('soltar') - 0.1, 0.3)
put(CLK + '3.mp3', W('comando'), 0.35, ate=0.3)
put('soundjay/misc/paper-rustle-2.mp3', W('cavar') - 0.05, 0.35, ate=0.6)
put(CLK + '1.mp3', W('abrir'), 0.35, ate=0.3); put(POP, W('tampinha') + 0.05, 0.3)
put(C2 + 'sfx100v2_wood_hit_01.ogg', W('tampinha') + 0.5, 0.35)
put(S + 'vento.wav', W('torcer') - 0.2, 0.3)
put(C + 'bell_02.ogg', W('panqueca') - 0.05, 0.3)
put(Z + 'cozy-sfx-sampler_cafe_sizzle.mp3', W('panqueca') + 0.1, 0.3, ate=1.0)
put(SPL + 'slime_07.ogg', W('panqueca') + 0.35, 0.35)
# jantar com o Cartier
put(WH, W('então') - 0.3, 0.4)
put(S + 'multidao.wav', W('então'), 0.08)
put(C + 'bell_01.ogg', W('cartier') + 0.1, 0.25)
# oficina: tique-taque e martelinho
put(SW, W('e', 3) - 0.1, 0.3) if len([p for p in PW if lim(p['w']) == 'e']) > 3 else None
put('soundjay/clock/clock-ticking-2.mp3', W('faz'), 0.3, ate=2.8)
for i in range(5): put(C + 'metal_06.ogg', W('quadrado') + i * 0.35, 0.13)
put(CLK + '4.mp3', W('couro') + 0.1, 0.35, ate=0.4)
# jornal giratório e zoeira
put(WH, W('paris', 1) - 0.35, 0.5)
put(S + 'dundun.wav', W('paris', 1) + 0.05, 0.4)
put(S + 'risada.wav', W('pulseira') + 0.3, 0.35)
put(O + '100-cc0-sfx/plop_01.ogg', W('baile'), 0.4)
# nem liga: rasante e recorde
put(O + 'air-whoosh/whoosh2.mp3', W('voa') - 0.2, 0.45)
put(S + 'motor.wav', W('voa') - 0.3, 0.3)
put(C + 'bell_03.ogg', W('recorde') + 0.15, 0.35)
# PLOT TWIST: silêncio e carimbo
B = O + '75-cc0-breaking-falling-hit-sfx/'
put(O + '35-wooden-crackshitsdestructions/wood_impact_crack03.mp3.flac', W('aí') - 0.05, 0.5)
put(B + 'bfh1_glass_breaking_02.ogg', W('aí') + 0.1, 0.3, ate=0.45)
put(B + 'bfh1_falling_03.ogg', W('aí') + 0.05, 0.3, ate=0.45)
put(C + 'slam_02.ogg', W('virada') + 0.02, 0.65)
put(C2 + 'sfx100v2_wood_hit_01.ogg', W('virada') + 0.04, 0.4)
# 1904→1914: calendário e guerra
for i in range(6): put('soundjay/misc/page-flip-02.mp3', W('dez') + i * 0.12, 0.15)
put(O + '25-cc0-bang-firework-sfx/cannon_02.ogg', W('guerra') - 0.05, 0.2)
# trincheira: chuva, relógio na lama
put(SPL + 'loop_rain.ogg', W('na') - 0.1, 0.25, ate=4.8)
put(CLK + '2.mp3', W('cavar', 1), 0.3, ate=0.3)
put(SPL + 'splash_03.ogg', W('lama') + 0.05, 0.45)
put(O + '25-cc0-bang-firework-sfx/cannon_02.ogg', W('lama') + 0.6, 0.06)
# 1917: entrega de relógios com fivela
put(WH, W('em', 2) - 0.3, 0.4)
for i in range(6): put(CLK + str(1 + i % 5) + '.mp3', W('entregar') + i * 0.3, 0.3, ate=0.25)
put(C + 'slam_02.ogg', W('tropa') + 0.1, 0.35)
# volta da guerra e vovô
put(S + 'fanfarra.wav', W('voltou') - 0.1, 0.3)
put(CR + 'snore.ogg', W('vovô') + 0.1, 0.4)
# 1810: a rainha
put(WH, W('detalhe') - 0.3, 0.4)
put(C + 'bell_03.ogg', W('oitocentos'), 0.3)
put(S + 'coro.wav', W('rainha') - 0.1, 0.3)
put(S + 'risada.wav', W('vergonha') + 0.2, 0.15)
# fone sem fio
put(SW, W('tipo') - 0.15, 0.3)
put(CR + 'nose.ogg', W('ridículo') + 0.1, 0.25)
put(POP, W('você') - 0.1, 0.35)
put(Z + 'cozy-sfx-sampler_cafe_cash-register.mp3', W('comprar') + 0.15, 0.4)
# fecho
put(SW, W('qual') - 0.2, 0.3)
put(Z + 'cozy-sfx-sampler_ui_notify-chime.mp3', W('comenta'), 0.35)
# trilha: "Comical"; some no plot twist, vira caixa de marcha na guerra, volta no "Detalhe"
tr = ler('/mnt/project-files/acervo-trilhas/mixkit/mixkit-2.mp3')
while len(tr) < N: tr = np.concatenate([tr, tr])
tr = tr[:N].copy()
def corta(t0, t1, f=0.06):
    a, b = int(t0 * SR), int(t1 * SR); fl = int(f * SR); tr[a - fl:a] *= np.linspace(1, 0, fl); tr[a:b] = 0; tr[b:b + fl * 3] *= np.linspace(0, 1, fl * 3)
corta(W('aí') - 0.4, W('detalhe') - 0.3)
corta(W('com') - 0.15, W('relógio', 1) - 0.1)
cx = ler(S + 'caixa.wav'); a0 = int((W('dez') - 0.1) * SR); a1 = int((W('detalhe') - 0.4) * SR)
lp_ = np.tile(cx, (a1 - a0) // len(cx) + 1)[:a1 - a0] * 0.5; lp_[-int(0.3 * SR):] *= np.linspace(1, 0, int(0.3 * SR)); tr[a0:a1] += lp_
tr[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR))
win = int(0.05 * SR); env = np.sqrt(np.convolve(v ** 2, np.ones(win) / win, 'same')); duck = np.where(env > 0.01, 10 ** (-15 / 20), 10 ** (-6 / 20))
duck = np.convolve(duck, np.ones(int(0.15 * SR)) / int(0.15 * SR), 'same')
m = v + fx + tr * duck * 0.5
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s24le', '/tmp/relogio/audio/mix.wav'], input=m.astype(np.float32).tobytes(), check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', '/tmp/relogio/audio/mix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.89', '-ar', '48000', '-ac', '2', '/tmp/relogio/audio/final.wav'], check=True)
json.dump(sorted(set(USADOS)), open('/tmp/relogio/audio/usados.json', 'w'), ensure_ascii=False, indent=0)
print('ok', DUR, len(set(USADOS)))
