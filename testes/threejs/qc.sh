#!/bin/bash
# uso: qc.sh video.mp4 saida.jpg [fps]  -> grade de quadros
fps=${3:-2}
ffmpeg -loglevel error -y -i "$1" -vf "fps=$fps,scale=270:480,tile=8x3" -frames:v 1 "$2"
