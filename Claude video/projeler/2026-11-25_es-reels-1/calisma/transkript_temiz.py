import numpy as np, wave, json
from faster_whisper import WhisperModel
m=WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo",device="cpu",compute_type="int8",cpu_threads=4)
out={}
for n in ["IMG_6174","IMG_6176","IMG_6178","IMG_6179","IMG_6180"]:
    w=wave.open(f"calisma/ses_temiz/{n}_16k.wav"); x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
    segs,_=m.transcribe(x,language="tr",word_timestamps=True,vad_filter=False,initial_prompt="Etkileşim Sihirbazı. Yorum alamıyor musun?")
    out[n]=[{"w":ww.word.strip(),"s":round(ww.start,3),"e":round(ww.end,3)} for s in segs for ww in s.words]
    print(n," ".join(f"{q['w']}({q['s']:.2f}-{q['e']:.2f})" for q in out[n]),flush=True)
json.dump(out,open("calisma/kelimeler.json","w"),ensure_ascii=False,indent=1)
