"""Ahmet Bölüm 1 — ana ses: seslendirme + müzik (sentez piyano/yaylı) + ses efektleri -> girdiler/ana_ses.wav
Zamanlar prodüksiyon planındaki seslendirme ve müzik tablosundan."""
import numpy as np, subprocess, wave, json

SR = 48000
DUR = 60.0
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
VO = [("n1", 0.5), ("n2", 1.5), ("n3", 4.7), ("n4", 9.0), ("n5", 11.6), ("n6", 12.9), ("n7", 14.8), ("n8", 16.4),
      ("i1", 22.6), ("i2", 25.4), ("n9", 30.3), ("n10", 33.0), ("n11", 43.0), ("n12", 47.4)]
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

# ---------------- MÜZİK ----------------
def nota(m): return 440 * 2 ** ((m - 69) / 12)
def piyano(m, sure, vel=0.5):
    n = int((sure + 1.8) * SR); t = np.arange(n) / SR; f = nota(m)
    s = np.zeros(n)
    for h, (amp, dec) in enumerate([(1, 2.2), (0.45, 3.0), (0.22, 4.0), (0.12, 5.5), (0.06, 7.0), (0.03, 9)], 1):
        fh = f * h * np.sqrt(1 + 0.0004 * h * h)
        s += amp * np.sin(2 * np.pi * fh * t + rng.random() * 6) * np.exp(-t * dec * (0.6 + f / 900))
    s *= np.minimum(1, t / 0.004)
    rel = int(sure * SR)
    if rel < n: s[rel:] *= np.exp(-np.arange(n - rel) / SR * 6)
    return s * vel * 0.25
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
muz = np.zeros(N)
bpm = 70; beat = 60 / bpm
# Tema A: re minör arpej 0-19 sn (Dm - Bb - F - C), 8. sn'den pad
akorA = [[50, 57, 62, 65, 69], [46, 53, 58, 62, 65], [41, 48, 53, 57, 60], [48, 55, 60, 64, 67]]
t = 0.0; i = 0
while t < 18.6:
    ak = akorA[(i // 8) % 4]
    sira = [0, 2, 3, 4, 3, 2, 1, 2]
    vel = 0.42 if t < 16 else 0.30
    if not (t >= 16 and i % 2 == 1):   # 16 sn sonrası seyrekleşir
        ekle(muz, piyano(ak[sira[i % 8]] + 12, beat * 0.9, vel), t)
    if i % 8 == 0: ekle(muz, piyano(ak[0], beat * 4, 0.35), t)
    t += beat / 2; i += 1
pad = np.zeros(N)
for k, (a, b) in enumerate([(8.0, 11.4), (11.4, 14.9), (14.9, 19.0)]):
    ak = akorA[(k + 1) % 4]
    ekle(pad, yayli([ak[1], ak[2], ak[3]], b - a + 0.3, 0.22 if a < 16 else 0.14, 1.5), a)
muz += pad
muz[int(19.0 * SR):int(19.17 * SR)] *= np.linspace(1, 0, int(0.17 * SR))  # 0:19 tam durur (4 kare kuyruk)
muz[int(19.17 * SR):int(32.0 * SR)] = 0
# Tema B: re majör 32-60 sn (D - A - Bm - G)
akorB = [[50, 57, 62, 66, 69], [45, 52, 57, 61, 64], [47, 54, 59, 62, 66], [43, 50, 55, 59, 62]]
muzB = np.zeros(N)
ekle(muzB, piyano(74, 2.5, 0.35), 32.0)        # tek nota motifi
ekle(muzB, piyano(73, 1.2, 0.28), 33.7)
ekle(muzB, piyano(69, 2.0, 0.3), 34.6)
t = 36.0; i = 0
while t < 57.8:
    ak = akorB[(i // 8) % 4]
    sira = [0, 2, 3, 4, 3, 2, 3, 1]
    v = 0.30 if t < 41.5 else (0.42 if t < 54 else 0.48)
    ekle(muzB, piyano(ak[sira[i % 8]] + 12, beat * 0.9, v), t)
    if i % 8 == 0: ekle(muzB, piyano(ak[0], beat * 4, 0.38), t)
    t += beat / 2; i += 1
# yaylılar 36'dan, 41.5 kreşendo
for k in range(6):
    a = 36.0 + k * beat * 4
    ak = akorB[k % 4]
    vel = 0.12 + 0.05 * k if a < 42 else 0.22
    ekle(muzB, yayli([ak[2] + 12, ak[3] + 12, ak[4] + 12], beat * 4 + 0.4, vel, 1.0), a)
t = 36.0 + 6 * beat * 4; k = 6
while t < 58:
    ak = akorB[k % 4]
    ekle(muzB, yayli([ak[2] + 12, ak[3] + 12, ak[4] + 12], min(beat * 4 + 0.4, 60 - t), 0.24, 1.0), t)
    t += beat * 4; k += 1
# shaker 42.5-58
t = 42.5
while t < 57.5:
    n = int(0.06 * SR); sh = hp(rng.standard_normal(n), 6000) * np.exp(-np.linspace(0, 6, n))
    ekle(muzB, sh, t, 0.025 if (round((t - 42.5) / (beat / 2)) % 2) else 0.04)
    t += beat / 2
# 41.5 kreşendo şişmesi
sw = np.ones(N); a, b = int(39.5 * SR), int(42.5 * SR)
sw[a:b] = 1 + 0.8 * np.sin(np.linspace(0, np.pi, b - a))
muzB *= sw
# son: 58'de akor söner, 58.3 tek nota
fo = np.ones(N); fo[int(58.0 * SR):] = np.linspace(1, 0, N - int(58.0 * SR))
muzB *= fo
ekle(muzB, piyano(62 + 12, 1.6, 0.4), 58.3)
muz += muzB
muz = reverb(muz, 2.6, 0.32)
muz = muz / (np.abs(muz).max() + 1e-9)
# seviye otomasyonu (seslendirme altında ~-20 dB görece, araları biraz yukarı)
otom = np.interp(np.arange(N) / SR,
                 [0, 0.5, 8, 16, 19, 32, 33, 36, 41.5, 42.5, 54, 54.6, 58, 60],
                 [0, .18, .18, .14, .14, .14, .16, .18, .30, .20, .20, .34, .34, .30])
muz *= otom

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
ekle(fx, klavye(3.5, 6, 0.18), 54.2)
fx[int(58.0 * SR):] *= np.linspace(1, 0, N - int(58.0 * SR)) ** 2

# ---------------- MİKS ----------------
mix = voR * 1.0 + muz * 0.9 + fx * 0.9
mix = np.tanh(mix * 1.1) / 1.1
st = np.stack([mix, mix], 1)
st /= np.abs(st).max() / 0.89
w = wave.open("calisma/ana_ses_ham.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st * 32767).astype(np.int16).tobytes()); w.close()
print("ok")
