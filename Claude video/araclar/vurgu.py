"""Türkçe vurgu ve tonlama ölçümü (seslendirme denetimi).

Ne ölçer:
 1. KELİME VURGUSU — her hece için perde (F0, yarım ton), şiddet (dB) ve süre ölçülür; kelimedeki en belirgin hece,
    Berkay'ın gerçek okumasından öğrenilen vurgusuyla karşılaştırılır (okuduğu kelimeler birebir; okumadığı kelimeler hece sayısına
    göre vurgu konumu dağılımı). Ders kitabı kuralı (son hece) akıcı Türkçede zayıf: Berkay'ın okumasıyla uyumu sadece %46 → yalnızca yedek.
 2. CÜMLE TONLAMASI — düz cümle sonunda perde düşmeli; "mı/mi" sorusunda zirve ekten önceki hecede; "ne/nasıl/nereden"
    sorularında soru kelimesi öne çıkmalı; virgülde ses düşüp bitmemeli (devam tonu).
 3. GENEL — perde çeşitliliği (tekdüzelik) ve hece hızı, Berkay'ın gerçek okumasıyla (vurgu_kalibrasyon.json) karşılaştırılır.

Hizalama: araclar/telaffuz.py (wav2vec2 Türkçe CTC, harf düzeyi). Perde: librosa.pyin.

Kullanım:
  python3 araclar/vurgu.py kalibre satirlar.json gercek_klasor/   # Berkay'ın gerçek okumasıyla eşik + kural uyumu
  python3 araclar/vurgu.py denetle satirlar.json klasor/          # satır satır rapor
Python: from vurgu import Olcer; Olcer(denetci).olc(wav16k, metin) -> {"puan":..,"sorunlar":[..],"kelimeler":[..]}
"""
import sys, os, json, re, numpy as np

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KALIB = os.path.join(KOK, "araclar", "vurgu_kalibrasyon.json")
UNLU = set("aeıioöuü")

# ---- Türkçe vurgu kuralları (yaklaşık) ----
# İstisna sözlüğü: kelime -> vurgulu hece indeksi (0 = ilk hece). Gerçek okumayla doğrulandıkça genişletilir.
ISTISNA = {
    "sonra": 0, "önce": 0, "şimdi": 0, "gibi": 0, "ama": 0, "fakat": 0, "belki": 0, "nasıl": 0, "neden": 0, "niçin": 0,
    "nerede": 0, "nereden": 0, "nereye": 0, "hangi": 0, "yarın": 0, "evet": 0, "hayır": 0, "işte": 0, "yine": 0, "hâlâ": 0,
    "hiç": 0, "çünkü": 0, "ancak": 0, "yani": 0, "aslında": 1, "gerçekten": 1, "tabii": 0, "lütfen": 0, "artık": 0,
    "vardı": 0, "yoktu": 0, "değil": 1, "değildi": 1, "gibiydi": 0, "ahmet": 1, "ankara": 0, "istanbul": 1, "türkiye": 0,
    "aylardır": 0, "yıllardır": 0, "saatlerdir": 0, "günlerdir": 0, "haftalardır": 0,
}
ENKLITIK = ("mı", "mi", "mu", "mü", "mısın", "misin", "musun", "müsün", "mıydı", "miydi", "muydu", "müydü", "ki", "de", "da", "ya")
SORU_KELIME = ("ne", "neden", "nasıl", "nerede", "nereden", "nereye", "kim", "hangi", "kaç", "niçin", "niye", "satacak", "bulacak")

def hecele(k):
    h, cur = [], ""
    for i, ch in enumerate(k):
        if ch not in UNLU and i + 1 < len(k) and k[i + 1] in UNLU and any(c in UNLU for c in cur):
            h.append(cur); cur = ""
        cur += ch
    h.append(cur); return h

def beklenen_vurgu(kelime):
    """Vurgulu hece indeksi; None = değerlendirme dışı (tek heceli, enklitik)."""
    w = kelime.replace("'", "")
    hs = hecele(w)
    if len(hs) < 2 or w in ENKLITIK: return None
    if w in ISTISNA: return min(ISTISNA[w], len(hs) - 1)
    if "'" in kelime:                       # özel isim + ek: vurgu ismin üzerinde (Ahmet'in -> ah-MET-in)
        k = kelime.split("'")[0]; hk = hecele(k)
        return min(ISTISNA.get(k, len(hk) - 1), len(hs) - 1)
    m = re.search(r"m[ae](d[ıiuü]|y[ıiuü]?|z|s|n|k|l)", w)   # olumsuzluk -mA-: vurgu ondan önceki hecede (GEL-me-di)
    if m and m.start() > 1:
        on = len(hecele(w[:m.start()]))
        if 1 <= on < len(hs): return on - 1
    for ek in ("ken", "leyin", "casına", "cesine"):           # vurgusuz ekler: vurgu ekten önce
        if w.endswith(ek) and len(hs) > 2: return len(hs) - len(hecele(ek)) - 1
    for ek in ("ydı", "ydi", "ydu", "ydü", "ymış", "ymiş", "ysa", "yse"):   # ek-fiil (gibiydi, hazırdı değil: -dı fiilde vurgulu)
        if w.endswith(ek) and len(hs) > 2: return len(hs) - 2
    return len(hs) - 1

class Olcer:
    def __init__(self, denetci=None):
        if denetci is None:
            sys.path.insert(0, os.path.join(KOK, "araclar")); from telaffuz import Denetci; denetci = Denetci()
        self.dn = denetci
        self.kal = json.load(open(KALIB)) if os.path.exists(KALIB) else None

    def _ozellikler(self, a):
        import librosa
        f0, vf, _ = librosa.pyin(a, fmin=70, fmax=350, sr=16000, frame_length=1024, hop_length=160)
        st = np.where(vf, 12 * np.log2(np.maximum(f0, 1) / 100.0), np.nan)       # yarım ton (100 Hz'e göre)
        rms = librosa.feature.rms(y=a, frame_length=640, hop_length=160)[0]
        db = 20 * np.log10(rms + 1e-6)
        return st, db

    def olc(self, a, metin):
        st, db = self._ozellikler(a)
        T = lambda t: min(len(db) - 1, max(0, int(round(t * 100))))
        hz = self.dn.harf_zamanlari(a, metin)
        heceler = []          # (kelime_i, hece_i, t0, t1, f0_st, db, sure)
        for wi, (w, harfler) in enumerate(hz):
            if not harfler: continue
            hs = hecele(w.replace("'", "")); pos = 0; bas = []
            sade = [h for h in harfler if h[0] != "'"]
            for h in hs:
                if pos < len(sade): bas.append(sade[pos][1])
                pos += len(h)
            son_w = sade[-1][2] + 0.06
            for hi, t0 in enumerate(bas):
                t1 = bas[hi + 1] if hi + 1 < len(bas) else son_w
                if t1 <= t0: t1 = t0 + 0.04
                seg = st[T(t0):T(t1) + 1]; v = seg[~np.isnan(seg)]
                heceler.append((wi, hi, t0, t1, float(np.median(v)) if len(v) else np.nan, float(np.max(db[T(t0):T(t1) + 1])), t1 - t0))
        if not heceler: return {"puan": 0.0, "sorunlar": ["hizalama başarısız"], "kelimeler": []}
        f0s = np.array([h[4] for h in heceler]); dbs = np.array([h[5] for h in heceler]); su = np.array([h[6] for h in heceler])
        def z(x):
            m = np.nanmean(x); s = np.nanstd(x) + 1e-6; r = (x - m) / s; return np.nan_to_num(r, nan=-0.5)
        belirgin = z(f0s) + z(dbs) + 0.6 * z(su)
        sorunlar, kel_rapor = [], []
        uyum = []; toplam = 0
        for wi, (w, _) in enumerate(hz):
            idx = [i for i, h in enumerate(heceler) if h[0] == wi]
            if not idx: continue
            hs = hecele(w.replace("'", ""))
            gercek = int(np.argmax([belirgin[i] for i in idx]))
            bek = beklenen_vurgu(w)
            kel_rapor.append({"kelime": w, "heceler": hs, "beklenen": bek, "olculen": gercek})
            if bek is None or len(idx) != len(hs): continue
            toplam += 1
            if self.kal and "kelime_vurgu" in self.kal:
                kv = self.kal["kelime_vurgu"]
                if w in kv:                                  # Berkay bu kelimeyi okumuş: onun vurgusu beklenir
                    bek = kv[w]; fark = belirgin[idx[gercek]] - belirgin[idx[min(bek, len(idx) - 1)]]
                    ok = gercek == bek or fark <= 0.35
                    neden = f"Berkay '{hs[min(bek, len(hs) - 1)]}' diye vurgular"
                else:                                        # okumadığı kelime: hece sayısına göre konum dağılımı
                    n = str(min(len(hs), 4)); sinif = "ilk" if gercek == 0 else ("son" if gercek == len(hs) - 1 else "orta")
                    olas = self.kal["konum_dagilim"].get(n, {}).get(sinif, 0.33)
                    ok = olas >= 0.15
                    neden = f"Berkay {n} heceli kelimelerde '{sinif}' heceyi nadiren vurgular (%{olas*100:.0f})"
            else:
                fark = belirgin[idx[gercek]] - belirgin[idx[bek]]
                ok = gercek == bek or fark <= 0.35
                neden = f"kural: beklenen '{hs[bek]}'"
            uyum.append(ok)
            if not ok:
                sorunlar.append(f"vurgu: {w} → '{hs[gercek]}' vurgulu; {neden} ({heceler[idx[0]][2]:.1f} sn)")
        # cümle tonlaması
        m = metin.strip(); kel = [w for w, _ in hz]
        son_idx = [i for i, h in enumerate(heceler) if h[0] == len(hz) - 1]
        govde = f0s[~np.isnan(f0s)]
        med = float(np.median(govde)) if len(govde) else 0.0
        if son_idx and len(govde) > 3:
            son_f0 = np.nanmean([f0s[i] for i in son_idx[-2:]])
            if m.endswith("?"):
                if any(k in ENKLITIK[:4] or k.startswith(("mı", "mi", "mu", "mü")) for k in kel[-1:]):
                    once = [i for i, h in enumerate(heceler) if h[0] == len(hz) - 2]
                    if once and not (f0s[once[-1]] >= np.nanpercentile(govde, 70)):
                        sorunlar.append("tonlama: 'mı/mi' sorusunda zirve ekten önceki hecede değil (soru gibi duyulmayabilir)")
                elif any(k in SORU_KELIME for k in kel):
                    qi = [i for i, h in enumerate(heceler) if kel[h[0]] in SORU_KELIME]
                    if qi and max(belirgin[i] for i in qi) < np.percentile(belirgin, 60):
                        sorunlar.append("tonlama: soru kelimesi öne çıkmıyor")
            elif m.endswith((".", "!")) and not m.endswith("..."):
                if son_f0 > med + 1.5:
                    sorunlar.append(f"tonlama: cümle sonu düşmüyor (+{son_f0 - med:.1f} yarım ton) — soru/yarım kalmış gibi")
        cesit = float(np.std(govde)) if len(govde) > 3 else 0.0
        hiz = len(heceler) / max(0.3, heceler[-1][3] - heceler[0][2])
        if self.kal and len(heceler) >= 8:   # kısa satırlarda perde çeşitliliği/hız ölçüsü güvenilmez
            if cesit < 0.6 * self.kal["cesit"]: sorunlar.append(f"tonlama: tekdüze (perde çeşitliliği {cesit:.1f} < Berkay {self.kal['cesit']:.1f} yarım ton)")
            if hiz > 1.35 * self.kal["hiz"]: sorunlar.append(f"hız: çok hızlı ({hiz:.1f} hece/sn, Berkay {self.kal['hiz']:.1f})")
            if hiz < 0.65 * self.kal["hiz"]: sorunlar.append(f"hız: çok yavaş ({hiz:.1f} hece/sn, Berkay {self.kal['hiz']:.1f})")
        vurgu_uyum = float(np.mean(uyum)) if uyum else 1.0
        puan = vurgu_uyum - 0.15 * sum(1 for s in sorunlar if s.startswith(("tonlama", "hız")))
        return {"puan": round(puan, 3), "vurgu_uyum": round(vurgu_uyum, 3), "cesit": round(cesit, 2), "hiz": round(hiz, 2),
                "sorunlar": sorunlar, "kelimeler": kel_rapor}

def oku16(p):
    import subprocess
    a = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(a, np.float32).copy()

if __name__ == "__main__":
    kip, satir_yol, klasor = sys.argv[1], sys.argv[2], sys.argv[3]
    S = json.load(open(satir_yol)); ol = Olcer()
    if kip == "kalibre":
        ol.kal = None
        ces, hz, uy, uyumsuz = [], [], [], {}
        for s in S:
            p = os.path.join(klasor, s["k"] + ".wav")
            if not os.path.exists(p): continue
            r = ol.olc(oku16(p), s["metin"])
            ces.append(r["cesit"]); hz.append(r["hiz"]); uy.append(r["vurgu_uyum"])
            for k in r["kelimeler"]:
                if k["beklenen"] is not None and k["beklenen"] != k["olculen"]:
                    uyumsuz.setdefault(k["kelime"], []).append(k["heceler"][k["olculen"]] if k["olculen"] < len(k["heceler"]) else "?")
        # Berkay'ın kelime vurguları ve hece sayısına göre vurgu konumu dağılımı
        kv, kd = {}, {}
        for s in S:
            p = os.path.join(klasor, s["k"] + ".wav")
            if not os.path.exists(p): continue
            for k in ol.olc(oku16(p), s["metin"])["kelimeler"]:
                hs = k["heceler"]
                if len(hs) < 2 or k["olculen"] >= len(hs): continue
                kv.setdefault(k["kelime"], []).append(k["olculen"])
                n = str(min(len(hs), 4)); sinif = "ilk" if k["olculen"] == 0 else ("son" if k["olculen"] == len(hs) - 1 else "orta")
                kd.setdefault(n, {}).setdefault(sinif, 0); kd[n][sinif] += 1
        kv = {w: max(set(v), key=v.count) for w, v in kv.items()}
        kd = {n: {c: v / sum(d.values()) for c, v in d.items()} for n, d in kd.items()}
        json.dump({"cesit": float(np.median(ces)), "hiz": float(np.median(hz)), "kural_uyumu": float(np.mean(uy)), "kaynak": klasor,
                   "kelime_vurgu": kv, "konum_dagilim": kd}, open(KALIB, "w"), ensure_ascii=False, indent=1)
        print("konum dağılımı:", {n: {c: round(v, 2) for c, v in d.items()} for n, d in kd.items()})
        print(f"kalibrasyon: perde çeşitliliği {np.median(ces):.2f} yt, hız {np.median(hz):.2f} hece/sn, kural uyumu {np.mean(uy):.0%}")
        print("Berkay'ın kurala uymayan okumaları (kural hatası olabilir):", uyumsuz)
    else:
        for s in S:
            p = os.path.join(klasor, s["k"] + ".wav")
            if not os.path.exists(p): continue
            r = ol.olc(oku16(p), s["metin"])
            print(f"{s['k']:4s} puan {r['puan']:.2f} uyum {r['vurgu_uyum']:.0%} çeşit {r['cesit']:.1f} hız {r['hiz']:.1f}" + ("".join("\n      - " + x for x in r["sorunlar"])))
