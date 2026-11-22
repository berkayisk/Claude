# Komik Anlar #1 — YKS/TYT yarışması (blursuz). Kanca: "BU YARIŞMADA KİMSE CİDDİ DEĞİLDİ 😂"
SIKI = True
Z = dict(zoom=[1.04, 1.1], odak=[0.5, 0.5])
P = lambda t: [{"t": t, "olcek": 1.1, "sure": 6}]
PLAN = [
    klip(7372, 17.85, 19.85, zoom=[1.0, 1.08], odak=[0.6, 0.4], punch=P(19.42)),          # Roma'yı kim yaktı? Şaka.
    klip(7372, 104.85, 106.65, sabit=True, gecis="yumusak", **Z),                          # Hocam bilmiyoruz
    klip(7372, 391.68, 394.95, **Z),                                                       # biz bunu cevaplayacak insanlar değiliz
    klip(7372, 513.0, 515.05, **Z, punch=P(514.0)),                                        # okuma yazma öğreniyorum
    klip(7372, 597.85, 600.8, **Z, punch=P(599.37)),                                       # kapının kolu / Allah alsın
    klip(7372, 709.48, 714.35, gecis="yumusak", **Z),                                      # horoz sorusu
    klip(7372, 725.2, 727.4, sabit=True, zoom=[1.1, 1.14], odak=[0.5, 0.5]),               # Kırılır!
    klip(7372, 822.35, 825.1, **Z, punch=P(824.12)),                                       # Mantık rezalet, horozu yumurtlatıyoruz
    klip(7372, 1104.85, 1109.98, sabit=True, gecis="yumusak", **Z),                          # Hocam çok korkunç... toplama sıkıntıda şu an
    klip(7372, 1503.85, 1507.5, gecis="yumusak", **Z),                                     # Musa sorusu
    klip(7372, 1511.2, 1515.05, sabit=True, **Z, punch=P(1514.06)),                        # Musa'nın gemisi mi var? Nuh olmasın o
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.1, ust="YAŞAMFEN • TYT YARIŞMASI", metin="BU YARIŞMADA\nKİMSE CİDDİ DEĞİLDİ 😂", vurguSatir=True, y=300, boyut=86),
    olay("etiket", kaynak=(7372, 19.45), sure=0.9, metin="😂", y=520, boyut=90),
    olay("etiket", kaynak=(7372, 725.25), sure=2.0, metin="🐓 Horoz yumurtlamaz ki!", y=420, boyut=50, ses="pop"),
    olay("etiket", kaynak=(7372, 1514.1), sure=1.0, metin="🚢 Nuh'un gemisi!", y=420, boyut=54, ses="pop"),
    olay("cagri", kaynak=(7372, 1512.6), sure=2.4, metin="En çok hangisine güldün? 😂", altMetin="Yorumlara yaz 👇", alt=480),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "cagri"]
VURGU = ["şaka.", "bilmiyoruz.", "değiliz.", "okuma", "kolunu.", "horozu", "kırılır.", "korkunç.", "musa'nın", "nuh"]
DUZELT = {"Kırılır.": "Kırılır!"}
MUZIK = {"src": "muzik/parti.wav", "seviye": 0.22, "konusmaSeviye": 0.07}
