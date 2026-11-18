# İlk Ağızdan: Kamer Değer (Mağazan Olsun, Pazarlama Direktörü)  (2026-11-18)

## Girdi
- `girdiler/ham-4k.mp4`: Drive'dan indirildi (orijinal adı "1108 (1).mp4"), 3840x2160, 30fps, 11:41, tek kamera (ikili geniş plan), mono ses
- Yakın planlar 4K'dan 1920x1080 kesit (büyütmesiz): konuk `crop=1920:1080:150:700`, sunucu `crop=1920:1080:1920:650`
- Proxy dosyalar: `genis.mp4` (sesli), `konuk.mp4`, `sunucu.mp4`

## Kurgu
- Transkript: faster-whisper large-v3-turbo → `calisma/transkript.txt/json`
- Plan: `calisma/plan_olustur.py` → `src/plan.json` (konuşmacı blokları elle etiketli; kamera açıları otomatik)
- Az Sonra (30 sn): ısmarlama/cinayet (9:05) → satış dans gibidir (2:24) → duygularıyla satın alırlar (9:40) → "hangi oda?" (5:00) → "tuvalet" + kahkaha (5:14)
- İlk Ağızdan kartları: 1:29.52 (1. soru), 7:50.5 (2. soru), 10:29.7 (3. soru). Kural: kart sadece ANA sorulardan önce girer (tanışma sorusunda kart yok)
- Alt bant: 0:55.6, 9 sn. Abone Ol: 11:33.6. Instagram (sifirdansatisa): 11:36.7
- Ses efektleri kodla üretildi: `whoosh.wav` (kart), `flas.wav` (ışık geçişi)
- Final ses: loudnorm -14 LUFS (render sonrası ffmpeg)

## Açık sorular
- Konuğun adının yazımı "Kamer Değer" doğru mu?
- Konuğun Instagram hesabı (referansta iki etiket vardı)
