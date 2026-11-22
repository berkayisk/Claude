#!/usr/bin/env bash
# Demucs vokal ayırma + temizlik zinciri -> girdiler/<n>_ses.wav (çalma) ve calisma/ses_temiz/<n>_16k.wav (analiz)
set -e
for n in "$@"; do
  d=calisma/ses_temiz
  ffmpeg -v error -y -i girdiler/$n.MOV -map 0:a:0 -ac 2 -ar 44100 $d/${n}_ham.wav
  (cd $d && python3 -m demucs -n htdemucs_ft --two-stems=vocals -o . ${n}_ham.wav >/dev/null 2>&1)
  ffmpeg -v error -y -i $d/htdemucs_ft/${n}_ham/vocals.wav -af "highpass=f=80,afftdn=nf=-25,agate=threshold=0.008:ratio=2:attack=5:release=150,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=3,equalizer=f=3500:t=q:w=1.2:g=3,loudnorm=I=-14:TP=-1.5:LRA=9" -ar 48000 -ac 2 girdiler/${n}_ses.wav
  ffmpeg -v error -y -i girdiler/${n}_ses.wav -ac 1 -ar 16000 $d/${n}_16k.wav
  echo "ok $n"
done
