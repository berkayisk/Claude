# Yaşamfen — Pijama Partisi etkinlik çekimi (2026-11-20)

Tek çekim günü, tüm videolar aynı `girdiler/` klasörünü paylaşır; her video ayrı Composition (src/Root.tsx).
Marka: `musteriler/yasamfen/MARKA.md` (logo YOK, kırmızı #C00C0C / antrasit #2A2A2A, Montserrat + Inter).

## Çekilen içerik türleri
- Bilgi yarışması
- Vampir köylü (oyun)
- Genel etkinlik görüntüleri (pijama partisi)
- Kombin çekimleri
- Hocaların etkinlikle ilgili görüşleri

## İstenen videolar
| # | Video | Composition | Durum |
|---|-------|-------------|-------|
| 1 | Etkinlik genel video | Genel | taslak gönderildi (41 sn, müziksiz) |
| 2 | Bilgi yarışması #1 | Yarisma1 | 2. taslak gönderildi (82 sn, geri bildirim 1–3) |
| 3 | Bilgi yarışması #2 | Yarisma2 | taslak gönderildi (66 sn) |
| 4 | Vampir köylü #1 | Vampir1 | taslak gönderildi (47 sn) |
| 5 | Vampir köylü #2 | Vampir2 | taslak gönderildi (34 sn) |
| 6 | Pijama kombinleri (ekstra) | Kombin | taslak gönderildi (24 sn, sessiz) |
| 7 | Hocalar ne dedi (ekstra) | Hocalar | taslak gönderildi (54 sn) |

## Ekstra öneriler (hamlar izlendikten sonra netleşecek)
- Kombin çekimleri → "pijama kombinleri" geçit/trend videosu
- Hoca görüşleri → kısa "hocalar ne dedi" röportaj kesiti (veya genel videoya serpiştirme)

## Kurgu kuralları (kullanıcı, 2026-11-20)
- Çekimler TAMAMEN HAM: atılacak çok kısım var. Tekrarlanan denemeler/cümleler (en iyi/son temiz olan kalır),
  boşluklar, nefesler, kamera ayarlama, çekim dışı konuşmalar dikkatle kesilir (kök CLAUDE.md sıkı kesme kuralları).
- Geçişler: gerektiğinde YUMUŞAK ve SADE (kısa crossfade / dip-to-white-black / hafif blur-zoom). Gösterişli
  wipe, glitch, spin vb. YOK. Konuşma içi kesmeler düz kesme (jump cut) kalır; geçiş sadece sahne/bölüm değişiminde.
- B-roll: çekimde B-roll olarak kullanılabilecek çok görüntü var → önce tüm hamlar sınıflandırılıp
  `calisma/broll_katalog` (dosya, zaman aralığı, içerik, kalite) çıkarılacak; konuşma üstü ve geçişlerde kullanılacak.
- Zoom: gerektiğinde zoom-in / zoom-out kullan. Vurgu anında (punchline, cevap açıklanması, tepki) hızlı ama
  yumuşak (easing) punch-in ~%110–120; jump cut'ları gizlemek için kesme başına dönüşümlü hafif ölçek farkı;
  B-roll'da yavaş Ken Burns. Her cümlede değil, anlamlı anlarda. 4K kaynak → zoomda kalite kaybı yok.

## Oyun grafikleri (kullanıcı, 2026-11-21)
- Bilgi yarışması: sayaç, soru kartı, doğru cevap kartı (+ gerekirse yanlış/süre bitti)
- Vampir köylü: rol kartları (vampir, doktor, köylü, …), gece/gündüz bandı, elendi damgası
- Bileşenler: `musteriler/yasamfen/bilesenler/OyunGrafikleri.tsx` (marka renkleri; doğru=yeşil anlamsal istisna)

## Ham çekim kataloğu (105 dosya Drive'dan, 104 video 4K HEVC dikey 30fps, toplam 35.8 dk; 1 HEIC foto)
Ayrıntı: `calisma/katalog.json` (süre, ses, tür), kare şeritleri `calisma/seritler/`, transkript `calisma/transkript/`
- 7351 poster B-roll (kitap karakteri çizimi)
- 7353 tahtaya "Yaşamfen Geleneksel Bilgi Yarışması" yazılıyor → yarışma açılışı
- 7354–7370 BİLGİ YARIŞMASI (gündüz, logo duvarı önünde 2 takım masası, 2 sunucu: kırmızı-beyaz kıyafetli ve siyah kıyafetli) 18.7 dk
- 7380–7392 KOMBİN: pijama geçidi/dans (tekli, ikili, üçlü; örümcek adam maskeli, köpekbalığı kapşonlu) 0.8 dk
- 7393–7467 VAMPİR KÖYLÜ (akşam, çember oturma, mor kapşonlu moderatör + siyah üst/ekose pijamalı moderatör) 12.7 dk
- 7449 ayıcıklar B-roll
- 7470–7485 HOCA GÖRÜŞLERİ (logo duvarı önünde, mikrofonla, 5 kişi) 3.1 dk

## İçerik bulguları (transkriptten)
- Yarışma: LGS öğrencileri (ortaokul 8) → yüz blur. Takım: "İsimsiz Savaşçılar" kazandı. Branşlar: fen, inkılap, Türkçe, İngilizce, matematik.
  Fen soruları (7356–7357): safra→karaciğer (önce "pankreas" yanlış), dünya en çok bizde çıkan madde (bor), mitoz, eksen eğikliği
  (transkript "23°11'" — doğrusu 23°27', sesten kontrol et), ekinoks 21 Mart/23 Eylül, sitoplazma, atardamar, protein sindirimi (mide).
  İnkılap: ilk görev yeri Şam 5. Ordu, Trablusgarp, Muş-Bitlis, 19 Mayıs. Matematik (7366–7368): dönen ada, çarpan sayısı 3 (25, 49),
  √320+√1280=24√5, EKOK(650,750); berabere → son soru: "Elektrikli tren güneye gidiyor, rüzgar kuzeyden… duman?" → kazanan.
  7370: sunucu sonuç özeti. 7353: tahtaya başlık yazımı. 7355: hoca 12'lerle veda konuşması.
- Vampir köylü: 4 vampir, 1 doktor, 1 soytarı/deli, köylüler. Moderatör "kapat gözünü / vampiri seçiyoruz / günaydın". Ses çok gürültülü,
  kısa klipler; whisper "İzlediğiniz için teşekkür ederim" / "Altyazı M.K." = halüsinasyon (sessizlik). Savunma anları: 7424, 7441.
- Hoca görüşleri: 7470 (kamp haftası, şarj), 7471 (ara tatil sonu parti), 7474 (5 günlük kamp), 7476 (rehber öğretmen: +100 soru),
  7485 (özet + teşekkür; başında tekrar/hazırlık var, 37.4 sn'den itibaren temiz).

## Vampir köylü rolleri (kullanıcı, pafta numaralarıyla — calisma/yuz/kisiler.json)
- #37 DOKTOR (gözlüklü, sakallı bey — röportajda da var, 7485)
- #8, #40, #50 VAMPİR (#8 kırmızı kazaklı hanım, #40 genç erkek, #50 kıvırcık saçlı kız)
- Diğer vampir(ler) ve soytarı/deli bilinmiyor (oyunda 4 vampir seçildi) — sorulacak
- Blur listesi kullanıcıdan ayrıca gelecek (açık kalanlar değil, blurlanacaklar yazılacak)
- Soytarı kim bilinmiyor → soytarı rol kartı kişiye bağlanmaz (sadece rol tanıtımında). 4. vampir boşver.
- Blur tarzı: YUMUŞAK BLUR (gaussian, kenarı yumuşak oval). Ekstra videolar ONAYLANDI: kombin geçidi + hocalar ne dedi.

## Blur (kullanıcı listesi, 2026-11-21) → calisma/yuz/blur.json
Blurlanacak pafta numaraları: 1, 3, 4, 9, 10, 11, 12, 13, 14, 16, 17, 19, 20, 21, 23, 24, 25, 27, 28, 29, 30, 31, 59, 62.
Diğer tanınan herkes açık. Tanınmayan yüz izi: yarışma/kombin kliplerinde (<=7392) her zaman blur; diğerlerinde en yakın kişiye göre.
Yumuşak oval gaussian blur, vekil üretiminde gömülü (calisma/vekil.py). Render sonrası kare kontrolü yapılacak.
- Müzik (kullanıcı): trend müziğe uygun videolarda (Kombin, Genel) müzik YOK — Instagram'da trend ses eklenecek. Kombin tamamen sessiz
  (efekt de yok). Yarışma, Vampir, Hocalar: kodla üretilmiş telifsiz müzik gömülü.

## Geri bildirim 1 (Yarışma #1 taslağı, 2026-11-21)
- Hoca blurlanmış → uzakta küçük görünen sunucu yüzü tanınamayıp blurlanıyordu. Çözüm: tanınmayan iz, ±1 sn içinde
  yakınındaki tanınmış izin kararını alır (komşu kimlik, vekil.py). Bitmiş klipler kayıtlı izlerden yeniden kodlandı.
- Video doğrudan soruyla / konuşmayla başlasın (sessiz B-roll girişi yok), kanca başlık yine başta, ilk sözün üstünde.
- Geçişler doğal: blur-zoom "yumusak" geçişler kaldırıldı → düz kesme. Sadece Vampir #1'de gece/sabah bandıyla siyah/beyaz dip kaldı.
- Konuşmalı parçalar sesin girdiği yerde başlar (kelime başı − 0.035 sn).

## Geri bildirim 2 (2026-11-21)
- Hiçbir "merhaba(lar)" kısmı kullanılmaz (7471 0–6 sn, 7476 0–6 sn çıkarıldı). Genel artık 7470 "Çok güzel bir kamp haftasını..." ile başlar.
- Geçişler: gerektiğinde YUMUŞAK efekt → gerçek 10 karelik crossfade (Kurgu.tsx XF), sadece soru/bölüm/konuşmacı değişiminde.
- Soru ve cevaplar net: cevap parçalarında ses ×1.5, cevap anında altyazı da görünür (kart + altyazı). Belirsiz cevap sesi (eksen) → sadece kart.
- Anlamsız B-roll yok: takım düşünürken araya giren görüntüler/sayaç kaldırıldı. Konuyla eşleşen kaplama B-roll'lar (hoca "bilgi yarışması"
  derken yarışma görüntüsü) kaldı. Kapanış çağrıları son konuşmanın üstüne bindi.
- Her takımın sorusu-cevabı sırayla (çekimdeki dönüşümlü sıra): Yarışma #1 = 8 soru (bor ve eksen eğikliği geri alındı; kartlarda doğru
  bilgi: Bor, 23° 27').

## Geri bildirim 3: kazanan takım (2026-11-21)
- LGS yarışmasında kazanan değişti: 7368/7369'da önce "İsimsiz Savaşçılar" ilan ediliyor, 7370'te puanlar yeniden sayılıyor
  ("Matematikte tek bir doğru vardı, o da bu grubun yaptığı soruydu") → KAZANAN logo duvarı önündeki takım; 7370 @28–33 sn alkışlı kutlama.
- Tüm videolarda kazanma kısmı = 7370 kutlaması ("🏆 KAZANAN TAKIM"). İsimsiz Savaşçılar kutlaması (7357 @218, 7368 @201, 7369) KULLANILMAZ.
- Yarışma #2 kancası "Son soruyu bilen kazanır" → "Kazanan kim oldu?" (artık doğru değil).
- Takım adları (kullanıcı): logo duvarı önündeki, ortada erkek öğrencinin oturduğu takım = POWERPUFF GIRLS (KAZANAN);
  duvar resmi önündeki takım = İSİMSİZ SAVAŞÇILAR. Soru kartlarında cevaplayan takımın adı yazar.
  Matematik: çarpan (İS, yanlış), kök (PPG, doğru — turun tek doğrusu), EKOK (İS, yanlış).
- Kombin geri bildirimi: kombin çekimlerinde (7380–7392) BLUR YOK — rastgele desen tespitleri, örümcek adam maskesi, arka odadaki hocalar,
  kıyafetteki ayıcık gereksiz blurlanmıştı. blur.json "blursuz_klipler" ile vekil blursuz üretildi (Genel/Hocalar'daki kombin anları da).
- Akşam blur hatası (Hocalar/Vampir #2 ilk render, gönderilmedi): loş ışık ve yakın çekimde hocalar (#8 kırmızı kazak vb.) yarışma
  öğrencilerine (#28, #59…) benzetilip blurlanıyordu. Kural: >7392 kliplerde yalnızca O KLİPTE kümelenmiş blur-listesi kişileri
  blurlanır (akşam gerçekten görünenler: 3, 4, 10, 11, 23, 24, 29, 59, 62), diğer herkes açık. Akşam klipleri yeniden kodlandı.

## Geri bildirim 4: cümleler yarım kalmasın (2026-11-21)
- Kesimler cümle sınırına yaslanır (kurgu_yap.py cumle_sinir): başlangıç cümle başına (en çok 3 sn geri), bitiş cümle sonuna (en çok 3 sn,
  elle yazılı kliplerde 1.5 sn ileri); ses kuyruğu sönene kadar (en çok 0.45 sn) ama bir sonraki kelimeye taşmadan.
- Sessizlik kesiminde kenar payları: baş 0.06, son 0.15–0.18 sn (eski 0.035 kelime kuyruklarını kırpıyordu).
- calisma/cumle_kontrol.py: her plan bloğunun başı/sonu yarım cümle / kırpık kelime kontrolü. Kalan uyarılar yalnızca tekrarlı tezahürat
  ("kapat, kapat…", "doktoru seçiyoruz…") — tam bir öbekten sonra kesiliyor.

## Geri bildirim 5 (2026-11-22)
- Hocalar 0:41: 7474'teki duraksamalı "Evet 5 günlük kamp…" kısmı çıkarıldı; "çocuklarla çok güzel vakit geçirdik…" ile başlıyor.
- Blur: kırmızı kazaklı hocanın (#8) önündeki küçük kızın blur kutusu yanlış tespitlerle dev lekeye dönüşüp hocanın yüzünü/bedenini
  kaplıyordu → vekil.py: izin medyanının 1.7 katından / 360 px'ten büyük kutular ve tek seferlik dev komşu-izler atılır; yakın (büyük)
  yüzde blur payı daraltıldı. Etkilenen akşam klipleri yeniden kodlandı.
- Vampir #1 YENİ AKIŞ: oyun anlatımı → 4 vampir (#40, #50, #8, 4.'sü bilinmiyor → "?" kartı) + doktor (#37) → tartışmalar →
  son oylama → "KÖYLÜLER KAZANDI" (kullanıcı). Soytarı bilinmiyor (sadece anlatımda kart). Eski: plan_vampir1_eski.py
- Vampir #2 kalıyor (ifşa formatı), sadece blur ve kesim düzeltmesi.
- Genel: DİNAMİK + MÜZİKLİ (parti, 124 bpm): vuruşa oturan 2–4 vuruşluk planlar + 4 kısa ses anı (~28 sn). Eski: plan_genel_eski.py
  (Önceki "trend müzik için müziksiz" kararı Genel için geçersiz; Kombin müziksiz kalıyor.)
