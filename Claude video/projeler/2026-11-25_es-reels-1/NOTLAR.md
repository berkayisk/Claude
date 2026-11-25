# es-reels-1  (2026-11-25)

İş kolu: **Etkileşim Sihirbazı** (marka/etkilesim-sihirbazi/MARKA.md). Konu: yorum almak → "iki net seçenek" taktiği.
Kaynak: Drive klasörü "Etkileşim Sihirbazı - yorum" (public). İndirme: drive.usercontent.google.com/download?id=..&confirm=t
(docs.googleusercontent.com proxy'de kapalı, gdown çalışmaz). Çekimler 4K dikey (rotation -90), 30 fps. Kamera önünde Berkay.

## Transkript
- 6174: "Yorum alamıyor musun? Takipçine ne düşünüyorsun deyip topu kucağına bırakma." (2 deneme: 1.8–5.1 ve 9.3–12.5, ikincisi önden)
- 6175: "Önüne iki net seçenek koy" denemeleri + "Mesela" (yan açı, çoğu boş)
- 6176: "Önüne 2 net seçenek koy. Bir dahaki videoda topu tutayım mı, atayım mı?" → kameraya atma hareketi, el lensi kapatıyor, "Komple kapattım kamerayı."
- 6178: "Atmayacağım, atmayacağım, olum dur dur, sakin." (şaka)
- 6179: "Soru sorarsan cevap vermez ama önüne iki net seçenek koyarsan birini seçmek zorunda kalır."
- 6180: "Yorum alamıyorsan Etkileşim Sihirbazı'nı takip etmeyi unutma." (CTA)

## v1 kurgu (18.9 sn) — ciktilar/es_reels1.mp4 (-14 LUFS)
Sıra: kanca (6174 2. deneme) → "önüne 2 net seçenek koy, topu tutayım mı atayım mı?" (6176) → atış + "komple kapattım kamerayı" (6176, kesmesiz)
→ "atmayacağım, oğlum dur dur, sakin" (6178, gevşek kesme: şaka temposu) → neden (6179) → CTA (6180). 6175 kullanılmadı (aynı cümlenin yarım denemeleri).
- Şablon: `src/ES.tsx` (Etkileşim Sihirbazı stili: Anton, beyaz + sarı #FFE600, kırmızı fırça, siyah kontur). Plan: `calisma/plan.py` → `src/es.json`.
- Kamera: yüz takipli (araclar/yuz_izle.py, HF_HUB_DISABLE_XET=1 gerekli), her ≤1.8 sn yakınlık değişimi (DESEN), birim geçişlerinde whip (bulanık savrulma + flaş + whip sesi).
- Olaylar: kanca başlığı, boş gönderi + 🦗 + "BÖYLE SORMA", A/B tuşları, TUT/AT bölünmüş B-roll (Mixkit 43495/43494), IG anket, "KAMERA GİTTİ" glitch,
  yorum yağmuru + sayaç, 😅, SORU ✕ vs A/B ✓, telefonda yorum B-roll (Mixkit 4915), takip et kartı.
- Ses: Demucs + temizlik zinciri; müzik araclar/arka_muzik.py 100 bpm, 0.09; SFX marka/sfx + earshot (circir, sihir, whip, glitch, top).

## v2 (13.9 sn) — ciktilar/es_reels1_v2.mp4 (-14 LUFS). Kullanıcı geri bildirimi:
- "Yüzüm ekrandayken önüne başlık vs gelmemeli" → plan.py her kart için olay süresince ekrandaki yüz kutusunu (saç dahil, 0.85h üst / 0.75h alt)
  hesaplar, kartı yüzün altındaki (yoksa üstündeki) boş banda koyar ve gerekirse küçültür (o.y, o.olcek). Yakınlık yüz boyuna göre sınırlı
  (yüz kutusu ≤600 px), saç üstü rozetin altında (≥190). Yüze binen emoji/başlık YOK. B-roll çıkışı 2 kare (yazı yüz üstünde sönmesin).
- "Kamera arkasıyla konuştuğum yerler hatalı çekim" → atış + "Komple kapattım kamerayı" ve 6178'in tamamı atıldı (anket, kamera gitti, yorum yağmuru, 😅 da gitti).
- TUT/AT: AT gelene kadar alt yarı koyu "?" paneli (yüz yarım görünmesin).
- v3: üstteki rozet kaldırıldı; takip kartında gerçek profil fotoğrafı (girdiler/profil.png = marka/etkilesim-sihirbazi/profil.png).
