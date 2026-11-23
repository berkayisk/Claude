"""Güneş Oto Kurtarma ilk seri: video planı -> src/<id>.json (GunesReels şablonu).
Sıkı kurgu: kök CLAUDE.md 'Reels / talking-head kuralları' (cümle arası ~0.07 sn, nefesler atılır, video sözle başlar).
Kullanım: python3 calisma/plan.py v3 [v4 v6 ...]"""
import json, sys, wave, numpy as np

FPS = 30
import subprocess, glob as _g
SURE = {p.split("/")[-1][:-4]: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout) for p in _g.glob("girdiler/IMG_*.MOV")}
KEL = json.load(open("calisma/kelimeler.json"))
DUZELT = {"Kurtarıcü": "Kurtarıcı...", "Kurtarcı": "Kurtarıcı", "hesabını?": "hesabı?", "ünitleri": "ücretleri", "sığcılık": "tırcılık", "güneşimiz": "Güneş'imiz", "tırf,": "tır,",
          "kokluyuz.": "forklift.", "güvenliliğini": "güvenliğini", "veliahtında": "evveliyatında", "hizmeleri.": "hizmetleri.",
          "hizmit": "hizmet", "çağılmalısınız.": "çağırmalısınız.", "sağlamalısınız": "sağlamalısınız.", "mukavvetini": "mukavemetini", "Zorluk": "Zorlu", "hız": "kış", "baya": "bayağı", "sekman": "segman", "olabiliyoruz.": "olabiliyor.", "havallarda": "havalarda", "aminom": "***", "arzalandığı": "arızalandığı", "tamurumuzun": "tamburumuzun", "Onurumuz": "Onur'umuz", "ediyoruz.": "ediyor.", "sürat": "Sürat", "kargoya": "Kargo'ya", "Berkaycığımla": "Berkay'cığımla", "lobet": "lowbed", "çepçe": "kepçe", "eskavetör": "ekskavatör", "Kurtarıcı": "Kurtarıcı"}
# Whisper'ın yanlış hizaladığı kelimeler (ikinci geçişten): (çekim, yanlış kelime başı) -> doğru (w, s, e)
YAMA = {
    "IMG_7507": {0.82: ("Kurtarıcı", 0.02, 0.8), 1.5: ("ücretleri", 0.8, 2.0), 16.11: None, 16.33: None, 15.43: ("Kurtarıcı", 15.66, 16.10), 9.24: ("ki.", 9.22, 9.38), "ek": [("ücretleri", 16.10, 16.52)]},
    "IMG_7512": {0.0: ("Tırınız,", 1.08, 1.45)},
    "IMG_7524": {6.08: ("içi", 6.08, 6.24), 6.40: ("şehirler", 6.40, 6.84), 9.73: ("Tabi,", 9.73, 9.91), 39.53: ("içine.", 39.53, 39.83)},
    "IMG_7510": {5.36: ("şimdi?", 5.36, 5.80), 2.82: ("kasa,", 2.80, 3.28), 3.4: ("***", 3.28, 4.40), 3.68: None, 3.96: None, 37.8: ("yokuşu", 37.82, 38.70)},
    "IMG_7497": {31.23: None, 31.99: ("sağlamalısınız.", 31.32, 31.96), 23.6: None, 24.24: ("çağırmalısınız.", 24.30, 25.06), 44.78: ("basıp", 43.52, 43.95), "ek": [("lastiğinizi", 43.95, 46.62)]},
    "IMG_7509": {11.68: ("diferansiyeli", 11.70, 12.18), 12.18: ("dağıtabiliyor.", 12.18, 12.84), 12.54: None},
    "IMG_7511": {2.38: ("Biz", 5.0, 5.58), 10.6: ("4-5", 10.60, 11.52), 11.28: None},
}

S = {}
def ses(n):
    if n not in S:
        w = wave.open(f"calisma/ses_temiz/{n}_16k.wav"); S[n] = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return S[n]
def db(n, t, win=0.02):
    a = ses(n)[max(0, int(t * 16000)): int((t + win) * 16000)]
    return 20 * np.log10(float(np.sqrt((a ** 2).mean())) + 1e-9) if len(a) else -99

MIN_KES, KALAN, KALAN_SON = 0.12, 0.05, 0.10   # kelime sonları yarım kalmasın: sonda 0.10 sn pay
ESIK = {}
def esik(n):
    if n not in ESIK:
        e = [db(n, t, 0.01) for t in np.arange(0, len(ses(n)) / 16000 - 0.01, 0.01)]
        ESIK[n] = max(-38.0, float(np.percentile(e, 10)) + 7)
        print(f"  {n}: konuşma eşiği {ESIK[n]:.1f} dB")
    return ESIK[n]

def kelimeler(n):
    ks = []
    y = YAMA.get(n, {})
    for w in KEL[n]:
        if w["s"] in y:
            if y[w["s"]] is None: continue
            a, s, e = y[w["s"]]; ks.append({"w": a, "s": s, "e": e}); continue
        ks.append({"w": DUZELT.get(w["w"], w["w"]), "s": w["s"], "e": w["e"]})
    for a, s, e in y.get("ek", []): ks.append({"w": a, "s": s, "e": e})
    return sorted(ks, key=lambda w: w["s"])

def alt_araliklar(n, a, b, ks, haric):
    ts = np.arange(a, b, 0.01)
    th = esik(n)
    konusma = np.array([db(n, t, 0.01) > th for t in ts])
    for x, y in haric: konusma[(ts >= x) & (ts < y)] = False
    bolg = []; i = 0
    while i < len(ts):
        if konusma[i]:
            j = i
            while j < len(ts) and konusma[j]: j += 1
            bolg.append([ts[i], ts[j - 1] + 0.01]); i = j
        else: i += 1
    m = []
    for x, y in bolg:
        if m and x - m[-1][1] < MIN_KES: m[-1][1] = y
        else: m.append([x, y])
    def kelimeli(x, y): return any(x - 0.05 <= (w["s"] + w["e"]) / 2 <= y + 0.05 or (w["s"] < y and w["e"] > x and min(y, w["e"]) - max(x, w["s"]) > 0.08) for w in ks)
    m = [(x, y) for x, y in m if kelimeli(x, y)]
    out = []
    for x, y in m:
        x2, y2 = max([a, x - KALAN] + [hy for hx, hy in haric if hy <= x]), min([b, y + KALAN_SON] + [hx for hx, hy in haric if hx >= y])   # pay HARIC bölgesine taşmaz
        if out and x2 - out[-1][1] < 0.2 and not any(hx < x2 and hy > out[-1][1] for hx, hy in haric):   # 0.2 sn altı boşluk kesilmez (saliselik sıçrama olmasın)
            out[-1] = (out[-1][0], y2)
        else: out.append((x2, y2))
    return [(x, y) for x, y in out if y - x >= 0.15]

MIN_SAHNE, MAX_ARA = 1.0, 1.0
def sahne_birlestir(ar, haric):
    """Saliselik sahne olmasın: 1 sn'den kısa parça, arası 0.6 sn'den kısa komşusuyla birleştirilir (aradaki kısa boşluk kalır).
    Arada HARIC (atılan deneme) varsa birleştirilmez."""
    ar = [list(x) for x in ar]
    def engel(x, y): return any(hx < y and hy > x for hx, hy in haric)
    degisti = True
    while degisti:
        degisti = False
        for i, (x, y) in enumerate(ar):
            if y - x >= MIN_SAHNE: continue
            sol = x - ar[i - 1][1] if i > 0 and not engel(ar[i - 1][1], x) else 9
            sag = ar[i + 1][0] - y if i + 1 < len(ar) and not engel(y, ar[i + 1][0]) else 9
            if min(sol, sag) > MAX_ARA: continue
            if sol <= sag: ar[i - 1][1] = y; ar.pop(i)
            else: ar[i + 1][0] = x; ar.pop(i)
            degisti = True; break
    return [tuple(x) for x in ar]

def kurgu(cekimler, haric):
    """cekimler: [(çekim, baş, son)] -> parcalar, altyazi, eşleme (çekim, kaynak sn) -> zaman çizelgesi sn"""
    parcalar, altyazi, harita, tl, zs = [], [], [], 0.0, 0
    for c in cekimler:
        n, a, b = c[:3]; opt = c[3] if len(c) > 3 else {}
        if opt.get("dogal"):   # sözsüz çekim: kesmeden, kendi doğal sesiyle (B-roll sahnesi)
            fa, fb = int(round(a * FPS)), int(round(b * FPS))
            parcalar.append({"src": f"{n}_dikey.mp4", "ses": f"{n}_dogal.wav", "bas": fa / FPS, "kare": fb - fa, "zoom": False, "sesSeviye": opt.get("seviye", 0.6)})
            harita.append((n, fa / FPS, fb / FPS, tl)); tl += (fb - fa) / FPS; zs += 1
            continue
        ks = [w for w in kelimeler(n) if a <= (w["s"] + w["e"]) / 2 < b and not any(x <= (w["s"] + w["e"]) / 2 < y for x, y in haric.get(n, []))]
        ar = sahne_birlestir(alt_araliklar(n, a, b, ks, haric.get(n, [])), haric.get(n, []))
        hedef = []
        for w in ks:
            o = [min(y, w["e"]) - max(x, w["s"]) for (x, y) in ar]
            hedef.append(int(np.argmax(o)) if o and max(o) > 0 else -1)
        for j, (x, y) in enumerate(ar):
            fa, fb = int(np.floor(x * FPS)), int(np.ceil(y * FPS))
            if fb - fa < 6: continue
            bas, son = fa / FPS, fb / FPS
            for w, h in zip(ks, hedef):
                if h == j and w["w"]:
                    s2 = min(max(bas, w["s"]), son - 0.1) - bas + tl; e2 = min(son, w["e"]) - bas + tl
                    altyazi.append({"w": w["w"], "s": round(s2, 3), "e": round(max(e2, s2 + 0.1), 3), "n": n, "ks": w["s"]})
            parcalar.append({"src": f"{n}_dikey.mp4", "ses": opt.get("ses", f"{n}_ses.wav"), "bas": bas, "kare": fb - fa, "zoom": (1.13 if (fb - fa) < 30 else (1.07 if zs % 2 else 1.0))})   # birleştirilemeyen kısa parça: vurgu yakınlaştırması
            harita.append((n, bas, son, tl))
            tl += (fb - fa) / FPS
        zs += 1   # açı (zoom) değişimi sadece çekim/konu değişince
    return parcalar, altyazi, harita, tl

def kucuk(x): return x.replace("İ", "i").replace("I", "ı").lower()

def yap(vid):
    V = VIDEOLAR[vid]
    parcalar, altyazi, harita, tl = kurgu(V["cekimler"], V.get("haric", {}))
    def kz(parca, sonra=0.0, n=None):
        for w in altyazi:
            if kucuk(parca) in kucuk(w["w"]) and w["s"] >= sonra and (n is None or w["n"] == n): return w["s"]
        raise SystemExit(f"bulunamadı: {parca}")
    def ke(parca, sonra=0.0):
        for w in altyazi:
            if kucuk(parca) in kucuk(w["w"]) and w["s"] >= sonra: return w["e"]
        raise SystemExit(f"bulunamadı: {parca}")
    if V.get("son_kuyruk"):   # son kelime kesik duyulmasın: son parçayı kaynakta uzat
        ek = int(round(V["son_kuyruk"] * FPS)); parcalar[-1]["kare"] += ek; tl += ek / FPS
    olaylar, broll = V["olaylar"](kz, ke, tl), V["broll"](kz, ke, tl)
    for b_ in broll:
        if b_["son"] - b_["s"] < 1.2: print(f"  UYARI kısa/ters B-roll atıldı: {b_}")
    for b_ in broll:
        uz = SURE[b_["dosya"].replace("_dikey.mp4", "")] - b_["bas"] - 0.1
        if b_["son"] - b_["s"] > uz: print(f"  B-roll kısaltıldı (kaynak bitiyor): {b_['dosya']} {b_['son'] - b_['s']:.2f} -> {uz:.2f}"); b_["son"] = b_["s"] + uz
    # B-roll sınırları kesme noktalarına yapışır (aradan 1-2 kare yüz sızmasın); art arda B-roll'lar birbirine değer
    kesmeler = [0.0]
    for p_ in parcalar: kesmeler.append(kesmeler[-1] + p_["kare"] / FPS)
    def yapis(t):
        k = min(kesmeler, key=lambda c: abs(c - t))
        return k if abs(k - t) <= 0.35 else t
    broll.sort(key=lambda b_: b_["s"])
    for i_, b_ in enumerate(broll):
        b_["s"], b_["son"] = yapis(b_["s"]), yapis(b_["son"])
        if i_ and abs(b_["s"] - broll[i_ - 1]["son"]) <= 0.35: b_["s"] = broll[i_ - 1]["son"]
        b_["s"], b_["son"] = round(b_["s"] * FPS) / FPS, round(b_["son"] * FPS) / FPS
    broll = [b_ for b_ in broll if b_["son"] - b_["s"] >= 1.2]
    for a in altyazi: a.pop("n"); a.pop("ks")
    veri = {"parcalar": parcalar, "broll": broll, "altyazi": altyazi, "olaylar": olaylar, "vurgu": V["vurgu"],
            "toplamKare": sum(p["kare"] for p in parcalar), "kartY": 1000, "altyaziY": 1510}
    json.dump(veri, open(f"src/{vid}.json", "w"), ensure_ascii=False, indent=1)
    print(f"{vid}: {tl:.1f} sn, {len(parcalar)} parça")
    print("  " + " ".join(w["w"] for w in altyazi))

# ---------------- Videolar ----------------
VIDEOLAR = {
    # 9) Kayar kasayla yokuş — 7510 (hepsi kameradaki şoför; "ebeğin nikahı" bip)
    "v9": {
        "cekimler": [("IMG_7510", 0.0, 6.0, {"ses": "IMG_7510_ses_bip.wav"}), ("IMG_7510", 10.3, 12.5),
                     ("IMG_7510", 17.0, 20.5, {"dogal": True, "seviye": 1.0}), ("IMG_7510", 25.6, 30.0), ("IMG_7510", 34.3, 39.4)],
        "son_kuyruk": 0.8,
        "vurgu": ["kayar", "kasa", "***", "nasıl", "çıkmam", "çıkıyoruz", "kaptırmadık", "olacak", "toparlarsa", "yokuşu"],
        "olaylar": lambda kz, ke, tl: [
            {"tip": "kanca", "anlik": True, "s": 0.0, "son": kz("çıkıyoruz") - 0.05, "satir1": "KAYAR KASAYLA YOKUŞ", "boyut": 80, "satir2": "çıkabilecek miyiz?"},
            {"tip": "uyari", "s": kz("***"), "son": kz("şuradan"), "metin": "BİİİP", "boyut": 70},
            {"tip": "uyari", "renk": "sari", "s": kz("çıkıyoruz"), "son": kz("aşağıdan") - 0.05, "metin": "ÇIKIYORUZ!"},
            {"tip": "uyari", "renk": "sari", "s": kz("kaptırmadık"), "son": kz("evet") - 0.05, "metin": "KAPTIRMADIK ✓", "boyut": 70},
            {"tip": "kapanis", "s": ke("çıkacağız", kz("yokuşu")) + 0.05, "son": tl + 0.5, "alt": "ZOR YOL · AĞIR ARAÇ · 7/24"},
        ],
        "broll": lambda kz, ke, tl: [],
    },

    # 1) Tırınız Çamura Saplanırsa — 7497 + 7498 (gaz cümlesinin temiz hali). Mesaj bilerek: "kurtarıcı değil kepçe/ekskavatör"
    "v1": {
        "cekimler": [("IMG_7497", 0.0, 34.3), ("IMG_7498", 8.4, 14.2), ("IMG_7497", 39.7, 64.7)],
        "haric": {"IMG_7497": [(23.64, 24.30)]},   # "çağrılmalısını", "sağlamalısını" yarım denemeleri
        "vurgu": ["çamura", "saplandığı", "yapmamalısınız", "dengesiz", "halat", "kepçe", "ekskavatör", "zeminin", "kontrolünü", "gaza", "zorlamayın", "batarsınız", "lastiğinizi", "zemin", "aramayın", "batarım"],
        "olaylar": lambda kz, ke, tl: [
            {"tip": "kanca", "anlik": True, "s": 0.0, "son": kz("dengesiz") - 0.05, "satir1": "ÇAMURA SAPLANDINIZ", "satir2": "sakın bunları yapmayın"},
            {"tip": "liste", "isaret": "carpi", "baslik": "YAPMAYIN", "s": kz("dengesiz") - 0.05, "son": kz("kurtarıcı") - 0.05, "ogeler": [["Dengesiz halatla çekim", kz("dengesiz")]]},
            {"tip": "liste", "baslik": "BUNU YAPIN", "s": kz("kurtarıcı") - 0.05, "son": kz("bundan") - 0.05, "ogeler": [["Kepçe çağırın", kz("kepçe")], ["veya ekskavatör", kz("ekskavatör")]]},
            {"tip": "uyari", "s": kz("gaza"), "son": kz("aracınız") - 0.05, "metin": "GAZA BASIP ZORLAMAYIN", "boyut": 60},
            {"tip": "liste", "isaret": "sayi", "baslik": "DOĞRU SIRA", "s": kz("önce", kz("yıpratmayın")) - 0.05, "son": kz("abi") - 0.05, "ogeler": [["Zemin kontrolü", kz("zemin", kz("yıpratmayın"))], ["Ne ile çekilecek?", kz("çekebiliriz")], ["Sonra kurtarma", kz("kurtarırız")]]},
            {"tip": "uyari", "renk": "sari", "s": kz("ben", kz("aramayın")), "son": kz("sonra", kz("batarım")) - 0.05, "metin": "BEN DE BATARIM!"},
            {"tip": "kapanis", "s": kz("sonra", kz("batarım")), "son": tl + 0.5},
        ],
        "broll": lambda kz, ke, tl: [
            {"dosya": "IMG_7504_dikey.mp4", "bas": 0.5, "s": kz("havalar"), "son": kz("tırınız") - 0.05},
            {"dosya": "IMG_7501_dikey.mp4", "bas": 0.0, "s": kz("araçtan"), "son": kz("aracınız") - 0.05},
            {"dosya": "IMG_7499_dikey.mp4", "bas": 4.0, "s": kz("çekebiliriz") - 0.4, "son": kz("onun", kz("çekebiliriz")) - 0.05},
        ],
    },
    # 2) İşimiz Hafif Değil — Ağır Ticari Zorlukları: 7508 (yükleme, lastik, makas) + 7509 (kış arızaları; küfürlü son atılır)
    "v2": {
        "cekimler": [("IMG_7508", 2.8, 35.3), ("IMG_7509", 0.3, 19.2)],   # 0–2.8 "Ağır ticarenin zorlukları" dıştan ses: atıldı, başlıkta
        "vurgu": ["ağır", "zorlukları", "dikkatli", "bilinçli", "sağlama", "mukavemetini", "lastiklerimiz", "makasları", "taklavatımız", "kış", "karlı", "kışın", "şanzımanı", "diferansiyeli", "piston", "segman"],
        "olaylar": lambda kz, ke, tl: [
            {"tip": "kanca", "anlik": True, "s": 0.0, "son": kz("lastiklerimiz") - 0.05, "satir1": "İŞİMİZ HAFİF DEĞİL", "satir2": "ağır ticarinin zorlukları"},
            {"tip": "liste", "baslik": "YOLA ÇIKMADAN", "s": kz("bilinçli") - 0.3, "son": kz("zorlu", kz("taklavatımız")) - 0.05, "boyut": 48, "ogeler": [
                ["Bilinçli yükleme", kz("bilinçli")], ["Yük sağlama alınır", kz("sağlama")], ["Lastikler", kz("lastiklerimiz")], ["Makaslar", kz("makasları")], ["Takım taklavat tam", kz("takımımız")]]},
            {"tip": "kanca", "s": kz("zorlu", kz("taklavatımız")), "son": kz("şanzımanı") - 0.35, "top": 900, "satir1": "KIŞ ŞARTLARI", "satir2": "yağmur · kar · buz"},
            {"tip": "liste", "isaret": "carpi", "baslik": "KIŞIN YOLDA KALDIRAN ARIZALAR", "s": kz("şanzımanı") - 0.3, "son": kz("bunlar", kz("gümleyebiliyor")) - 0.05, "ogeler": [
                ["Şanzıman", kz("şanzımanı")], ["Diferansiyel", kz("diferansiyeli")], ["Piston / segman", kz("piston")]]},
            {"tip": "kapanis", "s": kz("bunlar", kz("gümleyebiliyor")), "son": tl + 0.5},
        ],
        "broll": lambda kz, ke, tl: [
            {"dosya": "IMG_7499_dikey.mp4", "bas": 0.5, "s": kz("yükledikten"), "son": kz("lastiklerimiz") - 0.05},
            {"dosya": "IMG_7523_dikey.mp4", "bas": 0.3, "s": kz("lastiklerimiz") - 0.05, "son": kz("zorlu", kz("taklavatımız")) - 0.05},
            {"dosya": "IMG_7504_dikey.mp4", "bas": 0.0, "s": kz("yağışlı"), "son": kz("araçlar") - 0.05},
        ],
    },
    # 5) Sadece Oto Kurtarma Yapmıyoruz — 7511 + forklift görüntüleri (7517, 7526)
    "v5": {
        "cekimler": [("IMG_7511", 4.4, 34.6)],
        "vurgu": ["sadece", "oto", "kurtarma", "nakliye", "şehir", "şehirler", "kamyon", "tır", "lowbed", "forklift", "3", "15", "ağır", "sanayide"],
        "olaylar": lambda kz, ke, tl: [
            {"tip": "kanca", "anlik": True, "s": 0.0, "son": kz("oto", kz("yapmıyoruz")) - 0.05, "satir1": "SADECE KURTARMA DEĞİL", "boyut": 80, "satir2": "neler yapıyoruz?"},
            {"tip": "liste", "baslik": "HİZMETLERİMİZ", "s": kz("şehir") - 0.3, "son": kz("3") - 0.05, "ogeler": [
                ["Şehir içi nakliye", kz("şehir")], ["Şehirler arası nakliye", kz("şehirler")], ["Kamyon · Tır · Lowbed", kz("kamyon")], ["Forklift", kz("forklift")]]},
            {"tip": "stat", "s": kz("3"), "son": kz("ağır") - 0.05, "ust": "FORKLİFT HİZMETİ", "deger": "3 – 15 TON"},
            {"tip": "kapanis", "s": kz("ağır"), "son": tl + 0.5, "alt": "KURTARMA · NAKLİYE · FORKLİFT · MENLİFT"},
        ],
        "broll": lambda kz, ke, tl: [
            {"dosya": "IMG_7518_dikey.mp4", "bas": 0.5, "s": kz("oto", kz("yapmıyoruz")) - 0.05, "son": kz("bunun") - 0.05},
            {"dosya": "IMG_7517_dikey.mp4", "bas": 1.5, "s": kz("forklift") - 0.3, "son": kz("3") - 0.05},
            {"dosya": "IMG_7526_dikey.mp4", "bas": 2.0, "s": kz("3") - 0.05, "son": kz("ağır") - 0.05},
        ],
    },
    # 7) Kamera arkası — takılmalar (küfür bip'li)
    "v7": {
        "haric": {"IMG_7508": [(38.8, 39.93)]},   # "Devam. Başka ne diyecekti?" kameranın arkasından
        "cekimler": [("IMG_7507", 9.0, 13.9), ("IMG_7508", 31.8, 41.0), ("IMG_7512", 7.9, 12.75), ("IMG_7509", 17.6, 23.5, {"ses": "IMG_7509_ses_bip.wav"}), ("IMG_7497", 58.8, 61.6)],
        "vurgu": ["lan", "olmadı", "kapat", "pardon", "***", "çekici", "aramayın", "batarım"],
        "olaylar": lambda kz, ke, tl: [
            {"tip": "kanca", "anlik": True, "s": 0.0, "son": kz("olmadı") - 0.05, "satir1": "KAMERA ARKASI", "satir2": "kurtarmak kolay, çekim zor"},
            {"tip": "uyari", "renk": "sari", "s": kz("kapat"), "son": kz("şuraya") - 0.05, "metin": "TEKRAR!"},
            {"tip": "uyari", "s": kz("***"), "son": kz("çekici") , "metin": "BİİİP", "boyut": 70},
            {"tip": "kapanis", "s": kz("ben", kz("aramayın")), "son": tl + 0.5},
        ],
        "broll": lambda kz, ke, tl: [],
    },
    # 8) 5 tonluk forklifti yüklüyoruz — 7524 (konuşma) + sözsüz forklift görüntüleri doğal sesiyle
    "v8": {
        # İSTİSNA (kullanıcı onayı): 7524 58.9–72.5 kamera arkası sesi ("Berkay'cığımla, Onur'umuz", "Birazdan 5 tonluk…") vlog havası için KULLANILIR.
        "cekimler": [("IMG_7524", 67.2, 72.7), ("IMG_7524", 49.2, 55.0), ("IMG_7524", 58.6, 65.5),
                     ("IMG_7526", 0.0, 10.3, {"dogal": True, "seviye": 0.7}), ("IMG_7517", 0.5, 5.5, {"dogal": True, "seviye": 0.6})],
        "vurgu": ["5", "tonluk", "makinemizi", "Sürat", "Kargo'ya", "tamburumuzun", "arızalandığı", "elimizle", "Berkay'cığımla", "Onur'umuz"],
        "olaylar": lambda kz, ke, tl: [
            {"tip": "kanca", "anlik": True, "s": 0.0, "son": kz("abi") - 0.05, "satir1": "5 TONLUK FORKLİFT", "boyut": 84, "satir2": "Sürat Kargo'ya yola çıkıyoruz"},
            {"tip": "uyari", "renk": "sari", "s": kz("elimizle"), "son": ke("çekiyoruz") + 0.1, "metin": "KUMANDA ARIZALI: ELLE!", "boyut": 64},
            {"tip": "stat", "s": kz("işe"), "son": ke("ediyor") + 0.1, "ust": "BUGÜNKÜ EKİP", "deger": "BERKAY · ONUR"},
            {"tip": "stat", "s": ke("ediyor") + 0.4, "son": ke("ediyor") + 4.5, "ust": "FORKLİFT", "deger": "5 TON"},
            {"tip": "kapanis", "s": tl - 3.0, "son": tl + 0.5, "alt": "FORKLİFT · NAKLİYE · KURTARMA"},
        ],
        "broll": lambda kz, ke, tl: [],
    },

    # 3) Kurtarma Ücretleri Nasıl Belirlenir — 7507 (soru + cevap). "Kurtarıcı... neydi lan?" atılır.
    "v3": {
        "cekimler": [("IMG_7507", 15.1, 38.8)],   # 0–9 sn soru kameranın arkasından: KULLANILMAZ
        "vurgu": ["mazot", "yakıt", "mesafeye", "önemli", "sigortası", "kaskosu", "yıpranma", "lastiği", "kilometre", "tonajı", "fiyat", "sadece"],
        "olaylar": lambda kz, ke, tl: [
            {"tip": "kanca", "anlik": True, "s": 0.0, "son": kz("aracımızın") - 0.05, "satir1": "KURTARMA ÜCRETİ", "satir2": "nasıl belirlenir?"},
            {"tip": "uyari", "renk": "sari", "s": kz("hesaplanırken"), "son": kz("aracımızın") - 0.05, "metin": "SADECE YAKIT DEĞİL"},
            {"tip": "liste", "baslik": "FİYATI BELİRLEYENLER", "s": kz("aracımızın") - 0.05, "son": kz("bunları") - 0.05, "boyut": 46, "ogeler": [
                ["Sigorta", kz("sigortası")], ["Kasko", kz("kaskosu")], ["Yıpranma payı", kz("yıpranma")], ["Lastik", kz("lastiği")],
                ["Kilometre", kz("kilometre")], ["Yükün tonajı", kz("tonajı")]]},
            {"tip": "kapanis", "s": kz("bunları"), "son": tl + 0.5},
        ],
        "broll": lambda kz, ke, tl: [
                        {"dosya": "IMG_7499_dikey.mp4", "bas": 2.0, "s": kz("yıpranma") - 0.05, "son": kz("kilometre") - 0.05},
            {"dosya": "IMG_7504_dikey.mp4", "bas": 0.5, "s": kz("kilometre") - 0.05, "son": kz("üzerine") - 0.05},
            {"dosya": "IMG_7520_dikey.mp4", "bas": 0.5, "s": kz("üzerine") - 0.05, "son": kz("bunları") - 0.05},
        ],
    },
    # 4) Tırınız Yolda Kaldıysa — 7512 kanca ("bu sefer beni arayabilirsiniz") + 7513 adımlar + 7512 "numarayı bırakıyorum"
    "v4": {
        # 7512 tek parça akış: "bu sefer beni arayabilirsiniz" -> hemen "şuraya numarayı bırakıyorum, oradan arayın"; sonra 7513 adımlar
        "cekimler": [("IMG_7512", 1.0, 11.7), ("IMG_7513", 1.3, 24.2)],
        "haric": {"IMG_7513": [(2.88, 4.4)]},   # "beni aramandan önce" tekrarı
        "vurgu": ["tırınız", "kamyonunuz", "otobüsünüz", "yolda", "emniyet", "şeridine", "karayollarına", "beni", "arıyorsunuz", "kısa", "yanınızda", "numarayı"],
        "olaylar": lambda kz, ke, tl: [
            {"tip": "kanca", "anlik": True, "s": 0.0, "son": kz("şuraya") - 0.05, "satir1": "YOLDA MI KALDINIZ?", "satir2": "önce bunları yapın"},
            {"tip": "numara", "s": kz("şuraya") + 0.15, "son": kz("bu", kz("arayın.")) - 0.05, "top": 470, "left": 380},   # parmağıyla gösterdiği yere
            {"tip": "liste", "isaret": "sayi", "baslik": "ARAMADAN ÖNCE", "s": kz("emniyet") - 0.05, "son": kz("trafik") - 0.05, "ogeler": [
                ["Emniyet şeridine geçin", kz("emniyet")], ["Karayollarına haber verin", kz("karayollarına")], ["Sonra bizi arayın", kz("arıyorsunuz")]]},
            {"tip": "stat", "s": kz("en", kz("aldıktan")), "son": kz("sizin", kz("sürede")) - 0.05, "ust": "ANKARA · 7/24", "deger": "EN KISA SÜREDE"},
            {"tip": "kapanis", "s": kz("sizin", kz("sürede")), "son": tl + 0.5},
        ],
        "broll": lambda kz, ke, tl: [
            {"dosya": "IMG_7504_dikey.mp4", "bas": 0.0, "s": kz("trafik") - 0.05, "son": kz("aldıktan")},
            {"dosya": "IMG_7503_dikey.mp4", "bas": 0.3, "s": kz("aldıktan"), "son": tl},
        ],
    },
    # 6) Güneşimizden Sonra Uzun Yolu Bıraktık — 7524
    "v6": {
        "cekimler": [("IMG_7524", 2.7, 21.3), ("IMG_7524", 37.0, 46.3)],
        "son_kuyruk": 0.6,   # "hem forklift" sonrası nefes payı (kullanıcı: söz yarım kalıyor)
        "vurgu": ["yıllarca", "tırcılık", "şehirler", "güneş'imiz", "doğunca", "bıraktık", "sebebi", "tekrardan", "tır", "kamyon", "forklift"],
        "olaylar": lambda kz, ke, tl: [
            {"tip": "kanca", "anlik": True, "s": 0.0, "son": kz("tabi,") - 0.05, "satir1": "UZUN YOLU", "satir2": "neden bıraktık?"},
            {"tip": "stat", "s": kz("güneş") - 0.05, "son": kz("tek") - 0.05, "ust": "İKİ OĞLANDAN SONRA", "deger": "GÜNEŞ'İMİZ ☀"},
            {"tip": "liste", "baslik": "ŞİMDİ ŞEHİR İÇİ", "s": kz("hem") - 0.05, "son": ke("forklift") + 0.05, "ogeler": [
                ["Tır", kz("tır")], ["Kamyon", kz("kamyon")], ["Ufak araç", kz("ufak")], ["Forklift", kz("forklift")]]},
            {"tip": "kapanis", "s": ke("forklift") + 0.05, "son": tl + 0.5},
        ],
        "broll": lambda kz, ke, tl: [
            {"dosya": "IMG_7503_dikey.mp4", "bas": 0.3, "s": kz("şehir") - 0.05, "son": kz("tabi,") - 0.05},
            {"dosya": "IMG_7518_dikey.mp4", "bas": 0.5, "s": kz("tekrardan") - 0.05, "son": kz("hem") - 0.05},
        ],
    },
}

if __name__ == "__main__":
    for v in sys.argv[1:]: yap(v)
