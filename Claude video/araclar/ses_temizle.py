"""Konuşma sesini kurutur ve temizler (yankı + gürültü). Ahmet projesindeki temizlik zinciri + WPE yankı giderme.

Kullanım:
  python3 araclar/ses_temizle.py girdi.wav cikti.wav [--wpe-taps 10] [--yumusak]
Adımlar:
  1. WPE (Weighted Prediction Error, nara_wpe) — geç yansımaları (oda yankısı) tahmin edip çıkarır; tek kanal, 16 kHz STFT'de.
  2. ffmpeg zinciri: highpass 80 Hz → afftdn (gürültü) → hafif agate (kelime arası kuyrukları kısar) → compressor → presence EQ.
--yumusak: kapı ve gürültü azaltma daha hafif (zaten temiz TTS çıktısı için).
Not: Demucs ayrımı (müzik varsa) bundan ÖNCE yapılır: python3 -m demucs -n htdemucs_ft --two-stems=vocals ...
"""
import sys, subprocess, numpy as np, soundfile as sf

def wpe_uygula(x, sr, taps=10, delay=3, iters=3):
    from nara_wpe.wpe import wpe
    from nara_wpe.utils import stft, istft
    size, shift = 512, 128
    Y = stft(x[None, :], size=size, shift=shift).transpose(2, 0, 1)  # (F, D, T)
    Z = wpe(Y, taps=taps, delay=delay, iterations=iters, statistics_mode="full").transpose(1, 2, 0)
    z = istft(Z, size=size, shift=shift)[0]
    z = z[: len(x)] if len(z) >= len(x) else np.pad(z, (0, len(x) - len(z)))
    return z

def main(gir, cik, taps=10, yumusak=False):
    x, sr = sf.read(gir, dtype="float32", always_2d=True); x = x.mean(1)
    tepe = np.abs(x).max() + 1e-9
    z = wpe_uygula(x.astype(np.float64), sr, taps=taps).astype(np.float32)
    z = z / (np.abs(z).max() + 1e-9) * tepe
    ara = cik + ".wpe.wav"; sf.write(ara, z, sr)
    nf, gate = ("-30", "threshold=0.012:ratio=1.6:attack=3:release=90") if yumusak else ("-25", "threshold=0.02:ratio=2:attack=3:release=70")
    zincir = (f"highpass=f=80,afftdn=nf={nf}:nr=10,agate={gate},"
              "acompressor=threshold=-20dB:ratio=2.5:attack=6:release=90:makeup=1.5,"
              "equalizer=f=3200:t=q:w=1.2:g=2,equalizer=f=250:t=q:w=1:g=-1.5")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", ara, "-af", zincir, "-ar", str(sr), "-ac", "1", cik], check=True)
    subprocess.run(["rm", "-f", ara])

if __name__ == "__main__":
    a = sys.argv[1:]
    taps = 10; yum = False
    if "--wpe-taps" in a: i = a.index("--wpe-taps"); taps = int(a[i + 1]); del a[i:i + 2]
    if "--yumusak" in a: a.remove("--yumusak"); yum = True
    main(a[0], a[1], taps, yum)
