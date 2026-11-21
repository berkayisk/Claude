# Vampir Köylü #1 — oyunun akışı: roller → gece → vampirler uyanıyor → sabah → elenenler
# Ses gürültülü: altyazılar elle (yazi=...). Roller (kullanıcı): #37 doktor, #8/#40/#50 vampir. Soytarı bilinmiyor.
Z = dict(zoom=[1.0, 1.05], odak=[0.5, 0.5])
PLAN = [
    klip(7393, 0.0, 4.75, zoom=[1.08, 1.0], odak=[0.5, 0.45], yazi="Şimdi dört tane vampir seçeceğim. Dört vampir seçeceğiz."),
    klip(7393, 6.5, 7.95, **Z, yazi="Bir tane doktor seçiyoruz."),
    klip(7393, 13.3, 16.4, **Z, yazi="Bir tane de soytarı seçiyoruz. Soytarı kendini astırmaya çalışıyor."),
    klip(7395, 4.7, 8.0, **Z, yazi="Bazı turlar iki kişiyi öldürecek vampirler, haberiniz olsun."),
    # GECE
    klip(7397, 1.3, 4.0, gecis="siyah", zoom=[1.0, 1.08], odak=[0.5, 0.5], yazi="Kapat gözünü, kapat, kapat gözünü"),
    klip(7397, 9.4, 12.1, zoom=[1.08, 1.12], odak=[0.5, 0.5], yazi="Evet, vampiri seçiyoruz, vampiri seçiyoruz."),
    klip(7420, 10.5, 13.5, zoom=[1.0, 1.05], odak=[0.5, 0.5], yazi="Vampirleri görebilir miyiz?"),
    broll(7420, 21.0, 24.2, zoom=[1.0, 1.06], odak=[0.5, 0.45]),      # #50 gözü açık
    broll(7420, 15.0, 17.6, zoom=[1.0, 1.06], odak=[0.5, 0.5]),       # #40
    klip(7399, 5.4, 8.4, zoom=[1.0, 1.05], odak=[0.5, 0.5], yazi="Doktoru seçiyoruz, doktoru seçiyoruz."),
    klip(7400, 0.2, 3.65, zoom=[1.0, 1.05], odak=[0.5, 0.5], yazi="Deliyi seçiyoruz. Evet. Deliyi de seçtik."),
    # SABAH
    klip(7420, 44.1, 45.2, gecis="beyaz", zoom=[1.0, 1.04], odak=[0.5, 0.5], yazi="Tamam, günaydın."),
    klip(7404, 7.9, 13.4, zoom=[1.0, 1.08], odak=[0.5, 0.5], yazi="Doktor kendini koruyarak doğru kişiyi koruduğu için bir kişi öldü. Normalde iki kişi ölmesi lazımdı."),
    klip(7402, 0.7, 1.6, zoom=[1.05, 1.1], odak=[0.5, 0.5], punch=[{"t": 0.8, "olcek": 1.12}], yazi="Ben öldüm."),
    # 2. GECE
    klip(7428, 2.9, 7.1, gecis="siyah", zoom=[1.0, 1.06], odak=[0.5, 0.5], yazi="Vampirler iki kişiyi öldürebilir mi? Vampirler iki kişiyi öldürüyor."),
    klip(7428, 23.3, 24.8, zoom=[1.06, 1.1], odak=[0.5, 0.5], punch=[{"t": 23.4, "olcek": 1.1}], yazi="Vampirler birbirini yiyor!"),
    klip(7439, 35.0, 36.1, gecis="beyaz", zoom=[1.0, 1.05], odak=[0.5, 0.5], yazi="Sabah oldu."),
    klip(7412, 4.4, 5.9, zoom=[1.0, 1.06], odak=[0.5, 0.5], yazi="Ezgi Hocam ile Ömer gitti."),
    broll(7412, 6.0, 9.2, zoom=[1.06, 1.12], odak=[0.5, 0.5]),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.6, ust="YAŞAMFEN PİJAMA PARTİSİ", metin="VAMPİR\nKÖYLÜ", vurguSatir=True, alt="Hocalar vs öğrenciler 🧛", y=380, boyut=140),
    olay("rol", kaynak=(7393, 6.6), sure=2.0, rol="doktor", cevirmeKare=6, genislik=420, y=760),
    olay("rol", kaynak=(7393, 13.4), sure=3.1, rol="soytari", cevirmeKare=6, genislik=420, y=760),
    olay("rol", kaynak=(7395, 4.8), sure=3.2, rol="vampir", cevirmeKare=6, genislik=420, y=760),
    olay("faz", kaynak=(7397, 1.3), sure=2.4, faz="gece", alt="Herkes gözlerini kapatsın…"),
    olay("etiket", kaynak=(7420, 21.2), sure=2.9, metin="🧛 VAMPİR", kisi=(7420, 22.0, 50), ses="boom"),
    olay("etiket", kaynak=(7420, 15.1), sure=2.4, metin="🧛 VAMPİR", kisi=(7420, 15.5, 40), ses="boom"),
    olay("etiket", kaynak=(7399, 5.5), sure=2.8, metin="🩺 DOKTOR UYANSIN", y=420, renk="#14967A"),
    olay("etiket", kaynak=(7400, 0.3), sure=3.2, metin="🃏 SOYTARI UYANSIN", y=420, renk="#7A3DB8"),
    olay("faz", kaynak=(7420, 44.1), sure=1.6, faz="gunduz", alt="Köy uyanıyor"),
    olay("etiket", kaynak=(7404, 10.2), sure=3.0, metin="🩺 DOKTOR KURTARDI!", y=420, renk="#14967A", ses="basari"),
    olay("elendi", kaynak=(7402, 0.8), sure=1.4, y=700),
    olay("faz", kaynak=(7428, 2.9), sure=1.8, faz="gece", alt="Vampirler acıktı…"),
    olay("etiket", kaynak=(7428, 23.4), sure=1.4, metin="😂", y=520, boyut=90, ses="pop"),
    olay("faz", kaynak=(7439, 35.0), sure=1.6, faz="gunduz", alt="Kim gitti?"),
    olay("elendi", kaynak=(7412, 4.5), sure=1.8, y=700),
    olay("cagri", kaynak=(7412, 6.0), sure=3.2, metin="Sen olsan kimi asardın? 👀", altMetin="Vampirleri 2. videoda açıklıyoruz 🧛", alt=460),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "faz", "cagri"]
VURGU = ["vampir", "vampiri", "vampirler", "doktor", "doktoru", "soytarı", "deliyi", "öldüm", "günaydın", "öldü", "yiyor!", "sabah", "gitti"]
MUZIK = {"src": "muzik/gizem.wav", "seviye": 0.24, "konusmaSeviye": 0.08}
