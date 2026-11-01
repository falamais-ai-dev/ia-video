# thumb 1080x1920: quadro sem legenda + título em Montserrat Black com contorno #372C2E (padrão da v17)
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB').resize((1080, 1920), Image.LANCZOS)
F = ImageFont.truetype(sys.argv[3], 118)
def bloco(linhas, y0, cores):
    lay = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sh)
    y = y0
    for txt, cor in zip(linhas, cores):
        f = F
        for tam in range(118, 60, -2):
            f = ImageFont.truetype(sys.argv[3], tam)
            if d.textlength(txt, font=f) <= 960: break
        w = d.textlength(txt, font=f); x = (1080 - w) / 2
        ds.text((x, y + 10), txt, font=f, fill=(0, 0, 0, 110), stroke_width=16, stroke_fill=(0, 0, 0, 110))
        d.text((x, y), txt, font=f, fill=cor, stroke_width=16, stroke_fill=(55, 44, 46, 255)); y += 138
    im.paste(sh.filter(ImageFilter.GaussianBlur(8)), (0, 0), sh.filter(ImageFilter.GaussianBlur(8)))
    im.paste(lay, (0, 0), lay)
B, A = (255, 255, 255, 255), (255, 214, 64, 255)
bloco(['POR QUE EDISON', 'DORMIA'], 150, [B, A])
bloco(['SEGURANDO', 'BOLAS DE AÇO'], 1450, [B, (78, 214, 206, 255)])
im.save(out, quality=93)
