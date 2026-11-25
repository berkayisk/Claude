# satisin-arkasi-karakter  (2026-11-25)

Yeni Instagram hesabı (çalışma adı "Satışın/Siparişin Arkası"): e-ticaretin perde arkası, değer veren içerik, satış yok;
uzun vadede Sıfırdan Satışa'ya trafik. Videolar KODLA (Remotion) üretilir; ana karakter = Berkay'ın animasyonu (rehber, hikâye kahramanı değil).

## Karakter v1→v2 (2026-11-25)
- v3 denendi (saç kafatasıyla birleşik + favoriler) → kullanıcı "daha kötü" dedi, v2 saçına geri dönüldü. v2 = onaylı karakter.
- v2: şakak açıklığı + ortada saç inişi, konik kollar + parmaklı eller (yumruk/işaret/açık), kısa boyun, daha kalın-kısa bacaklar (taban y=1130).

- Referans: referanslar/berkay_ref.png (girdiler/'e de kopyalı).
- src/berkay.tsx: BerkayBas (ifade: kas, kasAci, goz, gozGul, bakX/Y, agiz vizem, egim, yanak) + BerkayTam (poz: dur/goster/selam/dusun).
  Flat stil, hafif chibi oran. Kısa koyu saç, kalın kaşlar, kahverengi göz, kısa dolgun sakal + bıyık, lacivert yarım fermuarlı yakalı kazak + beyaz tişört.
- Vizemler: X, A, E, I, O, U, M, F (+ gulumse, kocaGulumse, sasir, duz) → ses klonu fonem zamanlarıyla dudak senkronu.
- SVG id'leri useId ile tekil (aynı karede birden çok karakter).
- Kart: `npx remotion still src/index.ts Kart ciktilar/kart_v1.png --public-dir <abs>/girdiler`

## Karakter v5 (2026-11-25) = v2 yüzü + alın düzeltmesi
- v4 (2. fotoğraf) beğenilmedi → v2 yüzüne dönüldü. Alındaki "birleştirme çizgisi": şakaklardaki yarı saydam saç geçiş çizgileri kaldırıldı; saç yoluna aynı renkte 8 px kontur (yüz kenarı taşmasın); favoriler opak ve saça kesintisiz bağlı.

## Karakter v4 (beğenilmedi) — 2. referans fotoğrafından yeniden çizildi (referanslar/berkay_ref2.jpg)
- Kullanıcı v2'yi beğenmedi ("içime sinmedi"), yüz bu fotodan alındı: yuvarlak dolgun yüz, belirgin kulaklar, çok kısa saç (şakaklar hafif açık),
  kalın düz kaşlar, dar gözler + göz altı, geniş yuvarlak burun, dolgun alt dudak, bıyık + seyrek kirli sakal (yarı saydam + düzensiz nokta dokusu).
- Kıyafet aynı (lacivert yarım fermuarlı kazak + beyaz tişört). v2 yedeği: kart_v2.png.
