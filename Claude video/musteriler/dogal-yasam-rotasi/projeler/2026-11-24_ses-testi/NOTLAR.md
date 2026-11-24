# Ses testi (24.11.2026)
Amaç: örnek videodaki (referanslar/demir-vsl-v3-genel.mov) 5 sesin klonunu denemek. Berkay: sesler firmaya ait / izinli.
- Ayırma: Demucs htdemucs_ft vocals; konuşmacılar Chatterbox VoiceEncoder benzerliğiyle gruplandı (anlatıcı ≠ Elif, 0.70 benzerlik).
- Referanslar: marka/sesler/. Üretim: ./uret.sh (her ses kendi SES_REF + SES_F0'ı ile araclar/berkay_ses.py).
- Çıktılar: ciktilar/<ses>/<k>.wav (git dışı değil; wav küçük).

## Sonuç
Hepsi Whisper'da birebir okundu (a1'de Whisper "Lactoferrin" yazdı → 0.9, okuma doğru). Klon ↔ kendi referansı benzerliği (VoiceEncoder):
anlatıcı 0.93/0.90, elif 0.88, arkadaş 0.84, doktor 0.85, eczacı 0.85; her klon en çok kendi referansına benziyor.
Eczacı klonu perdeyi düşük üretti (110 Hz, hedef 140; perde düzeltmesi ±%10 ile sınırlı → 120 Hz civarı kalabilir).
Dinleme dosyası: ciktilar/ses_testi_karsilastirma.mp3 (orijinal 3.5 sn → klon).
