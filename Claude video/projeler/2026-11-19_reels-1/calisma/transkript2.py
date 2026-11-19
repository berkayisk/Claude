import numpy as np, wave, json
from faster_whisper import WhisperModel
m=WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo",device="cpu",compute_type="int8",cpu_threads=4)
out={}
for n in ["IMG_6181","IMG_6183","IMG_6187","IMG_6188","IMG_6189","IMG_6190"]:
    w=wave.open(f"calisma/{n}.wav"); x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
    segs,_=m.transcribe(x,language="tr",word_timestamps=True,vad_filter=True,vad_parameters={"min_silence_duration_ms":400},condition_on_previous_text=False,no_repeat_ngram_size=3,initial_prompt="E-ticaret, dropshipping, stoksuz e-ticaret, sermaye, tedarikçi, kargo, sipariş, panel, marka.")
    ws=[{"w":wd.word.strip(),"s":round(wd.start,3),"e":round(wd.end,3)} for s in segs for wd in s.words]
    out[n]=ws
    print(n, " ".join(f"{w['w']}({w['s']:.1f})" for w in ws))
json.dump(out,open("calisma/kelimeler.json","w"),ensure_ascii=False,indent=1)
