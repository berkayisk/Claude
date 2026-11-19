"""Reels planı -> src/reels.json
Parçalar (çekim, başlangıç, bitiş) + sessizlik kesimi + kelime altyazısı + kelimeye bağlı grafik olayları"""
import json, wave, numpy as np

FPS = 30
KEL = json.load(open("calisma/kelimeler.json"))
# 6183'teki doğru çekim (5. deneme) için ayrı çözümleme
KEL["IMG_6183_son"] = [{"w": w, "s": s, "e": e} for w, s, e in [
    ("Cebinde", 18.95, 19.36), ("500", 19.36, 19.62), ("bin", 19.62, 19.88), ("1", 19.88, 20.02), ("milyon", 20.02, 20.30),
    ("sermayen", 20.30, 20.78), ("yoksa", 20.78, 21.14), ("geleneksel", 21.14, 21.82), ("modelle", 21.82, 22.12),
    ("de", 22.12, 22.24), ("işin", 22.24, 22.50), ("yok.", 22.50, 22.70)]]
# "E" + "-ticaret" gibi bölünmüş kelimeleri birleştir
for k, ws in KEL.items():
    m = []
    for w in ws:
        if m and w["w"].startswith("-"): m[-1] = {"w": m[-1]["w"] + w["w"], "s": m[-1]["s"], "e": w["e"]}
        else: m.append(dict(w))
    KEL[k] = m
SESLER = {}
def ses(n):
    if n not in SESLER:
        w = wave.open(f"calisma/ses_temiz/{n}_16k.wav"); SESLER[n] = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return SESLER[n]
def db(n, t, win=0.02):
    a = ses(n)[max(0, int(t * 16000)): int((t + win) * 16000)]
    return 20 * np.log10(float(np.sqrt((a ** 2).mean())) + 1e-9) if len(a) else -99
def sessiz_nokta(n, a, b):
    ts = np.arange(max(0, a), b, 0.01); return float(ts[int(np.argmin([db(n, t) for t in ts]))])

SESSIZ_DB, MIN_SESSIZ, PAY, MIN_PARCA = -36, 0.14, 0.04, 0.25
DUZELT = {"Yoruna": "Yoruma", "2": "iki", "1.": "Bir,", "İki,": "İki,", "dropshippingde": "dropshipping'de", "Geneliksel": "geleneksel"}

def kelime_duzelt(n, w):
    """uzun kelimede içteki sessizlikten sonrasını başlangıç say"""
    s, e = w["s"], w["e"]
    if e - s >= 0.5:
        ts = np.arange(s, e, 0.01); son = None; i = 0
        while i < len(ts):
            if db(n, ts[i]) < SESSIZ_DB:
                j = i
                while j < len(ts) and db(n, ts[j]) < SESSIZ_DB: j += 1
                if (j - i) * 0.01 >= 0.2: son = ts[j - 1] + 0.01
                i = j
            else: i += 1
        if son and son < e - 0.08: s = float(son)
    return {"w": DUZELT.get(w["w"], w["w"]), "s": s, "e": e}

# (anahtar, kaynak dosya, kelime listesi anahtarı, başlangıç, bitiş)
BIRIMLER = [
    ("kanca1", "IMG_6181", "IMG_6181", 2.9, 5.35),
    ("kanca2", "IMG_6181", "IMG_6181", 9.50, 11.85),  # 9.45'e kadar 2. deneme var: sınır kesin
    ("m1a", "IMG_6183", "IMG_6183", 0.9, 8.55),
    ("m1b", "IMG_6183", "IMG_6183_son", 18.8, 22.95),
    ("m2a", "IMG_6187", "IMG_6187", 0.0, 7.2),
    ("m2b", "IMG_6187", "IMG_6187", 16.5, 22.95),
    ("m3a", "IMG_6188", "IMG_6188", 1.60, 5.72),  # 0.9'daki "Evet." çekim öncesi
    ("m3b", "IMG_6188", "IMG_6188", 10.4, 12.6),
    ("m3c", "IMG_6188", "IMG_6188", 19.5, 21.6),
    ("m3d", "IMG_6188", "IMG_6188", 30.4, 33.8),
    ("sonuc", "IMG_6189", "IMG_6189", 0.0, 4.62),  # 4.96 sonrası nefes
    ("cagri", "IMG_6190", "IMG_6190", 0.10, 6.3),
]

from faster_whisper.vad import get_speech_timestamps, VadOptions
VAD = {}
def konusma_bolgeleri(n):
    if n not in VAD:
        x = ses(n)
        ts = get_speech_timestamps(x, VadOptions(threshold=0.45, min_silence_duration_ms=250, speech_pad_ms=0, min_speech_duration_ms=120))
        VAD[n] = [(t["start"] / 16000, t["end"] / 16000) for t in ts]
    return VAD[n]

ON_PAY, ARKA_PAY, MIN_BOSLUK = 0.10, 0.16, 0.35
def alt_araliklar(n, a, b, ks):
    """Silero VAD bölgeleri; sadece >=0.35 sn boşlukları kes, kelimelerin önüne 0.10 arkasına 0.16 sn pay bırak"""
    bolg = [(max(s_, a - 0.05), min(e_, b + 0.05)) for s_, e_ in konusma_bolgeleri(n) if e_ > a + 0.05 and s_ < b - 0.05]
    # kelimeler de konuşma sayılır (VAD kaçırırsa)
    for w in ks: bolg.append((w["s"], w["e"]))
    bolg.sort(); m = []
    for x, y in bolg:
        if m and x - m[-1][1] < MIN_BOSLUK: m[-1] = (m[-1][0], max(m[-1][1], y))
        else: m.append((x, y))
    out = []
    for x, y in m:
        x2 = max(a, x - ON_PAY)              # güvenli alt sınırı asla aşma (önceki deneme / çekim öncesi ses)
        y2 = min(b + 0.30, y + ARKA_PAY)
        while y2 < b + 0.30 and db(n, y2, 0.03) > -34: y2 += 0.01   # ses sönene kadar uzat (nefesi katma)
        if out and x2 <= out[-1][1]: out[-1] = (out[-1][0], y2)
        else: out.append((x2, y2))
    # içinde kelime olmayan parçaları at (nefes, "ıı", "evet" gibi)
    out = [(x, y) for x, y in out if y - x >= MIN_PARCA and any(x <= (w["s"] + w["e"]) / 2 < y for w in ks)]
    return out

parcalar, altyazi, birim_zaman, tl, zs = [], [], {}, 0.0, 0
for (anahtar, n, kk, a, b) in BIRIMLER:
    a2, b2 = a, b
    ks = [kelime_duzelt(n, w) for w in KEL[kk] if a2 <= (w["s"] + w["e"]) / 2 < b2]
    if anahtar == "m3c":  # "Ürüne" kelimesi uzun ölçülmüş
        ks = [kelime_duzelt(n, w) for w in ks]
    araliklar = alt_araliklar(n, a2, b2, ks)
    birim_bas = tl
    for j, (x, y) in enumerate(araliklar):
        fa, fb = round(x * FPS), round(y * FPS)
        if fb - fa < 6: continue
        bas, son = fa / FPS, fb / FPS
        onceki_son = araliklar[j - 1][1] if j else -1
        for w in ks:
            orta = (w["s"] + w["e"]) / 2
            if bas <= orta < son or (onceki_son <= orta < bas and w["e"] > bas):
                s2 = max(bas, w["s"]) - bas + tl; e2 = min(son, w["e"]) - bas + tl
                altyazi.append({"w": w["w"], "s": round(s2, 3), "e": round(max(e2, s2 + 0.1), 3), "birim": anahtar})
        parcalar.append({"src": f"{n}_dikey.mp4", "ses": f"{n}_ses.wav", "bas": bas, "kare": fb - fa, "zoom": zs % 2 == 1})
        tl += (fb - fa) / FPS; zs += 1
    birim_zaman[anahtar] = (round(birim_bas, 3), round(tl, 3))
    zs = 0  # yeni çekim: zoomsuz başla

def kz(birim, parca, sonra=0.0):
    """birimdeki kelimenin (parça eşleşmesi) başlangıç zamanı"""
    for w in altyazi:
        if w["birim"] == birim and parca.lower() in w["w"].lower() and w["s"] >= birim_zaman[birim][0] + sonra:
            return w["s"]
    raise SystemExit(f"bulunamadı: {birim} {parca}")
B = lambda k: birim_zaman[k][0]
E = lambda k: birim_zaman[k][1]

olaylar = [
    {"tip": "yorumlar", "s": 0.0, "son": E("kanca1") + 0.2, "carpi": kz("kanca1", "hiçbir"),
     "yorumlar": [["ayse.kaya", "e-ticaret"], ["mert_34", "e-ticaret 🙏"], ["zeynep.shop", "e-ticaret"], ["can.ozdemir", "E-TİCARET"]]},
    {"tip": "baslik", "s": B("kanca2"), "son": E("kanca2") + 0.3, "satir1": "E-TİCARETE NASIL BAŞLANIR?", "satir2": "babalar gibi anlatıyorum"},
    {"tip": "takipci", "s": B("m1a"), "son": E("m3d"), "gecisler": [B("m1a"), B("m2a"), B("m3a")], "adlar": ["GELENEKSEL", "STOKSUZ", "YENİ NESİL"]},
    {"tip": "broll_stok", "s": kz("m1a", "gideyim"), "son": kz("m1a", "150") - 0.05, "ust": "STOĞA YATAN PARA"},
    {"tip": "stat", "s": kz("m1a", "150"), "son": E("m1a") - 0.1, "ust": "MALİYET", "deger": "₺150-200 BİN", "renk": "kirmizi", "ses": "para"},
    {"tip": "stat", "s": kz("m1b", "500"), "son": E("m1b"), "ust": "GEREKEN SERMAYE", "deger": "₺500 BİN – 1 MİLYON", "renk": "kirmizi", "ses": "boom"},
    {"tip": "broll_dropship", "s": kz("m2a", "klasik"), "son": kz("m2a", "tedarik") - 0.05, "baslik": "DROPSHIPPING", "etiketler": ["Tedarikçi", "→", "Müşteri"]},
    {"tip": "zincir", "s": kz("m2a", "tedarik"), "son": E("m2a"), "ogeler": [["🏭", "Tedarikçi", kz("m2a", "tedarik")], ["🚚", "Kargo", kz("m2a", "kargo")], ["🧾", "Sipariş", kz("m2a", "sipariş")]], "alt": "AYRI AYRI YÖNETİM"},
    {"tip": "akis", "s": kz("m2b", "ödemeyi"), "son": kz("m2b", "burada"), "sol": "Sen ödersin", "sag": "Müşteri öder", "ust": "ÖNCE", "ust2": "SONRA"},
    {"tip": "stat", "s": kz("m2b", "500"), "son": E("m2b"), "ust": "GEREKEN SERMAYE", "deger": "₺500 BİN", "renk": "kirmizi", "ses": "boom"},
    {"tip": "liste", "s": kz("m3a", "şirket"), "son": E("m3a"), "ogeler": [["Şirket gerekmez", kz("m3a", "şirket")], ["Stok gerekmez", kz("m3a", "stok")]]},
    {"tip": "liste", "s": B("m3c"), "son": E("m3c") + 0.2, "ogeler": [["Şirket gerekmez", 0], ["Stok gerekmez", 0], ["Önceden para yok", kz("m3c", "önceden")]]},
    {"tip": "panel", "s": kz("m3b", "tek"), "son": E("m3b")},
    {"tip": "adimlar", "s": kz("m3d", "markanı"), "son": E("m3d"), "baslik": "KENDİ MARKAN"},
    {"tip": "baslik", "s": B("sonuc"), "son": E("sonuc"), "satir1": "HEPSİ HERKESE UYMAZ", "satir2": "senin için hangisi?"},
    {"tip": "sonraki", "s": B("cagri"), "son": kz("cagri", "e-ticarete") + 0.1, "baslik": "SONRAKİ VİDEO", "konu": "Doğru Ürün Seçimi"},
    {"tip": "takipet", "s": kz("cagri", "takip") - 0.6, "son": E("cagri"), "tik": kz("cagri", "takip") + 0.25},
]
vurgu = ["e-ticaret", "hiçbir", "göndermiyorum", "babalar", "geleneksel", "150", "-200", "500", "milyon", "sermayen", "sermayeye", "stoksuz",
         "dropshipping'de", "ayrı", "almadan", "yeni", "nesil", "şirketmiş", "stokmuş", "tek", "panelden", "önceden", "markanı", "uymaz", "doğru", "ürün", "takip"]
json.dump({"fps": FPS, "parcalar": parcalar, "altyazi": altyazi, "olaylar": olaylar, "vurgu": vurgu, "toplamKare": sum(p["kare"] for p in parcalar)},
          open("src/reels.json", "w"), ensure_ascii=False, indent=1)
print(f"toplam {tl:.1f} sn, {len(parcalar)} parça, {len(altyazi)} kelime")
for k, (a, b) in birim_zaman.items(): print(f"  {k}: {a:.2f}-{b:.2f}")
print(" ".join(w["w"] for w in altyazi))
