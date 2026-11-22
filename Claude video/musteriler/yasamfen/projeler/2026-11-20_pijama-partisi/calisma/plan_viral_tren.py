# Viral 1a — Şaşırtmaca: elektrikli tren (LGS, blurlu). Kanca: "%90'I YANLIŞ CEVAPLIYOR 🤯"
SIKI = True
PLAN = [
    klip(7368, 179.1, 186.4, zoom=[1.0, 1.08], odak=[0.5, 0.5]),
    broll(7368, 190.0, 195.2, zoom=[1.1, 1.18], odak=[0.5, 0.5]),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.0, ust="ŞAŞIRTMACA SORU", metin="%90'I YANLIŞ\nCEVAPLIYOR 🤯", vurguSatir=True, y=1120, boyut=96),
    olay("soru", zaman=2.0, sure=5.4, no="ŞAŞIRTMACA", soru="Elektrikli bir tren güneye gidiyor, rüzgâr kuzeyden esiyor. Trenin dumanı hangi yöne gider?", y=230),
    olay("karart", kaynak=(7368, 190.0), sure=3.0, seviye=0.5),
    olay("etiket", kaynak=(7368, 190.05), sure=2.9, metin="⏸️ DURDUR VE DÜŞÜN", y=900, boyut=60, ses="bildirim"),
    olay("sayac", kaynak=(7368, 190.0), sure=3.0, saniye=3, y=1300),
    olay("cevap", kaynak=(7368, 193.0), sure=2.2, cevap="Elektrikli trenin dumanı olmaz! 😄", baslik="CEVAP", y=1200),
    olay("cagri", kaynak=(7368, 193.6), sure=1.6, metin="Sen bilebildin mi? 🤔", altMetin="Yorumlara yaz 👇", alt=420),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "soru", "cagri"]
MUZIK = {"src": "muzik/gizem.wav", "seviye": 0.24, "konusmaSeviye": 0.07}
