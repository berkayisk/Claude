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
            bolge.append([bas + i / 100 - 0.035, bas + j / 100 + 0.035]); i = j
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
    # kalan boşluklar ~0.07 sn olacak şekilde birleşir (kenar payları zaten 0.035+0.035)
    bolge = [[max(bas, a), min(son, b)] for a, b in bolge if min(son, b) - max(bas, a) > 0.05]
    return [(a, b) for a, b in bolge] or [(bas, son)]

def main():
    spec.loader.exec_module(P)
    haric = getattr(P, "HARIC", [])
    parcalar, harita, olaylar, altyazi, yazi_parca = [], [], [], [], []
    t = 0.0
    for o in P.PLAN:
        if o["tur"] in ("klip", "broll"):
            no = o["no"]
            araliklar = sikistir(no, o["bas"], o["son"], haric) if o["tur"] == "klip" and o.get("sik", True) else [(o["bas"], o["son"])]
            ayar = {k: v for k, v in o.items() if k not in ("tur", "no", "bas", "son", "sik", "kelimesiz", "yazi")}
            for k, (a, b) in enumerate(araliklar):
                fa = math.floor(a * FPS) / FPS; kare = max(1, math.ceil(b * FPS) - math.floor(a * FPS))
                p = {"src": f"vekil/{no}.mp4", "bas": round(fa, 4), "kare": kare}
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
                            altyazi.append({"w": w, "s": round(t + max(0, ws - fa), 3), "e": round(t + min(kare / FPS, we - fa), 3)})
                t += kare / FPS
    # elle yazı: aynı klibe ait ardışık parçaları birleştir, kelimeleri süreye eşit dağıt
    gruplar = {}
    for t0, d, o in yazi_parca: gruplar.setdefault(id(o), [o, []])[1].append((t0, d))
    for o, pp in gruplar.values():
        ks = o["yazi"].split(); top = sum(d for _, d in pp); adim = top / max(1, len(ks)); i = 0
        for t0, d in pp:
            tt = t0
            while i < len(ks) and tt + adim <= t0 + d + 1e-6:
                altyazi.append({"w": ks[i], "s": round(tt, 3), "e": round(tt + adim * 0.95, 3)}); tt += adim; i += 1
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
        if "kisi" in o:
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
