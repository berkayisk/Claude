---
name: es-kapak-aciklama
description: Etkileşim Sihirbazı (@etkilesimsihirbazi) Instagram Reels'i onaylandıktan sonra kapak (2 başlık varyantı) ve paylaşım açıklamasını (Instagram metni, sabit yorum, kısa TikTok/Shorts metni, hashtag) üretir. Kullanıcı bu hesabın bir Reels'ini onayladığında ("oldu", "onaylıyorum", "tamam bu", "beğendim", "paylaşalım") ya da "kapak", "açıklama", "caption", "kapak + açıklama" istediğinde kullan. Sıfırdan Satışa veya müşteri işleri için KULLANMA.
---

# Etkileşim Sihirbazı: Reels kapağı + açıklama

Kim: Berkay Işık + Onur Altunay (Onur kıvırcık saçlı, Berkay düz kısa saçlı). Konu: sosyal medya yönetimi, etkileşim, büyüme.
Önce oku: `Claude video/marka/etkilesim-sihirbazi/MARKA.md` (kapak dili, kurallar), projenin `NOTLAR.md` dosyası ve transkripti
(`calisma/kelimeler.json` ya da `src/*.json` içindeki `altyazi`). Referans uygulama: `Claude video/projeler/2026-11-25_es-reels-1`.

Ne zaman: video ONAYLANDIKTAN sonra. Onay yoksa önce sor ya da videoyu bitir. Videonun son hâlinde olmayan bir şeyi
(atılmış bir sahneyi, kaldırılmış bir şakayı) kapakta ya da açıklamada kullanma.

## 1. Kapak karesi
0. Kullanıcı kapak için kendi fotoğrafını verdiyse (tercih edilen yol) aday karelerle uğraşma: o fotoğrafı `calisma/kapak/` içine kopyala,
   doğrudan 3. adımla (dekupe) devam et. Yüz konumunu YuNet ile ölç (`cv2.FaceDetectorYN`, model `opencv/face_detection_yunet`).
   Örnek: es-reels-1'de kullanıcı fotoğrafı, 954 px kesim, yüz (460, 227) → `kisiGenislik 1500, kisiX -183, kisiY 660`.
1. Proje klasöründen: `bash /home/user/Claude/.claude/skills/es-kapak-aciklama/scripts/kare_adaylari.sh 3 IMG_xxxx IMG_yyyy ...`
   (yalnızca kurguda kullanılan klipler). 4K kaynaktan alınır, video proxy'sinden değil.
2. `calisma/kapak_adaylar.jpg` şeridine bak ve kareyi seç: gözler açık, ifade güçlü (şaşkın, iddialı, el hareketi),
   yüzü el ya da mikrofon kapatmıyor, konuya bağlı bir nesne varsa (top, telefon) o kare daha iyi. Kamera arkasıyla
   konuşulan an YASAK (hatalı çekim kuralı). Videoda iki kişi varsa ikisinin de göründüğü kare tercih edilir.
3. Dekupe: `HF_HUB_DISABLE_XET=1 python3 ../../araclar/dekupe.py calisma/kapak/aday_X.png girdiler/kapak_kisi.png`
   Sonra macenta zemin üstünde kontrol et (kenarda koltuk ya da başka kişi kalmasın).
4. Arka plan: kişinin OLMADIĞI temiz bir tuğla duvar parçası. Herhangi bir çekimden başın üstündeki bölgeyi kırp:
   `ffmpeg -ss T -i girdiler/IMG_xxxx.MOV -frames:v 1 -vf "crop=1600:850:280:0,scale=-1:1920,crop=1080:1920" girdiler/kapak_arka.png`
   Kırpma kutusunda kimsenin başı olmadığını gör. Aynı karenin bulanık hâlini KULLANMA: arkada hayalet kişi kalır.

## 2. Kapak tasarımı (bileşen: `Claude video/bilesenler/ESKapak.tsx`)
Projenin `src/Root.tsx` dosyasına iki `Still` ekle (`Kapak-A`, `Kapak-B`, 1080x1920):
```tsx
import { ESKapak } from "../../../bilesenler/ESKapak";
const kisi = { arka: staticFile("kapak_arka.png"), kisi: staticFile("kapak_kisi.png"), kisiGenislik: 1500, kisiX: -309, kisiY: 790 };
<Still id="Kapak-A" component={() => <ESKapak {...kisi} satir1="TAKİPÇİNE" satir2="BÖYLE SORMA!" alt="Yorumları 2 seçenekle patlat" />} width={1080} height={1920} />
<Still id="Kapak-B" component={() => <ESKapak {...kisi} satir1="YORUM ALAMIYORSAN" boy1={112} satir2="SEBEBİ BU" satir2Kirmizi />} width={1080} height={1920} />
```
- Kişi yerleşimi: yüz yaklaşık x 540, y 950-1050 olsun. Dekupedeki yüz konumundan hesapla:
  `kisiX = 540 - yuzX*olcek`, `kisiY = 1000 - yuzY*olcek`, `olcek = kisiGenislik / dekupe_genisligi`.
- Başlık ~y 250-800 arasında kalır, saçın üstüne binmez. Yüz ve başlık profil ızgarasının gösterdiği bölgede (y 240-1680) durur.
- Başlık dili (hesabın kapakları): 2 satır. Üst satır beyaz bağlam, alt satır sarı ve büyük vurucu cümle. İddialı, merak uyandıran,
  sokak dili. Örnekler: "SOSYAL MEDYACI DİYE GELDİK… FIRÇAYI VERDİLER!", "BU ÜRÜNÜ ALMAYIN!", "TAKİPÇİ SATIN ALDIYSAN HAPI YUTTUN".
  A varyantı: sarı satır + küçük alt başlık (beyaz, siyah şerit). B varyantı: `satir2Kirmizi` (kırmızı fırça üstünde beyaz).
  Satır 15 karakteri geçiyorsa `boy1` / `boy2` küçült; taşma ve kendiliğinden satır kırılmasına bak ("BÖYLE SORMA!" 210'da iki satıra kırılıp saça bindi, `boy2={150}` ile tek satır oldu).
- Render (`Claude video` kökünden):
  `for k in A B; do npx remotion still $P/src/index.ts Kapak-$k $P/ciktilar/kapak_$k.png --public-dir $P/girdiler --log=error; done`
- İkisini yan yana küçük bir görselde birleştirip kontrol et: yazı taşmıyor, yüze binmiyor, arkada hayalet kişi yok.

## 3. Açıklama (`ACIKLAMA.md`, proje kökü)
Ton: samimi, "sen" diye hitap, kısa cümleler, emoji ölçülü (satır başı işaretleri olarak). Reklam dili ve şişirme yok.
Uydurma rakam (takipçi, yüzde, sonuç) YAZMA. AI kalıplarından kaçın ("sadece X değil Y", üçlü sıralamalar, "hadi gelin").
İstersen `/humanizer` ile son okuma yap.
Yapı:
1. **Kanca satırı:** videonun ilk cümlesinin yazılı hâli ya da daha keskin bir versiyonu (ilk 125 karakter "devamını gör"den önce görünür).
2. **Sorun → taktik:** 2-4 kısa paragraf. Gerekirse ❌ / ✅ karşılaştırması.
3. **Yorum çağrısı:** videodaki taktiği izleyiciye uygulat (iki seçenekli soru, tek kelime cevap). Etkileşim hesabıyız: her açıklamada yorum çağrısı olur.
4. 📌 Kaydet çağrısı + 🪄 "Etkileşimin sihrini çözmek için takip et: @etkilesimsihirbazi".
5. Hashtag: 6-10 tane, Türkçe ağırlıklı. Sabitler: #etkileşim #sosyalmedya #sosyalmedyayönetimi #etkileşimsihirbazı + konuya özgü olanlar.
Ek bölümler: **İlk yorum (sabitle)**: yorum çağrısının tek satırlık hâli. **Kısa versiyon (TikTok / Shorts)**: 1-2 cümle + 3 hashtag.
Başlıkta kapak ve video dosyalarının yollarını yaz (bkz. es-reels-1 ACIKLAMA.md).

## 4. Teslim
- `SendUserFile` ile `ciktilar/kapak_A.png` ve `kapak_B.png` dosyalarını gönder. Açıklamayı sohbete de yapıştır (kopyalanabilsin).
- Hangi kapağı önerdiğini bir cümleyle söyle.
- Medya git'e girmez. `ACIKLAMA.md`, `Root.tsx` ve notları commit edip geliştirme dalına gönder.
- Kullanıcı bir kapak ya da açıklama tercihi belirtirse (renk, ton, hashtag) `MARKA.md` dosyasına yaz: sonraki videolarda uygulanır.
