#!/usr/bin/env python3
"""Caça-erros automático de um render (método Qualidade 10, ver METODO-QUALIDADE-10.md).

Uso: python3 qc_animacao.py video.mp4 pasta_saida [--ffmpeg CAMINHO]

Mede, quadro a quadro, sem olhar a cena:
  1. pop      - quadro isolado que difere dos dois vizinhos (objeto pulando, corte de 1 quadro)
  2. cintila  - nitidez do chão/meio que salta num quadro só (z-fighting, sombra piscando)
  3. parado   - trechos de mais de 3 s em que quase nada muda na tela
A serrilha não é medida aqui: a medida por borda seca deu nota pior à referência (traço
grosso e nítido) do que ao nosso vídeo, então não serve. A serrilha se confere no olho, em recorte 4x.
Grava relatorio.txt e qc.jpg (grade a 2 quadros por segundo).
"""
import glob, os, subprocess, sys
import numpy as np
from PIL import Image

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    video, out = sys.argv[1], sys.argv[2]
    ff = sys.argv[sys.argv.index('--ffmpeg') + 1] if '--ffmpeg' in sys.argv else 'ffmpeg'
    os.makedirs(out, exist_ok=True)
    fr_dir = os.path.join(out, 'quadros'); os.makedirs(fr_dir, exist_ok=True)
    subprocess.run([ff, '-v', 'error', '-y', '-i', video, '-vf', 'scale=540:960', os.path.join(fr_dir, '%05d.png')], check=True)
    subprocess.run([ff, '-v', 'error', '-y', '-i', video, '-vf', 'fps=2,scale=135:240,tile=14x10', '-frames:v', '1', os.path.join(out, 'qc.jpg')], check=True)
    frames = sorted(glob.glob(os.path.join(fr_dir, '*.png')))
    A = [np.asarray(Image.open(f).convert('L'), dtype=np.float32) for f in frames]
    n = len(A); ts = lambda i: '%.2fs' % ((i + 1) / 30)
    rel = ['quadros: %d (%.1f s)' % (n, n / 30)]

    pops = []
    for i in range(1, n - 1):
        a = np.abs(A[i] - A[i - 1]).mean(); b = np.abs(A[i + 1] - A[i - 1]).mean()
        if a > 2 and a > 2.5 * b: pops.append(ts(i))
    rel.append('pop (quadro isolado): ' + (', '.join(pops) or 'nenhum'))

    def nit(a, box):
        x0, y0, x1, y1 = box
        return np.var(np.abs(np.diff(a[y0:y1, x0:x1], axis=1)))
    for nome, box in (('chão', (0, 575, 540, 750)), ('meio', (0, 300, 540, 575))):
        v = np.array([nit(a, box) for a in A]); achados = []
        for i in range(1, n - 1):
            m = (v[i - 1] + v[i + 1]) / 2
            if abs(v[i] - m) > 0.15 * m and abs(v[i - 1] - v[i + 1]) < 0.08 * m: achados.append(ts(i))
        rel.append('cintila no %s: %s' % (nome, ', '.join(achados) or 'nenhum'))

    parado, ini = [], None
    for i in range(1, n):
        quieto = np.abs(A[i] - A[i - 1]).mean() < 0.6
        if quieto and ini is None: ini = i
        if (not quieto or i == n - 1) and ini is not None:
            if i - ini > 90: parado.append('%s-%s' % (ts(ini), ts(i)))
            ini = None
    rel.append('tela parada > 3 s: ' + (', '.join(parado) or 'nenhuma'))

    open(os.path.join(out, 'relatorio.txt'), 'w').write('\n'.join(rel) + '\n')
    print('\n'.join(rel))

if __name__ == '__main__':
    main()
