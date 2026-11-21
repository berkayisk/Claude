# Müşteriler (firma sosyal medya / reklam işleri)

Sıfırdan Satışa kanal işlerinden TAMAMEN ayrı. Kanalın stili (turuncu, İlk Ağızdan, "babalar gibi" tonu, Berkay Işık marka dosyaları)
burada KULLANILMAZ. Her firmanın kendi marka rehberi geçerlidir.

## Yapı
```
musteriler/<firma-adi>/
  MARKA.md          firma marka rehberi: renkler, fontlar, logo, ton, yasaklar, hedef kitle, iletişim bilgileri
  marka/            logo, ürün görselleri, fontlar, müzik/jingle
  projeler/YYYY-AA-GG_<is-adi>/   girdiler / referanslar / ciktilar / src / NOTLAR.md (kanal projeleriyle aynı düzen)
```

## Yeni firma
`cp -r musteriler/_sablon musteriler/<firma-adi>` ve `MARKA.md`'yi doldur.

## Ortak araçlar (firmadan bağımsız, kullanılabilir)
- Ses temizliği (Demucs), sıkı kesme kuralları, yüz takibi/kadraj, dekupe: `araclar/`, kurallar kök `CLAUDE.md`
- Bileşenler `bilesenler/` (Reels, Short, Thumbnail…): renk/font/logo firma `MARKA.md`'sine göre PROP olarak verilir; kanalın turuncusu varsayılan olarak kalmamalı
- SFX `marka/sfx/` telifsiz, ortak kullanılabilir

## Kurgu tercihleri (kullanıcı geri bildirimi, tüm firma işleri)
- Video doğrudan içerikle (soru / ilk söz) başlar; sessiz B-roll ile açılmaz. Kanca başlık ilk sözün üstüne biner.
- Geçişler doğal: düz kesme; blur-zoom gibi efekt geçişlerden kaçın (tematik bir an dışında).
- Konuşmalı parça sesin girdiği yerde başlar.
- Çocuk yüzü blurunda öğretmen/sunucu açık kalmalı: uzakta küçük görünen yüzler komşu iz kimliğiyle doğrulanır.
