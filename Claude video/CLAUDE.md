# Claude Video — çalışma kuralları

Bu klasör sadece kodla video üretmek içindir (Remotion + FFmpeg).

## Her yeni sohbette
1. `./scripts/yeni-proje.sh <kisa-ad>` ile yeni proje aç → `projeler/YYYY-AA-GG_<kisa-ad>/`
2. Kullanıcının verdiği ham videolar/görseller/sesler → `girdiler/`
3. Referans videolar → `referanslar/` (stil/tempo/geçiş analizi için ffprobe + ffmpeg ile kare çıkar)
4. Sonuçlar → `ciktilar/`
5. Kararları ve ayarları `NOTLAR.md` dosyasına yaz.

## İki ayrı iş kolu (ÖNEMLİ — karıştırma)
1. **Sıfırdan Satışa kanal işleri** → `projeler/` + aşağıdaki kanal stili
2. **Firma (müşteri) sosyal medya / reklam işleri** → `musteriler/<firma>/` + o firmanın `MARKA.md`'si. Kanal stili, Berkay Işık
   marka dosyaları ve kanal tonu burada KULLANILMAZ. Ayrıntı: `musteriler/README.md`

## Senaryo
- Senaryo/metin işleri `/senarist` yeteneğiyle (`/home/user/Claude/.claude/skills/senarist/SKILL.md`); dizi kitapları `seriler/<dizi>/SERI.md`.

## Kanal stili (sadece Sıfırdan Satışa projeleri)
Kullanıcının kendi kanal stili: `kanal-referanslari/yunus-emre-kocaoglu/STIL.md`
Kanal videolarında, aksi söylenmedikçe bu stili (renkler, fontlar, "Az Sonra" fragmanı, alt bant, Abone Ol, bitiş ekranı) uygula.
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
- FFmpeg: doğrudan `ffmpeg` (kesme, birleştirme, ses ayırma, sıkıştırma, format dönüştürme). Varsayılan ffmpeg **9.0.2**
  (`/usr/local/bin/ffmpeg` → imageio-ffmpeg; açılış betiği kurar). Sistem ffmpeg 6.1 `/usr/bin/ffmpeg`'te durur; ffprobe 6.1.
  - İki geçişli loudnorm: `python3 araclar/loudnorm2.py girdi.mp4 cikti.mp4` (ffmpeg 9 JSON'dan sonra özet satırı yazar:
    "son 13 satırı oku" kalıbı BOZULUR; JSON'u süslü parantez bloğundan ayıkla).
  - ffmpeg 9 derlemesinde fontconfig yok: `drawtext`'e `fontfile=` ver.

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
- Kesmeler (kullanıcının kendi kurgusundan ölçüldü): cümle arası boşluk ~0.07 sn (en fazla 0.10). Temiz seste -38 dB altı >=0.12 sn her sessizliği kes, iki yanda 0.035 sn bırak; kelimesiz bölgeleri (nefes, ıı) at; yarıda kalan denemeleri HARIC ile çıkar (whisper bunları birleştirebilir, kelime kelime kontrol et); kare yuvarlama: baş floor, son ceil. Açı değişimi sadece konu değişince. Tempo 1.0 (kullanıcı 1.1x hızı çok hızlı buldu; hızlandırma yapma). `calisma/kesme_kontrol.py` ile doğrula (sadece atılan tarafta ses varsa sorun).
- Konuşma eşiği çekime uyarlanır: zemin gürültüsü (10. yüzdelik) + 7 dB, en az -38 dB (mekân yankısı olan çekimlerde sabit -38 hiç kesmez). Aynı çekimi tek parça işle; anlam bölümleri sadece grafik zamanlaması için (bölüm sınırı konuşma ortasına düşüp 1 kare ses atlatmasın).
- Türkçe eşleştirmede `İ`/`I` küçültmesine dikkat (Python lower() 'İ'yi 'i̇' yapar).
- Kartlarda `backdrop-filter` KULLANMA (render'da titriyor) → düz yarı saydam zemin.
- Ses efektleri: `marka/sfx/` (araclar/sfx_uret.py), grafik türüne göre giriş/çıkış.
- Stok B-roll: Mixkit (ücretsiz, ticari/reklam kullanımı serbest, anahtar gerekmez; ortamda mixkit.co + assets.mixkit.co izinli). Arama: `https://mixkit.co/free-stock-video/<konu>/`, dosya: `https://assets.mixkit.co/videos/<id>/<id>-720.mp4` (sadece 720p yatay). Şablonda `broll_video` olayı: bulanık arka + keskin çerçeve (top, yukseklik ayarlanır). Dosyalar `girdiler/broll/`.
- Video konuşma bitince biter; sona sessiz kuyruk ekleme. Kapanış kartı son cümlede başlar, `son: tl + 0.5` ile son karede sönmez.
- Yüzü yukarıda olan çekimlerde veri `kartY: 1060, altyaziY: 1440` ile kartlar göğüs hizasına alınır (ağız/yüz kapanmaz).

## earshot (ses efekti üretimi + sesi dinleme) — github.com/Leonxlnx/earshot
- Kurulum: `pip install "earshot[mcp,measure] @ git+https://github.com/Leonxlnx/earshot"` (PyPI'deki `earshot` BAŞKA proje). Dinleme modelleri
  (CLAP + AST, ~2,2 GB) `earshot doctor --fetch` ile `~/.cache/earshot/hf`'e iner; sonra `HF_HUB_OFFLINE=1`.
- SFX: `earshot make "a phone vibrating" -o x.wav` (922 tasarım, kodla render, telifsiz). Eksikse `earshot build`.
- Denetim: `earshot timeline film.mp4` → bölümler, müzik türü tahmini, kesme–vuruş senkronu, boşluklar; `earshot describe/match/ab`.
- MCP sunucusu repo kökündeki `.mcp.json`'da (`earshot mcp`).

## Lemo-Opuscar (99 kodla film stili) — /lemo-opuscar yeteneği
- Kütüphane `~/lemo-opuscar` (her yeni container'da `sh .claude/skills/lemo-opuscar/scripts/setup.sh` ile iner, ~33 MB);
  paketler: `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers sh .claude/skills/lemo-opuscar/scripts/setup.sh deps` (~290 MB, hazır Chromium kullanılır).
- Render ederken `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` ver (varsayılan ffmpeg 9 olduğu için `core/render/mux.sh`'in ffmpeg 7+ şartı karşılanır).
  Ortamın açılış betiği bunların hepsini her yeni oturumda kurar.
- Lisans: yapılan filmler bizim (ticari dahil, atıf gerekmez); stil talimatları kendi filmlerimiz için kullanılabilir, dağıtılamaz.

## Berkay ses klonu (tüm bölümler / seslendirmeli içerikler için — kullanıcı onaylı)
- Araç: `araclar/berkay_ses.py satirlar.json cikti/` — Chatterbox Multilingual (MIT, ticari serbest), Türkçe, referans `marka/sifirdan-satisa/berkay_ses_referans.wav`
  (Berkay'ın kendi anlatım kaydından 10 sn). Her satır Whisper ile birebir doğrulanır (≤6 deneme, TOHUM ortam değişkeni ile farklı denemeler),
  son kelimeden sonraki sessizlikte kesilir (model fazladan ses üretebiliyor), süre metne göre denetlenir, tüm satırların medyan perdesi 176 Hz'e eşitlenir,
  NETLIK zinciri uygulanır (model 24 kHz → boğuk; Berkay'ın kaydının bant profiline göre EQ + exciter + de-esser). Sadece son işlem: `--son-islem cikti/`.
  Filmde VO'ya ayrıca bas takviyesi EKLEME (boğuklaştırıyor).
- Perde kaydırma sonrası da bağlam içinde (satırları birleştirerek) yeniden doğrula: bir kez "kaçırmamak" → "kaçınmamak" oldu.
- Kurulum (yeni oturum): `pip install --no-deps chatterbox-tts torchaudio==2.11.1` + librosa==0.11.0 s3tokenizer transformers==5.2.0 diffusers==0.29.0
  resemble-perth conformer==0.3.2 pyloudnorm omegaconf pykakasi==2.3.0 "setuptools<81"; ilk çalıştırmada HF'den model iner (HF_HUB_DISABLE_XET=1).
- Telaffuz: `/turkce-seslendirme` (araclar/telaffuz.py GOP + telaffuz_sozluk.json). Vurgu/tonlama: `/vurgu-tonlama` (araclar/vurgu.py,
  Berkay'ın gerçek okumasından öğrenilmiş vurgu profili; klonun tipik hatası vurguyu sona kaydırmak: sonRA, kaDAR, aMA, önCE).
- ElevenLabs anahtarı da ortamda kayıtlı (ücretsiz plan: kütüphane sesleri API'de yok). Başka kişilerin/kanalların sesi klonlanmaz.
