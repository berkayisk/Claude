# Bilgi Yarışması #1 — "Sen kaç tanesini bilirdin?" (fen turu, 6 soru)
# Kaynak: 7356 (Q1), 7357 (Q2–Q6). Eksen eğikliği sorusu çıkarıldı (cevap sesten doğrulanamadı), bor sorusu çıkarıldı (cevap duyulmuyor).
TOPLAM = 6
Z = dict(zoom=[1.0, 1.06], odak=[0.5, 0.55])
DOGRU = 1.13  # "Doğru" anında punch

def dusun(no, bas, sn=3.3, gecis="yumusak"):
    """Takım düşünürken B-roll + sayaç"""
    return broll(no, bas, bas + sn, zoom=[1.08, 1.14], odak=[0.5, 0.5], gecis=gecis)

PLAN = [
    # Kanca: tahtaya başlık yazılıyor
    broll(7353, 13.0, 15.4, zoom=[1.15, 1.25], odak=[0.6, 0.4]),
    # S1 — safra (7356)
    klip(7356, 52.75, 56.15, gecis="yumusak", **Z),
    klip(7356, 60.85, 62.1, **Z),
    dusun(7360, 3.0),
    klip(7356, 72.0, 75.05, zoom=[1.04, 1.1], odak=[0.5, 0.55]),
    klip(7356, 80.0, 81.85, zoom=[1.1, 1.1], odak=[0.5, 0.55], punch=[{"t": 80.1, "olcek": 1.08, "sure": 5}]),
    klip(7356, 85.8, 87.2, zoom=[1.1, 1.12], odak=[0.5, 0.55]),
    # S2 — mitoz
    klip(7357, 39.25, 44.05, gecis="yumusak", **Z),
    klip(7357, 44.65, 45.85, **Z),
    dusun(7359, 5.0),
    klip(7357, 62.9, 64.95, zoom=[1.05, 1.08], odak=[0.5, 0.55], punch=[{"t": 64.39, "olcek": DOGRU}]),
    klip(7357, 70.3, 72.55, zoom=[1.0, 1.04], odak=[0.5, 0.55]),
    # S3 — ekinoks
    klip(7357, 96.4, 99.6, gecis="yumusak", **Z),
    klip(7357, 99.75, 100.85, **Z),
    dusun(7361, 1.0, 2.6),
    klip(7357, 102.7, 105.7, zoom=[1.05, 1.08], odak=[0.5, 0.55], punch=[{"t": 105.18, "olcek": DOGRU}]),
    # S4 — sitoplazma
    klip(7357, 115.6, 121.4, gecis="yumusak", **Z),
    dusun(7363, 0.2, 2.6),
    klip(7357, 124.2, 125.95, zoom=[1.05, 1.08], odak=[0.5, 0.55], punch=[{"t": 125.36, "olcek": DOGRU}]),
    # S5 — atardamar
    klip(7357, 137.0, 144.5, gecis="yumusak", **Z),
    klip(7357, 146.65, 148.2, **Z),
    dusun(7364, 1.0),
    klip(7357, 165.85, 167.3, zoom=[1.05, 1.08], odak=[0.5, 0.55], punch=[{"t": 166.81, "olcek": DOGRU}]),
    # S6 — protein (kazananı belirleyen soru)
    klip(7357, 172.25, 180.8, gecis="yumusak", **Z),
    klip(7357, 182.0, 187.1, **Z),
    klip(7357, 188.55, 190.45, **Z),
    dusun(7365, 4.0, 3.6),
    klip(7357, 207.6, 208.4, zoom=[1.08, 1.12], odak=[0.5, 0.55]),
    klip(7357, 211.2, 212.6, zoom=[1.08, 1.1], odak=[0.5, 0.55], punch=[{"t": 211.3, "olcek": 1.16, "sure": 6}]),
    klip(7357, 218.1, 220.4, zoom=[1.0, 1.05], odak=[0.5, 0.5]),
    # Kapanış: çağrı
    broll(7357, 221.0, 224.2, zoom=[1.05, 1.1], odak=[0.5, 0.5]),
]

HARIC = [
    (7357, 112.0, 115.6),   # mikrofon uyarısı
    (7357, 164.8, 165.85),  # anlaşılmayan
]

S = dict(toplam=TOPLAM, y=230)
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.4, ust="YAŞAMFEN • LGS", metin="BİLGİ\nYARIŞMASI", vurguSatir=True, alt="Sen kaç tanesini bilirdin? 🧠", y=560, boyut=130),
    # S1
    olay("soru", kaynak=(7356, 52.8), sure=7.6, no=1, soru="Safra sıvısını hangi organımız üretir?", **S),
    olay("sayac", kaynak=(7360, 3.0), sure=3.3, saniye=3, y=1480),
    olay("cevap", kaynak=(7356, 80.1), sure=1.8, cevap="Pankreas", dogruMu=False, y=1450),
    olay("cevap", kaynak=(7356, 85.85), sure=2.2, cevap="Karaciğer", y=1450),
    # S2
    olay("soru", kaynak=(7357, 39.3), sure=9.0, no=2, soru="Bir hücreli canlıların üremek için geçirdiği bölünme?", **S),
    olay("sayac", kaynak=(7359, 5.0), sure=3.3, saniye=3, y=1480),
    olay("cevap", kaynak=(7357, 63.0), sure=2.1, cevap="Mitoz bölünme", y=1450),
    olay("etiket", kaynak=(7357, 71.6), sure=1.1, metin="BERABERE! ⚖️", y=420, boyut=58),
    # S3
    olay("soru", kaynak=(7357, 96.45), sure=5.5, no=3, soru="Ekinoks tarihleri hangi günlerdir?", **S),
    olay("sayac", kaynak=(7361, 1.0), sure=2.6, saniye=2, y=1480),
    olay("cevap", kaynak=(7357, 102.75), sure=2.9, cevap="21 Mart & 23 Eylül", y=1450),
    # S4
    olay("soru", kaynak=(7357, 118.7), sure=5.2, no=4, soru="Hücre sıvısına ne isim verilir?", **S),
    olay("etiket", kaynak=(7357, 115.65), sure=1.6, metin="ÖNE GEÇME ŞANSI 🔥", y=420, boyut=50),
    olay("sayac", kaynak=(7363, 0.2), sure=2.6, saniye=2, y=1480),
    olay("cevap", kaynak=(7357, 124.25), sure=1.7, cevap="Sitoplazma", y=1450),
    # S5
    olay("soru", kaynak=(7357, 140.75), sure=8.4, no=5, soru="Temiz kanı taşıyan damarlara ne isim verilir?", **S),
    olay("sayac", kaynak=(7364, 1.0), sure=3.3, saniye=3, y=1480),
    olay("cevap", kaynak=(7357, 165.9), sure=1.4, cevap="Atardamar", y=1450),
    # S6
    olay("etiket", kaynak=(7357, 174.9), sure=2.8, metin="BİLİRLERSE KAZANIYORLAR 🏆", y=420, boyut=46),
    olay("soru", kaynak=(7357, 182.0), sure=10.6, no=6, soru="Proteinlerin kimyasal sindirimi hangi organda başlar?", **S),
    olay("sayac", kaynak=(7365, 4.0), sure=3.6, saniye=3, y=1480),
    olay("cevap", kaynak=(7357, 211.25), sure=2.6, cevap="Mide", y=1450),
    olay("etiket", kaynak=(7357, 218.2), sure=2.2, metin="🏆 4'TE 4!", y=420, boyut=64, ses="basari"),
    # Kapanış
    olay("cagri", kaynak=(7357, 221.0), sure=3.2, metin="Sen kaç tanesini bildin?", altMetin="Yorumlara yaz 👇", alt=480),
]
ALTYAZI_GIZLE_TIPLER = ["soru", "baslik", "cagri", "cevap"]
VURGU = ["doğru", "yanlış", "karaciğer", "mitoz", "berabere", "kazananı", "tebrik", "sitoplazma", "atar"]
DUZELT = {"Anistoplazma": "Sitoplazma", "fücreli": "hücreli", "zanayım": "alayım", "Kıyasa": "Kıyasıya", "Ekinot": "Ekinoks", "Sıranız": "Süreniz", "Sürenin": "Süreniz"}
SFX = [
    {"ad": "uyari", "kaynak": (7356, 80.1), "seviye": 0.45},   # "Bip"
]
MUZIK = {"src": "muzik/yarisma.wav", "seviye": 0.22, "konusmaSeviye": 0.07}
