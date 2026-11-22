import numpy as np, wave, json, glob, os
from faster_whisper import WhisperModel
m=WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo",device="cpu",compute_type="int8",cpu_threads=os.cpu_count())
out={}
for p in sorted(glob.glob("calisma/IMG_*.wav")):
    n=os.path.basename(p)[:-4]
    w=wave.open(p); x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
    segs,_=m.transcribe(x,language="tr",word_timestamps=True,vad_filter=True,vad_parameters={"min_silence_duration_ms":300},condition_on_previous_text=False,no_repeat_ngram_size=3,initial_prompt="Güneş Oto Kurtarma, ağır ticari, tır, çekici, kurtarma, forklift, menlift, nakliye, Ankara.")
    segs=list(segs)
    out[n]=[{"w":wd.word.strip(),"s":round(wd.start,3),"e":round(wd.end,3)} for s in segs for wd in s.words]
    with open("calisma/transkript.txt","a") as f:
        f.write(f"===== {n}\n"+"".join(f"  [{s.start:5.1f}-{s.end:5.1f}] {s.text.strip()}\n" for s in segs))
    json.dump(out,open("calisma/kelimeler.json","w"),ensure_ascii=False,indent=1)
print("bitti")
