#!/bin/bash
# uso: qs.sh nome f1 f2 ...  -> /tmp/ideia/qc/nome.jpg (mosaico); precisa do bundle em build/
cd /tmp/ideia; n=$1; shift
for f in "$@"; do timeout 600 npx remotion still build Ideia qc/s$f.png --frame=$f --gl=swangle --timeout=240000 --props="${PROPS:-{\"dpr\":1}}" >/tmp/st$f.log 2>&1 || { echo "falhou $f"; grep -i -m3 "error" /tmp/st$f.log; } &
  while [ $(jobs -r | wc -l) -ge ${PAR:-3} ]; do sleep 1; done; done; wait
args=""; fl=""; i=0; for f in "$@"; do [ -f qc/s$f.png ] || continue; args="$args -i qc/s$f.png"; fl="$fl[$i]scale=360:-1,drawtext=text=$f:x=10:y=10:fontsize=30:fontcolor=red[v$i];"; i=$((i+1)); done
st=""; for j in $(seq 0 $((i-1))); do st="$st[v$j]"; done
ffmpeg -loglevel error -y $args -filter_complex "$fl${st}hstack=$i" qc/$n.jpg && echo ok
