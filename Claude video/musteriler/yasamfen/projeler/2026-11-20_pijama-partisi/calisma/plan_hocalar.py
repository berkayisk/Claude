# Hocalarımız Ne Dedi? — geri bildirim 8: BÜTÜN hocalar (#37, #5, #34, #8, #35), başlık "HOCALARIMIZ NE DEDİ?",
# her hoca doğrudan cümleye girer (enerji başlangıcına yaslama), "eee/ııı" dolguları kesilir (calisma/transkript_dolgu ile bulundu).
SIKI = True
K = lambda t, no, bas, sure: {"t": t, "no": no, "bas": bas, "sure": sure}
PLAN = [
    # AÇILIŞ — #37
    klip(7485, 37.22, 48.1, sabit=True, zoom=[1.0, 1.1], odak=[0.5, 0.35],
         kaplama=[K(40.9, 7357, 124.0, 2.4), K(45.7, 7381, 1.0, 2.0)]),
    # #5
    klip(7471, 6.57, 13.26, sabit=True, gecis="yumusak", zoom=[1.02, 1.1], odak=[0.5, 0.35], yazi="Kasım ara tatilini bitirirken çocukların da nefes alması adına derslerin sonunda küçük bir parti düzenledik.",
         kaplama=[K(10.0, 7383, 4.0, 2.4)]),
    # #34
    klip(7470, 2.4, 9.1, gecis="yumusak", zoom=[1.02, 1.1], odak=[0.5, 0.35],
         kaplama=[K(5.4, 7367, 40.0, 3.4)]),
    # #8 — bilgi yarışması
    klip(7476, 6.0, 12.8, gecis="yumusak", zoom=[1.04, 1.12], odak=[0.5, 0.35],
         kaplama=[K(8.2, 7357, 165.8, 1.6), K(10.9, 7370, 28.4, 1.9)]),
    # #35 — motivasyon
    klip(7474, 15.2, 20.2, sabit=True, gecis="yumusak", zoom=[1.04, 1.1], odak=[0.5, 0.35], yazi="Güzel oldu, motive olduk haftaya ve sonrası için tamamen hazır hissediyoruz artık.",
         kaplama=[K(17.0, 7392, 0.2, 2.4)]),
    # KAPANIŞ — #8
    klip(7476, 13.5, 20.4, gecis="yumusak", zoom=[1.05, 1.14], odak=[0.5, 0.35],
         kaplama=[K(15.5, 7380, 0.2, 2.2)]),
]
HARIC = [(7474, 14.5, 15.2), (7474, 16.0, 16.4), (7485, 48.6, 49.0)]   # eee / ııı (enerjiyle doğrulandı)   # eee / ııı
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.4, ust="YAŞAMFEN PİJAMA PARTİSİ", metin="HOCALARIMIZ\nNE DEDİ? 🎤", vurguSatir=True, y=260, boyut=100),
    olay("etiket", kaynak=(7476, 6.1), sure=2.0, metin="Rehber Öğretmen", y=1220, boyut=40, renk="#2A2A2A", sfx=False),
    olay("cagri", kaynak=(7476, 18.6), sure=1.9, metin="Başarı burada başlar.", altMetin="Yaşamfen Kurs 💪", alt=500),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "cagri"]
VURGU = ["kamp", "pijama", "parti", "partisi", "yüzer", "motive", "teşekkür", "seviyorum."]
DUZELT = {}
MUZIK = {"src": "muzik/parti.wav", "seviye": 0.20, "konusmaSeviye": 0.06}
