"""Etkileşim Sihirbazı Reels planı -> src/es.json
Parçalar (sıkı kesme) + kelime altyazısı + yüz takipli kamera (her <=2 sn hareket) + kelimeye bağlı grafik olayları"""
import json, wave, numpy as np

FPS = 30
KEL = json.load(open("calisma/kelimeler.json"))
YUZ = {}
for n in ["6174", "6176", "6178", "6179", "6180"]:
    d = json.load(open(f"calisma/yuz_{n}.json"))
    YUZ[f"IMG_{n}"] = [o for o in d["kareler"] if "cx" in o]

SESLER = {}
def ses(n):
    if n not in SESLER:
        w = wave.open(f"calisma/ses_temiz/{n}_16k.wav"); SESLER[n] = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return SESLER[n]
def db(n, t, win=0.01):
    a = ses(n)[max(0, int(t * 16000)): int((t + win) * 16000)]
    return 20 * np.log10(float(np.sqrt((a ** 2).mean())) + 1e-9) if len(a) else -99

def esik(n):
    x = ses(n); fr = [20 * np.log10(np.sqrt((x[i:i + 160] ** 2).mean()) + 1e-9) for i in range(0, len(x) - 160, 160)]
    return max(-38.0, float(np.percentile(fr, 10)) + 7)

DUZELT = {"2": "iki", "Oğlum.": "Oğlum,", "dur.": "dur,", "sihirbazını": "Sihirbazı'nı", "etkileşim": "Etkileşim", "mı": "mı,"}

def kelime_duzelt(n, w, es):
    """uzun ilk kelimede (whisper başı erken koyar) içteki sessizlikten sonrasını başlangıç say"""
    s, e = w["s"], w["e"]
    if e - s >= 0.45:
        ts = np.arange(s, e, 0.01); son = None; i = 0
        while i < len(ts):
            if db(n, ts[i]) < es:
                j = i
                while j < len(ts) and db(n, ts[j]) < es: j += 1
                if (j - i) * 0.01 >= 0.15: son = ts[j - 1] + 0.01
                i = j
            else: i += 1
        if son and son < e - 0.08: s = float(son)
    return {"w": DUZELT.get(w["w"], w["w"]), "s": s, "e": e}

# (anahtar, kaynak, başlangıç, bitiş, kesme modu)  mod: "siki" = kullanıcı kuralı, "aksiyon" = kesme yok, "gevsek" = şaka temposu
BIRIMLER = [
    ("kanca",  "IMG_6174", 9.15, 12.70, "siki"),
    ("secenek", "IMG_6176", 0.00, 4.20, "siki"),
    # v2: atış hareketi, "Komple kapattım kamerayı" ve 6178 ("atmayacağım / oğlum dur dur / sakin") ATILDI:
    # kamera arkasıyla konuşulan hatalı çekimler (kullanıcı kararı)
    ("neden",  "IMG_6179", 0.00, 5.45, "siki"),
    ("cta",    "IMG_6180", 0.00, 3.95, "siki"),
]
MOD = {"siki": (0.12, 0.035), "gevsek": (0.40, 0.14)}

def alt_araliklar(n, a, b, ks, mod):
    if mod == "aksiyon": return [(a, b)]
    min_kes, kalan = MOD[mod]; es = esik(n)
    ts = np.arange(a, b, 0.01)
    konusma = np.array([db(n, t) > es for t in ts])
    bolg = []; i = 0
    while i < len(ts):
        if konusma[i]:
            j = i
            while j < len(ts) and konusma[j]: j += 1
            bolg.append([ts[i], ts[j - 1] + 0.01]); i = j
        else: i += 1
    m = []
    for x, y in bolg:
        if m and x - m[-1][1] < min_kes: m[-1][1] = y
        else: m.append([x, y])
    def kelimeli(x, y): return any(x - 0.05 <= (w["s"] + w["e"]) / 2 <= y + 0.05 or (w["s"] < y and w["e"] > x and min(y, w["e"]) - max(x, w["s"]) > 0.08) for w in ks)
    m = [(x, y) for x, y in m if kelimeli(x, y)]
    out = []
    for x, y in m:
        x2, y2 = max(a, x - kalan), min(b + 0.2, y + kalan)
        if out and x2 <= out[-1][1]: out[-1] = (out[-1][0], y2)
        else: out.append((x2, y2))
    return [(x, y) for x, y in out if y - x >= 0.15]

parcalar, altyazi, bz, tl = [], [], {}, 0.0
for (anahtar, n, a, b, mod) in BIRIMLER:
    es = esik(n)
    ks = [kelime_duzelt(n, w, es) for w in KEL[n] if a <= (w["s"] + w["e"]) / 2 < b]
    araliklar = alt_araliklar(n, a, b, ks, mod)
    bas0 = tl
    hedef = []
    for w in ks:
        ort = [min(y, w["e"]) - max(x, w["s"]) for (x, y) in araliklar]
        if ort and max(ort) > 0: hedef.append(int(np.argmax(ort)))
        else:
            orta = (w["s"] + w["e"]) / 2; hedef.append(int(np.argmin([min(abs(orta - x), abs(orta - y)) for x, y in araliklar])))
    for j, (x, y) in enumerate(araliklar):
        fa, fb = int(np.floor(x * FPS)), int(np.ceil(y * FPS))
        if fb - fa < 6: continue
        bas, son = fa / FPS, fb / FPS
        for w, h in zip(ks, hedef):
            if h == j:
                s2 = min(max(bas, w["s"]), son - 0.1) - bas + tl; e2 = min(son, w["e"]) - bas + tl
                altyazi.append({"w": w["w"], "s": round(s2, 3), "e": round(max(e2, s2 + 0.1), 3), "birim": anahtar})
        parcalar.append({"src": f"{n}_dikey.mp4", "ses": f"{n}_ses.wav", "kaynak": n, "bas": bas, "kare": fb - fa, "tl": round(tl, 3), "birim": anahtar})
        tl += (fb - fa) / FPS
    bz[anahtar] = (round(bas0, 3), round(tl, 3))
TOPLAM = tl

def kz(birim, parca, sonra=0.0, son=False):
    for w in altyazi:
        if w["birim"] == birim and parca.lower() in w["w"].lower() and w["s"] >= bz[birim][0] + sonra:
            return w["e"] if son else w["s"]
    raise SystemExit(f"bulunamadı: {birim} {parca}")
B = lambda k: bz[k][0]
E = lambda k: bz[k][1]

# ---------- yüz izi (parça başına, kaynak zamanında) ----------
def yuz_iz(n, a, b):
    k = [o for o in YUZ[n] if a - 0.3 <= o["t"] <= b + 0.3]
    return [{"t": o["t"], "x": o["cx"], "y": o["cy"], "h": o["h"]} for o in k]
for p in parcalar:
    p["yuz"] = yuz_iz(p["kaynak"], p["bas"], p["bas"] + p["kare"] / FPS)

# ---------- kamera: her <=2 sn bir hareket ----------
# z = yakınlık (1 = tam kare), giris: "snap" (4 kare yaylı), "whip" (birim değişimi: bulanık savrulma + flaş), "yumusak"
# Yüz hedef yüksekliği (ekranda) y_hedef. Her aralıkta z0 -> z1 yavaş itme / çekme (asla durağan değil).
kamera = []
# Yakınlık birim başına yüz boyuna göre sınırlanır: yüz kutusu (saç dahil ~1.6h) ekranda en fazla 600 px -> kartlara yer kalır
DESEN = [(0.0, 0.15, "snap"), (0.85, 1.0, "snap"), (0.5, 0.38, "snap"), (1.0, 0.88, "snap")]
def kamera_ekle(s, e, z0, z1, giris):
    kamera.append({"s": round(s, 3), "e": round(e, 3), "z0": z0, "z1": z1, "giris": giris, "yh": 600})
ZSINIR = {}
for (anahtar, n, a, b, mod) in BIRIMLER:
    h = float(np.median([o["h"] for o in YUZ[n] if a <= o["t"] <= b] or [o["h"] for o in YUZ[n]]))
    zmax = max(1.08, min(1.85, 600 / (1.6 * h))); zmin = max(1.0, zmax * 0.74)
    ZSINIR[anahtar] = (zmin, zmax)
    s_, e = bz[anahtar]
    kesmeler = [p["tl"] for p in parcalar if p["birim"] == anahtar] + [e]
    noktalar = [s_]
    for c in kesmeler[1:-1]:
        if c - noktalar[-1] >= 0.7: noktalar.append(c)
    tam = []
    for i, x in enumerate(noktalar):
        y = noktalar[i + 1] if i + 1 < len(noktalar) else e
        tam.append(x)
        k = int(np.ceil((y - x) / 1.9))
        for j in range(1, k): tam.append(x + (y - x) * j / k)
    for i, x in enumerate(tam):
        y = tam[i + 1] if i + 1 < len(tam) else e
        f0, f1, g = DESEN[i % len(DESEN)]
        kamera_ekle(x, y, round(zmin + f0 * (zmax - zmin), 3), round(zmin + f1 * (zmax - zmin), 3), "whip" if i == 0 and anahtar != "kanca" else g)

# ---- Kameranın ekrandaki yüz kutusu (ES.tsx Goruntu ile aynı hesap) ----
YUZ_HEDEF, YUZ_UST_MIN = 600, 190
def yuz_ekranda(t):
    p = next((q for q in parcalar if q["tl"] <= t < q["tl"] + q["kare"] / FPS), parcalar[-1])
    kt = p["bas"] + (t - p["tl"]); sx = sy = sh = sw = 0
    for o in p["yuz"]:
        d = abs(o["t"] - kt)
        if d > 0.6: continue
        w = 1 - d / 0.6; sx += o["x"] * w; sy += o["y"] * w; sh += o["h"] * w; sw += w
    o0 = p["yuz"][0]
    fx, fy, fh = (sx / sw, sy / sw, sh / sw) if sw else (o0["x"], o0["y"], o0["h"])
    k = next((c for c in kamera if c["s"] <= t < c["e"]), kamera[-1])
    z = k["z0"] + (k["z1"] - k["z0"]) * min(1, max(0, (t - k["s"]) / max(1e-6, k["e"] - k["s"])))
    ty = YUZ_HEDEF - fy * z
    ust = (fy - 0.85 * fh) * z + ty
    if ust < YUZ_UST_MIN: ty += YUZ_UST_MIN - ust
    ty = min(0, max(1920 - 1920 * z, ty))
    return (fy - 0.85 * fh) * z + ty, (fy + 0.75 * fh) * z + ty

# ---------- grafik olayları ----------
olaylar = [
    # 0: Kanca başlığı (kapak dili: Anton, beyaz + sarı fırça)
    {"tip": "kanca", "s": 0.0, "son": kz("kanca", "musun", son=True) + 0.25, "satir1": "YORUM", "satir2": "ALAMIYOR MUSUN?"},
    # Boş gönderi: "ne düşünüyorsun?" -> 0 yorum, cırcır böceği
    {"tip": "bospost", "s": kz("kanca", "takipçine"), "son": E("kanca") + 0.05, "carpi": kz("kanca", "bırakma")},
    # 2 net seçenek: A / B tuşları
    {"tip": "secenek", "s": kz("secenek", "önüne"), "son": kz("secenek", "koy", son=True) + 0.1},
    # Bölünmüş ekran B-roll: TUT (kaleci) / AT (şut)
    {"tip": "tutat", "s": kz("secenek", "bir"), "son": kz("secenek", "mı?", son=True) + 0.15,
     "tut": kz("secenek", "tutayım"), "at": kz("secenek", "atayım"), "dosya_tut": "broll/43495.mp4", "dosya_at": "broll/43494.mp4"},
    # Neden: soru (✕) vs iki seçenek (✓)
    {"tip": "karsilastir", "s": B("neden"), "son": kz("neden", "birini") - 0.05,
     "sol_t": B("neden"), "sag_t": kz("neden", "önüne")},
    # B-roll: telefonda yorum yazan eller + sayaç
    {"tip": "broll_yorum", "s": kz("neden", "birini"), "son": E("neden") + 0.05, "dosya": "broll/4915.mp4", "bas": 3.0},
    # Takip et kartı
    {"tip": "takipet", "s": B("cta") + 0.05, "son": E("cta"), "tik": kz("cta", "takip") + 0.2},
]

# ---- Yerleşim: her kart, olay süresince yüz kutusunun ÜSTÜNDEKİ ya da ALTINDAKİ boş banda konur (yüzün önüne asla gelmez) ----
YUKSEKLIK = {"kanca": 380, "bospost": 330, "secenek": 540, "karsilastir": 330, "takipet": 200}
ALTYAZI_UST = 1335
for o in olaylar:
    if o["tip"] not in YUKSEKLIK: continue
    ts = np.arange(o["s"], o["son"], 1 / FPS)
    kut = [yuz_ekranda(t) for t in ts]
    ust, alt = min(k[0] for k in kut) - 30, max(k[1] for k in kut) + 30
    hh = YUKSEKLIK[o["tip"]]
    asagi = (alt, ALTYAZI_UST - 10); yukari = (175, ust)
    bant = asagi if asagi[1] - asagi[0] >= min(hh, yukari[1] - yukari[0]) else yukari
    bh = bant[1] - bant[0]; olcek = min(1.0, bh / hh)
    o["y"] = round(bant[0] + max(0, (bh - hh * olcek) / 2)); o["olcek"] = round(olcek, 3)
    print(f"  yerleşim {o['tip']:12s} yüz {ust:5.0f}-{alt:5.0f}  kart {o['y']}-{o['y'] + hh * olcek:.0f}  ölçek {olcek:.2f}")

# Altyazıyı gizle (başlık kendisi yazıyı taşıyorken)
gizle = [[0.0, kz("kanca", "musun", son=True) + 0.2]]
vurgu = ["yorum", "bırakma.", "iki", "net", "seçenek", "tutayım", "atayım", "cevap", "vermez", "zorunda", "takip", "Sihirbazı'nı"]
v = {"fps": FPS, "parcalar": parcalar, "altyazi": altyazi, "olaylar": olaylar, "kamera": kamera, "gizle": gizle, "vurgu": vurgu,
     "birimler": bz, "toplamKare": sum(p["kare"] for p in parcalar)}
json.dump(v, open("src/es.json", "w"), ensure_ascii=False, indent=1)
print(f"toplam {TOPLAM:.2f} sn, {len(parcalar)} parça, {len(altyazi)} kelime, {len(kamera)} kamera hareketi")
for k, (a, b) in bz.items(): print(f"  {k}: {a:.2f}-{b:.2f}")
gaps = [kamera[i + 1]["s"] - kamera[i]["s"] for i in range(len(kamera) - 1)]
print("kamera aralığı en fazla", round(max(gaps), 2), "sn")
print(" ".join(w["w"] for w in altyazi))
