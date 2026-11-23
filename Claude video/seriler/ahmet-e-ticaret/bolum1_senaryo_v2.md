# Bölüm 1 — Karar Gecesi (senaryo v2)

**Logline:** Gece yarısı e-ticarete başlamaya karar veren Ahmet, sorular arasında boğulup vazgeçmek üzereyken aklına hiç
gelmeyen bir soruyla karşılaşır — ve tam her şey yoluna girmişken telefonuna gelen bir mesaj hikâyeyi değiştirir.

**Kanca seçenekleri**
1. "Herkesin bir gece yarısı fikri vardır. Ahmet'inki, e-ticaretti." ← **önerilen** (evrensel, izleyici kendi fikrini düşünür, 3 sn)
2. "Saat gece yarısını geçmişti ve Ahmet aynı videoyu üçüncü kez izliyordu."
3. "Bu Ahmet. Ve birazdan, aylardır ertelediği kararı verecek."

**v1'e göre neler değişti:** liste gibi okunan cümleler bağlandı ("İlk arama masum görünüyordu. Sonra sekmeler çoğaldı.");
dip noktası daha gerçek ("Belki de bu iş bana göre değil."); köprü motive edildi ("Ama Ahmet, o gece uyuyamadı.");
çözüm iddia değil soru ("Ya … mümkünse?"); cliffhanger telefonun titreşimiyle aynı ana denk getirildi; çağrı kısaldı.

## Beat tablosu
| Zaman | Beat | Seslendirme | Görüntü | Müzik / ses |
|---|---|---|---|---|
| 0:00 | Kanca | Herkesin bir gece yarısı fikri vardır. | 1A koltukta Ahmet, telefon ışığı | braam, saat tiki |
| 0:03 | Kanca | Ahmet'inki, e-ticaretti. | 1B telefonda "E-ticarete nasıl başlanır?" videosu | ostinato başlar |
| 0:05,6 | Karar | O gece, sonunda başlamaya karar verdi. | 1C bakış laptopa, odak kayar | |
| 0:08,6 | Araştırma | İlk arama masum görünüyordu. | 2A laptop açılır | sorular bölümü, kick |
| 0:10,6 | | Sonra sekmeler çoğaldı. | 2B sekmeler değişir | |
| 0:12 | Soru yağmuru | Ne satacaktı? Ürünü nereden bulacaktı? | 2C defterde sorular | tom vurguları |
| 0:14,6 | | Şirket şart mıydı? Stokları nereye koyacaktı? | 2C/2D | |
| 0:17 | | Her cevap, iki yeni soru getiriyordu. | 2D kaşlar çatık | riser |
| 0:19 | Dip | (sessizlik) | 3A boş bakış | ani düşüş, kalp atışı |
| 0:21,3 | İç ses | Ben daha ne satacağımı bile bilmiyorum… | 3B eller yüzde | |
| 0:24 | İç ses | Belki de bu iş bana göre değil. | 3B yaslanır | |
| 0:26,2 | Gerilim | Çoğu insanın hikâyesi, tam burada biter. | 3C laptop kapanır, oda kararır | gerilim nabzı |
| 0:29,6 | Köprü 1 | Ama Ahmet, o gece uyuyamadı. | 4A telefonu alır | BÜYÜK VURUŞ |
| 0:32,6 | Keşif | Ve karşısına, aklına hiç gelmeyen bir soru çıktı. | 4B Sıfırdan Satışa içeriği | keşif yükselişi |
| 0:35,3 | | Ya ürün üretmeden, stok tutmadan da başlamak mümkünse? | 4C gözler | |
| 0:38,8 | Köprü 2 | Peki sonra ne oldu? | 4D laptop yeniden açılır → beyaz | vuruş + riser |
| 0:42,8 | Kavrayış | Sabah olduğunda, masasında bir liste vardı. | 5A sabah, güneş | patlama, majör tema |
| 0:45,4 | | Her şeyi bilmesi gerekmiyordu. | 5B yol haritası | |
| 0:47,4 | | Önce doğru modeli öğrenecek, sonra ilk adımı atacaktı. | 5C kurulum adımları | |
| 0:51 | | Aylar sonra ilk kez, içi rahattı. | 5D tebessüm | hafifler |
| 0:52,8 | Cliffhanger | Ta ki üç gün sonra, telefonu titreyene kadar. | 6A → 6C masadaki telefon | hızlanan tik |
| 0:55,6 | | (titreşim + bildirim) | telefon yanar, bildirim bulanık | bildirim sesi |
| 0:57,6 | | Mesajı okudu. Ve olduğu yerde kaldı. | 6C yakınlaşma | gerilim zirvesi |
| 0:59,7 | Final | O mesajda ne yazıyordu? Cevabı, ikinci bölümde. | Bölüm 2 kartı | vuruş, tek nota |
| 1:03 | Çağrı | Ahmet'in ne yapacağını kaçırmamak için takip et. | TAKİP ET → TAKİPTESİN | tık |

## Ekran başlıkları
```json
[
 {"bas":0.0,"son":8.0,"s1":"HERKESİN BİR","s2":"GECE YARISI FİKRİ","renk":"#F67102"},
 {"bas":8.6,"son":19.0,"s1":"SORULAR","s2":"ÇOĞALIYOR","renk":"#FF5A5A"},
 {"bas":26.2,"son":29.3,"s1":"ÇOĞU HİKÂYE","s2":"BURADA BİTER","renk":"#FF5A5A"},
 {"bas":29.6,"son":38.3,"s1":"AKLINA GELMEYEN","s2":"BİR SORU","renk":"#5AB4FF"},
 {"bas":38.5,"son":41.7,"s1":"PEKİ SONRA","s2":"NE OLDU?","renk":"#F67102","orta":true},
 {"bas":42.8,"son":50.9,"s1":"ÖNCE DOĞRU MODEL","s2":"SONRA İLK ADIM","renk":"#2ED47A"},
 {"bas":52.75,"son":55.3,"s1":"ÜÇ GÜN SONRA","s2":"O MESAJ","renk":"#FF5A5A"},
 {"bas":57.6,"son":59.65,"s1":"O MESAJDA","s2":"NE YAZIYORDU?","renk":"#F67102"}
]
```

## Altyazı vurguları
gece, fikri, e-ticaretti, karar, masum, sekmeler, satacaktı, bulacaktı, şart, stokları, iki, yeni, bilmiyorum, göre, değil,
hikâyesi, biter, uyuyamadı, soru, üretmeden, stok, tutmadan, mümkünse, sonra, liste, gerekmiyordu, doğru, modeli, ilk, adımı,
rahattı, üç, titreyene, mesajı, kaldı, mesajda, ikinci, takip

## Cliffhanger ve sonraki bölüm
"Ta ki üç gün sonra, telefonu titreyene kadar. Mesajı okudu. Ve olduğu yerde kaldı. O mesajda ne yazıyordu?"
→ Bölüm 2 bu mesajla açılır (içerik henüz kararlaştırılmadı, bkz. SERI.md "Açık sorular").

## Öz denetim
- ✓ İlk cümle ~2,5 sn, merak açıyor ("gece yarısı fikri").
- ✓ Açık soru/köprü aralıkları: 0:03 (fikir ne?), 0:12–0:19 (sorular), 0:26 (biter mi?), 0:29,6 (ama), 0:35 (ya…?), 0:38,8 (sonra?), 0:52,8 (ta ki), 0:57,6 (ne yazıyordu?).
- ✓ Hikâye geçmiş zaman; "vardır" genel doğru (aforizma), "mümkünse" Ahmet'in aklına gelen sorunun aynen aktarımı.
- ✓ Kolay para yok; çözüm kesin vaat değil soru, kavrayış "her şeyi bilmesi gerekmiyordu".
- ✓ 134 kelime ≈ 61 sn konuşma; klon hızıyla 66–67 sn'lik kurguya sığıyor.
- ✓ Tekrar eden kelime kontrolü: "soru" 3 kez bilinçli motif (soru yağmuru → aklına gelmeyen soru → cevap Bölüm 2'de).
- ✓ Cliffhanger cevapsız; çağrı aynı soruya bağlı.
- ✓ Süreklilik: oda, telefon, laptop, sabah listesi, Sıfırdan Satışa içeriği (4B) aynı; "birkaç gün" → "üç gün" (dizi kitabı güncellendi).
