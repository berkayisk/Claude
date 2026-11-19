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

## Teslim
- `ciktilar/Ilk-Agizdan_Kamer-Deger_FINAL_v3.mp4`: 1080p, 12:28 (22437 kare), -14.4 LUFS, video 3.8 Mbps, 361 MiB (sohbet yükleme sınırı 400 MiB)
- Kart kaldırma, tam render yerine yamayla yapıldı: eski final [0,2571) + yeni render [2571,3064) + eski final [3120,son), ses baştan render edildi
- Ders: iki Remotion render'ını aynı anda çalıştırma (bellek yetmiyor); ffmpeg'de aynı girişi iki trim dalına bölme (bellek patlıyor), parçaları ayrı dosyalara çıkarıp birleştir

## v4 (son teslim)
- `ciktilar/Ilk-Agizdan_Kamer-Deger_FINAL_v4.mp4`: 22401 kare, -14.4 LUFS, 378 MB. Üretim: `calisma/final_uret.sh`
- Ham çekimde 470.47–471.10 arası eski Yunus Emre kartı + dijital sessizlik vardı → atlandı
- Kart zamanları ses enerjisinden: (çık, gir) = (89.52, 89.52), (470.40, 471.12), (629.60, 630.07); gir = soru başı − 0.23 sn
- Fragmanda vizör yok, AZ SONRA 130 px
- Kapanış sunucu yakın planda; Abone Ol x=560 (sol), Instagram sol alt

## Shorts (2026-11-19)
- Plan: `calisma/shorts_plan.py` → `src/shorts.json`; bileşen: `bilesenler/Short.tsx`; üretim: `calisma/shorts_uret.sh`
- Dikey kaynak: 4K'dan crop 1215x2160 (konuk x=350, sunucu x=2560) → konuk_dikey.mp4 / sunucu_dikey.mp4
- Short1-Tuvalet 45 sn, Short2-Dans 28 sn, Short3-TurkAmerikan 44 sn, Short4-Duygusal 42 sn; hepsi Drive'a yüklendi
- Müzik: `araclar/arka_muzik.py` (lo-fi, 88 bpm), volume 0.1
