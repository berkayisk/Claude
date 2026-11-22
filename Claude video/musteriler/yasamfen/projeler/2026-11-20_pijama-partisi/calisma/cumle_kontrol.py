#!/usr/bin/env python3
"""Her plan öğesinin (klip) başında/sonunda cümle yarım mı? Kullanım: python3 calisma/cumle_kontrol.py yarisma1"""
import json, sys, os
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
ad = sys.argv[1]; v = json.load(open(f"src/{ad}.json"))
SON = (".", "?", "!", "…")
bloklar = {}
for p in v["parcalar"]:
    if p.get("sessiz"): continue
    no = p["src"][6:10]
    a, b = p["bas"], p["bas"] + p["kare"] / 30
    bloklar.setdefault((no, p.get("blok", None)), []).append((a, b))
sorun = 0; t = 0
P = v["parcalar"]
for i, p in enumerate(P):
    no = p["src"][6:10]; a = p["bas"]; b = a + p["kare"] / 30
    if not p.get("sessiz"):
        kw = [(w[0], w[1], w[2]) for s in json.load(open(f"calisma/transkript/IMG_{no}.MOV.json")) for w in s["kelimeler"]]
        if os.path.exists(f"calisma/transkript_dolgu/{no}.json"):   # dolgu transkripti daha doğru zamanlı
            kw = [tuple(w) for w in json.load(open(f"calisma/transkript_dolgu/{no}.json")) if w[2].lower().strip(".,…") not in ("eee", "ee", "ııı", "ıı")]
        ic = [w for w in kw if a <= (w[0] + w[1]) / 2 < b]
        once = [w for w in kw if w[1] <= a + 0.02]
        sonra = [w for w in kw if w[0] >= b - 0.02]
        notlar = []
        ilk = i == 0 or P[i-1].get("blok") != p.get("blok"); son_ = i == len(P) - 1 or P[i+1].get("blok") != p.get("blok")
        if ilk and ic and once and not once[-1][2].endswith(SON) and ic[0][0] - once[-1][1] < 0.6: notlar.append(f"BAŞ yarım (önce: '{once[-1][2]}')")
        if son_ and ic and sonra and not ic[-1][2].endswith(SON) and sonra[0][0] - ic[-1][1] < 0.6: notlar.append(f"SON yarım (sonra: '{sonra[0][2]}')")
        kirp = [w for w in kw if (son_ and w[0] < b < w[1] - 0.05) or (ilk and w[0] + 0.05 < a < w[1])]
        if kirp and os.path.exists(f"calisma/ses/{no}_16k.wav"):
            import wave, numpy as np
            w_ = wave.open(f"calisma/ses/{no}_16k.wav"); x_ = np.frombuffer(w_.readframes(w_.getnframes()), np.int16).astype(np.float32) / 32768
            db_ = 20 * np.log10(np.sqrt((x_[:len(x_)//160*160].reshape(-1, 160) ** 2).mean(1)) + 1e-9); es_ = max(-38.0, float(np.percentile(db_, 10)) + 7)
            kirp = [w for w in kirp if db_[min(len(db_) - 1, int((b if w[0] < b < w[1] else a) * 100))] > es_ + 3]   # kesim noktasında gerçekten ses varsa
        if kirp: notlar.append("KELİME KIRPIK: " + ",".join(w[2] for w in kirp))
        # ses kırpığı: blok başından hemen önce / sonundan hemen sonra konuşma enerjisi varsa (kelime atlanmış olabilir)
        if os.path.exists(f"calisma/ses/{no}_16k.wav") and not p.get("yazi_yok_kontrol"):
            import wave, numpy as np
            w = wave.open(f"calisma/ses/{no}_16k.wav"); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
            db = 20 * np.log10(np.sqrt((x[:len(x)//160*160].reshape(-1, 160) ** 2).mean(1)) + 1e-9)
            esik = max(-38.0, float(np.percentile(db, 10)) + 7)
            once_db = db[max(0, int(a*100) - 6):int(a*100)].mean() if a > 0.06 else -99
            sonra_db = db[int(b*100):int(b*100) + 6].mean() if int(b*100) + 6 < len(db) else -99
            if ilk and once_db > esik + 8 and not (ic and once and once[-1][2].endswith(SON) and a - once[-1][1] > 0.15): notlar.append(f"BAŞTA SES ({once_db:.0f} dB)")
            if son_ and sonra_db > esik + 8 and sonra and sonra[0][0] - b < 0.25: notlar.append(f"SONDA SES ({sonra_db:.0f} dB)")
        if notlar:
            sorun += 1
            print(f"{t:5.1f} {no} {a:6.2f}-{b:6.2f} | {' '.join(w[2] for w in ic)[:70]} | {' ; '.join(notlar)}")
    t += p["kare"] / 30
print(ad, "sorunlu parça:", sorun)
