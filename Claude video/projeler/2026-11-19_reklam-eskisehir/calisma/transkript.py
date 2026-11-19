import numpy as np, wave, json
from faster_whisper import WhisperModel
m=WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo",device="cpu",compute_type="int8",cpu_threads=4)
out={}
for n in ["IMG_7269","IMG_7274"]:
    w=wave.open(f"calisma/{n}.wav"); x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
    segs,_=m.transcribe(x,language="tr",word_timestamps=True,vad_filter=True,vad_parameters={"min_silence_duration_ms":300},condition_on_previous_text=False,no_repeat_ngram_size=3,initial_prompt="Eskişehir, Mağazanolsun, e-ticaret, alan adı, tedarikçi, mentor, Taşbaşı Kültür Merkezi, Odunpazarı.")
    segs=list(segs)
    out[n]=[{"w":wd.word.strip(),"s":round(wd.start,3),"e":round(wd.end,3)} for s in segs for wd in s.words]
    print("=====",n)
    for s in segs: print(f"  [{s.start:5.1f}-{s.end:5.1f}] {s.text.strip()}")
json.dump(out,open("calisma/kelimeler.json","w"),ensure_ascii=False,indent=1)
