"""Kesme noktalarını temiz seste doğrular: sadece ATILAN tarafta (30 ms) konuşma varsa sorun. Kullanım: python3 calisma/kesme_kontrol.py v3 [v4 ...]"""
import json, sys, wave, numpy as np
S = {}
def db(n, t, w):
    if n not in S:
        ww = wave.open(f"calisma/ses_temiz/{n}_16k.wav"); S[n] = np.frombuffer(ww.readframes(ww.getnframes()), np.int16).astype(np.float32) / 32768
    a = S[n][max(0, int(t * 16000)): int((t + w) * 16000)]
    return 20 * np.log10(np.sqrt((a ** 2).mean()) + 1e-9) if len(a) else -99
for vid in sys.argv[1:]:
    v = json.load(open(f"src/{vid}.json")); tl = 0; sorun = 0
    for i, p in enumerate(v["parcalar"]):
        n = p["src"].replace("_dikey.mp4", ""); a = p["bas"]; b = a + p["kare"] / 30
        if "_dogal" in p["ses"]: print(f"{i:2d} {tl:5.2f}s {n} doğal sesli B-roll"); tl += p["kare"] / 30; continue
        isaret = []
        once, sonra = db(n, a - 0.03, 0.03), db(n, b, 0.03)
        if a > 0.03 and once > -24: isaret.append(f"BAŞ KIRPIK? ({once:.0f} dB)")
        if sonra > -24: isaret.append(f"SON KIRPIK? ({sonra:.0f} dB)")
        sorun += bool(isaret)
        kel = " ".join(w["w"] for w in v["altyazi"] if tl <= w["s"] < tl + p["kare"] / 30)
        print(f"{i:2d} {tl:5.2f}s {n} {a:6.2f}-{b:6.2f} | {kel[:55]:55s} {' '.join(isaret)}")
        tl += p["kare"] / 30
    print(vid, "sorunlu kesme:", sorun, "| toplam", round(tl, 1), "sn\n")
