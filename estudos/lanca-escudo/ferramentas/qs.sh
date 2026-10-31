#!/bin/bash
# uso: ./qs.sh nome f1 f2 ...  -> qc2/nome.jpg (mosaico)
cd /tmp/recria; n=$1; shift
npx remotion bundle src/index.js --out-dir=build >/dev/null 2>&1 || { echo bundle falhou; exit 1; }
for f in "$@"; do timeout 400 npx remotion still build LancaEscudo2 qc2/s$f.png --frame=$f --timeout=120000 --props='{"dpr":1}' >/tmp/st$f.log 2>&1 || { echo "falhou $f"; tail -5 /tmp/st$f.log; } & 
  while [ $(jobs -r | wc -l) -ge 2 ]; do sleep 1; done; done; wait
args=""; fl=""; i=0; for f in "$@"; do args="$args -i qc2/s$f.png"; fl="$fl[$i]scale=432:-1,drawtext=text=$f:x=10:y=10:fontsize=36:fontcolor=red[v$i];"; i=$((i+1)); done
st=""; for j in $(seq 0 $((i-1))); do st="$st[v$j]"; done
ffmpeg -loglevel error -y $args -filter_complex "$fl${st}hstack=$i" qc2/$n.jpg && echo ok
