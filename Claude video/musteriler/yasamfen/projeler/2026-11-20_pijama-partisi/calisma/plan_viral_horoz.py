# Viral 1b — Şaşırtmaca: horoz yumurtası (YKS, blursuz). Kanca: "%90'I YANLIŞ CEVAPLIYOR 🤯"
SIKI = True
PLAN = [
    klip(7372, 709.48, 714.35, zoom=[1.0, 1.08], odak=[0.5, 0.5]),
    broll(7372, 715.0, 718.0, zoom=[1.08, 1.14], odak=[0.5, 0.5]),
    klip(7372, 725.2, 727.4, sabit=True, zoom=[1.1, 1.14], odak=[0.5, 0.5]),
    klip(7372, 822.35, 825.1, zoom=[1.04, 1.12], odak=[0.5, 0.5], punch=[{"t": 824.12, "olcek": 1.1, "sure": 6}]),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.0, ust="ŞAŞIRTMACA SORU", metin="%90'I YANLIŞ\nCEVAPLIYOR 🤯", vurguSatir=True, y=1120, boyut=96),
    olay("soru", zaman=1.9, sure=3.0, no="ŞAŞIRTMACA", soru="Bir horoz evin çatısına yumurtladı. Yumurta sağa mı düşer, sola mı?", y=230),
    olay("karart", kaynak=(7372, 715.0), sure=3.0, seviye=0.5),
    olay("etiket", kaynak=(7372, 715.05), sure=2.9, metin="⏸️ DURDUR VE DÜŞÜN", y=900, boyut=60, ses="bildirim"),
    olay("sayac", kaynak=(7372, 715.0), sure=3.0, saniye=3, y=1300),
    olay("cevap", kaynak=(7372, 725.25), sure=2.2, cevap="Horoz yumurtlamaz! 🐓", baslik="CEVAP", y=1300),
    olay("cagri", kaynak=(7372, 823.0), sure=2.2, metin="Sen bilebildin mi? 🤔", altMetin="Yorumlara yaz 👇", alt=420),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "soru", "cagri"]
DUZELT = {"Kırılır.": "Kırılır!"}
VURGU = ["horozu", "kırılır."]
MUZIK = {"src": "muzik/gizem.wav", "seviye": 0.24, "konusmaSeviye": 0.07}
