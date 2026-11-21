# Bilgi Yarışması #1 — "Sen kaç tanesini bilirdin?" (fen turu, 8 soru, takımlar sırayla)
# Kullanıcı geri bildirimi: doğrudan soruyla başla + kanca başlık; B-roll yok; her takımın sorusu-cevabı sırayla; soru/cevap net;
# geçiş sadece soru aralarında yumuşak crossfade.
# Takımlar: T1 = logo duvarı önündeki masa, T2 = duvar resmi önündeki masa ("İsimsiz Savaşçılar", 7357 @27–30 sn).
# Sıra (çekimdeki gibi, dönüşümlü): safra T1 · bor T2 · mitoz T1 · eksen eğikliği T2 · ekinoks T1 · sitoplazma T2 · atardamar T1 · protein T2
TOPLAM = 8
Z = dict(zoom=[1.0, 1.05], odak=[0.5, 0.55])
C = dict(zoom=[1.05, 1.1], odak=[0.5, 0.55], sesSeviye=1.5)   # cevap anı: hafif yakın + çocuk sesi yükseltilir
DOGRU = 1.12

def dogru(t): return [{"t": t, "olcek": DOGRU}]

PLAN = [
    # S1 safra (T1) — açılış doğrudan soru
    klip(7356, 52.75, 56.15, **Z),
    klip(7356, 60.85, 62.1, **Z),
    klip(7356, 72.0, 75.05, **C),
    klip(7356, 80.0, 81.85, zoom=[1.1, 1.1], odak=[0.5, 0.55], punch=[{"t": 80.1, "olcek": 1.07, "sure": 5}]),
    klip(7356, 85.8, 87.2, **C),
    # S2 bor (T2)
    klip(7357, 0.15, 3.85, gecis="yumusak", **Z),
    klip(7357, 10.9, 14.8, **C, punch=dogru(13.94)),
    klip(7357, 28.75, 30.8, zoom=[1.0, 1.04], odak=[0.5, 0.5]),
    # S3 mitoz (T1)
    klip(7357, 39.25, 44.05, gecis="yumusak", **Z),
    klip(7357, 44.65, 45.85, **Z),
    klip(7357, 61.4, 64.95, **C, punch=dogru(64.39)),
    # S4 eksen eğikliği (T2)
    klip(7357, 76.25, 80.35, gecis="yumusak", **Z),
    klip(7357, 80.45, 82.35, **Z),
    klip(7357, 84.2, 86.7, **C, punch=dogru(86.2), kelimesiz=True),  # cevap sesi belirsiz: sadece kart
    # S5 ekinoks (T1)
    klip(7357, 96.4, 99.6, gecis="yumusak", **Z),
    klip(7357, 99.75, 100.85, **Z),
    klip(7357, 102.7, 105.7, **C, punch=dogru(105.18)),
    # S6 sitoplazma (T2)
    klip(7357, 115.6, 121.4, gecis="yumusak", **Z),
    klip(7357, 124.2, 125.95, **C, punch=dogru(125.36)),
    # S7 atardamar (T1)
    klip(7357, 140.7, 144.5, gecis="yumusak", **Z),
    klip(7357, 146.65, 148.2, **Z),
    klip(7357, 165.85, 167.3, **C, punch=dogru(166.81)),
    # S8 protein (T2) — kazananı belirleyen soru
    klip(7357, 174.85, 180.8, gecis="yumusak", **Z),
    klip(7357, 182.0, 187.1, **Z),
    klip(7357, 188.55, 190.45, **Z),
    klip(7357, 207.6, 208.4, zoom=[1.08, 1.12], odak=[0.5, 0.55]),
    klip(7357, 211.2, 212.6, **C, punch=[{"t": 211.3, "olcek": 1.16, "sure": 6}]),
    # FİNAL: puanlar yeniden sayıldı → kazanan logo duvarı önündeki takım (7370), kutlama anı
    klip(7370, 23.05, 27.2, gecis="yumusak", zoom=[1.0, 1.06], odak=[0.5, 0.5]),
    klip(7370, 28.3, 33.0, sik=False, kelimesiz=True, zoom=[1.04, 1.12], odak=[0.5, 0.6]),
]
HARIC = [
    (7357, 112.0, 115.6),   # mikrofon uyarısı
    (7357, 164.8, 165.85),  # anlaşılmayan
    (7357, 83.0, 84.2),     # "söyletirsiniz"
]

def S(no): return dict(no=no, toplam=TOPLAM, y=230)
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.1, ust="YAŞAMFEN • LGS", metin="BİLGİ\nYARIŞMASI", vurguSatir=True, alt="Sen kaç tanesini bilirdin? 🧠", y=520, boyut=130),
    # S1
    olay("soru", kaynak=(7356, 52.8), kay=2.0, sure=4.4, soru="Safra sıvısını hangi organımız üretir?", **S(1)),
    olay("cevap", kaynak=(7356, 80.1), sure=1.8, cevap="Pankreas", dogruMu=False, y=1450),
    olay("cevap", kaynak=(7356, 85.85), sure=1.4, cevap="Karaciğer", y=1450),
    # S2
    olay("soru", kaynak=(7357, 0.2), sure=5.0, soru="Dünyada en fazla ülkemizde çıkan maden hangisidir?", **S(2)),
    olay("cevap", kaynak=(7357, 13.9), sure=1.6, cevap="Bor", y=1450),
    olay("etiket", kaynak=(7357, 28.8), sure=2.0, metin="İSİMSİZ SAVAŞÇILAR +10", y=420, boyut=48, ses="para"),
    # S3
    olay("soru", kaynak=(7357, 39.3), sure=6.0, soru="Bir hücreli canlıların üremek için geçirdiği bölünme?", **S(3)),
    olay("cevap", kaynak=(7357, 63.0), sure=2.0, cevap="Mitoz bölünme", y=1450),
    # S4
    olay("soru", kaynak=(7357, 76.3), sure=6.0, soru="Dünyanın eksen eğikliği kaç derece kaç dakikadır?", **S(4)),
    olay("cevap", kaynak=(7357, 85.0), sure=1.7, cevap="23° 27'", y=1450),
    # S5
    olay("soru", kaynak=(7357, 96.45), sure=4.3, soru="Ekinoks tarihleri hangi günlerdir?", **S(5)),
    olay("cevap", kaynak=(7357, 102.75), sure=2.9, cevap="21 Mart & 23 Eylül", y=1450),
    # S6
    olay("etiket", kaynak=(7357, 115.65), sure=1.6, metin="ÖNE GEÇME ŞANSI 🔥", y=420, boyut=50),
    olay("soru", kaynak=(7357, 118.7), sure=3.3, soru="Hücre sıvısına ne isim verilir?", **S(6)),
    olay("cevap", kaynak=(7357, 124.25), sure=1.7, cevap="Sitoplazma", y=1450),
    # S7
    olay("soru", kaynak=(7357, 140.75), sure=5.3, soru="Temiz kanı taşıyan damarlara ne isim verilir?", **S(7)),
    olay("cevap", kaynak=(7357, 165.9), sure=1.4, cevap="Atardamar", y=1450),
    # S8
    olay("etiket", kaynak=(7357, 174.9), sure=2.8, metin="FEN TURUNUN SON SORUSU", y=420, boyut=48),
    olay("soru", kaynak=(7357, 182.0), sure=7.4, soru="Proteinlerin kimyasal sindirimi hangi organda başlar?", **S(8)),
    olay("cevap", kaynak=(7357, 211.25), sure=1.35, cevap="Mide", y=1450),
    olay("etiket", kaynak=(7370, 23.1), sure=2.6, metin="FİNAL SONUCU 🏁", y=420, boyut=52),
    olay("etiket", kaynak=(7370, 28.35), sure=4.6, metin="🏆 KAZANAN TAKIM", y=420, boyut=60, ses="basari"),
    olay("cagri", kaynak=(7370, 30.2), sure=2.8, metin="Sen kaç tanesini bildin?", altMetin="Yorumlara yaz 👇", alt=480),
]
ALTYAZI_GIZLE_TIPLER = ["soru", "baslik", "cagri"]
VURGU = ["doğru", "doğru.", "yanlış", "karaciğer.", "mitoz", "berabere.", "kazananı", "tebrik", "sitoplazma.", "atar", "savaşçılar"]
DUZELT = {"Anistoplazma": "Sitoplazma", "fücreli": "hücreli", "zanayım": "alayım", "Kıyasa": "Kıyasıya", "Ekinot": "Ekinoks", "Sıranız": "Süreniz", "Sürenin": "Süreniz", "Isimsiz": "İsimsiz", "ikili": "eğikliği", "eksene": "eksen"}
SFX = [{"ad": "uyari", "kaynak": (7356, 80.1), "seviye": 0.45}]
MUZIK = {"src": "muzik/yarisma.wav", "seviye": 0.20, "konusmaSeviye": 0.06}
