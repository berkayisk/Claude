"""Tanışma reels planı -> src/reels.json (bilesenler/Reels şablonu).
Kaynak: girdiler/ham_a.mov + ham_b.mov (röportaj). Marka adı geçen cümleler kullanılmaz; dikey kesit x=1136-1744 (logo/yazılar dışarıda).
Kesme kuralları: CLAUDE.md 'Reels / talking-head kuralları'."""
import json, wave, numpy as np

FPS = 30
T = json.load(open("calisma/transkript.json"))
KEL = {n: [] for n in T}
for n in T:
    m = []
    for s in T[n]:
        for q in s["words"]:
            w = {"w": q["w"].strip(), "s": q["s"], "e": q["e"]}
            if m and (w["w"].startswith("-") or w["w"].startswith("'")): m[-1] = {"w": m[-1]["w"] + w["w"], "s": m[-1]["s"], "e": w["e"]}
            else: m.append(w)
    KEL[n] = m
DUZELT = {"Berk": "Berkay", "Ayşık": "Işık", "gelişimim": "girişimim", "işte.": "işe.", "açlık": "harçlık", "stabil": "Stabil"}

S = {}
def ses(n):
    if n not in S:
        w = wave.open(f"calisma/ses_temiz/{n}_16k.wav"); S[n] = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return S[n]
def db(n, t, win=0.02):
    a = ses(n)[max(0, int(t * 16000)): int((t + win) * 16000)]
    return 20 * np.log10(float(np.sqrt((a ** 2).mean())) + 1e-9) if len(a) else -99

MIN_KES, KALAN = 0.12, 0.035
ESIK = {}
def esik(n):
    """çekime uyarlanır: zemin gürültüsü (10. yüzdelik) + 7 dB, en az -38 dB"""
    if n not in ESIK:
        e = [db(n, t, 0.01) for t in np.arange(0, len(ses(n)) / 16000 - 0.02, 0.01)]
        ESIK[n] = max(-38.0, float(np.percentile(e, 10)) + 7)
        print(f"  {n}: konuşma eşiği {ESIK[n]:.1f} dB")
    return ESIK[n]

def alt_araliklar(n, a, b, ks):
    ts = np.arange(a, b, 0.01)
    th = esik(n)
    konusma = np.array([db(n, t, 0.01) > th for t in ts])
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
        x2, y2 = max(a, x - KALAN), min(b, y + KALAN)
        if out and x2 <= out[-1][1]: out[-1] = (out[-1][0], y2)
        else: out.append((x2, y2))
    return [(x, y) for x, y in out if y - x >= 0.15]

# (birim, çekim, başlangıç, bitiş): kronolojik kurgu (v2). "babasının parası / güzel arabalar" kullanılmaz (kullanıcı).
CEKIMLER = [
    ("tanisma", "a", 0.0, 1.88), ("tanisma", "a", 2.13, 4.62),
    ("ogrenci", "a", 21.42, 24.14), ("ogrenci", "a", 24.18, 28.42), ("ogrenci", "b", 0.0, 4.56),
    ("gecmis", "b", 6.55, 14.47), ("yeni", "b", 14.52, 23.98), ("karar", "b", 24.24, 27.72), ("karar", "a", 40.48, 43.26),
    ("hazirlik", "a", 52.97, 58.98), ("aktif", "a", 60.49, 71.30), ("ufuk", "a", 35.96, 40.48), ("simdi", "a", 43.62, 47.99),
]
parcalar, altyazi, tl, zs = [], [], 0.0, 0
for (birim, n, a, b) in CEKIMLER:
    ks = [dict(w, w=DUZELT.get(w["w"], w["w"])) for w in KEL[n] if a <= (w["s"] + w["e"]) / 2 < b]
    ar = alt_araliklar(n, a, b, ks)
    hedef = []
    for w in ks:
        o = [min(y, w["e"]) - max(x, w["s"]) for (x, y) in ar]
        hedef.append(int(np.argmax(o)) if o and max(o) > 0 else (int(np.argmin([min(abs((w["s"] + w["e"]) / 2 - x), abs((w["s"] + w["e"]) / 2 - y)) for x, y in ar])) if ar else -1))
    for j, (x, y) in enumerate(ar):
        fa, fb = int(np.floor(x * FPS)), int(np.ceil(y * FPS))
        if fb - fa < 6: continue
        bas, son = fa / FPS, fb / FPS
        for w, h in zip(ks, hedef):
            if h == j:
                s2 = min(max(bas, w["s"]), son - 0.1) - bas + tl; e2 = min(son, w["e"]) - bas + tl
                altyazi.append({"w": w["w"], "s": round(s2, 3), "e": round(max(e2, s2 + 0.1), 3), "birim": birim})
        parcalar.append({"src": f"{n}_dikey.mp4", "ses": f"{n}_ses.wav", "bas": bas, "kare": fb - fa, "zoom": zs % 2 == 1})
        tl += (fb - fa) / FPS; zs += 1

def kucuk(x): return x.replace("İ", "i").replace("I", "ı").lower()
BZ = {}
for k in dict.fromkeys(c[0] for c in CEKIMLER):
    ws = [w for w in altyazi if w["birim"] == k]; BZ[k] = (ws[0]["s"], ws[-1]["e"])
def kz(birim, parca):
    for w in altyazi:
        if w["birim"] == birim and kucuk(parca) in kucuk(w["w"]): return w["s"]
    raise SystemExit(f"bulunamadı: {birim} {parca}")
def ke(birim, parca):
    for w in altyazi:
        if w["birim"] == birim and kucuk(parca) in kucuk(w["w"]): return w["e"]
    raise SystemExit(f"bulunamadı: {birim} {parca}")

BR = {"top": 420, "yukseklik": 563}
olaylar = [
    {"tip": "baslik", "s": 0.0, "son": BZ["tanisma"][1] + 0.05, "satir1": "HUKUK ÖĞRENCİSİ", "satir2": "e-ticarete nasıl başladı?", "anlik": True},
    {"tip": "broll_video", "s": kz("ogrenci", "stabil") - 0.05, "son": ke("ogrenci", "ediyordum") + 0.05, "dosya": "broll/4503.mp4", "bas": 2.0, **BR},
    {"tip": "stat", "s": kz("ogrenci", "tabii") - 0.05, "son": ke("ogrenci", "var.") + 0.05, "ust": "ATILIM HUKUK", "deger": "4. sınıf öğrencisi"},
    {"tip": "broll_video", "s": kz("gecmis", "geleneksel") - 0.1, "son": BZ["gecmis"][1] + 0.05, "dosya": "broll/4705.mp4", "bas": 3.0, **BR},
    {"tip": "broll_video", "s": kz("yeni", "yeni") - 0.05, "son": kz("yeni", "stoksuz") - 0.1, "dosya": "broll/42123.mp4", "bas": 2.0, **BR},
    {"tip": "liste", "isaret": "tik", "s": kz("yeni", "stoksuz") - 0.1, "son": BZ["yeni"][1] + 0.05, "ogeler": [["Stoksuz", kz("yeni", "stoksuz")], ["Şirketsiz", kz("yeni", "şirketsiz")]]},
    {"tip": "stat", "s": kz("hazirlik", "ilk") - 0.05, "son": BZ["hazirlik"][1] + 0.05, "ust": "İLK", "deger": "3 ay hazırlık"},
    {"tip": "broll_video", "s": kz("aktif", "müşterilerle") - 0.1, "son": ke("aktif", "arttırdım") + 0.1, "dosya": "broll/4915.mp4", "bas": 3.0, **BR},
    {"tip": "liste", "isaret": "tik", "s": kz("simdi", "tedarikçilik") - 0.1, "son": kz("simdi", "sahibiyiz") - 0.05, "ogeler": [["Tedarikçi", kz("simdi", "tedarikçilik")], ["Partner", kz("simdi", "partnerlik")], ["Mağaza sahibi", kz("simdi", "mağaza")]]},
    {"tip": "takipet", "s": kz("simdi", "sahibiyiz") - 0.05, "son": tl + 0.5, "tik": ke("simdi", "sahibiyiz") - 0.1},
]
vurgu = ["stabil", "özel", "kendi", "ayaklarınızın", "hukuk", "zorlukları", "harçlık", "geleneksel", "yeni", "nesil", "stoksuz,", "şirketsiz,",
         "müthişti.", "düşünmeden", "üç", "hazırlık", "müşterilerle", "fikir", "başka", "yerlere", "tedarikçilik", "partnerlik", "sahibiyiz."]
json.dump({"fps": FPS, "kartY": 1100, "altyaziY": 1450, "parcalar": parcalar, "altyazi": altyazi, "olaylar": olaylar, "vurgu": vurgu,
           "toplamKare": sum(p["kare"] for p in parcalar)}, open("src/reels.json", "w"), ensure_ascii=False, indent=1)
print(f"toplam {tl:.1f} sn, {len(parcalar)} parça")
for k, (a, b) in BZ.items(): print(f"  {k}: {a:.2f}-{b:.2f}")
print(" ".join(w["w"] for w in altyazi))
