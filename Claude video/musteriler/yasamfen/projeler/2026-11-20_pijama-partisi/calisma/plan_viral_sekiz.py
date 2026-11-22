# Viral 2 — "Lise son bilemedi, 8. sınıf bildi" (YKS, blursuz; 8. sınıf öğrencisi kadrajda DEĞİL — kontrol edildi)
SIKI = True
Z = dict(zoom=[1.04, 1.1], odak=[0.5, 0.5])
PLAN = [
    klip(7372, 286.95, 291.8, sabit=True, zoom=[1.0, 1.06], odak=[0.5, 0.5]),
    klip(7372, 299.7, 302.8, sabit=True, kelimesiz=True, **Z),
    klip(7372, 304.0, 305.2, zoom=[1.1, 1.12], odak=[0.5, 0.5]),
    klip(7372, 306.3, 309.7, **Z),
    klip(7372, 312.1, 317.55, zoom=[1.06, 1.14], odak=[0.5, 0.5], punch=[{"t": 316.26, "olcek": 1.1, "sure": 6}]),
    klip(7372, 319.5, 322.45, **Z),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.2, ust="TYT BİLGİ YARIŞMASI", metin="LİSE SON BİLEMEDİ\n8. SINIF BİLDİ 😳", vurguSatir=True, y=1100, boyut=84),
    olay("soru", zaman=2.1, sure=3.5, no="BİYOLOJİ", soru="DNA'nın yapısındaki beş karbonlu şekerin adı nedir?", y=230),
    olay("cevap", kaynak=(7372, 304.0), sure=1.2, cevap="Bilemediler", dogruMu=False, baslik="MAALESEF", y=1450),
    olay("etiket", kaynak=(7372, 308.2), sure=1.5, metin="🙋 8. SINIF ÖĞRENCİSİ", y=420, boyut=52, ses="pop"),
    olay("cevap", kaynak=(7372, 312.2), sure=5.0, cevap="Deoksiriboz", baslik="8. SINIF ÖĞRENCİSİ BİLDİ ✅", y=1450),
    olay("cagri", kaynak=(7372, 320.6), sure=1.9, metin="Sen bilir miydin? 🧬", altMetin="Yorumlara yaz 👇", alt=420),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "soru", "cagri"]
VURGU = ["maalesef!", "sekizinci", "yargı", "yanlış"]
DUZELT = {"Pentos": "Pentoz"}
MUZIK = {"src": "muzik/yarisma.wav", "seviye": 0.2, "konusmaSeviye": 0.06}
