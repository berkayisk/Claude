#!/usr/bin/env bash
# Kullanım: [MODEL=htdemucs] calisma/ses_temizle.sh 7356 7357 ...  → calisma/ses/<no>_temiz.wav (48k) + <no>_16k.wav
# Demucs vocals → highpass 80, afftdn, hafif agate, compressor, presence EQ. Vocals hazırsa Demucs atlanır.
cd "$(dirname "$0")/.."; mkdir -p calisma/ses/ham calisma/ses/demucs
MODEL=${MODEL:-htdemucs}
for n in "$@"; do
  [ -f calisma/ses/${n}_temiz.wav ] && continue
  V=$(ls calisma/ses/demucs/*/$n/vocals.wav 2>/dev/null | head -1)
  if [ -z "$V" ]; then
    ffmpeg -v error -y -i girdiler/ham/IMG_$n.MOV -vn -ac 2 -ar 44100 calisma/ses/ham/$n.wav
    python3 -m demucs -n $MODEL --two-stems=vocals -o calisma/ses/demucs calisma/ses/ham/$n.wav >/dev/null 2>&1 || { echo "DEMUCS HATA $n"; continue; }
    V=calisma/ses/demucs/$MODEL/$n/vocals.wav
  fi
  ffmpeg -v error -y -i "$V" -af "highpass=f=80,afftdn=nf=-30,agate=threshold=0.008:ratio=1.6:attack=5:release=180,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=3,equalizer=f=3200:t=q:w=1.2:g=2.5,aresample=48000" calisma/ses/${n}_temiz.wav
  ffmpeg -v error -y -i calisma/ses/${n}_temiz.wav -ac 1 -ar 16000 calisma/ses/${n}_16k.wav
  echo "OK $n"
done
echo SES BITTI
