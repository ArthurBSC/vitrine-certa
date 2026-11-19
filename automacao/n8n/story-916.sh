#!/bin/sh
# Story que nao e 9:16 chega cortado no Instagram: ele preenche a tela
# e corta as laterais, comendo as pontas da tarja. Aqui cada arquivo
# vai inteiro para dentro de um quadro 1080x1920, com o fundo feito da
# propria imagem ampliada e borrada. Nada e cortado.
set -e
S="$(dirname "$0")"
FF="C:/Users/DELL G15/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe"
cd "$S"
mkdir -p st916

FILTRO="[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:4,eq=brightness=-0.06[bg];\
[0:v]scale=1080:-2:force_original_aspect_ratio=decrease[fg];\
[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p"

n=0
while read -r nome; do
  nome=$(printf '%s' "$nome" | tr -d '\r')
  [ -n "$nome" ] || continue
  [ -f "st/$nome" ] || { echo "  FALTA $nome"; continue; }
  case "$nome" in
    *.mp4|*.mov)
      "$FF" -hide_banner -v error -y -i "st/$nome" -filter_complex "$FILTRO" \
        -c:v libx264 -crf 20 -preset veryfast -movflags +faststart -c:a copy \
        "st916/$nome" ;;
    *)
      "$FF" -hide_banner -v error -y -i "st/$nome" -filter_complex "$FILTRO" \
        -frames:v 1 -q:v 2 "st916/$nome" ;;
  esac
  n=$((n+1))
  [ $((n % 20)) -eq 0 ] && echo "  ...$n"
done < corrigir.txt
echo "stories em 9:16: $n"
