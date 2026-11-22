# Viral 1c — Şaşırtmaca: Musa'nın gemisi (YKS, blursuz). Kanca: "%90'I YANLIŞ CEVAPLIYOR 🤯"
SIKI = True
PLAN = [
    klip(7372, 1503.85, 1507.5, zoom=[1.0, 1.08], odak=[0.5, 0.5]),
    broll(7372, 1508.0, 1511.0, zoom=[1.08, 1.14], odak=[0.5, 0.5]),
    klip(7372, 1511.2, 1515.05, sabit=True, zoom=[1.05, 1.12], odak=[0.5, 0.5], punch=[{"t": 1514.06, "olcek": 1.1, "sure": 6}]),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.0, ust="ŞAŞIRTMACA SORU", metin="%90'I YANLIŞ\nCEVAPLIYOR 🤯", vurguSatir=True, y=1120, boyut=96),
    olay("soru", zaman=1.9, sure=1.8, no="ŞAŞIRTMACA", soru="Musa gemisine her hayvandan kaç çift aldı?", y=230),
    olay("karart", kaynak=(7372, 1508.0), sure=3.0, seviye=0.5),
    olay("etiket", kaynak=(7372, 1508.05), sure=2.9, metin="⏸️ DURDUR VE DÜŞÜN", y=900, boyut=60, ses="bildirim"),
    olay("sayac", kaynak=(7372, 1508.0), sure=3.0, saniye=3, y=1300),
    olay("cevap", kaynak=(7372, 1513.3), sure=1.8, cevap="Gemiyi yapan Musa değil, Nuh! 🚢", baslik="CEVAP", y=1300),
    olay("cagri", kaynak=(7372, 1513.9), sure=1.2, metin="Sen fark ettin mi? 🤔", altMetin="Yorumlara yaz 👇", alt=420),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "soru", "cagri"]
VURGU = ["musa'nın", "nuh"]
MUZIK = {"src": "muzik/gizem.wav", "seviye": 0.24, "konusmaSeviye": 0.07}
