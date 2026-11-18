#!/bin/sh
# Poe uma trilha em todos os videos do calendario.
#
#   sh aplicar-trilha.sh /caminho/da/faixa.mp3 [segundo-de-inicio]
#
# A faixa precisa ser livre para uso comercial. Ver o porque em
# README.md, secao "Trilha sonora".
#
# O que faz em cada video: corta o trecho da faixa no tamanho exato do
# video, normaliza o volume, aplica meio segundo de fade na entrada e
# na saida, e grava sem reencodar a imagem (-c:v copy), entao nao
# perde qualidade nem demora.
set -e

FAIXA="$1"
INICIO="${2:-0}"
[ -f "$FAIXA" ] || { echo "uso: sh aplicar-trilha.sh faixa.mp3 [inicio]"; exit 1; }

FF="${FFMPEG:-ffmpeg}"
FP="${FFPROBE:-ffprobe}"
ORIGEM="${ORIGEM:-./com-tarja}"
SAIDA="${SAIDA:-./com-trilha}"
mkdir -p "$SAIDA"

n=0
for v in "$ORIGEM"/*.mp4; do
  [ -f "$v" ] || continue
  nome=$(basename "$v")
  dur=$("$FP" -v error -show_entries format=duration \
        -of default=nw=1:nk=1 "$v")
  "$FF" -hide_banner -v error -y \
    -i "$v" -ss "$INICIO" -t "$dur" -i "$FAIXA" \
    -filter_complex "[1:a]loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.5,afade=t=out:st=$(awk "BEGIN{print $dur-0.5}"):d=0.5[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 128k -shortest \
    -movflags +faststart "$SAIDA/$nome"
  n=$((n+1))
  echo "  $nome"
done
echo "videos com trilha: $n -> $SAIDA"
