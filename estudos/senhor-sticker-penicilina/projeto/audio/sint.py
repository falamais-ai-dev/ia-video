# efeitos sintetizados em código (sem amostras de terceiros): multidão, aplausos, coro, trombone triste, grilos, disco arranhando, fanfarra, avião, porco
import numpy as np, subprocess
SR = 48000; rng = np.random.default_rng(3)
def salva(nome, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f64le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', f'/tmp/peni/audio/sint/{nome}.wav'], input=x.astype(np.float64).tobytes(), check=True)
def tt(d): return np.arange(int(SR * d)) / SR
def env(t, pts): ts, vs = zip(*pts); return np.interp(t, ts, vs)
def lp(x, a):  # passa-baixa de 1 polo (a: 0..1)
    y = np.zeros_like(x); s = 0.0
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y
def reson(x, f, bw):
    r = np.exp(-np.pi * bw / SR); c1 = 2 * r * np.cos(2 * np.pi * f / SR); c2 = -r * r; y = np.zeros_like(x); y1 = y2 = 0.0
    for i in range(len(x)): v = (1 - r) * x[i] + c1 * y1 + c2 * y2; y2 = y1; y1 = v; y[i] = v
    return y
def voz(f0, t, vib=5.5, form=((800, 120), (1200, 150), (2500, 200))):
    f = f0 * (1 + 0.012 * np.sin(2 * np.pi * vib * t + rng.random() * 6))
    ph = 2 * np.pi * np.cumsum(f) / SR; src = sum(np.sin(k * ph) / k for k in range(1, 30) if k * np.max(f0) < 9000)
    return sum(g * reson(src, F, B) for (F, B), g in zip(form, (1, 0.6, 0.25)))
# multidão comemorando (vozes "êêê" com afinações diferentes + ruído)
t = tt(2.4); x = np.zeros_like(t)
for i in range(14):
    f0 = rng.uniform(180, 420); a = env(t, [(0, 0), (0.15 + rng.random() * 0.2, 1), (1.6 + rng.random() * 0.5, 0.7), (2.4, 0)])
    x += voz(f0 * env(t, [(0, 1), (0.4, 1.12), (2.4, 0.95)]), t, form=((650, 160), (1900, 220), (2700, 250))) * a * rng.uniform(0.5, 1)
x += 0.4 * reson(rng.standard_normal(len(t)), 1500, 2500) * env(t, [(0, 0), (0.2, 1), (2.0, 0.6), (2.4, 0)])
salva('multidao', x)
# aplausos (muitas palminhas curtas de ruído)
t = tt(3.0); x = np.zeros_like(t); clap = reson(rng.standard_normal(int(0.02 * SR)), 1800, 1500) * np.exp(-np.arange(int(0.02 * SR)) / (0.004 * SR))
for i in range(900):
    p = int(rng.uniform(0, len(t) - len(clap))); x[p:p + len(clap)] += clap * rng.uniform(0.3, 1) * env(np.array([p / SR]), [(0, 0.3), (0.3, 1), (2.4, 1), (3.0, 0)])[0]
salva('aplausos', x)
# coro celestial "aaah" (acorde maior, ataque lento)
t = tt(2.2); x = np.zeros_like(t)
for f0 in [261.6, 329.6, 392.0, 523.3, 659.3]:
    for d in (-1, 1): x += voz(f0 * (1 + d * 0.004), t, vib=5, form=((800, 110), (1150, 130), (2900, 220)))
x *= env(t, [(0, 0), (0.35, 1), (1.6, 0.9), (2.2, 0)]); salva('coro', x)
# trombone triste "uó uó uó uóóóó"
notas = [(233.1, 0.42), (220.0, 0.42), (207.7, 0.42), (196.0, 1.3)]; partes = []
for i, (f0, d) in enumerate(notas):
    t = tt(d); f = f0 * (1 + (0.03 * np.sin(2 * np.pi * 6 * t) * (t > 0.3) if i == 3 else 0))
    ph = 2 * np.pi * np.cumsum(f) / SR; s = sum(np.sin(k * ph) / k for k in range(1, 25))
    wah = env(t, [(0, 0.03), (0.12, 0.25), (d, 0.06)]); s = lp(s, 0.12) * 0.5 + reson(s, 600, 300) * 0.8 * wah * 6
    partes.append(s * env(t, [(0, 0), (0.04, 1), (d - 0.06, 0.85), (d, 0)]))
salva('trombone', np.concatenate(partes))
# grilos
t = tt(2.5); x = np.sin(2 * np.pi * 4600 * t) * ((np.sin(2 * np.pi * 30 * t) > 0) * 1.0) * ((t % 0.5) < 0.18); x += 0.6 * np.sin(2 * np.pi * 4300 * t) * ((np.sin(2 * np.pi * 28 * t) > 0) * 1.0) * (((t + 0.25) % 0.55) < 0.15)
salva('grilos', x)
# disco arranhando
t = tt(0.45); f = env(t, [(0, 300), (0.15, 1800), (0.3, 200), (0.45, 900)]); n = rng.standard_normal(len(t))
x = sum(reson(n, fi, 400) for fi in [1]) * 0 + reson(n * np.sin(2 * np.pi * np.cumsum(f) / SR), 1200, 900) * env(t, [(0, 0), (0.02, 1), (0.4, 0.6), (0.45, 0)])
salva('disco', x)
# fanfarra (metais: sol-dó-mi-sol)
partes = []
for f0, d in [(392, 0.16), (523.3, 0.16), (659.3, 0.16), (784, 0.75)]:
    t = tt(d); ph = 2 * np.pi * np.cumsum(f0 * (1 + 0.006 * np.sin(2 * np.pi * 6 * t))) / SR; s = sum(np.sin(k * ph) / k for k in range(1, 20))
    s = s + 0.5 * sum(np.sin(k * ph * 1.5) / k for k in range(1, 10)); partes.append(lp(s, 0.2) * env(t, [(0, 0), (0.02, 1), (d - 0.03, 0.8), (d, 0)]))
salva('fanfarra', np.concatenate(partes))
# avião ao longe (motor de hélice)
t = tt(3.0); ph = 2 * np.pi * np.cumsum(85 * (1 + 0.02 * np.sin(2 * np.pi * 0.4 * t))) / SR; x = sum(np.sin(k * ph) / k for k in range(1, 15)) * (0.7 + 0.3 * np.sin(2 * np.pi * 21 * t))
salva('aviao', lp(x, 0.05) * env(t, [(0, 0), (1.0, 1), (2.2, 1), (3.0, 0)]))
# porco "oinc oinc"
partes = []
for d in [0.16, 0.08, 0.2]:
    t = tt(d); f0 = env(t, [(0, 210), (d * 0.4, 260), (d, 170)]); ph = 2 * np.pi * np.cumsum(f0) / SR
    s = sum(np.sin(k * ph) / k ** 0.8 for k in range(1, 30)) + 0.6 * rng.standard_normal(len(t)); s = reson(s, 700, 200) + 0.7 * reson(s, 1400, 250)
    partes += [s * env(t, [(0, 0), (0.01, 1), (d - 0.02, 0.8), (d, 0)]), np.zeros(int(0.06 * SR))]
salva('porco', np.concatenate(partes))
print('ok')
