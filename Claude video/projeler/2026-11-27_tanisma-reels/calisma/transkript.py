import numpy as np, subprocess, json
from faster_whisper import WhisperModel
m=WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo",device="cpu",compute_type="int8",cpu_threads=4)
out={}
for n in ["a","b"]:
    a=subprocess.run(["ffmpeg","-v","error","-i",f"girdiler/ham_{n}.mov","-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
    x=np.frombuffer(a,np.int16).astype(np.float32)/32768
    segs,_=m.transcribe(x,language="tr",word_timestamps=True,vad_filter=True)
    segs=list(segs)
    out[n]=[{"start":s.start,"end":s.end,"text":s.text.strip(),"words":[{"w":w.word,"s":w.start,"e":w.end} for w in s.words]} for s in segs]
    print("=====",n, flush=True)
    for s in segs: print(f"  [{s.start:5.1f}-{s.end:5.1f}] {s.text.strip()}", flush=True)
json.dump(out,open("calisma/transkript.json","w"),ensure_ascii=False,indent=1)
