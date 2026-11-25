#!/usr/bin/env bash
# Kapak için aday kareler: 4K kaynaklardan eşit aralıklı tam kare PNG + tek bakışta seçmek için numaralı şerit.
# Kullanım (proje klasöründen): kare_adaylari.sh [kare_sayisi_klip_basi=3] IMG_6174 IMG_6176 ...
# Çıktı: calisma/kapak/aday_<klip>_<sn>.png ve calisma/kapak_adaylar.jpg (sırası dosya adlarıyla aynı, ekrana yazılır)
set -e
N=3; if [[ "$1" =~ ^[0-9]+$ ]]; then N=$1; shift; fi
mkdir -p calisma/kapak; rm -f calisma/kapak/k*.jpg
i=0
for k in "$@"; do
  src=$(ls girdiler/$k.MOV girdiler/$k.mov girdiler/$k.mp4 2>/dev/null | head -1)
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
  for j in $(seq 1 $N); do
    t=$(python3 -c "print(round($d*$j/($N+1),2))")
    ffmpeg -v error -y -ss $t -i "$src" -frames:v 1 calisma/kapak/aday_${k}_$t.png
    ffmpeg -v error -y -i calisma/kapak/aday_${k}_$t.png -vf "scale=216:-1,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text=$i:x=8:y=8:fontsize=34:fontcolor=yellow:borderw=3" calisma/kapak/k$(printf %02d $i).jpg
    echo "$i  calisma/kapak/aday_${k}_$t.png"
    i=$((i+1))
  done
done
ffmpeg -v error -y -i calisma/kapak/k%02d.jpg -vf "tile=${i}x1" calisma/kapak_adaylar.jpg
echo "şerit: calisma/kapak_adaylar.jpg"
