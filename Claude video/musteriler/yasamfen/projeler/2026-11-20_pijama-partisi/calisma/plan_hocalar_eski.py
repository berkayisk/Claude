# Hocalar ne dedi? — etkinlik üzerine öğretmen görüşleri (veli güveni), konuşma üstü B-roll serpiştirilir
PLAN = [
    klip(7476, 6.0, 12.8, zoom=[1.05, 1.12], odak=[0.5, 0.35],
         kaplama=[{"t": 7.0, "no": 7357, "bas": 124.0, "sure": 2.2}]),
    klip(7471, 6.1, 12.75, gecis="yumusak", zoom=[1.0, 1.08], odak=[0.5, 0.35],
         kaplama=[{"t": 8.8, "no": 7381, "bas": 1.0, "sure": 3.6}]),
    klip(7470, 2.4, 9.1, gecis="yumusak", zoom=[1.0, 1.08], odak=[0.5, 0.35],
         kaplama=[{"t": 5.6, "no": 7357, "bas": 140.5, "sure": 3.4}]),
    klip(7470, 36.4, 43.7, zoom=[1.08, 1.14], odak=[0.5, 0.35],
         kaplama=[{"t": 38.0, "no": 7428, "bas": 23.0, "sure": 2.6}]),
    klip(7485, 49.0, 58.5, gecis="yumusak", zoom=[1.0, 1.08], odak=[0.5, 0.35],
         kaplama=[{"t": 52.2, "no": 7367, "bas": 40.0, "sure": 2.8}]),
    klip(7474, 12.05, 20.2, sabit=True, gecis="yumusak", zoom=[1.04, 1.1], odak=[0.5, 0.35],  # duraksamalı "5 günlük kamp" kısmı çıkarıldı
         kaplama=[{"t": 12.0, "no": 7383, "bas": 4.0, "sure": 2.6}]),
    klip(7476, 13.5, 20.4, gecis="yumusak", zoom=[1.05, 1.12], odak=[0.5, 0.35]),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.4, ust="YAŞAMFEN PİJAMA PARTİSİ", metin="HOCALAR\nNE DEDİ? 🎤", vurguSatir=True, y=260, boyut=110),
    olay("etiket", kaynak=(7476, 6.1), sure=2.2, metin="Rehber Öğretmen", y=1220, boyut=40, renk="#2A2A2A", sfx=False),
    olay("cagri", kaynak=(7476, 18.6), sure=1.8, metin="Başarı burada başlar.", altMetin="Yaşamfen Kurs 💪", alt=500),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "cagri"]
VURGU = ["kamp", "pijama", "parti", "partimiz", "yüzer", "enerjisini", "eksiklerini", "motive", "teşekkür", "seviyorum."]
DUZELT = {"Kurs'tan": "Kurs'tan", "yüzer": "yüzer"}
MUZIK = {"src": "muzik/sicak.wav", "seviye": 0.20, "konusmaSeviye": 0.06}
