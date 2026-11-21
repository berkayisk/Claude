#!/usr/bin/env python3
"""Render edilmiş videoda açık kalmış yüz arar (10 fps). Blur listesindeki kişiye benzeyen ya da tanınmayan net yüz → işaretle + kare kaydet.
Kullanım: python3 calisma/blur_kontrol.py ciktilar/yarisma1.mp4"""
import json, os, subprocess, sys, numpy as np, cv2
os.environ["HF_HUB_OFFLINE"] = "1"
from huggingface_hub import hf_hub_download
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
src = sys.argv[1]; ad = os.path.basename(src)[:-4]; W, H = 1080, 1920; FPS = 10
det = cv2.FaceDetectorYN.create(hf_hub_download("opencv/face_detection_yunet", "face_detection_yunet_2023mar.onnx"), "", (W, H), 0.75, 0.3, 5000)
rec = cv2.FaceRecognizerSF.create(hf_hub_download("opencv/face_recognition_sface", "face_recognition_sface_2021dec.onnx"), "")
K = json.load(open("calisma/yuz/kisiler.json"))["kisiler"]; M = np.array([k["merkez"] for k in K], np.float32); NO = [k["no"] for k in K]
ESIK = float(os.environ.get("ESIK", 60))
BLUR = set(json.load(open("calisma/yuz/blur.json"))["blur"])
os.makedirs(f"calisma/kontrol/{ad}_blur", exist_ok=True)
p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-vf", f"fps={FPS}", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
i = 0; n = W*H*3; isaret = []
while True:
    b = p.stdout.read(n)
    if len(b) < n: break
    img = np.frombuffer(b, np.uint8).reshape(H, W, 3)
    _, fs = det.detect(img)
    for fc in (fs if fs is not None else []):
        w = fc[2]
        if w < 40: continue
        v = rec.feature(rec.alignCrop(img, fc))[0]; v /= np.linalg.norm(v); s = M @ v; j = int(s.argmax())
        kim = NO[j] if s[j] > 0.42 else None
        x0, y0 = max(0, int(fc[0])), max(0, int(fc[1])); roi = cv2.cvtColor(img[y0:y0+int(fc[3]), x0:x0+int(w)], cv2.COLOR_BGR2GRAY)
        keskin = cv2.Laplacian(cv2.resize(roi, (96, 96)), cv2.CV_64F).var() if roi.size else 0
        if (kim in BLUR or kim is None) and keskin > ESIK:
            t = i / FPS; isaret.append((round(t, 1), kim, round(float(s[j]), 2), int(w), int(keskin)))
            x, y = int(fc[0]), int(fc[1]); im = img.copy(); cv2.rectangle(im, (x, y), (x+int(w), y+int(fc[3])), (0, 0, 255), 4)
            cv2.imwrite(f"calisma/kontrol/{ad}_blur/{t:06.1f}_{kim}.jpg", cv2.resize(im, (360, 640)))
    i += 1
json.dump(isaret, open(f"calisma/kontrol/{ad}_blur.json", "w")); print(ad, f"{i} kare tarandı, {len(isaret)} şüpheli")
