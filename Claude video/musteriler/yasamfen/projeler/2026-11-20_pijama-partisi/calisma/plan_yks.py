# YKS (TYT) Bilgi Yarışması — Yarışma #1 yapısında, BLURSUZ (kullanıcı). Kaynak: 7372 (25 dk tek çekim, sunucu #5).
# Takımlar: MF grubu = logo duvarı önü (2 erkek + 1 kız); TM grubu = duvar resmi önü (3 genç erkek) — KAZANAN TM (1462 sn).
# Sıra çekimdeki gibi, dönüşümlü (MF→TM), kategori çiftleri: tarih ×2, biyoloji, genel kültür.
# Çıkarılanlar: kimya (çok uzun), coğrafya/matematik (cevaplar dağınık; havuz sorusunda sunucunun "doğru" dediği 31 aslında 30), Türkçe (süre).
SIKI = True
TOPLAM = 8
Z = dict(zoom=[1.0, 1.05], odak=[0.5, 0.55])
C = dict(zoom=[1.05, 1.1], odak=[0.5, 0.55], sesSeviye=1.4)
def dogru(t): return [{"t": t, "olcek": 1.12}]
PLAN = [
    # S1 MF tarih
    klip(7372, 23.55, 27.9, **Z),
    klip(7372, 54.05, 59.5, **C, punch=dogru(58.79)),
    # S2 TM tarih
    klip(7372, 70.55, 73.45, gecis="yumusak", **Z),
    klip(7372, 74.1, 76.6, **C, punch=dogru(75.57)),
    # S3 MF tarih — "hocam bilmiyoruz"
    klip(7372, 87.05, 89.95, gecis="yumusak", **Z),
    klip(7372, 104.85, 106.65, sabit=True, zoom=[1.08, 1.12], odak=[0.5, 0.55]),
    klip(7372, 117.75, 121.6, **C),
    # S4 TM tarih
    klip(7372, 132.05, 134.4, gecis="yumusak", **Z),
    klip(7372, 139.3, 141.75, **C, punch=dogru(140.49)),
    # S5 MF biyoloji
    klip(7372, 263.25, 270.2, gecis="yumusak", **Z),
    klip(7372, 275.4, 278.6, **C, punch=dogru(276.77)),
    # S6 TM biyoloji — 8. sınıf öğrencisi
    klip(7372, 286.17, 291.8, sabit=True, gecis="yumusak", **Z),
    klip(7372, 304.0, 305.2, zoom=[1.1, 1.1], odak=[0.5, 0.55], punch=[{"t": 304.0, "olcek": 1.07, "sure": 5}]),
    klip(7372, 312.1, 317.55, **C),
    # S7 MF Türkçe (3 hap sorusu çıkarıldı: cevap anında sınıf aynı anda konuşuyor, temiz kesim yok)
    klip(7372, 589.72, 592.2, gecis="yumusak", **Z),
    klip(7372, 596.33, 599.12, **C, punch=dogru(598.83)),
    # S8 TM genel kültür
    klip(7372, 829.9, 834.95, gecis="yumusak", **Z),
    klip(7372, 852.05, 858.3, **C, punch=dogru(857.93)),
    # FİNAL — kazanan TM
    klip(7372, 1461.72, 1466.6, sabit=True, gecis="yumusak", zoom=[1.0, 1.06], odak=[0.5, 0.5]),
    klip(7372, 1466.6, 1471.6, sabit=True, kelimesiz=True, zoom=[1.04, 1.12], odak=[0.4, 0.55]),
]
def S(no, grup, kat): return dict(no=no, toplam=TOPLAM, y=230, takim=f"{grup} grubu • {kat}")
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.1, ust="YAŞAMFEN • TYT", metin="BİLGİ\nYARIŞMASI", vurguSatir=True, alt="Sen kaç tanesini bilirdin? 🧠", y=520, boyut=130),
    olay("soru", kaynak=(7372, 23.6), kay=2.0, sure=2.4, soru="Türklerin kullandığı tek ay yılı esaslı takvim nedir?", **S(1, "MF", "Tarih")),
    olay("cevap", kaynak=(7372, 56.1), sure=2.5, cevap="Hicri takvim", y=1450),
    olay("soru", kaynak=(7372, 70.6), sure=3.4, soru="Müslümanlar ile Bizans arasındaki ilk savaş nedir?", **S(2, "TM", "Tarih")),
    olay("cevap", kaynak=(7372, 74.15), sure=2.2, cevap="Mute Savaşı", y=1450),
    olay("soru", kaynak=(7372, 87.1), sure=4.6, soru="İskitlerde kadın yöneticiye verilen isim nedir?", **S(3, "MF", "Tarih")),
    olay("cevap", kaynak=(7372, 117.8), sure=2.4, cevap="Tomris Hatun", baslik="CEVAP", y=1450),
    olay("soru", kaynak=(7372, 132.1), sure=2.6, soru="Hititlerin meclisine verilen isim nedir?", **S(4, "TM", "Tarih")),
    olay("cevap", kaynak=(7372, 139.35), sure=2.2, cevap="Pankuş", y=1450),
    olay("soru", kaynak=(7372, 263.3), sure=7.0, soru="Hücrede ATP üretiminden sorumlu çift zarlı organel hangisidir?", **S(5, "MF", "Biyoloji")),
    olay("cevap", kaynak=(7372, 275.45), sure=2.6, cevap="Mitokondri", y=1450),
    olay("soru", kaynak=(7372, 286.15), sure=5.6, soru="DNA'nın yapısındaki beş karbonlu şekerin adı nedir?", **S(6, "TM", "Biyoloji")),
    olay("cevap", kaynak=(7372, 304.0), sure=1.2, cevap="Bilemediler", dogruMu=False, baslik="MAALESEF", y=1450),
    olay("cevap", kaynak=(7372, 312.2), sure=5.0, cevap="Deoksiriboz", baslik="8. SINIF ÖĞRENCİSİ BİLDİ 😄", y=1450),
    olay("soru", kaynak=(7372, 589.77), sure=2.4, soru="Belirtili isim tamlamasına bir örnek veriniz.", **S(7, "MF", "Türkçe")),
    olay("cevap", kaynak=(7372, 597.9), sure=1.2, cevap="Kapının kolu", y=1450),
    olay("soru", kaynak=(7372, 829.95), sure=5.0, soru="100 kişilik yarışmada sonuncuyu geçersen kaçıncı olursun?", **S(8, "TM", "Genel Kültür")),
    olay("cevap", kaynak=(7372, 855.5), sure=2.8, cevap="Sonuncuyu geçemezsin! 😄", y=1450),
    olay("etiket", kaynak=(7372, 1461.8), sure=4.8, metin="FİNAL SONUCU 🏁", y=420, boyut=52),
    olay("etiket", kaynak=(7372, 1466.65), sure=4.9, metin="🏆 KAZANAN: TM GRUBU", y=420, boyut=56, ses="basari"),
    olay("cagri", kaynak=(7372, 1468.6), sure=3.0, metin="Sen kaç tanesini bildin?", altMetin="Yorumlara yaz 👇", alt=480),
]
ALTYAZI_GIZLE_TIPLER = ["soru", "baslik", "cagri"]
VURGU = ["doğru.", "harika.", "maalesef.", "harikasın.", "bravo.", "bilmiyoruz.", "tm"]
DUZELT = {"Hizliyi": "Hicri", "Muhtemel": "Mute", "Tomlis": "Tomris", "TME": "TM", "Tm": "TM"}
MUZIK = {"src": "muzik/yarisma.wav", "seviye": 0.20, "konusmaSeviye": 0.06}
