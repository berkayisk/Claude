# Vampir Köylü #2 — "Vampir olduğunu saklayanlar 🤫": savunmalar, suçlamalar, komik anlar
# Kanca: #8 (vampir) kendini savunuyor → rol kartı "VAMPİR" ile ifşa. Altyazılar elle.
Z = dict(zoom=[1.0, 1.05], odak=[0.5, 0.45])
PLAN = [
    klip(7441, 1.2, 8.3, zoom=[1.05, 1.15], odak=[0.5, 0.4], yazi="Onlar benim üzerime geldi ve onlar öldü. Ben onların tekrar üzerime geleceğini bile bile neden onları öldüreyim yani, mantıken?"),
    broll(7441, 8.3, 10.6, zoom=[1.15, 1.2], odak=[0.5, 0.4]),
    klip(7407, 1.75, 3.2, gecis="yumusak", **Z, yazi="Bence öğrencilerden biri oyunda var."),
    klip(7408, 8.6, 11.6, **Z, yazi="Ama sesi bol geldi, sesi bol geldi."),
    klip(7440, 3.6, 5.9, zoom=[1.05, 1.1], odak=[0.5, 0.45], yazi="Bu da sessiz sessiz duruyor valla."),
    klip(7424, 0.0, 2.1, zoom=[1.05, 1.1], odak=[0.5, 0.45], yazi="Siz beni elemeye çalışıyorsunuz!"),
    klip(7461, 0.0, 2.05, zoom=[1.0, 1.08], odak=[0.5, 0.45], yazi="Neyse, gözünü kapasana. Doktor demiş."),
    klip(7459, 1.4, 2.25, zoom=[1.05, 1.1], odak=[0.5, 0.45], yazi="Kızım ölüyorum, ölüyorum!"),
    klip(7459, 5.2, 7.75, zoom=[1.1, 1.14], odak=[0.5, 0.45], punch=[{"t": 7.0, "olcek": 1.1}], yazi="Dört oldu, dört! Gerçek şok!"),
    klip(7428, 23.3, 24.8, gecis="yumusak", zoom=[1.0, 1.06], odak=[0.5, 0.5], yazi="Vampirler birbirini yiyor!"),
    broll(7420, 21.0, 24.4, zoom=[1.0, 1.06], odak=[0.5, 0.45]),
    broll(7428, 11.0, 13.2, zoom=[1.0, 1.05], odak=[0.5, 0.5]),
    broll(7406, 0.0, 3.0, zoom=[1.0, 1.06], odak=[0.5, 0.45]),
]
OLAYLAR = [
    olay("etiket", zaman=0.15, sure=3.4, metin="Masum görünüyor değil mi? 🤔", y=300, boyut=48, renk="#2A2A2A", ses="pop"),
    olay("rol", kaynak=(7441, 8.35), sure=2.3, rol="vampir", cevirmeKare=4, genislik=440, y=820),
    olay("etiket", kaynak=(7441, 8.6), sure=2.0, metin="KENDİSİ VAMPİR 🤫", y=1360, boyut=56),
    olay("baslik", kaynak=(7407, 1.8), sure=1.6, metin="SUÇLAMALAR\nBAŞLADI 🔥", vurguSatir=True, y=260, boyut=84, sfx=False),
    olay("etiket", kaynak=(7461, 0.1), sure=1.9, metin="🧛 VAMPİR", kisi=(7461, 1.0, 50), ses="boom"),
    olay("etiket", kaynak=(7459, 7.0), sure=0.8, metin="😱", y=520, boyut=90),
    olay("etiket", kaynak=(7428, 23.4), sure=1.4, metin="😂", y=520, boyut=90),
    olay("baslik", kaynak=(7420, 21.0), sure=3.3, ust="İFŞA 🧛", metin="VAMPİRLER", y=260, boyut=110, vurguSatir=False),
    olay("etiket", kaynak=(7420, 21.1), sure=3.2, metin="🧛", kisi=(7420, 22.0, 50), boyut=70, sfx=False),
    olay("etiket", kaynak=(7428, 11.05), sure=2.1, metin="🧛", kisi=(7428, 12.0, 40), boyut=70, ses="boom"),
    olay("etiket", kaynak=(7406, 0.05), sure=2.9, metin="🧛", kisi=(7406, 2.0, 8), boyut=70, ses="boom"),
    olay("etiket", kaynak=(7406, 0.3), sure=2.7, metin="🩺", kisi=(7406, 2.0, 37), boyut=70, sfx=False),
    olay("cagri", kaynak=(7406, 0.6), sure=2.4, metin="Sen tahmin edebilir miydin? 👀", altMetin="Yorumlara yaz 👇", alt=380),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "cagri"]
VURGU = ["mantıken?", "öğrencilerden", "sessiz", "elemeye", "doktor", "ölüyorum,", "ölüyorum!", "dört!", "şok!", "yiyor!"]
MUZIK = {"src": "muzik/gizem.wav", "seviye": 0.24, "konusmaSeviye": 0.08}
