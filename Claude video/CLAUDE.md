# Claude Video — çalışma kuralları

Bu klasör sadece kodla video üretmek içindir (Remotion + FFmpeg).

## Her yeni sohbette
1. `./scripts/yeni-proje.sh <kisa-ad>` ile yeni proje aç → `projeler/YYYY-AA-GG_<kisa-ad>/`
2. Kullanıcının verdiği ham videolar/görseller/sesler → `girdiler/`
3. Referans videolar → `referanslar/` (stil/tempo/geçiş analizi için ffprobe + ffmpeg ile kare çıkar)
4. Sonuçlar → `ciktilar/`
5. Kararları ve ayarları `NOTLAR.md` dosyasına yaz.

## Kanal stili (ÖNEMLİ)
Kullanıcının kendi kanal stili: `kanal-referanslari/yunus-emre-kocaoglu/STIL.md`
Yeni videolarda, aksi söylenmedikçe bu stili (renkler, fontlar, "Az Sonra" fragmanı, alt bant, Abone Ol, bitiş ekranı) uygula.
Örnek kareler: `kanal-referanslari/yunus-emre-kocaoglu/kareler/`
Marka dosyaları (jenerik, bitiş ekranı, İlk Ağızdan kartı, sunucu fotoğrafı): `marka/sifirdan-satisa/` → `MARKA.md`

## Proje yapısı
```
projeler/<proje>/
  girdiler/      ham video, ses, görsel (Remotion'da staticFile("dosya.mp4") ile erişilir)
  referanslar/   örnek / ilham videoları
  ciktilar/      render edilen videolar
  src/           Remotion kodu (index.ts → Root.tsx → Video.tsx)
  NOTLAR.md
```

## Komutlar (bu klasörün kökünden)
- Render: `./scripts/render.sh <proje> [CompositionId] [cikti.mp4]`
- Studio (önizleme): `./scripts/studio.sh <proje>`
- FFmpeg: doğrudan `ffmpeg` (kesme, birleştirme, ses ayırma, sıkıştırma, format dönüştürme)

## Teslim
- Sohbete dosya gönderme sınırı ~400 MiB; iPad'de sohbetten indirme butonu YOK. Finali kullanıcının Google Drive'ına yükle:
  kullanıcı OAuth Playground'dan `drive.file` kapsamlı access token alır → request_credential (host www.googleapis.com) →
  `araclar/drive_yukle.sh dosya...` (resumable upload + boyut/md5 kontrolü). Token ~1 saat geçerli.

## Notlar
- node_modules kökte tek sefer kurulu; projeler onu paylaşır.
- `remotion.config.ts` kısıtlı ağda hazır Chromium'u kullanır.
- Medya dosyaları .gitignore'da; git'e sadece kod ve notlar girer.

## Reels / talking-head kuralları (öğrenildi)
- Ses temizliği: Demucs `htdemucs_ft --two-stems=vocals` → highpass 80, afftdn, hafif agate, compressor, presence EQ (`projeler/2026-11-19_reels-1` örneği). Videoyu `muted`, temiz sesi ayrı `Audio` olarak çal.
- Kesmeler: temiz ses üzerinde Silero VAD (faster_whisper.vad); sadece >=0.35 sn boşluk kes; önce 0.10 / arka 0.16 sn pay; parça sonu ses sönene kadar (-34 dB) uzar; kelimesiz parça at; birim sınırları (önceki deneme, "evet/dur/kayıtta mı") kesin alt/üst sınır. Her render öncesi `calisma/kesme_kontrol.py` ile doğrula.
- Kartlarda `backdrop-filter` KULLANMA (render'da titriyor) → düz yarı saydam zemin.
- Ses efektleri: `marka/sfx/` (araclar/sfx_uret.py), grafik türüne göre giriş/çıkış.
