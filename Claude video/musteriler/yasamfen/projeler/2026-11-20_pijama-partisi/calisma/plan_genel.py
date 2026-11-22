# Etkinlik genel videosu — DİNAMİK sürüm (geri bildirim 5): müzikli (parti, 124 bpm), vuruşa oturan kısa planlar,
# arada 4 kısa ses anı (yanlış cevap / doğru / vampir / teşekkür), bölüm etiketleri. Eski sürüm: plan_genel_eski.py
V = 60 / 124                  # bir vuruş ≈ 0.484 sn
def b(no, bas, vurus=2, **k): return broll(no, bas, bas + vurus * V, **{"zoom": [1.0, 1.08], "odak": [0.5, 0.5], **k})
PLAN = [
    # Açılış: hızlı kombin montajı + kanca başlık
    b(7381, 1.0), b(7383, 4.0), b(7382, 0.5), b(7392, 0.2),
    # Bilgi yarışması
    b(7353, 13.0, 3, zoom=[1.15, 1.25], odak=[0.6, 0.4]),
    klip(7356, 80.0, 81.85, sabit=True, zoom=[1.08, 1.12], odak=[0.5, 0.55], punch=[{"t": 80.1, "olcek": 1.08, "sure": 5}]),
    b(7361, 1.0),
    klip(7357, 165.9, 167.35, sabit=True, zoom=[1.05, 1.1], odak=[0.5, 0.55], punch=[{"t": 166.81, "olcek": 1.13}]),
    klip(7370, 28.3, 30.8, sabit=True, kelimesiz=True, zoom=[1.04, 1.12], odak=[0.5, 0.6]),
    # Vampir köylü
    b(7397, 1.3, 3, gecis="yumusak"),
    klip(7428, 23.3, 24.8, sabit=True, zoom=[1.04, 1.1], odak=[0.5, 0.5], yazi="Vampirler birbirini yiyor!"),
    b(7420, 21.2, 3, zoom=[1.0, 1.06], odak=[0.5, 0.45]),
    klip(7441, 4.17, 9.0, sabit=True, zoom=[1.05, 1.14], odak=[0.5, 0.4], yazi="Ben onların tekrar üzerime geleceğini bile bile neden onları öldüreyim yani, mantıken?"),
    # Kapanış: dans + teşekkür
    b(7387, 0.3), b(7380, 0.2),
    klip(7485, 75.17, 77.84, sabit=True, gecis="yumusak", zoom=[1.0, 1.08], odak=[0.5, 0.35]),
    b(7392, 1.5, 4),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=3.8, ust="YAŞAMFEN KURS", metin="PİJAMA\nPARTİSİ 🎉", vurguSatir=True, y=300, boyut=130),
    olay("etiket", kaynak=(7353, 13.05), sure=1.4, metin="🧠 BİLGİ YARIŞMASI", y=420, boyut=56),
    olay("etiket", kaynak=(7357, 166.81), sure=0.9, metin="✅ DOĞRU!", y=420, boyut=60, ses="basari"),
    olay("etiket", kaynak=(7370, 28.35), sure=2.4, metin="🏆 POWERPUFF GIRLS", y=420, boyut=56, ses="basari"),
    olay("etiket", kaynak=(7397, 1.35), sure=1.4, metin="🧛 VAMPİR KÖYLÜ", y=420, boyut=56),
    olay("etiket", kaynak=(7420, 21.3), sure=1.3, metin="🧛", kisi=(7420, 22.0, 50), boyut=70, ses="boom"),
    olay("etiket", kaynak=(7387, 0.35), sure=1.8, metin="💃 KOMBİN ŞOV", y=420, boyut=56, sfx=False),
    olay("cagri", kaynak=(7392, 1.6), sure=1.9, metin="Başarı burada başlar.", altMetin="Yaşamfen Kurs 💪", alt=500),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "cagri"]
VURGU = ["yanlış", "doğru.", "vampirler", "mantıken?", "teşekkür"]
DUZELT = {}
MUZIK = {"src": "muzik/parti.wav", "seviye": 0.50, "konusmaSeviye": 0.14}
