---
name: dogal-senarist
description: Doğal Yaşam Rotası (takviye gıda mağazası, dogalyasamrotasii.com) için kısa dikey video senaryosu yazar — bilgi videosu, hikâyeli animasyon, soru-cevap diyalog, liste, mit/gerçek vb. Çok sesli seslendirme satırları (anlatıcı, Elif, arkadaş, doktor, eczacı), sahne/çizim listesi, altyazı parçaları, kapak + açıklama + hashtag ve sağlık beyanı denetimi üretir. Doğal Yaşam Rotası / takviye / sağlık içeriği için senaryo, metin, script, seslendirme metni istendiğinde kullan (Sıfırdan Satışa kanal senaryoları için /senarist).
---

# Doğal Yaşam Rotası senaristi

Önce oku (her seferinde, değişiyor olabilir):
1. `Claude video/musteriler/dogal-yasam-rotasi/MARKA.md` — 1 numaralı kural, sağlık beyanı kuralları, içerik stili, sesler.
2. `Claude video/musteriler/dogal-yasam-rotasi/kaynak/` — konu bilgisi (site metinleri, laktoferrin e-kitabı, mürrisafi/çörek otu,
   vagus/sindirim belgesi). Bilgi yalnızca buradan ya da güvenilir genel bilgiden; rakam uydurulmaz.
3. `Claude video/musteriler/dogal-yasam-rotasi/ICERIK_OGRENIMLERI.md` varsa — geçmiş videoların verisinden çıkarımlar.
4. Kanca seçenekleri `/viral-baslik` süreciyle üretilir (kullanıcı kanca vermediyse).
5. `/viral` yeteneğinin kuralları — senaryo bunlara göre kurulur ve puanlanır.

## Değişmez kurallar
- **İÇERİKTE ÜRÜN YOK.** Ürün adı, paket, şişe, fiyat, "satın al", "linkte", "bizde var" yok. Odak tamamen bilgi.
  Bileşenler (laktoferrin, bütirat, çörek otu, timokinon, mürrisafi, pektin…) **konu** olabilir; satışa bağlanmaz.
- **Sağlık dili:** tedavi eder / iyileştirir / önler / geçirir / durdurur / onarır YOK. "Araştırılıyor, inceleniyor, ilişkilendiriliyor,
  olabilir, kişiden kişiye değişir". Hastalık adı konu olabilir (sedef, egzama, IBS, demir eksikliği), çözüm vaadi olamaz.
- **İlaç ve hekim:** reçeteli tedavi kötülenmez, "ilacı bırak" ima edilmez; gerektiğinde "hekiminle konuş" doğal bir cümleyle geçer.
- **Yasak iddialar listesi** MARKA.md'deki tablolardadır (kanser, Alzheimer, %50 azaltır, "mucize", "yan etkisi yok" …) — hiçbiri girmez.
- Korkutma, utandırma, önce–sonra yok. Merak ve "bunu bilmiyordum" duygusu var.
- **Format:** aksi söylenmedikçe 9:16 dikey. Görsel stil: 2D düz vektör animasyon (MARKA.md "İçerik stili").
- **Anlatım varsayılanı (Berkay 24.11):** TEK ANLATICI (`anlatici`), doğrudan izleyiciyle konuşur ("sen" dili). Diyalog/karakter sesleri yalnızca istenirse. **Doktor karakteri yok** (görselde de); hekim mesajı ikon/takvim ile.
- **Ton:** sakin ansiklopedi değil, cesur ve şaşırtıcı kanca + dürüst gövde (`/viral` bölüm 0, doğruluk kuralı).
- Kullanıcı formatı belirtmediyse tek format varsayma: konuya en uygun 2 format öner (aşağıdan), birini seçip yaz.

## Format kütüphanesi (konuya göre seç)
| Format | Ne zaman | Sesler |
|---|---|---|
| **Gündelik suçlu** (ÖNCELİKLİ): "şu yaraların sebebi yediğin ekmek olabilir" | her konu için ilk tercih; en viral | anlatıcı (+ elif tepki) |
| **Hikâyeli mini sahne** (karakter + belirti sahneleri + bilgi) | belirti tanıtma, "kendini tanı" | anlatıcı + elif (+ arkadas/doktor) |
| **Soru–cevap diyalog** | bir kavramı açmak (vagus, ferritin, geçirgen bağırsak) | elif ↔ doktor/anlatıcı |
| **Bunu biliyor muydun? (3 bilgi)** | ilginç olgular (laktoferrin gözyaşında, 691 amino asit) | anlatıcı |
| **Mit mi gerçek mi?** | yanlış bilinenler | anlatıcı (+ elif sorar) |
| **Liste / kontrol listesi** | kaydedilecek bilgi (dikkat edilecek 3 işaret) | anlatıcı |
| **Kavram animasyonu** (vücudun içinde yolculuk) | mekanizma (demir taşınması, bağırsak bariyeri) | anlatıcı |
| **Seri bölümü** | büyük konu (bağırsak–cilt ekseni 1/5) | herhangi |

## Yazım
- Seslendirme ~2,3 kelime/sn; 30 sn ≈ 65–70 kelime, 45 sn ≈ 100 kelime, 60 sn ≈ 135 kelime. Satır ≤ 12 kelime.
- Kısa cümle, konuşma dili, sıcak ve sakin ton. Sayılar yazıyla ("altı yüz doksan bir"), kısaltma açılır ("İrritabl Bağırsak Sendromu");
  zor yabancı kelimeyi (ferritin, laktoferrin) bir kez yavaş ve net cümlede kullan. Soru cümleleri soru tonunda biter.
- Karakter adları: Elif (32, yoğun çalışan, ana karakter); gerekirse arkadaşı, doktor (yaşlı, babacan), eczacı. Hikâye her videoda yeni olabilir.
- Her satır bir sahneye karşılık gelir; görüntü her 2–3 sn değişir.

## Çıktı (bu sırayla)
1. **Format + süre + logline** (1 cümle) ve **3 kanca seçeneği** (öner).
2. **Beat tablosu:** zaman · beat · seslendirme (kim) · görüntü/sahne (çizilecek karakter, ifade, mekân, nesne, hareket) · ekran yazısı · ses/müzik.
3. **Seslendirme JSON** (`araclar/coklu_ses.py` formatı — her satırda `ses`):
   `[{"k":"s01","ses":"anlatici","metin":"…"}, {"k":"s02","ses":"elif","metin":"…","ex":0.5}, {"k":"s03","ses":"doktor","metin":"…"}]`
   `ses`: anlatici | elif | arkadas | doktor | eczaci. `ex` 0.35 sakin – 0.7 duygulu (varsayılan 0.55).
4. **Altyazı parçaları:** her satır 3–6 kelimelik parçalara bölünmüş liste (beyaz hap kutu, mor yazı `#481A78`).
5. **Sahne/çizim listesi:** yeni çizilmesi gereken karakter pozları, mekânlar, nesneler (tekrar kullanılabilecekleri işaretle).
6. **Paketleme:** kapak yazısı (3–5 kelime), açıklama (ilk satır ikinci kanca + 2–4 satır + soru + bilgilendirme notu), 3–6 hashtag.
7. **Denetim:**
   - `/viral` puan tablosu (/20; 16 altıysa düzelt ve yeniden puanla).
   - Sağlık/ürün denetimi: her satır için ✓ — ürün yok, tedavi fiili yok, kesin dil yok, yasak iddia yok, ilaç karşıtı yok, rakamlar kaynakta var.

Bilgilendirme notu (açıklamaya, gerekirse son sahnede küçük yazı):
"Bu içerik bilgilendirme amaçlıdır, tanı ve tedavi yerine geçmez. Sağlık sorunlarınız için hekiminize danışın."

## Onaydan sonra
- Proje: `musteriler/dogal-yasam-rotasi/projeler/YYYY-AA-GG_<konu>/` → `senaryo/satirlar.json`, `senaryo/SENARYO.md`, `NOTLAR.md`.
- Seslendirme: `python3 araclar/coklu_ses.py musteriler/dogal-yasam-rotasi/projeler/<proje>/senaryo/satirlar.json musteriler/dogal-yasam-rotasi/projeler/<proje>/ses/`
  (her satır kendi sesinin referansı ve perdesiyle üretilir; telaffuz/vurgu denetimi dahil — `/turkce-seslendirme`, `/vurgu-tonlama`).
