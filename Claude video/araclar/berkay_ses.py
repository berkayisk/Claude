"""Berkay Işık ses klonu (kullanıcı onayıyla, tüm Sıfırdan Satışa bölümleri için).
Model: Chatterbox Multilingual (Resemble AI, MIT lisans, ticari kullanım serbest), Türkçe.
Referans: marka/sifirdan-satisa/berkay_ses_referans.wav (Berkay'ın kendi anlatım kaydından 10 sn, Demucs temiz).

Kullanım:
  python3 araclar/berkay_ses.py satirlar.json cikti_klasoru
satirlar.json: [{"k": "n1", "metin": "Bu Ahmet."}, {"k": "i1", "metin": "...", "ic": true, "ex": 0.4}, ...]
  ex: duygu yoğunluğu (0.3 sakin - 0.8 dramatik, varsayılan 0.55)

Her satır için:
  1. en fazla 6 deneme üretilir; Whisper metni birebir okuyana kadar (kırpılmış hali bağlam içinde doğrulanır)
  2. enerji tabanlı kırpma (baş: ilk -50 dB üstü - 50 ms, son: -42 dB altına 120 ms inene kadar)
  3. son kelimeden sonraki ilk sessizlikte kesilir (model fazladan ses üretebiliyor), süre metne göre denetlenir
  5. netlik zinciri (NETLIK) uygulanır: boğukluğu giderir
  4. tüm satırların medyan perdesi Berkay'ın kaydına (HEDEF_F0) tek oranla eşitlenir: rubberband, formant korunarak
Çıktı: <k>.wav (48 kHz mono) + sureler.json {k: [metin, süre, skor, whisper]}
"""
import sys, os, json, re, difflib, subprocess, numpy as np, soundfile as sf, torch, torchaudio as ta

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = os.path.join(KOK, "marka/sifirdan-satisa/berkay_ses_referans.wav")
HEDEF_F0 = 176.0   # Berkay'ın anlatım kaydının medyan perdesi (Hz)
# Netlik: model 24 kHz üretiyor (12 kHz üstü yok) ve 4 kHz üstü zayıf -> "boğuk". Berkay'ın gerçek kaydının bant profiline göre ayarlandı
# (2–12 kHz arası bantlar ±1.6 dB içinde), exciter ile 12 kHz üstüne doğal harmonik, hafif de-esser.
NETLIK = ("equalizer=f=3000:t=q:w=1:g=1,equalizer=f=5000:t=q:w=1:g=2,equalizer=f=7000:t=q:w=1:g=1,highshelf=f=10000:g=11,"
          "aexciter=amount=8:drive=9:blend=0:freq=11500:ceil=18000,deesser=i=0.3")

def _load(p, *a, **k):
    x, sr = sf.read(p, dtype="float32", always_2d=True); return torch.from_numpy(x.T.copy()), sr
def _save(p, w, sr, *a, **k): sf.write(p, w.detach().cpu().numpy().T, sr)
ta.load = _load; ta.save = _save   # torchcodec yok: soundfile ile

def norm(x):
    x = x.replace("İ", "i").replace("I", "ı").lower().replace("-", " ")
    return re.sub(r"[^a-zçğıöşü ]", "", x).split()
def rms(a, sr, t, w=0.01):
    s = a[max(0, int(t * sr)):int((t + w) * sr)]
    return 20 * np.log10(np.sqrt((s ** 2).mean()) + 1e-9) if len(s) else -99
def kirp(w, sr):
    b = 0.0
    for t in np.arange(0, len(w) / sr, 0.005):
        if rms(w, sr, t) > -50: b = max(0, t - 0.05); break
    son = len(w) / sr
    for t in np.arange(len(w) / sr - 0.02, 0, -0.005):
        if rms(w, sr, t, 0.02) > -42: son = min(len(w) / sr, t + 0.12); break
    o = w[int(b * sr):int(son * sr)].copy()
    g = int(0.04 * sr); o[-g:] *= np.linspace(1, 0, g)
    return o
def f0(w, sr):
    a = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(sr), "-ac", "1", "-i", "-", "-ar", "16000", "-f", "f32le", "-"],
                       input=w.astype(np.float32).tobytes(), capture_output=True).stdout
    a = np.frombuffer(a, np.float32); r = []
    for i in range(0, len(a) - 1024, 800):
        s = a[i:i + 1024]
        if np.sqrt((s ** 2).mean()) < 0.02: continue
        c = np.correlate(s, s, "full")[1023:]; lo, hi = 16000 // 320, 16000 // 65; l = lo + np.argmax(c[lo:hi])
        if c[l] > 0.3 * c[0]: r.append(16000 / l)
    return float(np.median(r)) if r else HEDEF_F0

def main(girdi, cikti):
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    from faster_whisper import WhisperModel
    os.makedirs(cikti, exist_ok=True)
    m = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
    wm = WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo", device="cpu", compute_type="int8")
    def oku(w, sr, kelime=False):
        a = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(sr), "-ac", "1", "-i", "-", "-ar", "16000", "-f", "f32le", "-"],
                           input=w.astype(np.float32).tobytes(), capture_output=True).stdout
        a = np.concatenate([np.zeros(8000, np.float32), np.frombuffer(a, np.float32), np.zeros(8000, np.float32)])
        seg = list(wm.transcribe(a, language="tr", condition_on_previous_text=False, vad_filter=False, word_timestamps=kelime)[0])
        txt = " ".join(x.text for x in seg).strip()
        if not kelime: return txt
        return txt, [(x.word, x.start - 0.5, x.end - 0.5) for q in seg for x in q.words]
    def kes(w, sr, kel):
        """son kelimeden sonraki ilk sessizlikte kes (model metinden sonra fazladan ses üretebiliyor)"""
        if not kel: return w
        t = max(0.0, kel[-1][2] - 0.15); sus = 0.0
        while t < len(w) / sr:
            sus = sus + 0.01 if rms(w, sr, t) < -40 else 0.0
            if sus >= 0.15: break
            t += 0.01
        son = min(len(w) / sr, t - sus + 0.07)
        o = w[:int(son * sr)].copy(); g = int(0.04 * sr); o[-g:] *= np.linspace(1, 0, g)
        return o
    satirlar = json.load(open(girdi))
    yol = os.path.join(cikti, "sureler.json")
    d = json.load(open(yol)) if os.path.exists(yol) else {}
    for s in satirlar:
        k, metin = s["k"], s["metin"]
        if k in d and d[k][2] >= 0.999 and os.path.exists(f"{cikti}/{k}_ham.wav"): continue
        ex = s.get("ex", 0.35 if s.get("ic") else 0.55)
        en = (-1, None, "")
        for i in range(6):
            torch.manual_seed(int(os.environ.get("TOHUM", 7000)) + i * 13)
            w = m.generate(s.get("yazim", metin), language_id="tr", audio_prompt_path=REF, exaggeration=ex, cfg_weight=0.5).squeeze().numpy()
            w = kirp(w, m.sr)
            _, kel = oku(w, m.sr, kelime=True)
            w = kes(w, m.sr, kel)
            tr = oku(w, m.sr); sk = difflib.SequenceMatcher(None, norm(metin), norm(tr)).ratio()
            beklenen = 0.075 * len(metin) + 0.4
            if len(w) / m.sr > beklenen * 1.45: sk -= 0.5; tr += f"  [çok uzun {len(w)/m.sr:.1f}s > {beklenen:.1f}s]"
            print(f"  {k} deneme {i}: {sk:.3f} | {tr}", flush=True)
            if sk > en[0]: en = (sk, w, tr)
            if sk >= 0.999: break
        sk, w, tr = en
        sf.write(f"{cikti}/{k}_ham.wav", w, m.sr)
        d[k] = [metin, round(len(w) / m.sr, 2), round(sk, 3), tr, round(f0(w, m.sr), 1)]
        print(f"{k} {len(w)/m.sr:.2f} sn  skor {sk:.3f}", flush=True)
        json.dump(d, open(yol, "w"), ensure_ascii=False, indent=1)
    # perde: tüm satırların medyan perdesi Berkay'ın kaydına eşitlenir (tek oran -> tonlama korunur), ±10% sınır
    oran = float(np.clip(HEDEF_F0 / np.median([v[4] for v in d.values()]), 0.9, 1.1))
    filt = f"rubberband=pitch={oran:.4f}:formant=preserved," if abs(oran - 1) > 0.015 else ""
    for k in d:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{cikti}/{k}_ham.wav", "-af", f"{filt}aresample=48000,{NETLIK}", "-ac", "1", f"{cikti}/{k}.wav"])
        d[k][1] = round(sf.info(f"{cikti}/{k}.wav").duration, 2)
    print(f"perde oranı x{oran:.3f}", flush=True)
    json.dump(d, open(yol, "w"), ensure_ascii=False, indent=1)

def sadece_son_islem(cikti):
    """mevcut <k>_ham.wav dosyalarından perde + netlik adımını yeniden uygular (yeniden üretmeden)"""
    yol = os.path.join(cikti, "sureler.json"); d = json.load(open(yol))
    oran = float(np.clip(HEDEF_F0 / np.median([v[4] for v in d.values()]), 0.9, 1.1))
    filt = f"rubberband=pitch={oran:.4f}:formant=preserved," if abs(oran - 1) > 0.015 else ""
    for k in d:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{cikti}/{k}_ham.wav", "-af", f"{filt}aresample=48000,{NETLIK}", "-ac", "1", f"{cikti}/{k}.wav"])
        d[k][1] = round(sf.info(f"{cikti}/{k}.wav").duration, 2)
    json.dump(d, open(yol, "w"), ensure_ascii=False, indent=1)
    print(f"son işlem tamam: perde x{oran:.3f} + netlik, {len(d)} satır")

if __name__ == "__main__":
    if sys.argv[1] == "--son-islem": sadece_son_islem(sys.argv[2])
    else: main(sys.argv[1], sys.argv[2])
