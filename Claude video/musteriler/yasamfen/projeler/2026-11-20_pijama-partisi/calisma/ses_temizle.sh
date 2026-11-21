#!/usr/bin/env bash
# Kullanım: calisma/ses_temizle.sh 7356 7357 ...  → calisma/ses/<no>_temiz.wav (48k) + <no>_16k.wav
# (Demucs bu makinede çok yavaş; kalabalık gürültüsünde fark yaratmadığı için FFmpeg zinciri)
# highpass 90 → lowpass 12k → afftdn (gürültü profili) → hafif agate → compressor → presence EQ → loudnorm benzeri seviye
cd "$(dirname "$0")/.."; mkdir -p calisma/ses
for n in "$@"; do
  [ -f calisma/ses/${n}_temiz.wav ] && continue
  ffmpeg -v error -y -i girdiler/ham/IMG_$n.MOV -vn -af "highpass=f=90,lowpass=f=12000,afftdn=nr=14:nf=-35:tn=1,agate=threshold=0.006:ratio=1.5:attack=5:release=200,acompressor=threshold=-22dB:ratio=3:attack=6:release=120:makeup=4,equalizer=f=3000:t=q:w=1.2:g=2.5,equalizer=f=250:t=q:w=1:g=-2,alimiter=limit=0.9,aresample=48000" -ac 2 calisma/ses/${n}_temiz.wav
  ffmpeg -v error -y -i calisma/ses/${n}_temiz.wav -ac 1 -ar 16000 calisma/ses/${n}_16k.wav
  echo "OK $n"
done
echo SES BITTI
