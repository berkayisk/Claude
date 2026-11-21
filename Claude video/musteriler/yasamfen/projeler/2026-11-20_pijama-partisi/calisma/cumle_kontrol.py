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
        ic = [w for w in kw if a <= (w[0] + w[1]) / 2 < b]
        once = [w for w in kw if w[1] <= a + 0.02]
        sonra = [w for w in kw if w[0] >= b - 0.02]
        notlar = []
        ilk = i == 0 or P[i-1].get("blok") != p.get("blok"); son_ = i == len(P) - 1 or P[i+1].get("blok") != p.get("blok")
        if ilk and ic and once and not once[-1][2].endswith(SON) and ic[0][0] - once[-1][1] < 0.6: notlar.append(f"BAŞ yarım (önce: '{once[-1][2]}')")
        if son_ and ic and sonra and not ic[-1][2].endswith(SON) and sonra[0][0] - ic[-1][1] < 0.6: notlar.append(f"SON yarım (sonra: '{sonra[0][2]}')")
        kirp = [w for w in kw if (son_ and w[0] < b < w[1] - 0.05) or (ilk and w[0] + 0.05 < a < w[1])]
        if kirp: notlar.append("KELİME KIRPIK: " + ",".join(w[2] for w in kirp))
        if notlar:
            sorun += 1
            print(f"{t:5.1f} {no} {a:6.2f}-{b:6.2f} | {' '.join(w[2] for w in ic)[:70]} | {' ; '.join(notlar)}")
    t += p["kare"] / 30
print(ad, "sorunlu parça:", sorun)
