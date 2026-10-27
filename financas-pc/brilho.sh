#!/bin/sh
# Checagem de brilho do padrão visual (pedido do Sebastião, 26/10): nada de tela estourada ou plástico ofuscante.
# Mede, a 2 quadros por segundo, a luma média (0-255) e a % da tela quase branca (Y>235).
# Reprova o quadro se a média passar de 180 ou se mais de 5% da tela estiver quase branca.
# Uso: sh ferramentas/brilho.sh video.mp4   (ou imagem .png/.jpg). Sai com código 1 se algo reprovar.
f="$1"; d=$(mktemp -d); fps="fps=2,"
case "$f" in *.png|*.jpg|*.jpeg) fps="";; esac
ffmpeg -v error -i "$f" -vf "${fps}format=gray,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-" -f null - | grep -o 'YAVG=[0-9.]*' | cut -d= -f2 > $d/m
ffmpeg -v error -i "$f" -vf "${fps}format=gray,lutyuv=y='if(gt(val\,235)\,255\,0)',signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-" -f null - | grep -o 'YAVG=[0-9.]*' | cut -d= -f2 > $d/w
paste $d/m $d/w | awk '{t=(NR-1)/2; w=$2/255*100; mx=($1>mx?$1:mx); mw=(w>mw?w:mw); if($1>180||w>5){printf "REPROVADO t=%.1fs media=%.0f branco=%.1f%%\n",t,$1,w; r++}} END{printf "quadros=%d media_max=%.0f branco_max=%.1f%% reprovados=%d\n",NR,mx,mw,r+0; exit (r>0)}'
s=$?; rm -rf $d; exit $s
