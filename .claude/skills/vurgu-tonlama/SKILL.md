---
name: vurgu-tonlama
description: Türkçe seslendirmede vurgu ve tonlamayı ölçer ve düzeltir (hece vurgusu, cümle sonu düşüşü, soru tonu, tekdüzelik, hız) — Berkay'ın gerçek okumasından öğrenilmiş profile göre. Vurgu, tonlama, "yanlış yerden vurguluyor", "robot gibi", "tekdüze", "soru gibi okumuyor" geçen işlerde ve her ses klonu üretiminde kullan.
---

# Vurgu ve tonlama — ölç, karşılaştır, düzelt

Araç: `Claude video/araclar/vurgu.py` (hizalama `araclar/telaffuz.py` üzerinden; perde librosa.pyin).
Ses klonu aracı (`araclar/berkay_ses.py`) bunu otomatik kullanır: metni doğru okuyan adaylar arasında vurgusu Berkay'a en yakın olanı seçer.

## Neyi, nasıl ölçer
- **Hece vurgusu:** her hecede perde (yarım ton), şiddet (dB), süre → kelimedeki en belirgin hece.
  Karşılaştırma **ders kitabı kuralıyla değil, Berkay'ın kendi okumasıyla** yapılır:
  - Berkay'ın okuduğu kelimeler → onun vurguladığı hece (`araclar/vurgu_kalibrasyon.json` → `kelime_vurgu`),
  - okumadığı kelimeler → hece sayısına göre vurgu konumu dağılımı (`konum_dagilim`); çok nadir konum (<%15) işaretlenir.
  - Neden: "son hece vurgulu" kuralı Berkay'ın doğal okumasıyla yalnızca %46 uyuşuyor (akıcı Türkçede kelime vurgusu zayıf,
    ilk hece ve cümle melodisi baskın). Klonun tipik hatası tam tersi: vurguyu sona kaydırmak — "sonRA, kaDAR, aMA, önCE, ceVAP".
- **Cümle tonlaması:** düz cümle sonunda perde düşmeli; "mı/mi" sorusunda zirve ekten önceki hecede; "ne/nasıl/nereden"
  sorularında soru kelimesi öne çıkmalı.
- **Tekdüzelik ve hız** (yalnızca ≥ 8 heceli satırlar): perde çeşitliliği < Berkay'ın %60'ı → tekdüze; hız Berkay'ın
  %65–135'i dışında → çok yavaş/hızlı.
- Güvenilirlik: Berkay'ın kendi kaydında 22 satırda yalnızca 2 kelime vurgusu işareti çıkar (aynı kelimeyi farklı yerlerde farklı
  vurgulamış); klonda ilk üretimde 27 çıkmıştı. Yani işaretler gerçek sapma, ama tek tek kesin değil → dinleme listesine koy.

## Komutlar
```
cd "Claude video/projeler/<proje>"
export HF_HUB_OFFLINE=1 TRANSFORMERS_VERBOSITY=error
python3 ../../araclar/vurgu.py denetle senaryo/satirlar.json calisma/vo_klon     # satır satır rapor
python3 ../../araclar/vurgu.py kalibre gercek_satirlar.json gercek_klasor/       # Berkay'ın yeni gerçek kaydıyla profili güncelle
```
Kalibrasyonu Berkay her yeni gerçek kayıt verdiğinde genişlet (daha çok kelime → daha iyi `kelime_vurgu`).

## Düzeltme yolları (sırasıyla)
1. **Yeniden üret ve seç:** sorunlu satırın `sureler.json` girdisini ve `<k>_ham.wav` dosyasını sil, `berkay_ses.py`'yi çalıştır
   (farklı tohum: `TOHUM=…`). Araç vurgu puanı ≥ 0.85 olan adayı arar, yoksa en iyisini seçer.
2. **Cümle yapısı:** kelime cümle sonuna/başına alınınca vurgusu değişir; virgül ekle ("Ama, …") ya da cümleyi böl.
3. **Duygu ayarı:** `ex` değerini düşür (0.4 – sakin, daha az abartılı vurgu) ya da yükselt (0.7 – daha belirgin melodi).
4. **Soru tonu:** soru kelimesini başa al ("Nereden bulacaktı ürünü?" yerine "Ürünü nereden bulacaktı?") ve soru işaretiyle bitir.
5. Hâlâ olmuyorsa: o satırı Berkay'ın telefon kaydıyla değiştir (bkz. `/turkce-seslendirme` 5. bölüm).

## Rapor
Kullanıcıya her üretimde: ortalama vurgu puanı, kalan sorunlar (kelime + saniye), "bunları dinler misin" listesi.
Ölçüm kulağın yerini tutmaz; kullanıcının "şurası yanlış" geri bildirimi her zaman önceliklidir.
