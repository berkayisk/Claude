# Komik Anlar #2 — LGS yarışması + vampir köylü (blurlu vekiller). Kanca: "GÜLMEDEN İZLEYEMEZSİN 😂"
SIKI = True
Z = dict(zoom=[1.04, 1.1], odak=[0.5, 0.5])
P = lambda t, o=1.1: [{"t": t, "olcek": o, "sure": 6}]
PLAN = [
    klip(7356, 72.03, 75.05, zoom=[1.05, 1.1], odak=[0.5, 0.55]),                          # Cevabını alayım. Pankreas hocam.
    klip(7356, 80.0, 81.85, zoom=[1.1, 1.12], odak=[0.5, 0.55], punch=P(80.1, 1.08)),      # Bip. Yanlış cevap.
    klip(7367, 84.2, 89.0, gecis="yumusak", zoom=[1.05, 1.1], odak=[0.5, 0.55]),           # 3'e bölünebilen...
    klip(7367, 91.9, 92.8, zoom=[1.1, 1.1], odak=[0.5, 0.55]),                             # Yanlış cevap.
    klip(7367, 105.5, 108.2, zoom=[1.08, 1.14], odak=[0.5, 0.5], punch=P(107.06)),        # Ya sen ne fenasın ya.
    klip(7428, 23.3, 24.8, sabit=True, gecis="yumusak", zoom=[1.04, 1.1], odak=[0.5, 0.5], punch=P(23.4), yazi="Vampirler birbirini yiyor!"),
    klip(7409, 5.45, 7.38, sabit=True, zoom=[1.05, 1.12], odak=[0.5, 0.4], yazi="Dört vampir de az değil hocam ya!"),
    klip(7441, 4.17, 9.0, sabit=True, zoom=[1.05, 1.14], odak=[0.5, 0.4], yazi="Ben onların tekrar üzerime geleceğini bile bile neden onları öldüreyim yani, mantıken?"),
    broll(7441, 9.0, 10.4, zoom=[1.14, 1.18], odak=[0.5, 0.4]),
    klip(7368, 179.1, 186.4, gecis="yumusak", zoom=[1.0, 1.08], odak=[0.5, 0.5]),          # tren sorusu
    broll(7368, 190.0, 192.6, zoom=[1.1, 1.16], odak=[0.5, 0.5]),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.1, ust="YAŞAMFEN PİJAMA PARTİSİ", metin="GÜLMEDEN\nİZLEYEMEZSİN 😂", vurguSatir=True, y=300, boyut=104),
    olay("etiket", kaynak=(7367, 107.1), sure=1.0, metin="😂", y=520, boyut=90),
    olay("etiket", kaynak=(7428, 23.4), sure=1.3, metin="🧛😂", y=520, boyut=80),
    olay("etiket", kaynak=(7441, 9.05), sure=1.35, metin="KENDİSİ VAMPİR 🤫", y=1360, boyut=56, ses="boom"),
    olay("soru", kaynak=(7368, 179.2), sure=7.2, no="ŞAŞIRTMACA", soru="Elektrikli bir tren güneye gidiyor, rüzgâr kuzeyden esiyor. Trenin dumanı hangi yöne gider?", y=230),
    olay("cevap", kaynak=(7368, 190.05), sure=2.5, cevap="Elektrikli trenin dumanı olmaz! 😄", baslik="CEVAP", y=1300),
    olay("cagri", kaynak=(7368, 190.9), sure=1.7, metin="En çok hangisine güldün? 😂", altMetin="Yorumlara yaz 👇", alt=480),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "cagri", "soru"]
VURGU = ["pankreas", "yanlış", "fenasın", "kavga", "vampirler", "dört", "mantıken?"]
DUZELT = {}
MUZIK = {"src": "muzik/parti.wav", "seviye": 0.22, "konusmaSeviye": 0.07}
