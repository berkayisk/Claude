"""Konuşmacı ayrımı: her cümlenin ses izi (ECAPA) kameradaki kişinin referansıyla karşılaştırılır. Sadece kameradaki kişi kullanılır."""
import json, os, wave, numpy as np, torch
from speechbrain.inference.speaker import EncoderClassifier
m = EncoderClassifier.from_hparams(source="speechbrain/spkrec-ecapa-voxceleb", savedir="/tmp/claude-0/-home-user-Claude/8dfd6cb7-985d-5745-ab72-f762f9133cee/scratchpad/ecapa")
KEL = json.load(open("calisma/kelimeler.json"))
def oku(n):
    p = f"calisma/ses_temiz/{n}_16k.wav"
    if not os.path.exists(p): p = f"calisma/{n}.wav"
    w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768, p.endswith("_16k.wav")
def emb(x): return torch.nn.functional.normalize(m.encode_batch(torch.tensor(x)[None]).squeeze(), dim=0).numpy()
cumleler = []
for n, ks in KEL.items():
    if not ks: continue
    x, temiz = oku(n); c = [ks[0]]
    for w in ks[1:]:
        if w["s"] - c[-1]["e"] > 0.6 or c[-1]["w"][-1] in ".?!": cumleler.append((n, c)); c = [w]
        else: c.append(w)
    cumleler.append((n, c))
E = {}
for i, (n, c) in enumerate(cumleler):
    x, _ = oku(n); a, b = c[0]["s"], c[-1]["e"]
    if b - a < 0.5: a, b = a - 0.2, b + 0.2
    E[i] = emb(x[int(max(0, a) * 16000):int(b * 16000)])
# referans: kameradaki kişinin uzun tek başına konuşmaları
ref_i = [i for i, (n, c) in enumerate(cumleler) if n in ("IMG_7513", "IMG_7511", "IMG_7497") and c[-1]["e"] - c[0]["s"] > 2]
ref = np.mean([E[i] for i in ref_i], axis=0); ref /= np.linalg.norm(ref)
for i, (n, c) in enumerate(cumleler):
    print(f"{np.dot(E[i], ref):.2f} {n} {c[0]['s']:6.2f}-{c[-1]['e']:6.2f} {' '.join(w['w'] for w in c)[:90]}")

print("\n--- temiz referans (7507 cevap + 7512 + 7513), çekim içi kümeleme ---")
temiz_ref = [i for i, (n, c) in enumerate(cumleler) if (n in ("IMG_7513",) or (n == "IMG_7507" and c[0]["s"] > 16) or (n == "IMG_7512" and c[0]["s"] < 1)) and c[-1]["e"] - c[0]["s"] > 1.5]
r2 = np.mean([E[i] for i in temiz_ref], axis=0); r2 /= np.linalg.norm(r2)
from sklearn.cluster import AgglomerativeClustering
for n in ("IMG_7507", "IMG_7512", "IMG_7524", "IMG_7508", "IMG_7509"):
    ii = [i for i, (nn, c) in enumerate(cumleler) if nn == n and c[-1]["e"] - c[0]["s"] > 0.3]
    X = np.array([E[i] for i in ii])
    lab = AgglomerativeClustering(n_clusters=2, metric="cosine", linkage="average").fit_predict(X)
    print("==", n)
    for i, l in zip(ii, lab):
        c = cumleler[i][1]; print(f"  küme{l} ref{np.dot(E[i], r2):.2f} {c[0]['s']:6.2f} {' '.join(w['w'] for w in c)[:70]}")
