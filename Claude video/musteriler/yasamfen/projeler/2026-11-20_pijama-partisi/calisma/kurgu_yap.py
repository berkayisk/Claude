#!/usr/bin/env python3
"""Kurgu planı (calisma/plan_<ad>.py içindeki PLAN) → src/<ad>.json (Kurgu bileşeni verisi).
PLAN öğeleri:
  klip(no, bas, son, sik=True, **parca_ayar)   kaynak aralığı; sik=True → içteki sessizlikler kesilir (temiz ses, CLAUDE.md kuralları)
  broll(no, bas, son, **parca_ayar)            sessiz görüntü
  olay(tip, kaynak=(no, t) | zaman=sn, sure=sn, **props)  grafik; kaynak zamanı kurgu zamanına çevrilir
  HARIC: [(no, bas, son)] kelime/aralık çıkarma
Kullanım: python3 calisma/kurgu_yap.py yarisma1"""
import json, os, sys, wave, math, numpy as np, importlib.util
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
FPS = 30
AD = sys.argv[1]
spec = importlib.util.spec_from_file_location("plan", f"calisma/plan_{AD}.py"); P = importlib.util.module_from_spec(spec)

_ses = {}
KISI_TESPIT = {}
def enerji(no):
    if no not in _ses:
        w = wave.open(f"calisma/ses/{no}_16k.wav"); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        hop = 160; n = len(a) // hop
        db = 20 * np.log10(np.sqrt((a[:n*hop].reshape(n, hop) ** 2).mean(1)) + 1e-9)
        esik = max(-38.0, float(np.percentile(db, 10)) + 7)
        _ses[no] = (db, esik)
    return _ses[no]

def kelimeler(no):
    d = json.load(open(f"calisma/transkript/IMG_{no}.MOV.json"))
    return [(w[0], w[1], w[2]) for s in d for w in s["kelimeler"]]

SON_NOKTA = (".", "?", "!", "…")
def cumle_sinir(no, bas, son, sadece_kuyruk=False, ileri=3):
    """bas'ı içine düştüğü cümlenin başına, son'u cümlenin sonuna yasla (en çok 3 sn); sonra sesin söndüğü yere kadar uzat (en çok 0.45 sn)"""
    kw = [] if sadece_kuyruk else kelimeler(no)
    # baş: bas'tan sonraki ilk kelime, önceki kelime cümle sonu değilse ve 3 sn içindeyse cümle başına geri git
    ic = [i for i, (ws, we, w) in enumerate(kw) if (ws + we) / 2 >= bas]
    if ic:
        i = ic[0]; j = i
        while j > 0 and not kw[j-1][2].endswith(SON_NOKTA) and kw[j][0] - kw[j-1][1] < 0.6 and bas - kw[j-1][0] < 3: j -= 1
        if j < i: bas = kw[j][0] - 0.06
        else: bas = min(bas, kw[i][0] - 0.06)
    # son: son'dan önceki son kelime cümle sonu değilse, cümle bitene kadar ileri git (3 sn sınır)
    ic = [i for i, (ws, we, w) in enumerate(kw) if (ws + we) / 2 <= son]
    if ic:
        i = ic[-1]; j = i
        while j + 1 < len(kw) and not kw[j][2].endswith(SON_NOKTA) and kw[j+1][0] - kw[j][1] < 0.6 and kw[j+1][1] - son < ileri: j += 1
        son = max(son, kw[j][1] + 0.18)
    # ses kuyruğu — ama bir sonraki kelimeye taşmadan (yeni cümlenin ilk hecesi girmesin)
    tum = kelimeler(no)
    icerde = [we for ws, we, w in tum if (ws + we) / 2 <= son]
    son_kelime_bitis = max(icerde) if icerde else son
    sonraki = min((ws for ws, we, w in tum if ws > son_kelime_bitis - 0.01 and (ws + we) / 2 > son - 0.2), default=1e9)
    son = min(son, sonraki - 0.03)
    tavan = min(son + 0.45, sonraki - 0.03)
    if os.path.exists(f"calisma/ses/{no}_16k.wav") and tavan > son:
        db, esik = enerji(no); k = int(son * 100)
        while k < len(db) and k < int(tavan * 100) and db[k] > esik - 3: k += 1
        son = min(max(son, k / 100 + 0.05), tavan)
    # baş da önceki kelimenin kuyruğunu almasın
    onceki = max((we for ws, we, w in tum if we <= bas + 0.05), default=-1)
    bas = max(bas, onceki + 0.02)
    # konuşmaya doğrudan gir: sesin gerçekten başladığı yere (en çok 0.6 sn ileri) yasla
    if os.path.exists(f"calisma/ses/{no}_16k.wav"):
        db, esik = enerji(no); k = int(bas * 100)
        while k < len(db) and k < int((bas + 0.6) * 100) and db[k] <= esik: k += 1
        ilk_kelime = min((ws for ws, we, w in tum if (ws + we) / 2 >= bas), default=bas + 0.6)
        if k < int((bas + 0.6) * 100): bas = max(bas, min(k / 100 - 0.03, ilk_kelime - 0.04))
    return max(0, bas), son

PAY_BAS, PAY_SON = 0.06, 0.15
def dip_yasla(no, bas, son):
    """Blok başı/sonu: komşu kelimeler arasındaki en sessiz 10 ms'ye yasla (kelime/hece kırpılmasın)."""
    if not os.path.exists(f"calisma/ses/{no}_16k.wav"): return bas, son
    db, esik = enerji(no); kw = kelimeler(no)
    if os.path.exists(f"calisma/transkript_dolgu/{no}.json"):
        kw = kw + [tuple(w) for w in json.load(open(f"calisma/transkript_dolgu/{no}.json"))]
    onceki = max((we for ws, we, w in kw if we <= bas + 0.02), default=bas - 0.3)
    ilk = min((ws for ws, we, w in kw if ws >= bas - 0.02), default=bas + 0.1)
    a0, a1 = max(onceki, bas - 0.25), min(ilk, bas + 0.1)
    i0, i1 = max(0, int(a0 * 100)), min(len(db), int(a1 * 100) + 1)
    if a1 - a0 > 0.03 and i1 > i0:
        bas = (i0 + int(np.argmin(db[i0:i1]))) / 100
    son_k = max((we for ws, we, w in kw if we <= son + 0.02), default=son - 0.1)
    sonraki = min((ws for ws, we, w in kw if ws >= son - 0.02), default=son + 0.3)
    b0, b1 = max(son_k, son - 0.1), min(sonraki, son + 0.25)
    i0, i1 = int(b0 * 100), min(len(db), int(b1 * 100) + 1)
    if b1 - b0 > 0.03 and i1 > i0:
        son = min((i0 + int(np.argmin(db[i0:i1]))) / 100 + 0.01, sonraki - 0.05)   # kare yuvarlaması (ceil) sonrakine taşmasın
    return bas, son

def sikistir(no, bas, son, haric):
    """[bas,son] içinde konuşma bölgelerini döndür: >=0.12 sn sessizlik kesilir, kenarda 0.035 sn pay"""
    if not os.path.exists(f"calisma/ses/{no}_16k.wav"): return [(bas, son)]
    db, esik = enerji(no)
    i0, i1 = int(bas * 100), min(len(db), int(son * 100))
    ses = db[i0:i1] > esik
    bolge = []; i = 0
    while i < len(ses):
        if ses[i]:
            j = i
            while j < len(ses) and (ses[j] or (j + 12 < len(ses) and ses[j:j+12].any())): j += 1
            bolge.append([bas + i / 100 - PAY_BAS, bas + j / 100 + PAY_SON]); i = j
        else: i += 1
    # çok kısa (<0.08 sn) gürültü patlamalarını at
    bolge = [b for b in bolge if b[1] - b[0] >= 0.12]
    # HARIC aralıklarını çıkar
    for hn, hb, hs in haric:
        if hn != no: continue
        yeni = []
        for a, b in bolge:
            if hs <= a or hb >= b: yeni.append([a, b]); continue
            if a < hb: yeni.append([a, hb])
            if hs < b: yeni.append([hs, b])
        bolge = yeni
    # kelimesiz bölgeleri at (nefes, gürültü, ıı) — transkriptte kelime ortası düşmeyen bölge
    kw = kelimeler(no)
    bolge = [b for b in bolge if any(b[0] - 0.05 <= (ws + we) / 2 <= b[1] + 0.05 for ws, we, _ in kw)]
    # bölgeyi içindeki kelimelerin tamamını kapsayacak şekilde genişlet (kelime kırpılmasın), sonra çakışanları birleştir
    for b in bolge:
        ic = [(ws, we) for ws, we, _ in kw if b[0] - 0.05 <= (ws + we) / 2 <= b[1] + 0.05]
        if ic: b[0] = min(b[0], min(x[0] for x in ic) - 0.06); b[1] = max(b[1], max(x[1] for x in ic) + 0.18)
    # whisper'ın duyduğu ama enerji eşiğinin kaçırdığı kelimeler de bölge olur
    for ws, we, _ in kw:
        if bas <= (ws + we) / 2 <= son and not any(b[0] <= (ws + we) / 2 <= b[1] for b in bolge):
            bolge.append([ws - 0.06, we + 0.18])
    bolge.sort(); bir = []
    for b in bolge:
        if bir and b[0] <= bir[-1][1] + 0.05: bir[-1][1] = max(bir[-1][1], b[1])
        else: bir.append(list(b))
    bolge = bir
    # HARIC son kez (kelime ekleme adımı dolguları geri getirmesin)
    for hn, hb, hs in haric:
        if hn != no: continue
        yeni = []
        for a, b in bolge:
            if hs <= a or hb >= b: yeni.append([a, b]); continue
            if a < hb - 0.05: yeni.append([a, hb])
            if hs < b - 0.05: yeni.append([hs, b])
        bolge = yeni
    # kalan boşluklar ~0.07 sn olacak şekilde birleşir (kenar payları zaten 0.035+0.035)
    bolge = [[max(bas, a), min(son, b)] for a, b in bolge if min(son, b) - max(bas, a) > 0.05]
    return [(a, b) for a, b in bolge] or [(bas, son)]

def main():
    global PAY_BAS, PAY_SON
    spec.loader.exec_module(P)
    if getattr(P, "SIKI", False): PAY_BAS, PAY_SON = 0.03, 0.08
    haric = getattr(P, "HARIC", [])
    parcalar, harita, olaylar, altyazi, yazi_parca = [], [], [], [], []
    t = 0.0
    for oi, o in enumerate(P.PLAN):
        if o["tur"] in ("klip", "broll"):
            no = o["no"]
            if o["tur"] == "klip" and not o.get("sabit") and not o.get("kelimesiz"):
                o["bas"], o["son"] = cumle_sinir(no, o["bas"], o["son"], ileri=1.5 if o.get("yazi") else 3)
            elif o["tur"] == "klip" and not o.get("sabit"):
                _, o["son"] = cumle_sinir(no, o["bas"], o["son"], sadece_kuyruk=True)   # elle yazılı/kelimesiz: sadece ses kuyruğu
            if o["tur"] == "klip": o["bas"], o["son"] = dip_yasla(no, o["bas"], o["son"])
            araliklar = sikistir(no, o["bas"], o["son"], haric) if o["tur"] == "klip" and o.get("sik", True) else [(o["bas"], o["son"])]
            ayar = {k: v for k, v in o.items() if k not in ("tur", "no", "bas", "son", "sik", "kelimesiz", "yazi")}
            for k, (a, b) in enumerate(araliklar):
                fa = math.floor(a * FPS) / FPS; kare = max(1, math.ceil(b * FPS) - math.floor(a * FPS))
                p = {"src": f"vekil/{no}.mp4", "bas": round(fa, 4), "kare": kare, "blok": oi}
                if o["tur"] == "klip": p["ses"] = f"ses/{no}_temiz.wav"
                else: p["sessiz"] = True
                pa = dict(ayar)
                if k > 0: pa.pop("gecis", None)
                # punch kaynak zamanı → parça içi kare
                if "punch" in pa:
                    pa["punch"] = [{"kare": int(round((pu["t"] - fa) * FPS)), "olcek": pu.get("olcek", 1.15), "sure": pu.get("sure", 8)} for pu in pa["punch"] if fa <= pu["t"] < fa + kare / FPS]
                    if not pa["punch"]: pa.pop("punch")
                # kaplama: [{"t": ana klip kaynak zamanı, "no": broll klip, "bas": broll başlangıç, "sure": sn}]
                if "kaplama" in pa:
                    kk = []
                    for kp in pa["kaplama"]:
                        a0, a1 = max(fa, kp["t"]), min(fa + kare / FPS, kp["t"] + kp["sure"])
                        if a1 - a0 < 0.2: continue
                        kk.append({"src": f"vekil/{kp['no']}.mp4", "bas": round(kp["bas"] + (a0 - kp["t"]), 3), "kare": int(round((a0 - fa) * FPS)), "sure": int(round((a1 - a0) * FPS))})
                    if kk: pa["kaplama"] = kk
                    else: pa.pop("kaplama")
                # zoom: tüm klip boyunca sürekli → parçalara oransal böl
                if "zoom" in ayar:
                    z0, z1 = ayar["zoom"]; top = o["son"] - o["bas"]
                    pa["zoom"] = [round(z0 + (z1 - z0) * (fa - o["bas"]) / top, 4), round(z0 + (z1 - z0) * (fa + kare / FPS - o["bas"]) / top, 4)]
                p.update(pa); parcalar.append(p)
                harita.append((no, fa, fa + kare / FPS, t))
                if o["tur"] == "klip" and o.get("yazi"):
                    yazi_parca.append((t, kare / FPS, o))
                elif o["tur"] == "klip" and not o.get("kelimesiz"):
                    for ws, we, w in kelimeler(no):
                        m = (ws + we) / 2
                        if fa <= m < fa + kare / FPS and not any(hn == no and hb <= m < hs for hn, hb, hs in haric):
                            altyazi.append({"w": w, "s": round(t + max(0, ws - fa), 3), "e": round(t + min(kare / FPS, we - fa), 3), "b": oi})
                t += kare / FPS
    # elle yazı: aynı klibe ait ardışık parçaları birleştir, kelimeleri süreye eşit dağıt
    gruplar = {}
    for t0, d, o in yazi_parca: gruplar.setdefault(id(o), [o, []])[1].append((t0, d))
    for o, pp in gruplar.values():
        ks = o["yazi"].split(); top = sum(d for _, d in pp); adim = top / max(1, len(ks)); i = 0
        for t0, d in pp:
            tt = t0
            while i < len(ks) and tt + adim <= t0 + d + 1e-6:
                altyazi.append({"w": ks[i], "s": round(tt, 3), "e": round(tt + adim * 0.95, 3), "b": id(o) % 100000}); tt += adim; i += 1
        while i < len(ks): altyazi.append({"w": ks[i], "s": round(pp[-1][0] + pp[-1][1] - 0.2, 3), "e": round(pp[-1][0] + pp[-1][1], 3)}); i += 1
    altyazi.sort(key=lambda w: w["s"])
    def cevir(no, ts):
        for hn, a, b, t0 in harita:
            if hn == no and a <= ts < b: return t0 + ts - a
        en = min((h for h in harita if h[0] == no), key=lambda h: min(abs(ts - h[1]), abs(ts - h[2])))
        return en[3] if ts < en[1] else en[3] + en[2] - en[1]
    def kisi_konum(no, ts, kn, ust=170):
        R = KISI_TESPIT.setdefault(no, [json.loads(l) for l in open("calisma/yuz/tespit.jsonl") if f"IMG_{no}." in l])
        K = json.load(open("calisma/yuz/kisiler.json"))["kisiler"]; m = np.array(next(k["merkez"] for k in K if k["no"] == kn), np.float32)
        aday = [r for r in R if "vek" in r and abs(r["t"] - ts) <= 1.6]
        en = max(aday, key=lambda r: float(np.array(r["vek"], np.float32) @ m / np.linalg.norm(r["vek"])) - 0.05 * abs(r["t"] - ts), default=None)
        if en is None: return 540, 400
        x, y = en["x"] + en["w"] / 2, en["y"] - ust * en["w"] / 140
        # zoom dönüşümü
        tt = cevir(no, ts); acc = 0
        for p in parcalar:
            if acc <= tt * FPS < acc + p["kare"]:
                z0, z1 = p.get("zoom", [1, 1]); r = (tt * FPS - acc) / p["kare"]; z = z0 + (z1 - z0) * r
                ox, oy = p.get("odak", [0.5, 0.45]); x = ox * 1080 + (x - ox * 1080) * z; y = oy * 1920 + (y - oy * 1920) * z; break
            acc += p["kare"]
        return int(min(900, max(180, x))), int(min(1700, max(160, y)))
    for o in P.OLAYLAR:
        o = dict(o)
        if isinstance(o.get("kisi"), (list, tuple)):
            kx, ky = kisi_konum(*o.pop("kisi")); o.setdefault("x", kx); o.setdefault("y", ky)
        s = cevir(*o.pop("kaynak")) if "kaynak" in o else o.pop("zaman")
        s += o.pop("kay", 0)
        sure = o.pop("sure")
        olaylar.append({**o, "s": round(max(0, s), 3), "son": round(min(t, s + sure), 3)})
    gizle = [[e["s"], e["son"]] for e in olaylar if e["tip"] in getattr(P, "ALTYAZI_GIZLE_TIPLER", ["soru", "baslik", "faz", "cagri"])]
    for w in altyazi:  # Türkçe düzeltmeler
        for a, b in getattr(P, "DUZELT", {}).items():
            if w["w"].strip(".,!?").lower() == a.lower(): w["w"] = w["w"].replace(w["w"].strip(".,!?"), b)
    v = {"fps": FPS, "parcalar": parcalar, "altyazi": altyazi, "vurgu": getattr(P, "VURGU", []), "altyaziGizle": gizle,
         "olaylar": olaylar, "sfx": [{**x, "s": round(cevir(*x.pop("kaynak")) if "kaynak" in x else x.pop("zaman"), 3)} for x in [dict(y) for y in getattr(P, "SFX", [])]],
         "toplamKare": sum(p["kare"] for p in parcalar)}
    if getattr(P, "MUZIK", None): v["muzik"] = P.MUZIK
    json.dump(v, open(f"src/{AD}.json", "w"), ensure_ascii=False, indent=1)
    print(f"{AD}: {len(parcalar)} parça, {v['toplamKare']/FPS:.1f} sn, {len(altyazi)} kelime, {len(olaylar)} olay")

def klip(no, bas, son, **k): return {"tur": "klip", "no": no, "bas": bas, "son": son, **k}
def broll(no, bas, son, **k): return {"tur": "broll", "no": no, "bas": bas, "son": son, **k}
def olay(tip, **k): return {"tip": tip, **k}
P.klip, P.broll, P.olay = klip, broll, olay
if __name__ == "__main__": main()
