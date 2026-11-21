#!/usr/bin/env python3
"""Telifsiz, kodla üretilen döngülü arka müzik (vektörel, hızlı).
Kullanım: python3 araclar/oyun_muzigi.py cikti.wav <stil> [sure_sn=90]
Stiller: yarisma (neşeli marimba/pizz, 120 bpm), gizem (vampir: minör, tik-tak, 96 bpm), parti (pop, 124 bpm), sicak (röportaj: yumuşak piyano, 92 bpm)"""
import sys, wave, numpy as np
out, stil = sys.argv[1], sys.argv[2]; SURE = float(sys.argv[3]) if len(sys.argv) > 3 else 90
SR = 44100
AYAR = {
    "yarisma": dict(bpm=120, akor=[[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]], tini="marimba", davul="hafif", melodi=[0, 2, 4, 7, 4, 2, 0, -1]),
    "gizem":   dict(bpm=96,  akor=[[57, 60, 64], [53, 57, 60], [52, 55, 59], [52, 56, 59]], tini="pizz", davul="tiktak", melodi=[0, 3, 7, 3, 8, 7, 3, 2]),
    "parti":   dict(bpm=124, akor=[[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], tini="synth", davul="pop", melodi=[7, 4, 7, 9, 7, 4, 2, 4]),
    "sicak":   dict(bpm=92,  akor=[[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]], tini="piyano", davul="yok", melodi=[4, 7, 9, 7, 4, 2, 4, 0]),
}[stil]
beat = 60 / AYAR["bpm"]; bar = 4 * beat
n = int(SURE * SR); L = np.zeros(n); R = np.zeros(n); rng = np.random.default_rng(7)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

def ton(m, sure, tini, hacim):
    t = np.arange(int(sure * SR)) / SR; f = hz(m)
    if tini == "marimba": y = (np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*f*4*t)*np.exp(-t*30)) * np.exp(-t*7)
    elif tini == "pizz": y = (np.sin(2*np.pi*f*t) + 0.5*np.sin(2*np.pi*2*f*t) + 0.2*np.sin(2*np.pi*3*f*t)) * np.exp(-t*9)
    elif tini == "synth": y = (np.sign(np.sin(2*np.pi*f*t)) * 0.3 + np.sin(2*np.pi*f*t)) * np.exp(-t*4) * (1 - np.exp(-t*200))
    elif tini == "piyano": y = (np.sin(2*np.pi*f*t) + 0.4*np.sin(2*np.pi*2*f*t)*np.exp(-t*3) + 0.15*np.sin(2*np.pi*3*f*t)) * np.exp(-t*2.2) * (1 - np.exp(-t*300))
    else: y = np.sin(2*np.pi*f*t) * np.exp(-t*3)
    return y * hacim

def ekle(y, t0, pan=0.0):
    i = int(t0 * SR)
    if i >= n: return
    y = y[:n - i]; L[i:i+len(y)] += y * (1 - pan) ; R[i:i+len(y)] += y * (1 + pan)

def davul(t0, tip):
    t = np.arange(int(0.25 * SR)) / SR
    if tip == "kick": y = np.sin(2*np.pi*(50 + 90*np.exp(-t*30))*t) * np.exp(-t*12) * 0.9
    elif tip == "hat": y = rng.standard_normal(len(t)) * np.exp(-t*90) * 0.12; y = np.diff(y, prepend=0)
    elif tip == "clap": y = rng.standard_normal(len(t)) * np.exp(-t*25) * 0.25
    elif tip == "tik": y = np.sin(2*np.pi*2400*t) * np.exp(-t*160) * 0.25
    ekle(y, t0)

bars = int(SURE / bar) + 1
for b in range(bars):
    ak = AYAR["akor"][b % 4]; t0 = b * bar
    # bas
    for k in range(4 if stil != "sicak" else 2):
        ekle(ton(ak[0] - 12, beat * (1 if stil != "sicak" else 2), "pizz" if stil != "sicak" else "piyano", 0.30), t0 + k * beat * (1 if stil != "sicak" else 2))
    # akor (sekizlik vuruş / pad)
    if stil == "sicak":
        for m in ak: ekle(ton(m, bar, "piyano", 0.10), t0, pan=rng.uniform(-0.3, 0.3))
    else:
        for k in range(8):
            if stil == "gizem" and k % 2: continue
            for m in ak: ekle(ton(m, beat / 2, AYAR["tini"], 0.06), t0 + k * beat / 2 + 0.004 * rng.random(), pan=0.2)
    # melodi (8 bar sonra girer, 2 barda bir)
    if b >= 2 and b % 2 == 0:
        for k, d in enumerate(AYAR["melodi"]):
            ekle(ton(ak[0] + 12 + d, beat / 2 * 1.4, AYAR["tini"], 0.13), t0 + k * beat / 2, pan=-0.25)
    # davul
    tip = AYAR["davul"]
    for k in range(8):
        tk = t0 + k * beat / 2
        if tip in ("hafif", "pop"):
            if k % 4 == 0: davul(tk, "kick")
            if tip == "pop" and k % 4 == 2: davul(tk, "clap")
            if tip == "hafif" and k == 6: davul(tk, "clap")
            davul(tk, "hat")
        elif tip == "tiktak":
            davul(tk, "tik")
            if k == 0: davul(tk, "kick")

m = np.stack([L, R], 1)
# yumuşak sıkıştırma + normalize, baş/son kısa fade
m = np.tanh(m * 1.4); m /= np.abs(m).max() + 1e-9; m *= 0.8
f = int(0.05 * SR); m[:f] *= np.linspace(0, 1, f)[:, None]; m[-f:] *= np.linspace(1, 0, f)[:, None]
w = wave.open(out, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((m * 32767).astype(np.int16).tobytes()); w.close()
print(out, stil, SURE, "sn")
