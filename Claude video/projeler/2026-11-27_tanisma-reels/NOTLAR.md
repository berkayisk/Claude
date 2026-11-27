# Tanışma reels (2026-11-27)

Instagram profil analizi (ig-profile) sonrası "tanışma" sabitlenmiş gönderisi için.

## Girdi
- `girdiler/ham_a.mov` (90,6 sn) + `ham_b.mov` (84,3 sn): bir firmanın Berkay ile yaptığı röportaj, 1920x1080, tek sabit çekim.
- Solda firma logosu, soru yazıları ve alt bant; Berkay sağ yarıda. B'nin son ~5 sn'si tam ekran logo kapanışı (kullanılmadı).

## Kurallar (kullanıcı)
- Firma adının geçtiği cümleler kullanılmaz; kadraj Berkay'a odaklı; orijinal yazılar ve logo görünmez.
- Dikey kesit: `crop=608:1080:1136:0,scale=1080:1920` (logo/yazılar x<900'de kalıyor). Göğüsteki DJI mikrofon görünüyor (küçük).

## Kurgu (calisma/plan.py → src/reels.json, bilesenler/Reels şablonu)
- Kanca: "Özel okullarda babasının parasıyla…" (a 85,8) + "Ve siz de orada… kendi ayaklarınızın üzerinde durmak istiyorsunuz." (b 0,0)
- Tanışma: Merhabalar/Atılım Hukuk 4. sınıf (a 0–4,6) → özel üniversite zorlukları (a 24,2) → "açlık düşüncesiyle girdim" (a 40,5)
- Geçmiş: önceki geleneksel e-ticaret girişimi (b 6,6) → yeni nesil stoksuz/şirketsiz model (b 14,5) → "hiç düşünmeden adım attım" (b 24,2)
- Hazırlık: ilk üç ay hazırlık (a 52,97) → kapanış: "çok başka yerlere gidebileceğini gördüm" (a 36,0) + Takip Et kartı
- Grafikler: başlık "HUKUK ÖĞRENCİSİ / e-ticarete nasıl başladı?", stat "4. sınıf öğrencisi", liste ✕ Geleneksel model / ✓ Stoksuz ✓ Şirketsiz, stat "3 ay hazırlık", Takip Et.
- Altyazı düzeltmeleri: "Berk Ayşık"→"Berkay Işık", "gelişimim"→"girişimim", "işte"→"işe". "açlık" doğru (parça tek başına dinletilince %86; birleşik versiyonda Whisper "harçlık" sanıyor).
- Kesme sınırları ses seviyesiyle denetlendi; "Öğrenciyim" (2,13) ve "Bu bir yıl" (52,97) başlangıçları düzeltildi (52,93'te önceki cümlenin "-di"si giriyordu).
- Müzik yok (orijinalde de yok; duraklamalar -50 dB).

## Çıktı
- `ciktilar/Tanisma_Reels_v1.mp4`: 1080x1920, 48,8 sn, -14,1 LUFS, -1,5 dBTP. Whisper ile yeniden dinlendi: firma adı yok.

## Açık
- Videoda "4. sınıf öğrencisiyim" diyor; profil biyografisinde "mezunuyum". Eski kayıt olduğu belirtilmeli mi / başlık değişmeli mi?
- "attım → Bu bir yıl" geçişi sıkı; kulakla kontrol.
