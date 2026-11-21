#!/usr/bin/env bash
# Kullanım: calisma/ses_temizle.sh 7356 7357 ...  → calisma/ses/<no>_temiz.wav (48k stereo) + <no>_16k.wav
# Demucs htdemucs_ft vocals → highpass 80, afftdn, hafif agate, compressor, presence EQ
cd "$(dirname "$0")/.."; mkdir -p calisma/ses/ham calisma/ses/demucs
for n in "$@"; do
  [ -f calisma/ses/${n}_temiz.wav ] && continue
  ffmpeg -v error -y -i girdiler/ham/IMG_$n.MOV -vn -ac 2 -ar 44100 calisma/ses/ham/$n.wav
  python3 -m demucs -n htdemucs_ft --two-stems=vocals -o calisma/ses/demucs calisma/ses/ham/$n.wav >/dev/null 2>&1 || { echo "DEMUCS HATA $n"; continue; }
  ffmpeg -v error -y -i calisma/ses/demucs/htdemucs_ft/$n/vocals.wav -af "highpass=f=80,afftdn=nf=-30,agate=threshold=0.008:ratio=1.6:attack=5:release=180,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=3,equalizer=f=3200:t=q:w=1.2:g=2.5,aresample=48000" calisma/ses/${n}_temiz.wav
  ffmpeg -v error -y -i calisma/ses/${n}_temiz.wav -ac 1 -ar 16000 calisma/ses/${n}_16k.wav
  echo "OK $n"
done
echo SES BITTI
