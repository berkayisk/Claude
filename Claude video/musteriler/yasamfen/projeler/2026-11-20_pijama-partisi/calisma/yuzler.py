#!/usr/bin/env python3
"""Tüm videolarda yüz tespiti (YuNet) + kimlik vektörü (SFace), 2 fps. Çıktı: calisma/yuz/tespit.jsonl (+ yüz kırpıntıları)"""
import json, os, subprocess, sys, numpy as np, cv2
os.environ["HF_HUB_OFFLINE"] = "1"
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
from huggingface_hub import hf_hub_download

DET = hf_hub_download("opencv/face_detection_yunet", "face_detection_yunet_2023mar.onnx")
REC = hf_hub_download("opencv/face_recognition_sface", "face_recognition_sface_2021dec.onnx")
W, H = 1080, 1920; FPS = 2
det = cv2.FaceDetectorYN.create(DET, "", (W, H), 0.7, 0.3, 5000)
rec = cv2.FaceRecognizerSF.create(REC, "")
os.makedirs("calisma/yuz/kirp", exist_ok=True)
out = open("calisma/yuz/tespit.jsonl", "a")
yapildi = {json.loads(l)["dosya"] for l in open("calisma/yuz/tespit.jsonl")} if os.path.getsize("calisma/yuz/tespit.jsonl") else set()
kat = json.load(open("calisma/katalog.json"))
for f in sorted(kat):
    if f in yapildi or kat[f]["tur"].startswith("B-ROLL"): continue
    p = subprocess.Popen(["ffmpeg","-v","error","-i",f"girdiler/ham/{f}","-vf",f"fps={FPS},scale={W}:{H}","-f","rawvideo","-pix_fmt","bgr24","-"], stdout=subprocess.PIPE)
    i = 0; n = W*H*3; say = 0
    while True:
        b = p.stdout.read(n)
        if len(b) < n: break
        img = np.frombuffer(b, np.uint8).reshape(H, W, 3)
        _, faces = det.detect(img)
        t = round(i / FPS, 2)
        for j, fc in enumerate(faces if faces is not None else []):
            x, y, w, h = [float(v) for v in fc[:4]]; sk = float(fc[14])
            r = {"dosya": f, "t": t, "x": round(x), "y": round(y), "w": round(w), "h": round(h), "skor": round(sk, 3)}
            if w >= 36:
                al = rec.alignCrop(img, fc); r["vek"] = [round(float(v), 4) for v in rec.feature(al)[0]]
                kid = f"{f[4:8]}_{i}_{j}"; r["kirp"] = kid
                x0, y0 = max(0, int(x - w*0.3)), max(0, int(y - h*0.3)); x1, y1 = min(W, int(x + w*1.3)), min(H, int(y + h*1.3))
                cv2.imwrite(f"calisma/yuz/kirp/{kid}.jpg", cv2.resize(img[y0:y1, x0:x1], (160, int(160*(y1-y0)/max(1,x1-x0)))), [cv2.IMWRITE_JPEG_QUALITY, 85])
            out.write(json.dumps(r) + "\n"); say += 1
        i += 1
    out.flush(); print(f, i, "kare", say, "yüz", flush=True)
print("YUZ BITTI", flush=True)
