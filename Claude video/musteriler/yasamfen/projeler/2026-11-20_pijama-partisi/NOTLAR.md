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
| 1 | Etkinlik genel video | Genel | ham bekleniyor |
| 2 | Bilgi yarışması #1 | Yarisma1 | ham bekleniyor |
| 3 | Bilgi yarışması #2 | Yarisma2 | ham bekleniyor |
| 4 | Vampir köylü #1 | Vampir1 | ham bekleniyor |
| 5 | Vampir köylü #2 | Vampir2 | ham bekleniyor |

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
