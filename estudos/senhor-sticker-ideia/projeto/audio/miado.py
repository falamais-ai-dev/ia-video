# Miado bravo de gato ("uneeeenaww") sintetizado em código: fonte harmônica + formantes variáveis.
import numpy as np, subprocess
SR = 48000; D = 1.25; n = int(SR * D); t = np.arange(n) / SR
rng = np.random.default_rng(7)
def curva(pts):  # interpolação suave de (tempo, valor)
    ts, vs = zip(*pts); return np.interp(t, ts, vs)
f0 = curva([(0, 360), (0.12, 420), (0.38, 690), (0.7, 640), (1.0, 470), (1.25, 300)])
f0 *= 1 + 0.025 * np.sin(2 * np.pi * 6.5 * t) + 0.01 * np.convolve(rng.standard_normal(n), np.ones(400) / 400, 'same') * 20
fase = 2 * np.pi * np.cumsum(f0) / SR
src = sum((1 / k ** 1.1) * np.sin(k * fase) for k in range(1, 26) if k * 700 < SR / 2)
src += 0.06 * rng.standard_normal(n)  # sopro
# rosnado: modulação áspera no começo e no fim
grr = curva([(0, 1), (0.2, 0.25), (0.85, 0.2), (1.25, 0.9)])
src *= 1 - grr * 0.6 * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 34 * t)))
# formantes u -> e -> a -> w (escala de voz de gato)
F = [curva([(0, 600), (0.25, 900), (0.55, 1500), (0.95, 1300), (1.25, 650)]),
     curva([(0, 1300), (0.25, 3100), (0.55, 2500), (0.95, 2100), (1.25, 1200)]),
     curva([(0, 3800), (0.5, 4300), (1.25, 3600)])]
G = [1.0, 0.7, 0.3]
def reson(x, fc, bw):
    y = np.zeros_like(x); y1 = y2 = 0.0
    r = np.exp(-np.pi * bw / SR); c2 = -r * r; a0 = 1 - r
    for i in range(len(x)):
        c1 = 2 * r * np.cos(2 * np.pi * fc[i] / SR)
        v = a0 * x[i] + c1 * y1 + c2 * y2; y2 = y1; y1 = v; y[i] = v
    return y
out = sum(g * reson(src, f, 180 + 0.08 * f.mean()) for f, g in zip(F, G))
env = curva([(0, 0), (0.06, 0.7), (0.3, 1), (0.9, 0.9), (1.1, 0.5), (1.25, 0)])
out *= env; out /= np.abs(out).max(); out *= 0.9
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f64le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', '/tmp/ideia/audio/miado.wav'], input=out.tobytes(), check=True)
print('ok', len(out) / SR)
