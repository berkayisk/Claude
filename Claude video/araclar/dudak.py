"""Dudak senkronu: seslendirme satırlarından vizem (ağız şekli) zaman çizelgesi.
wav2vec2 Türkçe CTC (araclar/telaffuz.py Denetci.harf_zamanlari) ile harf zamanları -> vizem.
Kullanım: python3 araclar/dudak.py plan.json vo_klasoru cikti.json
plan.json: {"vo": [{"k": "n1", "metin": "...", "bas": 0.4}, ...]}
Çıktı: [{"t": sn, "v": "A"|"E"|"I"|"O"|"U"|"M"|"F"|"X"}] (film zamanı, sıralı; her olay bir sonrakine kadar geçerli)
Vizemler karakter kodundaki (src/berkay.tsx) Vizem tipine karşılık gelir.
"""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from telaffuz import Denetci, oku16

HARF = {"a": "A", "e": "E", "ı": "I", "i": "I", "o": "O", "ö": "O", "u": "U", "ü": "U",
        "m": "M", "b": "M", "p": "M", "f": "F", "v": "F"}
DIGER = "I"          # diğer ünsüzler: dişler hafif aralık
MIN = 0.06           # bir vizemin en kısa süresi (≈2 kare @30fps)
SESSIZ = 0.12        # kelimeler arası bu kadar boşluk varsa ağız kapanır

def main(plan_yol, vo, cikti):
    P = json.load(open(plan_yol)); dn = Denetci(); olay = []
    for s in P["vo"]:
        a = oku16(os.path.join(vo, s["k"] + ".wav"))
        son_bit = None
        for w, hz in dn.harf_zamanlari(a, s["metin"]):
            for h, t0, t1 in hz:
                t0 += s["bas"]; t1 += s["bas"]
                if son_bit is not None and t0 - son_bit > SESSIZ: olay.append((son_bit + 0.02, "X"))
                olay.append((t0, HARF.get(h, DIGER))); son_bit = t1
        if son_bit is not None: olay.append((son_bit + 0.03, "X"))
    olay.sort()
    # kısa olanları birleştir, art arda aynıları at
    temiz = []
    for t, v in olay:
        if temiz and t - temiz[-1][0] < MIN:
            # önceki çok kısa kaldı: ünlüler ünsüzlere üstün gelir
            if temiz[-1][1] in ("I", "X") or v in ("M", "F"): temiz[-1] = (temiz[-1][0], v)
            continue
        if temiz and temiz[-1][1] == v: continue
        temiz.append((t, v))
    json.dump([{"t": round(t, 3), "v": v} for t, v in temiz], open(cikti, "w"))
    print(f"{len(temiz)} vizem olayı -> {cikti}")

if __name__ == "__main__":
    main(*sys.argv[1:4])
