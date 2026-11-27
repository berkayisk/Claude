# Tanışma reels: açıklama ve kapak

## Instagram açıklaması (ig-caption, Job A: kancayı video taşıyor)

```
Ben Berkay. Hukuk okurken e-ticarete başladım, şimdi sıfırdan başlayanlara yolu anlatıyorum. Devamı için takip et.

Atılım Hukuk'ta okuyordum. Özel bir üniversitede kendi ayaklarımın üzerinde durmak istedim ve bu işe bir harçlık düşüncesiyle girdim.

Daha önce geleneksel modelle bir e-ticaret denemem olmuştu. Sonra stoksuz e-ticaret modelini duydum. Şirket kurmak da gerekmiyordu. Hiç düşünmeden başladım.

İlk üç ay sadece hazırlandım. Sonra müşterilerle iletişimi artırdım, bu işi yapanlarla fikir alışverişi yaparak büyüttüm.

Bu sayfada e-ticarete nasıl başlanır, hangi model kime uyar, babalar gibi anlatıyorum.

#eticaret #stoksuzeticaret #sıfırdansatışa
```

- Görünen pencere: ilk satır 114/125 karakter, tek parça; tek çağrı: takip et (linter Türkçe "takip et"i tanımıyor, WARN bilerek geçildi)
- Arama ifadeleri: "e-ticarete nasıl başlanır" (5. paragraf), "stoksuz e-ticaret" (3. paragraf)
- 3 hashtag (ig-caption kuralı), link yok, emoji yok, marka adı yok, kişisel rakam yok
- ig-human detect: slop 100, parmak izi 100 (uzun tire/görünmez karakter yok); özgüllük düşük çünkü voice.md gereği rakam kullanılmıyor; "ses" ölçütü İngilizce kısaltma/zamir sayıyor

## Kapak
- `ciktilar/Tanisma_Kapak.png` (1080x1920), Remotion Still "Kapak" (`src/Kapak.tsx`)
- Kare: ham_a 71,4 sn (hafif gülümseme), dekupe: `araclar/dekupe.py` → `girdiler/kapak_kisi.png`; arka plan aynı karenin bulanık stüdyosu
- Metin: TANIŞALIM · HUKUK OKURKEN · E-TİCARETE (sarı) · NASIL BAŞLADIM? (kırmızı kutu); Anton, profil ızgarasındaki kapak diliyle aynı
- Izgara güvenli alanı (y 240-1680) içinde başlık ve yüz
