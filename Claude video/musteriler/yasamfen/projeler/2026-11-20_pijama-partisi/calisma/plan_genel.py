# Etkinlik genel videosu — "Yaşamfen'de pijama partisi": giriş → yarışma → kombin → vampir köylü → teşekkür
Z = dict(zoom=[1.0, 1.06], odak=[0.5, 0.5])
PLAN = [
    broll(7353, 12.0, 14.6, zoom=[1.12, 1.24], odak=[0.6, 0.4]),
    klip(7471, 0.5, 5.4, gecis="yumusak", zoom=[1.0, 1.06], odak=[0.5, 0.35]),
    klip(7470, 2.4, 9.1, gecis="yumusak", zoom=[1.02, 1.08], odak=[0.5, 0.35],
         kaplama=[{"t": 5.3, "no": 7361, "bas": 1.0, "sure": 3.8}]),
    # Yarışma
    klip(7356, 52.75, 56.15, gecis="beyaz", **Z),
    klip(7356, 80.0, 81.85, zoom=[1.08, 1.1], odak=[0.5, 0.55], punch=[{"t": 80.1, "olcek": 1.08, "sure": 5}]),
    klip(7357, 165.85, 167.3, zoom=[1.05, 1.08], odak=[0.5, 0.55], punch=[{"t": 166.81, "olcek": 1.13}]),
    klip(7368, 201.3, 203.3, zoom=[1.05, 1.1], odak=[0.5, 0.5]),
    # Kombin (müzikle)
    broll(7380, 0.2, 2.0, gecis="yumusak", zoom=[1.0, 1.05]),
    broll(7382, 0.5, 2.3, zoom=[1.0, 1.05]),
    broll(7383, 4.0, 5.9, zoom=[1.0, 1.05]),
    broll(7387, 0.3, 2.3, zoom=[1.0, 1.05]),
    # Vampir köylü
    klip(7397, 1.3, 4.0, gecis="siyah", zoom=[1.0, 1.08], odak=[0.5, 0.5], yazi="Kapat gözünü, kapat, kapat gözünü"),
    klip(7428, 23.3, 24.8, zoom=[1.04, 1.1], odak=[0.5, 0.5], yazi="Vampirler birbirini yiyor!"),
    klip(7441, 4.1, 8.3, zoom=[1.05, 1.12], odak=[0.5, 0.4], yazi="Neden onları öldüreyim yani, mantıken?"),
    broll(7420, 21.2, 23.2, zoom=[1.0, 1.06], odak=[0.5, 0.45]),
    # Kapanış
    klip(7485, 75.3, 79.35, gecis="yumusak", zoom=[1.0, 1.08], odak=[0.5, 0.35]),
    broll(7392, 0.2, 3.4, zoom=[1.0, 1.06]),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.5, ust="YAŞAMFEN KURS", metin="PİJAMA\nPARTİSİ 🎉", vurguSatir=True, y=300, boyut=130),
    olay("baslik", kaynak=(7356, 52.8), sure=1.6, metin="BİLGİ\nYARIŞMASI 🧠", vurguSatir=True, y=240, boyut=90, sfx=False),
    olay("etiket", kaynak=(7357, 166.81), sure=1.2, metin="✅ DOĞRU!", y=420, boyut=60, ses="basari"),
    olay("baslik", kaynak=(7380, 0.25), sure=1.6, metin="PİJAMA\nKOMBİNLERİ 💤", vurguSatir=True, y=240, boyut=90, sfx=False),
    olay("baslik", kaynak=(7397, 1.35), sure=1.6, metin="VAMPİR\nKÖYLÜ 🧛", vurguSatir=True, y=240, boyut=90, sfx=False),
    olay("etiket", kaynak=(7420, 21.3), sure=1.8, metin="🧛", kisi=(7420, 22.0, 50), boyut=70, ses="boom"),
    olay("cagri", kaynak=(7392, 0.3), sure=3.1, metin="Başarı burada başlar.", altMetin="Yaşamfen Kurs 💪", alt=500),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "cagri"]
VURGU = ["partimiz", "kamp", "yanlış", "doğru.", "tebrik", "vampirler", "mantıken?", "teşekkür"]
DUZELT = {}
MUZIK = None  # trend müzik Instagram'da eklenecek
