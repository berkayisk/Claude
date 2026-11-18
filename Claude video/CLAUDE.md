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

## Notlar
- node_modules kökte tek sefer kurulu; projeler onu paylaşır.
- `remotion.config.ts` kısıtlı ağda hazır Chromium'u kullanır.
- Medya dosyaları .gitignore'da; git'e sadece kod ve notlar girer.
