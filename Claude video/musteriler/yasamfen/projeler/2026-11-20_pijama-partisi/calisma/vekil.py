#!/usr/bin/env python3
"""4K HEVC ham → 1440x2560 H.264 vekil (Remotion için) + yüz blur.
Kullanım: python3 calisma/vekil.py [--blursuz] 7356 7357 ...
Blur kuralı (calisma/yuz/blur.json): {"acik": [kişi no], "blur": [kişi no], "varsayilan": "blur"}
  - Her yüz izi (track) kimliğe eşlenir (SFace, kisiler.json merkezleri). acik listesindeyse açık kalır, değilse blurlanır.
  - Tanınmayan iz → varsayilan (güvenli taraf: blur).
Algılama her 2 karede (1080x1920 ölçeğinde), izler IoU ile bağlanır, aradaki kareler enterpolasyon, kayıp kareler 12 kare tutulur."""
import json, os, subprocess, sys, numpy as np, cv2
os.environ["HF_HUB_OFFLINE"] = "1"
from huggingface_hub import hf_hub_download
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
args = [a for a in sys.argv[1:] if not a.startswith("--")]
BLURSUZ = "--blursuz" in sys.argv
OW, OH = 1440, 2560            # çıktı
DW, DH = 1080, 1920            # algılama ölçeği
ADIM, TUT = 2, 36   # yüz kaybolunca kutu 1.2 sn tutulur (profil dönüşleri)
det = cv2.FaceDetectorYN.create(hf_hub_download("opencv/face_detection_yunet", "face_detection_yunet_2023mar.onnx"), "", (DW, DH), 0.45, 0.3, 5000)
rec = cv2.FaceRecognizerSF.create(hf_hub_download("opencv/face_recognition_sface", "face_recognition_sface_2021dec.onnx"), "")
K = json.load(open("calisma/yuz/kisiler.json"))["kisiler"]
M = np.array([k["merkez"] for k in K], np.float32); NO = [k["no"] for k in K]
KLIP = {k["no"]: set(k["dosyalar"]) for k in K}   # kişi hangi kliplerde kümelendi
kural = json.load(open("calisma/yuz/blur.json")) if os.path.exists("calisma/yuz/blur.json") else {"acik": [], "varsayilan": "blur"}
ACIK = set(kural.get("acik", [])); BLUR = set(kural.get("blur", [])); VARS = kural.get("varsayilan", "blur")
os.makedirs("girdiler/vekil", exist_ok=True); os.makedirs("calisma/yuz/iz", exist_ok=True)

def iou(a, b):
    x0, y0 = max(a[0], b[0]), max(a[1], b[1]); x1, y1 = min(a[0]+a[2], b[0]+b[2]), min(a[1]+a[3], b[1]+b[3])
    i = max(0, x1-x0) * max(0, y1-y0); return i / (a[2]*a[3] + b[2]*b[3] - i + 1e-6)

def kimlik(vek):
    v = np.array(vek, np.float32); v /= np.linalg.norm(v); s = M @ v; j = int(s.argmax())
    return (NO[j] if s[j] > 0.42 else None, float(s[j]), NO[j])

def isle(no):
    src = f"girdiler/ham/IMG_{no}.MOV"; out = f"girdiler/vekil/{no}.mp4"
    kilit = f"girdiler/vekil/{no}.kilit"
    if os.path.exists(out) and not os.path.exists(kilit) and "--zorla" not in sys.argv: return
    if os.path.exists(kilit): return
    open(kilit, "w").close()
    try: _isle(no, src, out)
    finally: os.remove(kilit)

def _isle(no, src, out):
    fps = 30
    # 1) Algılama geçişi (her ADIM karede), izleri kur
    izler = []  # {kutular: {kare: box}, kimlikler: [(no, skor)], son: kare}
    if not BLURSUZ:
        p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-vf", f"select='not(mod(n\\,{ADIM}))',scale={DW}:{DH}", "-vsync", "0", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
        n = DW*DH*3; i = 0
        while True:
            b = p.stdout.read(n)
            if len(b) < n: break
            kare = i * ADIM; img = np.frombuffer(b, np.uint8).reshape(DH, DW, 3)
            _, fs = det.detect(img)
            for fc in (fs if fs is not None else []):
                box = [float(v) for v in fc[:4]]
                en = max((iz for iz in izler if kare - iz["son"] <= TUT), key=lambda iz: iou(iz["kutular"][iz["son"]], box), default=None)
                if en is None or iou(en["kutular"][en["son"]], box) < 0.2:
                    en = {"kutular": {}, "kimlikler": [], "son": kare}; izler.append(en)
                en["kutular"][kare] = box; en["son"] = kare
                if box[2] >= 34 and len(en["kimlikler"]) < 12:
                    en["kimlikler"].append(kimlik(rec.feature(rec.alignCrop(img, fc))[0]))
            i += 1
        p.wait()
    # 2) Her iz için karar
    plan = []
    for iz in izler:
        oy, zayif = {}, {}
        for k, s, en in iz["kimlikler"]:
            if k is not None: oy[k] = oy.get(k, 0) + s
            if s > 0.30: zayif[en] = zayif.get(en, 0) + s
        kim = max(oy, key=oy.get) if oy else None
        if kim is not None and kim not in BLUR and f"IMG_{no}.MOV" not in KLIP.get(kim, ()):
            kim = None   # bu klipte hiç görülmemiş kişiye eşleşme → yanlış tanıma, güvenli taraf
        if kim is not None:
            bl = True if kim in BLUR else False if (kim in ACIK or VARS == "acik") else True
        elif zayif:
            kim = max(zayif, key=zayif.get)
            bl = (kim in BLUR) or int(no) <= kural.get("bilinmeyen_blur_klip_ust", 0) or f"IMG_{no}.MOV" not in KLIP.get(kim, ()); kim = f"~{kim}"
        else:
            bl = True   # hiç tanınmayan iz → blur
        ks = sorted(iz["kutular"]); plan.append({"kim": kim, "blur": bl, "kareler": ks, "kutular": [iz["kutular"][k] for k in ks]})
    json.dump(plan, open(f"calisma/yuz/iz/{no}.json", "w"))
    # kare → blur kutuları (enterpolasyon + baş/son TUT kadar uzatma)
    kutu = {}
    for iz in plan:
        if not iz["blur"]: continue
        ks, bs = iz["kareler"], np.array(iz["kutular"])
        for a in range(max(0, ks[0]-15), ks[-1]+TUT):
            j = np.searchsorted(ks, a)
            if j < len(ks) and ks[j] == a: bx = bs[j]
            elif 0 < j < len(ks) and ks[j]-ks[j-1] <= TUT:
                r = (a-ks[j-1])/(ks[j]-ks[j-1]); bx = bs[j-1]*(1-r) + bs[j]*r
            elif j == 0 and ks[0]-a <= 15: bx = bs[0]
            elif j == len(ks) and a-ks[-1] <= TUT: bx = bs[-1]
            elif 0 < j < len(ks): bx = bs[j-1]   # uzun boşlukta son kutuyu tut
            else: continue
            kutu.setdefault(a, []).append(bx)
    # 3) Kodlama geçişi: tam karelerde blur uygula
    sx = OW/DW
    rd = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-vf", f"scale={OW}:{OH}", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
    wr = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", str(fps), "-i", "-",
                           "-i", src, "-map", "0:v", "-map", "1:a:0?", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
                           "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    n = OW*OH*3; a = 0; say = 0
    while True:
        b = rd.stdout.read(n)
        if len(b) < n: break
        img = np.frombuffer(b, np.uint8).reshape(OH, OW, 3).copy()
        for bx in kutu.get(a, []):
            x, y, w, h = [v*sx for v in bx]
            cx, cy = x + w/2, y + h*0.45; rw, rh = w*1.0, h*1.2           # yüz + saç/çene + profil payı
            x0, y0, x1, y1 = int(max(0, cx-rw*1.25)), int(max(0, cy-rh*1.25)), int(min(OW, cx+rw*1.25)), int(min(OH, cy+rh*1.25))
            if x1-x0 < 4 or y1-y0 < 4: continue
            roi = img[y0:y1, x0:x1]
            kucuk = cv2.resize(roi, (max(2, (x1-x0)//10), max(2, (y1-y0)//10)), interpolation=cv2.INTER_AREA)
            kucuk = cv2.GaussianBlur(kucuk, (0, 0), 1.5)
            bulanik = cv2.GaussianBlur(cv2.resize(kucuk, (x1-x0, y1-y0), interpolation=cv2.INTER_LINEAR), (0, 0), max(5, w*0.10))
            mask = np.zeros((y1-y0, x1-x0), np.float32)
            cv2.ellipse(mask, (int(cx-x0), int(cy-y0)), (int(rw), int(rh)), 0, 0, 360, 1, -1)
            mask = np.clip(cv2.GaussianBlur(mask, (0, 0), max(4, w*0.10)) * 1.35, 0, 1)[..., None]
            img[y0:y1, x0:x1] = (roi*(1-mask) + bulanik*mask).astype(np.uint8); say += 1
        wr.stdin.write(img.tobytes()); a += 1
    wr.stdin.close(); wr.wait(); rd.wait()
    acik = sorted({str(iz["kim"]) for iz in plan if not iz["blur"]}); bl = sorted({str(iz["kim"]) for iz in plan if iz["blur"]})
    print(f"{no}: {a} kare, {len(plan)} iz, {say} blur uygulaması | açık: {','.join(acik)} | blur: {','.join(bl)}", flush=True)

for no in args:
    isle(no)
print("VEKIL BITTI", flush=True)
