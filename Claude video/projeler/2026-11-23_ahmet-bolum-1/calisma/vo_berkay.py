"""Berkay'ın kendi sesiyle (kullanıcı onayıyla) seslendirme: Chatterbox Multilingual (MIT lisans), Türkçe.
Her satır en fazla N deneme üretilir; Whisper metni birebir okuyana kadar tekrarlanır, en iyi deneme seçilir.
Kullanım: python3 calisma/vo_berkay.py [test]"""
import sys, os, json, re, subprocess, numpy as np, torch, torchaudio as ta, soundfile as sf

def _load(p, *a, **k):
    x, sr = sf.read(p, dtype="float32", always_2d=True); return torch.from_numpy(x.T.copy()), sr
def _save(p, w, sr, *a, **k): sf.write(p, w.detach().cpu().numpy().T, sr)
ta.load = _load; ta.save = _save

from chatterbox.mtl_tts import ChatterboxMultilingualTTS
from faster_whisper import WhisperModel

OUT = "calisma/vo_berkay"; os.makedirs(OUT, exist_ok=True)
REF = "calisma/ref_berkay.wav"
m = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
wm = WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo", device="cpu", compute_type="int8")

def norm(x):
    x = x.replace("İ", "i").replace("I", "ı").lower().replace("-", " ")
    return re.sub(r"[^a-zçğıöşü ]", "", x).split()
def oku(w):
    a = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", "24000", "-ac", "1", "-i", "-", "-ar", "16000", "-f", "s16le", "-"],
                       input=w.astype(np.float32).tobytes(), capture_output=True).stdout
    a = np.frombuffer(a, np.int16).astype(np.float32) / 32768
    a = np.concatenate([np.zeros(8000, np.float32), a, np.zeros(8000, np.float32)])
    return " ".join(s.text for s in wm.transcribe(a, language="tr", condition_on_previous_text=False)[0])
def skor(hedef, tr):
    h, t = norm(hedef), norm(tr)
    import difflib
    return difflib.SequenceMatcher(None, h, t).ratio()
def uret(k, metin, yazim, ex=0.55, cfg=0.5, deneme=5):
    en = (-1, None, "")
    for i in range(deneme):
        torch.manual_seed(1000 + i)
        w = m.generate(yazim, language_id="tr", audio_prompt_path=REF, exaggeration=ex, cfg_weight=cfg).squeeze().numpy()
        tr = oku(w); s = skor(metin, tr)
        print(f"  {k} deneme {i}: {s:.3f} | {tr.strip()}", flush=True)
        if s > en[0]: en = (s, w, tr)
        if s >= 0.999: break
    sf.write(f"{OUT}/{k}_ham.wav", en[1], m.sr)
    return en

if len(sys.argv) > 1 and sys.argv[1] == "test":
    for y in ["Tek bir fikir var: e-ticaret.", "Tek bir fikir var: e ticaret.", "Tek bir fikir var: E-ticaret.", "Tek bir fikir var: eticaret.", "Tek bir fikir var: e, ticaret."]:
        torch.manual_seed(1)
        w = m.generate(y, language_id="tr", audio_prompt_path=REF, exaggeration=0.55, cfg_weight=0.5).squeeze().numpy()
        print(y, "->", oku(w), flush=True)
    sys.exit()

ET = sys.argv[1] if len(sys.argv) > 1 else "e-ticaret"   # en iyi yazım (test sonucuna göre)
L = [("n1", "Bu Ahmet."), ("n2", "Ve bu gece, hayatını değiştirebilecek bir kararın eşiğinde."),
     ("n3", "Aylardır aklında tek bir fikir var: e-ticaret."), ("n4", "Araştırmaya başlıyor."), ("n5", "Ne satacak?"),
     ("n6", "Ürünleri nereden bulacak?"), ("n7", "Şirket kurmak şart mı?"), ("n8", "Stokları nereye koyacak?"),
     ("n9", "Her cevap, yeni bir soru doğuruyor."),
     ("i1", "Ben daha ne satacağımı bile bilmiyorum..."), ("i2", "Nasıl başlayacağım ki?"),
     ("n10", "Çoğu insan, tam bu noktada vazgeçiyor."), ("n11", "Ama Ahmet'in gözünden kaçan bir şey vardı."),
     ("n12", "Kendi ürününü üretmeden, stok tutmadan da e-ticarete başlamak mümkündü."), ("n13", "Peki sonra ne oldu?"),
     ("n14", "Ahmet, her şeyi aynı anda bilmek zorunda olmadığını fark etti."), ("n15", "Önce doğru modeli öğrenecek, sonra ilk adımı atacaktı."),
     ("n16", "Her şey yolunda gibiydi."), ("n17", "Ta ki birkaç gün sonra, telefonuna o mesaj gelene kadar."),
     ("n18", "O mesajda ne yazıyordu?"), ("n19", "Cevabı, ikinci bölümde.")]
d = {}
for k, metin in L:
    yazim = metin.replace("e-ticaret", ET)
    ex = 0.35 if k.startswith("i") else (0.7 if k in ("n2", "n11", "n13", "n17") else 0.55)
    s, w, tr = uret(k, metin, yazim, ex=ex)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{OUT}/{k}_ham.wav", "-af",
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                    "-ar", "48000", "-ac", "1", f"{OUT}/{k}.wav"])
    du = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{OUT}/{k}.wav"], capture_output=True, text=True).stdout)
    d[k] = [metin, du, round(s, 3), tr.strip()]
    print(k, round(du, 2), round(s, 3), flush=True)
    json.dump(d, open(f"{OUT}/sureler.json", "w"), ensure_ascii=False, indent=1)
