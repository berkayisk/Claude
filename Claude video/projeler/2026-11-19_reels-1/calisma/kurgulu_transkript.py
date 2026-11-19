import numpy as np, subprocess, glob
from faster_whisper import WhisperModel
m=WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo",device="cpu",compute_type="int8",cpu_threads=4)
for f in sorted(glob.glob("referanslar/kurgulu_p*.mov")):
    a=subprocess.run(["ffmpeg","-v","error","-i",f,"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
    x=np.frombuffer(a,np.int16).astype(np.float32)/32768
    segs,_=m.transcribe(x,language="tr",vad_filter=False)
    print("=====",f, " | ".join(f"[{s.start:.1f}-{s.end:.1f}] {s.text.strip()}" for s in segs), flush=True)
