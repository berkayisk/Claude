#!/usr/bin/env bash
# Kullanım: ./scripts/yeni-proje.sh <proje-adi>
set -e
cd "$(dirname "$0")/.."
AD="${1:?Proje adı ver: ./scripts/yeni-proje.sh proje-adi}"
TARIH=$(date +%Y-%m-%d)
HEDEF="projeler/${TARIH}_${AD}"
[ -e "$HEDEF" ] && { echo "Zaten var: $HEDEF"; exit 1; }
mkdir -p "$HEDEF"/{girdiler,ciktilar,referanslar}
cp -r _sablon/src "$HEDEF/src"
touch "$HEDEF"/{girdiler,ciktilar,referanslar}/.gitkeep
echo "# ${AD}  (${TARIH})" > "$HEDEF/NOTLAR.md"
echo "Oluşturuldu: $HEDEF"
