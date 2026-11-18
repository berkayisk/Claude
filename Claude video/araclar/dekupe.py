#!/usr/bin/env python3
"""Fotoğraftan kişiyi keser (arka planı şeffaf yapar). BiRefNet-lite (MIT) kullanır.
Kullanım: python3 araclar/dekupe.py girdi.png cikti.png [x y w h]   (isteğe bağlı kırpma kutusu)"""
import sys, numpy as np, onnxruntime as ort
from PIL import Image
from huggingface_hub import hf_hub_download

src, dst = sys.argv[1], sys.argv[2]
img = Image.open(src).convert("RGB")
if len(sys.argv) >= 7:
    x, y, w, h = map(int, sys.argv[3:7]); img = img.crop((x, y, x + w, y + h))
model = hf_hub_download("onnx-community/BiRefNet_lite-ONNX", "onnx/model.onnx")
sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
inp = np.asarray(img.resize((1024, 1024), Image.BILINEAR), dtype=np.float32) / 255.0
inp = (inp - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
inp = inp.transpose(2, 0, 1)[None].astype(np.float32)
out = sess.run(None, {sess.get_inputs()[0].name: inp})[-1][0, 0]
if out.min() < 0 or out.max() > 1: out = 1 / (1 + np.exp(-out))
mask = Image.fromarray((out * 255).clip(0, 255).astype(np.uint8)).resize(img.size, Image.BILINEAR)
rgba = img.copy(); rgba.putalpha(mask)
bbox = mask.point(lambda v: 255 if v > 20 else 0).getbbox()
if bbox: rgba = rgba.crop(bbox)
rgba.save(dst); print("kaydedildi:", dst, rgba.size)
