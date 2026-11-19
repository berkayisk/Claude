import numpy as np, wave
from faster_whisper import WhisperModel
m=WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo",device="cpu",compute_type="int8",cpu_threads=4)
def oku(n):
    w=wave.open(f"calisma/{n}.wav"); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
for n,a,b in [("IMG_6183",0.5,8.8),("IMG_6183",8.4,24.4),("IMG_6187",6.5,14.5),("IMG_6188",9.5,31.0),("IMG_6181",0,14)]:
    x=oku(n)[int(a*16000):int(b*16000)]
    segs,_=m.transcribe(x,language="tr",word_timestamps=True,vad_filter=False,condition_on_previous_text=False,temperature=0.0,no_repeat_ngram_size=3,initial_prompt="E-ticaret, dropshipping, stok, sermaye, tedarikçi, kargo, marka.")
    print(f"== {n} {a}-{b}")
    for s in segs: print(f"  [{s.start+a:5.1f}-{s.end+a:5.1f}] {s.text.strip()}", flush=True)
# enerji profili (konuşma var mı)
for n in ["IMG_6183","IMG_6187","IMG_6188"]:
    x=oku(n); fr=8000
    print(n, " ".join(f"{i*0.5:.0f}:{20*np.log10(np.sqrt((x[i*fr:(i+1)*fr]**2).mean())+1e-9):.0f}" for i in range(len(x)//fr)))
