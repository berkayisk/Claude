"""ElevenLabs ile seslendirme (Türkçe) + otomatik denetim (Whisper birebir + telaffuz GOP), gerekirse farklı seed ile yeniden üretim.

Kullanım:
  python3 araclar/eleven_ses.py satirlar.json cikti/ --ses <voice_id> [--model eleven_multilingual_v2] [--deneme 4]
satirlar.json: [{"k":"s01","metin":"...", "dosya":"hazir.mp3"(ops: hazır kayıt, üretme), "model":"eleven_v3"(ops), "yazim":"..."(ops: seslendirmeye giden yazım)}]
- Anahtar ağ vekili tarafından eklenir (api.elevenlabs.io); kodda anahtar yok.
- Süreklilik için previous_text / next_text gönderilir.
- Çıktı: cikti/<k>.wav (48 kHz mono, baş/son sessizliği kırpılmış) + cikti/sureler.json {k: [metin, süre, whisper_skor, min_gop, whisper]}
"""
import sys, os, json, re, difflib, subprocess, urllib.request, numpy as np, soundfile as sf

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(KOK, "araclar"))
SUPHE = -0.40

def norm(x):
    x = x.replace("İ", "i").replace("I", "ı").lower().replace("-", " ")
    sayi = {"58": "elli sekiz", "%": " yüzde ", "30": "otuz", "3": "üç", "1": "bir", "2": "iki"}
    for a, b in sayi.items(): x = x.replace(a, " " + b + " ")
    return re.sub(r"[^a-zçğıöşü ]", " ", x).split()

def uret(metin, ses, model, onceki, sonraki, seed):
    govde = {"text": metin, "model_id": model, "language_code": "tr", "seed": seed}
    if model != "eleven_v3":
        if onceki: govde["previous_text"] = onceki
        if sonraki: govde["next_text"] = sonraki
    istek = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{ses}?output_format=mp3_44100_128",
                                   data=json.dumps(govde).encode(), headers={"Content-Type": "application/json", "xi-api-key": "proxy-injected"})
    return urllib.request.urlopen(istek, timeout=120).read()

def wav48(girdi_bayt=None, yol=None):
    args = ["ffmpeg", "-v", "error"] + (["-i", yol] if yol else ["-i", "-"]) + [
        "-af", "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse",
        "-ar", "48000", "-ac", "1", "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(args, input=girdi_bayt, capture_output=True).stdout, np.float32).copy()

def main(girdi, cikti, ses, model, deneme):
    from telaffuz import Denetci
    from faster_whisper import WhisperModel
    import librosa
    dn = Denetci(); wm = WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo", device="cpu", compute_type="int8")
    os.makedirs(cikti, exist_ok=True)
    L = json.load(open(girdi)); yol = os.path.join(cikti, "sureler.json")
    d = json.load(open(yol)) if os.path.exists(yol) else {}
    for i, s in enumerate(L):
        k, metin = s["k"], s["metin"]
        if k in d and d[k][2] >= 0.999 and d[k][3] >= SUPHE and os.path.exists(f"{cikti}/{k}.wav"): continue
        en = None
        for j in range(deneme if not s.get("dosya") else 1):
            if s.get("dosya"):
                a = wav48(yol=s["dosya"])
            else:
                onceki = L[i - 1]["metin"] if i > 0 else None
                sonraki = L[i + 1]["metin"] if i + 1 < len(L) else None
                a = wav48(uret(s.get("yazim", metin), ses, s.get("model", model), onceki, sonraki, 1000 + 37 * j))
            a16 = librosa.resample(a, orig_sr=48000, target_sr=16000)
            tr = " ".join(x.text for x in wm.transcribe(np.concatenate([np.zeros(8000, np.float32), a16, np.zeros(8000, np.float32)]), language="tr", condition_on_previous_text=False)[0]).strip()
            sk = difflib.SequenceMatcher(None, norm(metin), norm(tr)).ratio()
            gop = min(o for _, o, _ in dn.kelime_puanlari(a16, metin))
            print(f"  {k} deneme {j}: whisper {sk:.3f} gop {gop:.2f} | {tr}", flush=True)
            puan = sk + (0 if gop >= SUPHE else -0.3 + gop * 0.2)
            if en is None or puan > en[0]: en = (puan, a, sk, gop, tr)
            if sk >= 0.999 and gop >= SUPHE: break
        _, a, sk, gop, tr = en
        sf.write(f"{cikti}/{k}.wav", a, 48000)
        d[k] = [metin, round(len(a) / 48000, 2), round(sk, 3), round(gop, 2), tr]
        print(f"{k} {len(a)/48000:.2f} sn whisper {sk:.3f} gop {gop:.2f}", flush=True)
        json.dump(d, open(yol, "w"), ensure_ascii=False, indent=1)
    zayif = [k for k, v in d.items() if v[2] < 0.999 or v[3] < SUPHE]
    print("tamam" + (f" | kontrol et: {', '.join(zayif)}" if zayif else ""))

if __name__ == "__main__":
    a = sys.argv[1:]
    def al(ad, vars_):
        if ad in a: i = a.index(ad); v = a[i + 1]; del a[i:i + 2]; return v
        return vars_
    ses = al("--ses", None); model = al("--model", "eleven_multilingual_v2"); den = int(al("--deneme", "4"))
    if not ses: sys.exit("--ses <voice_id> gerekli")
    main(a[0], a[1], ses, model, den)
