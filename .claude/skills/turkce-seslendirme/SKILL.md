---
name: turkce-seslendirme
description: Berkay'ın ses klonuyla doğru Türkçe telaffuzlu seslendirme üretir ve denetler (metin hazırlama, telaffuz sözlüğü, kelime düzeyinde telaffuz puanı, hatalı satırı yeniden üretme, kulak geri bildirimi döngüsü). Seslendirme, VO, ses klonu, "yanlış okuyor", telaffuz, "Türkçe okunmuyor" geçen her işte kullan.
---

# Türkçe seslendirme — doğru telaffuz hattı

Ses: Berkay'ın onaylı klonu (`Claude video/araclar/berkay_ses.py`, Chatterbox Multilingual). Model Türkçeyi okuyabiliyor ama
bazı kelimelerde ünlüleri kaydırıyor, yumuşak g'yi ve vurguyu bozabiliyor. **Whisper'ın "doğru okundu" demesi yeterli değil**
(aksanı anlayıp düzeltiyor). Bu yüzden her satır üç katmanda denetlenir.

## 1. Metni seslendirmeye hazırla (satirlar.json yazmadan önce)
- Sayılar, tarihler, saatler yazıyla: "6 Aralık" → "altı Aralık", "14.00" → "saat on dört". Kısaltma yok (TL → "lira").
- Kısa cümleler (≤ 12 kelime). Virgül = nefes/duraklama; üç nokta tek kullan; ünlem yerine nokta (model bağırıyor).
- Yabancı kelimeler: altyazıda asıl yazım, seslendirmede Türkçe okunuşu (sözlüğe ekle): ör. "dropshipping" → "dropşiping".
- Özel isim ekleri kesme işaretiyle: "Ahmet'in". Tireli kelimeler tireli: "e-ticaret".
- Bir kelime sürekli bozuluyorsa cümle içindeki yerini değiştir (cümle sonuna almak vurguyu düzeltebilir) ya da cümleyi böl.

## 2. Üret (otomatik denetimle)
```
cd "Claude video/projeler/<proje>"
HF_HUB_OFFLINE=1 TRANSFORMERS_VERBOSITY=error python3 ../../araclar/berkay_ses.py senaryo/satirlar.json calisma/vo_klon
```
Her satır için ≤ 8 deneme; bir deneme ancak şunları geçerse kabul edilir:
- **Whisper** metni birebir okur (kırpılmış hali, bağlam içinde),
- **Telaffuz puanı (GOP)**: `araclar/telaffuz.py` — Türkçe harf düzeyinde CTC modeli (dil modeli YOK, duyduğunu yazar).
  Beklenen metin sese hizalanır, her kelimeye puan verilir. Eşik Berkay'ın gerçek okumasından kalibre edilir
  (`araclar/telaffuz_kalibrasyon.json`; hatalı ≈ -0.67, şüpheli `SUPHE = -0.40`). Eşik altı kelime → yeniden üret.
- süre metne göre makul (fazladan üretilen ses son kelimeden sonraki sessizlikte kesilir).
Seslendirmeye giden metne `araclar/telaffuz_sozluk.json` uygulanır (altyazıda asıl yazım kalır).

- **Vurgu/tonlama** (`/vurgu-tonlama`, `araclar/vurgu.py`): doğru okuyan adaylar arasında vurgusu Berkay'ın okumasına en yakın olan seçilir.

## 3. Rapor ver
Üretim sonunda kullanıcıya: kaç satır ilk denemede geçti, hangi kelimeler şüpheli kaldı (GOP değerleriyle), en düşük puanlı
3–5 kelimenin zaman kodu → "bunları bir dinler misin" listesi. Asla "hepsi doğru" deme; vurgu/tonlama ölçümü (`/vurgu-tonlama`) yaklaşık bir göstergedir, kulak kontrolü gerekir.
Denetim: `python3 ../../araclar/telaffuz.py denetle senaryo/satirlar.json calisma/vo_klon`

## 3b. Hız / perde değişikliğinden sonra MUTLAKA yeniden denetle
Tempo ya da perde değiştirildiyse (ör. "konuşmacı yavaş" → rubberband tempo ×1.15) değişmiş dosyalar `telaffuz.py denetle` ile baştan denetlenir:
hızlandırma bazı kelimeleri bozabilir (Doğal Yaşam Rotası'nda ×1.15'te "iğne" -0.88, "sedef" -1.04 oldu). Şüpheli satırda tempo adım adım düşürülür
(1.12 → 1.10 → 1.08), geçen en hızlısı alınır; ardından tüm satırlar birleştirilip Whisper ile bağlam içinde okunur.

## 4. Kulak geri bildirimi → kalıcı düzeltme
Berkay "X kelimesi yanlış okunuyor" dediğinde:
1. `python3 ../../araclar/telaffuz_dene.py "X" "X'in geçtiği cümle." [ek yazım adayları]` — farklı yazımları dener, en iyi GOP'u sözlüğe yazar.
2. O kelimenin geçtiği satırları sil (`sureler.json` girdisi + `<k>_ham.wav`) ve `berkay_ses.py`'yi yeniden çalıştır.
3. Sözlük kalıcıdır: aynı hata sonraki bölümlerde tekrar etmez. Ne değiştiğini kullanıcıya söyle.
Vurgu/tonlama hatası (heceler doğru ama vurgu yanlış): sözlük çözmez → cümle yapısını değiştir veya `ex` (0.35–0.7) ile yeniden üret.

## 5. Kesin doğruluk gerektiğinde: konuşmadan sese
Telaffuz %100 doğal olmalıysa (reklam, önemli duyuru): Berkay metni telefonla hızlıca okur → tekrarlar/yanlış okumalar
adacık çözümlemesiyle ayıklanır (bkz. `projeler/2026-11-23_ahmet-bolum-1/calisma/kayit_kes.py`) → temizlenir.
Bu yol telaffuz ve tonlamayı garanti eder; klon yalnızca kayıt mümkün değilse kullanılır.
