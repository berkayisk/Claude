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
