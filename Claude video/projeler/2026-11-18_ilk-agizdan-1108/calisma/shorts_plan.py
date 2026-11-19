"""Shorts planı v2 -> src/shorts.json
- Kesme noktaları sessizliğe oturtulur
- Parça içindeki nefes/duraklama (sessizlik) ve dolgu ("ııı": ses var ama kelime yok) boşlukları kesilir
- Altyazı kelime zamanları yeni zaman çizelgesine taşınır
- Yüz izleme verisiyle her parçada yüzün alt sınırı ölçülür (yazılar yüzü kapatmasın)
- B-roll kartları tetikleyici kelimeye bağlanır"""
import json, wave, numpy as np

FPS = 30
d = json.load(open("calisma/transkript.json"))
w = wave.open("calisma/ses16k.wav")
SES = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
SR = 16000
YUZ = {n: json.load(open(f"calisma/yuz_{n}2.json")) for n in ("konuk", "sunucu")}

def db(t, win=0.02):
    a = SES[max(0, int(t * SR)) : int((t + win) * SR)]
    return 20 * np.log10(float(np.sqrt((a ** 2).mean())) + 1e-9)

def sessiz_nokta(a, b):
    ts = np.arange(a, b, 0.01)
    return float(ts[int(np.argmin([db(t) for t in ts]))])

def ses_baslangici(t0, t1, esik=-30):
    for t in np.arange(t0, t1, 0.01):
        if db(t) > esik: return float(t)
    return t0

SESSIZ_DB = -38      # bunun altı sessizlik
MIN_SESSIZ = 0.16    # bu kadar uzun sessizlik kesilir
MIN_DOLGU = 0.35     # kelimeler arası bu kadar uzun sesli boşluk = dolgu ("ııı"), kesilir
PAY = 0.05           # kesimin iki yanında bırakılan pay
MIN_PARCA = 0.30

DUZELT = {"tarafta": "taraf da", "valse": "vals", "yuruna": "yumruğa", "Mağzon": "Mağazan"}

SHORTS = [
    {"id": "Short1-Tuvalet", "kanca": ["EN SEVDİĞİ ODA:", "TUVALET"],
     "vurgu": ["tuvalet", "lavabo", "oda", "odasında", "dinleniyorum", "öğretmediler", "çocuk", "erkek"],
     "parcalar": [(295.46, 299.82, "konuk"), (299.82, 306.40, "konuk"), (311.36, 313.20, "konuk"), (314.02, 318.05, "ikili", "korun"),
                  (321.44, 328.82, "konuk"), (386.64, 390.80, "konuk"), (401.72, 409.44, "konuk"), (409.58, 413.0, "konuk"), (413.0, 414.85, "ikili", "korun")],
     "broll": [("tuvalet", 314.0, "🚽", "TUVALET?!", 1.5), ("çocuk", 386.0, "👦👦👦👦", "4 ÇOCUK", 1.5), ("lavabo", 402.0, "🛁", "TEK KAÇIŞ YERİ", 1.6)]},
    {"id": "Short2-Dans", "kanca": ["SATIŞ", "BİR DANSTIR"],
     "vurgu": ["dans", "vals", "keyif", "dürüstçe", "doğru", "uygulamak", "bilmek", "götürecektir"],
     "parcalar": [(143.82, 152.00, "konuk"), (152.24, 157.58, "konuk"), (157.78, 162.42, "konuk"), (436.86, 441.0, "konuk"), (441.22, 445.30, "konuk")],
     "broll": [("dans", 143.0, "💃🕺", "DANS", 1.4), ("dürüstçe", 157.0, "🤝", "DÜRÜST SATIŞ", 1.4), ("uygulamak", 436.0, "✅", "BİLMEK < UYGULAMAK", 1.8)]},
    {"id": "Short3-TurkAmerikan", "kanca": ["TÜRKLER vs", "AMERİKALILAR"],
     "vurgu": ["amerikalılar", "amerika'daki", "güven", "sıcakkanlı", "ısmarlama", "cinayete", "kavga", "türkiye'de", "amerika'da", "farklı"],
     "parcalar": [(480.56, 487.58, "sunucu"), (520.0, 524.42, "konuk"), (525.12, 533.14, "konuk"), (537.28, 542.06, "konuk"),
                  (545.04, 548.62, "konuk"), (548.80, 557.42, "konuk"), (557.50, 562.24, "ikili")],
     "broll": [("amerikalılar", 519.0, "🇺🇸", "AMERİKA", 1.4), ("sıcakkanlı", 539.0, "🇹🇷", "TÜRKİYE", 1.4), ("cinayete", 545.0, "😱", "CİNAYETE KADAR!", 1.6), ("kavga", 551.0, "🥊", "KAVGA", 1.3)]},
    {"id": "Short4-Duygusal", "kanca": ["%95 DUYGUSAL", "KARAR VERİYORUZ"],
     "vurgu": ["duygusal", "duygusaldır", "duygularıyla", "duyguyla", "mantıklarıyla", "mantıkla", "bahane", "sekizincisini", "pişmanlık", "doksan", "beş", "düğün"],
     "parcalar": [(629.88, 634.74, "sunucu"), (642.46, 648.06, "konuk"), (580.08, 587.30, "konuk"), (592.88, 597.62, "konuk"),
                  (600.08, 607.14, "konuk"), (612.14, 616.88, "konuk"), (623.12, 628.96, "konuk")],
     "broll": [("doksan", 645.0, "SAYAC95", "DUYGUSAL", 1.8), ("sekizincisini", 605.0, "👟", "8. ÇİFT", 1.5), ("düğün", 612.0, "💍", "BAHANE: DÜĞÜN", 1.6)]},
]

def kelime_duzelt(t, s, e):
    """Whisper bazen kelimeye önceki duraklamayı da katar: uzun kelimede içteki sessizlikten sonrasını başlangıç say"""
    if e - s < 0.6: return (t, s, e)
    ts = np.arange(s, e, 0.01); ses = [db(x) > SESSIZ_DB for x in ts]
    son_sessiz = None; i = 0
    while i < len(ts):
        if not ses[i]:
            j = i
            while j < len(ts) and not ses[j]: j += 1
            if (j - i) * 0.01 >= 0.25: son_sessiz = ts[j - 1] + 0.01
            i = j
        else: i += 1
    return (t, float(son_sessiz), e) if son_sessiz and son_sessiz < e - 0.1 else (t, s, e)

kelimeler = [kelime_duzelt(wd["w"].strip(), wd["s"], wd["e"]) for s in d for wd in s["words"]]

def alt_parcalar(a, b, ks):
    """[a,b] içindeki konuşma aralıkları: sessizlik ve dolgu boşluklarını çıkar"""
    ts = np.arange(a, b, 0.01)
    sessiz = np.array([db(t) < SESSIZ_DB for t in ts])
    kes = []
    # sessiz koşular
    i = 0
    while i < len(ts):
        if sessiz[i]:
            j = i
            while j < len(ts) and sessiz[j]: j += 1
            if (j - i) * 0.01 >= MIN_SESSIZ: kes.append((ts[i] + PAY, ts[j - 1] + 0.01 - PAY))
            i = j
        else: i += 1
    # dolgu: kelimeler arası uzun boşluk
    for (w1, w2) in zip(ks, ks[1:]):
        if w2[1] - w1[2] >= MIN_DOLGU: kes.append((w1[2] + PAY, w2[1] - PAY))
    kes = sorted((x, y) for x, y in kes if y - x > 0.05)
    # birleştir
    m = []
    for x, y in kes:
        if m and x <= m[-1][1]: m[-1] = (m[-1][0], max(m[-1][1], y))
        else: m.append((x, y))
    out, cur = [], a
    for x, y in m:
        if x - cur >= MIN_PARCA: out.append((cur, x))
        cur = max(cur, y)
    if b - cur >= MIN_PARCA: out.append((cur, b))
    return out

def yuz_olc(kaynak, a, b):
    k = [o for o in YUZ[kaynak]["kareler"] if a <= o["t"] <= b and "cy" in o]
    if not k: return {"ust": 600, "alt": 930, "cy": 765}
    return {"ust": int(np.percentile([o["ust"] for o in k], 5)), "alt": int(np.percentile([o["alt"] for o in k], 95)), "cy": int(np.median([o["cy"] for o in k]))}

cikti = []
for sh in SHORTS:
    parcalar, altyazi, broll, tl, zsay = [], [], [], 0.0, 0
    toplam_kesilen = 0.0
    for (a, b, duzen, *ek) in sh["parcalar"]:
        korun = "korun" in ek  # espri duraklamasını kesme
        a2 = round(sessiz_nokta(a - 0.30, a + 0.05), 3)
        b2 = round(sessiz_nokta(b - 0.05, b + 0.35), 3)
        pk = [k for k in kelimeler if a2 <= (k[1] + k[2]) / 2 < b2]
        kayma = 0.0
        if pk:
            kayma = max(0.0, min(0.6, ses_baslangici(a2, min(b2, pk[0][1] + 0.8)) - pk[0][1]))
        pk = [(t, s + kayma, e + kayma) for (t, s, e) in pk]
        araliklar = [(a2, b2)] if korun else alt_parcalar(a2, b2, pk)
        for j, (x, y) in enumerate(araliklar):
            fa, fb = round(x * FPS), round(y * FPS)
            if fb - fa < 6: continue
            bas, son = fa / FPS, fb / FPS
            yz = {n: yuz_olc(n, bas, son) for n in ("konuk", "sunucu")}
            parcalar.append({"bas": bas, "kare": fb - fa, "duzen": duzen, "zoom": zsay % 2 == 1, "yuz": yz})
            sonraki = araliklar[j + 1][0] if j + 1 < len(araliklar) else 1e9
            onceki_son = araliklar[j - 1][1] if j > 0 else -1e9
            for (t, s, e) in pk:
                orta = (s + e) / 2
                icinde = bas <= orta < son
                kesimde_sonra = onceki_son <= orta < bas and e > bas  # kesime düştü ama bu aralığa taşıyor
                if icinde or kesimde_sonra:
                    tt = t.strip(".,?!")
                    if tt in DUZELT: t = t.replace(tt, DUZELT[tt])
                    s2 = max(bas, s) - bas + tl; e2 = min(son, e) - bas + tl
                    altyazi.append({"w": t, "s": round(s2, 3), "e": round(max(e2, s2 + 0.1), 3)})
            tl += (fb - fa) / FPS; zsay += 1
        toplam_kesilen += (b2 - a2)
    # B-roll: tetikleyici kelimenin yeni zamanı
    for (kelime, sonra, emoji, etiket, sure) in sh["broll"]:
        aday = [w for w in altyazi if w["w"].strip(".,?!").lower().startswith(kelime) and w["s"] >= 3.4]  # büyük başlık bitmeden girmesin
        if aday:
            s = aday[0]["s"]
            broll.append({"s": round(max(0, s - 0.1), 3), "sure": sure, "emoji": emoji, "etiket": etiket})
    cikti.append({"id": sh["id"], "kanca": sh["kanca"], "vurgu": sh["vurgu"], "parcalar": parcalar, "altyazi": altyazi,
                  "broll": broll, "toplamKare": sum(p["kare"] for p in parcalar)})
    print(f"{sh['id']}: {toplam_kesilen:.1f} sn -> {tl:.1f} sn ({toplam_kesilen - tl:.1f} sn boşluk kesildi), {len(parcalar)} parça, b-roll {len(broll)}")

json.dump(cikti, open("src/shorts.json", "w"), ensure_ascii=False, indent=1)
