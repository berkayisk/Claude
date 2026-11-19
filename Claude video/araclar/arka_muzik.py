#!/usr/bin/env python3
"""Shorts için hafif, telifsiz arka müzik (lo-fi tarzı, kodla üretilir).
Kullanım: python3 araclar/arka_muzik.py cikti.wav [sure_sn=60] [bpm=88]"""
import sys, numpy as np, wave
out = sys.argv[1]; SURE = float(sys.argv[2]) if len(sys.argv) > 2 else 60; BPM = float(sys.argv[3]) if len(sys.argv) > 3 else 88
SR = 44100; n = int(SURE * SR); t = np.arange(n) / SR; beat = 60 / BPM; bar = 4 * beat
L = np.zeros(n); R = np.zeros(n); rng = np.random.default_rng(3)
def nota(m): return 440 * 2 ** ((m - 69) / 12)
akorlar = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 65]]  # Am7 Fmaj7 Cmaj7 G7
def lp(x, a):
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
# pad
pad = np.zeros(n)
for b in range(int(SURE / bar) + 1):
    i0 = int(b * bar * SR); i1 = min(n, int((b + 1) * bar * SR))
    if i0 >= n: break
    tt = np.arange(i1 - i0) / SR
    env = np.minimum(1, tt / 0.4) * np.minimum(1, (bar - tt) / 0.3)
    for m in akorlar[b % 4]:
        f = nota(m)
        pad[i0:i1] += (np.sin(2*np.pi*f*tt) + 0.3*np.sin(2*np.pi*f*1.003*tt) + 0.15*np.sin(2*np.pi*2*f*tt)) * env * 0.12
    # bas
    fb = nota(akorlar[b % 4][0] - 24)
    pad[i0:i1] += np.sin(2*np.pi*fb*tt) * env * 0.35
pad = lp(pad, 0.12)
L += pad; R += pad
# davul: yumuşak kick 1-3, snare 2-4, hat 8'lik
def kick():
    m = int(0.3*SR); tt = np.arange(m)/SR
    return np.sin(2*np.pi*np.cumsum(50 + 90*np.exp(-tt*30))/SR) * np.exp(-tt*9) * 0.8
def snare():
    m = int(0.2*SR); tt = np.arange(m)/SR
    s = rng.standard_normal(m) * np.exp(-tt*22); return (s - lp(s, 0.2)) * 0.25
def hat():
    m = int(0.05*SR); tt = np.arange(m)/SR
    s = rng.standard_normal(m) * np.exp(-tt*80); return (s - lp(s, 0.5)) * 0.08
def ekle(sig, z, g=1.0):
    i = int(z*SR); j = min(n, i+len(sig))
    if i < n: L[i:j] += sig[:j-i]*g; R[i:j] += sig[:j-i]*g
z = 0.0; k = 0
while z < SURE:
    if k % 4 in (0, 2): ekle(kick(), z)
    if k % 4 in (1, 3): ekle(snare(), z)
    ekle(hat(), z, 1.0 if k % 2 == 0 else 0.7); ekle(hat(), z + beat/2, 0.6)
    z += beat; k += 1
# plak cızırtısı
cz = rng.standard_normal(n) * 0.006; L += cz; R += np.roll(cz, 500)
fade = np.minimum(1, t/1.0) * np.minimum(1, (SURE - t)/1.0)
L *= fade; R *= fade
pk = max(np.abs(L).max(), np.abs(R).max()); L = L/pk*0.8; R = R/pk*0.8
st = (np.stack([L, R], 1)*32767).astype(np.int16)
wv = wave.open(out, "wb"); wv.setnchannels(2); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes(st.tobytes()); wv.close()
print("kaydedildi:", out)
