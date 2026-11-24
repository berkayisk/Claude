# Sedef — tırnak işareti (24.11.2026)
- Kanca: basliklar/2026-11-24_sedef.md #1 (30/30). Senaryo: senaryo/SENARYO.md, satırlar senaryo/satirlar.json (16 satır, ~44 sn).
- Ses: araclar/coklu_ses.py → ses/ (anlatıcı + Elif).
- Format 1080x1920, 30 fps, örnek video çizim/altyazı stili.
- 24.11: Berkay: diyalog değil, TEK ANLATICI ve doğrudan izleyiciyle konuşma havası. Elif satırı anlatıcıya çevrildi (s03), s04 'Oysa…', s13 çıkarıldı. VO ~50 sn.
- v1 render (24.11): ciktilar/sedef-tirnak-v1.mp4 — 1080x1920, 50.7 sn, -14 LUFS. Kod: src/ (cizim.tsx = yeniden kullanılabilir çizimler: El, Tirnak[normal/cukur/yag/kalkma/kalin],
  Buyutec, ElIkon, Dirsek, Doktor, Telefon, KagitUcak, ArkaPlan). Altyazı Fredoka 600 beyaz hap/mor; üst başlık mor hap. Müzik araclar/arka_muzik.py 78 bpm, volume 0.13.
  Render: npx remotion render <P>/src/index.ts Video <P>/ciktilar/x.mp4 --public-dir <P>/girdiler (~2 dk).
