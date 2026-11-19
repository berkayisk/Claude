"""Reklam planı -> src/reels.json (Reels şablonu). Sıkı kurgu kuralları: CLAUDE.md 'Reels / talking-head kuralları'"""
import json, wave, numpy as np

FPS = 30
KEL = json.load(open("calisma/kelimeler.json"))
# Tekrar denemeleri: doğru çekimin kelimeleri (temiz sesten / ayrı çözümleme)
KEL["IMG_7269"] = [w for w in KEL["IMG_7269"] if w["s"] >= 9.0] + [
    {"w": "E-ticarete", "s": 7.32, "e": 7.84}, {"w": "başlamak", "s": 7.84, "e": 8.24}, {"w": "istiyorsun", "s": 8.24, "e": 8.62},
    {"w": "ama", "s": 8.62, "e": 8.88}, {"w": "ne", "s": 8.88, "e": 9.04}]
KEL["IMG_7274"] = [w for w in KEL["IMG_7274"] if w["s"] >= 17.0] + [{"w": w, "s": s, "e": e} for w, s, e in [
    ("28", 10.80, 11.16), ("Kasım", 11.16, 11.58), ("Cumartesi", 11.58, 12.10), ("günü", 12.10, 12.38), ("Taşbaşı", 12.38, 12.84),
    ("Kültür", 12.84, 13.10), ("Merkezi'nde", 13.10, 13.54), ("olacağız.", 13.54, 13.84), ("İnternette", 14.10, 14.58), ("ne", 14.58, 14.72),
    ("yazık", 14.72, 14.96), ("ki", 14.96, 15.02), ("birçok", 15.02, 15.28), ("bilgi", 15.28, 15.52), ("kirliliği", 15.52, 15.92),
    ("var.", 15.92, 16.10), ("Biz", 16.30, 16.60), ("de", 16.60, 16.76), ("seni", 16.76, 17.10)]]
for k in KEL:
    m = []
    for w in sorted(KEL[k], key=lambda w: w["s"]):
        if m and w["w"].startswith("-"): m[-1] = {"w": m[-1]["w"] + w["w"], "s": m[-1]["s"], "e": w["e"]}
        else: m.append(dict(w))
    KEL[k] = m
DUZELT = {"e-Ticaret": "e-ticaret", "e-TCaret": "e-ticaret", "yapabilirim?''": "yapabilirim?", "Eski": "Eskişehir'deki", "Şehir'teki": "",
          "etkinlığımızda": "etkinliğimizde", "kililiğinden": "kirliliğinden"}

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
    ("problem", "IMG_7269", 7.20, 12.45), ("cozum", "IMG_7269", 12.55, 16.05), ("sorular", "IMG_7269", 16.10, 24.15),
    ("cevap", "IMG_7269", 24.15, 27.70), ("tarih", "IMG_7274", 10.70, 16.20), ("davet", "IMG_7274", 16.20, 24.50),
    ("mutlaka", "IMG_7274", 24.50, 28.90), ("cagri", "IMG_7274", 29.00, 36.05), ("kapanis", "IMG_7274", 36.05, 37.30),
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
CEKIMLER = [("IMG_7269", 7.20, 27.70), ("IMG_7274", 10.70, 37.30)]
def birim_bul(n, t):
    for (k, nn, a, b) in BIRIMLER:
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
    {"tip": "sorucevap", "s": kz("problem", "satacağını") - 0.15, "son": E("problem"), "ogeler": [["Ne satacağım?", kz("problem", "satacağını")], ["Müşteri nereden?", kz("problem", "müşteri")], ["Şirket nasıl kurulur?", kz("problem", "şirketi")]], "cevap": None},
    {"tip": "baslik", "s": kz("cozum", "eskişehir") - 0.1, "son": E("cozum"), "satir1": "ESKİŞEHİR", "satir2": "e-ticaret etkinliği", "buyuk": True},
    {"tip": "rozet", "s": E("cozum") - 0.3, "son": E("kapanis"), "metin": "📍 ESKİŞEHİR · 28 KASIM"},
    {"tip": "sorucevap", "s": B("sorular"), "son": E("cevap"), "ogeler": [["Sıfırdan nasıl başlarım?", kz("sorular", "sıfırdan")], ["Şirketsiz e-ticaret?", kz("sorular", "şirket")], ["Ürün & kargo derdi olmadan?", kz("sorular", "ürün")]], "cevap": kz("cevap", "cevap")},
    {"tip": "etkinlik", "s": B("tarih"), "son": kz("tarih", "internette") - 0.05, "satirlar": [["📅", "28 Kasım Cumartesi", kz("tarih", "28")], ["🕒", "14.00 – 17.00", kz("tarih", "cumartesi")], ["📍", "Taşbaşı Kültür Merkezi", kz("tarih", "taşbaşı")]], "alt": "Kırmızı Salon"},
    {"tip": "broll_kirlilik", "s": kz("tarih", "internette"), "son": E("tarih") + 0.15, "basliklar": ["10 günde zengin ol! 💸", "Dropshipping öldü ☠️", "Sermayesiz milyoner ol", "Bu ürün kesin patlar 🚀", "E-ticaret bitti!"]},
    {"tip": "davetiye", "s": kz("davet", "bulabileceğin") - 0.1, "son": B("mutlaka") - 0.05},
    {"tip": "liste", "s": B("mutlaka"), "son": E("mutlaka"), "ogeler": [["Kendi alan adınla mağaza", B("mutlaka") + 0.2], ["Hazır tedarikçi ekosistemi", B("mutlaka") + 1.1], ["Ücretsiz eğitimler", B("mutlaka") + 2.0], ["Mentor desteği", B("mutlaka") + 2.9]]},
    {"tip": "cagri2", "s": kz("cagri", "kaydolmak") - 0.1, "son": E("cagri"), "yorum_t": kz("cagri", "eskişehir")},
    {"tip": "kapanis", "s": B("kapanis") - 0.2, "son": E("kapanis")},
]
vurgu = ["e-ticarete", "satacağını", "müşteriyi", "şirketi", "bilmiyorsun", "eskişehir'de", "etkinliği", "sıfırdan", "kurmadan", "uğraşmadan", "gelir",
         "cevaplarını", "28", "kasım", "cumartesi", "taşbaşı", "kirliliği", "kirliliğinden", "davet", "mutlaka", "mesaj", "eskişehir", "ücretsiz"]
json.dump({"fps": FPS, "parcalar": parcalar, "altyazi": altyazi, "olaylar": olaylar, "vurgu": vurgu, "toplamKare": sum(p["kare"] for p in parcalar)},
          open("src/reels.json", "w"), ensure_ascii=False, indent=1)
print(f"toplam {tl:.1f} sn, {len(parcalar)} parça")
for k, (a, b) in BZ.items(): print(f"  {k}: {a:.2f}-{b:.2f}")
print(" ".join(w["w"] for w in altyazi))
