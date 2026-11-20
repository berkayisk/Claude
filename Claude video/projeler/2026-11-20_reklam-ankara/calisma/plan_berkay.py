"""Reklam planı -> src/reels.json (Reels şablonu). Sıkı kurgu kuralları: CLAUDE.md 'Reels / talking-head kuralları'"""
import json, wave, numpy as np

FPS = 30
KEL = json.load(open("calisma/kelimeler2.json"))
# 7287: "ODTÜ Teknokent COZONE'da 6 Aralık'ta buluşalım" ikinci deneme (29.15) kullanılır
# 7287: "Sen de her geç..." yarım deneme (18.05-19.9) atılır, ikinci "Sen de eğer gerçekten" (19.95) kullanılır
KEL["IMG_7287"] = [w for w in KEL["IMG_7287"] if (w["s"] < 24.95 or w["s"] >= 31.5) and not (18.0 <= w["s"] < 20.7)] + [{"w": w, "s": s, "e": e} for w, s, e in [
    ("Sen", 19.95, 20.17), ("de", 20.17, 20.33), ("eğer", 20.33, 20.45), ("gerçekten", 20.45, 20.85),
    ("ODTÜ", 29.15, 29.38), ("Teknokent,", 29.38, 29.86), ("COZONE'da", 29.90, 30.40), ("6", 30.40, 30.72), ("Aralık'ta", 30.72, 31.14), ("buluşalım.", 31.14, 31.50)]]
for k in KEL:
    m = []
    for w in sorted(KEL[k], key=lambda w: w["s"]):
        if m and (w["w"].startswith("-") or w["w"].startswith("'")): m[-1] = {"w": m[-1]["w"] + w["w"], "s": m[-1]["s"], "e": w["e"]}
        else: m.append(dict(w))
    KEL[k] = m
DUZELT = {"Sıfırda": "Sıfırdan", "ne-ticarete": "e-ticarete", "e-e-ticaret'e": "e-ticarete", "e-Ticaret'a": "e-ticarete", "e-icaret'te": "e-ticarete",
          "başlamık": "başlamak"}

S = {}
def ses(n):
    if n not in S:
        w = wave.open(f"calisma/ses_temiz/{n}_16k.wav"); S[n] = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return S[n]
def db(n, t, win=0.02):
    a = ses(n)[max(0, int(t * 16000)): int((t + win) * 16000)]
    return 20 * np.log10(float(np.sqrt((a ** 2).mean())) + 1e-9) if len(a) else -99

SES_ESIK, MIN_KES, KALAN = -38, 0.12, 0.035
HARIC = {"IMG_7287": [(18.0, 19.92)]}
# 7286 sonunda nefes/yankı -38 dB üstünde kalıyor: açı geçişi seri olsun diye eşik yükseltildi
ESIK_SABIT = {"IMG_7286": -30.0}
BIRIMLER = [
    ("problem", "IMG_7286", 0.0, 6.3), ("soru", "IMG_7287", 0.0, 3.1), ("evet", "IMG_7287", 3.1, 4.4), ("etkinlik", "IMG_7287", 4.4, 7.3),
    ("nasil", "IMG_7287", 7.3, 12.85), ("yol", "IMG_7287", 12.85, 17.9), ("cagri", "IMG_7287", 17.9, 24.95), ("tarih", "IMG_7287", 29.0, 31.54),
    ("kapanis", "IMG_7287", 31.54, 32.6),
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
    if n not in ESIK and n in ESIK_SABIT: ESIK[n] = ESIK_SABIT[n]
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
CEKIMLER = [("IMG_7286", 0.0, 6.3), ("IMG_7287", 0.0, 24.95), ("IMG_7287", 29.0, 32.6)]
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
KUYRUK = ("IMG_7287", 32.45, 33.65)
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
    {"tip": "baslik", "s": 0.0, "son": kz("problem", "elinde") - 0.1, "satir1": "ANKARA", "satir2": "6 Aralık · sadece 100 kişi", "buyuk": True, "anlik": True},
    {"tip": "liste", "isaret": "carpi", "s": kz("problem", "elinde") - 0.05, "son": E("problem"), "ogeler": [["Ürün yok", kz("problem", "ürün")], ["Şirket yok", kz("problem", "şirketin")], ["Satış bilgisi yok", kz("problem", "satacağını")]]},
    {"tip": "baslik", "s": B("soru"), "son": E("soru"), "satir1": "BAŞLAYABİLİR MİYİM?", "satir2": "bunlara rağmen..."},
    {"tip": "baslik", "s": B("evet"), "son": E("evet") + 0.1, "satir1": "EVET!", "satir2": "başlayabilirsin", "buyuk": True},
    {"tip": "rozet", "s": kz("etkinlik", "ankara"), "son": tl, "metin": "📍 ANKARA · 6 ARALIK · 100 KİŞİ"},
    {"tip": "koltuk", "s": kz("etkinlik", "ankara") + 0.1, "son": E("etkinlik") + 0.1, "ust": "ANKARA E-TİCARET ETKİNLİĞİ", "baslik": "SADECE 100 KİŞİ", "fiyat": "250 TL"},
    {"tip": "liste", "isaret": "carpi", "s": kz("nasil", "şirket") - 0.1, "son": E("nasil"), "ogeler": [["Şirket kurmadan", kz("nasil", "şirket")], ["Stok tutmadan", kz("nasil", "stok")]]},
    {"tip": "adimlar", "s": kz("yol", "etkinlik"), "son": E("yol"), "baslik": "NET YOL HARİTASI"},
    {"tip": "baslik", "s": B("cagri"), "son": kz("cagri", "şimdi") - 0.1, "satir1": "YERLER DOLMADAN", "satir2": "kontenjan 100 kişi"},
    {"tip": "cagri2", "s": kz("cagri", "şimdi") - 0.1, "son": E("cagri") + 0.1, "yorum_t": kz("cagri", "ankara"), "yorum": "Ankara"},
    {"tip": "etkinlik", "s": B("tarih"), "son": E("tarih") + 0.05, "satirlar": [["📍", "COZONE · ODTÜ Teknokent", kz("tarih", "odtü")], ["📅", "6 Aralık Pazar", kz("tarih", "6")], ["🕑", "14.00 – 17.00", kz("tarih", "buluşalım")]], "alt": "🎟️ 250 TL · sadece 100 kişi"},
    {"tip": "kapanis", "s": B("kapanis"), "son": tl, "satir1": "6 Aralık · 14.00", "satir2": "COZONE · ODTÜ Teknokent", "etiket": "SADECE 100 KİŞİ · 250 TL", "etiketRenk": "turuncu"},
]
vurgu = ["sıfırdan", "ürün", "şirketin", "satacağını", "rağmen", "evet", "başlayabilirsin", "ankara'da", "etkinliği", "kurmadan", "tutmadan", "adım",
         "net", "yol", "haritası", "gerçekten", "şimdi", "mesaj", "ankara", "odtü", "teknokent", "6", "aralık'ta"]
json.dump({"fps": FPS, "kartY": 1060, "altyaziY": 1440, "parcalar": parcalar, "altyazi": altyazi, "olaylar": olaylar, "vurgu": vurgu, "toplamKare": sum(p["kare"] for p in parcalar)},
          open("src/reels_berkay.json", "w"), ensure_ascii=False, indent=1)
print(f"toplam {tl:.1f} sn, {len(parcalar)} parça")
for k, (a, b) in BZ.items(): print(f"  {k}: {a:.2f}-{b:.2f}")
print(" ".join(w["w"] for w in altyazi))
