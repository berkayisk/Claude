#!/usr/bin/env python3
"""SFace vektörlerini kişilere kümeler, numaralı yüz paftası üretir. Çıktı: calisma/yuz/kisiler.json, ciktilar/yuz-paftasi-*.jpg"""
import json, os, numpy as np, cv2
from sklearn.cluster import AgglomerativeClustering
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
R = [json.loads(l) for l in open("calisma/yuz/tespit.jsonl")]
V = [r for r in R if "vek" in r and r["skor"] >= 0.85 and r["w"] >= 60]
X = np.array([r["vek"] for r in V], np.float32); X /= np.linalg.norm(X, axis=1, keepdims=True)
cl = AgglomerativeClustering(n_clusters=None, metric="cosine", linkage="average", distance_threshold=0.55).fit(X)
lab = cl.labels_
kisiler = []
for c in (set(lab) if not os.environ.get("SADECE_PAFTA") else []):
    idx = np.where(lab == c)[0]
    if len(idx) < 5: continue
    dosyalar = sorted({V[i]["dosya"] for i in idx})
    merk = X[idx].mean(0); merk /= np.linalg.norm(merk)
    yak = sorted(idx, key=lambda i: -float(X[i] @ merk))
    en, gor = [], set()
    for i in yak:  # merkeze yakın, farklı dosyalardan
        if V[i]["dosya"] in gor and len(yak) > 12: continue
        en.append(i); gor.add(V[i]["dosya"])
        if len(en) == 6: break
    kisiler.append({"n": len(idx), "dosyalar": dosyalar, "merkez": merk.tolist(), "ornek": [V[i]["kirp"] for i in en]})
kisiler.sort(key=lambda k: (min(k["dosyalar"]), -k["n"]))
for i, k in enumerate(kisiler, 1): k["no"] = i
if not os.environ.get("SADECE_PAFTA"): json.dump({"kisiler": kisiler, "nesneler": []}, open("calisma/yuz/kisiler.json", "w"))
print(len(V), "yüz →", len(kisiler), "kişi")
if os.environ.get("SADECE_PAFTA"):
    pass
kisiler = json.load(open("calisma/yuz/kisiler.json"))["kisiler"]
# Pafta: kişi başına 3 örnek, 6 kişi/satır
hucre = []
for k in kisiler:
    imgs = [cv2.imread(f"calisma/yuz/kirp/{o}.jpg") for o in k["ornek"][:3]]
    def sik(im):
        h, w = im.shape[:2]; a = int(w*0.19); b = int(h*0.19)
        return im[b:h-int(h*0.12), a:w-a]
    imgs = [cv2.resize(sik(im), (150, 170)) for im in imgs if im is not None]
    while len(imgs) < 3: imgs.append(np.full((170, 150, 3), 235, np.uint8))
    h = np.hstack(imgs); bant = np.full((54, h.shape[1], 3), 255, np.uint8)
    cv2.putText(bant, f"#{k['no']}", (8, 40), cv2.FONT_HERSHEY_DUPLEX, 1.25, (12, 12, 192), 2)
    b = []
    if any(int(d[4:8]) <= 7392 for d in k["dosyalar"]): b.append("Yarisma/Kombin")
    if any(7393 <= int(d[4:8]) <= 7467 for d in k["dosyalar"]): b.append("Vampir")
    if any(int(d[4:8]) >= 7470 for d in k["dosyalar"]): b.append("Roportaj")
    cv2.putText(bant, " + ".join(b), (110, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.62, (70, 70, 70), 2)
    hucre.append(cv2.copyMakeBorder(np.vstack([bant, h]), 6, 6, 6, 6, cv2.BORDER_CONSTANT, value=(255, 255, 255)))
S = 5
for p in range(0, len(hucre), S * 6):
    grup = hucre[p:p + S * 6]
    while len(grup) % S: grup.append(np.full_like(hucre[0], 255))
    satirlar = [np.hstack(grup[i:i + S]) for i in range(0, len(grup), S)]
    cv2.imwrite(f"ciktilar/yuz-paftasi-{p // (S*6) + 1}.jpg", np.vstack(satirlar), [cv2.IMWRITE_JPEG_QUALITY, 82])
print("pafta sayısı", (len(hucre) + S*6 - 1) // (S*6))
