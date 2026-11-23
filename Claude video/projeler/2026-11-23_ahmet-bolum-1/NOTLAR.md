# Ahmet E-Ticarete Başlamak İstiyor — Bölüm 1 (stilize versiyon)

- Prodüksiyon planı (storyboard, promptlar, VO, müzik): Claude Docs belgesi "Ahmet E-Ticarete Başlamak İstiyor — Bölüm 1 · Prodüksiyon Planı".
- Kullanıcı API'li fotogerçekçi üretim yerine **kodla stilize** versiyonu seçti.
- 1080x1920, 24 fps, 60 sn, 20 çekim (`src/Film.tsx` CEKIMLER). Karakter `src/ahmet.tsx`, mekân/çekim bileşenleri `src/sahneler.tsx`.
- Seslendirme: Piper TTS `tr_TR-dfki-medium` (HF rhasspy/piper-voices), satır satır `calisma/vo/`; iç ses pitch +7%, kuru.
- Müzik + SFX tamamen sentez: `calisma/ses.py` -> `calisma/ana_ses_ham.wav` -> loudnorm -> `girdiler/ana_ses.wav`. 0:19'da müzik durur, 0:32 umutlu tema.
- Çıktı: `ciktilar/Ahmet_Bolum1_Stilize.mp4`.
