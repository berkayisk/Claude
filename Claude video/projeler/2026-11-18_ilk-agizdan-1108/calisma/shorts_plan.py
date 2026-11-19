"""Shorts planı: kaynak parçaları + kelime kelime altyazı -> src/shorts.json
Kesme noktaları ses enerjisinin en düşük olduğu ana oturtulur; altyazı zamanları parça başındaki ses başlangıcına hizalanır."""
import json, wave, numpy as np

FPS = 30
d = json.load(open("calisma/transkript.json"))
w = wave.open("calisma/ses16k.wav")
SES = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
SR = 16000

def rms(t, win=0.02):
    a = SES[max(0, int(t * SR)) : int((t + win) * SR)]
    return float(np.sqrt((a ** 2).mean()) + 1e-9)

def sessiz_nokta(a, b):
    ts = np.arange(a, b, 0.01)
    return float(ts[int(np.argmin([rms(t) for t in ts]))])

def ses_baslangici(t0, t1, esik_db=-30):
    for t in np.arange(t0, t1, 0.01):
        if 20 * np.log10(rms(t)) > esik_db:
            return float(t)
    return t0

DUZELT = {"tarafta": "taraf da", "valse": "vals", "yuruna": "yumruğa", "Mağzon": "Mağazan"}

# (bas, son, düzen)  düzen: konuk | sunucu | ikili ; zoom her parçada dönüşümlü uygulanır
SHORTS = [
    {
        "id": "Short1-Tuvalet",
        "kanca": ["EN SEVDİĞİ ODA:", "TUVALET"],
        "vurgu": ["tuvalet", "lavabo", "oda", "odasında", "dinleniyorum", "öğretmediler", "çocuk", "erkek"],
        "parcalar": [
            (295.46, 299.82, "konuk"), (299.82, 306.40, "konuk"), (311.36, 313.20, "konuk"),
            (314.02, 318.05, "ikili"), (321.44, 328.82, "konuk"), (386.64, 390.80, "konuk"),
            (401.72, 409.44, "konuk"), (409.58, 414.16, "konuk"), (414.16, 416.2, "ikili"),
        ],
    },
    {
        "id": "Short2-Dans",
        "kanca": ["SATIŞ", "BİR DANSTIR"],
        "vurgu": ["dans", "vals", "keyif", "dürüstçe", "doğru", "uygulamak", "bilmek", "götürecektir"],
        "parcalar": [
            (143.82, 152.00, "konuk"), (152.24, 157.58, "konuk"), (157.78, 162.42, "konuk"),
            (436.86, 441.0, "konuk"), (441.22, 445.30, "konuk"),
        ],
    },
    {
        "id": "Short3-TurkAmerikan",
        "kanca": ["TÜRKLER vs", "AMERİKALILAR"],
        "vurgu": ["amerikalılar", "amerika'daki", "güven", "sıcakkanlı", "ısmarlama", "cinayete", "kavga", "türkiye'de", "amerika'da", "farklı"],
        "parcalar": [
            (480.56, 487.58, "sunucu"), (520.0, 524.42, "konuk"), (525.12, 533.14, "konuk"),
            (537.28, 542.06, "konuk"), (545.04, 548.62, "konuk"), (548.80, 557.42, "konuk"), (557.50, 562.24, "ikili"),
        ],
    },
    {
        "id": "Short4-Duygusal",
        "kanca": ["%95 DUYGUSAL", "KARAR VERİYORUZ"],
        "vurgu": ["duygusal", "duygusaldır", "duygularıyla", "duyguyla", "mantıklarıyla", "mantıkla", "bahane", "sekizincisini", "pişmanlık", "doksan", "beş", "düğün"],
        "parcalar": [
            (629.88, 634.74, "sunucu"), (642.46, 648.06, "konuk"), (580.08, 587.30, "konuk"),
            (592.88, 597.62, "konuk"), (600.08, 607.14, "konuk"), (612.14, 616.88, "konuk"), (623.12, 628.96, "konuk"),
        ],
    },
]

kelimeler = [(wd["w"].strip(), wd["s"], wd["e"]) for s in d for wd in s["words"]]

cikti = []
for sh in SHORTS:
    parcalar, altyazi, tl = [], [], 0.0
    for i, (a, b, duzen) in enumerate(sh["parcalar"]):
        # kesme noktalarını sessizliğe oturt
        a2 = sessiz_nokta(a - 0.30, a + 0.05)
        b2 = sessiz_nokta(b - 0.05, b + 0.35)
        a2, b2 = round(a2, 3), round(b2, 3)
        fa, fb = round(a2 * FPS), round(b2 * FPS)
        sure_k = fb - fa
        # altyazı: parçadaki kelimeler, ilk kelimeyi gerçek ses başlangıcına hizala
        pk = [k for k in kelimeler if a2 <= (k[1] + k[2]) / 2 < b2]
        kayma = 0.0
        if pk:
            gercek = ses_baslangici(a2, min(b2, pk[0][1] + 0.8))
            kayma = max(0.0, min(0.6, gercek - pk[0][1]))
        for (t, s, e) in pk:
            t = DUZELT.get(t.strip(".,?!"), t) if t.strip(".,?!") in DUZELT else t
            s2 = max(a2, s + kayma) - a2 + tl
            e2 = min(b2, e + kayma) - a2 + tl
            altyazi.append({"w": t, "s": round(s2, 3), "e": round(max(e2, s2 + 0.12), 3)})
        parcalar.append({"bas": a2, "kare": sure_k, "duzen": duzen, "zoom": i % 2 == 1})
        tl += sure_k / FPS
    cikti.append({"id": sh["id"], "kanca": sh["kanca"], "vurgu": sh["vurgu"], "parcalar": parcalar,
                  "altyazi": altyazi, "toplamKare": sum(p["kare"] for p in parcalar)})
    print(f"{sh['id']}: {tl:.1f} sn, {len(parcalar)} parça, {len(altyazi)} kelime")

json.dump(cikti, open("src/shorts.json", "w"), ensure_ascii=False, indent=1)
