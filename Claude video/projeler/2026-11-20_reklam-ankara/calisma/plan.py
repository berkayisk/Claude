"""Reklam planı -> src/reels.json (Reels şablonu). Sıkı kurgu kuralları: CLAUDE.md 'Reels / talking-head kuralları'"""
import json, wave, numpy as np

FPS = 30
KEL = json.load(open("calisma/kelimeler.json"))
# Doğru denemelerin kelimeleri (temiz sesten ayrı çözümleme)
KEL["IMG_7285"] = [w for w in KEL["IMG_7285"] if 11.55 <= w["s"] < 15.0] + [{"w": w, "s": s, "e": e} for w, s, e in [
    ("Sen", 10.06, 10.42), ("de", 10.42, 10.58), ("artık", 10.58, 10.74), ("defteri", 10.74, 11.10), ("kapat,", 11.10, 11.40), ("gel", 11.48, 11.60),
    ("Kontenjanlar", 35.05, 35.72), ("sınırlı,", 35.72, 36.12), ("yerler", 36.24, 36.56), ("dolmadan", 36.56, 36.86), ("yerini", 36.86, 37.10),
    ("ayırtmak", 37.10, 37.38), ("için", 37.38, 37.50), ("bana", 37.50, 37.68), ("mesaj", 37.68, 37.96), ("atmayı", 37.96, 38.24), ("veya", 38.24, 38.46),
    ("yorumlara", 38.46, 38.82), ("Ankara", 38.82, 39.06), ("yazmayı", 39.06, 39.30), ("unutma.", 39.30, 39.62)]]
for k in KEL:
    m = []
    for w in sorted(KEL[k], key=lambda w: w["s"]):
        if m and w["w"].startswith("-"): m[-1] = {"w": m[-1]["w"] + w["w"], "s": m[-1]["s"], "e": w["e"]}
        else: m.append(dict(w))
    KEL[k] = m
DUZELT = {"Aralsık": "Aralık", "Günü": "günü", "COZZONE'da": "COZONE'da", "yorumları": "yorumlara"}

S = {}
def ses(n):
    if n not in S:
        w = wave.open(f"calisma/ses_temiz/{n}_16k.wav"); S[n] = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return S[n]
def db(n, t, win=0.02):
    a = ses(n)[max(0, int(t * 16000)): int((t + win) * 16000)]
    return 20 * np.log10(float(np.sqrt((a ** 2).mean())) + 1e-9) if len(a) else -99

SES_ESIK, MIN_KES, KALAN = -38, 0.12, 0.035
HARIC = {}
BIRIMLER = [
    ("kanca", "IMG_7278", 1.10, 3.50), ("vaat", "IMG_7279", 0.0, 6.6), ("tarih", "IMG_7280", 9.6, 12.8),
    ("davet", "IMG_7285", 10.0, 14.8), ("cagri", "IMG_7285", 34.9, 39.8),
]

def kelime_duzelt(n, w):
    s, e = w["s"], w["e"]
    if e - s >= 0.5:
        ts = np.arange(s, e, 0.01); son = None; i = 0
        while i < len(ts):
            if db(n, ts[i]) < SES_ESIK:
                j = i
                while j < len(ts) and db(n, ts[j]) < SES_ESIK: j += 1
                if (j - i) * 0.01 >= 0.2: son = ts[j - 1] + 0.01
                i = j
            else: i += 1
        if son and son < e - 0.08: s = float(son)
    return {"w": DUZELT.get(w["w"], w["w"]), "s": s, "e": e}

ESIK = {}
def esik(n, a, b):
    """çekime uyarlanır: zemin gürültüsü (10. yüzdelik) + 7 dB, en az -38 dB"""
    if n not in ESIK:
        e = [db(n, t, 0.01) for t in np.arange(a, b, 0.01)]
        ESIK[n] = max(-38.0, float(np.percentile(e, 10)) + 7)
        print(f"  {n}: konuşma eşiği {ESIK[n]:.1f} dB")
    return ESIK[n]
def alt_araliklar(n, a, b, ks, anahtar):
    ts = np.arange(a, b, 0.01)
    th = esik(n, a, b)
    konusma = np.array([db(n, t, 0.01) > th for t in ts])
    for x, y in HARIC.get(anahtar, []): konusma[(ts >= x) & (ts < y)] = False
    bolg = []; i = 0
    while i < len(ts):
        if konusma[i]:
            j = i
            while j < len(ts) and konusma[j]: j += 1
            bolg.append([ts[i], ts[j - 1] + 0.01]); i = j
        else: i += 1
    m = []
    for x, y in bolg:
        if m and x - m[-1][1] < MIN_KES: m[-1][1] = y
        else: m.append([x, y])
    def kelimeli(x, y): return any(x - 0.05 <= (w["s"] + w["e"]) / 2 <= y + 0.05 or (w["s"] < y and w["e"] > x and min(y, w["e"]) - max(x, w["s"]) > 0.08) for w in ks)
    m = [(x, y) for x, y in m if kelimeli(x, y)]
    out = []
    for x, y in m:
        x2, y2 = max(a, x - KALAN), min(b + 0.2, y + KALAN)
        if out and x2 <= out[-1][1]: out[-1] = (out[-1][0], y2)
        else: out.append((x2, y2))
    return [(x, y) for x, y in out if y - x >= 0.15]

# Çekimler tek parça işlenir (kesme sadece gerçek sessizlikte); anlam bölümleri sadece grafik zamanlaması için
CEKIMLER = [("IMG_7278", 1.10, 3.50), ("IMG_7279", 0.0, 6.6), ("IMG_7280", 9.6, 12.8), ("IMG_7285", 10.0, 14.8), ("IMG_7285", 34.9, 39.8)]
def birim_bul(n, t):
    for (k, nn, a, b) in BIRIMLER:  # aynı çekim iki kez kullanılabilir: aralıkla ayırt edilir
        if nn == n and a <= t < b: return k
    return "?"
parcalar, altyazi, tl = [], [], 0.0
for (n, a, b) in CEKIMLER:
    ks = [kelime_duzelt(n, w) for w in KEL[n] if a <= (w["s"] + w["e"]) / 2 < b]
    ks = [w for w in ks if w["w"]]
    ar = alt_araliklar(n, a, b, ks, n)
    hedef = []
    for w in ks:
        o = [min(y, w["e"]) - max(x, w["s"]) for (x, y) in ar]
        hedef.append(int(np.argmax(o)) if o and max(o) > 0 else (int(np.argmin([min(abs((w["s"] + w["e"]) / 2 - x), abs((w["s"] + w["e"]) / 2 - y)) for x, y in ar])) if ar else -1))
    zs = 0
    for j, (x, y) in enumerate(ar):
        fa, fb = int(np.floor(x * FPS)), int(np.ceil(y * FPS))
        if fb - fa < 6: continue
        bas, son = fa / FPS, fb / FPS
        for w, h in zip(ks, hedef):
            if h == j:
                s2 = min(max(bas, w["s"]), son - 0.1) - bas + tl; e2 = min(son, w["e"]) - bas + tl
                altyazi.append({"w": w["w"], "s": round(s2, 3), "e": round(max(e2, s2 + 0.1), 3), "birim": birim_bul(n, (w["s"] + w["e"]) / 2)})
        parcalar.append({"src": f"{n}_dikey.mp4", "ses": f"{n}_ses.wav", "bas": bas, "kare": fb - fa, "zoom": zs % 2 == 1})
        tl += (fb - fa) / FPS; zs += 1
# kapanış kartı için konuşmasız kuyruk (çekim devam ediyor)
KUYRUK = ("IMG_7285", 39.70, 41.10)
fa, fb = int(np.floor(KUYRUK[1] * FPS)), int(np.ceil(KUYRUK[2] * FPS))
parcalar.append({"src": f"{KUYRUK[0]}_dikey.mp4", "ses": f"{KUYRUK[0]}_ses.wav", "bas": fa / FPS, "kare": fb - fa, "zoom": False})
tl_konusma = tl; tl += (fb - fa) / FPS
BZ = {}
for k, *_ in BIRIMLER:
    ws = [w for w in altyazi if w["birim"] == k]
    BZ[k] = (round(ws[0]["s"] - 0.05, 3), round(ws[-1]["e"] + 0.05, 3))

def kucuk(x): return x.replace("İ", "i").replace("I", "ı").lower()   # Türkçe büyük/küçük harf
def kz(birim, parca, sonra=0.0):
    for w in altyazi:
        if w["birim"] == birim and kucuk(parca) in kucuk(w["w"]) and w["s"] >= BZ[birim][0] + sonra: return w["s"]
    raise SystemExit(f"bulunamadı: {birim} {parca}")
B = lambda k: BZ[k][0]
E = lambda k: BZ[k][1]

olaylar = [
    {"tip": "baslik", "s": 0.0, "son": kz("kanca", "defterini") - 0.05, "satir1": "ANKARA", "satir2": "6 Aralık · sadece 100 kişi", "buyuk": True, "anlik": True},
    {"tip": "defter", "s": kz("kanca", "defterini") - 0.05, "son": E("kanca") + 0.35, "kapat": kz("kanca", "kapatıyoruz") + 0.15, "kapakYazi": "ANKARA", "damga": "KAPANDI"},
    {"tip": "rozet", "s": E("kanca") + 0.2, "son": tl, "metin": "📍 ANKARA · 6 ARALIK · 100 KİŞİ"},
    {"tip": "liste", "isaret": "carpi", "s": kz("vaat", "şirket") - 0.1, "son": E("vaat"), "ogeler": [["Şirket kurmadan", kz("vaat", "şirket")], ["Stok tutmadan", kz("vaat", "stok")], ["Sermaye bağlamadan", kz("vaat", "sermaye")]]},
    {"tip": "etkinlik", "s": B("tarih"), "son": E("tarih") + 0.15, "satirlar": [["📅", "6 Aralık Pazar", kz("tarih", "6")], ["🕑", "14.00 – 17.00", kz("tarih", "pazar")], ["📍", "COZONE · ODTÜ Teknokent", kz("tarih", "odtü")]], "alt": "🎟️ Katılım 250 TL"},
    {"tip": "koltuk", "s": B("davet"), "son": E("davet") + 0.1, "ust": "KONTENJAN", "baslik": "SADECE 100 KİŞİ", "fiyat": "250 TL"},
    {"tip": "baslik", "s": B("cagri"), "son": kz("cagri", "yerini") - 0.05, "satir1": "YERLER DOLMADAN", "satir2": "kontenjan sınırlı"},
    {"tip": "cagri2", "s": kz("cagri", "yerini") - 0.05, "son": tl_konusma + 0.1, "yorum_t": kz("cagri", "ankara"), "yorum": "Ankara"},
    {"tip": "kapanis", "s": tl_konusma + 0.05, "son": tl, "satir1": "6 Aralık · 14.00", "satir2": "COZONE · ODTÜ Teknokent", "etiket": "SADECE 100 KİŞİ · 250 TL", "etiketRenk": "turuncu"},
]
vurgu = ["ankara", "defterini", "kapatıyoruz", "şirket", "kurmadan", "stok", "tutmadan", "sermaye", "bağlamadan", "sıfırdan", "6", "aralık", "pazar",
         "odtü", "teknokent", "defteri", "kapat", "yüz", "yüze", "ankara'da", "ilk", "adımını", "kontenjanlar", "sınırlı", "dolmadan", "mesaj"]
json.dump({"fps": FPS, "parcalar": parcalar, "altyazi": altyazi, "olaylar": olaylar, "vurgu": vurgu, "toplamKare": sum(p["kare"] for p in parcalar)},
          open("src/reels.json", "w"), ensure_ascii=False, indent=1)
print(f"toplam {tl:.1f} sn, {len(parcalar)} parça")
for k, (a, b) in BZ.items(): print(f"  {k}: {a:.2f}-{b:.2f}")
print(" ".join(w["w"] for w in altyazi))
