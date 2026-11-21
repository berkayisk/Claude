#!/usr/bin/env python3
"""Biten ham dosyaları kelime zamanlı transkripte çevirir (faster-whisper). Çıktı: calisma/transkript/<ad>.json + transkript.txt özet"""
import json, os, subprocess, sys, time
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
from faster_whisper import WhisperModel
M = WhisperModel(os.environ.get("WM", "mobiuslabsgmbh/faster-whisper-large-v3-turbo"), device="cpu", compute_type="int8", cpu_threads=4)
os.makedirs("calisma/transkript", exist_ok=True)
while True:
    bitmis = sorted({l.split()[1] for l in open("calisma/indir.log") if l.startswith("OK ")})
    yap = [f for f in bitmis if f.upper().endswith(".MOV") and not os.path.exists(f"calisma/transkript/{f}.json")]
    if not yap:
        if any(l.startswith("BITTI") for l in open("calisma/indir.log")): break
        time.sleep(20); continue
    f = yap[0]; wav = f"/tmp/claude-0/{f}.wav"
    subprocess.run(["ffmpeg","-v","error","-y","-i",f"girdiler/ham/{f}","-vn","-ac","1","-ar","16000","-f","wav","-acodec","pcm_s16le","-map_metadata","-1","-fflags","+bitexact",wav])
    t0 = time.time()
    import numpy as np
    ses = np.frombuffer(open(wav,"rb").read()[44:], np.int16).astype(np.float32)/32768
    seg, info = M.transcribe(ses, language="tr", word_timestamps=True, vad_filter=True, beam_size=5,
                             initial_prompt="Yaşamfen pijama partisi, bilgi yarışması, vampir köylü oyunu.")
    out = [{"bas": round(s.start,2), "son": round(s.end,2), "metin": s.text.strip(),
            "kelimeler": [[round(w.start,2), round(w.end,2), w.word.strip(), round(w.probability,2)] for w in s.words]} for s in seg]
    json.dump(out, open(f"calisma/transkript/{f}.json","w"), ensure_ascii=False)
    os.remove(wav)
    with open("calisma/transkript.txt","a") as g:
        g.write(f"\n=== {f} ===\n" + "".join(f"[{s['bas']:.1f}-{s['son']:.1f}] {s['metin']}\n" for s in out))
    print(f, f"{info.duration:.0f}s ses, {time.time()-t0:.0f}s işlem, {len(out)} bölüm", flush=True)
print("TRANSKRIPT BITTI", flush=True)
