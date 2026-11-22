#!/usr/bin/env bash
# ÇALMA: orijinal ses, hafif zincir (Demucs/kapı YOK — boğuk yapıyordu): highpass 100, gürültü azaltma, 250 Hz -2, 4 kHz +3, yumuşak kompresör, -14 LUFS
# ANALİZ (kesme noktaları): Demucs vokal (sessizlikleri temiz) -> calisma/ses_temiz/<n>_16k.wav
set -e
for n in "$@"; do
  d=calisma/ses_temiz
  ffmpeg -v error -y -i girdiler/$n.MOV -map 0:a:0 -af "highpass=f=100,afftdn=nf=-28:nr=15:tn=1,equalizer=f=250:t=q:w=1.0:g=-2,equalizer=f=4000:t=q:w=1.5:g=3,acompressor=threshold=-18dB:ratio=2:attack=8:release=150,loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -ac 2 girdiler/${n}_ses.wav
  if [ ! -f $d/htdemucs_ft/${n}_ham/vocals.wav ]; then
    ffmpeg -v error -y -i girdiler/$n.MOV -map 0:a:0 -ac 2 -ar 44100 $d/${n}_ham.wav
    (cd $d && python3 -m demucs -n htdemucs_ft --two-stems=vocals -o . ${n}_ham.wav >/dev/null 2>&1)
  fi
  ffmpeg -v error -y -i $d/htdemucs_ft/${n}_ham/vocals.wav -af "highpass=f=80,loudnorm=I=-16" -ac 1 -ar 16000 $d/${n}_16k.wav
  echo "ok $n"
done
