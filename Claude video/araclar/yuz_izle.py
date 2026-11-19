#!/usr/bin/env python3
"""Videoda en büyük yüzün konumunu zaman içinde ölçer (YuNet). Koordinatlar videonun kendi piksel ölçeğinde.
Kullanım: python3 araclar/yuz_izle.py video.mp4 cikti.json [adim_sn=0.5]"""
import sys, json, subprocess, numpy as np, cv2
from huggingface_hub import hf_hub_download
src, dst = sys.argv[1], sys.argv[2]; adim = float(sys.argv[3]) if len(sys.argv) > 3 else 0.5
W, H = map(int, subprocess.run(["ffprobe","-v","error","-select_streams","v","-show_entries","stream=width,height","-of","csv=p=0",src],capture_output=True,text=True).stdout.strip().split(","))
k = 2; w, h = W // k, H // k
model = hf_hub_download("opencv/face_detection_yunet", "face_detection_yunet_2023mar.onnx")
det = cv2.FaceDetectorYN.create(model, "", (w, h), 0.6, 0.3, 5000)
p = subprocess.Popen(["ffmpeg","-v","error","-i",src,"-vf",f"fps={1/adim},scale={w}:{h}","-f","rawvideo","-pix_fmt","bgr24","-"],stdout=subprocess.PIPE)
out = []; i = 0; n = w*h*3
while True:
    b = p.stdout.read(n)
    if len(b) < n: break
    img = np.frombuffer(b, np.uint8).reshape(h, w, 3)
    _, faces = det.detect(img)
    t = round(i * adim, 2)
    if faces is not None and len(faces):
        f = max(faces, key=lambda r: r[2]*r[3])
        x, y, fw, fh = [float(v)*k for v in f[:4]]
        out.append({"t": t, "cx": round(x+fw/2), "cy": round(y+fh/2), "w": round(fw), "h": round(fh), "ust": round(y), "alt": round(y+fh)})
    else:
        out.append({"t": t})
    i += 1
json.dump({"W": W, "H": H, "adim": adim, "kareler": out}, open(dst, "w"))
bul = [o for o in out if "cx" in o]
print(dst, f"{len(bul)}/{len(out)} karede yüz", "cy medyan", int(np.median([o["cy"] for o in bul])) if bul else "-", "alt medyan", int(np.median([o["alt"] for o in bul])) if bul else "-")
