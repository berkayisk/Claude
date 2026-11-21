# Bilgi Yarışması #2 — "Bu soruyu bilen kazanıyordu" (matematik turu → berabere → tren sorusu)
# Kaynak: 7366–7369. Dönen ada sorusu çıkarıldı (soru belirsiz, tartışmalı). Doğrulanan cevaplar:
#   çarpan sayısı 3 olan 2 basamaklı sayılar = 25, 49 (asal kareleri) · √320+√1280 = 8√5+16√5 = 24√5 · EKOK(650,750) = 9750 · elektrikli trenin dumanı olmaz
Z = dict(zoom=[1.0, 1.06], odak=[0.5, 0.55])
PLAN = [
    # Kanca: berabere, son soru
    klip(7368, 143.6, 145.45, zoom=[1.12, 1.18], odak=[0.5, 0.5]),
    klip(7368, 148.45, 149.15, zoom=[1.18, 1.2], odak=[0.5, 0.5]),
    # Geri dönüş: matematik turu
    klip(7366, 0.0, 4.55, gecis="beyaz", **Z),
    # S1 çarpan sayısı
    klip(7367, 6.4, 11.4, gecis="yumusak", **Z),
    broll(7367, 40.0, 42.4, zoom=[1.1, 1.16], odak=[0.5, 0.5]),
    klip(7367, 84.2, 89.0, zoom=[1.05, 1.1], odak=[0.5, 0.55]),
    klip(7367, 91.9, 92.8, zoom=[1.1, 1.1], odak=[0.5, 0.55], punch=[{"t": 92.0, "olcek": 1.07, "sure": 5}]),
    klip(7367, 97.4, 99.4, zoom=[1.0, 1.04], odak=[0.5, 0.5]),
    klip(7367, 105.5, 108.0, zoom=[1.04, 1.08], odak=[0.5, 0.5]),
    # S2 köklü sayı
    klip(7367, 123.4, 128.7, gecis="yumusak", **Z),
    broll(7368, 0.5, 2.8, zoom=[1.1, 1.16], odak=[0.5, 0.5]),
    klip(7368, 14.0, 16.65, zoom=[1.05, 1.08], odak=[0.5, 0.55], punch=[{"t": 16.3, "olcek": 1.13}]),
    # S3 EKOK
    klip(7368, 43.3, 48.9, gecis="yumusak", **Z),
    broll(7368, 80.0, 82.4, zoom=[1.1, 1.16], odak=[0.5, 0.5]),
    klip(7368, 118.7, 121.3, zoom=[1.05, 1.1], odak=[0.5, 0.55], punch=[{"t": 120.9, "olcek": 1.07, "sure": 5}]),
    # Final: tren sorusu
    klip(7368, 143.6, 145.45, gecis="beyaz", zoom=[1.0, 1.05], odak=[0.5, 0.5]),
    klip(7368, 154.0, 155.6, zoom=[1.05, 1.1], odak=[0.5, 0.5]),
    klip(7368, 173.2, 174.2, zoom=[1.1, 1.12], odak=[0.5, 0.5]),
    klip(7368, 179.1, 186.4, zoom=[1.0, 1.1], odak=[0.5, 0.5]),
    broll(7368, 190.0, 193.4, zoom=[1.12, 1.2], odak=[0.5, 0.5]),
    klip(7368, 201.3, 203.3, zoom=[1.05, 1.1], odak=[0.5, 0.5], punch=[{"t": 201.4, "olcek": 1.12}]),
    klip(7369, 9.7, 12.3, zoom=[1.0, 1.06], odak=[0.5, 0.5]),
    broll(7369, 12.4, 15.6, zoom=[1.06, 1.1], odak=[0.5, 0.5]),
]
HARIC = []
S = dict(y=230)
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.6, ust="DURUM BERABERE 😱", metin="SON SORUYU\nBİLEN KAZANIR", vurguSatir=True, y=420, boyut=104),
    olay("baslik", kaynak=(7366, 0.1), sure=2.4, ust="BİRAZ ÖNCE…", metin="MATEMATİK\nTURU", vurguSatir=True, y=420, boyut=110),
    olay("soru", kaynak=(7367, 6.5), sure=7.4, no=1, soru="Çarpan sayısı 3 olan iki basamaklı sayılar nelerdir?", **S),
    olay("sayac", kaynak=(7367, 40.0), sure=2.4, saniye=2, y=1480),
    olay("cevap", kaynak=(7367, 92.0), sure=1.0, cevap="3'e bölünenler", dogruMu=False, y=1450),
    olay("cevap", kaynak=(7367, 97.5), sure=2.0, cevap="25 ve 49", y=1450),
    olay("soru", kaynak=(7367, 123.5), sure=7.8, no=2, soru="√320 + √1280 kaçtır?", **S),
    olay("sayac", kaynak=(7368, 0.5), sure=2.3, saniye=2, y=1480),
    olay("cevap", kaynak=(7368, 14.1), sure=2.5, cevap="24√5", y=1450),
    olay("soru", kaynak=(7368, 43.4), sure=8.0, no=3, soru="650 ve 750'nin EKOK'u kaçtır?", **S),
    olay("sayac", kaynak=(7368, 80.0), sure=2.4, saniye=2, y=1480),
    olay("cevap", kaynak=(7368, 120.9), sure=1.6, cevap="Doğrusu: 9750", dogruMu=False, baslik="YANLIŞ — 100 DEĞİL", y=1450),
    olay("etiket", kaynak=(7368, 154.1), sure=1.6, metin="İLK BİLEN KAZANIR 🏆", y=420, boyut=50),
    olay("soru", kaynak=(7368, 179.2), sure=10.6, no="SON SORU", soru="Elektrikli bir tren güneye gidiyor, rüzgâr kuzeyden esiyor. Trenin dumanı hangi yöne gider?", **S),
    olay("karart", kaynak=(7368, 190.0), sure=3.4, seviye=0.45),
    olay("etiket", kaynak=(7368, 190.1), sure=3.2, metin="SEN NE DERDİN? 🤔", y=1180, boyut=64, ses="bildirim"),
    olay("sayac", kaynak=(7368, 190.0), sure=3.4, saniye=3, y=1480),
    olay("cevap", kaynak=(7368, 201.35), sure=3.0, cevap="Elektrikli trenin dumanı olmaz! 😄", baslik="CEVAP", y=1300),
    olay("etiket", kaynak=(7369, 9.8), sure=2.4, metin="🏆 İSİMSİZ SAVAŞÇILAR", y=420, boyut=56, ses="basari"),
    olay("cagri", kaynak=(7369, 12.4), sure=3.2, metin="Sen bilebilir miydin?", altMetin="Yorumlara yaz 👇", alt=480),
]
ALTYAZI_GIZLE_TIPLER = ["soru", "baslik", "cagri", "cevap"]
VURGU = ["yanlış", "doğru", "berabere", "kazanır", "tebrik", "kazanıyor", "elektrikli", "dumanı"]
DUZELT = {"İstipsiz": "İsimsiz", "fenasın": "fenasın", "Sürenizde": "Süreniz de", "ekokunu": "EKOK'unu", "Ekok": "EKOK"}
SFX = [{"ad": "uyari", "kaynak": (7367, 92.0), "seviye": 0.4}, {"ad": "uyari", "kaynak": (7368, 120.9), "seviye": 0.4}]
MUZIK = {"src": "muzik/yarisma.wav", "seviye": 0.22, "konusmaSeviye": 0.07}
