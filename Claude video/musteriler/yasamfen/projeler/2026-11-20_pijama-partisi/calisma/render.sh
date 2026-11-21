#!/usr/bin/env bash
# Kullanım: calisma/render.sh Yarisma1 yarisma1  → ciktilar/<dosya>.mp4 (-14 LUFS) + calisma/kontrol/<dosya>_kareler.jpg (her 1.5 sn)
set -e
cd "$(dirname "$0")/.."; ID=$1; AD=$2; K="$(cd ../../../.. && pwd)"; PR="musteriler/yasamfen/projeler/$(basename "$PWD")"
mkdir -p calisma/kontrol
(cd "$K" && npx remotion render "$PR/src/index.ts" $ID "/tmp/claude-0/${AD}_ham.mp4" \
   --public-dir "$PR/girdiler" --concurrency=3 --crf=18 2>&1 | grep -E "Rendered|Encoded|Error|error" | tail -3)
ffmpeg -v error -y -i /tmp/claude-0/${AD}_ham.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.0:LRA=9" -ar 48000 -c:a aac -b:a 192k ciktilar/${AD}.mp4
rm -f /tmp/claude-0/${AD}_ham.mp4
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 ciktilar/${AD}.mp4)
ffmpeg -v error -y -i ciktilar/${AD}.mp4 -vf "fps=1/1.5,scale=180:-1,tile=10x$(python3 -c "import math;print(math.ceil($D/1.5/10))")" -frames:v 1 calisma/kontrol/${AD}_kareler.jpg
echo "$AD: $(du -h ciktilar/${AD}.mp4 | cut -f1), ${D}s, $(ffmpeg -v info -i ciktilar/${AD}.mp4 -af ebur128 -f null - 2>&1 | grep 'I:' | tail -1 | xargs)"
