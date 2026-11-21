# Pijama kombinleri geçidi — müzikle hızlı geçit, numaralı kombinler, "favorin hangisi?" çağrısı
B = lambda no, a, b, **k: broll(no, a, b, **{"zoom": [1.0, 1.06], "odak": [0.5, 0.5], **k})
PLAN = [
    B(7381, 1.0, 3.6),
    B(7380, 0.2, 2.9),
    B(7381, 11.5, 14.6),
    B(7382, 0.3, 3.6),
    B(7383, 3.6, 7.2),
    B(7387, 0.0, 3.4),
    B(7392, 0.0, 3.6),
    B(7387, 3.4, 4.6),
]
OLAYLAR = [
    olay("baslik", zaman=0.0, sure=2.5, ust="YAŞAMFEN PİJAMA PARTİSİ", metin="PİJAMA\nKOMBİNLERİ 💤", vurguSatir=True, y=260, boyut=110, sfx=False),
    olay("etiket", kaynak=(7380, 0.3), sure=2.5, metin="#1 Klasik ekose 🟥", y=300, boyut=50, sfx=False),
    olay("etiket", kaynak=(7381, 11.6), sure=2.9, metin="#2 Desen desen 🐆", y=300, boyut=50, sfx=False),
    olay("etiket", kaynak=(7382, 0.4), sure=3.1, metin="#3 Örümcek modu 🕷️", y=300, boyut=50, sfx=False),
    olay("etiket", kaynak=(7383, 3.7), sure=3.4, metin="#4 Peluş & köpekbalığı 🦈", y=300, boyut=46, sfx=False),
    olay("etiket", kaynak=(7387, 0.1), sure=3.2, metin="#5 Üçlü kombin ✨", y=300, boyut=50, sfx=False),
    olay("etiket", kaynak=(7392, 0.1), sure=3.4, metin="#6 Hocalar da sahnede 😎", y=300, boyut=46, sfx=False),
    olay("cagri", kaynak=(7387, 3.45), sure=1.15, metin="Favorin hangisi?", altMetin="Numarasını yorumlara yaz 👇", alt=460, sfx=False),
]
ALTYAZI_GIZLE_TIPLER = ["baslik", "cagri"]
MUZIK = None  # trend müzik Instagram'da eklenecek; video sessiz (efekt de yok)
