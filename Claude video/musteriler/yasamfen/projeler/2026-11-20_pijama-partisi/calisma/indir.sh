#!/usr/bin/env bash
# drive_liste.tsv (id \t ad) → girdiler/ham/ (4 paralel, tekrar denemeli, yarım kalanı devam ettirir)
cd "$(dirname "$0")/.."
indir() { id=$1; ad=$2; for i in 1 2 3 4; do
  curl -sSL -C - --retry 3 -o "girdiler/ham/$ad" "https://drive.usercontent.google.com/download?id=$id&export=download&confirm=t" && \
  file "girdiler/ham/$ad" | grep -qiv "html" && { echo "OK $ad"; return; }; sleep $((i*3)); done; echo "HATA $ad"; }
export -f indir
awk -F'\t' '{print $1" "$2}' calisma/drive_liste.tsv | xargs -P 4 -n 2 bash -c 'indir "$0" "$1"'
echo BITTI
