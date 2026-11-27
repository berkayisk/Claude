# Tanışma reels (2026-11-27)

Instagram profil analizi (ig-profile) sonrası "tanışma" sabitlenmiş gönderisi için.

## Girdi
- `girdiler/ham_a.mov` (90,6 sn) + `ham_b.mov` (84,3 sn): bir firmanın Berkay ile yaptığı röportaj, 1920x1080, tek sabit çekim.
- Solda firma logosu, soru yazıları ve alt bant; Berkay sağ yarıda. B'nin son ~5 sn'si tam ekran logo kapanışı (kullanılmadı).

## Kurallar (kullanıcı)
- Firma adının geçtiği cümleler kullanılmaz; kadraj Berkay'a odaklı; orijinal yazılar ve logo görünmez.
- Dikey kesit: `crop=608:1080:1136:0,scale=1080:1920` (logo/yazılar x<900'de kalıyor). Göğüsteki DJI mikrofon görünüyor (küçük).

## Kurgu v2 (kronolojik; calisma/plan.py → src/reels.json, bilesenler/Reels şablonu)
Kullanıcı: v1 akışı beğenilmedi, kronolojik olsun; "babasının parası / güzel arabalar" kısmı hiç kullanılmayacak; abartmadan b-roll.
1. Tanışma: Merhabalar / Atılım Hukuk 4. sınıf (a 0–4,6)
2. Öğrencilik: "Stabil olarak öğrencilik hayatıma devam ediyordum" (a 21,42; öncesindeki firma adı kesildi) → özel üniversite zorlukları (a 24,2) → "kendi ayaklarınızın üzerinde durmak" (b 0,0)
3. Geçmiş: geleneksel modelle önceki girişim (b 6,6) → yeni nesil stoksuz/şirketsiz (b 14,5) → "hiç düşünmeden adım attım" (b 24,2) → "harçlık düşüncesiyle girdim bu işe" (a 40,5)
4. İlk üç ay hazırlık (a 52,97) → aktif: müşterilerle iletişim, fikir alışverişi (a 60,5–71,3) → "çok başka yerlere gidebileceğini gördüm" (a 36,0) → bugün: tedarikçilik/partnerlik/mağaza sahibi (a 43,6–48,0) + Takip Et
- B-roll (Mixkit, ticari serbest, `girdiler/broll/`): 4503 kampüs (öğrencilik), 4705 depo stok sayımı (geleneksel model), 42123 telefonda alışveriş sayfası (yeni nesil), 4915 telefonda mesajlaşma (müşterilerle iletişim). Çerçeve top 420, 16:9. 42133 reddedildi (ekranda Amazon yazısı).
- Grafikler: başlık "HUKUK ÖĞRENCİSİ / e-ticarete nasıl başladı?", stat "4. sınıf öğrencisi", ✓ Stoksuz ✓ Şirketsiz, stat "3 ay hazırlık", ✓ Tedarikçi ✓ Partner ✓ Mağaza sahibi, Takip Et.
- Altyazı düzeltmeleri: "Berk Ayşık"→"Berkay Işık", "gelişimim"→"girişimim", "işte"→"işe", "açlık"→"harçlık" (Berkay: doğrusu "harçlık"; Whisper "açlık" duyuyor).
- Kesme sınırları ses seviyesiyle denetlendi: "Öğrenciyim" 2,13, "Stabil" 21,42, "Bu bir yıl" 52,97 (52,93'te önceki "-di" giriyordu), "Bu üç ay" 60,49, "getirdik" sonu 71,30, "sahibiyiz" sonu 47,99 (hemen ardından "Burada" başlıyor).
- Müzik yok (orijinalde de yok; duraklamalar -50 dB).

## Çıktı
- `ciktilar/Tanisma_Reels_v2.mp4`: 1080x1920, 61,7 sn, -14,2 LUFS, -1,4 dBTP. Whisper ile yeniden dinlendi: firma adı ve "araba/babası" geçmiyor.
- v1 (48,8 sn, kancalı akış) silindi; plan geçmişi git'te.

## Açık
- Videoda "4. sınıf öğrencisiyim" diyor; profil biyografisinde "mezunuyum". Eski kayıt olduğu belirtilmeli mi / başlık değişmeli mi?
- "attım → Bu bir yıl" geçişi sıkı; kulakla kontrol.
