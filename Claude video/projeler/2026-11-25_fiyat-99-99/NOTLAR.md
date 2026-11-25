# fiyat-99-99  (2026-11-25)

Yeni Instagram hesabının ilk deneme videosu: "Fiyatlar neden hep 99,99?" (40 sn, 1080x1920, 30 fps). Karakter = Berkay v4 (src/berkay.tsx, karakter projesinden kopya).

## Akış
1. senaryo/satirlar.json → `HF_HUB_OFFLINE=1 python3 araclar/berkay_ses.py ... calisma/vo` (ses klonu; berkay_ses artık rakamları yazıya çevirerek doğrular: Whisper "99.99" yazıyor)
2. `HF_HUB_OFFLINE=1 python3 calisma/yap.py hepsi` → src/plan.json (zamanlar, takipTik), src/vizem.json (araclar/dudak.py: wav2vec2 harf zamanları → ağız şekli), girdiler/ses.wav (VO + müzik + earshot SFX, -14 LUFS)
3. `npx remotion render src/index.ts Film ciktilar/fiyat_99_99_v1.mp4 --public-dir <abs>/girdiler`

## Bilgi doğrulaması
- Anderson & Simester (2003), "Effects of $9 Price Endings on Retail Sales: Evidence from Field Experiments", Quantitative Marketing and Economics 1:93–110:
  kadın giyim kataloğunda üç saha deneyi; 9'la biten fiyat üçünde de talebi artırdı. Belirli fiyatlar (34/39/44 $) iki ikincil kaynakta çelişkili → senaryoda rakam KULLANILMADI.
- Sol rakam etkisi (left-digit effect): fiyat soldan okunur, ilk rakam algıyı belirler (Thomas & Morwitz 2005).

## Kaynaklar / lisans
- Müzik: "New Bass 02" — Lily J, Mixkit Stock Music Free License (dosya repoda değil: audio/muzik/ gitignore).
- Efektler: earshot make (kodla üretilmiş, telifsiz). Yazı tipi: Poppins (OFL).

## v3 (hızlı)
- Kullanıcı: "daha hızlı anlatmalı" → VO atempo 1,18 (calisma/vo_hizli), satır arası boşluk ~0,1–0,22 sn; 40 → 32,6 sn. Sahne/SFX gecikmeleri 1/1,18 ölçeklendi.

## v4 (sahneler)
- Kullanıcı: "çok hareketsiz, sahneler değişmeli" → Film.tsx 14 çekime bölündü (CEKIMLER): market rafı, dönen madeni para, neon beyin, dev etiket üstünde kamera kaydırma, yeşil/kırmızı bölüm, terazi, aşırı yakın plan + soru işaretleri, araştırma masası, katalog sayfaları, skor tablosu + konfeti, alışveriş sepeti + sarsıntı, tipografi, telefon profil ekranı.
- Kadraj değişir: yakın plan (BerkayBas), tam boy (BerkayTam), sağ/sol/ayna. Kamera her çekimde yavaş itme; geçişler: kes/kay/kayTers/zoom/flaş. Altyazı konumu çekime göre (yüzü kapatmaz).
- SFX: her geçişte whoosh/pop. Önceki film: calisma/Film_v3.tsx.bak

## v5 (kamera)
- Kullanıcı: zoom-in/zoom-out, yana kayıp orada anlatma, geri gelme → her çekime sanal kamera anahtar kareleri (Cekim.kam: [sn, odak x, odak y, zoom]); inOut kübik geçiş, kenar taşmaz (odak sınırlanır), hafif el kamerası nefesi.
- Altyazı konumu kameraya göre değişebilir (alt: sayı ya da çekim içi zamana göre fonksiyon) → yüze zoomlanınca altyazı alta/üste kaçar. Önceki: calisma/Film_v4.tsx.bak
