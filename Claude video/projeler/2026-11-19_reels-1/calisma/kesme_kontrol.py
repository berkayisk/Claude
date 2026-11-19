"""Her kesme noktasını temiz ses üzerinde doğrular: parçanın ilk/son 40 ms'si ve atılan tarafın 80 ms'si"""
import json, wave, numpy as np
v = json.load(open("src/reels.json")); S = {}
def db(n, t, w):
    if n not in S:
        ww = wave.open(f"calisma/ses_temiz/{n}_16k.wav"); S[n] = np.frombuffer(ww.readframes(ww.getnframes()), np.int16).astype(np.float32) / 32768
    a = S[n][max(0, int(t * 16000)): int((t + w) * 16000)]
    return 20 * np.log10(np.sqrt((a ** 2).mean()) + 1e-9) if len(a) else -99
tl = 0; sorun = 0
for i, p in enumerate(v["parcalar"]):
    n = p["src"].replace("_dikey.mp4", ""); a = p["bas"]; b = a + p["kare"] / 30
    once, ilk, son, sonra = db(n, a - 0.08, 0.08), db(n, a, 0.04), db(n, b - 0.04, 0.04), db(n, b, 0.08)
    isaret = []
    if ilk > -32 or once > -34: isaret.append(f"BAŞ? (önce {once:.0f}, ilk {ilk:.0f})")
    if son > -32 or sonra > -34: isaret.append(f"SON? (son {son:.0f}, sonra {sonra:.0f})")
    sorun += bool(isaret)
    kel = " ".join(w["w"] for w in v["altyazi"] if tl <= w["s"] < tl + p["kare"] / 30)
    print(f"{i:2d} {tl:5.2f}s {n} {a:6.2f}-{b:6.2f} | {kel[:60]:60s} {' '.join(isaret)}")
    tl += p["kare"] / 30
print("sorunlu kesme:", sorun, "| toplam", round(tl, 1), "sn")
