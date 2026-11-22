#!/usr/bin/env bash
# Kullanım: drive_yukle.sh dosya...   (www.googleapis.com anahtarı proxy tarafından eklenir)
for F in "$@"; do
  N=$(basename "$F"); SIZE=$(stat -L -c %s "$F"); H=$(mktemp)
  code=$(curl -sS -D $H -o /dev/null -w "%{http_code}" -X POST "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable" \
    -H "Content-Type: application/json; charset=UTF-8" -H "X-Upload-Content-Type: video/mp4" -H "X-Upload-Content-Length: $SIZE" \
    -d "{\"name\":\"$N\",\"mimeType\":\"video/mp4\"${KLASOR:+,\"parents\":[\"$KLASOR\"]}}")
  if [ "$code" != "200" ]; then echo "$N: oturum açılamadı (HTTP $code)"; exit 1; fi
  LOC=$(tr -d '\r' < $H | awk 'tolower($1)=="location:"{print $2}')
  R=$(curl -sS -X PUT "$LOC" -H "Content-Type: video/mp4" --upload-file "$F")
  ID=$(echo "$R" | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])")
  M=$(curl -sS "https://www.googleapis.com/drive/v3/files/$ID?fields=size,md5Checksum" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d['size'],d['md5Checksum'])")
  L="$(stat -L -c %s "$F") $(md5sum "$F" | cut -d' ' -f1)"
  [ "$M" = "$L" ] && echo "$N: TAMAM https://drive.google.com/file/d/$ID/view" || echo "$N: UYUŞMAZLIK drive=$M yerel=$L"
done
