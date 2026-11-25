# satisin-arkasi-karakter  (2026-11-25)

Yeni Instagram hesabı (çalışma adı "Satışın/Siparişin Arkası"): e-ticaretin perde arkası, değer veren içerik, satış yok;
uzun vadede Sıfırdan Satışa'ya trafik. Videolar KODLA (Remotion) üretilir; ana karakter = Berkay'ın animasyonu (rehber, hikâye kahramanı değil).

## Karakter v1→v2 (2026-11-25)
- v2: şakak açıklığı + ortada saç inişi, konik kollar + parmaklı eller (yumruk/işaret/açık), kısa boyun, daha kalın-kısa bacaklar (taban y=1130).

- Referans: referanslar/berkay_ref.png (girdiler/'e de kopyalı).
- src/berkay.tsx: BerkayBas (ifade: kas, kasAci, goz, gozGul, bakX/Y, agiz vizem, egim, yanak) + BerkayTam (poz: dur/goster/selam/dusun).
  Flat stil, hafif chibi oran. Kısa koyu saç, kalın kaşlar, kahverengi göz, kısa dolgun sakal + bıyık, lacivert yarım fermuarlı yakalı kazak + beyaz tişört.
- Vizemler: X, A, E, I, O, U, M, F (+ gulumse, kocaGulumse, sasir, duz) → ses klonu fonem zamanlarıyla dudak senkronu.
- SVG id'leri useId ile tekil (aynı karede birden çok karakter).
- Kart: `npx remotion still src/index.ts Kart ciktilar/kart_v1.png --public-dir <abs>/girdiler`
