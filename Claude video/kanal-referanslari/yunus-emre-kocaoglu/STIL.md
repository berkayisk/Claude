# Kanal stili: "Sıfırdan Satışa" röportaj videosu

Kaynak: "Görme Engelli Bir Üniversite Öğrencisinin E-Ticaret Yolculuğu | Yunus Emre Kocaoğlu | İlk Ağızdan"
Dosyalar: `parca1.mov` (5:00, videonun başı), `parca2.mov` (6:51, orta kısım), `parca3_son.mov` (3:52, son)
Örnek kareler: `kareler/`

## Teknik
| | |
|---|---|
| Çözünürlük | 1280x720 (gelen dosyalar), 16:9. Yeni videolarda 1920x1080 kullan |
| FPS | 30 |
| Ses | AAC 44.1 kHz stereo, ortalama -18/-19 LUFS. Yeni videolarda -14 LUFS hedefle (YouTube standardı) |
| Tempo | Ortalama ~15-20 sn'de bir kesme. Sakin, konuşma odaklı röportaj kurgusu |

## Video akışı
1. **0:00-0:32 "Az Sonra" fragmanı:** Videodan seçilmiş çarpıcı cümleler.
   - Kamera vizörü çerçevesi: 4 köşede beyaz L çizgiler, sol üstte pil ikonu, sağ üstte yanıp sönen kırmızı nokta + "REC", sol altta "4K 60FPS", sağ altta "HD", ortada küçük odak köşeleri.
   - Alt ortada büyük **"AZ SONRA"** yazısı: "AZ" krem, "SONRA" turuncu, kalın condensed font, hafif gölge. Açılışta yazı aşağıdan kayarak gelir.
   - Fragman klipleri arasında **ışık sızıntısı (light leak) / flaş geçişi** var (beyaz-gökkuşağı patlaması, ~0.3 sn).
2. **~0:32-0:35 Kanal jeneriği:** Lacivert-mor arka plan, solda yuvarlak çerçevede sunucu fotoğrafı ve altında YouTube oynat ikonu. Sağda "Sıfırdan" (beyaz) / "Satışa" (pembe), italik kalın. Altında pembe çizgi ve "E-TİCARET | GİRİŞİMCİLİK". Çözülerek (crossfade) röportaja geçer.
3. **Röportaj:** 3 kamera açısı dönüşümlü kullanılıyor:
   - Geniş ikili plan (iki koltuk, siyah-altın çizgili duvar)
   - Konuk orta plan (çoğunlukla bu açı)
   - Sunucu orta plan (soru anlarında)
4. **~0:37 Konuk alt bandı (lower third):** Sol altta lacivert kutu, ince beyaz kenar, sol kenarda turuncu şerit, krem renkli tırnak (") ikonu ve turuncu dikey ayraç.
   - Satır 1: İsim (krem, extra bold): "Yunus Emre Kocaoğlu"
   - Satır 2: Unvan (krem, regular): "YTÜ'de Öğrenci"
   - Kısa turuncu çizgi + Satır 3 (turuncu, bold): "E-ticaret Mentörü"
   - Soldan kayarak girer, ~10 sn ekranda kalır.
5. **Kapanış (~son 30 sn):**
   - **"Abone Ol":** Üst ortada turuncu yuvarlatılmış buton (▶ ABONE OL, krem yazı). Üstünden sunucu fotoğrafı kayarak iner.
   - **Instagram etiketleri:** Her kişinin altında siyah daire içinde Instagram ikonu ve beyaz kalın kullanıcı adı (`girisimcieticaret`, `sifirdansatisa`).
   - **Bitiş ekranı (~15-20 sn):** Kanal jeneriğinin geniş hali. Arka planda karartılmış etkinlik fotoğraflarından kolaj, ortada yuvarlak fotoğraf, "SıfırdanSatışa" yazısı, pembe çizgi, "E-TİCARET | GİRİŞİMCİLİK". YouTube bitiş ekranı kartları için boş alan bırakılmış.

## Renk paleti (piksel ölçümü)
| Kullanım | Renk |
|---|---|
| Ana turuncu ("SONRA", alt bant şeridi, Abone Ol) | `#F67102` (buton tonu `#E3591C`) |
| Krem yazı | `#F4F1E2` |
| Alt bant lacivert | `#021A3B` |
| Jenerik arka plan lacivert-mor | `#020643` → mor `#5A1E8C` geçişli |
| Marka pembesi ("Satışa", çizgi) | `#E6245E` civarı |
| Beyaz | `#FFFFFF` |

## Tipografi (en yakın Google Fontları)
- "AZ SONRA": **Anton** veya **Bebas Neue** (kalın condensed)
- Alt bant / Abone Ol / Instagram: **Poppins** (ExtraBold isim, Regular unvan)
- "Sıfırdan Satışa": **Poppins Bold Italic**
- "E-TİCARET | GİRİŞİMCİLİK": **Montserrat SemiBold**, geniş harf aralığı

## Yeni videolarda tekrar kullanılacak bileşenler
- `AzSonraFragman`: vizör çerçevesi + REC + "AZ SONRA" + ışık geçişleri
- `KanalJenerigi`: "Sıfırdan Satışa" (kısa, 3 sn)
- `AltBant`: isim / unvan / rol
- `AboneOl`: buton + fotoğraf
- `InstagramEtiketi`
- `BitisEkrani`

> Orijinal jenerik, bitiş ekranı, İlk Ağızdan başlık kartı ve sunucu fotoğrafı: `marka/sifirdan-satisa/` (bkz. MARKA.md). Jenerik ve bitiş ekranını yeniden üretme, orijinal dosyaları kullan.
