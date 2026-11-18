# Sıfırdan Satışa: marka dosyaları

Kanal: **Sıfırdan Satışa** (E-ticaret | Girişimcilik). Sunucu: **Berkay Işık**
Röportaj serisinin adı: **"Berkay Işık ile İLK AĞIZDAN"**

| Dosya | Ne işe yarar | Teknik |
|---|---|---|
| `berkay-isik-profil.png` | Sunucunun yuvarlak kesilmiş profil fotoğrafı (şeffaf arka plan). Abone Ol animasyonu, jenerik, bitiş ekranı için | 1254x1254 PNG, alfa kanallı |
| `kanal-jenerigi-2sn.mp4` | Açılış jeneriği: "Sıfırdan / Satışa" yazısı + fotoğraf + YouTube butonu animasyonla gelir. "Az Sonra" fragmanından sonra kullanılır | 3840x2160, 30fps, 1.95 sn, sesli |
| `bitis-ekrani-9sn.mp4` | Bitiş ekranı: "SıfırdanSatışa" logosu ve etkinlik kolajı. YouTube bitiş kartları bu sürede eklenir | 3840x2160, 30fps, 9.5 sn, sesli |
| `ilk-agizdan-baslik-2sn.mov` | "İlk Ağızdan" başlık kartı (bu bölümün konuk + sunucu fotoğraflarıyla). Yeni bölümlerde aynı tasarımı yeni konukla Remotion'da yeniden üretmek gerekir | 1920x1080, 30fps, 2 sn, sessiz |

## Başlık kartı tasarımı ("İlk Ağızdan")
- Arka plan: koyu lacivert (`#0B1A33` civarı), köşelerde turuncu fırça darbeleri ve turuncu halftone (nokta) dokusu
- Sol: konuk dekupe (kesilmiş) fotoğrafı, krem + turuncu dış kontur
- Sağ: sunucu dekupe fotoğrafı, aynı kontur
- Orta üst: "Berkay Işık ile" (krem, serif bold italik), altında turuncu fırça çizgisi
- Orta: "İLK / AĞIZDAN" (krem, Anton benzeri condensed, hafif eğik, siyah gölge)
- Sol üstte ve sağ üstte büyük krem tırnak işaretleri (“ ”)

## Kullanım (Remotion)
Projeye kopyala: `cp ../../marka/sifirdan-satisa/* projeler/<proje>/girdiler/`
Sonra `<OffthreadVideo src={staticFile("kanal-jenerigi-2sn.mp4")} />` gibi kullan.
4K dosyalar 1080p kompozisyonda otomatik ölçeklenir.
