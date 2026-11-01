# efeitos sintetizados em código para o vídeo do relógio: risada, motor de dirigível, vento, dun-dun-dun, caixa de marcha, valsa
import numpy as np, subprocess
SR = 48000; rng = np.random.default_rng(3)
def salva(nome, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f64le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', f'/tmp/relogio/audio/sint/{nome}.wav'], input=x.astype(np.float64).tobytes(), check=True)
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
# risada de plateia: várias vozes "ha-ha-ha" (pulsos de vogal) com tempos e alturas diferentes
t = tt(2.2); x = np.zeros_like(t)
for i in range(12):
    f0 = rng.uniform(140, 380); rate = rng.uniform(4.5, 7.0); ph0 = rng.random()
    puls = np.clip(np.sin(2 * np.pi * (rate * t + ph0)), 0, 1) ** 2
    a = env(t, [(0, 0), (0.08 + rng.random() * 0.25, 1), (1.4 + rng.random() * 0.4, 0.6), (2.2, 0)])
    x += voz(f0 * env(t, [(0, 1.15), (2.2, 0.9)]), t, vib=7, form=((750, 150), (1250, 180), (2600, 250))) * puls * a * rng.uniform(0.5, 1)
x += 0.15 * reson(rng.standard_normal(len(t)), 1200, 2000) * env(t, [(0, 0), (0.2, 1), (2.2, 0)])
salva('risada', x)
# motor de dirigível: zumbido grave com hélice batendo
t = tt(3.0); f = 46 * env(t, [(0, 0.9), (3, 1.05)]); ph = 2 * np.pi * np.cumsum(f) / SR
x = sum(np.sin(k * ph) / k for k in range(1, 14)) * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * t) ** 2)
x = lp(x, 0.08) + 0.15 * lp(rng.standard_normal(len(t)), 0.05)
salva('motor', x * env(t, [(0, 0), (0.6, 1), (2.4, 1), (3.0, 0)]))
# vento: ruído filtrado com rajadas
t = tt(2.5); x = reson(rng.standard_normal(len(t)), 500, 400) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * t + 1) ** 2)
salva('vento', x * env(t, [(0, 0), (0.5, 1), (2.0, 1), (2.5, 0)]))
# dun dun duuun: metais graves
partes = []
for f0, d in [(146.8, 0.32), (138.6, 0.32), (110.0, 1.2)]:
    t = tt(d); ph = 2 * np.pi * f0 * t; s = sum(np.sin(k * ph) / k ** 0.9 for k in range(1, 18))
    s = lp(s, 0.25) * env(t, [(0, 0), (0.02, 1), (d * 0.7, 0.8), (d, 0)]); partes.append(s)
salva('dundun', np.concatenate(partes))
# caixa de marcha: rufo curto + batidas (para o trecho da guerra)
hit = lambda: reson(rng.standard_normal(int(0.12 * SR)), 2200, 2500) * np.exp(-np.arange(int(0.12 * SR)) / (0.025 * SR)) + 0.4 * np.sin(2 * np.pi * 190 * np.arange(int(0.12 * SR)) / SR) * np.exp(-np.arange(int(0.12 * SR)) / (0.02 * SR))
x = np.zeros(int(SR * 4.0)); bpm = 112; b = 60 / bpm
padrao = [0, 0.5, 0.75, 1, 2, 2.5, 2.75, 3, 4, 4.5, 4.75, 5, 6, 6.25, 6.5, 6.75, 7]
for p in padrao:
    i = int(p * b * SR); h = hit() * (1.0 if p % 1 == 0 else 0.6); x[i:i + len(h)] += h[:len(x) - i]
salva('caixa', x)
# tema de gângster em câmera lenta: baixo grave descendo + bumbo e caixa arrastados + acorde menor de cordas
t = tt(2.6); x = np.zeros_like(t); b = 0.65
for k, f0 in enumerate([82.4, 82.4, 73.4, 65.4]):
    i = int(k * b * SR); d = int(0.6 * SR); tl = np.arange(d) / SR
    s = sum(np.sin(2 * np.pi * f0 * j * tl) / j ** 1.3 for j in range(1, 8)) * np.exp(-tl / 0.35); x[i:i + d] += s[:len(x) - i]
    kick = np.sin(2 * np.pi * 55 * tl * np.exp(-tl * 8)) * np.exp(-tl / 0.12); x[i:i + d] += 0.8 * kick[:len(x) - i]
    if k % 2: h = reson(rng.standard_normal(d), 1800, 2200) * np.exp(-tl / 0.09); x[i:i + d] += 0.5 * h[:len(x) - i]
for f0 in [164.8, 196.0, 246.9]:
    x += 0.12 * lp(np.sign(np.sin(2 * np.pi * f0 * t)) * 0.5, 0.06) * env(t, [(0, 0), (0.8, 1), (2.2, 0.8), (2.6, 0)])
salva('gangster', x)
