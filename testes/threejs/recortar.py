# Separa uma cena aprovada em duas camadas para parallax 2.5D (grátis, roda local, sem cota):
#   <saida>-frente.png (pessoa/objeto com transparência) e <saida>-fundo.jpg (fundo com o buraco preenchido e leve desfoque)
# uso: python3 recortar.py cena.jpg saida   (pip install "rembg[cpu]" opencv-python-headless; modelo isnet-general-use, Apache 2.0)
import sys, numpy as np, cv2
from PIL import Image
from rembg import remove, new_session
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
fg = remove(im, session=new_session('isnet-general-use'))
fg.save(out + '-frente.png')
m = cv2.dilate(((np.array(fg)[:, :, 3] > 20) * 255).astype(np.uint8), np.ones((31, 31), np.uint8))
bgr = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
h, w = bgr.shape[:2]
inp = cv2.resize(cv2.inpaint(cv2.resize(bgr, (w // 2, h // 2)), cv2.resize(m, (w // 2, h // 2)), 9, cv2.INPAINT_TELEA), (w, h), interpolation=cv2.INTER_CUBIC)
mm = cv2.GaussianBlur(m, (21, 21), 0)[:, :, None] / 255.0
bg = cv2.GaussianBlur((bgr * (1 - mm) + inp * mm).astype(np.uint8), (0, 0), 3)
cv2.imwrite(out + '-fundo.jpg', bg, [cv2.IMWRITE_JPEG_QUALITY, 92])
