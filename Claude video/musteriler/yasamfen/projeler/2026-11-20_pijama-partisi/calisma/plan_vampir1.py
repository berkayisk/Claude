# Vampir Köylü #1 — YENİ AKIŞ (geri bildirim 5): oyun anlatımı → 4 vampir + 1 doktor tanıtımı (soytarı bilinmiyor)
# → birkaç tartışma → oyun sonu (köylüler kazandı). Nefes/ııı: sıkı kesim (kelimesiz bölgeler atılır). Eski: plan_vampir1_eski.py
# Roller (kullanıcı): #8 kırmızı kazaklı hoca, #40 beyaz kazaklı genç, #50 kıvırcık saçlı kız = vampir; 4. vampir bilinmiyor; #37 doktor.
Z = dict(zoom=[1.0, 1.05], odak=[0.5, 0.5])
def tanit(no, bas, sn=1.7, **k): return broll(no, bas, bas + sn, **{"zoom": [1.0, 1.08], "odak": [0.5, 0.45], **k})
PLAN = [
    # 1) OYUN ANLATIMI
    klip(7393, 0.0, 5.1, zoom=[1.06, 1.0], odak=[0.5, 0.45], yazi="Şimdi dört tane vampir seçeceğim. Dört vampir seçeceğiz."),
    klip(7393, 6.5, 7.95, **Z, yazi="Bir tane doktor seçiyoruz."),
    klip(7393, 13.3, 16.4, **Z, yazi="Bir tane de soytarı seçiyoruz. Soytarı kendini astırmaya çalışıyor."),
    klip(7395, 4.7, 8.0, **Z, yazi="Bazı turlar iki kişiyi öldürecek vampirler, haberiniz olsun."),
    # 2) ROLLER: 4 vampir + 1 doktor
    tanit(7428, 11.0, gecis="yumusak"),
    tanit(7420, 21.0),
    tanit(7406, 0.0, 1.6),
    tanit(7393, 18.0, 1.6),
    tanit(7406, 1.6, 1.6, zoom=[1.08, 1.14]),
    # 3) TARTIŞMALAR
    klip(7404, 7.9, 13.4, gecis="yumusak", zoom=[1.0, 1.08], odak=[0.5, 0.5], yazi="Doktor kendini koruyarak doğru kişiyi koruduğu için bir kişi öldü. Normalde iki kişi ölmesi lazımdı."),
    klip(7407, 1.75, 3.12, sabit=True, **Z, yazi="Bence öğrencilerden biri oyunda var."),
    klip(7408, 8.6, 13.7, zoom=[1.0, 1.06], odak=[0.5, 0.45], yazi="Ama sesi bol geldi, sesi bol geldi."),
    klip(7440, 3.6, 5.9, zoom=[1.05, 1.1], odak=[0.5, 0.45], yazi="Bu da sessiz sessiz duruyor valla."),
    klip(7424, 0.0, 2.53, sabit=True, zoom=[1.05, 1.1], odak=[0.5, 0.45], yazi="Siz beni elemeye çalışıyorsunuz, köylü oyunu dediğiniz için."),
    klip(7441, 4.17, 9.0, sabit=True, zoom=[1.05, 1.14], odak=[0.5, 0.4], yazi="Ben onların tekrar üzerime geleceğini bile bile neden onları öldüreyim yani, mantıken?"),
    # 4) OYUN SONU: son oylamalar → köylüler kazandı
    klip(7459, 5.2, 8.05, gecis="yumusak", zoom=[1.08, 1.14], odak=[0.5, 0.45], punch=[{"t": 7.0, "olcek": 1.1}], yazi="Dört oldu, dört! Gerçek şok!"),
    klip(7466, 9.7, 13.6, sabit=True, zoom=[1.0, 1.08], odak=[0.5, 0.5], yazi="Bir, iki, üç."),
    broll(7465, 0.5, 3.4, zoom=[1.0, 1.08], odak=[0.5, 0.5]),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.6, ust="YAŞAMFEN PİJAMA PARTİSİ", metin="VAMPİR\nKÖYLÜ", vurguSatir=True, alt="Hocalar vs öğrenciler 🧛", y=380, boyut=140),
    olay("rol", kaynak=(7393, 2.8), sure=2.2, rol="vampir", cevirmeKare=6, genislik=400, y=760),
    olay("rol", kaynak=(7393, 6.6), sure=1.4, rol="doktor", cevirmeKare=4, genislik=400, y=760),
    olay("rol", kaynak=(7393, 13.4), sure=3.0, rol="soytari", cevirmeKare=6, genislik=400, y=760),
    # Roller
    olay("baslik", kaynak=(7428, 11.05), sure=1.6, ust="ROLLER", metin="4 VAMPİR\n+ 1 DOKTOR", vurguSatir=True, y=240, boyut=86, sfx=False),
    olay("etiket", kaynak=(7428, 11.1), sure=1.6, metin="🧛 VAMPİR 1", kisi=(7428, 12.0, 40), ses="boom"),
    olay("etiket", kaynak=(7420, 21.05), sure=1.65, metin="🧛 VAMPİR 2", kisi=(7420, 22.0, 50), ses="boom"),
    olay("etiket", kaynak=(7406, 0.05), sure=1.55, metin="🧛 VAMPİR 3", kisi=(7406, 1.0, 8), ses="boom"),
    olay("rol", kaynak=(7393, 18.05), sure=1.55, rol="vampir", kisi="4. VAMPİR ❓", cevirmeKare=3, genislik=380, y=800),
    olay("etiket", kaynak=(7406, 1.65), sure=1.55, metin="🩺 DOKTOR", kisi=(7406, 2.2, 37), renk="#14967A", ses="pop"),
    # Tartışmalar
    olay("baslik", kaynak=(7404, 7.95), sure=1.5, metin="TARTIŞMA\nBAŞLADI 🔥", vurguSatir=True, y=240, boyut=86, sfx=False),
    olay("etiket", kaynak=(7441, 7.3), sure=1.7, metin="🧛 (kendisi vampir 🤫)", y=1220, boyut=44, renk="#2A2A2A", sfx=False),
    # Oyun sonu
    olay("baslik", kaynak=(7459, 5.25), sure=1.5, metin="SON\nOYLAMA 🗳️", vurguSatir=True, y=240, boyut=86, sfx=False),
    olay("etiket", kaynak=(7465, 0.55), sure=2.8, metin="🏆 KÖYLÜLER KAZANDI!", y=420, boyut=56, ses="basari"),
    olay("cagri", kaynak=(7465, 1.6), sure=1.8, metin="Sen vampirleri bulabilir miydin? 👀", altMetin="Yorumlara yaz 👇", alt=460),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "cagri"]
VURGU = ["vampir", "vampirler,", "doktor", "soytarı", "öğrencilerden", "sessiz", "elemeye", "mantıken?", "dört!", "şok!"]
MUZIK = {"src": "muzik/gizem.wav", "seviye": 0.24, "konusmaSeviye": 0.08}
