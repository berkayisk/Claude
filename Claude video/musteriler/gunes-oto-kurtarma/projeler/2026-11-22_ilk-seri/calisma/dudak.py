"""Dudak hareketi: her cümle süresince kameradaki yüzün ağız açıklığı değişimi (konuşan kişi kamerada mı?)."""
import json, sys, numpy as np, cv2, mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions
MODEL = "/tmp/claude-0/-home-user-Claude/8dfd6cb7-985d-5745-ab72-f762f9133cee/scratchpad/face_landmarker.task"
KEL = json.load(open("calisma/kelimeler.json"))
out = {}
for n in sys.argv[1:]:
    lm = vision.FaceLandmarker.create_from_options(vision.FaceLandmarkerOptions(base_options=BaseOptions(model_asset_path=MODEL), running_mode=vision.RunningMode.VIDEO, num_faces=1))
    cap = cv2.VideoCapture(f"girdiler/{n}_dikey.mp4"); i = 0; seri = []
    while True:
        ok, fr = cap.read()
        if not ok: break
        if i % 2 == 0:
            img = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(cv2.resize(fr, (540, 960)), cv2.COLOR_BGR2RGB))
            r = lm.detect_for_video(img, int(i / 30 * 1000))
            if r.face_landmarks:
                p = r.face_landmarks[0]; yuz = abs(p[152].y - p[10].y) + 1e-6
                seri.append((i / 30, abs(p[14].y - p[13].y) / yuz))
            else: seri.append((i / 30, np.nan))
        i += 1
    out[n] = seri
    t = np.array([s[0] for s in seri]); a = np.array([s[1] for s in seri])
    ks = KEL[n]; c = [ks[0]] if ks else []; cum = []
    for w in ks[1:]:
        if w["s"] - c[-1]["e"] > 0.6 or c[-1]["w"][-1] in ".?!": cum.append(c); c = [w]
        else: c.append(w)
    if c: cum.append(c)
    print("==", n, "yüz bulunan kare oranı", round(float(np.mean(~np.isnan(a))), 2))
    for c in cum:
        m = (t >= c[0]["s"]) & (t <= c[-1]["e"]); x = a[m]; x = x[~np.isnan(x)]
        hareket = float(np.mean(np.abs(np.diff(x)))) * 100 if len(x) > 3 else float("nan")
        print(f"  dudak {hareket:5.2f} yüz {len(x)}/{int(m.sum())} {c[0]['s']:6.2f} {' '.join(w['w'] for w in c)[:70]}")
json.dump(out, open("calisma/dudak.json", "w"))
