# Hocalar Ne Dedi? — YENİ (geri bildirim 7): 40–45 sn, dinamik, nefes/ııı yok (SIKI), başı-sonu belli, bol B-roll kaplama, müzik.
# Akış: AÇILIŞ (kamp + pijama partisi) → yoğun çalışma → bilgi yarışması sevinci → enerji/motivasyon → KAPANIŞ (teşekkür + slogan)
SIKI = True
K = lambda t, no, bas, sure: {"t": t, "no": no, "bas": bas, "sure": sure}
PLAN = [
    # AÇILIŞ
    klip(7485, 37.4, 47.7, zoom=[1.0, 1.1], odak=[0.5, 0.35],
         kaplama=[K(40.9, 7357, 124.0, 2.4), K(45.7, 7381, 1.0, 2.0)]),
    # Yoğun kamp haftası
    klip(7470, 2.4, 9.1, gecis="yumusak", zoom=[1.02, 1.1], odak=[0.5, 0.35],
         kaplama=[K(5.4, 7367, 40.0, 3.6)]),
    klip(7485, 55.3, 58.5, zoom=[1.06, 1.12], odak=[0.5, 0.35],
         kaplama=[K(55.4, 7365, 4.0, 3.0)]),
    # Bilgi yarışması sevinci
    klip(7476, 6.0, 12.8, gecis="yumusak", zoom=[1.04, 1.12], odak=[0.5, 0.35],
         kaplama=[K(7.0, 7357, 165.8, 1.6), K(10.9, 7370, 28.4, 1.9)]),
    # Enerji / motivasyon
    klip(7470, 36.4, 43.7, gecis="yumusak", zoom=[1.06, 1.12], odak=[0.5, 0.35],
         kaplama=[K(37.0, 7428, 23.0, 2.2), K(40.6, 7392, 0.2, 2.6)]),
    # KAPANIŞ
    klip(7476, 13.5, 20.4, gecis="yumusak", zoom=[1.05, 1.14], odak=[0.5, 0.35],
         kaplama=[K(15.5, 7380, 0.2, 2.2)]),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.4, ust="YAŞAMFEN PİJAMA PARTİSİ", metin="HOCALAR\nNE DEDİ? 🎤", vurguSatir=True, y=260, boyut=110),
    olay("etiket", kaynak=(7476, 6.1), sure=2.0, metin="Rehber Öğretmen", y=1220, boyut=40, renk="#2A2A2A", sfx=False),
    olay("cagri", kaynak=(7476, 18.6), sure=1.9, metin="Başarı burada başlar.", altMetin="Yaşamfen Kurs 💪", alt=500),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "cagri"]
VURGU = ["kamp", "pijama", "partisi", "yüzer", "enerjisini", "eksiklerini", "motive", "teşekkür", "seviyorum."]
DUZELT = {}
MUZIK = {"src": "muzik/parti.wav", "seviye": 0.20, "konusmaSeviye": 0.06}
