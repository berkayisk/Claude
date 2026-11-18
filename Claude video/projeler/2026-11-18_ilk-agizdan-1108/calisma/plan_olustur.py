"""Transkript + konuşmacı bloklarından kamera planı ve kurgu listesi üretir -> src/plan.json"""
import json
FPS = 30
d = json.load(open("calisma/transkript.json"))
SON = 701.6

# Konuşmacı blokları (transkriptten elle etiketlendi): (başlangıç, bitiş, kim)  S=sunucu K=konuk
bloklar = [
    (0.0, 50.35, "S"), (50.35, 51.05, "K"), (51.05, 51.6, "S"), (51.6, 52.8, "K"), (52.8, 55.4, "S"),
    (55.4, 82.0, "K"), (82.0, 112.15, "S"), (112.15, 176.0, "K"), (176.0, 176.37, "S"), (176.37, 445.6, "K"),
    (445.6, 463.2, "S"), (463.2, 469.5, "K"), (469.5, 488.3, "S"), (488.3, 629.0, "K"), (629.0, 642.4, "S"),
    (642.4, 674.4, "K"), (674.4, 678.5, "S"), (678.5, 679.7, "K"), (679.7, 685.0, "S"), (685.0, 692.4, "K"), (692.4, SON, "S"),
]
# Gülme anları -> geniş plan zorunlu
genis_zorunlu = [(316.0, 318.3), (414.5, 419.0)]
# Soru kartlarının girdiği kaynak zamanlar
kartlar = [89.52, 470.5, 629.7]  # 54.07 (tanıyabilir miyiz) kullanıcı isteğiyle kaldırıldı

# cümle sınırları (kesmeler buralara oturur)
sinirlar = sorted({round(s["start"], 2) for s in d} | {round(s["end"], 2) for s in d})

def sonraki_sinir(t):
    for s in sinirlar:
        if s >= t: return s
    return t

cekimler = []  # (bas, son, aci)
def ekle(a, b, aci):
    if b - a < 0.05: return
    if cekimler and cekimler[-1][2] == aci and abs(cekimler[-1][1] - a) < 0.01:
        cekimler[-1] = (cekimler[-1][0], b, aci)
    else:
        cekimler.append((a, b, aci))

for (a, b, kim) in bloklar:
    sure = b - a
    if sure < 3.0:
        ekle(a, b, "genis"); continue
    yakin = "konuk" if kim == "K" else "sunucu"
    t, sira = a, 0
    # konuk uzun konuşmalarda: yakın ~14 sn, geniş ~6 sn dönüşümlü; sunucuda yakın ~10 sn, geniş ~5 sn
    uzun, kisa = (14, 6) if kim == "K" else (10, 5)
    # kart sonrası ilk çekim geniş başlar (referans)
    while t < b - 0.05:
        aci = yakin if sira % 2 == 0 else "genis"
        hedef = t + (uzun if aci != "genis" else kisa)
        son = min(b, sonraki_sinir(hedef)) if hedef < b - 3 else b
        ekle(t, son, aci); t = son; sira += 1

# gülme anlarını geniş yap
def uygula_zorunlu(cek, a, b, aci):
    out = []
    for (x, y, c) in cek:
        if y <= a or x >= b: out.append((x, y, c)); continue
        if x < a: out.append((x, a, c))
        out.append((max(x, a), min(y, b), aci))
        if y > b: out.append((b, y, c))
    m = []
    for c in out:
        if m and m[-1][2] == c[2] and abs(m[-1][1] - c[0]) < 0.01: m[-1] = (m[-1][0], c[1], c[2])
        else: m.append(c)
    return m
for (a, b) in genis_zorunlu: cekimler = uygula_zorunlu(cekimler, a, b, "genis")

# kart sınırlarında çekimleri böl ki kart doğru yere girsin
for k in kartlar:
    yeni = []
    for (x, y, c) in cekimler:
        if x < k < y: yeni += [(x, k, c), (k, y, c)]
        else: yeni.append((x, y, c))
    cekimler = yeni

# kart sonrası ilk 2 sn kesin geniş, açılış 2.4 sn geniş
for k in kartlar: cekimler = uygula_zorunlu(cekimler, k, k + 2.0, "genis")
cekimler = uygula_zorunlu(cekimler, 0.0, 3.2, "genis")
# 2.5 sn'den kısa parçaları komşusuna kat (sert, rahatsız edici kesmeleri önle)
degisti = True
while degisti:
    degisti = False
    for i, (x, y, c) in enumerate(cekimler):
        if y - x < 2.5 and len(cekimler) > 1:
            j = i - 1 if i > 0 else i + 1
            if any(abs(x - k) < 0.01 for k in kartlar) and i + 1 < len(cekimler): j = i + 1
            a2, b2, c2 = cekimler[j]
            if j == i + 1 and any(abs(x - k) < 0.01 for k in kartlar): c2 = c  # kart sonrası açıyı koru (geniş)
            cekimler[j] = (min(a2, x), max(b2, y), c2); del cekimler[i]; degisti = True; break
# kart zamanlarında son kez böl
for k in kartlar:
    yeni = []
    for (x, y, c) in cekimler:
        if x < k < y: yeni += [(x, k, c), (k, y, c)]
        else: yeni.append((x, y, c))
    cekimler = yeni

m = []
for c in cekimler:
    if m and m[-1][2] == c[2] and not any(abs(c[0] - k) < 0.01 for k in kartlar): m[-1] = (m[-1][0], c[1], c[2])
    else: m.append(c)
cekimler = m
f = lambda s: int(round(s * FPS))
plan = {
    "fps": FPS,
    "fragman": [  # Az Sonra klipleri: kaynak saniye + açı
        {"bas": 544.95, "son": 548.75, "aci": "konuk"},
        {"bas": 143.75, "son": 152.10, "aci": "konuk"},
        {"bas": 580.00, "son": 587.40, "aci": "genis"},
        {"bas": 299.75, "son": 306.45, "aci": "konuk"},
        {"bas": 313.95, "son": 317.70, "aci": "genis"},
    ],
    "cekimler": [{"bas": round(a, 3), "son": round(b, 3), "aci": c} for (a, b, c) in cekimler],
    "kartlar": kartlar,
    "altBant": {"bas": 55.6, "sure": 9.0, "isim": "Kamer Değer", "unvan": "Mağazan Olsun", "rol": "Pazarlama Direktörü"},
    "aboneOl": {"bas": 693.6, "sure": 3.4},
    "instagram": {"bas": 696.7, "sure": 4.9, "hesaplar": [{"kullanici": "sifirdansatisa", "x": 1100, "y": 760}]},
    "son": SON,
}
json.dump(plan, open("src/plan.json", "w"), ensure_ascii=False, indent=1)
from collections import Counter
print(len(cekimler), "çekim;", Counter(c for _, _, c in cekimler))
for a, b, c in cekimler[:25]: print(f"{a:7.2f}-{b:7.2f} {b-a:5.1f}s {c}")
