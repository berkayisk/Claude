#!/usr/bin/env python3
"""Fragman için gerilim müziği üretir (telifsiz, tamamen kodla).
Kullanım: python3 araclar/gerilim_muzigi.py cikti.wav sure_sn kesme1,kesme2,...  [bpm_bas=62] [bpm_son=92]"""
import sys, numpy as np, wave
out = sys.argv[1]; SURE = float(sys.argv[2])
kesmeler = [float(x) for x in sys.argv[3].split(",")] if len(sys.argv) > 3 and sys.argv[3] else []
bpm0 = float(sys.argv[4]) if len(sys.argv) > 4 else 62; bpm1 = float(sys.argv[5]) if len(sys.argv) > 5 else 92
SR = 44100; n = int(SURE * SR); t = np.arange(n) / SR
rng = np.random.default_rng(7)
L = np.zeros(n); R = np.zeros(n)

def lp(x, a):  # tek kutuplu alçak geçiren
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
def env_exp(m, tau): return np.exp(-np.arange(m) / (tau * SR))
def ekle(sig, bas, gL=1.0, gR=1.0):
    i = int(bas * SR); j = min(n, i + len(sig))
    if i >= n or j <= 0: return
    L[i:j] += sig[: j - i] * gL; R[i:j] += sig[: j - i] * gR

# 1) Drone: A1 + A2 + hafif yarım ton uyumsuzluk, yavaş nefes alan genlik
lfo = 0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * t)
buyume = np.clip(t / SURE, 0, 1) ** 1.3
drone = (np.sin(2*np.pi*55*t) + 0.6*np.sin(2*np.pi*110.3*t) + 0.25*np.sin(2*np.pi*58.27*t) + 0.15*np.sin(2*np.pi*165.2*t)) * lfo
drone *= (0.55 + 0.45 * buyume)
giris = np.clip(t / 1.5, 0, 1)
L += drone * 0.22 * giris; R += np.roll(drone, 300) * 0.22 * giris

# 2) Yüksek gergin yaylı: E5-F5 tremolo, sona doğru yükselir
trem = 0.5 + 0.5 * np.sin(2 * np.pi * 7 * t)
yayli = (np.sin(2*np.pi*659.3*t) + 0.8*np.sin(2*np.pi*698.5*t) + 0.3*np.sin(2*np.pi*1318.5*t)) * trem
yayli = lp(yayli, 0.25) * (0.02 + 0.10 * buyume ** 2)
L += yayli * 0.9; R += yayli * 1.1

# 3) Kalp atışı (lub-dub), tempo hızlanır
def thump(f0, sure_s, g):
    m = int(sure_s * SR); tt = np.arange(m) / SR
    f = f0 * (1 + 1.5 * np.exp(-tt * 40))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(m, 0.09) * g
zaman = 0.4
while zaman < SURE - 2.2:
    bpm = bpm0 + (bpm1 - bpm0) * (zaman / SURE)
    ekle(thump(52, 0.45, 0.9), zaman); ekle(thump(46, 0.4, 0.6), zaman + 0.22)
    zaman += 60 / bpm

# 4) Saat tıkırtısı (8'lik), kısık
zaman = 0.0
while zaman < SURE - 2.2:
    m = int(0.02 * SR); klik = rng.standard_normal(m) * env_exp(m, 0.003)
    klik = klik - lp(klik, 0.3)
    ekle(klik * 0.10, zaman, 0.8, 1.0)
    zaman += 30 / (bpm0 + (bpm1 - bpm0) * (zaman / SURE))

# 5) Kesmelerde "braam" vuruşu
def braam():
    m = int(2.2 * SR); tt = np.arange(m) / SR
    s = sum(np.sign(np.sin(2*np.pi*f*tt)) * a for f, a in [(41.2, 1.0), (82.4, 0.6), (61.7, 0.4), (123.5, 0.25)])
    s = lp(s, 0.06) * env_exp(m, 0.7) * np.clip(tt / 0.01, 0, 1)
    sub = np.sin(2 * np.pi * 36 * tt) * env_exp(m, 0.5)
    return (s * 0.5 + sub * 0.7)
for k in kesmeler: ekle(braam() * 0.8, k - 0.02)

# 6) Sonda riser (gürültü süpürmesi + yükselen ton) ve final vuruş
rs = 4.0; m = int(rs * SR); tt = np.arange(m) / SR
gur = rng.standard_normal(m)
a = 0.02 + 0.5 * (tt / rs) ** 2
riser = np.empty(m); acc = 0.0
for i in range(m): acc += a[i] * (gur[i] - acc); riser[i] = acc
riser = (gur - riser) * 0.4 + riser * 0.6
riser *= (tt / rs) ** 2.2 * 0.6
ton = np.sin(2 * np.pi * np.cumsum(220 + 660 * (tt / rs) ** 2) / SR) * (tt / rs) ** 3 * 0.15
ekle(riser + ton, SURE - rs)

# yumuşak çıkış ve normalize
fade = np.clip((SURE - t) / 0.08, 0, 1)
L *= fade; R *= fade
pk = max(np.abs(L).max(), np.abs(R).max())
L = np.tanh(L / pk * 1.2) * 0.85; R = np.tanh(R / pk * 1.2) * 0.85
st = (np.stack([L, R], 1) * 32767).astype(np.int16)
w = wave.open(out, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes()); w.close()
print("kaydedildi:", out, SURE, "sn")
