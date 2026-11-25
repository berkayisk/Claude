"""99,99 videosu: VO süreleri -> src/plan.json, dudak senkronu -> src/vizem.json, ses miksi -> girdiler/ses.wav
Kullanım (proje kökünden): python3 calisma/yap.py [plan|dudak|miks|hepsi]"""
import sys, os, json, subprocess, numpy as np, soundfile as sf

SR = 48000
BOSLUK = {"n2": 0.25, "n6": 0.45, "n7": 0.4, "n9": 0.3, "n11": 0.45, "n12": 0.4}  # satırdan önceki boşluk
VARSAYILAN = 0.22

def plan():
    D = json.load(open("calisma/vo/sureler.json")); S = json.load(open("senaryo/satirlar.json"))
    t, vo = 0.25, []
    for i, s in enumerate(S):
        if i: t += BOSLUK.get(s["k"], VARSAYILAN)
        du = D[s["k"]][1]
        vo.append({"k": s["k"], "metin": s["metin"], "bas": round(t, 3), "son": round(t + du, 3)}); t += du
    P = {"vo": vo, "bitis": round(t + 0.9, 2), "ses": "ses.wav"}
    # takip tıklaması: n12'de "takip" kelimesi
    try:
        sys.path.insert(0, "../../araclar"); from telaffuz import Denetci, oku16
        n12 = vo[-1]; hz = Denetci().harf_zamanlari(oku16("calisma/vo/n12.wav"), n12["metin"])
        tk = [h[0][1] for w, h in hz if w.startswith("takip") and h]
        P["takipTik"] = round(n12["bas"] + (tk[0] if tk else 2.0), 2)
    except Exception as e:
        print("takip zamanı bulunamadı:", e); P["takipTik"] = round(vo[-1]["bas"] + 2.0, 2)
    json.dump(P, open("src/plan.json", "w"), ensure_ascii=False, indent=1)
    for v in vo: print(f"{v['k']:4s} {v['bas']:6.2f}-{v['son']:6.2f} {v['metin']}")
    print("bitiş", P["bitis"], "takip", P["takipTik"])

def dudak():
    subprocess.run(["python3", "../../araclar/dudak.py", "src/plan.json", "calisma/vo", "src/vizem.json"], check=True)

def oku(p, mono=True):
    a = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1" if mono else "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    x = np.frombuffer(a, np.float32).copy()
    return x if mono else x.reshape(-1, 2)

def db(x): return 10 ** (x / 20)

def miks():
    P = json.load(open("src/plan.json")); V = {v["k"]: v for v in P["vo"]}
    N = int((P["bitis"] + 0.1) * SR); out = np.zeros((N, 2), np.float32)
    def koy(sig, t, g=0.0, pan=0.0):
        i = int(t * SR)
        if i >= N: return
        s = sig[: N - i] * db(g)
        out[i:i + len(s), 0] += s * (1 - max(0, pan)); out[i:i + len(s), 1] += s * (1 + min(0, pan))
    # seslendirme
    vo_bus = np.zeros(N, np.float32)
    for k, v in V.items():
        s = oku(f"calisma/vo/{k}.wav"); i = int(v["bas"] * SR); s = s[: N - i]; vo_bus[i:i + len(s)] += s
    # müzik: Mixkit "New Bass 02" (Lily J) ritimli bölüm, konuşmada -5 dB kısılır
    m = oku("audio/muzik/mk-721.mp3", mono=False)[int(16.63 * SR):][:N]
    zarf = np.full(N, db(-17.0), np.float32)
    konus = np.zeros(N, bool)
    for v in V.values(): konus[int((v["bas"] - 0.1) * SR):int((v["son"] + 0.15) * SR)] = True
    hedef = np.where(konus, db(-21.0), db(-16.0)).astype(np.float32)
    # yumuşak geçiş (~120 ms)
    k = int(0.12 * SR); ker = np.ones(k, np.float32) / k
    zarf = np.convolve(hedef, ker, mode="same")
    fo = int(1.2 * SR); zarf[-fo:] *= np.linspace(1, 0, fo)
    zarf[: int(0.3 * SR)] *= np.linspace(0, 1, int(0.3 * SR))
    out[: len(m)] += m * zarf[: len(m), None]
    # efektler
    fx = {n: oku(f"audio/sfx/{n}.wav") for n in ["pop", "whoosh", "click", "coin", "ding", "swoosh_down", "tick"]}
    E = [("swoosh_down", V["n1"]["bas"] - 0.25, -12), ("coin", V["n2"]["bas"] + 0.1, -14), ("tick", V["n2"]["bas"] + 0.9, -8),
         ("pop", V["n2"]["bas"] + 1.5, -10), ("whoosh", V["n3"]["bas"] - 0.15, -12), ("pop", V["n4"]["bas"] - 0.1, -11),
         ("pop", V["n4"]["bas"] + 1.8, -11), ("pop", V["n5"]["bas"], -12), ("whoosh", V["n5"]["bas"] + 1.25, -13),
         ("pop", V["n6"]["bas"] - 0.15, -10), ("whoosh", V["n7"]["bas"] - 0.15, -12),
         ("tick", V["n8"]["bas"], -9), ("tick", V["n8"]["bas"] + 0.25, -9), ("tick", V["n8"]["bas"] + 0.5, -9),
         ("pop", V["n9"]["bas"] + 0.35, -12), ("pop", V["n9"]["bas"] + 0.9, -12), ("ding", V["n9"]["bas"] + 1.45, -16),
         ("pop", V["n10"]["bas"] + 0.75, -10), ("whoosh", V["n11"]["bas"] - 0.15, -12),
         ("click", P["takipTik"], -6), ("ding", P["takipTik"] + 0.1, -17)]
    for n, t, g in E: koy(fx[n], max(0, t), g)
    out[:, 0] += vo_bus * db(2.0); out[:, 1] += vo_bus * db(2.0)
    sf.write("calisma/ham_miks.wav", out, SR)
    subprocess.run(["python3", "../../araclar/loudnorm2.py", "calisma/ham_miks.wav", "calisma/ses_norm.m4a"], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "calisma/ses_norm.m4a", "-ar", str(SR), "girdiler/ses.wav"], check=True)
    os.remove("calisma/ses_norm.m4a"); print("ses -> girdiler/ses.wav")

if __name__ == "__main__":
    k = sys.argv[1] if len(sys.argv) > 1 else "hepsi"
    if k in ("plan", "hepsi"): plan()
    if k in ("dudak", "hepsi"): dudak()
    if k in ("miks", "hepsi"): miks()
