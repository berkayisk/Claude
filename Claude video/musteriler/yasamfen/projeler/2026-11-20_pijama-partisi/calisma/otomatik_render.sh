#!/usr/bin/env bash
# Vekilleri hazır olan videoyu sırayla render eder + blur kontrolü. Kullanım: calisma/otomatik_render.sh Hocalar:hocalar Genel:genel ...
cd "$(dirname "$0")/.."
kalan=("$@")
while [ ${#kalan[@]} -gt 0 ]; do
  yeni=()
  for v in "${kalan[@]}"; do
    ad=${v##*:}
    eksik=$(python3 -c "
import json,os
v=json.load(open('src/$ad.json'))
s={p['src'] for p in v['parcalar']}|{k['src'] for p in v['parcalar'] for k in p.get('kaplama',[])}
print(sum(1 for x in s if not os.path.exists('girdiler/'+x) or os.path.exists('girdiler/'+x[:-4]+'.kilit')))")
    if [ "$eksik" = "0" ]; then
      calisma/render.sh ${v%%:*} $ad && python3 calisma/blur_kontrol.py ciktilar/$ad.mp4 2>&1 | grep -v WARN
      echo "HAZIR $ad"
    else yeni+=("$v"); fi
  done
  kalan=("${yeni[@]}"); [ ${#kalan[@]} -gt 0 ] && sleep 30
done
echo "TUM RENDER BITTI"
