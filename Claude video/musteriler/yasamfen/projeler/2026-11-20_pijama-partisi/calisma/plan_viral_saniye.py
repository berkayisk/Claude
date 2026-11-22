# Viral 3 — "Sen kaç saniyede çözerdin?" (LGS, blurlu). √320 + √1280 = 8√5 + 16√5 = 24√5
SIKI = True
PLAN = [
    klip(7367, 123.4, 128.7, zoom=[1.0, 1.06], odak=[0.5, 0.55]),
    broll(7367, 131.5, 141.5, zoom=[1.06, 1.16], odak=[0.5, 0.5]),
    klip(7368, 14.0, 16.65, zoom=[1.05, 1.1], odak=[0.5, 0.55], punch=[{"t": 16.3, "olcek": 1.12}]),
    broll(7368, 17.0, 20.5, zoom=[1.1, 1.14], odak=[0.5, 0.5]),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.1, ust="LGS MATEMATİK", metin="SEN KAÇ\nSANİYEDE ÇÖZERDİN? ⏱️", vurguSatir=True, y=1100, boyut=86),
    olay("soru", zaman=2.0, sure=13.3, no="MATEMATİK", soru="√320 + √1280 = ?", y=230),
    olay("etiket", kaynak=(7367, 131.6), sure=9.8, metin="⏸️ DURDUR VE ÇÖZ", y=900, boyut=56, ses="bildirim"),
    olay("sayac", kaynak=(7367, 131.5), sure=10.0, saniye=10, y=1300),
    olay("cevap", kaynak=(7368, 14.1), sure=2.5, cevap="24√5", y=1450),
    olay("cevap", kaynak=(7368, 17.0), sure=3.5, cevap="8√5 + 16√5 = 24√5", baslik="ÇÖZÜM: √320=8√5 · √1280=16√5", y=1300),
    olay("cagri", kaynak=(7368, 18.6), sure=1.9, metin="Kaç saniyede çözdün? ⏱️", altMetin="Yorumlara yaz 👇", alt=420),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "soru", "cagri"]
VURGU = ["doğru."]
MUZIK = {"src": "muzik/yarisma.wav", "seviye": 0.22, "konusmaSeviye": 0.06}
