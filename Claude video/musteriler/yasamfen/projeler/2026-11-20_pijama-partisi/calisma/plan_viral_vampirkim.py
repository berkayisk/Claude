# Viral 4 — "Sence vampir kim?" tahmin (akşam, blurlu). 4 şüpheli: #40, #50, #37 (doktor), #8 → ifşa.
def s(no, bas, sn=1.6, **k): return broll(no, bas, bas + sn, **{"zoom": [1.0, 1.08], "odak": [0.5, 0.45], **k})
PLAN = [
    s(7428, 11.0), s(7420, 21.0), s(7406, 1.6), s(7406, 0.0),
    s(7397, 1.5, 3.0, zoom=[1.0, 1.05]),
    s(7428, 12.6, 1.8), s(7420, 22.6, 1.8), s(7406, 3.2, 1.8, zoom=[1.08, 1.14]), s(7441, 9.0, 1.8),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.0, ust="VAMPİR KÖYLÜ", metin="SENCE VAMPİR\nKİM? 🧛", vurguSatir=True, y=1150, boyut=100),
    olay("etiket", kaynak=(7428, 11.05), sure=1.55, metin="1", kisi=(7428, 12.0, 40), boyut=80, ses="pop"),
    olay("etiket", kaynak=(7420, 21.05), sure=1.55, metin="2", kisi=(7420, 22.0, 50), boyut=80, ses="pop"),
    olay("etiket", kaynak=(7406, 1.65), sure=1.55, metin="3", kisi=(7406, 2.2, 37), boyut=80, ses="pop"),
    olay("etiket", kaynak=(7406, 0.05), sure=1.55, metin="4", kisi=(7406, 1.0, 8), boyut=80, ses="pop"),
    olay("karart", kaynak=(7397, 1.5), sure=3.0, seviye=0.55),
    olay("baslik", kaynak=(7397, 1.55), sure=2.9, metin="TAHMİNİNİ\nYORUMA YAZ 👇", vurguSatir=True, y=760, boyut=96, sfx=False),
    olay("sayac", kaynak=(7397, 1.5), sure=3.0, saniye=3, y=1350),
    olay("etiket", kaynak=(7428, 12.65), sure=1.75, metin="1 → 🧛 VAMPİR", y=420, boyut=58, ses="boom"),
    olay("etiket", kaynak=(7420, 22.65), sure=1.75, metin="2 → 🧛 VAMPİR", y=420, boyut=58, ses="boom"),
    olay("etiket", kaynak=(7406, 3.25), sure=1.75, metin="3 → 🩺 DOKTOR", y=420, boyut=58, renk="#14967A", ses="pop"),
    olay("etiket", kaynak=(7441, 9.05), sure=1.75, metin="4 → 🧛 VAMPİR", y=420, boyut=58, ses="boom"),
    olay("cagri", kaynak=(7441, 9.4), sure=1.4, metin="Kaç tanesini bildin? 👀", altMetin="Yorumlara yaz 👇", alt=420),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "cagri"]
MUZIK = {"src": "muzik/gizem.wav", "seviye": 0.45}
