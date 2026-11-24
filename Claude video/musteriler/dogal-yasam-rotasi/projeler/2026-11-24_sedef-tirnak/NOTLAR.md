# Sedef — tırnak işareti (24.11.2026)
- Kanca: basliklar/2026-11-24_sedef.md #1 (30/30). Senaryo: senaryo/SENARYO.md, satırlar senaryo/satirlar.json (16 satır, ~44 sn).
- Ses: araclar/coklu_ses.py → ses/ (anlatıcı + Elif).
- Format 1080x1920, 30 fps, örnek video çizim/altyazı stili.
- 24.11: Berkay: diyalog değil, TEK ANLATICI ve doğrudan izleyiciyle konuşma havası. Elif satırı anlatıcıya çevrildi (s03), s04 'Oysa…', s13 çıkarıldı. VO ~50 sn.
- v1 render (24.11): ciktilar/sedef-tirnak-v1.mp4 — 1080x1920, 50.7 sn, -14 LUFS. Kod: src/ (cizim.tsx = yeniden kullanılabilir çizimler: El, Tirnak[normal/cukur/yag/kalkma/kalin],
  Buyutec, ElIkon, Dirsek, Doktor, Telefon, KagitUcak, ArkaPlan). Altyazı Fredoka 600 beyaz hap/mor; üst başlık mor hap. Müzik araclar/arka_muzik.py 78 bpm, volume 0.13.
  Render: npx remotion render <P>/src/index.ts Video <P>/ciktilar/x.mp4 --public-dir <P>/girdiler (~2 dk).
- v2: doktor sahnesi çıkarıldı (Berkay) → el + büyüteç + randevu takvimi (s15).
- v3: Berkay 'konuşmacı çok yavaş' → ses_hizli/: rubberband tempo ×1.15 (s02 ×1.08, s14 ×1.12 — ×1.15'te telaffuz denetimi 'iğne', 'sedef' şüpheli dedi), satır arası 0.12 sn; 43.2 sn, 2.36 kelime/sn; telaffuz.py denetle 15/15 TAMAM; loudnorm -14 LUFS.
- v4: altyazı/başlık fontu Fredoka → Baloo 2 (Fredoka'da Ğ ğ İ Ş ş yok, fallback fonttan geliyordu).
- v5: 'çok yankı' → yankı ölçümü (WPE'nin çıkardığı geç yansıma enerjisi): Berkay ref -50.7, müşteri ref -36.5, ham çıktı -29.6, NETLIK -23.6, rubberband -21.7 dB. Çözüm: ref WPE (taps 20, 2 tur) ile kurutuldu (-44 dB), sesler.json anlatici netlik=yok + kurut=true, tüm satırlar yeniden üretildi, hızlandırma rubberband crisp/short/independent. Sonuç -27.3 dB (~5.6 dB daha kuru), orijinal sese benzerlik 0.90, telaffuz 15/15, 43.4 sn, 2.35 kelime/sn, -14 LUFS. Eski sesler ses_v1_yankili/ (git dışı).
- Berkay: 'yankıyı kısmadan önceki ses iyi, v2'yi kullanacağım'. Ses ses_v1_yankili → ses/ geri alındı, ref yankılı hale döndü, sesler.json netlik/kurut kaldırıldı. Teslim: ciktilar/sedef-tirnak-v2-turkcefont.mp4 (v2 sesi + Baloo 2). Kuru deneme ses_v5_kuru/, hızlı ses_hizli/ (git dışı).
- Kapak: src/Kapak.tsx (Still 'Kapak') → ciktilar/kapak.png; yazılar 1:1 ızgara kırpımı (y 420–1500) içinde. Açıklama: ciktilar/aciklama.txt.
