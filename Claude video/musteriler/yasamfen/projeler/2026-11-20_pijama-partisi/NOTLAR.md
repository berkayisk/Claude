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
