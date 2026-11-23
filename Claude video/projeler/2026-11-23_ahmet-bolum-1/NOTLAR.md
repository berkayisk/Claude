# Ahmet E-Ticarete Başlamak İstiyor — Bölüm 1 (stilize versiyon)

- Prodüksiyon planı (storyboard, promptlar, VO, müzik): Claude Docs belgesi "Ahmet E-Ticarete Başlamak İstiyor — Bölüm 1 · Prodüksiyon Planı".
- Kullanıcı API'li fotogerçekçi üretim yerine **kodla stilize** versiyonu seçti.
- 1080x1920, 24 fps, 60 sn, 20 çekim (`src/Film.tsx` CEKIMLER). Karakter `src/ahmet.tsx`, mekân/çekim bileşenleri `src/sahneler.tsx`.
- Seslendirme: Piper TTS `tr_TR-dfki-medium` (HF rhasspy/piper-voices), satır satır `calisma/vo/`; iç ses pitch +7%, kuru.
- Müzik + SFX tamamen sentez: `calisma/ses.py` -> `calisma/ana_ses_ham.wav` -> loudnorm -> `girdiler/ana_ses.wav`. 0:19'da müzik durur, 0:32 umutlu tema.
- Çıktı: `ciktilar/Ahmet_Bolum1_Stilize.mp4`.

## v2 (referans: referanslar/ref_kas.mp4 — "Kaslar neden büyür?" açıklayıcı video)
- Referanstan alınanlar: soruyla kanca, merak köprüleri ("Ama…", "Peki sonra ne oldu?"), sonda izleyiciye dönen soru;
  üstte 2 satır başlık (beyaz + renkli), altta cümle altyazısı (anahtar kelimeler turuncu), seslendirmenin ~15-20 dB altında kesintisiz müzik zemini, köprülerde vurgu sesi.
- Metin, başlıklar ve vurgular `src/plan.json` (ses.py ve Film.tsx aynı dosyayı okur).
- Yüzün önündeki mavi hare: karakterin üstüne çizilen ekran/telefon ışığı elipsleri kaldırıldı, yüz ışık geçişi yumuşatıldı.

## v3 — Bölüm 2 bağlantısı (61 sn)
- Final: "Her şey yolunda gibiydi." → "Ta ki birkaç gün sonra, telefonuna o mesaj gelene kadar." (masadaki telefon titrer, bildirim yazısı bulanık)
  → "O mesajda ne yazıyordu?" → final kartı "BÖLÜM 2 · ÇOK YAKINDA" + @sifirdansatisa TAKİP ET → TAKİPTESİN, VO "Cevabı, ikinci bölümde."
- Mesaj içeriği bilinçli olarak gizli (kolay para / sipariş imasından kaçınıldı). Bölüm 2 bu mesajla açılmalı.
- 52.8 sn'de umutlu tema çekilir, 53–58.3 gerilim (hızlanan nabız + disonans), 58.3 vurgu.

## v4 — ElevenLabs seslendirme + dramatik müzik (62,6 sn)
- Ses: ElevenLabs `eleven_v3`, language_code=tr. Ücretsiz plan: kütüphane (Türk) sesleri API'de kullanılamıyor, hazır sesler kullanıldı:
  anlatıcı **Brian**, iç ses **Liam** ([whispers]/[sighs]). Duygu etiketleri: [dramatic], [serious]. Çıkış formatı mp3_44100_128 (192 ücretli).
- Her satır Whisper ile birebir doğrulandı; uymayan satırlar otomatik yeniden üretildi (calisma/vo_el/).
- Anahtar ortamda kayıtlı (api.elevenlabs.io, xi-api-key, proxy enjekte eder) — kodda `xi-api-key: proxy-injected` yeter.
- Müzik: `calisma/muzik_dramatik.py` (ses.py içine gömülü) — 100 BPM re minör fragman tarzı: braam, boom, tom, ostinato, riser,
  0:19 düşüş + kalp atışı, 0:29,6 büyük vuruş, 0:42 patlama + majör sabah teması, 52,75–59,7 hızlanan tik cliffhanger. Seslendirme altında ducking.
- Final kaydı: 6C telefon 55,3–59,7, Bölüm 2 kartı 59,7–62,5.
