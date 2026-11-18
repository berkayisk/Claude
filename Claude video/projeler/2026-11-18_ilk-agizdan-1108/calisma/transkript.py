import json, time
from faster_whisper import WhisperModel
t=time.time()
m = WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo", device="cpu", compute_type="int8", cpu_threads=4)
import wave, numpy as np
w=wave.open("calisma/ses16k.wav"); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
segs, info = m.transcribe(a, language="tr", word_timestamps=True, vad_filter=True, beam_size=5)
out=[]
with open("calisma/transkript.txt","w") as f:
    for s in segs:
        out.append({"start":s.start,"end":s.end,"text":s.text.strip(),"words":[{"w":w.word,"s":w.start,"e":w.end} for w in s.words]})
        line=f"[{int(s.start//60):02d}:{s.start%60:05.2f} - {int(s.end//60):02d}:{s.end%60:05.2f}] {s.text.strip()}"
        print(line, flush=True); f.write(line+"\n")
json.dump(out, open("calisma/transkript.json","w"), ensure_ascii=False, indent=1)
print("BITTI", round(time.time()-t), "sn")
