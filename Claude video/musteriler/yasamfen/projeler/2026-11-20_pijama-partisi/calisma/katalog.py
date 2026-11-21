#!/usr/bin/env python3
"""Ham dosyalar için: süre, ses seviyesi, 8 karelik şerit (calisma/seritler/). İşlenmişleri atlar. Çıktı: calisma/katalog.json"""
import json, os, subprocess, sys, glob
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
os.makedirs("calisma/seritler", exist_ok=True)
kat = json.load(open("calisma/katalog.json")) if os.path.exists("calisma/katalog.json") else {}
bitmis = {l.split()[1] for l in open("calisma/indir.log") if l.startswith("OK ")}
for f in sorted(bitmis):
    if f in kat or not f.upper().endswith((".MOV",".MP4")): continue
    p = f"girdiler/ham/{f}"
    d = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p],capture_output=True,text=True).stdout)
    vol = subprocess.run(["ffmpeg","-v","info","-i",p,"-vn","-af","volumedetect","-f","null","-"],capture_output=True,text=True).stderr
    mean = next((float(l.split(":")[1].split()[0]) for l in vol.splitlines() if "mean_volume" in l), None)
    n = 8; tt = [d*(i+0.5)/n for i in range(n)]
    ins = sum([["-ss",f"{t:.2f}","-i",p] for t in tt], [])
    fc = "".join(f"[{i}:v]scale=-2:320,drawtext=text='{tt[i]:.0f}s':x=6:y=6:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[v{i}];" for i in range(n))
    fc += "".join(f"[v{i}]" for i in range(n)) + f"hstack={n}"
    subprocess.run(["ffmpeg","-v","error","-y",*ins,"-filter_complex",fc,"-frames:v","1","-q:v","4",f"calisma/seritler/{f}.jpg"])
    kat[f] = {"sure": round(d,2), "ses_db": mean}
    json.dump(kat, open("calisma/katalog.json","w"), indent=1)
    print(f, round(d,1), mean, flush=True)
