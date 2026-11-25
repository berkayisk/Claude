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
    ("atis",   "IMG_6176", 4.20, 6.62, "aksiyon"),   # kameraya atma hareketi + "Komple kapattım kamerayı"
    ("sakin",  "IMG_6178", 0.70, 5.05, "gevsek"),    # 0.0'daki yarım "Atmayacağım" atılır
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
DESEN = [(1.18, 1.26, "snap"), (1.52, 1.60, "snap"), (1.30, 1.22, "snap"), (1.70, 1.78, "snap")]
def kamera_ekle(s, e, z0, z1, giris, yh=640):
    kamera.append({"s": round(s, 3), "e": round(e, 3), "z0": z0, "z1": z1, "giris": giris, "yh": yh})

# Birim başına yüz büyüklüğüne göre ölçek: uzak çekimlerde (yüz küçük) daha yakın
OLCEK = {"kanca": 1.0, "secenek": 1.0, "atis": 0.95, "sakin": 1.18, "neden": 1.15, "cta": 0.92}
ozel_vurgu = {}  # birim -> vurgu kelimesi zamanları (punch)
for (anahtar, n, a, b, mod) in BIRIMLER:
    s, e = bz[anahtar]
    # kesme noktaları (aynı birim içindeki jump cut'lar) her zaman bir kamera değişimi olur
    kesmeler = [p["tl"] for p in parcalar if p["birim"] == anahtar] + [e]
    noktalar = [s]
    for c in kesmeler[1:-1]:
        if c - noktalar[-1] >= 0.7: noktalar.append(c)
    # 2 sn'den uzun aralıkları böl
    tam = []
    for i, x in enumerate(noktalar):
        y = noktalar[i + 1] if i + 1 < len(noktalar) else e
        tam.append(x)
        k = int(np.ceil((y - x) / 1.9))
        for j in range(1, k): tam.append(x + (y - x) * j / k)
    for i, x in enumerate(tam):
        y = tam[i + 1] if i + 1 < len(tam) else e
        z0, z1, g = DESEN[i % len(DESEN)]
        o = OLCEK[anahtar]
        kamera_ekle(x, y, round(z0 * o, 3), round(z1 * o, 3), "whip" if i == 0 and anahtar != "kanca" else g)

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
    # Anket çıkartması (atış hareketi sırasında)
    {"tip": "anket", "s": B("atis") + 0.05, "son": kz("atis", "komple") - 0.05},
    # Kamera kapandı: glitch + damga
    {"tip": "kamerakapandi", "s": kz("atis", "komple") - 0.1, "son": E("atis")},
    # "Atmayacağım..." -> yorumlar yağıyor (taktik çalışıyor)
    {"tip": "yorumyagmuru", "s": B("sakin") + 0.1, "son": E("sakin"),
     "yorumlar": [["mert.dgn", "AT AT AT ⚽🔥"], ["elif.sosyal", "tut bence 🧤"], ["kaan_34", "AAAT 😂"], ["zeynep.ig", "kesin at"], ["onur", "atma oğlum 😅"]]},
    {"tip": "emoji", "s": kz("sakin", "sakin") - 0.15, "son": E("sakin"), "emoji": "😅"},
    # Neden: soru (✕) vs iki seçenek (✓)
    {"tip": "karsilastir", "s": B("neden"), "son": kz("neden", "birini") - 0.05,
     "sol_t": B("neden"), "sag_t": kz("neden", "önüne")},
    # B-roll: telefonda yorum yazan eller + sayaç
    {"tip": "broll_yorum", "s": kz("neden", "birini"), "son": E("neden") + 0.05, "dosya": "broll/4915.mp4", "bas": 3.0},
    # Takip et kartı
    {"tip": "takipet", "s": B("cta") + 0.05, "son": E("cta"), "tik": kz("cta", "takip") + 0.2},
]

# Altyazıyı gizle (başlık kendisi yazıyı taşıyorken)
gizle = [[0.0, kz("kanca", "musun", son=True) + 0.2]]
vurgu = ["yorum", "bırakma.", "iki", "net", "seçenek", "tutayım", "atayım", "komple", "sakin.", "cevap", "vermez", "zorunda", "takip", "Sihirbazı'nı"]
v = {"fps": FPS, "parcalar": parcalar, "altyazi": altyazi, "olaylar": olaylar, "kamera": kamera, "gizle": gizle, "vurgu": vurgu,
     "birimler": bz, "toplamKare": sum(p["kare"] for p in parcalar)}
json.dump(v, open("src/es.json", "w"), ensure_ascii=False, indent=1)
print(f"toplam {TOPLAM:.2f} sn, {len(parcalar)} parça, {len(altyazi)} kelime, {len(kamera)} kamera hareketi")
for k, (a, b) in bz.items(): print(f"  {k}: {a:.2f}-{b:.2f}")
gaps = [kamera[i + 1]["s"] - kamera[i]["s"] for i in range(len(kamera) - 1)]
print("kamera aralığı en fazla", round(max(gaps), 2), "sn")
print(" ".join(w["w"] for w in altyazi))
