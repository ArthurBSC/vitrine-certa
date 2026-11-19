#!/bin/sh
# Poe uma faixa de audio silenciosa em cada Reels.
#
# Sem faixa nenhuma, o Instagram recusa o container quando se pede
# trilha da biblioteca: "Media upload has failed with error code
# 2207082". Com uma faixa muda, aceita e a musica entra por cima.
#
# A imagem e copiada sem reencodar, entao e rapido e nao perde nada.
set -e
S="$(dirname "$0")"
FF="C:/Users/DELL G15/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe"
cd "$S"
mkdir -p comfaixa
n=0
while read -r nome; do
  nome=$(printf "%s" "$nome" | tr -d "")
  [ -n "$nome" ] || continue
  [ -f "baixados/$nome" ] || { echo "  FALTA baixados/$nome"; continue; }
  "$FF" -hide_banner -v error -y -i "baixados/$nome" \
    -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
    -c:v copy -c:a aac -b:a 96k -shortest -movflags +faststart \
    "comfaixa/$nome"
  n=$((n+1))
  printf '  %s\n' "$nome"
done < reels.txt
echo "videos com faixa muda: $n"
