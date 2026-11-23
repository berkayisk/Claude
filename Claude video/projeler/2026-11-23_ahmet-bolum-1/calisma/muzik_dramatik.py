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
ekle(dr, riser(2.8, 1.3), 39.2)
for i, t in enumerate(zamanlar(40.4, 42.0, BT / 4)): ekle(dr, tom(120 + i * 6, 0.35 + i * 0.05), t)

# SABAH TEMASI 42-51: re majör, sürüklü ve kahramanca
ekle(dr, boom(2.5, 1.2), 42.0); ekle(muz, braam(38, 3.0, 0.8), 42.0)
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
otom = np.interp(np.arange(N) / SR, [0, 0.3, 8, 19, 19.05, 26, 29.6, 38.5, 42, 51, 52.7, 59.6, 59.7, 62.5],
                 [.35, .42, .42, .48, .40, .36, .50, .50, .55, .50, .42, .55, .55, .45])
from scipy.ndimage import maximum_filter1d, uniform_filter1d
venv = uniform_filter1d(maximum_filter1d(np.abs(vo), int(0.08 * SR)), int(0.15 * SR))
venv = np.clip(venv / (np.percentile(venv[venv > 1e-3], 60) + 1e-9), 0, 1)
muz *= otom * (1 - 0.5 * venv)
muz /= (np.abs(muz).max() + 1e-9) / 0.7
