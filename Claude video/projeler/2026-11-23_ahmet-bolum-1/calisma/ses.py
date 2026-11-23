"""Ahmet Bölüm 1 — ana ses: seslendirme + müzik (sentez piyano/yaylı) + ses efektleri -> girdiler/ana_ses.wav
Zamanlar prodüksiyon planındaki seslendirme ve müzik tablosundan."""
import numpy as np, subprocess, wave, json

SR = 48000
DUR = 62.5
N = int(SR * DUR)
rng = np.random.default_rng(7)

def db(x): return 10 ** (x / 20)
def oku(yol):
    a = subprocess.run(["ffmpeg", "-v", "error", "-i", yol, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(a, np.float32).copy()
def ekle(iz, sig, t, gain=1.0):
    i = int(t * SR)
    if i >= len(iz): return
    s = sig[: len(iz) - i]
    iz[i:i + len(s)] += s * gain
def env(n, a=0.005, r=0.05):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def lp(x, fc):
    """iki kez tek kutuplu alçak geçiren"""
    from scipy.signal import lfilter
    a = np.exp(-2 * np.pi * fc / SR)
    return lfilter([1 - a], [1, -a], lfilter([1 - a], [1, -a], x))
def hp(x, fc): return x - lp(x, fc)
def bp(x, lo, hi): return lp(hp(x, lo), hi)
def reverb(x, sure=2.2, mix=0.25):
    n = int(sure * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lp(ir, 5000); ir /= np.sqrt((ir ** 2).sum())
    from scipy.signal import fftconvolve
    w = fftconvolve(x, ir)[: len(x)]
    return x * (1 - mix) + w * mix * 1.2

# ---------------- SESLENDİRME ----------------
vo = np.zeros(N)
PLAN = json.load(open("src/plan.json"))
VO = [(v["k"], v["bas"]) for v in PLAN["vo"]]
for k, t in VO:
    s = oku(f"calisma/vo/{k}.wav")
    if k.startswith("i"):   # iç ses: biraz daha genç/yakın, kuru, kısık
        s = subprocess.run(["ffmpeg", "-v", "error", "-i", f"calisma/vo/{k}.wav", "-af",
                            f"asetrate={SR}*1.07,aresample={SR},atempo=0.935,lowpass=6500,highpass=120,acompressor=threshold=-24dB:ratio=3",
                            "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
        s = np.frombuffer(s, np.float32).copy() * 0.85
    else:                   # anlatıcı: sıcaklık + çok hafif oda
        s = hp(s, 70)
        s = s + 0.18 * lp(s, 300)
    ekle(vo, s, t)
vo = vo / (np.abs(vo).max() + 1e-9) * 0.9
voR = reverb(vo, 0.6, 0.06)

# ---------------- MÜZİK (dinamik / dramatik fragman tarzı) ----------------
# 100 BPM, re minör. Bölümler: kanca (0-8), sorular (8-19), düşüş (19-26.2), gerilim (26.2-29.6),
# keşif (29.6-38.6), patlama + sabah teması (42-51), cliffhanger (52.6-59.7), final kartı (59.7-).
def nota(m): return 440 * 2 ** ((m - 69) / 12)
def yayli(ms, sure, vel=0.3, atak=1.2):
    n = int(sure * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for m in ms:
        for d in (-0.08, 0.0, 0.07):
            f = nota(m) * 2 ** (d / 12)
            vib = 1 + 0.003 * np.sin(2 * np.pi * 5.2 * t + rng.random() * 6)
            ph = 2 * np.pi * np.cumsum(f * vib) / SR
            s += (np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph))
    s = lp(s, 2500)
    e = np.minimum(1, t / atak) * np.minimum(1, (sure - t) / 1.0)
    return s * e * vel * 0.05
BPM = 100; BT = 60 / BPM
def saw(f, n, ph=0.0):
    t = np.arange(n) / SR
    return 2 * ((f * t + ph) % 1) - 1
def braam(m, sure=3.0, g=1.0):
    n = int(sure * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for dt in (-0.12, 0, 0.1):
        for okt in (0, 12):
            s += saw(nota(m + okt) * 2 ** (dt / 12), n, rng.random()) * (1 if okt == 0 else 0.5)
    s = lp(s, 700) + lp(s, 2200) * np.exp(-t * 2.5) * 0.6
    e = np.minimum(1, t / 0.03) * np.exp(-t * 0.9)
    return s * e * g * 0.12
def boom(sure=2.0, g=1.0):
    n = int(sure * SR); t = np.arange(n) / SR
    f = 30 + 70 * np.exp(-t * 6); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 2.2) + lp(rng.standard_normal(n), 300) * np.exp(-t * 8) * 0.6) * g * 0.9
def kick(g=1.0):
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 45 + 90 * np.exp(-t * 30); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * g
def tom(f0=110, g=1.0):
    n = int(0.6 * SR); t = np.arange(n) / SR
    f = f0 * (0.6 + 0.4 * np.exp(-t * 12)); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 5) + bp(rng.standard_normal(n), 200, 2000) * np.exp(-t * 25) * 0.4) * g * 0.8
def clap(g=1.0):
    n = int(0.25 * SR); t = np.arange(n) / SR
    return bp(rng.standard_normal(n), 900, 6000) * (np.exp(-t * 22) + 0.4 * np.exp(-((t - 0.012) ** 2) / 1e-5)) * g * 0.35
def hh(g=1.0):
    n = int(0.05 * SR); return hp(rng.standard_normal(n), 7000) * np.exp(-np.linspace(0, 8, n)) * g * 0.12
def riser(sure, g=1.0):
    n = int(sure * SR); t = np.arange(n) / SR; x = t / sure
    nz = rng.standard_normal(n)
    out = np.zeros(n); seg = int(0.05 * SR)
    for i in range(0, n, seg):   # yükselen bant geçiren gürültü
        fc = 300 + 7000 * x[i] ** 2
        out[i:i + seg] = bp(nz[i:i + seg + 200], fc * 0.7, fc * 1.3)[: len(out[i:i + seg])]
    f = 120 + 900 * x ** 2; ph = 2 * np.pi * np.cumsum(f) / SR
    return (out * 0.8 + np.sin(ph) * 0.15) * x ** 2 * g * 0.6
def ost(m, sure, g=1.0):  # staccato yaylı nota
    n = int(sure * SR); t = np.arange(n) / SR
    s = saw(nota(m), n) + saw(nota(m) * 1.004, n, 0.3) + 0.5 * saw(nota(m + 12), n)
    return lp(s, 2600) * np.exp(-t * 14) * np.minimum(1, t / 0.006) * g * 0.07
def pad(ms, sure, g=1.0, atak=1.0): return yayli(ms, sure, g, atak)
def tick(g=1.0):
    n = int(0.03 * SR); return bp(rng.standard_normal(n), 2500, 9000) * np.exp(-np.linspace(0, 10, n)) * g * 0.5

muz = np.zeros(N); dr = np.zeros(N)   # muz: armoni, dr: davul/efekt
def dongu(a, b, adim): t = a; out = []
def zamanlar(a, b, adim):
    t = a; z = []
    while t < b - 1e-6: z.append(t); t += adim
    return z
Dm = [50, 53, 57]; Bb = [46, 50, 53]; F = [41, 45, 48]; C = [48, 52, 55]; A = [45, 49, 52]
D = [50, 54, 57]; Am = [45, 48, 52]; Bm = [47, 50, 54]; G = [43, 47, 50]

# KANCA 0-8: braam + saat tiki + alçak drone, 1.4'ten ostinato (8'lik)
ekle(dr, boom(3, 0.8), 0.35); ekle(muz, braam(38, 4.0, 1.0), 0.35)
ekle(muz, pad([38, 45], 8.3, 0.5, 2.0), 0.0)
for t in zamanlar(0.0, 8.0, BT): ekle(dr, tick(0.6), t)
desen = [62, 62, 65, 62, 69, 62, 65, 62]
for i, t in enumerate(zamanlar(1.4, 8.6, BT / 2)): ekle(muz, ost(desen[i % 8], 0.3, 0.6 + 0.4 * (t - 1.4) / 7.2), t)
ekle(dr, riser(1.6, 0.6), 7.0); ekle(dr, boom(1.5, 0.6), 8.6)

# SORULAR 8.6-19: 16'lık ostinato, kick 1-3, her soruya tom vurgusu, 17-19 yükselen
akS = [Dm, Bb, F, C]
for i, t in enumerate(zamanlar(8.6, 19.0, BT / 4)):
    ak = akS[int((t - 8.6) // (BT * 4)) % 4]
    ekle(muz, ost(ak[i % 3] + 12, 0.18, 0.75), t)
for k, t in enumerate(zamanlar(8.6, 19.0, BT * 4)):
    ak = akS[k % 4]; ekle(muz, pad([ak[0] - 12, ak[0], ak[2]], BT * 4 + 0.3, 0.5, 0.4), t)
for t in zamanlar(8.6, 19.0, BT):
    ekle(dr, kick(0.8), t)
    ekle(dr, hh(0.8), t + BT / 2)
for t in (10.6, 11.95, 13.95, 15.75): ekle(dr, tom(95, 1.0), t - 0.02); ekle(dr, tom(70, 0.8), t + 0.15)
ekle(dr, riser(2.4, 0.9), 16.6)

# DÜŞÜŞ 19-26.2: ani sessizlik + kalp atışı + alçak drone + ürkütücü tiz ton
ekle(dr, boom(2.5, 0.9), 19.0)
ekle(muz, pad([26, 38], 7.4, 0.6, 1.5), 19.0)
ekle(muz, pad([81], 7.0, 0.12, 3.0), 19.2)
for t in zamanlar(19.6, 26.0, 1.0): ekle(dr, kick(0.55), t); ekle(dr, kick(0.4), t + 0.22)

# GERİLİM 26.2-29.6: ostinato geri döner (alçak), riser -> 29.6 büyük vuruş
for i, t in enumerate(zamanlar(26.2, 29.6, BT / 4)): ekle(muz, ost([50, 53, 50, 57][i % 4], 0.16, 0.5 + 0.5 * (t - 26.2) / 3.4), t)
for t in zamanlar(26.2, 29.6, BT): ekle(dr, kick(0.7), t)
ekle(dr, riser(2.6, 1.0), 27.0)
ekle(dr, boom(3, 1.2), 29.6); ekle(muz, braam(38, 3.5, 1.2), 29.6); ekle(muz, braam(41, 3.5, 0.6), 29.6)

# KEŞİF 29.6-38.6: Bb-F-C-Dm ile yükselen, davullar sürekli artar
akK = [Bb, F, C, Dm]
for i, t in enumerate(zamanlar(30.8, 38.4, BT / 4)):
    ak = akK[int((t - 30.8) // (BT * 4)) % 4]
    ekle(muz, ost(ak[i % 3] + 12 + (12 if t > 35 else 0) * (i % 2), 0.18, 0.65 + 0.35 * (t - 30.8) / 7.6), t)
for k, t in enumerate(zamanlar(30.8, 38.4, BT * 4)):
    ak = akK[k % 4]; ekle(muz, pad([ak[0], ak[1] + 12, ak[2] + 12], BT * 4 + 0.3, 0.55, 0.5), t)
for t in zamanlar(30.8, 38.4, BT):
    ekle(dr, kick(0.85), t); ekle(dr, hh(0.9), t + BT / 2)
    if t > 33.2: ekle(dr, clap(0.8), t + BT) if int((t - 30.8) / BT) % 2 == 0 else None
ekle(dr, riser(2.2, 1.0), 36.4)
# "Peki sonra ne oldu?" 38.6: vuruş, kısa boşluk, büyük yükselen -> 42.0 patlama
ekle(dr, boom(2, 1.1), 38.55); ekle(muz, braam(43, 2.2, 0.9), 38.55)
ekle(dr, riser(2.8, 2.2), 39.2)
for i, t in enumerate(zamanlar(40.4, 42.0, BT / 4)): ekle(dr, tom(120 + i * 6, 0.35 + i * 0.05), t)

# SABAH TEMASI 42-51: re majör, sürüklü ve kahramanca
ekle(dr, boom(2.5, 1.6), 42.0); ekle(muz, braam(38, 3.0, 1.1), 42.0)
akM = [D, A, Bm, G]
for i, t in enumerate(zamanlar(42.0, 51.0, BT / 4)):
    ak = akM[int((t - 42.0) // (BT * 4)) % 4]
    ekle(muz, ost(ak[i % 3] + 12, 0.18, 0.8), t)
for k, t in enumerate(zamanlar(42.0, 51.0, BT * 4)):
    ak = akM[k % 4]; ekle(muz, pad([ak[0] - 12, ak[0] + 12, ak[1] + 12, ak[2] + 12], BT * 4 + 0.3, 0.7, 0.3), t)
for j, t in enumerate(zamanlar(42.0, 51.0, BT)):
    ekle(dr, kick(0.9), t); ekle(dr, hh(1.0), t + BT / 2); ekle(dr, hh(0.6), t + BT / 4)
    if j % 2 == 1: ekle(dr, clap(1.0), t)

# YOLUNDA GİBİ 51-52.6: hafifler
for t in zamanlar(51.0, 52.6, BT / 2): ekle(muz, ost([62, 66, 69, 66][int((t - 51) / (BT / 2)) % 4] + 12, 0.25, 0.45), t)
ekle(muz, pad([50, 62, 66, 69], 2.0, 0.4, 0.3), 51.0)

# CLIFFHANGER 52.75-59.7: hızlanan saat tiki, disonant yaylı, alçak nabız, riser -> 59.7 vuruş ve kesme
ekle(dr, boom(2.0, 0.8), 52.75)
ekle(muz, pad([38, 45, 49], 7.0, 0.6, 1.0), 52.75)
ekle(muz, pad([61, 62], 4.5, 0.25, 2.0), 55.3)
t = 52.75
while t < 59.6:
    ekle(dr, tick(0.9), t); ekle(dr, kick(0.45), t) if int((t - 52.75) * 10) % 2 == 0 else None
    t += 0.5 - 0.3 * (t - 52.75) / 6.9
ekle(dr, riser(2.6, 1.0), 57.0)
cut = int(59.66 * SR); muz[cut:] = 0; dr[cut:] = 0
ekle(dr, boom(2.6, 1.3), 59.7); ekle(muz, braam(38, 3.0, 1.0), 59.7)
ekle(muz, pad([50, 57, 62], 2.8, 0.35, 0.8), 59.75)

muz = reverb(muz, 2.2, 0.28); dr = reverb(dr, 1.2, 0.12)
muz = muz / (np.abs(muz).max() + 1e-9); dr = dr / (np.abs(dr).max() + 1e-9)
muz = muz * 0.75 + dr * 0.9
# bölüm seviyeleri + seslendirme altında otomatik kısma (ducking)
otom = np.interp(np.arange(N) / SR, [0, 0.3, 8, 19, 19.05, 26, 29.6, 38.5, 40, 42.6, 43.2, 51, 52.7, 59.6, 59.7, 62.5],
                 [.35, .42, .42, .48, .40, .36, .50, .50, .62, .70, .52, .50, .42, .55, .58, .45])
from scipy.ndimage import maximum_filter1d, uniform_filter1d
venv = uniform_filter1d(maximum_filter1d(np.abs(vo), int(0.08 * SR)), int(0.15 * SR))
venv = np.clip(venv / (np.percentile(venv[venv > 1e-3], 60) + 1e-9), 0, 1)
muz *= otom * (1 - 0.5 * venv)
muz /= (np.abs(muz).max() + 1e-9) / 0.7

# ---------------- SES EFEKTLERİ ----------------
fx = np.zeros(N)
def gurultu(n): return rng.standard_normal(n)
def tik(sure=0.012, f1=2500, f2=7000, g=1.0):
    n = int(sure * SR); return bp(gurultu(n), f1, f2) * np.exp(-np.linspace(0, 8, n)) * g
def kaydir():   # ekranda parmak kaydırma: yumuşak sürtünme
    n = int(0.22 * SR); return bp(gurultu(n), 1500, 5000) * np.sin(np.linspace(0, np.pi, n)) * 0.25
def gicirti(sure=0.5, f0=380):
    n = int(sure * SR); t = np.arange(n) / SR
    f = f0 * (1 + 0.25 * np.sin(2 * np.pi * 3 * t)) ; ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sign(np.sin(ph)) * 0.3 + gurultu(n) * 0.2
    return bp(s, 300, 2500) * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.35
def kapak_ac():
    s = gicirti(0.35, 900) * 0.4; s[-int(0.03 * SR):] += tik(0.03, 800, 4000, 1.2)[: int(0.03 * SR)]; return s
def kapak_kapa():
    n = int(0.25 * SR); t = np.arange(n) / SR
    s = lp(gurultu(n), 400) * np.exp(-t * 30) * 3 + np.sin(2 * np.pi * 95 * t) * np.exp(-t * 25) * 0.8
    return s * 0.6
def klavye(sure, hiz=9, g=0.5):
    out = np.zeros(int(sure * SR)); t = 0.0
    while t < sure - 0.05:
        ekle(out, tik(0.018, 1500, 6000, g * (0.6 + 0.4 * rng.random())), t); t += rng.exponential(1 / hiz) + 0.04
    return out
def trackpad(n_tik, ara=0.6):
    out = np.zeros(int((n_tik * ara + 0.2) * SR))
    for j in range(n_tik): ekle(out, tik(0.01, 2000, 8000, 0.7), j * ara + rng.random() * 0.15)
    return out
def kalem(sure):
    n = int(sure * SR); t = np.arange(n) / SR
    am = np.clip(np.sin(2 * np.pi * 3.3 * t + np.sin(2 * np.pi * 1.1 * t) * 2), 0, 1) ** 0.6
    return bp(gurultu(n), 2500, 9000) * am * 0.18
def nefes(sure=1.4, g=0.35):
    n = int(sure * SR); return bp(gurultu(n), 300, 2500) * np.sin(np.linspace(0, np.pi, n)) ** 2 * g
def kus():
    n = int(0.18 * SR); t = np.arange(n) / SR; f0 = 3200 + rng.random() * 1500
    f = f0 + 900 * np.sin(2 * np.pi * (14 + rng.random() * 8) * t); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.08
def seramik():
    n = int(0.4 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2350 * t) * 0.5 + np.sin(2 * np.pi * 3720 * t) * 0.3) * np.exp(-t * 18) * 0.25
def telefon_ac():
    n = int(0.12 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 30) * 0.12 + np.pad(tik(0.015, 1000, 5000, 0.5), (0, n - int(0.015 * SR)))
def sandalye_otur():
    s = gicirti(0.45, 300) * 0.8; n = int(0.15 * SR)
    return np.concatenate([lp(gurultu(n), 300) * np.exp(-np.linspace(0, 6, n)) * 1.5, s])

# oda tonu (gece) 0-29, sabah ortamı 42-60
oda = lp(gurultu(N), 180) * 0.6 + lp(gurultu(N), 1200) * 0.08
hum = np.sin(2 * np.pi * 120 * np.arange(N) / SR) * 0.02
odaz = np.interp(np.arange(N) / SR, [0, 0.5, 26.9, 27.2, 29, 30, 41.5, 42.5, 60], [0, db(-40), db(-40), db(-46), db(-46), db(-42), db(-42), db(-44), db(-44)])
fx += (oda + hum) * odaz / 0.2
trafik = lp(gurultu(N), 350) * np.interp(np.arange(N) / SR, [0, 42, 43, 60], [0, 0, db(-40), db(-40)]) * 6
fx += trafik
tt = 42.4
while tt < 59.5:
    ekle(fx, kus(), tt); tt += 0.25 + rng.exponential(1.4)
# olaylar
def wav(ad):
    return oku(f"../../marka/sfx/{ad}.wav")
for bsl in PLAN["basliklar"][1:]:
    ekle(fx, wav("whoosh_giris"), max(0, bsl["bas"] - 0.12), 0.18)
for t in (1.2, 2.4, 3.6): ekle(fx, kaydir(), t)
ekle(fx, sandalye_otur(), 8.25)
ekle(fx, kapak_ac(), 8.95)
ekle(fx, trackpad(4, 0.7), 10.1); ekle(fx, klavye(1.4, 10, 0.4), 11.4)
ekle(fx, kalem(2.8), 13.1)
ekle(fx, klavye(1.6, 12, 0.3), 16.3)
ekle(fx, nefes(1.5, 0.15), 19.6)
ekle(fx, nefes(1.0, 0.15), 22.9); ekle(fx, gicirti(0.6, 260), 23.6)
ekle(fx, kapak_kapa(), 26.8)
ekle(fx, telefon_ac(), 29.8)
for t in (32.1, 32.6, 33.1): ekle(fx, kaydir(), t)
n = int(0.1 * SR); ekle(fx, lp(gurultu(n), 600) * np.exp(-np.linspace(0, 10, n)), 38.9)  # telefonu masaya bırakma
ekle(fx, kapak_ac(), 39.4); ekle(fx, trackpad(2, 0.5), 40.6)
ekle(fx, kalem(2.6), 45.2); ekle(fx, tik(0.05, 400, 3000, 0.6), 47.6)   # sayfa
ekle(fx, klavye(2.4, 7, 0.28), 48.3); ekle(fx, trackpad(2, 0.8), 49.2)
ekle(fx, seramik(), 52.5)
ekle(fx, klavye(1.2, 6, 0.18), 54.0)
# telefon titreşimi + bildirim (55.6), 58.3 kesme vurgusu, takip et tıklaması
def titresim(sure=0.35):
    n = int(sure * SR); tn = np.arange(n) / SR
    return (np.sign(np.sin(2 * np.pi * 160 * tn)) * 0.4 + np.sin(2 * np.pi * 320 * tn) * 0.2) * np.sin(np.linspace(0, np.pi, n)) * 0.25
ekle(fx, titresim(), 55.55); ekle(fx, titresim(), 56.05)
ekle(fx, wav("bildirim"), 55.6, 0.5)
fx[int(59.65 * SR):] *= 0.0
ekle(fx, wav("tik"), 61.55, 0.6); ekle(fx, wav("basari"), 61.6, 0.3)

# ---------------- MİKS ----------------
mix = voR * 1.0 + muz * 0.55 + fx * 0.8
mix = np.tanh(mix * 1.1) / 1.1
st = np.stack([mix, mix], 1)
st /= np.abs(st).max() / 0.89
w = wave.open("calisma/ana_ses_ham.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st * 32767).astype(np.int16).tobytes()); w.close()
print("ok")
