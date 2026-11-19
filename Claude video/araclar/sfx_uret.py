#!/usr/bin/env python3
"""Telifsiz ses efekti kütüphanesi (tamamen kodla sentezlenir) -> marka/sfx/*.wav
Kullanım: python3 araclar/sfx_uret.py [cikti_klasoru]"""
import sys, os, numpy as np, wave
OUT = sys.argv[1] if len(sys.argv) > 1 else "marka/sfx"
os.makedirs(OUT, exist_ok=True)
SR = 44100
rng = np.random.default_rng(11)

def t_(d): return np.arange(int(d * SR)) / SR
def env(d, a=0.003, r=0.2):
    t = t_(d); return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / max(r, 1e-4))
def lp(x, a):
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
def hp(x, a): return x - lp(x, a)
def sweep(f0, f1, d):
    t = t_(d); f = f0 * (f1 / f0) ** (t / d); return np.sin(2 * np.pi * np.cumsum(f) / SR)
def ton(f, d, r=0.25, harm=((1, 1),)):
    t = t_(d); return sum(a * np.sin(2 * np.pi * f * h * t) for h, a in harm) * env(d, 0.002, r)
def gurultu(d): return rng.standard_normal(int(d * SR))
def yankı(x, gecikme=0.06, geri=0.35, n=4):
    y = np.concatenate([x, np.zeros(int(gecikme * SR * n))])
    for k in range(1, n + 1):
        i = int(gecikme * SR * k); y[i:i + len(x)] += x * (geri ** k)
    return y
def kaydet(ad, x, tepe=0.89, stereo_genis=0.0):
    x = x / (np.abs(x).max() + 1e-9) * tepe
    L = x; R = np.roll(x, int(stereo_genis * SR)) if stereo_genis else x
    st = (np.stack([L, R], 1) * 32767).astype(np.int16)
    w = wave.open(f"{OUT}/{ad}.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes()); w.close()

def birlestir(*parcalar):
    n = max(len(p) + int(o * SR) for o, p in parcalar); y = np.zeros(n)
    for o, p in parcalar: i = int(o * SR); y[i:i + len(p)] += p
    return y

# --- giriş / çıkış geçişleri ---
d = 0.35; kaydet("whoosh_giris", hp(lp(gurultu(d), 0.25), 0.02) * sweep(1, 1, d) * (t_(d) / d) ** 1.5 * np.exp(-np.maximum(0, t_(d) - 0.28) * 40), stereo_genis=0.004)
d = 0.30; kaydet("whoosh_cikis", hp(lp(gurultu(d), 0.18), 0.03) * np.exp(-t_(d) * 9) * np.minimum(1, t_(d) / 0.02), tepe=0.6)
d = 0.12; kaydet("pop", sweep(300, 900, d) * env(d, 0.001, 0.035) + 0.2 * hp(gurultu(d), 0.5) * env(d, 0.0005, 0.005))
d = 0.10; kaydet("pop_cikis", sweep(700, 250, d) * env(d, 0.001, 0.03), tepe=0.55)
d = 0.05; kaydet("tik", hp(gurultu(d), 0.6) * env(d, 0.0003, 0.006) + 0.5 * ton(3200, d, 0.008))
# --- yorum bildirimi: iki tonlu çan ---
kaydet("bildirim", yankı(birlestir((0, ton(1318.5, 0.5, 0.18, ((1, 1), (2.76, 0.25), (5.4, 0.08)))), (0.09, ton(1975.5, 0.6, 0.25, ((1, 1), (2.76, 0.2))))), 0.05, 0.25, 3), tepe=0.7)
# --- damga: tok vuruş + toz ---
d = 0.6
thud = sweep(140, 45, d) * env(d, 0.002, 0.12)
toz = lp(gurultu(d), 0.15) * env(d, 0.001, 0.05)
kaydet("damga", yankı(thud * 1.0 + toz * 0.6, 0.045, 0.3, 3))
# --- para / yazar kasa: metalik çınlama kümesi ---
d = 0.7
coin = sum(ton(f, d, 0.12 + 0.05 * i, ((1, 1), (2.32, 0.4), (4.1, 0.2))) for i, f in enumerate([2093, 2637, 3136]))
cha = hp(gurultu(0.08), 0.4) * env(0.08, 0.001, 0.02)
kaydet("para", birlestir((0, cha), (0.05, coin), (0.18, ton(4186, 0.4, 0.1))), tepe=0.75)
# --- boom: pahalı / uyarı rakamı ---
d = 1.0
kaydet("boom", np.tanh(2.5 * (sweep(90, 32, d) * env(d, 0.003, 0.35))) + 0.3 * lp(gurultu(d), 0.05) * env(d, 0.001, 0.08))
# --- onay (check) sesleri: yükselen ---
for i, f in enumerate([880, 1046.5, 1318.5, 1568]):
    kaydet(f"onay{i+1}", birlestir((0, ton(f, 0.28, 0.09, ((1, 1), (2, 0.3)))), (0.07, ton(f * 1.5, 0.3, 0.1, ((1, 0.8),)))), tepe=0.7)
# --- ikon blip'leri (zincir / basamak): yükselen perde ---
for i, f in enumerate([523.25, 659.25, 783.99, 1046.5]):
    d = 0.22; kaydet(f"blip{i+1}", (sweep(f * 0.8, f, d) * 0.6 + ton(f * 2, d, 0.05) * 0.4) * env(d, 0.002, 0.07), tepe=0.75)
# --- uyarı etiketi: kısa buzz ---
d = 0.35; kaydet("uyari", np.sign(np.sin(2 * np.pi * 220 * t_(d))) * 0.3 * env(d, 0.005, 0.08) + ton(440, d, 0.08) * 0.5, tepe=0.6)
# --- takipçi geçişi: tık + yumuşak çan ---
kaydet("secim", birlestir((0, hp(gurultu(0.04), 0.6) * env(0.04, 0.0003, 0.006)), (0.02, ton(1567.98, 0.4, 0.15, ((1, 1), (3, 0.15))))), tepe=0.7)
# --- arayüz açılışı: yumuşak swish + tıklar ---
d = 0.4
swish = hp(lp(gurultu(d), 0.3), 0.05) * np.sin(np.pi * t_(d) / d) ** 2
kaydet("arayuz", birlestir((0, swish * 0.7), (0.25, hp(gurultu(0.03), 0.6) * env(0.03, 0.0003, 0.005)), (0.32, hp(gurultu(0.03), 0.6) * env(0.03, 0.0003, 0.005))), tepe=0.7)
# --- başlık: yükselen whoosh + parlak vuruş ---
d = 0.5
kaydet("baslik", birlestir((0, hp(lp(gurultu(d), 0.3), 0.02) * (t_(d) / d) ** 2 * 0.8), (0.45, ton(783.99, 0.5, 0.15, ((1, 1), (2, 0.3), (3, 0.1))))), tepe=0.75, stereo_genis=0.003)
# --- başarı melodisi (takip edildi) ---
kaydet("basari", yankı(birlestir(*[(i * 0.08, ton(f, 0.5, 0.18, ((1, 1), (2, 0.25)))) for i, f in enumerate([1046.5, 1318.5, 1567.98, 2093])]), 0.07, 0.25, 3), tepe=0.75)
# --- sonraki video: merak uyandıran çan ---
kaydet("cagri", yankı(birlestir((0, ton(987.77, 0.8, 0.3, ((1, 1), (2.4, 0.3)))), (0.12, ton(1479.98, 0.9, 0.35, ((1, 1), (2.4, 0.2))))), 0.09, 0.3, 4), tepe=0.7)
# --- b-roll geçişi: derin whoosh ---
d = 0.6
kaydet("broll", birlestir((0, hp(lp(gurultu(d), 0.12), 0.01) * np.sin(np.pi * t_(d) / d) ** 1.5), (0.25, sweep(120, 60, 0.35) * env(0.35, 0.01, 0.12) * 0.6)), tepe=0.8, stereo_genis=0.005)
print("efektler:", sorted(os.listdir(OUT)))
